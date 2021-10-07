package ibcbridge

import (
	"fmt"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/rosen-labs/rosenchain/x/ibcbridge/keeper"
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
		k keeper.Keeper,
		reciever string,
		amount uint64,
		fee uint64,
	) error
}

type ContractEndpoint struct {
	TokenName       string
	ContractAddress string
}

func (e ContractEndpoint) Mint(
	ctx sdk.Context,
	k keeper.Keeper,
	reciever string,
	amount uint64,
	fee uint64,
) error {
	fmt.Println("TODO implement Contract token mint")
	return nil
}

type CosmosDenomEndpoint struct {
	TokenName string
	Denom     string
}

func (e CosmosDenomEndpoint) Mint(
	ctx sdk.Context,
	k keeper.Keeper,
	reciever string,
	amount uint64,
	fee uint64,
) error {
	fmt.Println("TODO implement Cosmos denom mint")
	return nil
}

var chainMap = make(ChainMap)

func init() {
	chainMap[0] = Chain{ChainName: "Etherium", ChainId: 0, TokenEndpointMap: make(map[uint32]TokenEndpoint)}
	chainMap[0].TokenEndpointMap[0] = ContractEndpoint{
		TokenName:       "x",
		ContractAddress: "0x9f834f87we023jf",
	}

	chainMap[1] = Chain{ChainName: "XChain", ChainId: 1, TokenEndpointMap: make(map[uint32]TokenEndpoint)}
	chainMap[1].TokenEndpointMap[0] = CosmosDenomEndpoint{
		TokenName: "x",
		Denom:     "token",
	}
}
