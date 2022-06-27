import * as circomlibjs from "circomlibjs";
import { toHex } from "./converter";

export class SparseMerkleTree {
  private smt: circomlibjs.SMT;

  async initSMT() {
    this.smt = await circomlibjs.newMemEmptyTrie();
  }

  async insert(key: string, value: string) {
    return await this.smt.insert(key, value);
  }

  getRoot() {
    if (!this.smt) {
      throw new Error("initialize the smt");
    }

    return toHex(this.smt.root);
  }

  async getProof(key: string) {
    const resFind = await this.smt.find(key);
    if (!resFind.found) {
      return [];
    }

    return resFind.siblings.map(toHex);
  }
}
