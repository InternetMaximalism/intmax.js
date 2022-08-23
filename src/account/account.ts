import * as circomlibjs from "circomlibjs";
import { ethers } from "ethers";
import { crh, Web3Client } from "../utils";

export class Account {
  static readonly storeName = "account";
  readonly web3: Web3Client;

  constructor(
    provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider
  ) {
    this.web3 = new Web3Client(provider);
  }

  async createAddress(priKey?: string | Buffer): Promise<string> {
    const eddsa = await circomlibjs.buildEddsa();
    const privateKey = priKey ?? (await this.web3.createPrivateKey());
    const publicKey: [Uint8Array, Uint8Array] = eddsa.prvTopub(privateKey);

    return this.pubToAddress(publicKey);
  }

  private async pubToAddress(
    publicKey: [Uint8Array, Uint8Array]
  ): Promise<string> {
    const poseidonHash = await crh.getPoseidon();
    const hashedPublicKey: Uint8Array = poseidonHash(publicKey);
    const d = BigInt(poseidonHash.F.toString(hashedPublicKey)).toString(16);

    return `0x${d.slice(-40)}`;
  }
}
