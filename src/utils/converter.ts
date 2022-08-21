import { Buffer } from "buffer";
import * as circomlibjs from "circomlibjs";

export type BufferString = Buffer | Buffer[] | string[] | string;

export const toHex = async (value: Buffer | string) => {
  if (typeof value === "string") {
    return value;
  }

  const eddsa = await circomlibjs.buildEddsa();
  const d = eddsa.babyJub.F.toString(value);
  
  return `0x${BigInt(d).toString(16)}`;
};

export const toHexFromArray = async (value: BufferString) => {
  if (Array.isArray(value)) {
    return await Promise.all(value.map(toHex));
  }

  return await toHex(value);
};
