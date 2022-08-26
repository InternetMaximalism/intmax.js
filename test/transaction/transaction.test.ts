import { ethers } from "ethers";
import { Account, Transaction } from "../../src";

describe("Transaction", () => {
  const provider = new ethers.providers.JsonRpcProvider();

  it("get signed transaction data", async () => {
    const transaction = new Transaction({
      to: "0xd9024df085d09398ec76fbed18cac0e1149f50dc",
      from: "0x5854a9f49657916c9f5dd58c30aa823709889778",
      data: {
        value: "0x7cf5dab00000000000000000000000",
      },
    });

    const privateKey =
      "0x3c6bf5f7746f2b24c6610843546cd9122176f3ad0f374f3c19ea1cf396eda8c1";
    const account = new Account(provider);
    await account.activate(privateKey);

    const signedTx = await account.getSignedTransaction(transaction);

    expect(signedTx).toEqual({
      transaction: {
        contract_address: "0xd9024df085d09398ec76fbed18cac0e1149f50dc",
        nonce: 1,
      },
      tx_hash:
        "16aeb7378472613ac7bbb76583a81e85763a4553c2ea7109e6abc4aa2bcd0473",
      signature: {
        R8: [
          "0x1be4a108f157f4db33aabe16978813ada0b5209968bf59d51c07aa311e1e279a",
          "0x19eba96491583599b82ce4aadb26930ac59066c2bdc171c0737cce768a17d417",
        ],
        S: "0x2406314778134750133077201291822380936914413395045301310897433943706123142513",
      },
    });
  });
});
