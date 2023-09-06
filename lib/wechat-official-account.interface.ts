import { IStateResponse } from './wechat.interface'

export interface IAccessTokenResponse extends IStateResponse {
  access_token: string
  expires_in: number
}

export interface IQrCodeResponse {
  ticket: string
  expire_seconds: number
  url: string
}

export interface IQueryUserInfoResponse {
  // 用户是否订阅该公众号标识，值为 0 时，代表此用户没有关注该公众号，拉取不到其余信息
  subscribe: number
  // 用户的标识，对当前公众号唯一
  openid: string
  // 用户的语言，简体中文为 zh_CN
  language: string
  // 用户关注时间，为时间戳。如果用户曾多次关注，则取最后关注时间
  subscribe_time: number
  // 只有在用户将公众号绑定到微信开放平台账号后，才会出现该字段
  unionid: string
  // 公众号运营者对粉丝的备注，公众号运营者可在微信公众平台用户管理界面对粉丝添加备注
  remark: string
  // 用户所在的分组 ID
  groupid: string
  // 用户被打上的标签 ID 列表
  tagid_list: string[]
  /**
   * 返回用户关注的渠道来源
   * ADD_SCENE_SEARCH：公众号搜索
   * ADD_SCENE_ACCOUNT_MIGRATION：公众号迁移
   * ADD_SCENE_PROFILE_CARD：名片分享
   * ADD_SCENE_QR_CODE：扫描二维码
   * ADD_SCENE_PROFILE_LINK：图文页内名称点击
   * ADD_SCENE_PROFILE_ITEM：图文页右上角菜单
   * ADD_SCENE_PAID：支付后关注
   * ADD_SCENE_WECHAT_ADVERTISEMENT：微信广告
   * ADD_SCENE_REPRINT：他人转载
   * ADD_SCENE_LIVESTREAM：视频号直播
   * ADD_SCENE_CHANNELS：视频号
   * ADD_SCENE_OTHERS：其他
   */
  subscribe_scene:
    | 'ADD_SCENE_SEARCH'
    | 'ADD_SCENE_ACCOUNT_MIGRATION'
    | 'ADD_SCENE_PROFILE_CARD'
    | 'ADD_SCENE_QR_CODE'
    | 'ADD_SCENE_PROFILE_LINK'
    | 'ADD_SCENE_PROFILE_ITEM'
    | 'ADD_SCENE_PAID'
    | 'ADD_SCENE_WECHAT_ADVERTISEMENT'
    | 'ADD_SCENE_REPRINT'
    | 'ADD_SCENE_LIVESTREAM'
    | 'ADD_SCENE_CHANNELS'
    | 'ADD_SCENE_OTHERS'
  // 二维码扫码场景（开发者自定义）
  qr_scene: string
  // 二维码扫码场景描述（开发者自定义）
  qr_scene_str: string
}

export interface ITagsResponse extends IStateResponse {
  // 标签列表
  tags: {
    id: number
    name: string
    count: number
  }[]
}

export interface IQrCodeParams {
  access_token: string
  expire_seconds: number
  action_name: number | string
  action_info: {
    [key: string]: any
  }
}

export interface IRemarkParams {
  access_token: string
  openid: string
  remark: string
}

export interface IUsersAddTagParams {
  access_token: string
  tagid: number
  openid_list: string[]
}

type ButtonType =
  | 'view'
  | 'click'
  | 'miniprogram'
  | 'location_select'
  | 'media_id'
  | 'view_limited'
  | 'article_id'
  | 'article_view_limited'

export interface ICreateMenusParams {
  access_token: string
  button: {
    // 菜单的响应动作类型，view 表示网页类型，click 表示点击类型，miniprogram 表示小程序类型
    type?: ButtonType
    // 菜单标题，不超过 16 个字节，子菜单不超过 60 个字节
    name: string
    // 菜单 KEY 值，用于消息接口推送，不超过 128 字节，click 等点击类型必须
    key?: string
    // 跳转外部链接
    url?: string
    // 跳转小程序
    appid?: string
    pagepath?: string
    // 图文消息
    media_id?: string
    // 发布后的图文消息
    article_id?: string
    sub_button?: {
      type: ButtonType
      name: string
      key?: string
      url?: string
      appid?: string
      pagepath?: string
      media_id?: string
      article_id?: string
    }[]
  }[]
}
