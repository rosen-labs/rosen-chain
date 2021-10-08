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

  event SendToCosmosEvent(
    address indexed _tokenContract,
    address indexed _sender,
    string indexed _destination,
    uint256 _amount
  );

  event TransactionExecuted(
    address indexed _tokenContract,
    address indexed _destination,
    uint256 _amount
  );

  function sendToCosmos(
    address _tokenContract,
    string calldata _destination,
    uint256 _amount
  ) external nonReentrant {
    IERC20(_tokenContract).safeTransferFrom(msg.sender, address(this), _amount);
    emit SendToCosmosEvent(_tokenContract, msg.sender, _destination, _amount);
  }

  function submitTransactions(
    uint256 _amount,
    address _destination,
    address _tokenContract,
    uint256 _fee
  ) external nonReentrant {
    IERC20(_tokenContract).safeTransfer(_destination, _amount);
    IERC20(_tokenContract).safeTransfer(msg.sender, _fee);
    emit TransactionExecuted(_tokenContract, _destination, _amount);
  }
}
