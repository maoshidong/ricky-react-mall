import React, { useState, useEffect, useRef } from 'react';
import { Table } from 'antd';
import { CustomInput } from '~/components/common';
import { connect } from 'react-redux';
import ProductRepository from '~/repositories/ProductRepository';

import TablePriceList from '~/components/ecomerce/minCom/TablePriceList';
import MinAddCart from '~/components/ecomerce/minCom/MinAddCart';
import MinTableQuote from '~/components/ecomerce/minCom/MinTableQuote';
import MinTableAvailability from '~/components/ecomerce/minTableCom/MinTableAvailability';
import MinTableProductDetail from '~/components/ecomerce/minTableCom/MinTableProductDetail'
// import MinPagination from '~/components/ecomerce/minCom/MinPagination' // 分页
import { SamplePagination } from '~/components/common'
import MinModalTip from '~/components/ecomerce/minCom/MinModalTip' // 公共提示

import { handleMomentTime, scrollToTop } from '~/utilities/common-helpers'

import { TABLE_COLUMN, PUB_PAGINATION, DEL_ONE_TEXT } from '~/utilities/constant'

import useEcomerce from '~/hooks/useEcomerce';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';


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
// 收藏列表 + 自定义标签 + 浏览历史列表
const FavoritesList = ({ auth, curActive = 'my-favorites' }) => {
	const { i18Translate, getDomainsData } = useLanguage();
	const { iCustomerReference } = useI18();
	const iFavorites = i18Translate('i18MyAccount.Favorites', "Favorites")
	const iPartNumber = i18Translate('i18PubliceTable.PartNumber', 'Part Number')

	const iProductDetail = i18Translate('i18PubliceTable.Product Detail', TABLE_COLUMN.productDetail)
	const iAvailability = i18Translate('i18PubliceTable.Availability', TABLE_COLUMN.availability)
	const iDateAdded = i18Translate('i18PubliceTable.DateAdded', TABLE_COLUMN.DateAdded)

	const iUnitPrice = i18Translate('i18PubliceTable.UnitPrice', TABLE_COLUMN.unitPrice)
	const iDelete = i18Translate('i18PubliceTable.Delete', TABLE_COLUMN.delete)

	const { token } = auth
	const isFavorites = Boolean(curActive === 'my-favorites')
	const isBrowseHistory = Boolean(curActive === 'browse-history')
	const { sendTimeMap, adddressMap } = useEcomerce();

	const [loading, setLoading] = useState(false);
	const [isAllClear, setIsAllClear] = useState(false)
	const [productIds, setProductIds] = useState([])
	const [removeModal, setRemoveModal] = useState(false)

	const [myFavoritesList, setmyFavoritesList] = useState([])
	const [total, setTotal] = useState(0)
	const [pages, setPages] = useState(1)
	const [pageNum, setPageNum] = useState(PUB_PAGINATION?.pageNum)
	const [pageSize, setPageSize] = useState(PUB_PAGINATION?.pageSize)

	const [partNum, setPartNum] = useState("");

	const debouncedSearchTerm = useDebounce(partNum, 300);

	const handleList = res => {
		setLoading(false)
		if (res?.code === 0) {
			const { data, total, pages } = res?.data
			setmyFavoritesList(data)
			setTotal(total)
			setPages(pages)
			scrollToTop()
		}
	}
	const getMyFavoritesList = async () => {
		if (!token) {
			return false;
		}
		setLoading(true)
		const params = {
			pageSize,
			pageNum,
			partNum,
			languageType: getDomainsData()?.defaultLocale
		}
		if (isBrowseHistory) {
			const res = await ProductRepository.myViewHistoryList(params);
			handleList(res)
			return
		}
		if (isFavorites) {
			const res = await ProductRepository.myFavoritesList(params);
			handleList(res)
		} else {
			const res = await ProductRepository.getProductTagList(params);
			handleList(res)
		}
	}


	function handleRemoveCancel() {
		setRemoveModal(false)
		setProductIds([])
		setIsAllClear(false)
	}
	// 删除成功后
	const handleSucDel = res => {
		if (res && res.code == 0) {
			getMyFavoritesList()
			handleRemoveCancel()
		}
	}
	async function handleRemoveOk() {
		if (isBrowseHistory) {
			// const res = await ProductRepository.myViewHistoryDel(productIds);
			const res = await ProductRepository.myViewHistoryDel({ productId: productIds[0] });
			handleSucDel(res)
			return
		}
		if (isFavorites) {
			const res = await ProductRepository.myFavoritesDel(productIds);
			handleSucDel(res)
		} else {
			const res = await ProductRepository.delProductTag(productIds);
			handleSucDel(res)
		}
	}

	function openRemoveMadol(e, record) {
		e.preventDefault();
		setRemoveModal(true)
		if (isBrowseHistory) {
			setProductIds([record?.productId])
			return
		}
		if (isFavorites) {
			setProductIds([record?.productId])
		} else {
			setProductIds([record?.tagId])
		}
	}
	function openAllRemove() {
		setRemoveModal(true)
		setIsAllClear(true)
		if (isFavorites) {
			const items = myFavoritesList.map(item => {
				return item.productId
			})
			setProductIds(items)
		} else {
			const items = myFavoritesList.map(item => {
				return item.tagId
			})
			setProductIds(items)
		}
	}

	const tableColumn = [
		{
			title: iProductDetail,
			key: 'productDetail',
			dataIndex: 'productDetail',
			rowKey: 'productDetail',
			render: (text, record) => (
				<MinTableProductDetail record={record} otherProps={{
					showImage: true,
				}} />
			),
		},
		{
			title: iUnitPrice,
			key: 'quantity',
			dataIndex: 'quantity',
			rowKey: 'quantity',

			render: (text, record) => {
				return <div style={{ display: 'flex' }}>
					<TablePriceList pricesList={record?.pricesList} />
					{
						record?.pricesList?.length > 0 && (
							<div className='ml20'>
								<MinAddCart record={record} />
							</div>
						)
					}
					{
						(!(record?.pricesList?.length > 0)) && (
							<div className='ml20'>
								<MinTableQuote record={record} />
							</div>
						)
					}
				</div>
			}
		},
		{
			title: iAvailability,
			dataIndex: 'quantity',
			key: 'quantity',
			width: 150,
			render: (text, record) => {
				return (
					<MinTableAvailability sendTimeMap={sendTimeMap} adddressMap={adddressMap} record={record} />
				)
			},
		},
		{
			title: iDateAdded,
			key: 'createTime',
			dataIndex: 'createTime',
			rowKey: 'createTime',
			width: 120,
			render: (text, record) => (
				<span>{handleMomentTime(text)}</span>
			),
		},
		{
			title: iDelete,
			width: TABLE_COLUMN.deleteWidth,
			dataIndex: 'ExtendedPrice',
			key: 'ExtendedPrice',
			align: 'right',
			render: (text, record) => (
				<a style={{ fontSize: '16px' }} className='pub-flex-end' href="#" onClick={(e) => openRemoveMadol(e, record)}>
					<div className='sprite-icon4-cart sprite-icon4-cart-3-6'></div>
				</a>
			),
		},
	]
	const paginationChange = (pageNumber, pageSize) => {
		setPageNum(pageNumber)
		setPageSize(pageSize)
	};

	useEffect(async () => {
		getMyFavoritesList();
	}, [debouncedSearchTerm])
	useEffect(() => {
		getMyFavoritesList()
	}, [token])

	let timer = useRef();
	useEffect(() => {
		clearTimeout(timer.current);
		timer.current = setTimeout(() => {
			getMyFavoritesList();
		}, 2);

		return () => {
			clearTimeout(timer.current);
		};
	}, [token, debouncedSearchTerm, pageNum, pageSize])

	const iBrowseHistory = i18Translate('i18Home.recent', 'Browse History')
	return (

		<div className="product-table-container ps-section--account-setting" style={{ paddingBottom: '50px' }}>
			<div className="ps-section__header">
				<div className='pub-left-title'>{isBrowseHistory ? iBrowseHistory : (isFavorites ? iFavorites : iCustomerReference)}</div>
			</div>
			<div className="mb15">
				<div className='pub-flex-align-center pub-custom-input-box mb20'>
					<div className='pub-search pub-custom-box-up w260'>
						<CustomInput
							onChange={e => setPartNum(e.target.value)}
							className='form-control w260'
							onKeyPress={e => {
								if (e.key === 'Enter') {
									getMyFavoritesList()
								}
							}}
						/>
						<div className={'pub-search-icon sprite-icons-1-3 '} style={{ top: '10px' }}></div>
						<div className='pub-custom-input-holder'>{iPartNumber}</div>
					</div>
				</div>
				<Table
					loading={loading}
					columns={tableColumn}
					dataSource={myFavoritesList}
					rowKey={record => record.productId}
					size='small'
					pagination={false}
					sticky
					className='pub-border-table table-vertical-top box-shadow'
					scroll={myFavoritesList?.length > 0 ? { x: 850 } : { x: 750 }}
				/>

				{/* <MinPagination
                    total={total}
                    pageNum={pageNum}
                    pageSize={pageSize}
                    totalPages={pages}
                    isItemRender={false}
                    paginationChange={(page, pageSize) => {
                        paginationChange(page, pageSize)
                    }}
                    // onShowSizeChange={(page, pageSize) => {
                    //     onShowSizeChange(1, pageSize)
                    // }}
                /> */}
				{total > 0 && <SamplePagination
					className='mt20'
					total={total}
					pageNum={pageNum}
					pageSize={pageSize}
					pagesTotal={pages}
					isSEO={false}
					onChange={({ pageNum, pageSize }) => {
						paginationChange(pageNum, pageSize)
					}}
				/>
				}
			</div>

			{/* 提示引入弹窗组件 */}
			{
				removeModal && <MinModalTip
					isShowTipModal={removeModal}
					width={430}
					tipTitle={i18Translate('i18MyCart.REMOVE AN ITEM', "REMOVE AN ITEM")}
					tipText={i18Translate('i18MyCart.ItemRemoveTip', DEL_ONE_TEXT)}
					onCancel={() => handleRemoveCancel()}
					handleOk={() => handleRemoveOk()}
				/>
			}

		</div>

	)
}

export default connect(state => state)(FavoritesList);