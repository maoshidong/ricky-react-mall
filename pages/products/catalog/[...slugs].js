import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Row, Col } from 'antd';
import { connect } from 'react-redux';
import { nanoid } from 'nanoid';
import Link from 'next/link';

import LazyLoad from 'react-lazyload';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';

import last from 'lodash/last';

import dynamic from 'next/dynamic';
const BreadCrumb = dynamic(() => import('~/components/elements/BreadCrumb'));
const PageContainer = dynamic(() => import('~/components/layouts/PageContainer'));
const ManufacturerList = dynamic(() => import('~/components/partials/manufacturer/ManufacturerList'))
const SearchNoData = dynamic(() => import('~/components/ecomerce//minCom/SearchNoData'))
const MinQuerySearch = dynamic(() => import('~/components/ecomerce/minCom/MinQuerySearch'))
const CatalogDescription = dynamic(() => import('~/components/partials/shop/CatalogDescription'))
const NewItemMin = dynamic(() => import('~/components/News/NewItemMin'))
const HotProductsCatalog = dynamic(() => import('~/components/partials/product/HotProductsCatalog'))
const PageTopBanner = dynamic(() => import('~/components/shared/blocks/banner/PageTopBanner'))
const ByManufacturer = dynamic(() => import('~/components/partials/catalog/ByManufacturer'))
import { Tabs } from '~/components/partials';


import { CatalogRepository, outProductRepository, ProductRepository, ManufacturerRepository, NewsRepository } from '~/repositories';

import { encrypt, decrypt, buildUrl, isIncludes } from '~/utilities/common-helpers';
import { getLocale, changeServerSideLanguage, redirect404 } from '~/utilities/easy-helpers';
import { PRODUCTS_CATALOG, PRODUCTS_FILTER, PRODUCTS, PRODUCTS_UNCLASSIFIED } from '~/utilities/sites-url';
import { SEO_COMPANY_NAME, SEO_COMPANY_NAME_ZH } from '~/utilities/constant';

