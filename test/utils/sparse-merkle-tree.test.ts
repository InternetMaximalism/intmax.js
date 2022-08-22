import { SparseMerkleTree } from "../../src";

jest.setTimeout(30000);

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
      foundValue: "0x69",
      isOld0: false,
      siblings: [
        "0x24e1738ee41accc2fcc8b4318047d428da5e0656f6aa5cc34bb2ac7984f9016a",
        "0x0",
        "0x6d98dbc8f6a445359dc8a687d0f71207d8de17d5ef274d1c407d24955b59ae4",
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
    const root = await tree.getRoot();

    expect(proof).toEqual({
      found: true,
      foundValue: "0x6aff",
      isOld0: false,
      siblings: [
        "0x2404d85c4239ab92632eafd20b6153d3d7663e0178b0ea3ffc18c1c1e15adab3",
        "0x16b6eb9eab19f5dea068b7df473400a523a7ef38506d8f3a9458de94111b41db",
      ],
    });
    expect(root).toBe(
      "0x27682bb12c315e4168ade4429b5f9537fed5989da37ff36a28a5a9fe47b0b4cb"
    );
  });

  it("remove node from smt", async () => {
    const tree = new SparseMerkleTree();
    await tree.initSMT();

    await tree.insert("6", "27391");
    await tree.insert("12", "10042");
    await tree.insert("1", "52384");
    await tree.insert("7", "952");
    await tree.insert("4", "319528");

    const result = await tree.remove("12");
    const proof = await tree.toHexProof(result);

    expect(proof).toEqual({
      siblings: [
        "0x2404d85c4239ab92632eafd20b6153d3d7663e0178b0ea3ffc18c1c1e15adab3",
        "0x255002a9d7c0ef0e4e091c27f53808576fba9b564d6c22043fd2a8b5763e96a8",
      ],
      delKey: "0xc",
      delValue: "0x273a",
      oldKey: "0x4",
      oldValue: "0x4e028",
      isOld0: false,
      newRoot:
        "0x2ba687dc3b3238e39d98a9eff735d6e5e04801c75a4edff8bc1d605f835b17b8",
      oldRoot:
        "0x27682bb12c315e4168ade4429b5f9537fed5989da37ff36a28a5a9fe47b0b4cb",
    });
  });

  it("insert node into smt", async () => {
    const tree = new SparseMerkleTree();
    await tree.initSMT();

    await tree.insert("6", "27391");
    await tree.insert("12", "10042");
    await tree.insert("1", "52384");
    await tree.insert("7", "952");
    await tree.insert("4", "319528");
    await tree.remove("12");

    const result = await tree.insert("12", "10042");
    const proof = await tree.toHexProof(result);

    expect(proof).toEqual({
      oldRoot:
        "0x2ba687dc3b3238e39d98a9eff735d6e5e04801c75a4edff8bc1d605f835b17b8",
      siblings: [
        "0x2404d85c4239ab92632eafd20b6153d3d7663e0178b0ea3ffc18c1c1e15adab3",
        "0x255002a9d7c0ef0e4e091c27f53808576fba9b564d6c22043fd2a8b5763e96a8",
      ],
      oldKey: "0x4",
      oldValue: "0x4e028",
      newRoot:
        "0x27682bb12c315e4168ade4429b5f9537fed5989da37ff36a28a5a9fe47b0b4cb",
      isOld0: false,
    });
  });

  it("update value for key", async () => {
    const tree = new SparseMerkleTree();
    await tree.initSMT();

    await tree.insert("6", "27391");
    await tree.insert("12", "10042");
    await tree.insert("1", "52384");
    await tree.insert("7", "952");
    await tree.insert("4", "319528");
    await tree.remove("12");
    await tree.insert("12", "10042");

    const result = await tree.update("12", "1234");
    const proof = await tree.toHexProof(result);

    expect(proof).toEqual({
      oldRoot:
        "0x27682bb12c315e4168ade4429b5f9537fed5989da37ff36a28a5a9fe47b0b4cb",
      oldKey: "0xc",
      oldValue: "0x273a",
      newKey: "0xc",
      newValue: "0x4d2",
      siblings: [
        "0x2404d85c4239ab92632eafd20b6153d3d7663e0178b0ea3ffc18c1c1e15adab3",
        "0x255002a9d7c0ef0e4e091c27f53808576fba9b564d6c22043fd2a8b5763e96a8",
        "0x0",
        "0x26f04a0bd3ea15562d0ff1f1d3fa1cc2b05ed3a5bd722983bac15165ff8a10e8",
      ],
      newRoot:
        "0xc9c833b31c7c0bec4bee093eff1c632a59ecdaacd79d39aa9c261c9a5c0212f",
    });
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
      notFoundKey: "0x2",
      notFoundValue: "0x39",
      siblings: [
        "0xafca9e05a26d88047a6a5aa36f9e58ff9b7c13c6c3dbbaf6ecaa064ace60544",
      ],
    });
  });

  it("get merkle root", async () => {
    const tree = new SparseMerkleTree();
    await tree.initSMT();

    await tree.insert("1", "8191");
    await tree.insert("2", "57");
    await tree.insert("5", "105");

    const root = await tree.getRoot();

    expect(root).toEqual(
      "0xd7bc55ee67b8889e1f98f73f0f8731a8a263f3fba973e1b347d95639a9a41ac"
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

    const root = await tree.getRoot();

    expect(root).toEqual(
      "0xd7bc55ee67b8889e1f98f73f0f8731a8a263f3fba973e1b347d95639a9a41ac"
    );
  });
});
