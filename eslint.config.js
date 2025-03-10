// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'max-statements-per-line': 'off',
    'no-console': 'off',
    'no-unused-vars': 'off',
    'unused-imports/no-unused-vars': 'off',
    '@stylistic/js/max-statements-per-line': 'off',
    'style/max-statements-per-line': 'off',
    'node/prefer-global/buffer': ['error', 'always'],
  },
})
