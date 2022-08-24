import { ethers } from "ethers";
import { Scalar } from "ffjavascript";
import * as crypto from "crypto";
import * as circomlibjs from "circomlibjs";
import { crh, Web3Client, toHex } from "../utils";
import { TxData } from "../interfaces";

export class Account {
  static readonly storeName = "account";
  readonly web3: Web3Client;
  private _address: string | null;

  constructor(
    provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider
  ) {
    this.web3 = new Web3Client(provider);
  }

  async activate(priKey?: string | Buffer): Promise<void> {
    const address = await this.createAddress(priKey);

    this._address = address;
  }

  async createAddress(priKey?: string | Buffer): Promise<string> {
    const eddsa = await crh.getEddsa();
    const privateKey = priKey ?? (await this.web3.createPrivateKey());
    const publicKey: [Uint8Array, Uint8Array] = eddsa.prvTopub(privateKey);

    return await this.pubToAddress(publicKey);
  }

  getAddress(): string {
    return this.validateArg(this._address);
  }

  async sign(message: string): Promise<circomlibjs.Signature> {
    const privateKey = this.validateArg(this.web3.getPrivateKey());

    const eddsa = await crh.getEddsa();
    const buffer = Buffer.from(message);
    const msgHashed = crypto.createHash("sha256").update(buffer).digest();
    const msg = eddsa.babyJub.F.e(Scalar.fromRprLE(msgHashed, 0));

    const prvKey = Buffer.from(privateKey, "hex");
    const signature = eddsa.signPoseidon(prvKey, msg);

    return {
      R8: await Promise.all(signature.R8.map(toHex)),
      S: `0x${signature.S}`,
    };
  }

  async signTransaction(tx: TxData): Promise<circomlibjs.Signature> {
    const txString = JSON.stringify(tx);

    return this.sign(txString);
  }

  private async pubToAddress(
    publicKey: [Uint8Array, Uint8Array]
  ): Promise<string> {
    const poseidonHash = await crh.getPoseidon();
    const hashedPublicKey: Uint8Array = poseidonHash(publicKey);
    const d = BigInt(poseidonHash.F.toString(hashedPublicKey)).toString(16);

    return `0x${d.slice(-40)}`;
  }

  private validateArg(arg: string | null): string {
    if (!arg) {
      throw new Error("connect to the metamask.");
    }

    return arg;
  }
}
