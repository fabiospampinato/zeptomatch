
/* IMPORT */

import benchmark from 'benchloop';
import zeptomatch from '../dist/index.js';

/* HELPERS */

const GLOB = 'foo/**/{bar/baz,qux}/*.js';
const GLOBS = ['foo/**/bar/qux/*.js', 'foo/**/baz/qux/*.js'];
const OPTIONS_PARTIAL = { partial: true };

/* MAIN */

benchmark.config ({
  iterations: 1_000_000
});

benchmark.group ( 'match', () => {

  for ( const [name, glob] of [['single', GLOB], ['double', GLOBS]] ) {

    benchmark.group ( name, () => {

      benchmark ({
        name: 'full',
        fn: () => {
          zeptomatch ( glob, 'foo/bar/baz/file.js' );
          zeptomatch ( glob, 'foo/bar/baz/file.js_' );
        }
      });

      benchmark ({
        name: 'partial',
        fn: () => {
          zeptomatch ( glob, 'foo/bar/baz', OPTIONS_PARTIAL );
          zeptomatch ( glob, 'foo/bar/baz_', OPTIONS_PARTIAL );
        }
      });

    });

  }

});
