import { MerkleTree, toHex, crh } from "../../src";

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

  it("another value leaves", async () => {
    const poseidonHash = await crh.getPoseidon();
    const leaves = ["11", "24", "32", "49", "52", "60", "80", "90"];
    const tree = new MerkleTree(leaves, (n1: string, n2: string) =>
      poseidonHash([n1, n2])
    );

    expect(await toHex(tree.getRoot())).toBe(
      "0x17f6875e3168b0c9db610264feb9c898a0844e49f4f86bf39741087a424cd53d"
    );
    expect(await Promise.all(tree.getProof(2).map(toHex))).toEqual([
      "49",
      "0xd6c10b168d1c2e70b1c9da5ebbaa9e82d943098b289463ca8641ae4cb65f2d4",
      "0x6b0ae651ced429c9cc31d8d6b9bd36886f3c9c654f9709e0743cb386021a211",
    ]);
    expect(tree.getValue(2)).toBe("32");
  });

  it("you should pass supported leave length", async () => {
    const poseidonHash = await crh.getPoseidon();
    const leaves = ["01", "02", "03"];

    expect(
      () =>
        new MerkleTree(leaves, (n1: string, n2: string) =>
          poseidonHash([n1, n2])
        )
    ).toThrow("This leaves length is not supported");
  });

  it("you should pass at least two leaves", async () => {
    const poseidonHash = await crh.getPoseidon();
    const leaves = ["01"];

    expect(
      () =>
        new MerkleTree(leaves, (n1: string, n2: string) =>
          poseidonHash([n1, n2])
        )
    ).toThrow("You pass two leaves at least");
  });
});
