module.exports = {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      sourceExts: ['jsx', 'js', 'ts', 'tsx'],
      blockList: [/\/node_modules\/@react-native\/js-polyfills\/error-guard.js/]
    }
  };