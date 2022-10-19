import { ethers } from "ethers";
import { getCurrentBlock, getBlockTimeStamp, checkTxbyBlock, checkTxbyHash } from './ethers/verify';
import { TxInfo, TxInfo_hash } from './ethers/TxInfo';

const alchemyProvider_wss = new ethers.providers.WebSocketProvider("wss://eth-goerli.g.alchemy.com/v2/0RFvC1kJM_33G5GAnthpilrsLM_2Kk2m");
const etherscanProvider_API = new ethers.providers.EtherscanProvider("goerli", "SKKJ21Z5AAYBMUY6IGSJM89A5ANWVKY5PG");
// 샘플 데이터
const txHash = "0xef6276b48dac9104d2657101fbcfe88b5596c30b53c1c42598f8cae7f566b100";
const addr1 = "0xcE0ecb3B16d020D3B8F2DD81ED5A1fbBb2180D24";
const addr2 = "0xdaca757514d2572d1e64cb8aba678ecafa0d6e3d";
const amountInEther = "0.5";

async function main() {

    const verifyStartBlock = await getCurrentBlock(alchemyProvider_wss);
    const verifyStartTime = await getBlockTimeStamp(alchemyProvider_wss, verifyStartBlock);

    // console.log('block: ', verifyStartBlock);
    // console.log('timestamp: ', verifyStartTime);


    const tx_success: TxInfo = {
        from: addr1,
        to: addr2,
        value: amountInEther
    };

    const tx_success_hash: TxInfo_hash = {
        from: addr1,
        to: addr2,
        value: amountInEther,
        txnHash: txHash
    };

    const testBlock = verifyStartBlock - 24* 60 * 60 /12; //실제로는 verifyStartBlock 그대로 넣으면됨

    //기본 인증방식
    const isSuccessful_block = await checkTxbyBlock(
        etherscanProvider_API,
        tx_success,
        testBlock 
    )

    console.log(isSuccessful_block);
    
    //추가 인증방식
    const isSuccessful_hash = await checkTxbyHash(
        alchemyProvider_wss,
        tx_success_hash,
        testBlock
    )

    console.log(isSuccessful_hash);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
