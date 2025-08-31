const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Disable source map loader for problematic packages
      webpackConfig.module.rules.forEach(rule => {
        if (rule.oneOf) {
          rule.oneOf.forEach(oneOfRule => {
            if (oneOfRule.loader && oneOfRule.loader.includes('source-map-loader')) {
              oneOfRule.exclude = [
                // Exclude problematic packages from source map loading
                /node_modules\/@mui/,
                /node_modules\/react-helmet/,
                /node_modules\/react-popper/,
                /node_modules\/recharts/,
                /node_modules\/styled-components/,
                /node_modules\/react-toastify/,
                /node_modules\/clsx/
              ];
            }
          });
        }
      });

      // Disable source maps in production
      if (env === 'production') {
        webpackConfig.devtool = false;
      }

      // Add resolve fallbacks for Node.js modules
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "fs": false,
        "tls": false,
        "net": false,
        "path": false,
        "zlib": false,
        "http": false,
        "https": false,
        "stream": false,
        "crypto": false,
        "util": require.resolve("util/"),
        "buffer": require.resolve("buffer/"),
        "process": require.resolve("process/browser")
      };

      // Ignore source map warnings
      webpackConfig.ignoreWarnings = [
        function ignoreSourcemapsloaderWarnings(warning) {
          return (
            warning.module &&
            warning.module.resource &&
            warning.module.resource.includes("node_modules") &&
            warning.details &&
            warning.details.includes("source-map-loader")
          );
        },
      ];

      return webpackConfig;
    },
  },
  eslint: {
    enable: false,
  },
  typescript: {
    enableTypeChecking: false,
  },
};