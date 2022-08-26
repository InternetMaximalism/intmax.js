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
  private _publicKey: string | null;

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

  async sign(message: string): Promise<circomlibjs.Signature> {
    const privateKey = this.validateArg(this._privateKey);

    const eddsa = await crh.getEddsa();
    const buffer = Buffer.from(message);
    const msgHashed = crypto.createHash("sha256").update(buffer).digest();
    const msg = eddsa.babyJub.F.e(Scalar.fromRprLE(msgHashed, 0));

    const signature = eddsa.signPoseidon(privateKey, msg);

    return {
      R8: await Promise.all(signature.R8.map(toHex)),
      S: `0x${signature.S}`,
    };
  }

  // TODO: get nonce from api
  getNonce(): number {
    return 0x000001;
  }

  // TODO: for NFT
  async getSignedTransaction(
    transaction: Transaction
  ): Promise<SignedTransaction> {
    const accountData = this.getAccountData();
    const tx_hash = await transaction.getHashedTransaction(accountData);
    const signature = await this.sign(tx_hash);

    return {
      transaction: {
        contract_address: transaction.data.to!,
        nonce: accountData.nonce,
      },
      tx_hash,
      signature,
    };
  }

  private async pubToAddress(
    publicKey: [Uint8Array, Uint8Array]
  ): Promise<string> {
    const poseidonHash = await crh.getPoseidon();
    const hashedPublicKey: Uint8Array = poseidonHash(publicKey);
    const d = BigInt(poseidonHash.F.toString(hashedPublicKey)).toString(16);

    this._publicKey = d.slice(-40);

    return `0x${this._publicKey}`;
  }

  private validateArg<T>(arg: T | null): T {
    if (!arg) {
      throw new Error("connect to the metamask.");
    }

    return arg;
  }
}
