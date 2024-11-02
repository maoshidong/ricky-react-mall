import React, { useState, useEffect, useRef, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import last from 'lodash/last';
import qs from 'qs';

import BreadCrumb from '~/components/elements/BreadCrumb';
import dynamic from 'next/dynamic';
const PageContainer = dynamic(() => import('~/components/layouts/PageContainer'));
const ProductFilters = dynamic(() => import('~/components/partials/product/zqx/ProductFilters'));
const ProductTable = dynamic(() => import('~/components/partials/product/zqx/ProductTable'));
const CatalogDescription = dynamic(() => import('~/components/partials/shop/CatalogDescription'));

import { ProductRepository, CatalogRepository, ManufacturerRepository } from '~/repositories';

import { PUB_PAGINATION, SEO_COMPANY_NAME, SEO_COMPANY_NAME_ZH } from '~/utilities/constant';
import { PRODUCTS_CATALOG, PRODUCTS_FILTER, PRODUCTS, PRODUCTS_UNCLASSIFIED } from '~/utilities/sites-url';
import { ProductsFilterContext } from '~/utilities/productsContext'
import { decrypt, isIncludes } from '~/utilities/common-helpers';
import { getLocale, changeServerSideLanguage, redirect404 } from '~/utilities/easy-helpers';


import useLanguage from '~/hooks/useLanguage';
/**
 * 
 * @param {*} param0 
 * @returns 
 */
const FilterPage = ({
	paramMap, query,
	filterServerParams,
	filterDataSer, // 属性
	queryCatalogId, // 分类id
	queryAttrList, // url搜索条件
	manufacturerIdList, //供应商属性条件id
	queryKeywordList, // 关键词列表
	manufacturerRes,
	productListServer,
	catalogsBreadcrumb = [],
	sortField // 字段排序
}) => {
	// console.log(productListServer,'productListServer----del')
	const { i18Translate, getLanguageName, curLanguageCodeZh, getLanguageHost, getLanguageEmpty } = useLanguage();
	const iProductIndex = i18Translate('i18MenuText.Product Index', 'Product Index')
	const getBreadCrumb = (list) => {
		const breadcrumb = [
			{
				text: iProductIndex,
				url: PRODUCTS
			}
		];

		let url = PRODUCTS_CATALOG;
		list?.forEach(item => {
			url = PRODUCTS_CATALOG + '/' + isIncludes(item?.slug);
			breadcrumb.push({
				text: getLanguageName(item),
				url: url + '/' + item.id,
			})
		})

		return [breadcrumb];
	}

	// 分类属性静态数据导入 JSON 文件
	// let filterData = {};
	// if (queryAttrList) {
	// 	filterData = require(`~/public/staticData/filterPro/${queryCatalogId}.json`);
	// }
	const [filterData, setFilterData] = useState(filterDataSer || [])
	const attrCallback = data => {
		setFilterData(data)
	}
	const Router = useRouter();

	const [currentUrl, setCurrentUrl] = useState('') // 不带参数的纯url
	const [filterKeyword, setFilterKeyword] = useState([])
	const [filterAttrIds, setFilterAttrIds] = useState({})
	const { slugs, attrList } = query || {};
	const [loading, setLoading] = useState(false);
	const [isInitialRender, setIsInitialRender] = useState(true);
	const [breadcrumb] = getBreadCrumb(catalogsBreadcrumb);
	const [isOneInitial, setIsOneInitial] = useState(true)
	// 只有一个型号时，直接跳转到产品详情 - 初始进入不执行
	// if(isOneInitial === 1 && productListServer?.code === 0 && productListServer?.data?.data?.length === 1) {
	//     const { data } = productListServer?.data || []
	//     const { name, productId, typeList=[] } = data[0] || {}
	//     let manufacturer = ""
	//     typeList?.map(item => {
	//         if(item?.type!=='Manufacturer') {
	//             manufacturer = item?.name
	//         }
	//     })
	//     Router.push(getProductUrl(manufacturer, name, productId))
	//     return
	// }
	// return 111
	const geturl = () => {
		let pageUrl = PRODUCTS_FILTER;
		slugs?.forEach(item => {
			pageUrl += '/' + isIncludes(item);
		})
		return pageUrl
	}

	useEffect(async () => {
		// const catalogsBreadcrumb = await CatalogRepository.getCatalogBreadcrumbList(1208); // 获取分类面包屑


		setCurrentUrl(geturl())
	}, [])

	let timer = useRef();

	useEffect(() => {
		// const filterServerParams = {
		//     keyword: "",
		//     keywordList: [],
		//     attributeIdList: [],
		//     catalogKeyword: '265',
		//     manufacturerKeyword: '',  // 暂时先不传
		//     pageListNum: 1,
		//     pageListSize: "20manufacturerId=777",
		// }
		// await ProductRepository.getProducts(filterServerParams); // 属性筛选条件集合

		if (isInitialRender) {
			setIsInitialRender(false);
			return
		}
		clearTimeout(timer.current);
		timer.current = setTimeout(() => {
			getPageProducts(filterAttrIds, filterKeyword)
		}, 2);

		return () => {
			clearTimeout(timer.current);
		};
	}, [filterKeyword])

	const updateCurrentUrl = val => {
		setCurrentUrl(val)
	}

	const updateFilterKeyword = val => {
		setFilterKeyword(val)
	}

	const updateFilterAttrIds = val => {
		setFilterAttrIds(val)
	}

	const updateIsOneInitial = val => {
		setIsOneInitial(val)
	}

	async function getPageProducts() {
		window.scrollBy({
			top: -window.scrollY,
			left: 0,
		});
		return
	}

	const baseUrl = getLanguageHost()
	const curUrl = baseUrl + Router.asPath
	const isMax = catalogsBreadcrumb.length === 4
	const twoUrl = `${baseUrl}/products/catalog/${isIncludes(catalogsBreadcrumb[0]?.slug)}/${catalogsBreadcrumb[0]?.id}`
	const twoLastUrl = `${baseUrl}/products/catalog/${isIncludes(catalogsBreadcrumb[1]?.slug)}/${catalogsBreadcrumb[1]?.id}`
	const threeUrl = `${baseUrl}/products/catalog/${isIncludes(catalogsBreadcrumb[2]?.slug)}/${catalogsBreadcrumb[2]?.id}`

	const getFour = () => {
		let ItemListElement = [
			{
				"@type": "Listitem", "Position": "1",
				"Name": iProductIndex, "Item": `${baseUrl}/products`,
			},
			{
				"@type": "Listitem", "Position": "2",
				"Name": catalogsBreadcrumb[0]?.name, "Item": twoUrl,
			},
			{
				"@type": "Listitem", "Position": "3",
				"Name": catalogsBreadcrumb[1]?.name,
				"Item": catalogsBreadcrumb?.length > 2 ? twoLastUrl : curUrl,
			},
		]
		if (catalogsBreadcrumb?.length > 2) {
			ItemListElement.push({
				"@type": "Listitem", "Position": "4",
				"Name": catalogsBreadcrumb[2]?.name,
				"Item": catalogsBreadcrumb?.length > 3 ? threeUrl : curUrl

			})
		}
		if (isMax) {
			ItemListElement.push({
				"@type": "Listitem", "Position": "5",
				"Name": catalogsBreadcrumb[3]?.name, "Item": curUrl,
			})
		}
		return ItemListElement
	}

	// isPartOf, Offers, Mpn, Sku, Brand
	const productsThreeSeo = {
		"@context": "https://schema.org/",
		"@graph": [
			{
				"@type": "Webpage",
				"@id": getLanguageHost() + Router.asPath,
				"url": getLanguageHost() + Router.asPath,
				"name": last(catalogsBreadcrumb)?.name,
				"isPartOf": {
					"@type": "Webpage",
					"@id": isMax ? twoLastUrl : twoUrl,
					"url": isMax ? twoLastUrl : twoUrl,
					"name": isMax ? catalogsBreadcrumb[1]?.name : catalogsBreadcrumb[0]?.name
				},
				"Image": null,
				"ItemListElement": null,
				"Description": null,
				// "Sku":null,"Mpn":null,"Brand":null,"Offers":null,
			},
			{
				"@type": "BreadcrumbList",
				"@id": null,
				"Url": null,
				"Name": null,
				// "isPartOf":null,
				"Image": null,
				"ItemListElement": getFour(),
				"Description": null,
				// "Sku":null,"Mpn":null,"Brand":null,"Offers":null
			},
		]
	}

	const productsSeo = {
		"@context": "https://schema.org/",
		"@graph": [
			{
				"@type": "Webpage",
				"@id": getLanguageHost() + Router.asPath,
				"Url": getLanguageHost() + Router.asPath,
				"Name": last(catalogsBreadcrumb)?.name,
				"isPartOf": {
					"@type": "Webpage",
					"@id": isMax ? twoLastUrl : twoUrl,
					"Url": isMax ? twoLastUrl : twoUrl,
					"Name": isMax ? catalogsBreadcrumb[1]?.name : catalogsBreadcrumb[0]?.name
				},
			},
			{
				"@type": "BreadcrumbList",
				"ItemListElement": getFour(),
			},
		]
	}

	// 处理产品列表参数
	const tempDataServer = useMemo(() => {
		if (productListServer?.data?.data) {
			return productListServer?.data?.data.map(item => {
				const attributes = {};
				item.typeList?.forEach(i => {
					attributes[i.type] = i.attrValue;
				});
				return {
					id: item.productId,
					...attributes,
					...item,
					image: item.thumb || item.image || getLanguageEmpty(),
					productNo: item.name,
					description: item.description,
					manufacturer_slug: item.Manufacturer?.split(' ')?.join('-'),
				};
			});
		}
		return [];
	}, [productListServer]);

	let seriesDataList = [] // Series的dataList列表

	filterData?.map(item => {
		if (item?.type === "Series") {
			seriesDataList = item?.dataList || []
		}
	})
	let curSelectedItems = {} // 选中的系列
	// 判断是否选中了系列， 对于每个元素，使用 includes() 方法判断其是否存在于另一个数组中。
	const containsValues = seriesDataList.filter(value => filterServerParams.attributeIdList.includes(value?.productAttributeId.toString()));

	if (containsValues?.length > 0) {
		curSelectedItems = {
			Series: [containsValues?.[0]?.productAttributeId]
		}
	}
	// console.log(curSelectedItems,'curSelectedItems----del')
	const iSeries = i18Translate('i18Other.Series', "Series")
	const getSeries = () => {
		if (containsValues?.length === 0) return ''
		return containsValues[0]?.attrValue + ` ${iSeries}, `
	}

	// 分类反转
	const reverseCatalogs = catalogsBreadcrumb.slice().reverse();
	const curAllCatalogs = reverseCatalogs.map(i => {
		return i?.name
	})
	const seoHeadTitle = `${curAllCatalogs.join(' / ')} ${curLanguageCodeZh() ? SEO_COMPANY_NAME_ZH : SEO_COMPANY_NAME}`

	let i18Options = {
		allCatalogName: curAllCatalogs?.reverse().join(' '),
		oneCatalogName: catalogsBreadcrumb?.[0]?.name,
	}

	const i18Des = i18Translate('i18Seo.productsCatalogMore.description', "", i18Options)  // descriptionSeo

	const rUrl = Router.asPath?.split("?")
	let hUrl = getLanguageHost() + rUrl?.[0]
	// if (attrList) {
	// 	hUrl = hUrl + `?attrList=${attrList}`
	// }
	let params = {};
	if (attrList) {
		params.attrList = attrList
	}
	if (query?.manufacturerIdList) {
		params.manufacturerIdList = query?.manufacturerIdList
	}
	if(qs.stringify(params)) {
		hUrl = `${hUrl}?${qs.stringify(params)}`
	}
	console.log(hUrl,'hUrl---del')
	// 标题1：    - Series, Machine Safety - Mats / Machine Safety / Industrial Automation and Controls | Origin Data  
	// 标题2：   * Series, Machine Safety - Mats / Machine Safety / Industrial Automation and Controls | Origin Data为什么检测网站工具 https://sem.3ue.com/     还提示页面没有 h1 标题
	// 为什么检测网站工具 https://sem.3ue.com/     还提示以上两个页面的 标题一样   某些检测工具可能不够智能，无法识别细微的差异。
	return (
		<PageContainer paramMap={paramMap} isResetCanonical={false}>
			<Head>
				<link rel="canonical" href={hUrl} />
				<title>{getSeries() + seoHeadTitle}</title>
				<meta property="og:title" content={getSeries() + seoHeadTitle} key="og:title" />
				<meta name="keywords" content={getSeries() + curAllCatalogs.join(', ')} key="keywords" />
				<meta name="description" content={getSeries() + i18Des} key="description" />
				<meta name="og:description" content={getSeries() + i18Des} key="og:description" />
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(isMax ? productsSeo : productsThreeSeo) }}></script>
			</Head>
			<ProductsFilterContext.Provider
				value={{
					filterAttrIds, updateFilterAttrIds,
					filterKeyword, updateFilterKeyword,
					currentUrl, updateCurrentUrl,
					isOneInitial, updateIsOneInitial,
				}}
			>
				<div id="shop-categories" className="ps-page-filter ps-page--shop custom-antd-btn-more" style={{ background: '#fff', }}>
					<div className='ps-container filter-container mr1'>
						<BreadCrumb breacrumb={breadcrumb} />
						<div className="ps-product-container">
							{/* 商品筛选条件 */}
							<ProductFilters
								query={query}
								filterServerParams={filterServerParams}
								curSelectedItems={curSelectedItems} // 选中的系列
								checkSeriesName={getSeries()} // 选中的系列属性
								queryCatalogId={queryCatalogId}
								queryAttrList={queryAttrList}
								queryKeywordList={queryKeywordList} // url搜索条件
								catalogsBreadcrumb={catalogsBreadcrumb} // 面包屑
								manufacturerRes={manufacturerRes} // 供应商数据
								productListData={productListServer}
								filterData={filterData}
								attrCallback={attrCallback} // 子组件拿到所有属性后回调
							/>
							<ProductTable
								loading={loading}
								queryAttrList={queryAttrList} // url属性参数
								manufacturerIdList={manufacturerIdList} // url属性参数
								queryKeywordList={queryKeywordList} // url搜索条件
								catalogsBreadcrumb={catalogsBreadcrumb}
								dataServer={productListServer} // 产品
								tempDataServer={tempDataServer}
								slugs={slugs}
								manufacturerRes={manufacturerRes}
								sortField={sortField}
							/>
						</div>
						<div className='filter-des' style={{ marginTop: '20px' }}>
							<CatalogDescription
								catalogName={catalogsBreadcrumb?.[catalogsBreadcrumb?.length - 1]?.name}
								description={catalogsBreadcrumb?.[catalogsBreadcrumb?.length - 1]?.description}
							/>
						</div>
					</div>
				</div>
			</ProductsFilterContext.Provider>
		</PageContainer>
	);
};

