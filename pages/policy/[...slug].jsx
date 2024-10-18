import React from 'react';
import Head from 'next/head';
import last from 'lodash/last';
import PageContainer from '~/components/layouts/PageContainer';
// import CommonRepository from '~/repositories/zqx/CommonRepository';
import NewsRepository from '~/repositories/zqx/NewsRepository';
import Content from '~/components/partials/page/about-us/Content';
import { All_SEO3, PUB_ARTICLE_TYPE } from '~/utilities/constant';
import useLanguage from '~/hooks/useLanguage';
import { getLocale, changeServerSideLanguage } from '~/utilities/easy-helpers';


const PrivacyPolicy = ({ paramMap, slug, resDetail }) => {
	const { i18Translate } = useLanguage();

	const { privacyPolicyTit, privacyPolicyKey, privacyPolicyDes } = All_SEO3?.privacyPolicy
	const i18Title = i18Translate('i18Seo.privacyPolicy.title', privacyPolicyTit)
	const i18Key = i18Translate('i18Seo.privacyPolicy.keywords', privacyPolicyKey)
	const i18Des = i18Translate('i18Seo.privacyPolicy.description', privacyPolicyDes)

	const { termsTit, termsKey, termsDes } = All_SEO3?.terms
	const i18TermsTitle = i18Translate('i18Seo.terms.title', termsTit)
	const i18TermsKey = i18Translate('i18Seo.terms.keywords', termsKey)
	const i18TermsDes = i18Translate('i18Seo.terms.description', termsDes)

	const titleSeo = last(slug) === 'privacy-policy' ? i18Title : i18TermsTitle
	const keywordsSeo = last(slug) === 'privacy-policy' ? i18Key : i18TermsKey
	const descriptionSeo = last(slug) === 'privacy-policy' ? i18Des : i18TermsDes

	return (
		<PageContainer paramMap={paramMap}>
			<Head>
				<title>{titleSeo}</title>
				<meta property="og:title" content={titleSeo} key="og:title" />
				<meta name="keywords" content={keywordsSeo} key="keywords" />
				<meta name="description" content={descriptionSeo} key="description" />
				<meta name="og:description" content={descriptionSeo} key="og:description" />
			</Head>
			<div className="ps-container ps-page--policy pt-30 vue-ueditor-wrap pb60">
				<Content data={resDetail?.content} />
			</div>
		</PageContainer>
	);
};
export default PrivacyPolicy;

export async function getServerSideProps({ req, query }) {
	const translations = await changeServerSideLanguage(req)
	const { slug } = query;

	// 117 : 118 管理端的栏目id 
	const columnId = last(slug) === 'privacy-policy' ? 117 : 118
	const params1 = {
		columnIdList: [columnId],
		newsType: 3,
		languageType: getLocale(req),
	}
	const res = await NewsRepository.getQueryNewsList(params1);
	const param = {
		newsId: res?.data?.data?.[0].id,
		newsType: PUB_ARTICLE_TYPE.privacyPolicy,
		languageType: getLocale(req),
	}
	const resDetail = await NewsRepository.apiQueryNewsDetail(param);

	return {
		props: {
			...translations,
			slug,
			resDetail: resDetail?.data || {},
		},
	}
};

