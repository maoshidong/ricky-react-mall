import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

import last from 'lodash/last';
import cloneDeep from 'lodash/cloneDeep';

import dynamic from 'next/dynamic';
const PageContainer = dynamic(() => import('~/components/layouts/PageContainer'));
const CatalogTop = dynamic(() => import('~/components/partials/shop/CatalogTop'));
const PubProductsTable = dynamic(() => import('~/components/ecomerce/minTableCom/PubProductsTable'));
// import MobilePageTopBanner from '~/components/mobile/section/PageTopBanner';
import { useRouter } from 'next/router';
import ProductRepository from '~/repositories/zqx/ProductRepository';

import { PUB_PAGINATION, All_SEO1 } from '~/utilities/constant';
import { AllCatalogTree } from '~/utilities/AllCatalogTree'
import { decrypt } from '~/utilities/common-helpers';
import useLanguage from '~/hooks/useLanguage';
import { changeServerSideLanguage } from '~/utilities/easy-helpers';


const CatalogPage = ({ paramMap, seo, global, query, keywordsProducts, queryKeywords, top20Flag }) => {
	const { i18Translate, getLanguageHost, getDomainsData, getLanguageName } = useLanguage();

	const tableRef = useRef();
	const Router = useRouter();

	const results = (queryKeywords?.length > 0 && keywordsProducts?.catalogCount === 0) ? 0 : (keywordsProducts?.searchVos?.total || NaN)
	const resultsIsNone = Number(results) === 0
	const iProductIndex = i18Translate('i18MenuText.Product Index', 'Product Index')
	const productsSeo = {
		"@context": "https://schema.org/",
		"@graph": [
			{
				"@type": "Webpage",
				"@id": `${getLanguageHost()}/products/#productindex`,
				"Url": `${getLanguageHost()}/products`,
				"Name": iProductIndex,
				"isPartOf": {
					"@type": "Website",
					"@id": `${getLanguageHost()}/#website`,
					"Url": getLanguageHost(),
					"Name": iProductIndex
				},
				"Image": null,
				"ItemListElement": null,
				"Description": null,
				// "Sku":null,
				// "Mpn":null,
				// "Brand":null,
				// "Offers":null,
			},
			{
				"@type": "BreadcrumbList",
				"@id": null,
				"Url": null,
				"Name": null,
				// "isPartOf":null,
				"Image": null,
				"ItemListElement": [
					{ "@type": "Listitem", "Position": "1", "Name": iProductIndex, "Item": `${getLanguageHost()}/products`, }
				],
				"Description": null,
				// "Sku":null,"Mpn":null,"Brand":null,"Offers":null
			},
		]
	}

	const [productsList, setProductsList] = useState([])
	const [total, setTotal] = useState(0)
	const [pages, setPages] = useState(1)

	const handleGetProductsListWeb = async (pageNum, pageSize) => {
		const params = {
			pageListNum: pageNum || PUB_PAGINATION?.pageNum,
			pageListSize: pageSize || PUB_PAGINATION?.pageSize,
			keywordList: queryKeywords,
			keyword: last(queryKeywords) || '',
			top20Flag: !!top20Flag ? 1 : 0,
			languageType: getDomainsData()?.defaultLocale,
		}
		const res = await ProductRepository.getProductsListWeb(params)
		// const serverProducts = await ProductRepository.apiSearchProductByEs({...params, keyword: last(queryKeywords)});
		// tableRef.current.scrollTop -= 150;
		if (res?.code == 0) {
			const { data, total, pages } = res?.data
			setProductsList(data || [])
			setTotal(total)
			setPages(pages)
		}
	}
	const productCallback = (pageNum, pageSize) => {
		// behavior: 'smooth', 
		tableRef.current.scrollIntoView({ block: 'start' });
		handleGetProductsListWeb(pageNum, pageSize)
	}
	useEffect(async () => {
		// 	const params = {
		//     keyword: '',
		//     keywordList: [],
		// 		top20Flag: 1
		// }
		// const serverProducts = await ProductRepository.apiSearchProductByEs(params);

		if(queryKeywords?.length > 0 || top20Flag) {
			handleGetProductsListWeb()
		}
	}, [queryKeywords,top20Flag])

	const banTitle = i18Translate('i18CatalogHomePage.MillionProducts', 'Find electronic components')
	const banDes = i18Translate('i18CatalogHomePage.LowPriceFastDelivery', 'One-stop purchasing, Low price and fast delivery')

	const { productsTit, productsKey, productsDes } = All_SEO1?.products
	const i18Title = i18Translate('i18Seo.productsHome.title', productsTit)
	const i18Key = i18Translate('i18Seo.productsHome.keywords', productsKey)
	const i18Des = i18Translate('i18Seo.productsHome.description', productsDes)

	const {flag} = query||{}
	const rUrl = Router.asPath?.split("?")
	let hUrl = getLanguageHost()+ rUrl?.[0]
	if (flag) {
		hUrl = hUrl + `?flag=${flag}`
	}

	
	// 是否有搜索关键词 -  CatalogTop也有重复的逻辑，该合并
	const isHaveQueryKeywords = queryKeywords && queryKeywords?.length > 0 && queryKeywords[0] !== '' || !!top20Flag
	const { catalogIdList } = keywordsProducts
	let newCategories = isHaveQueryKeywords ? [] : cloneDeep(AllCatalogTree); // 深拷贝

	const getProductInfo = (Item) => {
		return {
			productCount: Item?.productCount,
			productIdList: Item?.productIdList
		}
	}
	// 有条件才需要计算 - 根据搜索条件返回的catalogIdList判断展示哪些分类
	if (isHaveQueryKeywords) {
		AllCatalogTree?.forEach(item => {
			// 二级
			item?.voList?.map(i => {
				const catalogItem = catalogIdList?.find(citem => citem?.id == i?.id)
				if (catalogItem) {
					newCategories.push({
						...item, // 加上...item, 意思是有子级就添加最顶级
						// productCount: catalogItem?.productCount,
						...getProductInfo()
					})
					// firstCatalogsIds.push(i?.id)
				}
				// 三级
				i?.voList?.map(j => {
					const catalogItem = catalogIdList?.find(citem => citem?.id == j?.id)
					if (catalogItem) {
						newCategories.push({
							...item,
							// productCount: catalogItem?.productCount,
							...getProductInfo()
						})
						// firstCatalogsIds.push(i?.id)
						// twoCatalogsIds.push(j?.id)
					}
					// 四级
					j?.voList?.map(k => {
						const catalogItem = catalogIdList?.find(citem => citem?.id == k?.id)
						if (catalogItem) {
							newCategories.push({
								...item,
								// productCount: catalogItem?.productCount,
								...getProductInfo()
							})
							// firstCatalogsIds.push(i?.id)
							// twoCatalogsIds.push(j?.id)
							// twoCatalogsIds.push(k?.id)


							// threeCatalogsIds.push(k?.id)
						}
					})
				})
			})
		})
	}
	const uniqueCategoriesArr = [...new Map(newCategories?.map(item => [item.id, item])).values()]; //去重
	const letNavArr = (isHaveQueryKeywords && results > 0) ? uniqueCategoriesArr : AllCatalogTree

	const getName = (str = ', ') => {
		if (flag) {
			const cur = getLanguageName(letNavArr?.[0]) + str + (getLanguageName(letNavArr?.[1])) + str
			return cur
		}
		return ''
	}

	return (
		<PageContainer paramMap={paramMap} seo={seo} global={global} isResetCanonical={false}>
			<Head>
				<link rel="canonical" href={hUrl} />
				<title>{getName(" & ") + i18Title}</title>
				<meta property="og:title" content={getName() + i18Title} key="og:title" />
				<meta name="keywords" content={getName() + i18Key} key="keywords" />
				<meta name="description" content={getName() + i18Des} key="description" />
				<meta name="og:description" content={getName() + i18Des} key="og:description" />
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSeo) }}></script>
			</Head>

			{
				(queryKeywords?.length === 0 || !resultsIsNone) &&
				<div className='pub-top-bgc pub-top-bgc-minh260'>
					<img className='pub-top-img' src='/static/img/bg/productIndex1.jpg' alt="banner" />

					<div className='ps-container pub-top-bgc-content'>
						<h1 className='mb10 pub-color555 pub-fontw pub-font36 pub-top-bgc-title'>
							{banTitle}
						</h1>
						<p className='pub-color555 pub-font24 pub-top-bgc-des'>
							{banDes}
						</p>
					</div>
				</div>
			}
			{/* 手机端banner */}
			{/* <MobilePageTopBanner
                bgcImg="productIndex1.jpg"
                title={banTitle}
                titleH1={true}
                description={banDes}
            /> */}

			<div id="shop-categories" className="ps-page--shop pb60">
				<div className="ps-container">
					{
						(queryKeywords?.length > 0 && !resultsIsNone) && (
							<div className='keyword-results'>
								{i18Translate('i18SmallText.Show', 'Showing')} {results} {i18Translate('i18SmallText.Results', 'Results')} {i18Translate('i18SmallText.For', 'for')} "{queryKeywords.join(' ')}"
								{/* Showing {results} Results for "{queryKeywords.join(' ')}" */}
							</div>
						)
					}
					{/* 展示所有分类组件 */}
					<CatalogTop
						paramMap={paramMap}
						allCatalog={AllCatalogTree}
						queryKeywords={queryKeywords}
						top20Flag={top20Flag}
						results={results}
						keywordsProducts={keywordsProducts} query={query} resultsIsNone={resultsIsNone}
					/>
					{
						((queryKeywords?.length > 0 || !!top20Flag) && productsList?.length > 0) && (
							<div className='mt20' ref={tableRef}>
								<PubProductsTable productsList={productsList} total={total} pages={pages} callback={productCallback} />
							</div>
						)
					}


				</div>
			</div>
		</PageContainer>
	);
};

export default CatalogPage;

export async function getServerSideProps({ req, query }) {
	const top20Flag = query?.flag || '' // 从产品详情过来的  /app/catalogs/getCatalogTree?id=0&languageType=en
	const keywordList = decrypt(query?.keywords || '').split('____')
	const keyword = last(keywordList) || ''
	const params = {
		keyword,
		keywordList,
	}
	let _top20Flag = 0
	if (top20Flag) {
		_top20Flag = 1
		params.top20Flag = _top20Flag
	}

	const [translations, serverProducts] = await Promise.all([
		changeServerSideLanguage(req), 
		ProductRepository.apiSearchProductByEs(params),
	]);

	return {
		props: {
			...translations,
			keywordsProducts: serverProducts?.data || {},
			queryKeywords: keyword ? keywordList : [],
			top20Flag: !!_top20Flag,
			query,
		},
	}
};
