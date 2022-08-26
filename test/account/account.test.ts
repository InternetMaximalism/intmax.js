import { ethers } from "ethers";
import { Account, crh, toHex } from "../../src";

describe("Account", () => {
  const provider = new ethers.providers.JsonRpcProvider();

  it("generate formatted account address", async () => {
    const account = new Account(provider);
    const address = await account.createAddress();

    expect(address).toHaveLength(42);
    expect(address.substring(0, 2)).toBe("0x");
  });

  it("pass specified private key", async () => {
    const privateKey = Buffer.from(
      "0000000000000000000000000000000000000000000000000000000000000001",
      "hex"
    );
    const account = new Account(provider);
    const address = await account.createAddress(privateKey);

    expect(address).toBe("0x315de3bf5ead49f7c2d45949d26ced7c599f716b");
  });

  it("check prvTopub value", async () => {
    const eddsa = await crh.getEddsa();

    // TODO: PrivateKey受け取りはBuffer形式に統一する
    const privateKey = Buffer.from(
      "0000000000000000000000000000000000000000000000000000000000000001",
      "hex"
    );
    const [x, y] = eddsa.prvTopub(privateKey);

    expect(await toHex(x)).toBe(
      "0x16fe43085bc15e88154f8e492b668248268bcfb029b6d496ab78dfef3e189ea5"
    );
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
      "0xe485905f903f7a685dcbabcc95b0cbaf04253f068e3683d512a61d069432ef6"
    );
    expect(await toHex(r[1])).toBe(
      "0x1e3acf5a663dcf22ac4e250224d50aaea65630df87cc15c2bd8a983a63f838e2"
    );
    expect(s.toString()).toBe(
      "1706270537006754120968195497236268103971389335408901934892211016010768296833"
    );
  });

  it("sign message", async () => {
    const account = new Account(provider);
    const address = await account.createAddress();

    expect(address).toHaveLength(42);
    expect(address.substring(0, 2)).toBe("0x");
  });
});
