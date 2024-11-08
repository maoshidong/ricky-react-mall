import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';

import last from 'lodash/last';
import noop from 'lodash/noop';
import { Button, Space } from 'antd';

import Head from 'next/head';
import { useRouter } from 'next/router';

import dynamic from 'next/dynamic';
import CustomInput from '~/components/common/input';
const BreadCrumb = dynamic(() => import('~/components/elements/BreadCrumb'));
const PageContainer = dynamic(() => import('~/components/layouts/PageContainer'));
const ExternalShare = dynamic(() => import('~/components/shared/public/ExternalShare')); // 对外分享
const ProductDetailFullwidth = dynamic(() => import('~/components/elements/detail/zqx/ProductDetailFullwidth')); // 对外分享


import { outProductRepository, ProductRepository, NewsRepository, CatalogRepository, CommonRepository } from '~/repositories';

import { SEO_COMPANY_NAME, SEO_COMPANY_NAME_ZH } from '~/utilities/constant'
import { ProductsDetailContext } from '~/utilities/shopCartContext'
import { PRODUCTS_FILTER, PRODUCTS_CATALOG, PRODUCTS, MANUFACTURER } from '~/utilities/sites-url';
import { getLocale, changeServerSideLanguage, redirect404 } from '~/utilities/easy-helpers';
import { copy, isIncludes } from '~/utilities/common-helpers';
import { getCurrencyInfo } from '~/repositories/Utils';

import useEcomerce from '~/hooks/useEcomerce'
import useLocalStorage from '~/hooks/useLocalStorage'
import useLanguage from '~/hooks/useLanguage'

