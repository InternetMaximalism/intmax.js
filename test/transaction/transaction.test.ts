import { ethers } from "ethers";
import { Account, Transaction } from "../../src";

describe("Transaction", () => {
  const provider = new ethers.providers.JsonRpcProvider();

  it("sign tx data", async () => {
    const tx = new Transaction({
      to: "0xd9024df085d09398ec76fbed18cac0e1149f50dc",
      from: "0x5854a9f49657916c9f5dd58c30aa823709889778",
      data: {
        value: "0x7cf5dab00000000000000000000000",
      },
    });

    const account = new Account(provider);
    await account.activate();

    const signedTx = await account.signTransaction(tx.data);

    expect(signedTx).toEqual({
      R8: [
        "0x86e1c59987018fa507ea72dc11b213af1de2a937683038a2e549d33fa67b719",
        "0x191311c37348bbfacc9e3e2e55562bfa3289a5c1e36899b480422b9e3183219c",
      ],
      S: "0x230833177213849518285192013347963486547572741225951194549798916400117838067",
    });
  });
});
