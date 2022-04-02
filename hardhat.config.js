require("@nomiclabs/hardhat-waffle");

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");

const ALCHEMY_API_KEY = "UT-0zJDMf07HMxovwO5b9g3uJiivVooI"

const ROPSTEN_PRIVATE_KEY = "0xb22bfb66a4cdd62d058cff514256a5c797e9d17410170e6648cb5ed2e68636b4";

// If you are using MetaMask, be sure to change the chainId to 1337
module.exports = {
  solidity: "0.8.10",
  networks: {
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${ROPSTEN_PRIVATE_KEY}`]
    }
  }
};
