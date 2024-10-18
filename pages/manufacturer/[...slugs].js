import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import last from 'lodash/last';
import PageContainer from '~/components/layouts/PageContainer';
import ManufacturerDetail from '~/components/partials/manufacturer/ManufacturerDetail';
import BreadCrumb from '~/components/elements/BreadCrumb';
import classNames from 'classnames';
import banStyles from '~/components/common/layout/_PubPageBanner.module.scss';

import { ManufacturerRepository, NewsRepository, outProductRepository } from '~/repositories';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';

import { PRODUCTS_FILTER, MANUFACTURER, POPULAR_MANUFACTURERS } from '~/utilities/sites-url';
import { getLocale, changeServerSideLanguage, redirect404 } from '~/utilities/easy-helpers'


import { useRouter } from 'next/router';

const ManufacturerDetailPage = ({
	paramMap, seo, global, manufacturerData, relaNews,
	hotProductsListServer, recommendResServer, greatResServer, slugs
}) => {
	console.log(manufacturerData, 'manufacturerData---del')
	const { i18Translate, getLanguageHost } = useLanguage();
	const { iAllManufacturers } = useI18();

	const [imageError, setImageError] = useState(false)

	const getBreadCrumb = (name) => {
		const breadcrumb = [
			{ text: iAllManufacturers, url: MANUFACTURER },
			{ text: name, url: MANUFACTURER }
		];

		let pageUrl = PRODUCTS_FILTER;

		return [pageUrl, breadcrumb];
	}

	const { catalogTreeVoList, name, logo, banner, introduce } = manufacturerData || {}

	const Router = useRouter();
	const firstUrl = getLanguageHost() + MANUFACTURER;
	const oneUrl = getLanguageHost() + POPULAR_MANUFACTURERS;
	const towUrl = getLanguageHost() + Router.asPath;

	// pageUrl、headTitle没用到也别乱删，getBreadCrumb返回值顺序，
	const [pageUrl, breadcrumb, headTitle] = getBreadCrumb(name);
	const manufacturerSeo = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "Webpage",
				"@id": towUrl,
				"url": towUrl,
				"name": name,
				"isPartOf": {
					"@type": "Webpage",
					"@id": oneUrl,
					"name": iAllManufacturers,
					"url": firstUrl,
				}
			},
			{
				"@type": "BreadcrumbList",
				"itemListElement": [
					{
						"@type": "Listitem",
						"position": 1,
						"name": iAllManufacturers,
						"item": firstUrl,
					},
					{
						"@type": "Listitem",
						"position": 2,
						"name": name,
						"item": towUrl,
					},
				]
			}
		]
	}

	useEffect(async () => {
		// const log= await NewsRepository.apiQueryManufactureRelaNews({
		// 	manufactureId: 21392,
		// 	languageType: 'zh',
		// });

		// console.log(log,'log')
		// const threeProductParams = {
		//     indexFlag: 1, pageSize: 10, manufacturerId: 21299,
		// }
		// // // 热卖产品
		// await outProductRepository.getHotProductsList(threeProductParams);
		// await outProductRepository.getRecommendListWeb(threeProductParams);
		// // 折扣产品
		// await outProductRepository.getGreatDealsList(threeProductParams);
		// await ManufacturerRepository.apiManufacturersCatalogList({
		// 	// manufacturerId: 743,
		// 	slug: 'texas-instruments',
		// 	languageType: 'en',
		// })
		//     await NewsRepository.apiQueryManufactureRelaNews({
		//   manufacturerIdlanguageType: 'en',
		// })

		// const relaNews = await NewsRepository.apiQueryManufactureRelaNews({
		//     manufactureId: 701,
		//     languageType: 'en',
		//     pageNum: 1,
		//     pageNumber: 50,
		// }); // 查询新闻

		// const manufacturer1 = await ManufacturerRepository.getManufacturerBySlug(slug);
		// let manufacturerVo = null;
		// let catalogsVo = null;
		// if (manufacturer1?.data?.data?.[0]?.attributes) {
		//     const { catalogs, ...rest } = manufacturer1?.data?.data?.[0]?.attributes
		//     manufacturerVo = filterBasicAtFields(rest);
		//     catalogsVo = filterCatalogParentOtherChildren(catalogs)
		// }
	}, [])
	const titleSeo = `${name} Distributor | ${process.env.title}`
	// 之前关键词拼所有分类，现在不拼接了，只拿数量前5的
	// const curAllCatalogs = catalogTreeVoList?.map(i => {
	//     return i?.name
	// })
	// const metaKeywords = `${name}, ${META_KEYWORDS} ${curAllCatalogs?.join(', ')}`
	// 根据 number 属性从大到小排序 - 不需要了
	// catalogTreeVoList.sort((a, b) => Number(b.productCount) - Number(a.productCount));
	// 取前五个对象的名称
	const topFiveNames = catalogTreeVoList?.slice(0, 5)?.map(obj => obj.name);

	const i18Title = i18Translate('i18Seo.manufacturerDetail.title', titleSeo, { manufacturerName: name })
	const i18Key = i18Translate('i18Seo.manufacturerDetail.keywords', "", { name })
	const i18Des = i18Translate('i18Seo.manufacturerDetail.description', "", { manufacturerName: name, topFiveNames: topFiveNames?.join(', ') })

	const rUrl = Router.asPath?.split("?")
	let canonicalUrl = getLanguageHost() + rUrl?.[0]
	if (Router.query.catalogId) {
		canonicalUrl = canonicalUrl + `?catalogId=${Router.query.catalogId}`
	}

	const getName = (str = ', ') => {
		return Router.query.catalogId ? (catalogTreeVoList?.[0]?.name + str) : ''
	}
	// console.log(manufacturerData, 'manufacturerData----del')
	// return 11
	return (
		<PageContainer paramMap={paramMap} seo={seo} global={global} isResetCanonical={false}>
			<Head>
				<link rel="canonical" href={canonicalUrl} />
				<title>{getName(" & ") + i18Title}</title>
				<meta property="og:title" content={getName() + i18Title} key="og:title" />
				<meta name="keywords" content={getName() + i18Key} key="keywords" />
				<meta name="description" content={getName() + i18Des} key="description" />
				<meta name="og:description" content={getName() + i18Des} key="og:description" />
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(manufacturerSeo) }}></script>
			</Head>
			{/* custom-antd-btn-more */}
			<div id="shop-categories" className="ps-page--shop" style={{ paddingBottom: 0 }}>
				<div className={classNames('pub-top-bgc pub-top-bgc-minh260', banStyles.pubTopBgc)}>
					<img className={classNames(banStyles.pubTopImg, banStyles.img1)} src={banner || '/static/img/bg/manufacturerBgc2.jpg'} alt="banner" />
					<img className={classNames(banStyles.pubTopImg, banStyles.img3)} src={banner || '/static/img/bg/manufacturerBgc2Mobile.jpg'} alt="banner" />
					<div className='ps-container pub-top-bgc-content'>
						{
							introduce && logo && !imageError ? <img
								src={`${logo}`}
								title={name}
								alt={name}
								onError={() => { setImageError(true) }}
								style={{ maxWidth: '300px', maxHeight: '150px' }}
							/> : (
								// manufacturerData?.website ?
								// <h2 className='pub-top-bgc-title'>{name}</h2> :
								<h1 className='pub-top-bgc-title'>{name}</h1>
							)}
					</div>
				</div>

				<div className="ps-container">
					<BreadCrumb breacrumb={breadcrumb} />
					{/* <ProductsRecommended hotProductsList={hotProductsList} />  */}
				</div>
				<ManufacturerDetail
					manufacturerInitialData={manufacturerData}
					relaNews={relaNews}
					hotProductsListServer={hotProductsListServer}
					recommendResServer={recommendResServer}
					greatResServer={greatResServer}
				/>
			</div>
		</PageContainer>
	);
};

