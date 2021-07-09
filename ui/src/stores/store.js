//Initialize harmony contract: https://github.com/harmony-one/sdk/tree/master/packages/harmony-contract

import React, { createContext, useReducer } from "react";
import fs from "fs";
import Web3 from "web3";
// import LocationNFT from "../abi/LocationNFT.json";
// import Counter from "../abi/Counter.json";
import WorldNFT from "../abi/WorldNFT.json";

import hmy from "../utils/hmy";

const Dispatcher = require("flux").Dispatcher;
const Emitter = require("events").EventEmitter;

const dispatcher = new Dispatcher();
const emitter = new Emitter();

const BN = require("bn.js");

const HMY_PRIVATE_KEY =
  "0x2ad02df943f2a1b1ea7c513e0b9cbd1162724cd61987dc59d705d721876ea7f8";
const HMY_RPC_URL = "https://api.s0.b.hmny.io";

class Store {
  constructor() {
    this.store = {
      account: null,
    };

    dispatcher.register(
      function (payload) {
        switch (payload.type) {
          case "CONFIGURE":
            this.configure(payload);
            break;
          case "GET_NFT_BY_ID":
            this.getNftById(payload);
            break;
          default: {
          }
        }
      }.bind(this)
    );
  }

  //   initializeContract = async (wallet) => {
  //     const abi = Counter.abi;
  //     const contractAddress = Counter.networks["2"].address;
  //     console.log(contractAddress);
  //     const contractInstance = hmy.contracts.createContract(abi, contractAddress);
  //     return contractInstance;
  //   };

  configure = async (payload) => {
    const web3 = new Web3(HMY_RPC_URL);
    let hmyMasterAccount =
      web3.eth.accounts.privateKeyToAccount(HMY_PRIVATE_KEY);
    // console.log("master ", hmyMasterAccount);
    // web3.eth.accounts.wallet.add(hmyMasterAccount);
    if (window.onewallet && window.onewallet.isOneWallet) {
      const onewallet = window.onewallet;
      const getAccount = await onewallet.getAccount();
      console.log("onewallet ", onewallet);
      //   web3.eth.accounts.wallet.add(getAccount);
      web3.eth.defaultAccount = getAccount.address;
    }
    // web3.eth.defaultAccount = hmyMasterAccount.address;
    const myAddress = web3.eth.defaultAccount;
    console.log("My address: ", myAddress);
    const balance = await web3.eth.getBalance(myAddress);
    console.log("My balance: ", balance / 1e18);
    store.setStore({ account: myAddress });
    const contractAddress = WorldNFT.networks["2"].address;
    console.log("WorldNFT contract", contractAddress);
    const abi = WorldNFT.abi;
    const dapp_contract = new web3.eth.Contract(abi, contractAddress);
    store.setStore({ dapp_contract: dapp_contract });

    // const gasPrice = new BN(await web3.eth.getGasPrice()).mul(new BN(1));
    // const gasLimit = 6721900;
    // const value = 1 * 1e18; // 1 ONE

    // console.log("configure ", window.onewallet);
    // setTimeout(async () => {
    //   if (window.onewallet && window.onewallet.isOneWallet) {
    //     const onewallet = window.onewallet;
    //     const getAccount = await onewallet.getAccount();
    //     console.log("onewallet ", getAccount.address);
    //     store.setStore({ account: getAccount.address });
    //     let contract = await this.initializeContract(onewallet);
    //     store.setStore({ dapp_contract: contract });
    //   }
    // }, 1000);
    // if (window.ethereum) {
    //   window.web3 = new Web3(window.ethereum);
    //   await window.ethereum.enable();
    // } else if (window.web3) {
    //   window.web3 = new Web3(window.web3.currentProvider);
    // } else {
    //   window.alert("Non-Eth browser detected");
    //   return;
    // }
    // const web3 = window.web3;
    // const accounts = await web3.eth.getAccounts();
    // store.setStore({ account: accounts[0] });
    // const networkId = await web3.eth.net.getId();
    // let networkData = LocationNFT.networks[networkId];
    // if (networkData) {
    //   const dapp_contract = new web3.eth.Contract(
    //     LocationNFT.abi,
    //     networkData.address
    //   );
    //   store.setStore({ dapp_contract: dapp_contract });
    // }
  };

  getNftById = async (payload) => {
    console.log("getNftById ", payload);
  };

  getStore() {
    return this.store;
  }

  setStore(obj) {
    this.store = { ...this.store, ...obj };
    return emitter.emit("StoreUpdated");
  }
}

const store = new Store();
const stores = {
  store: store,
  dispatcher: dispatcher,
  emitter: emitter,
};
export default stores;
