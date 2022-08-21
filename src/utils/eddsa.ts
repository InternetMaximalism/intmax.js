import * as circomlibjs from "circomlibjs";

export class Eddsa {
  eddsa: any;

  async getEddsa() {
    if (this.eddsa) {
      return this.eddsa;
    }
    this.eddsa = await circomlibjs.buildEddsa();

    return this.eddsa;
  }
}

export const edd = new Eddsa();
