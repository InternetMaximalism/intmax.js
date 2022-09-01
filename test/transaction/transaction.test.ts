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

    // expect(signature).toEqual({
    //   R8: [
    //     "0x292cee004061862f29aa9f6c7676756162080b8fd25ced46d9986a71d9a1d7dd",
    //     "0xc55c74a0d10df51a1c193a6dfaf4eafcb8a6738d6e5144f57773cf962cc4044",
    //   ],
    //   S: "0x1869277942496310060405198470715151722398093762142578141445812726747478551882",
    // });

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
        "0x7c624d65cfe68ce09b881bb4ec03a92325ae7c4650943d65cc9b836a3ff8ea87" +
        "1b5c24ca1714425da2b6bbfa12cb23d2ccf8fa066904c1caf75ec51e0a4d4a04",
    };
    expect(signedTx).toEqual(result);
  });
});
