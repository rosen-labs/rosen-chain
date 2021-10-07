package keeper

import (
	"github.com/rosen-labs/rosenchain/x/ibcbridge/types"
)

var _ types.QueryServer = Keeper{}
