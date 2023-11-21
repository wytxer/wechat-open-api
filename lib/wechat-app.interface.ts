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

interface ICheckImageDetail {
  // 策略类型
  strategy: string
  // 错误码，仅当该值为 0 时，该项结果有效
  errcode: number
  // 建议
  suggest: 'risky' | 'pass' | 'review'
  // 命中标签枚举值，100：正常，10001：广告，20001：时政，20002：色情，20003：辱骂，20006：违法犯罪，20008：欺诈，20012：低俗，20013：版权，21000：其他
  label: number
  // 命中的自定义关键词
  keyword: string
  // 0-100，代表置信度，越高代表越有可能属于当前返回的标签（label）
  prob: number
}

export interface ICheckTextResponse extends IStateResponse {
  detail: ICheckImageDetail[]
  // 唯一请求标识，标记单次请求
  trace_id: string
  result: {
    // 建议
    suggest: 'risky' | 'pass' | 'review'
    // 命中标签枚举值
    label: number
  }
}

export interface ICheckImageAndMediaResponse extends IStateResponse {
  // 唯一请求标识，标记单次请求，用于匹配异步推送结果
  trace_id: string
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

export interface ICheckTextOptions {
  access_token: string
  // 需检测的文本内容，文本字数的上限为 2500 字，需使用 UTF-8 编码
  content: string
  // 接口版本号，2.0 版本为固定值 2
  version: number
  // 场景枚举值。1：资料，2：评论，3：论坛，4：社交日志
  scene: 1 | 2 | 3 | 4
  // 用户的 openid（用户需在近两小时访问过小程序）
  openid: string
  // 文本标题，需使用 UTF-8 编码
  title?: string
  // 用户昵称，需使用 UTF-8 编码
  nickname?: string
  // 个性签名，该参数仅在资料类场景有效（scene = 1），需使用 UTF-8 编码
  signature?: string
}

export interface ICheckImageAndMediaOptions {
  access_token: string
  // 要检测的图片或音频的 url，支持图片格式包括 jpg、jepg、png、bmp、gif（取首帧），支持的音频格式包括 mp3、aac、ac3、wma、flac、vorbis、opus、wav
  media_url: string
  // 1：音频，2：图片
  media_type: 1 | 2
  version: number
  // 场景枚举值。1：资料，2：评论，3：论坛，4：社交日志
  scene: 1 | 2 | 3 | 4
  // 用户的 openid（用户需在近两小时访问过小程序）
  openid: string
}
