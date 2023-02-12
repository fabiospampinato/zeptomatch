
/* IMPORT */

import {describe} from 'fava';
import zeptomatch from '../dist/index.js';

/* MAIN */

describe ( 'Zeptomatch', it => {

  it ( 'native', t => {

    t.true ( zeptomatch ( ['*.md', '*.js'], 'foo.md' ) );
    t.true ( zeptomatch ( ['*.md', '*.js'], 'foo.js' ) );
    t.true ( !zeptomatch ( ['*.md', '*.js'], 'foo.txt' ) );

    t.true ( !zeptomatch ( '*/**foo', 'foo/bar/foo' ) );
    t.true ( zeptomatch ( '*/**foo', 'foo/barfoo' ) );

    t.true ( !zeptomatch ( '*/**foo', 'foo\\bar\\foo' ) );
    t.true ( zeptomatch ( '*/**foo', 'foo\\barfoo' ) );

    t.true ( !zeptomatch ( '*.js', 'abcd' ) );
    t.true ( zeptomatch ( '*.js', 'a.js' ) );
    t.true ( !zeptomatch ( '*.js', 'a.md' ) );
    t.true ( !zeptomatch ( '*.js', 'a/b.js' ) );

    t.true ( zeptomatch ( '{a{a{a,b},b{a,b}},b{a{a,b},b{a,b}}}', 'aaa' ) );
    t.true ( zeptomatch ( '{a{a{a,b},b{a,b}},b{a{a,b},b{a,b}}}', 'aab' ) );
    t.true ( zeptomatch ( '{a{a{a,b},b{a,b}},b{a{a,b},b{a,b}}}', 'aba' ) );
    t.true ( zeptomatch ( '{a{a{a,b},b{a,b}},b{a{a,b},b{a,b}}}', 'abb' ) );
    t.true ( zeptomatch ( '{a{a{a,b},b{a,b}},b{a{a,b},b{a,b}}}', 'baa' ) );
    t.true ( zeptomatch ( '{a{a{a,b},b{a,b}},b{a{a,b},b{a,b}}}', 'bab' ) );
    t.true ( zeptomatch ( '{a{a{a,b},b{a,b}},b{a{a,b},b{a,b}}}', 'bba' ) );
    t.true ( zeptomatch ( '{a{a{a,b},b{a,b}},b{a{a,b},b{a,b}}}', 'bbb' ) );
    t.true ( !zeptomatch ( '{a{a{a,b},b{a,b}},b{a{a,b},b{a,b}}}', 'a' ) );
    t.true ( !zeptomatch ( '{a{a{a,b},b{a,b}},b{a{a,b},b{a,b}}}', 'b' ) );
    t.true ( !zeptomatch ( '{a{a{a,b},b{a,b}},b{a{a,b},b{a,b}}}', 'aa' ) );
    t.true ( !zeptomatch ( '{a{a{a,b},b{a,b}},b{a{a,b},b{a,b}}}', 'bb' ) );

  });

  it ( 'native_range', t => {

    // Numeric

    t.true ( zeptomatch ( '{1..20}', '1' ) );
    t.true ( zeptomatch ( '{1..20}', '10' ) );
    t.true ( zeptomatch ( '{1..20}', '20' ) );

    t.true ( zeptomatch ( '{20..1}', '1' ) );
    t.true ( zeptomatch ( '{20..1}', '10' ) );
    t.true ( zeptomatch ( '{20..1}', '20' ) );

    t.true ( !zeptomatch ( '{1..20}', '0' ) );
    t.true ( !zeptomatch ( '{1..20}', '22' ) );

    t.true ( !zeptomatch ( '{20..1}', '0' ) );
    t.true ( !zeptomatch ( '{20..1}', '22' ) );

    // Numeric padded

    t.true ( zeptomatch ( '{01..20}', '01' ) );
    t.true ( zeptomatch ( '{01..20}', '10' ) );
    t.true ( zeptomatch ( '{01..20}', '20' ) );

    t.true ( zeptomatch ( '{20..01}', '01' ) );
    t.true ( zeptomatch ( '{20..01}', '10' ) );
    t.true ( zeptomatch ( '{20..01}', '20' ) );

    t.true ( !zeptomatch ( '{01..20}', '00' ) );
    t.true ( !zeptomatch ( '{01..20}', '1' ) );
    t.true ( !zeptomatch ( '{01..20}', '22' ) );

    t.true ( !zeptomatch ( '{20..01}', '00' ) );
    t.true ( !zeptomatch ( '{20..01}', '1' ) );
    t.true ( !zeptomatch ( '{20..01}', '22' ) );

    // Alphabetic

    t.true ( zeptomatch ( '{a..zz}', 'a' ) );
    t.true ( zeptomatch ( '{a..zz}', 'bb' ) );
    t.true ( zeptomatch ( '{a..zz}', 'za' ) );

    t.true ( zeptomatch ( '{zz..a}', 'a' ) );
    t.true ( zeptomatch ( '{zz..a}', 'bb' ) );
    t.true ( zeptomatch ( '{zz..a}', 'za' ) );

    t.true ( !zeptomatch ( '{a..zz}', 'aaa' ) );
    t.true ( !zeptomatch ( '{a..zz}', 'A' ) );

    t.true ( !zeptomatch ( '{zz..a}', 'aaa' ) );
    t.true ( !zeptomatch ( '{zz..a}', 'A' ) );

    // Alphabetic uppercase

    t.true ( zeptomatch ( '{A..ZZ}', 'A' ) );
    t.true ( zeptomatch ( '{A..ZZ}', 'BB' ) );
    t.true ( zeptomatch ( '{A..ZZ}', 'ZA' ) );

    t.true ( zeptomatch ( '{ZZ..A}', 'A' ) );
    t.true ( zeptomatch ( '{ZZ..A}', 'BB' ) );
    t.true ( zeptomatch ( '{ZZ..A}', 'ZA' ) );

    t.true ( !zeptomatch ( '{A..ZZ}', 'AAA' ) );
    t.true ( !zeptomatch ( '{A..ZZ}', 'a' ) );

    t.true ( !zeptomatch ( '{ZZ..A}', 'AAA' ) );
    t.true ( !zeptomatch ( '{ZZ..A}', 'a' ) );

  });

  // Tests adapted from "picomatch": https://github.com/micromatch/picomatch
  // License: https://github.com/micromatch/picomatch/blob/master/LICENSE

  it ( 'multiple_patterns', t => {

    t.true ( zeptomatch ( ['.', 'foo'], '.' ) );
    t.true ( zeptomatch ( ['a', 'foo'], 'a' ) );
    t.true ( zeptomatch ( ['*', 'foo', 'bar'], 'ab' ) );
    t.true ( zeptomatch ( ['*b', 'foo', 'bar'], 'ab' ) );
    t.true ( !zeptomatch ( ['./*', 'foo', 'bar'], 'ab' ) );
    t.true ( zeptomatch ( ['a*', 'foo', 'bar'], 'ab' ) );
    t.true ( zeptomatch ( ['ab', 'foo'], 'ab' ) );

    t.true ( !zeptomatch ( ['/a', 'foo'], '/ab' ) );
    t.true ( !zeptomatch ( ['?/?', 'foo', 'bar'], '/ab' ) );
    t.true ( !zeptomatch ( ['a/*', 'foo', 'bar'], '/ab' ) );
    t.true ( !zeptomatch ( ['a/b', 'foo'], 'a/b/c' ) );
    t.true ( !zeptomatch ( ['*/*', 'foo', 'bar'], 'ab' ) );
    t.true ( !zeptomatch ( ['/a', 'foo', 'bar'], 'ab' ) );
    t.true ( !zeptomatch ( ['a', 'foo'], 'ab' ) );
    t.true ( !zeptomatch ( ['b', 'foo'], 'ab' ) );
    t.true ( !zeptomatch ( ['c', 'foo', 'bar'], 'ab' ) );
    t.true ( !zeptomatch ( ['ab', 'foo'], 'abcd' ) );
    t.true ( !zeptomatch ( ['bc', 'foo'], 'abcd' ) );
    t.true ( !zeptomatch ( ['c', 'foo'], 'abcd' ) );
    t.true ( !zeptomatch ( ['cd', 'foo'], 'abcd' ) );
    t.true ( !zeptomatch ( ['d', 'foo'], 'abcd' ) );
    t.true ( !zeptomatch ( ['f', 'foo', 'bar'], 'abcd' ) );
    t.true ( !zeptomatch ( ['/*', 'foo', 'bar'], 'ef' ) );

  });

  it ( 'file_extensions', t => {

    t.true ( zeptomatch ( '*.md', '.c.md' ) );
    t.true ( !zeptomatch ( '.c.', '.c.md' ) );
    t.true ( !zeptomatch ( '.md', '.c.md' ) );
    t.true ( zeptomatch ( '*.md', '.md' ) );
    t.true ( !zeptomatch ( '.m', '.md' ) );
    t.true ( !zeptomatch ( '*.md', 'a/b/c.md' ) );
    t.true ( !zeptomatch ( '.md', 'a/b/c.md' ) );
    t.true ( !zeptomatch ( 'a/*.md', 'a/b/c.md' ) );
    t.true ( !zeptomatch ( '*.md', 'a/b/c/c.md' ) );
    t.true ( !zeptomatch ( 'c.js', 'a/b/c/c.md' ) );
    t.true ( zeptomatch ( '.*.md', '.c.md' ) );
    t.true ( zeptomatch ( '.md', '.md' ) );
    t.true ( zeptomatch ( 'a/**/*.*', 'a/b/c.js' ) );
    t.true ( zeptomatch ( '**/*.md', 'a/b/c.md' ) );
    t.true ( zeptomatch ( 'a/*/*.md', 'a/b/c.md' ) );
    t.true ( zeptomatch ( '*.md', 'c.md' ) );

  });

  it ( 'dot_files', t => {

    t.true ( !zeptomatch ( '.*.md', 'a/b/c/.xyz.md' ) );
    t.true ( zeptomatch ( '*.md', '.c.md' ) );
    t.true ( zeptomatch ( '.*', '.c.md' ) );
    t.true ( zeptomatch ( '**/*.md', 'a/b/c/.xyz.md' ) );
    t.true ( zeptomatch ( '**/.*.md', 'a/b/c/.xyz.md' ) );
    t.true ( zeptomatch ( 'a/b/c/*.md', 'a/b/c/.xyz.md' ) );
    t.true ( zeptomatch ( 'a/b/c/.*.md', 'a/b/c/.xyz.md' ) );

  });

  it ( 'matching', t => {

    t.true ( zeptomatch ( 'a+b/src/*.js', 'a+b/src/glimini.js' ) );
    t.true ( zeptomatch ( '+b/src/*.js', '+b/src/glimini.js' ) );
    t.true ( zeptomatch ( 'coffee+/src/*.js', 'coffee+/src/glimini.js' ) );
    t.true ( zeptomatch ( 'coffee+/src/*', 'coffee+/src/glimini.js' ) );

    t.true ( zeptomatch ( '.', '.' ) );
    t.true ( zeptomatch ( '/a', '/a' ) );
    t.true ( !zeptomatch ( '/a', '/ab' ) );
    t.true ( zeptomatch ( 'a', 'a' ) );
    t.true ( !zeptomatch ( '/a', 'ab' ) );
    t.true ( !zeptomatch ( 'a', 'ab' ) );
    t.true ( zeptomatch ( 'ab', 'ab' ) );
    t.true ( !zeptomatch ( 'cd', 'abcd' ) );
    t.true ( !zeptomatch ( 'bc', 'abcd' ) );
    t.true ( !zeptomatch ( 'ab', 'abcd' ) );

    t.true ( zeptomatch ( 'a.b', 'a.b' ) );
    t.true ( zeptomatch ( '*.b', 'a.b' ) );
    t.true ( zeptomatch ( 'a.*', 'a.b' ) );
    t.true ( zeptomatch ( '*.*', 'a.b' ) );
    t.true ( zeptomatch ( 'a*.c*', 'a-b.c-d' ) );
    t.true ( zeptomatch ( '*b.*d', 'a-b.c-d' ) );
    t.true ( zeptomatch ( '*.*', 'a-b.c-d' ) );
    t.true ( zeptomatch ( '*.*-*', 'a-b.c-d' ) );
    t.true ( zeptomatch ( '*-*.*-*', 'a-b.c-d' ) );
    t.true ( zeptomatch ( '*.c-*', 'a-b.c-d' ) );
    t.true ( zeptomatch ( '*.*-d', 'a-b.c-d' ) );
    t.true ( zeptomatch ( 'a-*.*-d', 'a-b.c-d' ) );
    t.true ( zeptomatch ( '*-b.c-*', 'a-b.c-d' ) );
    t.true ( zeptomatch ( '*-b*c-*', 'a-b.c-d' ) );
    t.true ( !zeptomatch ( '*-bc-*', 'a-b.c-d' ) );

    t.true ( !zeptomatch ( './*/', '/ab' ) );
    t.true ( !zeptomatch ( '*', '/ef' ) );
    t.true ( !zeptomatch ( './*/', 'ab' ) );
    t.true ( !zeptomatch ( '/*', 'ef' ) );
    t.true ( zeptomatch ( '/*', '/ab' ) );
    t.true ( zeptomatch ( '/*', '/cd' ) );
    t.true ( zeptomatch ( '*', 'ab' ) );
    t.true ( !zeptomatch ( './*', 'ab' ) );
    t.true ( zeptomatch ( 'ab', 'ab' ) );
    t.true ( !zeptomatch ( './*/', 'ab/' ) );

    t.true ( !zeptomatch ( '*.js', 'a/b/c/z.js' ) );
    t.true ( !zeptomatch ( '*.js', 'a/b/z.js' ) );
    t.true ( !zeptomatch ( '*.js', 'a/z.js' ) );
    t.true ( zeptomatch ( '*.js', 'z.js' ) );

    t.true ( zeptomatch ( 'z*.js', 'z.js' ) );
    t.true ( zeptomatch ( 'a/z*.js', 'a/z.js' ) );
    t.true ( zeptomatch ( '*/z*.js', 'a/z.js' ) );

    t.true ( zeptomatch ( '**/*.js', 'a/b/c/z.js' ) );
    t.true ( zeptomatch ( '**/*.js', 'a/b/z.js' ) );
    t.true ( zeptomatch ( '**/*.js', 'a/z.js' ) );
    t.true ( zeptomatch ( 'a/b/**/*.js', 'a/b/c/d/e/z.js' ) );
    t.true ( zeptomatch ( 'a/b/**/*.js', 'a/b/c/d/z.js' ) );
    t.true ( zeptomatch ( 'a/b/c/**/*.js', 'a/b/c/z.js' ) );
    t.true ( zeptomatch ( 'a/b/c**/*.js', 'a/b/c/z.js' ) );
    t.true ( zeptomatch ( 'a/b/**/*.js', 'a/b/c/z.js' ) );
    t.true ( zeptomatch ( 'a/b/**/*.js', 'a/b/z.js' ) );

    t.true ( !zeptomatch ( 'a/b/**/*.js', 'a/z.js' ) );
    t.true ( !zeptomatch ( 'a/b/**/*.js', 'z.js' ) );

    t.true ( zeptomatch ( 'z*', 'z.js' ) );
    t.true ( zeptomatch ( '**/z*', 'z.js' ) );
    t.true ( zeptomatch ( '**/z*.js', 'z.js' ) );
    t.true ( zeptomatch ( '**/*.js', 'z.js' ) );
    t.true ( zeptomatch ( '**/foo', 'foo' ) );

    t.true ( !zeptomatch ( 'z*.js', 'zzjs' ) );
    t.true ( !zeptomatch ( '*z.js', 'zzjs' ) );

    t.true ( !zeptomatch ( 'a/b/**/f', 'a/b/c/d/' ) );
    t.true ( zeptomatch ( 'a/**', 'a' ) );
    t.true ( zeptomatch ( '**', 'a' ) );
    t.true ( zeptomatch ( '**', 'a/' ) );
    t.true ( zeptomatch ( 'a/b-*/**/z.js', 'a/b-c/d/e/z.js' ) );
    t.true ( zeptomatch ( 'a/b-*/**/z.js', 'a/b-c/z.js' ) );
    t.true ( zeptomatch ( '**', 'a/b/c/d' ) );
    t.true ( zeptomatch ( '**', 'a/b/c/d/' ) );
    t.true ( zeptomatch ( '**/**', 'a/b/c/d/' ) );
    t.true ( zeptomatch ( '**/b/**', 'a/b/c/d/' ) );
    t.true ( zeptomatch ( 'a/b/**', 'a/b/c/d/' ) );
    t.true ( zeptomatch ( 'a/b/**/', 'a/b/c/d/' ) );
    t.true ( zeptomatch ( 'a/b/**/c/**/', 'a/b/c/d/' ) );
    t.true ( zeptomatch ( 'a/b/**/c/**/d/', 'a/b/c/d/' ) );
    t.true ( zeptomatch ( 'a/b/**/**/*.*', 'a/b/c/d/e.f' ) );
    t.true ( zeptomatch ( 'a/b/**/*.*', 'a/b/c/d/e.f' ) );
    t.true ( zeptomatch ( 'a/b/**/c/**/d/*.*', 'a/b/c/d/e.f' ) );
    t.true ( zeptomatch ( 'a/b/**/d/**/*.*', 'a/b/c/d/e.f' ) );
    t.true ( zeptomatch ( 'a/b/**/d/**/*.*', 'a/b/c/d/g/e.f' ) );
    t.true ( zeptomatch ( 'a/b/**/d/**/*.*', 'a/b/c/d/g/g/e.f' ) );

    t.true ( !zeptomatch ( '*/foo', 'bar/baz/foo' ) );
    t.true ( !zeptomatch ( '**/bar/*', 'deep/foo/bar' ) );
    t.true ( !zeptomatch ( '*/bar/**', 'deep/foo/bar/baz/x' ) );
    t.true ( !zeptomatch ( 'foo?bar', 'foo/bar' ) );
    t.true ( !zeptomatch ( '**/bar*', 'foo/bar/baz' ) );
    t.true ( !zeptomatch ( '**/bar**', 'foo/bar/baz' ) );
    t.true ( !zeptomatch ( 'foo**bar', 'foo/baz/bar' ) );
    t.true ( !zeptomatch ( 'foo*bar', 'foo/baz/bar' ) );
    t.true ( !zeptomatch ( '**/bar/*/', 'deep/foo/bar/baz' ) );
    t.true ( zeptomatch ( '**/bar/*', 'deep/foo/bar/baz/' ) );
    t.true ( zeptomatch ( '**/bar/*', 'deep/foo/bar/baz' ) );
    t.true ( zeptomatch ( 'foo/**', 'foo' ) );
    t.true ( zeptomatch ( '**/bar/*{,/}', 'deep/foo/bar/baz/' ) );
    t.true ( zeptomatch ( 'a/**/j/**/z/*.md', 'a/b/j/c/z/x.md' ) );
    t.true ( zeptomatch ( 'a/**/j/**/z/*.md', 'a/j/z/x.md' ) );
    t.true ( zeptomatch ( '**/foo', 'bar/baz/foo' ) );
    t.true ( zeptomatch ( '**/bar/**', 'deep/foo/bar/' ) );
    t.true ( zeptomatch ( '**/bar/*', 'deep/foo/bar/baz' ) );
    t.true ( zeptomatch ( '**/bar/*/', 'deep/foo/bar/baz/' ) );
    t.true ( zeptomatch ( '**/bar/**', 'deep/foo/bar/baz/' ) );
    t.true ( zeptomatch ( '**/bar/*/*', 'deep/foo/bar/baz/x' ) );
    t.true ( zeptomatch ( 'foo/**/**/bar', 'foo/b/a/z/bar' ) );
    t.true ( zeptomatch ( 'foo/**/bar', 'foo/b/a/z/bar' ) );
    t.true ( zeptomatch ( 'foo/**/**/bar', 'foo/bar' ) );
    t.true ( zeptomatch ( 'foo/**/bar', 'foo/bar' ) );
    t.true ( zeptomatch ( 'foo[/]bar', 'foo/bar' ) );
    t.true ( zeptomatch ( '*/bar/**', 'foo/bar/baz/x' ) );
    t.true ( zeptomatch ( 'foo/**/**/bar', 'foo/baz/bar' ) );
    t.true ( zeptomatch ( 'foo/**/bar', 'foo/baz/bar' ) );
    t.true ( zeptomatch ( 'foo**bar', 'foobazbar' ) );
    t.true ( zeptomatch ( '**/foo', 'XXX/foo' ) );

    t.true ( !zeptomatch ( 'foo//baz.md', 'foo//baz.md' ) );
    t.true ( !zeptomatch ( 'foo//*baz.md', 'foo//baz.md' ) );
    t.true ( zeptomatch ( 'foo{/,//}baz.md', 'foo//baz.md' ) );
    t.true ( zeptomatch ( 'foo{/,//}baz.md', 'foo/baz.md' ) );
    t.true ( !zeptomatch ( 'foo/+baz.md', 'foo//baz.md' ) );
    t.true ( !zeptomatch ( 'foo//+baz.md', 'foo//baz.md' ) );
    t.true ( zeptomatch ( 'foo/baz.md', 'foo//baz.md' ) );
    t.true ( !zeptomatch ( 'foo//baz.md', 'foo/baz.md' ) );

    t.true ( !zeptomatch ( 'aaa?bbb', 'aaa/bbb' ) );

    t.true ( zeptomatch ( '*.md', '.c.md' ) );
    t.true ( !zeptomatch ( '*.md', 'a/.c.md' ) );
    t.true ( zeptomatch ( 'a/.c.md', 'a/.c.md' ) );
    t.true ( !zeptomatch ( '*.md', '.a' ) );
    t.true ( !zeptomatch ( '*.md', '.verb.txt' ) );
    t.true ( zeptomatch ( 'a/b/c/.*.md', 'a/b/c/.xyz.md' ) );
    t.true ( zeptomatch ( '.md', '.md' ) );
    t.true ( !zeptomatch ( '.md', '.txt' ) );
    t.true ( zeptomatch ( '.md', '.md' ) );
    t.true ( zeptomatch ( '.a', '.a' ) );
    t.true ( zeptomatch ( '.b*', '.b' ) );
    t.true ( zeptomatch ( '.a*', '.ab' ) );
    t.true ( zeptomatch ( '.*', '.ab' ) );
    t.true ( zeptomatch ( '*.*', '.ab' ) );
    t.true ( !zeptomatch ( 'a/b/c/*.md', '.md' ) );
    t.true ( !zeptomatch ( 'a/b/c/*.md', '.a.md' ) );
    t.true ( zeptomatch ( 'a/b/c/*.md', 'a/b/c/d.a.md' ) );
    t.true ( !zeptomatch ( 'a/b/c/*.md', 'a/b/d/.md' ) );

    t.true ( zeptomatch ( '*.md', '.c.md' ) );
    t.true ( zeptomatch ( '.*', '.c.md' ) );
    t.true ( zeptomatch ( 'a/b/c/*.md', 'a/b/c/.xyz.md' ) );
    t.true ( zeptomatch ( 'a/b/c/.*.md', 'a/b/c/.xyz.md' ) );

  });

  it ( 'brackets', t => {

    t.true ( zeptomatch ( 'foo[/]bar', 'foo/bar' ) );
    t.true ( zeptomatch ( 'foo[/]bar[/]', 'foo/bar/' ) );
    t.true ( zeptomatch ( 'foo[/]bar[/]baz', 'foo/bar/baz' ) );

  });

  it ( 'ranges', t => {

    t.true ( zeptomatch ( 'a/{a..c}', 'a/c' ) );
    t.true ( !zeptomatch ( 'a/{a..c}', 'a/z' ) );
    t.true ( zeptomatch ( 'a/{1..100}', 'a/99' ) );
    t.true ( !zeptomatch ( 'a/{1..100}', 'a/101' ) );
    t.true ( zeptomatch ( 'a/{01..10}', 'a/02' ) );
    t.true ( !zeptomatch ( 'a/{01..10}', 'a/2' ) );

  });

  it ( 'exploits', t => {

    t.true ( !zeptomatch ( `${'\\'.repeat ( 65500 )}A`, '\\A' ) ); // This matches in picomatch, but why though?
    t.true ( zeptomatch ( `!${'\\'.repeat ( 65500 )}A`, 'A' ) );
    t.true ( zeptomatch ( `!(${'\\'.repeat ( 65500 )}A)`, 'A' ) );
    t.true ( !zeptomatch ( `[!(${'\\'.repeat ( 65500 )}A`, 'A' ) );

  });

  it ( 'wildmat', t => {

    t.true ( !zeptomatch ( '*f', 'foo' ) );
    t.true ( !zeptomatch ( '??', 'foo' ) );
    t.true ( !zeptomatch ( 'bar', 'foo' ) );
    t.true ( !zeptomatch ( 'foo\\*bar', 'foobar' ) );
    t.true ( zeptomatch ( '\\??\\?b', '?a?b' ) );
    t.true ( zeptomatch ( '*ab', 'aaaaaaabababab' ) );
    t.true ( zeptomatch ( '*', 'foo' ) );
    t.true ( zeptomatch ( '*foo*', 'foo' ) );
    t.true ( zeptomatch ( '???', 'foo' ) );
    t.true ( zeptomatch ( 'f*', 'foo' ) );
    t.true ( zeptomatch ( 'foo', 'foo' ) );
    t.true ( zeptomatch ( '*ob*a*r*', 'foobar' ) );

    t.true ( !zeptomatch ( '-*-*-*-*-*-*-12-*-*-*-m-*-*-*', '-adobe-courier-bold-o-normal--12-120-75-75-/-70-iso8859-1' ) );
    t.true ( !zeptomatch ( '-*-*-*-*-*-*-12-*-*-*-m-*-*-*', '-adobe-courier-bold-o-normal--12-120-75-75-X-70-iso8859-1' ) );
    t.true ( !zeptomatch ( '*X*i', 'ab/cXd/efXg/hi' ) );
    t.true ( !zeptomatch ( '*Xg*i', 'ab/cXd/efXg/hi' ) );
    t.true ( !zeptomatch ( '**/*a*b*g*n*t', 'abcd/abcdefg/abcdefghijk/abcdefghijklmnop.txtz' ) );
    t.true ( !zeptomatch ( '*/*/*', 'foo' ) );
    t.true ( !zeptomatch ( 'fo', 'foo' ) );
    t.true ( !zeptomatch ( '*/*/*', 'foo/bar' ) );
    t.true ( !zeptomatch ( 'foo?bar', 'foo/bar' ) );
    t.true ( !zeptomatch ( '*/*/*', 'foo/bb/aa/rr' ) );
    t.true ( !zeptomatch ( 'foo*', 'foo/bba/arr' ) );
    t.true ( !zeptomatch ( 'foo**', 'foo/bba/arr' ) );
    t.true ( !zeptomatch ( 'foo/*', 'foo/bba/arr' ) );
    t.true ( !zeptomatch ( 'foo/**arr', 'foo/bba/arr' ) );
    t.true ( !zeptomatch ( 'foo/**z', 'foo/bba/arr' ) );
    t.true ( !zeptomatch ( 'foo/*arr', 'foo/bba/arr' ) );
    t.true ( !zeptomatch ( 'foo/*z', 'foo/bba/arr' ) );
    t.true ( !zeptomatch ( 'XXX/*/*/*/*/*/*/12/*/*/*/m/*/*/*', 'XXX/adobe/courier/bold/o/normal//12/120/75/75/X/70/iso8859/1' ) );
    t.true ( zeptomatch ( '-*-*-*-*-*-*-12-*-*-*-m-*-*-*', '-adobe-courier-bold-o-normal--12-120-75-75-m-70-iso8859-1' ) );
    t.true ( zeptomatch ( '**/*X*/**/*i', 'ab/cXd/efXg/hi' ) );
    t.true ( zeptomatch ( '*/*X*/*/*i', 'ab/cXd/efXg/hi' ) );
    t.true ( zeptomatch ( '**/*a*b*g*n*t', 'abcd/abcdefg/abcdefghijk/abcdefghijklmnop.txt' ) );
    t.true ( zeptomatch ( '*X*i', 'abcXdefXghi' ) );
    t.true ( zeptomatch ( 'foo', 'foo' ) );
    t.true ( zeptomatch ( 'foo/*', 'foo/bar' ) );
    t.true ( zeptomatch ( 'foo/bar', 'foo/bar' ) );
    t.true ( zeptomatch ( 'foo[/]bar', 'foo/bar' ) );
    t.true ( zeptomatch ( '**/**/**', 'foo/bb/aa/rr' ) );
    t.true ( zeptomatch ( '*/*/*', 'foo/bba/arr' ) );
    t.true ( zeptomatch ( 'foo/**', 'foo/bba/arr' ) );

  });

  it.skip ( 'posix_classes', t => {

    t.true ( zeptomatch ( '[[:xdigit:]]', 'e' ) );

    t.true ( zeptomatch ( '[[:alpha:]123]', 'a' ) );
    t.true ( zeptomatch ( '[[:alpha:]123]', '1' ) );
    t.true ( !zeptomatch ( '[[:alpha:]123]', '5' ) );
    t.true ( zeptomatch ( '[[:alpha:]123]', 'A' ) );

    t.true ( zeptomatch ( '[[:alpha:]]', 'A' ) );
    t.true ( !zeptomatch ( '[[:alpha:]]', '9' ) );
    t.true ( zeptomatch ( '[[:alpha:]]', 'b' ) );

    t.true ( !zeptomatch ( '[![:alpha:]]', 'A' ) );
    t.true ( zeptomatch ( '[![:alpha:]]', '9' ) );
    t.true ( !zeptomatch ( '[![:alpha:]]', 'b' ) );

    t.true ( !zeptomatch ( '[^[:alpha:]]', 'A' ) );
    t.true ( zeptomatch ( '[^[:alpha:]]', '9' ) );
    t.true ( !zeptomatch ( '[^[:alpha:]]', 'b' ) );

    t.true ( !zeptomatch ( '[[:digit:]]', 'A' ) );
    t.true ( zeptomatch ( '[[:digit:]]', '9' ) );
    t.true ( !zeptomatch ( '[[:digit:]]', 'b' ) );

    t.true ( zeptomatch ( '[^[:digit:]]', 'A' ) );
    t.true ( !zeptomatch ( '[^[:digit:]]', '9' ) );
    t.true ( zeptomatch ( '[^[:digit:]]', 'b' ) );

    t.true ( zeptomatch ( '[![:digit:]]', 'A' ) );
    t.true ( !zeptomatch ( '[![:digit:]]', '9' ) );
    t.true ( zeptomatch ( '[![:digit:]]', 'b' ) );

    t.true ( zeptomatch ( '[[:lower:]]', 'a' ) );
    t.true ( !zeptomatch ( '[[:lower:]]', 'A' ) );
    t.true ( !zeptomatch ( '[[:lower:]]', '9' ) );

    t.true ( zeptomatch ( '[:alpha:]', 'a' ) );
    t.true ( zeptomatch ( '[:alpha:]', 'l' ) );
    t.true ( zeptomatch ( '[:alpha:]', 'p' ) );
    t.true ( zeptomatch ( '[:alpha:]', 'h' ) );
    t.true ( zeptomatch ( '[:alpha:]', ':' ) );
    t.true ( !zeptomatch ( '[:alpha:]', 'b' ) );

    t.true ( zeptomatch ( '[[:lower:][:digit:]]', '9' ) );
    t.true ( zeptomatch ( '[[:lower:][:digit:]]', 'a' ) );
    t.true ( !zeptomatch ( '[[:lower:][:digit:]]', 'A' ) );
    t.true ( !zeptomatch ( '[[:lower:][:digit:]]', 'aa' ) );
    t.true ( !zeptomatch ( '[[:lower:][:digit:]]', '99' ) );
    t.true ( !zeptomatch ( '[[:lower:][:digit:]]', 'a9' ) );
    t.true ( !zeptomatch ( '[[:lower:][:digit:]]', '9a' ) );
    t.true ( !zeptomatch ( '[[:lower:][:digit:]]', 'aA' ) );
    t.true ( !zeptomatch ( '[[:lower:][:digit:]]', '9A' ) );
    t.true ( zeptomatch ( '[[:lower:][:digit:]]+', 'aa' ) );
    t.true ( zeptomatch ( '[[:lower:][:digit:]]+', '99' ) );
    t.true ( zeptomatch ( '[[:lower:][:digit:]]+', 'a9' ) );
    t.true ( zeptomatch ( '[[:lower:][:digit:]]+', '9a' ) );
    t.true ( !zeptomatch ( '[[:lower:][:digit:]]+', 'aA' ) );
    t.true ( !zeptomatch ( '[[:lower:][:digit:]]+', '9A' ) );
    t.true ( zeptomatch ( '[[:lower:][:digit:]]*', 'a' ) );
    t.true ( !zeptomatch ( '[[:lower:][:digit:]]*', 'A' ) );
    t.true ( !zeptomatch ( '[[:lower:][:digit:]]*', 'AA' ) );
    t.true ( zeptomatch ( '[[:lower:][:digit:]]*', 'aa' ) );
    t.true ( zeptomatch ( '[[:lower:][:digit:]]*', 'aaa' ) );
    t.true ( zeptomatch ( '[[:lower:][:digit:]]*', '999' ) );

    t.true ( !zeptomatch ( 'a[[:word:]]+c', 'a c' ) );
    t.true ( !zeptomatch ( 'a[[:word:]]+c', 'a.c' ) );
    t.true ( !zeptomatch ( 'a[[:word:]]+c', 'a.xy.zc' ) );
    t.true ( !zeptomatch ( 'a[[:word:]]+c', 'a.zc' ) );
    t.true ( !zeptomatch ( 'a[[:word:]]+c', 'abq' ) );
    t.true ( !zeptomatch ( 'a[[:word:]]+c', 'axy zc' ) );
    t.true ( !zeptomatch ( 'a[[:word:]]+c', 'axy' ) );
    t.true ( !zeptomatch ( 'a[[:word:]]+c', 'axy.zc' ) );
    t.true ( zeptomatch ( 'a[[:word:]]+c', 'a123c' ) );
    t.true ( zeptomatch ( 'a[[:word:]]+c', 'a1c' ) );
    t.true ( zeptomatch ( 'a[[:word:]]+c', 'abbbbc' ) );
    t.true ( zeptomatch ( 'a[[:word:]]+c', 'abbbc' ) );
    t.true ( zeptomatch ( 'a[[:word:]]+c', 'abbc' ) );
    t.true ( zeptomatch ( 'a[[:word:]]+c', 'abc' ) );

    t.true ( !zeptomatch ( 'a[[:word:]]+', 'a c' ) );
    t.true ( !zeptomatch ( 'a[[:word:]]+', 'a.c' ) );
    t.true ( !zeptomatch ( 'a[[:word:]]+', 'a.xy.zc' ) );
    t.true ( !zeptomatch ( 'a[[:word:]]+', 'a.zc' ) );
    t.true ( !zeptomatch ( 'a[[:word:]]+', 'axy zc' ) );
    t.true ( !zeptomatch ( 'a[[:word:]]+', 'axy.zc' ) );
    t.true ( zeptomatch ( 'a[[:word:]]+', 'a123c' ) );
    t.true ( zeptomatch ( 'a[[:word:]]+', 'a1c' ) );
    t.true ( zeptomatch ( 'a[[:word:]]+', 'abbbbc' ) );
    t.true ( zeptomatch ( 'a[[:word:]]+', 'abbbc' ) );
    t.true ( zeptomatch ( 'a[[:word:]]+', 'abbc' ) );
    t.true ( zeptomatch ( 'a[[:word:]]+', 'abc' ) );
    t.true ( zeptomatch ( 'a[[:word:]]+', 'abq' ) );
    t.true ( zeptomatch ( 'a[[:word:]]+', 'axy' ) );
    t.true ( zeptomatch ( 'a[[:word:]]+', 'axyzc' ) );
    t.true ( zeptomatch ( 'a[[:word:]]+', 'axyzc' ) );

    t.true ( zeptomatch ( '[[:lower:]]', 'a' ) );
    t.true ( zeptomatch ( '[[:upper:]]', 'A' ) );
    t.true ( zeptomatch ( '[[:digit:][:upper:][:space:]]', 'A' ) );
    t.true ( zeptomatch ( '[[:digit:][:upper:][:space:]]', '1' ) );
    t.true ( zeptomatch ( '[[:digit:][:upper:][:space:]]', ' ' ) );
    t.true ( zeptomatch ( '[[:xdigit:]]', '5' ) );
    t.true ( zeptomatch ( '[[:xdigit:]]', 'f' ) );
    t.true ( zeptomatch ( '[[:xdigit:]]', 'D' ) );
    t.true ( zeptomatch ( '[[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:graph:][:lower:][:print:][:punct:][:space:][:upper:][:xdigit:]]', '_' ) );
    t.true ( zeptomatch ( '[[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:graph:][:lower:][:print:][:punct:][:space:][:upper:][:xdigit:]]', '_' ) );
    t.true ( zeptomatch ( '[^[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:lower:][:space:][:upper:][:xdigit:]]', '.' ) );
    t.true ( zeptomatch ( '[a-c[:digit:]x-z]', '5' ) );
    t.true ( zeptomatch ( '[a-c[:digit:]x-z]', 'b' ) );
    t.true ( zeptomatch ( '[a-c[:digit:]x-z]', 'y' ) );

    t.true ( !zeptomatch ( '[[:lower:]]', 'A' ) );
    t.true ( zeptomatch ( '[![:lower:]]', 'A' ) );
    t.true ( !zeptomatch ( '[[:upper:]]', 'a' ) );
    t.true ( !zeptomatch ( '[[:digit:][:upper:][:space:]]', 'a' ) );
    t.true ( !zeptomatch ( '[[:digit:][:upper:][:space:]]', '.' ) );
    t.true ( !zeptomatch ( '[[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:lower:][:space:][:upper:][:xdigit:]]', '.' ) );
    t.true ( !zeptomatch ( '[a-c[:digit:]x-z]', 'q' ) );

    t.true ( zeptomatch ( 'a [b]', 'a [b]' ) );
    t.true ( zeptomatch ( 'a [b]', 'a b' ) );

    t.true ( zeptomatch ( 'a [b] c', 'a [b] c' ) );
    t.true ( zeptomatch ( 'a [b] c', 'a b c' ) );

    t.true ( zeptomatch ( 'a \\[b\\]', 'a [b]' ) );
    t.true ( !zeptomatch ( 'a \\[b\\]', 'a b' ) );

    t.true ( zeptomatch ( 'a ([b])', 'a [b]' ) );
    t.true ( zeptomatch ( 'a ([b])', 'a b' ) );

    t.true ( zeptomatch ( 'a (\\[b\\]|[b])', 'a b' ) );
    t.true ( zeptomatch ( 'a (\\[b\\]|[b])', 'a [b]' ) );

    t.true ( zeptomatch ( '[[:xdigit:]]', 'e' ) );
    t.true ( zeptomatch ( '[[:xdigit:]]', '1' ) );
    t.true ( zeptomatch ( '[[:alpha:]123]', 'a' ) );
    t.true ( zeptomatch ( '[[:alpha:]123]', '1' ) );

    t.true ( zeptomatch ( '[![:alpha:]]', '9' ) );
    t.true ( zeptomatch ( '[^[:alpha:]]', '9' ) );

    t.true ( zeptomatch ( '[[:word:]]', 'A' ) );
    t.true ( zeptomatch ( '[[:word:]]', 'B' ) );
    t.true ( zeptomatch ( '[[:word:]]', 'a' ) );
    t.true ( zeptomatch ( '[[:word:]]', 'b' ) );

    t.true ( zeptomatch ( '[[:word:]]', '1' ) );
    t.true ( zeptomatch ( '[[:word:]]', '2' ) );

    t.true ( zeptomatch ( '[[:digit:]]', '1' ) );
    t.true ( zeptomatch ( '[[:digit:]]', '2' ) );

    t.true ( !zeptomatch ( '[[:digit:]]', 'a' ) );
    t.true ( !zeptomatch ( '[[:digit:]]', 'A' ) );

    t.true ( zeptomatch ( '[[:upper:]]', 'A' ) );
    t.true ( zeptomatch ( '[[:upper:]]', 'B' ) );

    t.true ( !zeptomatch ( '[[:upper:]]', 'a' ) );
    t.true ( !zeptomatch ( '[[:upper:]]', 'b' ) );

    t.true ( !zeptomatch ( '[[:upper:]]', '1' ) );
    t.true ( !zeptomatch ( '[[:upper:]]', '2' ) );

    t.true ( zeptomatch ( '[[:lower:]]', 'a' ) );
    t.true ( zeptomatch ( '[[:lower:]]', 'b' ) );

    t.true ( !zeptomatch ( '[[:lower:]]', 'A' ) );
    t.true ( !zeptomatch ( '[[:lower:]]', 'B' ) );

    t.true ( zeptomatch ( '[[:lower:]][[:upper:]]', 'aA' ) );
    t.true ( !zeptomatch ( '[[:lower:]][[:upper:]]', 'AA' ) );
    t.true ( !zeptomatch ( '[[:lower:]][[:upper:]]', 'Aa' ) );

    t.true ( zeptomatch ( '[[:xdigit:]]*', 'ababab' ) );
    t.true ( zeptomatch ( '[[:xdigit:]]*', '020202' ) );
    t.true ( zeptomatch ( '[[:xdigit:]]*', '900' ) );

    t.true ( zeptomatch ( '[[:punct:]]', '!' ) );
    t.true ( zeptomatch ( '[[:punct:]]', '?' ) );
    t.true ( zeptomatch ( '[[:punct:]]', '#' ) );
    t.true ( zeptomatch ( '[[:punct:]]', '&' ) );
    t.true ( zeptomatch ( '[[:punct:]]', '@' ) );
    t.true ( zeptomatch ( '[[:punct:]]', '+' ) );
    t.true ( zeptomatch ( '[[:punct:]]', '*' ) );
    t.true ( zeptomatch ( '[[:punct:]]', ':' ) );
    t.true ( zeptomatch ( '[[:punct:]]', '=' ) );
    t.true ( zeptomatch ( '[[:punct:]]', '|' ) );
    t.true ( zeptomatch ( '[[:punct:]]*', '|++' ) );

    t.true ( !zeptomatch ( '[[:punct:]]', '?*+' ) );

    t.true ( zeptomatch ( '[[:punct:]]*', '?*+' ) );
    t.true ( zeptomatch ( 'foo[[:punct:]]*', 'foo' ) );
    t.true ( zeptomatch ( 'foo[[:punct:]]*', 'foo?*+' ) );

    t.true ( zeptomatch ( '[:al:]', 'a' ) );
    t.true ( zeptomatch ( '[[:al:]', 'a' ) );
    t.true ( zeptomatch ( '[abc[:punct:][0-9]', '!' ) );

    t.true ( zeptomatch ( '[_[:alpha:]]*', 'PATH' ) );

    t.true ( zeptomatch ( '[_[:alpha:]][_[:alnum:]]*', 'PATH' ) );

    t.true ( zeptomatch ( '[[:alpha:]][[:digit:]][[:upper:]]', 'a1B' ) );
    t.true ( !zeptomatch ( '[[:alpha:]][[:digit:]][[:upper:]]', 'a1b' ) );
    t.true ( zeptomatch ( '[[:digit:][:punct:][:space:]]', '.' ) );
    t.true ( !zeptomatch ( '[[:digit:][:punct:][:space:]]', 'a' ) );
    t.true ( zeptomatch ( '[[:digit:][:punct:][:space:]]', '!' ) );
    t.true ( !zeptomatch ( '[[:digit:]][[:punct:]][[:space:]]', '!' ) );
    t.true ( zeptomatch ( '[[:digit:]][[:punct:]][[:space:]]', '1! ' ) );
    t.true ( !zeptomatch ( '[[:digit:]][[:punct:]][[:space:]]', '1!  ' ) );

    t.true ( zeptomatch ( '[[:digit:]]', '9' ) );
    t.true ( !zeptomatch ( '[[:digit:]]', 'X' ) );
    t.true ( zeptomatch ( '[[:lower:]][[:upper:]]', 'aB' ) );
    t.true ( zeptomatch ( '[[:alpha:][:digit:]]', 'a' ) );
    t.true ( zeptomatch ( '[[:alpha:][:digit:]]', '3' ) );
    t.true ( !zeptomatch ( '[[:alpha:][:digit:]]', 'aa' ) );
    t.true ( !zeptomatch ( '[[:alpha:][:digit:]]', 'a3' ) );
    t.true ( !zeptomatch ( '[[:alpha:]\\]', 'a' ) );
    t.true ( !zeptomatch ( '[[:alpha:]\\]', 'b' ) );

    t.true ( zeptomatch ( '[[:blank:]]', '\t' ) );
    t.true ( zeptomatch ( '[[:space:]]', '\t' ) );
    t.true ( zeptomatch ( '[[:space:]]', ' ' ) );

    t.true ( !zeptomatch ( '[[:ascii:]]', '\\377' ) );
    t.true ( !zeptomatch ( '[1[:alpha:]123]', '9' ) );

    t.true ( !zeptomatch ( '[[:punct:]]', ' ' ) );

    t.true ( zeptomatch ( '[[:graph:]]', 'A' ) );
    t.true ( !zeptomatch ( '[[:graph:]]', '\\b' ) );
    t.true ( !zeptomatch ( '[[:graph:]]', '\\n' ) );
    t.true ( !zeptomatch ( '[[:graph:]]', '\\s' ) );

  });

  it.skip ( 'extglobs', t => {

    t.true ( zeptomatch ( 'c!(.)z', 'cbz' ) );
    t.true ( !zeptomatch ( 'c!(*)z', 'cbz' ) );
    t.true ( zeptomatch ( 'c!(b*)z', 'cccz' ) );
    t.true ( zeptomatch ( 'c!(+)z', 'cbz' ) );
    t.true ( !zeptomatch ( 'c!(?)z', 'cbz' ) ); // This matches in picomatch, but why though?
    t.true ( zeptomatch ( 'c!(@)z', 'cbz' ) );

    t.true ( !zeptomatch ( 'c!(?:foo)?z', 'c/z' ) );
    t.true ( zeptomatch ( 'c!(?:foo)?z', 'c!fooz' ) );
    t.true ( zeptomatch ( 'c!(?:foo)?z', 'c!z' ) );

    t.true ( !zeptomatch ( '!(abc)', 'abc' ) );
    t.true ( !zeptomatch ( '!(a)', 'a' ) );
    // t.true ( zeptomatch ( '!(a)', 'aa' ) );
    t.true ( zeptomatch ( '!(a)', 'b' ) );

    t.true ( zeptomatch ( 'a!(b)c', 'aac' ) );
    t.true ( !zeptomatch ( 'a!(b)c', 'abc' ) );
    t.true ( zeptomatch ( 'a!(b)c', 'acc' ) );
    t.true ( zeptomatch ( 'a!(z)', 'abz' ) );
    t.true ( !zeptomatch ( 'a!(z)', 'az' ) );

    t.true ( !zeptomatch ( 'a!(.)', 'a.' ) );
    t.true ( !zeptomatch ( '!(.)a', '.a' ) );
    t.true ( !zeptomatch ( 'a!(.)c', 'a.c' ) );
    t.true ( zeptomatch ( 'a!(.)c', 'abc' ) );

    t.true ( !zeptomatch ( '/!(*.d).ts', '/file.d.ts' ) );
    t.true ( zeptomatch ( '/!(*.d).ts', '/file.ts' ) );
    t.true ( zeptomatch ( '/!(*.d).ts', '/file.something.ts' ) );
    // t.true ( zeptomatch ( '/!(*.d).ts', '/file.d.something.ts' ) );
    // t.true ( zeptomatch ( '/!(*.d).ts', '/file.dhello.ts' ) );

    // t.true ( !zeptomatch ( '**/!(*.d).ts', '/file.d.ts' ) );
    // t.true ( zeptomatch ( '**/!(*.d).ts', '/file.ts' ) );
    // t.true ( zeptomatch ( '**/!(*.d).ts', '/file.something.ts' ) );
    // t.true ( zeptomatch ( '**/!(*.d).ts', '/file.d.something.ts' ) );
    // t.true ( zeptomatch ( '**/!(*.d).ts', '/file.dhello.ts' ) );

    // t.true ( !zeptomatch ( '/!(*.d).{ts,tsx}', '/file.d.ts' ) );
    // t.true ( zeptomatch ( '/!(*.d).{ts,tsx}', '/file.ts' ) );
    // t.true ( zeptomatch ( '/!(*.d).{ts,tsx}', '/file.something.ts' ) );
    // t.true ( zeptomatch ( '/!(*.d).{ts,tsx}', '/file.d.something.ts' ) );
    // t.true ( zeptomatch ( '/!(*.d).{ts,tsx}', '/file.dhello.ts' ) );

    // t.true ( !zeptomatch ( '/!(*.d).@(ts)', '/file.d.ts' ) );
    // t.true ( zeptomatch ( '/!(*.d).@(ts)', '/file.ts' ) );
    // t.true ( zeptomatch ( '/!(*.d).@(ts)', '/file.something.ts' ) );
    // t.true ( zeptomatch ( '/!(*.d).@(ts)', '/file.d.something.ts' ) );
    // t.true ( zeptomatch ( '/!(*.d).@(ts)', '/file.dhello.ts' ) );

    t.true ( !zeptomatch ( 'foo/!(abc)', 'foo/abc' ) );
    t.true ( zeptomatch ( 'foo/!(abc)', 'foo/bar' ) );

    t.true ( !zeptomatch ( 'a/!(z)', 'a/z' ) );
    t.true ( zeptomatch ( 'a/!(z)', 'a/b' ) );

    t.true ( !zeptomatch ( 'c/!(z)/v', 'c/z/v' ) );
    t.true ( zeptomatch ( 'c/!(z)/v', 'c/a/v' ) );

    t.true ( zeptomatch ( '!(b/a)', 'a/a' ) );
    t.true ( !zeptomatch ( '!(b/a)', 'b/a' ) );

    // t.true ( !zeptomatch ( '!(!(foo))*', 'foo/bar' ) );
    t.true ( zeptomatch ( '!(b/a)', 'a/a' ) );
    t.true ( !zeptomatch ( '!(b/a)', 'b/a' ) );

    // t.true ( zeptomatch ( '(!(b/a))', 'a/a' ) );
    // t.true ( zeptomatch ( '!((b/a))', 'a/a' ) );
    // t.true ( !zeptomatch ( '!((b/a))', 'b/a' ) );

    t.true ( !zeptomatch ( '(!(?:b/a))', 'a/a' ) );
    t.true ( !zeptomatch ( '!((?:b/a))', 'b/a' ) );

    // t.true ( zeptomatch ( '!(b/(a))', 'a/a' ) );
    // t.true ( !zeptomatch ( '!(b/(a))', 'b/a' ) );

    t.true ( zeptomatch ( '!(b/a)', 'a/a' ) );
    t.true ( !zeptomatch ( '!(b/a)', 'b/a' ) );

    // t.true ( !zeptomatch ( 'c!(z)', 'c/z' ) );
    // t.true ( !zeptomatch ( 'c!(z)z', 'c/z' ) );
    // t.true ( !zeptomatch ( 'c!(.)z', 'c/z' ) );
    // t.true ( !zeptomatch ( 'c!(*)z', 'c/z' ) );
    // t.true ( !zeptomatch ( 'c!(+)z', 'c/z' ) );
    // t.true ( !zeptomatch ( 'c!(?)z', 'c/z' ) );
    // t.true ( !zeptomatch ( 'c!(@)z', 'c/z' ) );

    // t.true ( !zeptomatch ( 'a!(z)', 'c/z' ) );
    // t.true ( !zeptomatch ( 'c!(.)z', 'c/z' ) );
    // t.true ( !zeptomatch ( 'c!(/)z', 'c/z' ) );
    // t.true ( !zeptomatch ( 'c!(/z)z', 'c/z' ) );
    // t.true ( !zeptomatch ( 'c!(/z)z', 'c/b' ) );
    // t.true ( zeptomatch ( 'c!(/z)z', 'c/b/z' ) );

    // t.true ( zeptomatch ( '!!(abc)', 'abc' ) );
    // t.true ( !zeptomatch ( '!!!(abc)', 'abc' ) );
    // t.true ( zeptomatch ( '!!!!(abc)', 'abc' ) );
    // t.true ( !zeptomatch ( '!!!!!(abc)', 'abc' ) );
    // t.true ( zeptomatch ( '!!!!!!(abc)', 'abc' ) );
    // t.true ( !zeptomatch ( '!!!!!!!(abc)', 'abc' ) );
    // t.true ( zeptomatch ( '!!!!!!!!(abc)', 'abc' ) );

    // t.true ( zeptomatch ( '!(!(abc))', 'abc' ) );
    // t.true ( !zeptomatch ( '!(!(!(abc)))', 'abc' ) );
    // t.true ( zeptomatch ( '!(!(!(!(abc))))', 'abc' ) );
    // t.true ( !zeptomatch ( '!(!(!(!(!(abc)))))', 'abc' ) );
    // t.true ( zeptomatch ( '!(!(!(!(!(!(abc))))))', 'abc' ) );
    // t.true ( !zeptomatch ( '!(!(!(!(!(!(!(abc)))))))', 'abc' ) );
    // t.true ( zeptomatch ( '!(!(!(!(!(!(!(!(abc))))))))', 'abc' ) );

    // t.true ( zeptomatch ( 'foo/!(!(abc))', 'foo/abc' ) );
    // t.true ( !zeptomatch ( 'foo/!(!(!(abc)))', 'foo/abc' ) );
    // t.true ( zeptomatch ( 'foo/!(!(!(!(abc))))', 'foo/abc' ) );
    // t.true ( !zeptomatch ( 'foo/!(!(!(!(!(abc)))))', 'foo/abc' ) );
    // t.true ( zeptomatch ( 'foo/!(!(!(!(!(!(abc))))))', 'foo/abc' ) );
    // t.true ( !zeptomatch ( 'foo/!(!(!(!(!(!(!(abc)))))))', 'foo/abc' ) );
    // t.true ( zeptomatch ( 'foo/!(!(!(!(!(!(!(!(abc))))))))', 'foo/abc' ) );

    t.true ( !zeptomatch ( '!(moo).!(cow)', 'moo.cow' ) );
    t.true ( !zeptomatch ( '!(moo).!(cow)', 'foo.cow' ) );
    t.true ( !zeptomatch ( '!(moo).!(cow)', 'moo.bar' ) );
    t.true ( zeptomatch ( '!(moo).!(cow)', 'foo.bar' ) );

    // t.true ( !zeptomatch ( '@(!(a) )*', 'a   ' ) );
    // t.true ( !zeptomatch ( '@(!(a) )*', 'a   b' ) );
    // t.true ( !zeptomatch ( '@(!(a) )*', 'a  b' ) );
    // t.true ( !zeptomatch ( '@(!(a) )*', 'a  ' ) );
    // t.true ( !zeptomatch ( '@(!(a) )*', 'a ' ) );
    // t.true ( !zeptomatch ( '@(!(a) )*', 'a' ) );
    // t.true ( !zeptomatch ( '@(!(a) )*', 'aa' ) );
    // t.true ( !zeptomatch ( '@(!(a) )*', 'b' ) );
    // t.true ( !zeptomatch ( '@(!(a) )*', 'bb' ) );
    // t.true ( zeptomatch ( '@(!(a) )*', ' a ' ) );
    // t.true ( zeptomatch ( '@(!(a) )*', 'b  ' ) );
    // t.true ( zeptomatch ( '@(!(a) )*', 'b ' ) );

    t.true ( !zeptomatch ( 'a*!(z)', 'c/z' ) );
    t.true ( zeptomatch ( 'a*!(z)', 'abz' ) );
    t.true ( zeptomatch ( 'a*!(z)', 'az' ) );

    t.true ( !zeptomatch ( '!(a*)', 'a' ) );
    t.true ( !zeptomatch ( '!(a*)', 'aa' ) );
    t.true ( !zeptomatch ( '!(a*)', 'ab' ) );
    t.true ( zeptomatch ( '!(a*)', 'b' ) );

    t.true ( !zeptomatch ( '!(*a*)', 'a' ) );
    t.true ( !zeptomatch ( '!(*a*)', 'aa' ) );
    t.true ( !zeptomatch ( '!(*a*)', 'ab' ) );
    t.true ( !zeptomatch ( '!(*a*)', 'ac' ) );
    t.true ( zeptomatch ( '!(*a*)', 'b' ) );

    // t.true ( !zeptomatch ( '!(*a)', 'a' ) );
    // t.true ( !zeptomatch ( '!(*a)', 'aa' ) );
    // t.true ( !zeptomatch ( '!(*a)', 'bba' ) );
    // t.true ( zeptomatch ( '!(*a)', 'ab' ) );
    // t.true ( zeptomatch ( '!(*a)', 'ac' ) );
    // t.true ( zeptomatch ( '!(*a)', 'b' ) );

    t.true ( !zeptomatch ( '!(*a)*', 'a' ) );
    t.true ( !zeptomatch ( '!(*a)*', 'aa' ) );
    t.true ( !zeptomatch ( '!(*a)*', 'bba' ) );
    t.true ( !zeptomatch ( '!(*a)*', 'ab' ) );
    t.true ( !zeptomatch ( '!(*a)*', 'ac' ) );
    t.true ( zeptomatch ( '!(*a)*', 'b' ) );

    t.true ( !zeptomatch ( '!(a)*', 'a' ) );
    t.true ( !zeptomatch ( '!(a)*', 'abb' ) );
    t.true ( zeptomatch ( '!(a)*', 'ba' ) );

    t.true ( zeptomatch ( 'a!(b)*', 'aa' ) );
    t.true ( !zeptomatch ( 'a!(b)*', 'ab' ) );
    t.true ( !zeptomatch ( 'a!(b)*', 'aba' ) );
    t.true ( zeptomatch ( 'a!(b)*', 'ac' ) );

    // t.true ( zeptomatch ( '!(!(moo)).!(!(cow))', 'moo.cow' ) );

    t.true ( !zeptomatch ( '!(a|b)c', 'ac' ) );
    t.true ( !zeptomatch ( '!(a|b)c', 'bc' ) );
    t.true ( zeptomatch ( '!(a|b)c', 'cc' ) );

    t.true ( !zeptomatch ( '!(a|b)c.!(d|e)', 'ac.d' ) );
    t.true ( !zeptomatch ( '!(a|b)c.!(d|e)', 'bc.d' ) );
    t.true ( !zeptomatch ( '!(a|b)c.!(d|e)', 'cc.d' ) );
    t.true ( !zeptomatch ( '!(a|b)c.!(d|e)', 'ac.e' ) );
    t.true ( !zeptomatch ( '!(a|b)c.!(d|e)', 'bc.e' ) );
    t.true ( !zeptomatch ( '!(a|b)c.!(d|e)', 'cc.e' ) );
    t.true ( !zeptomatch ( '!(a|b)c.!(d|e)', 'ac.f' ) );
    t.true ( !zeptomatch ( '!(a|b)c.!(d|e)', 'bc.f' ) );
    t.true ( zeptomatch ( '!(a|b)c.!(d|e)', 'cc.f' ) );
    t.true ( zeptomatch ( '!(a|b)c.!(d|e)', 'dc.g' ) );

    // t.true ( zeptomatch ( '!(!(a|b)c.!(d|e))', 'ac.d' ) );
    // t.true ( zeptomatch ( '!(!(a|b)c.!(d|e))', 'bc.d' ) );
    // t.true ( !zeptomatch ( '!(a|b)c.!(d|e)', 'cc.d' ) );
    // t.true ( zeptomatch ( '!(!(a|b)c.!(d|e))', 'cc.d' ) );
    // t.true ( zeptomatch ( '!(!(a|b)c.!(d|e))', 'cc.d' ) );
    // t.true ( zeptomatch ( '!(!(a|b)c.!(d|e))', 'ac.e' ) );
    // t.true ( zeptomatch ( '!(!(a|b)c.!(d|e))', 'bc.e' ) );
    // t.true ( zeptomatch ( '!(!(a|b)c.!(d|e))', 'cc.e' ) );
    // t.true ( zeptomatch ( '!(!(a|b)c.!(d|e))', 'ac.f' ) );
    // t.true ( zeptomatch ( '!(!(a|b)c.!(d|e))', 'bc.f' ) );
    // t.true ( !zeptomatch ( '!(!(a|b)c.!(d|e))', 'cc.f' ) );
    // t.true ( !zeptomatch ( '!(!(a|b)c.!(d|e))', 'dc.g' ) );

    // t.true ( !zeptomatch ( '@(a|b).md', '.md' ) );
    // t.true ( !zeptomatch ( '@(a|b).md', 'a.js' ) );
    // t.true ( !zeptomatch ( '@(a|b).md', 'c.md' ) );
    // t.true ( zeptomatch ( '@(a|b).md', 'a.md' ) );
    // t.true ( zeptomatch ( '@(a|b).md', 'b.md' ) );

    t.true ( !zeptomatch ( '+(a|b).md', '.md' ) );
    t.true ( !zeptomatch ( '+(a|b).md', 'a.js' ) );
    t.true ( !zeptomatch ( '+(a|b).md', 'c.md' ) );
    t.true ( zeptomatch ( '+(a|b).md', 'a.md' ) );
    t.true ( zeptomatch ( '+(a|b).md', 'aa.md' ) );
    t.true ( zeptomatch ( '+(a|b).md', 'ab.md' ) );
    t.true ( zeptomatch ( '+(a|b).md', 'b.md' ) );
    t.true ( zeptomatch ( '+(a|b).md', 'bb.md' ) );

    t.true ( !zeptomatch ( '*(a|b).md', 'a.js' ) );
    t.true ( !zeptomatch ( '*(a|b).md', 'c.md' ) );
    t.true ( zeptomatch ( '*(a|b).md', '.md' ) );
    t.true ( zeptomatch ( '*(a|b).md', 'a.md' ) );
    t.true ( zeptomatch ( '*(a|b).md', 'aa.md' ) );
    t.true ( zeptomatch ( '*(a|b).md', 'ab.md' ) );
    t.true ( zeptomatch ( '*(a|b).md', 'b.md' ) );
    t.true ( zeptomatch ( '*(a|b).md', 'bb.md' ) );

    t.true ( !zeptomatch ( '?(a|b).md', 'a.js' ) );
    t.true ( !zeptomatch ( '?(a|b).md', 'bb.md' ) );
    t.true ( !zeptomatch ( '?(a|b).md', 'c.md' ) );
    t.true ( zeptomatch ( '?(a|b).md', '.md' ) );
    t.true ( zeptomatch ( '?(a|ab|b).md', 'a.md' ) );
    t.true ( zeptomatch ( '?(a|b).md', 'a.md' ) );
    t.true ( zeptomatch ( '?(a|aa|b).md', 'aa.md' ) );
    t.true ( zeptomatch ( '?(a|ab|b).md', 'ab.md' ) );
    t.true ( zeptomatch ( '?(a|ab|b).md', 'b.md' ) );

    t.true ( zeptomatch ( '+(a)?(b)', 'ab' ) );
    t.true ( zeptomatch ( '+(a)?(b)', 'aab' ) );
    t.true ( zeptomatch ( '+(a)?(b)', 'aa' ) );
    t.true ( zeptomatch ( '+(a)?(b)', 'a' ) );

    t.true ( !zeptomatch ( 'a?(b*)', 'ax' ) );
    t.true ( zeptomatch ( '?(a*|b)', 'ax' ) );

    t.true ( !zeptomatch ( 'a*(b*)', 'ax' ) );
    t.true ( zeptomatch ( '*(a*|b)', 'ax' ) );

    t.true ( !zeptomatch ( 'a@(b*)', 'ax' ) );
    t.true ( zeptomatch ( '@(a*|b)', 'ax' ) );

    t.true ( !zeptomatch ( 'a?(b*)', 'ax' ) );
    t.true ( zeptomatch ( '?(a*|b)', 'ax' ) );

    t.true ( zeptomatch ( 'a!(b*)', 'ax' ) );
    t.true ( !zeptomatch ( '!(a*|b)', 'ax' ) );

    // t.true ( zeptomatch ( '!(a/**)', 'a' ) );
    // t.true ( !zeptomatch ( '!(a/**)', 'a/' ) );
    // t.true ( !zeptomatch ( '!(a/**)', 'a/b' ) );
    // t.true ( !zeptomatch ( '!(a/**)', 'a/b/c' ) );
    // t.true ( zeptomatch ( '!(a/**)', 'b' ) );
    // t.true ( zeptomatch ( '!(a/**)', 'b/c' ) );

    t.true ( zeptomatch ( 'a/!(b*)', 'a/a' ) );
    t.true ( !zeptomatch ( 'a/!(b*)', 'a/b' ) );
    t.true ( !zeptomatch ( 'a/!(b/*)', 'a/b/c' ) );
    t.true ( !zeptomatch ( 'a/!(b*)', 'a/b/c' ) );
    t.true ( zeptomatch ( 'a/!(b*)', 'a/c' ) );

    t.true ( zeptomatch ( 'a/!(b*)/**', 'a/a/' ) );
    t.true ( zeptomatch ( 'a/!(b*)', 'a/a' ) );
    t.true ( zeptomatch ( 'a/!(b*)/**', 'a/a' ) );
    t.true ( !zeptomatch ( 'a/!(b*)/**', 'a/b' ) );
    t.true ( !zeptomatch ( 'a/!(b*)/**', 'a/b/c' ) );
    t.true ( zeptomatch ( 'a/!(b*)/**', 'a/c' ) );
    t.true ( zeptomatch ( 'a/!(b*)', 'a/c' ) );
    t.true ( zeptomatch ( 'a/!(b*)/**', 'a/c/' ) );

    t.true ( zeptomatch ( 'a*(z)', 'a' ) );
    t.true ( zeptomatch ( 'a*(z)', 'az' ) );
    t.true ( zeptomatch ( 'a*(z)', 'azz' ) );
    t.true ( zeptomatch ( 'a*(z)', 'azzz' ) );
    t.true ( !zeptomatch ( 'a*(z)', 'abz' ) );
    t.true ( !zeptomatch ( 'a*(z)', 'cz' ) );

    t.true ( !zeptomatch ( '*(b/a)', 'a/a' ) );
    t.true ( !zeptomatch ( '*(b/a)', 'a/b' ) );
    t.true ( !zeptomatch ( '*(b/a)', 'a/c' ) );
    t.true ( zeptomatch ( '*(b/a)', 'b/a' ) );
    t.true ( !zeptomatch ( '*(b/a)', 'b/b' ) );
    t.true ( !zeptomatch ( '*(b/a)', 'b/c' ) );

    // t.true ( !zeptomatch ( 'a**(z)', 'cz' ) );
    // t.true ( zeptomatch ( 'a**(z)', 'abz' ) );
    // t.true ( zeptomatch ( 'a**(z)', 'az' ) );

    t.true ( !zeptomatch ( '*(z)', 'c/z/v' ) );
    t.true ( zeptomatch ( '*(z)', 'z' ) );
    t.true ( !zeptomatch ( '*(z)', 'zf' ) );
    t.true ( !zeptomatch ( '*(z)', 'fz' ) );

    t.true ( !zeptomatch ( 'c/*(z)/v', 'c/a/v' ) );
    t.true ( zeptomatch ( 'c/*(z)/v', 'c/z/v' ) );

    t.true ( !zeptomatch ( '*.*(js).js', 'a.md.js' ) );
    t.true ( zeptomatch ( '*.*(js).js', 'a.js.js' ) );

    t.true ( !zeptomatch ( 'a+(z)', 'a' ) );
    t.true ( zeptomatch ( 'a+(z)', 'az' ) );
    t.true ( !zeptomatch ( 'a+(z)', 'cz' ) );
    t.true ( !zeptomatch ( 'a+(z)', 'abz' ) );
    t.true ( !zeptomatch ( 'a+(z)', 'a+z' ) );
    t.true ( zeptomatch ( 'a++(z)', 'a+z' ) );
    t.true ( !zeptomatch ( 'a+(z)', 'c+z' ) );
    t.true ( !zeptomatch ( 'a+(z)', 'a+bz' ) );
    t.true ( !zeptomatch ( '+(z)', 'az' ) );
    t.true ( !zeptomatch ( '+(z)', 'cz' ) );
    t.true ( !zeptomatch ( '+(z)', 'abz' ) );
    t.true ( !zeptomatch ( '+(z)', 'fz' ) );
    t.true ( zeptomatch ( '+(z)', 'z' ) );
    t.true ( zeptomatch ( '+(z)', 'zz' ) );
    t.true ( zeptomatch ( 'c/+(z)/v', 'c/z/v' ) );
    t.true ( zeptomatch ( 'c/+(z)/v', 'c/zz/v' ) );
    t.true ( !zeptomatch ( 'c/+(z)/v', 'c/a/v' ) );

    t.true ( zeptomatch ( 'a??(z)', 'a?z' ) );
    t.true ( zeptomatch ( 'a??(z)', 'a.z' ) );
    t.true ( !zeptomatch ( 'a??(z)', 'a/z' ) );
    t.true ( zeptomatch ( 'a??(z)', 'a?' ) );
    t.true ( zeptomatch ( 'a??(z)', 'ab' ) );
    t.true ( !zeptomatch ( 'a??(z)', 'a/' ) );

    t.true ( !zeptomatch ( 'a?(z)', 'a?z' ) );
    t.true ( !zeptomatch ( 'a?(z)', 'abz' ) );
    t.true ( !zeptomatch ( 'a?(z)', 'z' ) );
    t.true ( zeptomatch ( 'a?(z)', 'a' ) );
    t.true ( zeptomatch ( 'a?(z)', 'az' ) );

    t.true ( !zeptomatch ( '?(z)', 'abz' ) );
    t.true ( !zeptomatch ( '?(z)', 'az' ) );
    t.true ( !zeptomatch ( '?(z)', 'cz' ) );
    t.true ( !zeptomatch ( '?(z)', 'fz' ) );
    t.true ( !zeptomatch ( '?(z)', 'zz' ) );
    t.true ( zeptomatch ( '?(z)', 'z' ) );

    t.true ( !zeptomatch ( 'c/?(z)/v', 'c/a/v' ) );
    t.true ( !zeptomatch ( 'c/?(z)/v', 'c/zz/v' ) );
    t.true ( zeptomatch ( 'c/?(z)/v', 'c/z/v' ) );

    t.true ( zeptomatch ( 'c/@(z)/v', 'c/z/v' ) );
    t.true ( !zeptomatch ( 'c/@(z)/v', 'c/a/v' ) );
    t.true ( zeptomatch ( '@(*.*)', 'moo.cow' ) );

    t.true ( !zeptomatch ( 'a*@(z)', 'cz' ) );
    t.true ( zeptomatch ( 'a*@(z)', 'abz' ) );
    t.true ( zeptomatch ( 'a*@(z)', 'az' ) );

    t.true ( !zeptomatch ( 'a@(z)', 'cz' ) );
    t.true ( !zeptomatch ( 'a@(z)', 'abz' ) );
    t.true ( zeptomatch ( 'a@(z)', 'az' ) );

    t.true ( !zeptomatch ( '(b|a).(a)', 'aa.aa' ) );
    t.true ( !zeptomatch ( '(b|a).(a)', 'a.bb' ) );
    t.true ( !zeptomatch ( '(b|a).(a)', 'a.aa.a' ) );
    t.true ( !zeptomatch ( '(b|a).(a)', 'cc.a' ) );
    // t.true ( zeptomatch ( '(b|a).(a)', 'a.a' ) );
    t.true ( !zeptomatch ( '(b|a).(a)', 'c.a' ) );
    t.true ( !zeptomatch ( '(b|a).(a)', 'dd.aa.d' ) );
    // t.true ( zeptomatch ( '(b|a).(a)', 'b.a' ) );

    // t.true ( !zeptomatch ( '@(b|a).@(a)', 'aa.aa' ) );
    // t.true ( !zeptomatch ( '@(b|a).@(a)', 'a.bb' ) );
    // t.true ( !zeptomatch ( '@(b|a).@(a)', 'a.aa.a' ) );
    // t.true ( !zeptomatch ( '@(b|a).@(a)', 'cc.a' ) );
    // t.true ( zeptomatch ( '@(b|a).@(a)', 'a.a' ) );
    // t.true ( !zeptomatch ( '@(b|a).@(a)', 'c.a' ) );
    // t.true ( !zeptomatch ( '@(b|a).@(a)', 'dd.aa.d' ) );
    // t.true ( zeptomatch ( '@(b|a).@(a)', 'b.a' ) );

    // t.true ( !zeptomatch ( '*(0|1|3|5|7|9)', '' ) );

    t.true ( zeptomatch ( '*(0|1|3|5|7|9)', '137577991' ) );
    t.true ( !zeptomatch ( '*(0|1|3|5|7|9)', '2468' ) );

    t.true ( zeptomatch ( '*.c?(c)', 'file.c' ) );
    t.true ( !zeptomatch ( '*.c?(c)', 'file.C' ) );
    t.true ( zeptomatch ( '*.c?(c)', 'file.cc' ) );
    t.true ( !zeptomatch ( '*.c?(c)', 'file.ccc' ) );

    t.true ( zeptomatch ( '!(*.c|*.h|Makefile.in|config*|README)', 'parse.y' ) );
    t.true ( !zeptomatch ( '!(*.c|*.h|Makefile.in|config*|README)', 'shell.c' ) );
    t.true ( zeptomatch ( '!(*.c|*.h|Makefile.in|config*|README)', 'Makefile' ) );
    t.true ( !zeptomatch ( '!(*.c|*.h|Makefile.in|config*|README)', 'Makefile.in' ) );

    t.true ( !zeptomatch ( '*\\;[1-9]*([0-9])', 'VMS.FILE;' ) );
    t.true ( !zeptomatch ( '*\\;[1-9]*([0-9])', 'VMS.FILE;0' ) );
    t.true ( zeptomatch ( '*\\;[1-9]*([0-9])', 'VMS.FILE;1' ) );
    t.true ( zeptomatch ( '*\\;[1-9]*([0-9])', 'VMS.FILE;139' ) );
    t.true ( !zeptomatch ( '*\\;[1-9]*([0-9])', 'VMS.FILE;1N' ) );

    t.true ( zeptomatch ( '!([*)*', 'abcx' ) );
    t.true ( zeptomatch ( '!([*)*', 'abcz' ) );
    t.true ( zeptomatch ( '!([*)*', 'bbc' ) );

    t.true ( zeptomatch ( '!([[*])*', 'abcx' ) );
    t.true ( zeptomatch ( '!([[*])*', 'abcz' ) );
    t.true ( zeptomatch ( '!([[*])*', 'bbc' ) );

    t.true ( zeptomatch ( '+(a|b\\[)*', 'abcx' ) );
    t.true ( zeptomatch ( '+(a|b\\[)*', 'abcz' ) );
    t.true ( !zeptomatch ( '+(a|b\\[)*', 'bbc' ) );

    t.true ( zeptomatch ( '+(a|b[)*', 'abcx' ) );
    t.true ( zeptomatch ( '+(a|b[)*', 'abcz' ) );
    t.true ( !zeptomatch ( '+(a|b[)*', 'bbc' ) );

    t.true ( !zeptomatch ( '[a*(]*z', 'abcx' ) );
    t.true ( zeptomatch ( '[a*(]*z', 'abcz' ) );
    t.true ( !zeptomatch ( '[a*(]*z', 'bbc' ) );
    t.true ( zeptomatch ( '[a*(]*z', 'aaz' ) );
    t.true ( zeptomatch ( '[a*(]*z', 'aaaz' ) );

    t.true ( !zeptomatch ( '[a*(]*)z', 'abcx' ) );
    t.true ( !zeptomatch ( '[a*(]*)z', 'abcz' ) );
    t.true ( !zeptomatch ( '[a*(]*)z', 'bbc' ) );

    t.true ( !zeptomatch ( '+()c', 'abc' ) );
    t.true ( !zeptomatch ( '+()x', 'abc' ) );
    t.true ( zeptomatch ( '+(*)c', 'abc' ) );
    t.true ( !zeptomatch ( '+(*)x', 'abc' ) );
    t.true ( !zeptomatch ( 'no-file+(a|b)stuff', 'abc' ) );
    t.true ( !zeptomatch ( 'no-file+(a*(c)|b)stuff', 'abc' ) );

    t.true ( zeptomatch ( 'a+(b|c)d', 'abd' ) );
    t.true ( zeptomatch ( 'a+(b|c)d', 'acd' ) );

    t.true ( !zeptomatch ( 'a+(b|c)d', 'abc' ) );

    // t.true ( zeptomatch ( 'a!(b|B)', 'abd' ) );
    // t.true ( zeptomatch ( 'a!(@(b|B))', 'acd' ) );
    // t.true ( zeptomatch ( 'a!(@(b|B))', 'ac' ) );
    // t.true ( !zeptomatch ( 'a!(@(b|B))', 'ab' ) );

    // t.true ( !zeptomatch ( 'a!(@(b|B))d', 'abc' ) );
    // t.true ( !zeptomatch ( 'a!(@(b|B))d', 'abd' ) );
    // t.true ( zeptomatch ( 'a!(@(b|B))d', 'acd' ) );

    t.true ( zeptomatch ( 'a[b*(foo|bar)]d', 'abd' ) );
    t.true ( !zeptomatch ( 'a[b*(foo|bar)]d', 'abc' ) );
    t.true ( !zeptomatch ( 'a[b*(foo|bar)]d', 'acd' ) );

    // t.true ( !zeptomatch ( 'para+([0-9])', 'para' ) );
    // t.true ( !zeptomatch ( 'para?([345]|99)1', 'para381' ) );
    // t.true ( !zeptomatch ( 'para*([0-9])', 'paragraph' ) );
    // t.true ( !zeptomatch ( 'para@(chute|graph)', 'paramour' ) );
    // t.true ( zeptomatch ( 'para*([0-9])', 'para' ) );
    // t.true ( zeptomatch ( 'para!(*.[0-9])', 'para.38' ) );
    // t.true ( zeptomatch ( 'para!(*.[00-09])', 'para.38' ) );
    // t.true ( zeptomatch ( 'para!(*.[0-9])', 'para.graph' ) );
    // t.true ( zeptomatch ( 'para*([0-9])', 'para13829383746592' ) );
    // t.true ( zeptomatch ( 'para!(*.[0-9])', 'para39' ) );
    // t.true ( zeptomatch ( 'para+([0-9])', 'para987346523' ) );
    // t.true ( zeptomatch ( 'para?([345]|99)1', 'para991' ) );
    // t.true ( zeptomatch ( 'para!(*.[0-9])', 'paragraph' ) );
    // t.true ( zeptomatch ( 'para@(chute|graph)', 'paragraph' ) );

    t.true ( !zeptomatch ( '*(a|b[)', 'foo' ) );
    t.true ( !zeptomatch ( '*(a|b[)', '(' ) );
    t.true ( !zeptomatch ( '*(a|b[)', ')' ) );
    t.true ( !zeptomatch ( '*(a|b[)', '|' ) );
    t.true ( zeptomatch ( '*(a|b)', 'a' ) );
    t.true ( zeptomatch ( '*(a|b)', 'b' ) );
    t.true ( zeptomatch ( '*(a|b\\[)', 'b[' ) );
    t.true ( zeptomatch ( '+(a|b\\[)', 'ab[' ) );
    t.true ( !zeptomatch ( '+(a|b\\[)', 'ab[cde' ) );
    t.true ( zeptomatch ( '+(a|b\\[)*', 'ab[cde' ) );

    // t.true ( zeptomatch ( '*(a|b|f)*', 'foo' ) );
    // t.true ( zeptomatch ( '*(a|b|o)*', 'foo' ) );
    // t.true ( zeptomatch ( '*(a|b|f|o)', 'foo' ) );
    // t.true ( zeptomatch ( '\\*\\(a\\|b\\[\\)', '*(a|b[)' ) );
    // t.true ( !zeptomatch ( '*(a|b)', 'foo' ) );
    // t.true ( !zeptomatch ( '*(a|b\\[)', 'foo' ) );
    // t.true ( zeptomatch ( '*(a|b\\[)|f*', 'foo' ) );

    // t.true ( zeptomatch ( '@(*).@(*)', 'moo.cow' ) );
    // t.true ( zeptomatch ( '*.@(a|b|@(ab|a*@(b))*@(c)d)', 'a.a' ) );
    // t.true ( zeptomatch ( '*.@(a|b|@(ab|a*@(b))*@(c)d)', 'a.b' ) );
    // t.true ( !zeptomatch ( '*.@(a|b|@(ab|a*@(b))*@(c)d)', 'a.c' ) );
    // t.true ( !zeptomatch ( '*.@(a|b|@(ab|a*@(b))*@(c)d)', 'a.c.d' ) );
    // t.true ( !zeptomatch ( '*.@(a|b|@(ab|a*@(b))*@(c)d)', 'c.c' ) );
    // t.true ( !zeptomatch ( '*.@(a|b|@(ab|a*@(b))*@(c)d)', 'a.' ) );
    // t.true ( !zeptomatch ( '*.@(a|b|@(ab|a*@(b))*@(c)d)', 'd.d' ) );
    // t.true ( !zeptomatch ( '*.@(a|b|@(ab|a*@(b))*@(c)d)', 'e.e' ) );
    // t.true ( !zeptomatch ( '*.@(a|b|@(ab|a*@(b))*@(c)d)', 'f.f' ) );
    // t.true ( zeptomatch ( '*.@(a|b|@(ab|a*@(b))*@(c)d)', 'a.abcd' ) );

    // t.true ( !zeptomatch ( '!(*.a|*.b|*.c)', 'a.a' ) );
    // t.true ( !zeptomatch ( '!(*.a|*.b|*.c)', 'a.b' ) );
    // t.true ( !zeptomatch ( '!(*.a|*.b|*.c)', 'a.c' ) );
    // t.true ( zeptomatch ( '!(*.a|*.b|*.c)', 'a.c.d' ) );
    // t.true ( !zeptomatch ( '!(*.a|*.b|*.c)', 'c.c' ) );
    // t.true ( zeptomatch ( '!(*.a|*.b|*.c)', 'a.' ) );
    // t.true ( zeptomatch ( '!(*.a|*.b|*.c)', 'd.d' ) );
    // t.true ( zeptomatch ( '!(*.a|*.b|*.c)', 'e.e' ) );
    // t.true ( zeptomatch ( '!(*.a|*.b|*.c)', 'f.f' ) );
    // t.true ( zeptomatch ( '!(*.a|*.b|*.c)', 'a.abcd' ) );

    t.true ( zeptomatch ( '!(*.[^a-c])', 'a.a' ) );
    t.true ( zeptomatch ( '!(*.[^a-c])', 'a.b' ) );
    t.true ( zeptomatch ( '!(*.[^a-c])', 'a.c' ) );
    t.true ( !zeptomatch ( '!(*.[^a-c])', 'a.c.d' ) );
    t.true ( zeptomatch ( '!(*.[^a-c])', 'c.c' ) );
    t.true ( zeptomatch ( '!(*.[^a-c])', 'a.' ) );
    t.true ( !zeptomatch ( '!(*.[^a-c])', 'd.d' ) );
    t.true ( !zeptomatch ( '!(*.[^a-c])', 'e.e' ) );
    t.true ( !zeptomatch ( '!(*.[^a-c])', 'f.f' ) );
    t.true ( zeptomatch ( '!(*.[^a-c])', 'a.abcd' ) );

    // t.true ( !zeptomatch ( '!(*.[a-c])', 'a.a' ) );
    // t.true ( !zeptomatch ( '!(*.[a-c])', 'a.b' ) );
    // t.true ( !zeptomatch ( '!(*.[a-c])', 'a.c' ) );
    // t.true ( zeptomatch ( '!(*.[a-c])', 'a.c.d' ) );
    // t.true ( !zeptomatch ( '!(*.[a-c])', 'c.c' ) );
    // t.true ( zeptomatch ( '!(*.[a-c])', 'a.' ) );
    // t.true ( zeptomatch ( '!(*.[a-c])', 'd.d' ) );
    // t.true ( zeptomatch ( '!(*.[a-c])', 'e.e' ) );
    // t.true ( zeptomatch ( '!(*.[a-c])', 'f.f' ) );
    // t.true ( zeptomatch ( '!(*.[a-c])', 'a.abcd' ) );

    t.true ( !zeptomatch ( '!(*.[a-c]*)', 'a.a' ) );
    t.true ( !zeptomatch ( '!(*.[a-c]*)', 'a.b' ) );
    t.true ( !zeptomatch ( '!(*.[a-c]*)', 'a.c' ) );
    t.true ( !zeptomatch ( '!(*.[a-c]*)', 'a.c.d' ) );
    t.true ( !zeptomatch ( '!(*.[a-c]*)', 'c.c' ) );
    t.true ( zeptomatch ( '!(*.[a-c]*)', 'a.' ) );
    t.true ( zeptomatch ( '!(*.[a-c]*)', 'd.d' ) );
    t.true ( zeptomatch ( '!(*.[a-c]*)', 'e.e' ) );
    t.true ( zeptomatch ( '!(*.[a-c]*)', 'f.f' ) );
    t.true ( !zeptomatch ( '!(*.[a-c]*)', 'a.abcd' ) );

    // t.true ( !zeptomatch ( '*.!(a|b|c)', 'a.a' ) );
    // t.true ( !zeptomatch ( '*.!(a|b|c)', 'a.b' ) );
    // t.true ( !zeptomatch ( '*.!(a|b|c)', 'a.c' ) );
    // t.true ( zeptomatch ( '*.!(a|b|c)', 'a.c.d' ) );
    // t.true ( !zeptomatch ( '*.!(a|b|c)', 'c.c' ) );
    // t.true ( zeptomatch ( '*.!(a|b|c)', 'a.' ) );
    // t.true ( zeptomatch ( '*.!(a|b|c)', 'd.d' ) );
    // t.true ( zeptomatch ( '*.!(a|b|c)', 'e.e' ) );
    // t.true ( zeptomatch ( '*.!(a|b|c)', 'f.f' ) );
    // t.true ( zeptomatch ( '*.!(a|b|c)', 'a.abcd' ) );

    t.true ( zeptomatch ( '*!(.a|.b|.c)', 'a.a' ) );
    t.true ( zeptomatch ( '*!(.a|.b|.c)', 'a.b' ) );
    t.true ( zeptomatch ( '*!(.a|.b|.c)', 'a.c' ) );
    t.true ( zeptomatch ( '*!(.a|.b|.c)', 'a.c.d' ) );
    t.true ( zeptomatch ( '*!(.a|.b|.c)', 'c.c' ) );
    t.true ( zeptomatch ( '*!(.a|.b|.c)', 'a.' ) );
    t.true ( zeptomatch ( '*!(.a|.b|.c)', 'd.d' ) );
    t.true ( zeptomatch ( '*!(.a|.b|.c)', 'e.e' ) );
    t.true ( zeptomatch ( '*!(.a|.b|.c)', 'f.f' ) );
    t.true ( zeptomatch ( '*!(.a|.b|.c)', 'a.abcd' ) );

    t.true ( !zeptomatch ( '!(*.[a-c])*', 'a.a' ) );
    t.true ( !zeptomatch ( '!(*.[a-c])*', 'a.b' ) );
    t.true ( !zeptomatch ( '!(*.[a-c])*', 'a.c' ) );
    t.true ( !zeptomatch ( '!(*.[a-c])*', 'a.c.d' ) );
    t.true ( !zeptomatch ( '!(*.[a-c])*', 'c.c' ) );
    t.true ( zeptomatch ( '!(*.[a-c])*', 'a.' ) );
    t.true ( zeptomatch ( '!(*.[a-c])*', 'd.d' ) );
    t.true ( zeptomatch ( '!(*.[a-c])*', 'e.e' ) );
    t.true ( zeptomatch ( '!(*.[a-c])*', 'f.f' ) );
    t.true ( !zeptomatch ( '!(*.[a-c])*', 'a.abcd' ) );

    t.true ( zeptomatch ( '*!(.a|.b|.c)*', 'a.a' ) );
    t.true ( zeptomatch ( '*!(.a|.b|.c)*', 'a.b' ) );
    t.true ( zeptomatch ( '*!(.a|.b|.c)*', 'a.c' ) );
    t.true ( zeptomatch ( '*!(.a|.b|.c)*', 'a.c.d' ) );
    t.true ( zeptomatch ( '*!(.a|.b|.c)*', 'c.c' ) );
    t.true ( zeptomatch ( '*!(.a|.b|.c)*', 'a.' ) );
    t.true ( zeptomatch ( '*!(.a|.b|.c)*', 'd.d' ) );
    t.true ( zeptomatch ( '*!(.a|.b|.c)*', 'e.e' ) );
    t.true ( zeptomatch ( '*!(.a|.b|.c)*', 'f.f' ) );
    t.true ( zeptomatch ( '*!(.a|.b|.c)*', 'a.abcd' ) );

    t.true ( !zeptomatch ( '*.!(a|b|c)*', 'a.a' ) );
    t.true ( !zeptomatch ( '*.!(a|b|c)*', 'a.b' ) );
    t.true ( !zeptomatch ( '*.!(a|b|c)*', 'a.c' ) );
    t.true ( zeptomatch ( '*.!(a|b|c)*', 'a.c.d' ) );
    t.true ( !zeptomatch ( '*.!(a|b|c)*', 'c.c' ) );
    t.true ( zeptomatch ( '*.!(a|b|c)*', 'a.' ) );
    t.true ( zeptomatch ( '*.!(a|b|c)*', 'd.d' ) );
    t.true ( zeptomatch ( '*.!(a|b|c)*', 'e.e' ) );
    t.true ( zeptomatch ( '*.!(a|b|c)*', 'f.f' ) );
    t.true ( !zeptomatch ( '*.!(a|b|c)*', 'a.abcd' ) );

    // t.true ( !zeptomatch ( '@()ef', 'def' ) );
    // t.true ( zeptomatch ( '@()ef', 'ef' ) );

    // t.true ( !zeptomatch ( '()ef', 'def' ) );
    // t.true ( zeptomatch ( '()ef', 'ef' ) );

    // t.true ( zeptomatch ( 'a\\\\\\(b', 'a\\(b' ) );
    // t.true ( zeptomatch ( 'a(b', 'a(b' ) );
    // t.true ( zeptomatch ( 'a\\(b', 'a(b' ) );
    // t.true ( !zeptomatch ( 'a(b', 'a((b' ) );
    // t.true ( !zeptomatch ( 'a(b', 'a((((b' ) );
    // t.true ( !zeptomatch ( 'a(b', 'ab' ) );

    t.true ( zeptomatch ( 'a\\(b', 'a(b' ) );
    t.true ( !zeptomatch ( 'a\\(b', 'a((b' ) );
    t.true ( !zeptomatch ( 'a\\(b', 'a((((b' ) );
    t.true ( !zeptomatch ( 'a\\(b', 'ab' ) );

    t.true ( zeptomatch ( 'a(*b', 'a(b' ) );
    t.true ( zeptomatch ( 'a\\(*b', 'a(ab' ) );
    t.true ( zeptomatch ( 'a(*b', 'a((b' ) );
    t.true ( zeptomatch ( 'a(*b', 'a((((b' ) );
    t.true ( !zeptomatch ( 'a(*b', 'ab' ) );

    t.true ( zeptomatch ( 'a\\(b', 'a(b' ) );
    t.true ( zeptomatch ( 'a\\(\\(b', 'a((b' ) );
    t.true ( zeptomatch ( 'a\\(\\(\\(\\(b', 'a((((b' ) );

    t.true ( !zeptomatch ( 'a\\\\(b', 'a(b' ) );
    t.true ( !zeptomatch ( 'a\\\\(b', 'a((b' ) );
    t.true ( !zeptomatch ( 'a\\\\(b', 'a((((b' ) );
    t.true ( !zeptomatch ( 'a\\\\(b', 'ab' ) );

    t.true ( !zeptomatch ( 'a\\\\b', 'a/b' ) );
    t.true ( !zeptomatch ( 'a\\\\b', 'ab' ) );

  });

  // Tests adapted from "glob-match": https://github.com/devongovett/glob-match
  // License: https://github.com/devongovett/glob-match/blob/main/LICENSE

  it ( 'basic', t => {

    t.true ( zeptomatch ( "abc", "abc" ) );
    t.true ( zeptomatch ( "*", "abc" ) );
    t.true ( zeptomatch ( "*", "" ) );
    t.true ( zeptomatch ( "**", "" ) );
    t.true ( zeptomatch ( "*c", "abc" ) );
    t.true ( !zeptomatch ( "*b", "abc" ) );
    t.true ( zeptomatch ( "a*", "abc" ) );
    t.true ( !zeptomatch ( "b*", "abc" ) );
    t.true ( zeptomatch ( "a*", "a" ) );
    t.true ( zeptomatch ( "*a", "a" ) );
    t.true ( zeptomatch ( "a*b*c*d*e*", "axbxcxdxe" ) );
    t.true ( zeptomatch ( "a*b*c*d*e*", "axbxcxdxexxx" ) );
    t.true ( zeptomatch ( "a*b?c*x", "abxbbxdbxebxczzx" ) );
    t.true ( !zeptomatch ( "a*b?c*x", "abxbbxdbxebxczzy" ) );

    t.true ( zeptomatch ( "a/*/test", "a/foo/test" ) );
    t.true ( !zeptomatch ( "a/*/test", "a/foo/bar/test" ) );
    t.true ( zeptomatch ( "a/**/test", "a/foo/test" ) );
    t.true ( zeptomatch ( "a/**/test", "a/foo/bar/test" ) );
    t.true ( zeptomatch ( "a/**/b/c", "a/foo/bar/b/c" ) );
    t.true ( zeptomatch ( "a\\*b", "a*b" ) );
    t.true ( !zeptomatch ( "a\\*b", "axb" ) );

    t.true ( zeptomatch ( "[abc]", "a" ) );
    t.true ( zeptomatch ( "[abc]", "b" ) );
    t.true ( zeptomatch ( "[abc]", "c" ) );
    t.true ( !zeptomatch ( "[abc]", "d" ) );
    t.true ( zeptomatch ( "x[abc]x", "xax" ) );
    t.true ( zeptomatch ( "x[abc]x", "xbx" ) );
    t.true ( zeptomatch ( "x[abc]x", "xcx" ) );
    t.true ( !zeptomatch ( "x[abc]x", "xdx" ) );
    t.true ( !zeptomatch ( "x[abc]x", "xay" ) );
    t.true ( zeptomatch ( "[?]", "?" ) );
    t.true ( !zeptomatch ( "[?]", "a" ) );
    t.true ( zeptomatch ( "[*]", "*" ) );
    t.true ( !zeptomatch ( "[*]", "a" ) );

    t.true ( zeptomatch ( "[a-cx]", "a" ) );
    t.true ( zeptomatch ( "[a-cx]", "b" ) );
    t.true ( zeptomatch ( "[a-cx]", "c" ) );
    t.true ( !zeptomatch ( "[a-cx]", "d" ) );
    t.true ( zeptomatch ( "[a-cx]", "x" ) );

    t.true ( !zeptomatch ( "[^abc]", "a" ) );
    t.true ( !zeptomatch ( "[^abc]", "b" ) );
    t.true ( !zeptomatch ( "[^abc]", "c" ) );
    t.true ( zeptomatch ( "[^abc]", "d" ) );
    t.true ( !zeptomatch ( "[!abc]", "a" ) );
    t.true ( !zeptomatch ( "[!abc]", "b" ) );
    t.true ( !zeptomatch ( "[!abc]", "c" ) );
    t.true ( zeptomatch ( "[!abc]", "d" ) );
    t.true ( zeptomatch ( "[\\!]", "!" ) );

    t.true ( zeptomatch ( "a*b*[cy]*d*e*", "axbxcxdxexxx" ) );
    t.true ( zeptomatch ( "a*b*[cy]*d*e*", "axbxyxdxexxx" ) );
    t.true ( zeptomatch ( "a*b*[cy]*d*e*", "axbxxxyxdxexxx" ) );

    t.true ( zeptomatch ( "test.{jpg,png}", "test.jpg" ) );
    t.true ( zeptomatch ( "test.{jpg,png}", "test.png" ) );
    t.true ( zeptomatch ( "test.{j*g,p*g}", "test.jpg" ) );
    t.true ( zeptomatch ( "test.{j*g,p*g}", "test.jpxxxg" ) );
    t.true ( zeptomatch ( "test.{j*g,p*g}", "test.jxg" ) );
    t.true ( !zeptomatch ( "test.{j*g,p*g}", "test.jnt" ) );
    t.true ( zeptomatch ( "test.{j*g,j*c}", "test.jnc" ) );
    t.true ( zeptomatch ( "test.{jpg,p*g}", "test.png" ) );
    t.true ( zeptomatch ( "test.{jpg,p*g}", "test.pxg" ) );
    t.true ( !zeptomatch ( "test.{jpg,p*g}", "test.pnt" ) );
    t.true ( zeptomatch ( "test.{jpeg,png}", "test.jpeg" ) );
    t.true ( !zeptomatch ( "test.{jpeg,png}", "test.jpg" ) );
    t.true ( zeptomatch ( "test.{jpeg,png}", "test.png" ) );
    t.true ( zeptomatch ( "test.{jp\\,g,png}", "test.jp,g" ) );
    t.true ( !zeptomatch ( "test.{jp\\,g,png}", "test.jxg" ) );
    t.true ( zeptomatch ( "test/{foo,bar}/baz", "test/foo/baz" ) );
    t.true ( zeptomatch ( "test/{foo,bar}/baz", "test/bar/baz" ) );
    t.true ( !zeptomatch ( "test/{foo,bar}/baz", "test/baz/baz" ) );
    t.true ( zeptomatch ( "test/{foo*,bar*}/baz", "test/foooooo/baz" ) );
    t.true ( zeptomatch ( "test/{foo*,bar*}/baz", "test/barrrrr/baz" ) );
    t.true ( zeptomatch ( "test/{*foo,*bar}/baz", "test/xxxxfoo/baz" ) );
    t.true ( zeptomatch ( "test/{*foo,*bar}/baz", "test/xxxxbar/baz" ) );
    t.true ( zeptomatch ( "test/{foo/**,bar}/baz", "test/bar/baz" ) );
    t.true ( !zeptomatch ( "test/{foo/**,bar}/baz", "test/bar/test/baz" ) );

    t.true ( !zeptomatch ( "*.txt", "some/big/path/to/the/needle.txt" ) );
    t.true ( zeptomatch ( "some/**/needle.{js,tsx,mdx,ts,jsx,txt}", "some/a/bigger/path/to/the/crazy/needle.txt" ) );
    t.true ( zeptomatch ( "some/**/{a,b,c}/**/needle.txt", "some/foo/a/bigger/path/to/the/crazy/needle.txt" ) );
    t.true ( !zeptomatch ( "some/**/{a,b,c}/**/needle.txt", "some/foo/d/bigger/path/to/the/crazy/needle.txt" ) );

    t.true ( zeptomatch ( "a/{a{a,b},b}", "a/aa" ) );
    t.true ( zeptomatch ( "a/{a{a,b},b}", "a/ab" ) );
    t.true ( !zeptomatch ( "a/{a{a,b},b}", "a/ac" ) );
    t.true ( zeptomatch ( "a/{a{a,b},b}", "a/b" ) );
    t.true ( !zeptomatch ( "a/{a{a,b},b}", "a/c" ) );
    t.true ( zeptomatch ( "a/{b,c[}]*}", "a/b" ) );
    t.true ( zeptomatch ( "a/{b,c[}]*}", "a/c}xx" ) );

  });

  it ( 'bash', t => {

    t.true ( !zeptomatch ( "a*", "*" ) );
    t.true ( !zeptomatch ( "a*", "**" ) );
    t.true ( !zeptomatch ( "a*", "\\*" ) );
    t.true ( !zeptomatch ( "a*", "a/*" ) );
    t.true ( !zeptomatch ( "a*", "b" ) );
    t.true ( !zeptomatch ( "a*", "bc" ) );
    t.true ( !zeptomatch ( "a*", "bcd" ) );
    t.true ( !zeptomatch ( "a*", "bdir/" ) );
    t.true ( !zeptomatch ( "a*", "Beware" ) );
    t.true ( zeptomatch ( "a*", "a" ) );
    t.true ( zeptomatch ( "a*", "ab" ) );
    t.true ( zeptomatch ( "a*", "abc" ) );

    t.true ( !zeptomatch ( "\\a*", "*" ) );
    t.true ( !zeptomatch ( "\\a*", "**" ) );
    t.true ( !zeptomatch ( "\\a*", "\\*" ) );

    t.true ( zeptomatch ( "\\a*", "a" ) );
    t.true ( !zeptomatch ( "\\a*", "a/*" ) );
    t.true ( zeptomatch ( "\\a*", "abc" ) );
    t.true ( zeptomatch ( "\\a*", "abd" ) );
    t.true ( zeptomatch ( "\\a*", "abe" ) );
    t.true ( !zeptomatch ( "\\a*", "b" ) );
    t.true ( !zeptomatch ( "\\a*", "bb" ) );
    t.true ( !zeptomatch ( "\\a*", "bcd" ) );
    t.true ( !zeptomatch ( "\\a*", "bdir/" ) );
    t.true ( !zeptomatch ( "\\a*", "Beware" ) );
    t.true ( !zeptomatch ( "\\a*", "c" ) );
    t.true ( !zeptomatch ( "\\a*", "ca" ) );
    t.true ( !zeptomatch ( "\\a*", "cb" ) );
    t.true ( !zeptomatch ( "\\a*", "d" ) );
    t.true ( !zeptomatch ( "\\a*", "dd" ) );
    t.true ( !zeptomatch ( "\\a*", "de" ) );

  });

  it ( 'bash_directories', t => {

    t.true ( !zeptomatch ( "b*/", "*" ) );
    t.true ( !zeptomatch ( "b*/", "**" ) );
    t.true ( !zeptomatch ( "b*/", "\\*" ) );
    t.true ( !zeptomatch ( "b*/", "a" ) );
    t.true ( !zeptomatch ( "b*/", "a/*" ) );
    t.true ( !zeptomatch ( "b*/", "abc" ) );
    t.true ( !zeptomatch ( "b*/", "abd" ) );
    t.true ( !zeptomatch ( "b*/", "abe" ) );
    t.true ( !zeptomatch ( "b*/", "b" ) );
    t.true ( !zeptomatch ( "b*/", "bb" ) );
    t.true ( !zeptomatch ( "b*/", "bcd" ) );
    t.true ( zeptomatch ( "b*/", "bdir/" ) );
    t.true ( !zeptomatch ( "b*/", "Beware" ) );
    t.true ( !zeptomatch ( "b*/", "c" ) );
    t.true ( !zeptomatch ( "b*/", "ca" ) );
    t.true ( !zeptomatch ( "b*/", "cb" ) );
    t.true ( !zeptomatch ( "b*/", "d" ) );
    t.true ( !zeptomatch ( "b*/", "dd" ) );
    t.true ( !zeptomatch ( "b*/", "de" ) );

  });

  it ( 'bash_escaping', t => {

    t.true ( !zeptomatch ( "\\^", "*" ) );
    t.true ( !zeptomatch ( "\\^", "**" ) );
    t.true ( !zeptomatch ( "\\^", "\\*" ) );
    t.true ( !zeptomatch ( "\\^", "a" ) );
    t.true ( !zeptomatch ( "\\^", "a/*" ) );
    t.true ( !zeptomatch ( "\\^", "abc" ) );
    t.true ( !zeptomatch ( "\\^", "abd" ) );
    t.true ( !zeptomatch ( "\\^", "abe" ) );
    t.true ( !zeptomatch ( "\\^", "b" ) );
    t.true ( !zeptomatch ( "\\^", "bb" ) );
    t.true ( !zeptomatch ( "\\^", "bcd" ) );
    t.true ( !zeptomatch ( "\\^", "bdir/" ) );
    t.true ( !zeptomatch ( "\\^", "Beware" ) );
    t.true ( !zeptomatch ( "\\^", "c" ) );
    t.true ( !zeptomatch ( "\\^", "ca" ) );
    t.true ( !zeptomatch ( "\\^", "cb" ) );
    t.true ( !zeptomatch ( "\\^", "d" ) );
    t.true ( !zeptomatch ( "\\^", "dd" ) );
    t.true ( !zeptomatch ( "\\^", "de" ) );

    t.true ( zeptomatch ( "\\*", "*" ) );
    t.true ( !zeptomatch ( "\\*", "\\*" ) ); // Why would this match? https://github.com/micromatch/picomatch/issues/117
    t.true ( !zeptomatch ( "\\*", "**" ) );
    t.true ( !zeptomatch ( "\\*", "a" ) );
    t.true ( !zeptomatch ( "\\*", "a/*" ) );
    t.true ( !zeptomatch ( "\\*", "abc" ) );
    t.true ( !zeptomatch ( "\\*", "abd" ) );
    t.true ( !zeptomatch ( "\\*", "abe" ) );
    t.true ( !zeptomatch ( "\\*", "b" ) );
    t.true ( !zeptomatch ( "\\*", "bb" ) );
    t.true ( !zeptomatch ( "\\*", "bcd" ) );
    t.true ( !zeptomatch ( "\\*", "bdir/" ) );
    t.true ( !zeptomatch ( "\\*", "Beware" ) );
    t.true ( !zeptomatch ( "\\*", "c" ) );
    t.true ( !zeptomatch ( "\\*", "ca" ) );
    t.true ( !zeptomatch ( "\\*", "cb" ) );
    t.true ( !zeptomatch ( "\\*", "d" ) );
    t.true ( !zeptomatch ( "\\*", "dd" ) );
    t.true ( !zeptomatch ( "\\*", "de" ) );

    t.true ( !zeptomatch ( "a\\*", "*" ) );
    t.true ( !zeptomatch ( "a\\*", "**" ) );
    t.true ( !zeptomatch ( "a\\*", "\\*" ) );
    t.true ( !zeptomatch ( "a\\*", "a" ) );
    t.true ( !zeptomatch ( "a\\*", "a/*" ) );
    t.true ( !zeptomatch ( "a\\*", "abc" ) );
    t.true ( !zeptomatch ( "a\\*", "abd" ) );
    t.true ( !zeptomatch ( "a\\*", "abe" ) );
    t.true ( !zeptomatch ( "a\\*", "b" ) );
    t.true ( !zeptomatch ( "a\\*", "bb" ) );
    t.true ( !zeptomatch ( "a\\*", "bcd" ) );
    t.true ( !zeptomatch ( "a\\*", "bdir/" ) );
    t.true ( !zeptomatch ( "a\\*", "Beware" ) );
    t.true ( !zeptomatch ( "a\\*", "c" ) );
    t.true ( !zeptomatch ( "a\\*", "ca" ) );
    t.true ( !zeptomatch ( "a\\*", "cb" ) );
    t.true ( !zeptomatch ( "a\\*", "d" ) );
    t.true ( !zeptomatch ( "a\\*", "dd" ) );
    t.true ( !zeptomatch ( "a\\*", "de" ) );

    t.true ( zeptomatch ( "*q*", "aqa" ) );
    t.true ( zeptomatch ( "*q*", "aaqaa" ) );
    t.true ( !zeptomatch ( "*q*", "*" ) );
    t.true ( !zeptomatch ( "*q*", "**" ) );
    t.true ( !zeptomatch ( "*q*", "\\*" ) );
    t.true ( !zeptomatch ( "*q*", "a" ) );
    t.true ( !zeptomatch ( "*q*", "a/*" ) );
    t.true ( !zeptomatch ( "*q*", "abc" ) );
    t.true ( !zeptomatch ( "*q*", "abd" ) );
    t.true ( !zeptomatch ( "*q*", "abe" ) );
    t.true ( !zeptomatch ( "*q*", "b" ) );
    t.true ( !zeptomatch ( "*q*", "bb" ) );
    t.true ( !zeptomatch ( "*q*", "bcd" ) );
    t.true ( !zeptomatch ( "*q*", "bdir/" ) );
    t.true ( !zeptomatch ( "*q*", "Beware" ) );
    t.true ( !zeptomatch ( "*q*", "c" ) );
    t.true ( !zeptomatch ( "*q*", "ca" ) );
    t.true ( !zeptomatch ( "*q*", "cb" ) );
    t.true ( !zeptomatch ( "*q*", "d" ) );
    t.true ( !zeptomatch ( "*q*", "dd" ) );
    t.true ( !zeptomatch ( "*q*", "de" ) );

    t.true ( zeptomatch ( "\\**", "*" ) );
    t.true ( zeptomatch ( "\\**", "**" ) );
    t.true ( !zeptomatch ( "\\**", "\\*" ) );
    t.true ( !zeptomatch ( "\\**", "a" ) );
    t.true ( !zeptomatch ( "\\**", "a/*" ) );
    t.true ( !zeptomatch ( "\\**", "abc" ) );
    t.true ( !zeptomatch ( "\\**", "abd" ) );
    t.true ( !zeptomatch ( "\\**", "abe" ) );
    t.true ( !zeptomatch ( "\\**", "b" ) );
    t.true ( !zeptomatch ( "\\**", "bb" ) );
    t.true ( !zeptomatch ( "\\**", "bcd" ) );
    t.true ( !zeptomatch ( "\\**", "bdir/" ) );
    t.true ( !zeptomatch ( "\\**", "Beware" ) );
    t.true ( !zeptomatch ( "\\**", "c" ) );
    t.true ( !zeptomatch ( "\\**", "ca" ) );
    t.true ( !zeptomatch ( "\\**", "cb" ) );
    t.true ( !zeptomatch ( "\\**", "d" ) );
    t.true ( !zeptomatch ( "\\**", "dd" ) );
    t.true ( !zeptomatch ( "\\**", "de" ) );

  });

  it ( 'bash_classes', t => {

    t.true ( !zeptomatch ( "a*[^c]", "*" ) );
    t.true ( !zeptomatch ( "a*[^c]", "**" ) );
    t.true ( !zeptomatch ( "a*[^c]", "\\*" ) );
    t.true ( !zeptomatch ( "a*[^c]", "a" ) );
    t.true ( !zeptomatch ( "a*[^c]", "a/*" ) );
    t.true ( !zeptomatch ( "a*[^c]", "abc" ) );
    t.true ( zeptomatch ( "a*[^c]", "abd" ) );
    t.true ( zeptomatch ( "a*[^c]", "abe" ) );
    t.true ( !zeptomatch ( "a*[^c]", "b" ) );
    t.true ( !zeptomatch ( "a*[^c]", "bb" ) );
    t.true ( !zeptomatch ( "a*[^c]", "bcd" ) );
    t.true ( !zeptomatch ( "a*[^c]", "bdir/" ) );
    t.true ( !zeptomatch ( "a*[^c]", "Beware" ) );
    t.true ( !zeptomatch ( "a*[^c]", "c" ) );
    t.true ( !zeptomatch ( "a*[^c]", "ca" ) );
    t.true ( !zeptomatch ( "a*[^c]", "cb" ) );
    t.true ( !zeptomatch ( "a*[^c]", "d" ) );
    t.true ( !zeptomatch ( "a*[^c]", "dd" ) );
    t.true ( !zeptomatch ( "a*[^c]", "de" ) );
    t.true ( !zeptomatch ( "a*[^c]", "baz" ) );
    t.true ( !zeptomatch ( "a*[^c]", "bzz" ) );
    t.true ( !zeptomatch ( "a*[^c]", "BZZ" ) );
    t.true ( !zeptomatch ( "a*[^c]", "beware" ) );
    t.true ( !zeptomatch ( "a*[^c]", "BewAre" ) );

    t.true ( zeptomatch ( "a[X-]b", "a-b" ) );
    t.true ( zeptomatch ( "a[X-]b", "aXb" ) );

    t.true ( !zeptomatch ( "[a-y]*[^c]", "*" ) );
    t.true ( zeptomatch ( "[a-y]*[^c]", "a*" ) );
    t.true ( !zeptomatch ( "[a-y]*[^c]", "**" ) );
    t.true ( !zeptomatch ( "[a-y]*[^c]", "\\*" ) );
    t.true ( !zeptomatch ( "[a-y]*[^c]", "a" ) );
    t.true ( zeptomatch ( "[a-y]*[^c]", "a123b" ) );
    t.true ( !zeptomatch ( "[a-y]*[^c]", "a123c" ) );
    t.true ( zeptomatch ( "[a-y]*[^c]", "ab" ) );
    t.true ( !zeptomatch ( "[a-y]*[^c]", "a/*" ) );
    t.true ( !zeptomatch ( "[a-y]*[^c]", "abc" ) );
    t.true ( zeptomatch ( "[a-y]*[^c]", "abd" ) );
    t.true ( zeptomatch ( "[a-y]*[^c]", "abe" ) );
    t.true ( !zeptomatch ( "[a-y]*[^c]", "b" ) );
    t.true ( zeptomatch ( "[a-y]*[^c]", "bd" ) );
    t.true ( zeptomatch ( "[a-y]*[^c]", "bb" ) );
    t.true ( zeptomatch ( "[a-y]*[^c]", "bcd" ) );
    t.true ( zeptomatch ( "[a-y]*[^c]", "bdir/" ) );
    t.true ( !zeptomatch ( "[a-y]*[^c]", "Beware" ) );
    t.true ( !zeptomatch ( "[a-y]*[^c]", "c" ) );
    t.true ( zeptomatch ( "[a-y]*[^c]", "ca" ) );
    t.true ( zeptomatch ( "[a-y]*[^c]", "cb" ) );
    t.true ( !zeptomatch ( "[a-y]*[^c]", "d" ) );
    t.true ( zeptomatch ( "[a-y]*[^c]", "dd" ) );
    t.true ( zeptomatch ( "[a-y]*[^c]", "dd" ) );
    t.true ( zeptomatch ( "[a-y]*[^c]", "dd" ) );
    t.true ( zeptomatch ( "[a-y]*[^c]", "de" ) );
    t.true ( zeptomatch ( "[a-y]*[^c]", "baz" ) );
    t.true ( zeptomatch ( "[a-y]*[^c]", "bzz" ) );
    t.true ( zeptomatch ( "[a-y]*[^c]", "bzz" ) );
    t.true ( !zeptomatch ( "bzz", "[a-y]*[^c]" ) );
    t.true ( !zeptomatch ( "[a-y]*[^c]", "BZZ" ) );
    t.true ( zeptomatch ( "[a-y]*[^c]", "beware" ) );
    t.true ( !zeptomatch ( "[a-y]*[^c]", "BewAre" ) );

    t.true ( zeptomatch ( "a\\*b/*", "a*b/ooo" ) );
    t.true ( zeptomatch ( "a\\*?/*", "a*b/ooo" ) );

    t.true ( !zeptomatch ( "a[b]c", "*" ) );
    t.true ( !zeptomatch ( "a[b]c", "**" ) );
    t.true ( !zeptomatch ( "a[b]c", "\\*" ) );
    t.true ( !zeptomatch ( "a[b]c", "a" ) );
    t.true ( !zeptomatch ( "a[b]c", "a/*" ) );
    t.true ( zeptomatch ( "a[b]c", "abc" ) );
    t.true ( !zeptomatch ( "a[b]c", "abd" ) );
    t.true ( !zeptomatch ( "a[b]c", "abe" ) );
    t.true ( !zeptomatch ( "a[b]c", "b" ) );
    t.true ( !zeptomatch ( "a[b]c", "bb" ) );
    t.true ( !zeptomatch ( "a[b]c", "bcd" ) );
    t.true ( !zeptomatch ( "a[b]c", "bdir/" ) );
    t.true ( !zeptomatch ( "a[b]c", "Beware" ) );
    t.true ( !zeptomatch ( "a[b]c", "c" ) );
    t.true ( !zeptomatch ( "a[b]c", "ca" ) );
    t.true ( !zeptomatch ( "a[b]c", "cb" ) );
    t.true ( !zeptomatch ( "a[b]c", "d" ) );
    t.true ( !zeptomatch ( "a[b]c", "dd" ) );
    t.true ( !zeptomatch ( "a[b]c", "de" ) );
    t.true ( !zeptomatch ( "a[b]c", "baz" ) );
    t.true ( !zeptomatch ( "a[b]c", "bzz" ) );
    t.true ( !zeptomatch ( "a[b]c", "BZZ" ) );
    t.true ( !zeptomatch ( "a[b]c", "beware" ) );
    t.true ( !zeptomatch ( "a[b]c", "BewAre" ) );

    t.true ( !zeptomatch ( "a[\"b\"]c", "*" ) );
    t.true ( !zeptomatch ( "a[\"b\"]c", "**" ) );
    t.true ( !zeptomatch ( "a[\"b\"]c", "\\*" ) );
    t.true ( !zeptomatch ( "a[\"b\"]c", "a" ) );
    t.true ( !zeptomatch ( "a[\"b\"]c", "a/*" ) );
    t.true ( zeptomatch ( "a[\"b\"]c", "abc" ) );
    t.true ( !zeptomatch ( "a[\"b\"]c", "abd" ) );
    t.true ( !zeptomatch ( "a[\"b\"]c", "abe" ) );
    t.true ( !zeptomatch ( "a[\"b\"]c", "b" ) );
    t.true ( !zeptomatch ( "a[\"b\"]c", "bb" ) );
    t.true ( !zeptomatch ( "a[\"b\"]c", "bcd" ) );
    t.true ( !zeptomatch ( "a[\"b\"]c", "bdir/" ) );
    t.true ( !zeptomatch ( "a[\"b\"]c", "Beware" ) );
    t.true ( !zeptomatch ( "a[\"b\"]c", "c" ) );
    t.true ( !zeptomatch ( "a[\"b\"]c", "ca" ) );
    t.true ( !zeptomatch ( "a[\"b\"]c", "cb" ) );
    t.true ( !zeptomatch ( "a[\"b\"]c", "d" ) );
    t.true ( !zeptomatch ( "a[\"b\"]c", "dd" ) );
    t.true ( !zeptomatch ( "a[\"b\"]c", "de" ) );
    t.true ( !zeptomatch ( "a[\"b\"]c", "baz" ) );
    t.true ( !zeptomatch ( "a[\"b\"]c", "bzz" ) );
    t.true ( !zeptomatch ( "a[\"b\"]c", "BZZ" ) );
    t.true ( !zeptomatch ( "a[\"b\"]c", "beware" ) );
    t.true ( !zeptomatch ( "a[\"b\"]c", "BewAre" ) );

    t.true ( !zeptomatch ( "a[\\\\b]c", "*" ) );
    t.true ( !zeptomatch ( "a[\\\\b]c", "**" ) );
    t.true ( !zeptomatch ( "a[\\\\b]c", "\\*" ) );
    t.true ( !zeptomatch ( "a[\\\\b]c", "a" ) );
    t.true ( !zeptomatch ( "a[\\\\b]c", "a/*" ) );
    t.true ( zeptomatch ( "a[\\\\b]c", "abc" ) );
    t.true ( !zeptomatch ( "a[\\\\b]c", "abd" ) );
    t.true ( !zeptomatch ( "a[\\\\b]c", "abe" ) );
    t.true ( !zeptomatch ( "a[\\\\b]c", "b" ) );
    t.true ( !zeptomatch ( "a[\\\\b]c", "bb" ) );
    t.true ( !zeptomatch ( "a[\\\\b]c", "bcd" ) );
    t.true ( !zeptomatch ( "a[\\\\b]c", "bdir/" ) );
    t.true ( !zeptomatch ( "a[\\\\b]c", "Beware" ) );
    t.true ( !zeptomatch ( "a[\\\\b]c", "c" ) );
    t.true ( !zeptomatch ( "a[\\\\b]c", "ca" ) );
    t.true ( !zeptomatch ( "a[\\\\b]c", "cb" ) );
    t.true ( !zeptomatch ( "a[\\\\b]c", "d" ) );
    t.true ( !zeptomatch ( "a[\\\\b]c", "dd" ) );
    t.true ( !zeptomatch ( "a[\\\\b]c", "de" ) );
    t.true ( !zeptomatch ( "a[\\\\b]c", "baz" ) );
    t.true ( !zeptomatch ( "a[\\\\b]c", "bzz" ) );
    t.true ( !zeptomatch ( "a[\\\\b]c", "BZZ" ) );
    t.true ( !zeptomatch ( "a[\\\\b]c", "beware" ) );
    t.true ( !zeptomatch ( "a[\\\\b]c", "BewAre" ) );

    t.true ( !zeptomatch ( "a[\\b]c", "*" ) );
    t.true ( !zeptomatch ( "a[\\b]c", "**" ) );
    t.true ( !zeptomatch ( "a[\\b]c", "\\*" ) );
    t.true ( !zeptomatch ( "a[\\b]c", "a" ) );
    t.true ( !zeptomatch ( "a[\\b]c", "a/*" ) );
    t.true ( !zeptomatch ( "a[\\b]c", "abc" ) );
    t.true ( !zeptomatch ( "a[\\b]c", "abd" ) );
    t.true ( !zeptomatch ( "a[\\b]c", "abe" ) );
    t.true ( !zeptomatch ( "a[\\b]c", "b" ) );
    t.true ( !zeptomatch ( "a[\\b]c", "bb" ) );
    t.true ( !zeptomatch ( "a[\\b]c", "bcd" ) );
    t.true ( !zeptomatch ( "a[\\b]c", "bdir/" ) );
    t.true ( !zeptomatch ( "a[\\b]c", "Beware" ) );
    t.true ( !zeptomatch ( "a[\\b]c", "c" ) );
    t.true ( !zeptomatch ( "a[\\b]c", "ca" ) );
    t.true ( !zeptomatch ( "a[\\b]c", "cb" ) );
    t.true ( !zeptomatch ( "a[\\b]c", "d" ) );
    t.true ( !zeptomatch ( "a[\\b]c", "dd" ) );
    t.true ( !zeptomatch ( "a[\\b]c", "de" ) );
    t.true ( !zeptomatch ( "a[\\b]c", "baz" ) );
    t.true ( !zeptomatch ( "a[\\b]c", "bzz" ) );
    t.true ( !zeptomatch ( "a[\\b]c", "BZZ" ) );
    t.true ( !zeptomatch ( "a[\\b]c", "beware" ) );
    t.true ( !zeptomatch ( "a[\\b]c", "BewAre" ) );

    t.true ( !zeptomatch ( "a[b-d]c", "*" ) );
    t.true ( !zeptomatch ( "a[b-d]c", "**" ) );
    t.true ( !zeptomatch ( "a[b-d]c", "\\*" ) );
    t.true ( !zeptomatch ( "a[b-d]c", "a" ) );
    t.true ( !zeptomatch ( "a[b-d]c", "a/*" ) );
    t.true ( zeptomatch ( "a[b-d]c", "abc" ) );
    t.true ( !zeptomatch ( "a[b-d]c", "abd" ) );
    t.true ( !zeptomatch ( "a[b-d]c", "abe" ) );
    t.true ( !zeptomatch ( "a[b-d]c", "b" ) );
    t.true ( !zeptomatch ( "a[b-d]c", "bb" ) );
    t.true ( !zeptomatch ( "a[b-d]c", "bcd" ) );
    t.true ( !zeptomatch ( "a[b-d]c", "bdir/" ) );
    t.true ( !zeptomatch ( "a[b-d]c", "Beware" ) );
    t.true ( !zeptomatch ( "a[b-d]c", "c" ) );
    t.true ( !zeptomatch ( "a[b-d]c", "ca" ) );
    t.true ( !zeptomatch ( "a[b-d]c", "cb" ) );
    t.true ( !zeptomatch ( "a[b-d]c", "d" ) );
    t.true ( !zeptomatch ( "a[b-d]c", "dd" ) );
    t.true ( !zeptomatch ( "a[b-d]c", "de" ) );
    t.true ( !zeptomatch ( "a[b-d]c", "baz" ) );
    t.true ( !zeptomatch ( "a[b-d]c", "bzz" ) );
    t.true ( !zeptomatch ( "a[b-d]c", "BZZ" ) );
    t.true ( !zeptomatch ( "a[b-d]c", "beware" ) );
    t.true ( !zeptomatch ( "a[b-d]c", "BewAre" ) );

    t.true ( !zeptomatch ( "a?c", "*" ) );
    t.true ( !zeptomatch ( "a?c", "**" ) );
    t.true ( !zeptomatch ( "a?c", "\\*" ) );
    t.true ( !zeptomatch ( "a?c", "a" ) );
    t.true ( !zeptomatch ( "a?c", "a/*" ) );
    t.true ( zeptomatch ( "a?c", "abc" ) );
    t.true ( !zeptomatch ( "a?c", "abd" ) );
    t.true ( !zeptomatch ( "a?c", "abe" ) );
    t.true ( !zeptomatch ( "a?c", "b" ) );
    t.true ( !zeptomatch ( "a?c", "bb" ) );
    t.true ( !zeptomatch ( "a?c", "bcd" ) );
    t.true ( !zeptomatch ( "a?c", "bdir/" ) );
    t.true ( !zeptomatch ( "a?c", "Beware" ) );
    t.true ( !zeptomatch ( "a?c", "c" ) );
    t.true ( !zeptomatch ( "a?c", "ca" ) );
    t.true ( !zeptomatch ( "a?c", "cb" ) );
    t.true ( !zeptomatch ( "a?c", "d" ) );
    t.true ( !zeptomatch ( "a?c", "dd" ) );
    t.true ( !zeptomatch ( "a?c", "de" ) );
    t.true ( !zeptomatch ( "a?c", "baz" ) );
    t.true ( !zeptomatch ( "a?c", "bzz" ) );
    t.true ( !zeptomatch ( "a?c", "BZZ" ) );
    t.true ( !zeptomatch ( "a?c", "beware" ) );
    t.true ( !zeptomatch ( "a?c", "BewAre" ) );

    t.true ( zeptomatch ( "*/man*/bash.*", "man/man1/bash.1" ) );

    t.true ( zeptomatch ( "[^a-c]*", "*" ) );
    t.true ( zeptomatch ( "[^a-c]*", "**" ) );
    t.true ( !zeptomatch ( "[^a-c]*", "a" ) );
    t.true ( !zeptomatch ( "[^a-c]*", "a/*" ) );
    t.true ( !zeptomatch ( "[^a-c]*", "abc" ) );
    t.true ( !zeptomatch ( "[^a-c]*", "abd" ) );
    t.true ( !zeptomatch ( "[^a-c]*", "abe" ) );
    t.true ( !zeptomatch ( "[^a-c]*", "b" ) );
    t.true ( !zeptomatch ( "[^a-c]*", "bb" ) );
    t.true ( !zeptomatch ( "[^a-c]*", "bcd" ) );
    t.true ( !zeptomatch ( "[^a-c]*", "bdir/" ) );
    t.true ( zeptomatch ( "[^a-c]*", "Beware" ) );
    t.true ( zeptomatch ( "[^a-c]*", "Beware" ) );
    t.true ( !zeptomatch ( "[^a-c]*", "c" ) );
    t.true ( !zeptomatch ( "[^a-c]*", "ca" ) );
    t.true ( !zeptomatch ( "[^a-c]*", "cb" ) );
    t.true ( zeptomatch ( "[^a-c]*", "d" ) );
    t.true ( zeptomatch ( "[^a-c]*", "dd" ) );
    t.true ( zeptomatch ( "[^a-c]*", "de" ) );
    t.true ( !zeptomatch ( "[^a-c]*", "baz" ) );
    t.true ( !zeptomatch ( "[^a-c]*", "bzz" ) );
    t.true ( zeptomatch ( "[^a-c]*", "BZZ" ) );
    t.true ( !zeptomatch ( "[^a-c]*", "beware" ) );
    t.true ( zeptomatch ( "[^a-c]*", "BewAre" ) );

  });

  it ( 'bash_wildmatch', t => {

    t.true ( !zeptomatch ( "a[]-]b", "aab" ) );
    t.true ( !zeptomatch ( "[ten]", "ten" ) );
    t.true ( zeptomatch ( "]", "]" ) );
    // t.true ( zeptomatch ( "a[]-]b", "a-b" ) );
    // t.true ( zeptomatch ( "a[]-]b", "a]b" ) );
    // t.true ( zeptomatch ( "a[]]b", "a]b" ) );
    // t.true ( zeptomatch ( "a[\\]a\\-]b", "aab" ) );
    t.true ( zeptomatch ( "t[a-g]n", "ten" ) );
    t.true ( zeptomatch ( "t[^a-g]n", "ton" ) );

  });

  it ( 'bash_slashmatch', t => {

    t.true ( !zeptomatch ( "f[^eiu][^eiu][^eiu][^eiu][^eiu]r", "foo/bar" ) );
    t.true ( zeptomatch ( "foo[/]bar", "foo/bar" ) );
    t.true ( zeptomatch ( "f[^eiu][^eiu][^eiu][^eiu][^eiu]r", "foo-bar" ) );

  });

  it ( 'bash_extra_stars', t => {

    t.true ( !zeptomatch ( "a**c", "bbc" ) );
    t.true ( zeptomatch ( "a**c", "abc" ) );
    t.true ( !zeptomatch ( "a**c", "bbd" ) );

    t.true ( !zeptomatch ( "a***c", "bbc" ) );
    t.true ( zeptomatch ( "a***c", "abc" ) );
    t.true ( !zeptomatch ( "a***c", "bbd" ) );

    t.true ( !zeptomatch ( "a*****?c", "bbc" ) );
    t.true ( zeptomatch ( "a*****?c", "abc" ) );
    t.true ( !zeptomatch ( "a*****?c", "bbc" ) );

    t.true ( zeptomatch ( "?*****??", "bbc" ) );
    t.true ( zeptomatch ( "?*****??", "abc" ) );

    t.true ( zeptomatch ( "*****??", "bbc" ) );
    t.true ( zeptomatch ( "*****??", "abc" ) );

    t.true ( zeptomatch ( "?*****?c", "bbc" ) );
    t.true ( zeptomatch ( "?*****?c", "abc" ) );

    t.true ( zeptomatch ( "?***?****c", "bbc" ) );
    t.true ( zeptomatch ( "?***?****c", "abc" ) );
    t.true ( !zeptomatch ( "?***?****c", "bbd" ) );

    t.true ( zeptomatch ( "?***?****?", "bbc" ) );
    t.true ( zeptomatch ( "?***?****?", "abc" ) );

    t.true ( zeptomatch ( "?***?****", "bbc" ) );
    t.true ( zeptomatch ( "?***?****", "abc" ) );

    t.true ( zeptomatch ( "*******c", "bbc" ) );
    t.true ( zeptomatch ( "*******c", "abc" ) );

    t.true ( zeptomatch ( "*******?", "bbc" ) );
    t.true ( zeptomatch ( "*******?", "abc" ) );

    t.true ( zeptomatch ( "a*cd**?**??k", "abcdecdhjk" ) );
    t.true ( zeptomatch ( "a**?**cd**?**??k", "abcdecdhjk" ) );
    t.true ( zeptomatch ( "a**?**cd**?**??k***", "abcdecdhjk" ) );
    t.true ( zeptomatch ( "a**?**cd**?**??***k", "abcdecdhjk" ) );
    t.true ( zeptomatch ( "a**?**cd**?**??***k**", "abcdecdhjk" ) );
    t.true ( zeptomatch ( "a****c**?**??*****", "abcdecdhjk" ) );

  });

  it ( 'stars', t => {

    t.true ( !zeptomatch ( "*.js", "a/b/c/z.js" ) );
    t.true ( !zeptomatch ( "*.js", "a/b/z.js" ) );
    t.true ( !zeptomatch ( "*.js", "a/z.js" ) );
    t.true ( zeptomatch ( "*.js", "z.js" ) );

    t.true ( zeptomatch ( "*/*", "a/.ab" ) );
    t.true ( zeptomatch ( "*", ".ab" ) );

    t.true ( zeptomatch ( "z*.js", "z.js" ) );
    t.true ( zeptomatch ( "*/*", "a/z" ) );
    t.true ( zeptomatch ( "*/z*.js", "a/z.js" ) );
    t.true ( zeptomatch ( "a/z*.js", "a/z.js" ) );

    t.true ( zeptomatch ( "*", "ab" ) );
    t.true ( zeptomatch ( "*", "abc" ) );

    t.true ( !zeptomatch ( "f*", "bar" ) );
    t.true ( !zeptomatch ( "*r", "foo" ) );
    t.true ( !zeptomatch ( "b*", "foo" ) );
    t.true ( !zeptomatch ( "*", "foo/bar" ) );
    t.true ( zeptomatch ( "*c", "abc" ) );
    t.true ( zeptomatch ( "a*", "abc" ) );
    t.true ( zeptomatch ( "a*c", "abc" ) );
    t.true ( zeptomatch ( "*r", "bar" ) );
    t.true ( zeptomatch ( "b*", "bar" ) );
    t.true ( zeptomatch ( "f*", "foo" ) );

    t.true ( zeptomatch ( "*abc*", "one abc two" ) );
    t.true ( zeptomatch ( "a*b", "a         b" ) );

    t.true ( !zeptomatch ( "*a*", "foo" ) );
    t.true ( zeptomatch ( "*a*", "bar" ) );
    t.true ( zeptomatch ( "*abc*", "oneabctwo" ) );
    t.true ( !zeptomatch ( "*-bc-*", "a-b.c-d" ) );
    t.true ( zeptomatch ( "*-*.*-*", "a-b.c-d" ) );
    t.true ( zeptomatch ( "*-b*c-*", "a-b.c-d" ) );
    t.true ( zeptomatch ( "*-b.c-*", "a-b.c-d" ) );
    t.true ( zeptomatch ( "*.*", "a-b.c-d" ) );
    t.true ( zeptomatch ( "*.*-*", "a-b.c-d" ) );
    t.true ( zeptomatch ( "*.*-d", "a-b.c-d" ) );
    t.true ( zeptomatch ( "*.c-*", "a-b.c-d" ) );
    t.true ( zeptomatch ( "*b.*d", "a-b.c-d" ) );
    t.true ( zeptomatch ( "a*.c*", "a-b.c-d" ) );
    t.true ( zeptomatch ( "a-*.*-d", "a-b.c-d" ) );
    t.true ( zeptomatch ( "*.*", "a.b" ) );
    t.true ( zeptomatch ( "*.b", "a.b" ) );
    t.true ( zeptomatch ( "a.*", "a.b" ) );
    t.true ( zeptomatch ( "a.b", "a.b" ) );

    t.true ( !zeptomatch ( "**-bc-**", "a-b.c-d" ) );
    t.true ( zeptomatch ( "**-**.**-**", "a-b.c-d" ) );
    t.true ( zeptomatch ( "**-b**c-**", "a-b.c-d" ) );
    t.true ( zeptomatch ( "**-b.c-**", "a-b.c-d" ) );
    t.true ( zeptomatch ( "**.**", "a-b.c-d" ) );
    t.true ( zeptomatch ( "**.**-**", "a-b.c-d" ) );
    t.true ( zeptomatch ( "**.**-d", "a-b.c-d" ) );
    t.true ( zeptomatch ( "**.c-**", "a-b.c-d" ) );
    t.true ( zeptomatch ( "**b.**d", "a-b.c-d" ) );
    t.true ( zeptomatch ( "a**.c**", "a-b.c-d" ) );
    t.true ( zeptomatch ( "a-**.**-d", "a-b.c-d" ) );
    t.true ( zeptomatch ( "**.**", "a.b" ) );
    t.true ( zeptomatch ( "**.b", "a.b" ) );
    t.true ( zeptomatch ( "a.**", "a.b" ) );
    t.true ( zeptomatch ( "a.b", "a.b" ) );

    t.true ( zeptomatch ( "*/*", "/ab" ) );
    t.true ( zeptomatch ( ".", "." ) );
    t.true ( !zeptomatch ( "a/", "a/.b" ) );
    t.true ( zeptomatch ( "/*", "/ab" ) );
    t.true ( zeptomatch ( "/??", "/ab" ) );
    t.true ( zeptomatch ( "/?b", "/ab" ) );
    t.true ( zeptomatch ( "/*", "/cd" ) );
    t.true ( zeptomatch ( "a", "a" ) );
    t.true ( zeptomatch ( "a/.*", "a/.b" ) );
    t.true ( zeptomatch ( "?/?", "a/b" ) );
    t.true ( zeptomatch ( "a/**/j/**/z/*.md", "a/b/c/d/e/j/n/p/o/z/c.md" ) );
    t.true ( zeptomatch ( "a/**/z/*.md", "a/b/c/d/e/z/c.md" ) );
    t.true ( zeptomatch ( "a/b/c/*.md", "a/b/c/xyz.md" ) );
    t.true ( zeptomatch ( "a/b/c/*.md", "a/b/c/xyz.md" ) );
    t.true ( zeptomatch ( "a/*/z/.a", "a/b/z/.a" ) );
    t.true ( !zeptomatch ( "bz", "a/b/z/.a" ) );
    t.true ( zeptomatch ( "a/**/c/*.md", "a/bb.bb/aa/b.b/aa/c/xyz.md" ) );
    t.true ( zeptomatch ( "a/**/c/*.md", "a/bb.bb/aa/bb/aa/c/xyz.md" ) );
    t.true ( zeptomatch ( "a/*/c/*.md", "a/bb.bb/c/xyz.md" ) );
    t.true ( zeptomatch ( "a/*/c/*.md", "a/bb/c/xyz.md" ) );
    t.true ( zeptomatch ( "a/*/c/*.md", "a/bbbb/c/xyz.md" ) );
    t.true ( zeptomatch ( "*", "aaa" ) );
    t.true ( zeptomatch ( "*", "ab" ) );
    t.true ( zeptomatch ( "ab", "ab" ) );

    t.true ( !zeptomatch ( "*/*/*", "aaa" ) );
    t.true ( !zeptomatch ( "*/*/*", "aaa/bb/aa/rr" ) );
    t.true ( !zeptomatch ( "aaa*", "aaa/bba/ccc" ) );
    t.true ( !zeptomatch ( "aaa**", "aaa/bba/ccc" ) );
    t.true ( !zeptomatch ( "aaa/*", "aaa/bba/ccc" ) );
    t.true ( !zeptomatch ( "aaa/*ccc", "aaa/bba/ccc" ) );
    t.true ( !zeptomatch ( "aaa/*z", "aaa/bba/ccc" ) );
    t.true ( !zeptomatch ( "*/*/*", "aaa/bbb" ) );
    t.true ( !zeptomatch ( "*/*jk*/*i", "ab/zzz/ejkl/hi" ) );
    t.true ( zeptomatch ( "*/*/*", "aaa/bba/ccc" ) );
    t.true ( zeptomatch ( "aaa/**", "aaa/bba/ccc" ) );
    t.true ( zeptomatch ( "aaa/*", "aaa/bbb" ) );
    t.true ( zeptomatch ( "*/*z*/*/*i", "ab/zzz/ejkl/hi" ) );
    t.true ( zeptomatch ( "*j*i", "abzzzejklhi" ) );

    t.true ( zeptomatch ( "*", "a" ) );
    t.true ( zeptomatch ( "*", "b" ) );
    t.true ( !zeptomatch ( "*", "a/a" ) );
    t.true ( !zeptomatch ( "*", "a/a/a" ) );
    t.true ( !zeptomatch ( "*", "a/a/b" ) );
    t.true ( !zeptomatch ( "*", "a/a/a/a" ) );
    t.true ( !zeptomatch ( "*", "a/a/a/a/a" ) );

    t.true ( !zeptomatch ( "*/*", "a" ) );
    t.true ( zeptomatch ( "*/*", "a/a" ) );
    t.true ( !zeptomatch ( "*/*", "a/a/a" ) );

    t.true ( !zeptomatch ( "*/*/*", "a" ) );
    t.true ( !zeptomatch ( "*/*/*", "a/a" ) );
    t.true ( zeptomatch ( "*/*/*", "a/a/a" ) );
    t.true ( !zeptomatch ( "*/*/*", "a/a/a/a" ) );

    t.true ( !zeptomatch ( "*/*/*/*", "a" ) );
    t.true ( !zeptomatch ( "*/*/*/*", "a/a" ) );
    t.true ( !zeptomatch ( "*/*/*/*", "a/a/a" ) );
    t.true ( zeptomatch ( "*/*/*/*", "a/a/a/a" ) );
    t.true ( !zeptomatch ( "*/*/*/*", "a/a/a/a/a" ) );

    t.true ( !zeptomatch ( "*/*/*/*/*", "a" ) );
    t.true ( !zeptomatch ( "*/*/*/*/*", "a/a" ) );
    t.true ( !zeptomatch ( "*/*/*/*/*", "a/a/a" ) );
    t.true ( !zeptomatch ( "*/*/*/*/*", "a/a/b" ) );
    t.true ( !zeptomatch ( "*/*/*/*/*", "a/a/a/a" ) );
    t.true ( zeptomatch ( "*/*/*/*/*", "a/a/a/a/a" ) );
    t.true ( !zeptomatch ( "*/*/*/*/*", "a/a/a/a/a/a" ) );

    t.true ( !zeptomatch ( "a/*", "a" ) );
    t.true ( zeptomatch ( "a/*", "a/a" ) );
    t.true ( !zeptomatch ( "a/*", "a/a/a" ) );
    t.true ( !zeptomatch ( "a/*", "a/a/a/a" ) );
    t.true ( !zeptomatch ( "a/*", "a/a/a/a/a" ) );

    t.true ( !zeptomatch ( "a/*/*", "a" ) );
    t.true ( !zeptomatch ( "a/*/*", "a/a" ) );
    t.true ( zeptomatch ( "a/*/*", "a/a/a" ) );
    t.true ( !zeptomatch ( "a/*/*", "b/a/a" ) );
    t.true ( !zeptomatch ( "a/*/*", "a/a/a/a" ) );
    t.true ( !zeptomatch ( "a/*/*", "a/a/a/a/a" ) );

    t.true ( !zeptomatch ( "a/*/*/*", "a" ) );
    t.true ( !zeptomatch ( "a/*/*/*", "a/a" ) );
    t.true ( !zeptomatch ( "a/*/*/*", "a/a/a" ) );
    t.true ( zeptomatch ( "a/*/*/*", "a/a/a/a" ) );
    t.true ( !zeptomatch ( "a/*/*/*", "a/a/a/a/a" ) );

    t.true ( !zeptomatch ( "a/*/*/*/*", "a" ) );
    t.true ( !zeptomatch ( "a/*/*/*/*", "a/a" ) );
    t.true ( !zeptomatch ( "a/*/*/*/*", "a/a/a" ) );
    t.true ( !zeptomatch ( "a/*/*/*/*", "a/a/b" ) );
    t.true ( !zeptomatch ( "a/*/*/*/*", "a/a/a/a" ) );
    t.true ( zeptomatch ( "a/*/*/*/*", "a/a/a/a/a" ) );

    t.true ( !zeptomatch ( "a/*/a", "a" ) );
    t.true ( !zeptomatch ( "a/*/a", "a/a" ) );
    t.true ( zeptomatch ( "a/*/a", "a/a/a" ) );
    t.true ( !zeptomatch ( "a/*/a", "a/a/b" ) );
    t.true ( !zeptomatch ( "a/*/a", "a/a/a/a" ) );
    t.true ( !zeptomatch ( "a/*/a", "a/a/a/a/a" ) );

    t.true ( !zeptomatch ( "a/*/b", "a" ) );
    t.true ( !zeptomatch ( "a/*/b", "a/a" ) );
    t.true ( !zeptomatch ( "a/*/b", "a/a/a" ) );
    t.true ( zeptomatch ( "a/*/b", "a/a/b" ) );
    t.true ( !zeptomatch ( "a/*/b", "a/a/a/a" ) );
    t.true ( !zeptomatch ( "a/*/b", "a/a/a/a/a" ) );

    t.true ( !zeptomatch ( "*/**/a", "a" ) );
    t.true ( !zeptomatch ( "*/**/a", "a/a/b" ) );
    t.true ( zeptomatch ( "*/**/a", "a/a" ) );
    t.true ( zeptomatch ( "*/**/a", "a/a/a" ) );
    t.true ( zeptomatch ( "*/**/a", "a/a/a/a" ) );
    t.true ( zeptomatch ( "*/**/a", "a/a/a/a/a" ) );

    t.true ( !zeptomatch ( "*/", "a" ) );
    t.true ( !zeptomatch ( "*/*", "a" ) );
    t.true ( !zeptomatch ( "a/*", "a" ) );
    t.true ( !zeptomatch ( "*/*", "a/" ) );
    t.true ( !zeptomatch ( "a/*", "a/" ) );
    t.true ( !zeptomatch ( "*", "a/a" ) );
    t.true ( !zeptomatch ( "*/", "a/a" ) );
    t.true ( !zeptomatch ( "*/", "a/x/y" ) );
    t.true ( !zeptomatch ( "*/*", "a/x/y" ) );
    t.true ( !zeptomatch ( "a/*", "a/x/y" ) );
    t.true ( zeptomatch ( "*", "a/" ) );
    t.true ( zeptomatch ( "*", "a" ) );
    t.true ( zeptomatch ( "*/", "a/" ) );
    t.true ( zeptomatch ( "*{,/}", "a/" ) );
    t.true ( zeptomatch ( "*/*", "a/a" ) );
    t.true ( zeptomatch ( "a/*", "a/a" ) );

    t.true ( !zeptomatch ( "a/**/*.txt", "a.txt" ) );
    t.true ( zeptomatch ( "a/**/*.txt", "a/x/y.txt" ) );
    t.true ( !zeptomatch ( "a/**/*.txt", "a/x/y/z" ) );

    t.true ( !zeptomatch ( "a/*.txt", "a.txt" ) );
    t.true ( zeptomatch ( "a/*.txt", "a/b.txt" ) );
    t.true ( !zeptomatch ( "a/*.txt", "a/x/y.txt" ) );
    t.true ( !zeptomatch ( "a/*.txt", "a/x/y/z" ) );

    t.true ( zeptomatch ( "a*.txt", "a.txt" ) );
    t.true ( !zeptomatch ( "a*.txt", "a/b.txt" ) );
    t.true ( !zeptomatch ( "a*.txt", "a/x/y.txt" ) );
    t.true ( !zeptomatch ( "a*.txt", "a/x/y/z" ) );

    t.true ( zeptomatch ( "*.txt", "a.txt" ) );
    t.true ( !zeptomatch ( "*.txt", "a/b.txt" ) );
    t.true ( !zeptomatch ( "*.txt", "a/x/y.txt" ) );
    t.true ( !zeptomatch ( "*.txt", "a/x/y/z" ) );

    t.true ( !zeptomatch ( "a*", "a/b" ) );
    t.true ( !zeptomatch ( "a/**/b", "a/a/bb" ) );
    t.true ( !zeptomatch ( "a/**/b", "a/bb" ) );

    t.true ( !zeptomatch ( "*/**", "foo" ) );
    t.true ( !zeptomatch ( "**/", "foo/bar" ) );
    t.true ( !zeptomatch ( "**/*/", "foo/bar" ) );
    t.true ( !zeptomatch ( "*/*/", "foo/bar" ) );

    t.true ( zeptomatch ( "**/..", "/home/foo/.." ) );
    t.true ( zeptomatch ( "**/a", "a" ) );
    t.true ( zeptomatch ( "**", "a/a" ) );
    t.true ( zeptomatch ( "a/**", "a/a" ) );
    t.true ( zeptomatch ( "a/**", "a/" ) );
    t.true ( zeptomatch ( "a/**", "a" ) );
    t.true ( !zeptomatch ( "**/", "a/a" ) );
    t.true ( zeptomatch ( "**/a/**", "a" ) );
    t.true ( zeptomatch ( "a/**", "a" ) );
    t.true ( !zeptomatch ( "**/", "a/a" ) );
    t.true ( zeptomatch ( "*/**/a", "a/a" ) );
    t.true ( zeptomatch ( "a/**", "a" ) );
    t.true ( zeptomatch ( "*/**", "foo/" ) );
    t.true ( zeptomatch ( "**/*", "foo/bar" ) );
    t.true ( zeptomatch ( "*/*", "foo/bar" ) );
    t.true ( zeptomatch ( "*/**", "foo/bar" ) );
    t.true ( zeptomatch ( "**/", "foo/bar/" ) );
    t.true ( zeptomatch ( "**/*", "foo/bar/" ) );
    t.true ( zeptomatch ( "**/*/", "foo/bar/" ) );
    t.true ( zeptomatch ( "*/**", "foo/bar/" ) );
    t.true ( zeptomatch ( "*/*/", "foo/bar/" ) );

    t.true ( !zeptomatch ( "*/foo", "bar/baz/foo" ) );
    t.true ( !zeptomatch ( "**/bar/*", "deep/foo/bar" ) );
    t.true ( !zeptomatch ( "*/bar/**", "deep/foo/bar/baz/x" ) );
    t.true ( !zeptomatch ( "/*", "ef" ) );
    t.true ( !zeptomatch ( "foo?bar", "foo/bar" ) );
    t.true ( !zeptomatch ( "**/bar*", "foo/bar/baz" ) );
    t.true ( !zeptomatch ( "**/bar**", "foo/bar/baz" ) );
    t.true ( !zeptomatch ( "foo**bar", "foo/baz/bar" ) );
    t.true ( !zeptomatch ( "foo*bar", "foo/baz/bar" ) );
    t.true ( zeptomatch ( "foo/**", "foo" ) );
    t.true ( zeptomatch ( "/*", "/ab" ) );
    t.true ( zeptomatch ( "/*", "/cd" ) );
    t.true ( zeptomatch ( "/*", "/ef" ) );
    t.true ( zeptomatch ( "a/**/j/**/z/*.md", "a/b/j/c/z/x.md" ) );
    t.true ( zeptomatch ( "a/**/j/**/z/*.md", "a/j/z/x.md" ) );

    t.true ( zeptomatch ( "**/foo", "bar/baz/foo" ) );
    t.true ( zeptomatch ( "**/bar/*", "deep/foo/bar/baz" ) );
    t.true ( zeptomatch ( "**/bar/**", "deep/foo/bar/baz/" ) );
    t.true ( zeptomatch ( "**/bar/*/*", "deep/foo/bar/baz/x" ) );
    t.true ( zeptomatch ( "foo/**/**/bar", "foo/b/a/z/bar" ) );
    t.true ( zeptomatch ( "foo/**/bar", "foo/b/a/z/bar" ) );
    t.true ( zeptomatch ( "foo/**/**/bar", "foo/bar" ) );
    t.true ( zeptomatch ( "foo/**/bar", "foo/bar" ) );
    t.true ( zeptomatch ( "*/bar/**", "foo/bar/baz/x" ) );
    t.true ( zeptomatch ( "foo/**/**/bar", "foo/baz/bar" ) );
    t.true ( zeptomatch ( "foo/**/bar", "foo/baz/bar" ) );
    t.true ( zeptomatch ( "**/foo", "XXX/foo" ) );

  });

  it ( 'globstars', t => {

    t.true ( zeptomatch ( "**/*.js", "a/b/c/d.js" ) );
    t.true ( zeptomatch ( "**/*.js", "a/b/c.js" ) );
    t.true ( zeptomatch ( "**/*.js", "a/b.js" ) );
    t.true ( zeptomatch ( "a/b/**/*.js", "a/b/c/d/e/f.js" ) );
    t.true ( zeptomatch ( "a/b/**/*.js", "a/b/c/d/e.js" ) );
    t.true ( zeptomatch ( "a/b/c/**/*.js", "a/b/c/d.js" ) );
    t.true ( zeptomatch ( "a/b/**/*.js", "a/b/c/d.js" ) );
    t.true ( zeptomatch ( "a/b/**/*.js", "a/b/d.js" ) );
    t.true ( !zeptomatch ( "a/b/**/*.js", "a/d.js" ) );
    t.true ( !zeptomatch ( "a/b/**/*.js", "d.js" ) );

    t.true ( !zeptomatch ( "**c", "a/b/c" ) );
    t.true ( !zeptomatch ( "a/**c", "a/b/c" ) );
    t.true ( !zeptomatch ( "a/**z", "a/b/c" ) );
    t.true ( !zeptomatch ( "a/**b**/c", "a/b/c/b/c" ) );
    t.true ( !zeptomatch ( "a/b/c**/*.js", "a/b/c/d/e.js" ) );
    t.true ( zeptomatch ( "a/**/b/**/c", "a/b/c/b/c" ) );
    t.true ( zeptomatch ( "a/**b**/c", "a/aba/c" ) );
    t.true ( zeptomatch ( "a/**b**/c", "a/b/c" ) );
    t.true ( zeptomatch ( "a/b/c**/*.js", "a/b/c/d.js" ) );

    t.true ( !zeptomatch ( "a/**/*", "a" ) );
    t.true ( !zeptomatch ( "a/**/**/*", "a" ) );
    t.true ( !zeptomatch ( "a/**/**/**/*", "a" ) );
    t.true ( zeptomatch ( "**/a", "a/" ) );
    t.true ( !zeptomatch ( "a/**/*", "a/" ) );
    t.true ( !zeptomatch ( "a/**/**/*", "a/" ) );
    t.true ( !zeptomatch ( "a/**/**/**/*", "a/" ) );
    t.true ( !zeptomatch ( "**/a", "a/b" ) );
    t.true ( !zeptomatch ( "a/**/j/**/z/*.md", "a/b/c/j/e/z/c.txt" ) );
    t.true ( !zeptomatch ( "a/**/b", "a/bb" ) );
    t.true ( !zeptomatch ( "**/a", "a/c" ) );
    t.true ( !zeptomatch ( "**/a", "a/b" ) );
    t.true ( !zeptomatch ( "**/a", "a/x/y" ) );
    t.true ( !zeptomatch ( "**/a", "a/b/c/d" ) );
    t.true ( zeptomatch ( "**", "a" ) );
    t.true ( zeptomatch ( "**/a", "a" ) );
    t.true ( zeptomatch ( "a/**", "a" ) );
    t.true ( zeptomatch ( "**", "a/" ) );
    t.true ( zeptomatch ( "**/a/**", "a/" ) );
    t.true ( zeptomatch ( "a/**", "a/" ) );
    t.true ( zeptomatch ( "a/**/**", "a/" ) );
    t.true ( zeptomatch ( "**/a", "a/a" ) );
    t.true ( zeptomatch ( "**", "a/b" ) );
    t.true ( zeptomatch ( "*/*", "a/b" ) );
    t.true ( zeptomatch ( "a/**", "a/b" ) );
    t.true ( zeptomatch ( "a/**/*", "a/b" ) );
    t.true ( zeptomatch ( "a/**/**/*", "a/b" ) );
    t.true ( zeptomatch ( "a/**/**/**/*", "a/b" ) );
    t.true ( zeptomatch ( "a/**/b", "a/b" ) );
    t.true ( zeptomatch ( "**", "a/b/c" ) );
    t.true ( zeptomatch ( "**/*", "a/b/c" ) );
    t.true ( zeptomatch ( "**/**", "a/b/c" ) );
    t.true ( zeptomatch ( "*/**", "a/b/c" ) );
    t.true ( zeptomatch ( "a/**", "a/b/c" ) );
    t.true ( zeptomatch ( "a/**/*", "a/b/c" ) );
    t.true ( zeptomatch ( "a/**/**/*", "a/b/c" ) );
    t.true ( zeptomatch ( "a/**/**/**/*", "a/b/c" ) );
    t.true ( zeptomatch ( "**", "a/b/c/d" ) );
    t.true ( zeptomatch ( "a/**", "a/b/c/d" ) );
    t.true ( zeptomatch ( "a/**/*", "a/b/c/d" ) );
    t.true ( zeptomatch ( "a/**/**/*", "a/b/c/d" ) );
    t.true ( zeptomatch ( "a/**/**/**/*", "a/b/c/d" ) );
    t.true ( zeptomatch ( "a/b/**/c/**/*.*", "a/b/c/d.e" ) );
    t.true ( zeptomatch ( "a/**/f/*.md", "a/b/c/d/e/f/g.md" ) );
    t.true ( zeptomatch ( "a/**/f/**/k/*.md", "a/b/c/d/e/f/g/h/i/j/k/l.md" ) );
    t.true ( zeptomatch ( "a/b/c/*.md", "a/b/c/def.md" ) );
    t.true ( zeptomatch ( "a/*/c/*.md", "a/bb.bb/c/ddd.md" ) );
    t.true ( zeptomatch ( "a/**/f/*.md", "a/bb.bb/cc/d.d/ee/f/ggg.md" ) );
    t.true ( zeptomatch ( "a/**/f/*.md", "a/bb.bb/cc/dd/ee/f/ggg.md" ) );
    t.true ( zeptomatch ( "a/*/c/*.md", "a/bb/c/ddd.md" ) );
    t.true ( zeptomatch ( "a/*/c/*.md", "a/bbbb/c/ddd.md" ) );

    t.true ( zeptomatch ( "foo/bar/**/one/**/*.*", "foo/bar/baz/one/image.png" ) );
    t.true ( zeptomatch ( "foo/bar/**/one/**/*.*", "foo/bar/baz/one/two/image.png" ) );
    t.true ( zeptomatch ( "foo/bar/**/one/**/*.*", "foo/bar/baz/one/two/three/image.png" ) );
    t.true ( !zeptomatch ( "a/b/**/f", "a/b/c/d/" ) );
    t.true ( zeptomatch ( "a/**", "a" ) );
    t.true ( zeptomatch ( "**", "a" ) );
    t.true ( zeptomatch ( "a{,/**}", "a" ) );
    t.true ( zeptomatch ( "**", "a/" ) );
    t.true ( zeptomatch ( "a/**", "a/" ) );
    t.true ( zeptomatch ( "**", "a/b/c/d" ) );
    t.true ( zeptomatch ( "**", "a/b/c/d/" ) );
    t.true ( zeptomatch ( "**/**", "a/b/c/d/" ) );
    t.true ( zeptomatch ( "**/b/**", "a/b/c/d/" ) );
    t.true ( zeptomatch ( "a/b/**", "a/b/c/d/" ) );
    t.true ( zeptomatch ( "a/b/**/", "a/b/c/d/" ) );
    t.true ( zeptomatch ( "a/b/**/c/**/", "a/b/c/d/" ) );
    t.true ( zeptomatch ( "a/b/**/c/**/d/", "a/b/c/d/" ) );
    t.true ( zeptomatch ( "a/b/**/**/*.*", "a/b/c/d/e.f" ) );
    t.true ( zeptomatch ( "a/b/**/*.*", "a/b/c/d/e.f" ) );
    t.true ( zeptomatch ( "a/b/**/c/**/d/*.*", "a/b/c/d/e.f" ) );
    t.true ( zeptomatch ( "a/b/**/d/**/*.*", "a/b/c/d/e.f" ) );
    t.true ( zeptomatch ( "a/b/**/d/**/*.*", "a/b/c/d/g/e.f" ) );
    t.true ( zeptomatch ( "a/b/**/d/**/*.*", "a/b/c/d/g/g/e.f" ) );
    t.true ( zeptomatch ( "a/b-*/**/z.js", "a/b-c/z.js" ) );
    t.true ( zeptomatch ( "a/b-*/**/z.js", "a/b-c/d/e/z.js" ) );

    t.true ( zeptomatch ( "*/*", "a/b" ) );
    t.true ( zeptomatch ( "a/b/c/*.md", "a/b/c/xyz.md" ) );
    t.true ( zeptomatch ( "a/*/c/*.md", "a/bb.bb/c/xyz.md" ) );
    t.true ( zeptomatch ( "a/*/c/*.md", "a/bb/c/xyz.md" ) );
    t.true ( zeptomatch ( "a/*/c/*.md", "a/bbbb/c/xyz.md" ) );

    t.true ( zeptomatch ( "**/*", "a/b/c" ) );
    t.true ( zeptomatch ( "**/**", "a/b/c" ) );
    t.true ( zeptomatch ( "*/**", "a/b/c" ) );
    t.true ( zeptomatch ( "a/**/j/**/z/*.md", "a/b/c/d/e/j/n/p/o/z/c.md" ) );
    t.true ( zeptomatch ( "a/**/z/*.md", "a/b/c/d/e/z/c.md" ) );
    t.true ( zeptomatch ( "a/**/c/*.md", "a/bb.bb/aa/b.b/aa/c/xyz.md" ) );
    t.true ( zeptomatch ( "a/**/c/*.md", "a/bb.bb/aa/bb/aa/c/xyz.md" ) );
    t.true ( !zeptomatch ( "a/**/j/**/z/*.md", "a/b/c/j/e/z/c.txt" ) );
    t.true ( !zeptomatch ( "a/b/**/c{d,e}/**/xyz.md", "a/b/c/xyz.md" ) );
    t.true ( !zeptomatch ( "a/b/**/c{d,e}/**/xyz.md", "a/b/d/xyz.md" ) );
    t.true ( !zeptomatch ( "a/**/", "a/b" ) );
    t.true ( zeptomatch ( "**/*", "a/b/.js/c.txt" ) );
    t.true ( !zeptomatch ( "a/**/", "a/b/c/d" ) );
    t.true ( !zeptomatch ( "a/**/", "a/bb" ) );
    t.true ( !zeptomatch ( "a/**/", "a/cb" ) );
    t.true ( zeptomatch ( "/**", "/a/b" ) );
    t.true ( zeptomatch ( "**/*", "a.b" ) );
    t.true ( zeptomatch ( "**/*", "a.js" ) );
    t.true ( zeptomatch ( "**/*.js", "a.js" ) );
    t.true ( zeptomatch ( "a/**/", "a/" ) );
    t.true ( zeptomatch ( "**/*.js", "a/a.js" ) );
    t.true ( zeptomatch ( "**/*.js", "a/a/b.js" ) );
    t.true ( zeptomatch ( "a/**/b", "a/b" ) );
    t.true ( zeptomatch ( "a/**b", "a/b" ) );
    t.true ( zeptomatch ( "**/*.md", "a/b.md" ) );
    t.true ( zeptomatch ( "**/*", "a/b/c.js" ) );
    t.true ( zeptomatch ( "**/*", "a/b/c.txt" ) );
    t.true ( zeptomatch ( "a/**/", "a/b/c/d/" ) );
    t.true ( zeptomatch ( "**/*", "a/b/c/d/a.js" ) );
    t.true ( zeptomatch ( "a/b/**/*.js", "a/b/c/z.js" ) );
    t.true ( zeptomatch ( "a/b/**/*.js", "a/b/z.js" ) );
    t.true ( zeptomatch ( "**/*", "ab" ) );
    t.true ( zeptomatch ( "**/*", "ab/c" ) );
    t.true ( zeptomatch ( "**/*", "ab/c/d" ) );
    t.true ( zeptomatch ( "**/*", "abc.js" ) );

    t.true ( !zeptomatch ( "**/", "a" ) );
    t.true ( !zeptomatch ( "**/a/*", "a" ) );
    t.true ( !zeptomatch ( "**/a/*/*", "a" ) );
    t.true ( !zeptomatch ( "*/a/**", "a" ) );
    t.true ( !zeptomatch ( "a/**/*", "a" ) );
    t.true ( !zeptomatch ( "a/**/**/*", "a" ) );
    t.true ( !zeptomatch ( "**/", "a/b" ) );
    t.true ( !zeptomatch ( "**/b/*", "a/b" ) );
    t.true ( !zeptomatch ( "**/b/*/*", "a/b" ) );
    t.true ( !zeptomatch ( "b/**", "a/b" ) );
    t.true ( !zeptomatch ( "**/", "a/b/c" ) );
    t.true ( !zeptomatch ( "**/**/b", "a/b/c" ) );
    t.true ( !zeptomatch ( "**/b", "a/b/c" ) );
    t.true ( !zeptomatch ( "**/b/*/*", "a/b/c" ) );
    t.true ( !zeptomatch ( "b/**", "a/b/c" ) );
    t.true ( !zeptomatch ( "**/", "a/b/c/d" ) );
    t.true ( !zeptomatch ( "**/d/*", "a/b/c/d" ) );
    t.true ( !zeptomatch ( "b/**", "a/b/c/d" ) );
    t.true ( zeptomatch ( "**", "a" ) );
    t.true ( zeptomatch ( "**/**", "a" ) );
    t.true ( zeptomatch ( "**/**/*", "a" ) );
    t.true ( zeptomatch ( "**/**/a", "a" ) );
    t.true ( zeptomatch ( "**/a", "a" ) );
    t.true ( zeptomatch ( "**/a/**", "a" ) );
    t.true ( zeptomatch ( "a/**", "a" ) );
    t.true ( zeptomatch ( "**", "a/b" ) );
    t.true ( zeptomatch ( "**/**", "a/b" ) );
    t.true ( zeptomatch ( "**/**/*", "a/b" ) );
    t.true ( zeptomatch ( "**/**/b", "a/b" ) );
    t.true ( zeptomatch ( "**/b", "a/b" ) );
    t.true ( zeptomatch ( "**/b/**", "a/b" ) );
    t.true ( zeptomatch ( "*/b/**", "a/b" ) );
    t.true ( zeptomatch ( "a/**", "a/b" ) );
    t.true ( zeptomatch ( "a/**/*", "a/b" ) );
    t.true ( zeptomatch ( "a/**/**/*", "a/b" ) );
    t.true ( zeptomatch ( "**", "a/b/c" ) );
    t.true ( zeptomatch ( "**/**", "a/b/c" ) );
    t.true ( zeptomatch ( "**/**/*", "a/b/c" ) );
    t.true ( zeptomatch ( "**/b/*", "a/b/c" ) );
    t.true ( zeptomatch ( "**/b/**", "a/b/c" ) );
    t.true ( zeptomatch ( "*/b/**", "a/b/c" ) );
    t.true ( zeptomatch ( "a/**", "a/b/c" ) );
    t.true ( zeptomatch ( "a/**/*", "a/b/c" ) );
    t.true ( zeptomatch ( "a/**/**/*", "a/b/c" ) );
    t.true ( zeptomatch ( "**", "a/b/c/d" ) );
    t.true ( zeptomatch ( "**/**", "a/b/c/d" ) );
    t.true ( zeptomatch ( "**/**/*", "a/b/c/d" ) );
    t.true ( zeptomatch ( "**/**/d", "a/b/c/d" ) );
    t.true ( zeptomatch ( "**/b/**", "a/b/c/d" ) );
    t.true ( zeptomatch ( "**/b/*/*", "a/b/c/d" ) );
    t.true ( zeptomatch ( "**/d", "a/b/c/d" ) );
    t.true ( zeptomatch ( "*/b/**", "a/b/c/d" ) );
    t.true ( zeptomatch ( "a/**", "a/b/c/d" ) );
    t.true ( zeptomatch ( "a/**/*", "a/b/c/d" ) );
    t.true ( zeptomatch ( "a/**/**/*", "a/b/c/d" ) );

  });

  it ( 'utf8', t => {

    t.true ( zeptomatch ( "フ*/**/*", "フォルダ/aaa.js" ) );
    t.true ( zeptomatch ( "フォ*/**/*", "フォルダ/aaa.js" ) );
    t.true ( zeptomatch ( "フォル*/**/*", "フォルダ/aaa.js" ) );
    t.true ( zeptomatch ( "フ*ル*/**/*", "フォルダ/aaa.js" ) );
    t.true ( zeptomatch ( "フォルダ/**/*", "フォルダ/aaa.js" ) );

  });

  it ( 'negation', t => {

    t.true ( !zeptomatch ( "!*", "abc" ) );
    t.true ( !zeptomatch ( "!abc", "abc" ) );
    t.true ( !zeptomatch ( "*!.md", "bar.md" ) );
    t.true ( !zeptomatch ( "foo!.md", "bar.md" ) );
    t.true ( !zeptomatch ( "\\!*!*.md", "foo!.md" ) );
    t.true ( !zeptomatch ( "\\!*!*.md", "foo!bar.md" ) );
    t.true ( zeptomatch ( "*!*.md", "!foo!.md" ) );
    t.true ( zeptomatch ( "\\!*!*.md", "!foo!.md" ) );
    t.true ( zeptomatch ( "!*foo", "abc" ) );
    t.true ( zeptomatch ( "!foo*", "abc" ) );
    t.true ( zeptomatch ( "!xyz", "abc" ) );
    t.true ( zeptomatch ( "*!*.*", "ba!r.js" ) );
    t.true ( zeptomatch ( "*.md", "bar.md" ) );
    t.true ( zeptomatch ( "*!*.*", "foo!.md" ) );
    t.true ( zeptomatch ( "*!*.md", "foo!.md" ) );
    t.true ( zeptomatch ( "*!.md", "foo!.md" ) );
    t.true ( zeptomatch ( "*.md", "foo!.md" ) );
    t.true ( zeptomatch ( "foo!.md", "foo!.md" ) );
    t.true ( zeptomatch ( "*!*.md", "foo!bar.md" ) );
    t.true ( zeptomatch ( "*b*.md", "foobar.md" ) );

    t.true ( !zeptomatch ( "a!!b", "a" ) );
    t.true ( !zeptomatch ( "a!!b", "aa" ) );
    t.true ( !zeptomatch ( "a!!b", "a/b" ) );
    t.true ( !zeptomatch ( "a!!b", "a!b" ) );
    t.true ( zeptomatch ( "a!!b", "a!!b" ) );
    t.true ( !zeptomatch ( "a!!b", "a/!!/b" ) );

    t.true ( !zeptomatch ( "!a/b", "a/b" ) );
    t.true ( zeptomatch ( "!a/b", "a" ) );
    t.true ( zeptomatch ( "!a/b", "a.b" ) );
    t.true ( zeptomatch ( "!a/b", "a/a" ) );
    t.true ( zeptomatch ( "!a/b", "a/c" ) );
    t.true ( zeptomatch ( "!a/b", "b/a" ) );
    t.true ( zeptomatch ( "!a/b", "b/b" ) );
    t.true ( zeptomatch ( "!a/b", "b/c" ) );

    t.true ( !zeptomatch ( "!abc", "abc" ) );
    t.true ( zeptomatch ( "!!abc", "abc" ) );
    t.true ( !zeptomatch ( "!!!abc", "abc" ) );
    t.true ( zeptomatch ( "!!!!abc", "abc" ) );
    t.true ( !zeptomatch ( "!!!!!abc", "abc" ) );
    t.true ( zeptomatch ( "!!!!!!abc", "abc" ) );
    t.true ( !zeptomatch ( "!!!!!!!abc", "abc" ) );
    t.true ( zeptomatch ( "!!!!!!!!abc", "abc" ) );

    // t.true ( !zeptomatch ( "!(*/*)", "a/a" ) );
    // t.true ( !zeptomatch ( "!(*/*)", "a/b" ) );
    // t.true ( !zeptomatch ( "!(*/*)", "a/c" ) );
    // t.true ( !zeptomatch ( "!(*/*)", "b/a" ) );
    // t.true ( !zeptomatch ( "!(*/*)", "b/b" ) );
    // t.true ( !zeptomatch ( "!(*/*)", "b/c" ) );
    // t.true ( !zeptomatch ( "!(*/b)", "a/b" ) );
    // t.true ( !zeptomatch ( "!(*/b)", "b/b" ) );
    // t.true ( !zeptomatch ( "!(a/b)", "a/b" ) );
    t.true ( !zeptomatch ( "!*", "a" ) );
    t.true ( !zeptomatch ( "!*", "a.b" ) );
    t.true ( !zeptomatch ( "!*/*", "a/a" ) );
    t.true ( !zeptomatch ( "!*/*", "a/b" ) );
    t.true ( !zeptomatch ( "!*/*", "a/c" ) );
    t.true ( !zeptomatch ( "!*/*", "b/a" ) );
    t.true ( !zeptomatch ( "!*/*", "b/b" ) );
    t.true ( !zeptomatch ( "!*/*", "b/c" ) );
    t.true ( !zeptomatch ( "!*/b", "a/b" ) );
    t.true ( !zeptomatch ( "!*/b", "b/b" ) );
    t.true ( !zeptomatch ( "!*/c", "a/c" ) );
    t.true ( !zeptomatch ( "!*/c", "a/c" ) );
    t.true ( !zeptomatch ( "!*/c", "b/c" ) );
    t.true ( !zeptomatch ( "!*/c", "b/c" ) );
    t.true ( !zeptomatch ( "!*a*", "bar" ) );
    t.true ( !zeptomatch ( "!*a*", "fab" ) );
    t.true ( zeptomatch ( "!a/(*)", "a/a" ) );
    t.true ( zeptomatch ( "!a/(*)", "a/b" ) );
    t.true ( zeptomatch ( "!a/(*)", "a/c" ) );
    t.true ( zeptomatch ( "!a/(b)", "a/b" ) );
    t.true ( !zeptomatch ( "!a/*", "a/a" ) );
    t.true ( !zeptomatch ( "!a/*", "a/b" ) );
    t.true ( !zeptomatch ( "!a/*", "a/c" ) );
    t.true ( !zeptomatch ( "!f*b", "fab" ) );
    t.true ( zeptomatch ( "!(*/*)", "a" ) );
    t.true ( zeptomatch ( "!(*/*)", "a.b" ) );
    t.true ( zeptomatch ( "!(*/b)", "a" ) );
    t.true ( zeptomatch ( "!(*/b)", "a.b" ) );
    t.true ( zeptomatch ( "!(*/b)", "a/a" ) );
    t.true ( zeptomatch ( "!(*/b)", "a/c" ) );
    t.true ( zeptomatch ( "!(*/b)", "b/a" ) );
    t.true ( zeptomatch ( "!(*/b)", "b/c" ) );
    t.true ( zeptomatch ( "!(a/b)", "a" ) );
    t.true ( zeptomatch ( "!(a/b)", "a.b" ) );
    t.true ( zeptomatch ( "!(a/b)", "a/a" ) );
    t.true ( zeptomatch ( "!(a/b)", "a/c" ) );
    t.true ( zeptomatch ( "!(a/b)", "b/a" ) );
    t.true ( zeptomatch ( "!(a/b)", "b/b" ) );
    t.true ( zeptomatch ( "!(a/b)", "b/c" ) );
    t.true ( zeptomatch ( "!*", "a/a" ) );
    t.true ( zeptomatch ( "!*", "a/b" ) );
    t.true ( zeptomatch ( "!*", "a/c" ) );
    t.true ( zeptomatch ( "!*", "b/a" ) );
    t.true ( zeptomatch ( "!*", "b/b" ) );
    t.true ( zeptomatch ( "!*", "b/c" ) );
    t.true ( zeptomatch ( "!*/*", "a" ) );
    t.true ( zeptomatch ( "!*/*", "a.b" ) );
    t.true ( zeptomatch ( "!*/b", "a" ) );
    t.true ( zeptomatch ( "!*/b", "a.b" ) );
    t.true ( zeptomatch ( "!*/b", "a/a" ) );
    t.true ( zeptomatch ( "!*/b", "a/c" ) );
    t.true ( zeptomatch ( "!*/b", "b/a" ) );
    t.true ( zeptomatch ( "!*/b", "b/c" ) );
    t.true ( zeptomatch ( "!*/c", "a" ) );
    t.true ( zeptomatch ( "!*/c", "a.b" ) );
    t.true ( zeptomatch ( "!*/c", "a/a" ) );
    t.true ( zeptomatch ( "!*/c", "a/b" ) );
    t.true ( zeptomatch ( "!*/c", "b/a" ) );
    t.true ( zeptomatch ( "!*/c", "b/b" ) );
    t.true ( zeptomatch ( "!*a*", "foo" ) );
    t.true ( zeptomatch ( "!a/(*)", "a" ) );
    t.true ( zeptomatch ( "!a/(*)", "a.b" ) );
    t.true ( zeptomatch ( "!a/(*)", "b/a" ) );
    t.true ( zeptomatch ( "!a/(*)", "b/b" ) );
    t.true ( zeptomatch ( "!a/(*)", "b/c" ) );
    t.true ( zeptomatch ( "!a/(b)", "a" ) );
    t.true ( zeptomatch ( "!a/(b)", "a.b" ) );
    t.true ( zeptomatch ( "!a/(b)", "a/a" ) );
    t.true ( zeptomatch ( "!a/(b)", "a/c" ) );
    t.true ( zeptomatch ( "!a/(b)", "b/a" ) );
    t.true ( zeptomatch ( "!a/(b)", "b/b" ) );
    t.true ( zeptomatch ( "!a/(b)", "b/c" ) );
    t.true ( zeptomatch ( "!a/*", "a" ) );
    t.true ( zeptomatch ( "!a/*", "a.b" ) );
    t.true ( zeptomatch ( "!a/*", "b/a" ) );
    t.true ( zeptomatch ( "!a/*", "b/b" ) );
    t.true ( zeptomatch ( "!a/*", "b/c" ) );
    t.true ( zeptomatch ( "!f*b", "bar" ) );
    t.true ( zeptomatch ( "!f*b", "foo" ) );

    t.true ( !zeptomatch ( "!.md", ".md" ) );
    t.true ( zeptomatch ( "!**/*.md", "a.js" ) );
    t.true ( !zeptomatch ( "!**/*.md", "b.md" ) );
    t.true ( zeptomatch ( "!**/*.md", "c.txt" ) );
    t.true ( zeptomatch ( "!*.md", "a.js" ) );
    t.true ( !zeptomatch ( "!*.md", "b.md" ) );
    t.true ( zeptomatch ( "!*.md", "c.txt" ) );
    t.true ( !zeptomatch ( "!*.md", "abc.md" ) );
    t.true ( zeptomatch ( "!*.md", "abc.txt" ) );
    t.true ( !zeptomatch ( "!*.md", "foo.md" ) );
    t.true ( zeptomatch ( "!.md", "foo.md" ) );

    t.true ( zeptomatch ( "!*.md", "a.js" ) );
    t.true ( zeptomatch ( "!*.md", "b.txt" ) );
    t.true ( !zeptomatch ( "!*.md", "c.md" ) );
    t.true ( !zeptomatch ( "!a/*/a.js", "a/a/a.js" ) );
    t.true ( !zeptomatch ( "!a/*/a.js", "a/b/a.js" ) );
    t.true ( !zeptomatch ( "!a/*/a.js", "a/c/a.js" ) );
    t.true ( !zeptomatch ( "!a/*/*/a.js", "a/a/a/a.js" ) );
    t.true ( zeptomatch ( "!a/*/*/a.js", "b/a/b/a.js" ) );
    t.true ( zeptomatch ( "!a/*/*/a.js", "c/a/c/a.js" ) );
    t.true ( !zeptomatch ( "!a/a*.txt", "a/a.txt" ) );
    t.true ( zeptomatch ( "!a/a*.txt", "a/b.txt" ) );
    t.true ( zeptomatch ( "!a/a*.txt", "a/c.txt" ) );
    t.true ( !zeptomatch ( "!a.a*.txt", "a.a.txt" ) );
    t.true ( zeptomatch ( "!a.a*.txt", "a.b.txt" ) );
    t.true ( zeptomatch ( "!a.a*.txt", "a.c.txt" ) );
    t.true ( !zeptomatch ( "!a/*.txt", "a/a.txt" ) );
    t.true ( !zeptomatch ( "!a/*.txt", "a/b.txt" ) );
    t.true ( !zeptomatch ( "!a/*.txt", "a/c.txt" ) );

    t.true ( zeptomatch ( "!*.md", "a.js" ) );
    t.true ( zeptomatch ( "!*.md", "b.txt" ) );
    t.true ( !zeptomatch ( "!*.md", "c.md" ) );
    t.true ( !zeptomatch ( "!**/a.js", "a/a/a.js" ) );
    t.true ( !zeptomatch ( "!**/a.js", "a/b/a.js" ) );
    t.true ( !zeptomatch ( "!**/a.js", "a/c/a.js" ) );
    t.true ( zeptomatch ( "!**/a.js", "a/a/b.js" ) );
    t.true ( !zeptomatch ( "!a/**/a.js", "a/a/a/a.js" ) );
    t.true ( zeptomatch ( "!a/**/a.js", "b/a/b/a.js" ) );
    t.true ( zeptomatch ( "!a/**/a.js", "c/a/c/a.js" ) );
    t.true ( zeptomatch ( "!**/*.md", "a/b.js" ) );
    t.true ( zeptomatch ( "!**/*.md", "a.js" ) );
    t.true ( !zeptomatch ( "!**/*.md", "a/b.md" ) );
    t.true ( !zeptomatch ( "!**/*.md", "a.md" ) );
    t.true ( !zeptomatch ( "**/*.md", "a/b.js" ) );
    t.true ( !zeptomatch ( "**/*.md", "a.js" ) );
    t.true ( zeptomatch ( "**/*.md", "a/b.md" ) );
    t.true ( zeptomatch ( "**/*.md", "a.md" ) );
    t.true ( zeptomatch ( "!**/*.md", "a/b.js" ) );
    t.true ( zeptomatch ( "!**/*.md", "a.js" ) );
    t.true ( !zeptomatch ( "!**/*.md", "a/b.md" ) );
    t.true ( !zeptomatch ( "!**/*.md", "a.md" ) );
    t.true ( zeptomatch ( "!*.md", "a/b.js" ) );
    t.true ( zeptomatch ( "!*.md", "a.js" ) );
    t.true ( zeptomatch ( "!*.md", "a/b.md" ) );
    t.true ( !zeptomatch ( "!*.md", "a.md" ) );
    t.true ( zeptomatch ( "!**/*.md", "a.js" ) );
    t.true ( !zeptomatch ( "!**/*.md", "b.md" ) );
    t.true ( zeptomatch ( "!**/*.md", "c.txt" ) );

  });

  it ( 'question_mark', t => {

    t.true ( zeptomatch ( "?", "a" ) );
    t.true ( !zeptomatch ( "?", "aa" ) );
    t.true ( !zeptomatch ( "?", "ab" ) );
    t.true ( !zeptomatch ( "?", "aaa" ) );
    t.true ( !zeptomatch ( "?", "abcdefg" ) );

    t.true ( !zeptomatch ( "??", "a" ) );
    t.true ( zeptomatch ( "??", "aa" ) );
    t.true ( zeptomatch ( "??", "ab" ) );
    t.true ( !zeptomatch ( "??", "aaa" ) );
    t.true ( !zeptomatch ( "??", "abcdefg" ) );

    t.true ( !zeptomatch ( "???", "a" ) );
    t.true ( !zeptomatch ( "???", "aa" ) );
    t.true ( !zeptomatch ( "???", "ab" ) );
    t.true ( zeptomatch ( "???", "aaa" ) );
    t.true ( !zeptomatch ( "???", "abcdefg" ) );

    t.true ( !zeptomatch ( "a?c", "aaa" ) );
    t.true ( zeptomatch ( "a?c", "aac" ) );
    t.true ( zeptomatch ( "a?c", "abc" ) );
    t.true ( !zeptomatch ( "ab?", "a" ) );
    t.true ( !zeptomatch ( "ab?", "aa" ) );
    t.true ( !zeptomatch ( "ab?", "ab" ) );
    t.true ( !zeptomatch ( "ab?", "ac" ) );
    t.true ( !zeptomatch ( "ab?", "abcd" ) );
    t.true ( !zeptomatch ( "ab?", "abbb" ) );
    t.true ( zeptomatch ( "a?b", "acb" ) );

    t.true ( !zeptomatch ( "a/?/c/?/e.md", "a/bb/c/dd/e.md" ) );
    t.true ( zeptomatch ( "a/??/c/??/e.md", "a/bb/c/dd/e.md" ) );
    t.true ( !zeptomatch ( "a/??/c.md", "a/bbb/c.md" ) );
    t.true ( zeptomatch ( "a/?/c.md", "a/b/c.md" ) );
    t.true ( zeptomatch ( "a/?/c/?/e.md", "a/b/c/d/e.md" ) );
    t.true ( !zeptomatch ( "a/?/c/???/e.md", "a/b/c/d/e.md" ) );
    t.true ( zeptomatch ( "a/?/c/???/e.md", "a/b/c/zzz/e.md" ) );
    t.true ( !zeptomatch ( "a/?/c.md", "a/bb/c.md" ) );
    t.true ( zeptomatch ( "a/??/c.md", "a/bb/c.md" ) );
    t.true ( zeptomatch ( "a/???/c.md", "a/bbb/c.md" ) );
    t.true ( zeptomatch ( "a/????/c.md", "a/bbbb/c.md" ) );

  });

  it ( 'braces', t => {

    t.true ( zeptomatch ( "{a,b,c}", "a" ) );
    t.true ( zeptomatch ( "{a,b,c}", "b" ) );
    t.true ( zeptomatch ( "{a,b,c}", "c" ) );
    t.true ( !zeptomatch ( "{a,b,c}", "aa" ) );
    t.true ( !zeptomatch ( "{a,b,c}", "bb" ) );
    t.true ( !zeptomatch ( "{a,b,c}", "cc" ) );

    t.true ( zeptomatch ( "a/{a,b}", "a/a" ) );
    t.true ( zeptomatch ( "a/{a,b}", "a/b" ) );
    t.true ( !zeptomatch ( "a/{a,b}", "a/c" ) );
    t.true ( !zeptomatch ( "a/{a,b}", "b/b" ) );
    t.true ( !zeptomatch ( "a/{a,b,c}", "b/b" ) );
    t.true ( zeptomatch ( "a/{a,b,c}", "a/c" ) );
    t.true ( zeptomatch ( "a{b,bc}.txt", "abc.txt" ) );

    t.true ( zeptomatch ( "foo[{a,b}]baz", "foo{baz" ) );

    t.true ( !zeptomatch ( "a{,b}.txt", "abc.txt" ) );
    t.true ( !zeptomatch ( "a{a,b,}.txt", "abc.txt" ) );
    t.true ( !zeptomatch ( "a{b,}.txt", "abc.txt" ) );
    t.true ( zeptomatch ( "a{,b}.txt", "a.txt" ) );
    t.true ( zeptomatch ( "a{b,}.txt", "a.txt" ) );
    t.true ( zeptomatch ( "a{a,b,}.txt", "aa.txt" ) );
    t.true ( zeptomatch ( "a{a,b,}.txt", "aa.txt" ) );
    t.true ( zeptomatch ( "a{,b}.txt", "ab.txt" ) );
    t.true ( zeptomatch ( "a{b,}.txt", "ab.txt" ) );

    t.true ( zeptomatch ( "{a/,}a/**", "a" ) );
    t.true ( zeptomatch ( "a{a,b/}*.txt", "aa.txt" ) );
    t.true ( zeptomatch ( "a{a,b/}*.txt", "ab/.txt" ) );
    t.true ( zeptomatch ( "a{a,b/}*.txt", "ab/a.txt" ) );
    t.true ( zeptomatch ( "{a/,}a/**", "a/" ) );
    t.true ( zeptomatch ( "{a/,}a/**", "a/a/" ) );
    t.true ( zeptomatch ( "{a/,}a/**", "a/a" ) );
    t.true ( zeptomatch ( "{a/,}a/**", "a/a/a" ) );
    t.true ( zeptomatch ( "{a/,}a/**", "a/a/" ) );
    t.true ( zeptomatch ( "{a/,}a/**", "a/a/a/" ) );
    t.true ( zeptomatch ( "{a/,}b/**", "a/b/a/" ) );
    t.true ( zeptomatch ( "{a/,}b/**", "b/a/" ) );
    t.true ( zeptomatch ( "a{,/}*.txt", "a.txt" ) );
    t.true ( zeptomatch ( "a{,/}*.txt", "ab.txt" ) );
    t.true ( zeptomatch ( "a{,/}*.txt", "a/b.txt" ) );
    t.true ( zeptomatch ( "a{,/}*.txt", "a/ab.txt" ) );

    t.true ( zeptomatch ( "a{,.*{foo,db},\\(bar\\)}.txt", "a.txt" ) );
    t.true ( !zeptomatch ( "a{,.*{foo,db},\\(bar\\)}.txt", "adb.txt" ) );
    t.true ( zeptomatch ( "a{,.*{foo,db},\\(bar\\)}.txt", "a.db.txt" ) );

    t.true ( zeptomatch ( "a{,*.{foo,db},\\(bar\\)}.txt", "a.txt" ) );
    t.true ( !zeptomatch ( "a{,*.{foo,db},\\(bar\\)}.txt", "adb.txt" ) );
    t.true ( zeptomatch ( "a{,*.{foo,db},\\(bar\\)}.txt", "a.db.txt" ) );

    t.true ( zeptomatch ( "a{,.*{foo,db},\\(bar\\)}", "a" ) );
    t.true ( !zeptomatch ( "a{,.*{foo,db},\\(bar\\)}", "adb" ) );
    t.true ( zeptomatch ( "a{,.*{foo,db},\\(bar\\)}", "a.db" ) );

    t.true ( zeptomatch ( "a{,*.{foo,db},\\(bar\\)}", "a" ) );
    t.true ( !zeptomatch ( "a{,*.{foo,db},\\(bar\\)}", "adb" ) );
    t.true ( zeptomatch ( "a{,*.{foo,db},\\(bar\\)}", "a.db" ) );

    t.true ( !zeptomatch ( "{,.*{foo,db},\\(bar\\)}", "a" ) );
    t.true ( !zeptomatch ( "{,.*{foo,db},\\(bar\\)}", "adb" ) );
    t.true ( !zeptomatch ( "{,.*{foo,db},\\(bar\\)}", "a.db" ) );
    t.true ( zeptomatch ( "{,.*{foo,db},\\(bar\\)}", ".db" ) );

    t.true ( !zeptomatch ( "{,*.{foo,db},\\(bar\\)}", "a" ) );
    t.true ( zeptomatch ( "{*,*.{foo,db},\\(bar\\)}", "a" ) );
    t.true ( !zeptomatch ( "{,*.{foo,db},\\(bar\\)}", "adb" ) );
    t.true ( zeptomatch ( "{,*.{foo,db},\\(bar\\)}", "a.db" ) );

    t.true ( !zeptomatch ( "a/b/**/c{d,e}/**/`xyz.md", "a/b/c/xyz.md" ) );
    t.true ( !zeptomatch ( "a/b/**/c{d,e}/**/xyz.md", "a/b/d/xyz.md" ) );
    t.true ( zeptomatch ( "a/b/**/c{d,e}/**/xyz.md", "a/b/cd/xyz.md" ) );
    t.true ( zeptomatch ( "a/b/**/{c,d,e}/**/xyz.md", "a/b/c/xyz.md" ) );
    t.true ( zeptomatch ( "a/b/**/{c,d,e}/**/xyz.md", "a/b/d/xyz.md" ) );
    t.true ( zeptomatch ( "a/b/**/{c,d,e}/**/xyz.md", "a/b/e/xyz.md" ) );

    t.true ( zeptomatch ( "*{a,b}*", "xax" ) );
    t.true ( zeptomatch ( "*{a,b}*", "xxax" ) );
    t.true ( zeptomatch ( "*{a,b}*", "xbx" ) );

    t.true ( zeptomatch ( "*{*a,b}", "xba" ) );
    t.true ( zeptomatch ( "*{*a,b}", "xb" ) );

    t.true ( !zeptomatch ( "*??", "a" ) );
    t.true ( !zeptomatch ( "*???", "aa" ) );
    t.true ( zeptomatch ( "*???", "aaa" ) );
    t.true ( !zeptomatch ( "*****??", "a" ) );
    t.true ( !zeptomatch ( "*****???", "aa" ) );
    t.true ( zeptomatch ( "*****???", "aaa" ) );

    t.true ( !zeptomatch ( "a*?c", "aaa" ) );
    t.true ( zeptomatch ( "a*?c", "aac" ) );
    t.true ( zeptomatch ( "a*?c", "abc" ) );

    t.true ( zeptomatch ( "a**?c", "abc" ) );
    t.true ( !zeptomatch ( "a**?c", "abb" ) );
    t.true ( zeptomatch ( "a**?c", "acc" ) );
    t.true ( zeptomatch ( "a*****?c", "abc" ) );

    t.true ( zeptomatch ( "*****?", "a" ) );
    t.true ( zeptomatch ( "*****?", "aa" ) );
    t.true ( zeptomatch ( "*****?", "abc" ) );
    t.true ( zeptomatch ( "*****?", "zzz" ) );
    t.true ( zeptomatch ( "*****?", "bbb" ) );
    t.true ( zeptomatch ( "*****?", "aaaa" ) );

    t.true ( !zeptomatch ( "*****??", "a" ) );
    t.true ( zeptomatch ( "*****??", "aa" ) );
    t.true ( zeptomatch ( "*****??", "abc" ) );
    t.true ( zeptomatch ( "*****??", "zzz" ) );
    t.true ( zeptomatch ( "*****??", "bbb" ) );
    t.true ( zeptomatch ( "*****??", "aaaa" ) );

    t.true ( !zeptomatch ( "?*****??", "a" ) );
    t.true ( !zeptomatch ( "?*****??", "aa" ) );
    t.true ( zeptomatch ( "?*****??", "abc" ) );
    t.true ( zeptomatch ( "?*****??", "zzz" ) );
    t.true ( zeptomatch ( "?*****??", "bbb" ) );
    t.true ( zeptomatch ( "?*****??", "aaaa" ) );

    t.true ( zeptomatch ( "?*****?c", "abc" ) );
    t.true ( !zeptomatch ( "?*****?c", "abb" ) );
    t.true ( !zeptomatch ( "?*****?c", "zzz" ) );

    t.true ( zeptomatch ( "?***?****c", "abc" ) );
    t.true ( !zeptomatch ( "?***?****c", "bbb" ) );
    t.true ( !zeptomatch ( "?***?****c", "zzz" ) );

    t.true ( zeptomatch ( "?***?****?", "abc" ) );
    t.true ( zeptomatch ( "?***?****?", "bbb" ) );
    t.true ( zeptomatch ( "?***?****?", "zzz" ) );

    t.true ( zeptomatch ( "?***?****", "abc" ) );
    t.true ( zeptomatch ( "*******c", "abc" ) );
    t.true ( zeptomatch ( "*******?", "abc" ) );
    t.true ( zeptomatch ( "a*cd**?**??k", "abcdecdhjk" ) );
    t.true ( zeptomatch ( "a**?**cd**?**??k", "abcdecdhjk" ) );
    t.true ( zeptomatch ( "a**?**cd**?**??k***", "abcdecdhjk" ) );
    t.true ( zeptomatch ( "a**?**cd**?**??***k", "abcdecdhjk" ) );
    t.true ( zeptomatch ( "a**?**cd**?**??***k**", "abcdecdhjk" ) );
    t.true ( zeptomatch ( "a****c**?**??*****", "abcdecdhjk" ) );

    t.true ( !zeptomatch ( "a/?/c/?/*/e.md", "a/b/c/d/e.md" ) );
    t.true ( zeptomatch ( "a/?/c/?/*/e.md", "a/b/c/d/e/e.md" ) );
    t.true ( zeptomatch ( "a/?/c/?/*/e.md", "a/b/c/d/efghijk/e.md" ) );
    t.true ( zeptomatch ( "a/?/**/e.md", "a/b/c/d/efghijk/e.md" ) );
    t.true ( !zeptomatch ( "a/?/e.md", "a/bb/e.md" ) );
    t.true ( zeptomatch ( "a/??/e.md", "a/bb/e.md" ) );
    t.true ( !zeptomatch ( "a/?/**/e.md", "a/bb/e.md" ) );
    t.true ( zeptomatch ( "a/?/**/e.md", "a/b/ccc/e.md" ) );
    t.true ( zeptomatch ( "a/*/?/**/e.md", "a/b/c/d/efghijk/e.md" ) );
    t.true ( zeptomatch ( "a/*/?/**/e.md", "a/b/c/d/efgh.ijk/e.md" ) );
    t.true ( zeptomatch ( "a/*/?/**/e.md", "a/b.bb/c/d/efgh.ijk/e.md" ) );
    t.true ( zeptomatch ( "a/*/?/**/e.md", "a/bbb/c/d/efgh.ijk/e.md" ) );

    t.true ( zeptomatch ( "a/*/ab??.md", "a/bbb/abcd.md" ) );
    t.true ( zeptomatch ( "a/bbb/ab??.md", "a/bbb/abcd.md" ) );
    t.true ( zeptomatch ( "a/bbb/ab???md", "a/bbb/abcd.md" ) );

  });

  it ( 'fuzz_tests', t => {

    const problem1 = "{*{??*{??**,Uz*zz}w**{*{**a,z***b*[!}w??*azzzzzzzz*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!z[za,z&zz}w**z*z*}";
    t.true ( !zeptomatch ( problem1, problem1 ) );

    const problem2 = "**** *{*{??*{??***\u{5} *{*{??*{??***\u{5},\0U\0}]*****\u{1},\0***\0,\0\0}w****,\0U\0}]*****\u{1},\0***\0,\0\0}w*****\u{1}***{}*.*\0\0*\0";
    t.true ( !zeptomatch ( problem2, problem2 ) );

  });

});
