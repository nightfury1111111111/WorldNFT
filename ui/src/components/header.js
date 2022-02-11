import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./header.css";
import Store from "../stores/store";
import logo from "../assets/img/luv-nft-estate_logo_59_06.png";

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
    return addr.substring(0, 6) + "..." + addr.substring(len - 5, len);
  }

  //   storeUpdated() {
  //     let accountAddress = store.getStore().account;
  //     console.log(accountAddress);
  //     if (accountAddress) {
  //       this.setState({ accountFmt: this.getCompressed(accountAddress) });
  //     }
  //   }

  async componentWillMount() {
    console.log("Header ", this.props);
    const storeUpdated = async () => {
      let accountAddress = store.getStore().account;
      if (accountAddress) {
        this.setState({ accountFmt: this.getCompressed(accountAddress) });
        let contract = store.getStore().dapp_contract;
        if (contract) {
          //   var balance = await contract.methods.balanceOf(accountAddress).call();
          //   console.log("bal ", balance);
        }
      }
    };
    emitter.on("StoreUpdated", storeUpdated);
  }

  render() {
    return (
      <nav
        className={
          "flex items-center justify-between flex-wrap p-2 myHeader headerlayout"
        }
      >
        <div className="flex flex-row items-center mr-6 logoContent">
          {/* <div className="logopart2">
            <div>LUV</div>
            <div>NFT</div>
          </div>
          <div className="logopart1">ESTATE</div> */}
          <img src={logo} />
        </div>
        <div className="flex flex-row headerinfo">
          {this.state.accountFmt ? (
            <span className="p-4 font-bold text-white">
              {this.state.accountFmt}
            </span>
          ) : (
            <span className="p-4 font-bold text-white">
              No account detected!
            </span>
          )}
          <Link
            to={`/`}
            className="p-2 lg:px-2 md:mx-0 rounded hover:bg-gray-200 hover:text-gray-700 transition-colors duration-300"
            style={{ fontSize: "25px" }}
          >
            🏠
          </Link>
          <Link
            to={`/about`}
            className="p-2 lg:px-2 md:mx-0 rounded hover:bg-gray-200 hover:text-gray-700 transition-colors duration-300"
            style={{ fontSize: "25px" }}
          >
            🤔
          </Link>
        </div>
      </nav>
    );
  }
}

export default Header;
