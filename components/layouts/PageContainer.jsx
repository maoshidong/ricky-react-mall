import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { connect, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import { useCookies } from 'react-cookie';
import { Spin } from 'antd';

import dynamic from 'next/dynamic';


const MobilePageContainer = dynamic(() => import('~/components/mobile/components/layouts/PageContainer'));
const HeaderDefault = dynamic(() => import('~/components/shared/headers/zqx/HeaderDefault'));
const ReactLoadingg = dynamic(() => import('~/components/layouts/ReactLoadingg')); // 头部加载状态条
const RightFixed = dynamic(() => import('~/components/layouts/RightFixed')); // 右侧固定部分
// const MinNotice = dynamic(() => import('~/components/News/MinCom/MinNotice')); // 通知
const Device = dynamic(() => import('~/components/hoc/Device')); // 判断设备

const FooterFullwidth = dynamic(() => import('~/components/shared/footers/FooterFullwidth')); // 底部
const AgreeCookies = dynamic(() => import('~/components/elements/min/AgreeCookies')); // 同意cookie

// import FooterFullwidth from '~/components/shared/footers/FooterFullwidth';
// import AgreeCookies from '~/components/elements/min/AgreeCookies'; // 同意cookie

import { setPageLoading } from '~/store/setting/action';
import { logOut } from '~/store/auth/action';
import { LOGIN } from '~/utilities/sites-url';
import useLanguage from '~/hooks/useLanguage';

// import Device from '~/pages/currentDevice'
import styles from "./_reactLoading.module.scss";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { getExpiresTime } from '~/utilities/common-helpers';
import { PAYPAL_INITIAL_OPTIONS, I18NEXT_LOCALE } from '~/utilities/constant';

import {
	ProductRepository, ManufacturerRepository, outProductRepository,
	NewsRepository, CatalogRepository, CommonRepository, OrderRepository
} from '~/repositories';


// seo头部
const renderHead = (seo, host, isResetCanonical = true) => {
	const Router = useRouter();
	const canonicalUrl1 = Router.asPath?.split("?")?.[0] // 每个页面不带参数的完整url(之前的逻辑， 现在只去掉分页, 不带参数的供alternate使用)
	const { pageNum, pageSize } = Router.query;
	
	// 创建一个 URL 对象  URL 对象用于表示和操作 URL（统一资源定位符）。它提供了一个结构化的方式来访问 URL 的不同部分，如协议、主机、路径和查询参数等。
	let canonicalUrl = new URL(Router.asPath, host); // 需要提供一个基本 URL
	let params = new URLSearchParams(canonicalUrl.search); // URLSearchParams 对象用于处理 URL 查询字符串。它提供了方法来检索、添加、更新或删除查询参数。
	//params.delete('pageNum');
	//params.delete('pageSize');
	// 重新设置 URL 对象的查询部分 
	canonicalUrl.search = params.toString();

	const getPaginationUrl = (newPageNum) => {
		let paginationParams = new URLSearchParams();
		if (pageSize) paginationParams.set('pageSize', pageSize);
		if (newPageNum && newPageNum > 1) paginationParams.set('pageNum', newPageNum);

		for (const [key, value] of params.entries()) {
			if (key !== 'pageSize' && key !== 'pageNum') {
				paginationParams.append(key, value);
			}
		}

		return `${host}${canonicalUrl1}?${paginationParams.toString()}`;
	};

	const nextUrl = pageNum ? getPaginationUrl(parseInt(pageNum) + 1) : null;
	const prevUrl = pageNum && parseInt(pageNum) > 1 ? getPaginationUrl(parseInt(pageNum) - 1) : null;
	
	const getCanonicalUrl = () => {
		let canonicalParams = new URLSearchParams();
		
		// Include pageNum only if it’s greater than 1
		if (pageNum && parseInt(pageNum) > 1) canonicalParams.set('pageNum', pageNum);
		
		// Include pageSize if it’s defined
		if (pageSize) canonicalParams.set('pageSize', pageSize);
		
		// Build the canonical URL
		return `${host}${canonicalUrl1}${canonicalParams.toString() ? '?' + canonicalParams.toString() : ''}`;
	};
	
	const canonicalHref = getCanonicalUrl();
	


	// 新闻有可能没发布，所以需要判断
	const isShowAlternate = () => {
		const { route } = Router
		const paths = [
			'/blog/[...slugs]', '/application-notes/[...slugs]',
			'/product-highlights/[...slugs]', '/news/[...slugs]',
			'/help-center/[...slugs]', '/videos/[...slugs]',
		];
		if (paths.some(i => route.includes(i))) {
			return false
		}
		return true
	}
	// const flag = false
	// if (seo && flag) {
	//     const {
	//         metaDescription,
	//         metaImage,
	//         keywords,
	//     } = seo;
	//     return (
	//         <>
	//             <Head>
	//                 <link rel="canonical" href={`${host}${canonicalUrl}`} />
	//                 <title>{process.env.title}</title>
	//                 <meta property="og:title" content={process.env.title} key="og:title" />
	//                 <meta name="description" content={metaDescription} key="description" />
	//                 <meta name="keywords" content={keywords} key="keywords" />
	//                 <meta name="viewport" content="width=device-width, initial-scale=1.0" key="viewport" />
	//                 <meta property="og:description" content={metaDescription} key="og:description" />
	//                 <meta property="og:image" content={metaImage?.data?.attributes?.url} key="og:image" />
	//                 <meta property="og:type" content="website" />

	//             </Head>
	//         </>
	//     );
	// } 
	// else {
	return (
		// 站点链接搜索框 (WebSite) 结构化数据   只将此标记添加到首页，而不要将其添加到其他任何网页
		<Head>
			{/* canonical标签是为了解决网址规范化问题，告诉搜索引擎那个网址才是最重要的。网页可以不带canonical标签。 pathname asPath
				我发现很多网站的页面都会带上canonical标签， 链接指向本页面；如果链接指向非本页面， 那谷歌很多时候（非绝对）就不会抓取该页面。 */}
			{/* 自引用 hreflang，所以得使用完整的Router.asPath */}
			{isShowAlternate() && <link rel="alternate" href={`https://www.origin-ic.com${Router.asPath}`} hrefLang={I18NEXT_LOCALE.en} />}
			{isShowAlternate() && <link rel="alternate" href={`https://www.szxlxc.com${Router.asPath}`} hrefLang={I18NEXT_LOCALE.zh} />}
			{isShowAlternate() && <link rel="alternate" href={`https://www.origin-ic.com${Router.asPath}`} hrefLang="x-default" />}

			{nextUrl && <link rel="next" href={nextUrl} />}
			{prevUrl && <link rel="prev" href={prevUrl} />}

			{isResetCanonical && <link rel="canonical" href={canonicalHref} />}
			<meta property="og:url" content={canonicalHref} key="og:url" />
			{/* <meta name="robots" content="index,follow"></meta> */}
			<meta name="robots" content="index,follow" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" key="viewport" />
			<meta name="twitter:card" content="summary_large_image" />
			<meta property="og:type" content="website" />
			
			{/* <!-- Google Tag Manager --> */}
			{/* <link rel="dns-prefetch" href="//www.googletagmanager.com" />
			<link rel="preconnect" href="//www.googletagmanager.com" /> */}

			{/* <!-- Cloudflare --> */}
			{/* <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
			<link rel="preconnect" href="//cdnjs.cloudflare.com" /> */}

			{/* <!-- Origin-ic.net  -                    不要.ent --> */}
			{/* <link rel="dns-prefetch" href="//origin-ic.net" />
			<link rel="preconnect" href="//origin-ic.net" /> */}

			{/* <!-- Google / DoubleClick Ads --> */}
			{/* <link rel="dns-prefetch" href="//googleads.g.doubleclick.net" />
			<link rel="preconnect" href="//googleads.g.doubleclick.net" />
			<link rel="dns-prefetch" href="//adservice.google.com" />
			<link rel="preconnect" href="//adservice.google.com" /> */}

			{/* <!-- Google Analytics --> */}
			{/* <link rel="dns-prefetch" href="//www.google-analytics.com" />
			<link rel="preconnect" href="//www.google-analytics.com" />
			<link rel="dns-prefetch" href="//analytics.google.com" />
			<link rel="preconnect" href="//analytics.google.com" /> */}

			{/* <!-- PayPal --> */}
			{/* <link rel="dns-prefetch" href="//www.paypal.com" />
			<link rel="preconnect" href="//www.paypal.com" />
			<link rel="dns-prefetch" href="//www.paypalobjects.com" />
			<link rel="preconnect" href="//www.paypalobjects.com" /> */}

			{/* <!-- Preload for Critical Resources --> */}
			{/* <link rel="preload" href="https://www.googletagmanager.com/gtag/js?id=G-CDWFBKFV3Z" as="script" />
			<link rel="preload" href="https://www.google-analytics.com/analytics.js" as="script" /> */}
			{/* <script src="//cdn.shopify.com/s/files/1/0565/7503/3493/files/omsl1.js?v=1726147437" type="text/javascript"></script>	 */}

		</Head>
	)
	// }
}

const initHeaders = (header) => {
	return (
		<>
			<HeaderDefault header={header} />
		</>
	);
}

const initFooters = (footer, cartHideFooter, paramMap) => {
	return (
		<>
			<FooterFullwidth footer={footer} cartHideFooter={cartHideFooter} paramMap={paramMap} />
		</>
	);
}

const PageContainer = ({
	paramMap,
	seo,
	global,
	children,
	setting,
	auth,
	pageOtherParams = {
		showHead: true,
		showFooter: true,
	},
	cartHideFooter, // 购物车隐藏部分底部
	isResetCanonical = true, // isResetCanonical
	isShowHeadFooter = true, // 登录注册等不需要头部和底部
}) => {

	const { getLanguageHost } = useLanguage();
	const dispatch = useDispatch();
	const { pageLoading, spinLoading, spinLoadingText } = setting
	const [cookies, setCookie] = useCookies(['isReceiveNotice']);
	// 不要删除
	const { isReceiveNotice } = cookies;
	// 不要删除
	const [isShowNotice, setIsShowNotice] = useState(false);

	const router = useRouter();
	useEffect(async () => {

		// 之前是账户登录, 并且cookies的登录状态过期了，
		setTimeout(() => {
			if (auth?.isAccountLog && !cookies?.account?.isAccountLog) {
				dispatch(logOut());
				router.push(LOGIN)
			}
		}, [1000])

		// 	// 接口调试
		const languageType = 'en'
		// const b = await CatalogRepository.apiSearchCatalogManufacturersList({
		// 	catalogId: 22, languageType, keywordList: ['TMS'],
		// }) // 搜索分类关联品牌
		// console.log(b, 'ccc-del')
		// const b = await ManufacturerRepository.apiManufacturersCatalogList({
		// 	manufacturerSlug: 'freescalesemiconductornxp',
		// 	languageType,
		// 	// catalogId: catalogId || '',
		// })
	}, [])

	const handleReceive = () => {
		setCookie('isReceiveNotice', 1, { path: '/', expires: getExpiresTime(1) });
	}

	const { header, footer } = global || {};
	let timerLoadingg = useRef();
	let timerNumerInter = useRef(); // 设置10秒加载超时

	const [timerNumer, setTimerNumer] = useState(0);


	const [isLoading, setIsLoading] = useState(pageLoading);

	// 开始加载, 开启加载状态
	const handleStart = () => {

		clearTimeout(timerLoadingg.current);
		timerLoadingg.current = setTimeout(() => {
			setIsLoading(true)
		}, 100); // 跳转时长小于100，不加载

		// 超时逻辑的开始
		setTimerNumer(0)
		timerNumerInter.current = setInterval(() => {
			setTimerNumer(cur => cur + 10)
		}, 10000);


	}
	// 完成加载, 关闭加载状态
	const handleComplete = () => {
		dispatch(setPageLoading(false));
		clearTimeout(timerLoadingg.current);
		setIsLoading(false)

		// 超时逻辑的结束
		setTimerNumer(0)
		clearInterval(timerNumerInter.current)
	}

	useEffect(() => {
		setIsLoading(pageLoading)
	}, [pageLoading])
	useEffect(() => {
		if (timerNumer >= 10) {
			handleComplete()
		}
	}, [timerNumer])

	useEffect(() => {
		setIsShowNotice(true)
		router.events.on('routeChangeStart', handleStart);
		router.events.on('routeChangeComplete', handleComplete);
		router.events.on('routeChangeError', handleComplete);
		// 清除副作用
		return () => {
			clearTimeout(timerLoadingg.current);
			clearInterval(timerNumerInter.current);
			router.events.off('routeChangeStart', handleStart);
			router.events.off('routeChangeComplete', handleComplete);
			router.events.off('routeChangeError', handleComplete);
		};
	}, []);
	// if (!isShowHeadFooter) {
	// 	return <Spin spinning={spinLoading} size='large' tip={spinLoadingText}>
	// 		{children}
	// 	</Spin>
	// }
	// 登录、注册、找回密码没有PageContainer  需要<I18nextWrapper>包裹
	return (
		<Spin spinning={spinLoading} size='large' tip={spinLoadingText}>
			<div itemsope="true" itemType="http://schema.org/WebPage" className="ltr">
				<div>
					{/* 顶部加载状态条 */}
					{isLoading && <ReactLoadingg isLoading={isLoading} />}

					{/* 加载状态下的阴影 */}
					{isLoading && <div className={styles.pubModalBgc}></div>}
					{/* isShowCookies && !isAgreeCookies */}
					<AgreeCookies />
					{isShowHeadFooter && renderHead(seo, getLanguageHost(), isResetCanonical)}

					{/* 通知 */}
					{/* <MinNotice handleReceive={handleReceive} /> */}
					{/* {(isShowNotice && !isReceiveNotice && pageOtherParams.showHead) && <MinNotice handleReceive={handleReceive} />} */}

					{
						(pageOtherParams.showHead && isShowHeadFooter) && initHeaders(header)
					}

					{children}

					<RightFixed paramMap={paramMap} />

					{/* 底部 */}
					{
						(pageOtherParams.showFooter && isShowHeadFooter) && initFooters(footer, cartHideFooter, paramMap)
					}
				</div>
			</div>
		</Spin>
	);
};

const PageContainerWrapper = (props) => {
	const { isMobile, mode, children, ...rest } = props

	// useEffect(() => {
	//     const link = document.createElement('link');
	//     link.href = '/static/fonts/Linearicons/Font/demo-files/demo.css';
	//     link.rel = 'stylesheet';
	//     document.head.appendChild(link);

	//     return () => {
	//       document.head.removeChild(link); // 在组件销毁时移除该 CSS 文件
	//     };
	//   }, []); // 通过空数组作为第二个参数确保这段代码只在组件挂载时执行一次

	// const Page = () => <PageContainer {...rest}>{children}</PageContainer>
	// 不同的设备返回不同的组件 - 有bug，不刷新
	// const Page = useMemo(() => {
	//     if(mode === 'MOBILE') return () => <MobilePageContainer {...rest}>{children}</MobilePageContainer>

	//     if(mode === 'PAD') return () => <MobilePageContainer {...rest}>{children}</MobilePageContainer>

	//     if(mode === 'DESKTOP') return () => <PageContainer {...rest}>{children}</PageContainer>
	// }, [mode])

	if (isMobile || mode === 'MOBILE') return <MobilePageContainer {...rest}>{children}</MobilePageContainer>

	if (isMobile || mode === 'PAD') return <MobilePageContainer {...rest}>{children}</MobilePageContainer>

	if (mode === 'DESKTOP') return <PageContainer {...rest}>{children}</PageContainer>
}

const PageContainerCommon = (props) => {
	const { curLanguageCodeEn } = useLanguage();
	const { isMobile } = props

	const dynamicsContent = () => {
		return <Device isMobile={isMobile}>
			<PageContainerWrapper {...props} isMobile={isMobile} aaa={1111}>{props.children}</PageContainerWrapper>
		</Device>
	}
	return curLanguageCodeEn() ? <PayPalScriptProvider options={PAYPAL_INITIAL_OPTIONS}>
		{dynamicsContent()}
	</PayPalScriptProvider> : dynamicsContent()
	// return <Device>
	//     <PageContainerWrapper {...props}>{props.children}</PageContainerWrapper>
	// </Device>
}

export default connect(state => state)((PageContainerCommon));
