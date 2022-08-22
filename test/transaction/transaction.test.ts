import { Transaction } from "../../src";

describe("Transaction", () => {
  it("sign tx data", async () => {
    const tx = new Transaction({
      to: "0xd9024df085d09398ec76fbed18cac0e1149f50dc",
      from: "0x5854a9f49657916c9f5dd58c30aa823709889778",
      data: {
        value: "0x7cf5dab00000000000000000000000",
      },
    });

    const signature = await tx.sign(
      "0001020304050607080900010203040506070809000102030405060708090001"
    );

    expect(signature).toEqual({
      R8: [
        "0x292cee004061862f29aa9f6c7676756162080b8fd25ced46d9986a71d9a1d7dd",
        "0xc55c74a0d10df51a1c193a6dfaf4eafcb8a6738d6e5144f57773cf962cc4044",
      ],
      S: "0x1869277942496310060405198470715151722398093762142578141445812726747478551882",
    });
  });
});
