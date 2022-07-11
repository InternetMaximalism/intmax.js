import ethers from "ethers";

export class Web3Client {
  readonly provider: ethers.providers.JsonRpcProvider;
  readonly signer: ethers.providers.JsonRpcSigner;

  constructor(ethereum: any) {
    this.provider = new ethers.providers.Web3Provider(ethereum);
    this.signer = this.provider.getSigner();
  }

  async createPrivateKey() {
    const signature = await this.signer.signMessage("something message");

    return `0x${ethers.utils.keccak256(signature)}`;
  }
}
