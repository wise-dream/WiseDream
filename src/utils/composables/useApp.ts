import { readonly, ref } from 'vue';

export const useApp = () => {
  const appName = ref('WiseDream Portfolio');
  const appVersion = ref('1.0.0');

  return {
    appName: readonly(appName),
    appVersion: readonly(appVersion),
  };
};
