// import i18n from 'i18next';
import { useTranslation, i18n } from 'next-i18next';
import { I18NEXT_DOMAINS, I18NEXT_LOCALE } from '~/utilities/constant'
// import CommonRepository from '~/repositories/zqx/CommonRepository';

export default function useLanguage() {

  const { t } = useTranslation('common');

  // 暂时中文关闭, 恢复时：固定改为false and 搜索: 中文关闭
  const temporaryClosureZh = () => {
    return false
    // return i18n?.language === I18NEXT_LOCALE.zh
  }

  // 当前是否是英文域名
  const curLanguageCodeEn = () => {
    return i18n?.language == I18NEXT_LOCALE.en
  }

  // 当前是否是中文域名
  const curLanguageCodeZh = () => {
    return i18n?.language == I18NEXT_LOCALE.zh
  }

  // 当前语言对应的name
  const getLanguageName = (item, language) => {
    return (i18n?.language == I18NEXT_LOCALE.en || !item?.cname) ? item?.name : item?.cname
  }

  // 获取中文域名下的cname - (多余了? 和 当前语言对应的name 对比)
  const getZhName = item => {
    return (i18n?.language == I18NEXT_LOCALE.zh && item?.cname) ? item?.cname : item?.name
  }

  // 获取当前域名
  const getLanguageHost = () => {
    return i18n?.language === I18NEXT_LOCALE.zh ? process.env.zhUrl : process.env.url
  }

  // 获取当前域名对应logo
  const getLanguageLogo = () => {
    return i18n?.language === I18NEXT_LOCALE.zh ? process.env.zhLogUrl : process.env.logUrl
  }

  // I18NEXT_DOMAINS，获取当前域名对应的数据对象  languageType: getDomainsData()?.defaultLocale,
  const getDomainsData = () => {
    return I18NEXT_DOMAINS?.find(item => item.defaultLocale === i18n?.language)
  }

  const setUseLanguage = async () => {
        return
  }

  // 获取产品空图
  const getLanguageEmpty = () => {
    return `/static/img/products/${curLanguageCodeZh() ? 'zhEmpty.png' : 'empty.png'}`
  }
  
  // 翻译文件 en.json, 插值 interpolation
  // { "welcomeMessage": "Welcome, {{userName}}! You have {{unreadCount}} unread messages." }
  // const { t } = useTranslation();
  // const userName = 'John';     const unreadCount = 5;

  // 当 footer.Purchase Securely 字段不存在或为空时，确实会展示默认值 footer.Purchase Securely。
  // 这是因为在使用 react-i18next 库进行国际化时，默认行为是返回翻译键本身，而不是翻译键的路径。
  // 添加 shouldShowLabel 变量，判断: 如果 translatedLabel 存在且不为空，并且不等于翻译键本身，则展示翻译结果；
  // 否则，展示 item.label 的原始值作为默认值。 这样，当 footer.Purchase Securely 对应的翻译键不存在或为空时
  // options 当配置包含变量时， 插值 interpolation 对象
  const i18Translate = (key, defaultText, options) => {
		// if(key == 'i18Head.products') {
		// 	console.log(i18n.language, 'i18n------del')
		// 	console.log(t(key, options), 't(key, options)------del')
			
		// }
    const translatedLabel = t(key, options);
    const shouldShowLabel = translatedLabel && translatedLabel !== '' && translatedLabel !== key; // 翻译不到文本时， translatedLabel === key
    return shouldShowLabel ? translatedLabel : defaultText
  };
  const i18MapTranslate = (key, defaultText, options) => {
    const translatedLabel = t(key, options);
    const shouldShowLabel = translatedLabel && translatedLabel !== '' && translatedLabel !== key;
    return shouldShowLabel ? translatedLabel : defaultText
  };

  return {
    setUseLanguage, curLanguageCodeEn, curLanguageCodeZh, getLanguageName, getZhName,
    getLanguageHost, getLanguageLogo, getDomainsData, getLanguageEmpty,
    i18Translate, i18MapTranslate, temporaryClosureZh,
  };
}

// !! 的作用是将一个值转换为布尔类型; +a的作用是什么转换为数字


// 实现步骤
// ------ next.config.js -------
// const {i18n} = require('./next-i18next.config')
// i18n
// ------- next-i18next.config.js -------
// module.exports = {
// 	i18n: {
// 		defaultLocale: 'en',
// 		locales: ['en', 'zh'],
// 		localeDetection: false, // Disable automatic locale detection  设置为 true 时，系统会根据用户的浏览器设置或其他信息自动选择语言；
// 		// localeSubpaths: {}, // Disable locale subpaths
// 		domains: [
// 			{
// 				domain: 'www.origin-ic.com',
// 				defaultLocale: 'en',
// 				locales: ['en'],
// 			},
// 			{
// 					domain: 'localhost', // localhost:3003/  www.szxlxc.com
// 					defaultLocale: 'zh',
// 					locales: ['zh'],
// 			},
// 	],
// 	},
// 	debug: false
// }



