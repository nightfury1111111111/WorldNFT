export default function About() {
  return (
    <div className="m-4">
      <h1 className="text-xl font-semibold">ONE World NFT</h1>
      <h2 className="text-md font-semibold">
        ONE World is a collectible NFT marketplace for real-world locations on
        planet Earth.
      </h2>
      <br />
      <b>Demo Instructions</b>
      <ul className="m-2 list-disc list-inside mt-8">
        <li>Install Metamask if not installed yet</li>
        <li>
          Create a new Custom RPC under "Networks" and connect to Harmony
          testnet
        </li>
        <li>
          Instructions on connecting to Harmony:
          <br></br>
          <a
            className="font-medium"
            href="https://docs.harmony.one/home/network/wallets/browser-extensions-wallets/metamask-wallet"
            target="_blank"
          >
            https://docs.harmony.one/home/network/wallets/browser-extensions-wallets/metamask-wallet
          </a>
        </li>
        <li>
          Add some fake $ONE tokens from here:{" "}
          <a
            className="font-medium"
            href="https://faucet.pops.one/"
            target="_blank"
          >
            https://faucet.pops.one/
          </a>
        </li>
        <li>
          Refresh the page, and you can see your wallet address connected on
          top-right
        </li>
        <li>
          Click "Explore" to open the marketplace This will load the NFT cards
          you can click on to buy or place bid.
        </li>
        <li>
          If you already own an NFT, you are able to start an auction for others
          to bid on your NFT.
        </li>
        <li>
          Once the auction time ends, click "End Auction" to transfer the NFT
          and receive bid amount added to your wallet.
        </li>
        <li>
          If you see an NFT owned by others you want to buy, please place a bid
          higher than the current highest bid.
        </li>
      </ul>
      <br></br>
      <b>Github</b>
      <div>
        <a
          className="font-medium"
          href="https://github.com/swapp1990/WorldNFT"
          target="_blank"
        >
          https://github.com/swapp1990/WorldNFT
        </a>
      </div>
      <br></br>
      <b>Email</b>
      <div className="font-medium">swapp19902@gmail.com</div>
    </div>
  );
}
