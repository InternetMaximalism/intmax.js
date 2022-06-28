import { Buffer } from "buffer";

export const toHex = (value: Buffer | string) => {
  if (typeof value === "string") {
    return value;
  }

  return `0x${Buffer.from(value).toString("hex")}`;
};
