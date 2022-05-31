import test from "ava";
import { MerkleTree } from "../../src";

test("with neptune hash", (t) => {
  const leaves = ["01", "02", "03", "04"];
  const tree = new MerkleTree(leaves);

  t.is(
    tree.getRoot(),
    "22f40e25a04bed0f874789651413a13b056330d5e6cc01ece81901c871aa0d31"
  );
  t.deepEqual(tree.getProof(0), [
    "02",
    "0948c142afc442bd5577347bd836ff4466e91b1a95a045ad9cdbe89ed6f0eaab",
  ]);
  t.is(tree.getValue(1), "02");
});
