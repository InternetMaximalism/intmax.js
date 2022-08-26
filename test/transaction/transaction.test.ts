import { ethers } from "ethers";
import { Account, Transaction } from "../../src";

describe("Transaction", () => {
  const provider = new ethers.providers.JsonRpcProvider();

  it("get signed transaction data", async () => {
    const privateKey = Buffer.from(
      "0000000000000000000000000000000000000000000000000000000000000001",
      "hex"
    );
    const account = new Account(provider);
    await account.activate(privateKey);

    const transaction = new Transaction({
      to: "0xd9024df085d09398ec76fbed18cac0e1149f50dc",
      from: "0x5854a9f49657916c9f5dd58c30aa823709889778",
      data: {
        value: "0x7cf5dab00000000000000000000000",
      },
    });

    const signedTx = await account.getSignedTransaction(transaction);

    expect(signedTx).toEqual({
      transaction: {
        contract_address: "0xd9024df085d09398ec76fbed18cac0e1149f50dc",
        nonce: 1,
      },
      tx_hash: "74982d04fe6b96c7f1ee9e91e94dcb0d0f2487ecd00266086a9ca4735eaab4",
      signature: {
        R8: [
          "0x1fc54cb4786899702c6cf39b12f183aa554e57dfce21459641a744d27cc01b17",
          "0x5e43ceed5c4a8f82da5b4517ed7a185de06b0856aaa6128b660f1a19d4b09eb",
        ],
        S: "0x1891475010171774572013505990967488256389827845472630859491691733750570320191",
      },
    });
  });
});
