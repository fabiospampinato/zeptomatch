
/* IMPORT */

import {parse} from 'grammex';
import type {ExplicitRule} from 'grammex';

/* MAIN */

const identity = <T> ( value: T ): T => {

  return value;

};

const makeParser = ( grammar: ExplicitRule<string> ) => {

  return memoize (( input: string ): string => {

    return parse ( input, grammar, { memoization: false } ).join ( '' );

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
