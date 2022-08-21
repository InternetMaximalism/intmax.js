import { Buffer } from "buffer";

export type BufferString = Buffer | Buffer[] | string[] | string;

export const toHex = (value: Buffer | string): string => {
  if (typeof value === "string") {
    return value;
  }

  return `0x${Buffer.from(value).toString("hex")}`;
};

export const toHexFromArray = (value: BufferString) => {
  if (Array.isArray(value)) {
    return value.map(toHex);
  }

  return toHex(value);
};
