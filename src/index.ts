
/* IMPORT */

import convert from '~/convert/parser';
import normalize from '~/normalize/parser';

/* MAIN */

const zeptomatch = ( glob: string | string[], path: string ): boolean => {

  const globs = Array.isArray ( glob ) ? glob : [glob];

  if ( !globs.length ) return false;

  const res = globs.map ( zeptomatch.compile );
  const isTrailing = globs.every ( glob => /(\/(?:\*\*)?|\[\/\])$/.test ( glob ) );
  const normpath = path.replace ( /[\\\/]+/g, '/' ).replace ( /\/$/, isTrailing ? '/' : '' );
  const isMatch = res.some ( re => re.test ( normpath ) );

  return isMatch;

};

/* UTILITIES */

zeptomatch.compile = ( glob: string ): RegExp => {

  return new RegExp ( `^${convert ( normalize ( glob ) )}$`, 's' );

};

/* EXPORT */

export default zeptomatch;
