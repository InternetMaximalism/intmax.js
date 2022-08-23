import { TxData } from "../interface";

export class Transaction {
  public data: TxData;

  constructor(data: TxData = {}) {
    this.data = data;
  }
}
