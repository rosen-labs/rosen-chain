package cli

import (
	"fmt"
	"strconv"
	"time"

	"github.com/spf13/cobra"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/client/tx"

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
	cmd.AddCommand(CmdSendMsgMintRequest())

	// cmd.AddCommand(GetBridgeXTokenCmd())
	return cmd
}

func GetBridgeXTokenCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "bridge-to [src_chain_id] [des_chain_id] [token_id] [amount] [fee] [reciever]",
		Short: "Bridge amounts of x token to specific chain",
		Args:  cobra.ExactArgs(6),
		RunE: func(cmd *cobra.Command, args []string) error {
			argsReciever := string(args[4])
			var argsTokenId, argsSrcChainId, argsDestChainId uint32
			var argsAmount, argsFee uint64

			if value, err := argsToUint32("src_chain_id", args[0]); err != nil {
				return err
			} else {
				argsSrcChainId = value
			}

			if value, err := argsToUint32("dest_chain_id", args[1]); err != nil {
				return err
			} else {
				argsDestChainId = value
			}

			if value, err := argsToUint32("token_id", args[2]); err != nil {
				return err
			} else {
				argsTokenId = value
			}

			if value, err := argsToUint64("amount", args[3]); err != nil {
				return err
			} else {
				argsAmount = value
			}

			if value, err := argsToUint64("fee", args[4]); err != nil {
				return err
			} else {
				argsFee = value
			}

			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			from := clientCtx.GetFromAddress()
			if from == nil {
				return fmt.Errorf("must pass from flag")
			}

			msg := types.NewMsgMintRequest(
				argsReciever,
				argsAmount,
				argsFee,
				argsTokenId,
				argsSrcChainId,
				argsDestChainId,
				from,
			)

			if err := msg.ValidateBasic(); err != nil {
				return err
			}
			return tx.GenerateOrBroadcastTxCLI(clientCtx, cmd.Flags(), msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

	return cmd
}

func argsToUint32(argsName string, value string) (uint32, error) {
	temp, err := strconv.ParseUint(value, 10, 32)
	if err != nil {
		return 0, fmt.Errorf("%s must be number (uint32)", argsName)
	} else {
		return uint32(temp), nil
	}
}

func argsToUint64(argsName string, value string) (uint64, error) {
	temp, err := strconv.ParseUint(value, 10, 64)
	if err != nil {
		return 0, fmt.Errorf("%s must be number (uint32)", argsName)
	} else {
		return temp, nil
	}
}
