import { ethers } from "ethers";
import { Account, crh, toHex } from "../../src";

jest.setTimeout(30000);

describe("Account", () => {
  const provider = new ethers.providers.JsonRpcProvider();

  it("generate formatted account address", async () => {
    const account = new Account(provider);
    const address = await account.createAddress();

    expect(address).toHaveLength(42);
    expect(address.substring(0, 2)).toBe("0x");
  });

  it("pass specified private key", async () => {
    const privateKey =
      "0x0b33a107e4b1078160010ca65332269337b4424b095e2e8d91c7dbec336479c5";
    const account = new Account(provider);
    const address = await account.createAddress(privateKey);

    expect(address).toBe("0x14d37961933af8d7b4225a6b8a71919156bfd0af");
  });

  it("check prvTopub value", async () => {
    const eddsa = await crh.getEddsa();
    const privateKey = Buffer.from(
      "0000000000000000000000000000000000000000000000000000000000000001",
      "hex"
    );
    const [x, y] = eddsa.prvTopub(privateKey);

    // expect(await toHex(x)).toBe(
    //   "0x21f28bc1110e2a818287bea6ed159d6033ad5d0d28b30bf865616c5f524d48fc"
    // );
    expect(await toHex(y)).toBe(
      "0x13c207a69f6e609215e86cc1ff67d860ea5fe371fcf744b3752b7b6f39035ae7"
    );

    const account = new Account(provider);
    const address = await account.createAddress(privateKey);

    expect(address).toBe("0x315de3bf5ead49f7c2d45949d26ced7c599f716b");
  });

  it("check signPoseidon signature", async () => {
    const eddsa = await crh.getEddsa();
    const privateKey =
      "0x0000000000000000000000000000000000000000000000000000000000000001";
    const msg =
      "0x0000000000000000000000000000000000000000000000000000000000000001";
    const { R8: r, S: s } = eddsa.signPoseidon(privateKey, msg);

    expect(await toHex(r[0])).toBe(
      "0x6bf9f349c8d1c0167d5e34fbb07a39213a62aae7590f5625bded8a446e61c01"
    );
    expect(await toHex(r[1])).toBe(
      "0x15c93553b0c00335b0a188376067b785fe7b33820f883bb5b1c8e5586c38efba"
    );
    expect(s.toString()).toBe(
      "1842925266764536856618190689296271128085616062202856458404471185296361256045"
    );
  });
});
