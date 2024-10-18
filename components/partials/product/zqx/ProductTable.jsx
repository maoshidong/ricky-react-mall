import React, { useState, useEffect, useContext, useRef } from 'react';

import qs from 'qs';
import { connect } from 'react-redux';
import { Table } from 'antd';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useLanguage from '~/hooks/useLanguage';
import useApi from '~/hooks/useApi';

import MinAddMoreCart from '~/components/ecomerce/minCom/MinAddMoreCart';
import MinProductDetail from '~/components/ecomerce/minCom/MinProductDetail';
import TablePriceList from '~/components/ecomerce/minCom/TablePriceList'
import MinAddCart from '~/components/ecomerce/minCom/MinAddCart'
import MinTableQuote from '~/components/ecomerce/minCom/MinTableQuote'
import MinTableAvailability from '~/components/ecomerce/minTableCom/MinTableAvailability'
import FloatButtons from '~/components/ecomerce/modules/FloatButtons'
import { SamplePagination, Flex, TableFilterField } from '~/components/common'
import MinAddToRFQ from '~/components/ecomerce/minCom/MinAddToRFQ'
import { MinCompareProducts } from '~/components/ecomerce/minCom'
import { ProductsFilterContext } from '~/utilities/productsContext'
import { encrypt, buildUrl } from '~/utilities/common-helpers';

import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import filter from 'lodash/filter';

