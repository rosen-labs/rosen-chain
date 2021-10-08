package ibcbridge

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/rosen-labs/rosenchain/x/ibcbridge/keeper"
	"github.com/rosen-labs/rosenchain/x/ibcbridge/types"
)

func handleMsgBridgeRequest(ctx sdk.Context, k keeper.Keeper, msg *types.MsgMintRequest) (*sdk.Result, error) {
	if err := k.Bridge(ctx, msg); err != nil {
		return nil, err
	}
	return &sdk.Result{Events: ctx.EventManager().ABCIEvents()}, nil
}
