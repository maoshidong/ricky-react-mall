import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd'; //, Input
import { CustomInput } from '~/components/common';
// import { useRouter } from 'next/router';
import OrderRepository from '~/repositories/zqx/OrderRepository';
import ProductRepository from '~/repositories/zqx/ProductRepository';

import dayjs from 'dayjs';
import { TABLE_COLUMN } from '~/utilities/constant';
import MinTableProductDetail from '~/components/ecomerce/minTableCom/MinTableProductDetail';
import useLanguage from '~/hooks/useLanguage';
import { SamplePagination } from '~/components/common'

function useDebounce(value, delay) {
	const [debouncedValue, setDebouncedValue] = useState(value);
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}

const TableOrders = ({ auth, type, ecomerce }) => {
	const { i18Translate, i18MapTranslate } = useLanguage();

	const iSampleList = i18Translate('i18MyAccount.Sample List', "Sample List")
	const iPartNumber = i18Translate('i18PubliceTable.PartNumber', 'Part Number')
	const iDate = i18Translate('i18AboutOrder.Date', 'Date')
	const iStatus = i18Translate('i18PubliceTable.Status', 'Status')
	const iProductDetail = i18Translate('i18PubliceTable.Product Detail', TABLE_COLUMN.productDetail)
	const iQuality = i18Translate('i18PubliceTable.Quantity', 'Quality')
	const iShipBy = i18Translate('i18MyAccount.Ship By', 'Ship By')

	const { token } = auth
	// const Router = useRouter();
	const [orderList, setOrderList] = useState([]);
	// const [selectedRows, setSelectedRows] = useState([]);
	const [loading, setLoading] = useState(false);
	const [partNum, setPartNum] = useState("");
	// const [orderStatus, setOrderStatus] = useState("");
	const [shippingMethodList, setShippingMethodList] = useState([])
	const debouncedSearchTerm = useDebounce(partNum, 300);
	const [total, setTotal] = useState(0)
	const [pageNum, setPageNum] = useState(1)

	const status_text = {
		0: 'untreated',
		1: 'pass',
		2: 'not pass',
		3: 'Complete',
	}

	const getOrderList = async (obj) => {
		if (!token) {
			return false;
		}
		setLoading(true)
		const params = {
			pageSize: 100,
			pageNum,
			partNum,
			status: obj?.status,
			timeFlag: obj?.timeFlag,
		}
		const res = await ProductRepository.freeProductList(params, token)

		setLoading(false)
		if (res?.code === 0) {
			const { data, pageNum, total } = res?.data
			setOrderList(data)
			setTotal(total)
			setPageNum(pageNum)
		}
	}

	// 0 未处理 1 通过 2 未通过 3 完成
	const getClass = record => {
		const { status } = record
		let className = 'pub-primary-tag'
		if (status === 1 || status === 3) {
			className = 'pub-suc-tag'
		} else if (status === 2) {
			className = 'pub-err-tag'
		}
		return className
	}

	useEffect(() => {
		getOrderList();
	}, [token])

	const getDateColumn = () => (
		{
			title: iDate,
			rowKey: 'createTime',
			dataIndex: 'createTime',
			key: 'createTime',
			width: 150,
			render: (text) => (
				<>{dayjs(text).format('DD MMMM, YYYY')}</>
			),
		}
	)
	const getStatusColumn = () => (
		{
			title: iStatus,
			key: 'status',
			dataIndex: 'status',
			rowKey: 'status',
			// width: '150px',
			render: (text, record) => (
				<span className={getClass(record)}>
					{i18MapTranslate(`i18AboutOrder.${status_text[record?.status]}`, status_text[record?.status])}
				</span>
			),
		}
	)

	const tableColumn = [
		getDateColumn(),
		getStatusColumn(),
		{
			title: iProductDetail,
			rowKey: 'orderDetails',
			dataIndex: 'orderDetails',
			key: 'orderDetails',
			render: (text, record) => (
				<MinTableProductDetail record={{
					...record,
					manufacturerName: record?.manufacturer
				}} otherProps={{
					showImage: true
				}} />
			),
		},

		{
			title: iQuality,
			key: 'quantity',
			dataIndex: 'quantity',
			rowKey: 'quantity',
			width: 130,
			render: (text, record) => (
				<span>{record?.quantity}</span>
			),
		},
		{
			title: iShipBy,
			key: 'cancelQuantity',
			dataIndex: 'cancelQuantity',
			rowKey: 'cancelQuantity',
			width: 280,
			align: 'right',
			render: (text, record) => (
				<span>{shippingMethodList?.find(i => i?.dictValue == record?.shippingWay)?.dictLabel} # {record?.shippingAccount}</span>
			),
		},
	];

	const partNumChange = e => {
		setPartNum(e.target.value)
	}


	const getShippingMethodList = async () => {
		const res = await OrderRepository.getDictList('sys_shipping_delivery')
		if (res?.code === 0) {
			res.data.map(item => {
				const { dictValue, dictLabel } = item
				item.value = dictValue
				item.label = dictLabel;
			})
			setShippingMethodList(res?.data)
		}
	}

	useEffect(async () => {
		getOrderList();
	}, [debouncedSearchTerm])
	useEffect(async () => {
		getShippingMethodList()
	}, [])

	return (
		// <div className='ps-account-order custom-antd-btn-more'>
		<div className="product-table-container ps-account-order custom-antd-btn-more ps-section--account-setting" style={{ paddingBottom: '50px' }}>
			<div className="ps-section__header">
				<div className='pub-left-title'>{iSampleList}</div>
			</div>
			<div className='pub-flex-align-center pub-custom-input-box mb20'>
				<div className='pub-search pub-custom-box-up w260'>
					<CustomInput
						onChange={e => partNumChange(e)}
						className='form-control w260' // w260
						onKeyPress = {e=> {
							if(e.key==='Enter'){
								getOrderList()
							}
						}}
					// placeholder="Part Number / QTN"
					// onPressEnter={e => handleSearch(e)}
					// value={searchName}
					// onPressEnter={() => {
					//     log("Enter 键被按下");
					// }}
					/>
					<div className={'pub-search-icon sprite-icons-1-3 '} style={{ top: '10px' }} />
					<div className='pub-custom-input-holder'>{iPartNumber}</div>
				</div>

			</div>
			<div style={{ position: 'relative' }}>
				<Table
					// rowSelection={{
					//     onChange: (selectedRowKeys, selectedRows) => {
					//         setSelectedRows(selectedRows)
					//     },
					// }}
					sticky
					loading={loading}
					columns={tableColumn}
					dataSource={orderList}
					rowKey={record => record.id}
					size='small'
					pagination={false}
					className='pub-border-table box-shadow'
					scroll={orderList?.length > 0 ? { x: 750 } : null}
				/>

				{total > 0 && <SamplePagination
					className='mt16'
					total={total}
					pageNum={pageNum}
					pageSize={100}
					isSEO={false}
					onChange={({pageNum})=>{
						setPageNum(pageNum)
						getOrderList()
					}}
				/>}
			</div>

		</div>
	);
}

export default connect(state => state)(TableOrders);
