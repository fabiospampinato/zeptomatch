
/* IMPORT */

import {match, lazy, star, and, or, optional} from 'grammex';
import convert from '~/convert/parser';
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

const BracesOpen = match ( '{', '(?:' );
const BracesClose = match ( '}', ')' );
const BracesComma = match ( ',', '|' );
const BracesEscape = match ( /[$.*+?^(){[\]\|]/, char => `\\${char}` );
const BracesPassthrough = match ( /[^}]/, identity );
const BracesNested = lazy ( () => Braces );
const BracesValue = or ([ StarStar, Star, Question, Class, BracesNested, Escaped, BracesEscape, BracesComma, BracesPassthrough ]);
const Braces = and ([ BracesOpen, star ( BracesValue ), BracesClose ]);

const Grammar = star ( or ([ Negation, StarStar, Star, Question, Class, Braces, Escaped, Escape, Passthrough ]) );

/* EXPORT */

export default Grammar;
