import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Table, Select, Button, Drawer } from 'antd'; // Input,
import { CustomInput } from '~/components/common';
import { useRouter } from 'next/router';

import OrderRepository from '~/repositories/zqx/OrderRepository';
import useEcomerce from '~/hooks/useEcomerce';
import useLanguage from '~/hooks/useLanguage';
import { setPageLoading } from '~/store/setting/action';
import { toFixedFun } from '~/utilities/ecomerce-helpers';
import { handleMomentTime, getStatusClass, decrypt } from '~/utilities/common-helpers';
import { TABLE_COLUMN, ORDER_STATUS_TEXT, DATE_OPTIONS } from '~/utilities/constant';
import MinTableProductDetail from '~/components/ecomerce/minTableCom/MinTableProductDetail'
import OrderDetailCom from '~/pages/account/order-detail/[...orderId]'
import Device from '~/components/hoc/Device';
import { getCurrencyInfo } from '~/repositories/Utils';

import flatMap from 'lodash/flatMap';
import map from 'lodash/map';
import last from 'lodash/last';

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
const min = 1;
const max = 9999;

const TableOrders = ({ auth, type, ecomerce, isDesktop, resServer = [] }) => {
	const { i18Translate, i18MapTranslate } = useLanguage();
	const iOrderNumber = i18Translate('i18AboutOrder.Order Number', TABLE_COLUMN.orderNo)
	const iOrderDate = i18Translate('i18AboutOrder.Order Date', 'Order Date')
	const iDate = i18Translate('i18AboutOrder.Date', 'Date')
	const iAllDate = i18Translate('i18AboutOrder.Date', 'All Date')
	const iStatus = i18Translate('i18PubliceTable.Status', TABLE_COLUMN.orderStatus)
	const iAllStatus = i18Translate('i18PubliceTable.Status', 'All Status')
	const iProductDetail = i18Translate('i18PubliceTable.Product Detail', TABLE_COLUMN.productDetail)
	const iUnitPrice = i18Translate('i18PubliceTable.UnitPrice', TABLE_COLUMN.unitPrice)
	const iOrdered = i18Translate('i18PubliceTable.Ordered', TABLE_COLUMN.orderQty)
	const iShipped = i18Translate('i18AboutOrder.Shipped', TABLE_COLUMN.shipQty)
	const iCanceled = i18Translate('i18AboutOrder.Canceled', "Canceled")
	const iPurchaseOrderNumber = i18Translate('i18AboutOrder2.Purchase Order Number', 'Purchase PO #')
	const iShipTime = i18Translate('i18AboutOrder.Ship Time', 'Ship Time')
	const iOperation = i18Translate('i18PubliceTable.Operation', 'Operation')
	const iViewOrder = i18Translate('i18AboutOrder.View order', 'View Order')
	// 订单直接取消状态不对、同一个客户同一个型号只有一条询价记录
	const iOrderList = i18Translate('i18MyAccount.Order List', 'Order List')
	//TODO 多语言替换
	const iOrderHistory = i18Translate('i18MyAccount.Order List by Part Number', 'Order List by Part Number')
	const iOrderDetails = i18Translate('i18AboutOrder.Order Details', "ORDER DETAILS")
	const iPartNumber = i18Translate('i18PubliceTable.PartNumber', 'Part')
	const iBuyAgain = i18Translate('i18AboutOrder.Buy Again', 'Buy Again')

	const currencyInfo = getCurrencyInfo()

	const dispatch = useDispatch();
	const { token } = auth
	const { useAddMoreCart } = useEcomerce();
	const Router = useRouter();
	const { query } = Router
	const [options, setOptions] = useState(ORDER_STATUS_TEXT?.map(i => {
		return {
			...i,
			label: i18MapTranslate(`i18AboutOrder.${i?.label}`, i?.label)
		}
	}));
	const [orderList, setOrderList] = useState([]);
	// const [initOrderList, setInitOrderList] = useState([]); // 没经过处理的订单列表数据
	const [selectedRows, setSelectedRows] = useState([]);
	const [loading, setLoading] = useState(false);
	const [isFirstLoading, setIsFirstLoading] = useState(true); // 是否是首次加载
	const [partNum, setPartNum] = useState("");
	const [orderStatus, setOrderStatus] = useState("");
	const [checkDate, setCheckDate] = useState("");
	const [isHistoryOrder, setIsHistoryOrder] = useState(Boolean(type === 'history'))

	// 订单弹窗
	const [isShowOrderDetail, setIsShowOrderDetail] = useState(false);
	const [orderDetail, setOrderDetail] = useState({});
	const debouncedSearchTerm = useDebounce(partNum, 300);

	// 从后端拿到数据后组装数据
	const handleData = (data, _obj) => {
		const dt = data || []
		// setInitOrderList(data || [])
		if (isHistoryOrder) {
			setOrderList(dt)
			return
		}
		// 订单列表，一个型号一条记录 - 历史订单不需要执行
		const newArr = flatMap(dt, item => {
			return map(item?.orderDetails, ord => ({
				...item,
				id: ord.id + Math.floor(Math.random() * (max - min + 1)) + min,
				orderDetails: [ord],
			})) || []
		})
		setOrderList(newArr)
	}

	useEffect(() => {
		handleData(resServer)
	}, [resServer])

	useEffect(async () => {
		if (!isFirstLoading) {
			getOrderList();
		} else {
			setIsFirstLoading(false)
		}
	}, [debouncedSearchTerm, token, isHistoryOrder])

	// 获取订单列表数据
	const getOrderList = async (obj) => {
		if (!token) {
			return false;
		}
		setOrderList([])
		setLoading(true)
		const partNumTrim = partNum.trim()
		let params = {
			pageSize: 300,
			pageNum: 1,
			status: obj?.status || orderStatus,
			timeFlag: obj?.timeFlag || checkDate,
		}
		if (isHistoryOrder) {
			params.orderId = partNumTrim
		} else {
			params.keyword = partNumTrim
		}

		const res = await OrderRepository.getOrderList(params, token);
		setLoading(false)
		if (res?.code === 0) {
			const { data } = res?.data
			handleData(data, obj)
		}
	}

	// 状态列样式
	const getHistoryClass = record => {
		const { status } = record
		return getStatusClass(status)
	}

	// 订单编号样式
	const getClass = record => {
		let className = 'pub-primary-tag'
		if (isHistoryOrder) {
			className = getHistoryClass(record)
			return className
		}
		// 订单取每个商品的小状态 
		const { status } = record?.orderDetails?.[0]
		return getStatusClass(status)
	}

	// 获取状态文本
	const getStatusText = record => {
		const status = isHistoryOrder ? record?.status : record?.orderDetails?.[0]?.status
		const label = ORDER_STATUS_TEXT.find(i => i.value == status)?.label
		return i18MapTranslate(`i18AboutOrder.${label}`, label)
	}

	// 展示订单抽屉 - Drawer 
	const showOrderDrawer = async (orderId) => {
		dispatch(setPageLoading(true));
		const res = await OrderRepository.getOrder(orderId, token);
		const res1 = await OrderRepository.apiOrderStatus(orderId);
		// console.log(res1, 'res1---del')
		dispatch(setPageLoading(false));
		if (res?.code === 0) {
			setOrderDetail(res?.data)
			setIsShowOrderDetail(true);
		}
	}
	useEffect(() => {
		if (decrypt(query?.orderId) && token) showOrderDrawer(decrypt(query?.orderId))
	}, [query?.orderId, token])

	// 表格日期列
	const getDateColumn = () => (
		{
			title: iOrderDate,
			rowKey: 'createTime',
			dataIndex: 'createTime',
			key: 'createTime',
			width: 100,
			render: (text) => (
				<>{handleMomentTime(text)}</>
			),
		}
	)

	// 表格订单状态列
	const getStatusColumn = () => (
		{
			title: iStatus,
			key: 'status',
			dataIndex: 'status',
			rowKey: 'status',
			width: isDesktop ? 150 : 120,
			render: (_text, record) => (
				<span className={getClass(record)}>{getStatusText(record)}</span>
			),
		}
	)

	// 表格订单编号列
	const getOrderNoColumn = () => (
		{
			title: iOrderNumber,
			dataIndex: 'orderId',
			rowKey: 'orderId',
			key: 'orderId',
			render: (text, record) => (
				<span className='pub-color-link'>
					<div className='pub-color-link' onClick={() => showOrderDrawer(record?.orderId)}>
						{text}
					</div>
				</span>
			),
		}
	)

	// 表格通用列
	const tableColumn = [
		getDateColumn(),
		{
			title: iOrderNumber,
			dataIndex: 'orderId',
			rowKey: 'orderId',
			key: 'orderId',
			width: 110,
			render: (text, record) => (
				<span className='pub-color-link'>
					<div className='pub-color-link' onClick={() => showOrderDrawer(record?.orderId)}>
						{text}
					</div>
				</span>
			),
		},
		getStatusColumn(),
		{
			title: iProductDetail,
			rowKey: 'orderDetails',
			dataIndex: 'orderDetails',
			key: 'orderDetails',
			width: isDesktop ? 350 : 300,
			render: (_text, record) => {
				return (
					<>
						{
							record?.orderDetails.map(item => {
								const productDetail = JSON.parse(item?.snapshot ?? '{}');
								const recordData = {
									...record,
									...productDetail,
									image: item?.image,
									productId: item?.productId,
									userProductTag: item?.remark,
								}
								return (
									<MinTableProductDetail
										record={recordData || {}}
										showCustomerReference={recordData?.userProductTag}
										otherProps={{
											showImage: true
										}}
										disabled={true}
									/>
								)
							})
						}
					</>
				)
			}

		},
		{
			title: iUnitPrice,
			key: 'status',
			dataIndex: 'status',
			rowKey: 'status',
			render: (_text, record) => {
				return (
					record?.orderDetails.map(item => {
						const productDetail = JSON.parse(item?.snapshot ?? '{}');
						return (
							<div key={'price' + record.orderId + productDetail.name}>{currencyInfo.label}{toFixedFun(Number(item?.price) / item?.quantity || 0, 4)}</div>
						)
					})

				)
			}
		},

		{
			title: iOrdered,
			key: 'quantity',
			dataIndex: 'quantity',
			rowKey: 'quantity',
			render: (_text, record) => {
				return (
					record?.orderDetails.map(item => {
						const productDetail = JSON.parse(item?.snapshot ?? '{}');
						return (
							<div key={'quantity' + record.orderId + productDetail.name}>{item?.quantity}</div>
						)
					})

				)
			}
		},
		{
			title: iShipped,
			key: 'sendNum',
			dataIndex: 'sendNum',
			rowKey: 'sendNum',
			render: (_text, record) => (
				<span>{record?.orderDetails?.[0].sendNum}</span>
			),
		},
		{
			title: iCanceled,
			key: 'cancelQuantity',
			dataIndex: 'cancelQuantity',
			rowKey: 'cancelQuantity',
			align: 'right',
			width: 80,
			render: (_text, record) => (
				<span>{record?.orderDetails?.[0].cancelQuantity}</span>
			),
		},
	];

	// 详细订单列（order history）
	const historyColumn = [
		getDateColumn(),
		getStatusColumn(),
		getOrderNoColumn(),
		{
			title: `${iPurchaseOrderNumber}`,
			dataIndex: 'orderNumber',
			rowKey: 'orderNumber',
			key: 'orderNumber',
			render: (_text, record) => {
				return <>
					<span>{record?.orderNumber}</span>
				</>
			},
		},
		{
			title: iShipTime,
			dataIndex: 'updateDate',
			rowKey: 'updateDate',
			key: 'updateDate',
			render: (_text, record) => {
				// 多次发货,一个运单号一个数组, 一个运单号可能有多次发货.时间取最后一次发货
				const values = record?.deliveryList || []
				return <>
					{
						// 只展示最后一次发货时间
						values?.length > 0 && <span>{handleMomentTime(last(last(values))?.updateDate)}</span>
					}

				</>
			},
		},
		{
			title: iOperation,
			dataIndex: 'Operation',
			rowKey: 'Operation',
			key: 'Operation',
			align: 'right',
			width: 90,
			render: (_text, record) => (
				<div className='pub-flex-align-center pub-color-link h45' style={{ justifyContent: 'flex-end' }}>
					<div className='pub-color-link' onClick={() => showOrderDrawer(record?.orderId)}>
						{iViewOrder}
					</div>
				</div>
			),
		}
	]

	// 表格选中行
	const getRowSelection = {
		onChange: (_selectedRowKeys, selectedRows) => {
			setSelectedRows(selectedRows)
		},
		getCheckboxProps: (record) => ({
			disabled: record.name === 'Disabled User',
			name: record.name,
		}),
	}

	// 清空选中订单
	const delSelectedRows = () => {
		setSelectedRows([])
	}

	// 订单编号part/order Number
	const partNumChange = e => {
		setPartNum(e.target.value)
	}

	// 日期时间选择
	const handleDateChange = e => {
		setCheckDate(e)
		delSelectedRows()
		setTimeout(() => {
			getOrderList({
				timeFlag: e,
				status: orderStatus,
			});
		}, 10)
	}

	// 订单状态选择
	const handleStatusChange = e => {
		setOrderStatus(e)
		delSelectedRows()
		setTimeout(() => {
			getOrderList({
				timeFlag: checkDate,
				status: e,
			});
		}, 10)
	}

	// 再次购买
	const buyAgain = () => {
		const params = selectedRows.map(item => {
			const { productId, quantity } = item?.orderDetails?.[0]
			return {
				id: productId, quantity,
			}
		})
		useAddMoreCart(
			params,
			{
				cartNo: 0,
			}
		);
		Router.push(`/account/shopping-cart`)
	}

	// 近期多少天的数据
	const iDateOptions = map(DATE_OPTIONS, dOption => {
		return {
			...dOption,
			label: i18MapTranslate(`i18AboutOrder.${dOption?.label}`, dOption?.label)
		}
	})

	// 详情订单/订单 之间的切换
	const handleOrderOrHistoryChange = (checked) => {
		setPartNum('')
		setCheckDate('')
		setOrderStatus('')
		setIsHistoryOrder(checked)
	}

	return (
		<div className='ps-account-order custom-antd-btn-more pb60 pub-sticky account-wrapper'>
			<div className="ps-section__header">
				<div className='pub-left-title mb15'>{isHistoryOrder ? iOrderList : iOrderHistory}</div>
			</div>
			<div className='pub-flex-between  pub-custom-input-box mb20 account-order-table-header'>
				<div className='pub-flex-align-center'>
					<div className='pub-search pub-custom-box-up w260'>
						<CustomInput
							onChange={e => (partNumChange(e), delSelectedRows())}
							onKeyPress={e => {
								if (e.key === 'Enter') {
									getOrderList()
								}
							}}
							className='form-control w260'
							value={partNum}
						/>

						<div className={'pub-search-icon sprite-icons-1-3 '} style={{ top: '10px' }} />
						<div className='pub-custom-input-holder'>
							{isHistoryOrder ? iOrderNumber : `${iPartNumber}/${iOrderNumber}`}
						</div>
					</div>
					<div className='pub-custom-box-up pub-custom-select ml20'>
						<Select
							onChange={handleDateChange}
							value={checkDate}
							allowClear
							options={[...iDateOptions]}
							className={'w200 ' + (checkDate ? 'select-have-val' : '')}
							getPopupContainer={(trigger) => trigger.parentNode}
						/>
						<div className='pub-custom-input-holder'>{checkDate ? iDate : iAllDate}</div>
					</div>
					<div className='pub-custom-box-up pub-custom-select ml20'>
						<Select
							onChange={handleStatusChange}
							value={orderStatus}
							allowClear
							options={[...options]}
							className={'w200 ' + (orderStatus ? 'select-have-val' : '')}
							getPopupContainer={(trigger) => trigger.parentNode}
						/>
						<div className='pub-custom-input-holder'>{orderStatus ? iStatus : iAllStatus}</div>
					</div>
				</div>
				<div style={{ display: "flex", justifyContent: 'center', gap: '5px', margin: '0 10px' }}>
					<div
						onClick={() => { handleOrderOrHistoryChange(true) }}
						className={`sprite-order ${isHistoryOrder ? 'sprite-order-selected' : ''}`}
					>
						<div className={`sprite-order-icons ${isHistoryOrder ? 'sprite-order-icons-2-2' : 'sprite-order-icons-2-1'}`} />
					</div>
					<div
						onClick={() => { handleOrderOrHistoryChange(false) }}
						className={`sprite-order ${!isHistoryOrder ? 'sprite-order-selected' : ''}`}>
						<div className={`sprite-order-icons ${!isHistoryOrder ? 'sprite-order-icons-1-2' : 'sprite-order-icons-1-1'}`} />
					</div>
				</div>
			</div>
			<div style={{ position: 'relative' }}>
				<Table
					sticky
					rowSelection={isHistoryOrder ? null : getRowSelection}
					loading={loading}
					columns={isHistoryOrder ? historyColumn : tableColumn}
					dataSource={orderList}
					rowKey={record => record.id}
					size='small'
					className='pub-border-table box-shadow'
					scroll={orderList?.length > 0 ? { x: 1000 } : { x: 750 }}
					scrollToFirstRowOnChange={true} // 	当分页、排序、筛选变化后是否滚动到表格顶部
				/>
				{
					(!isHistoryOrder && selectedRows?.length > 0) && <Button
						type="primary" ghost
						className='ps-add-cart-footer-btn custom-antd-primary w120 mt16'
						onClick={() => buyAgain()}
					>{iBuyAgain}</Button>
				}
			</div>

			{
				isShowOrderDetail && (
					<Drawer
						title={iOrderDetails}
						placement="right"
						width="88%"
						onClose={(e) => setIsShowOrderDetail(false)}
						open={isShowOrderDetail}
						closeIcon={<i className="icon icon-cross2"></i>}
					>
						<div>
							<OrderDetailCom otherParams={{
								orderDetail: orderDetail,
								OrderDetailModal: true,
							}} />
						</div>
					</Drawer>
				)
			}
		</div>
	);
}

const TableOrdersComponent = (props) => {
	return <Device>
		<TableOrders {...props} />
	</Device>
}

export default connect(state => state)(TableOrdersComponent);
