export interface TxData {
  from?: string;
  to?: string;
  data?: {
    [key: string]: string;
  };
}

export interface Signature {
  R8: string[];
  S: string;
}
