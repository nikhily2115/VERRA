module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    'jsx-a11y/anchor-is-valid': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'no-unused-vars': 'warn'
  }
};