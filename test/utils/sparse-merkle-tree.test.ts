import { SparseMerkleTree } from "../../src";

describe("SparseMerkleTree", () => {
  it("get siblings", async () => {
    const tree = new SparseMerkleTree();
    await tree.initSMT();

    await tree.insert("1", "8191");
    await tree.insert("2", "57");
    await tree.insert("5", "105");

    const proof = await tree.getProof("5");

    expect(proof).toEqual({
      found: true,
      foundValue:
        "0xd5fdffaf469820d511f5f81ae06a77d7096e953c55ddf8698dc569c9f1ec8916",
      isOld0: false,
      siblings: [
        "0x2730014d99e6fdcbac9a8f21eacb7f008b57fccb8065b77548853fe7e073cd06",
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        "0x22a8cad863483b18b212ba221c83101eae60e8b09dd6749d981e36fa74abef2d",
      ],
    });
  });

  it("check proof and root by inserting following key-values", async () => {
    const tree = new SparseMerkleTree();
    await tree.initSMT();

    await tree.insert("6", "27391");
    await tree.insert("12", "10042");
    await tree.insert("1", "52384");
    await tree.insert("7", "952");
    await tree.insert("4", "319528");

    const proof = await tree.getProof("6");
    const root = tree.getRoot();

    expect(proof).toEqual({
      found: true,
      foundValue:
        "0xfac9fd5fe829bfd38230c6262d51384beef699fd64dbfc338401ba006b2b3418",
      isOld0: false,
      siblings: [
        "0x97e39ffb281ce3ed1ddc1317a7244a5fb7d9f94e158a32300a07bea4666a1c02",
        "0x87516ba22a290b6e0f6598c671f74377615a53204c20fe5e5fef1b691816501c",
      ],
    });
    expect(root).toBe(
      "0x292fb1c5b2bd85c0ff5790ee1e7c78528a5a55030e6d4d108cc10ad94793560b"
    );
  });

  it("get siblings with no-existing key", async () => {
    const tree = new SparseMerkleTree();
    await tree.initSMT();

    await tree.insert("1", "8191");
    await tree.insert("2", "57");
    await tree.insert("5", "105");

    const proof = await tree.getProof("100");

    expect(proof).toEqual({
      found: false,
      isOld0: false,
      notFoundKey:
        "0xf6ffff9f38682c59539ac13e2bedf86d5c8cf2f0de46ddcc5ebe0f3483ef141c",
      notFoundValue:
        "0xd3feffcf0e41522f33a5f6e0c8e2f7ba771aebba69089e49f2aea638edc20f1a",
      siblings: [
        "0xdd73c5dc0da0fa4c5750d8ca129f19287aaf77b49f380f08e027b9dd646e8b1d",
      ],
    });
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

  it("multiple rows of data into a tree", async () => {
    const tree = new SparseMerkleTree();
    await tree.initSMT();
    const data = [
      ["1", "8191"],
      ["2", "57"],
      ["5", "105"],
    ];
    await tree.bulkInsert(data);

    const root = tree.getRoot();

    expect(root).toEqual(
      "0xd33f943b7afd0586f2f5b9dd9c5823c5cdb96ed0d1cd1a44af59cee3088fe726"
    );
  });
});
