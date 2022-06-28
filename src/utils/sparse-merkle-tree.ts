import * as circomlibjs from "circomlibjs";
import { toHex, toHexFromArray } from "./converter";

export class SparseMerkleTree {
  private smt: circomlibjs.SMT;

  async initSMT() {
    this.smt = await circomlibjs.newMemEmptyTrie();
  }

  async insert(key: string, value: string) {
    return await this.smt.insert(key, value);
  }

  async bulkInsert(nodes: string[][]) {
    for (const [key, value] of nodes) {
      await this.insert(key, value);
    }
  }

  getRoot() {
    if (!this.smt) {
      throw new Error("initialize the smt");
    }

    return toHex(this.smt.root);
  }

  async getProof(key: string) {
    const resFind = await this.smt.find(key);

    return Object.fromEntries(
      Object.entries(resFind).map(([key, value]) => [
        key,
        typeof value === "boolean" ? value : toHexFromArray(value),
      ])
    );
  }
}
