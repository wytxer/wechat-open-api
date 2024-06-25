import axios, { AxiosRequestConfig } from 'axios'
import { IWecomConfig } from './wechat.interface'
import { IAccessTokenResponse } from './wecom-app.interface'

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
}
