import { useEffect, useState, useCallback } from 'react';
import { Table } from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import { Flex, CustomInput, RequireTip, SamplePagination, FilterItem } from '~/components/common';
import { changeServerSideLanguage, easySerializeQuery, getLocale } from '~/utilities/easy-helpers';

import dynamic from 'next/dynamic';
const BreadCrumb = dynamic(() => import('~/components/elements/BreadCrumb'));
const PageContainer = dynamic(() => import('~/components/layouts/PageContainer'));

import FloatButtons from '~/components/ecomerce/modules/FloatButtons';
import { useRouter } from 'next/router';
import { PUB_PAGINATION } from '~/utilities/constant';
import filter from 'lodash/filter'
import { PRODUCTS, PRODUCTS_UNCLASSIFIED } from '~/utilities/sites-url'
import { MinTableImage, MinTableProductDetailRohs, MinTableAvailability, MinTableEcad } from '~/components/ecomerce/minTableCom/index';
import { TablePriceList, MinAddCart, MinTableQuote, MinAddMoreCart, } from '~/components/ecomerce/minCom'
import ProductRepository from '~/repositories/ProductRepository';
import ProductAllRepository from '~/repositories/zqx/ProductRepository';
import MinAddToRFQ from '~/components/ecomerce/minCom/MinAddToRFQ'
import { uppercaseLetters } from '~/utilities/common-helpers'

import useLanguage from '~/hooks/useLanguage';
import useEcomerce from '~/hooks/useEcomerce';
import useI18 from '~/hooks/useI18';

/**
 *@未分类产品
 */
