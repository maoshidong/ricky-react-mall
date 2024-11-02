import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import last from 'lodash/last';
import BreadCrumb from '~/components/elements/BreadCrumb';
import PageContainer from '~/components/layouts/PageContainer';

import RecommendNews from '~/components/News/RecommendNews';
import AddAttributesToImages from '~/components/elements/min/AddAttributesToImages';
import { Flex } from '~/components/common';
import NewsRepository from '~/repositories/zqx/NewsRepository';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';

// import CommonRepository from '~/repositories/zqx/CommonRepository';
import { handleMomentTime } from '~/utilities/common-helpers';
import { SEO_COMPANY_NAME, SEO_COMPANY_NAME_ZH, PUB_ARTICLE_TYPE } from '~/utilities/constant';
import { getEnvUrl, NEWSROOM } from '~/utilities/sites-url'
import { getLocale, changeServerSideLanguage, redirect404 } from '~/utilities/easy-helpers';

const NewsDetailPage = ({ paramMap, res, otherNews }) => {
	const { i18Translate, curLanguageCodeZh } = useLanguage();
	const { iAuthor } = useI18();
	const iHome = i18Translate('i18MenuText.Home', 'Home')
	const iNewsroom = i18Translate('i18MenuText.Newsroom', 'Newsroom')
	const iShare = i18Translate('i18AboutProduct.Share', 'Share')


	const { data } = res || {}
	const { content } = data || {}

	const breadcrumb = [
		{
			text: iHome,
			url: '/',
		},
		{
			text: iNewsroom,
			url: getEnvUrl(NEWSROOM),
		},
		{
			text: content?.title,
		}
	];


	const { id, newsType, seoKey, title } = content || {}
	const titleSeo = `${title} | ${curLanguageCodeZh() ? SEO_COMPANY_NAME_ZH : SEO_COMPANY_NAME}`
	return (
		<PageContainer paramMap={paramMap}>
			<Head>
				<title>{titleSeo}</title>
				<meta property="og:title" content={titleSeo} key="og:title" />
				<meta name="keywords" content={seoKey} key="keywords" />
				<meta name="description" content={content?.contentSummary} key="description" />
				<meta name="og:description" content={content?.contentSummary} key="og:description" />
			</Head>
			<div className="articles-detail-page ps-page--single pub-bgc-f5 pb-60 pub-minh-1">
				<div className='ps-container'>
					<BreadCrumb breacrumb={breadcrumb} layout="fullwidth" />


					<div className='pub-flex mt25 news-detail-content'>
						<div className='pub-flex-grow pub-border15 mr20 vue-ueditor-wrap box-shadow' style={{ minHeight: '500px' }}>
							<div className='articles-detail-title'>
								<h1 className='pub-font22 pub-lh26 mb15'>{title}</h1>
							</div>
							<h2 className='mb20 pub-font16 pub-color555 pub-fontw pub-lh18'>{content?.contentSummary}</h2>
							<AddAttributesToImages imgAlt={'Image of ' + title} imgTitle={title}>
								{/* 清除br标签 */}
								<div className='mt15' dangerouslySetInnerHTML={{ __html: content?.content?.replace(/<br\s*\/?>/gi, '') }}></div>
							</AddAttributesToImages>
							<div className='mt18 mb5 pub-flex pub-color555'>
								<div className='pub-font12'>{handleMomentTime(content?.publishTime)}</div>
								{/* {content?.author && <div className='ml40'>{iAuthor} : {content?.author}</div>} */}
							</div>
						</div>

						<div className='pub-flex-shrink pub-fit-content pb-10 w300'>

							<div>
								<RecommendNews title={i18Translate('i18ResourcePages.More News ', 'More News ')} otherNews={otherNews} curContent={content} newsType={newsType} curNewId={id} />
							</div>
						</div>

					</div>


				</div>
			</div>
		</PageContainer>
	);
};
export default NewsDetailPage;

export async function getServerSideProps({ req, params, query }) {
	let { slugs } = params;
	const { isNeedPreview } = query; // 未发布也可预览 
	let newsId = Number(last(slugs));

	const param = {
		newsId,
		newsType: PUB_ARTICLE_TYPE.article,
		isNeedPreview: isNeedPreview || '',
		languageType: getLocale(req),
		// newsType: PUB_RESOURCE_TYPE.companyNews,
	}

	const [translations, res] = await Promise.all([
		changeServerSideLanguage(req),
		NewsRepository.apiQueryNewsDetail(param), // 新闻详情
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

