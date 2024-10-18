import React, { useEffect, useState, useCallback, useRef } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Table, Row, Col, Menu } from 'antd';
import { CustomInput, Flex, RequireTip, FilterItem } from '~/components/common';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { nanoid } from 'nanoid';
import { uppercaseLetters } from '~/utilities/common-helpers';
// 列表小组件
import { MinTableImage, MinTableProductDetailRohs, MinTableAvailability, MinTableEcad } from '~/components/ecomerce/minTableCom/index';
import { TablePriceList, MinAddCart, MinTableQuote, MinAddMoreCart, MinCompareProducts } from '~/components/ecomerce/minCom'
import { SamplePagination } from '~/components/common'
import NewItemMin from '~/components/News/NewItemMin';
import TitleMore from '~/components/shared/public/titleMore';
import FloatButtons from '~/components/ecomerce/modules/FloatButtons'
import { easySerializeQuery } from '~/utilities/easy-helpers'
import { PUB_PAGINATION } from '~/utilities/constant'
import {
	PRODUCTS_NEWEST_PRODUCTS, PRODUCTS_HOT_PRODUCTS, PRODUCTS_RECOMMEND_PRODUCTS, PRODUCTS_DISCOUNT_PRODUCTS,
	BLOG, PRODUCT_HIGHLIGHTS, APPLICATION_NOTES,
} from '~/utilities/sites-url'

import useEcomerce from '~/hooks/useEcomerce';
import useI18 from '~/hooks/useI18';

/**
 * @newest - 最新产品：来源询价
 * @newsRes 新闻
 * */
