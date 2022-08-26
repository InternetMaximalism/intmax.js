import { ethers } from "ethers";
import { config } from "../config";

export class Web3Client {
  private readonly provider: ethers.providers.JsonRpcProvider;
  readonly signer: ethers.providers.JsonRpcSigner;
  private _privateKey: string | null;
  private readonly isMetamask: boolean;
  static METAMASK_URL = "metamask";

  constructor(
    provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider
  ) {
    this.isMetamask = provider.connection.url === Web3Client.METAMASK_URL;
    this.provider = provider;

    this.signer = this.provider.getSigner();
  }

  async createPrivateKey(): Promise<Buffer> {
    const signature = await this.getSignature();
    this._privateKey = ethers.utils.keccak256(signature);

    return Buffer.from(this._privateKey, "hex");
  }

  getPrivateKey(): string {
    return this.validateArg(this._privateKey);
  }

  async getSignature(): Promise<string> {
    if (this.isMetamask) {
      return await this.signer.signMessage(config.intmaxSignMsg);
    }

    const wallet = ethers.Wallet.createRandom();

    return await wallet.signMessage(config.intmaxSignMsg);
  }

  private validateArg(arg: string | null): string {
    if (!arg) {
      throw new Error("connect to the metamask.");
    }

    return arg;
  }
}
