import * as circomlibjs from "circomlibjs";
import { ethers } from "ethers";
import { Web3Client } from "../utils";

export class Account {
  static readonly storeName = "account";
  readonly web3: Web3Client;

  constructor(
    ethereum:
      | ethers.providers.ExternalProvider
      | ethers.providers.JsonRpcProvider
  ) {
    this.web3 = new Web3Client(ethereum);
  }

  async createAddress(priKey?: string | Buffer): Promise<string> {
    const eddsa = await circomlibjs.buildEddsa();
    const privateKey = priKey ?? (await this.web3.createPrivateKey());

    const publicKey: [Uint8Array, Uint8Array] = eddsa.prvTopub(privateKey);

    return this.pubToAddress(publicKey);
  }

  private async pubToAddress(publicKey: [Uint8Array, Uint8Array]): Promise<string> {
    const poseidonHash = await circomlibjs.buildPoseidonReference();
    const hashedPublicKey: Uint8Array = poseidonHash(publicKey);
    const d = BigInt(poseidonHash.F.toString(hashedPublicKey)).toString(16);
    console.log("d:", d);
    return `0x${d.slice(-40)}`;
  }
}
