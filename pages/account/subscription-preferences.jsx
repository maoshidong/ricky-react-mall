import React from 'react';
import Head from 'next/head';
import PageContainer from '~/components/layouts/PageContainer';
import AccountLeft from '~/components/partials/account/accountInfo/AccountLeft';
import SubscriptionPreferences from '~/components/partials/account/accountInfo/SubscriptionPreferences';
import useLanguage from '~/hooks/useLanguage';
import { NewsRepository } from '~/repositories';

import { changeServerSideLanguage, redirectLogin, pageIsAccountLogToken, getLocale } from '~/utilities/easy-helpers';

const SubscriptionPreferencesPage = ({ paramMap, subscribeList = [] }) => {
	const { i18Translate } = useLanguage();

	const i18Title = i18Translate('i18Seo.subscriptionPreferences.title', "")
	const i18Key = i18Translate('i18Seo.subscriptionPreferences.keywords', "")
	const i18Des = i18Translate('i18Seo.subscriptionPreferences.description', "")
	// console.log(subscribeList, 'subscribeList----del')
	return (
		<PageContainer paramMap={paramMap}>
			<Head>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />
			</Head>
			<AccountLeft>
				<SubscriptionPreferences subscribeList={subscribeList} />
			</AccountLeft>
		</PageContainer>
	);
};

export default SubscriptionPreferencesPage;

export async function getServerSideProps({ req }) {

	// 判断是否登录,否则重定向到login
	const { isAccountLog, serverToken } = pageIsAccountLogToken(req)
	// const { account = "" } = req.cookies
	// const isAccountLog = account.trim() !== "" && JSON.parse(account)?.isAccountLog
	// const serverToken = account.trim() !== "" && JSON.parse(account)?.token
	if (!isAccountLog) {
		return redirectLogin()
	}

	const [translations, subscribeList] = await Promise.all([
		changeServerSideLanguage(req),
		NewsRepository.apiUserSubscribeList(serverToken, {
			languageType: getLocale(req)
		})
	])

	return {
		props: {
			...translations,
			subscribeList: subscribeList?.data,
		}
	}
}
