import * as buffer from "buffer";

export const toHex = (value: buffer.Buffer | string) => {
  if (typeof value === "string") {
    return value;
  }

  return `0x${buffer.Buffer.from(value).toString("hex")}`;
};
