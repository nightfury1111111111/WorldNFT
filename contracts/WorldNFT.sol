pragma solidity >=0.4.22 <0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WorldNFT is ERC721, Ownable {
	constructor() ERC721("WorldNFT", "WNFT") public {

	}

	struct Location {
		string location_name;
		string svg_image;
		bool isExist;
	}
	struct Auction {
	    uint256 tokenId;
	    address beneficiary;
	    bool auctionGoingOn;
		bool auctionEnded;
	    uint auctionEndTime;
		uint biddingTime;
	    address highestBidder;
	    uint highestBid;
	    bool isExist;
	}

	uint public nextId = 0;

	event AuctionStarted(address ownerAddress, uint _biddingTime);

	mapping(uint256 => Location) private _locationDetails;
	mapping(uint256 => uint256) public tokenIdToPrice;
	mapping(uint256 => Auction) private _auctions;

	function getTokenDetails(uint256 tokenId) public view returns (Location memory) {
		return _locationDetails[tokenId];
	}

	function getPriceOf(uint256 tokenId) public view returns (uint256) {
		return tokenIdToPrice[tokenId];
	}

	function getOwnerOf(uint256 tokenId) public view returns (address){
		return ownerOf(tokenId);
	}

	function getAuctionInfo(uint256 tokenId) public view returns(Auction memory) {
	    return _auctions[tokenId];
	}

	function mint(string memory location_name, string memory svg_image) public onlyOwner {
		_locationDetails[nextId] = Location(location_name, svg_image, true);
		tokenIdToPrice[nextId] = 2000000000000000000; //1 ONE=1e18 wei
		_safeMint(msg.sender, nextId);
		nextId++;
	}

	function startAuction(uint256 _tokenId, uint _biddingTime) external {
		uint auctionEndTime = block.timestamp + _biddingTime;
		require(_locationDetails[_tokenId].isExist, "Token doesn't exist");
		require(msg.sender == ownerOf(_tokenId), "Cannot start auction for token you don't own");
		if(_auctions[_tokenId].isExist && !_auctions[_tokenId].auctionEnded) {
			revert ("The auction has not ended yet");
		}
		_auctions[_tokenId] = Auction(_tokenId,msg.sender,true,false,auctionEndTime,_biddingTime,address(0x0),0,true);
		emit AuctionStarted(msg.sender, _biddingTime);
	}

	function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override { 
		
	}
}