## ONE World NFT
ONE World is a collectible NFT marketplace for real-world locations on planet Earth.

**Features**
1. Can buy a NFT using ONE tokens
2. Can see details about minted NFTs
3. Can start multiple auctions to get biddings for owned NFTs
4. Can bid on multiple NFTs which are available on auction sales
5. Can withdraw a bid
6. Transfer ownership of NFT and ONE tokens between the highest bid winner and the auction owner

Config:
* Add .env file inside truffle.
* add the following environment vars:
  * TESTNET_URL = 'https://api.s0.b.hmny.io'
  * TESTNET_PRIVATE_KEY = "private key of harmony wallet account"

Deploy the solidity contract on Harmony blockchain:
* `cd truffle`
* `truffle migrate --reset --network harmony_testnet`

Run UI:
* `cd ui`
* `yarn start`
* visit localhost:3000
* Deployed on Vercel at https://world-nft.vercel.app/

**Screenshots**

1. Home Screen
![Home Screen](https://github.com/swapp1990/WorldNFT/blob/master/screenshot/nft1.JPG?raw=true)

2. Connect Metamask and Create a new Custom RPC for connecting with Harmony Testnet:
https://docs.harmony.one/home/network/wallets/browser-extensions-wallets/metamask-wallet

![Metamask](https://github.com/swapp1990/WorldNFT/blob/master/screenshot/nft2.JPG?raw=true)

3. Marketplace
![Marketplace](https://github.com/swapp1990/WorldNFT/blob/master/screenshot/nft3.JPG?raw=true)

4. NFT Detail Page
![Detail](https://github.com/swapp1990/WorldNFT/blob/master/screenshot/nft4.JPG?raw=true)

5. NFT Auction Started
![Auction](https://github.com/swapp1990/WorldNFT/blob/master/screenshot/nft5.JPG?raw=true)



