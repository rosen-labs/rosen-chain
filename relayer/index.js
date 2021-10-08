require("dotenv").config()
const Web3 = require("web3")
const RosenABI = require("./constant/abi/Rosen.json")
const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing")
const {
  assertIsBroadcastTxSuccess,
  SigningStargateClient,
  StargateClient,
} = require("@cosmjs/stargate")

const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.ETH_WSS))
const rosenEthContract = new web3.eth.Contract(RosenABI, process.env.ROSEN_ETH)

web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY_ETH)

web3.eth
  .subscribe(
    "logs",
    {
      address: process.env.ROSEN_ETH,
    },
    (error, result) => {
      if (error) console.error(error)
    }
  )
  .on("connected", function () {
    console.log("start listen event on ethereum")
  })
  .on("data", async function (log) {
    try {
      //TODO send token to cosmos
      const mnemonic = process.env.ROSEN_MEMONIC
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic)
      const [firstAccount] = await wallet.getAccounts()

      const rpcEndpoint = "https://rpc.my_tendermint_rpc_node"
      const client = await SigningStargateClient.connectWithSigner(
        rpcEndpoint,
        wallet
      )

      const recipient = "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5"
      const amount = {
        denom: "ucosm",
        amount: "1234567",
      }
      const result = await client.sendTokens(
        firstAccount.address,
        recipient,
        [amount],
        "Have fun with your star coins"
      )
      assertIsBroadcastTxSuccess(result)
    } catch (e) {
      console.error(e)
    }
  })
