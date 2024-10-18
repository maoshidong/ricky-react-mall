import React from 'react';
import Head from 'next/head';

import PageContainer from '~/components/layouts/PageContainer';
import Addresses from '~/components/partials/account/Addresses';

import { changeServerSideLanguage, redirectLogin } from '~/utilities/easy-helpers';

import useLanguage from '~/hooks/useLanguage';

const MyAccountPage = ({ paramMap, global, seo }) => {
	const { i18Translate } = useLanguage();
	const iMyAccount = i18Translate('i18MyAccount.My Account', 'My account')

	const titleSeo = `${iMyAccount} | ${process.env.title}`
	const i18Title = i18Translate('i18Seo.addresses.title', titleSeo)
	const i18Key = i18Translate('i18Seo.addresses.keywords', "")
	const i18Des = i18Translate('i18Seo.addresses.description', "")

	return (
		<PageContainer paramMap={paramMap} seo={seo} global={global}>
			<Head>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />
			</Head>
			<div className="ps-page--my-account pub-bgc-f5" style={{ position: 'relative' }}>
				<Addresses />
			</div>
		</PageContainer>
	);
};

export default MyAccountPage;

export async function getServerSideProps({ req }) {
	const translations = await changeServerSideLanguage(req)
	// 判断是否登录,否则重定向到login
	const { account = "" } = req.cookies
	const isAccountLog = account.trim() !== "" && JSON.parse(account)?.isAccountLog
	if (!isAccountLog) {
		return redirectLogin()
	}

	return {
		props: {
			...translations,
		}
	}
}
