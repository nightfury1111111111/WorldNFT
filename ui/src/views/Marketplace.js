import React, { useState, useEffect, useSelector, useContext } from "react";

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
        let nftObj = {
          tokenId: i,
          name: nft.location_name,
          price: price,
        };
        tmpList.push(nftObj);
      }
      setNftList(tmpList);
    }
  };

  const init = async () => {
    console.log("init marketplace");
    downloadNfts();
  };

  useEffect(() => {
    init();
  }, []);

  const sample = `<svg
  xmlns="http://www.w3.org/2000/svg"
  class="h-6 w-6"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
>
  <path
	stroke-linecap="round"
	stroke-linejoin="round"
	stroke-width="2"
	d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
  />
</svg>`;

  const getSvgUri = () => {
    return "data:image/svg+xml;utf8," + sample;
  };

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
                      <img src={getSvgUri()} width="100px" height="100px"></img>
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
