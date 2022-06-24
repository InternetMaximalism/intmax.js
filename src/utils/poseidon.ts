import * as circomlibjs from "circomlibjs";

export const poseidonHash = async (inputs: number[]) => {
  const poseidon = await circomlibjs.buildPoseidonReference();

  return poseidon(inputs);
};
