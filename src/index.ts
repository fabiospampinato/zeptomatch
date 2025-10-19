
/* IMPORT */

import type {Options} from './types';
import compile from './compile';
import merge from './merge';
import normalize from './normalize';
import parse from './convert'; //TODO: rename this
import {isString, memoizeByObject, memoizeByPrimitive} from './utils';

/* MAIN */

const zeptomatch = ( glob: string | string[], path: string, options?: Options ): boolean => {

  return zeptomatch.compile ( glob, options ).test ( path );

};

/* UTILITIES */

zeptomatch.compile = (() => {

  const compileGlob = memoizeByPrimitive (( glob: string, options?: Options ): RegExp => {
    return compile ( parse ( normalize ( glob ) ), options );
  });

  const compileGlobs = memoizeByObject (( globs: string[], options?: Options ): RegExp => {
    return merge ( globs.map ( glob => compileGlob ( glob, options ) ) );
  });

  return ( glob: string | string[], options?: Options ): RegExp => {
    if ( isString ( glob ) ) {
      return compileGlob ( glob, options );
    } else {
      return compileGlobs ( glob, options );
    }
  };

})();

/* EXPORT */

export default zeptomatch;
export type {Options};
