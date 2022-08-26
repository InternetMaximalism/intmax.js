import { AccountData, TransactionData } from "../interfaces";
import { crh } from "../utils";

export class Transaction {
  public data: TransactionData;

  constructor(data: TransactionData = {}) {
    this.data = data;
  }

  async getHashedTransaction(accountData: AccountData): Promise<string> {
    const poseidonHash = await crh.getPoseidon();
    const txHashBuf = poseidonHash([
      Buffer.from(this.data.to!),
      Buffer.from(accountData.publicKey),
    ]);

    return BigInt(poseidonHash.F.toString(txHashBuf)).toString(16);
  }
}
