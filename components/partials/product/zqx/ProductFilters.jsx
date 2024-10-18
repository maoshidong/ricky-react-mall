import React, { useState, useEffect, useContext, useMemo } from 'react';
import { connect } from 'react-redux';

import last from 'lodash/last';
import uniq from 'lodash/uniq';
import remove from 'lodash/remove';
import keys from 'lodash/keys';

import { useRouter } from 'next/router';
import { Space, Button, Checkbox, Spin, Switch } from 'antd';
import { CustomInput, RequireTip, Flex } from '~/components/common';
import { nanoid } from 'nanoid';
import { CatalogRepository, ProductRepository } from '~/repositories';
import { getThousandsDataInt } from '~/utilities/ecomerce-helpers';
import { ProductsFilterContext } from '~/utilities/productsContext'
import { encrypt, buildUrl } from '~/utilities/common-helpers';
import localStorage from 'localStorage'
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
import { List as ReactVirtualizedList } from 'react-virtualized';
import styles from 'scss/module/_filter.module.scss';
// 不需要就删除
/**
 * @queryData父组件传的查询商品 
*/
const ProductFilters = ({
	attrCallback,
	filterServerParams, // 获取初始参数
	curSelectedItems, // 选中的系列
	checkSeriesName,  // 选中的系列属性
	catalogsBreadcrumb,
	query, productListData,
	filterData, // 属性数据
	manufacturerRes,
	queryKeywordList, queryAttrList, queryCatalogId
}) => {
	const { i18Translate, getLanguageName, getLanguageEmpty } = useLanguage();
	const { iResults, iFilters, ION, IOFF, } = useI18()
	const Router = useRouter();
	const { manufacturerId, slug } = manufacturerRes || {};
	const [loading, setLoading] = useState(false);
	const [showFilter, setShowFilter] = useState(true); // 是否展示属性

	const { currentUrl, updateFilterKeyword, updateFilterAttrIds, updateIsOneInitial } = useContext(ProductsFilterContext)

	const localSaveSelectAttrObj = JSON.parse(localStorage.getItem('saveSelectAttrObj')) || {}; // 保存好选中的属性对象
	const [productsCountNum, setProductsCountNum] = useState(productListData?.data?.total || 0); // 总数
	const [loadingCountNum, setloadingCountNum] = useState(false); // 总数
	const [selectedItems, setSelectedItems] = useState(curSelectedItems || {}); // 属性选中的筛选条件
	const [withinName, setWithinName] = useState("");
	const withinResults = queryKeywordList || []

	const [allProductAttributes, setAllProductAttributes] = useState(filterData || []); // 所有属性-获取值后不再更新
	const [productAttributes, setProductAttributes] = useState(filterData || []); // 属性集合 - 筛选后的
	const [isInvalid, setIsInvalid] = useState(false); // 无效输入
	const [isInitialRender, setIsInitialRender] = useState(true);

	// 计算属性总数 - filter页面， 几个接口都传一样的参数，保持同步
	const getProductsCountNum = async () => {
		// 选中的属性 - 选中恢复 ...queryAttrList
		let attributeIdList = []
		for (let key in selectedItems) {
			attributeIdList.push(...selectedItems[key])
		}
		const params = {
			keyword: last(queryKeywordList) || '',
			keywordList: queryKeywordList || [],
			attributeIdList,
			catalogKeyword: queryCatalogId,
			manufacturerKeyword: manufacturerId,
		}
		setloadingCountNum(true)
		const res = await ProductRepository.getProductsCountNum(params)
		if (res?.code === 0) {
			setloadingCountNum(false)
			setProductsCountNum(res?.data)
		}
	}

	// 存储页面的keywords
	const handleSaveKeywords = (arr) => {
		setWithinName('') // 清空搜索框
		updateFilterKeyword(arr)
	}
	// 保存选中的属性obj
	const saveSelectAttrObj = obj => {
		setSelectedItems(obj);
		localStorage.setItem(String('saveSelectAttrObj'), JSON.stringify(obj))
	}

	useEffect(() => {
		if (queryAttrList && queryAttrList?.length > 0) {

			handleSeach(null, {}); // 重置属性条件 - 恢复？
		}
	}, [queryAttrList])
	useEffect(() => {
		if (allProductAttributes?.length > 0) {
			// setSelectedItems({
			// 	...localSaveSelectAttrObj, // 选中的属性
			// 	...curSelectedItems,
			// } || {})
		}
	}, [curSelectedItems])
	useEffect(() => {

		setSelectedItems({
			...localSaveSelectAttrObj, // 选中的属性
			...curSelectedItems,
		} || {})
		// query  url参数变换
		handleSeach(null, {}); // 重置属性条件
	}, [query])

	useEffect(() => {
		// 首次进入不计算总数
		if (isInitialRender) {
			setIsInitialRender(false);
			return
		}

		handleSeach(null, selectedItems, true); // 重置属性条件
	}, [selectedItems]) // , query - 恢复？


	useEffect(() => {
		const arr = JSON.parse(localStorage.getItem('searchKeywords'))
		handleSaveKeywords(arr)

		updateFilterAttrIds({});

		if (isInitialRender) {
			setIsInitialRender(false);
			return
		}

		getProductsCountNum()
	}, []);

	//  获取属性列表
	async function getFilters(idList = [], useIdList = false) {
		// 选中恢复 - ...queryAttrList 
		let attrList = []
		for (let key in selectedItems) {
			attrList.push(...selectedItems[key])
		}
		setLoading(true);
		if (!productAttributes || productAttributes?.length === 0) {
			setLoading(true);
		}

		const params = {
			...filterServerParams,
			attributeIdList: useIdList ? idList : queryAttrList, // useIdList为true，说明使用传过来的条件，为false使用queryAttrList
		}

		const res = await CatalogRepository.getProductFilter(params);

		setLoading(false);
		if (res) {
			const { data } = res?.data || {}
			setProductAttributes(data);
			// !idList || idList?.lenght === 0
			if (!useIdList && data?.length > 0) {
				setAllProductAttributes(data);
				attrCallback(data)
			} else {
				// setAllProductAttributes(filterData); // 恢复所有属性
			}
			// 首次进入不计算总数
			// if (upAttributesFlag && allProductAttributes?.length === 0) {
			//     setAllProductAttributes(res?.data?.data);
			//     setUpAttributesFlag(false)
			//     return
			// }
		}
	}

	useEffect(() => {
		// 长度大于1说明有条件，请求接口
		// if(Router.asPath.split('?')?.length > 1) {
		// 	getFilters()
		// }

		setProductAttributes(filterData)
	}, [filterData])

	// 保存所有属性-用于选中属性后匹配对应的值
	// const getAllFilters = async () => {
	// 	const params = {
	// 		keyword: '',
	// 		keywordList: [],
	// 		catalogKeyword: queryCatalogId,
	// 		attributeIdList: [],
	// 	}
	// 	const res = await CatalogRepository.getProductFilter(params);
	// 	setAllProductAttributes(res?.data?.data);
	// 	setUpAttributesFlag(false)
	// }

	// useEffect(() => {
	//     if (upAttributesFlag && allProductAttributes?.length === 0) {
	//         getAllFilters() // 恢复?
	//     }
	// }, [])  

	const handleSeach = (e, selectedItems = { selectedItems }, useIdList = false) => {
		// 选中恢复 : [...queryAttrList]
		let idList = [] // useIdList为true，说明使用传过来的条件，不添加queryAttrList
		for (let key in selectedItems) {
			idList.push(...selectedItems[key])
		}
		getFilters(uniq(idList), useIdList)
	}
	// 选择属性和删除属性
	const onChecked = (e, i, close) => {
		// 处理选中的属性
		const { checked } = e.target
		const { type, productAttributeId } = i
		let itemValue = selectedItems?.[type] ?? [];

		if (checked) {
			itemValue.push(String(productAttributeId));
			itemValue = uniq(itemValue); // 去重
		} else {
			remove(itemValue, function (item) {
				return item == productAttributeId;
			});
		}

		// 最新选中的属性集合
		let tmpSelectedItems = {
			...selectedItems,
			...{
				[type]: itemValue
			}
		};

		saveSelectAttrObj(tmpSelectedItems)
		updateFilterAttrIds(tmpSelectedItems)
		// --del999 属性可能返回[]数组，先不执行 - 点击Apply All才去请求  选中条件改变时会调用， 这里不用重复调用
		// handleSeach(null, tmpSelectedItems, true);  
		getProductsCountNum()
	}

	// 删除供应商
	const manufacturerResColse = () => {
		handleAgainRouter(withinResults, selectedItems, true)
	}

	// 处理重新跳转
	const handleAgainRouter = async (newWithinResults, selectedItems, delManufacturerId) => {
		updateIsOneInitial(productsCountNum)
		let params = {};
		// 是否有查询条件
		if (newWithinResults?.length > 0) {
			params.keywords = encrypt(newWithinResults.join('____') || '')
		}
		// 是否有选中属性  选中恢复 ...queryAttrList
		let attrList = []
		for (let key in selectedItems) {
			attrList.push(...selectedItems[key])
		}

		if (attrList?.length > 0) {
			params.attrList = attrList.join(',') || ''
		}
		// // 是否有制造商
		// if (manufacturerId && !delManufacturerId) {
		// 	params.manufacturerId = manufacturerId
		// }
		if (slug && !delManufacturerId) {
			params.manufacturerSlug = slug
		}
		const resultURL = await buildUrl(currentUrl, params);
		Router.push(resultURL)
	}

	// 关闭输入的搜索条件
	const closeWithinResults = index => {
		const newWithinResults = withinResults?.filter((_, i) => i !== index)
		handleSaveKeywords(newWithinResults)
		handleAgainRouter(newWithinResults, selectedItems)
	}

	const handleAddWithin = e => {
		e.preventDefault();
		if (!withinName || withinName.length < 3) {
			setIsInvalid(true)
			return
		}
		const newWithinResults = [...withinResults, withinName]
		handleSaveKeywords(newWithinResults)
		handleAgainRouter(newWithinResults, selectedItems)
	}

	// 重置所有
	const onCancelSelected = () => {
		saveSelectAttrObj({})  // 清空选择的属性
		updateFilterAttrIds({});
		handleSaveKeywords([]); // 搜索词
		localStorage.removeItem('saveSelectAttrObj')  // 清空选择的属性
		// handleSeach(null, {}, true); // 重置属性条件  null, {}, true: 搜索条件使用传过去的{} 恢复？
		Router.push(currentUrl)
	}

	useEffect(() => {
		return () => {
			setTimeout(() => {
				localStorage.removeItem('searchData')
				localStorage.removeItem('searchKeywords')
				localStorage.removeItem('saveSelectAttrObj')
			}, 0)
		};
	}, [])


	// 判断属性是否选中
	const isChecked = i => {
		// queryAttrList - url中的  选中恢复 ...queryAttrList
		const idList = []
		for (let key in selectedItems) {
			idList.push(...selectedItems[key])
		}
		const isChecded = idList.find(item => item == i.productAttributeId)
		return Boolean(isChecded)
	}
	// console.log(selectedItems, 'selectedItems----del')
	// 属性是否还可选择
	const handDisabled = (item, productAttributeId) => {
		const isHaveItem = productAttributes?.find(i => i?.type === item?.type) || [] // 该属性类型下还有可选择的
		const isHaveId = isHaveItem?.dataList?.find(j => j?.productAttributeId === productAttributeId) // 该属性类型可选择的id
		return !isHaveId
	}
	// 清除当前类型属性
	const clearAttr = item => {
		let obj = {};
		for (let i in selectedItems) {
			if (i !== item?.type) {
				obj[i] = selectedItems[i];
			}
		}
		saveSelectAttrObj(obj)
	}
	// 是否展示清除当前类型按钮
	const isShowClear = item => {
		// const curItem = selectedItems?.
		let flag = false
		for (let i in selectedItems) {
			if (i === item?.type && selectedItems[i]?.length > 0) {
				flag = true
			}
		}
		return flag
	}
	// 计算类型下属性字符串最大长度，的宽度 - 最小宽度150
	const handCountWid = item => {
		let maxLength = 0;
		item?.dataList?.map(i => {
			if (i?.attrValue?.length > maxLength) {
				maxLength = i?.attrValue?.length;
			}
		})
		const len = Number((maxLength || 0) * 8 + 20)
		return len > 150 ? (len < 350 ? len : 350) : 150
	}
	const a = "-20°C ~ 125°C (TJ)"

	// 属性内容列表
	const attributesComponent = useMemo(() => {
		// if (!productAttributes || productAttributes?.length === 0) {
		// 	return null
		// }
		// productAttributes => allProductAttributes  恢复? 
		return allProductAttributes && allProductAttributes?.map((item, index) => {
			if (index === 0) {
				handCountWid(item)
			}
			const countWid = handCountWid(item)
			const { type } = item || {};
			// 从制造商进入产品表格，在筛选条件中不显示制造商
			if (type === "Manufacturer" && manufacturerRes?.name) return null
			return <div className="product-filter-column-wrapper" key={'virtualizedList' + index}>
				<span className='pub-font14 pub-fontw'>{type}</span>
				{/* minWidth: '100px', */}
				<div className='mt10 pub-flex' style={{ position: 'relative', height: '250px' }}>
					{/* <AutoSizer>
					{({ height, width }) => ( */}
					{/* <input style={{height: '30px'}} /> */}
					<ReactVirtualizedList
						className={"product-filter-column " + (isShowClear(item) ? 'pb-40' : '')}
						width={countWid || 100}
						height={250}
						rowHeight={22}
						// rowCount={300}
						// autoContainerWidth={true} // 将内部可滚动的容器宽度设为自动
						rowCount={item?.dataList?.length}
						// overscanRowCount={item?.dataList?.length}
						rowRenderer={({ index, key, style }) => {

							return (
								// 注意，style 属性必须应用到返回的元素上，以确保每一行都正确渲染并按照指定高度和位置进行排列。 , width: aaa,
								<div >
									<div key={key} style={{ ...style }}>
										<Checkbox
											style={{ width: '100%' }}
											// className='pub-cursor-not-allowed'
											value={`${item?.dataList?.[index]?.attrValue}`}
											// checked={selectedFilterItems.indexOf(String(i?.productAttributeId)) >= 0}
											onChange={(e) => onChecked(e, item?.dataList?.[index])}
											checked={isChecked(item?.dataList?.[index])}
											disabled={handDisabled(item, item?.dataList?.[index]?.productAttributeId) && !isChecked(item?.dataList?.[index])}
										>
											<span style={{ maxWidth: '300px', display: 'block' }} className='pub-line-clamp1' title={item?.dataList?.[index]?.attrValue}>{item?.dataList?.[index]?.attrValue}</span>
										</Checkbox>
									</div>

								</div>
							);
						}}
					/>
					{/* )}
					</AutoSizer> */}
					{isShowClear(item) && <div onClick={() => clearAttr(item)}
						className={styles.filterClear}
					>{i18Translate('i18FunBtnText.Reset', 'Reset')}</div>}

				</div>
			</div >
		});

	}, [productAttributes, allProductAttributes, selectedItems]);
	// console.log(productAttributes, 'productAttributes----del')
	// console.log(allProductAttributes, 'allProductAttributes----del')
	// 根据所选的属性，回显对应的属性名
	const getProductAttributesName = (key, productAttributeId) => {
		let name
		// allProductAttributes -> productAttributes 恢复? 
		productAttributes?.map(item => {
			const { type, dataList } = item
			if (type == key) {
				dataList?.map(i => {
					if (i.productAttributeId == productAttributeId) {
						name = i.attrValue
					}
				})
			}
		})
		return name
	}
	// 开关
	const showChange = (e) => {
		setShowFilter(e)
	}
	// 操作按钮
	const operateBtn = () => {
		return <div className='mb15 pub-flex-align-center pub-flex-wrap'>
			{/* 重置按钮 */}
			<div className='mr30'>
				<Button
					type="submit" ghost='true'
					className='login-page-login-btn w100 mr20'
					style={{ background: "#fff" }}
					onClick={(e) => onCancelSelected(e)}
				// disabled={attrsElm?.length === 0 && productListData?.length === 0}
				>
					{i18Translate('i18FunBtnText.Reset All', 'Reset All')}
				</Button>
				{/* 应用按钮 */}
				<Button
					// loading={loadingCountNum}
					type="submit" ghost='true'
					className='login-page-login-btn custom-antd-primary w100'
					// disabled={(attrsElm?.length === 0 && productListData?.length === 0)} //  || loadingCountNum
					onClick={() => handleAgainRouter(withinResults, selectedItems)}
				>
					{i18Translate('i18FunBtnText.Apply All', 'Apply All')}
				</Button>
			</div>

			<div className='filter-remaining'>
				{/* 总数量 */}
				<div className='pub-flex-align-center'>{iResults}：
					{loadingCountNum ? (<Spin size="small" />) : ''}
					<span className='pub-fontw pub-font18' style={{ paddingLeft: '5px' }}>{getThousandsDataInt(productsCountNum)}</span>
				</div>
			</div>
		</div>
	}

	// 选中的条件展示
	const renderSelectedItems = () => {
		let attrsElm = [];
		keys(selectedItems).forEach(key => {
			const values = selectedItems[key];
			if (values && values.length > 0) {
				attrsElm.push(
					<div className='product-filter-selected-group pub-border' key={nanoid()}>
						{
							selectedItems[key].map((item, i) => (
								<div className='ml10 pub-flex-align-center pub-font12' key={nanoid()}>
									<div className='pub-lh18'>{getProductAttributesName(key, item)}</div>
									<div className='filter-close'
										onClick={(e) => onChecked(e, {
											type: key,
											productAttributeId: item,
										}, 'close')}
									>
										<div className='ml5 sprite-about-us sprite-about-us-1-4' />
									</div>
								</div>
							))
						}
					</div>
				);
			}
		});

		// 供应商条件
		if (manufacturerRes?.name) {
			attrsElm.unshift(
				<div className='product-filter-selected-group pub-border' key={nanoid()}>
					<div className='pub-flex-align-center pub-font12'>
						<div className='pub-lh18'>{manufacturerRes?.name}</div>
						<div className='filter-close' onClick={() => manufacturerResColse()}>
							<div className='ml5 sprite-about-us sprite-about-us-1-4' />
						</div>
					</div>
				</div>
			)
		}

		return (
			<div className='product-filter-selected-group-container'>

				{
					attrsElm?.length > 0 && (
						<div className='applied-filters pub-flex-align-center'>
							<div className='mb10 pub-fontw pub-font14'>{i18Translate('i18SmallText.Search Entry', 'Applied Filters')}:</div>
							{attrsElm}
						</div>
					)
				}
				{/* 输入的搜索条件 */}
				{(withinResults?.length > 0) && (
					<div className='applied-filters pub-flex-align-center'>
						<div className='mb10 pub-fontw pub-font14'>{i18Translate('i18SmallText.Search Entry', 'Search Entry')}:</div>
						{
							withinResults?.map((item, index) => (
								<div className='product-filter-selected-group pub-border pub-flex-align-center pub-font12' key={nanoid()} style={{ 'wordBreak': 'break-all' }}>
									<div className='pub-lh18'>{item}</div>
									<div className='filter-close' onClick={() => closeWithinResults(index)}>
										<div className='ml5 sprite-about-us sprite-about-us-1-4' />
									</div>
								</div>
							))}
					</div>
				)}

			</div>
		);
	}

	const name = getLanguageName(last(catalogsBreadcrumb))

	return (
		<div>
			{/* 供应商信息 */}
			{(manufacturerRes?.introduce) && (
				<div className='filter-manufacturer'>
					{
						manufacturerRes?.logo && <img
							className="filter-manufacturer-img mr20"
							src={manufacturerRes?.logo} alt={manufacturerRes?.name}
							title={manufacturerRes?.name}
							onError={(e) => (e.target.src = getLanguageEmpty())}
						/>
					}

					<div className='filter-manufacturer-right'>
						<h2 className='pub-font16 pub-fontw mb5'>{manufacturerRes?.name}</h2>
						{/* dangerouslySetInnerHTML 只能使用div标签 */}
						<div className='pub-color555 pub-font13 pub-font500 mb0 pub-lh16 vue-ueditor-wrap' dangerouslySetInnerHTML={{ __html: manufacturerRes?.introduce }}></div>
					</div>
				</div>
			)}

			<h1 className='mt20 mb15 pub-font24'>{checkSeriesName + name}</h1>
			{/* -between */}
			<div className='pub-flex-align-center'>
				<Flex column gap={6} className='pub-flex-align-center pub-flex-wrap mb20'>
					<Flex>
						<div className='pub-search pub-custom-input-box mr30 w300'>
							<form onSubmit={(e) => handleAddWithin(e)}>
								<CustomInput
									style={{ width: '300px' }}
									onChange={(e) => (setWithinName(e.target.value), setIsInvalid(false))}
									className='form-control pub-search-input'
									value={withinName}
								/>
								<div onClick={e => handleAddWithin(e)} className={'pub-search-icon sprite-icons-1-3 '}></div>
								<div className='pub-custom-input-holder' style={{ top: '7px' }}>{i18Translate('i18Form.Search within results', 'Search within results')}</div>
							</form>
						</div>
						<div className='pub-flex-align-center' style={{ minWidth: "150px" }}>
							<div className='pub-color555'>{iResults}:</div>
							<div className='ml10 pub-font18'>{getThousandsDataInt(productListData?.data?.total)}</div>
						</div>
					</Flex>
					{
						isInvalid && <RequireTip style={{ width: 'max-content' }} isAbsolute={false} />
					}
				</Flex>
				<div className='mb20'>{iFilters}<Switch checked={showFilter} checkedChildren={ION} unCheckedChildren={IOFF} onChange={showChange} className='ml10 mr30' /></div>
			</div>
			<div>
				{renderSelectedItems()}
				{/* defaultChecked */}

			</div>

			{(showFilter) && <div className="product-filter-container box-shadow mb20">
				<div id="filter" className={'mb15 ' + (productAttributes?.length !== 0 ? 'product-filter-type' : '')}>
					<Spin spinning={loading} delay={50} style={{ minHeight: '50px' }}>
						<Space size={15} className='mb30'>
							{attributesComponent}
						</Space>
					</Spin>
				</div>

				{operateBtn()}
			</div>}

		</div>
	);
};

export default connect((state) => state)(ProductFilters);
