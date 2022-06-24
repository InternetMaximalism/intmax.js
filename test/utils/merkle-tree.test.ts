import web3 from "web3";
import { MerkleTree } from "../../src";

const createHash = (n1: string, n2: string) => {
  return web3.utils.soliditySha3(n1, n2) as string;
};

describe("MerkleTree", () => {
  it("with neptune hash", () => {
    const leaves = ["01", "02", "03", "04"];
    const tree = new MerkleTree(leaves, createHash);

    expect(tree.getRoot()).toBe(
      "0xa9bb8c3f1f12e9aa903a50c47f314b57610a3ab32f2d463293f58836def38d36"
    );
    expect(tree.getProof(0)).toEqual([
      "02",
      "0x2e174c10e159ea99b867ce3205125c24a42d128804e4070ed6fcc8cc98166aa0",
    ]);
    expect(tree.getValue(1)).toBe("02");
  });
});
