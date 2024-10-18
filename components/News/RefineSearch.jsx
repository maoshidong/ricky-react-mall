import React, { useState, useEffect, useContext } from 'react';
import { Checkbox, Col, Row, Button } from 'antd';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/router';
import Link from 'next/link';
import qs from 'qs';
import NewsRepository from '~/repositories/zqx/NewsRepository';
import MinSearch from '~/components/ecomerce/minCom/MinSearch';
import FilterPair from '~/components/News/MinCom/FilterPair';
import { CONTENT_SEARCH } from '~/utilities/sites-url';
import { PUB_RESOURCE_TYPE, NEWS_ALL_TEMPLATE_TYPE } from '~/utilities/constant';
import { buildUrl } from '~/utilities/common-helpers'
import { NewsContentContext } from '~/utilities/productsContext'
import useLanguage from '~/hooks/useLanguage';
import styles from "scss/module/_news.module.scss";

const RefineSearchCom = ({ conditionChange, newsTypeTreeServer = [], isAdda }) => {

	const { i18Translate, getLanguageName, getDomainsData } = useLanguage();
	const iResourceType = i18Translate('i18ResourcePages.Resource Type', 'Resource Type')
	const iRefineSearch = i18Translate('i18ResourcePages.Refine Search', 'Refine Search')
	const iResetAll = i18Translate('i18FunBtnText.Reset All', 'Reset All')
	const iSearchContentTitle = i18Translate('i18ResourcePages.Search content title', 'Search content title')

	const { resource, attribute, companyNews, helpCenter, video } = PUB_RESOURCE_TYPE
	const { functionTemp, productTypeTemp, brandsTemp } = NEWS_ALL_TEMPLATE_TYPE
	const Router = useRouter();
	const { query } = Router || {}

	const { typefitIds, functionIdList, queryKey, manufactureIdList: useManufactureIdList } = useContext(NewsContentContext)
	const [expandHide, setExpandHide] = useState(true) // 条件展开或隐藏

	// 只取对应的栏目
	const [resourceTypeTree, setResourceTypeTree] = useState(newsTypeTreeServer?.filter(item => (
		item?.type === resource ||
		item?.type === companyNews ||
		item?.type === helpCenter
	)))

	// 资源树 - Function + Product Type + Video Type
	const [attributeTree, setAttributeTree] = useState(newsTypeTreeServer?.filter(item => (
		// item?.type === attribute || 
		item?.type === video ||
		item?.templateType === functionTemp ||
		item?.templateType === productTypeTemp

	)) || []) // 属性树
	// 供应商
	const [bransTree, setBransTree] = useState(newsTypeTreeServer?.filter(item => (
		item?.templateType === brandsTemp
	)) || []) // 供应商树

	// typefitIds ||  
	const [checkedList, setCheckedList] = useState([]) // type: PUB_RESOURCE_TYPE.resource, // 资源条件 - 选中的栏目id集合
	// typefitIds || 
	const [attributeList, setAttributeList] = useState([]) // type: PUB_RESOURCE_TYPE.attribute, // 功能属性
	const [manufactureIdList, setManufactureIdList] = useState([]) // 选中的供应商列表
	const [keyword, setKeyword] = useState(queryKey || '')

	const [allIds, setAllIds] = useState([]) // 所有可展开的ids
	const [openIds, setOpenIds] = useState([]) // 当前推荐展开的ids

	const getResourceTypeTree = async (param = {}) => {
		const params = {
			parentTypeId: 0,
			// type: PUB_RESOURCE_TYPE.resource, // 资源
			...param,
			typeList: [resource, attribute, companyNews, helpCenter, video],
			languageType: getDomainsData()?.defaultLocale || 'zh',
		}
		const res = await NewsRepository.apiGetNewsTypeTree(params);
		if (res?.code === 0) {
			setResourceTypeTree(res?.data?.filter(item => (
				item?.type === resource ||
				item?.type === companyNews ||
				item?.type === helpCenter
			)))
			setAttributeTree(res?.data?.filter(item => (
				// item?.type === attribute || 
				item?.type === video ||
				item?.templateType === functionTemp ||
				item?.templateType === productTypeTemp
			)))
			setBransTree(res?.data?.filter(item => (
				item?.templateType === brandsTemp
			)))
			const arr = res?.data?.map(item => item?.id)
			setAllIds([...arr, 99999])
			setOpenIds([...arr, 99999])
		}
	}

	useEffect(async () => {
		const param = {
			functionIdList: typefitIds,
		}
		getResourceTypeTree(param) // 获取资源栏目
	}, [])

	// 更新url 
	const handleChangeUrl = async (list, funList, key, manufactureIdList) => {
		let params = {};
		// 是否有查询条件
		// Resource Type:  typeIdList
		if (list?.length > 0) {
			params.typefitIds = list.join(',')
		}
		// function, Product-Type, Video-Type id集合
		if (funList?.length > 0) {
			params.functionIdList = funList.join(',')
		}
		// 选中的供应商
		if (manufactureIdList) {
			params.manufactureIdList = manufactureIdList.join(',')
		}
		// 搜索关键词
		if (key) {
			params.key = key
		}

		const resultURL = await buildUrl(CONTENT_SEARCH, params);
		// 栏目是勾选框还是a标签
		if (isAdda) {
			window.history.pushState({ path: resultURL }, '', resultURL); // 改变 URL 但不跳转
		} else {
			Router.push(resultURL) // 跳转
		}
	}

	// 条件改变后, 更新左侧树
	// 栏目条件改变
	const onChange = (typeIdList) => {
		let sonIdList = []
		resourceTypeTree?.map(item => {
			// 帮助中心需要加上子栏目id查出所有：sonIdList 
			if (typeIdList?.includes(item?.id) && item?.sonIdList) {
				sonIdList.push(...item?.sonIdList)
			}
		})

		// 收集所有选中id
		const allIdList = [...typeIdList, ...sonIdList]
		setCheckedList(allIdList || [])
		const param = {
			typeIdList: allIdList, functionIdList: attributeList,
		}

		handleChangeUrl(allIdList, attributeList, keyword)

		getResourceTypeTree(param) // 获取资源栏目
		if (conditionChange) {
			const params = {
				...param,
				typeIdList: allIdList,
				functionIdList: attributeList,
				keyword,
			}
			conditionChange(params)
		}
	}

	// 自建分类，功能勾选
	const attributeListChange = (ids, b) => {
		handleChangeUrl(checkedList, ids, keyword)

		setAttributeList(ids || [])
		// 所有选中的
		const param = {
			typeIdList: checkedList, functionIdList: ids,
		}
		getResourceTypeTree(param) // 获取资源栏目
		if (conditionChange) {
			const params = {
				...param,
				// columnIdList: ids,
				keyword,
			}
			conditionChange(params)
		}
	}
	// 选中的供应商
	const brandsChange = (ids) => {
		handleChangeUrl(checkedList, attributeList, keyword, ids)
		setManufactureIdList(ids || [])
		// 所有选中的
		const param = {
			typeIdList: checkedList, functionIdList: attributeList, manufactureIdList: ids,
		}
		getResourceTypeTree(param) // 获取资源栏目
		if (conditionChange) {
			const params = {
				...param,
				keyword,
			}
			conditionChange(params)
		}
	}

	// 重置所有条件
	const resetAll = () => {
		Router.push(CONTENT_SEARCH)
	}

	// 回显选中的条件
	useEffect(() => {
		const ids1 = []
		const ids2 = []
		const ids3 = []
		// 收集已选中的类型id, Resource Type
		resourceTypeTree?.map(item => {
			const idList = typefitIds?.find(i => i == item?.id)
			if (idList) {
				ids1.push(idList)
			}
		})
		// 收集已选中的属性id
		attributeTree?.map(item => {
			item?.voList?.map(j => {
				const idList = functionIdList?.find(i => i == j?.id)
				if (idList) {
					ids2.push(idList)
				}
			})
		})
		// 收集已选中的供应商ids
		bransTree?.map(item => {
			item?.voList?.map(j => {
				const idList = query?.manufactureIdList?.split(',')?.find(i => i == j?.id)
				if (idList) {
					ids3.push(Number(idList))
				}
			})
		})

		setCheckedList(ids1)
		setAttributeList(ids2)
		setManufactureIdList(ids3)
	}, [typefitIds, functionIdList, query?.manufactureIdList])

	// 左侧a标签链接
	const getDetailHrefLeft = (item, num = 1) => {

		let params = {
			// 如果是公司新闻或者帮助中文需要拿到所有的子id
			typefitIds: (item?.type === companyNews || item?.type === helpCenter) ?
				(item?.sonIdList.join(',') + `,${item?.id}`) : item?.id
		};
		if (num === 2) {
			params = {
				// 如果是公司新闻或者帮助中文需要拿到所有的子id
				functionIdList: item?.id
			};
		}
		if (num === 3) {
			params = {
				// 如果是公司新闻或者帮助中文需要拿到所有的子id
				manufactureIdList: item?.id
			};
		}

		return `${CONTENT_SEARCH}?${qs.stringify(params)}`;
	}

	const getColName = (item, num) => {
		// 如果数量为0，不可点击
		const isDisabled = item?.newsCount === 0 || !item?.newsCount

		return isAdda ? (
			<Col span={24} key={item?.id}>
				<Checkbox
					style={{ width: '100%', display: 'flex' }}
					value={item?.id}
					disabled={isDisabled} // 是否禁止点击
				>
					<a className='pub-color555 pub-lh20 pub-color-hover-link' style={{ display: 'flex', width: '100%' }}>
						{getLanguageName(item)}{`(${item?.newsCount})`}
					</a >
				</Checkbox>
			</Col>) : (
			<Col span={24} key={item?.id}>
				<Link href={getDetailHrefLeft(item, num)}>
					<a className='pub-color-hover-link' style={{ display: 'block', width: '100%' }}>{getLanguageName(item)}
						({item?.newsCount || 0})
					</a>
				</Link>
			</Col>)
	}
	// 确定搜索
	const handleSearch = async (keyword) => {
		setKeyword(keyword)

		handleChangeUrl(checkedList, attributeList, keyword)

		if (conditionChange) {
			const params = {
				typeIdList: checkedList,
				// columnIdList: attributeList,
				functionIdList: attributeList,
				keyword,
			}
			conditionChange(params)
		}
	}
	// 点击筛选 
	const filterPairClick = item => {
		const findId = openIds?.find(i => i === item?.id) // 是否已经存在id
		if (findId) {
			const arr = openIds.filter(i => i !== item?.id)
			setOpenIds(arr)
		} else {
			setOpenIds([
				...openIds,
				item?.id,
			])
		}
	}

	// 全部关闭或者全部展开
	const openOrClose = () => {
		if (expandHide) {
			setOpenIds([])
		} else {
			setOpenIds(allIds)
		}
		setExpandHide(!expandHide)
	}

	return (
		<div className={`${styles['refine-search-com']} custom-antd-btn-more`}>
			<div className="mb20">
				{/* 检查placeholder多语言 */}
				<MinSearch
					handleSearch={(e) => handleSearch(e)}
					isMultipleKeyword={false}
					searchPlaceholder={iSearchContentTitle}
					defaultKeyword={keyword}
				/>
			</div>
			<div className="pub-flex-shrink pub-border15 w300 blog-content-left-info" style={{ paddingTop: '0px' }}>
				<div className={`${styles['refine-search-title']} pub-flex-between pub-left-title`} style={{ height: '40px', paddingBottom: '0px' }}>
					<div className='pub-left-title'>{iRefineSearch}</div>
					<div className='pub-flex-center pub-cursor-pointer' onClick={() => openOrClose()} style={{ height: '14px' }}>
						<div
							className={"sprite-account-icons " + (expandHide ? 'sprite-account-icons-3-4' : 'sprite-account-icons-3-3')}
						></div>
					</div>
				</div>

				<div>
					{/* Resource Type */}
					<Checkbox.Group value={checkedList} onChange={onChange} className='percentW100'>
						<FilterPair
							filterHeaderName={iResourceType}
							expandHide={openIds?.find(item => item === 99999)}
							filterPairClick={() => filterPairClick({ id: 99999 })}
						>
							<Row>
								{
									resourceTypeTree?.filter(item => item?.id !== 236)?.map(item => {
										return getColName(item, 1)
									})
								}
							</Row>
						</FilterPair>
					</Checkbox.Group>

					{/* Function, Product-Type, Video-Type*/}
					<Checkbox.Group value={attributeList} onChange={(item, b, c) => attributeListChange(item, b, c)} className='percentW100'>
						{
							attributeTree?.map(item => {
								return (
									<FilterPair
										filterHeaderName={getLanguageName(item)}
										expandHide={openIds?.find(i => i === item?.id)}
										key={nanoid()}
										filterPairClick={() => filterPairClick(item)}
									>
										<Row>
											{
												item?.voList?.map(item => {
													return getColName(item, 2)
												})
											}
										</Row>

									</FilterPair>
								)
							})
						}
					</Checkbox.Group>

					{/* 供应商 */}
					<Checkbox.Group value={manufactureIdList} onChange={(item) => brandsChange(item)} className='percentW100'>
						{
							bransTree?.map(item => {
								return (
									<FilterPair
										filterHeaderName={getLanguageName(item)}
										expandHide={openIds?.find(i => i === item?.id)}
										key={nanoid()}
										filterPairClick={() => filterPairClick(item)}
									>
										<Row>
											{
												item?.voList?.map(item => {
													return getColName(item, 3)
												})
											}
										</Row>

									</FilterPair>
								)
							})
						}
					</Checkbox.Group>

					<div className='pub-flex-center'>
						<Button
							type="primary" ghost
							className='ps-add-cart-footer-btn mt20 w100'
							style={{ margin: '0 auto' }}
							onClick={() => resetAll()}
						>
							{iResetAll}
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default RefineSearchCom
