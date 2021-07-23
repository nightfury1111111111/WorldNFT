//Initialize harmony contract: https://github.com/harmony-one/sdk/tree/master/packages/harmony-contract

import React, { createContext, useReducer } from "react";
import fs from "fs";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
// import LocationNFT from "../abi/LocationNFT.json";
// import Counter from "../abi/Counter.json";
import WorldNFT from "../abi/WorldNFT.json";

const Dispatcher = require("flux").Dispatcher;
const Emitter = require("events").EventEmitter;

const dispatcher = new Dispatcher();
const emitter = new Emitter();

const BN = require("bn.js");

const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType } = require("@harmony-js/utils");
const hmy = new Harmony("https://api.s0.b.hmny.io", {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyTestnet,
});

const HMY_PRIVATE_KEY = process.env.HMY_PRIVATE_KEY;
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

  configureEthMetamask = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Non-Eth browser detected");
      return;
    }
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    store.setStore({ account: accounts[0] });
    const networkId = await web3.eth.net.getId();
    // let networkData = LocationNFT.networks[networkId];
    // if (networkData) {
    //   const dapp_contract = new web3.eth.Contract(
    //     LocationNFT.abi,
    //     networkData.address
    //   );
    //   store.setStore({ dapp_contract: dapp_contract });
    // }
  };
  configureHarmonyWeb3 = async () => {
    const web3 = new Web3(HMY_RPC_URL);
    let hmyMasterAccount =
      web3.eth.accounts.privateKeyToAccount(HMY_PRIVATE_KEY);
    web3.eth.accounts.wallet.add(hmyMasterAccount);
    web3.eth.defaultAccount = hmyMasterAccount.address;
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
  };
  configureHarmonyOneWallet = async () => {
    setTimeout(async () => {
      if (window.onewallet && window.onewallet.isOneWallet) {
        const onewallet = window.onewallet;
        const getAccount = await onewallet.getAccount();
        console.log("onewallet ", getAccount);
        store.setStore({ account: getAccount.address });
        const abi = WorldNFT.abi;
        const contractAddress = WorldNFT.networks["2"].address;
        console.log("WorldNFT contract", contractAddress);
        const contract = hmy.contracts.createContract(abi, contractAddress);
        console.log(contract.methods);
        store.setStore({ dapp_contract: contract });
      }
    }, 1000);
  };

  signInMetamask = async () => {
    const provider = await detectEthereumProvider();
    if (provider !== window.ethereum) {
      console.error("Do you have multiple wallets installed?");
    }
    if (!provider) {
      console.error("Metamask not found");
      return;
    }
    console.log("metamask found");
    // provider.request({method: 'eth_requestAccounts'})
  };

  sendTestTransaction = async (web3) => {
    const receiverAddress = "0x2f539d46a3bc63847e3c0fA121360dA17b772BBb";
    const gas = 6721900;
    const gasPrice = new BN(await web3.eth.getGasPrice()).mul(new BN(1));

    const result = await web3.eth
      .sendTransaction({
        from: store.getStore().account,
        to: receiverAddress,
        value: 100 * 1e18, // 1ONE
        gasPrice,
        gas,
      })
      .on("error", console.error)
      .on("transactionHash", (transactionHash) => {
        alert(`Transaction is sending: ${transactionHash}`);
      });
    console.log(`Send tx: ${result.transactionHash} result: `, result.status);
  };

  configureHarmonyMetamask = async () => {
    // @ts-ignore
    // this.signInMetamask();
    if (!window.web3) {
      window.alert("No metamask found! Please install!");
      return;
    }
    const web3 = new Web3(window.web3.currentProvider);
    const accounts = await web3.eth.getAccounts();
    // console.log(accounts);
    store.setStore({ account: accounts[0] });
    // this.sendTestTransaction(web3);
    const contractAddress = WorldNFT.networks["2"].address;
    console.log("WorldNFT contract", contractAddress);
    const abi = WorldNFT.abi;
    const dapp_contract = new web3.eth.Contract(abi, contractAddress);
    store.setStore({ dapp_contract: dapp_contract });
  };

  configure = async (payload) => {
    // this.configureHarmonyOneWallet();
    this.configureHarmonyMetamask();
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
