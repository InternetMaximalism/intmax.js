import * as circomlibjs from "circomlibjs";
import { toHex, toHexFromArray } from "./converter";

export type SMTProof = {
  found: boolean;
  foundValue: string;
  isOld0: boolean;
  siblings: string[];
};

export class SparseMerkleTree {
  private smt: circomlibjs.SMT;

  async initSMT(): Promise<void> {
    this.smt = await circomlibjs.newMemEmptyTrie();
  }

  async insert(
    key: string,
    value: string
  ): Promise<circomlibjs.InsertIntoSmtResponse> {
    return await this.smt.insert(key, value);
  }

  async bulkInsert(nodes: string[][]): Promise<void> {
    for (const [key, value] of nodes) {
      await this.insert(key, value);
    }
  }

  getRoot(): string {
    if (!this.smt) {
      throw new Error("initialize the smt");
    }

    return toHex(this.smt.root);
  }

  async getProof(key: string): Promise<SMTProof> {
    const resFind = await this.smt.find(key);

    return Object.fromEntries(
      Object.entries(resFind).map(([key, value]) => [
        key,
        typeof value === "boolean" ? value : toHexFromArray(value),
      ])
    ) as SMTProof;
  }
}
