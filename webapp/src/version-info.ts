export interface VersionInfo {
  version: string;
  hash: string;
  raw: string;
}

const gitVersion: { hash: string; raw: string } = process.env
  .VUE_APP_UPCI_WOH_GIT_HASH
  ? JSON.parse(process.env.VUE_APP_UPCI_WOH_GIT_HASH)
  : { hash: 'missing', raw: 'missing' };

export const VERSION: VersionInfo = {
  ...gitVersion,
  version: process.env.VUE_APP_UPCI_WOH_VERSION || 'unavailable'
};

export default VERSION;
