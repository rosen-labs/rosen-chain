package cli

import (
	"fmt"
	"time"

	"github.com/spf13/cobra"

	"github.com/cosmos/cosmos-sdk/client"
	// "github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/rosen-labs/rosenchain/x/ibcbridge/types"
)

var (
	DefaultRelativePacketTimeoutTimestamp = uint64((time.Duration(10) * time.Minute).Nanoseconds())
)

const (
	flagPacketTimeoutTimestamp = "packet-timeout-timestamp"
)

// GetTxCmd returns the transaction commands for this module
func GetTxCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:                        types.ModuleName,
		Short:                      fmt.Sprintf("%s transactions subcommands", types.ModuleName),
		DisableFlagParsing:         true,
		SuggestionsMinimumDistance: 2,
		RunE:                       client.ValidateCmd,
	}

	// this line is used by starport scaffolding # 1

	return cmd
}

// func GetBridgeXTokenCmd() *cobra.Command {
// 	cmd := &cobra.Command{
// 		Use:   "bridge-to [chain_id] [amount] [fee] [reciever]",
// 		Short: "Bridge amounts of x token to specific chain",
// 		Args:  cobra.ExactArgs(4),
// 		RunE: func(cmd *cobra.Command, args []string) error {
// 			argsChainId := string(args[0])
// 			argsAmount := string(args[1])
// 			argsFee := string(args[2])
// 			argsReciever := string(args[3])

// 			clientCtx, err := client.GetClientTxContext(cmd)
// 			if err != nil {
// 				return err
// 			}

// 			from := clientCtx.GetFromAddress()
// 			if from == nil {
// 				return fmt.Errorf("must pass from flag")
// 			}

// 			amount, err := sdk.ParseCoinNormalized(argsAmount)
// 			if err != nil {
// 				return fmt.Errorf("amount must be float")
// 			}

// 			fee, err := sdk.ParseCoinNormalized(argsFee)
// 			if err != nil {
// 				return fmt.Errorf("fee must be float")
// 			}

// 			msg := types.NewMsgBridgeRequest(
// 				argsChainId,
// 				amount,
// 				fee,
// 				argsReciever,
// 				from,
// 			)

// 			if err := msg.ValidateBasic(); err != nil {
// 				return err
// 			}
// 			return tx.GenerateOrBroadcastTxCLI(clientCtx, cmd.Flags(), msg)
// 		},
// 	}

// 	flags.AddTxFlagsToCmd(cmd)

// 	return cmd
// }
