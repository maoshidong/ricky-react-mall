import { useEffect, useState } from 'react';
import { Table } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getCurrencyInfo } from '~/repositories/Utils';

import { toFixedFun } from '~/utilities/ecomerce-helpers';
import { handleMomentTime } from '~/utilities/common-helpers';
import { ACCOUNT_QUOTE_HISTORY } from '~/utilities/sites-url';

import SearchNoData from '~/components/ecomerce/minCom/SearchNoData';
import ModuleLogin from '~/components/ecomerce/modules/ModuleLogin'

import useI18 from '~/hooks/useI18';

const QuoteReqHistory = ({ isLogin, quoteReqList }) => {
	const { iPartNumber, iManufacturer, iQuantity, iTargetPrice, iDate, iOperation, iViewQuote,
		iQuoteHistory, iViewMore, iQuoteNoResults } = useI18();
	const currencyInfo = getCurrencyInfo();
	const Router = useRouter()

	// 询价历史列表数据
	const [myQuoteList, setMyQuoteList] = useState(quoteReqList || []);
	const [loginVisible, setLoginVisible] = useState(false);
	const [curActiveUrl, setCurActiveUrl] = useState('')
	// inquiryId
	// email
	// manufacturer
	// partNum
	// priceType
	// productId
	// quantity
	// targetPrice
	// 列
	const handleUrl = (e, url) => {
		e.preventDefault()
		if (!isLogin) {
			setLoginVisible(true)
			setCurActiveUrl(url)
			return
		}
		Router.push(url)
	}
	const handleLogin = () => {
		setLoginVisible(false);
		Router.push(curActiveUrl)
	};

	const columns = [
		{
			key: 'partNum',
			dataIndex: 'partNum',
			title: iPartNumber,
		},
		{
			key: 'manufacturer',
			dataIndex: 'manufacturer',
			title: iManufacturer,
		},
		{
			key: 'quantity',
			dataIndex: 'quantity',
			title: iQuantity,
		},
		{
			key: 'targetPrice',
			dataIndex: 'targetPrice',
			title: iTargetPrice,
			render(record) {
				return (
					Number(record) > 0 && (
						<>
							{currencyInfo.label}
							{toFixedFun(record, 2)}
						</>
					)
				);
			},
		},
		{
			key: 'createTime',
			dataIndex: 'createTime',
			title: iDate,
			render(_, record) {
				return handleMomentTime(record.createTime);
			},
		},
		{
			key: 'operation',
			dataIndex: 'operation',
			title: iOperation,
			align: 'right',
			render(_, record) {
				return (
					<Link href={`${ACCOUNT_QUOTE_HISTORY}?partNum=${record?.partNum}`}>
						<a onClick={(e) => handleUrl(e, `${ACCOUNT_QUOTE_HISTORY}?partNum=${record?.partNum}`)}>
							<button ghost="true" className="login-page-login-btn ps-add-cart-footer-btn custom-antd-primary w120">
								{iViewQuote}
							</button>
						</a>
					</Link>
				);
			},
		},
	];

	useEffect(() => {
		console.log(quoteReqList, '最新的quoteReqList---del')
		setMyQuoteList(quoteReqList)
	}, [quoteReqList]);

	return (
		<div className="mt20">
			{myQuoteList?.length > 0 ? <div>
				<div className="pub-flex-between mb15 pub-fontw pub-font16 pub-color18">
					<h2 className="pub-fontw">{iQuoteHistory}</h2>
					<Link href={ACCOUNT_QUOTE_HISTORY}>
						<a className="ml30 mt3 pub-content navigation-view-all" onClick={(e) => handleUrl(e, ACCOUNT_QUOTE_HISTORY)}>
							<p className="sub-title mr10">
								{iViewMore}
							</p>
							<div
								className="sprite-home-min sprite-home-min-3-9"
								style={{ marginTop: '-2px' }}></div>
						</a>
					</Link>
				</div>
				<div style={{ borderRadius: '6px' }}>
					<div className="product-table-container">
						<Table sticky pagination={false} className="pub-border-table" columns={columns} size="small" dataSource={myQuoteList} scroll={{ x: 1000 }} />
					</div>
				</div>
			</div>
				: <SearchNoData
					noDataText={iQuoteNoResults}
				/>
			}

			<ModuleLogin
				visible={loginVisible}
				onCancel={() => setLoginVisible(false)}
				onLogin={handleLogin}
			/>

		</div>
	);
};

export default QuoteReqHistory;
