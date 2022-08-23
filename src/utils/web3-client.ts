import { ethers } from "ethers";

export class Web3Client {
  private readonly provider: ethers.providers.JsonRpcProvider;
  private readonly signer: ethers.providers.JsonRpcSigner;
  private readonly isMetamask: boolean;
  static METAMASK_URL = "metamask";
  readonly msg = "Sign this message to connect to Intmax's L2 Account.";

  constructor(
    provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider
  ) {
    this.isMetamask = provider.connection.url === Web3Client.METAMASK_URL;
    this.provider = provider;

    this.signer = this.provider.getSigner();
  }

  async createPrivateKey(): Promise<string> {
    const signature = await this.getSignature();

    return ethers.utils.keccak256(signature);
  }

  async getSignature(): Promise<string> {
    if (this.isMetamask) {
      return await this.signer.signMessage(this.msg);
    }

    const wallet = ethers.Wallet.createRandom();

    return await wallet.signMessage(this.msg);
  }
}
