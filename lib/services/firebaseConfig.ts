import getConfig from 'next/config';

let { publicRuntimeConfig } = getConfig();

let firebaseConfig = {
  ...publicRuntimeConfig.firebase,
};

export default firebaseConfig;
