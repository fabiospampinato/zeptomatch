
/* IMPORT */

import {match, star, or} from 'grammex';
import {identity} from '../utils';

/* MAIN */

const Escaped = match ( /\\./, identity );
const Passthrough = match ( /./, identity );

const StarStarStar = match ( /\*\*\*+/, '*' );

const StarStarNoLeft = match ( /([^/{[(!])\*\*/, ( _, $1 ) => `${$1}*` );
const StarStarNoRight = match ( /(^|.)\*\*(?=[^*/)\]}])/, ( _, $1 ) => `${$1}*` );

const Grammar = star ( or ([ Escaped, StarStarStar, StarStarNoLeft, StarStarNoRight, Passthrough ]) );

/* EXPORT */

export default Grammar;
