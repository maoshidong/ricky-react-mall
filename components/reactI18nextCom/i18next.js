import i18n from "i18next";

import { initReactI18next } from "react-i18next";
import enTranslation from 'public/locales/en/common.json'
import cnTranslation from 'public/locales/en/common.json' // 恢复中文

// import { fillEmptyValues } from '~/utilities/common-helpers'
import { I18NEXT_DOMAINS, I18NEXT_LOCALE } from '~/utilities/constant'
import Backend from 'i18next-xhr-backend';
// import HttpBackend from 'i18next-http-backend';
// import CommonRepository from '~/repositories/zqx/CommonRepository';

  const domain = typeof window !== 'undefined' ? window.location.host : I18NEXT_LOCALE.enHost;
  // 根据域名加载对应的语言资源文件,
  const curDomainsData = I18NEXT_DOMAINS?.find(item => item.domain == domain)
  const lng = curDomainsData?.defaultLocale || I18NEXT_LOCALE.en


  // 保证默认语言的正常显示
  const resources = {
    'en': { translation: enTranslation },
    'zh': { translation: cnTranslation },
  };

  i18n
  .use(Backend)
  .use(initReactI18next) 
  .init({
    lng, // 当前语言资源文件
    fallbackLng: lng, // 回退语言
    resources,
    locales: ['en', 'zh'],
    // 出现部分元素显示为中文的情况可能是由于异步加载语言包的过程中造成的。在初始化过程中，你设置了wait: false，这意味着在语言包加载完成之前，页面会继续渲染。因此，在语言包尚未完全加载完成时，部分元素可能会显示默认的语言（比如中文）。
    wait: true, // 等待异步加载完成后再进行渲染
    // backend: {
    //   loadPath: '/web/webLanguage/getLanguageAdminIfo?languageType=en', // 后端接口地址
    //   ajax: customAjax, // 设置自定义的ajax函数
    //   parse: (data) => {
    //     // 解析语言资源文件，将其返回给 i18next
    //     return JSON.parse(data).data.data;
    //   },
    // },
    // 其他配置...
  });
  // i18n.changeLanguage(lng); // 加了源代码就没有了

  export default i18n;
