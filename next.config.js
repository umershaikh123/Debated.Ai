const withPWA = require('next-pwa')({
  disable: process.env.NODE_ENV === 'development',
  dest: 'public',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  reactStrictMode: false,
  pageExtensions: ['page.js', 'api.js', '.js'],
  images: {
    domains: [
      'ui-avatars.com',
      'this-person-does-not-exist.com',
      'lh3.googleusercontent.com',
      'api.genderize.io',
      'randomuser.me',
    ],
  },
  webpack(config, { isServer }) {
    // Run custom scripts
    if (isServer) {
      // require('./scripts/generate-sitemap');
      require('./scripts/draco');
    }

    // Import `svg` files as React components
    config.module.rules.push({
      test: /\.svg$/,
      resourceQuery: { not: [/url/] },
      use: [{ loader: '@svgr/webpack', options: { svgo: false } }],
    });

    // Import videos, models, hdrs, and fonts
    config.module.rules.push({
      test: /\.(mp4|hdr|woff|woff2)$/i,
      type: 'asset/resource',
    });

    // Import models
    config.module.rules.push({
      test: /\.(glb|fbx)$/i,
      type: 'asset/resource',
    });

    // Force url import with `?url`
    config.module.rules.push({
      resourceQuery: /url/,
      type: 'asset/resource',
    });

    // Import `.glsl` shaders
    config.module.rules.push({
      test: /\.glsl$/,
      type: 'asset/source',
    });

    return config;
  },
});
