require("dotenv").config()
const Web3 = require("web3")
const RosenABI = require("./constant/abi/Rosen.json")
const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing")
const { SigningCosmosClient } = require("@cosmjs/launchpad")

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

      const rpcEndpoint = "http://localhost:1318"
      //   const client = await SigningStargateClient.connectWithSigner(
      //     rpcEndpoint,
      //     wallet
      //   )
      const client = new SigningCosmosClient(
        rpcEndpoint,
        firstAccount.address,
        wallet
      )

      const msg = {
        typeUrl: "ibcbridge/SendMsgMintRequest",
        value: {
          sender: firstAccount.address,
          port: "bridge",
          channelID: "channel-1",
          timeoutTimestamp: "timeoutTimestamp",
          reciever: "cosmos184n5ltlkjt3dmwk29cwhxgqkwhlgr7lssyxv3z",
          amount: 123,
          fee: 1,
          tokenId: 0,
          srcChainId: 0,
          destChainId: 1,
        },
      }

      await client.signAndBroadcast([msg])
      //   assertIsBroadcastTxSuccess(result)
    } catch (e) {
      console.error(e)
    }
  })
