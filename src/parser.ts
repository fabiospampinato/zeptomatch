
/* IMPORT */

import {rule, parse} from './peg';
import {memoize, splitWith} from './utils';
import type {Rule} from './peg';

/* HELPERS */

//TODO: Write this properly once we have parser combinators, to simplify it and to support arbitrary nesting levels

const GLOB_ESCAPE_GRAMMAR = [
  /* ESCAPED */
  rule ( /(\\.)/, String ),
  /* ESCAPE */
  rule ( /([$.*+?^(){}[\]\|])/, char => `\\${char}` ),
  /* PASSTHROUGH */
  rule ( /(.)/, String )
];

const GLOB_NORMALIZE_GRAMMAR = [
  /* STAR STAR STAR+ */
  rule ( /(\*\*\*+)/, '*' ),
  /* STAR STAR */
  rule ( /(\*\*)/, ( _, glob, index ) => {
    const prev = glob[+index - 1];
    const next = glob[+index + 2];
    if ( prev && !'\\/{[(!'.includes ( prev ) ) return '*';
    if ( next && !'/)]}'.includes ( next ) ) return '*';
    return '**';
  }),
  /* ESCAPED */
  rule ( /(\\.)/, String ),
  /* PASSTHROUGH */
  rule ( /(.)/, String )
];

const GLOB_PARSE_GRAMMAR = [
  /* NEGATION - ODD */
  rule ( /^(?:!!)*!(.*)$/, glob => `(?!^${parseGlob ( glob )}$).*?` ),
  /* NEGATION - EVEN */
  rule ( /^(!!)+/, '' ),
  /* STAR STAR */
  rule ( /\/(\*\*\/)+/, '(?:/.+/|/)' ),
  rule ( /\/(\*\*)$/, '(?:/.*|$)' ),
  rule ( /^(\*\*\/)+/, '(?:^|.*/)' ),
  rule ( /(\*\*)/, '.*' ),
  /* STAR */
  rule ( /(\*(?!\/\*\*\/)\/)/, '[^/]*/' ),
  rule ( /(\*)/, '[^/]*' ),
  /* QUESTION */
  rule ( /(\?)/, '[^/]' ),
  /* CLASS */
  rule ( /\[([!^]?)([^\]]*)\]/, ( negation, chars ) => `[${negation && '^/'}${parseEscape ( chars )}]` ),
  /* BRACES */
  // Match regex: https://regex101.com/r/UVxqkv/1
  // Split regex: https://regex101.com/r/j8ZmA3/1
  rule ( /\{((?:\\.|\{[^}]*\}|\[[^\]]*\]|[^}])*)\}/, alternations => `(?:${splitWith ( alternations, /(?:^(?=,)|\\.|\{[^}]*\}|\[[^\]]*\]|[^,]|(?<=,)$)+/g ).map ( parseGlob ).join ( '|' )})` ),
  /* ESCAPE */
  ...GLOB_ESCAPE_GRAMMAR
];

/* MAIN */

const parseWith = ( input: string, rules: Rule<string>[] ): string => {

  return parse ( input, rules ).join ( '' );

};

const parseEscape = ( glob: string ): string => {

  return parseWith ( glob, GLOB_ESCAPE_GRAMMAR );

};

const parseNormalize = ( glob: string ): string => {

  return parseWith ( glob, GLOB_NORMALIZE_GRAMMAR );

};

const parseGlob = memoize (( glob: string ): string => {

  return parseWith ( parseNormalize ( glob ), GLOB_PARSE_GRAMMAR );

});

/* EXPORT */

export {parseEscape, parseNormalize, parseGlob};
