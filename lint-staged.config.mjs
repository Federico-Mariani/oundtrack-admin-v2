export default {
  '*.{ts,html}': ['eslint --fix', 'prettier --write'],

  '*.{css,scss,json,md,mjs}': ['prettier --write'],
};