export default ManufacturerDetailPage;

export async function getServerSideProps({ req, query }) {
	const languageType = getLocale(req)
	const { slugs, catalogId } = query
	const manufacturerSlug = last(slugs);

	const [translations, manufacturerData] = await Promise.all([
		changeServerSideLanguage(req),
		// 供应商对应的分类
		ManufacturerRepository.apiManufacturersCatalogList({
			manufacturerSlug,
			languageType: getLocale(req),
			catalogId: catalogId || '',
		}),
	])

	const { manufacturerId } = manufacturerData?.data || {}

	if (isNaN(Number(manufacturerId))) {
		return redirect404(true)
	}

	const threeProductParams = {
		indexFlag: 1, pageSize: 10, manufacturerId, languageType,
	}
	const [hotProductsListRes, recommendRes, greatRes, relaNews] = await Promise.all([
		outProductRepository.getHotProductsList(threeProductParams), // 热卖产品
		outProductRepository.getRecommendListWeb(threeProductParams), // 推荐产品
		outProductRepository.getGreatDealsList(threeProductParams), // 折扣产品
		NewsRepository.apiQueryManufactureRelaNews({
			manufactureId: manufacturerId,
			languageType,
		}), // 查询新闻
	])
	
	const hotProductsList = hotProductsListRes?.data?.data?.slice(0, 10)?.map(item => {
		const { name, description, image, thumb, manufacturerLogo, manufacturerId="", productId } = item || {}
		let obj = { name, description, image: thumb || image, manufacturerLogo, manufacturerId, productId }
		return obj
	});

	const manuServer = {
		...manufacturerData?.data,
	}


	return {
		props: {
			...translations,
			manufacturerData: manuServer,
			hotProductsListServer: hotProductsList || [],
			recommendResServer: recommendRes?.data?.data,
			greatResServer: greatRes?.data?.data,
			relaNews: relaNews?.data || [],
			slugs,
		},
	}
};