// "Ny","0","22","22",true


// pragma solidity =0.6.12;

// contract SimpleAuction {
// 	address payable public beneficiary;
// 	uint public auctionEndTime; //in seconds

// 	//curr state of the auction
// 	address public highestBidder;
// 	uint public highestBid;

// 	mapping(address => uint) public pendingReturns;

// 	bool ended = false;

// 	event HighestBidIncrease(address bidder, uint amount);
// 	event AuctionEnded(address winner, uint amount);

// 	constructor(uint _biddingTime, address payable _beneficiary) {
// 		beneficiary = _beneficiary;
// 		auctionEndTime = block.timestamp + _biddingTime;
// 	}

// 	function bid() public payable{
// 		//users to bid
// 		if (block.timestamp > auctionEndTime) {
// 			revert("The auction has already ended");
// 		}

// 		if(msg.value <= highestBid) {
// 			revert("Higher bid exists");
// 		}

// 		if(highestBid != 0) {
// 			pendingReturns[highestBidder] += highestBid;
// 		}

// 		highestBidder = msg.sender;
// 		highestBid = msg.value;
// 		emit HighestBidIncrease(msg.sender, msg.value);
// 	}

// 	function withdraw() public returns(bool){
// 		//withdraw their coins
// 		uint amount = pendingReturns[msg.sender];
// 		if(amount > 0) {
// 			pendingReturns[msg.sender] = 0;
// 			if(!payable(msg.sender).send(amount)){
// 				pendingReturns[msg.sender] = amount;
// 				return false;
// 			}
// 		}
// 		return true;
// 	}

// 	function auctionEnd() public {
// 		//end the auction and send funds to the owner/beneficiary of the auction
// 		if (block.timestamp < auctionEndTime) {
// 			revert ("The auction has not ended yet");
// 		}
// 		if(ended) {
// 			revert ("The func auctionEnd has already executed");
// 		}
// 		ended = true;
// 		emit AuctionEnded(highestBidder, highestBid);
// 		beneficiary.transfer(highestBid);
// 	}
// }