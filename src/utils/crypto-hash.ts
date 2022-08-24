import * as circomlibjs from "circomlibjs";

export class CryptoHash {
  eddsa: circomlibjs.Eddsa;
  poseidon: any;

  async getEddsa(): Promise<circomlibjs.Eddsa> {
    if (this.eddsa) {
      return this.eddsa;
    }
    this.eddsa = await circomlibjs.buildEddsa();

    return this.eddsa;
  }

  async getPoseidon() {
    if (this.poseidon) {
      return this.poseidon;
    }
    this.poseidon = await circomlibjs.buildPoseidonReference();

    return this.poseidon;
  }
}

export const crh = new CryptoHash();
