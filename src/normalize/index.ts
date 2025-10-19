
/* IMPORT */

import {parse} from 'grammex';
import Grammar from './grammar';

/* MAIN */

const normalize = ( glob: string ): string => {

  return parse ( glob, Grammar, { memoization: false } ).join ( '' );

};

/* EXPORT */

export default normalize;