// sys_shipping_time
const ProductsDetailPage = (props) => {
	const {
		i18Translate, getLanguageName, curLanguageCodeZh,
		getLanguageHost, getLanguageEmpty, temporaryClosureZh } = useLanguage();
	const [recentViewLoc] = useLocalStorage('recentViewLoc', []) // 首页浏览记录
	const iHome = i18Translate('i18MenuText.Home', 'Home')
	const iProductIndex = i18Translate('i18MenuText.Product Index', 'Product Index')
	const currencyInfo = getCurrencyInfo()

	// 面包屑
	const getBreadCrumb = (catalogsBreadcrumb, name, asPath) => {
		const breadcrumb = [
			{ text: iHome, url: '/', },
			{ text: iProductIndex, url: PRODUCTS }
		];

		catalogsBreadcrumb?.forEach((item, index) => {
			const url = `${PRODUCTS_CATALOG}/${isIncludes(item?.slug)}`;
			const pageUrl = `${PRODUCTS_FILTER}/${isIncludes(item?.slug)}`;

			breadcrumb.push({
				text: getLanguageName(item),
				url: index === catalogsBreadcrumb.length - 1 ? `${pageUrl}/${item.id}` : `${url}/${item.id}`
			});
		});

		// 型号的url
		breadcrumb.push({
			text: name,
			url: asPath
		})

		return breadcrumb;
	}

	const {
		newProductServer,
		productPrices,
		serverToken,
		newsServer,
		catalogSeries,
		otherProducts,
		paramMap, isMobile,
		authList,
		productLatestList,
		prodList,
		compareListSer, // 产品对比记录
	} = props;
	// console.log(paramMap, 'paramMap---del')
	let isHavePriceList = true
	if (
		productPrices[0]?.unitPrice === 0 ||
		productPrices?.length === 0 ||
		!productPrices || newProductServer?.quantity === 0 ||
		temporaryClosureZh()
	) {
		isHavePriceList = false
	}

	const { addItem } = useEcomerce();
	const Router = useRouter();
	const [newProduct, setNewProduct] = useState(newProductServer ?? {}) // 初始拿到服务端的数据
	const [productDetailData, setProductDetailData] = useState(newProductServer ?? {})
	const { updateProductDetailData } = useContext(ProductsDetailContext)
	const [isShowShare, setIsShowShare] = useState(false)

	const [defaultValue, setDefaultValue] = useState(getLanguageHost() + Router.asPath)
	const [successCopy, setSuccessCopy] = useState(false) // 成功复制
	const [isLog] = useLocalStorage('isLog', false); // 是否是账号登录
	const [customerReference, setCustomerReference] = useState('')
	// 产品详情数据
	const {
		id, name, manufacturerSlug, manufacturer, description, isPopular, isRecommend,
		image, thumb, quantity, catalogsList, catalogSlug, publishedAt, updatedAt
	} = productDetailData || {}
	// console.log(productDetailData, 'productDetailData---del')
	// 面包屑数据
	const breadcrumb = getBreadCrumb(catalogsList, name, Router.asPath);

	const [productData, setProductData] = useState({
		name,
		manufacturer_slug: manufacturer?.name || '',
		description,
		image,
		thumb,
		quantity,
		product_prices: productPrices?.[0]?.unitPrice || 0,
	})

	useEffect(() => {
		updateProductDetailData(newProductServer)
		setNewProduct(newProductServer)
		setProductDetailData(newProductServer)
		setCustomerReference(newProductServer?.userProductTag)
	}, [newProductServer])

	useEffect(async () => {
		if (!id) {
			throw new Error('Internal Server Error');
		}
		// const a = await outProductRepository.getNewProductListWebForDetail()
		// const proByCatalog = await outProductRepository.getNewProductListWebForDetail({
		// 	catalogId: 263,
		// 	pageNum: 1,
		// 	pageSize: 9,
		// });
		// /products/detail/4947/5265435 不慢啊!
		// 测试页面所有接口速度
		// const catalogId = _last(newProduct?.catalogsList)?.id
		// await changeServerSideLanguage();
		// await ProductRepository.getNewProductsById(props?.productId); // 产品详情
		// await NewsRepository.apiQueryProductRelaNews({productId: props?.productId}); // 产品相关新闻
		// await CatalogRepository.apiGetCatalogSeriesList({ catalogId }); // 分类相关系列
		// const keyword = newProduct?.name?.slice(0, -2)
		// const params1 = {
		//     pageListNum: 1,
		//     pageListSize: 5,
		//     catalogId,
		//     seriesName: keyword,
		// }
		// await ProductRepository.apiGetLikeProductList(params1) // 相关产品
		// await CommonRepository.apiAuthList({languageType: 'en'}) // 认证类型

		// // const otherProducts = await ProductRepository.apiGetLikeProductList({
		// //     catalogId: 171,
		// //     seriesName: 'SA16B3',
		// // }) // 相关产品
		// const otherProducts = await ProductRepository.apiGetLikeProductList(props?.params1) // 相关产品
	}, []);

	// 用户自定义备注
	const updateCustomerReference = (remark, state) => {
		if (state === 'init') {
			setCustomerReference(remark)
		} else {
			outProductRepository.editProductTag({
				productId: id,
				tag: remark,
			});
			setCustomerReference(remark)
		}
	}

	const handleClick = async () => {
		const res = await CommonRepository.apiGetShareUrlLink({
			realUrl: getLanguageHost() + Router.asPath
		})
		if (res?.code === 0) {
			setDefaultValue(`${getLanguageHost()}/short/${res?.data}`)
		}
		setIsShowShare(true)
	}

	const handleCopy = () => {
		//后端返回分享链接参数
		copy(defaultValue);
		setSuccessCopy(true)
	}

	useEffect(async () => {

		const data = {
			id,
			name,
			description,
			image,
			thumb,
			manufacturerSlug,
			manufacturer: manufacturer?.name,
			manufacturerLogo: manufacturer?.logo || '',
			catalogSlug,
			catalog: last(catalogsList)?.name,
			catalogId: last(catalogsList)?.id,
			datetime: new Date().toLocaleString(),
		};
		addItem(data, recentViewLoc, 'recentview');
		// 访问量
		outProductRepository.addProductRecord({ productId: id }, serverToken);
	}, []);

	const baseUrl = getLanguageHost()  // 基础前缀url
	const curUrl = baseUrl + Router.asPath;

	// const nameSeo = `${name} ${productData.manufacturer_slug}`;
	// const keywordsSeo = `${productData.name}, Buy ${productData.name}, ${productData.manufacturer_slug} ${name}, ${name} ${productData.manufacturer_slug} ${id}-${name}, ${name} Datasheet, ${name} pdf, ${name} data sheets, ${name} manual, ${name} alldatasheet, ${name} free, ${name} Datasheets, ${name} databook. Transistor, diodes, capacitor, Displays, connector, Sensor.`

	const one = `${baseUrl}/products`;
	const two = `${baseUrl}/products/catalog/${isIncludes(catalogsList?.[0]?.slug)}/${catalogsList?.[0]?.id}`;
	const three = `${baseUrl}/products/${catalogsList?.length === 2 ? 'filter' : 'catalog'}/${isIncludes(catalogsList?.[1]?.slug)}/${catalogsList?.[1]?.id}`
	const four = `${baseUrl}/products/${catalogsList?.length === 3 ? 'filter' : 'catalog'}/${isIncludes(catalogsList?.[2]?.slug)}/${catalogsList?.[2]?.id}`
	const five = `${baseUrl}${PRODUCTS_FILTER}/${isIncludes(catalogsList?.[3]?.slug)}/${catalogsList?.[3]?.id}`

	const getItemListElement = () => {
		let ItemListElement = [
			{
				"@type": "Listitem", "position": "1",
				"name": iProductIndex, "item": one,
			},
			{
				"@type": "Listitem", "position": "2",
				"name": getLanguageName(catalogsList?.[0]), "item": two,
			},
		]
		if (catalogsList?.length >= 2) {
			ItemListElement.push({
				"@type": "Listitem", "position": "3",
				"name": getLanguageName(catalogsList?.[1]), "item": three,
			})
		}
		if (catalogsList?.length >= 3) {
			ItemListElement.push({
				"@type": "Listitem", "position": "4",
				"name": getLanguageName(catalogsList?.[2]), "item": four,
			})
		}
		if (catalogsList?.length >= 4) {
			ItemListElement.push({
				"@type": "Listitem", "position": "5",
				"name": getLanguageName(catalogsList?.[3]), "item": five,
			})
		}
		// if(isMax) {
		ItemListElement.push({
			"@type": "Listitem", "position": `${Number(catalogsList?.length) + 2}`,
			"name": name, "item": curUrl,
		})
		// }
		// (manufacturer?.name || '') + ' ' +  加上供应商不适用
		return ItemListElement
	}

	// /samtec/BTSW-108-01-F-S/10446035
	// 未填写字段“review”（非严重）   未填写字段“aggregateRating”（非严重） 如果您的产品详情页没有相关的评价和评分信息，您可以选择不填写这两个字段。这并不会对页面的排名和展示效果产生严重影响。
	// 未填写字段“priceValidUntil”（非严重）
	const iCompanyName = i18Translate('i18CompanyInfo.Origin Electronic Parts Mall', process.env.title)
	const brandUrl = (manufacturer && +manufacturer?.slugStatus === 1) ? `${getLanguageHost()}${MANUFACTURER}/${isIncludes(manufacturer?.slug)}` : null
	const productsSeo = {
		"@context": "https://schema.org/",
		// "datePublished": publishedAt,  // Schema.org 词汇无法识别属性 datePublished。 https://sem.3ue.com/
		// "schema:dateModified": Schema.org 词汇无法识别属性 schema:dateModified。 https://sem.3ue.com/
		"@graph": [
			{
				"@type": "Webpage",
				"@id": getLanguageHost() + Router.asPath,
				"url": getLanguageHost() + Router.asPath,
				"name": (manufacturer?.name || '') + ' ' + name,
			},
			{
				"@type": "BreadcrumbList",
				"ItemListElement": getItemListElement(),
			},
			{
				"@type": "Product",
				"name": name,
				"image": image || manufacturer?.logo || `${getLanguageHost()}${getLanguageEmpty()}`,
				"description": description || name,
				"sku": `${id}-${name}`,
				"mpn": name,
				"brand": {
					"@type": "Brand",
					"name": (manufacturer?.name || '')
				},
				"offers": {
					"priceValidUntil": "2030-12-31T23:59:59+08:00",
					"@type": "Offer",
					"url": getLanguageHost() + Router.asPath,
					"priceCurrency": currencyInfo.value,
					"price": productData.product_prices,
					"availability": "https://schema.org/InStock",
					...(productData.product_prices === 0 && {
						"priceSpecification": {
							"@type": "PriceSpecification",
							"name": "Request a quote for pricing",
							"priceCurrency": "USD",
							"price": "0"
						}
					}),
					// "availability":"https://schema.org/" + (productData.product_prices > 0 ? 'InStock' : 'OutOfSto'), // OutOfStock无货，InStock有货,
					"seller": {
						"@type": "Organization", "name": iCompanyName
					},
					"hasMerchantReturnPolicy": {
						"@type": "MerchantReturnPolicy",
						"applicableCountry": "XX",
						"returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
						"merchantReturnDays": 30,
						"returnMethod": "https://schema.org/ReturnByMail",
						"returnFees": "https://schema.org/FreeReturn"
					},
					"shippingDetails": {
						"@type": "OfferShippingDetails",
						"shippingRate": {
							"@type": "MonetaryAmount",
							"minValue": 50,
							"maxValue": 100,
							"currency": "USD"
						},
						"shippingDestination": {
							"@type": "DefinedRegion",
							"addressCountry": "XX"
						},
						"deliveryTime": {
							"@type": "ShippingDeliveryTime",
							"handlingTime": {
							"@type": "QuantitativeValue",
							"minValue": 1,
							"maxValue": 2,
							"unitCode": "DAY"
							},
							"transitTime": {
							"@type": "QuantitativeValue",
							"minValue": 3,
							"maxValue": 5,
							"unitCode": "DAY"
							}
						}
					},
				}
			}
		]
	}

	const iShare = i18Translate('i18AboutProduct.Share', 'Share')
	// const iShareThis = i18Translate('i18AboutProduct.Share This', 'Share This')
	// const iSharThisOn = i18Translate('i18AboutProduct.Share this on', 'Share this on:')
	const iCopy = i18Translate('i18SmallText.Copy', 'Copy')
	const siteNameSeo = `${name} ${manufacturer?.name} / ${catalogsList?.[0]?.name} ${curLanguageCodeZh() ? SEO_COMPANY_NAME_ZH : SEO_COMPANY_NAME}`;
	const allCatalogsArr = catalogsList?.slice()?.map(i => {
		return i?.name
	})

	const iFromManufacturer = i18Translate('i18AboutProduct.From Manufacturer', 'From Manufacturer')
	const iitIsAn = i18Translate('i18AboutProduct.it is an', 'it is an')
	const iPartOf = i18Translate('i18AboutProduct.part of', 'part of')
	const iTags = i18Translate('i18AboutProduct.Tags', 'tags')
	const iHotProducts = i18Translate('i18MenuText.Hot Products', "Hot Products")
	const iRecommendedProducts = i18Translate('i18MenuText.Recommended Products', "Recommended Products")
	const stockStatus = i18Translate('i18AboutProduct.stock status', "stock status")
	const text2 = i18Translate('i18AboutProduct.noHavePriceTex1', "need to confirm with us, contact us! Quick Reply.")
	// 有货无货
	// const havePrice = `${name} - ${iFromManufacturer}: ${manufacturer?.name}, ${iitIsAn} ${description}, ${iPartOf} ${allCatalogsArr?.join(', ')}. ${isPopularText} ${stockStatus}: ${text1}`
	const languageStop = curLanguageCodeZh() ? '。' : '.'  // 语言对应句号
	const noHavePrice = `${name} - ${iFromManufacturer}: ${manufacturer?.name}, ${iitIsAn} ${description}, ${iPartOf} ${allCatalogsArr?.join(', ')}${languageStop} ${name} ${stockStatus}: ${text2}`

	// const isPopularText = isPopular ? `${name} ${iTags}: ${iHotProducts}. ${name}` : name // 是否热卖, 推荐，折扣
	let isPopularText = []
	if (isPopular === 1) { isPopularText.push(iHotProducts) }
	if (isRecommend === 1) { isPopularText.push(iRecommendedProducts) }
	if (isPopular !== 1 && isRecommend !== 1) isPopularText = []
	// if (isPopular === 1) { isPopularText += `${iHotProducts}, ` }
	// if (isRecommend === 1) { isPopularText += `${iRecommendedProducts}, ` }
	// if (isPopular !== 1 && isRecommend !== 1 ) isPopularText = null

	// 测试型号： 非热卖，推荐，折扣 ： NN01-102(9542062)，
	//  热卖 TPS82084SILR(932338)    无货： LB6Z-103(11886211)
	let i18Options = {
		partNumber: name,
		manufacturer: manufacturer?.name,
		description,
		allCatalogName: allCatalogsArr?.join(', '),
		hotProducts: (isPopular !== 1 && isRecommend !== 1) ? '' : `${name} ${iTags}: ${isPopularText}${languageStop}`,
	}

	// seoy优化    
	// 1. <meta> 标签中堆砌关键词。产品型号过多
	// 2. Product 标记代码将总体评级添加
	// 3. 让您的文本内容更具可读性。
	// 与竞争对手相比，基于文本的内容难以阅读和理解。请尝试提高您内容的可读性。
	// 4. 丰富您的页面内容。
	// 与您的竞争对手相比，一些相关词语没有在您的页面内容中出现。
	// 尝试使用以下语义相关的词语来丰富您的页面内容：
	const i18Title = i18Translate('i18Seo.productsDetail.title', "", {
		partNumber: name,
		manufacturer: manufacturer?.name, description,
		oneCatalogName: catalogsList?.[0]?.name,
	}) // 旧的：siteNameSeo
	const i18Key = i18Translate('i18Seo.productsDetail.keywords', "", {
		partNumber: name,
		manufacturer: manufacturer?.name, description,
		lastCatalogName: last(catalogsList)?.name,
	}) // 旧的：keywordsSeoNew
	const i18Des = i18Translate('i18Seo.productsDetail.description', "", i18Options)  // descriptionSeo
	const descriptionSeo = isHavePriceList ? i18Des : noHavePrice

	return (
		// seo={seo} global={global} PageContainer
		<PageContainer paramMap={paramMap} isMobile={isMobile}>
			<Head>
				{/* pt-BR */}
				{/* <link rel="alternate" hreflang="pt-BR" href={baseDomain + Router.asPath}/> */}
				{/* <link rel="alternate" hreflang="en" href={baseDomain + Router.asPath} alt={nameSeo} /> */}
				{/* <link rel="alternate" hreflang="en" itemprop="image" alt={nameSeo} /> */}
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSeo) }}></script>
				<title>{i18Title}</title>
				<meta name="description" content={descriptionSeo} key="description" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="author" content={getLanguageHost()} key="author" />
				<meta itemProp="name" content={siteNameSeo} key="name" />
				<meta itemProp="url" content={getLanguageHost() + Router.asPath} key="url" />
				<meta property="og:url" content={getLanguageHost() + Router.asPath} key="og:url" />
				<meta property="og:site_name" content={siteNameSeo} key="og:site_name" />
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta property="og:description" content={descriptionSeo} key="og:description" />
				<meta property="og:image" content={image} key="og:image" />
				<meta property="og:type" content="product" key="og:type" />
				<meta property="fb:admins" content="null" key="fb:admins" />
				<meta httpEquiv="content-language" content="en-us" key="content-language" />
			</Head>
			<ProductsDetailContext.Provider
				value={{
					paramMap,
					isLog,
					isHavePrice: isHavePriceList,
					customerReference,
					productDetailData,
					descriptionSeo,
					catalogSeries, // 分类相关系列
					otherProducts, // 相关产品
					authList, // 认证列表
					compareListSer, // 对比记录
					productLatestList: productLatestList?.filter(i => i?.productId !== newProductServer?.id),
					prodList,
					updateIsHavePrice: noop(),
					updateCustomerReference,
				}}
			>
				<div className='custom-antd-btn-more' style={{ background: '#f5f7fa', position: 'relative' }}>
					<div className='ps-container pub-flex-between' style={{ position: 'relative', display: 'flex' }}>
						<BreadCrumb breacrumb={breadcrumb} isShowShare={false} layout="fullwidth" />
						<div
							className='pub-flex-align-center detail-share mt16'
						>
							<div onClick={handleClick} className='pub-cursor-pointer'>
								<i className="fa fa-share-alt pub-color-link"></i>
								<span className='ml10 pub-font14 pub-color-hover-link'>{iShare}</span>
							</div>
							{/* 分享  */}
							{
								isShowShare && (
									<>
										<div className='pub-modal-box-bgc pub-show-modal-box-bgc'></div>
										<div className="share-content" id="pub-modal-box" style={{ top: "50px", right: '0' }}>
											<div className="pub-modal-content">
												<div className='pub-modal-arrow'></div>
												<div className='pub-modal-title' style={{ justifyContent: 'space-between', paddingRight: '30px' }}>
													<div className='pub-flex-align-center'>
														<div className='mr10 sprite-icon4-cart sprite-icon4-cart-3-10'></div>
														{iShare}</div>
													<i className="icon icon-cross2 pub-cursor-pointer" onClick={() => { setIsShowShare(false), setSuccessCopy(false) }}></i>
												</div>
												<div className='share-text'>
													{/* <div className='pub-font13 pub-color555 mb5'>{iSharThisOn}</div> */}
													<div className='mb20 pub-flex-align-center'>
														<ExternalShare jointUrl={`${name || ''} ${manufacturer?.name || ''} - `} name={name} manufacturerName={manufacturer?.name} paramMap={paramMap} />

													</div>
													<Space.Compact
														style={{ minWidth: '330px' }}
													>
														<CustomInput defaultValue={defaultValue} />
														<Button
															type="primary" ghost
															className='ps-add-cart-footer-btn custom-antd-primary'
															onClick={handleCopy}
														>{iCopy}</Button>

													</Space.Compact>
													{
														successCopy && <span className='pub-flex-align-center pub-success mt10'>{i18Translate('i18SmallText.Success Copy', 'Success Copy.')}</span>
													}
												</div>
											</div>
										</div>

									</>
								)
							}
						</div>
					</div>
				</div>

				<div className="ps-page--product" style={{ background: '#f5f7fa' }}>
					<div className='ps-container ps-product--detail pb60'>
						<ProductDetailFullwidth
							paramMap={paramMap}
							newProduct={newProduct}
							newsServer={newsServer}
							productPrices={productPrices}
						/>
					</div>
				</div>
			</ProductsDetailContext.Provider>
		</PageContainer>

	);
};

