
/* IMPORT */

import convert from './convert/parser';
import normalize from './normalize/parser';

/* MAIN */

const zeptomatch = ( glob: string | string[], path: string ): boolean => {

  if ( Array.isArray ( glob ) ) {

    const res = glob.map ( zeptomatch.compile );
    const isMatch = res.some ( re => re.test ( path ) );

    return isMatch;

  } else {

    const re = zeptomatch.compile ( glob );
    const isMatch = re.test ( path );

    return isMatch;

  }

};

/* UTILITIES */

zeptomatch.compile = ( glob: string ): RegExp => {

  return new RegExp ( `^${convert ( normalize ( glob ) )}[\\\\/]?$`, 's' );

};

/* EXPORT */

export default zeptomatch;
