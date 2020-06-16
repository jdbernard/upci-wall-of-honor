const PrerenderSPAPlugin = require('prerender-spa-plugin');
const path = require('path');
const merge = require('deepmerge');

process.env.VUE_APP_UPCI_WOH_VERSION = JSON.stringify(
  require('./package.json').version
);

module.exports = {
  devServer: {
    host: 'localhost'
  },

  configureWebpack: {
    plugins: [
      new PrerenderSPAPlugin({
        staticDir: path.join(__dirname, 'dist'),
        routes: ['/', '/deceased-ministers', '/order-of-the-faith']
      })
    ]
  }
};
