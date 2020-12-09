process.env.VUE_APP_UPCI_WOH_VERSION = require('./package.json').version;

process.env.VUE_APP_UPCI_WOH_GIT_HASH = JSON.stringify(
  require('git-describe').gitDescribeSync('.')
);

module.exports = {
  devServer: {
    host: 'localhost'
  },

  pluginOptions: {
    prerenderSpa: {
      registry: undefined,
      renderRoutes: [
        '/',
        '/deceased-ministers/',
        '/order-of-the-faith/',
        '/leadership/',
        '/leadership/executive/',
        '/leadership/ministries/',
        '/leadership/general-board/',
        '/admin/',
        '/admin/all-ministers/',
        '/admin/order-of-the-faith/',
        '/admin/leadership/',
        '/admin/leadership/executive/',
        '/admin/leadership/ministries/',
        '/admin/leadership/general-board/'
      ],
      useRenderEvent: false,
      headless: true,
      onlyProduction: true
    }
  }
};
