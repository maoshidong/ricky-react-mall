import React from 'react';
import Head from 'next/head';


import PageContainer from '~/components/layouts/PageContainer';
import AccountLeft from '~/components/partials/account/accountInfo/AccountLeft';
import TableOrders from '~/components/partials/account/modules/TableOrders';
// import dynamic from 'next/dynamic';
// const PageContainer = dynamic(() => import('~/components/layouts/PageContainer'));
// const AccountLeft = dynamic(() => import('~/components/partials/account/accountInfo/AccountLeft'));
// const TableOrders = dynamic(() => import('~/components/partials/account/modules/TableOrders'));


import useLanguage from '~/hooks/useLanguage';
import OrderRepository from '~/repositories/zqx/OrderRepository';
import qs from 'qs';

import { getLocale, changeServerSideLanguage, redirectLogin, pageIsAccountLogToken } from '~/utilities/easy-helpers';
// import { buildUrl } from '~/utilities/common-helpers';
import { decrypt } from '~/utilities/common-helpers';
import { ORDER_STATUS } from '~/utilities/constant';

const OrderPage = ({ paramMap, resServer }) => {
	// console.log(res, 'res----del')
	const { i18Translate } = useLanguage();

	const i18Title = i18Translate('i18Seo.orders.title', '');
	const i18Key = i18Translate('i18Seo.orders.keywords', '');
	const i18Des = i18Translate('i18Seo.orders.description', '');
	const params = {
		loginCallBack: 1,
		orderId: '',
	}
	// const url = buildUrl
	// return 111
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

export default OrderPage;

export async function getServerSideProps({ req, query }) {
	// 判断是否登录,否则重定向到login,
	const { isAccountLog, serverToken, curAccount } = pageIsAccountLogToken(req)

	const [translations, detailRes] = await Promise.all([
		changeServerSideLanguage(req),
		OrderRepository.getOrder(decrypt(query?.orderId), serverToken),
	]);



	// 是账号下的单邮件查看订单的url才带orderId参数, 账号下的单必须是该账户才能查看
	// 测试：匿名订单，账号订单，(在账号登录和非登录下测试，订单有完成和未完成两种状态)，匿名下的单完成后只能查看订单号和状态



	const { appUserId, contact } = detailRes?.data || {}
	// 账号下的单必须是该账户才能查看,   要判断这个订单是否属于登录的账号，如果是这个账号的订单即正常显示，如不是登录的这个账号，要提示：
	// if (Number(appUserId) > 0) {
	if ((curAccount !== contact || !isAccountLog) && query?.orderId) {
		// console.log('--不是该账号的单-del')
		let params = {
			loginCallBack: 2,
			orderId: query?.orderId,
		}
		return redirectLogin('/login', qs.stringify(params))
	}
	// }

	if (!isAccountLog) {
		let params = {
			loginCallBack: 1,
		}
		if (query?.orderId) {
			// 登录状态下不能调用-因为 /account/orders url会报错
			const res = await OrderRepository.apiOrderStatus(decrypt(query?.orderId), getLocale(req));
			const { status, url, } = res?.data
			// 如订单已完成，才在后台查看订单详情  	// 邮件过来的订单列表url, 根据订单id查询支付状态,  订单已完成，并且是账号下的单才在用户后台查看订单详情
			if (status === ORDER_STATUS.fulfillment) {
				params.orderId = query?.orderId
			} else {
				return redirectLogin(url)
			}
		}
		return redirectLogin('/login', qs.stringify(params))
	}

	// 拿token
	const resServer = await OrderRepository.getOrderList({ pageSize: 50 }, serverToken);

	return {
		props: {
			...translations,
			resServer: resServer?.data?.data || [],
		}
	}
}