const CatalogDetailPage = ({
	isMobile,
	paramMap,
	catalogDescription, // 分类描述详情
	catalogIdTreeServer, // 分类对应树结构
	queryData,
	manufacturerRes,
	catalogsBreadcrumb,
	queryKeywords,
	queryManufacturerId,
	keywordsProducts, // 根据搜索条件返回的结果
	relaNews,
	relaManufacturer, // 分类相关供应商
	resByManufacturer,
	catalogDescriptionInfo, // 分类描述
	hotProductsListServer, recommendResServer, greatResServer,
}) => {
	// console.log(manufacturerRes,'manufacturerRes----del')
	const { i18Translate, getLanguageName, curLanguageCodeZh, getZhName, getLanguageHost, getLanguageEmpty } = useLanguage();
	const { iItems, iFeaturedManufacturers, iByCategories } = useI18()
	const iRelatedContent = i18Translate('i18CatalogHomePage.Related Content', 'Related Content')
	const iProductIndex = i18Translate('i18MenuText.Product Index', 'Product Index')

	const getBreadCrumb = (catalogsBread) => {
		const breadcrumb = [
			{ text: iProductIndex, url: PRODUCTS }
		];

		let url = PRODUCTS_CATALOG;
		catalogsBread?.forEach(item => {
			url = PRODUCTS_CATALOG + '/' + isIncludes(item?.slug);
			breadcrumb.push({
				text: getLanguageName(item),
				url: url + '/' + item.id,
			})
		})
		let pageUrl = url;
		return [breadcrumb, pageUrl];
	}

	const { keyword, keywords, manufacturerId } = queryData || {}


	const [breadcrumb, pageUrl] = getBreadCrumb(catalogsBreadcrumb); // 面包屑

	const [catalogIdList, setCatalogIdList] = useState(keywordsProducts?.catalogIdList || keywordsProducts?.catalogsVo || []);

	const [withinResults, setWithinResults] = useState(queryKeywords || []); // 添加的搜索条件withinResults
	const [catalogIdTree, setCatalogIdTree] = useState(catalogIdTreeServer ?? [])


	const [arrCatalog, setArrCatalog] = useState([])  // 收集供应商条件返回的所有分类id
	const [searchManufacturers, setSearchManufacturers] = useState({
		catalogTreeVoList: []
	})

	const fContainerRef = useRef(null)
	const navRef = useRef(null)
	const filterRef = useRef(null);
	const bannerRef = useRef(null)

	const checkSticky = () => {
		const element = fContainerRef.current;
		if (element) {
			const rect = element.getBoundingClientRect();
			const bannerHeight = bannerRef.current?.offsetHeight || 0
			if (rect.top > 0) {
				const hh = (bannerHeight-24 || 302) - (rect.top - 80)

				const fHeight = filterRef.current?.offsetHeight || 0
				if (fHeight > 0) {
					hh = hh - fHeight - 10
				}

				if (navRef.current) {
					navRef.current.style.maxHeight = `calc(42vh + ${hh}px)`
				}
			}
		}
	}

	useEffect(() => {
		// 监听浏览器滚动事件
		window.addEventListener('scroll', checkSticky);
		// 组件卸载前移除监听
		return () => window.removeEventListener('scroll', checkSticky);
	}, [])

	const Router = useRouter();
	useEffect(async () => {
		// 用于测试接口速度
		// const catalogId = 22
		// await NewsRepository.apiQueryCatalogRelaNews({catalogId,queryManufacturerId}); // 查询分类相关新闻 630
		// const catalogsBreadcrumb = await CatalogRepository.getCatalogBreadcrumbList(catalogId, 'en'); // 获取分类面包屑
		// await outProductRepository.apiGetRecommendCatalogList(catalogId); // 新的分类树
		// const catalogDescription = await outProductRepository.apiGetCatalogDescription(catalogId); // 分类描述等信息
		// await NewsRepository.apiGetCatalogRelaManufacturer(catalogId, 'en'); // 查询分类相关品牌 50
		// await ManufacturerRepository.apiManufacturersCatalogList({
		// 	manufacturerSlug: '',
		// 	languageType: 'en',
		// });

		// await ProductRepository.apiSearchProductByEs({
		// 	keyword:'PDTC124EE,115',
		// 	keywordList: ['PDTC124EE,115'],
		// 	manufacturerSlug: ''
		// });

		// 热卖、推荐、折扣的参数
		// const threeProductParams = {
		// 	indexFlag: 1, pageSize: 9,
		// 	catalogIdList: [416],
		// 	manufactureId: manufacturerRes?.manufacturerId,
		// 	keywordList: [],
		// 	languageType: 'en',
		// }
		// await outProductRepository.getHotProductsList(threeProductParams), // 热卖产品


			// 不能注释
			setCatalogIdTree(catalogIdTreeServer)
	}, [Router]);
	useEffect(async () => {

		const res = await ProductRepository.apiSearchProductByEs({
			keyword: withinResults?.[0] || '',
			keywordList: withinResults,
			manufacturerSlug: manufacturerRes?.slug
		});
		if (res?.code === 0) {
			let allCatalogsIds = res?.data?.catalogIdList // 型号搜索的结果ids  + 他们的父分类id

			catalogIdTreeServer?.map(i => {
				if (i?.voList?.length > 0) {
					i?.voList?.map(j => {
						const catalogItem = catalogIdList?.find(citem => citem?.id == j?.id)
						// 有子分类就加上父分类id
						if (catalogItem) {
							allCatalogsIds.push({
								id: i?.id,
								productCount: i?.productCount,
							})
						}

						if (j?.voList?.length > 0) {
							j?.voList?.map(k => {
								const catalogItem = catalogIdList?.find(citem => citem?.id == k?.id)
								// 有子分类就加上父分类id
								if (catalogItem) {
									allCatalogsIds.push(
										{
											id: i?.id,
											productCount: i?.productCount,
										},
										{
											id: j?.id,
											productCount: j?.productCount,
										},
									)
								}
							})
						}
					})
				}
			})
		}
	}, [withinResults])

	const isMax = catalogsBreadcrumb?.length === 3
	const getThree = () => {
		let ItemListElement = [
			{
				"@type": "Listitem", "Position": "1",
				"Name": iProductIndex, "Item": `${getLanguageHost()}/products`,
			},
			{
				"@type": "Listitem", "Position": "2",
				"Name": catalogsBreadcrumb[0]?.name,
				"Item": catalogsBreadcrumb?.length === 1 ?
					getLanguageHost() + Router.asPath :
					`${getLanguageHost()}/products/catalog/${isIncludes(catalogsBreadcrumb[0]?.slug)}/${catalogsBreadcrumb[0]?.id}`,
			}
		]

		if (catalogsBreadcrumb?.length >= 2) {
			ItemListElement.push({
				"@type": "Listitem", "Position": "3",
				"Name": catalogsBreadcrumb[1]?.name,
				"Item": catalogsBreadcrumb?.length === 2 ?
					getLanguageHost() + Router.asPath :
					`${getLanguageHost()}/products/catalog/${isIncludes(catalogsBreadcrumb[1]?.slug)}/${catalogsBreadcrumb[1]?.id}`,
			})
		}
		if (isMax) {
			ItemListElement.push({
				"@type": "Listitem", "Position": "4",
				"Name": catalogsBreadcrumb[2]?.name, "Item": getLanguageHost() + Router.asPath,
			})
		}
		return ItemListElement
	}
	// isPartOf, Offers, Mpn, Sku, Brand
	const productsSeo = {
		"@context": "https://schema.org/",
		"@graph": [
			{
				"@type": "Webpage",
				"@id": getLanguageHost() + Router.asPath,
				"Url": getLanguageHost() + Router.asPath,
				"Name": catalogsBreadcrumb[0]?.name,
				"isPartOf": {
					"@type": "Webpage",
					"@id": `${getLanguageHost()}/products/#productindex`,
					"Url": `${getLanguageHost()}/products`,
					"Name": iProductIndex,
				},
				"Image": null,
				"ItemListElement": null,
				"Description": null,
				// "Sku": null, "Mpn": null, "Brand": null, "Offers": null
			},
			{
				"@type": "BreadcrumbList",
				"@id": null,
				"Url": null,
				"Name": null,
				// "isPartOf": null,
				"Image": null,
				"ItemListElement": getThree(),
				"Description": null,
				// "Sku": null, "Mpn": null, "Brand": null, "Offers": null
			},
		]
	}
	{/* 分类数量暂时隐藏 */ }
	const getCatalogsCount = id => {
		const catalogItem = catalogIdTree.find(item => item?.id == id) // 默认分类的数据
		const searchDataItem = keywordsProducts?.catalogIdList?.find(item => item?.id == id) // 搜索出来的数据
		const manufacturersItem = arrCatalog?.find(item => item?.id == id) // 供应商的数据
		return withinResults?.length > 0 ? searchDataItem?.productCount : (manufacturersItem ? manufacturersItem?.productCount : catalogItem?.productCount)
		// return manufacturersItem ? manufacturersItem?.productCount : (withinResults?.length > 0 ? searchDataItem?.productCount : catalogItem?.productCount)
	}

	const handleKeyEnter = () => {
		checkSticky()
	}
	const handleSearch = async (keywordList, delManufacturer) => {
		const currentUrl = Router.asPath.split('?')[0] // 不带参数的当前url
		// const currentUrl = `/${language}${Router.asPath.split('?')[0]}` // 不带参数的当前url
		if (keywordList?.length === 0) {
			if (manufacturerId && delManufacturer !== 'delManufacturer') {
				Router.push(`${currentUrl}?manufacturerId=` + manufacturerId)
				return
			}
			Router.push(currentUrl)
			return
		}

		let params = {};
		// 是否有查询条件
		if (keywordList) {
			params.keywords = encrypt(keywordList.join('____') || '')
		}
		// 是否有制造商
		if (manufacturerId && delManufacturer !== 'delManufacturer') {
			params.manufacturerId = manufacturerId
		}
		const resultURL = await buildUrl(currentUrl, params);
		Router.push(resultURL)

		// const toQueryKeywords =  encrypt(keywordList.join(',') || '') encrypt(keywordList.join)
		// Router.push(`${currentUrl}?keywords=` + toQueryKeywords || '')
	}
	// const handleAddWithin = async (e) => {
	//     e.preventDefault();
	//     if (!withinName || withinName.length < 3) {
	//         setIsInvalid(true)
	//         return
	//     }
	//     setSearchKeywords([...searchKeywords, withinName]);
	//     setWithinResults([...searchKeywords, withinName]);
	//     setWithinName('')
	// }


	// const { description } = _last(catalogsBreadcrumb) || {}
	const { asPath } = Router
	const routerUrl = asPath.split('?')[1]
	// 返回跳转链接
	const getHrefUrL = (allCatalog, subItem) => {
		const findRes = catalogIdTree.find(i => i.id === subItem?.id)
		let url = findRes?.voList?.length > 0 ? `${PRODUCTS_CATALOG}/${isIncludes(findRes?.slug)}/${findRes?.id}` :
			`${PRODUCTS_FILTER}/${isIncludes(findRes?.slug)}/${findRes?.id}`
		// /${allCatalog?.slug} 减少层级
		if (routerUrl) {
			url = `${url}?` + routerUrl
		}

		// 跳转到未分类产品页面 未分类产品的id：844
		if (findRes?.id === 844) {
			url = `${PRODUCTS_UNCLASSIFIED}`
		}

		return url
	}



	// 返回的结果和全部分类匹配
	const isShowCatalog = (subItem, catalogTreeVoList) => {
		if (!catalogTreeVoList || catalogTreeVoList?.length === 0) return true
		return arrCatalog.find(item => item?.id === subItem?.id)
	}
	const otherParams = {
		queryKeywords,
	}
	// 左侧
	const getLeft = allCatalog => {
		return <div ref={fContainerRef} className='ps-product-catalog-left catalogs__top-fixed' style={{top: '130px'}}>
			<div ref={filterRef} className='mb20'>
				<MinQuerySearch
					handleSearch={(e) => handleSearch(e)}
					otherParams={otherParams}
					onEnter={handleKeyEnter}
				/>
				{/* 供应商条件 */}
				{
					manufacturerRes?.name && (
						<div className='applied-filters mt10 pub-flex-align-center' style={{ marginBottom: '-10px' }}>
							<div className='mb10 mr10 pub-fontw pub-font14'>
								{i18Translate('i18CatalogHomePage.Manufacturer Entry', 'Manufacturer Entry')}:</div>
							<div className='product-filter-selected-group pub-border pub-flex-align-center pub-font12 ml0' style={{ 'wordBreak': 'break-all' }}>
								<div className='pub-lh18'>{manufacturerRes?.name}</div>
								<div className='filter-close' onClick={() => handleSearch(queryKeywords, 'delManufacturer')}>
									<div className='ml5 sprite-about-us sprite-about-us-1-4' ></div>
								</div>
							</div>
						</div>
					)
				}
			</div>
			{/* style={{height:"51vh",overflow:'auto'}} */}
			<div className='pub-left-nav catalog-left-nav pub-border15 pl-0 pr-0 pb-10'>
				<div className='categories-title'>{i18Translate('i18CatalogHomePage.Categories', 'Categories')}</div>
				<ul ref={navRef} className='ps-product-catalog-item pl-0' style={{ maxHeight: "42vh", overflow: 'auto' }}>
					{catalogIdTree?.map(subItem => (
						// 和供应商id返回的分类，和搜索返回的分类一致或者搜索关键词为空才展示
						(
							isShowCatalog(subItem, searchManufacturers?.catalogTreeVoList) &&
							((keywordsProducts?.catalogIdList && keywordsProducts?.catalogIdList?.find(i => i?.id == subItem?.id)) || queryKeywords?.length === 0)
						) && (
							<li key={nanoid()}>
								<Link
									href={getHrefUrL(allCatalog, subItem)}
								>
									<a className='ps-product-catalog-name'>{getLanguageName(subItem)}</a>
								</Link>
							</li>
						)

					))}
				</ul>
			</div>
		</div>
	}

	// 改变分类传值
	const catalogsListComponent = (allCatalog) => {
		return (
			<div className='ps-product-catalog-content'>
				<div className='pub-flex-wrap'>
					{/* 左侧 */}
					{getLeft(allCatalog)}
					{/* 右侧  */}
					<div className='ps-product-catalog-right pub-layout-right' style={{ minWidth: "343px" }}>
						{/* 顶级分类名称 */}
						<h2 className='mb10 pub-left-title'>
							{getLanguageName(catalogsBreadcrumb?.[catalogsBreadcrumb?.length - 1])} {iByCategories}</h2>
						<Row gutter={[10, 10]}>
							{catalogIdTree?.map(subItem => (
								// 和供应商id返回的分类，和搜索返回的分类一致或者搜索关键词为空才展示
								(
									isShowCatalog(subItem, searchManufacturers?.catalogTreeVoList) &&
									((keywordsProducts?.catalogIdList && keywordsProducts?.catalogIdList?.find(i => i?.id == subItem?.id)) || queryKeywords?.length === 0)
								) && (
									<Col xs={24} sm={12} md={12} lg={8} xl={6} key={nanoid()}>
										<Link
											key={nanoid()}
											href={getHrefUrL(allCatalog, subItem)}
										>
											<a>
												<div className='ps-product-catalog-item box-shadow'>
													<LazyLoad height={105} once={true} offset={300}>
														<img
															src={`${subItem?.image || getLanguageEmpty()}`}
															title={getLanguageName(subItem)}
															alt={getLanguageName(subItem)}
															className='ps-product-catalog-img'
														/>
													</LazyLoad>
													<div className='pub-direction-column'>
														<p className='ps-product-catalog-name pub-clamp3 pub-line-clamp'>{getLanguageName(subItem)}</p>
														<div className='catalogsCount pub-font12 pub-color555 mt5'>{getCatalogsCount(subItem?.id)} {iItems}</div>
													</div>
												</div>
											</a>
										</Link>
									</Col>
								)
							))}
						</Row>
						{
							(queryKeywords?.length > 0 && keywordsProducts?.catalogCount == 0) && (
								<SearchNoData />
							)
						}
						
						<ByManufacturer
							catalogName={getLanguageName(catalogsBreadcrumb?.[catalogsBreadcrumb?.length - 1])}
							catalogId={catalogsBreadcrumb?.[catalogsBreadcrumb?.length - 1]?.id} resByManufacturer={resByManufacturer} />

					</div>
				</div>
			</div>
		);
	};

	useEffect(async () => {
		// if (manufacturerRes?.slug) {
		// 供应商id下的分类数据
		const { catalogTreeVoList, introduce, logo, name, slug, manufacturerId } = manufacturerRes || {}
		setSearchManufacturers(
			{ catalogTreeVoList, introduce, logo, name, slug, manufacturerId }
		)
		let arrCatalogData = [] // 收集供应商所有分类id
		catalogTreeVoList?.map(i => {
			arrCatalogData.push({
				id: i?.id,
				productCount: i?.productCount,
			})

			if (i?.voList?.length > 0) {
				i?.voList?.map(j => {
					arrCatalogData.push({
						id: j?.id,
						productCount: j?.productCount,
					})

					if (j?.voList?.length > 0) {
						j?.voList?.map(k => {
							arrCatalogData.push({
								id: k?.id,
								productCount: k?.productCount,
							})
							// 多了一层
							if (k?.voList?.length > 0) {
								k?.voList?.map(m => {
									arrCatalogData.push({
										id: m?.id,
										productCount: m?.productCount,
									})
								})
							}

						})
					}
				})
			}
		})
		setArrCatalog(arrCatalogData)
		// }

		// const [pageUrl, breadcrumb] = getBreadCrumb(catalogs1);
	}, [manufacturerRes])


	const iProducts = i18Translate('i18Head.products', 'Products');
	const iFeaturedProducts = i18Translate('i18HomeNextPart.productsTitle', 'Featured Products')
	const iRelatedManufacturer = i18Translate('i18CatalogHomePage.Related Manufacturer', 'Related Manufacturer')
	const iAbout = i18Translate('i18SmallText.About', 'About');
	let tabsArr = [
		{ label: iProducts, value: '0' },
	]
	const isShowProducts = [...hotProductsListServer, ...recommendResServer, ...greatResServer]?.length !== 0
	if(isShowProducts) {
		tabsArr.push({ label: iFeaturedProducts, value: '1' })
	}
	if(relaNews?.length > 0) tabsArr.push({ label: iRelatedContent, value: '4' });
	if(!queryManufacturerId) {
		tabsArr.push({ label: iRelatedManufacturer, value: '2' })
	}
	if(catalogDescriptionInfo) tabsArr.push({ label: iAbout, value: '3' });


	const allCatalogsArr = catalogsBreadcrumb?.slice()?.reverse().map(i => {
		return getZhName(i)
	})

	const getName = (str = ', ') => {
		return manufacturerRes?.name ? (manufacturerRes?.name + str) : ''
	}

	const catalogName = getLanguageName(last(catalogsBreadcrumb))
	const seoHeadTitle = `${allCatalogsArr?.join(' / ')} ${curLanguageCodeZh() ? SEO_COMPANY_NAME_ZH : SEO_COMPANY_NAME}`
	const descriptionContent = `${allCatalogsArr?.reverse().join(' ')} - Origin Data provides real-time inventory updates and pricing. order now, ${catalogsBreadcrumb?.[0]?.name} ship quickly.`
	// /products/catalog/audio-products/2?manufacturerSlug=audio-products   没有audio-products这个供应商短语 为什么会有这个url
	return (
		<PageContainer isMobile={isMobile} paramMap={paramMap}>
			<Head>
				<title>{getName(" & ") + seoHeadTitle}</title>
				<meta property="og:title" content={getName() + seoHeadTitle} key="og:title" />
				{/* keywords 子级name, 上级name */}
				<meta name="keywords" content={getName() + (catalogDescription?.seoKeyword || allCatalogsArr?.join(', '))} key="keywords" />
				<meta name="description" content={getName() + descriptionContent} key="description" />
				<meta name="og:description" content={getName() + descriptionContent} key="og:description" />
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSeo) }}></script>
			</Head>
			<div ref={bannerRef}>
				<PageTopBanner
					bgcImg={catalogDescription?.banner || "productIndex2.jpg"}
					isdynamic={catalogDescription?.banner}
					title={catalogName}
					titleH1={true}
				/>
			</div>

			<div id="shop-categories" className="ps-page--shop ps-page-catalog" style={{ paddingBottom: 0 }}>
				<Tabs tabsArr={tabsArr} offset={-140} duration={300} />
				<div className='ps-container'>
					<BreadCrumb breacrumb={breadcrumb} />
					<div name="0" className="ps-product-container" style={{ marginTop: '25px' }}>
						{catalogsListComponent(last(catalogsBreadcrumb), keyword, searchManufacturers)}
						
					</div>
					{/* 热卖，推荐，折扣 */}
					{/* <div style={{marginTop: '-10px', marginBottom: '-80px'}}>
                        <div className='mt40 pub-left-title mb10'>{i18Translate('i18HomeNextPart.productsTitle', "Featured Products")}</div>

                        <ProductsRecommended
                            type="2"
                            hotProductsList={hotProductsListServer}
                            recommendResServer={recommendResServer}
                            greatResServer={greatResServer}
                        /> 
                    </div> */}
					{ [...hotProductsListServer, ...recommendResServer, ...greatResServer]?.length !== 0 && <div className='mt60' name="1">
						<HotProductsCatalog
							hotProductsList={hotProductsListServer}
							recommendResServer={recommendResServer}
							greatResServer={greatResServer}
						/>
					</div>}


					{/* 相关新闻 */}
					{
						relaNews?.length > 0 && <div className='mt60 mb30 pub-title-more' name="4">
							<div className='pub-title'>{iRelatedContent}</div>
						</div>
					}
					{
						<Row gutter={[10, 10]} className='pub-flex-wrap'>
							{relaNews?.slice(0, 6)?.map((item, index) => {
								return (
									<Col xs={24} sm={12} md={12} xl={8} lg={8} key={index}
										className='pub-flex' style={{ alignItems: 'stretch' }}
									>
										<NewItemMin item={item} />
									</Col>
								)
							})}
						</Row>
					}

					{/* 如果有制造商id就不显示相关制造商的信息 */}
					{!queryManufacturerId && (
						<div name="2">
							{
								relaManufacturer?.length > 0 && <div className='mt60 mb30 pub-title-more'>
									<div className='pub-title'>{iFeaturedManufacturers}</div>
								</div>
							}

							<div className='blocks-featured-manufacturer pb-0'>
								<ManufacturerList manufacturerList={relaManufacturer?.slice(0, 10) || []} />
							</div>
						</div>)}

				</div>
				{catalogDescriptionInfo ? <div className='mt50' style={{ background: '#fff' }}>
					<div name="3" style={{
						maxWidth: '1440px',
						margin: '0 auto',
						paddingBottom: '60px'
					}}>
						<CatalogDescription
							catalogName={catalogName}
							description={catalogDescriptionInfo}
						/>
					</div>
				</div> : <div style={{ height: '50px' }} />}
			</div>
		</PageContainer>
	);
};

