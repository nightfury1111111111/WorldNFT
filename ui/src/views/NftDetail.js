import React, { useState, useEffect, useSelector } from "react";
import {
  Link,
  Route,
  Switch,
  useParams,
  useRouteMatch,
} from "react-router-dom";

import Store from "../stores/store";
const store = Store.store;
const emitter = Store.emitter;
const dispatcher = Store.dispatcher;

export default function NftDetail() {
  let { id } = useParams();
  const [contract, setContract] = useState(null);
  const [nftObj, setNftObj] = useState({});
  const [auctionObj, setAuctionObj] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bidTime, setBidTime] = useState(100);
  const [timerObj, setTimerObj] = useState(null);
  const [timerEnded, setTimerEnded] = useState(false);

  const getCompressed = (addr) => {
    const len = addr.length;
    return addr.substring(0, 6) + "..." + addr.substring(len - 5, len - 1);
  };

  const getNftByTokenId = async (id) => {
    const nft = await contract.methods.getTokenDetails(id).call();
    const owner = await contract.methods.getOwnerOf(id).call();
    let owner_fmt = getCompressed(owner);
    let price = await contract.methods.getPriceOf(id).call();
    price = window.web3.utils.fromWei(price);
    let svg_uri = "data:image/svg+xml;utf8," + nft.svg_image;
    const isNftOwned = owner == store.getStore().account ? true : false;
    let auctionObj = await contract.methods.getAuctionInfo(id).call();
    let locn_nft = {
      token_id: id,
      name: nft.location_name,
      owner: owner,
      owner_fmt: owner_fmt,
      svg_image: nft.svg_image,
      svg_uri: svg_uri,
      price: price,
      isNftOwned: isNftOwned,
      hasAuctionStarted: auctionObj.isExist,
    };
    return locn_nft;
  };

  const refreshContractData = async () => {
    let nftObj = await getNftByTokenId(id);
    console.log("nftObj ", nftObj);
    setNftObj(nftObj);
    if (nftObj.hasAuctionStarted) {
      refreshAuctionPanel(nftObj.token_id);
    }
  };

  // ~~~~~~~~~~~~~~~~~~~~~ Auction
  useEffect(() => {
    if (!auctionObj) return;
    if (auctionObj.currBiddingTime == auctionObj.origBiddingTime) {
      console.log("Effect: startTimer ", timerObj);
      clearInterval(timerObj);
      setTimerObj(null);
      startTimer();
    } else {
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
      resetTimer();
    }
  };
  const startTimer = () => {
    // console.log("startTimer ");
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
  const updateTimeRemaining = (auctionObj) => {
    console.log("refreshTimer");
    let auctionEndTime = new Date(auctionObj.auctionEndTime * 1000);
    //   console.log("auctionEndTime ", auctionEndTime);
    let timeRemaining = (auctionEndTime.getTime() - Date.now()) / 1000;
    timeRemaining = Math.ceil(timeRemaining);
    console.log("timeRemaining ", timeRemaining);
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
    let auctionObj = {
      token_id: auctionData.tokenId,
      isExist: auctionData.isExist,
      auctionEndTime: auctionData.auctionEndTime,
      origBiddingTime: auctionData.biddingTime,
      currBiddingTime: auctionData.biddingTime,
      timer: timer,
    };
    return auctionObj;
  };
  const refreshAuctionPanel = async (id) => {
    let auctionObj = await getAuctionDetailById(id);
    auctionObj = updateTimeRemaining(auctionObj);
    setAuctionObj(auctionObj);
  };
  // ~~~~~~~~~~~~~~~~~~~~~ Auction

  useEffect(() => {
    if (contract == null) return;
    console.log("contract loaded! ");
    refreshContractData();
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
    let buyAmount = window.web3.utils.toWei("0.01", "Ether");
    console.log("buyAmount ", buyAmount);
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

  const startAuction = async (nftObj) => {
    console.log("startAuction ", bidTime);
    setLoading(true);
    if (contract) {
      contract.methods
        .startAuction(nftObj.token_id, bidTime)
        .send({ from: store.getStore().account, value: 0 })
        .on("transactionHash", (hash) => {
          contract.events.AuctionStarted({}, async (error, event) => {
            console.log("AuctionStarted ", event.returnValues);
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
            // refreshContractData();
          });
        })
        .on("error", (error) => {
          window.alert("Error ", error);
          setLoading(false);
        });
    }
  };

  return (
    <div class="">
      <main class="main flex flex-col">
        <div class="main-content">
          <div class="p-6 flex flex-row justify-center">
            <div class="bg-purple-400 flex flex-col items-center justify-center rounded-lg cursor-pointer hover:shadow-md hover:bg-purple-300 h-full w-1/3">
              <div class="relative w-full p-1 flex justify-center">
                <img src={nftObj.svg_uri} width="100px" height="100px"></img>
              </div>
            </div>
            <div class="bg-gray-400 w-2/3 p-2 m-2">
              <div class="bg-pink-300 rounded p-2">
                <div>Token Id: {id}</div>
                <div class="font-extrabold text-lg">{nftObj.name}</div>
                <div>
                  Owned by <span class="font-medium">{nftObj.owner_fmt}</span>
                </div>
              </div>
              <div class="bg-pink-100 rounded p-2 mt-2">
                <div>Current Price</div>
                <div class="mt-2 flex flex-row items-center">
                  <img
                    src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
                    size="24"
                  ></img>
                  <span class="px-2 text-4xl font-semibold">
                    {nftObj.price}
                  </span>
                  <span class="text-sm font-medium">($123)</span>
                </div>
                <div class="flex justify-center mt-2">
                  {!nftObj.isNftOwned && (
                    <button
                      class="bg-blue-500 text-white font-semibold hover:shadow-lg rounded p-2 w-full disabled:opacity-50"
                      disabled={loading}
                      onClick={() => buyNft(nftObj)}
                    >
                      {!loading && <span>Buy Now</span>}
                      {loading && <span>Buying</span>}
                    </button>
                  )}
                  {nftObj.isNftOwned && (
                    <div class="flex flex-col">
                      <span className="font-bold text-lg text-green-500 mb-1">
                        Owned by me
                      </span>
                      {!nftObj.hasAuctionStarted && (
                        <button
                          class="bg-blue-500 text-white font-semibold hover:shadow-lg rounded p-2 w-full disabled:opacity-50"
                          disabled={loading}
                          onClick={() => startAuction(nftObj)}
                        >
                          {!loading && <span>Start Auction</span>}
                          {loading && <span>Starting ...</span>}
                        </button>
                      )}
                      {nftObj.hasAuctionStarted && (
                        <div class="flex flex-row">
                          <span className="font-bold text-lg text-green-500 mb-1">
                            Auction Started
                          </span>
                          {auctionObj && auctionObj.currBiddingTime == 0 && (
                            <button
                              class="bg-blue-500 text-white font-semibold hover:shadow-lg rounded p-2 w-full disabled:opacity-50"
                              disabled={loading}
                              onClick={() => endAuction(nftObj)}
                            >
                              {!loading && <span>End Auction</span>}
                              {loading && <span>Ending ...</span>}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {auctionObj && (
                <div class="bg-green-100 rounded p-2 mt-2">
                  <div>Auction Details</div>
                  <div class="mt-2 flex flex-row items-center">
                    {auctionObj.timer && (
                      <span class="pr-2">
                        Time Left: {auctionObj.timer.m}:{auctionObj.timer.s}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
