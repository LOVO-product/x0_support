import { expect } from "chai";
import { ethers } from "hardhat"; // 이거말고 import { ethers } from "ethers"; 를 써야합니다. 하드햇은 개발 환경이어서 ethers.js 라이브러리보다 큰 개념입니다
import { getCurrentBlock, getBlockTimeStamp, checkTxbyBlock, checkTxbyHash } from '../../scripts/ethers/verify';
import { TxInfo, TxInfo_hash } from '../../scripts/ethers/TxInfo';
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

//THIS TEST WORKS IN GOERLI ONLY
describe.skip("Verify_eth_Goerli", function () {
    const etherscanProvider_API = new ethers.providers.EtherscanProvider("goerli", "SKKJ21Z5AAYBMUY6IGSJM89A5ANWVKY5PG");
    const alchemyProvider_wss = new ethers.providers.WebSocketProvider("wss://eth-goerli.g.alchemy.com/v2/0RFvC1kJM_33G5GAnthpilrsLM_2Kk2m");
    let verifyStartTime: number;
    let verifyStartBlock: number;

    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;

    let amountInEther = '0.0001'
    let txHash: string;

    before(async function () {
        [addr1, addr2] = await ethers.getSigners();
    })


    describe("Success Scenario", function () {
        it("should success - get block and timestamp", async function () {
            verifyStartBlock = await getCurrentBlock(alchemyProvider_wss);
            verifyStartTime = await getBlockTimeStamp(alchemyProvider_wss, verifyStartBlock);

            console.log('block: ', verifyStartBlock);
            console.log('timestamp: ', verifyStartTime);

        });

        //유저가 메타마스크로 진행하는 부분
        it("should success - send a transaction", async function () {

            let tx = {
                to: addr2.address,
                // Convert currency unit from ether to wei
                value: ethers.utils.parseEther(amountInEther)
            }
            // txHash = (await addr1.sendTransaction(tx)).hash;
            await addr1.sendTransaction(tx).then((transaction) => {
                console.log(transaction);
                txHash = transaction.hash
                console.log('txHash: ', txHash);
            })
        });

        //트랜젝션 완료위한 시간 - 넉넉하게 48초 기다림
        it("time out n second", async function () {
            return new Promise(function (done) {
                setTimeout(done, 48000);
                console.log('48초 경과');
             });
        });

        //기본 인증방식
        it("should success - getTxbyBlock", async function () {
            const tx_success: TxInfo = {
                from: addr1.address,
                to: addr2.address,
                value: amountInEther
            };

            const isSuccessful = await checkTxbyBlock(
                etherscanProvider_API,
                tx_success,
                verifyStartBlock
            )

            expect(isSuccessful).to.be.true;
        });

        //추가 인증방식
        it("should success - getTxbyHash", async function () {
            const tx_success: TxInfo_hash = {
                from: addr1.address,
                to: addr2.address,
                value: amountInEther,
                txnHash: txHash
            };

            const isSuccessful = await checkTxbyHash(
                alchemyProvider_wss,
                tx_success,
                verifyStartBlock
            )

            expect(isSuccessful).to.be.true;

        });
    });

    describe("Failure Scenario", function () {
        it("should fail - ", async function () {
            
        });

        
    });

});