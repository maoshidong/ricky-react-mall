import React, { useEffect, useMemo } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
// import { Skeleton } from 'antd';
import { connect, useDispatch } from 'react-redux';
import { setRecommendManufacturerList } from '~/store/ecomerce/action';

// const PageContainer = dynamic(() => import('~/components/layouts/PageContainer'));
import PageContainer from '~/components/layouts/PageContainer';

const Banner = dynamic(() => import('~/components/shared/blocks/banner'))
// import Banner from '~/components/shared/blocks/banner';

// import { PopularProducts, RecentProducts, ImportantFunction, ProductsRecommended } from '~/components/shared';
// import PopularProducts from '~/components/shared/blocks/popular-products.js';
// import RecentProducts from '~/components/shared/blocks/recent-products.js';
// import ImportantFunction from '~/components/shared/blocks/important-function.js';
// import ProductsRecommended from '~/components/shared/blocks/products-recommended';

const PopularProducts = dynamic(() => import('~/components/shared/blocks/popular-products'));
const RecentProducts = dynamic(() => import('~/components/shared/blocks/recent-products'));
const ImportantFunction = dynamic(() => import('~/components/shared/blocks/important-function'));
const ProductsRecommended = dynamic(() => import('~/components/shared/blocks/products-recommended'));

const IndustryApplication = dynamic(() => import('~/components/shared/blocks/Industry-application'));
const Certificarions = dynamic(() => import('~/components/shared/blocks/certificarions'));
const ProductNews = dynamic(() => import('~/components/shared/blocks/product-news'));
const FeaturedManufacturer = dynamic(() => import('~/components/shared/blocks/featured-manufacturer'))

import { NewsRepository, outProductRepository, ManufacturerRepository } from '~/repositories'
// CommonRepository ProductRepository


import { I18NEXT_DOMAINS, All_SEO1, SCOMPANY_NAME } from '~/utilities/constant';

import { changeServerSideLanguage, getLocale } from '~/utilities/easy-helpers';
import useLanguage from '~/hooks/useLanguage';

