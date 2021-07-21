// truffle migrate --reset --network harmony_testnet

require("dotenv").config();
const { TruffleProvider } = require("@harmony-js/core");

require("dotenv").config();
var HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  networks: {
    harmony_testnet: {
      network_id: "2",
      provider: () => {
        const truffleProvider = new TruffleProvider(
          process.env.TESTNET_URL,
          {},
          { shardID: 0, chainId: 2 },
          { gasLimit: process.env.GAS_LIMIT, gasPrice: process.env.GAS_PRICE }
        );
        const newAcc = truffleProvider.addByPrivateKey(
          process.env.TESTNET_PRIVATE_KEY
        );
        truffleProvider.setSigner(newAcc);
        return truffleProvider;
      },
      skipDryRun: true,
    },
    rinkeby: {
      host: "localhost",
      provider: function () {
        return new HDWalletProvider(
          process.env.MNEMONIC_TEST_METAMASK,
          "https://rinkeby.infura.io/v3/" + process.env.ENDPOINT_TEST_METAMASK
        );
      },
      network_id: 4,
      gas: 10777900,
      gasPrice: 10000000000,
    },
  },
  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.6.12", // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    },
  },
  contracts_build_directory: "../ui/src/abi",
};
