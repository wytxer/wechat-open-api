import axios, { AxiosRequestConfig } from 'axios'

import { IWechatConfig, IStateResponse } from './wechat.interface'
import {
  IAccessTokenResponse,
  IQrcodeResponse,
  IQueryUserInfoResponse,
  ITagsResponse,
  IQrcodeParams,
  IRemarkParams,
  IUsersAddTagParams,
  ICreateMenusParams
} from './wechat-official-account.interface'

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

  static qrcodeAddress = 'https://mp.weixin.qq.com/cgi-bin/showqrcode'

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
      url: `/cgi-bin/token?appid=${appid}&secret=${secret}&grant_type=client_credential`
    })
  }

  /**
   * 获取微信公众号调用凭据稳定版
   * @link https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/getStableAccessToken.html
   * @returns
   */
  async stableAccessToken(): Promise<IAccessTokenResponse> {
    const { appid, secret } = this.config

    return await this.request({
      method: 'post',
      url: '/cgi-bin/stable_token',
      data: {
        grant_type: 'client_credential',
        appid,
        secret
      }
    })
  }

  /**
   * 生成带参数的临时二维码
   * @link https://developers.weixin.qq.com/doc/offiaccount/Account_Management/Generating_a_Parametric_QR_Code.html
   * @returns
   */
  async qrcode(params: IQrcodeParams): Promise<IQrcodeResponse> {
    const { access_token, expire_seconds, action_name, action_info } = params

    return await this.request({
      method: 'post',
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
  async queryUserInfo(accessToken: string, openId: string): Promise<IQueryUserInfoResponse> {
    return await this.request({
      url: `/cgi-bin/user/info?access_token=${accessToken}&openid=${openId}&lang=zh_CN`
    })
  }

  /**
   * 设置用户备注名
   * @link https://developers.weixin.qq.com/doc/offiaccount/User_Management/Configuring_user_notes.html
   * @returns
   */
  async remark(params: IRemarkParams): Promise<IStateResponse> {
    return await this.request({
      method: 'post',
      url: `/cgi-bin/user/info/updateremark?access_token=${params.access_token}`,
      data: {
        openid: params.openid,
        remark: params.remark
      }
    })
  }

  /**
   * 获取公众号已创建的标签
   * @link https://developers.weixin.qq.com/doc/offiaccount/User_Management/User_Tag_Management.html
   * @returns
   */
  async tags(accessToken: string): Promise<ITagsResponse> {
    return await this.request({
      method: 'get',
      url: `/cgi-bin/tags/get?access_token=${accessToken}`
    })
  }

  /**
   * 批量为用户打标签
   * @link https://developers.weixin.qq.com/doc/offiaccount/User_Management/User_Tag_Management.html
   * @returns
   */
  async usersAddTag(params: IUsersAddTagParams): Promise<IStateResponse> {
    return await this.request({
      method: 'post',
      url: `/cgi-bin/tags/members/batchtagging?access_token=${params.access_token}`,
      data: {
        tagid: params.tagid,
        openid_list: params.openid_list
      }
    })
  }

  /**
   * 创建自定义菜单
   * @link https://developers.weixin.qq.com/doc/offiaccount/Custom_Menus/Creating_Custom-Defined_Menu.html
   * @returns
   */
  async createMenus(params: ICreateMenusParams): Promise<IStateResponse> {
    return await this.request({
      method: 'post',
      url: `/cgi-bin/menu/create?access_token=${params.access_token}`,
      data: { button: params.button }
    })
  }

  /**
   * 获取自定义菜单配置
   * @link https://developers.weixin.qq.com/doc/offiaccount/Custom_Menus/Getting_Custom_Menu_Configurations.html
   * @returns
   */
  async getMenus(accessToken: string): Promise<any> {
    return await this.request({
      method: 'get',
      url: `/cgi-bin/menu/get?access_token=${accessToken}`
    })
  }
}
