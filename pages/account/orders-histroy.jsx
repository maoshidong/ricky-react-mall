import React from 'react';
import Head from 'next/head';

import dynamic from 'next/dynamic';
const PageContainer = dynamic(() => import('~/components/layouts/PageContainer'));
const AccountLeft = dynamic(() => import('~/components/partials/account/accountInfo/AccountLeft'));
const TableOrders = dynamic(() => import('~/components/partials/account/modules/TableOrders'));

import { changeServerSideLanguage, redirectLogin } from '~/utilities/easy-helpers';
import useLanguage from '~/hooks/useLanguage';
import OrderRepository from '~/repositories/zqx/OrderRepository';

const Favorites = ({ paramMap, resServer }) => {
	const { i18Translate } = useLanguage();
	const i18Title = i18Translate('i18Seo.ordersHistroy.title', "")
	const i18Key = i18Translate('i18Seo.ordersHistroy.keywords', "")
	const i18Des = i18Translate('i18Seo.ordersHistroy.description', "")
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
				<TableOrders type="history" resServer={resServer} />
			</AccountLeft>
		</PageContainer>
	);
};

export default Favorites;

export async function getServerSideProps({ req }) {
	const translations = await changeServerSideLanguage(req)
	// 判断是否登录,否则重定向到login
	const { account = "" } = req.cookies
	const isAccountLog = account.trim() !== "" && JSON.parse(account)?.isAccountLog
	if (!isAccountLog) {
		return redirectLogin()
	}
	// 拿token
	const serverToken = account.trim() !== "" && JSON.parse(account)?.token
	const resServer = await OrderRepository.getOrderList({ pageSize: 50 }, serverToken);

	return {
		props: {
			...translations,
			resServer: resServer?.data?.data || [],
		}
	}
}