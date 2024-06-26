import axios, { AxiosRequestConfig } from 'axios'
import { IWecomConfig } from './wechat.interface'
import {
  IAccessTokenResponse,
  IAuthorizeUrlParams,
  IGetMemberResponse,
  IGetUserDetailResponse,
  IGetUserInfoResponse
} from './wecom-app.interface'

export class WecomApp {
  constructor(readonly config: IWecomConfig, readonly apiUrl: string = 'https://qyapi.weixin.qq.com') {
    if (!config.corpid) {
      throw new Error('corpid 参数不能为空')
    }

    if (!config.secret) {
      throw new Error('corpsecret 参数不能为空')
    }

    this.config = config
  }

  async request(config: AxiosRequestConfig) {
    config.url = this.apiUrl + config.url
    return await axios(config).then((res) => res.data)
  }

  /**
   * 获取 access_token
   * @link https://developer.work.weixin.qq.com/document/path/91039
   * @returns
   */
  async accessToken(): Promise<IAccessTokenResponse> {
    const { corpid, secret } = this.config

    return await this.request({
      method: 'get',
      url: `/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${secret}`
    })
  }

  /**
   * 构造网页授权链接
   * @link https://developer.work.weixin.qq.com/document/path/91022
   * @returns
   */
  async authorizeUrl({ redirectUri, loginType, state = 'STATE' }: IAuthorizeUrlParams): Promise<string> {
    const params = new URLSearchParams()
    params.append('appid', this.config.corpid)
    params.append('login_type', loginType)
    params.append('redirect_uri', encodeURIComponent(redirectUri))
    params.append('agentid', this.config.agentid)
    params.append('state', state)

    return `https://login.work.weixin.qq.com/wwlogin/sso/login?${params.toString()}`
  }

  /**
   * 获取访问用户身份
   * @link https://developer.work.weixin.qq.com/document/path/91023
   * @returns
   */
  async getUserInfo(accessToken: string, code: string): Promise<IGetUserInfoResponse> {
    return await this.request({
      method: 'get',
      url: `/cgi-bin/auth/getuserinfo?access_token=${accessToken}&code=${code}`
    })
  }

  /**
   * 获取访问用户敏感信息
   * @link https://developer.work.weixin.qq.com/document/path/90196
   * @returns
   */
  async getUserDetail(accessToken: string, userTicket: string): Promise<IGetUserDetailResponse> {
    return await this.request({
      method: 'post',
      url: `/cgi-bin/auth/getuserdetail?access_token=${accessToken}`,
      data: {
        user_ticket: userTicket
      }
    })
  }

  /**
   * 读取成员
   * @link https://developer.work.weixin.qq.com/document/path/90196
   * @returns
   */
  async getMember(accessToken: string, userId: string): Promise<IGetMemberResponse> {
    return await this.request({
      method: 'get',
      url: `/cgi-bin/user/get?access_token=${accessToken}&userid=${userId}`
    })
  }
}
