const IterableMapping = artifacts.require("IterableMapping");
const WorldNFT = artifacts.require("WorldNFT");

const fs = require("fs");

const svg_ny = fs.readFileSync("../assets/ny.svg", "utf8");
const svg_london = fs.readFileSync("../assets/lodon.svg", "utf8");
const svg_mumbai = fs.readFileSync("../assets/mumbai.svg", "utf8");
const svg_cape = fs.readFileSync("../assets/capeTown.svg", "utf8");
const svg_melbourne = fs.readFileSync("../assets/melbourne.svg", "utf8");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(IterableMapping);
  await deployer.link(IterableMapping, WorldNFT);
  await deployer.deploy(WorldNFT, { gas: 10000000 });
  let nftInstance = await WorldNFT.deployed();
  await nftInstance.mint("New York", svg_ny);
  await nftInstance.mint("London", svg_london);
  await nftInstance.mint("Mumbai", svg_mumbai);
  await nftInstance.mint("Cape Town", svg_cape);
  await nftInstance.mint("Melbourne", svg_melbourne);
};
