import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Row, Col } from 'antd';
import { nanoid } from 'nanoid';

import MinSearch from '~/components/ecomerce/minCom/MinSearch';
import SearchNoData from '~/components/ecomerce//minCom/SearchNoData';
import NewItemMin from '~/components/News/NewItemMin';
import HotProductsCatalog from '~/components/partials/product/HotProductsCatalog';
import TitleMore from '~/components/shared/public/titleMore';
import ManufacturerRepository from '~/repositories/zqx/ManufacturerRepository';
import { FilterItem } from '~/components/common';
// import { Link as ScrollLink, Element } from 'react-scroll';
import { useRouter } from 'next/router';
import qs from 'qs';
import { encrypt, isIncludes } from '~/utilities/common-helpers';
import { getEnvUrl, PRODUCTS_CATALOG, PRODUCTS_FILTER, PRODUCTS_UNCLASSIFIED } from '~/utilities/sites-url';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';

const StoreDetail = ({
	manufacturerInitialData, relaNews, hotProductsListServer,
	recommendResServer, greatResServer,
}) => {
	const { i18Translate, getLanguageName, curLanguageCodeEn, getDomainsData } = useLanguage();
	const { iItems, iAppliedFilters } = useI18();
	const iRelatedContent = i18Translate('i18CatalogHomePage.Related Content', 'Related Content')
	const iAbout = i18Translate('i18SmallText.About', 'About');
	const iAboutTit = curLanguageCodeEn ? `${iAbout} ` : iAbout;
	const Router = useRouter();

	const [current, setCurrent] = useState('')
	const [catalogIdList, setCatalogIdList] = useState([{}])
	const { catalogTreeVoList, introduce, website, slug, manufacturerId } = manufacturerInitialData || {}

	const fContainerRef = useRef(null)
	const navRef = useRef(null)
	const filterRef = useRef(null);

	const checkSticky = () => {
		const element = fContainerRef.current;
		if (element) {
			const rect = element.getBoundingClientRect();
			if (rect.top > 0) {
				const hh = 302 - (rect.top - 80)

				const fHeight = filterRef.current?.offsetHeight || 0
				const gapHeight = fHeight - 35

				if (gapHeight > 0) {
					hh = hh - gapHeight
				}

				if (navRef.current) {
					navRef.current.style.maxHeight = `calc(38.5vh + ${hh}px)`
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

	let allCatalogsIds = catalogIdList // 型号搜索的结果ids  + 他们的父分类id
	// let arrCatalogData = [] // 收集供应商所有分类id
	catalogTreeVoList?.map(i => {
		if (i?.voList?.length > 0) {
			i?.voList?.map(j => {
				const catalogItem = catalogIdList?.find(citem => citem?.id == j?.id)
				// 有子分类就加上父分类id
				if (catalogItem) {
					allCatalogsIds.push({
						id: i?.id,
						productCount: i?.productCount,
					})
				}

				if (j?.voList?.length > 0) {
					j?.voList?.map(k => {
						const catalogItem = catalogIdList?.find(citem => citem?.id == k?.id)
						// 有子分类就加上父分类id
						if (catalogItem) {
							allCatalogsIds.push(
								{
									id: i?.id,
									productCount: i?.productCount,
								},
								{
									id: j?.id,
									productCount: j?.productCount,
								},
							)
						}
					})
				}
			})
		}
	})

	const leftCatalogName = catalogTreeVoList?.map(i => {
		return {
			slug: i?.slug,
			id: i?.id,
			name: getLanguageName(i),
		}
	})

	const [searchKeywordArr, setSearchKeywordArr] = useState([]);
	// 搜索型号
	const handleSearch = async (keywordList) => {
		if (keywordList && keywordList?.length > 0) {
			const res = await ManufacturerRepository.apiManufacturersCatalogList({
				languageType: getDomainsData()?.defaultLocale,
				manufacturerSlug: slug,
				keywordList,
			});
			if (res?.code === 0) {
				setCatalogIdList(res?.data?.catalogIdList || [])

			}
		} else {
			setCatalogIdList([])
		}
		setSearchKeywordArr(keywordList || [])
	}
	// 关闭分类条件
	const closeCatalog = () => {
		Router.push(Router.asPath?.split('?')[0])
	}

	const handleKeyEnter = () => {
		checkSticky()
	}

	// 返回url
	const goCatalogPage = (slug, id) => {
		let url = `${getEnvUrl(PRODUCTS_CATALOG)}/${isIncludes(slug)}/${id}`
		const { keywords } = Router?.query
		let params = { manufacturerSlug: slug };
		if (keywords) {
			params.keywords = keywords
		}
		const queryParams = qs.stringify(params)
		if (queryParams) {
			return `${url}?${queryParams}`;
		}
		return url
	}
	// 是否展示分类
	const isShowCatalog = item => {
		return allCatalogsIds.find(i => i?.id === item?.id) || searchKeywordArr?.length === 0
	}

	const leftNavListElm = leftCatalogName?.map((item, index) => {
		if (!(isShowCatalog(item))) return null
		return <div
			className={current === item.id ? 'menu-item-has-children-current' : '' + ' menu-item-has-children'}
			key={`product-line-${index}`}
		// onClick={() => handleCurrentChoose('nav' + item.id)}
		>
			{
				<Link href={goCatalogPage(item?.slug, item?.id)}>
					{/* <Link href={`${PRODUCTS_CATALOG}/${isIncludes(item?.slug)}/${item?.id}`}> */}
					{getLanguageName(item)}
				</Link>
				// <ScrollLink
				// 	to={'nav' + item.id}
				// 	spy={true}
				// 	offset={-84}
				// 	duration={0}
				// 	activeClass="menu-item-has-children-current menu-item-has-children"
				// 	style={{ display: (allCatalogsIds.find(i => i?.id == item?.id) || searchKeywordArr?.length === 0) ? '' : 'none' }}

				// >
				// 	{getLanguageName(item)}
				// </ScrollLink>
			}
		</div>
	})

	const otherParams = {
		delSearchKeywords: true
	}

	const getRouterUrl = (url) => {
		let routerUrl = url
		// 是否有查询条件
		if (searchKeywordArr && searchKeywordArr?.length > 0) {
			routerUrl = routerUrl + '&keywords=' + encrypt(searchKeywordArr.join(',') || '')
		}
		return routerUrl
	}

	return (
		<div className="ps-vendor-store" style={{ paddingBottom: (website || introduce) ? 0 : '80px' }}>
			<div className="ps-container">
				<div className="ps-section__container manufacturer-detail-container">
					{/* 左侧 */}
					<div ref={fContainerRef} className="pub-layout-left catalogs__top-fixed">
						<div className='pub-left-title'>{i18Translate('i18PubliceTable.PartNumber', 'Part Number')}</div>
						<div ref={filterRef} className='mt10'>
							<MinSearch
								handleSearch={(e) => handleSearch(e)}
								otherParams={otherParams}
								onEnter={handleKeyEnter}
							/>
							{/* 条件集合 */}
							{(Router?.query?.catalogId) && (
								<div className="applied-filters pub-flex-align-center mt10">
									<div className="pub-fontw pub-font14 mb3">{iAppliedFilters}:</div>

									{
										(Router?.query?.catalogId) && (
											<FilterItem text={catalogTreeVoList?.[0]?.name} onClick={() => closeCatalog()} />
										)
									}

									{/* {withinResults?.map((item, index) => (
										<FilterItem text={item} key={index} onClick={() => closeWithinResults(index)} />
									))} */}
								</div>
							)}
						</div>

						<div className='mt20 layout-left-nav'>
							<div className='layout-left-header'>
								<h2 className='mb5 pub-left-title'>{i18Translate('i18CatalogHomePage.Product Line', 'Product Line')}</h2>
							</div>
							<div ref={navRef} className='layout-left-content' style={{ maxHeight: '38.5vh' }}>
								<div className="layout-menu-box">
									{leftNavListElm}
								</div>
							</div>
						</div>
					</div>

					{/* 右侧 */}
					<div className='pub-layout-right'>
						{
							(allCatalogsIds?.length !== 0 || catalogTreeVoList?.length !== 0) && (catalogTreeVoList?.map((item) => {
								// if (item?.voList?.length === 0) return null
								return <div
									className={`mb30 ` +
										(isShowCatalog(item) ? 'show' : 'hide')
									}
									key={nanoid()} id={'nav' + item.id}>
									<div className='mb10'>
										<Link href={goCatalogPage(item?.slug, item?.id)}>
											<a className='pub-color-hover-link pub-left-title'> {getLanguageName(item)} </a>
										</Link>
									</div>
									{/* style={{gap: '10px'}} */}
									<Row gutter={[10, 10]}>
										{item?.voList?.map(subItem => {
											let hrefUrl = getRouterUrl(`${PRODUCTS_FILTER}/${isIncludes(subItem?.slug)}/${subItem?.id}?manufacturerSlug=${slug}`)

											if (subItem?.voList.length > 0) {
												// 分类传供应商id  ?manufacturerId=${manufacturerId}
												hrefUrl = getRouterUrl(`${PRODUCTS_CATALOG}/${isIncludes(subItem?.slug)}/${subItem?.id}?manufacturerSlug=${slug}`)
											}

											// 如果未分类则跳转到对应的页面
											if (subItem?.id == 844) {
												hrefUrl = getRouterUrl(`${PRODUCTS_UNCLASSIFIED}/?manufacturerId=${manufacturerId}`)
											}

											return <Col xl={6} lg={8} md={12} sm={12} xs={24}
												className={` ` +
													(isShowCatalog(subItem) ? 'show' : 'hide')
												}
												key={nanoid()}
											>
												<Link
													key={nanoid()}
													href={hrefUrl}
												>
													<a>
														<div className='ps-product-catalog-item pub-layout-catalog-item box-shadow'>
															<img
																src={`${subItem?.image}`}
																alt={getLanguageName(subItem)}
																title={getLanguageName(subItem)}
																className='ps-product-catalog-img'
															/>
															<div className='pub-direction-column'>
																<p className='ps-product-catalog-name pub-clamp3 pub-line-clamp'>
																	{getLanguageName(subItem)}
																</p>
																{
																	<div className='catalogsCount pub-font12 pub-color555 mt5'>{subItem?.productCount} {iItems}</div>
																}
															</div>
														</div>
													</a>
												</Link>
											</Col>
										})}
									</Row>
								</div>
							}
							))
						}

						{/* 有搜索条件并且返回数据为空， 或者初始数据为空 */}
						{
							((searchKeywordArr?.length !== 0 && allCatalogsIds?.length === 0) || catalogTreeVoList?.length === 0) && (
								<SearchNoData />
							)
						}

					</div>
				</div>
				{/* HotProductsRecommended <div className='mt60 pub-left-title mb10'>{i18Translate('i18HomeNextPart.productsTitle', "Featured Products")}</div> */}
				{/* <div style={{marginBottom: '-80px'}}>
                    <div className='mt60 mb30 pub-title-more'>
                        <div className='pub-title'>{i18Translate('i18HomeNextPart.productsTitle', "Featured Products")}</div>
                    </div>

                    <ProductsRecommended
                        type="2"
                        hotProductsList={hotProductsListServer}
                        recommendResServer={recommendResServer}
                        greatResServer={greatResServer}
                    /> 
                </div> */}
				{/* FEATURED PRODUCTS */}
				<HotProductsCatalog
					hotProductsList={hotProductsListServer}
					recommendResServer={recommendResServer}
					greatResServer={greatResServer}
				/>

				{/* {
                    hotProductsListServer?.length > 0 && <div style={{marginBottom: '-80px'}}>
                        <div className='mt60 mb30 pub-title-more'>
                            <div className='pub-title'>{i18Translate('i18MenuText.Hot Products', "Hot Products")}</div>
                        </div>

                        <HotProductsRecommended
                            type="2"
                            hotProductsList={hotProductsListServer}
                            recommendResServer={recommendResServer}
                            greatResServer={greatResServer}
                        /> 
                    </div>
                }

                {
                    recommendResServer?.length > 0 && <div style={{marginBottom: '-80px'}}>
                        <div className='mt60 mb30 pub-title-more'>
                            <div className='pub-title'>{i18Translate('i18MenuText.Recommended Products', "Recommended Products")}</div>
                        </div>

                        <HotProductsRecommended
                            type="2"
                            hotProductsList={recommendResServer}
                            recommendResServer={recommendResServer}
                            greatResServer={greatResServer}
                        /> 
                    </div>
                }

                {
                    greatResServer?.length > 0 && <div style={{marginBottom: '-80px'}}>
                        <div className='mt60 mb30 pub-title-more'>
                            <div className='pub-title'>{i18Translate('i18MenuText.Discount Products', "Discount Products")}</div>
                        </div>

                        <HotProductsRecommended
                            type="2"
                            hotProductsList={greatResServer}
                            recommendResServer={recommendResServer}
                            greatResServer={greatResServer}
                        /> 
                    </div>
                } */}


				{/* 相关新闻 */}
				{
					relaNews?.data?.length > 0 && <div className='mt60 mb30 pub-title-more'>
						<div className='pub-title'>{iRelatedContent}</div>
					</div>
				}
				{
					<Row gutter={[10, 10]} className='pub-flex-wrap'>
						{relaNews?.data?.slice(0, 6)?.map((item, index) => {
							return (
								<Col xs={24} sm={12} md={12} xl={8} lg={8} key={index}
									className='pub-flex' style={{ alignItems: 'stretch' }}
								>
									<div><NewItemMin item={item} /></div>
								</Col>
							)
						})}
					</Row>
				}

				{/* <CatalogDescription
                    catalogName={manufacturerInitialData?.name}
                    description={manufacturerInitialData?.introduce}
                >
                    {
                        manufacturerInitialData?.website && (
                            <div className="ps-block__footer pub-flex-center ml30 pub-color-link" onClick={() => window.open(manufacturerInitialData?.website, '_blank')}>
                                {i18Translate('i18CatalogHomePage.Our Website', 'Our Website')}
                            </div>
                        )
                    }
                </CatalogDescription> */}
				{/* {
                    <div className='pub-flex-wrap' style={{ alignItems: 'stretch' }}>
                        {relaNews?.data?.slice(0, 6)?.map(item => {
                            return (
                                <div key={nanoid()} className='pub-flex mr15' style={{maxWidth: '450px', alignItems: 'stretch'}}>
                                    <div className='mb10'><NewItemMin item={item} /></div>
                                </div>
                            )
                        })}
                    </div>
                } */}

			</div>
			{/* website || introduce */}
			{(introduce) && (
				<div className='mt60' style={{
					background: '#fff',
					paddingTop: '20px'
				}}>
					{
						introduce &&
						<TitleMore
							title={iAboutTit + manufacturerInitialData?.name}
							subTitle={!!website ? i18Translate('i18CatalogHomePage.Our Website', 'Our Website') : ''}
							linkUrl={website}
							isLink={false}
							titleH1={true}
						/>
					}
					{
						introduce && <div className="mt20" style={{
							maxWidth: '1440px',
							margin: '0 auto',
							paddingBottom: '60px'
						}}>
							<div className='vue-ueditor-wrap' dangerouslySetInnerHTML={{ __html: manufacturerInitialData?.introduce }}></div>
						</div>
					}
				</div>
			)}
		</div>
	);
};

export default StoreDetail;
