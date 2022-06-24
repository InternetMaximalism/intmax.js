import * as buffer from "buffer/";
import { poseidonHash } from "../../src";

describe("poseidonHash", () => {
  it("with array number", async () => {
    const hash = await poseidonHash([1, 2]);

    expect(buffer.Buffer.from(hash).toString("hex")).toBe(
      "76d103564ceff157c312c45842e53c4ec550216b60e59842340eca3554079809"
    );
  });
});
