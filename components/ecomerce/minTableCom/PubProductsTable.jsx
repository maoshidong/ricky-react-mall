import React, { useState, useRef, useEffect } from 'react';
import { Table } from 'antd';
import { useRouter } from 'next/router';
import useLanguage from '~/hooks/useLanguage';
import useApi from '~/hooks/useApi';
import { PUB_PAGINATION } from '~/utilities/constant';
import Flex from '~/components/common/flex';

// 列表小组件
import MinTableImage from '~/components/ecomerce/minTableCom/MinTableImage';
import MinTableProductDetailRohs from '~/components/ecomerce/minTableCom/MinTableProductDetailRohs';
import MinTableAvailability from '~/components/ecomerce/minTableCom/MinTableAvailability';
import MinTableEcad from '~/components/ecomerce/minTableCom/MinTableEcad'
import TablePriceList from '~/components/ecomerce/minCom/TablePriceList'
import MinAddCart from '~/components/ecomerce/minCom/MinAddCart'
import MinAddMoreCart from '~/components/ecomerce/minCom/MinAddMoreCart'
import MinTableQuote from '~/components/ecomerce/minCom/MinTableQuote'
import { SamplePagination } from '~/components/common'
import FloatButtons from '~/components/ecomerce/modules/FloatButtons'
import MinAddToRFQ from '~/components/ecomerce/minCom/MinAddToRFQ'
import filter from 'lodash/filter'
import cloneDeep from 'lodash/cloneDeep'
import find from 'lodash/find'

