package types

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// Route ...
func (m *MsgMintRequest) Route() string {
	return "ibcbridge"
}

// Type ...
func (m *MsgMintRequest) Type() string {
	return "MsgMintRequest"
}

func (m *MsgMintRequest) ValidateBasic() error {
	return nil
}

func (m *MsgMintRequest) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(m)
	return sdk.MustSortJSON(bz)
}

func (m *MsgMintRequest) GetSigners() []sdk.AccAddress {
	return []sdk.AccAddress{}
}
