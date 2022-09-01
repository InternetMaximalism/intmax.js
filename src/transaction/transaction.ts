import { TransactionData } from "../interfaces";
import { Buffer } from "buffer";
import { crh, toHex } from "../utils";

export class Transaction {
  public data: TransactionData;

  constructor(data: TransactionData = {}) {
    this.data = data;
  }

  async getHashedTransaction(): Promise<string> {
    const eddsa = await crh.getEddsa();
    const poseidonHash = await crh.getPoseidon();

    // Split the transaction data into 32 character segments.
    // Ignore last segment if it has less than 32 characters.
    const dataChunks =
      (this.data.calldata?.slice(2) || "").match(/.{64}/g) || [];
    let dataChunksBuffer = dataChunks.map((c) =>
      eddsa.babyJub.F.e(BigInt("0x" + c))
    );
    const zeroBuffer: Uint8Array = eddsa.babyJub.F.e(BigInt(0)); // 32 bytes
    dataChunksBuffer = dataChunksBuffer.concat(
      zeroBuffer,
      zeroBuffer,
      zeroBuffer,
      zeroBuffer
    );

    const nonceBuffer = Buffer.from(
      this.data.nonce?.slice(2) || "0000000000000000",
      "hex"
    );
    const toAddressBuffer = Buffer.from(
      this.data.to?.slice(2) || "0000000000000000000000000000000000000000",
      "hex"
    );
    const sigBuffer = Buffer.from(
      this.data.function_signature?.slice(2) || "00000000",
      "hex"
    );
    const nonceAddressSig = eddsa.babyJub.F.e(
      BigInt(
        "0x" +
          Buffer.concat([nonceBuffer, toAddressBuffer, sigBuffer]).toString(
            "hex"
          )
      )
    );

    const inputs: Uint8Array[] = [
      nonceAddressSig,
      dataChunksBuffer[0],
      dataChunksBuffer[1],
      dataChunksBuffer[2],
      dataChunksBuffer[3],
    ];
    const txHash: Uint8Array = poseidonHash(inputs); // Calculate Poseidon hash with t = 6

    return toHex(txHash);
  }
}
