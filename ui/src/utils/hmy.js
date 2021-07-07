const { Harmony } = require("@harmony-js/core");
const { ChainType } = require("@harmony-js/utils");

export default new Harmony("https://api.s0.b.hmny.io", {
  chainType: ChainType.Harmony,
  chainId: 2,
});