// 多语言官方文档-s
// const getStaticProps = makeStaticProps(['404', 'common', 'footer'])
// export { getStaticPaths, getStaticProps }
// 多语言官方文档-e

// serverSideTranslations 函数本身并不直接翻译文本，而是用于确保在服务器端渲染时，翻译文件已经被正确加载。这使得你能够在服务器端渲染的过程中使用翻译数据，而不只是客户端。

// 使用 serverSideTranslations 的步骤
// 安装依赖

// 确保你已经安装了 next-i18next 和其相关依赖：

// bash
// npm install next-i18next
// 配置 next-i18next

// 配置文件 next-i18next.config.js 应该在项目根目录中：

// javascript
// // next-i18next.config.js
// module.exports = {
//   i18n: {
//     defaultLocale: 'en',
//     locales: ['en', 'de'],
//   },
// };
// 在页面组件中使用 serverSideTranslations

// 在页面的 getServerSideProps 或 getStaticProps 中使用 serverSideTranslations 来加载翻译数据：

// javascript
// // pages/index.js
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// import { useTranslation } from 'next-i18next';

// export async function getServerSideProps({ locale }) {
//   return {
//     props: {
//       ...(await serverSideTranslations(locale, ['common'])),
//     },
//   };
// }

// export default function HomePage() {
//   const { t } = useTranslation('common');

//   return (
//     <div>
//       <h1>{t('welcome_message')}</h1>
//     </div>
//   );
// }
// 翻译文本

// 在你的翻译文件中定义翻译文本。例如，在 public/locales/en/common.json 中：

// json
// {
//   "welcome_message": "Welcome to our website!"
// }
// 工作流程
// serverSideTranslations 函数

// serverSideTranslations(locale, ['common']) 会加载指定语言的翻译文件，并将其传递给页面组件的 props。['common'] 表示你要加载的命名空间，如果你有其他命名空间可以在这里添加。

// useTranslation 钩子

// 在页面组件中使用 useTranslation('common') 钩子来访问翻译函数 t(), 通过 t('welcome_message') 方法获取翻译文本。

// 渲染翻译文本

// t('welcome_message') 会根据当前语言返回对应的翻译文本。

// 示例
// 假设你在 public/locales/en/common.json 和 public/locales/de/common.json 文件中分别定义了 welcome_message 的翻译文本，使用 serverSideTranslations 可以确保服务器端和客户端都能正确获取到这些翻译文本。

// 这样，无论是在服务器端渲染还是客户端渲染，useTranslation 钩子都能够正确地翻译文本。


// 代码备份  
// https://support.typora.io/Quick-Start/   https://support.typora.io/Markdown-Reference/   https://theme.typora.io/doc/   https://support.typora.io/
// https://www.7-zip.org/ 
// Vue.set  this.$set    https://juejin.cn/post/7383100103000752138
// import { mapGetters, mapState } from "vuex";
// computed: {
// 	...mapState(["settings"]),
// 	...mapGetters(["sidebarRouters", "sidebar"]),
// server {
//   listen 80;
//   server_name yourdomain111.com;
//   location = /robots.txt {
//     alias /path/to/robots111.txt;
//   }
// }

// https://www.origin-ic.com/robots.txt
// /datarvices/frontend/mall/public

// /404      location 设置为/page/page-404

// 在 JavaScript 中，对象和数组是引用类型，这意味着如果你将一个对象赋值给另一个变量，实际上它们指向的是同一个内存地址。因此，当你修改其中一个对象的属性时，另一个对象也会受到影响。

// 在你的代码中，this.formData 和 this.initFormData 都是指向同一个对象的引用。当你执行 this.formData = pubData 时，this.formData 和 this.initFormData 实际上仍然引用同一个 pubData 对象的内存地址，因此它们的属性会同步变化。

// 解决方法
// 要避免这种情况，可以使用浅拷贝或深拷贝来复制对象。以下是几种常见的方法：

// 浅拷贝（使用 Object.assign 或扩展运算符）：

// javascript
// this.formData = { ...pubData }; // 使用扩展运算符进行浅拷贝
// this.initFormData = { ...pubData }; // 另一种方式
// 深拷贝（使用 JSON.parse 和 JSON.stringify，注意这种方法会丢失函数和特殊对象）：

// javascript
// this.formData = JSON.parse(JSON.stringify(pubData));
// this.initFormData = JSON.parse(JSON.stringify(pubData));
// 使用 lodash 的 cloneDeep（如果你使用 lodash 库）：

// javascript
// import cloneDeep from 'lodash/cloneDeep';
// this.formData = cloneDeep(pubData);
// this.initFormData = cloneDeep(pubData);
// 使用这些方法后，formData.emailPassword 的变化将不会影响到 initFormData.emailPassword。选择合适的方法取决于你的具体需求和对象的复杂性。
 