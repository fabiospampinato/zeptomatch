
/* IMPORT */

import {parse} from 'grammex';
import type {Rule} from 'grammex';

/* MAIN */

const identity = <T> ( value: T ): T => {

  return value;

};

const makeParser = ( grammar: Rule<string, unknown> ) => {

  return memoize (( input: string ): string => {

    return parse ( input, grammar, null ).join ( '' );

  });

};

const memoize = <T> ( fn: ( arg: string ) => T ): (( arg: string ) => T) => {

  const cache: Record<string, T> = {};

  return ( arg: string ): T => {

    return cache[arg] ??= fn ( arg );

  };

};

/* EXPORT */

export {identity, makeParser, memoize};
