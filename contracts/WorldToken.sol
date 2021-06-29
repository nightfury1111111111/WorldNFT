pragma solidity =0.6.12;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/presets/ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/*Features of ERC20PresetMinterPauser
# - ability for holders to burn (destroy) their tokens
# - a minter role that allows for token minting (creation)
# - a pauser role that allows to stop all token transfers
*/
contract WorldToken is ERC20PresetMinterPauser, Ownable {
	using SafeERC20 for IERC20;
	using Address for address;

	constructor() public ERC20PresetMinterPauser("WorldToken", "WOT") {
		_mint(msg.sender, 100000000000000000000000000); // Mint 100M tokens
	}
}