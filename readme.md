# Zeptomatch

An absurdly small glob matcher that packs a punch.

## Overview

The following syntax is supported:

| Syntax      | Description                                                                                                                         |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `*`         | Matches any character, except for the path separator, zero or more times.                                                           |
| `**`        | Matches any character zero or more times. If it doesn't span the entire length of a path segment it's interpreted as a `*` instead. |
| `?`         | Matches any character, except for the path separator, one time.                                                                     |
| `\`         | Matches the character after it in the glob literally. This is the escape operator.                                                  |
| `[abc]`     | Matches any of the characters in the class one time.                                                                                |
| `[a-z]`     | Matches any of the characters in the range in the class one time.                                                                   |
| `[^abc]`    | Matches any character, except for the characters the class, and the path separator, one time.                                       |
| `[^a-z]`    | Matches any character, except for the characters in the range in the class, and the path separator, one time.                       |
| `{foo,bar}` | Matches any of the alternations, which are separated by a comma, inside the braces.                                                 |
| `!glob`     | Matches anything except the provided glob. Negations can only be used at the start of the glob.                                     |
| `!!glob`    | Matches the provided glob. Negations can only be used at the start of the glob.                                                     |

Additional features and details:

- Zeptomatch works pretty similarly to [`picomatch`](https://github.com/micromatch/picomatch), since 1000+ of its tests are being used by this library.
- Zeptomatch is opinionated, there are no options at all, which helps with keeping it tiny and manageable.
- Zeptomatch is automatically memoized, the only ways to use it are always the most optimized ones available.
- Zeptomatch automatically normalizes path separators, since matching Windows-style paths would most likely be a mistake.
- Zeptomatch supports compiling a glob to a standalone regular expression.
- Zeptomatch doesn't do anything special for file names starting with a dot.
- Zeptomatch supports nesting braces indefinitely.

Limitations:

- POSIX classes (e.g. `[:alnum:]`) are not supported. Implementing them seems a bit out of scope for a "zepto"-level library.
- Extglobs (e.g. `?(foo)`) are not supported. They might be in the future though.

## Install

```sh
npm install --save zeptomatch
```

## Usage

```ts
import zeptomatch from 'zeptomatch';

// Check if a glob matches a path

zeptomatch ( '*.js', 'abcd' ); // => false
zeptomatch ( '*.js', 'a.js' ); // => true
zeptomatch ( '*.js', 'a.md' ); // => false
zeptomatch ( '*.js', 'a/b.js' ); // => false

// Compile a glob to a regular expression

const re = zeptomatch.compile ( '*.js' ); // => /^[^/]*\.js$/s
```

## License

MIT © Fabio Spampinato
