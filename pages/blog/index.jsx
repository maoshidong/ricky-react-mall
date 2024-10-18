import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import BreadCrumb from '~/components/elements/BreadCrumb';
import PageContainer from '~/components/layouts/PageContainer';
import NewsRepository from '~/repositories/zqx/NewsRepository';
import { getEnvUrl, CONTENT_SEARCH } from '~/utilities/sites-url';
import { PUB_RESOURCE_TYPE, PUB_PAGINATION, All_SEO4 } from '~/utilities/constant';
import NewsContent from '~/components/News/NewsContent';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
import { getLocale, changeServerSideLanguage } from '~/utilities/easy-helpers';


const NewsBolgPage = ({ paramMap, newsData, newsTypeTreeServer }) => {
	const { i18Translate, getLanguageHost } = useLanguage();
	const { iHome } = useI18();
	const iContentSearch = i18Translate('i18ResourcePages.Content Search', 'Content Search')
	const iBlog = i18Translate('i18MenuText.Blogs', 'Blog')

	const breadcrumb = [
		{ text: iHome, url: '/' },
		{ text: iContentSearch, url: getEnvUrl(CONTENT_SEARCH) },
		{ text: iBlog }
	];

	// const { data } = newsData
	// const [newsAllData, setNewsAllData] = useState(data || {})

	// const getAllNewList = async (params) => {
	//     const res = await NewsRepository.getQueryNewsList1(params);
	//     if(res.code === 0) {
	//         setNewsAllData(res?.data)
	//     }
	// }

	const Router = useRouter();
	const schemaSeo = {
		"@context": "https://schema.org/",
		"@graph": [
			{
				"@type": "Webpage",
				"@id": getLanguageHost() + Router.asPath,
				"url": getLanguageHost() + Router.asPath,
				"name": iBlog,
			},
			{
				"@type": "News",
				"name": iBlog,
			}
		]
	}
	// 栏目配置的seo信息不用了, 在多语言seo统一管理
	// const curColumn = newsTypeTreeServer?.find(item => item?.templateType === PUB_ARTICLE_TYPE.article)
	// const { url, description } = curColumn || {}


	const { blogTit, blogKey, blogDes } = All_SEO4?.blog
	const i18Title = i18Translate('i18Seo.blog.title', blogTit)
	const i18Key = i18Translate('i18Seo.blog.keywords', blogKey)
	const i18Des = i18Translate('i18Seo.blog.description', blogDes)
	return (
		<PageContainer paramMap={paramMap}>
			<Head>
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaSeo) }}></script>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />
			</Head>
			<div className='pub-bgcdf5 pub-minh-1 pb60 custom-antd-btn-more'>
				<div className='pub-top-bgc pub-top-bgc-minh260'>
					<img className='pub-top-img' src='/static/img/bg/blogs.png' alt="banner" />
					<div className='ps-container pub-top-bgc-content'>
						<h1 className='mb20 pub-fontw pub-font36 pub-lh36 pub-top-bgc-title'>{iBlog}</h1>
						{/* <p className='pub-font16 pub-lh18 pub-top-bgc-des pub-font50'>Stay Updated on the Latest Products and Technologies to Expand Your Knowledge.</p> */}
						{/* <h2 className='pub-font16 pub-lh18 pub-top-bgc-des pub-font500' style={{width: '660px'}}>Electronic Component Information and Resources</h2> */}
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
	const { account = "" } = req.cookies
	const serverToken = account.trim() !== "" && JSON.parse(account)?.token
	const param = {
		pageListNum: query?.pageNum || PUB_PAGINATION?.pageNum,
		pageListSize: query?.pageSize || PUB_PAGINATION?.pageSize,
		languageType: getLocale(req),
		typeIdList: [38], // 栏目id /blog 只展示blog,其它新闻一样
	}
	const params = {
		parentTypeId: 0,
		typeList: [PUB_RESOURCE_TYPE.resource, PUB_RESOURCE_TYPE.attribute],
		languageType: getLocale(req),
	}

	const [translations, newsData, newsTypeTreeServer] = await Promise.all([
		changeServerSideLanguage(req),
		NewsRepository.getQueryNewsList(param),
		NewsRepository.apiGetNewsTypeTree(params), // 栏目树
	]);

	return {
		props: {
			...translations,
			newsData,
			serverToken,
			selectedNewsType: query?.type || null,
			newsTypeTreeServer: newsTypeTreeServer?.data,
		},
	}
};