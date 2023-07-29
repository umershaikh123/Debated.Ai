module.exports = {
  plugins: {
    'postcss-flexbugs-fixes': {},
    '@csstools/postcss-global-data': { files: ['src/layouts/App/mediaQueries.css'] },
    'postcss-custom-media': {},
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
      features: {
        'nesting-rules': true,
      },
    },
  },
};
