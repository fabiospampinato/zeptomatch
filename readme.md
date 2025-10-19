# Zeptomatch

An absurdly small glob matcher that packs a punch.

## Overview

The following syntax is supported:

| Syntax      | Description                                                                                                                             |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `*`         | Matches any character, except for the path separator, zero or more times.                                                               |
| `**`        | Matches any character zero or more times. If it doesn't span the entire length of a path segment it's interpreted as a `*` instead.     |
| `?`         | Matches any character, except for the path separator, one time.                                                                         |
| `\`         | Matches the character after it in the glob literally. This is the escape operator.                                                      |
| `[abc]`     | Matches any of the characters in the class one time.                                                                                    |
| `[a-z]`     | Matches any of the characters in the range in the class one time.                                                                       |
| `[^abc]`    | Matches any character, except for the characters in the class, and the path separator, one time. Aliased as `[!abc]` also.              |
| `[^a-z]`    | Matches any character, except for the characters in the range in the class, and the path separator, one time. Aliased as `[!a-z]` also. |
| `{foo,bar}` | Matches any of the alternations, which are separated by a comma, inside the braces.                                                     |
| `{01..99}`  | Matches any of the numbers in the expanded range. Padding is supported and opt-in.                                                      |
| `{a..zz}`   | Matches any of the strings in the expanded range. Upper-cased ranges are supported and opt-in.                                          |
| `!glob`     | Matches anything except the provided glob. Negations can only be used at the start of the glob.                                         |
| `!!glob`    | Matches the provided glob. Negations can only be used at the start of the glob.                                                         |

Additional features and details:

- Zeptomatch works pretty similarly to [`picomatch`](https://github.com/micromatch/picomatch), since 1000+ of its tests are being used by this library.
- Zeptomatch is opinionated, there are barely any options, which helps with keeping it tiny and manageable.
- Zeptomatch is automatically memoized, the only ways to use it are always the most optimized ones available.
- Zeptomatch automatically normalizes path separators, since matching Windows-style paths would most likely be a mistake.
- Zeptomatch supports compiling a glob to a standalone regular expression.
- Zeptomatch supports compiling multiple globs to a standalone regular expression too.
- Zeptomatch doesn't do anything special for file names starting with a dot.
- Zeptomatch supports nesting braces indefinitely.
- Zeptomatch supports matching globs partially too, with path segment-level awareness!

Limitations:

- POSIX classes (e.g. `[:alnum:]`) are not supported. Implementing them is out of scope for a "zepto"-level library.
- Extglobs (e.g. `?(foo)`) are not supported. They are too complicated and quirky too support here.

## Install

```sh
npm install zeptomatch
```

## Usage

```ts
import zeptomatch from 'zeptomatch';

// Let's check if a glob matches a path, fully

zeptomatch ( '*.js', 'abcd' ); // => false
zeptomatch ( '*.js', 'a.js' ); // => true
zeptomatch ( '*.js', 'a.md' ); // => false
zeptomatch ( '*.js', 'a/b.js' ); // => false

// Let's check if a glob matches a path, partially
// Matching partially is very useful for performance when traversing the filesystem
// It's important to not match the glob partially anymore once you have the full path available though!

zeptomatch ( 'foo/bar/*.js', 'foo', { partial: true } ); // => true
zeptomatch ( 'foo/bar/*.js', 'foo/bar', { partial: true } ); // => true
zeptomatch ( 'foo/bar/*.js', 'foo/bar/_', { partial: true } ); // => false, as no additional path segment could ever make this match
zeptomatch ( 'foo/bar/*.js', 'foo/bar/file.js' ); // => true, remember to not match the full path partially

// Let's compile a glob to a regular expression that matches fully

const fullRe = zeptomatch.compile ( 'src/*.js' ); // => /^(?:src[\\/][^\\/]*\.js)[\\/]?$/s

// Let's compile a glob to a regular expression that matches partially

const partialRe = zeptomatch.compile ( '*.js', { partial: true } ); // => /^(?:src(?:$|[\\/](?:$|[^\\/]*\.js)))[\\/]?$/s
```

## Utilities

The following additional utilities are available, as standalone packages:

- [`zeptomatch-escape`](https://github.com/fabiospampinato/zeptomatch-escape): A little utility for escaping globs before passing them to zeptomatch.
- [`zeptomatch-explode`](https://github.com/fabiospampinato/zeptomatch-explode): A little utility for exploding a zeptomatch-flavored glob into its dynamic and static parts.
- [`zeptomatch-is-static`](https://github.com/fabiospampinato/zeptomatch-is-static): A little utility for checking if a glob is fully static.
- [`zeptomatch-unescape`](https://github.com/fabiospampinato/zeptomatch-unescape): A little utility for removing escape sequences from a glob.

## License

MIT © Fabio Spampinato
