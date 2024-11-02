import React, { useState, useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { Table, Select, Spin } from 'antd';
import QuoteRepositry from '~/repositories/zqx/QuoteRepositry';

import PartNumSearch from '~/components/ecomerce/formCom/PartNumSearch';
import MinAddMoreCart from '~/components/ecomerce/minCom/MinAddMoreCart';
import SearchNoData from '~/components/ecomerce/minCom/SearchNoData';
// import MinPagination from '~/components/ecomerce/minCom/MinPagination' // 分页
import { SamplePagination } from '~/components/common'

import { PUB_PAGINATION, DATE_OPTIONS, LEAD_TIME, QUOTE_STATUS_TEXT } from '~/utilities/constant';
import { handleMomentTime, scrollToTop, getProductUrl } from '~/utilities/common-helpers'
import { toFixedFun } from '~/utilities/ecomerce-helpers';
import useLanguage from '~/hooks/useLanguage';
import { getCurrencyInfo } from '~/repositories/Utils';

const QuoteHistoryCom = ({ auth }) => {
	const { i18Translate, i18MapTranslate } = useLanguage();
	const iQuoteList = i18Translate('i18MyAccount.Quote List', "Quote List")
	const iDate = i18Translate('i18AboutOrder.Date', 'Date')
	const iAllDate = i18Translate('i18AboutOrder.Date', 'All Date')
	const iStatus = i18Translate('i18PubliceTable.Status', 'Status')
	const iAllStatus = i18Translate('i18PubliceTable.Status', 'All Status')
	const iQuotationResults = i18Translate('i18MyAccount.Quotation Results', 'Quotation Results')
	const iTargetPrice = i18Translate('i18PubliceTable.Target Price', 'TP')
	const iPending = i18Translate('i18MyAccount.Pending', "Pending")
	const iComplete = i18Translate('i18AboutOrder.Complete', 'Complete')
	const iSoldOut = i18Translate('i18MyAccount.Sold Out', 'Sold Out')
	const iRemark = i18Translate('i18Form.Remark', 'Remark')
	const iPackage = i18Translate('i18MyAccount.Package', 'Package')
	const iDC = i18Translate('i18MyAccount.DC', 'DC')
	const iRohs = i18Translate('i18MyAccount.Rohs', 'Rohs')
	const iUnitPrice = i18Translate('i18PubliceTable.UnitPrice', 'Unit Price')
	const iLeadtime = i18Translate('i18MyAccount.Lead time', 'Lead time')
	const iDateOptions = DATE_OPTIONS?.map(i => {
		return {
			...i,
			label: i18MapTranslate(`i18AboutOrder.${i?.label}`, i?.label)
		}
	})
	const currencyInfo = getCurrencyInfo()

	const Router = useRouter();
	const { query } = Router

	const { token } = auth
	const [list, setList] = useState([])
	const [total, setTotal] = useState(0)
	const [pages, setPages] = useState(1)
	const [pageNum, setPageNum] = useState(PUB_PAGINATION?.pageNum)
	const [pageSize, setPageSize] = useState(PUB_PAGINATION?.pageSize)
	const [loading, setLoading] = useState(false);
	const [partNum, setPartNum] = useState(query?.partNum || ''); // 型号搜索
	const [isAllCheck, setIsAllCheck] = useState(query?.partNum ? 1 : '');  // 是否全部匹配, 从询价页面过来就全部匹配
	const [checkDate, setCheckDate] = useState(""); // 日期搜索
	const [orderStatus, setOrderStatus] = useState(""); // 状态搜索
	const [isInitialRender, setIsInitialRender] = useState(true);

	// `priceStatus` tinyint NOT NULL DEFAULT '0' COMMENT '0:未报价  1：已报价',
	// `priceStatus` tinyint NOT NULL DEFAULT '0' COMMENT '询价状态 ：0：待入询价  1：加入  2：关闭',


	const getList = async (obj, param) => {
		console.log(obj, 'obj----del')
		console.log(orderStatus, 'orderStatus----del')
		setLoading(true)
		const curPartNum = isInitialRender ? query?.partNum : partNum
		const params = {
			pageSize: param?.pageSize || PUB_PAGINATION.pageSize,
			pageNum: param?.pageNum || PUB_PAGINATION.pageNum,
			// pageSize: 50,
			// pageNum,
			partNum,
			priceStatus: obj?.status || orderStatus,
			timeFlag: obj?.timeFlag || checkDate,
			isAllCheck, // 是否全部匹配
		}
		setIsInitialRender(true)
		const res = await QuoteRepositry.myInquiryList(token, params);
		setLoading(false)
		if (res?.code === 0) {
			const { data, total, pages } = res?.data
			// 询价列表，一个型号一条记录
			const newArr = []
			data?.map(item => {
				item?.itemList?.map(i => {
					newArr.push({
						...item,
						itemList: i,
					})
				})
			})
			setIsAllCheck('')
			setList(newArr)
			setTotal(total)
			setPages(pages)
			scrollToTop()
		}
	}

	let timer = useRef();
	useEffect(() => {
		if (!token) {
			return false;
		}
		clearTimeout(timer.current);
		timer.current = setTimeout(() => {
			getList()
		}, 0);

		return () => {
			clearTimeout(timer.current);
		};

	}, [token, partNum])

	// 询价信息  priceStatus  0 没收到报价 1收到采购报价，待报价客户（采购报给我们的）  2已报价 3无货
	// 回传的报价信息过来时同时伴随 询价信息priceStatus  变为1，回传报价信息新创建状态status起始为1， 待报价给客户 ，报价给客户后变为2


	const handleDateChange = e => {
		getList({
			timeFlag: e,
		});
		setCheckDate(e)
	}
	const handleStatusChange = e => {
		setOrderStatus(e)
	}
	useEffect(() => {
		getList({
			status: orderStatus,
		});
	}, [orderStatus])

	const expandedRowRender1 = () => {
		const columns = [
			{
				title: iDate,
				dataIndex: 'date',
				key: 'date',
			},

		];
		const data = [];
		for (let i = 0; i < 1; ++i) {
			data.push({
				key: i.toString(),
				date: '2014-12-24 23:12:00',
				name: 'This is production name',
				upgradeNum: 'Upgraded: 56',
			});
		}
		return <Table columns={columns} dataSource={data} pagination={false} />;
	};

	const data = [];
	for (let i = 0; i < 1; ++i) {
		data.push({
			key: i.toString(),
			name: 'Screem',
			platform: 'iOS',
			version: '10.3.4.5654',
			upgradeNum: 500,
			creator: 'Jack',
			createdAt: '2014-12-24 23:12:00',
		});
	}

	const iPartNumber = i18Translate('i18PubliceTable.PartNumber', 'Part Number')
	const iManufacturer = i18Translate('i18PubliceTable.Manufacturer', 'Manufacturer')
	const iQuantity = i18Translate('i18PubliceTable.Quantity', "Quantity")
	const expandedRowRender = (item) => {
		// if(item?.id === 914) {
		// }

		// 型号对比改变颜色
		if (!item?.itemList?.pushOrderDetailList || item?.itemList?.pushOrderDetailList?.length === 0) return null
		const columns = [
			{
				title: iPartNumber,
				dataIndex: 'partNum',
				key: 'exppartNum',
				width: 180,
				render: (text, record) => (
					<div style={{ minWidth: '200px' }}>{record?.partNum}</div>
				),
			},
			{
				title: iManufacturer,
				dataIndex: 'manufacturer',
				key: 'expmanufacturer',
				render: (text, record) => (
					<div>{record?.manufacturer}</div>
				),
			},
			{
				title: iPackage,
				dataIndex: 'packaging',
				key: 'wxpexppackage',
				width: 80,
				render: (text, record) => (
					<div className="pub-direction-column pub-color555">{text}</div>
				),
			},
			{
				title: iDC,
				dataIndex: 'dc',
				key: 'expdc',
				width: 40,
				render: (text, record) => (
					<div className="pub-direction-column pub-color555">{text}</div>
				),
			},
			{
				title: iRohs,
				dataIndex: 'rohs',
				key: 'expRohs',
				width: 50,
				render: (text, record) => (
					<div className="pub-direction-column pub-color555">{text ? 'Rohs' : ''}</div>
				),
			},
			{
				title: iQuantity,
				dataIndex: 'quantity',
				key: 'expQuantity',
				width: 70,
				render: (text, record) => (
					<div className="pub-direction-column pub-color555">{text}</div>
				),
			},
			{
				title: `${iUnitPrice} (${currencyInfo.value})`,
				dataIndex: 'sellOnePrice',
				key: 'expprice',
				width: 110,
				render: (text, record) => (
					<div className="pub-direction-column pub-color555">{currencyInfo.label}{text}</div>
				),
			},
			{
				title: iLeadtime,
				dataIndex: 'leadTime',
				key: 'expLead time ',
				width: 100,
				render: (text, record) => (
					<div className="pub-direction-column pub-color555">{LEAD_TIME?.find(item => item?.value === text)?.label}</div>
				),
			},
			{

				title: iRemark,
				key: 'remark',
				dataIndex: 'remark',
				rowKey: 'expremark',
				render: (text, record) => (
					<div>{text}</div>
				)
			},
			{
				title: 'Operation',
				key: 'Operation',
				dataIndex: 'Operation',
				rowKey: 'Operation',
				width: 130,
				render: (text, record, index) => (
					// <>
					//     {item?.itemList?.productId && (
					<div className="custom-antd-btn-more">
						<MinAddMoreCart
							// 数据已报价的为准(pushOrderDetailList)
							selectedRows={[{
								productId: item?.itemList?.pushOrderDetailList?.[index]?.productId,  // 报从价拿
								quantity: item?.itemList?.pushOrderDetailList?.[index]?.quantity, // 报价数量，最小购买数量
								partNum: item?.itemList?.pushOrderDetailList?.[index]?.partNum,  // 报从价拿
								manufacturer: item?.itemList?.pushOrderDetailList?.[index]?.manufacturer,  // 报从价拿
							}]}
							otherParams={{
								addText: i18Translate('i18FunBtnText.AddToCart', 'ADD TO CART'),
								widthClass: '',
								type: 2,
								callBackId: item?.itemList?.pushOrderDetailList?.[index]?.id, // 报价返回的callBackList的id
							}}
						/>

					</div>
					//     )}
					// </>

				),
			},
		]
		//     return <Table columns={columns} dataSource={[item]} pagination={false} />;
		//     return    <Table
		//     columns={columns}
		//     dataSource={[item]}
		//     rowKey={record => nanoid()}
		//     pagination={false}
		//     size='small'
		//     sticky
		//     className='mb20 pub-border-table'
		// />;
		return <>
			<div className="mb10 pub-color555 pub-font14 pub-fontw">{iQuotationResults}:</div>
			<Table
				columns={columns}
				dataSource={item?.itemList?.pushOrderDetailList || []}
				// rowKey={record => nanoid()}
				pagination={false}
				size='small'
				sticky
				// key={nanoid()}
				className='pub-border-table pub-border-table-expanded'
				scroll={list?.length > 0 ? { x: 500 } : null}
			/>
		</>

	}
	console.log(list, 'list----del')
	const status_text = {
		0: iPending,
		1: iPending,
		2: iPending,
		4: iComplete,
		3: iSoldOut,
	}
		// '0:未报价  1：已报价',
		const getClass = record => {
			const { priceStatus } = record?.itemList || {}
			let className = 'mt3 pub-primary-tag'
			if (priceStatus == 4) {
				className = 'mt3 pub-suc-tag'
			}
			if (priceStatus == 3) {
				className = 'mt3 pub-err-tag '
			}
			return className
		}
	const RequestColumn = [
		{
			title: iStatus,
			key: 'Status',
			dataIndex: 'Status',
			rowKey: 'Status',
			width: 90,
			render: (text, record) => (
				<div className="pub-direction-column pub-color555">
					<div className={getClass(record)}>{status_text[record?.itemList?.priceStatus]}</div>
				</div>
			),
		},
		{

			title: iPartNumber,
			key: 'partNum',
			dataIndex: 'partNum',
			rowKey: 'partNum',
			width: 210,
			render: (text, record) => (
				<>
					{
						record?.itemList?.productId && <Link href={getProductUrl(record?.itemList?.manufacturer, record?.itemList?.partNum, record?.itemList?.productId)}>
							<a className="pub-color-link">{record?.itemList?.partNum}</a>
						</Link>
					}
					{
						!record?.itemList?.productId && <div className={"pub-font14"}>{record?.itemList?.partNum}</div>
					}
				</>
			)
		},
		{
			title: iManufacturer,
			key: 'manufacturer',
			dataIndex: 'manufacturer',
			rowKey: 'manufacturer',
			width: 210,
			render: (text, record) => (
				<div>{record?.itemList?.manufacturer === 'unknown' ? '' : record?.itemList?.manufacturer}</div>
			)
		},
		{
			title: iQuantity,
			key: 'quantity',
			dataIndex: 'quantity',
			rowKey: 'quantity',
			width: 70,
			render: (text, record) => (
				<div>
					<div>{record?.itemList?.quantity}</div>
				</div>
			),
		},
		{
			title: `${iTargetPrice}(${currencyInfo.value})`,
			key: 'targetPrice',
			dataIndex: 'targetPrice',
			rowKey: 'targetPrice',
			width: 90,
			render: (text, record) =>
				Number(record?.itemList?.targetPrice) > 0 && <div>{currencyInfo.label}{toFixedFun(record?.itemList?.targetPrice, 2)}</div>
			,
		},
		{

			title: iRemark,
			key: 'remark',
			dataIndex: 'remark',
			rowKey: 'remark',
			render: (text, record) => (
				<div>{text}</div>
			)
		},
		{
			title: iDate,
			key: 'createTime',
			dataIndex: 'createTime',
			rowKey: 'createTime',
			width: 110,
			render: (text, record) => (
				<div>{handleMomentTime(record?.createTime)}</div>
			)
		},
	]

	const isAlreadyQuoted = (record) => {
		return Boolean(record?.itemList?.priceStatus == 1)
	}

	const paginationChange = (pageNumber, pageSize) => {
		const params = {
			pageNum: pageNumber,
			pageSize: pageSize,
		}
		getList('', params)
		setPageNum(pageNumber)
		setPageSize(pageSize)
	};

	// const QuotationColumn = [
	//     {
	//         title: 'PN / Mfr',
	//         key: 'priceStatus',
	//         dataIndex: 'priceStatus',
	//         rowKey: 'priceStatus',
	//         render: (text, record) => (

	//             <div className="pub-direction-column" style={{height: '60px'}}>
	//                 {
	//                     isAlreadyQuoted(record) && (
	//                         <>
	//                             {
	//                                 record?.itemList?.productId && <Link href={getProductUrl(record?.itemList?.manufacturer, record?.itemList?.partNum, record?.itemList?.productId)}>
	//                                 <a className="pub-color-link">{record?.itemList?.partNum}</a>
	//                             </Link>
	//                             }
	//                             {
	//                                 !record?.itemList?.productId && <div className={"pub-font14"}>{record?.itemList?.partNum}</div>
	//                             }
	//                             {/* <div className={"pub-font14 " + (record?.itemList?.productId ? 'pub-color-link' : '')}>{record?.itemList?.partNum}</div> */}
	//                             <div>{record?.itemList?.manufacturer}</div>
	//                         </>
	//                 )}
	//             </div>
	//         ),
	//     },
	//     {
	//         // title: TABLE_COLUMN.availability,
	//         title: 'Qty',
	//         key: 'quantity',
	//         dataIndex: 'quantity',
	//         rowKey: 'quantity',
	//         width: 60,
	//         render: (text, record) => (
	//             <div>
	//                 {
	//                     isAlreadyQuoted(record) && (
	//                         <div>{record?.itemList?.quantity}</div>
	//                     )
	//                 }
	//             </div>
	//         ),
	//     },

	//     {
	//         title: `UP(${currencyInfo.value})`,
	//         key: 'extPrice',
	//         dataIndex: 'extPrice',
	//         rowKey: 'extPrice',
	//         width: 85,
	//         render: (text, record) => (
	//             <div>
	//                 {
	//                     isAlreadyQuoted(record) && (
	//                         <div>{currencyInfo.label}{toFixedFun(record?.itemList?.extPrice, 2)}</div>
	//                     )
	//                 }
	//             </div>
	//         ),
	//     },

	//     {
	//         title: 'Operation',
	//         key: 'Operation',
	//         dataIndex: 'Operation',
	//         rowKey: 'Operation',
	//         width: 100,
	//         render: (text, record) => (
	//             <>
	//                 {record?.itemList?.productId && (
	//                     <div className="custom-antd-btn-more">
	//                         <MinAddMoreCart
	//                             selectedRows={[{
	//                                 productId: record?.itemList?.productId,
	//                             }]}
	//                             otherParams={{
	//                                 addText: i18Translate('i18FunBtnText.AddToCart', "Add to Cart"),
	//                                 widthClass: 'w80',
	//                             }}
	//                         />

	//                     </div>
	//                 )}
	//             </>

	//         ),
	//     },
	// ]

	const iMyRequestTit = i18Translate('i18MyAccount.MyRequestTit', 'Request for Quotation (RFQ)')

	const newQuoteStatusText = QUOTE_STATUS_TEXT.map(item => {
		return {
			...item,
			label: i18MapTranslate(`i18MyAccount.${item.label}`, item.label)
		}
	})

	return (
		<div className='product-table-container quote-history-com custom-antd-btn-more pub-custom-input-box'>
			<div className='mb15 pub-left-title'>{iQuoteList}</div>
			<div className='pub-flex-align-center pub-custom-box-up mb20 account-quote-history-header'>
				<PartNumSearch partNumParam={partNum} partNumCallBack={(e) => (setPartNum(e))}
					onKeyPress={(e) => {
						if (e.key === 'Enter') { getList() }
					}} />
				{/* <conditionSelect partNumCallBack={getList} DATE_OPTIONS={DATE_OPTIONS} /> */}
				<div className='pub-custom-box-up pub-custom-select ml20'>
					<Select
						onChange={handleDateChange}
						allowClear
						options={
							[
								// { label: 'All Date', value: '' },
								...iDateOptions,
							]
						}
						className={'w200 ' + (checkDate ? 'select-have-val' : '')}
						getPopupContainer={(trigger) => trigger.parentNode}
					>
					</Select>
					<div className='pub-custom-input-holder'>{checkDate ? iDate : iAllDate}</div>
				</div>
				<div className='pub-custom-box-up pub-custom-select ml20'>
					<Select
						onChange={handleStatusChange}
						allowClear
						options={newQuoteStatusText}
						className={'w200 ' + (orderStatus ? 'select-have-val' : '')}
						getPopupContainer={(trigger) => trigger.parentNode}
					>
					</Select>
					<div className='pub-custom-input-holder'>{orderStatus ? iStatus : iAllStatus}</div>
				</div>
			</div>

			<div className="mb5 pub-color555 pub-font14 pub-fontw">{iMyRequestTit}</div>

			<Spin spinning={loading} size='large' style={{ minHeight: '80px' }}>
				<div style={{ minHeight: '80px' }}>
					{
						list?.map(item => {

							let expandableParams = {
								// expandedRowRender: () => (expandedRowRender(item)),
								defaultExpandAllRows: true, // 初始时，是否展开所有行
								expandIcon: () => (null),
								showExpandColumn: false, // 设置是否展示行展开列
								// defaultExpandedRowKeys: ['0'],
							}
							// if(item?.itemList?.pushOrderDetailList?.length > 0) {
							//     expandableParams.expandedRowRender = () => ((item?.itemList?.pushOrderDetailList?.length > 0) ? expandedRowRender(item) : null
							// }

							return <div key={nanoid()}>
								<Table
									columns={RequestColumn}
									dataSource={[item]}
									pagination={false}
									size='small'
									className={'mb20 pub-border-table box-shadow ' + (item?.itemList?.pushOrderDetailList?.length > 0 ? '' : 'hideExpandedRowRender')}
									scroll={list?.length > 0 ? { x: 500 } : null}
									// rowKey={record => nanoid()}
									expandable={{
										...expandableParams,
										expandedRowRender: () => ((item?.itemList?.pushOrderDetailList?.length > 0) ? expandedRowRender(item) : null),
									}}
								/>
							</div>
						})
					}
					{
						list?.length > 0 && (
							// <MinPagination
							//     total={total}
							//     pageNum={pageNum}
							//     pageSize={pageSize}
							//     totalPages={pages}
							//     isItemRender={false}
							//     paginationChange={(page, pageSize) => {
							//         paginationChange(page, pageSize)
							//     }}
							// />
							<SamplePagination
								total={total}
								pageNum={pageNum}
								pageSize={pageSize}
								pagesTotal={pages}
								isSEO={false}
								onChange={({ pageNum, pageSize }) => {
									paginationChange(pageNum, pageSize)
								}}
							/>
						)
					}
					{
						list?.length === 0 && (
							<div className='mb50'>
								<SearchNoData type={2} />
							</div>
						)
					}
				</div>
			</Spin>
			{/* {
                list?.map(item => {
                    return <div key={nanoid()}><Table
                        columns={RequestColumn}
                        dataSource={[item]}
                        rowKey={record => nanoid()}
                        expandable={{
                            expandedRowRender,
                        }}
                        // rowKey={record => record.id}
                        key={nanoid()} // 不加key, 会导致页面渲染时表格也重新渲染，添加购物车成功弹窗也会自动关闭
                        pagination={false}
                        size='small'
                        sticky
                        className='mb20 pub-border-table'
                        scroll={list?.length > 0 ? { x: 500 } : null}
                    /></div>
                })
            } */}

			{/* <Row gutter={10}>
                <Col span={12}>
                    <div className="mb5 pub-color555 pub-font14 pub-fontw">Request for Quotation (RFQ)</div>
                    <Table
                        columns={RequestColumn}
                        dataSource={list}
                        rowKey={record => nanoid()}
                        // rowKey={record => record.id}
                        // rowKey={record => record.id}
                        // key={record => record.id} // 不加key, 会导致页面渲染时表格也重新渲染，添加购物车成功弹窗也会自动关闭
                        pagination={false}
                        size='small'
                        sticky
                        className='pub-border-table'
                        scroll={list?.length > 0 ? { x: 500 } : null}
                    />
                </Col>
                <Col span={12}>
                    <div className="mb5 pub-color555 pub-font14 pub-fontw">Quotation</div>
                    <Table
                        columns={QuotationColumn}
                        dataSource={list}
                        rowKey={record => record.id}
                        key={record => record.id} // 不加key, 会导致页面渲染时表格也重新渲染，添加购物车成功弹窗也会自动关闭
                        pagination={false}
                        // bordered
                        size='small'
                        sticky
                        scroll={list?.length > 0 ? { x: 500 } : null}
                        className='pub-border-table'
                    />
                </Col>
            </Row> */}
		</div>
	)
}

// export default QuoteHistoryCom(state => state)(FavoritesList);

export default connect(state => state)(QuoteHistoryCom);