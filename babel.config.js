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
              targets: 'last 1 Chrome version',
            },
            'transform-runtime': {
              corejs: false,
            },
          },
        ],
      ],
      plugins: ['babel-plugin-macros'],
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

  // env: {
  //   development: {
  //     presets: [
  //       [
  //         [
  //           'next/babel',
  //           {
  //             modules: false,
  //           },
  //         ],
  //         {
  //           'preset-env': {
  //             targets: 'last 1 Chrome version',
  //             useBuiltIns: false,
  //           },
  //         },
  //       ],
  //     ],
  //   },
  //   production: {
  //     presets: [
  //       [
  //         'next/babel',
  //         {
  //           'preset-env': {
  //             targets: {
  //               chrome: '65',
  //               safari: '11.1',
  //               firefox: '60',
  //               edge: '17',
  //             },
  //           },
  //         },
  //       ],
  //     ],
  //   },
  //   test: {
  //     presets: [
  //       [
  //         'next/babel',
  //         {
  //           'preset-env': {
  //             targets: {
  //               node: 'current',
  //             },
  //           },
  //         },
  //       ],
  //     ],
  //   },
  // },
  // plugins: ['babel-plugin-macros'],
};
