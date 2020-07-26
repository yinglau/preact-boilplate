const webpack = require('webpack');
const path = require('path');
const envCfg = require('./env').default;

const node_env = process.env.NODE_ENV;

const CompressionPlugin = require('compression-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');


export default {
  webpack(config, env, helpers, options) {
    if (node_env === 'prod' || node_env === 'dev') {
      const fileLoader = helpers.getLoadersByName(config, 'file-loader');

      config.output.publicPath = envCfg[node_env]['PUBLIC_PATH'];

      fileLoader[0].rule.options = {
        outputPath: envCfg[node_env]['STATIC_PATH'],
        publicPath: envCfg[node_env]['PUBLIC_PATH'] + envCfg[node_env]['STATIC_PATH'],
      }

      const pushPlugins = [
        new CompressionPlugin({
          algorithm: 'gzip',
          test: /\.(js|css)$/,
        }),
        new webpack.DllReferencePlugin({
          // 注意: DllReferencePlugin 的 context 必须和 package.json 的同级目录，要不然会链接失败
          context: path.resolve(__dirname, './'),
          manifest: path.resolve(__dirname, 'dll/dll.manifest.json'),
        }),
        new AddAssetHtmlPlugin({
          filepath: path.resolve(__dirname, 'dll/dll.js'),
        }),
      ];

      config.plugins = [
        ...config.plugins,
        ...pushPlugins,
      ]

    }

    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve('src'),
      '@@': path.resolve('src/components'),
    }

    config.plugins.push(new webpack.DefinePlugin({
      API_BASEURL: JSON.stringify(envCfg[node_env]['API_BASEURL']),
    }));
  }
}