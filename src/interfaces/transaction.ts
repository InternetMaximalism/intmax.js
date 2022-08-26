import * as circomlibjs from "circomlibjs";

export interface TransactionData {
  from?: string;
  to?: string;
  data?: {
    [key: string]: string;
  };
}

export interface SignedTransaction {
  transaction: {
    contract_address: string;
    nonce: number;
  };
  tx_hash: string;
  signature: circomlibjs.Signature;
}
