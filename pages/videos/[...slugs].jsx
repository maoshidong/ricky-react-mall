import React from 'react';
import Head from 'next/head';
import last from 'lodash/last';

import dynamic from 'next/dynamic';
const BreadCrumb = dynamic(() => import('~/components/elements/BreadCrumb'));
const PageContainer = dynamic(() => import('~/components/layouts/PageContainer'));
const ProductHighlightsCom = dynamic(() => import('~/components/News/ProductHighlightsCom'));

import NewsRepository from '~/repositories/zqx/NewsRepository';
import useLanguage from '~/hooks/useLanguage';


import { getLocale, changeServerSideLanguage, redirect404 } from '~/utilities/easy-helpers';

import { PUB_ARTICLE_TYPE } from '~/utilities/constant';
import { VIDEOS } from '~/utilities/sites-url'

const VideosPage = ({ paramMap, res, otherNews }) => {
	const { data } = res || {}
	const { content, specialProductList } = data || {}

	const { i18Translate } = useLanguage();
	const iHome = i18Translate('i18MenuText.Home', 'Home')
	const iVideos = i18Translate('i18ResourcePages.videos', 'Videos')
	const iShare = i18Translate('i18AboutProduct.Share', 'Share')

	const breadcrumb = [
		{
			text: iHome,
			url: '/',
		},
		{
			text: iVideos,
			url: VIDEOS,
		},
		{
			text: content?.title,
		}
	];

	const {
		title, seoKey, seoFlag, coverImage,
		manufacturerName,
		recommendCatalogName, functionName,
	} = content || {}

	let seoKeyProductName = []
	let manufacturerData = [] // 所有供应商名称 + id
	let manufacturerNames = [] // 所有供应商名称
	let catalogData = [] // 所有分类名称 + id
	let catalogNames = []
	specialProductList?.map(item => {
		const arr = item?.productList?.map(i => {
			manufacturerNames?.push(i?.manufacturerName)
			catalogNames?.push(i?.catalogName)
			manufacturerData?.push({
				name: i?.manufacturerName,
				id: i?.manufacturerId,
			})
			catalogData?.push({
				name: i?.catalogName,
				id: i?.catalogId,
			})
			return item?.name
		})

		seoKeyProductName?.push(arr)
	})



	const newSeoKey = seoKey || ""
	// 关键词拼接
	let seoKeyAddName = seoFlag === 2 ? newSeoKey : newSeoKey
	if (seoFlag !== 2) {
		if (seoKeyProductName?.join(',')) {
			seoKeyAddName = seoKeyProductName?.join(',') + ',' + seoKeyAddName
		}
		if (manufacturerName) {
			seoKeyAddName = manufacturerName + ',' + seoKeyAddName
		}
		if (recommendCatalogName) {
			seoKeyAddName = recommendCatalogName + ',' + seoKeyAddName
		}
		if (functionName) {
			seoKeyAddName = functionName + ',' + seoKeyAddName
		}
	}

	const titleSeo = `${title} | ${process.env.title}`
	return (
		<PageContainer paramMap={paramMap}>
			<Head>
				<title>{titleSeo}</title>
				<meta property="og:image" content={coverImage}></meta>
				<meta property="og:title" content={titleSeo} key="og:title" />

				<meta name="keywords" content={seoKeyAddName} key="keywords" />
				<meta name="description" content={content?.contentSummary} key="description" />
				<meta name="og:description" content={content?.contentSummary} key="og:description" />
			</Head>
			<div className="articles-detail-page product-table-container ps-page--single pub-bgc-f5 pb-60">
				<div className='ps-container'>
				<BreadCrumb breacrumb={breadcrumb} layout="fullwidth" />

					<ProductHighlightsCom paramMap={paramMap} res={res} otherNews={otherNews} />
				</div>
			</div>
		</PageContainer>
	);
};
export default VideosPage;

export async function getServerSideProps({ req, params, query }) {
	let { slugs } = params;
	const { isNeedPreview } = query; // 未发布也可预览 
	let newsId = last(slugs);
	const param = {
		newsId,
		newsType: PUB_ARTICLE_TYPE.specialProduct,
		isNeedPreview: isNeedPreview || '',
		languageType: getLocale(req),
	}

	const [translations, res] = await Promise.all([
		changeServerSideLanguage(req), // 页面基础信息
		NewsRepository.apiQueryNewsDetail(param),
	]);

	if (res?.code !== 0) {
		return redirect404()
	}
	const { publishTime, columnId } = res?.data?.content || {}
	const params1 = {
		pageListNum: 1,
		pageListSize: 5,
		publishTime,
		columnIdList: [columnId],
		languageType: getLocale(req),
	}
	const otherNews = await NewsRepository.getQueryNewsList(params1);



	return {
		props: {
			...translations,
			res,
			otherNews,
			param,
		},
	}
};

