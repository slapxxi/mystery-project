module.exports = {
  env: {
    development: {
      presets: [
        [
          'next/babel',
          {
            'preset-env': {
              debug: true,
              modules: false,
              targets: {
                chrome: 75,
              },
            },
            'transform-runtime': {
              corejs: false,
            },
          },
        ],
      ],
      plugins: [
        'babel-plugin-macros',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-optional-chaining',
      ],
    },

    production: {
      presets: [
        [
          'next/babel',
          {
            'preset-env': {
              modules: false,
              targets: {
                chrome: 60,
                safari: 12,
              },
            },
            'transform-runtime': {
              corejs: false,
            },
          },
        ],
      ],
      plugins: [
        'babel-plugin-macros',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-optional-chaining',
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
      ],
    },
  },
};
