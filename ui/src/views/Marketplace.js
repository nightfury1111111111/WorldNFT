import React, { useState, useEffect, useSelector, useContext } from "react";
import {
  Units,
  Unit,
  numberToString,
  hexToNumber,
  add0xToString,
  fromWei,
  toWei,
  numToStr,
} from "@harmony-js/utils";
import { BN } from "@harmony-js/crypto";
import { Iconly } from "react-iconly";

import { useHistory } from "react-router-dom";

import Store from "../stores/store";
const store = Store.store;
const emitter = Store.emitter;
const dispatcher = Store.dispatcher;

export default function Marketplace() {
  const route_history = useHistory();
  const [nftCount, setNftCount] = useState(0);
  const [nftList, setNftList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // console.log(nftList);
    setLoading(false);
  }, [nftList]);

  const downloadData = async () => {
    let contract = store.getStore().dapp_contract;
    if (contract) {
      console.log(contract);
      //   const value = await contract.methods.getMoneyStored().call();
      //   console.log("value ", Number(value));
      //   const one = new BN("1");
      //   let options = {
      //     from: store.getStore().account,
      //     gasPrice: 1000000000,
      //     gasLimit: 210000,
      //     value: toWei(one, Units.one),
      //   };
      //   const increment = await contract.methods.addMoney().send(options);
      //   console.log("increment ", increment);
    }
  };

  const downloadNfts = async () => {
    let contract = store.getStore().dapp_contract;
    if (contract) {
      let nftCount = await contract.methods.nextId().call();
      console.log("nftCount", nftCount);
      setNftCount(nftCount);
      let tmpList = [];
      //test_nft
      //   let testNftObj = {
      //     tokenId: 0,
      //     name: "Mumbai",
      //     svg_image: "",
      //     price: "2",
      //     isNftOwned: true,
      //   };
      //   tmpList = [testNftObj];

      //From blockchain
      for (var i = 0; i < nftCount; i++) {
        const nft = await contract.methods.getTokenDetails(i).call();
        const owner = await contract.methods.getOwnerOf(i).call();
        let price = await contract.methods.getPriceOf(i).call();
        //For ETH
        // price = window.web3.utils.fromWei(price);
        price = fromWei(price, Units.one);
        const isNftOwned = owner == store.getStore().account ? true : false;
        let nftObj = {
          tokenId: i,
          name: nft.location_name,
          svg_image: nft.svg_image,
          price: price,
          isNftOwned: isNftOwned,
        };
        tmpList.push(nftObj);
      }
      setNftList(tmpList);
    }
  };

  const init = async () => {
    setLoading(true);
    const storeUpdated = async () => {
      downloadNfts();
      //   downloadData();
    };
    emitter.on("StoreUpdated", storeUpdated);
    downloadNfts();
    // downloadData();
  };

  useEffect(() => {
    init();
  }, []);

  const svgStr = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <g id="Layer_1">
   <title>Layer 1</title>
   <path id="svg_8" d="m46.40466,156.36518c-0.46792,-3.85841 0.89525,-7.86339 -1.38237,-11.63227c-3.70295,-8.2892 -11.88839,-15.57542 -15.57755,-23.84596c-1.59532,-5.54907 -4.29668,-11.4896 -1.11062,-16.98611c4.60731,-6.75285 12.20944,-12.91454 22.35271,-16.99646c5.69041,-2.26905 16.58472,0.59874 16.60981,-5.45254c1.79929,-6.90063 7.66707,-13.31098 15.14004,-18.58697c8.87227,-5.77761 23.82855,-6.86194 35.40073,-3.54078c6.55467,1.4416 13.37319,3.93801 14.82725,8.36869c-1.01353,4.3696 6.6367,7.39975 6.16562,11.40534c-6.94496,-0.01116 -13.621,0.74472 -19.42264,3.30099c-4.07242,1.28351 -13.13648,2.00842 -6.40092,5.24043c6.31293,7.00958 6.15342,15.85885 0.01213,22.9023c-4.09271,5.48685 -9.32705,10.94683 -18.06684,14.20156c-6.63657,3.02148 -13.79603,5.59164 -21.19724,7.85667c-5.7752,3.69111 2.64588,9.0041 4.8233,12.82399c1.67091,1.16916 2.24677,3.58261 5.54177,3.00157c7.59121,0.08394 16.26977,-0.63777 22.34055,2.57985c-4.44148,2.72753 -12.85991,-0.46571 -18.88483,1.58527c-4.36056,1.9015 -9.46747,2.45633 -15.57625,2.50319c-6.57349,1.42066 -13.52425,-1.19353 -19.41124,0.55136c-2.04309,0.13618 -4.16338,1.12343 -6.18342,0.71987l0,-0.00001zm28.94572,-5.35382c-2.40486,-3.2616 -10.20015,0.51812 -3.03091,0.76902c1.14614,-0.15551 6.36311,1.00331 3.03091,-0.76902zm-8.8655,-1.42806c7.36479,-3.08326 3.84619,-8.4144 -0.8892,-11.76712c-1.61037,-0.98253 -2.35134,-2.95337 -4.53644,-3.28255c-3.34414,0 -6.68826,0 -10.0324,0c-2.30977,2.80441 -1.23366,5.89985 0.44308,8.72865c1.74351,3.59445 3.06084,9.44674 11.70161,7.59656c1.33127,-0.15187 2.43312,-0.68509 3.31335,-1.27554z" stroke-dasharray="2,2" stroke-width="0" stroke="#000" fill="#FABA6F"/>
   <text stroke-dasharray="2,2" transform="matrix(1.9333 0 0 1.92004 -71.6645 -225.118)" stroke="#5B9BA2" font-style="normal" font-weight="normal" text-anchor="start" font-family="'Sacramento'" font-size="22" id="svg_2" y="148.55657" x="48.70827" stroke-width="0" fill="#BF7E96">Melbourne</text>
  </g>
 
 </svg>`;

  const routeToDetail = (id) => {
    console.log("click ", id);
    route_history.push("/nft/" + id);
  };

  const Styles = {
    filterOption: {
      color: "#000000",
      fontWeight: 600,
      fontSize: "22px",
      fontStyle: "normal",
    },
    sortSelectedOption: {
      backgroundColor: "",
      border: "0px solid rgba(0, 0, 0, 0.25)",
      borderRadius: "10px",
      boxShadow: "8px 8px 4px rgba(0, 0, 0, 0.25)",
      padding: "10px",
      width: "100px",
    },
    sortOptionsBtn: {
      fontWeight: 600,
      fontSize: "22px",
    },
  };

  return (
    <div className="flex flex-row home" style={{ height: "90vh" }}>
      <aside
        className="sidebar"
        style={{
          backgroundColor: "rgba(196, 196, 196,0.2)",
          width: "18%",
        }}
      >
        <div className="sidebar-header flex py-4 px-2">
          <span
            className="self-start"
            style={{
              color: "#000000",
              fontWeight: 600,
              fontSize: "50px",
              fontStyle: "normal",
              lineHeight: "73px",
            }}
          >
            Filter
          </span>
        </div>
        <div className="sidebar-content">
          <ul className="flex flex-col w-full">
            <li>
              <a
                href="#"
                className="flex flex-row justify-between items-center rounded-lg h-20 px-3 "
              >
                <span style={Styles.filterOption}>Categories</span>
                <Iconly
                  name="ChevronDownCircle"
                  set="two-tone"
                  primaryColor="black"
                  size="large"
                />
              </a>
              <div className="flex items-center px-3">
                <span
                  style={{
                    border: "1px solid #000000",
                    width: "100%",
                    opacity: "0.1",
                  }}
                ></span>
              </div>
            </li>
            <li className="my-px">
              <a
                href="#"
                className="flex flex-row justify-between items-center rounded-lg h-20 px-3 "
              >
                <span style={Styles.filterOption}>Price</span>
                <Iconly
                  name="ChevronDownCircle"
                  set="two-tone"
                  primaryColor="black"
                  size="large"
                />
              </a>
              <div className="flex items-center px-3">
                <span
                  style={{
                    border: "1px solid #000000",
                    width: "100%",
                    opacity: "0.1",
                  }}
                ></span>
              </div>
            </li>
            <li>
              <a
                href="#"
                className="flex flex-row justify-between  items-center rounded-lg h-20 px-3 "
              >
                <span style={Styles.filterOption}>Status</span>
                <Iconly
                  name="ChevronDownCircle"
                  set="two-tone"
                  primaryColor="black"
                  size="large"
                />
              </a>
              <div className="flex items-center px-3">
                <span
                  style={{
                    border: "1px solid #000000",
                    width: "100%",
                    opacity: "0.1",
                  }}
                ></span>
              </div>
            </li>
          </ul>
        </div>
      </aside>
      <main className="main flex flex-col flex-grow">
        <header className="header bg-white shadow py-4 px-4">
          {/* NFTs minted: {nftCount} */}
          <div className="flex justify-between">
            <div>
              <button
                className="flex flex-row justify-between"
                style={Styles.sortSelectedOption}
              >
                Latest
                <Iconly
                  name="CloseSquare"
                  set="two-tone"
                  primaryColor="black"
                  size="medium"
                />
              </button>
            </div>
            <div className="flex flex-row">
              <span className="mr-2" style={Styles.sortOptionsBtn}>
                Sort by
              </span>
              <Iconly
                name="ChevronDownCircle"
                set="two-tone"
                primaryColor="black"
                size="medium"
              />
            </div>
          </div>
        </header>
        <div className="main-content">
          <div className="w-full p-6">
            {loading && <span>Loading ...</span>}
            {!loading && (
              <div className="grid grid-cols-3 gap-4">
                {nftList.map((nft, idx) => {
                  return (
                    <div
                      className="w-full flex flex-col items-center justify-center rounded-lg cursor-pointer hover:shadow-md h-full"
                      style={{
                        width: "350px",
                        height: "370px",
                        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                      }}
                      onClick={() => routeToDetail(nft.tokenId)}
                      key={idx}
                    >
                      {/* {nft.isNftOwned && (
                        <div className="p-2 font-semibold">Owned</div>
                      )} */}
                      <div
                        className="relative w-full p-1 flex justify-center m-2"
                        style={{
                          height: "85%",
                          background:
                            "radial-gradient(77.96% 81.64% at 50% 50%, #FFFFFF 0%, #FFCA0E 100%)",
                        }}
                      >
                        <div
                          dangerouslySetInnerHTML={{ __html: nft.svg_image }}
                        ></div>
                        {/* <img
                        src={getTestSvgUri()}
                        width="100px"
                        height="100px"
                      ></img> */}
                      </div>
                      <div
                        className="flex justify-between w-full"
                        style={{
                          height: "10%",
                        }}
                      >
                        <div className="ml-2 flex flex-row">
                          <Iconly
                            name="Heart2"
                            set="two-tone"
                            primaryColor="black"
                            size="medium"
                          />
                          <span
                            style={{
                              color: "#828282",
                              fontFamily: "Montserrat",
                              fontWeight: 600,
                              fontSize: "20px",
                              fontStyle: "normal",
                              lineHeight: "22px",
                            }}
                          >
                            &nbsp;23
                          </span>
                        </div>
                        <div className="mr-2">
                          <span
                            style={{
                              color: "#5D5D5D",
                              fontFamily: "Montserrat",
                              fontWeight: 600,
                              fontSize: "20px",
                              fontStyle: "normal",
                              lineHeight: "25px",
                            }}
                          >
                            current bid
                          </span>
                        </div>
                      </div>
                      <div
                        className="flex justify-between w-full"
                        style={{
                          height: "10%",
                        }}
                      >
                        <div className="ml-2">
                          <span
                            className="uppercase"
                            style={{
                              color: "#FFCA0E",
                              fontWeight: 600,
                              fontSize: "21px",
                              fontStyle: "normal",
                              lineHeight: "28px",
                            }}
                          >
                            {nft.name}
                          </span>
                        </div>
                        <div className="mr-2">
                          <span
                            className="uppercase"
                            style={{
                              color: "#FFCA0E",
                              fontWeight: 600,
                              fontSize: "21px",
                              fontStyle: "normal",
                              lineHeight: "28px",
                            }}
                          >
                            {nft.price}&nbsp;
                          </span>
                          <span
                            className="uppercase"
                            style={{
                              color: "#FFCA0E",
                              fontWeight: 600,
                              fontSize: "20px",
                              fontStyle: "normal",
                              lineHeight: "28px",
                            }}
                          >
                            ONE
                          </span>
                        </div>
                      </div>
                      <hr />
                      <div
                        className="flex justify-between w-full mt-2"
                        style={{
                          height: "10%",
                        }}
                      >
                        <div className="ml-2">
                          <span
                            style={{
                              color: "#828282",
                              fontFamily: "Montserrat",
                              fontWeight: 600,
                              fontSize: "18px",
                              fontStyle: "normal",
                              lineHeight: "22px",
                            }}
                          >
                            Owned by
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
