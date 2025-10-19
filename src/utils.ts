
/* IMPORT */

import type {Options} from './types';

/* MAIN */

const identity = <T> ( value: T ): T => {

  return value;

};

const isString = ( value: unknown ): value is string => {

  return typeof value === 'string';

};

const memoizeByObject = <T> ( fn: ( globs: string[], options?: Options ) => T ) => {

  const cacheFull = new WeakMap<string[], T>();
  const cachePartial = new WeakMap<string[], T>();

  return ( globs: string[], options?: Options ): T => {

    const cache = options?.partial ? cachePartial : cacheFull;
    const cached = cache.get ( globs );

    if ( cached !== undefined ) return cached;

    const result = fn ( globs, options );

    cache.set ( globs, result );

    return result;

  };

};

const memoizeByPrimitive = <T> ( fn: ( glob: string, options?: Options ) => T ) => {

  const cacheFull: Record<string, T> = {};
  const cachePartial: Record<string, T> = {};

  return ( glob: string, options?: Options ): T => {

    const cache = options?.partial ? cachePartial : cacheFull;

    return cache[glob] ??= fn ( glob, options );

  };

};

/* EXPORT */

export {identity, isString, memoizeByObject, memoizeByPrimitive};
