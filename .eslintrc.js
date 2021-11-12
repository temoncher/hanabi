/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

/**
 * @param {string} source
 */
const getDirectories = (source) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const foldersInsideSrc = getDirectories(path.join(__dirname, 'src'));
const foldersInsideSrcPattern = `*(${foldersInsideSrc.join('|')})`;

/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    'plugin:prettier/recommended',
    'eslint:recommended',
    'plugin:jest/recommended',
    'react-app',
    'react-app/jest',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'airbnb-typescript',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  globals: {
    jest: true,
  },
  rules: {
    // [Plugin:Import](https://github.com/benmosher/eslint-plugin-import)
    'import/order': [
      1,
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
        pathGroups: [
          {
            pattern: `{${foldersInsideSrcPattern},${foldersInsideSrcPattern + '/**'}}`,
            group: 'external',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['constants'], // because `constants` folder conflicts with builtin `node/constants` types
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: false,
        },
        warnOnUnassignedImports: true,
      },
    ],
    'import/prefer-default-export': 0,
    'import/extensions': 0,

    // [Suggestions](https://eslint.org/docs/rules/#suggestions)
    'arrow-body-style': 1,

    // [Best practices](https://eslint.org/docs/rules/#best-practices)
    complexity: [2, 6],
    'no-param-reassign': 2,

    // [Stylistic Issues](https://eslint.org/docs/rules/#stylistic-issues)
    'array-bracket-newline': [1, 'consistent'],
    'function-call-argument-newline': [1, 'consistent'],
    'func-style': [1, 'expression'],
    'function-paren-newline': [1, 'multiline-arguments'],
    'id-denylist': [2, 'data', 'err', 'e', 'cb', 'idx', 'ndx', 'index', 'callback', 'handleChange', 'handleClick', 'handleSubmit', 'handleInput'],
    'prefer-exponentiation-operator': 2,
    'padding-line-between-statements': [
      1,
      {
        blankLine: 'always',
        prev: ['const', 'let', 'var'],
        next: '*',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: ['if', 'try', 'class', 'export'],
      },
      {
        blankLine: 'always',
        prev: ['if', 'try', 'class', 'export'],
        next: '*',
      },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var', 'export'],
        next: ['const', 'let', 'var', 'export'],
      },
      {
        blankLine: 'always',
        prev: ['expression'],
        next: ['const', 'let', 'var'],
      },
      {
        blankLine: 'always',
        prev: '*',
        next: ['return'],
      },
    ],

    // [ES6](https://eslint.org/docs/rules/#ecmascript-6)
    'arrow-spacing': 1,
    'no-restricted-exports': [
      1,
      {
        restrictedNamedExports: ['default', 'then'],
      },
    ],

    // [Plugin:TypeScript ESLint](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin)
    '@typescript-eslint/array-type': 1,
    '@typescript-eslint/consistent-indexed-object-style': [1, 'record'],
    '@typescript-eslint/consistent-type-assertions': [
      2,
      {
        assertionStyle: 'as',
        objectLiteralTypeAssertions: 'never',
      },
    ],
    '@typescript-eslint/member-delimiter-style': [
      1,
      {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
      },
    ],
    '@typescript-eslint/member-ordering': 2,
    '@typescript-eslint/method-signature-style': [2, 'property'],
    '@typescript-eslint/naming-convention': [
      2,
      {
        selector: 'default',
        format: ['camelCase', 'PascalCase'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
      },
      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
      },
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase'],
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      {
        selector: 'interface',
        prefix: ['I'],
        format: ['PascalCase'],
      },
      {
        selector: 'enumMember',
        format: ['UPPER_CASE'],
      },
    ],
    '@typescript-eslint/no-base-to-string': 1,
    '@typescript-eslint/no-confusing-non-null-assertion': 1,
    '@typescript-eslint/no-confusing-void-expression': 1,
    '@typescript-eslint/no-dynamic-delete': 1,
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/no-implicit-any-catch': 2,
    '@typescript-eslint/no-invalid-void-type': 2,
    '@typescript-eslint/no-parameter-properties': [
      2,
      {
        allows: ['private readonly'],
      },
    ],
    '@typescript-eslint/no-unnecessary-condition': 1,
    '@typescript-eslint/no-unnecessary-qualifier': 1,
    '@typescript-eslint/no-unnecessary-type-constraint': 1,
    '@typescript-eslint/prefer-for-of': 1,
    '@typescript-eslint/prefer-reduce-type-parameter': 1,
    '@typescript-eslint/prefer-string-starts-ends-with': 1,
    '@typescript-eslint/promise-function-async': 1,
    '@typescript-eslint/switch-exhaustiveness-check': 2,
    '@typescript-eslint/type-annotation-spacing': 1,
    '@typescript-eslint/default-param-last': 2,
    '@typescript-eslint/explicit-function-return-type': 0,

    'no-duplicate-imports': 0,
    '@typescript-eslint/no-duplicate-imports': 2,

    'no-invalid-this': 0,
    '@typescript-eslint/no-invalid-this': 2,

    'no-loss-of-precision': 0,
    '@typescript-eslint/no-loss-of-precision': 2,

    'no-return-await': 0,
    '@typescript-eslint/return-await': 2,

    '@typescript-eslint/indent': 0, // conflicts with Prettier
    '@typescript-eslint/comma-dangle': 0, // conflicts with Prettier
    '@typescript-eslint/space-before-function-paren': 0, // conflicts with Prettier
  },
};
