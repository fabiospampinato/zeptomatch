
/* IMPORT */

import {rule, parse} from './peg';
import {memoize, splitWith} from './utils';
import type {Rule} from './peg';

/* HELPERS */

//TODO: Write this properly, once parser combinators are implemented in the peg library, these regexes for 1 level of nesting got a bit out of control

const SPLIT_BY_COMMA_RE = /(?:^(?=,)|\\.|\{[^}]*\}|[@*+?!]\([^)]*\)|\[[^\]]*\]|[^,]|(?<=,)$)+/g;
const SPLIT_BY_PIPE_RE = /(?:^(?=\|)|\\.|\{[^}]*\}|[@*+?!]\([^)]*\)|\[[^\]]*\]|[^\|]|(?<=\|)$)+/g;

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
  rule ( /@\(((?:\\.|\{[^}]*\}|[@*+?!]\([^)]*\)|\[[^\]]*\]|[^)])*)\)/, glob => `${parseSplitGlob ( glob, SPLIT_BY_PIPE_RE )}(?!${parseSplitGlob ( glob, SPLIT_BY_PIPE_RE )})` ),
  /* EXTENDED - STAR */
  rule ( /\*\(((?:\\.|\{[^}]*\}|[@*+?!]\([^)]*\)|\[[^\]]*\]|[^)])*)\)/, glob => `(?:${parseSplitGlob ( glob, SPLIT_BY_PIPE_RE )})*` ),
  /* EXTENDED - PLUS */
  rule ( /\+\(((?:\\.|\{[^}]*\}|[@*+?!]\([^)]*\)|\[[^\]]*\]|[^)])*)\)/, glob => `(?:${parseSplitGlob ( glob, SPLIT_BY_PIPE_RE )})+` ),
  /* EXTENDED - QUESTION */
  rule ( /\?\(((?:\\.|\{[^}]*\}|[@*+?!]\([^)]*\)|\[[^\]]*\]|[^)])*)\)/, glob => `(?:${parseSplitGlob ( glob, SPLIT_BY_PIPE_RE )})?` ),
  /* EXTENDED - NEGATION */
  rule ( /!\(((?:\\.|\{[^}]*\}|[@*+?!]\([^)]*\)|\[[^\]]*\]|[^)])*)\)/, glob => `(?!${parseSplitGlob ( glob, SPLIT_BY_PIPE_RE )}).*?` ),
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
  rule ( /\{((?:\\.|\{[^}]*\}|[@*+?!]\([^)]*\)|\[[^\]]*\]|[^}])*)\}/, alternations => `(?:${parseSplitGlob ( alternations, SPLIT_BY_COMMA_RE )})` ),
  //URL: https://regex101.com/r/UVxqkv/1
  //URL: https://regex101.com/r/j8ZmA3/1
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

const parseSplitGlob = ( input: string, split: RegExp ): string => {

  return splitWith ( input, split ).map ( parseGlob ).join ( '|' );

};

/* EXPORT */

export {parseEscape, parseNormalize, parseGlob};
