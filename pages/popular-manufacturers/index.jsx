import React, { useEffect, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { Link as ScrollLink } from 'react-scroll';
import Head from 'next/head';
import { nanoid } from 'nanoid';

import upperCase from 'lodash/upperCase';
import sortBy from 'lodash/sortBy';
import toLower from 'lodash/toLower';
import trim from 'lodash/trim';
import { Button } from 'antd';
import { CustomInput, PubTabLink } from '~/components/common';
import { connect, useDispatch } from 'react-redux';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
import PageContainer from '~/components/layouts/PageContainer';

import SearchNoData from '~/components/ecomerce/minCom/SearchNoData'; // 无数据展示
import ManufacturerTabs from '~/components/partials/manufacturer/ManufacturerTabs'; // 页面导航
import { setRecommendManufacturerList } from '~/store/ecomerce/action';
import classNames from 'classnames';
import { ManufacturerRepository } from '~/repositories';
// import CommonRepository from '~/repositories/zqx/CommonRepository';
import { scrollToTop, isIncludes } from '~/utilities/common-helpers';
import { All_SEO1 } from '~/utilities/constant';
import { MANUFACTURER, POPULAR_MANUFACTURERS } from '~/utilities/sites-url'
import { getLocale, changeServerSideLanguage } from '~/utilities/easy-helpers';
import banStyles from '~/components/common/layout/_PubPageBanner.module.scss';

// 品牌管理中品牌主页状态slugStatus: 0 关闭 1 开启，开启才能跳转到品牌主页
// 制造商和产品分类，关闭了总状态，从一级分类到产品详情页，仅用户端不展示和不可搜索，所有的页还是可以打开。
// 关于品牌分类
// 品牌分类 状态：未启用，不显示在用户端制造商列表页面(现在是对的)
// 产品上架数量为0个的品牌，品牌分类状态为未启用
// 关于品牌管理
// 状态：关闭此状态，该品牌下面的所有产品不展示， 也不能搜索（全部产品都关闭：包括最新产品，热卖，推荐，折扣， 包括推荐供应商）。
// 相关接口： getProductListFreeWebEs, getRecommendManufacturersListWeb, getPopularListWeb,  getRecommendListWeb, getDiscountListWeb, getNewProductListWeb,
// 品牌主页状态：关闭此状态，该品牌的产品无法跳转到制造商主页和制造商主页不展示在用户端（关闭后，不能跳转到供应商主页，(只针对供应商和型号在一起的情况， 其它能正常跳转： 如推荐供应商能正常跳)）
const PopularManufacturersCom = ({ paramMap, seo, global, ecomerce, recommendManufacturers }) => {
	const { i18Translate, getLanguageHost, getLanguageName, getDomainsData } = useLanguage();
	const { iAllManufacturers, iPopularManufacturers } = useI18();

	let timer = useRef();

	const dispatch = useDispatch();
	const { recommendManufacturerList } = ecomerce
	// 手动写_groupBy分组, 迭代函数将数组元素分组，并返回一个以分组键为属性名、以对应元素组成的数组为属性值的对象。如果输入的list不是数组或iteratee不是函数，则抛出错误。在循环遍历数组时，对每个元素应用iteratee函数得到分组键，如果结果对象中不存在该键，则初始化一个空数组，然后将当前元素添加到对应键的数组中
	const myGroupBy = (list, iteratee) => {
		if (!Array.isArray(list)) {
			throw new Error('groupBy expects the first argument to be an array');
		}

		if (typeof iteratee !== 'function') {
			throw new Error('groupBy expects the second argument to be a function');
		}

		const result = {};

		for (let i = 0; i < list.length; i++) {
			const key = iteratee(list[i], i, list);
			if (!result[key]) {
				result[key] = [];
			}
			result[key].push(list[i]);
		}
		return result;
	}
	const calculateGroupAndSortNew = (list) => {
		const arr = list?.filter(item => item?.name)?.map(item => {
			return {
				name: item?.name,
				cname: item?.cname,
				slug: item?.slug,
				initial: upperCase(item?.name?.substring(0, 1)),
				id: item.id
			}
		})
		return myGroupBy(sortBy(arr, 'name'), item => item?.initial)
		// return _groupBy(_sortBy(arr, 'name'), 'initial')
	}

	const [searchText, setSearchText] = useState(null);

	const [current, setCurrent] = useState('')
	const [tabActive, seTabActive] = useState(iPopularManufacturers)

	const handleAll = () => {
		scrollToTop()
	}

	const renderGroup = (key, list) => {
		// const indexs = list?.map(item => {
		//     return <Col xs={24} sm={12} md={8} xl={8} lg={8} key={item.id} className='li pub-color-hover-link'>
		//         {/* /${item?.parentId || item.id} */}
		//         <Link href={`${MANUFACTURER}/${item.slug}`}>
		//             {item?.name}
		//         </Link>
		//     </Col>
		// });
		return (
			// <Element name={key} key={key}>
			<div className='manufacturer-item box-shadow'>
				<h3 className='manufacturer-header' name={key}>
					{key}
				</h3>
				{/* 新版 */}
				<div className='ul'>
					{list?.map(item => {
						return <Link href={`${MANUFACTURER}/${isIncludes(item.slug)}`}>
							<a className='li'>{getLanguageName(item)}</a>
						</Link>
					})}
				</div>
			</div>
			// </Element>
		)
	}

	// 或者，如果renderGroup函数很昂贵，并且结果可以被缓存，你可以使用useMemo
	// 但请注意，useMemo应该在组件内部使用，而不是在渲染函数内部

	const stickyHeader = () => {
		setCurrent('')
		let number =
			window.pageXOffset ||
			document.documentElement.scrollTop ||
			document.body.scrollTop ||
			0;
		const header = document.getElementById('pubSticky');
		if (header !== null) {
			if (number >= 280) {
				header.classList.add('pubSticky');
			} else {
				header.classList.remove('pubSticky');
			}
		}
	};

	async function getList() {
		const params = {
			pageNum: 1,
			pageSize: 50,
			keyword: searchText,
			languageType: getDomainsData()?.defaultLocale
		}
		const res = await ManufacturerRepository.getRecommendListWeb(params);
		if (res && res?.code === 0) {
			const list = res?.data?.data || []
			dispatch(setRecommendManufacturerList(list))
		}
	}

	useEffect(async () => {

		getList();
		if (process.browser) {
			window.addEventListener('scroll', stickyHeader);
		}
	}, []);
	useEffect(() => {
		getList()
	}, [searchText]);

	const handleSearch = (e) => {
		clearTimeout(timer.current)
		const searchText = toLower(trim(e.target.value));
		setSearchText(searchText)
	}

	const handHead = text => {
		return `${iPopularManufacturers}, ${text}`
	}

	// const iUeditorManufacturersDes = i18Translate('i18Ueditor.ManufacturersDes', "ManufacturersDes")
	const iUeditorManufacturersDes = i18Translate('i18Ueditor.ManufacturersDes', "ManufacturersDes")

	const { manufacturerTit, manufacturerKey, manufacturerDes } = All_SEO1?.manufacturer
	const i18Title = i18Translate('i18Seo.popularManufacturers.title', manufacturerTit)
	const i18Key = i18Translate('i18Seo.popularManufacturers.keywords', manufacturerKey)
	const i18Des = i18Translate('i18Seo.popularManufacturers.description', manufacturerDes)
	return (
		<PageContainer paramMap={paramMap} seo={seo} global={global}>
			<Head>
				<title>{handHead(i18Title)}</title>
				<meta property="og:title" content={handHead(i18Title)} key="og:title" />
				<meta name="keywords" content={handHead(i18Key)} key="keywords" />
				<meta name="description" content={handHead(i18Des)} key="description" />
				<meta name="og:description" content={handHead(i18Des)} key="og:description" />

			</Head>
			<div className="ps-manufacturer ps-page--shop ps-store-list pub-minh-1 custom-antd-btn-more pb60">

				<div className={classNames('pub-top-bgc pub-top-bgc-minh260', banStyles.pubTopBgc)}>
					<div className={classNames(banStyles.popularManufacturersBgc)}></div>
					{/* <img className={classNames('pub-top-img', banStyles.popularManufacturersBgc)} src='/static/img/bg/popular-manufacturers.webp' alt="banner" /> */}

					<div className='ps-container pub-top-bgc-content'>
						<h1 className='pub-font36 pub-fontw pub-top-bgc-title'>{iPopularManufacturers}</h1>
						<div
							className='pub-font16 pub-lh20 pub-top-bgc-des percentW50 vue-ueditor-wrap'
							dangerouslySetInnerHTML={{ __html: iUeditorManufacturersDes }}
						></div>
						<div className="ps-section__search mt30">
							<div className="form-group">
								<CustomInput
									className="form-control"
									type="text"
									placeholder={i18Translate('i18CatalogHomePage.Search by Manufacturer', 'Search by Manufacturer')}
									onInput={handleSearch}
									style={{ background: '#fff' }}
								/>
								<div className='search-btn sprite-icons-1-3'></div>
							</div>
						</div>
					</div>
				</div>
				<ManufacturerTabs tabActive={tabActive} />



				<>
					{/* <FeaturedManufacturer type="mIndex" /> */}
					{
						recommendManufacturerList?.length > 0 && (
							<>
								<div className="ps-product-list blocks-featured-manufacturer">
									<div className="ps-container">
										<div className='row pub-margin-8 mt20'>
											{recommendManufacturerList?.map(item => (
												// /${item?.parentId || item?.id}
												<Link href={`${MANUFACTURER}/${isIncludes(item.slug)}`} key={nanoid()}>
													<a
														className='col-xl-3 col-md-4 col-sm-4 col-6 col-sm-6'
														key={nanoid()}
														style={{ padding: '0 8px' }}
													>
														<div className='featured-manufacturer-item'>
															{/* <LazyLoad> */}
															<img
																className='featured-manufacturer-img'
																src={item.logo}
																alt={getLanguageName(item)}
																title={getLanguageName(item)}
															/>
															{/* </LazyLoad> */}
														</div>
													</a>
												</Link>
											))}
										</div>
									</div>
								</div>
								{/* view-all */}
								<div className='ps-container pub-flex-center'>
									<Link href={MANUFACTURER} key={nanoid()}>
										<a>
											<Button type="primary" ghost className='pub-flex-center w220 mt20' onClick={() => handleAll()}>
												{i18Translate('i18CatalogHomePage.View All Manufacturers', 'View All Manufacturers')}

												<div className='sprite-home-min sprite-home-min-3-9 ml20'></div>
											</Button>
										</a>
									</Link>
								</div>
							</>
						)
					}
					<div className='ps-container'>
						{
							recommendManufacturerList?.length === 0 && (
								<SearchNoData />
							)
						}
					</div>

				</>

			</div>
		</PageContainer >
	);
};

export default connect(state => state)(PopularManufacturersCom)

export async function getServerSideProps({ req, query }) {
	const languageType = getLocale(req)
	const params = {
		pageNum: 1,
		pageSize: 50,
		keyword: '',
		languageType,
	}
	const [translations, recommendManufacturers] = await Promise.all([
		changeServerSideLanguage(req),
		ManufacturerRepository.apiRecommendManufacturers(params),
	]);

	return {
		props: {
			...translations,
			recommendManufacturers: recommendManufacturers?.data?.data || '',
			query,
			languageType,
		}
	}
};