require("dotenv").config()
const ethers = require("ethers")
const RosenABI = require("./constant/abi/Rosen.json")
const { DirectSecp256k1HdWallet, Registry } = require("@cosmjs/proto-signing")
const { SigningStargateClient, coins } = require("@cosmjs/stargate")
const { MsgSendMsgMintRequest } = require("./constant/protos/tx.js")
const WebSocket = require("ws")
const BigNumber = require("bignumber.js/bignumber")

const polyProvider = new ethers.providers.WebSocketProvider(
  process.env.POLY_WSS
)
const harmonyProvider = new ethers.providers.WebSocketProvider(
  process.env.HARMONY_WSS
)
const polyProviderRpc = new ethers.providers.JsonRpcProvider(
  process.env.POLY_RPC
)
const harmonyProviderRpc = new ethers.providers.JsonRpcProvider(
  process.env.HARMONY_RPC
)
const rosenWs = new WebSocket(process.env.ROSEN_WSS)

const polyWallet = new ethers.Wallet(
  process.env.PRIVATE_KEY_POLY,
  polyProviderRpc
)
const harmonyWallet = new ethers.Wallet(
  process.env.PRIVATE_KEY_HAMONY,
  harmonyProviderRpc
)

const polyRosenContract = new ethers.Contract(
  process.env.ROSEN_POLY_CONTRACT,
  RosenABI,
  polyWallet
)

const harmonyRosenContract = new ethers.Contract(
  process.env.ROSEN_HAMONY_CONTRACT,
  RosenABI,
  harmonyWallet
)

const sendToChainEvent = ethers.utils.id(
  'SendToChain(address,address,string,uint256,uint256,uint256)'
)

const sendToPolygon = async (tokenAddr, reciever, amount, fee = 0) => {
  try {
    const transaction = await polyRosenContract.submitTransactions(
      process.env.ICE_POLY_CONTRACT,
      reciever,
      amount,
      fee,
      { gasLimit: 280000 }
    )

    await transaction.wait()
    console.log('Send to polygon success')
  } catch (e) {
    console.error(e.message)
  }
}

const sendToHarmony = async (tokenAddr, reciever, amount, fee = 0) => {
  try {
    const transaction = await harmonyRosenContract.submitTransactions(
      process.env.ICE_HAMONY_CONTRACT,
      reciever,
      amount,
      fee,
      { gasLimit: 280000 }
    )

    await transaction.wait()
    console.log('Send to harmony success')
  } catch (e) {
    console.error(e.message)
  }
}

const sendToCosmos = async (reciever, amount) => {
  const mnemonic = process.env.ROSEN_MEMONIC
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic)
  const [accounts] = await wallet.getAccounts()

  const registry = new Registry()
  registry.register(
    '/rosenlabs.rosenchain.ibcbridge.MsgSendMsgMintRequest',
    MsgSendMsgMintRequest
  )
  const options = {
    registry: registry,
  }
  const client = await SigningStargateClient.connectWithSigner(
    'http://localhost:26659',
    wallet,
    options
  )

  const value = {
    sender: accounts.address,
    port: 'bridge',
    channelID: 'channel-1',
    timeoutTimestamp: (Date.now() + 60000) * 1000000,
    reciever: reciever,
    amount: amount,
    fee: 0,
    tokenId: 0,
    srcChainId: 0,
    destChainId: 1,
  }

  const msg = {
    typeUrl: '/rosenlabs.rosenchain.ibcbridge.MsgSendMsgMintRequest',
    value,
  }
  const fee = {
    amount: coins(1, 'token'),
    gas: '180000',
  }

  await client.signAndBroadcast(accounts.address, [msg], fee)
  console.log('Send to cosmos success')
}

console.log('Start listen event on polygon')
polyProvider.on(
  {
    address: process.env.ROSEN_POLY_CONTRACT,
    topics: [sendToChainEvent],
  },
  async result => {
    const { data, topics } = result
    const decodeData = ethers.utils.defaultAbiCoder.decode(
      ['address', 'string', 'uint256', 'uint256'],
      data
    )

    const tokenContract = decodeData[0]
    const reciever = decodeData[1].toString()
    const sourceChain = decodeData[2].toString()
    const amount = decodeData[3].toString()
    const desChain = parseInt(topics[2], 16)

    console.log(
      `Send ${amount} token ${tokenContract} from ${sourceChain} to ${desChain}`
    )

    switch (desChain) {
      // Cosmos
      case Number(process.env.ROSEN_CHAIN_ID):
        await sendToCosmos(reciever, amount)
        break

      // Harmony
      case Number(process.env.HARMONY_CHAIN_ID):
        await sendToHarmony(tokenContract, reciever, amount, 0)
      default:
        break
    }
  }
)

console.log('Start listen event on harmony')
harmonyProvider.on(
  {
    address: process.env.ROSEN_HAMONY_CONTRACT,
    topics: [sendToChainEvent],
  },
  async result => {
    const { data, topics } = result
    const decodeData = ethers.utils.defaultAbiCoder.decode(
      ['address', 'string', 'uint256', 'uint256'],
      data
    )

    const tokenContract = decodeData[0]
    const reciever = decodeData[1].toString()
    const sourceChain = decodeData[2].toString()
    const amount = decodeData[3].toString()
    const desChain = parseInt(topics[2], 16)

    console.log(
      `Send ${amount} token ${tokenContract} from ${sourceChain} to ${desChain}`
    )

    switch (desChain) {
      // Cosmos
      case Number(process.env.ROSEN_CHAIN_ID):
        await sendToCosmos(reciever, amount)
        break

      // Polygon
      case Number(process.env.POLY_CHAIN_ID):
        await sendToPolygon(tokenContract, reciever, amount, 0)
      default:
        break
    }
  }
)

// Rosen web socket section
console.log('Start listen event on cosmos')
rosenWs.onopen = function () {
  rosenWs.send(
    JSON.stringify({
      jsonrpc: '2.0',
      method: 'subscribe',
      id: 0,
      params: {
        query: "tm.event='Tx' AND bridging_mint.event_name='bridging_mint'",
      },
    })
  )
}

function convert(msg) {
  const prefix = 'bridging_mint.'
  let result = {}
  for (const [key, value] of Object.entries(
    JSON.parse(msg.data).result.events
  )) {
    if (key.startsWith(prefix)) {
      const newKey = key.replace(prefix, '')
      result[newKey] = value[0]
    }
  }
  return result
}

rosenWs.onmessage = async function (msg) {
  try {
    const { reciever, amount, fee, dest_chain_id, contract } = convert(msg)
    switch (Number(dest_chain_id)) {
      // Polygon
      case Number(0):
        await sendToPolygon(contract, reciever, amount, 0)
        break

      // Harmony
      case Number(2):
        await sendToHarmony(contract, reciever, amount, 0)
        break

      default:
        break
    }
  } catch (e) {
    console.error(e)
  }
}
