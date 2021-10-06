package types

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// Route ...
func (m *IbcbridgePacketData_MsgMintRequest) Route() string {
	return "xchain"
}

// Type ...
func (m *IbcbridgePacketData_MsgMintRequest) Type() string {
	return "BridgeRequest"
}

func (m *IbcbridgePacketData_MsgMintRequest) ValidateBasic() error {
	return nil
}

func (m *IbcbridgePacketData_MsgMintRequest) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(m)
	return sdk.MustSortJSON(bz)
}

func (m *IbcbridgePacketData_MsgMintRequest) GetSigners() []sdk.AccAddress {
	return []sdk.AccAddress{}
}
