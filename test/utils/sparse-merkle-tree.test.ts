import { SparseMerkleTree } from "../../src";

describe("SparseMerkleTree", () => {
  it("get siblings", async () => {
    const tree = new SparseMerkleTree();
    await tree.initSMT();

    await tree.insert("1", "8191");
    await tree.insert("2", "57");
    await tree.insert("5", "105");

    const proof = await tree.getProof("5");

    expect(proof).toEqual([
      "0x2730014d99e6fdcbac9a8f21eacb7f008b57fccb8065b77548853fe7e073cd06",
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      "0x22a8cad863483b18b212ba221c83101eae60e8b09dd6749d981e36fa74abef2d",
    ]);
  });

  it("not get the siblings with no-existing key", async () => {
    const tree = new SparseMerkleTree();
    await tree.initSMT();

    await tree.insert("1", "8191");
    await tree.insert("2", "57");
    await tree.insert("5", "105");

    const proof = await tree.getProof("100");

    expect(proof).toEqual([]);
  });

  it("get merkle root", async () => {
    const tree = new SparseMerkleTree();
    await tree.initSMT();

    await tree.insert("1", "8191");
    await tree.insert("2", "57");
    await tree.insert("5", "105");

    const root = tree.getRoot();

    expect(root).toEqual(
      "0xd33f943b7afd0586f2f5b9dd9c5823c5cdb96ed0d1cd1a44af59cee3088fe726"
    );
  });
});
