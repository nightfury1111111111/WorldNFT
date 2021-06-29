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

  const getCompressed = (addr) => {
    const len = addr.length;
    return addr.substring(0, 6) + "..." + addr.substring(len - 5, len - 1);
  };

  const getNftByTokenId = async (id) => {
    const nft = await contract.methods.getTokenDetails(id).call();
    const owner = await contract.methods.getOwnerOf(id).call();
    let owner_fmt = getCompressed(owner);
    let locn_nft = {
      token_id: id,
      name: nft.location_name,
      owner: owner,
      owner_fmt: owner_fmt,
    };
    return locn_nft;
  };

  const refreshContractData = async () => {
    let nftObj = await getNftByTokenId(id);
    console.log("nftObj ", nftObj);
    setNftObj(nftObj);
  };

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

  return (
    <div class="">
      <main class="main flex flex-col">
        <div class="main-content">
          <div class="p-6 flex flex-row justify-center">
            <div class="bg-purple-400 flex flex-col items-center justify-center rounded-lg cursor-pointer hover:shadow-md hover:bg-purple-300 h-full w-1/3">
              <div class="relative w-full p-1 flex justify-center">
                <img src={getSvgUri()} width="100px" height="100px"></img>
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
