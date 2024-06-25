import { IStateResponse } from './wechat.interface'

export interface IAccessTokenResponse extends IStateResponse {
  access_token: string
  expires_in: number
}
