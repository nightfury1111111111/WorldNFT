// truffle migrate --reset --network rinkeby --skip-dry-run
pragma solidity =0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

library IterableMapping {
    // Iterable mapping from address to uint;
    struct Map {
        address[] keys;
        mapping(address => uint) values;
        mapping(address => uint) indexOf;
        mapping(address => bool) inserted;
    }

    function get(Map storage map, address key) public view returns (uint) {
        return map.values[key];
    }

    function getKeyAtIndex(Map storage map, uint index) public view returns (address) {
        return map.keys[index];
    }

    function size(Map storage map) public view returns (uint) {
        return map.keys.length;
    }

    function set(Map storage map, address key, uint val) public {
        if (map.inserted[key]) {
            map.values[key] = val;
        } else {
            map.inserted[key] = true;
            map.values[key] = val;
            map.indexOf[key] = map.keys.length;
            map.keys.push(key);
        }
    }

    function remove(Map storage map, address key) public {
        if (!map.inserted[key]) {
            return;
        }

        delete map.inserted[key];
        delete map.values[key];

        uint index = map.indexOf[key];
        uint lastIndex = map.keys.length - 1;
        address lastKey = map.keys[lastIndex];

        map.indexOf[lastKey] = index;
        delete map.indexOf[key];

        map.keys[index] = lastKey;
        map.keys.pop();
    }
}

