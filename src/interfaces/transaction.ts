export interface TransactionData {
  from?: string;
  to?: string; // 20 bytes hex string with 0x-prefix
  nonce?: string; // 8 bytes hex string with 0x-prefix
  function_signature?: string; // 4 bytes hex string with 0x-prefix
  calldata?: string; // hex string with 0x-prefix
}

export interface SignedTransaction {
  transaction: {
    contract_address: string;
    nonce: string; // 8 bytes hex string with 0x-prefix
    function_signature?: string; // 4 bytes hex string with 0x-prefix
    calldata: string; // hex string with 0x-prefix
  };
  tx_hash: string;
  public_key: string;
  signature: string;
}
