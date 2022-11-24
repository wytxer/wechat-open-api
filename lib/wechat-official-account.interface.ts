import { IStateResponse } from './wechat.interface'

export interface IAccessTokenResponse extends IStateResponse {
  access_token: string
  expires_in: number
}

export interface IQrCodeParams {
  access_token: string
  expire_seconds: number
  action_name: number | string
  action_info: {
    [key: string]: any
  }
}
