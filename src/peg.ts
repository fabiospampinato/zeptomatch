
/* IMPORT */

import {isFunction} from './utils';

/* TYPES */

type Callback<T> = ( ...captures: string[] ) => T;
type Rule<T> = ( state: State<T> ) => boolean;
type State<T> = { input: string, index: number, output: T[] };

/* MAIN */

//TODO: Publish something like this as a standalone package
//TODO: Add optional backtracking and combinators (AND, OR, OPTIONAL, STAR, PLUS, GROUP, NON-CAPTURING GROUP, POSITIVENEGATIVE LOOK AHEAD)

const rule = <T> ( re: RegExp, callback: Callback<T> | T ): Rule<T> => {

  re = new RegExp ( re.source, 'suy' );

  return ( state: State<T> ): boolean => {

    re.lastIndex = state.index;

    const match = re.exec ( state.input );

    if ( !match ) return false;

    const [consumed, ...captures] = match;
    const args = [...captures, state.input, String ( match.index )];
    const output = isFunction ( callback ) ? callback ( ...args ) : callback;

    state.index += consumed.length;
    state.output.push ( output );

    return true;

  };

};

const parse = <T>( input: string, rules: Rule<T>[] ): T[] => {

  const state: State<T> = { input, index: 0, output: [] };

  while ( state.index < input.length ) {

    for ( const rule of rules ) {

      if ( rule ( state ) ) break;

    }

  }

  return state.output;

};

/* EXPORT */

export {rule, parse};
export type {Callback, Rule, State};
