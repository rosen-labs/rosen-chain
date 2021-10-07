package keeper

import (
	"context"

	sdk "github.com/cosmos/cosmos-sdk/types"
	clienttypes "github.com/cosmos/cosmos-sdk/x/ibc/core/02-client/types"
	"github.com/rosen-labs/rosenchain/x/ibcbridge/types"
)

func (k msgServer) SendMsgMintRequest(goCtx context.Context, msg *types.MsgSendMsgMintRequest) (*types.MsgSendMsgMintRequestResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// TODO: logic before transmitting the packet

	// Construct the packet
	var packet types.MsgMintRequestPacketData

	packet.Reciever = msg.Reciever
	packet.Amount = msg.Amount
	packet.Fee = msg.Fee
	packet.TokenId = msg.TokenId
	packet.SrcChainId = msg.SrcChainId
	packet.DestChainId = msg.DestChainId

	// Transmit the packet
	err := k.TransmitMsgMintRequestPacket(
		ctx,
		packet,
		msg.Port,
		msg.ChannelID,
		clienttypes.ZeroHeight(),
		msg.TimeoutTimestamp,
	)
	if err != nil {
		return nil, err
	}

	return &types.MsgSendMsgMintRequestResponse{}, nil
}
