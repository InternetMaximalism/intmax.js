import { ethers } from "ethers";
import { Scalar } from "ffjavascript";
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
      "0000000000000000000000000000000000000000000000000000000000000003",
      "hex"
    );
    const account = new Account(provider);
    const address = await account.createAddress(privateKey);

    expect(address).toBe("0xd6a0199df9e39124809ed0d039f70f5d008ada00");
  });

  it("check prvTopub value", async () => {
    const eddsa = await crh.getEddsa();

    // TODO: PrivateKey受け取りはBuffer形式に統一する
    const privateKey = Buffer.from(
      "0000000000000000000000000000000000000000000000000000000000000001",
      "hex"
    );
    const [, y] = eddsa.prvTopub(privateKey);

    // expect(await toHex(x)).toBe(
    //   "0x21f28bc1110e2a818287bea6ed159d6033ad5d0d28b30bf865616c5f524d48fc"
    // );
    expect(await toHex(y)).toBe(
      "0x13c207a69f6e609215e86cc1ff67d860ea5fe371fcf744b3752b7b6f39035ae7"
    );

    const account = new Account(provider);
    const address = await account.createAddress(privateKey);

    expect(address).toBe("0x16f799c5d7ce269d94452d7c9fd4eaf53bde15a3");
  });

  it("check signPoseidon signature", async () => {
    const eddsa = await crh.getEddsa();
    const privateKey = Buffer.from(
      "0000000000000000000000000000000000000000000000000000000000000001",
      "hex"
    );
    const msgBuf = new Uint8Array(32);
    msgBuf.set(
      Buffer.from(
        "0100105c9e139eb220b73f3160b40bcb04d7ffca70f5978e896e506e24ea3330",
        "hex"
      ),
      0
    );

    const msg = eddsa.babyJub.F.e(Scalar.fromRprLE(msgBuf, 0));
    const { R8: r, S: s } = eddsa.signPoseidon(privateKey, msg);

    expect(s.toString(16)).toBe(
      "b94449c7f01c28626c72fd926afb5249e8c485ee87105edfa2af0dd891da76"
    );
    expect(await toHex(r[1])).toBe(
      "0x27011e073cb19b68f3569f7e955982d7d95210b5cb38a4fa310c20dfb645c0aa"
    );
    expect(await toHex(r[0])).toBe(
      "0xb372846449b6a2a8c1c38613d79a5d0817d68b5aa65eedc87ce43c0a7cc0940"
    );
  });

  it("sign message", async () => {
    const account = new Account(provider);
    const address = await account.createAddress();

    expect(address).toHaveLength(42);
    expect(address.substring(0, 2)).toBe("0x");
  });
});
