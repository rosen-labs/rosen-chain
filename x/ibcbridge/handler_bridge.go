package ibcbridge

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/rosen-labs/rosenchain/x/ibcbridge/keeper"
	"github.com/rosen-labs/rosenchain/x/ibcbridge/types"
)

func handleMsgBridgeRequest(ctx sdk.Context, k keeper.Keeper, msg *types.MsgMintRequest) (*sdk.Result, error) {
	tokenEndpoint := chainMap.GetChainById(msg.DestChainId).GetTokenEndpointById(msg.TokenId)
	if err := tokenEndpoint.Mint(ctx, k, msg.Reciever, msg.Amount, msg.Fee); err != nil {
		return nil, err
	}
	return &sdk.Result{Events: ctx.EventManager().ABCIEvents()}, nil
}
