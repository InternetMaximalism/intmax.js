/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "ffjavascript";
declare module "fake-indexeddb/auto";
declare module "circomlibjs" {
  export function newMemEmptyTrie(): Promise<SMT>;
  export function buildPoseidonReference(): Promise<any>;
  export type SmtKey = any; // TODO: Uint8Array(32)
  export type SmtLeafValue = any; // TODO: Uint8Array(32)
  export type SmtInternalValue = any; // TODO: Uint8Array(32)
  export type Signature = {
    R8: string[];
    S: string;
  };
  export type SmtRoot = SmtInternalValue;
  export function buildEddsa(): Promise<Eddsa>;
  export class Eddsa {
    prvTopub(prv: string | Buffer): any;
    signPoseidon(prv: Buffer | string, msg: string): Signature;
    babyJub: any;
    F: any;
  }
  export class SMT {
    root: SmtInternalValue;
    hash0(): SmtInternalValue;
    hash1(): SmtInternalValue;
    F: any;
    update(key: SmtKey, newValue: SmtLeafValue): Promise<UpdateSmtResponse>;
    delete(key: SmtKey): Promise<DeleteFromSmtResponse>;
    insert(key: SmtKey, value: SmtLeafValue): Promise<InsertIntoSmtResponse>;
    find(key: SmtKey): Promise<FindFromSmtResponse>;
  }
  export type InsertIntoSmtResponse = {
    oldRoot: SmtInternalValue;
    oldKey: SmtKey;
    oldValue: SmtLeafValue;
    siblings: SmtInternalValue[];
    newRoot: SmtRoot;
    isOld0: boolean;
  };
  export type UpdateSmtResponse = {
    oldRoot: SmtInternalValue;
    oldKey: SmtKey;
    oldValue: SmtLeafValue;
    newKey: SmtKey;
    newValue: SmtLeafValue;
    siblings: SmtInternalValue[];
    newRoot: SmtRoot;
  };
  export type DeleteFromSmtResponse = {
    oldRoot: SmtInternalValue;
    oldKey: SmtKey;
    oldValue: SmtLeafValue;
    delKey: SmtKey;
    delValue: SmtLeafValue;
    siblings: SmtInternalValue[];
    newRoot: SmtRoot;
    isOld0: boolean;
  };
  export type FindFromSmtResponse =
    | {
        found: true;
        foundValue: SmtLeafValue;
        siblings: SmtInternalValue[];
        isOld0: boolean;
      }
    | {
        found: false;
        notFoundValue: SmtLeafValue;
        siblings: never[];
        isOld0: boolean;
      };
}
