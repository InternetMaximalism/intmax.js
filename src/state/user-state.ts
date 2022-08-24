import { Database, SparseMerkleTree, RequestClient } from "../utils";

export class UserState {
  static readonly storeName = "user_state";
  private readonly db: Database;
  private smt: SparseMerkleTree;
  private readonly request: RequestClient;

  constructor(baseUrl: string) {
    this.db = new Database(UserState.storeName);
    this.request = new RequestClient(baseUrl);
  }

  async initialize() {
    this.smt = new SparseMerkleTree();
    await this.smt.initSMT();

    const data = await this.db.getAll();

    return await this.smt.bulkInsert(data);
  }

  async getRoot(): Promise<string> {
    return await this.smt.getRoot();
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
