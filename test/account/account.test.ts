import { Account } from "../../src";
import { ethers } from "ethers";

jest.setTimeout(10000);

describe("Account", () => {
  it("generate account address", async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const account = new Account(provider);
    const address = await account.createAddress();

    expect(address).toHaveLength(42);
  });
});
