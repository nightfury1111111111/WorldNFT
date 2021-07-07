const WorldToken = artifacts.require("WorldToken");
const IterableMapping = artifacts.require("IterableMapping");
const LocationNFT = artifacts.require("LocationNFT");
const Counter = artifacts.require("Counter");

const { getAddress } = require("@harmony-js/crypto");
const web3 = require("web3");
const fs = require("fs");

const svg_ny = fs.readFileSync("../assets/ny.svg", "utf8");
const svg_london = fs.readFileSync("../assets/lodon.svg", "utf8");
const svg_mumbai = fs.readFileSync("../assets/mumbai.svg", "utf8");
const svg_cape = fs.readFileSync("../assets/capeTown.svg", "utf8");
const svg_melbourne = fs.readFileSync("../assets/melbourne.svg", "utf8");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Counter);
  //   await deployer.deploy(IterableMapping);
  //   await deployer.link(IterableMapping, LocationNFT);
  //   await deployer.deploy(LocationNFT, { gas: 10000000 });
  //   let nftInstance = await LocationNFT.deployed();
  //   await nftInstance.mint("New York", svg_ny, 0, 40, 74, true);
  //   await nftInstance.mint("London", svg_london, 0, 23, 22, true);
  //   await nftInstance.mint("Mumbai", svg_mumbai, 0, 87, 98, true);
  //   await nftInstance.mint("Cape Town", svg_cape, 0, 22, 45, true);
  //   await nftInstance.mint("Melbourne", svg_melbourne, 0, 22, 45, true);
};
