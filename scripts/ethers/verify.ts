import { ethers } from 'ethers'
import { TxInfo, TxInfo_hash } from './TxInfo';

export async function getCurrentBlock(
  provider_eth: ethers.providers.WebSocketProvider
): Promise<number> {
  return await provider_eth.getBlockNumber();
}

export async function getBlockTimeStamp(
  provider_eth: ethers.providers.WebSocketProvider,
  blockNumber: number
): Promise<number>{
  return (await provider_eth.getBlock(blockNumber)).timestamp;
}

export async function checkTxbyBlock(
  provider_eth: ethers.providers.EtherscanProvider,
  txInfo: TxInfo,
  startBlock: number //second
): Promise<boolean> {
  const currentBlock = await provider_eth.getBlockNumber();
  // 이 함수는 etherscan 에서만 제공하는데, 사용하지 않을시 최대 7200개의 블록을 검색해야하는 있음.
  let history = await provider_eth.getHistory(txInfo.from, startBlock, currentBlock);

  for (const transaction of history.reverse()) {
    // console.log(transaction);

    if (transaction.to?.toLowerCase() == txInfo.to.toLowerCase() && ethers.utils.formatEther(transaction.value.toString()) == txInfo.value) {
      return true;
    }
  }

  return false
}

export async function checkTxbyHash(
  provider: ethers.providers.WebSocketProvider, //그냥 프로바이더 사용시 3324ms wss 사용시 1530ms
  txInfo: TxInfo_hash,
  startBlock: number //should be UTC
): Promise<boolean> {

  let txn = await provider.getTransaction(txInfo.txnHash);
  let txn_receipt = await provider.getTransactionReceipt(txInfo.txnHash);

  if (!txn || !txn.to) return false; //pending or tx doesn't exist
  if (txn_receipt.status === 0) return false; //Transaction failed

  // console.log(txn);
  const _from = txn.from.toLowerCase();
  const _to = txn.to?.toLowerCase();
  const _value = ethers.utils.formatEther(txn.value.toString())
  const _blockNum = txn.blockNumber;
  
  if ( startBlock >= _blockNum!) return false;
  //check if 
  if (_from === txInfo.from.toLowerCase() && _to === txInfo.to.toLowerCase() && _value === txInfo.value) {
    return true;
  }

  return false;
}

