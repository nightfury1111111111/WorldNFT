// import config from "../config";
// import async from "async";
// import {
//   ERROR,
//   CONFIGURE,
//   CONFIGURE_RETURNED,
//   GET_BALANCES,
//   GET_BALANCES_RETURNED,
//   GET_BALANCES_PERPETUAL,
//   GET_BALANCES_PERPETUAL_RETURNED,
//   GET_NFT_MINTS,
//   WalletConnectionError,
// } from "../constants";

// import { OneWalletConnector } from "@harmony-react/onewallet-connector";
// import { Hmy } from "@harmony-utils/wrappers";
// import Web3 from "web3";

// const Dispatcher = require("flux").Dispatcher;
// const Emitter = require("events").EventEmitter;

// const dispatcher = new Dispatcher();
// const emitter = new Emitter();

// class Store {
//   constructor() {
//     const hmy = new Hmy(config.testnet.network);
//     const onewallet = new OneWalletConnector({ chainId: hmy.client.chainId });

//     this.store = {
//       account: {},
//       connectorsByName: {
//         OneWallet: onewallet,
//       },
//       hmy: hmy,
//       currentBlock: 0,
//       tokens: [
//         {
//           address: config.testnet.addresses.token,
//           name: "TestToken",
//           symbol: "TST",
//           decimals: 18,
//           balance: 0,
//         },
//       ],
//       worldToken: null,
//       nftToken: {
//         address: config.testnet.addresses.nftContract,
//       },
//       nftLocations: [],
//     };

//     dispatcher.register(
//       function (payload) {
//         switch (payload.type) {
//           case CONFIGURE:
//             this.configure(payload);
//             break;
//           case GET_BALANCES_PERPETUAL:
//             this.getBalancesPerpetual(payload);
//             break;
//           case GET_NFT_MINTS:
//             this.getMintedNFTs(payload);
//             break;
//           default: {
//           }
//         }
//       }.bind(this)
//     );
//   }

//   configure = async () => {
//     const hmy = store.getStore("hmy");
//     let currentBlock = await hmy.getBlockNumber();
//     // console.log("currentBlock ", currentBlock);
//     store.setStore({ currentBlock: currentBlock });
//   };

//   getBalancesPerpetual = async () => {
//     const tokens = store.getStore("tokens");
//     const account = store.getStore("account");
//     const hmy = store.getStore("hmy");

//     const currentBlock = await hmy.getBlockNumber();

//     store.setStore({ currentBlock: currentBlock });

//     async.map(
//       tokens,
//       (token, callback) => {
//         async.parallel(
//           [
//             (callback) => {
//               this.getERC20Balance(hmy, token, account, callback);
//             },
//           ],
//           (err, data) => {
//             if (err) {
//               console.log(err);
//               return callback(err);
//             }

//             token.balance = data[0];
//             callback(null, token);
//           }
//         );
//       },
//       (err, tokenData) => {
//         if (err) {
//           console.log(err);
//           return emitter.emit(ERROR, err);
//         }
//         store.setStore({ tokens: tokenData });
//         emitter.emit(GET_BALANCES_PERPETUAL_RETURNED);
//         emitter.emit(GET_BALANCES_RETURNED);
//       }
//     );
//   };

//   getMintedNFTs = async () => {
//     const nftContractToken = store.getStore("nftToken");
//     const account = store.getStore("account");
//     const hmy = store.getStore("hmy");

//     if (account && account.address) {
//       let nftContract = hmy.client.contracts.loadContract(
//         require("../abi/LocationNFT.json"),
//         nftContractToken.address
//       );
//       console.log("nftContract ", nftContract);
//     }
//   };

//   getERC20Balance = async (hmy, token, account, callback) => {
//     if (account && account.address) {
//       let erc20Contract = hmy.client.contracts.createContract(
//         require("../abi/ERC20.json"),
//         token.address
//       );

//       try {
//         var balance = await erc20Contract.methods
//           .balanceOf(account.address)
//           .call(hmy.gasOptions());
//         balance = parseFloat(balance) / 10 ** token.decimals;
//         callback(null, Math.ceil(balance));
//       } catch (err) {
//         console.log(err);
//         return callback(err);
//       }
//     } else {
//       callback(null);
//     }
//   };

//   getStore(index) {
//     return this.store[index];
//   }

//   setStore(obj) {
//     this.store = { ...this.store, ...obj };
//     return emitter.emit("StoreUpdated");
//   }
// }

// const store = new Store();
// const stores = {
//   store: store,
//   dispatcher: dispatcher,
//   emitter: emitter,
// };
// export default stores;
