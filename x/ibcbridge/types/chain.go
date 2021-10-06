package types

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
	Mint(reciever string, amount uint64, fee uint64)
}

type ContractEndpoint struct {
	TokenName       string
	ContractAddress string
}

func (e ContractEndpoint) Mint(reciever string, amount uint64, fee uint64) {

}

type CosmosDenomEndpoint struct {
	TokenName string
	Denom     string
}

func (e CosmosDenomEndpoint) Mint(reciever string, amount uint64, fee uint64) {

}

var ChainMapper ChainMap

func init() {
	ChainMapper[0] = Chain{ChainName: "Etherium", ChainId: 0}
	ChainMapper[0].TokenEndpointMap[0] = ContractEndpoint{
		TokenName:       "x",
		ContractAddress: "0x9f834f87we023jf",
	}

	ChainMapper[1] = Chain{ChainName: "XChain", ChainId: 1}
	ChainMapper[1].TokenEndpointMap[0] = CosmosDenomEndpoint{
		TokenName: "x",
		Denom:     "token",
	}
}
