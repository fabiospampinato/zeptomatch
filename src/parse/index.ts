
/* IMPORT */

import type {Node} from '../types';
import {parse} from 'grammex';
import Grammar from './grammar';

/* MAIN */

const _parse = ( glob: string ): Node => {

  return parse ( glob, Grammar, { memoization: false } )[0];

};

/* EXPORT */

export default _parse;