const Unclassified = ({ paramMap, productsList, manufacturerList, manufacturerId, curKeyword, totalServer }) => {
	const Router = useRouter();
	const { iUnclassified, iSearchPartNumber, iHome, iProductIndex, iTableSelect,
		iTableImage, iTableProductDetail, iTablePrice, iTableAvailability, iTableECADModel,
		iEnterPartNumber, iManufacturers, iAppliedFilters, iResults,
	} = useI18()
	const { i18Translate } = useLanguage();
	const i18UnclassifiedTitle = i18Translate('i18Seo.Unclassified.title', 'Unclassified');
	const i18UnclassifiedKey = i18Translate('i18Seo.Unclassified.keywords', 'Unclassified');
	const i18UnclassifiedDes = i18Translate('i18Seo.Unclassified.description', 'Unclassified');
	console.log(manufacturerList, 'manufacturerList---del')

	const [withinName, setWithinName] = useState(''); // 输入内容
	const [withinResults, setWithinResults] = useState([]); // 添加的withinResults, 当前选中的条件
	const [isInvalid, setIsInvalid] = useState(false); // 无效输入
	const [isInitialRender, setIsInitialRender] = useState(true); // 是否阻止useEffect依赖条件 Router跳转

	const [pageNum, setPageNum] = useState(Router?.query?.pageNum || PUB_PAGINATION?.pageNum)
	const [pageSize, setPageSize] = useState(Router?.query?.pageSize || PUB_PAGINATION?.pageSize)
	const [list, setList] = useState([]) // 列表
	const [total, setTotal] = useState(totalServer ?? 0)
	const [selectedRows, setSelectedRows] = useState([])
	const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选中的行key集合

	const [manufacturerArr, setManufacturerArr] = useState([])
	const [flag, setFlag] = useState(false)
	const { sendTimeMap, adddressMap } = useEcomerce();

	let currentUrl = PRODUCTS_UNCLASSIFIED

	useEffect(() => {
		setWithinResults([...new Set([...withinResults, ...curKeyword])])
	}, [curKeyword])
	useEffect(() => {

		setManufacturerArr(manufacturerList.filter(i => i.isSelect))
		// Router?.query?.manufacturerId
	}, [Router?.query?.manufacturerId])
	useEffect(() => {
		setList(productsList)
		setTotal(totalServer)
	}, [productsList])

	useEffect(() => {
		if (isInitialRender) {
			return
		}

		Router.push(handAllRouter())
		setIsInitialRender(true)
	}, [withinResults, manufacturerArr])
	// 测试接口
	// useEffect(async () => {
	// 	ProductRepository.getUncategorizedManufacturerList('en') // 供应商
	// 	const filterServerParams = {
	// 		keyword: '',
	// 		keywordList: [],
	// 		catalogKeyword: 844,
	// 		manufacturerKeyword: '',
	// 		pageListNum: PUB_PAGINATION?.pageNum,
	// 		pageListSize: PUB_PAGINATION?.pageSize,
	// 		languageType: 'en',
	// 	}
	// 	ProductAllRepository.getProducts(filterServerParams) // 获取未分类下的产品列表
	// }, [])
	// 重置PageNum 和 PageSize
	const resetPageParam = () => {
		setPageNum(PUB_PAGINATION?.pageNum);
		setPageSize(PUB_PAGINATION?.pageSize);
	}

	// 获取跳转的链接参数 20659        10194 + 21   manufacturerId
	const handAllRouter = useCallback(params => {
		let arr = [...manufacturerArr]
		if (params?.manufacturerId) {
			arr.push(params)
		}
		const obj = {
			keyword: withinResults?.join(',') || null,
			manufacturerId: arr?.length > 0 ? arr?.map(item => item?.manufacturerId).join(',') : null,  // 无限种供应商id组合
			// manufacturerId: manufacturerArr?.length > 0 ? manufacturerArr?.[0]?.manufacturerId : null,
			// ...params,
		}

		return easySerializeQuery(obj) ? `${currentUrl}?${easySerializeQuery(obj)}` : currentUrl
	}, [manufacturerArr, withinResults])

	// 面包屑
	const breadcrumb = [
		{
			text: iHome,
			url: '/',
		},
		{
			text: iProductIndex,
			url: PRODUCTS,
		},
		{
			text: iUnclassified,
		},
	];

	// 表格列
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
					<MinTableAvailability sendTimeMap={sendTimeMap} adddressMap={adddressMap} record={record} />
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

	// 选中行
	const rowSelection = {
		columnTitle: <div>{iTableSelect}</div>,
		columnWidth: '60px', // 设置行选择列的宽度为
		selectedRowKeys, // 选中的key集合
		onChange: (_Keys, selectedRow) => {
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

	// 提交搜索词
	const handleAddWithin = async (e) => {
		e.preventDefault();
		if (!withinName || withinName.length < 3) {
			setIsInvalid(true);
			return;
		}

		setWithinName('');
		setWithinResults([...new Set([...withinResults, withinName])])
		setIsInitialRender(false);
		// 初始化页码
		resetPageParam()
	};

	// 删除搜索关键词
	const closeWithinResults = (index) => {
		setWithinResults((prev) => prev.filter((_, i) => i !== index));
		setIsInitialRender(false);
	};

	// 选中供应商
	const handleManufacturerChange = item => {
		setManufacturerArr([...manufacturerArr, item])
		// 初始化页码
		resetPageParam()
	}
	// 关闭供应商 20659      10194 + 21
	const clostManu = item => {
		console.log(manufacturerArr, 'manufacturerArr---del')
		const arr = manufacturerArr?.filter(i => i?.manufacturerId !== item?.manufacturerId)
		console.log(arr, 'arr---del')
		setManufacturerArr(arr)
	}

	// 左侧供应商
	const ManufacturerRender = () => {
		return manufacturerList?.map((item, index) => (
			<li
				key={index}
				className={'menu-item-has-children ' + (item?.isSelect === 1 ? 'pub-left-active' : '')}
			// onClick={() => handleManufacturerChange(item)}
			>
				<Link href={handAllRouter({ manufacturerId: item?.manufacturerId, })}>
					<a>{item.name}</a>
				</Link>
			</li>
		))
	}

	// 除分页外其它参数，传给分页组件
	const getOtherUrlParams = params => {
		const obj = {
			manufacturerId: manufacturerArr?.length > 0 ? manufacturerArr?.map(item => item?.manufacturerId).join(',') : null,
			// manufacturerId: manufacturerArr?.length > 0 ? manufacturerArr?.join(',') : null,
			keyword: withinResults?.join(',') || null,
			...params,
		}

		return easySerializeQuery(obj)
	}

	// 表格行数据变化
	const rowKeysChange = (_Arr, record, quantity) => {
		const curItemIndex = selectedRows.findIndex(item => item?.productId === record?.productId);
		if (curItemIndex !== -1) {
			if (!!quantity) {
				const updatedRows = [...selectedRows];
				updatedRows[curItemIndex] = { ...selectedRows[curItemIndex], cartQuantity: quantity };
				setSelectedRows(updatedRows.filter(item => item.cartQuantity > 0));
			} else {
				setSelectedRows(selectedRows.filter(item => item?.productId !== record?.productId));
			}
		} else {
			if (!record?.isQuote && !!quantity) {
				setSelectedRows([...selectedRows, { ...record, cartQuantity: quantity || 1 }]);
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

	// 页码选中
	const paginationChange = (pageNumber, pageSize) => {
		setSelectedRows([])	// 清空表格选中的数据
		setPageNum(pageNumber)
		setPageSize(pageSize)
	};

	const getName = (str = ', ') => {
		const arr = manufacturerList.filter(i => i.isSelect)?.map(i => i?.name)
		const finItem = manufacturerList?.find(item => item?.manufacturerId === Number(manufacturerId))
		return arr?.length > 0 ? (arr?.join(str) + str) : ''
	}

	// 添加到购物车数据
	const addList = filter(selectedRows || [], sr => !sr.isQuote)
	// 添加到询价单数据
	const quoteList = filter(selectedRows || [], sr => sr.isQuote)
	console.log(manufacturerArr, 'manufacturerArr---del')
	return (
		<PageContainer paramMap={paramMap}>
			<Head>
				<title>{getName(" & ") + i18UnclassifiedTitle}</title>
				<meta property="og:title" content={getName() + i18UnclassifiedTitle} key="og:title" />
				<meta name="keywords" content={getName() + i18UnclassifiedKey} key="keywords" />
				<meta name="description" content={getName() + i18UnclassifiedDes} key="description" />
				<meta name="og:description" content={getName() + i18UnclassifiedDes} key="og:description" />
			</Head>

			<div className="product-table-container custom-antd-btn-more pub-bgcdf5 pb-80">
				<div className="ps-container">
					<BreadCrumb breacrumb={breadcrumb} />

					<h1 className="mt20 mb15 pub-font24">{iUnclassified}</h1>

					<Flex className="hot-recommend-discount-wrapper">
						<Flex className="pub-left-nav catalogs__top-fixed">
							<Flex column>
								<div className="pub-font16 pub-fontw">{iSearchPartNumber}</div>
								<div className="mt5 pub-search w300 pr-0">
									<form onSubmit={(e) => handleAddWithin(e)}>
										<CustomInput
											onChange={(e) => (setWithinName(uppercaseLetters(e.target.value)), setIsInvalid(false))}
											className="form-control pub-search-input w300"
											value={withinName}
											placeholder={iEnterPartNumber}
										/>
										<div onClick={(e) => handleAddWithin(e)} className={'pub-search-icon sprite-icons-1-3 '}></div>

										{isInvalid && <RequireTip className="mt6" isAbsolute={false} style={{ height: '38px' }} textStyle={{ whiteSpace: 'break-spaces' }} />}
									</form>
								</div>

								{/* 条件集合 */}
								{(withinResults?.length > 0 || manufacturerArr?.length > 0) && (
									<div className="applied-filters pub-flex-align-center mt10">
										<div className="pub-fontw pub-font14">{iAppliedFilters}:</div>

										{
											manufacturerArr?.map(i => (
												<FilterItem text={i?.name} onClick={() => (clostManu(i), setIsInitialRender(false))} />
											))
										}

										{withinResults?.map((item, index) => (
											<FilterItem text={item} key={index} onClick={() => closeWithinResults(index)} />
										))}
									</div>
								)}

								<div className='ps-block--menu-categories mt20'>
									<div className="ps-block__header">
										<h3>{iManufacturers}</h3>
									</div>
									<div className="ps-block__content" style={{ maxHeight: "60vh", overflow: "auto" }}>
										<ul className="pub-menu-cata">
											<ManufacturerRender />
										</ul>
									</div>
								</div>
							</Flex>
						</Flex>

						<Flex column id="rightCatalogs" className='rightCatalogs__float ml20'>
							<div className='mb10 mr20 pub-flex-align-center'>
								<div className='pub-color555 pub-font14 pub-fontw'>
									{iResults}:
								</div>
								<div className='pub-font18 pub-fontw ml10'>{total}</div>
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
											{addList?.length !== 0 && <MinAddMoreCart selectedRows={selectedRows} />}
											{quoteList?.length !== 0 && <MinAddToRFQ list={quoteList} isShowItem />}
										</Flex>
									</div>}
								</FloatButtons>

								{
									pageNum && (
										<SamplePagination
											pageNum={Number(pageNum)}
											total={Number(total)}
											pageSize={Number(pageSize)}
											totalPages={1}
											currentUrl={currentUrl}
											otherUrlParams={getOtherUrlParams()}
											onChange={({ pageNum, pageSize }) => paginationChange(pageNum, pageSize)}
										/>
									)
								}
							</Flex>
						</Flex>
					</Flex>
				</div>
			</div>
		</PageContainer>
	);
};

export default Unclassified;

export async function getServerSideProps({ req, query }) {
	const languageType = getLocale(req)
	// 搜索条件
	const { manufacturerId, keyword } = query || {}
	// 搜索关键条件
	const _keyword = keyword?.split(',') || []

	// 新版
	const filterServerParams = {
		keyword,
		keywordList: _keyword || [],
		catalogKeyword: 844,
		manufacturerIdList: manufacturerId?.split(','),
		manufacturerKeyword: '',
		pageListNum: query?.pageNum || PUB_PAGINATION?.pageNum,
		pageListSize: query?.pageSize || PUB_PAGINATION?.pageSize,
		languageType,
	}

	const [translations, manufacturerListRes, responseData] = await Promise.all([
		changeServerSideLanguage(req), // 语言包等页面基础逻辑
		ProductRepository.getUncategorizedManufacturerList(languageType, manufacturerId?.split(',')), // 供应商
		ProductAllRepository.getProducts(filterServerParams), // 获取未分类下的产品列表
	]);

	const _prodList = responseData?.data?.data?.data || []
	const _total = responseData?.data?.data?.total || 0

	return {
		props: {
			...translations,
			curKeyword: _keyword,
			manufacturerList: manufacturerListRes?.data || [],
			manufacturerId: manufacturerId || [],
			productsList: _prodList,
			totalServer: _total,
		}
	};
}
