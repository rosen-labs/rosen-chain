package types

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

var _ sdk.Msg = &MsgSendMsgMintRequest{}

func NewMsgSendMsgMintRequest(
	sender string,
	port string,
	channelID string,
	timeoutTimestamp uint64,
	reciever string,
	amount uint64,
	fee uint64,
	tokenId uint32,
	srcChainId uint32,
	destChainId uint32,
) *MsgSendMsgMintRequest {
	return &MsgSendMsgMintRequest{
		Sender:           sender,
		Port:             port,
		ChannelID:        channelID,
		TimeoutTimestamp: timeoutTimestamp,
		Reciever:         reciever,
		Amount:           amount,
		Fee:              fee,
		TokenId:          tokenId,
		SrcChainId:       srcChainId,
		DestChainId:      destChainId,
	}
}

func (msg *MsgSendMsgMintRequest) Route() string {
	return RouterKey
}

func (msg *MsgSendMsgMintRequest) Type() string {
	return "SendMsgMintRequest"
}

func (msg *MsgSendMsgMintRequest) GetSigners() []sdk.AccAddress {
	sender, err := sdk.AccAddressFromBech32(msg.Sender)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{sender}
}

func (msg *MsgSendMsgMintRequest) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgSendMsgMintRequest) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Sender)
	if err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid sender address (%s)", err)
	}
	return nil
}
