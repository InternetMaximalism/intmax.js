import { ethers } from "ethers";
import { Account, edd, toHex } from "../../src";

jest.setTimeout(100000);

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

    expect(address).toBe("0x2fd9ec81bfb972f0b42fcce919718e44e8b924da");
  });

  it("check prvTopub value", async () => {
    const eddsa = await edd.getEddsa();
    const privateKey =
      Buffer.from("0000000000000000000000000000000000000000000000000000000000000001", "hex");
    const [x, y] = eddsa.prvTopub(privateKey);

    // expect(await toHex(x)).toBe(
    //   "0x21f28bc1110e2a818287bea6ed159d6033ad5d0d28b30bf865616c5f524d48fc"
    // );
    expect(await toHex(y)).toBe(
      "0x13c207a69f6e609215e86cc1ff67d860ea5fe371fcf744b3752b7b6f39035ae7"
    );

    const account = new Account(provider);
    const address = await account.createAddress(privateKey);
  
    expect(address).toBe("0x25a374d11e8d609b0e44355c2f14d081a51cb132");
  });

  it("check signPoseidon signature", async () => {
    const eddsa = await edd.getEddsa();
    const privateKey =
      "0x0000000000000000000000000000000000000000000000000000000000000001";
    const msg =
      "0x0000000000000000000000000000000000000000000000000000000000000001";
    const { R8: r, S: s } = eddsa.signPoseidon(privateKey, msg);

    expect(await toHex(r[0])).toBe(
      "0x2f5f43a4af8db2adebf0e8811536a0412a80d0d4a61ba9550a66bfbf420aff03"
    );
    expect(await toHex(r[1])).toBe(
      "0xe567431de9bfd19e20f711542e49782e59c725b84751b0100315b31455f2fc22"
    );
    expect(s.toString()).toBe(
      "1842925266764536856618190689296271128085616062202856458404471185296361256045"
    );
  });
});
