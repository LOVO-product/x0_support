import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-web3";
import dotenv from 'dotenv'
dotenv.config()

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 31337
    },
    goerli: {
      chainId: 5,
      url: process.env.GOERLI_URL,
      accounts: [process.env.PRIVATE_KEY!, process.env.PRIVATE_KEY2!]
    },
    mainnet: {
      chainId: 1,
      url: process.env.MAINNET_URL,
      accounts: [process.env.PRIVATE_KEY!, process.env.PRIVATE_KEY2!]
    }
  },
  mocha: {
    timeout: 100000000
  },
};

export default config;
