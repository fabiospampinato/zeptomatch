
/* IMPORT */

import {match, and, lazy, optional, plus, or, star} from 'grammex';
import {makeRangeAlpha, makeRangePaddedInt} from '../range';
import {identity} from '../utils';
import zeptomatch from '..';
import {regex, alternation, sequence, slash} from './utils';

/* MAIN */

const Escaped = match ( /\\./, regex );
const Escape = match ( /[$.*+?^(){}[\]\|]/, char => regex ( `\\${char}` ) );
const Slash = match ( /[\\\/]/, slash );
const Passthrough = match ( /[^$.*+?^(){}[\]\|\\\/]+/, regex );

const NegationOdd = match ( /^(?:!!)*!(.*)$/, ( _, glob ) => regex ( `(?!^${zeptomatch.compile ( glob ).source}$).*?` ) );
const NegationEven = match ( /^(!!)+/ );
const Negation = or ([ NegationOdd, NegationEven ]);

const StarStarBetween = match ( /\/(\*\*\/)+/, () => alternation ([ sequence ([ slash (), regex ( '.+?' ), slash () ]), slash () ]) );
const StarStarStart = match ( /^(\*\*\/)+/, () => alternation ([ regex ( '^' ), sequence ([ regex ( '.*?' ), slash () ]) ]) );
const StarStarEnd = match ( /\/(\*\*)$/, () => alternation ([ sequence ([ slash (), regex ( '.*?' ) ]), regex ( '$' ) ]) );
const StarStarNone = match ( /\*\*/, () => regex ( '.*?' ) );
const StarStar = or ([ StarStarBetween, StarStarStart, StarStarEnd, StarStarNone ]);

const StarDouble = match ( /\*\/(?!\*\*\/|\*$)/, () => sequence ([ regex ( '[^\\\\/]*?' ), slash () ]) );
const StarSingle = match ( /\*/, () => regex ( '[^\\\\/]*' ) );
const Star = or ([ StarDouble, StarSingle ]);

const Question = match ( '?', () => regex ( '[^\\\\/]' ) );

const ClassOpen = match ( '[', identity );
const ClassClose = match ( ']', identity );
const ClassNegation = match ( /[!^]/, '^\\\\/' );
const ClassRange = match ( /[a-z]-[a-z]|[0-9]-[0-9]/i, identity );
const ClassEscaped = match ( /\\./, identity );
const ClassEscape = match ( /[$.*+?^(){}[\|]/, char => `\\${char}` );
const ClassSlash = match ( /[\\\/]/, '\\\\/' );
const ClassPassthrough = match ( /[^$.*+?^(){}[\]\|\\\/]+/, identity );
const ClassValue = or ([ ClassEscaped, ClassEscape, ClassSlash, ClassRange, ClassPassthrough ]);
const Class = and ( [ClassOpen, optional ( ClassNegation ), star ( ClassValue ), ClassClose], _ => regex ( _.join ( '' ) ) );

const RangeOpen = match ( '{', '(?:' );
const RangeClose = match ( '}', ')' );
const RangeNumeric = match ( /(\d+)\.\.(\d+)/, ( _, $1, $2 ) => makeRangePaddedInt ( +$1, +$2, Math.min ( $1.length, $2.length ) ).join ( '|' ) );
const RangeAlphaLower = match ( /([a-z]+)\.\.([a-z]+)/, ( _, $1, $2 ) => makeRangeAlpha ( $1, $2 ).join ( '|' ) );
const RangeAlphaUpper = match ( /([A-Z]+)\.\.([A-Z]+)/, ( _, $1, $2 ) => makeRangeAlpha ( $1.toLowerCase (), $2.toLowerCase () ).join ( '|' ).toUpperCase () );
const RangeValue = or ([ RangeNumeric, RangeAlphaLower, RangeAlphaUpper ]);
const Range = and ( [RangeOpen, RangeValue, RangeClose], _ => regex ( _.join ( '' ) ) );

const BracesOpen = match ( '{' );
const BracesClose = match ( '}' );
const BracesComma = match ( ',' );
const BracesEscaped = match ( /\\./, regex );
const BracesEscape = match ( /[$.*+?^(){[\]\|]/, char => regex ( `\\${char}` ) );
const BracesSlash = match ( /[\\\/]/, slash );
const BracesPassthrough = match ( /[^$.*+?^(){}[\]\|\\\/,]+/, regex );
const BracesNested = lazy ( () => Braces );
const BracesEmptyValue = match ( '', () => regex ( '(?:)' ) );
const BracesFullValue = plus ( or ([ StarStar, Star, Question, Class, Range, BracesNested, BracesEscaped, BracesEscape, BracesSlash, BracesPassthrough ] ), sequence );
const BracesValue = or ([ BracesFullValue, BracesEmptyValue ]);
const Braces = and ( [BracesOpen, optional ( and ([ BracesValue, star ( and ([ BracesComma, BracesValue ]) ) ]) ), BracesClose], alternation );

const Grammar = star ( or ([ Negation, StarStar, Star, Question, Class, Range, Braces, Escaped, Escape, Slash, Passthrough ]), sequence );

/* EXPORT */

export default Grammar;
