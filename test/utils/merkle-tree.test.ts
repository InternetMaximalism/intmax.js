import { MerkleTree, toHex, crh } from "../../src";

jest.setTimeout(10000);

describe("MerkleTree", () => {
  it("with poseidon hash", async () => {
    const poseidonHash = await crh.getPoseidon();
    const leaves = ["01", "02", "03", "04"];
    const tree = new MerkleTree(leaves, (n1: string, n2: string) =>
      poseidonHash([n1, n2])
    );

    expect(await toHex(tree.getRoot())).toBe(
      "0x75d30e28d48842bd6c1044b68f982d586e2892ae91c77f8f56111d8f55070ed"
    );
    expect(await Promise.all(tree.getProof(0).map(toHex))).toEqual([
      "02",
      "0x20a3af0435914ccd84b806164531b0cd36e37d4efb93efab76913a93e1f30996",
    ]);
    expect(tree.getValue(1)).toBe("02");
  });
});
