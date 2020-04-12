const merge = require("deepmerge");
const VERSION = {
  "process.env": {
    UPCI_WOH_VERSION: JSON.stringify(require("./package.json").version)
  }
};

module.exports = {
  chainWebpack: config => {
    config
      .plugin("define")
      .tap(args => merge(args, [VERSION]));
  }
};
