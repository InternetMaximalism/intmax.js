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

  async createAddress(priKey?: string): Promise<string> {
    const eddsa = await circomlibjs.buildEddsa();
    const privateKey = priKey ?? (await this.web3.createPrivateKey());
    const [key] = eddsa.prvTopub(privateKey);

    return this.pubToAddress(key);
  }

  private pubToAddress(publicKey: Buffer): string {
    return `0x${ethers.utils.keccak256(publicKey).slice(-40)}`;
  }
}
