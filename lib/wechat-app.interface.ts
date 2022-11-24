import { IStateResponse } from './wechat.interface'

export interface ICode2SessionResponse extends IStateResponse {
  openid: string
  session_key: string
  unionid?: string
}

export interface IAccessTokenResponse extends IStateResponse {
  access_token: string
  expires_in: number
}

export interface IGetPhoneNumberResponse extends IStateResponse {
  phone_info: {
    // 用户绑定的手机号（国外手机号会有区号）
    phoneNumber: string
    // 没有区号的手机号
    purePhoneNumber: string
    // 区号
    countryCode: string
    // 数据水印
    watermark: {
      // 小程序 appId
      appid: string
      // 用户获取手机号操作的时间戳
      timestamp: number
    }
  }
}

export interface ISendParams {
  access_token: string
  touser: string
  template_id: string
  page: string
  data: Record<string, any>
  miniprogram_state?: 'developer' | 'trial' | 'formal'
  lang?: 'zh_CN' | 'en_US' | 'zh_HK' | 'zh_TW'
}