const HomepageDefaultPage = ({
	seo, global,
	hotProductsList = [], recommendResServer = [], greatResServer = [],
	newsServer, recommenCatalogServer, manuServer,
	buttonMap, paramMap, isMobile,
}) => {
	// console.log(recommenCatalogServer,'recommenCatalogServer---del')
	const { i18Translate, getLanguageHost, getLanguageLogo, getDomainsData, curLanguageCodeEn, temporaryClosureZh } = useLanguage();
	const dispatch = useDispatch();

	// console.log(recommenCatalogServer, 'recommenCatalogServer----del')
	useEffect(async () => {
		// 调试接口测试
		// await NewsRepository.getQueryNewsList({pageListNum: 1, pageListSize: 4, languageType: 'en'}) // 100左右

		// const params = { indexFlag: 1, pageSize: 9, languageType: 'en' }
		// await outProductRepository.getHotProductsList({ languageType: 'en' })
		// await outProductRepository.getRecommendListWeb({ languageType: 'en' })
		// await outProductRepository.getGreatDealsList(params) // 60ms

		// fetch(`${process.env.url}/staticData/homeProducts/discount.json`), // 150


		// await ManufacturerRepository.getRecommendListWeb({ languageType: 'en' })
		// await ProductRepositoryZqx.getNewProductsById(5359744, 'en', 'eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6ImU4YThjNWE4LWQxNWMtNDY2Ni1iYWQwLTZjMDllM2JhNWMyYiJ9.GY2nN0nardlydXXbFn9-fv1lJrWZvy9LuRD77Z9hroZ3UAl_FgRUzJnGKO7uWLSpkbY1PUzy12jBrOn85ELYaA'); // 商品详情

		// await outProductRepository.getRecommendCatalogListWeb('en');
		// console.time()
		// fetch(`${process.env.url}/staticData/recommendCatalogs/en.json`);
		// console.timeEnd()
		// const panelRes = await CommonRepository.apiGetSysFunctionTypeSonList({
		//     typeId: 2 // typeId: 2 or  typeIdList: [1, 2]
		// });



		dispatch(setRecommendManufacturerList(manuServer))
	}, [])

	const urltemplate = `${getLanguageHost()}/products/search?keywords={search_term_string}`
	// 只将此标记添加到首页，而不要将其添加到其他任何网页
	const potentialAction = {
		"@type": "SearchAction",
		"target": {
			"@type": "EntryPoint",
			"urltemplate": urltemplate,
		},
		"query-input": "required name=search_term_string"
	}

	const sameAsDomain = I18NEXT_DOMAINS.map(item => {
		return `https://${item.domain}/`
	})

	const iCompanyName = i18Translate('i18CompanyInfo.Origin Electronic Parts Mall', process.env.title)
	const iHomeDes = i18Translate('i18Home.homeDes', `${SCOMPANY_NAME} offers millions of products from thousands of manufacturers, many in-stock quantities available to ship same day. Paypal and credit card accepted, order online today!`)
	const homeSeoSearch = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "WebSite",
				"@id": `${getLanguageHost()}/#website`,
				"name": iCompanyName,
				"url": getLanguageHost() + '/',
				"potentialAction": potentialAction,
			},
			{
				"@type": "Organization",
				"@id": `${getLanguageHost()}/#organization`,
				"name": iCompanyName,
				"description": iHomeDes,
				"url": getLanguageHost() + '/',
				"logo": getLanguageLogo(),
				"contactPoint": [
					{
						"@type": "ContactPoint",
						"telephone": paramMap?.phone || process.env.telephone, // paramMap
						"email": paramMap?.email || process.env.email,
						"contactType": "Sales",
						"contactOption": "TollFree",
						"areaServed": getDomainsData()?.code.toUpperCase(),
						"availableLanguage": curLanguageCodeEn() ? ["English"] : ["Chinese"]
					}
				],
				"address": {
					"@type": "PostalAddress",
					"addressCountry": getDomainsData()?.code.toUpperCase(), // 面向用户的国家/地区代码
					"streetaddress": curLanguageCodeEn() ? "15F., Hangdu Bldg" : '航都大厦15F',
					"postOfficeBoxNumber": curLanguageCodeEn() ? "PO Box 15F" : 'PO Box 15F',
					"addressLocality": curLanguageCodeEn() ? "No.1006 Huafu Road" : 'No.1006 华富路',
					"addressRegion": curLanguageCodeEn() ? "Shenzhen" : '深圳市', "postalCode": "518000"
				},
				"sameAs": [
					paramMap?.twitterUrl, paramMap?.facebookUrl, paramMap?.youTubeUrl, paramMap?.tiktokUrl,
					// "https://twitter.com/Origin_IC",
					// "https://www.facebook.com/Origin-Data-Global-Limited-100878739724371",
					// "https://www.youtube.com/@Origin_Data",
					// "https://www.tiktok.com/@origin_data",
					...sameAsDomain
				]
			}
		]
	}

	const { homeTit, homeKey, homeDes } = All_SEO1?.home
	const i18Title = i18Translate('i18Seo.home.title', homeTit)
	const i18Key = i18Translate('i18Seo.home.keywords', homeKey)
	const i18Des = i18Translate('i18Seo.home.description', homeDes)
	// i18Seo
	// 使用useMemo缓存静态组件的内容
	const staticBanner = useMemo(() => {
		return <Banner isMobile={isMobile} />
	}, []);

	return (
		<PageContainer isMobile={isMobile} buttonMap={buttonMap} paramMap={paramMap} seo={seo} global={global} >
			<Head>
				{/* canonical标签是为了解决网址规范化问题，告诉搜索引擎那个网址才是最重要的。网页可以不带canonical标签。
                我发现很多网站的页面都会带上canonical标签， 链接指向本页面；如果链接指向非本页面， 那谷歌很多时候（非绝对）就不会抓取该页面。 */}
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />
				<meta content="index,follow" name="robots" />
				<meta content="index,follow" name="GOOGLEBOT" />
				<meta content="Origin Data Electronics" name="Author" />
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSeoSearch) }}></script>
			</Head>
			<main id="homepage-zqx">
				{staticBanner}
				{/* { !temporaryClosureZh() && <Certificarions /> } */}
				<PopularProducts recommenCatalogRes={recommenCatalogServer} isMobile={isMobile} />
				<RecentProducts />
				{!temporaryClosureZh() && <ImportantFunction />}
				{!temporaryClosureZh() && <ProductsRecommended
					hotProductsList={hotProductsList}
					recommendResServer={recommendResServer}
					greatResServer={greatResServer} />}
				{!temporaryClosureZh() && <Certificarions />}
				<IndustryApplication />

				<ProductNews newsServer={newsServer} />
				<FeaturedManufacturer manuServer={manuServer} />
			</main>
		</PageContainer >
	);
};

