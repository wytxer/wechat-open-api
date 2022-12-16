import { createSign, X509Certificate, createVerify, createDecipheriv } from 'crypto'
import axios, { AxiosRequestConfig } from 'axios'

import { IWechatPayConfig } from './wechat.interface'
import {
  ISignVerifyOptions,
  ISignPrepayOptions,
  IGetCertificateData,
  ITransactionJsApiOptions,
  ITransactionJsApiData,
  IRefundsRequiredOutTradeNoOptions,
  IRefundsRequiredTransactionId
} from './wechat-pay.interface'

export class WechatPay {
  constructor(config: IWechatPayConfig) {
    const keys = ['appid', 'mchid', 'publicKey', 'privateKey', 'secret']
    keys.forEach((key) => {
      if (!config[key]) {
        throw new Error(`${key} 参数不能为空`)
      }
      this[key] = config[key]
    })
    this.serialNumber = new X509Certificate(this.publicKey).serialNumber
  }

  // 域名配置
  readonly apiUrl: string = 'https://api.mch.weixin.qq.com'
  // 商户号绑定的应用 id
  private appid: string
  // 商户号
  private mchid: string
  // 商户公钥
  private publicKey: string
  // 商户私钥
  private privateKey: string
  // 平台 v3 密钥
  private secret: string
  // 认证类型，微信支付提供的固定值 WECHATPAY2-SHA256-RSA2048
  private readonly authType = 'WECHATPAY2-SHA256-RSA2048'
  // 证书序列号
  private serialNumber: string
  // 微信支付平台证书列表
  private certificates: IGetCertificateData[] = []
  // 证书和序列号键值对
  private certificateMap: Record<string, any> = {}

  async request(config: AxiosRequestConfig) {
    config.headers = config.headers || {}
    // 设置授权请求头
    config.headers.Authorization = this.getAuthorizationHeader(config)
    // 拼接完整的请求地址
    config.url = this.apiUrl + config.url
    return await axios(config).then((res) => res.data)
  }

  /**
   * 构造签名请求头
   * @param config
   * @link https://pay.weixin.qq.com/wiki/doc/apiv3/wechatpay/wechatpay4_0.shtml
   * @returns
   */
  private getAuthorizationHeader(config: AxiosRequestConfig): string {
    const nonceString = Math.random().toString(36).substring(2, 15)
    const timestamp = (Date.now() / 1000).toFixed(0)
    // 构造签名
    const method = config.method.toUpperCase()
    const signInfo = [method, config.url, timestamp, nonceString]
    if (method === 'GET') {
      signInfo.push('', '')
    } else if (config.data && Object.prototype.toString.call(config.data) === '[object Object]') {
      signInfo.push(JSON.stringify(config.data), '')
    }
    const signature = createSign('RSA-SHA256').update(signInfo.join('\n')).sign(this.privateKey, 'base64')
    // 构造请求头
    return `${this.authType} mchid="${this.mchid}",nonce_str="${nonceString}",timestamp="${timestamp}",serial_no="${this.serialNumber}",signature="${signature}"`
  }

  /**
   * 应答签名验证
   * @param config
   * @link https://pay.weixin.qq.com/wiki/doc/apiv3/wechatpay/wechatpay4_1.shtml
   * @returns
   */
  async signVerify(options: ISignVerifyOptions): Promise<boolean> {
    const { timestamp, nonce, serial, body, signature } = options
    const verify = createVerify('RSA-SHA256')
    verify.update([timestamp, nonce, JSON.stringify(body), ''].join('\n'))

    await this.getCertificates()
    if (!this.certificateMap[serial]) throw new Error('证书不存在')

    return verify.verify(this.certificateMap[serial], signature, 'base64')
  }

  /**
   * 预付款参数签名
   * @param prepayId
   */
  signPrepayOptions(prepayId: string): ISignPrepayOptions {
    // 时间戳
    const timeStamp = (Date.now() / 1000).toFixed(0)
    // 签名的随机字符串
    const nonceString = Math.random().toString(36).substring(2, 15)
    // 下单接口返回的预付款 id
    const packageString = `prepay_id=${prepayId}`
    // 签名类型，v3 固定值 RSA
    const signType = 'RSA'
    // 生成签名
    const paySign = createSign('RSA-SHA256')
      .update([this.appid, timeStamp, nonceString, packageString, ''].join('\n'))
      .sign(this.privateKey, 'base64')

    return {
      timeStamp,
      nonceStr: nonceString,
      package: packageString,
      signType,
      paySign
    }
  }

  /**
   * 获取平台证书列表
   * @link https://pay.weixin.qq.com/wiki/doc/apiv3/apis/wechatpay5_1.shtml
   * @returns
   */
  private async getCertificates(): Promise<void> {
    const res = await this.request({
      method: 'get',
      url: '/v3/certificates'
    })
    const data: IGetCertificateData[] = res.data
    data.forEach((item) => {
      const { ciphertext, associated_data, nonce } = item.encrypt_certificate
      // 解密平台证书
      // @link https://pay.weixin.qq.com/wiki/doc/apiv3/wechatpay/wechatpay4_2.shtml
      const cipherText = Buffer.from(ciphertext, 'base64')
      const authTag: any = cipherText.subarray(cipherText.length - 16)
      const data = cipherText.subarray(0, cipherText.length - 16)
      const decipher = createDecipheriv('aes-256-gcm', this.secret, nonce)
      decipher.setAuthTag(authTag)
      decipher.setAAD(Buffer.from(associated_data))
      const decoded = decipher.update(data, undefined, 'utf8')
      decipher.final()
      this.certificateMap[item.serial_no] = new X509Certificate(Buffer.from(decoded)).publicKey
    })
    this.certificates = data
  }

  /**
   * 下单
   * @description 支持 JSAPI 下单
   * @param code
   * @link https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_1.shtml
   * @returns
   */
  async transactionJsApi(options: ITransactionJsApiOptions): Promise<ITransactionJsApiData> {
    return await this.request({
      method: 'post',
      url: '/v3/pay/transactions/jsapi',
      data: { appid: this.appid, mchid: this.mchid, ...options }
    })
  }

  /**
   * 申请退款
   * @link https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_2_9.shtml
   */
  public async refunds(
    options: IRefundsRequiredOutTradeNoOptions | IRefundsRequiredTransactionId
  ): Promise<Record<string, any>> {
    return await this.request({
      method: 'post',
      url: '/v3/refund/domestic/refunds',
      data: { appid: this.appid, mchid: this.mchid, ...options }
    })
  }
}
