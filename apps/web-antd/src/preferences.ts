import { defineOverridesPreferences } from '@vben/preferences';

/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 */
export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    authPageLayout: 'panel-center',
    name: import.meta.env.VITE_APP_TITLE,
    watermark: false,
  },
  copyright: {
    companyName: 'admin',
    companySiteLink: 'https://github.com',
  },
  theme: {
    builtinType: 'default',
    mode: 'light',
    semiDarkSidebar: false,
    radius: '0.25',
  },
  sidebar: {
    width: 200,
  },
  breadcrumb: {
    showHome: true,
  },
});
