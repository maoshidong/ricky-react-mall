import React from 'react';
import { useCookies } from 'react-cookie'
import Head from 'next/head';
import PageContainer from '~/components/layouts/PageContainer';
import Quote from '~/components/partials/account/Quote';


import useLanguage from '~/hooks/useLanguage';
import useLocalStorage from '~/hooks/useLocalStorage'

import { PUB_PAGINATION, All_SEO5 } from '~/utilities/constant';
import { changeServerSideLanguage, pageIsAccountLogToken } from '~/utilities/easy-helpers';
import QuoteRepositry from '~/repositories/zqx/QuoteRepositry';

const QuotePage = ({ paramMap, quoteReqList }) => {
	console.log(quoteReqList, 'quoteReqList---del')
	const { i18Translate } = useLanguage();
	const [quoteHistoryLoc, setQuoteHistoryLoc] = useLocalStorage('quoteHistoryLocal', []) // 询价历史记录 

	const [cookies, setCookie] = useCookies()
	const { isAccountLog } = cookies?.account || {}
	console.log(quoteReqList, 'quoteReqList---del')
	console.log(quoteHistoryLoc, 'quoteHistoryLoc---del')
	const HASH_QUOTE_REQUEST_HISTORY = 'quote-request-history'

	const { quoteHistoryTit, quoteHistoryKey, quoteHistoryDes } = All_SEO5?.quoteHistory
	const i18Title = i18Translate('i18Seo.historyQuote.title', quoteHistoryTit)
	const i18Key = i18Translate('i18Seo.historyQuote.keywords', quoteHistoryKey)
	const i18Des = i18Translate('i18Seo.historyQuote.description', quoteHistoryDes)
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
				<Quote curActive={HASH_QUOTE_REQUEST_HISTORY} quoteReqList={isAccountLog ? quoteReqList : quoteHistoryLoc} />
			</div>
		</PageContainer>
	);
};

export default QuotePage;
export async function getServerSideProps({ req }) {
	// const { account = "" } = req.cookies
	// const isAccountLog = account.trim() !== "" && JSON.parse(account)?.isAccountLog
	// const serverToken = account.trim() !== "" && JSON.parse(account)?.token
	const { isAccountLog, serverToken } = pageIsAccountLogToken(req)
	const pagination = {
		pageSize: PUB_PAGINATION.pageSize,
		pageNum: PUB_PAGINATION.pageNum,
	};

	let quoteReqList = []
	const [translations, resInquiryList] = await Promise.all([
		changeServerSideLanguage(req),
		QuoteRepositry.myInquiryList(serverToken, pagination),
	])
	const transformedData = resInquiryList?.data?.data?.flatMap(item => item?.itemList?.map(i => ({
		...item,
		itemList: i,
		...i,
		createTime: item.createTime,
	})));
	quoteReqList = transformedData || []


	// if (isAccountLog) {
	// 	const res = await QuoteRepositry.myInquiryList(serverToken, pagination);
	// 	if (res.code === 0) {
	// 		const { data } = res.data;

	// 		const transformedData = data.flatMap(item => item.itemList.map(i => ({
	// 			...item,
	// 			itemList: i,
	// 			...i,
	// 			createTime: item.createTime,
	// 		})));
	// 		quoteReqList = transformedData
	// 	}
	// }

	return {
		props: {
			...translations,
			quoteReqList
		}
	}
}