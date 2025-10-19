
/* MAIN */

type Node = {
  regex?: RegExp,
  children: Node[]
};

type Options = {
  partial?: boolean
};

/* EXPORT */

export type {Node, Options};
