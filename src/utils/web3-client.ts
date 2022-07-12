import ethers from "ethers";

export class Web3Client {
  readonly provider: ethers.providers.JsonRpcProvider;
  readonly signer: ethers.providers.JsonRpcSigner;
  readonly msg = "intmax sign message";

  constructor(ethereum: ethers.providers.ExternalProvider) {
    this.provider = new ethers.providers.Web3Provider(ethereum);
    this.signer = this.provider.getSigner();
  }

  async createPrivateKey() {
    const signature = await this.signer.signMessage(this.msg);

    return `0x${ethers.utils.keccak256(signature)}`;
  }
}
