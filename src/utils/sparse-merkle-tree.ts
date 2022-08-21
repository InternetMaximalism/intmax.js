import * as circomlibjs from "circomlibjs";
import { toHex, toHexFromArray } from "./converter";

export type SMTProof = {
  found: boolean;
  foundValue: string;
  isOld0: boolean;
  siblings: string[];
};

export type SMTResponseProof = {
  siblings: string[];
  delKey: string;
  delValue: string;
  oldKey: string;
  oldValue: string;
  isOld0: boolean;
  newRoot: string;
  oldRoot: string;
};

export class SparseMerkleTree {
  private smt: circomlibjs.SMT;

  async initSMT(): Promise<void> {
    this.smt = await circomlibjs.newMemEmptyTrie();
  }

  async insert(key: string, value: string): Promise<SMTResponseProof> {
    const proof = await this.smt.insert(key, value);

    return this.toHexProof<SMTResponseProof>(proof);
  }

  async bulkInsert(nodes: string[][]): Promise<SMTResponseProof> {
    const results = [];

    for (const [key, value] of nodes) {
      const res = await this.insert(key, value);
      results.push(res);
    }

    return this.toHexProof<SMTResponseProof>(results[results.length - 1]);
  }

  async remove(key: string): Promise<SMTResponseProof> {
    const proof = await this.smt.delete(key);

    return this.toHexProof<SMTResponseProof>(proof);
  }

  async getRoot(): Promise<string> {
    if (!this.smt) {
      throw new Error("initialize the smt");
    }

    return await toHex(this.smt.root);
  }

  async getProof(key: string): Promise<SMTProof> {
    const resFind = await this.smt.find(key);

    return this.toHexProof<SMTProof>(resFind);
  }

  async update(key: string, value: string): Promise<SMTResponseProof> {
    const proof = await this.smt.update(key, value);

    return this.toHexProof<SMTResponseProof>(proof);
  }

  async toHexProof<T>(
    result:
      | circomlibjs.FindFromSmtResponse
      | circomlibjs.InsertIntoSmtResponse
      | circomlibjs.UpdateSmtResponse
      | circomlibjs.DeleteFromSmtResponse
  ) {
    return Object.fromEntries(
      await Promise.all(
        Object.entries(result).map(async ([key, value]) => [
          key,
          typeof value === "boolean" ? value : await toHexFromArray(value),
        ])
      )
    ) as unknown as T;
  }
}
