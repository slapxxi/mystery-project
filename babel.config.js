module.exports = {
  env: {
    development: {
      presets: [
        [
          'next/babel',
          {
            'preset-env': {
              targets: 'last 1 Chrome version',
            },
          },
        ],
        '@zeit/next-typescript/babel',
      ],
    },
    production: {
      presets: [
        [
          'next/babel',
          {
            'preset-env': {
              targets: {
                chrome: '65',
                safari: '11.1',
                firefox: '60',
                edge: '17',
              },
            },
          },
        ],
        '@zeit/next-typescript/babel',
      ],
    },
    test: {
      presets: [
        [
          'next/babel',
          {
            'preset-env': {
              targets: {
                node: 'current',
              },
            },
          },
        ],
        '@zeit/next-typescript/babel',
      ],
    },
  },

  plugins: ['babel-plugin-macros'],
};
