module.exports = (config, context) => {
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          use: 'asset/resource',
          options: {
            outputPath: 'assets/',
            name: '[name].[contenthash].[ext]',
          }
        },
      ],
    },
  };
};
