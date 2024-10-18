import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Table } from 'antd';
import ProductRepository from '~/repositories/ProductRepository';
import useEcomerce from '~/hooks/useEcomerce';
import useLanguage from '~/hooks/useLanguage';
import { scrollToTop, handleMomentTime } from '~/utilities/common-helpers';
import { TABLE_COLUMN, PUB_PAGINATION, DEL_ONE_TEXT, DEL_ALL_TEXT } from '~/utilities/constant';
import { MinTablePrice, MinTableAvailability, MinTableEcad, MinTableProductDetail } from '~/components/ecomerce/minTableCom/index';
import MinAddMoreCart from '~/components/ecomerce/minCom/MinAddMoreCart'
import { Flex, SamplePagination, ManufacturerNav } from '~/components/common'
import MinModalTip from '~/components/ecomerce/minCom/MinModalTip' // 公共提示
import FloatButtons from '~/components/ecomerce/modules/FloatButtons'

// 购物车页面的收藏 
const MyFavorites = ({ curActive, getTotal }) => {
	const { i18Translate, getLanguageEmpty } = useLanguage();
	const iMyFavorites = i18Translate('i18MyCart.My Favorites', "My Favorites")
	const iMyReferenc = i18Translate('i18MyCart.My Referenc', "My Referenc")
	const iImage = i18Translate('i18PubliceTable.Image', 'Image')
	const iProductDetail = i18Translate('i18PubliceTable.Product Detail', TABLE_COLUMN.productDetail)
	const iPrice = i18Translate('i18PubliceTable.Price', 'Price')
	const iAvailability = i18Translate('i18PubliceTable.Availability', 'Availability')
	const iEcadModel = i18Translate('i18PubliceTable.ECAD Model', 'ECAD Model')
	const iDateAdded = i18Translate('i18PubliceTable.DateAdded', TABLE_COLUMN.DateAdded)
	const iDelete = i18Translate('i18PubliceTable.Delete', TABLE_COLUMN.delete)

	const isFavorites = Boolean(curActive === 'my-favorites')
	const isFavOrRef = curActive === 'my-favorites' || curActive === 'customer-reference'

	const [loading, setLoading] = useState(false)
	const [total, setTotal] = useState(0)
	const [pages, setPages] = useState(1)
	const [pageNum, setPageNum] = useState(PUB_PAGINATION?.pageNum)
	const [pageSize, setPageSize] = useState(PUB_PAGINATION?.pageSize)
	const [favoritesTotal, setFavoritesTotal] = useState(0) // 收藏总数
	const [myFavoritesList, setmyFavoritesList] = useState([]) // 列表数据
	const [selectedRows, setSelectedRows] = useState([]);
	const [productIds, setProductIds] = useState([])
	const [removeModal, setRemoveModal] = useState(false)
	const [isAllClear, setIsAllClear] = useState(false)
	const [cookies] = useCookies(['cart']);
	const { account } = cookies || {};
	const { sendTimeMap, adddressMap } = useEcomerce();

	const [manufacturerFilters, setManufacturerFilters] = useState({})

	const handleList = res => {
		setLoading(false)
		if (res?.code === 0) {
			const { data, total, pages } = res?.data
			setTotal(total)
			setPages(pages)
			setmyFavoritesList(data)
			scrollToTop()
		}
	}

	// 获取收藏列表或者打标签列表
	const getMyFavoritesList = async (param) => {
		setLoading(true)
		const params = {
			pageSize: param?.pageSize || PUB_PAGINATION.pageSize,
			pageNum: param?.pageNum || PUB_PAGINATION.pageNum,
			partNum: '',
		}

		if (!!manufacturerFilters?.manufacturerId) {
			params.manufacturerId = manufacturerFilters?.manufacturerId
		}

		if (manufacturerFilters?.keywordList?.length > 0) {
			params.keywordList = manufacturerFilters?.keywordList
		}

		if (isFavorites) {
			const res = await ProductRepository.myFavoritesList(params, account?.token);
			handleList(res)
			if (res?.code === 0) {
				setFavoritesTotal(res?.data?.total)
			}
		} else {
			const res = await ProductRepository.getProductTagList(params, account?.token);
			handleList(res)
		}
	}

	const paginationChange = (pageNumber, pageSize) => {
		getMyFavoritesList({
			pageNum: pageNumber,
			pageSize: pageSize,
		})
		setPageNum(pageNumber)
		setPageSize(pageSize)
	};

	useEffect(() => {
		if (account?.token && isFavOrRef) {
			getMyFavoritesList()
			setSelectedRows([])
		}
	}, [curActive, account?.token, manufacturerFilters])
	useEffect(() => {
		if (account?.token) {
			getTot()
		}
	}, [account?.token])

	// 获取收藏数量
	const getTot = async () => {
		if (curActive !== 'my-favorites') {
			const params = {
				pageSize: PUB_PAGINATION.pageSize,
				pageNum: 1,
			}
			const res = await ProductRepository.myFavoritesList(params, account?.token);
			if (res?.code === 0) {
				setFavoritesTotal(res?.data?.total)
			}
		}
	}

	useEffect(() => {
		if (getTotal) {
			getTotal(favoritesTotal)// 回调给父组件
		}
	}, [favoritesTotal])

	// 单个删除
	function openRemoveMadol(e, record) {
		e.preventDefault();
		setRemoveModal(true)
		if (isFavorites) {
			setProductIds([record?.productId])
		} else {
			setProductIds([record?.tagId])
		}
	}

	function handleRemoveCancel() {
		setRemoveModal(false)
		setProductIds([])
		setIsAllClear(false)
	}

	const handleSucDel = res => {
		if (res && res.code == 0) {
			getMyFavoritesList()
			handleRemoveCancel()
		}
	}

	async function handleRemoveOk() {
		if (isFavorites) {
			const res = await ProductRepository.myFavoritesDel(productIds);
			handleSucDel(res)
		} else {
			const res = await ProductRepository.delProductTag(productIds);
			handleSucDel(res)
		}
	}

	const rowSelection = {
		onChange: (_selectedRowKeys, selectedRows) => {
			const params = selectedRows?.map(i => {
				return {
					...i,
					customQuantity: 1,
				}
			})
			setSelectedRows(params)
		},
		getCheckboxProps: (record) => ({
			disabled: !(record?.pricesList?.length > 0),
		}),
	};

	// 表格列
	const columns = [
		{
			title: iImage,
			width: 85,
			dataIndex: 'image',
			key: 'image',
			render: (_url, record) =>
				<img
					className='pub-img'
					src={`${record.image || getLanguageEmpty()}`}
					alt={record.name}
					title={record.name}
				/>,
		},
		{
			title: iProductDetail,
			dataIndex: 'productNo',
			key: 'productNo',
			render: (_text, record) => (
				<MinTableProductDetail customerClass='mt5' record={record} otherProps={{
					showImage: false,
					showDatasheetRohs: true,
				}} />
			),
		},
		{
			title: iPrice,
			dataIndex: 'prices',
			key: 'prices',
			width: 270,
			render: (_text, record) => <MinTablePrice record={record} />,
		},
		{
			title: iAvailability,
			dataIndex: 'Availability',
			key: 'Availability',
			width: 180,
			render: (_text, record) => {
				return (
					<MinTableAvailability sendTimeMap={sendTimeMap} adddressMap={adddressMap} record={record} />
				)
			},
		},
		{
			title: iEcadModel,
			dataIndex: 'ECAD',
			key: 'ECAD',
			width: 180,
			render: (_text, record) => {
				return (
					<MinTableEcad record={record} />
				)
			}
		},
		{
			title: iDateAdded,
			dataIndex: 'createTime',
			key: 'createTime',
			width: 90,
			render: (text) => {
				return (
					<div>{handleMomentTime(text)}</div>
				)
			}
		},
		{

			title: iDelete,
			width: TABLE_COLUMN.deleteWidth,
			dataIndex: 'ExtendedPrice',
			key: 'ExtendedPrice',
			align: 'center',
			width: 60,
			render: (_text, record) => (
				<>
					<a style={{ fontSize: '16px', display: 'flex', justifyContent: 'center' }} href="#" onClick={(e) => openRemoveMadol(e, record)}>
						<div className='sprite-icon4-cart sprite-icon4-cart-3-6'></div>
					</a>

				</>
			),
		},
	]

	// 供应商过滤条件
	const handleManufacturerSearch = (value) => {
		setManufacturerFilters(value)
	}

	if (!isFavOrRef) return null

	return (
		<div className='product-table-container pb60'>
			<div className='mb3 pub-top-label'>
				<div className='pub-top-label-left'>
					<div className={'sprite-icon4-cart ' + (isFavorites ? 'sprite-icon4-cart-2-5-min' : 'sprite-icon4-cart-3-5')}></div>
					<div className='pub-top-label-left-name ml10'>
						{isFavorites ? iMyFavorites : iMyReferenc}:
						<div className='spare-items ml10 pub-fontw'>
							<span className='pub-fontw'>{total} </span>
							{i18Translate('i18SmallText.Items', "Item(s)")}</div>
					</div>
				</div>
			</div>
			<Flex gap={20}>
				<ManufacturerNav onSearch={handleManufacturerSearch} factType={isFavorites ? 4 : 5} />
				<Flex column style={{ marginTop: '5px' }}>
					<Table
						key={isFavorites}
						columns={columns}
						rowSelection={{
							...rowSelection,
						}}
						dataSource={myFavoritesList}
						loading={loading}
						size="small"
						bordered
						sticky
						scrollToFirstRowOnChange={true}
						pagination={false}
						rowKey={record => record.productId}
						className="pub-bordered table-vertical-top box-shadow"
						style={{ borderRadius: '6px' }}
					/>

					<div className='pub-flex-between mt20'>
						<FloatButtons isShow={selectedRows?.length > 0}>
							<MinAddMoreCart selectedRows={selectedRows} propDisabled={selectedRows?.length === 0} />
						</FloatButtons>

						<SamplePagination
							className='mt0'
							total={total}
							pageNum={pageNum}
							pageSize={pageSize}
							pagesTotal={pages}
							isSEO={false}
							onChange={({ pageNum, pageSize }) => {
								paginationChange(pageNum, pageSize)
							}}
						/>
					</div>
				</Flex>
			</Flex>

			{/* 提示引入弹窗组件 */}
			{
				removeModal && <MinModalTip
					isShowTipModal={removeModal}
					width={420}
					tipTitle={isAllClear ? i18Translate('i18MyCart.REMOVE ALL ITEMS', "REMOVE ALL ITEMS") : i18Translate('i18MyCart.REMOVE AN ITEM', "REMOVE AN ITEM")}
					tipText={
						isAllClear ? i18Translate('i18MyCart.RemoveAllTip', DEL_ALL_TEXT) :
							i18Translate('i18MyCart.ItemRemoveTip', DEL_ONE_TEXT)
					}
					onCancel={() => handleRemoveCancel()}
					handleOk={() => handleRemoveOk()}
				/>
			}
		</div>
	)
}

export default MyFavorites