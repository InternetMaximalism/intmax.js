import { ethers } from "ethers";
import { Account, edd, toHex } from "../../src";

jest.setTimeout(10000);

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
      "0x0000000000000000000000000000000000000000000000000000000000000001";
    const [f, s] = eddsa.prvTopub(privateKey);

    expect(toHex(f)).toBe(
      "0xd561f1ce68d2ee40cd2e144f2024a8d74d59bf300023ce79a59e19736c9c3c17"
    );
    expect(toHex(s)).toBe(
      "0x897822539d2a64d4747ba04024a8b43c117bd8270619f61844e681f0e5175e0b"
    );
  });

  it("check signPoseidon signature", async () => {
    const eddsa = await edd.getEddsa();
    const privateKey =
      "0x0000000000000000000000000000000000000000000000000000000000000001";
    const msg =
      "0x0000000000000000000000000000000000000000000000000000000000000001";
    const { R8: r, S: s } = eddsa.signPoseidon(privateKey, msg);

    expect(toHex(r[0])).toBe(
      "0x2f5f43a4af8db2adebf0e8811536a0412a80d0d4a61ba9550a66bfbf420aff03"
    );
    expect(toHex(r[1])).toBe(
      "0xe567431de9bfd19e20f711542e49782e59c725b84751b0100315b31455f2fc22"
    );
    expect(s.toString()).toBe(
      "1842925266764536856618190689296271128085616062202856458404471185296361256045"
    );
  });
});
