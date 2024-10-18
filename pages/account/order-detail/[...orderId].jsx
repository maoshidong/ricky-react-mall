import React, { useEffect } from 'react';
import Head from 'next/head';

import dynamic from 'next/dynamic';
const PageContainer = dynamic(() => import('~/components/layouts/PageContainer'));
// const OrderDetail = dynamic(() => import('~/components/partials/account/OrderDetail'));
import OrderDetail from '~/components/partials/account/OrderDetail';


import OrderRepository from '~/repositories/zqx/OrderRepository';
import { decrypt } from '~/utilities/common-helpers';
import { changeServerSideLanguage, redirect404 } from '~/utilities/easy-helpers';

import useLanguage from '~/hooks/useLanguage';

const OrderDetailPage = ({ global, seo, orderId, otherParams = { OrderDetailModal: false, orderDetail: {} }, paramMap }) => {
	const { i18Translate } = useLanguage();
	const i18Title = i18Translate('i18Seo.orderDetail.title', '');
	const i18Key = i18Translate('i18Seo.orderDetail.keywords', '');
	const i18Des = i18Translate('i18Seo.orderDetail.description', '');


	// useEffect(async() => {
	//     // const token = "eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6IjBkZWZlOWJmLTY3N2YtNGRkMC1iZTZhLWRhMWE0M2FlM2Y5ZSJ9.YcvFybCjSwYlYqnNTOoLaMRHftt0U0EVrZXfl_nC4hp4SJrdiDIa0ETISoykayz27fOoKfZeVrAbaGdp1JTstA"
	//     // const res = await OrderRepository.getOrder('24000858', token);
	// 	const emailRes = await OrderRepository.getEmailOrder('dh5Cb3AHofPkFCU0i1RLGQ==');
	// }, [])
	// console.log(otherParams, 'otherParams----del')
	// return 111
	return (
		<>
			{/* 订单抽屉不展示头部和尾部 */}
			<PageContainer
				paramMap={paramMap}
				global={global}
				seo={seo}
				pageOtherParams={{
					showHead: !otherParams.OrderDetailModal,
					showFooter: !otherParams.OrderDetailModal,
				}}
				cartHideFooter={true}
			>
				<Head>
					<title>{i18Title}</title>
					<meta property="og:title" content={i18Title} key="og:title" />
					<meta name="keywords" content={i18Key} key="keywords" />
					<meta name="description" content={i18Des} key="description" />
					<meta name="og:description" content={i18Des} key="og:description" />
				</Head>
				<div className={'ps-page--my-account pub-minh-1 pub-bgc-f5 pb60 ' + (otherParams.OrderDetailModal ? 'order-detail-modal' : '')}>
					<OrderDetail paramMap={paramMap} orderId={orderId} otherParams={otherParams} />
				</div>
			</PageContainer>
		</>
	);
};

export default OrderDetailPage;

export async function getServerSideProps({ req, query }) {
	const translations = await changeServerSideLanguage(req)
	const { account = "" } = req.cookies || {} // isAccountLog
	const serverToken = account.trim() !== "" && JSON.parse(account)?.token
	const { flag, orderId } = query;
	let res = {
		data: {}
	}
	// 管理端生成的订单详情链接flag为true执行的逻辑，
	if (Boolean(flag) || !serverToken) {
		const emailRes = await OrderRepository.getEmailOrder(orderId?.join('/'), serverToken);
		if (emailRes?.data?.code === 0) {
			res = emailRes?.data
		}
	} else {
		// 获取详情数据

		if (serverToken) {
			res = await OrderRepository.getOrder(decrypt(orderId[0]), serverToken);
		}
	}
	if (!res?.data?.orderId && !flag) {
		return redirect404()
	}
	return {
		props: {
			...translations,
			orderId,
			req: account,
			otherParams: {
				orderDetail: res?.data || [],
			}
		},
	}
};
