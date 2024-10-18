import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import last from 'lodash/last';
import BreadCrumb from '~/components/elements/BreadCrumb';

import dynamic from 'next/dynamic';
const PageContainer = dynamic(() => import('~/components/layouts/PageContainer'));
const PubProductsTable = dynamic(() => import('~/components/ecomerce/minTableCom/PubProductsTable'));

import { CatalogRepository, outProductRepository } from '~/repositories';
import useLanguage from '~/hooks/useLanguage';

import { getLocale, changeServerSideLanguage } from '~/utilities/easy-helpers';
import { SEO_COMPANY_NAME, SEO_COMPANY_NAME_ZH, PUB_PAGINATION } from '~/utilities/constant';
import { isIncludes } from '~/utilities/common-helpers';
import { getEnvUrl, PRODUCTS, PRODUCTS_FILTER, PRODUCTS_CATALOG, SERIES_PRODUCT_NUMBER } from '~/utilities/sites-url'

const ProductHighlightsIndex = ({ paramMap, seriesProduct, seriesDetail, catalogsBreadcrumb }) => {
	// console.log(seriesDetail, 'seriesDetail---del')
	const { data, total, pages } = seriesProduct || {}
	const { id, seriesName, manufacturerName, manufacturerLogo } = seriesDetail || {}
	const upperSeriesName = seriesName?.toUpperCase()

	const { i18Translate, getLanguageName, curLanguageCodeZh, getLanguageEmpty } = useLanguage();
	const iHome = i18Translate('i18MenuText.Home', 'Home')
	const iAllSeriesProducts = i18Translate('i18Other.All Series Products', "All Series Products")
	const iSeries = i18Translate('i18Other.Series', "Series")

	const breadcrumb = [
		{
			text: iHome,
			url: '/',
		},
		{
			text: i18Translate('i18MenuText.Product Index', 'Product Index'),
			url: `${getEnvUrl(PRODUCTS)}`
		},
		{
			text: iAllSeriesProducts,
			url: `${getEnvUrl(SERIES_PRODUCT_NUMBER)}`
		},
		{
			text: `${upperSeriesName} ${manufacturerName}`,
		}
	];

	const productCallback = () => {

	}
	const titleSeo = `${upperSeriesName} ${iSeries} ${manufacturerName} ${curLanguageCodeZh() ? SEO_COMPANY_NAME_ZH : SEO_COMPANY_NAME}` // 系列型号名称 品牌 | Origin Data
	const seoKeywords = `${seriesName} ${iSeries}, ${manufacturerName}, origin electronic parts mall, find electronic components, electronic components distributor`
	const seoDescription = `Origin Data offers a product line from ${manufacturerName}, a top global manufacturer. Origin is a member of ERAI. Order now! Fast delivery.`

	const getActiveLink = () => {
		return catalogsBreadcrumb?.slice()?.reverse()?.map((item, index) => {
			return <Link
				key={item?.id}
				href={index === 0 ? `${getEnvUrl(PRODUCTS_FILTER)}/${isIncludes(item?.slug)}/${item?.id}` : `${getEnvUrl(PRODUCTS_CATALOG)}/${isIncludes(item?.slug)}/${item?.id}`}
			>
				<a className='pub-fontw pub-color-hover-link'> | {getLanguageName(item)}</a>
			</Link>
		})
	}

	const i18Title = i18Translate('i18Seo.seriesNumberDetail.title', titleSeo, { upperSeriesName, manufacturerName })
	const i18Key = i18Translate('i18Seo.seriesNumberDetail.keywords', seoKeywords, { upperSeriesName: seriesName, manufacturerName })
	const i18Des = i18Translate('i18Seo.seriesNumberDetail.description', seoDescription, { manufacturerName })

	return (
		<PageContainer paramMap={paramMap}>
			<Head>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />
			</Head>
			<div className="articles-detail-page product-table-container ps-page--single pub-minh-1 pub-bgc-f5 pb-60">
				<div className='ps-container'>
					<BreadCrumb breacrumb={breadcrumb} layout="fullwidth" />

					<div className='pub-flex mt30 series-product-number-detail-tab'>
						{manufacturerLogo && <img className='h50' src={manufacturerLogo} alt={manufacturerName} title={manufacturerName}
							onError={(e) => (e.target.src = getLanguageEmpty())}
						/>
						}
						<div className={`pub-flex-align-center ${manufacturerLogo ? 'ml30' : ''}`}>
							<div className="tss-sd4iya-textSection">
								<h1 className="pub-left-title">{upperSeriesName} {iSeries} {getActiveLink()}</h1>
								<p className='mt5'>{manufacturerName}</p>
							</div>
						</div>
					</div>

					<div className='mt20'>
						<PubProductsTable
							productsList={data} total={total} pages={pages}
							isItemRender={true} currentUrl={`${getEnvUrl(SERIES_PRODUCT_NUMBER)}/${isIncludes(upperSeriesName)}/${id}`}
							callback={productCallback}
						/>
					</div>
					{/* <div className='pub-flex mt25'>
                        <div className='pub-border15 mr20'>
                            <div className='articles-detail-title'>
                                <h1 className='pub-font22'></h1>
                            </div>
                        </div>
                    </div> */}
				</div>
			</div>
		</PageContainer>
	);
};
export default ProductHighlightsIndex;

export async function getServerSideProps({ req, query, params }) {
	const languageType = getLocale(req);
	let { slugs } = params;
	let seriesId = last(slugs);
	const param = {
		seriesId,
		seriesName: slugs?.[0],
		languageType,
	}

	const [translations, seriesDetail] = await Promise.all([
		changeServerSideLanguage(req), // 语言包等页面基础逻辑
		outProductRepository.apiQuerySeriesDetail(param), // 系列详情
	]);

	const { catalogId } = seriesDetail?.data || {}

	const catalogsBreadcrumb = await CatalogRepository.getCatalogBreadcrumbList(catalogId, languageType); // 获取分类面包屑
	const param2 = {
		catalogId,
		manufacturerId: seriesDetail?.data?.manufacturerId, // 系列供应商id
		pageListNum: query?.pageNum || PUB_PAGINATION?.pageNum,
		pageListSize: query?.pageSize || PUB_PAGINATION?.pageSize,
		languageType,
		seriesId, // 系列id
		seriesName: slugs?.[0], // 系列名
	}
	const seriesProduct = await outProductRepository.apiGetSeriesProductList(param2);


	return {
		props: {
			...translations,
			seriesProduct: seriesProduct?.data || {},
			seriesDetail: seriesDetail?.data || {},
			catalogsBreadcrumb: catalogsBreadcrumb || [],

			param2,
		},
	}
};

