import { expect } from "chai";
// import { ethers } from "hardhat";
import { ethers } from "ethers";
import { countHoldingNFTs, getAllAddressByTokenID} from '../../scripts/ethers/sdk';

//THIS TEST WORKS IN MAINNET ONLY
describe.skip("SDK_eth", function () {
    const alchemyProvider = new ethers.providers.AlchemyProvider("mainnet", "0RFvC1kJM_33G5GAnthpilrsLM_2Kk2m");
    const alchemyProvider2 = new ethers.providers.JsonRpcProvider("https://eth-mainnet.alchemyapi.io/v2/0W2NJ1r0oDN9K_LVR_IwdXVXwirWBjcj");
    const alchemyProvider3 = new ethers.providers.WebSocketProvider("wss://eth-mainnet.g.alchemy.com/v2/tu3KjkWRAtFVv536VbHgVWO2BSYtwhDk");
    const etherscanProvider_main = new ethers.providers.EtherscanProvider("mainnet", "SKKJ21Z5AAYBMUY6IGSJM89A5ANWVKY5PG");

    const doodlesCA = "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e";
    const holderEOA = "0x7FEe302A14D6B945c0EB6dA9C4426c8D75d38a73";

    it.skip("Should success countHoldingNFTs", async function () {

        const count = await countHoldingNFTs(
            alchemyProvider3, // provider
            holderEOA, // from
            doodlesCA, // CA
        );

        console.log(count);

    });

    it("Should get NFTs", async function () {

        const getHolding = await getAllAddressByTokenID(
            alchemyProvider3, // provider
            holderEOA, // from
            doodlesCA, // CA
        );

        // console.log(getHolding);
        // expect(isSuccessful).to.equal(true);
    });

});
