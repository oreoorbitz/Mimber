import js from '@eslint/js'
import globals from 'globals'

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        Shopify: 'readonly',
        timber: 'readonly',
        ajaxCart: 'readonly',
        mepto: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      'no-undef': 'error',
      'no-redeclare': 'error',
      'prefer-const': 'warn',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-constant-binary-expression': 'warn',
      'no-self-assign': 'off',
    },
  },
  {
    ignores: ['dist/**', 'dist/theme/**', 'vendor/**', 'node_modules/**', 'assets/timber.human.js', 'assets/timber.js.liquid', 'assets/ajax-cart.js.liquid'],
  },
]
