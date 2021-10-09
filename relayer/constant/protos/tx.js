/* eslint-disable */
const Long = require("long")
const _m0 = require("protobufjs/minimal")

 protobufPackage = "rosenlabs.rosenchain.ibcbridge"

const baseMsgSendMsgMintRequest = {
  sender: "",
  port: "",
  channelID: "",
  timeoutTimestamp: 0,
  reciever: "",
  amount: 0,
  fee: 0,
  tokenId: 0,
  srcChainId: 0,
  destChainId: 0,
}

 MsgSendMsgMintRequest = {
  encode(message, writer = _m0.Writer.create()) {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender)
    }
    if (message.port !== "") {
      writer.uint32(18).string(message.port)
    }
    if (message.channelID !== "") {
      writer.uint32(26).string(message.channelID)
    }
    if (message.timeoutTimestamp !== 0) {
      writer.uint32(32).uint64(message.timeoutTimestamp)
    }
    if (message.reciever !== "") {
      writer.uint32(42).string(message.reciever)
    }
    if (message.amount !== 0) {
      writer.uint32(48).uint64(message.amount)
    }
    if (message.fee !== 0) {
      writer.uint32(56).uint64(message.fee)
    }
    if (message.tokenId !== 0) {
      writer.uint32(64).uint32(message.tokenId)
    }
    if (message.srcChainId !== 0) {
      writer.uint32(72).uint32(message.srcChainId)
    }
    if (message.destChainId !== 0) {
      writer.uint32(80).uint32(message.destChainId)
    }
    return writer
  },

  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseMsgSendMsgMintRequest }
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string()
          break
        case 2:
          message.port = reader.string()
          break
        case 3:
          message.channelID = reader.string()
          break
        case 4:
          message.timeoutTimestamp = longToNumber(reader.uint64())
          break
        case 5:
          message.reciever = reader.string()
          break
        case 6:
          message.amount = longToNumber(reader.uint64())
          break
        case 7:
          message.fee = longToNumber(reader.uint64())
          break
        case 8:
          message.tokenId = reader.uint32()
          break
        case 9:
          message.srcChainId = reader.uint32()
          break
        case 10:
          message.destChainId = reader.uint32()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object) {
    const message = { ...baseMsgSendMsgMintRequest }
    if (object.sender !== undefined && object.sender !== null) {
      message.sender = String(object.sender)
    } else {
      message.sender = ""
    }
    if (object.port !== undefined && object.port !== null) {
      message.port = String(object.port)
    } else {
      message.port = ""
    }
    if (object.channelID !== undefined && object.channelID !== null) {
      message.channelID = String(object.channelID)
    } else {
      message.channelID = ""
    }
    if (
      object.timeoutTimestamp !== undefined &&
      object.timeoutTimestamp !== null
    ) {
      message.timeoutTimestamp = Number(object.timeoutTimestamp)
    } else {
      message.timeoutTimestamp = 0
    }
    if (object.reciever !== undefined && object.reciever !== null) {
      message.reciever = String(object.reciever)
    } else {
      message.reciever = ""
    }
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = Number(object.amount)
    } else {
      message.amount = 0
    }
    if (object.fee !== undefined && object.fee !== null) {
      message.fee = Number(object.fee)
    } else {
      message.fee = 0
    }
    if (object.tokenId !== undefined && object.tokenId !== null) {
      message.tokenId = Number(object.tokenId)
    } else {
      message.tokenId = 0
    }
    if (object.srcChainId !== undefined && object.srcChainId !== null) {
      message.srcChainId = Number(object.srcChainId)
    } else {
      message.srcChainId = 0
    }
    if (object.destChainId !== undefined && object.destChainId !== null) {
      message.destChainId = Number(object.destChainId)
    } else {
      message.destChainId = 0
    }
    return message
  },

  toJSON(message) {
    const obj = {}
    message.sender !== undefined && (obj.sender = message.sender)
    message.port !== undefined && (obj.port = message.port)
    message.channelID !== undefined && (obj.channelID = message.channelID)
    message.timeoutTimestamp !== undefined &&
      (obj.timeoutTimestamp = message.timeoutTimestamp)
    message.reciever !== undefined && (obj.reciever = message.reciever)
    message.amount !== undefined && (obj.amount = message.amount)
    message.fee !== undefined && (obj.fee = message.fee)
    message.tokenId !== undefined && (obj.tokenId = message.tokenId)
    message.srcChainId !== undefined && (obj.srcChainId = message.srcChainId)
    message.destChainId !== undefined && (obj.destChainId = message.destChainId)
    return obj
  },

  fromPartial(object) {
    const message = { ...baseMsgSendMsgMintRequest }
    if (object.sender !== undefined && object.sender !== null) {
      message.sender = object.sender
    } else {
      message.sender = ""
    }
    if (object.port !== undefined && object.port !== null) {
      message.port = object.port
    } else {
      message.port = ""
    }
    if (object.channelID !== undefined && object.channelID !== null) {
      message.channelID = object.channelID
    } else {
      message.channelID = ""
    }
    if (
      object.timeoutTimestamp !== undefined &&
      object.timeoutTimestamp !== null
    ) {
      message.timeoutTimestamp = object.timeoutTimestamp
    } else {
      message.timeoutTimestamp = 0
    }
    if (object.reciever !== undefined && object.reciever !== null) {
      message.reciever = object.reciever
    } else {
      message.reciever = ""
    }
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = object.amount
    } else {
      message.amount = 0
    }
    if (object.fee !== undefined && object.fee !== null) {
      message.fee = object.fee
    } else {
      message.fee = 0
    }
    if (object.tokenId !== undefined && object.tokenId !== null) {
      message.tokenId = object.tokenId
    } else {
      message.tokenId = 0
    }
    if (object.srcChainId !== undefined && object.srcChainId !== null) {
      message.srcChainId = object.srcChainId
    } else {
      message.srcChainId = 0
    }
    if (object.destChainId !== undefined && object.destChainId !== null) {
      message.destChainId = object.destChainId
    } else {
      message.destChainId = 0
    }
    return message
  },
}

