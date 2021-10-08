package keeper

import (
	"fmt"
	"time"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/rosen-labs/rosenchain/x/ibcbridge/types"
)

type ChainMap map[uint32]Chain

func (c ChainMap) GetChainById(id uint32) Chain {
	return c[id]
}

type Chain struct {
	ChainName        string
	ChainId          uint32
	TokenEndpointMap map[uint32]TokenEndpoint
}

func (c Chain) GetTokenEndpointById(id uint32) TokenEndpoint {
	return c.TokenEndpointMap[id]
}

type TokenEndpoint interface {
	Mint(
		ctx sdk.Context,
		k Keeper,
		reciever string,
		amount uint64,
		fee uint64,
		srcChainId uint32,
	) error
}

type ContractEndpoint struct {
	TokenName     string
	CosmosChainId string
	TokenId       uint32
	ChainId       uint32

	ContractAddress string
}

func (e ContractEndpoint) Mint(
	ctx sdk.Context,
	k Keeper,
	reciever string,
	amount uint64,
	fee uint64,
	srcChainId uint32,
) error {
	fmt.Println("DEBUG : Mint evm token")
	ctx.EventManager().EmitEvents([]sdk.Event{
		sdk.NewEvent(
			types.EventTypeBridgingMint,

			sdk.NewAttribute(types.AttributeKeyReciever, reciever),
			sdk.NewAttribute(types.AttributeKeyAmount, fmt.Sprintf("%d", amount)),
			sdk.NewAttribute(types.AttributeKeyFee, fmt.Sprintf("%d", fee)),
			sdk.NewAttribute(types.AttributeKeySrcChainId, fmt.Sprintf("%d", srcChainId)),
			sdk.NewAttribute(types.AttributeKeyDestChainId, fmt.Sprintf("%d", e.ChainId)),
			sdk.NewAttribute(types.AttributeKeyTokenID, fmt.Sprintf("%d", e.TokenId)),
			sdk.NewAttribute(types.AttributeKeyContract, e.ContractAddress),
		),
	})
	fmt.Println("DEBUG : Mint evm token event emitted")
	return nil
}

type CosmosDenomEndpoint struct {
	TokenName     string
	CosmosChainId string
	TokenId       uint32
	ChainId       uint32

	Denom     string
	ChannelID string
}

func (e CosmosDenomEndpoint) Mint(
	ctx sdk.Context,
	k Keeper,
	reciever string,
	amount uint64,
	fee uint64,
	srcChainId uint32,
) error {
	fmt.Println("DEBUG : Mint cosmos denom")
	msgServer := NewMsgServerImpl(k)
	if _, err := msgServer.SendMsgMintRequest(sdk.WrapSDKContext(ctx), &types.MsgSendMsgMintRequest{
		Sender:           "",
		Port:             types.PortID,
		ChannelID:        e.ChannelID,
		TimeoutTimestamp: uint64(time.Now().UnixNano()),
		Reciever:         reciever,
		Amount:           amount,
		Fee:              fee,
		TokenId:          e.TokenId,
		SrcChainId:       srcChainId,
		DestChainId:      e.ChainId,
	}); err != nil {
		return err
	}
	fmt.Println("DEBUG : Send mint message success")

	ctx.EventManager().EmitEvents([]sdk.Event{
		sdk.NewEvent(
			types.EventTypeBridgingMint,

			sdk.NewAttribute(types.AttributeKeyReciever, reciever),
			sdk.NewAttribute(types.AttributeKeyAmount, fmt.Sprintf("%d", amount)),
			sdk.NewAttribute(types.AttributeKeyFee, fmt.Sprintf("%d", fee)),
			sdk.NewAttribute(types.AttributeKeySrcChainId, fmt.Sprintf("%d", srcChainId)),
			sdk.NewAttribute(types.AttributeKeyDestChainId, fmt.Sprintf("%d", e.ChainId)),
			sdk.NewAttribute(types.AttributeKeyTokenID, fmt.Sprintf("%d", e.TokenId)),
			sdk.NewAttribute(types.AttributeKeyDenom, e.Denom),
		),
	})
	fmt.Println("DEBUG : Mint cosmos denom token event emitted")
	return nil
}

var chainMap = make(ChainMap)

func init() {
	chainMap[0] = Chain{ChainName: "Etherium", ChainId: 0, TokenEndpointMap: make(map[uint32]TokenEndpoint)}
	chainMap[0].TokenEndpointMap[0] = ContractEndpoint{
		TokenName:     "x",
		CosmosChainId: "eth:0",
		TokenId:       0,
		ChainId:       0,

		ContractAddress: "0x9f834f87we023jf",
	}

	chainMap[1] = Chain{ChainName: "XChain", ChainId: 1, TokenEndpointMap: make(map[uint32]TokenEndpoint)}
	chainMap[1].TokenEndpointMap[0] = CosmosDenomEndpoint{
		TokenName:     "x",
		CosmosChainId: "x:0",
		TokenId:       0,
		ChainId:       1,

		Denom:     "token",
		ChannelID: "channel-0",
	}
}
