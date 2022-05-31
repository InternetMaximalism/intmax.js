import neptune from "neptune-js";

type Leaf = string;
type Node = string;
type HashFn = (n1: string, n2: string) => string;

export class MerkleTree {
  private leaves: Leaf[] = [];
  private nodes: Node[] = [];
  private hashFn: HashFn;
  private zero = "00";

  constructor(leaves: Leaf[] = [], hashFn: HashFn = neptune.poseidon_t3) {
    this.validateLeaves(leaves);

    this.hashFn = hashFn;

    this.populateLeaves(leaves);
  }

  getNodes(): Node[] {
    return this.nodes;
  }

  getLeaves(): Leaf[] {
    return this.leaves;
  }

  getRoot(): Node {
    return this.nodes[1];
  }

  getValue(index: number): Leaf {
    return this.leaves[index];
  }

  getProof(index: number): Node[] {
    const targetNodeId = index + this.leaves.length;
    const depth = Math.ceil(Math.log(this.leaves.length) / Math.log(2));

    const siblings: Node[] = [];

    let lastNodeId = 0;
    for (let i = depth; i > 0; i--) {
      if (siblings.length === 0) {
        lastNodeId = targetNodeId ^ 1;
      } else {
        lastNodeId = Math.floor(lastNodeId / 2) ^ 1;
      }

      siblings.push(this.nodes[lastNodeId]);
    }

    return siblings;
  }

  private validateLeaves(leaves: Leaf[]) {
    if (leaves.length < 1) {
      throw new Error("You pass one leaf at least");
    }

    let n = leaves.length;
    while (n > 1) {
      n = n / 2;
    }

    if (n !== 1) {
      throw new Error("This leaves length is not supported");
    }
  }

  private populateLeaves(leaves: Leaf[]) {
    this.leaves = leaves;

    this.nodes = Array.from(Array(this.leaves.length))
      .fill(this.zero)
      .concat(this.leaves);

    for (let i = this.leaves.length - 1; i > 0; i--) {
      this.nodes[i] = this.createHash(this.nodes[2 * i], this.nodes[2 * i + 1]);
    }
  }

  private createHash(n1: string, n2: string) {
    return this.hashFn(n1, n2);
  }
}
