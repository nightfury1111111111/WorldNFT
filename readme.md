## ONE World NFT

ONE World is a collectible NFT marketplace for real-world locations on planet Earth.

**Features**

1. Can buy a NFT using ONE tokens
2. Can see details about minted NFTs
3. Can start multiple auctions to get biddings for owned NFTs
4. Can bid on multiple NFTs which are available on auction sales
5. Can withdraw a bid
6. Transfer ownership of NFT and ONE tokens between the highest bid winner and the auction owner
7. See bid logs of auction

**Demo Instructions**

- Open https://world-nft.vercel.app/ on Brave/Chrome browser.
- Install Metamask if not installed yet
- Create a new Custom RPC under "Networks" and connect to Harmony testnet
  - Instructions on connecting to Harmony: https://docs.harmony.one/home/network/wallets/browser-extensions-wallets/metamask-wallet
- Add some fake $ONE tokens from here: https://faucet.pops.one/
- Refresh the page, and you can see your wallet address connected on top-right
- Click "Explore" to open the marketplace
- This will load the NFT cards you can click on to buy or place bid.
- If you already own an NFT, you are able to start an auction for others to bid on your NFT.
- Once the auction end, click "End Auction" to transfer the NFT and receive bid amount added to your wallet.
- If you see an NFT owned by others you want to buy, please place a bid higher than the current highest bid.

Config:

- Add .env file inside truffle.
- add the following environment vars:
  - TESTNET_URL = 'https://api.s0.b.hmny.io'
  - TESTNET_PRIVATE_KEY = "private key of harmony wallet account"

Deploy the solidity contract on Harmony blockchain:

- `cd truffle`
- `truffle migrate --reset --network harmony_testnet`

Run UI:

- `cd ui`
- `yarn start`
- visit localhost:3000
- Deployed on Vercel at https://world-nft.vercel.app/

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

6. Place bid
   ![Bids](https://github.com/swapp1990/WorldNFT/blob/master/screenshot/nft6.JPG?raw=true)
