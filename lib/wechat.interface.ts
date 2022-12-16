export interface IWechatConfig {
  appid: string
  secret: string
}

export interface IStateResponse {
  errcode: string
  errmsg: string
}

export interface IWechatPayConfig {
  appid: string
  mchid: string
  publicKey: Buffer
  privateKey: Buffer
  secret: string
}
