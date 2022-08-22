import { Transaction } from "../../src";

jest.setTimeout(10000);

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
        "0x1ef689fd4859c7093401cfed8d382889ef3f1ee374441135f83047a025be5363",
        "0x26d070402b12f981319ede73d53b6d43d33cc1a9bebe0074b2838bb7cd060cc8",
      ],
      S: "0x2272996215207829332951249135624369237153690411008752083133029957287025310710",
    });
  });
});
