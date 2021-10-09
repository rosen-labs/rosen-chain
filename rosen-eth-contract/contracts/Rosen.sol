pragma solidity ^0.6.6;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Rosen is ReentrancyGuard, Ownable {
  using SafeMath for uint256;
  using SafeERC20 for IERC20;

  event SendToChain(
    address _tokenContract,
    address indexed _sender,
    string indexed _receiver,
    uint256 _sourceChain,
    uint256 indexed _desChain,
    uint256 _amount
  );

  event TransactionExecuted(
    address indexed _tokenContract,
    address indexed _receiver,
    uint256 _amount
  );

  function _getChainID() internal view returns (uint256) {
    uint256 id;
    assembly {
      id := chainid()
    }
    return id;
  }

  function sendToChain(
    address _tokenContract,
    string calldata _receiver,
    uint256 _desChain,
    uint256 _amount
  ) external nonReentrant {
    IERC20(_tokenContract).safeTransferFrom(msg.sender, address(this), _amount);
    emit SendToChain(
      _tokenContract,
      msg.sender,
      _receiver,
      _getChainID(),
      _desChain,
      _amount
    );
  }

  function submitTransactions(
    address _tokenContract,
    address _receiver,
    uint256 _amount,
    uint256 _fee
  ) external nonReentrant {
    IERC20(_tokenContract).safeTransfer(_receiver, _amount);
    IERC20(_tokenContract).safeTransfer(msg.sender, _fee);
    emit TransactionExecuted(_tokenContract, _receiver, _amount);
  }
}
