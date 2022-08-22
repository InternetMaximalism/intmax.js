import { UserState, Database } from "../../src";

jest.setTimeout(30000);

describe("UserState", () => {
  beforeAll(async () => {
    const db = new Database(UserState.storeName);

    await db.set("1", "8191");
    await db.set("2", "57");
    await db.set("5", "105");
  });

  afterAll(async () => {
    const db = new Database(UserState.storeName);

    await db.clear();
  });

  it("merge diff and change the root", async () => {
    const state = new UserState("http://localhost:3000");
    await state.initialize();

    const prev = state.getRoot();

    await state.merge([
      ["10", "500"],
      ["15", "1020"],
    ]);

    expect(state.getRoot()).not.toBe(prev);
  });
});
