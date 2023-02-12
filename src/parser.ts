
/* IMPORT */

import {match, star, or, parse} from 'grammex';
import {memoize, splitWith} from './utils';
import type {Rule} from 'grammex';

/* RULES */

//TODO: Write this properly once we have parser combinators, to simplify it and to support arbitrary nesting levels

const GLOB_ESCAPE_RULES = [
  /* ESCAPED */
  match ( /(\\.)/, String ),
  /* ESCAPE */
  match ( /([$.*+?^(){}[\]\|])/, char => `\\${char}` ),
  /* PASSTHROUGH */
  match ( /(.)/, String )
];

const GLOB_NORMALIZE_RULES = [
  /* STAR STAR STAR+ */
  match ( /(\*\*\*+)/, '*' ),
  /* STAR STAR */
  match ( /(\*\*)/, ( match, stars, input, index ) => {
    const prev = input[+index - 1];
    const next = input[+index + 2];
    if ( prev && !'\\/{[(!'.includes ( prev ) ) return '*';
    if ( next && !'/)]}'.includes ( next ) ) return '*';
    return '**';
  }),
  /* ESCAPED */
  match ( /(\\.)/, String ),
  /* PASSTHROUGH */
  match ( /(.)/, String )
];

const GLOB_PARSE_RULES = [
  /* NEGATION - ODD */
  match ( /^(?:!!)*!(.*)$/, ( match, glob ) => `(?!^${parseGlob ( glob )}$).*?` ),
  /* NEGATION - EVEN */
  match ( /^(!!)+/, '' ),
  /* STAR STAR */
  match ( /\/(\*\*\/)+/, '(?:/.+/|/)' ),
  match ( /\/(\*\*)$/, '(?:/.*|$)' ),
  match ( /^(\*\*\/)+/, '(?:^|.*/)' ),
  match ( /(\*\*)/, '.*' ),
  /* STAR */
  match ( /(\*(?!\/\*\*\/)\/)/, '[^/]*/' ),
  match ( /(\*)/, '[^/]*' ),
  /* QUESTION */
  match ( /(\?)/, '[^/]' ),
  /* CLASS */
  match ( /\[([!^]?)([^\]]*)\]/, ( match, negation, chars ) => `[${negation && '^/'}${parseEscape ( chars )}]` ),
  /* BRACES */
  // Match regex: https://regex101.com/r/UVxqkv/1
  // Split regex: https://regex101.com/r/j8ZmA3/1
  match ( /\{((?:\\.|\{[^}]*\}|\[[^\]]*\]|[^}])*)\}/, ( match, alternations ) => `(?:${splitWith ( alternations, /(?:^(?=,)|\\.|\{[^}]*\}|\[[^\]]*\]|[^,]|(?<=,)$)+/g ).map ( parseGlob ).join ( '|' )})` ),
  /* ESCAPE */
  ...GLOB_ESCAPE_RULES
];

/* GRAMMARS */

const GLOB_ESCAPE_GRAMMAR = star ( or ( GLOB_ESCAPE_RULES ) );

const GLOB_NORMALIZE_GRAMMAR = star ( or ( GLOB_NORMALIZE_RULES ) );

const GLOB_PARSE_GRAMMAR = star ( or ( GLOB_PARSE_RULES ) );

/* MAIN */

const parseWith = ( input: string, rule: Rule<string, null> ): string => {

  return parse ( input, rule, null ).join ( '' );

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
