import { openDB, IDBPDatabase } from "idb";
import { isNodeProcess } from "./detect";

if (isNodeProcess()) {
  import("fake-indexeddb/auto");
}

const INTMAX_DATABASE = "intmax_database";

export class Database {
  private readonly storeName: string;
  readonly dbPromise: Promise<IDBPDatabase<unknown>>;

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

  async clear() {
    return (await this.dbPromise).clear(this.storeName);
  }

  async getAll() {
    const db = await this.dbPromise;

    const keys = await db.getAllKeys(this.storeName);
    const promises = keys.map(async (key) => {
      const value = await db.get(this.storeName, key);

      return [key, value];
    });

    return await Promise.all(promises);
  }
}
