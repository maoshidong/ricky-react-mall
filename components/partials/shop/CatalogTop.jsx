import React, { useState, useMemo, useRef, useEffect } from 'react';
import LazyLoad from 'react-lazyload';
import qs from 'qs';
import Link from 'next/link';
import { useRouter } from 'next/router';
// import { Link as ScrollLink, Element } from 'react-scroll';
import { getThousandsDataInt } from '~/utilities/ecomerce-helpers';
import useLanguage from '~/hooks/useLanguage';
import TellUsRequest from '~/components/ecomerce/modules/tellUsRequest';
import SearchNoData from '~/components/ecomerce//minCom/SearchNoData';
import MinQuerySearch from '~/components/ecomerce/minCom/MinQuerySearch';
import { encrypt, isIncludes } from '~/utilities/common-helpers'
import { PRODUCTS_FILTER, PRODUCTS_CATALOG, PRODUCTS } from '~/utilities/sites-url';
import includes from 'lodash/includes';
import cloneDeep from 'lodash/cloneDeep';

const CatalogTop = ({ allCatalog, queryKeywords, results, keywordsProducts, top20Flag, paramMap }) => {
	const { i18Translate, getLanguageName, getLanguageEmpty } = useLanguage();
	const Router = useRouter();
	const { asPath } = Router
	const [current, setCurrent] = useState('')
	// 是否有搜索关键词
	const isHaveQueryKeywords = queryKeywords && queryKeywords?.length > 0 && queryKeywords[0] !== '' || !!top20Flag
	const { catalogIdList } = keywordsProducts

	const iItem = i18Translate('i18SmallText.Items', 'Items')
	const getCatalogsCount = subItem => {
		// catalogIdList 后端返回的数据，只有最下级才有产品数量
		// 所有当有搜索条件时只有最下级分类有数据 { "id": 584, "productCount": 1 }
		const catalogItem = catalogIdList?.find(item => item?.id == subItem?.id)
		return isHaveQueryKeywords ? (catalogItem?.productCount ?
			`${getThousandsDataInt(catalogItem?.productCount)} ${iItem}` : '') :
			`${getThousandsDataInt(subItem?.productCount)} ${iItem}`
	}

	let newCategories = isHaveQueryKeywords ? [] : cloneDeep(allCatalog); // 深拷贝

	let firstCatalogsIds = [] // 收集所有二级分类id, 判断是否展示二级分类， 三级的上一级也算
	let twoCatalogsIds = [] // 收集所有三级分类id, 判断是否展示三级分类
	let threeCatalogsIds = [] // 收集所有四级分类id, 判断是否展示四级分类

	const fContainerRef = useRef(null)
	const navRef = useRef(null)
	const filterRef = useRef(null);

	const checkSticky = () => {
		const element = fContainerRef.current;
		if (element) {
			const rect = element.getBoundingClientRect();
			if (rect.top > 0) {
				const hh = 270 - (rect.top - 80)

				const fHeight = filterRef.current?.offsetHeight || 0
				const gapHeight = fHeight - 35

				if (gapHeight > 0) {
					hh = hh - gapHeight
				}

				if (navRef.current) {
					navRef.current.style.maxHeight = `calc(41.5vh + ${hh}px)`
				}
			}
		}
	}

	useEffect(() => {
		// 监听浏览器滚动事件
		window.addEventListener('scroll', checkSticky);
		// 组件卸载前移除监听
		return () => window.removeEventListener('scroll', checkSticky);
	}, [])

	const getProductInfo = (Item) => {
		return {
			productCount: Item?.productCount,
			productIdList: Item?.productIdList
		}
	}

	// 有条件才需要计算 - 根据搜索条件返回的catalogIdList判断展示哪些分类
	if (isHaveQueryKeywords) {
		allCatalog?.forEach(item => {
			// 二级
			item?.voList?.map(i => {
				const catalogItem = catalogIdList?.find(citem => citem?.id == i?.id)
				if (catalogItem) {
					newCategories.push({
						...item, // 加上...item, 意思是有子级就添加最顶级
						// productCount: catalogItem?.productCount,
						...getProductInfo()
					})
					firstCatalogsIds.push(i?.id)
				}
				// 三级
				i?.voList?.map(j => {
					const catalogItem = catalogIdList?.find(citem => citem?.id == j?.id)
					if (catalogItem) {
						newCategories.push({
							...item,
							// productCount: catalogItem?.productCount,
							...getProductInfo()
						})
						firstCatalogsIds.push(i?.id)
						twoCatalogsIds.push(j?.id)
					}
					// 四级
					j?.voList?.map(k => {
						const catalogItem = catalogIdList?.find(citem => citem?.id == k?.id)
						if (catalogItem) {
							newCategories.push({
								...item,
								// productCount: catalogItem?.productCount,
								...getProductInfo()
							})
							firstCatalogsIds.push(i?.id)
							twoCatalogsIds.push(j?.id)
							twoCatalogsIds.push(k?.id)
							// threeCatalogsIds.push(k?.id)
						}
					})
				})
			})
		})
	}

	const uniqueCategoriesArr = [...new Map(newCategories?.map(item => [item.id, item])).values()]; //去重

	const letNavArr = (isHaveQueryKeywords && results > 0) ? uniqueCategoriesArr : allCatalog

	// 返回分类url
	const goCatalogPage = (slug, id) => {
		let url = `${PRODUCTS_CATALOG}/${isIncludes(slug)}/${id}`
		const { keywords } = Router?.query
		let params = {};
		if (keywords && results > 0) {
			params.keywords = keywords
		}
		const queryParams = qs.stringify(params)
		if (queryParams) {
			return `${url}?${queryParams}`;
		}
		return url
	}

	const leftFirstLevelCategories = letNavArr?.map(item => (
		<li
			className={current === item.id ? 'menu-item-has-children-current' : '' + ' menu-item-has-children'}
			key={'left' + item?.id}
		// onClick={() => handleCurrentChoose(item.id)}
		// onClick={() => handleCurrentChoose('nav' + item.id)}
		>
			<Link href={goCatalogPage(item?.slug, item?.id)}>
				{/* <Link href={`${PRODUCTS_CATALOG}/${item?.slug}/${item?.id}`}> */}
				<a onClick={(e) => resetLink(e, item)}>{getLanguageName(item)}</a>
			</Link>
			{/* {
                (results !== 0) &&
                <ScrollLink
                    to={'nav' + item.id}
                    spy={true}
                    // offset={() => {
                    //     const topOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                    //     return -topOffset;
                    // }}
                    offset={-84}
                    // smooth={true}
                    duration={0}
                    activeClass="menu-item-has-children-current menu-item-has-children"
                >
                </ScrollLink>
            } */}
		</li>
	));

	// 获取filterurl
	const getFilterUrl = (url, others) => {
		// 从当前页面路径中获取查询参数部分
		const queryParams = asPath.split('?')[1];

		// 如果存在查询参数
		if (queryParams) {
			const params = new URLSearchParams(queryParams);

			// 检查是否包含 flag=true
			// if (params.has('flag') && params.get('flag') === 'true') {
			// 		params.delete('flag'); // 删除 flag 参数
			// }

			// 重新构建查询参数字符串
			const filteredParams = params.toString();

			// 如果有过滤后的查询参数，重新构建 URL
			if (filteredParams) {
				url += '?' + filteredParams;
			}
		}

		if (!!others) {
			if (includes(url, '?')) {
				url += `&productIdList=${others}`
			} else {
				url += `?${others}`
			}
		}

		return url;
		// let routerUrl = asPath.split('?')[1]
		// let goUrl = url
		// if (routerUrl) {
		// 	goUrl = `${url}?` + routerUrl
		// }
		// return goUrl
	}

	// 判断是直接跳转到详情还是 和下级跳转的 url一致
	const resetLink = (e, item) => {
		// 查找当前voList下有多少个子分类， 有多个时，就正常跳转，当个就跳转到子级

		// 使用 filter 和 some 方法来查找匹配的数量
		const matchesList = item?.voList?.filter(a => [...firstCatalogsIds, ...twoCatalogsIds, ...threeCatalogsIds].some(b => b === a?.id));
		if (matchesList?.length === 0) {
			// 一个都没匹配,但显示了,说明没有搜索词,正常跳转
			// const url = item?.voList?.length > 0 ?
			// goCatalogPage(isIncludes(item?.slug), item?.id) :
			// getFilterUrl(`${PRODUCTS_FILTER}/${isIncludes(item?.slug)}/${item?.id}`)
			// Router.push(url)
			return
		}
		e?.preventDefault();

		if (matchesList?.length === 1) {
			if (matchesList?.[0]?.voList?.length > 0) {
				resetLink(e, matchesList?.[0]) // 只有一个时，且匹配的voList大于0时拿voList继续递归
			} else {
				Router.push(getFilterUrl(`${PRODUCTS_FILTER}/${isIncludes(matchesList?.[0]?.slug)}/${matchesList?.[0]?.id}`))
			}
		} else {
			// 下级有多个分类直接跳转
			Router.push(goCatalogPage(isIncludes(item?.slug), item?.id))
		}
	}

	// 右侧分类item
	const rightNameItem = (child, subItem) => {
		const catalogItem = catalogIdList?.find(item => item?.id == child?.id)
		let pIdList = ''
		if (catalogItem?.productIdList?.length > 0) {
			pIdList = encrypt(catalogItem?.productIdList?.join('____'))
		}
		return <Link href={
			child?.voList?.length > 0 ?
				goCatalogPage(isIncludes(child?.slug), child?.id) :
				getFilterUrl(`${PRODUCTS_FILTER}/${isIncludes(child?.slug)}/${child?.id}`, pIdList)
		}>
			<a onClick={(e) => resetLink(e, child)}>
				{getLanguageName(child)}
				<span className='ml10 pub-color555 catalog-num pub-font12'>{getCatalogsCount(child)}</span>
			</a>
		</Link>

	}
	// 分类右侧
	const rightCategories = useMemo(() => {
		return (
			uniqueCategoriesArr?.map(item => {
				return <div
					className="ps-block--category-2 box-shadow"
					key={item?.id}
					id={'nav' + item.id}
				>
					{/* 顶级分类图 */}
					<div className="ps-block__thumbnail">
						<LazyLoad>
							<img
								src={`${item?.thumb || item?.image || getLanguageEmpty()}`}
								alt={getLanguageName(item)}
								title={getLanguageName(item)}
								className='catalog-top-img'
							/>
						</LazyLoad>
					</div>
					<div className="ps-block__content percentW100">
						{/* 顶级分类名称 */}
						<Link href={goCatalogPage(item?.slug, item?.id)} >
							<a onClick={(e) => resetLink(e, item)}>
								<h2 className='mb10 pub-font16 pub-color18 pub-color-hover-link'>
									{getLanguageName(item)}
								</h2>
							</a>
						</Link>
						{
							item?.voList && (
								<ul className={isHaveQueryKeywords ? 'catalog-column-count-keyword catalog-column-count ' : 'catalog-column-count'}>
									{item?.voList?.map((subItem) => {
										// 只展示二级分类有的id， 或者没有搜索关键词时展示
										if (firstCatalogsIds.find(item => item == subItem?.id) || !isHaveQueryKeywords) {
											return <li key={subItem?.id} className='catalog-column-li'>
												{rightNameItem(subItem, subItem)}

												{subItem?.voList?.length > 0 &&
													<ul className='catalog-ul'>
														{subItem?.voList?.map(child => {
															// 只展示三级分类有的id， 或者没有搜索关键词时展示
															if (twoCatalogsIds.find(item => item == child?.id) || !isHaveQueryKeywords) {
																return <li key={child?.id} className='pub-color-hover-link catalog-ul-item'>
																	{rightNameItem(child, subItem)}
																</li>
															}
														})}
													</ul>
												}
											</li>
										}
									})}
								</ul>
							)
						}
					</div>

				</div>
			})
		)
	}, [uniqueCategoriesArr]);

	// title={child?.name}
	// style={{
	//     overflow: 'hidden',
	//     textOverflow: 'ellipsis',
	//     whiteSpace: 'nowrap',
	// }}
	// <Element name={item.id}>

	const getLeft = () => {
		return <div ref={fContainerRef} className='catalogs__top-fixed w300 mt20'>
			{!top20Flag && (
				<>
					<div className='pub-left-title'>{i18Translate('i18SmallText.Search Part Number', 'Search Part Number')}</div>
					<div ref={filterRef} className='mt10'>
						<MinQuerySearch
							handleSearch={(e) => handleSearch(e)}
							otherParams={otherParams}
							onEnter={handleKeyPress}
						/>
					</div>
				</>)}
			<div className={`ps-block--menu-categories ${!!top20Flag ? '' : 'mt20'}`}>
				<div className="ps-block__header">
					<h3>{(results == 0) ? iProducts : iCategories}</h3>
				</div>
				<div ref={navRef} className="ps-block__content left-nav" style={{ maxHeight: "41.5vh", overflow: 'auto' }}>
					{
						letNavArr && (
							<ul className="ps-list--menu-cateogories">
								{leftFirstLevelCategories}
							</ul>
						)
					}
				</div>
			</div>
		</div>
	}

	// 输入框搜索
	const handleSearch = async (keywordList) => {
		if (keywordList?.length === 0) {
			Router.push(PRODUCTS)
			return
		}
		const toQueryKeywords = encrypt(keywordList.join('____') || '')
		Router.push(`${PRODUCTS}?keywords=` + toQueryKeywords || '')
	}

	const handleKeyPress = () => {
		checkSticky()
	}

	const otherParams = {
		queryKeywords,
		delSearchKeywords: isHaveQueryKeywords ? false : false
	}
	const iProducts = i18Translate('i18Head.products', 'PRODUCTS')
	const iCategories = i18Translate('i18CatalogHomePage.Categories', 'Categories')

	return (
		<div className="ps-catalog-top" style={{ padding: '10px 0 0' }}>

			{/* gutter={20} */}
			<div className="pub-flex-wrap">
				{/* <div className="row"> */}
				{/* <div id="catalogs" className="col-xl-3"> */}
				{/* className='catalogs__top-sticky' */}

				{/* 左侧 */}
				{getLeft()}
				{/* 右侧 */}
				<div id="rightCatalogs" className='rightCatalogs__float'>
					{
						(!isHaveQueryKeywords || results > 0) && <div className="ps-block--categories-grid pub-bgcdf5">
							{rightCategories}
						</div>
					}

					{
						(isHaveQueryKeywords && results == 0) && (
							<div className='mt20 ml20'>
								<div className='box-shadow'>
									<SearchNoData />
								</div>
								<div className='mt20'>
									<TellUsRequest paramMap={paramMap} />
								</div>
							</div>
						)

					}
				</div>

			</div>
		</div>
	);
};

export default CatalogTop;
