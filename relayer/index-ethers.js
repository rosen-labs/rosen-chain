require("dotenv").config()
const ethers = require("ethers")
const RosenABI = require("./constant/abi/Rosen.json")
const { DirectSecp256k1HdWallet, Registry } = require("@cosmjs/proto-signing")
const { SigningStargateClient, coins } = require("@cosmjs/stargate")
const { MsgSendMsgMintRequest } = require("./constant/protos/tx.js")

// const polyProvider = new ethers.providers.JsonRpcProvider(
//   "https://matic-mumbai.chainstacklabs.com"
// )
const polyProvider = new ethers.providers.WebSocketProvider(
  "ws://localhost:8545"
)
const polyWallet = new ethers.Wallet(process.env.PRIVATE_KEY_POLY, polyProvider)
const ContractAddress = process.env.ROSEN_POLY_CONTRACT
const polyRosenContract = new ethers.Contract(
  process.env.ROSEN_POLY_CONTRACT,
  RosenABI,
  polyWallet
)

const sendToChainEvent = ethers.utils.id(
  "SendToChain(address,address,string,uint256,uint256,uint256)"
)

const filter = {
  address: ContractAddress,
  topics: [sendToChainEvent],
}

console.log("Start listen event")

polyProvider.on(filter, async (result) => {
  const { data, topics } = result
  const decodeData = ethers.utils.defaultAbiCoder.decode(
    ["address", "uint256", "uint256"],
    data
  )

  console.log(result)

  const tokenContract = decodeData[0]
  const sourceChain = decodeData[1].toString()
  const amount = decodeData[2].toString()

  const reciever = topics[2]

  console.log(`Send token ${tokenContract} from ${sourceChain} to`)

  sendToCosmos(reciever, amount)

  //   switch (desChain) {
  //     case "0":
  //       await sendToCosmos(reciever, amount)
  //       break

  //     // Harmony
  //     case "80001":
  //       await sendToEvm()
  //     default:
  //       break
  //   }

  //   await sendToEvm()
})

const sendToEvm = async (tokenAddr, reciever, amount, fee = 0) => {
  try {
    const transaction = await polyRosenContract.submitTransactions(
      tokenAddr,
      reciever,
      amount,
      fee,
      { gasLimit: 280000 }
    )

    await transaction.wait()
  } catch (e) {
    console.error(e.message)
  }
}

const sendToCosmos = async (reciever, amount) => {
  const mnemonic = process.env.ROSEN_MEMONIC
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic)
  const [accounts] = await wallet.getAccounts()

  console.log(accounts)
  console.log(accounts.address)

  const registry = new Registry()
  registry.register(
    "/rosenlabs.rosenchain.ibcbridge.MsgSendMsgMintRequest",
    MsgSendMsgMintRequest
  )
  const options = {
    registry: registry,
  }
  const client = await SigningStargateClient.connectWithSigner(
    "http://localhost:26659",
    wallet,
    options
  )

  console.log(await client.getChainId())

  const value = {
    sender: accounts.address,
    port: "bridge",
    channelID: "channel-0",
    timeoutTimestamp: (Date.now() + 5000) / 1000,
    reciever: reciever,
    amount: amount,
    fee: 0,
    tokenId: 0,
    srcChainId: 0,
    destChainId: 1,
  }

  const msg = {
    typeUrl: "/rosenlabs.rosenchain.ibcbridge.MsgSendMsgMintRequest",
    value,
  }
  const fee = {
    amount: coins(1, "token"),
    gas: "180000",
  }

  await client.signAndBroadcast(accounts.address, [msg], fee)
}
