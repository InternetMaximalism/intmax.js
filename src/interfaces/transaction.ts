export interface TxData {
  from?: string;
  to?: string;
  data?: {
    [key: string]: string;
  };
}
