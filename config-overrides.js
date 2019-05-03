const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  webpack(config) {
    if (!config.plugins) {
      config.plugins = [];
    }
    config.plugins.push(new MonacoWebpackPlugin());
    return config;
  }
};
