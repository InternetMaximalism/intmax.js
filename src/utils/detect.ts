export const isNodeProcess = new Function(
  "try {return this===global;}catch(e){return false;}"
);