export default connect((state) => state)(CatalogDetailPage);

export async function getServerSideProps({ req, query, res }) {
	try {
		const languageType = getLocale(req)
		// 处理query条件
		const keywordList = query?.keywords ? decrypt(query?.keywords || '').split('____') : []
		const keyword = last(keywordList) || ''

		const catalogId = last(query.slugs)
		if (isNaN(catalogId)) {
			return redirect404()
		}

		const [translations, catalogsBreadcrumb, catalogIdTreeRes, manufacturerRes, catalogDescription, relaManufacturer, byManufacturer] = await Promise.all([
			changeServerSideLanguage(req),
			CatalogRepository.getCatalogBreadcrumbList(catalogId, languageType), // 获取分类面包屑
			outProductRepository.apiGetRecommendCatalogList(catalogId, languageType), // 当前分类对应的所有分类树
			// 供应商对应的分类
			ManufacturerRepository.apiManufacturersCatalogList({
				manufacturerSlug: query?.manufacturerSlug, languageType,
			}),
			outProductRepository.apiGetCatalogDescription(catalogId, languageType), // 分类描述等信息
			NewsRepository.apiGetCatalogRelaManufacturer(catalogId, languageType), // 查询分类相关品牌
			CatalogRepository.apiSearchCatalogManufacturersList({
				catalogId, languageType, keywordList,
			}), // 搜索分类关联品牌
		])

		// 这里使用 map() 方法遍历数组中的每个对象，返回一个新的对象，只包含需要保留的属性。在返回的对象中，使用对象字面量的语法和解构赋值的方式，只保留 id、name 和 age 属性。
		// 要过滤掉某些特定的属性，可在对象字面量中排除，例如： const filteredData = data.map(({ gender, ...item }) => item);
		const filteredRelaManufacturer = relaManufacturer?.data.filter(({ logo }) => !!logo).map(({ introduce, website, ...item }) => item);

		const params = { keyword, keywordList }
		// 热卖、推荐、折扣的参数
		const threeProductParams = {
			indexFlag: 1, pageSize: 10,
			catalogIdList: [catalogId],
			manufacturerId: manufacturerRes?.data?.manufacturerId,
			keywordList,
			languageType,
		}
		const [keywordsProducts, relaNews, hotProductsListRes, recommendRes, greatRes] = await Promise.all([
			// 根据搜索条件返回的结果
			ProductRepository.apiSearchProductByEs(params),
			// 查询分类相关新闻
			NewsRepository.apiQueryCatalogRelaNews({
				manufactureId: manufacturerRes?.data?.manufacturerId,
				catalogId,
				languageType,
			}),
			outProductRepository.getHotProductsList(threeProductParams), // 热卖产品
			outProductRepository.getRecommendListWeb(threeProductParams), // 推荐产品
			outProductRepository.getGreatDealsList(threeProductParams), // 推荐产品
		])

		// 只保留新闻部分
		const relaNewsServer = relaNews?.data?.slice(0, 6)
		const hotProductsList = hotProductsListRes?.data?.data?.slice(0, 10)?.map(item => {
			const { name='', description='', image='', thumb='', manufacturerLogo='', manufacturerId='', productId='' } = item || {}
			let obj = { name, description, image: thumb || image || '', manufacturerLogo, manufacturerId, productId }
			return obj
		});


		return {
			props: {
				...translations,
				query: query?.slugs || [],
				queryData: query,
				catalogIdTreeServer: catalogIdTreeRes?.data || [], // 当前分类对应的所有分类树
				manufacturerRes: manufacturerRes?.data || {}, // 供应商数据
				catalogsBreadcrumb, // 分类面包屑
				queryKeywords: keyword ? keywordList : [], // 关键词
				queryManufacturerId: query?.manufacturerId || '',
				keywordsProducts: keywordsProducts?.data,
				catalogDescription: catalogDescription?.data || {}, // 分类描述等信息
				catalogDescriptionInfo: catalogDescription?.data?.description || '',
				relaNews: relaNewsServer || [], // 分类相关新闻
				relaManufacturer: filteredRelaManufacturer || [], // 分类相关品牌
				resByManufacturer: byManufacturer?.data || [], // 搜索分类关联品牌

				hotProductsListServer: hotProductsList || [],
				recommendResServer: recommendRes?.data?.data || [],
				greatResServer: greatRes?.data?.data,
			},
		}
	} catch (error) {
		res.writeHead(302, { Location: '/404' });
		// res.writeHead(302, { Location: '/page/page-404' });
	}
};
