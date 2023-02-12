
/* MAIN */

const memoize = <T> ( fn: ( arg: string ) => T ): (( arg: string ) => T) => {

  const cache: Record<string, T> = {};

  return ( arg: string ): T => {

    return cache[arg] ??= fn ( arg );

  };

};

const splitWith = ( str: string, re: RegExp ): string[] => {

  return [...str.matchAll ( re )].map ( match => match[0] );

};

/* EXPORT */

export {memoize, splitWith};
