package keeper

import (
	"github.com/rosen-labs/rosenchain/x/rosenchain/types"
)

var _ types.QueryServer = Keeper{}
