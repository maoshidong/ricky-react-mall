import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import dynamic from 'next/dynamic';
const PageContainer = dynamic(() => import('~/components/layouts/PageContainer'));
const BreadCrumb = dynamic(() => import('~/components/elements/BreadCrumb'));
const NewsContent = dynamic(() => import('~/components/News/NewsContent'));

import NewsRepository from '~/repositories/zqx/NewsRepository';
import { getEnvUrl, CONTENT_SEARCH } from '~/utilities/sites-url'
import { PUB_RESOURCE_TYPE, PUB_PAGINATION } from '~/utilities/constant'
import useLanguage from '~/hooks/useLanguage';
import { getLocale, changeServerSideLanguage } from '~/utilities/easy-helpers';

const NewsBolgPage = ({ paramMap, newsData, newsTypeTreeServer }) => {
	const { i18Translate, getLanguageHost } = useLanguage();
	const iHome = i18Translate('i18MenuText.Home', 'Home')
	const iContentSearch = i18Translate('i18ResourcePages.Content Search', 'Content Search')
	const iVideos = i18Translate('i18MenuText.Videos', 'Videos')

	const breadcrumb = [
		{ text: iHome, url: '/' },
		{ text: iContentSearch, url: getEnvUrl(CONTENT_SEARCH) },
		{ text: iVideos }
	];

	const Router = useRouter();
	const schemaSeo = {
		"@context": "https://schema.org/",
		"@graph": [
			{
				"@type": "Webpage",
				"@id": getLanguageHost() + Router.asPath,
				"url": getLanguageHost() + Router.asPath,
				"name": iVideos,
			}
		]
	}


	const titleSeo = `Videos | Origin Data`

	const i18Title = i18Translate('i18Seo.videos.title', titleSeo)
	const i18Key = i18Translate('i18Seo.videos.keywords', "")
	const i18Des = i18Translate('i18Seo.videos.description', "")
	return (
		<PageContainer paramMap={paramMap}>
			<Head>
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaSeo) }}></script>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta property="og:description" content={i18Des} key="og:description" />
				<meta property="og:image" content="https://www.origin-ic.com/static/img/logo.png" key="og:image" />
			</Head>
			<div className='pub-bgcdf5 pub-minh-1 pb60 custom-antd-btn-more'>
				<div className='pub-top-bgc pub-top-bgc-minh260'>
					<img className='pub-top-img' src='/static/img/bg/news-product-highlights.jpg' alt="banner" />
					<div className='ps-container pub-top-bgc-content'>
						<h1 className='mb20 pub-fontw pub-font36 pub-lh36 pub-top-bgc-title'>{iVideos}</h1>
					</div>
				</div>
				<div className="ps-container ps-page-new">
					<BreadCrumb breacrumb={breadcrumb} layout="fullwidth" />
					<div className='mt25'>
						<NewsContent newsData={newsData} newsTypeTreeServer={newsTypeTreeServer} />
					</div>
				</div>
			</div>
		</PageContainer>
	);
};

export default NewsBolgPage;

export async function getServerSideProps({ req, query }) {
	const { resource, attribute, video } = PUB_RESOURCE_TYPE
	const param = {
		pageListNum: query?.pageNum || PUB_PAGINATION?.pageNum,
		pageListSize: query?.pageSize || PUB_PAGINATION?.pageSize,
		// typeIdList: [PUB_RESOURCE_TYPE.video],
		// typeIdList: [205],
		newsType: video,
		languageType: getLocale(req),
		columnIdList: [202, 203, 204], // 栏目id，只展示当前栏目新闻
	}

	const params = {
		parentTypeId: 0,
		typeList: [resource, attribute, video],
		languageType: getLocale(req),
	}

	const [translations, newsData, newsTypeTreeServer] = await Promise.all([
		changeServerSideLanguage(req), // 页面基础信息
		NewsRepository.getQueryNewsList(param), // 新闻列表
		NewsRepository.apiGetNewsTypeTree(params),  // 栏目树
	]);

	const type = query?.type;

	return {
		props: {
			...translations,
			newsData,
			selectedNewsType: type || null,
			newsTypeTreeServer: newsTypeTreeServer?.data,
		},
	}
};