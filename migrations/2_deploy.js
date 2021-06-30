const WorldToken = artifacts.require("WorldToken");
const LocationNFT = artifacts.require("LocationNFT");

const { getAddress } = require("@harmony-js/crypto");
const web3 = require("web3");
const fs = require("fs");

const svg_sample = fs.readFileSync("../assets/heart.svg", "utf8");

module.exports = async function (deployer, network, accounts) {
  //   console.log(svg_sample);
  await deployer.deploy(WorldToken);
  await deployer.deploy(LocationNFT);
  let nftInstance = await LocationNFT.deployed();
  await nftInstance.mint("New York", svg_sample, 0, 40, 74, true);
  await nftInstance.mint("London", svg_sample, 0, 23, 22, false);
  await nftInstance.mint("Mumbai", svg_sample, 0, 87, 98, true);
  await nftInstance.mint("Delhi", svg_sample, 0, 22, 45, true);
};
