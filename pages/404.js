// import NoSSR from 'react-no-ssr';
import React, { useEffect, useState  } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
// import { i18n } from 'next-i18next';
import { useTranslation } from 'next-i18next'
import PageContainer from '~/components/layouts/PageContainer';
import PageNoFound from '~/components/elements/PageNoFound';
import { getWinLocale, changeClientSideLanguage, changeServerSideLanguage } from '~/utilities/easy-helpers';  
import useLanguage from '~/hooks/useLanguage';

import Page404 from '~/pages/page/page-404'
import { useRouter } from 'next/router';

const Page404Page = (props) => {
		const Router = useRouter();
		// const { t, i18n } = useTranslation();
		const { t, i18n } = useTranslation();
		const { getDomainsData } = useLanguage();
		const [loading, setLoading] = useState(true);
		useEffect(() => {
			// 重定向到 404Redirect 页面
			Router.replace('/page/page-404');
		}, [Router]);

		// if (typeof window === 'undefined') {
	
		// 	serverSideTranslations(getDomainsData()?.defaultLocale, ['common'])
		// }
		
		const changeLanguage = (lang) => {
					console.log(lang)

			i18n.changeLanguage(lang).then(() => {
				console.log('Language changed to:', lang);
			}).catch(err => console.error('Language change error:', err));
		};


		
    useEffect(async() => {
			// i18n.changeLanguage('zh');
			setLoading(false);
			// const fetchTranslations = async () => {
			// 	const response = await fetch(`/locales/zh/common.json`);
			// 	const data = await response.json();
			// 	console.log(data,'---del')
			// 	await i18n.loadNamespaces('common');
			// 
			// };
			
			// fetchTranslations();
      //   changeClientSideLanguage(getWinLocale())
				// await serverSideTranslations(getDomainsData()?.defaultLocale, ['common'])
    }, [])
		
		return null
		// return <Page404 />
    // return (
    //     // <NoSSR>
    //         <PageContainer>
		// 						<div onClick={() => changeLanguage('zh')} style={{display: 'none'}}>中文</div>
    //             <PageNoFound />
    //         </PageContainer>
    //     // </NoSSR>
    // );
};

export default Page404Page;
  

// export async function getStaticProps({ req }) {
//     const translations = await changeServerSideLanguage(req)

//     return {
//         props: {
//             ...translations,
//         }
//     }
// }

// export async function getServerSideProps({ req }) {
//     const translations = await changeServerSideLanguage(req)

//     return {
//         props: {
//             ...translations,
//         }
//     }
// }

// export async function getServerSideProps(context) {
//     // context.res.writeHead(404, {
//     //     // Location: '/custom-error-page' // 可选：将用户重定向到另一个自定义错误页面
//     // });
//     // context.res.end();
//     // 通过以上方法，你可以确保在 Next.js 中正确地返回404状态码，当用户访问不存在的页面时，系统会显示自定义的404页面，并返回正确的状态码给浏览器，从而帮助搜索引擎正确处理不存在的页面。
//     return { props: {} };
// }
// 软 404  页面未找到，404 - 软 404 是指当用户访问一个不存在的页面时，网站返回的状态码是200（表示成功），而不是标准的404（页面未找到）。这意味着网站会正常加载一个页面，但该页面通常会提示用户所请求的内容不存在。
// 如果你是网站管理员，并且希望避免软 404 问题，你可以考虑以下做法：

// 确保不存在的页面返回正确的404状态码。
// 避免使用 URL 重写将不存在的页面重定向到其他页面。
// 在404页面上提供有用的信息，帮助用户导航到其他相关内容或执行其他操作。