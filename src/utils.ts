
/* MAIN */

const isFunction = ( value: unknown ): value is Function => {

  return typeof value === 'function';

};

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

export {isFunction, memoize, splitWith};
