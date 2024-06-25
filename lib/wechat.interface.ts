export interface IWechatConfig {
  appid: string
  secret: string
}

export interface IWecomConfig {
  corpid: string
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

export enum Gender {
  unknown = '0',
  male = '1',
  female = '2'
}
