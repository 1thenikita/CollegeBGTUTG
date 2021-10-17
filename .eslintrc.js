module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: './',
  },
  ignorePatterns: ["types/*.ts", "*.js"],
  rules: {
    'prefer-const': ['error', {"destructuring": "all"}],
    'prettier/prettier': ['error', { "endOfLine": "auto" }],
    "no-console": "error",
    "@typescript-eslint/no-non-null-assertion": "off",
    '@typescript-eslint/no-use-before-define': "off",
    '@typescript-eslint/interface-name-prefix':  "off",
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/class-name-casing': "off",
    '@typescript-eslint/ban-ts-comment': 'off',
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "variable",
        "format": ["camelCase", "UPPER_CASE", "PascalCase"]
      }
    ],
  },
};