export default connect((state) => state)(HomepageDefaultPage);

export async function getServerSideProps({ req }) {
	const languageType = getLocale(req)
	function productsData(arr) {
		const list = arr?.slice(0, 9)?.map(item => {
			const { name, description, image, thumb, manufacturerLogo='', manufacturerId, productId } = item || {}
			let obj = { name, description, image: thumb || image, manufacturerLogo, manufacturerId, productId }
			return obj
		});
		return list
	}
	const params = { indexFlag: 1, pageSize: 9, languageType }
	// 静态数据导入 JSON 文件
	const [translations, hotProductsListRes, recommendResRes, greatRes, newsRes, manuRes, recommenCatalogRes] = await Promise.all([
		changeServerSideLanguage(req), // 语言包等页面基础逻辑
		outProductRepository.getHotProductsList(params), // 热卖
		outProductRepository.getRecommendListWeb(params), // 推荐
		outProductRepository.getGreatDealsList(params), // 折扣
		NewsRepository.getQueryNewsList({ pageListNum: 1, pageListSize: 4, languageType }), // 新闻
		ManufacturerRepository.getRecommendListWeb({ languageType }), // 推荐供应商
		outProductRepository.getRecommendCatalogListWeb(languageType), // 推荐分类
	]);
	// 热卖产品 - data?.data?
	const hotProductsList = productsData(hotProductsListRes?.data?.data)
	const recommendResServer = productsData(recommendResRes?.data?.data)
	const greatResServer = productsData(greatRes?.data?.data)
	// 新闻
	const newsServer = newsRes?.data?.data?.slice(0, 4)?.map(item => {
		const { id, title, newsType } = item || {}
		return { id, title, newsType }
	});
	// 推荐供应商
	const manuServer = manuRes?.data?.data?.slice(0, 20)?.map(item => {
		const { id, slug, logo, name } = item || {}
		return { id, slug, logo, name }
	});

	// 推荐分类 - 过滤掉多余数据
	function filterTree(data, index = 0) {
		return data?.map(item => {
			const { name, id, image = "", slug, voList = [] } = item || {}
			let obj = {
				name, id, image, slug,
				voList: (voList?.length > 0 && index < 2) ? filterTree(voList, 1) : [] // index < 2, 多一层， 用于判断跳转到atalog还是filter
			}
			return obj
		});
	}
	const recommenCatalogServer = filterTree(recommenCatalogRes?.data?.slice(0, 14) || []);


	return {
		props: {
			...translations,
			hotProductsList, recommendResServer, greatResServer,
			newsServer,
			recommenCatalogServer,
			manuServer,
			languageType,
		},
	}
}

// let recommenCatalogRes = [] // 推荐分类
// if (process.env.NODE_ENV === 'development') {
// 	recommenCatalogRes = require(`~/public/staticData/recommendCatalogs/${languageType}.json`);
// } else {
// 	let [res5] = await Promise.all([
// 		fetch(`${process.env.url}/staticData/recommendCatalogs/${languageType}.json`),
// 	]);
// 	[recommenCatalogRes] = await Promise.all([
// 		res5.json(),
// 	]);
// }