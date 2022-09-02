export type AccountData = {
  privateKey: Buffer;
  publicKey: [Uint8Array, Uint8Array];
  address: string; // 20 bytes hex string with 0x-prefix
  nonce: string; // 8 bytes hex string with 0x-prefix
};