const baseMsgSendMsgMintRequestResponse = {}

 MsgSendMsgMintRequestResponse = {
  encode(_Response, writer = _m0.Writer.create()) {
    return writer
  },

  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {
      ...baseMsgSendMsgMintRequestResponse,
    }
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(_) {
    const message = {
      ...baseMsgSendMsgMintRequestResponse,
    }
    return message
  },

  toJSON(_Response) {
    const obj = {}
    return obj
  },

  fromPartial(_) {
    const message = {
      ...baseMsgSendMsgMintRequestResponse,
    }
    return message
  },
}

const baseMsgMintRequest = {
  reciever: "",
  amount: 0,
  fee: 0,
  tokenId: 0,
  srcChainId: 0,
  destChainId: 0,
  signer: "",
}

 MsgMintRequest = {
  encode(message, writer = _m0.Writer.create()) {
    if (message.reciever !== "") {
      writer.uint32(10).string(message.reciever)
    }
    if (message.amount !== 0) {
      writer.uint32(16).uint64(message.amount)
    }
    if (message.fee !== 0) {
      writer.uint32(24).uint64(message.fee)
    }
    if (message.tokenId !== 0) {
      writer.uint32(32).uint32(message.tokenId)
    }
    if (message.srcChainId !== 0) {
      writer.uint32(40).uint32(message.srcChainId)
    }
    if (message.destChainId !== 0) {
      writer.uint32(48).uint32(message.destChainId)
    }
    if (message.signer !== "") {
      writer.uint32(58).string(message.signer)
    }
    return writer
  },

  decode(input, length) {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseMsgMintRequest }
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.reciever = reader.string()
          break
        case 2:
          message.amount = longToNumber(reader.uint64())
          break
        case 3:
          message.fee = longToNumber(reader.uint64())
          break
        case 4:
          message.tokenId = reader.uint32()
          break
        case 5:
          message.srcChainId = reader.uint32()
          break
        case 6:
          message.destChainId = reader.uint32()
          break
        case 7:
          message.signer = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object) {
    const message = { ...baseMsgMintRequest }
    if (object.reciever !== undefined && object.reciever !== null) {
      message.reciever = String(object.reciever)
    } else {
      message.reciever = ""
    }
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = Number(object.amount)
    } else {
      message.amount = 0
    }
    if (object.fee !== undefined && object.fee !== null) {
      message.fee = Number(object.fee)
    } else {
      message.fee = 0
    }
    if (object.tokenId !== undefined && object.tokenId !== null) {
      message.tokenId = Number(object.tokenId)
    } else {
      message.tokenId = 0
    }
    if (object.srcChainId !== undefined && object.srcChainId !== null) {
      message.srcChainId = Number(object.srcChainId)
    } else {
      message.srcChainId = 0
    }
    if (object.destChainId !== undefined && object.destChainId !== null) {
      message.destChainId = Number(object.destChainId)
    } else {
      message.destChainId = 0
    }
    if (object.signer !== undefined && object.signer !== null) {
      message.signer = String(object.signer)
    } else {
      message.signer = ""
    }
    return message
  },

  toJSON(message) {
    const obj = {}
    message.reciever !== undefined && (obj.reciever = message.reciever)
    message.amount !== undefined && (obj.amount = message.amount)
    message.fee !== undefined && (obj.fee = message.fee)
    message.tokenId !== undefined && (obj.tokenId = message.tokenId)
    message.srcChainId !== undefined && (obj.srcChainId = message.srcChainId)
    message.destChainId !== undefined && (obj.destChainId = message.destChainId)
    message.signer !== undefined && (obj.signer = message.signer)
    return obj
  },

  fromPartial(object) {
    const message = { ...baseMsgMintRequest }
    if (object.reciever !== undefined && object.reciever !== null) {
      message.reciever = object.reciever
    } else {
      message.reciever = ""
    }
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = object.amount
    } else {
      message.amount = 0
    }
    if (object.fee !== undefined && object.fee !== null) {
      message.fee = object.fee
    } else {
      message.fee = 0
    }
    if (object.tokenId !== undefined && object.tokenId !== null) {
      message.tokenId = object.tokenId
    } else {
      message.tokenId = 0
    }
    if (object.srcChainId !== undefined && object.srcChainId !== null) {
      message.srcChainId = object.srcChainId
    } else {
      message.srcChainId = 0
    }
    if (object.destChainId !== undefined && object.destChainId !== null) {
      message.destChainId = object.destChainId
    } else {
      message.destChainId = 0
    }
    if (object.signer !== undefined && object.signer !== null) {
      message.signer = object.signer
    } else {
      message.signer = ""
    }
    return message
  },
}

class MsgClientImpl {
  constructor(rpc) {
    this.rpc = rpc
    this.SendMsgMintRequest = this.SendMsgMintRequest.bind(this)
  }
  SendMsgMintRequest(request) {
    const data = MsgSendMsgMintRequest.encode(request).finish()
    const promise = this.rpc.request(
      "rosenlabs.rosenchain.ibcbridge.Msg",
      "SendMsgMintRequest",
      data
    )
    return promise.then((data) =>
      MsgSendMsgMintRequestResponse.decode(new _m0.Reader(data))
    )
  }
}

var globalThis = (() => {
  if (typeof globalThis !== "undefined") return globalThis
  if (typeof self !== "undefined") return self
  if (typeof window !== "undefined") return window
  if (typeof global !== "undefined") return global
  throw "Unable to locate global object"
})()

function longToNumber(long) {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER")
  }
  return long.toNumber()
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long
  _m0.configure()
}

module.exports = {
  protobufPackage,
  MsgSendMsgMintRequest,
  MsgSendMsgMintRequestResponse,
  MsgMintRequest  
}