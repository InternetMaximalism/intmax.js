import * as circomlibjs from "circomlibjs";
import { Web3Client } from "../utils";

export class Account {
  static readonly storeName = "account";
  readonly web3: Web3Client;

  constructor(ethereum: any) {
    this.web3 = new Web3Client(ethereum);
  }

  async createAddress() {
    const eddsa = await circomlibjs.buildEddsa();
    const privateKey = await this.web3.createPrivateKey();
    const [key] = eddsa.prvTopub(privateKey);
    const publicKey = `0x${Buffer.from(key).toString("hex")}`.substring(0, 42);

    return publicKey;
  }
}
