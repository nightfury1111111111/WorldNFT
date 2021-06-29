const WorldToken = artifacts.require("WorldToken");
const LocationNFT = artifacts.require("LocationNFT");

const { getAddress } = require("@harmony-js/crypto");
const web3 = require("web3");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(WorldToken);
  console.log(
    `   WorldToken address: ${WorldToken.address} - ${
      getAddress(WorldToken.address).bech32
    }`
  );
  await deployer.deploy(LocationNFT);
  let nftInstance = await LocationNFT.deployed();
  await nftInstance.mint("New York", 0, 40, 74, true);
  await nftInstance.mint("London", 0, 23, 22, false);
  await nftInstance.mint("Mumbai", 0, 87, 98, true);
  await nftInstance.mint("Delhi", 0, 22, 45, true);
};
