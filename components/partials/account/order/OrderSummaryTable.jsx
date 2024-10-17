import React, { useState } from 'react';
import { Table } from 'antd';
import Link from 'next/link';
import { toFixedFun } from '~/utilities/ecomerce-helpers';
import { isIncludes } from '~/utilities/common-helpers';
import { TABLE_COLUMN } from '~/utilities/constant';
import { getEnvUrl, PRODUCTS_DETAIL } from '~/utilities/sites-url';
import MinCustomerReference from '~/components/ecomerce/minCom/MinCustomerReference';
import LeadTimeEstimates from '~/components/ecomerce/cartCom/LeadTimeEstimates';
import useLanguage from '~/hooks/useLanguage';
import { getCurrencyInfo } from '~/repositories/Utils';

// 订单产品列表table
const OrderSummaryTable = ({ paramMap, order, orderList, num, OrderDetailModal = false }) => {
	const { i18Translate, getLanguageEmpty } = useLanguage();
	const iSort = i18Translate('i18PubliceTable.Sort', "Sort")
	const iProductDetail = i18Translate('i18PubliceTable.Product Detail', "Product Detail")
	const iOrdered = i18Translate('i18PubliceTable.Ordered', TABLE_COLUMN.orderQty)
	const iAvailability = i18Translate('i18PubliceTable.Availability', 'Availability')
	const iUnitPrice = i18Translate('i18PubliceTable.UnitPrice', 'Unit Price')
	const iExtPrice = i18Translate('i18PubliceTable.ExtPrice', 'Ext.Price')
	const iCanceled = i18Translate('i18AboutOrder.Canceled', "Canceled")

	const [leadTimeEstimatesData, setLeadTimeEstimatesData] = useState({}); // 检查交货期数据
	const [isLeadTimeEstimates, setIsLeadTimeEstimates] = useState(false); // 检查交货期

	const currencyInfo = getCurrencyInfo()

	const isShowCanceled = () => {
		let res = {
			title: '',
			dataIndex: '',
			width: '0px',
		}
		if (num === 7) {
			res = {
				title: iCanceled,
				dataIndex: 'cancelQuantity',
				width: '90px',
			}
		}
		return res
	}
	const iShipsNow = i18Translate('i18MyCart.Ships Now', 'Ships Now')
	const iBackordered = i18Translate('i18MyCart.Backordered', 'Backordered')
	const columns = [
		{
			title: iSort,
			dataIndex: 'index',
			align: 'left',
			width: 140,
			render: (text, record, index) =>
				<div className='cart-img-sort pub-flex-align-center' style={{ height: '90px' }}>
					<span>{index + 1}</span>
					<img className='cart-img ml30' src={record.image || getLanguageEmpty()} style={{ width: '70px', height: '70px' }} />
				</div>,
		},
		{
			title: iProductDetail,
			dataIndex: 'snapshot',
			width: 250,
			render: (snapshot, record) => {
				const productDetail = JSON.parse(snapshot ?? '{}');
				return <div className='ps-product-detail product-detail'>
					<div className="product-name">
						{
							record?.productId > 0 ? <Link
								href={`${getEnvUrl(PRODUCTS_DETAIL)}/${isIncludes(productDetail?.name)}/${record?.productId}`}
							>
								<a target='_blank' className="ps-product__title color-link" >{productDetail.name}</a>
							</Link> : productDetail.name
						}

					</div>
					<div className='manufacturer'>
						{productDetail?.manufacturerName || productDetail?.manufacturerSlug}
					</div>
					{
						record?.remark && (
							<div className='mt10'>
								<MinCustomerReference disabled={true} record={{
									...record,
									userProductTag: record?.remark
								}} />
							</div>
						)
					}

				</div>
			}
		},
		{
			title: iOrdered,
			dataIndex: 'quantity',
			width: 90,
		},

		{
			title: iAvailability,
			dataIndex: 'storageQuantity',
			// {
			//     const { cartQuantity, quantity, sendDate } = record
			render: (text, row) => <>
				{/* 库存和购物车数量做对比，展示发货数量和是否延期发货， 有sendDate时间就是延期发货 */}
				{/* 不延期且库存大于购物车数量  && !row?.sendDate */}
				{(row?.storageQuantity > row.quantity && !row?.sendDate) && <div> {row.quantity} - {iShipsNow}</div>}
				{/* 产品id小于0， 没有库存 */}
				{(row?.productId < 0) && <div> {row.quantity} - {iShipsNow}</div>}
				{/* 不延期且库存小于购物车数量 */}
				{(row?.storageQuantity <= row.quantity) && <div> {row.storageQuantity} - {iShipsNow}</div>}
				{/* 延期 */}
				{(row?.storageQuantity < row.quantity || row?.sendDate) && <div
					className='pub-danger pub-cursor-pointer'
					onClick={() => (setIsLeadTimeEstimates(true), setLeadTimeEstimatesData(row))}
				>
					{row?.sendDate ? row?.quantity : (row?.quantity - row?.storageQuantity)} - {iBackordered}
					{/* {row.quantity - row.storageQuantity} - {iBackordered} 旧的 */}
				</div>}
			</>
		},
		isShowCanceled(),
		{
			title: iUnitPrice,
			dataIndex: 'UnitPrice',
			render: (text, row) => <>{currencyInfo.label}{toFixedFun(row?.price / row?.quantity || 0, 4)}</>

		},
		{
			title: iExtPrice,
			dataIndex: 'price',
			align: 'right',
			render: (text) => <div>{currencyInfo.label}{toFixedFun(text || 0, 2)}</div>
		},
	];

	return <>
		<Table
			size="small"
			pagination={false}
			rowKey={record => record?.productId}
			columns={columns}
			dataSource={orderList}
			className='pub-border-table table-title-top'
			sticky={OrderDetailModal ? undefined : true}
			scroll={orderList?.length > 0 ? { x: 800 } : null}
		// rowClassName='reset-table-row'
		// className="reset-table"
		/>
		{/* 查看交货船期 */}
		{
			isLeadTimeEstimates && (
				<LeadTimeEstimates
					paramMap={paramMap}
					isShoeModal={isLeadTimeEstimates}
					record={leadTimeEstimatesData}
					onCancel={() => setIsLeadTimeEstimates(false)}
				/>
			)
		}
	</>

}

export default OrderSummaryTable