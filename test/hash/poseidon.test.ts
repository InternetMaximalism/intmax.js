import { crh, toHex } from "../../src";

describe("Poseidon", () => {
  it("check Poseidon hash", async () => {
    const eddsa = await crh.getEddsa();
    const poseidonHash = await crh.getPoseidon();

    const left = eddsa.babyJub.F.e(BigInt("0x071b270528097f26ea14fd9a0efda86ea944fde3e2879106b1c0aea95bfdfc3a"));
    const right = eddsa.babyJub.F.e(BigInt("0x18902068a8a2fcacaf3420fe09e36ba4b132899e48c04f935f0aae758e5c1e95"));
    const input = [left, right];
    const output = poseidonHash(input);

    expect(await toHex(output)).toBe(
      "0x2a127b469e2532858ce153f400da8a005d0ff739d0d09e802491e3f99d19a0d6"
    );
  });
});
