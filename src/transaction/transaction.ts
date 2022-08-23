import { TxData } from "../interfaces";

export class Transaction {
  public data: TxData;

  constructor(data: TxData = {}) {
    this.data = data;
  }
}
