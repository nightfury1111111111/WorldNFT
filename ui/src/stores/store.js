import React, { createContext, useReducer } from "react";
import Web3 from "web3";
import LocationNFT from "../abi/LocationNFT.json";

const Dispatcher = require("flux").Dispatcher;
const Emitter = require("events").EventEmitter;

const dispatcher = new Dispatcher();
const emitter = new Emitter();

class Store {
  constructor() {
    this.store = {
      account: {},
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

  configure = async (payload) => {
    console.log("configure");
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Non-Eth browser detected");
    }
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    store.setStore({ account: accounts[0] });
    const networkId = await web3.eth.net.getId();
    let networkData = LocationNFT.networks[networkId];
    if (networkData) {
      const dapp_contract = new web3.eth.Contract(
        LocationNFT.abi,
        networkData.address
      );
      store.setStore({ dapp_contract: dapp_contract });
    }
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
