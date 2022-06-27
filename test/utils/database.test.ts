import { Database } from "../../src";

describe("Database", () => {
  it("get all data from object store", async () => {
    const db = new Database("test");

    await db.set("1", "8191");
    await db.set("2", "57");
    await db.set("5", "105");

    const result = await db.getAll();

    expect(result).toEqual([
      ["1", "8191"],
      ["2", "57"],
      ["5", "105"],
    ]);
  });
});
