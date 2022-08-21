import * as circomlibjs from "circomlibjs";
import { MerkleTree, toHex } from "../../src";

describe("MerkleTree", () => {
  it("with poseidon hash", async () => {
    const poseidonHash = await circomlibjs.buildPoseidonReference();
    const leaves = ["01", "02", "03", "04"];
    const tree = new MerkleTree(leaves, (n1: string, n2: string) =>
      poseidonHash([n1, n2])
    );

    expect(await toHex(tree.getRoot())).toBe(
      "0x5854a9f49657916c9f5dd58c30aa8237098897785953b41a186893f4c83c0901"
    );
    expect(await Promise.all(tree.getProof(0).map(toHex))).toEqual([
      "02",
      "0x550cd87277dd3a6bb3461c95bf0aca830b7a6ad8d885dc0f4a1b89f91c2dba1c",
    ]);
    expect(tree.getValue(1)).toBe("02");
  });
});
