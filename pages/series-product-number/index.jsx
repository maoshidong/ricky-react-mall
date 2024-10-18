
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Table } from 'antd';
import qs from 'qs';
import BreadCrumb from '~/components/elements/BreadCrumb';
import dynamic from 'next/dynamic';
const PageContainer = dynamic(() => import('~/components/layouts/PageContainer'));

import SamplePagination from '~/components/common/pagination';
import ProductRepository from '~/repositories/ProductRepository';
import LeftNav from '~/components/layouts/LeftNav';
import { PUB_PAGINATION, All_SEO6 } from '~/utilities/constant';
import { buildUrl, isIncludes } from '~/utilities/common-helpers';
import { PRODUCTS_FILTER, PRODUCTS_CATALOG, SERIES_PRODUCT_NUMBER, MANUFACTURER } from '~/utilities/sites-url';
import useLanguage from '~/hooks/useLanguage';

import { getLocale, changeServerSideLanguage } from '~/utilities/easy-helpers';

const SeriesProductNumberPage = ({ paramMap, listRes, seriesManu, manufacturerId }) => {

	const [current, setCurrent] = useState(manufacturerId)
	const [tableList, setTableList] = useState(listRes?.data || [])
	const { pageNum, pageSize, pages, total } = listRes || {}
	const Router = useRouter();


	const { i18Translate, getLanguageName } = useLanguage();
	const iHome = i18Translate('i18MenuText.Home', 'Home')
	const iSeriesProductNumber = i18Translate('i18MenuText.Series Product Number', "Series Product Number")
	const iSeries = i18Translate('i18Other.Series', "Series")
	const iAllSeriesProducts = i18Translate('i18Other.All Series Products', "All Series Products")
	const iManufacturer = i18Translate('i18PubliceTable.Manufacturer', 'Manufacturer')
	const iCategories = i18Translate('i18CatalogHomePage.Categories', 'Category')

	const breadcrumb = [
		{
			text: iHome,
			url: '/',
		},
		{
			text: iAllSeriesProducts,
		}
	];

	const handleCatalog = (list) => {
		const allCatalogsArr = list?.map(i => {
			return {
				name: getLanguageName(i),
				id: i?.id,
				slug: i?.slug,
			}
		})
		return allCatalogsArr?.map((item, index) => {
			return <Link
				href={index === (allCatalogsArr?.length - 1) ? `${PRODUCTS_FILTER}/${isIncludes(item?.slug)}/${item?.id}` : `${PRODUCTS_CATALOG}/${isIncludes(item?.slug)}/${item?.id}`}
				key={item?.id}
			>
				<a className='pub-color-hover-link'>{item?.name} {index === (allCatalogsArr?.length - 1) ? '' : '|'} </a>
			</Link>
		})

	}

	const columns = [
		{
			title: iSeriesProductNumber,
			width: 180,
			dataIndex: 'Series Product Number',
			render: (url, record) => (
				<h3>
					<Link href={`${SERIES_PRODUCT_NUMBER}/${record?.seriesName?.toUpperCase()}/${record?.id}`}>
						<a className='pub-color-link pub-fontw'>{record?.seriesName?.toUpperCase()} {iSeries}</a>
					</Link>
				</h3>
			)
		},
		{
			title: iManufacturer,
			dataIndex: 'Manufacturer',
			width: 300,
			render: (text, record) => (
				// /${record?.parentId || record?.manufacturerId}
				+record?.slugStatus === 1 ? <Link href={`${MANUFACTURER}/${isIncludes(record?.manufacturerSlug)}`}>
					<a className='pub-color-hover-link'>{record?.manufacturerName}</a>
				</Link> : record?.manufacturerName
			)
		},
		{
			title: iCategories,
			dataIndex: 'catalogName',
			render: (text, record) => (
				handleCatalog(record?.catalogList)
			)
		},
	]

	const clickCurItem = async (e, item) => {
		let params = {
			pageNum,
			pageSize,
			manufacturerId: item?.id,
		};

		const resultURL = await buildUrl(SERIES_PRODUCT_NUMBER, params);

		Router.push(resultURL)
		setCurrent(item?.id)

		// const params1 = {
		//     manufacturerId: item?.id,
		//     pageListNum: 1,
		//     pageListSize: 100,
		//     publishStatus: 1,
		// }
		// const res = await ProductRepository.apiQueryProductSeriesList(params1);

		// setTableList(res?.data?.data || [])
	}

	useEffect(() => {
		setTableList(listRes?.data || [])
	}, [listRes])

	useEffect(async () => {
		const params1 = {
			manufacturerId: "",
			pageListNum: 1,
			pageListSize: 201,
			publishStatus: 1,
			seriesName: ""
		}
		await ProductRepository.apiQueryProductSeriesList(params1);
		await ProductRepository.apiQuerySeriesManufactureList({
			languageType: 'en',
		}) // 系列供应商列表
	}, [])

	// 除分页外其它参数，传给分页组件
	const getOtherUrlParams = () => {
		let params = {};
		// // 是否有制造商
		if (manufacturerId) {
			params.manufacturerId = manufacturerId
		}
		const queryParams = qs.stringify(params)
		return queryParams
	}


	const titleSeo = i18Translate('i18Other.All Series Products', All_SEO6?.series?.seriesTit)
	const seoKeywords = All_SEO6?.series?.seriesKey
	const seoDescription = All_SEO6?.series?.seriesDes

	const i18Title = i18Translate('i18Seo.seriesNumber.title', titleSeo)
	const i18Key = i18Translate('i18Seo.seriesNumber.keywords', seoKeywords)
	const i18Des = i18Translate('i18Seo.seriesNumber.description', seoDescription)

	const iManufacturers = i18Translate('i18PubliceTable.Manufacturer', 'Manufacturers')
	return (
		<PageContainer paramMap={paramMap}>
			<Head>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />
			</Head>
			<div className='product-table-container custom-antd-btn-more pub-minh-1 pub-bgcdf5 pb60'>
				<div className='ps-container'>
					<BreadCrumb breacrumb={breadcrumb} layout="fullwidth" />
					<h1 className='pub-left-title mt20'>{iAllSeriesProducts}</h1>

					<div className='pub-flex mt15 series-product-number-content'>
						<div className='series-product-number-content-left'>
							<LeftNav
								current={current}
								leftNavTitle={iManufacturers}
								leftNavList={seriesManu}
								clickCurItem={clickCurItem}
							// leftNavList={resourceTypeTree?.filter(item => item?.voList?.length !== 0)}
							// leftNavList={[
							//     {name: 'Delivery Information',},
							//     {name: 'Place an Order',},
							//     {name: 'Products',},
							//     {name: 'Orders & Shipping',},
							//     {name: 'Tools',},
							// ]}
							/>
						</div>
						<div className='product-table-container nav-fixed-width pub-flex-grow  pub-fit-content ml20'>
							<Table
								columns={columns}
								// rowSelection={{
								//     ...rowSelection, 
								// }}
								dataSource={tableList}

								size="small"
								bordered
								sticky
								pagination={false}
								// rowKey={() => nanoid()}
								rowKey={record => record?.id}
								// pub-bordered ant-table-bordered
								className="pub-bordered table-vertical-top"
								style={{ borderRadius: '6px' }}
								scroll={tableList?.length > 0 ? { x: 1100 } : null}
							>

							</Table>

							{
								pageNum && (
									// <MinPagination
									//     total={total}
									//     pageNum={Number(pageNum)}
									//     pageSize={Number(pageSize)}
									//     totalPages={pages}
									//     currentUrl={SERIES_PRODUCT_NUMBER}
									//     otherUrlParams={getOtherUrlParams()}
									//     // paginationChange={(page, pageSize) => {
									//     //     paginationChange(page, pageSize)
									//     // }}
									//     // onShowSizeChange={(page, pageSize) => {
									//     //     onShowSizeChange(1, pageSize)
									//     // }}
									// />
									<SamplePagination
										total={total}
										pageNum={Number(pageNum)}
										pageSize={Number(pageSize)}
										pagesTotal={pages}
										currentUrl={SERIES_PRODUCT_NUMBER}
										otherUrlParams={getOtherUrlParams()}
										className='mt20'
									/>
								)
							}
							{/* <h1 className='pub-seo-visibility1'>{iSeriesProductNumber}</h1> */}
						</div>
					</div>
				</div>

			</div>

		</PageContainer>
	);
};
export default SeriesProductNumberPage;

export async function getServerSideProps({ req, query }) {
	const { manufacturerId } = query
	const params = {
		manufacturerId: manufacturerId || "",
		pageListNum: query?.pageNum || PUB_PAGINATION?.pageNum,
		pageListSize: 20 || PUB_PAGINATION?.pageSize,
		publishStatus: 1,
		seriesName: ""
	}

	const [translations, listRes, seriesManu] = await Promise.all([
		changeServerSideLanguage(req), // 语言包等页面基础逻辑
		ProductRepository.apiQueryProductSeriesList(params), // 产品系列列表
		ProductRepository.apiQuerySeriesManufactureList({
			languageType: getLocale(req),
		}), // 系列供应商列表
	]);

	return {
		props: {
			...translations,
			listRes: listRes?.data || {},
			seriesManu: seriesManu?.data || [],
			manufacturerId: Number(manufacturerId) || "",
		},
	}
};

