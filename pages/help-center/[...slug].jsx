import React from 'react';
import Head from 'next/head';
import last from 'lodash/last';
import PageContainer from '~/components/layouts/PageContainer';
import PageTopBanner from '~/components/shared/blocks/banner/PageTopBanner';
import BreadCrumb from '~/components/elements/BreadCrumb';
import NewsRepository from '~/repositories/zqx/NewsRepository';
import Content from '~/components/partials/page/about-us/Content';
import { PUB_META_KEYWORDS, PUB_RESOURCE_TYPE, SEO_COMPANY_NAME, SEO_COMPANY_NAME_ZH } from '~/utilities/constant';
import { getEnvUrl, HELP_CENTER } from '~/utilities/sites-url';
import useLanguage from '~/hooks/useLanguage';
import { getLocale, changeServerSideLanguage } from '~/utilities/easy-helpers';


const HelpCenterDetailPage = ({ paramMap, resServer }) => {
	const { i18Translate, curLanguageCodeZh } = useLanguage();
	const iHelpCenterDetailsTit = i18Translate('i18ResourcePages.HelpCenterDetailsTit', "how can we help?")
	const iHome = i18Translate('i18MenuText.Home', 'Home')
	const iHelpCenter = i18Translate('i18MenuText.Help Center', 'Help Center')

	const breadcrumb = [
		{ text: iHome, url: '/' },
		{ text: iHelpCenter, url: getEnvUrl(HELP_CENTER) },
		{ text: resServer?.title }
	];
	// useEffect(async () => {
	//     const params = {
	//         newsId: 370,
	//         newsType: PUB_RESOURCE_TYPE.helpCenter,
	//     }
	//     const res = await NewsRepository.apiQueryNewsDetail(params);
	// }, [])
	const { title, seoKey, contentSummary } = resServer || {}
	const titleSeo = `${title} | ${curLanguageCodeZh() ? SEO_COMPANY_NAME_ZH : SEO_COMPANY_NAME}`
	const seokeywords = seoKey || PUB_META_KEYWORDS
	const seoDescription = contentSummary || title

	return (
		<PageContainer paramMap={paramMap}>
			<Head>
				<title>{titleSeo}</title>
				<meta property="og:title" content={titleSeo} key="og:title" />
				<meta name="keywords" content={seokeywords} key="keywords" />
				<meta name="description" content={seoDescription} key="description" />
				<meta name="og:description" content={seoDescription} key="og:description" />
			</Head>
			<div className='pub-minh-1 pb60'>
				<PageTopBanner
					bgcImg="help-center2.jpg"
					title={iHelpCenterDetailsTit}
					minHeight="minHeight140"
				/>
				<div className='ps-container'>
					<BreadCrumb breacrumb={breadcrumb} layout="fullwidth" />
					<div className='pub-border15 mt25'>
						<Content data={resServer} />
					</div>
				</div>
			</div>

		</PageContainer>
	);
};
export default HelpCenterDetailPage;

export async function getServerSideProps({ req, query }) {
	const translations = await changeServerSideLanguage(req)
	const { slug, isNeedPreview } = query;
	const params = {
		newsId: last(slug),
		newsType: PUB_RESOURCE_TYPE.helpCenter,
		isNeedPreview: isNeedPreview || '',
		languageType: getLocale(req),
		// columnId,
		// type: 4,
	}
	const res = await NewsRepository.apiQueryNewsDetail(params);

	return {
		props: {
			...translations,
			slug,
			resServer: res?.data?.content || {},
		},
	}
};