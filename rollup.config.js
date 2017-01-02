import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/content_scripts/js/scripts.js',
  plugins: [ babel() ],
  format: 'umd'
};