const HotProducts = ({
	productsList, manufacturerListServer, totalServer, catalogResTree = [],
	newest, catalogId, newsRes, newsProduct, newsAppliedNote
}) => {
	const { iSearchPartNumber, iTableImage, iTableProductDetail, iTablePrice, iTableAvailability, iTableECADModel, iTableSelect,
		iNewestProducts, iHotProducts, iRecommendedProducts, iDiscountProducts, iNewest, iEnterPartNumber,
		iAppliedFilters, iCategoryFilters, iNewByCategory, iAllManufacturers, iResults, iBlogs, iViewMore, iProductHighlights, iApplicationNotes
	} = useI18()

	let currentUrl = PRODUCTS_NEWEST_PRODUCTS

	const Router = useRouter();
	const { query } = Router || {}
	const { manufacturerId, keyword } = query || {}

	const curUrl = Router?.pathname.split('/products/')
	let urlActive = 1
	if (curUrl[1] === 'hot-products') {
		urlActive = 2
		currentUrl = PRODUCTS_HOT_PRODUCTS
	}
	else if (curUrl[1] === 'recommend-products') {
		urlActive = 3
		currentUrl = PRODUCTS_RECOMMEND_PRODUCTS
	}
	else if (curUrl[1] === 'discount-products') {
		urlActive = 4
		currentUrl = PRODUCTS_DISCOUNT_PRODUCTS
	}

	const [loading, setLoading] = useState(true)
	const [selectedRows, setSelectedRows] = useState([])
	const [manufacturer, setManufacturer] = useState({})
	const [list, setList] = useState(productsList || []) // 列表 const [list, setList] = useState(productsList ?? [])
	const [total, setTotal] = useState(totalServer ?? 0)
	const [pages] = useState(1)
	const [pageNum, setPageNum] = useState(Router?.query?.pageNum || PUB_PAGINATION?.pageNum)
	const [pageSize, setPageSize] = useState(Router?.query?.pageSize || PUB_PAGINATION?.pageSize)
	const [isInvalid, setIsInvalid] = useState(false); // 无效输入
	const [withinName, setWithinName] = useState("");
	const [withinResults, setWithinResults] = useState([]); // 添加的withinResults, 当前选中的条件
	const [curCatalog, setCurCatalog] = useState({}); // 当前选中的分类
	const [isInitialRender, setIsInitialRender] = useState(true); // 是否阻止useEffect依赖条件 Router跳转
	const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选中的行key集合
	const { sendTimeMap, adddressMap } = useEcomerce();
	const [flag, setFlag] = useState(false)

	const stickyRef = useRef(null);
	const contRef = useRef(null)
	const filterRef = useRef(null);

	const checkSticky = () => {
		const div = stickyRef.current;
		if (div) {
			const rect = stickyRef.current.getBoundingClientRect();
			if (rect.top > 0) {
				let hh = 80 - (rect.top - 80)
				const fHeight = filterRef.current?.offsetHeight || 0
				if (fHeight > 0) {
					hh = hh - fHeight - 10
				}

				if (isInvalid) {
					hh = hh - 44
				}

				if (contRef.current) {
					contRef.current.style.maxHeight = `calc(62.5vh + ${hh}px)`
				}
			}
		}
	};

	useEffect(() => {
		// 监听浏览器滚动事件
		window.addEventListener('scroll', checkSticky);
		// 组件卸载前移除监听
		return () => window.removeEventListener('scroll', checkSticky);
	}, []);

	useEffect(() => {
		checkSticky()
	}, [withinResults, manufacturer, curCatalog])


	// 产品列表更新执行的操作
	useEffect(async () => {
		setLoading(false)
		setList(productsList)
		setTotal(totalServer)
	}, [productsList])

	// / 递归调用查找子对象
	const findDataById = (data, id) => {
		for (let i = 0; i < data.length; i++) {
			if (data[i].id == id) {
				return data[i];
			} else if (data[i].voList.length > 0) {
				const result = findDataById(data[i].voList, id); // 递归调用查找子对象
				if (result) {
					return result;
				}
			}
		}
		return null; // 未找到匹配的数据
	}

	useEffect(() => {
		return () => {
			// 初始化，不重复router
			setIsInitialRender(true)
		}
	}, [curUrl[1]])

	useEffect(() => {
		setCurCatalog(findDataById(catalogResTree, catalogId))
		setSelectedRowKeys([])
		setSelectedRows([])
	}, [catalogId])

	useEffect(() => {
		const finItem = manufacturerListServer?.find(item => item?.manufacturerId === Number(manufacturerId))
		setManufacturer(finItem || {}) // 选中供应商
		setWithinResults(keyword?.split('____') || []) // 搜索关键词
	}, [manufacturerId, keyword])

	// 提交搜索词
	const handleAddWithin = async (e) => {
		e.preventDefault();
		if (!withinName || withinName.length < 3) {
			setIsInvalid(true)
			return
		}
		setWithinName('')
		setWithinResults([...withinResults, withinName]);
		setIsInitialRender(false)
		// 初始化页码
		setPageNum(PUB_PAGINATION?.pageNum)
		setPageSize(PUB_PAGINATION?.pageSize)
	}

	const closeWithinResults = index => {
		setWithinResults(prev => prev.filter((_, i) => i !== index));
		setIsInitialRender(false)
	}

	const tabArr = [
		{ name: iNewestProducts, url: PRODUCTS_NEWEST_PRODUCTS },
		{ name: iHotProducts, url: PRODUCTS_HOT_PRODUCTS },
		{ name: iRecommendedProducts, url: PRODUCTS_RECOMMEND_PRODUCTS },
		{ name: iDiscountProducts, url: PRODUCTS_DISCOUNT_PRODUCTS },
	]

	// 获取跳转的链接参数  useCallback , [manufacturer, withinResults, curCatalog])
	const handAllRouter = useCallback(params => {
		const obj = {
			catalogId: curCatalog?.catalogId || catalogId || catalogId || null,
			manufacturerId: manufacturer?.manufacturerId || null,
			keyword: withinResults?.join(',') || null,
			...params,
		}
		return easySerializeQuery(obj) ? `${currentUrl}?${easySerializeQuery(obj)}` : currentUrl
	}, [manufacturer, withinResults, curCatalog])

	function getItem(label, key, icon, children, type) {
		return {
			key,
			icon,
			children,
			label,
			type,
		};
	}

	const getChildItem = voList => {
		if (voList?.length === 0) return
		return voList?.map(item => {
			const { id, name, voList } = item
			return getItem(
				<Link
					href={handAllRouter({
						catalogId: id,
					})}
				>
					<a className='pub-flex menu-label percentW100'>{name}</a>
				</Link>,
				id, null, getChildItem(voList))
		})
	}

	const textItem = catalogResTree?.map(item => {
		const { id, name, voList } = item
		return getItem(
			<Link href={handAllRouter({ catalogId: id })}
			>
				<a className='menu-label pub-flex-align-center pt-0 pb-0' style={{ marginLeft: '-16px', height: '100%', }}>
					{name?.slice(0, 40)}
				</a>
			</Link>,
			id, null, getChildItem(voList))
	})


	//   最新产品分类 "pub-menu
	const leftFirstLevelCategories1 = () => {
		return <Menu
			mode="vertical"
			items={textItem}
			subMenuOpenDelay={0.25}
		/>
	}

	const closeCatalog = () => {
		setCurCatalog({})
		Router.push(handAllRouter({
			catalogId: null,
		}))
	}

	// 选中分类
	const handleManufacturerChange = item => {
		setManufacturer(item)
	}

	// 左侧供应商
	const leftFirstLevelCategories = manufacturerListServer?.map((item, index) => (
		<li
			key={index}
			className={'menu-item-has-children ' + (manufacturer?.manufacturerId == item?.manufacturerId ? 'pub-left-active' : '')}
			onClick={() => handleManufacturerChange(item)}
		>
			<Link href={handAllRouter({ manufacturerId: item?.manufacturerId, })}>
				<a>{item.name}</a>
			</Link>
		</li>
	))

	const rowSelection = {
		columnTitle: <div>{iTableSelect}</div>,
		columnWidth: '60px', // 设置行选择列的宽度为
		selectedRowKeys, // 选中的key集合
		fixed: true,
		onChange: (_selectedRowKeys, selectedRow) => {
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

	// 表格行数据变化
	const rowKeysChange = (_selectedRowKeysArr, record, quantity) => {
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
		// 有数量就添加(并且去重)，没数量就删掉
		if (quantity) {
			const uniqueArr = [...new Set([...selectedRowKeys, record?.productId])];
			setSelectedRowKeys(uniqueArr)
			rowKeysChange(uniqueArr, record, quantity)
		} else {
			// 输入框没有数量了，就清除
			const arr = selectedRowKeys?.filter(i => i !== record?.productId)
			setSelectedRowKeys(arr)
			rowKeysChange(arr, record, quantity)
		}
	}

	// table 列
	const columns = [
		{
			title: iTableImage,
			width: 85,
			dataIndex: 'image',
			key: 'image',
			render: (_url, record) =>
				<MinTableImage record={record} />
		},
		{
			title: iTableProductDetail,
			dataIndex: 'productNo',
			key: 'productNo',
			width: 324,
			render: (_text, record) => (
				<MinTableProductDetailRohs record={record} />
			)
		},
		{
			title: iTablePrice,
			dataIndex: 'prices',
			key: 'prices',
			width: 280,
			render: (_text, record) => {
				const _quote = !(record?.pricesList?.length > 0)
				record.isQuote = _quote
				return <div style={{ display: 'flex' }}>
					{/* quantity={record?.quantity} */}
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
								<MinTableQuote record={record} quantityChange={quantityChange} />
							</div>
						)
					}
				</div>
			}
		},
		{
			title: iTableAvailability,
			dataIndex: 'Availability',
			key: 'Availability',
			width: 180,
			render: (_text, record) => {
				return (
					<MinTableAvailability record={record} />
				)
			},
		},
		{
			title: iTableECADModel,
			dataIndex: 'ECAD',
			key: 'ECAD',
			width: 190,
			render: (_text, record) => {
				return (
					<MinTableEcad record={record} />
				)
			}
		},
	]

	// 导航切换
	const handleActive = (e, index) => {
		if (index === urlActive) {
			e.preventDefault();
			return
		}
		if (index === 1) {
			Router.push(PRODUCTS_NEWEST_PRODUCTS + `?pageNum=1&pageSize=20`)
		}
		if (index === 2) {
			Router.push(PRODUCTS_HOT_PRODUCTS + `?pageNum=1&pageSize=20`)
		}
		if (index === 3) {
			Router.push(PRODUCTS_RECOMMEND_PRODUCTS + `?pageNum=1&pageSize=20`)
		}
		if (index === 4) {
			Router.push(PRODUCTS_DISCOUNT_PRODUCTS + `?pageNum=1&pageSize=20`)
		}
	}

	// 页码切换
	const paginationChange = (pageNumber, pageSize) => {
		setSelectedRows([])
		setPageNum(pageNumber)
		setPageSize(pageSize)
	};

	useEffect(async () => {
		if (isInitialRender) {
			return
		}
		Router.push(handAllRouter())
		setIsInitialRender(true)
	}, [withinResults, manufacturer])

	useEffect(() => {

		const header = document.getElementById('headerSticky');

		if (header) {
			header?.classList.add('header-sticky-shadow');
		}
	}, []);

	// 新闻，blog等
	const newsContent = newsList => {
		if (!newsList || newsList?.length === 0) return null
		return <Row gutter={[20, 20]} className='pub-flex-wrap pt-25'>
			{newsList?.slice(0, 9)?.map(item => {
				return (
					<Col xs={24} sm={12} md={12} xl={8} lg={8} key={item?.id}
						className='pub-flex' style={{ alignItems: 'stretch' }}
					>
						<NewItemMin item={item} />
					</Col>
				)
			})}
		</Row>
	}

	// 除分页外其它参数，传给分页组件
	const getOtherUrlParams = params => {
		const obj = {
			catalogId: curCatalog?.catalogId || catalogId || catalogId || null,
			manufacturerId: manufacturer?.manufacturerId || null,
			keyword: withinResults?.join(',') || null,
			...params,
		}

		return easySerializeQuery(obj)
	}

	return (
		<div className='product-table-container custom-antd-btn-more pub-bgcdf5 pb-80'>
			{/* tabs */}
			<div className='pub-top-tabs'>
				<div className='ps-container'>
					<div className='ps-tab-cart'>
						<div className='ps-tab-root'>
							{
								tabArr.map((item, index) => {
									return urlActive == (index + 1) ? <h1
										key={nanoid()}
										className={'pl-0 pr-0 ps-tab-root-item ' + (urlActive == (index + 1) ? 'ps-tab-active' : '')}
										onClick={(e) => handleActive(e, index + 1)}
									>
										<Link href={`${item?.url}?pageNum=1&pageSize=20`}>
											<a className='pub-fontw'>{item.name}</a>
										</Link>
									</h1> :
										<h2
											key={nanoid()}
											className={'pl-0 pr-0 ps-tab-root-item ' + (urlActive == (index + 1) ? 'ps-tab-active' : '')}
											onClick={(e) => handleActive(e, index + 1)}
										>
											<Link href={`${item?.url}?pageNum=1&pageSize=20`}>
												<a className='pub-fontw'>{item.name}</a>
											</Link>
										</h2>
								})
							}
						</div>
					</div>
				</div>
			</div>

			<div className='ps-container mt30'>
				<div className='pub-flex hot-recommend-discount-wrapper'>
					<div className='pub-left-nav catalogs__top-fixed' ref={stickyRef}>
						{/* 搜索框 */}
						<div className=''>
							<div className='pub-font16 pub-fontw'>{iSearchPartNumber}</div>
							<div className='mt5 pub-search w300 pr-0'>
								<form
									onSubmit={(e) => handleAddWithin(e)}
								>
									<CustomInput
										onChange={(e) => (setWithinName(uppercaseLetters(e.target.value)), setIsInvalid(false))}
										className='form-control pub-search-input w300'
										value={withinName}
										placeholder={iEnterPartNumber}
									/>
									<i onClick={e => handleAddWithin(e)} className={'pub-search-icon sprite-icons-1-3'} />
									{
										isInvalid && (
											<RequireTip className='mt6' isAbsolute={false} style={{ height: '38px' }} textStyle={{ whiteSpace: 'break-spaces' }} />
										)
									}
								</form>
							</div>
						</div>

						<div ref={filterRef}>
							{/* 条件集合 */}
							{(withinResults?.length > 0 || manufacturer?.name) && (
								<div className='applied-filters pub-flex-align-center mt10'>
									<div className='pub-fontw pub-font14 mb3'>
										{iAppliedFilters}:</div>

									{
										manufacturer?.name && (
											<FilterItem text={manufacturer?.name} onClick={() => (setManufacturer({}), setIsInitialRender(false))} isAbbreviation length={100} />
										)
									}
									{
										withinResults?.map((item, index) => (
											<FilterItem text={item} key={index} onClick={() => closeWithinResults(index)} />
										))
									}
								</div>
							)}

							{/* 选中的分类 */}
							{
								curCatalog?.id && (
									<div className='applied-filters pub-flex-align-center mt10'>
										<div className='pub-fontw pub-font14 mb3 mr10'>{iCategoryFilters}:</div>
										<FilterItem text={curCatalog?.name} onClick={() => closeCatalog()} className='ml0 mr10' />
									</div>
								)
							}
						</div>

						<div className='ps-block--menu-categories mt20'>
							<div className="ps-block__header">
								<h3>{newest ? iNewByCategory : iAllManufacturers}</h3>
							</div>
							{/* style={{ maxHeight: `calc(62.5vh + ${h}px)`, overflow: "auto" }} */}
							<div ref={contRef} className="ps-block__content" style={{ maxHeight: '62.5vh', overflow: "auto" }}>
								<ul className="pub-menu-cata">
									{newest && leftFirstLevelCategories1()}
									{!newest && leftFirstLevelCategories}
								</ul>
							</div>
						</div>
					</div>

					<div id="rightCatalogs" className='rightCatalogs__float ml20'>
						<div className='mb10 pub-flex-align-center'>
							<div className='pub-flex-align-center mr20'>
								<div className='pub-color555 pub-font14 pub-fontw'>
									{iResults}: </div>
								<div className='pub-font18 pub-fontw ml10'>{total}</div>
							</div>
						</div>

						<Table
							columns={columns}
							rowSelection={{
								...rowSelection,
							}}
							dataSource={list}
							size="small"
							bordered
							sticky
							virtual
							pagination={false}
							rowKey={record => record.productId}
							className="pub-bordered table-vertical-top box-shadow"
							style={{ borderRadius: '6px' }}
							scroll={list?.length > 0 ? { x: 1100 } : null}
						/>

						<Flex justifyBetween className='mt20' height={32}>
							<FloatButtons isShow={selectedRows?.length > 0} onCallBack={(flag) => { setFlag(flag) }}>
								{selectedRows.length !== 0 && <div className='pruducts-float-btn'>
									{flag && <div className='pro-more-cart' />}
									<Flex gap={20}>
										<MinAddMoreCart selectedRows={selectedRows} />
										{curCatalog?.id && selectedRows?.length > 1 && <MinCompareProducts productList={selectedRows} />}
									</Flex>
								</div>}
							</FloatButtons>

							{
								pageNum && (
									<SamplePagination
										pageNum={Number(pageNum)}
										total={Number(total)}
										pageSize={Number(pageSize)}
										totalPages={pages}
										currentUrl={currentUrl}
										otherUrlParams={getOtherUrlParams()}
										onChange={({ pageNum, pageSize }) => paginationChange(pageNum, pageSize)}
									/>
								)
							}
						</Flex>
					</div>
				</div>

				{
					newsRes?.length > 0 && (
						<div className='mt60'>
							<TitleMore
								title={iNewest + iBlogs}
								subTitle={iViewMore}
								linkUrl={BLOG}
							/>
						</div>
					)
				}

				{newsContent(newsRes)}

				{
					newsProduct?.length > 0 && (
						<div className='mt60'>
							<TitleMore
								title={iNewest + iProductHighlights}
								subTitle={iViewMore}
								linkUrl={PRODUCT_HIGHLIGHTS}
							/>
						</div>)
				}

				{newsContent(newsProduct)}

				{
					newsAppliedNote?.length > 0 && (
						<div className='mt60'>
							<TitleMore
								title={iNewest + iApplicationNotes}
								subTitle={iViewMore}
								linkUrl={APPLICATION_NOTES}
							/>
						</div>
					)}

				{newsContent(newsAppliedNote)}
			</div>
		</div>
	)
}

export default connect((state) => state)(withCookies(HotProducts));