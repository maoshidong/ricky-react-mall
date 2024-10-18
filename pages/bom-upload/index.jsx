import React from 'react';
import Head from 'next/head';

import PageContainer from '~/components/layouts/PageContainer';
import Quote from '~/components/partials/account/Quote';
import { All_SEO5 } from '~/utilities/constant';
import useLanguage from '~/hooks/useLanguage';
import { changeServerSideLanguage } from '~/utilities/easy-helpers';


const QuotePage = ({ paramMap, seo, global }) => {
	const { i18Translate } = useLanguage();

	const HASH_BOM_UPLOAD = 'bom-upload'
	const titleSeo = All_SEO5?.bomQuote?.bomQuoteTit

	const { bomQuoteTit, bomQuoteKey, bomQuoteDes } = All_SEO5?.bomQuote
	const i18Title = i18Translate('i18Seo.bomQuote.title', bomQuoteTit)
	const i18Key = i18Translate('i18Seo.bomQuote.keywords', bomQuoteKey)
	const i18Des = i18Translate('i18Seo.bomQuote.description', bomQuoteDes)
	return (
		<PageContainer paramMap={paramMap} seo={seo} global={global} cartHideFooter={1}>
			<Head>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />
			</Head>
			<div className="ps-page--simple">
				<Quote curActive={HASH_BOM_UPLOAD} />
			</div>
		</PageContainer>
	);
};

export default QuotePage;
export async function getServerSideProps({ req }) {
	const translations = await changeServerSideLanguage(req)
	return {
		props: {
			...translations,
		}
	}
}