World NFT

Config:
Add .env file inside truffle.
add the following environment vars:
TESTNET_URL = 'https://api.s0.b.hmny.io'
TESTNET_PRIVATE_KEY = <private key of harmony wallet account>

Deploy the solidity contract on Harmony blockchain:
cd truffle
truffle migrate --reset --network harmony_testnet

Run UI:
cd ui
yarn start

![Home Screen](https://github.com/swapp1990/WorldNFT/blob/master/screenshot/nft1.jpg?raw=true)
