import React, { useState, useEffect, useSelector } from "react";
import {
  Link,
  Route,
  Switch,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import {
  Units,
  Unit,
  numberToString,
  add0xToString,
  fromWei,
  toWei,
  numToStr,
} from "@harmony-js/utils";
import { compareAsc, format } from "date-fns";
import { Iconly } from "react-iconly";

import * as common from "../utils/common";

import Store from "../stores/store";
const store = Store.store;
const emitter = Store.emitter;
const dispatcher = Store.dispatcher;

export default function NftDetail() {
  let { id } = useParams();
  const [contract, setContract] = useState(null);
  const [nftObj, setNftObj] = useState(null);
  const [auctionObj, setAuctionObj] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bidTime, setBidTime] = useState(60);
  const [bidPrice, setBidPrice] = useState(0.01);
  const [timerObj, setTimerObj] = useState(null);
  const [timerEnded, setTimerEnded] = useState(false);

  const selectedBidTimes = [
    { name: "5 mins", value: 60 * 5 },
    { name: "10 mins", value: 60 * 10 },
    { name: "30 mins", value: 60 * 30 },
    { name: "1 hour", value: 60 * 60 },
  ];

  const getCompressed = (addr) => {
    const len = addr.length;
    return addr.substring(0, 6) + "..." + addr.substring(len - 5, len);
  };

  useEffect(() => {
    if (!nftObj) return;
    console.log("updated nftObj ", nftObj);
  }, [nftObj]);

  const getNftByTokenId = async (id) => {
    const nft = await contract.methods.getTokenDetails(id).call();
    const owner = await contract.methods.getOwnerOf(id).call();
    console.log("owner ", owner);
    let owner_fmt = getCompressed(owner);
    let price = await contract.methods.getPriceOf(id).call();
    //For ETH
    // price = window.web3.utils.fromWei(price);
    //For ONE
    price = fromWei(price, Units.one);

    const isNftOwned = owner == store.getStore().account ? true : false;
    const mintFreshNft =
      owner == "0x099E4E5Bb2b01a80A49D237317b2d868658C2Fd4" ? true : false;
    let auctionObj = await contract.methods.getAuctionInfo(id).call();
    let locn_nft = {
      token_id: id,
      name: nft.location_name,
      owner: owner,
      owner_fmt: owner_fmt,
      svg_image: nft.svg_image,
      price: price,
      isNftOwned: isNftOwned,
      mintFreshNft: mintFreshNft,
      hasAuctionStarted: auctionObj.isExist,
    };
    return locn_nft;
  };

  const refreshContractData = async () => {
    let nftObj = await getNftByTokenId(id);
    setNftObj(nftObj);
    if (nftObj.hasAuctionStarted) {
      refreshAuctionPanel(nftObj.token_id);
    }
  };

  // ~~~~~~~~~~~~~~~~~~~~~ Auction
  useEffect(() => {
    if (!auctionObj) return;
    // console.log("updated auctionObj ", auctionObj);
    if (auctionObj.currBiddingTime == auctionObj.origBiddingTime) {
      //   console.log("Effect: startTimer ", timerObj);
      clearInterval(timerObj);
      setTimerObj(null);
      startTimer();
    } else if (auctionObj.currBiddingTime == 0) {
      resetTimer();
    }
  }, [auctionObj]);

  const secondsToTime = (secs) => {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      h: hours,
      m: minutes,
      s: seconds,
    };
    return obj;
  };
  const countDown = () => {
    // Remove one second, set state so a re-render happens.
    auctionObj.currBiddingTime = auctionObj.currBiddingTime - 1;
    auctionObj.timer = secondsToTime(auctionObj.currBiddingTime);
    // console.log(auctionObj.timer);
    setAuctionObj({ ...auctionObj });
    // Check if we're at zero.
    if (auctionObj.currBiddingTime == 0) {
      console.log("countdown finished");
      resetTimer();
    }
  };
  const startTimer = () => {
    // console.log("startTimer ", auctionObj.origBiddingTime);
    if (!auctionObj.timer) return;
    if (auctionObj.origBiddingTime > 0) {
      let timerObj = setInterval(countDown, 1000);
      setTimerObj(timerObj);
    }
  };
  const resetTimer = () => {
    console.log("reset timer");
    clearInterval(timerObj);
    setTimerObj(null);
  };
  const getTimeRemaining = (endTime) => {
    let auctionEndTime = new Date(endTime * 1000);
    let timeRemaining = (auctionEndTime.getTime() - Date.now()) / 1000;
    timeRemaining = Math.ceil(timeRemaining);
    // console.log("timeRemaining ", timeRemaining);
    return timeRemaining;
  };

  const updateTimeRemaining = (auctionObj) => {
    // console.log("updateTimeRemaining");
    let timeRemaining = getTimeRemaining(auctionObj.auctionEndTime);
    if (timeRemaining <= 0) {
      auctionObj.currBiddingTime = 0;
      auctionObj.timer = secondsToTime(auctionObj.currBiddingTime);
    } else {
      auctionObj.origBiddingTime = timeRemaining;
      auctionObj.currBiddingTime = timeRemaining;
    }
    return auctionObj;
  };
  const getAuctionDetailById = async (id) => {
    let auctionData = await contract.methods.getAuctionInfo(id).call();
    // console.log("auctionData ", auctionData);
    let timer = secondsToTime(auctionData.biddingTime);
    // console.log("timer ", timer);
    // for ETH
    // let highestBid = window.web3.utils.fromWei(auctionData.highestBid, "ether");
    //for ONE
    let highestBid = fromWei(auctionData.highestBid, Units.one);
    let bidPlacedByCurr =
      auctionData.highestBidder == store.getStore().account ? true : false;

    let auctionObj = {
      token_id: auctionData.tokenId,
      isExist: auctionData.isExist,
      auctionEndTime: auctionData.auctionEndTime,
      auctionEnded: auctionData.auctionEnded,
      origBiddingTime: auctionData.biddingTime,
      currBiddingTime: auctionData.biddingTime,
      highestBid: highestBid,
      highestBidder: auctionData.highestBidder,
      highestBidderFmt: common.getShortAddress(auctionData.highestBidder),
      bidPlacedByCurr: bidPlacedByCurr,
      timer: timer,
      logs: [],
    };
    return auctionObj;
  };
  const refreshAuctionPanel = async (id) => {
    let auctionObj = await getAuctionDetailById(id);
    auctionObj = updateTimeRemaining(auctionObj);
    auctionObj = await updateBidLogs(auctionObj);
    setAuctionObj(auctionObj);
  };

  const updateBidLogs = async (auctionObj) => {
    // console.log("refreshBidLogs ");
    //get bidding logs
    var bidLogsCount = await contract.methods.acceptedBidsIdx().call();
    //   console.log("bidLogsCount ", bidLogsCount);
    let logs = [];
    for (var i = 0; i < bidLogsCount; i++) {
      const bidLog = await contract.methods.getBiddingLog(i).call();
      if (bidLog.tokenId == id) {
        let bidTime = new Date(bidLog.timeBid * 1000);
        bidTime = format(bidTime, "MM-dd, HH:mm");
        logs.push({
          tokenId: bidLog.tokenId,
          bidder: bidLog.bidder,
          //   value: window.web3.utils.fromWei(bidLog.bidValue),
          value: fromWei(bidLog.bidValue, Units.one),
          timestamp: bidLog.timeBid,
          time_fmt: bidTime,
        });
      }
    }
    logs.sort(function (a, b) {
      return b.timestamp - a.timestamp;
    });
    auctionObj.logs = logs;
    return auctionObj;
  };
  // ~~~~~~~~~~~~~~~~~~~~~ Auction
  const listenContractEvents = () => {
    //listen to events
    if (contract.events.AuctionStarted) {
      contract.events.AuctionStarted({}, async (error, event) => {
        // console.log("AuctionStarted ", event);
        setLoading(false);
        refreshContractData();
      });
    }
    if (contract.events.BidIncrease) {
      contract.events.BidIncrease({}, async (err, event) => {
        // console.log("BidIncrease ", event.returnValues);
        setLoading(false);
        refreshContractData();
      });
    }
    if (contract.events.BidRejected) {
      contract.events.BidRejected({}, async (err, event) => {
        // console.log("BidRejected ", event.returnValues);
      });
    }
    if (contract.events.BidWithdrawn) {
      contract.events.BidWithdrawn({}, async (err, event) => {
        // console.log("BidWithdrawn ", event.returnValues);
        setLoading(false);
        refreshContractData();
      });
    }
  };

  useEffect(() => {
    if (contract == null) return;
    console.log("contract loaded! ");
    refreshContractData();
    listenContractEvents();
  }, [contract]);

  const updateContract = () => {
    let contract = store.getStore().dapp_contract;
    if (contract) {
      setContract(contract);
    }
  };

  const init = async () => {
    const storeUpdated = async () => {
      updateContract();
    };
    emitter.on("StoreUpdated", storeUpdated);
    if (!contract) {
      updateContract();
    }
  };

  useEffect(() => {
    init();
  }, []);

  const buyNft = async (nftObj) => {
    // console.log("buyNft ", nftObj);
    // let buyAmount = window.web3.utils.toWei("0.01", "Ether");
    let buyAmount = toWei(nftObj.price, Units.one);
    // console.log("buyAmount ", buyAmount);
    setLoading(true);
    if (contract) {
      contract.methods
        .buy(nftObj.token_id)
        .send({ from: store.getStore().account, value: buyAmount })
        .on("transactionHash", (hash) => {
          contract.events.NftBought({}, async (error, event) => {
            console.log("NftBought ", event.returnValues);
            setLoading(false);
            refreshContractData();
          });
        })
        .on("error", (error) => {
          window.alert("Error ", error);
          setLoading(false);
        });
    }
  };

  const testStartAuction = () => {
    let timer = secondsToTime(100);
    let auctionEndTime = Date.now() / 1000 + bidTime;
    let auctionObj = {
      token_id: 0,
      isExist: true,
      auctionEndTime: auctionEndTime,
      origBiddingTime: bidTime,
      currBiddingTime: bidTime,
      timer: timer,
    };
    setAuctionObj(auctionObj);
    nftObj.hasAuctionStarted = true;
    setNftObj({ ...nftObj });
  };

  const startAuction = async (nftObj) => {
    console.log("startAuction ", bidTime);
    setLoading(true);
    if (contract) {
      const result = await contract.methods
        .startAuction(nftObj.token_id, bidTime)
        .send({
          from: store.getStore().account,
          value: 0,
          gasPrice: 1000000000,
          gasLimit: 210000,
        })
        .on("error", (error) => {
          window.alert("Error ", error);
          setLoading(false);
        });
      console.log(`Send tx: ${result.transactionHash} result: `, result.status);
      if (result.status) {
        setLoading(false);
      }
    }
  };

  const endAuction = async (nftObj) => {
    console.log("endAuction");
    setLoading(true);
    if (contract) {
      contract.methods
        .endAuction(nftObj.token_id)
        .send({ from: store.getStore().account, value: 0 })
        .on("transactionHash", (hash) => {
          contract.events.AuctionEnded({}, async (error, event) => {
            console.log("AuctionEnded ", event.returnValues);
            setLoading(false);
            refreshContractData();
          });
        })
        .on("error", (error) => {
          window.alert("Error ", error);
          setLoading(false);
        });
    }
  };

  const placeBid = async (nftObj) => {
    console.log("placeBid");
    setLoading(true);
    if (contract) {
      //   let bidAmount = window.web3.utils.toWei(bidPrice.toString(), "Ether");
      let bidAmount = toWei(bidPrice.toString(), Units.one);
      console.log("bidAmount ", bidAmount);
      contract.methods
        .placeBid(nftObj.token_id)
        .send({ from: store.getStore().account, value: bidAmount })
        .on("transactionHash", (hash) => {
          console.log("placing bid ", hash);
        })
        .on("error", (error) => {
          window.alert("Error ", error);
          setLoading(false);
        });
    }
  };

  const incBid = async (nftObj) => {
    console.log("incBid");
    setLoading(true);
    if (contract) {
      //   let bidAmount = window.web3.utils.toWei(bidPrice.toString(), "Ether");
      //   console.log("bidAmount ", bidAmount);
      //   contract.methods
      //     .placeBid(nftObj.token_id)
      //     .send({ from: store.getStore().account, value: bidAmount })
      //     .on("transactionHash", (hash) => {
      //       console.log("placing bid ", hash);
      //       setLoading(false);
      //     })
      //     .on("error", (error) => {
      //       window.alert("Error ", error);
      //       setLoading(false);
      //     });
    }
  };

  const withdrawBid = async (nftObj) => {
    console.log("withdrawBid");
    setLoading(true);
    if (contract) {
      contract.methods
        .withdrawBid(nftObj.token_id)
        .send({ from: store.getStore().account, value: 0 })
        .on("transactionHash", (hash) => {
          console.log("withdrawing bid ", hash);
          setLoading(false);
        })
        .on("error", (error) => {
          window.alert("Error ", error);
          setLoading(false);
        });
    }
  };

  const EndAuctionBtn = () => (
    <button
      className="font-semibold uppercase bg-black"
      style={{
        height: "40px",
        width: "150px",
        color: "#FFCA0E",
        border: "1px solid #000000",
        borderRadius: "15px 15px 15px 15px",
        fontSize: "15px",
      }}
      disabled={loading}
      onClick={() => endAuction(nftObj)}
    >
      {!loading && <span>End Auction</span>}
      {loading && <span>Ending ...</span>}
    </button>
  );

  const BuyNftBtn = () => (
    <button
      className="bg-blue-500 text-white font-semibold hover:shadow-lg rounded p-2 w-full disabled:opacity-50"
      disabled={loading}
      onClick={() => buyNft(nftObj)}
    >
      {!loading && <span>Buy Now</span>}
      {loading && <span>Buying</span>}
    </button>
  );

  const PlacedBid = () => (
    <div className="flex flex-row gap-2">
      {/* <button
        className="font-semibold uppercase bg-green-500"
        style={{
          height: "40px",
          width: "200px",
          color: "#FFCA0E",
          border: "1px solid #000000",
          borderRadius: "10px 10px 10px 10px",
          fontSize: "15px",
        }}
        disabled={loading || auctionObj.currBiddingTime == 0}
        onClick={() => incBid(nftObj)}
      >
        {!loading && <span>Increase Bid</span>}
        {loading && <span>Increasing ...</span>}
      </button> */}
      <button
        className="font-semibold uppercase bg-red-500"
        style={{
          height: "40px",
          width: "200px",
          color: "#FFCA0E",
          border: "1px solid #000000",
          borderRadius: "10px 10px 10px 10px",
          fontSize: "15px",
        }}
        disabled={loading}
        onClick={() => withdrawBid(nftObj)}
      >
        {!loading && <span>Withdraw Bid</span>}
        {loading && <span>Withdrawing ...</span>}
      </button>
    </div>
  );

  const displaySelectedBidTime = () => {
    let res = selectedBidTimes.filter((item) => item.value == bidTime);
    if (res.length > 0) {
      return res[0].name;
    } else {
      return "Select One";
    }
  };

  //Auction time selection
  const DropDownBtn = () => (
    <div className="dropdown inline-block relative">
      <button
        className="text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center"
        style={{ border: "1px solid #000000" }}
      >
        <span className="mr-1">{displaySelectedBidTime()}</span>
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />{" "}
        </svg>
      </button>
      <ul className="dropdown-menu absolute hidden text-gray-700 pt-1 bg-gray-100">
        {selectedBidTimes.map((bdt) => {
          return (
            <li className="">
              <a
                className="rounded-t hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
                onClick={() => {
                  setBidTime(bdt.value);
                }}
              >
                {bdt.name}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );

  const BidsLog = () => (
    <ul className="m-2 list-disc list-inside mt-8">
      {auctionObj &&
        auctionObj.logs &&
        auctionObj.logs.map((l, i) => {
          return (
            <li className="mb-4" key={i}>
              <span style={styles.listEntry}>
                Bid by {common.getShortAddress(l.bidder)}
              </span>
              <br />
              <span className="ml-4" style={styles.listFollow}>
                <b>{l.value} ONE</b> on {l.time_fmt}
                {/* 8th May, 1999 14:45 */}
              </span>
            </li>
          );
        })}
    </ul>
  );

  const AuctionTime = () => (
    <div className="" style={{ width: "100%" }}>
      <div className="flex flex-col ml-4" style={{}}>
        <span
          style={{
            color: "#000000",
            fontWeight: 600,
            fontSize: "16px",
          }}
        >
          Auction ends in
        </span>
        <div>
          <span style={styles.auctionTimeNumber}>0</span>
          <span style={styles.auctionTimeDesc}>d&nbsp;</span>
          <span style={styles.auctionTimeNumber}>{auctionObj.timer.h}</span>
          <span style={styles.auctionTimeDesc}>h&nbsp;</span>
          <span style={styles.auctionTimeNumber}>{auctionObj.timer.m}</span>
          <span style={styles.auctionTimeDesc}>m&nbsp;</span>
          <span style={styles.auctionTimeNumber}>{auctionObj.timer.s}</span>
          <span style={styles.auctionTimeDesc}>s&nbsp;</span>
        </div>
      </div>
    </div>
  );
  const AuctionNot = () => (
    <div className="" style={{ width: "100%" }}>
      <div className="flex flex-col ml-4" style={{}}>
        <div>
          <span style={styles.auctionTimeNumber}>Not for sale!</span>
        </div>
      </div>
    </div>
  );
  const StartAuctionMenu = () => (
    <div className="ml-4" style={{ width: "100%" }}>
      <DropDownBtn />
      <button
        className="font-semibold uppercase bg-black"
        style={{
          height: "40px",
          width: "150px",
          color: "#FFCA0E",
          border: "1px solid #000000",
          borderRadius: "0px 17.5735px 17.5735px 0px",
          fontSize: "15px",
        }}
        disabled={loading}
        onClick={() => startAuction(nftObj)}
      >
        {!loading && <span>Start Auction</span>}
        {loading && <span>Starting ...</span>}
      </button>
    </div>
  );

  const HighestBidInfo = () => (
    <div className="" style={{ width: "100%" }}>
      <div className="flex flex-col ml-4" style={{}}>
        <span
          style={{
            color: "#000000",
            fontWeight: 600,
            fontSize: "16px",
          }}
        >
          Highest Bid Received
        </span>
        <div>
          <span style={styles.auctionTimeNumber}>
            {auctionObj.highestBid}&nbsp;
          </span>
          <span style={styles.auctionTimeDesc}>ONE</span>
        </div>
      </div>
    </div>
  );

  const PlaceBidBtn = () => (
    <button
      className="font-semibold uppercase bg-black"
      style={{
        height: "40px",
        width: "150px",
        color: "#FFCA0E",
        border: "1px solid #000000",
        borderRadius: "0px 17.5735px 17.5735px 0px",
        fontSize: "18px",
      }}
      disabled={loading}
      onClick={() => placeBid(nftObj)}
    >
      {!loading && <span>Place Bid</span>}
      {loading && <span>Placing ...</span>}
    </button>
  );

  const styles = {
    entryLabel: {
      color: "#828282",
      fontWeight: 600,
      fontSize: "20px",
    },
    entryDesc: {
      color: "#828282",
      fontWeight: 400,
      fontSize: "20px",
      lineHeight: "20px",
    },
    sectionLabel: {
      color: "#828282",
      fontWeight: 600,
      fontSize: "22px",
      lineHeight: "20px",
    },
    auctionTimeNumber: {
      color: "#FF881B",
      fontWeight: 600,
      fontSize: "24px",
      lineHeight: "24px",
    },
    auctionTimeDesc: {
      color: "#828282",
      fontWeight: 600,
      fontSize: "20px",
    },
    listEntry: {
      color: "#000000",
      fontWeight: 600,
      fontSize: "16px",
    },
  };
  return (
    <div className="flex flex-col justify-start" style={{ height: "90vh" }}>
      <div className="m-2 mt-5 ml-4" style={{ height: "3%" }}>
        <Link className="cursor-pointer" to={`/market`}>
          <Iconly
            name="ChevronLeftCircle"
            set="two-tone"
            primaryColor="black"
            size="large"
          />
        </Link>
      </div>
      <div className="ml-8" style={{ height: "97%" }}>
        {nftObj && (
          <>
            <div className="" style={{ height: "45%" }}>
              <div
                className="ml-8 mr-8 mt-4 flex flex-row"
                style={{ height: "100%" }}
              >
                <div className="" style={{ width: "40%" }}>
                  <div
                    className="flex justify-center items-center cursor-pointer rounded-lg"
                    style={{
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                      background:
                        "radial-gradient(77.96% 81.64% at 50% 50%, #FFFFFF 0%, #FFCA0E 100%)",
                      height: "100%",
                    }}
                  >
                    {nftObj && (
                      <div
                        dangerouslySetInnerHTML={{ __html: nftObj.svg_image }}
                      ></div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col pl-4" style={{ width: "60%" }}>
                  <div className="" style={{ minWidth: "50%", height: "100%" }}>
                    <div
                      className="flex justify-between"
                      style={{ height: "10%" }}
                    >
                      <div className="ml-2">
                        <span
                          className="uppercase"
                          style={{
                            color: "#FFCA0E",
                            fontWeight: 600,
                            fontSize: "30px",
                          }}
                        >
                          {nftObj.name}
                        </span>
                      </div>
                      <div className="mr-2 flex flex-row">
                        <span
                          style={{
                            color: "#828282",
                            fontWeight: 600,
                            fontSize: "22px",
                          }}
                        >
                          23&nbsp;
                        </span>
                        <Iconly
                          name="Heart2"
                          set="two-tone"
                          primaryColor="red"
                          size="large"
                        />
                      </div>
                    </div>
                    <div
                      className="flex justify-between mt-2"
                      style={{ height: "8%" }}
                    >
                      <div className="ml-2">
                        <span
                          style={{
                            color: "#828282",
                            fontWeight: 600,
                            fontSize: "20px",
                          }}
                        >
                          Owned by <b>{nftObj.owner_fmt}</b>
                        </span>
                      </div>
                      <div className="mr-2 flex flex-row">
                        <span
                          style={{
                            color: "#828282",
                            fontWeight: 600,
                            fontSize: "22px",
                          }}
                        >
                          50&nbsp;
                        </span>
                        <Iconly
                          name="Show"
                          set="two-tone"
                          primaryColor="black"
                          size="large"
                        />
                      </div>
                    </div>
                    <div
                      className="flex items-start pt-4 ml-2"
                      style={{ height: "38%" }}
                    >
                      <span
                        style={{
                          color: "#828282",
                          fontWeight: 400,
                          fontSize: "18px",
                        }}
                      >
                        Live in the historic city of State along the river and
                        hills with locals around.
                      </span>
                    </div>
                    <div
                      className=" flex flex-row justify-between"
                      style={{ height: "26%" }}
                    >
                      <div
                        className="flex flex-col ml-2"
                        style={{ width: "100%" }}
                      >
                        <span style={styles.listEntry}>Current price</span>
                        <div>
                          <span
                            style={{
                              color: "#FF881B",
                              fontWeight: 600,
                              fontSize: "24px",
                              lineHeight: "24px",
                            }}
                          >
                            {nftObj.price}&nbsp;
                          </span>
                          <span
                            style={{
                              color: "#828282",
                              fontWeight: 600,
                              fontSize: "24px",
                              lineHeight: "24px",
                            }}
                          >
                            ONE&nbsp;
                          </span>
                          <span
                            style={{
                              color: "#FFCA0E",
                              fontWeight: 600,
                              fontSize: "20px",
                              lineHeight: "24px",
                            }}
                          >
                            ($xxx)
                          </span>
                        </div>
                      </div>
                      <span
                        style={{
                          border: "1px solid #000000",
                          width: "2px",
                          height: "80%",
                          opacity: "0.2",
                        }}
                      ></span>
                      {nftObj.hasAuctionStarted &&
                        auctionObj &&
                        !auctionObj.auctionEnded && (
                          <>
                            <AuctionTime />
                            <span
                              style={{
                                border: "1px solid #000000",
                                width: "2px",
                                height: "80%",
                                opacity: "0.2",
                              }}
                            ></span>
                            <HighestBidInfo />
                          </>
                        )}

                      {!nftObj.isNftOwned &&
                        !nftObj.mintFreshNft &&
                        !nftObj.hasAuctionStarted &&
                        !auctionObj && <AuctionNot />}
                      {nftObj.hasAuctionStarted &&
                        auctionObj &&
                        auctionObj.auctionEnded && <AuctionNot />}
                      {nftObj.isNftOwned && !nftObj.hasAuctionStarted && (
                        <AuctionNot />
                      )}
                    </div>
                    <div
                      className="flex justify-start items-center"
                      style={{ height: "18%" }}
                    >
                      {!nftObj.isNftOwned && nftObj.mintFreshNft && (
                        <BuyNftBtn />
                      )}
                      {!nftObj.isNftOwned &&
                        nftObj.hasAuctionStarted &&
                        auctionObj &&
                        !auctionObj.bidPlacedByCurr &&
                        auctionObj.currBiddingTime != 0 && (
                          <>
                            <input
                              type="number"
                              placeholder="Bidding Price ($ONE)"
                              className="p-4 font-bold"
                              style={{
                                height: "40px",
                                width: "150px",
                                border: "1px solid #000000",
                                borderRadius: "10px 0px 0px 10px",
                                fontSize: "20px",
                                opacity: "0.4",
                                ":focus-visible": {
                                  border: "0px solid #000000",
                                },
                              }}
                              step="1"
                              onChange={(e) => setBidPrice(e.target.value)}
                            />
                            <PlaceBidBtn />
                          </>
                        )}
                      {!nftObj.isNftOwned &&
                        nftObj.hasAuctionStarted &&
                        auctionObj &&
                        auctionObj.bidPlacedByCurr && <PlacedBid />}
                      {nftObj.isNftOwned &&
                        !nftObj.hasAuctionStarted &&
                        !auctionObj && (
                          <>
                            <StartAuctionMenu />
                          </>
                        )}
                      {nftObj.isNftOwned && nftObj.hasAuctionStarted && (
                        <>
                          {auctionObj &&
                            auctionObj.currBiddingTime == 0 &&
                            !auctionObj.auctionEnded && <EndAuctionBtn />}
                        </>
                      )}
                      {nftObj.isNftOwned && nftObj.hasAuctionStarted && (
                        <>
                          {auctionObj &&
                            auctionObj.currBiddingTime == 0 &&
                            auctionObj.auctionEnded && <StartAuctionMenu />}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="flex flex-row p-4"
              style={{ height: "55%", width: "100%" }}
            >
              <div
                className="flex flex-col ml-2 mt-4 pr-12"
                style={{ width: "55%", height: "100%" }}
              >
                <span style={styles.entryLabel}>Mint Description:</span>
                <span style={styles.entryDesc}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Facilisi fermentum volutpat sit phasellus accumsan massa urna.
                  Augue at diam lacus viverra risus elit libero ridiculus
                  rutrum. Felis venenatis nunc neque nascetur ornare lacus
                  dictum enim. Metus, curabitur elementum varius molestie.
                  Vestibulum elit lobortis consectetur orci faucibus nec eget
                  ut.
                </span>
                <br />
                <span style={styles.entryLabel}>Token ID:</span>
                <span style={styles.entryDesc}>xxxxxx</span>
              </div>
              <span
                style={{
                  border: "1px solid #000000",
                  width: "2px",
                  height: "80%",
                  opacity: "0.2",
                }}
              ></span>
              <div
                className="mt-4 ml-4 pl-4"
                style={{ width: "45%", height: "100%" }}
              >
                <span style={styles.sectionLabel}>Bid Logs</span>
                <BidsLog />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
