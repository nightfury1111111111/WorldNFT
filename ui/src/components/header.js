import React, { Component } from "react";
import { Link } from "react-router-dom";

import Store from "../stores/store";
const store = Store.store;
const emitter = Store.emitter;
const dispatcher = Store.dispatcher;

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountFmt: null,
    };
  }

  getCompressed(addr) {
    const len = addr.length;
    return addr.substring(0, 6) + "..." + addr.substring(len - 5, len - 1);
  }

  //   storeUpdated() {
  //     let accountAddress = store.getStore().account;
  //     console.log(accountAddress);
  //     if (accountAddress) {
  //       this.setState({ accountFmt: this.getCompressed(accountAddress) });
  //     }
  //   }

  async componentWillMount() {
    // console.log("Header ", this.props);
    const storeUpdated = async () => {
      let accountAddress = store.getStore().account;
      if (accountAddress) {
        this.setState({ accountFmt: this.getCompressed(accountAddress) });
        let contract = store.getStore().dapp_contract;
        if (contract) {
          var balance = await contract.methods.balanceOf(accountAddress).call();
          console.log("bal ", balance);
        }
      }
    };
    emitter.on("StoreUpdated", storeUpdated);
  }

  render() {
    return (
      <nav class="flex items-center justify-between flex-wrap bg-red-200 p-6">
        <div class="flex items-center flex-no-shrink text-black mr-6">
          <svg
            class="h-8 w-8 mr-2"
            width="54"
            height="54"
            viewBox="0 0 54 54"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" />
          </svg>
          <span class="font-semibold text-xl tracking-tight">World NFT</span>
        </div>
        <div className="flex flex-row">
          {this.state.accountFmt && (
            <span className="p-2 font-bold">{this.state.accountFmt}</span>
          )}
          {!this.state.accountFmt && (
            <span className="p-2 font-bold">No account detected!</span>
          )}
          <Link to={`/`} className="p-2 px-4 text-white rounded bg-indigo-600">
            Home
          </Link>
          <Link
            to={`/about`}
            class="p-2 lg:px-4 md:mx-2 text-gray-600 rounded hover:bg-gray-200 hover:text-gray-700 transition-colors duration-300"
          >
            About
          </Link>
        </div>
      </nav>
    );
  }
}

export default Header;
