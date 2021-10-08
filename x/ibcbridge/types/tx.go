package types

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func NewMsgMintRequest(
	reciever string,
	amount uint64,
	fee uint64,
	tokenId uint32,
	src_chain_id uint32,
	dest_chain_id uint32,
	signer sdk.Address,
) *MsgMintRequest {
	result := &MsgMintRequest{
		Reciever:    reciever,
		Amount:      amount,
		Fee:         fee,
		TokenId:     tokenId,
		SrcChainId:  src_chain_id,
		DestChainId: dest_chain_id,
		Signer:      signer.String(),
	}

	return result
}

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
	creator, err := sdk.AccAddressFromBech32(m.Signer)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}
