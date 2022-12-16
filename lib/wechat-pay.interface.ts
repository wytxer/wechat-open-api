/**
 * 应答签名验证参数
 */
export interface ISignVerifyOptions {
  // 时间戳
  timestamp: string
  // 随机字符串
  nonce: string
  // 证书序列号
  serial: string
  // 请求参数
  body: any
  // 应答签名
  signature: string
}

/**
 * 预付款参数签名参数
 */
export interface ISignPrepayOptions {
  // 时间戳
  timeStamp: string
  // 随机字符串
  nonceStr: string
  // 订单详情扩展字符串
  package: string
  // 签名方式
  signType: string
  // 签名
  paySign: string
}

/**
 * 获取平台证书列表响应数据
 */
export interface IGetCertificateData {
  effective_time: string
  expire_time: string
  serial_no: string
  encrypt_certificate: {
    algorithm: string
    associated_data: string
    ciphertext: string
    nonce: string
  }
}

/**
 * 下单参数
 */
export interface ITransactionJsApiOptions {
  // 应用 id
  appid?: string
  // 商户号
  mchid?: string
  // 商品描述
  description: string
  // 商户订单号
  out_trade_no: string
  // 交易结束时间
  time_expire?: string
  // 附加数据
  attach?: string
  // 通知地址
  notify_url: string
  // 订单优惠标记
  goods_tag?: string
  // 电子发票入口开放标识
  support_fapiao?: boolean
  // 订单金额信息
  amount: {
    // 总金额
    total: number
    // 货币类型
    currency?: string
  }
  // 支付者
  payer: {
    // 用户标识
    openid: string
  }
  // 优惠功能
  detail?: {
    // 订单原价
    cost_price?: number
    // 商品小票 id
    invoice_id?: number
    // 单品列表
    goods_detail?: {
      // 商户侧商品编码
      merchant_goods_id: string
      // 微信支付商品编码
      wechatpay_goods_id?: string
      // 商品名称
      goods_name?: string
      // 商品数量
      quantity: number
      // 商品单价
      unit_price: number
    }[]
  }
  // 场景信息
  scene_info?: {
    // 用户终端 IP
    payer_client_ip: string
    // 商户端设备号
    device_id?: string
    // 门店信息
    store_info?: {
      // 门店编号
      id: string
      // 门店名称
      name?: string
      // 地区编号
      area_code?: string
      // 详情地址
      address?: string
    }
  }
  // 结算信息
  settle_info?: {
    // 是否指定分账
    profit_sharing?: boolean
  }
}

/**
 * 下单响应数据
 */
export interface ITransactionJsApiData {
  // 预支付 id
  prepay_id: string
}

interface IGoodsDetail {
  // 商户侧商品编码
  merchant_goods_id: string
  // 微信支付商品编码
  wechatpay_goods_id?: string
  // 商品名称
  goods_name?: string
  // 商品单价
  unit_price: number
  // 商品退货数量
  refund_quantity: number
  // 商品退款金额
  refund_amount: number
}

/**
 * 退款参数
 */
export interface IRefundsOptions {
  //商户退款单号
  out_refund_no: string
  // 退款原因
  reason?: string
  // 退款结果回调地址
  notify_url?: string
  // 退款资金来源
  funds_account?: string
  // 金额信息
  amount: {
    // 退款金额
    refund: number
    // 退款出资账户及金额
    from?: {
      // 出资账户类型
      account: string
      // 出资金额
      amount: number
    }[]
    // 原订单金额
    total: number
    // 退款币种
    currency: string
  }
  goods_detail?: IGoodsDetail[]
}
export interface IRefundsRequiredTransactionId extends IRefundsOptions {
  // 微信支付订单号
  transaction_id: string
  // 商户订单号
  out_trade_no?: string
}
export interface IRefundsRequiredOutTradeNoOptions extends IRefundsOptions {
  // 微信支付订单号
  transaction_id?: string
  // 商户订单号
  out_trade_no: string
}
