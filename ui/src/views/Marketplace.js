import React, { useState, useEffect, useSelector, useContext } from "react";
import {
  Units,
  Unit,
  numberToString,
  add0xToString,
  fromWei,
  toWei,
  numToStr,
} from "@harmony-js/utils";
import { BN } from "@harmony-js/crypto";

import { useHistory } from "react-router-dom";

import Store from "../stores/store";
const store = Store.store;
const emitter = Store.emitter;
const dispatcher = Store.dispatcher;

export default function Marketplace() {
  const route_history = useHistory();
  const [nftCount, setNftCount] = useState(0);
  const [nftList, setNftList] = useState([]);

  useEffect(() => {
    console.log(nftList);
  }, [nftList]);

  const downloadData = async () => {
    let contract = store.getStore().dapp_contract;
    if (contract) {
      //   console.log(contract);
      const value = await contract.methods.getMoneyStored().call();
      console.log("value ", Number(value));
      const one = new BN("1");
      let options = {
        gasPrice: 1000000000,
        gasLimit: 210000,
        value: toWei(one, Units.one),
      };
      const increment = await contract.methods.addMoney().send(options);
      console.log("increment ", increment);
    }
  };

  const downloadNfts = async () => {
    let contract = store.getStore().dapp_contract;
    if (contract) {
      var nftCount = await contract.methods.nextId().call();
      setNftCount(nftCount);
      let tmpList = [];
      for (var i = 0; i < nftCount; i++) {
        const nft = await contract.methods.getTokenDetails(i).call();
        // console.log(nft);
        let price = await contract.methods.getPriceOf(i).call();
        // console.log(window.web3.utils.fromWei(price));
        price = window.web3.utils.fromWei(price);
        let svg_uri = "data:image/svg+xml;utf8," + nft.svg_image;
        let nftObj = {
          tokenId: i,
          name: nft.location_name,
          svg_image: nft.svg_image,
          svg_uri: svg_uri,
          price: price,
        };
        tmpList.push(nftObj);
      }
      setNftList(tmpList);
    }
  };

  const init = async () => {
    console.log("init marketplace");
    const storeUpdated = async () => {
      //   downloadNfts();
      downloadData();
    };
    emitter.on("StoreUpdated", storeUpdated);
    // downloadNfts();
    downloadData();
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

  return (
    <div class="flex flex-row min-h-screen">
      <aside class="sidebar w-64 bg-indigo-500">
        <div class="sidebar-header flex items-center justify-center py-4">
          <div class="inline-flex">
            <a href="#" class="inline-flex items-center">
              <svg
                class="w-10 h-10 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M11.757 2.034a1 1 0 01.638.519c.483.967.844 1.554 1.207 2.03.368.482.756.876 1.348 1.467A6.985 6.985 0 0117 11a7.002 7.002 0 01-14 0c0-1.79.684-3.583 2.05-4.95a1 1 0 011.707.707c0 1.12.07 1.973.398 2.654.18.374.461.74.945 1.067.116-1.061.328-2.354.614-3.58.225-.966.505-1.93.839-2.734.167-.403.356-.785.57-1.116.208-.322.476-.649.822-.88a1 1 0 01.812-.134zm.364 13.087A2.998 2.998 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879.586.585.879 1.353.879 2.121s-.293 1.536-.879 2.121z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="font-bold ml-1 uppercase">Filter</span>
            </a>
          </div>
        </div>
        <div class="sidebar-content px-4 py-6">
          <ul class="flex flex-col w-full">
            <li>
              <a
                href="#"
                class="flex flex-row items-center rounded-lg text-gray-700 bg-gray-400 h-10 px-3 "
              >
                <span class="ml-3">Dashboard</span>
              </a>
            </li>
            <li class="my-px">
              <span class="flex font-medium text-sm text-gray-300 px-4 my-4 uppercase">
                Projects
              </span>
            </li>
            <li>
              <a
                href="#"
                class="flex flex-row items-center rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-700 h-10 px-3 "
              >
                <span class="ml-3">Status</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                class="flex flex-row items-center rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-700 h-10 px-3 "
              >
                <span class="ml-3">Price</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                class="flex flex-row items-center rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-700 h-10 px-3 "
              >
                <span class="ml-3">Categories</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
      <main class="main flex flex-col flex-grow">
        <header class="header bg-white shadow py-4 px-4">
          NFTs minted: {nftCount}
        </header>
        <div class="main-content">
          <div class="w-full p-6">
            <div class="grid grid-cols-3 gap-4">
              {nftList.map((nft) => {
                return (
                  <div
                    class="bg-purple-400 w-full flex flex-col items-center justify-center rounded-lg cursor-pointer hover:shadow-md hover:bg-purple-300 h-full"
                    onClick={() => routeToDetail(nft.tokenId)}
                  >
                    <div class="relative w-full p-1 flex justify-center">
                      <div
                        dangerouslySetInnerHTML={{ __html: nft.svg_image }}
                      ></div>
                      {/* <img
                        src={getTestSvgUri()}
                        width="100px"
                        height="100px"
                      ></img> */}
                    </div>
                    <div class="p-2 font-semibold">{nft.name}</div>
                    <div class="mb-1 font-semibold">{nft.price} ETH</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