const ProductTableFilterCom = ({
	loading,
	dataServer,
	queryAttrList,
	queryKeywordList,
	tempDataServer,
	catalogsBreadcrumb, // 分类面包屑
	manufacturerRes, // 供应商数据
	sortField, 字段排序
}) => {
	const { i18Translate, getLanguageEmpty } = useLanguage();
	const { sendTimeMap, adddressMap, getSysShippingTime, getGoodsSendFrom } = useApi();
	const tableRef = useRef(null);
	const { currentUrl } = useContext(ProductsFilterContext) // 当前页面不带参数的url
	const { pageNum, pageSize, pages } = dataServer?.data || {}
	const Router = useRouter();
	const { asPath, query } = Router
	// console.log(manufacturerRes,'manufacturerRes- manufacturerSlug=nxp-semiconductors---del')
	const { slug } = manufacturerRes || {}
	const [selectedRows, setSelectedRows] = useState([]); // 表格多选的数据项
	const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选中的key集合
	const [pList, setPlist] = useState(tempDataServer)
	const [fieldSort, setFieldSort] = useState(sortField || '')

	useEffect(() => {
		setPlist(tempDataServer)
		setFieldSort(sortField)
	}, [tempDataServer, sortField])

	// useEffect(() => {
	// 	getSysShippingTime();
	// 	getGoodsSendFrom();
	// }, []);

	const getAttlutedWidth = item => {

		let result = 80;
		if (item?.type?.length > 15) {
			result = 120;
		}
		if (item?.type?.length > 20) {
			result = 150;
		}
		if (item?.attrValue?.length > 15) {
			result = 120;
		}
		if (item?.attrValue?.length > 30) {
			result = 150;
		}
		if (item?.attrValue?.length > 40) {
			result = 160;
		}

		return result
	}

	const firstCatalogName = (catalogsBreadcrumb)?.[0]?.slug

	// 行选中变化
	const rowKeysChange = (arrProductId, record, quantity) => {
		const curItem = selectedRows.find(i => i?.productId == record?.productId) // 当前修改数量的型号是否已经勾选
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
			const uniqueArr = [...new Set([...selectedRowKeys, record?.productId])];
			setSelectedRowKeys(uniqueArr)
			rowKeysChange(uniqueArr, record, quantity)
		} else {
			const arr = selectedRowKeys?.filter(i => i !== record?.productId)
			setSelectedRowKeys(arr)
			rowKeysChange(arr, record, quantity)
		}
	}

	const iSelect = i18Translate('i18PubliceTable.Select', 'Select')
	const iImage = i18Translate('i18PubliceTable.Image', 'Image')
	const iProductDetail = i18Translate('i18PubliceTable.Product Detail', 'Product Detail')
	const iPrice = i18Translate('i18PubliceTable.Price', 'Price')
	const iAvailability = i18Translate('i18PubliceTable.Availability', 'Availability')
	const iEcadModel = i18Translate('i18PubliceTable.ECAD Model', 'ECAD Model')

	// 字段排序搜索
	const handleFieldSort = async (field, type) => {
		// 获取当前页面的路径和查询参数
		const urlParams = asPath?.split('?');
		// 加密排序信息
		const _sort = `${field}=${type}`;

		// 初始化结果 URL
		let resultUrl = urlParams?.[0];

		// 构建新的查询参数对象，只包含 slugs 字段
		const { slugs, ...otherParams } = query;

		// 添加排序参数
		const params = {
			...otherParams,
			sort: encrypt(_sort)
		};

		// 设置字段排序信息
		setFieldSort(_sort);

		resultUrl = await buildUrl(resultUrl, params)

		// 利用 Router 进行页面跳转，更新 URL
		Router.push(resultUrl);
	}

	const columns = [
		{
			title: <TableFilterField title={iImage} />,
			width: 86,
			dataIndex: 'image',
			key: 'image',
			render: (_url, record) =>
				<img
					className='pub-img'
					src={`${record.thumb || record.image}`}
					alt={record.productNo}
					title={record.productNo}
					onError={e => { e.target.src = getLanguageEmpty() }}
				/>,
		},
		{
			title: <TableFilterField title={iProductDetail} field='name' onSort={handleFieldSort} result={fieldSort} />,
			width: 250,
			dataIndex: 'productNo',
			key: 'productNo',
			render: (_text, record) => (
				<div style={{ minWidth: '200px', maxWidth: '320px' }}>
					<MinProductDetail record={record} firstCatalogName={firstCatalogName} />
				</div>
			)
		},
		{
			title: <TableFilterField title={iPrice} onSort={handleFieldSort} result={fieldSort} />, //field='prices' 
			dataIndex: 'prices',
			key: 'prices',
			width: 270,
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
						(_quote) && (
							<div className='mt5 ml20'>
								<MinTableQuote record={record} quantityChange={quantityChange} />
							</div>
						)
					}
				</div>
			}
		},
		{
			title: <TableFilterField title={iAvailability} field='quantity' onSort={handleFieldSort} result={fieldSort} />,
			dataIndex: 'quantity',
			key: 'quantity',
			width: 145,
			render: (_text, record) => {
				return (
					<MinTableAvailability sendTimeMap={sendTimeMap} adddressMap={adddressMap} record={record} />
				)
			},
		},
		{
			title: <TableFilterField title={iEcadModel} onSort={handleFieldSort} />, // field='ECAD'
			dataIndex: 'ECAD',
			key: 'ECAD',
			width: 180,
			maxWidth: 100,
			render: (text) => {
				return (

					<div className='ps-product__meta_ECAD' style={{ display: 'flex' }}>
						<span className='iconfont sprite-icon2-6-3 mr10'></span>
						<span className='pub-lh16'>{text || 'PCB Symbol, Footprint & 3D Model'}</span>
					</div>
				)
			}
		},
	];
	// console.log('pList', pList)
	// ?.slice(0, 1)
	dataServer?.data?.data?.map((item, index) => {
		item?.typeList?.map((i, childIndex) => {
			// Series固定放到ECAD后面 field={i?.type} 
			const pubParams = {
				title: <TableFilterField title={i?.type} onSort={handleFieldSort} result={fieldSort} />,
				dataIndex: i?.type,
				width: getAttlutedWidth(i),
				key: `type${index}${childIndex}`,
			}
			// index === 0 只添加一次columns-Series

			if (index === 0 && i?.type === 'Series') {
				columns.splice(5, 0, {
					...pubParams,
					render: (text, record) => {
						const filterSeries = record?.typeList?.find(item => item?.type === 'Series')
						// 这种情况不给a标签
						if ((filterSeries?.attrValue !== '-' && filterSeries?.attrValue !== '*' && filterSeries?.productAttributeId)) {
							return <Link href={`${asPath.split('?')?.[0]}?attrList=${filterSeries?.productAttributeId}`}>
								<a className='pub-color-hover-link'>{text}</a>
							</Link>
						}
						return <span>{text}</span>

					},
				});
				return
			}
			// 供应商已经在外层有了，这里不拿 - 循环拿去表格列表数据的typeList数组， 拿到里边的每个属性展示
			if (index === 0 && i?.type !== 'Manufacturer') {
				columns.push({
					...pubParams,
					render: (text) => (
						// 避免i?.type 未undefined, 报错
						<div>{i?.type ? text : ''}</div>
						// console.log(text, 'text--1111111-del')
					),
				})
			}

		})
	})

	useEffect(() => {
		// 表格数据改变时，清空勾选
		setSelectedRows([])
		setSelectedRowKeys([])

		// 重置滚动条
		resetSCrollbar()
	}, [dataServer])

	// 加上选择
	const rowSelection = {
		columnTitle: <TableFilterField title={iSelect} />,
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

	// 分页改变每页展示数量
	// const tableChange = async (page, pageSize) => {
	// 	// tableRef.current.scrollToFirstRow();
	// 	// tableRef.current.scrollLeft = 0;
	// 	// tableRef.current.scrollTo({ left: 0, top: 0 });

	// 	// tableRef.current.scrollIntoView({
	// 	//     // behavior: 'smooth',
	// 	//     block: 'start',
	// 	//     inline: 'start'
	// 	// });

	// 	let params = {
	// 		pageNum: page,
	// 		pageSize,
	// 	};
	// 	// 是否有查询条件

	// 	if (queryKeywordList?.length > 0) {
	// 		params.keywords = encrypt(queryKeywordList.join(',') || '')
	// 	}

	// 	// 是否有选中属性
	// 	if (queryAttrList?.length > 0) {
	// 		params.attrList = queryAttrList.join(',') || ''
	// 	}

	// 	const resultURL = await buildUrl(currentUrl, params);

	const getRowClassName = (record, index) => {
		return index % 2 == 1 ? 'product-table-odd-row' : '';
	}

	// 除分页外其它参数，传给分页组件
	const getOtherUrlParams = () => {
		let params = {};
		// 是否有查询条件
		if (queryKeywordList?.length > 0) {
			params.keywords = encrypt(queryKeywordList.join(',') || '')
		}

		// 是否有选中属性
		if (queryAttrList?.length > 0) {
			params.attrList = queryAttrList.join(',') || ''
		}

		// 是否有制造商
		// if (manufacturerId) {
		// 	params.manufacturerId = manufacturerId
		// }
		if (slug) {
			params.manufacturerSlug = slug
		}

		// 是否有字段排序
		if (fieldSort) {
			params.sort = encrypt(fieldSort)
		}

		const queryParams = qs.stringify(params)

		return queryParams
	}

	// 获取antd表格的滚动条元素，当搜索条件更改的时候，重置到开始位置
	const resetSCrollbar = () => {
		const antTableScroll = document.querySelector('.ant-table-body')
		antTableScroll.scrollLeft = 0
	}

	// 添加到购物车数据
	const addList = filter(selectedRows || [], sr => !sr.isQuote)
	// 添加到询价单数据
	const quoteList = filter(selectedRows || [], sr => sr.isQuote)

	return (
		<div className='product-table-container mr10'>
			<div>
				<Table
					id='productTable'
					size="small"
					className="pub-bordered table-vertical-top pub-table-thead pub-table-thead-no-padding"
					columns={columns}
					rowSelection={{
						...rowSelection,
					}}
					dataSource={pList}
					loading={loading}
					rowClassName={getRowClassName}
					sticky
					rowKey={record => record?.productId}
					key={record => record.productId} // 不加key, 会导致页面渲染时表格也重新渲染，添加购物车成功弹窗也会自动关闭
					bordered
					scroll={pList?.length > 0 ? { x: 1500 } : null}
					pagination={false}
					ref={tableRef}
					scrollToFirstRowOnChange={true} // 	当分页、排序、筛选变化后是否滚动到表格顶部
				// 在处理完变化后手动触发滚动到表格顶部
				// tableRef.current.getInternalHooks('rc-table').triggerScroll(0, true);
				// style={{paddingBottom: '50px'}}
				/>
			</div>

			<div className='pub-flex-between mt20'>
				<FloatButtons isShow={selectedRows?.length > 0} curClass="pub-btn-fixed-100">
					{selectedRows.length !== 0 && (
						<Flex gap={20}>
							{addList?.length !== 0 && <MinAddMoreCart selectedRows={addList} propDisabled={addList?.length === 0} isShowItem otherParams={{ widthClass: 'w130' }} />}
							{quoteList?.length !== 0 && <MinAddToRFQ list={quoteList} isShowItem />}
							{selectedRows?.length > 1 && <MinCompareProducts productList={selectedRows} />}
						</Flex>
					)}
				</FloatButtons>

				<SamplePagination
					pageNum={pageNum}
					pageSize={pageSize}
					pagesTotal={pages}
					currentUrl={currentUrl}
					otherUrlParams={getOtherUrlParams()}
				// onChange={resetSCrollbar}
				/>
			</div>
			{/* </div> */}
			{/* <span style={{height: '50px', display: 'initial'}}> */}
			{/* {
                        selectedRows.length !== 0 && (
                            <div className='sticky-box' style={{display: 'inline-block'}}>
                                <MinAddMoreCart selectedRows={selectedRows} />
                            </div>
                        )
                    } */}
			{/* </span> */}
		</div>
	);
};

export default connect((state) => state)(ProductTableFilterCom);