contract LocationNFT is ERC721, Ownable {
	using IterableMapping for IterableMapping.Map;

	constructor() ERC721("UniqueAsset", "UNA") public {

	}

	struct Location {
		string location_name; //0-255
		string svg_image;
		uint8 locn_type;
		uint256 latitude;
		uint256 longitude;
		bool isExist;
	}
	struct LocationName {
	    string location_name;
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
	struct Bid {
		uint256 tokenId;
		address bidder;
		uint bidValue;
		uint timeBid;
	}

	uint public nextId = 0;
	uint public acceptedBidsIdx = 0;

	event NftBought(address _seller, address _buyer, uint256 _price);
	event AuctionStarted(address ownerAddress, uint _biddingTime);
	event BidIncrease(address bidAddress, uint256 bidValue);
	event AuctionEnded(address bidAddress, uint256 bidValue);
	event BidRejected(address bidAddress, uint256 bidValue);

	mapping(uint256 => Location) private _locationDetails;
	mapping(string => LocationName) private _locationNames;
	mapping(uint256 => uint256) public tokenIdToPrice;
	mapping(uint256 => Auction) private _auctions;
	// mapping(address => uint) private _pendingReturns;
	mapping(uint256 => Bid) private _biddingLogs;

	// IterableMapping.Map private _pendingReturns;
	mapping(uint256 => IterableMapping.Map) private _tokenPendingReturns;

	
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

	function getBiddingLog(uint256 bidId) public view returns(Bid memory) {
		return _biddingLogs[bidId];
	}

	function getPendingReturnsCount(uint tokenId) public view returns(uint) {
	    IterableMapping.Map storage pendingReturnForIdx = _tokenPendingReturns[tokenId];
		return pendingReturnForIdx.size();
	}

	function getPendingReturnValue(uint tokenId, address addr) public view returns(uint) {
	    IterableMapping.Map storage pendingReturnForIdx = _tokenPendingReturns[tokenId];
	    return pendingReturnForIdx.get(addr);
	}

	function mint(string memory location_name, string memory svg_image, uint8 locn_type, uint256 latitude, uint256 longitude, bool isSellable) public onlyOwner {
	    require(!_locationNames[location_name].isExist, "Location already minted");
		_locationDetails[nextId] = Location(location_name, svg_image, locn_type, latitude, longitude, true);
		_locationNames[location_name] = LocationName(location_name, true);
		if (isSellable) {
			tokenIdToPrice[nextId] = 10000000000000000; //2000 wei
		} else {
			tokenIdToPrice[nextId] = 0;
		}
		//safeMint function calls _beforeTokenTransfer which we have overridden.
		_safeMint(msg.sender, nextId);
		nextId++;
	}

	function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override { 
		
	}

	function buy(uint256 _tokenId) external payable {
		uint256 price = tokenIdToPrice[_tokenId];
		require(price > 0, "This token is not for sale");
		require(msg.value == price, 'Incorrect value');
		address seller = ownerOf(_tokenId);
		_transfer(seller, msg.sender, _tokenId);
		tokenIdToPrice[_tokenId] = 0;
		payable(seller).transfer(msg.value);
		emit NftBought(seller, msg.sender, msg.value);
	}
	
	function startAuction(uint256 _tokenId, uint _biddingTime) external {
	    uint auctionEndTime = block.timestamp + _biddingTime;
	    require(_locationDetails[_tokenId].isExist, "Token doesn't exist");
	    // require(!_auctions[_tokenId].isExist, "Auction already started");
	    require(msg.sender == ownerOf(_tokenId), "Cannot start auction for token you don't own");
		if(_auctions[_tokenId].isExist && !_auctions[_tokenId].auctionEnded) {
			revert ("The auction has not ended yet");
		}
	    _auctions[_tokenId] = Auction(_tokenId,msg.sender,true,false,auctionEndTime,_biddingTime,address(0x0),0,true);
		emit AuctionStarted(msg.sender, _biddingTime);
	}

	function endAuction(uint256 _tokenId) external {
	    Auction memory auc = getAuctionInfo(_tokenId);
	    require(auc.isExist, "Auction doesn't exist");
	    if(block.timestamp < auc.auctionEndTime) {
	        revert ("The auction has not ended yet");
	    }
	    if(auc.auctionEnded) {
	        revert ("The auction has ended");
	    }
		IterableMapping.Map storage pr = _tokenPendingReturns[_tokenId];
		if(auc.highestBid == 0) {
			auc.auctionEnded = true;
	    	auc.auctionGoingOn = false;
			_auctions[_tokenId] = auc;
			emit AuctionEnded(auc.highestBidder, auc.highestBid);
		} else {
			auc.auctionEnded = true;
			auc.auctionGoingOn = false;
			payable(auc.beneficiary).transfer(auc.highestBid);
			_transfer(auc.beneficiary, auc.highestBidder, _tokenId);
			auc.beneficiary = auc.highestBidder;
			_auctions[_tokenId] = auc;
			tokenIdToPrice[_tokenId] = auc.highestBid;
			pr.set(auc.highestBidder, 0);
			emit AuctionEnded(auc.highestBidder, auc.highestBid);
		}
		
		for (uint i = 0; i < pr.size(); i++) {
			address returnAddr = pr.getKeyAtIndex(i);
			uint returnVal = getPendingReturnValue(_tokenId, returnAddr);
			if(returnVal > 0) {
				payable(returnAddr).transfer(returnVal);
				emit BidRejected(returnAddr, returnVal);
			}
		}
	}
	
	function placeBid(uint256 _tokenId) external payable {
	    Auction memory auc = getAuctionInfo(_tokenId);
	    require(auc.isExist, "Auction doesn't exist");
		require(msg.value > tokenIdToPrice[_tokenId], "Bid price must be higher");
	    if(msg.value <= auc.highestBid) {
	        revert("Higher bid exists");
	    }
	    auc.highestBid = msg.value;
	    auc.highestBidder = msg.sender;
	    _auctions[_tokenId] = auc;
	    // _pendingReturns[msg.sender] += msg.value;
		// _pendingReturns.set(msg.sender, msg.value);
		IterableMapping.Map storage pr = _tokenPendingReturns[_tokenId];
        pr.set(msg.sender, msg.value);
	    emit BidIncrease(msg.sender, msg.value);

		//Log bid into bidHistory
		_biddingLogs[acceptedBidsIdx] = Bid(_tokenId, msg.sender, msg.value, block.timestamp);
		acceptedBidsIdx++;
	}
	
}