import * as circomlibjs from "circomlibjs";

export class CryptoHash {
  eddsa: any;
  poseidon: any;

  async getEddsa() {
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
