package cli

import (
	"strconv"

	"github.com/spf13/cobra"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/client/tx"
	channelutils "github.com/cosmos/cosmos-sdk/x/ibc/core/04-channel/client/utils"
	"github.com/rosen-labs/rosenchain/x/ibcbridge/types"
)

var _ = strconv.Itoa(0)

func CmdSendMsgMintRequest() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "send-msg-mint-request [src-port] [src-channel] [reciever] [amount] [fee] [tokenId] [srcChainId] [destChainId]",
		Short: "Send a MsgMintRequest over IBC",
		Args:  cobra.ExactArgs(8),
		RunE: func(cmd *cobra.Command, args []string) error {
			argsReciever := string(args[2])
			argsAmount, err := argsToUint64("amount", args[0])
			if err != nil {
				return err
			}
			argsFee, err := argsToUint64("fee", args[0])
			if err != nil {
				return err
			}
			argsTokenId, err := argsToUint32("token_id", args[0])
			if err != nil {
				return err
			}
			argsSrcChainId, err := argsToUint32("src_chain_id", args[0])
			if err != nil {
				return err
			}
			var argsDestChainId uint32 = 1

			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			sender := clientCtx.GetFromAddress().String()
			srcPort := args[0]
			srcChannel := args[1]

			// Get the relative timeout timestamp
			timeoutTimestamp, err := cmd.Flags().GetUint64(flagPacketTimeoutTimestamp)
			if err != nil {
				return err
			}
			consensusState, _, _, err := channelutils.QueryLatestConsensusState(clientCtx, srcPort, srcChannel)
			if err != nil {
				return err
			}
			if timeoutTimestamp != 0 {
				timeoutTimestamp = consensusState.GetTimestamp() + timeoutTimestamp
			}

			msg := types.NewMsgSendMsgMintRequest(sender, srcPort, srcChannel, timeoutTimestamp, argsReciever, argsAmount, argsFee, argsTokenId, argsSrcChainId, argsDestChainId)
			if err := msg.ValidateBasic(); err != nil {
				return err
			}
			return tx.GenerateOrBroadcastTxCLI(clientCtx, cmd.Flags(), msg)
		},
	}

	cmd.Flags().Uint64(flagPacketTimeoutTimestamp, DefaultRelativePacketTimeoutTimestamp, "Packet timeout timestamp in nanoseconds. Default is 10 minutes.")
	flags.AddTxFlagsToCmd(cmd)

	return cmd
}
