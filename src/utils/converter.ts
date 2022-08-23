import { Buffer } from "buffer";
import { crh } from "./crypto-hash";

export type BufferString = Buffer | Buffer[] | string[] | string;

export const toHex = async (value: Buffer | string): Promise<string> => {
  if (typeof value === "string") {
    return value;
  }

  const eddsa = await crh.getEddsa();
  const d = eddsa.F.toString(value);

  return `0x${BigInt(d).toString(16)}`;
};

export const toHexFromArray = async (
  value: BufferString
): Promise<string | string[]> => {
  if (Array.isArray(value)) {
    return await Promise.all(value.map(toHex));
  }

  return await toHex(value);
};