// 公共的产品table
const PubProductsTableCom = ({
	productsList = [], total, pages, callback,
	filterLable,
	isItemRender = false,
	currentUrl = "",
	isShowPage = true,
	isNeedRFq = true,
	isShadow = true,
	isShowBottom = true,
	tableClass
}) => {
	const { i18Translate } = useLanguage();
	const { sendTimeMap, adddressMap } = useApi();
	const tableRef = useRef();
	const Router = useRouter();
	const { asPath } = Router

	const curUrl = currentUrl || asPath?.split('?')?.[0]

	const [loading, setLoading] = useState(false)
	const [pageNum, setPageNum] = useState(PUB_PAGINATION?.pageNum)
	const [pageSize, setPageSize] = useState(PUB_PAGINATION?.pageSize)

	const [selectedRows, setSelectedRows] = useState([])
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [pList, setPlist] = useState(productsList)

	useEffect(() => {
		setPlist(productsList)
	}, [productsList])

	const rowKeysChange = (selectedRowKeysArr, record, quantity) => {
		const curItem = selectedRows.find(i => i?.productId == record?.productId) // 数量修改前，当前型号是否已经勾选
		if (curItem) {
			if (quantity) {
				const updatedArr = []
				selectedRows.map(item => {
					// 只取有数量的 quantity > 0
					if (item.productId === record?.productId) {
						updatedArr.push({ ...item, cartQuantity: quantity || 1 })
					} else {
						updatedArr.push(item);
					}
				});
				setSelectedRows(updatedArr)
			} else {
				const filterArr = selectedRows?.filter(item => item?.productId !== record?.productId)
				setSelectedRows(filterArr)
			}
		} else {
			// 如果输入的数量为空，同时又是询价，则不添加
			if (!record?.isQuote && !!quantity) {
				// 当前型号没勾选就添加
				if (selectedRows?.length === 0) {
					setSelectedRows([{ ...record, cartQuantity: quantity || 1 }])
				} else {
					setSelectedRows([...selectedRows, { ...record, cartQuantity: quantity || 1 }])
				}
			}
		}
	}

	// 数量改变时
	const quantityChange = (record, quantity) => {
		const _list = cloneDeep(pList)
		const pItem = find(_list, p => p?.productId == record?.productId)
		if (pItem) {
			pItem.cartQuantity = quantity || 1
			setPlist(_list)
		}
		// 有数量就添加(并且去重)，没数量就删掉
		if (quantity) {
			const uniqueArr = [...new Set([...selectedRowKeys, record?.productId, record?.isQuote])];
			setSelectedRowKeys(uniqueArr)
			rowKeysChange(uniqueArr, record, quantity)
		} else {

			// 输入框没有数量了，就清除
			const arr = selectedRowKeys?.filter(i => i !== record?.productId)
			setSelectedRowKeys(arr)
			rowKeysChange(arr, record, quantity)
		}
	}

	const paginationChange = (pageNumber, pageSize) => {
		setSelectedRows([])
		setPageNum(pageNumber)
		setPageSize(pageSize)
		if (callback) {
			callback(pageNumber, pageSize)
		}
	};
	const iSelect = i18Translate('i18PubliceTable.Select', 'Select')
	const iImage = i18Translate('i18PubliceTable.Image', 'Image')
	const iProductDetail = i18Translate('i18PubliceTable.Product Detail', 'Product Detail')
	const iPrice = i18Translate('i18PubliceTable.Price', 'Price')
	const iAvailability = i18Translate('i18PubliceTable.Availability', 'Availability')
	const iEcadModel = i18Translate('i18PubliceTable.ECAD Model', 'ECAD Model')
	let columns1 = [
		{
			title: iImage,
			width: 88,
			dataIndex: 'image',
			key: 'image',
			// fixed: "left",
			render: (url, record) =>
				<MinTableImage record={record} />
		},
		{
			title: iProductDetail,
			dataIndex: 'productNo',
			key: 'productNo',
			width: 250,
			render: (text, record) => (
				<MinTableProductDetailRohs record={record} />
			)
		},
		{
			title: iPrice,
			dataIndex: 'prices',
			key: 'prices',
			width: 300,
			render: (text, record) => {
				const _quote = !(record?.pricesList?.length > 0)
				record.isQuote = _quote
				return <div style={{ display: 'flex' }}>
					<TablePriceList pricesList={record?.pricesList} />
					{
						!_quote && (
							<div className='mt5 ml20'>
								<MinAddCart record={record} quantityChange={quantityChange} />
							</div>
						)
					}
					{
						_quote && (
							<div className='mt5 ml20'>
								<MinTableQuote
									record={record}
									quantityChange={quantityChange} />
							</div>
						)
					}
				</div>
			}
		},
		{
			title: iAvailability,
			dataIndex: 'Availability',
			key: 'Availability',
			width: 200,
			render: (text, record) => {
				return (
					<MinTableAvailability sendTimeMap={sendTimeMap} adddressMap={adddressMap} record={record} />
				)
			},
		},

		{
			title: iEcadModel,
			dataIndex: 'ECAD',
			key: 'ECAD',
			width: 130,
			render: (text, record) => {
				return (
					<MinTableEcad record={record} />
				)
			}
		},
	]
	let columns = columns1
	if (filterLable?.length > 0) {
		columns = columns1?.filter(item => !filterLable?.includes(item?.title))
	}


	const rowSelection = {
		columnTitle: <div>{iSelect}</div>,
		columnWidth: '60px', // 设置行选择列的宽度为
		selectedRowKeys, // 选中的key集合
		onChange: (selectedRowKeys, selectedRow) => {
			const arr = []
			const params = selectedRow?.map(i => {
				const cur = selectedRows?.find(item => item?.productId === i?.productId)
				const isQuote = !(i?.pricesList?.length > 0)
				arr.push(i?.productId)
				return {
					...i,
					isQuote,
					cartQuantity: cur?.cartQuantity || i?.pricesList?.[0]?.quantity || 1,
				}
			})
			setSelectedRows(params)
			setSelectedRowKeys(arr)  // 选中的key集合
		},
	};

	const addList = filter(selectedRows || [], sr => !sr.isQuote)
	const quoteList = filter(selectedRows || [], sr => sr.isQuote)

	return (
		<div className="product-table-container" ref={tableRef}>
			<Table
				columns={columns}
				rowSelection={{
					...rowSelection,
				}}
				dataSource={pList}
				loading={loading}
				size="small"
				bordered
				sticky
				pagination={false}
				// rowKey={() => nanoid()}
				rowKey={record => record.productId}
				// pub-bordered ant-table-bordered
				className={`pub-bordered table-vertical-top ${isShadow ? 'box-shadow' : ''} ${tableClass}`}
				style={{ borderRadius: '6px' }}
				// , minWidth: '600px'
				scroll={{
					x: 600,
					// y: 300,
				}}
			// scroll={productsList?.length > 0 ? { x: 700 } : null}
			/>
			{isShowBottom &&
				<div className='pub-flex-between mt20'>
					{
						<FloatButtons isShow={selectedRows?.length > 0}>
							{selectedRows.length !== 0 && (
								<Flex gap={20}>
									{addList?.length !== 0 && <MinAddMoreCart selectedRows={addList} isShowItem otherParams={{ widthClass: 'w130' }} />}
									{quoteList?.length !== 0 && isNeedRFq && <MinAddToRFQ list={quoteList} isShowItem />}
								</Flex>
							)}

						</FloatButtons>
					}
					{
						isShowPage && pageNum && (
							// <MinPagination
							//     total={total}
							//     pageNum={Number(pageNum)}
							//     pageSize={Number(pageSize)}
							//     totalPages={pages}
							//     isItemRender={isItemRender}
							//     currentUrl={curUrl}
							//     paginationChange={(page, pageSize) => {
							//         paginationChange(page, pageSize)
							//     }}
							// />
							<SamplePagination
								total={total}
								pageNum={Number(pageNum)}
								pageSize={Number(pageSize)}
								pagesTotal={pages}
								isSEO={isItemRender}
								currentUrl={curUrl}
								onChange={({ pageNum, pageSize }) => {
									paginationChange(pageNum, pageSize)
								}}
							/>
						)
					}

				</div>
			}
		</div>
	)
}

export default PubProductsTableCom