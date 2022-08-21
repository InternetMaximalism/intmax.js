import { ethers } from "ethers";
import { Account } from "../../src";

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
});
