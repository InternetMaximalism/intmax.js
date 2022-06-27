import { openDB, IDBPDatabase } from "idb";
import { isNodeProcess } from "./detect";

if (isNodeProcess()) {
  import("fake-indexeddb/auto");
}

const INTMAX_DATABASE = "intmax-database";

export class Database {
  private readonly dbPromise: Promise<IDBPDatabase<unknown>>;
  private readonly storeName: string;

  constructor(storeName: string) {
    this.storeName = storeName;

    this.dbPromise = openDB(INTMAX_DATABASE, 1, {
      upgrade(db) {
        db.createObjectStore(storeName);
      },
    });
  }

  async get(key: string) {
    return (await this.dbPromise).get(this.storeName, key);
  }

  async set(key: string, val: string) {
    return (await this.dbPromise).put(this.storeName, val, key);
  }
}
