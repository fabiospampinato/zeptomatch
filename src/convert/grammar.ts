
/* IMPORT */

import {match, lazy, star, and, or, optional} from 'grammex';
import convert from '~/convert/parser';
import {makeRangePaddedInt, makeRangeAlpha} from '~/range';
import {identity} from '~/utils';

/* MAIN */

const Escaped = match ( /\\./, identity );
const Escape = match ( /[$.*+?^(){}[\]\|]/, char => `\\${char}` );
const Passthrough = match ( /./, identity );

const NegationOdd = match ( /^(?:!!)*!(.*)$/, ( _, glob ) => `(?!^${convert ( glob )}$).*?` );
const NegationEven = match ( /^(!!)+/, '' );
const Negation = or ([ NegationOdd, NegationEven ]);

const StarStarBetween = match ( /\/(\*\*\/)+/, '(?:/.+/|/)' );
const StarStarStart = match ( /^(\*\*\/)+/, '(?:^|.*/)' );
const StarStarEnd = match ( /\/(\*\*)$/, '(?:/.*|$)' );
const StarStarNone = match ( /\*\*/, '.*' );
const StarStar = or ([ StarStarBetween, StarStarStart, StarStarEnd, StarStarNone ]);

const StarDouble = match ( /\*\/(?!\*\*\/)/, '[^/]*/' );
const StarSingle = match ( /\*/, '[^/]*' );
const Star = or ([ StarDouble, StarSingle ]);

const Question = match ( '?', '[^/]' );

const ClassOpen = match ( '[', identity );
const ClassClose = match ( ']', identity );
const ClassNegation = match ( /[!^]/, '^/' );
const ClassRange = match ( /[a-z]-[a-z]|[0-9]-[0-9]/i, identity );
const ClassEscape = match ( /[$.*+?^(){}[\|]/, char => `\\${char}` );
const ClassPassthrough = match ( /[^\]]/, identity );
const ClassValue = or ([ Escaped, ClassEscape, ClassRange, ClassPassthrough ]);
const Class = and ([ ClassOpen, optional ( ClassNegation ), star ( ClassValue ), ClassClose ]);

const RangeOpen = match ( '{', '(?:' );
const RangeClose = match ( '}', ')' );
const RangeNumeric = match ( /(\d+)\.\.(\d+)/, ( _, $1, $2 ) => makeRangePaddedInt ( +$1, +$2, Math.min ( $1.length, $2.length ) ).join ( '|' ) );
const RangeAlphaLower = match ( /([a-z]+)\.\.([a-z]+)/, ( _, $1, $2 ) => makeRangeAlpha ( $1, $2 ).join ( '|' ) );
const RangeAlphaUpper = match ( /([A-Z]+)\.\.([A-Z]+)/, ( _, $1, $2 ) => makeRangeAlpha ( $1.toLowerCase (), $2.toLowerCase () ).join ( '|' ).toUpperCase () );
const RangeValue = or ([ RangeNumeric, RangeAlphaLower, RangeAlphaUpper ]);
const Range = and ([ RangeOpen, RangeValue, RangeClose ]);

const BracesOpen = match ( '{', '(?:' );
const BracesClose = match ( '}', ')' );
const BracesComma = match ( ',', '|' );
const BracesEscape = match ( /[$.*+?^(){[\]\|]/, char => `\\${char}` );
const BracesPassthrough = match ( /[^}]/, identity );
const BracesNested = lazy ( () => Braces );
const BracesValue = or ([ StarStar, Star, Question, Class, Range, BracesNested, Escaped, BracesEscape, BracesComma, BracesPassthrough ]);
const Braces = and ([ BracesOpen, star ( BracesValue ), BracesClose ]);

const Grammar = star ( or ([ Negation, StarStar, Star, Question, Class, Range, Braces, Escaped, Escape, Passthrough ]) );

/* EXPORT */

export default Grammar;
