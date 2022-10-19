export interface TxInfo {

  from: string;
  to: string;
  value: string;

}

export interface TxInfo_hash extends TxInfo{
  txnHash: string;
}
