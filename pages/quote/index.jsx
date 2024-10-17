import React from 'react';
import Head from 'next/head';

import PageContainer from '~/components/layouts/PageContainer';
import Quote from '~/components/partials/account/Quote';
// import FooterQuote from '~/components/shared/footers/modules/FooterQuote';
import { All_SEO5 } from '~/utilities/constant';
import useLanguage from '~/hooks/useLanguage';
import { changeServerSideLanguage } from '~/utilities/easy-helpers';


const QuotePage = ({ paramMap }) => {
	const { i18Translate } = useLanguage();

	const { quoteTit, quoteKey, quoteDes } = All_SEO5?.quote
	const i18Title = i18Translate('i18Seo.requestQuote.title', quoteTit)
	const i18Key = i18Translate('i18Seo.requestQuote.keywords', quoteKey)
	const i18Des = i18Translate('i18Seo.requestQuote.description', quoteDes)
	return (
		<PageContainer paramMap={paramMap} cartHideFooter={1}>
			<Head>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />
			</Head>
			<div className="ps-page--simple">
				<Quote paramMap={paramMap} />
				{/* <FooterQuote paramMap={paramMap} /> */}
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