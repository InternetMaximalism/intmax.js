import { ethers } from "ethers";
import { Account, SignedTransaction, Transaction } from "../../src";

describe("Transaction", () => {
  const provider = new ethers.providers.JsonRpcProvider();

  it("get signed transaction data", async () => {
    const privateKey = Buffer.from(
      "0000000000000000000000000000000000000000000000000000000000000003",
      "hex"
    );
    const account = new Account(provider);
    await account.activate(privateKey);

    const sender =
      "00000000000000000000000086f616f870b89668e6021b0b6070a9234a236c50";
    const receiver =
      "000000000000000000000000e7b7e03eb0af47f303cf33707d755cdd9fc22a9f";
    const tokenId =
      "0000000000000000000000000000000000000000000000000000000000000001";
    const transaction = new Transaction({
      to: "0x0000000000000000000000000000000000000001",
      from: "0xd6a0199df9e39124809ed0d039f70f5d008ada00",
      nonce: "0x0000000000000001",
      function_signature: "0x00000001", // `1` represents the transfer method
      calldata: "0x" + sender + receiver + tokenId,
    });

    const signedTx = await account.getSignedTransaction(transaction);

    const result: SignedTransaction = {
      transaction: {
        nonce: "0x0000000000000001",
        contract_address: "0x0000000000000000000000000000000000000001",
        function_signature: "0x00000001",
        calldata: "0x" + sender + receiver + tokenId,
      },
      tx_hash:
        "0x189800e4a33afcaacf60e286341e29681badfe1f063cc0d32ac4115a4bfd7e3f",
      public_key:
        "0x951e5c8e75ae0a5f934fc0489e8932b1a46be309fe2034afacfca2a868209018",
      signature:
        "0x4cf7cd6e12b32771952032d3602a10d5456443f672ad43ec93872ee873293215" +
        "a7d9dcffe08e76bf4e06cefb86338d9298913f52c581035d7f6bea6744823f00",
    };
    expect(signedTx).toEqual(result);
  });
});
