import { Scalar } from "ffjavascript";
import { Buffer } from "buffer";
import * as crypto from "crypto";
import { toHex, edd } from "../utils";

interface TxData {
  from?: string;
  to?: string;
  data?: {
    [key: string]: string;
  };
}

export class Transaction {
  public data: TxData;

  constructor(data: TxData = {}) {
    this.data = data;
  }

  async sign(privateKey: string) {
    const eddsa = await edd.getEddsa();

    const buffer = Buffer.from(JSON.stringify(this.data));
    const msgHashed = crypto.createHash("sha256").update(buffer).digest();
    const msg = eddsa.babyJub.F.e(Scalar.fromRprLE(msgHashed, 0));

    const prvKey = Buffer.from(privateKey, "hex");
    const signature = eddsa.signPoseidon(prvKey, msg);

    return {
      R8: signature.R8.map(toHex),
      S: `0x${signature.S}`,
    };
  }
}
