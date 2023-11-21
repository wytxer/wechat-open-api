import axios, { AxiosRequestConfig } from 'axios'

import { IStateResponse, IWechatConfig } from './wechat.interface'
import {
  ICode2SessionResponse,
  IAccessTokenResponse,
  IGetPhoneNumberResponse,
  ICheckTextResponse,
  ICheckImageAndMediaResponse,
  ISendParams,
  ICheckTextOptions,
  ICheckImageAndMediaOptions
} from './wechat-app.interface'

export class WechatApp {
  constructor(readonly config: IWechatConfig, readonly apiUrl: string = 'https://api.weixin.qq.com') {
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
   * 微信登录凭证校验，授权获取 openId 和 unionId
   * @param code
   * @link https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
   * @returns
   */
  async code2Session(code: string): Promise<ICode2SessionResponse> {
    const { appid, secret } = this.config

    return await this.request({
      method: 'post',
      url: `/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`
    })
  }

  /**
   * 获取小程序调用凭据
   * @link https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/access-token/auth.getAccessToken.html
   * @returns
   */
  async accessToken(): Promise<IAccessTokenResponse> {
    const { appid, secret } = this.config

    return await this.request({
      method: 'get',
      url: `/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`
    })
  }

  /**
   * 获取小程序授权手机号
   * @link https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/phonenumber/phonenumber.getPhoneNumber.html
   * @returns
   */
  async getPhoneNumber(accessToken: string, code: string): Promise<IGetPhoneNumberResponse> {
    return await this.request({
      method: 'post',
      url: `/wxa/business/getuserphonenumber?access_token=${accessToken}`,
      data: { code }
    })
  }

  /**
   * 发送一次性订阅消息
   * @param params
   * @link https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/subscribe-message/subscribeMessage.send.html
   * @returns
   */
  async send(params: ISendParams): Promise<IStateResponse> {
    const { access_token, touser, template_id, page, data, miniprogram_state, lang } = params

    return await this.request({
      method: 'post',
      url: `/cgi-bin/message/subscribe/send?access_token=${access_token}`,
      data: {
        touser,
        template_id,
        page,
        data,
        miniprogram_state,
        lang
      }
    })
  }

  /**
   * 文本安全检测
   * @param options
   * @link https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/sec-center/sec-check/msgSecCheck.html
   * @returns
   */
  async checkText(options: ICheckTextOptions): Promise<ICheckTextResponse> {
    const { access_token, content, version = 2, scene, openid, title, nickname, signature } = options
    return await this.request({
      method: 'post',
      url: `/wxa/msg_sec_check?access_token=${access_token}`,
      data: { content, version, scene, openid, title, nickname, signature }
    })
  }

  /**
   * 图片和音视频安全检测
   * @param options
   * @link https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/sec-center/sec-check/mediaCheckAsync.html
   * @link https://developers.weixin.qq.com/miniprogram/dev/framework/server-ability/message-push.html
   * @returns
   */
  async checkImageAndMedia(options: ICheckImageAndMediaOptions): Promise<ICheckImageAndMediaResponse> {
    const { access_token, media_url, media_type, version = 2, scene, openid } = options
    return await this.request({
      method: 'post',
      url: `/wxa/media_check_async?access_token=${access_token}`,
      data: { media_url, media_type, version, scene, openid }
    })
  }
}
