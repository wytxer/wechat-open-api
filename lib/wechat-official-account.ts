import axios, { AxiosRequestConfig } from 'axios'

import { IWechatConfig } from './wechat.interface'
import { IAccessTokenResponse, IQrCodeParams } from './wechat-official-account.interface'

export class WechatOfficialAccount {
  constructor(readonly config: IWechatConfig, private readonly apiUrl: string = 'https://api.weixin.qq.com') {
    if (!config.appid) {
      throw new Error('appid 参数不能为空')
    }
    if (!config.secret) {
      throw new Error('secret 参数不能为空')
    }
    this.config = config
  }

  async request(config: AxiosRequestConfig) {
    config.url = this.apiUrl + config.url
    return await axios(config).then((res) => res.data)
  }

  /**
   * 获取微信公众号调用凭据
   * @link https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_access_token.html
   * @returns
   */
  async accessToken(): Promise<IAccessTokenResponse> {
    const { appid, secret } = this.config

    return await this.request({
      method: 'get',
      url: `/cgi-bin/token?appid=?appid=${appid}&secret=${secret}&grant_type=client_credential`
    })
  }

  /**
   * 生成带参数的临时二维码
   * @link https://developers.weixin.qq.com/doc/offiaccount/Account_Management/Generating_a_Parametric_QR_Code.html
   * @returns
   */
  async qrCode(params: IQrCodeParams): Promise<IAccessTokenResponse> {
    const { access_token, expire_seconds, action_name, action_info } = params

    return await this.request({
      method: 'get',
      url: `/cgi-bin/qrcode/create?access_token=${access_token}`,
      data: {
        expire_seconds,
        action_name,
        action_info
      }
    })
  }

  /**
   * 获取用户基本信息
   * @link https://developers.weixin.qq.com/doc/offiaccount/User_Management/Get_users_basic_information_UnionID.html#UinonId
   * @returns
   */
  async queryUserInfo(accessToken: string, openId: string): Promise<IAccessTokenResponse> {
    return await this.request({
      url: `/cgi-bin/user/info?access_token=${accessToken}&openid=${openId}&lang=zh_CN`
    })
  }
}
