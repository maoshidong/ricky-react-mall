import React from 'react';
import { wrapper } from '~/store/store';
import { CookiesProvider } from 'react-cookie';

// import useLanguage from '~/hooks/useLanguage';
import MasterLayout from '~/components/layouts/MasterLayout';
// 回到顶部按钮、i标签有使用 43kb,打包9k,   <i class="icon icon-cross2"></i>
import '~/public/static/fonts/Linearicons/Font/demo-files/demo.css';
// import '~/scss/_font-awesome.scss';
import '~/public/static/fonts/font-awesome/css/font-awesome.min.css'; // use? 详情页分享图标有用
// import '~/public/static/fonts/iconfont/iconfont.css';
import '~/public/static/css/bootstrap.min.css';
import '~/public/static/css/slick.min.css';
import '~/scss/style.scss';
import '~/scss/home-default.scss';

import '~/scss/technology.scss';

import '~/components/mobile/scss/index.scss'

import '~/scss/elements/_gallery.scss' // 恢复？
import "../node_modules/flag-icons/css/flag-icons.min.css";
import i18n from 'i18next';
import { initReactI18next } from "react-i18next";
import App from 'next/app';
import { getWinLocale } from '~/utilities/easy-helpers';
import CommonRepository from '~/repositories/zqx/CommonRepository';
import { appWithTranslation } from 'next-i18next'
import nextI18nextConfig from '~/next-i18next.config';
// import { ConfigProvider } from 'antd'

// 将语言设置到 i18n 的 lng 属性中
class AppPage extends App {
	// Next.js 版本 9.3 或更高版本，pages/_app.js 中的 getInitialProps(仍可使用 getInitialProps 方法) (已被弃用: 不推荐)。取而代之的是使用 getStaticProps 或 getServerSideProps。
	// static async getInitialProps({ Component, ctx }) {

	//     const domain = getLocale(ctx?.req)
	//     // i18n.changeLanguage("zh");
	//     // let pageProps = {};
	//     // if (Component.getInitialProps) {
	//     //     pageProps = await Component.getInitialProps(ctx);
	//     // }
	//     return {
	//       // pageProps, domain, 
	//       reqLocale: domain,
	//       curDomain: ctx?.req?.headers?.host,
	//     };
	// }
	// static async getServerSideProps({ Component, ctx }) {
	//   let backendData = {};
	//   if (Component.getServerSideProps) {
	//     backendData = await CommonRepository.apiGetSysFunctionTypeSonList({
	//         typeId: 1
	//     });
	//   }
	//   return { backendData };
	// }

	// 定义一个方法
	async initLocales() {
		// this.props.dispatch({ type: 'IS_LOAD_I18' });  
		const resEn = await CommonRepository.getLanguageAdminIfoNext("en") // curDomainsData?.defaultLocale 
		const resZh = await CommonRepository.getLanguageAdminIfoNext("cn") // curDomainsData?.defaultLocale 
		// 将最新的语言包数据更新到 locales 语言包路径中
		i18n.use(initReactI18next).init({
			resources: {
				"en": { translation: resEn?.data },
				"zh": { translation: resZh?.data }, // 恢复中文
				// 其他语言...
			},
			wait: true, // 等待异步加载完成后再进行渲染
			lng: getWinLocale(), // 设置当前语言 getWinLocale()
			fallbackLng: "en", // 设置默认的回退语言            
		});
	}

	addDm() {
		// 		<!-- Google tag (gtag.js) -->
		// <script async src="https://www.googletagmanager.com/gtag/js?id=G-CDWFBKFV3Z"></script>
		// <script>
		//   window.dataLayer = window.dataLayer || [];
		//   function gtag(){dataLayer.push(arguments);}
		//   gtag('js', new Date());

		//   gtag('config', 'G-CDWFBKFV3Z');
		// </script>

		// Google Tag Manager
		// const script1 = document.createElement('script');
		// script1.src = "https://www.googletagmanager.com/gtag/js?id=G-CDWFBKFV3Z";
		// script1.async = true;
		// document.head.appendChild(script1);

		// script1.onload = () => {
		// 	window.dataLayer = window.dataLayer || [];
		// 	function gtag() { dataLayer.push(arguments); }
		// 	gtag('js', new Date());
		// 	gtag('config', 'G-CDWFBKFV3Z');
		// };
	}
	componentDidMount() {
		// i18n.addResourceBundle("en", "translation", resEn?.data);
		// this.initLocales()
	}

	render() {
		const { Component, pageProps } = this.props;
		// const winHost = typeof window !== 'undefined' ? window?.location?.host : '';
		// 报错_app.jsx:1Cannot update a component (`LogoCom`) while rendering a different component (`AppPage`). To locate the bad setState() call inside `AppPage`,
		// if(winHost) {
		// i18n.changeLanguage("zh") // 这里修改没有中文源代码， 因为初始化是没有window, 需要加上if winHost
		// }

		return <CookiesProvider>
			<MasterLayout >
				{/* <ConfigProvider> */}
				<Component {...pageProps} />
			</MasterLayout>
		</CookiesProvider>
	}
}

export default wrapper.withRedux(appWithTranslation(AppPage, nextI18nextConfig));
// export default wrapper.withRedux(connect(null, mapDispatchToProps)(AppPage));

// function AppPage({ Component, pageProps }) {
//     const { setUseLanguage } = useLanguage();

//     useEffect(() => {
//         setUseLanguage()
//     }, []);


//     return (
//         <I18nextWrapper>
//             <CookiesProvider>
//                 <MasterLayout>
//                     <Component {...pageProps} />
//                 </MasterLayout>
//             </CookiesProvider>
//         </I18nextWrapper>
//     );
// }


// export default wrapper.withRedux(AppPage);
