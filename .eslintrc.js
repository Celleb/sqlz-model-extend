module.exports = {
    parser: '@typescript-eslint/parser',
    root: true,
    env: {
        node: true,
        amd: true,
        browser: true,
        es6: true,
    },
    extends: [
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
    },
    rules: {},
    settings: {},
};