export default connect((state) => state)(ProductsDetailPage);

export async function getServerSideProps({ req, params }) {
	const { account = "" } = req.cookies;
	const serverToken = account.trim() !== "" && JSON.parse(account)?.token;
	const languageType = getLocale(req);
	let { slugs } = params;
	let productId = last(slugs);

	if (isNaN(productId)) {
		return redirect404();
	}

	try {
		const [translations, newProductResponse] = await Promise.all([
			changeServerSideLanguage(req), // 页面基础信息
			ProductRepository.getNewProductsById(productId, languageType, serverToken), // 产品详情
		]);

		const newProductServer = newProductResponse?.data?.data || {};

		if (!newProductServer?.id) {
			return redirect404();
		}

		const catalogId = last(newProductServer?.catalogsList)?.id || '';
		const [newsProductResponse, catalogSeriesResponse, otherProductsResponse, compareListSerResponse, authListResponse, proByCatalog] = await Promise.all([
			NewsRepository.apiQueryProductRelaNews({ productId, languageType }),
			CatalogRepository.apiGetCatalogSeriesList({ catalogId }),
			// seriesName太短导致速度慢，最少留三位
			ProductRepository.apiGetLikeProductList({
				pageListNum: 1, pageListSize: 5, catalogId,
				seriesName: newProductServer?.name?.length > 5 ? newProductServer?.name?.slice(0, -2) : newProductServer?.name?.slice(0, 3),
				languageType: getLocale(req)
			}),
			ProductRepository.productCompareList({ firstProductId: newProductServer?.id }),
			CommonRepository.apiAuthList({ languageType }),
			outProductRepository.getNewProductListWebForDetail({ catalogId: catalogId, pageNum: 1, pageSize: 18, languageType })
		]);

		// 获取最新产品的9条产品数据
		// const proLatest = await outProductRepository.getNewProductListWebForDetail({
		// 	pageNum: 1,
		// 	pageSize: 9,
		// });
		// const prodList = proLatest?.data || []
		const prodList = []

		// 根据分类取最新产品的18条数据
		// const proByCatalog = await outProductRepository.getNewProductListWebForDetail({
		// 	catalogId: catalogId,
		// 	pageNum: 1,
		// 	pageSize: 18,
		// });
		const prodCatalogList = proByCatalog?.data || []
		// 最新的18条数据
		const productLatestList = [...prodCatalogList, ...prodList]
		// const productLatestList = []

		return {
			props: {
				...translations,
				serverToken,
				newProductServer,
				newsServer: newsProductResponse?.data?.data || [],
				productPrices: newProductServer?.pricesList || [],
				// productPrices: languageType === 'en' ? (newProduct?.data?.data?.pricesList || []) : [], // 中文关闭, 设置为无价
				catalogSeries: catalogSeriesResponse?.data?.data || [],
				otherProducts: otherProductsResponse?.data || {},
				productId,
				authList: authListResponse?.data || [],
				productLatestList: productLatestList?.filter(i => i?.productId !== productId),
				prodList: prodList,
				compareListSer: compareListSerResponse || [],
			},
		};
	} catch (error) {
		console.error("Error fetching data:", error);
		return redirect404();
	}
}