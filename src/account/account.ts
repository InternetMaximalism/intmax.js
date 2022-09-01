import { ethers } from "ethers";
import { Scalar } from "ffjavascript";
import * as crypto from "crypto";
import * as circomlibjs from "circomlibjs";
import { Transaction } from "../transaction";
import { crh, Web3Client, toHex } from "../utils";
import { AccountData, SignedTransaction } from "../interfaces";

export class Account {
  static readonly storeName = "account";
  readonly web3: Web3Client;
  private _address: string | null;
  private _privateKey: Buffer | null;
  private _publicKey: [Uint8Array, Uint8Array] | null;

  constructor(
    provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider
  ) {
    this.web3 = new Web3Client(provider);
  }

  async activate(priKey?: Buffer): Promise<void> {
    const address = await this.createAddress(priKey);

    this._address = address;
  }

  async createAddress(inputPrivateKey?: Buffer): Promise<string> {
    const eddsa = await crh.getEddsa();
    const privateKey = inputPrivateKey ?? (await this.web3.createPrivateKey());
    const publicKey: [Uint8Array, Uint8Array] = eddsa.prvTopub(privateKey);

    this._privateKey = privateKey;
    this._publicKey = publicKey;

    return await this.pubToAddress(publicKey);
  }

  getAddress(): string {
    return this.validateArg(this._address);
  }

  getAccountData(): AccountData {
    const nonce = this.getNonce();

    return {
      privateKey: this.validateArg(this._privateKey),
      publicKey: this.validateArg(this._publicKey),
      address: this.validateArg(this._address),
      nonce: this.validateArg(nonce),
    };
  }

  async sign(message: string): Promise<string> {
    const privateKey = this.validateArg(this._privateKey);

    const eddsa = await crh.getEddsa();
    const buffer = Buffer.from(message);
    const msgHashed = crypto.createHash("sha256").update(buffer).digest();
    const msg = eddsa.babyJub.F.e(Scalar.fromRprLE(msgHashed, 0));

    const signature = eddsa.signPoseidon(privateKey, msg);

    return "0x" + Buffer.from(eddsa.packSignature(signature)).toString("hex");

    // return {
    //   R8: await Promise.all(signature.R8.map(toHex)),
    //   S: `0x${signature.S}`,
    // };
  }

  // TODO: get nonce from api
  getNonce(): string {
    return "0x0000000000000001";
  }

  // TODO: for NFT
  async getSignedTransaction(
    transaction: Transaction
  ): Promise<SignedTransaction> {
    const accountData = this.getAccountData();
    // const tx_hash = await transaction.getHashedTransaction();
    // const signature = await this.sign(tx_hash);

    const eddsa = await crh.getEddsa();
    const txHash = await transaction.getHashedTransaction();

    const signature = eddsa.signPoseidon(
      accountData.privateKey,
      eddsa.babyJub.F.e(txHash)
    );
    console.log(signature);

    const packedSignature: Uint8Array = eddsa.packSignature(signature);
    console.log(packedSignature);

    const packedPublicKey = eddsa.babyJub.packPoint(accountData.publicKey);
    console.log(packedPublicKey);

    return {
      transaction: {
        contract_address: transaction.data.to!,
        nonce: accountData.nonce,
        function_signature: transaction.data.function_signature!,
        calldata: transaction.data.calldata!,
      },
      tx_hash: txHash,
      public_key: "0x" + Buffer.from(packedPublicKey).toString("hex"),
      signature: "0x" + Buffer.from(packedSignature).toString("hex"),
    };
  }

  private async pubToAddress(
    publicKey: [Uint8Array, Uint8Array]
  ): Promise<string> {
    const poseidonHash = await crh.getPoseidon();
    const hashedPublicKey: Uint8Array = poseidonHash(publicKey);
    const d = BigInt(poseidonHash.F.toString(hashedPublicKey)).toString(16);

    this._address = Buffer.from(d, "hex")
      .reverse()
      .toString("hex")
      .slice(0, 40);

    return `0x${this._address}`;
  }

  private validateArg<T>(arg: T | null): T {
    if (!arg) {
      throw new Error("connect to the metamask.");
    }

    return arg;
  }
}
