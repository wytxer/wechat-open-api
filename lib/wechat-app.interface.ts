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

export interface IGenerateUrlLinkResponse extends IStateResponse {
  url_link: string
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

export interface IGenerateUrlLinkOptions {
  access_token: string
  // 通过 URL Link 进入的小程序页面路径，必须是已经发布的小程序存在的页面，不可携带 query。path 为空时会跳转小程序主页
  path: string
  // 通过 URL Link 进入小程序时的query，最大 1024 个字符，只支持数字，大小写英文以及部分特殊字符：!#$&'()*+,/:;=?@-._~%
  query?: string
  // 默认值：0。小程序 URL Link 失效类型，0：失效时间，1：失效间隔天数
  expire_type?: 0 | 1
  // 到期失效的 URL Link 的失效时间，为 Unix 时间戳。生成的到期失效 URL Link 在该时间前有效。最长有效期为30天。expire_type 为 0 必填
  expire_time?: number
  // 到期失效的URL Link的失效间隔天数。生成的到期失效URL Link在该间隔时间到达前有效。最长间隔天数为30天。expire_type 为 1 必填
  expire_interval?: number
  // 云开发静态网站自定义 H5 配置参数，可配置中转的云开发 H5 页面。不填默认用官方 H5 页面
  cloud_base?: {
    // 云开发环境
    env: string
    // 静态网站自定义域名，不填则使用默认域名
    domain?: string
    // 云开发静态网站 H5 页面路径，不可携带 query
    path?: string
    // 同上
    query?: string
    // 第三方批量代云开发时必填，表示创建该 env 的 appid（小程序/第三方平台）
    resource_appid?: string
  }
  // 默认值：release。要打开的小程序版本。正式版：release，体验版：trial，开发版为：develop，仅在微信外打开时生效。
  env_version?: string
}
