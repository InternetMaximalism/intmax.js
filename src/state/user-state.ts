import { Database, SparseMerkleTree } from "../utils";

export class UserState {
  static readonly storeName = "user_state";
  private readonly db: Database;
  private smt: SparseMerkleTree;

  constructor() {
    this.db = new Database(UserState.storeName);
  }

  async initialize() {
    this.smt = new SparseMerkleTree();
    await this.smt.initSMT();

    const data = await this.db.getAll();

    await this.smt.bulkInsert(data);
  }

  getRoot() {
    return this.smt.getRoot();
  }

  async merge(diff: string[][]) {
    await this.smt.bulkInsert(diff);

    const tx = (await this.db.dbPromise).transaction(
      UserState.storeName,
      "readwrite"
    );

    return await Promise.all([
      ...diff.map(([key, value]) => tx.store.put(key, value)),
      tx.done,
    ]);
  }
}
