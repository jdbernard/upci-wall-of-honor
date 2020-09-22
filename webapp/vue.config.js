const PrerenderSPAPlugin = require('prerender-spa-plugin');
const path = require('path');

process.env.VUE_APP_UPCI_WOH_VERSION = require('./package.json').version;

process.env.VUE_APP_UPCI_WOH_GIT_HASH = JSON.stringify(
  require('git-describe').gitDescribeSync('.')
);

module.exports = {
  devServer: {
    host: 'localhost'
  },

  configureWebpack: {
    plugins: [
      new PrerenderSPAPlugin({
        staticDir: path.join(__dirname, 'dist'),
        routes: ['/', '/deceased-ministers', '/order-of-the-faith', '/admin']
      })
    ]
  }
};
