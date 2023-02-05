
/* IMPORT */

import {rule, parse} from './peg';
import {memoize} from './utils';
import type {Rule} from './peg';

/* HELPERS */

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
  /* EXTENDED - ONE */
  rule ( /@\(([^)]*)\)/, glob => `${parseGlob ( glob )}(?!${parseGlob ( glob )})` ),
  /* EXTENDED - STAR */
  rule ( /\*\(([^)]*)\)/, glob => `(?:${parseGlob ( glob )})*` ),
  /* EXTENDED - PLUS */
  rule ( /\+\(([^)]*)\)/, glob => `(?:${parseGlob ( glob )})+` ),
  /* EXTENDED - QUESTION */
  rule ( /\?\(([^)]*)\)/, glob => `(?:${parseGlob ( glob )})?` ),
  /* EXTENDED - NEGATION */
  rule ( /!\(([^)]*)\)/, glob => `(?!${parseGlob ( glob )}).*?` ),
  /* NEGATION NEGATION */
  rule ( /^(!!)+/, '' ),
  /* NEGATION */
  rule ( /^!(.*)$/, glob => `(?!^${parseGlob ( glob )}$).*?` ),
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
  rule ( /\{([^\}]*)\}/, alternations => `(?:${alternations.split ( /(?<!\\),/g ).map ( parseGlob ).join ( '|' )})` ), //TODO: Support nesting (matching+splitting) //TODO: No lookbehinds!
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