export default connect((state) => state)(React.memo(FilterPage));

export async function getServerSideProps({ req, query, res }) {
	try {
		// 最新产品top20 数据过滤条件
		const top20Flag = !!query?.flag ? 1 : 0
		const productIdList = query?.productIdList ? decrypt(query?.productIdList || '')?.split('____') : []
		const sort = decrypt(query?.sort) || ''

		// 搜索条件
		const keywordList = query?.keywords ? decrypt(query?.keywords || '').split('____') : []
		const keyword = last(keywordList) || ''
		// 属性条件
		const manufacturerIdList = query?.manufacturerIdList ? ((query?.manufacturerIdList || '').split(',')) : []
		const attributeIdList = query?.attrList ? ((query?.attrList || '').split(',')) : []

		const catalogId = last(query.slugs);
		if (isNaN(catalogId)) {
			return redirect404()
		}

		// 884 未分类产品
		if (catalogId === '844') {
			return {
				redirect: {
					destination: keyword ? `${PRODUCTS_UNCLASSIFIED}?keyword=${keyword}` : PRODUCTS_UNCLASSIFIED,
					permanent: true,
				}
			}
		}

		const [translations, catalogsBreadcrumb, manufacturerRes] = await Promise.all([
			changeServerSideLanguage(req),
			CatalogRepository.getCatalogBreadcrumbList(catalogId, getLocale(req)), // 获取分类面包屑
			ManufacturerRepository.apiManufacturersCatalogList({ // 供应商数据 分类传供应商id
				manufacturerSlug: query?.manufacturerSlug,
				languageType: getLocale(req),
			}),
		]);
		// const catalogsBreadcrumb = await CatalogRepository.getCatalogBreadcrumbList(catalogId, getLocale(req)); // 获取分类面包屑
		// const manufacturerRes = await ManufacturerRepository.apiManufacturersCatalogList({ // 供应商数据 分类传供应商id
		// 	manufacturerSlug: query?.manufacturerSlug,
		// 	// manufacturerId: query?.manufacturerId,
		// 	languageType: getLocale(req),
		// });

		// 新版
		const filterServerParams = {
			keyword,
			keywordList: keywordList || [],
			manufacturerIdList,
			attributeIdList,
			catalogKeyword: catalogId || '',
			manufacturerKeyword: manufacturerRes?.data?.manufacturerId || '',  // 暂时先不传
			pageListNum: query?.pageNum || PUB_PAGINATION?.pageNum,
			pageListSize: query?.pageSize || PUB_PAGINATION?.pageSize,
			languageType: getLocale(req),
		}

		if (!!top20Flag && productIdList?.length > 0) {
			filterServerParams.top20Flag = top20Flag,
				filterServerParams.productIdList = productIdList
		}

		// 有字段排序
		if (!!sort) {
			const fieldSort = sort?.split('=')
			filterServerParams.sortKeyword = fieldSort?.[0]
			filterServerParams.sortDirection = fieldSort?.[1] == 'asc' ? 1 : 2
			// filterServerParams.sort = sort
		}

		const responseData = await ProductRepository.getProducts(filterServerParams)
		const filterData = await CatalogRepository.getProductFilter(filterServerParams); // 属性筛选条件集合

		// 处理面包屑
		const catalogsBreadcrumbServer = catalogsBreadcrumb?.map(item => {
			const {
				name, description = "",
				catalogId, id, slug
			} = item || {}
			return {
				name, description, catalogId, id, slug
			}
		});

		return {
			props: {
				...translations,
				query,
				filterServerParams,
				filterDataSer: filterData?.data?.data || [],  // 属性筛选条件集合
				queryCatalogId: catalogId, // 分类id
				queryAttrList: attributeIdList || [], // url属性条件id
				manufacturerIdList, // 供应商属性条件id
				queryKeywordList: keywordList, // url关键词
				manufacturerRes: manufacturerRes?.data, // 供应商数据
				productListServer: responseData?.data || [], // 产品列表
				catalogsBreadcrumb: catalogsBreadcrumbServer || [], // 面包屑
				sortField: sort || '' // 排序字段
			},
		}
	} catch (error) {
		res.writeHead(302, { Location: '/404' });
	}
};