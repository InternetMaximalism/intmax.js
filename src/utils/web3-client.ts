import { ethers } from "ethers";

export class Web3Client {
  readonly provider: ethers.providers.JsonRpcProvider;
  readonly signer: ethers.providers.JsonRpcSigner;
  readonly isMetamask: boolean;
  readonly msg = "intmax sign message";

  constructor(
    ethereum:
      | ethers.providers.ExternalProvider
      | ethers.providers.JsonRpcProvider
  ) {
    this.isMetamask = (ethereum as any).isMetamask;
    this.provider = this.isMetamask
      ? new ethers.providers.Web3Provider(
          ethereum as ethers.providers.ExternalProvider
        )
      : (ethereum as ethers.providers.JsonRpcProvider);

    this.signer = this.provider.getSigner();
  }

  async createPrivateKey(): Promise<string> {
    const signature = await this.getSignature();

    return `0x${ethers.utils.keccak256(signature)}`;
  }

  async getSignature(): Promise<string> {
    if (this.isMetamask) {
      return await this.signer.signMessage(this.msg);
    }

    const wallet = ethers.Wallet.createRandom();

    return await wallet.signMessage(this.msg);
  }
}
