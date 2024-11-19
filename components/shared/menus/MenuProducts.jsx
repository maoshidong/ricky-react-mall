import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { connect, useDispatch } from 'react-redux';
import { Row, Col, Button } from 'antd';
import useLanguage from '~/hooks/useLanguage';
import { useRouter } from 'next/router';
import ProductRepository from '~/repositories/ProductRepository';
import { getAllCatalogs } from '~/store/catalog/action';
import { getEnvUrl, PRODUCTS, PRODUCTS_CATALOG, PRODUCTS_FILTER, PRODUCTS_NEWEST_PRODUCTS, HotProductsRouterList } from '~/utilities/sites-url';
import { RECOMMEND_CATALOG } from '~/utilities/RecommendCatalog'
import LazyCatalogItem from '~/components/shared/menus/LazyCatalogItem';
import { isIncludes } from '~/utilities/common-helpers'
import { Flex } from '~/components/common'
import styles from '~/scss/module/_menuProducts.module.scss'
import classNames from 'classnames';
import map from 'lodash/map'
import tail from 'lodash/tail'

import dynamic from 'next/dynamic';
const SearchHeader = dynamic(() => import('~/components/shared/headers/modules/SearchHeader'));

const MenuProducts = React.memo(({ catalog, curNavId, newsProList }) => {
	const Router = useRouter()
	const { i18Translate, getLanguageName, i18MapTranslate, getDomainsData } = useLanguage();

	const { isNewestCatalogsTree } = catalog
	const dispatch = useDispatch();
	const [allCatalog, setAllCatalog] = useState(RECOMMEND_CATALOG || [])

	const [list, setList] = useState(RECOMMEND_CATALOG?.slice(0, 14))
	const [currentItem, setCurrentItem] = useState(0)
	const [childCatalog, setChildCatalog] = useState([])

	// 获取服务器最新的分类树,替代静态分类,只调用一次,
	async function getList() {
		// isNewestCatalogsTree, '获取服务器最新的分类树,替代静态分类,只调用一次
		if (!isNewestCatalogsTree) {
			dispatch(getAllCatalogs(RECOMMEND_CATALOG || [])) // 获取服务器最新的分类树,替代静态分类,只调用一次
			const res = await ProductRepository.apiGetRecommendCatalogList(0, getDomainsData()?.defaultLocale);
			dispatch(getAllCatalogs(res?.data || [])) // 获取服务器最新的分类树,替代静态分类,只调用一次

			setList(res?.data?.slice(0, 14))
			setAllCatalog(res?.data || [])
		}
	}

	const setData = (voList, index) => {
		setChildCatalog(voList)
		setCurrentItem(index)
	}

	const handleMouseEnter = (item, index) => {
		setData(item.voList, index)
	}

	const handleMouseLeave = (item, index) => {
		setData(item.voList, index)
	}

	useEffect(() => {
		if (curNavId === "products") {
			setChildCatalog(newsProList?.[0]?.voList || RECOMMEND_CATALOG?.[0]?.voList)
		}
	}, [curNavId, newsProList])

	let productsTimer = useRef();
	let removeProductsTimer = useRef();

	const handleNavMouseLeave = e => {
		const menu = document.getElementById('navProduct');
		removeProductsTimer.current = setTimeout(() => {
			menu?.classList?.remove('menu-item-hover');
		}, 10)
		clearTimeout(productsTimer.current)
	}

	const handleNavLeave = () => {
		handleNavMouseLeave()
	}

	useEffect(() => {
		getList()

		return () => {
			clearTimeout(productsTimer.current)
			clearTimeout(removeProductsTimer.current)
		};
	}, [])
	if (!allCatalog || !allCatalog.length) return null;


	{/* a.mb15 DOM 规模过大 /${subItem?.slug}  */ }
	const getChildCatalog = useMemo(() => {
		if (childCatalog?.length === 0) return null
		return (
			childCatalog && childCatalog?.slice(0, 15).map(subItem => {
				let herfUrl = ''
				if (subItem?.isNewPro) {
					herfUrl = `${PRODUCTS_NEWEST_PRODUCTS}?catalogId=${subItem?.id}`
				} else {
					herfUrl = subItem?.voList?.length > 0 ?
						`${PRODUCTS_CATALOG}/${isIncludes(subItem?.slug)}/${subItem?.id}`
						:
						`${PRODUCTS_FILTER}/${isIncludes(subItem?.slug)}/${subItem?.id}`
				}
				return <Col xs={24} sm={24} md={12} lg={8} xl={8} key={'c' + subItem?.id}>
					<Link
						href={herfUrl}
					// href={
					// 	subItem?.voList?.length ?
					// 		`${getEnvUrl(PRODUCTS_CATALOG)}/${subItem?.slug}/${subItem?.id}`
					// 		:
					// 		`${getEnvUrl(PRODUCTS_FILTER)}/${subItem?.slug}/${subItem?.id}`
					// }
					>
						<a
							className='mb10 products-right-catalog pub-flex-align-center box-shadow'
							onClick={() => handleNavLeave()}
						>
							<LazyCatalogItem subItem={subItem} />
						</a>
					</Link>
				</Col>
			})
		)
	}, [childCatalog]);


	const handleUrl = (e, item) => {
		e.preventDefault()
		Router.push(getEnvUrl(item?.url))
	}

	const allCatas = useCallback([...newsProList, ...(allCatalog?.slice(0, 14))], [newsProList])
	const allList = useCallback([...newsProList, ...list], [newsProList])

	// 查看更多按钮
	const viewMoreHref = allList[currentItem]?.id === 'NewestProducts' ? `${PRODUCTS_NEWEST_PRODUCTS}` : `${PRODUCTS_CATALOG}/${isIncludes(allList[currentItem]?.slug)}/${allList[currentItem]?.id}`
	// 是否为英文
	// const isEN = curLanguageCodeEn()

	return (
		<Flex column>
			<Flex alignCenter className={styles.menuProductHead}>
				<Flex className={classNames(styles.headOpearation)} style={{ position: 'relative' }}>
					<Flex justifyEnd className={styles.headViewAll}>
						<SearchHeader searchStyle={{ background: '#fff' }} style={{ width: '302px' }} tipsStyle={{ left: '-4px' }} />
					</Flex>
					<Flex alignCenter flex gap={10} className={styles.headSearched}>
						<Link href={PRODUCTS}>
							<a className={styles.viewAll}>
								<Button type="primary" ghost style={{ padding: '4px 10px', borderColor: '#1770DE' }} className={'pub-flex-center w130'}>
									<div className="" style={{ color: '#1770DE', fontWeight: 500 }}>{i18Translate('i18MenuText.View all products', 'View all products')}</div>
									{/* <div className="sprite-home-min sprite-home-min-3-9" /> */}
								</Button>
							</a>
						</Link>
						{map(tail(HotProductsRouterList), hprl => {
							return <Link key={hprl?.url} href={hprl?.url}>
								<a className={classNames(styles.menuBtn)} onClick={(e) => handleUrl(e, hprl)}>
									{
										i18MapTranslate(`i18MenuText.${hprl.routerName}`, hprl.routerName)
									}
								</a>
							</Link>
						})}
					</Flex>
				</Flex>
			</Flex>

			{/* isEN ? styles.menuProductContent : styles.menuProductContentCN */}
			<Flex className={classNames('nav-about-us custom-antd-btn-more', styles.menuProductContent)}>
				<div className="navigation-fixed-left nav-fixed-left" style={{ marginLeft: '-4px', paddingBottom: '25px', paddingRight: '10px' }}>
					<div className='nav-pub-left mt10'
						onScroll={e => {
							e.stopPropagation()
							e.preventDefault()
						}}
						onWheel={e => {
							e.stopPropagation()
							e.preventDefault()
						}}
						style={{ maxHeight: '465px', overflowY: 'auto', scrollbarWidth: 'none' }}>
						{/* {RECOMMEND_CATALOG?.slice(0, 14)?.map((item, index) => ( */}
						{allCatas?.map((item, index) => {
							let hrefUrl = `${getEnvUrl(PRODUCTS_CATALOG)}/${isIncludes(item.slug)}/${item?.id}`
							if (item?.id === 'NewestProducts') {
								hrefUrl = `${getEnvUrl(PRODUCTS_NEWEST_PRODUCTS)}`
							}

							return <div
								className={'ps-carousel-item navigation-fixed-left-item pub-hover-Box ' + (index === currentItem ? 'nav-active' : '')}
								key={'b' + item?.id}
								onClick={() => handleNavLeave()}
								onMouseEnter={() => {
									handleMouseEnter(item, index);
								}}
								onMouseLeave={() => {
									handleMouseLeave(item, index);
								}}
							>
								<Link href={hrefUrl}>
									<a className={(currentItem === index ? 'active' : '') + ' pub-hover-text'}>
										<div className="navigation-fixed-left-name nav-left-item">
											<div className="name">{getLanguageName(item)}</div>
											<div className={'sprite-home-min ' + (index === currentItem ? 'sprite-home-min-3-9' : 'sprite-home-min-3-10')}></div>
										</div>
									</a>
								</Link>
							</div>
						})}
					</div>
				</div>

				{/* 全部分类 */}
				<div className="navigation-fixed-right">
					<div>
						<Row gutter={10} className="pub-margin-8">
							{
								childCatalog?.length > 0 && getChildCatalog
							}
						</Row>
						{childCatalog?.length > 15 &&
							// `${getEnvUrl(PRODUCTS_CATALOG)}/${isIncludes(allList[currentItem]?.slug)}/${allList[currentItem]?.id}`
							<Link href={viewMoreHref}>
								<a className='mt20 mb15 ml2 pub-content navigation-view-all' style={{ justifyContent: 'flex-start' }}>
									<div className='sub-title pub-color-hover-link'>{i18Translate('i18MenuText.View more', 'View more')}</div>
									<div className='sprite-home-min sprite-home-min-3-9'></div>
								</a>
							</Link>
						}
					</div>
				</div>
			</Flex>
		</Flex>
	)
})

export default connect((state) => state)(MenuProducts);