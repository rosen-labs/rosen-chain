package keeper

import (
	"fmt"

	"github.com/rosen-labs/rosenchain/x/ibcbridge/types"
	"github.com/tendermint/tendermint/libs/log"

	"github.com/cosmos/cosmos-sdk/codec"
	sdk "github.com/cosmos/cosmos-sdk/types"
	// this line is used by starport scaffolding # ibc/keeper/import
)

type (
	Keeper struct {
		cdc           codec.Marshaler
		storeKey      sdk.StoreKey
		memKey        sdk.StoreKey
		channelKeeper types.ChannelKeeper
		portKeeper    types.PortKeeper
		scopedKeeper  types.ScopedKeeper
	}
)

func NewKeeper(
	cdc codec.Marshaler,
	storeKey,
	memKey sdk.StoreKey,
	channelKeeper types.ChannelKeeper,
	portKeeper types.PortKeeper,
	scopedKeeper types.ScopedKeeper,

) *Keeper {
	return &Keeper{
		cdc:           cdc,
		storeKey:      storeKey,
		memKey:        memKey,
		channelKeeper: channelKeeper,
		portKeeper:    portKeeper,
		scopedKeeper:  scopedKeeper,
	}
}

func (k Keeper) Logger(ctx sdk.Context) log.Logger {
	return ctx.Logger().With("module", fmt.Sprintf("x/%s", types.ModuleName))
}

func (k Keeper) Bridge(ctx sdk.Context, msg *types.MsgMintRequest) error {
	fmt.Printf("DEBUG start bridging | %#v", msg)
	fmt.Printf(
		"DEBUG mint from %s to %s",
		chainMap.GetChainById(msg.SrcChainId).ChainName,
		chainMap.GetChainById(msg.DestChainId).ChainName,
	)
	tokenEndpoint := chainMap.GetChainById(msg.DestChainId).GetTokenEndpointById(msg.TokenId)
	return tokenEndpoint.Mint(ctx, k, msg.Reciever, msg.Amount, msg.Fee, msg.SrcChainId)
}
