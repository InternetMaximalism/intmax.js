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
        "0x05378333c69696e24d68e0a9a14485f1d63b6fa68887554eb8b07f69a79ca91d",
        "0xf6016bb89a440283e10c3079697d1a7dd33837f7dc7fb5e732f271dd06a29720",
      ],
      S: "0x2272996215207829332951249135624369237153690411008752083133029957287025310710",
    });
  });
});
