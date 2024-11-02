import React, { useEffect, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { Link as ScrollLink } from 'react-scroll';
import Head from 'next/head';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/router';

import upperCase from 'lodash/upperCase';
import toLower from 'lodash/toLower';
import trim from 'lodash/trim';
import { Button } from 'antd';
import { CustomInput, PubTabLink } from '~/components/common';
import classNames from 'classnames';
import banStyles from '~/components/common/layout/_PubPageBanner.module.scss';
import { connect, useDispatch } from 'react-redux';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
import PageContainer from '~/components/layouts/PageContainer';
// import { PageHeaderShadow } from '~/components/ecomerce';
import SearchNoData from '~/components/ecomerce/minCom/SearchNoData'; // 无数据展示
import ManufacturerTabs from '~/components/partials/manufacturer/ManufacturerTabs'; // 页面导航
import { setRecommendManufacturerList } from '~/store/ecomerce/action';
import { ManufacturerRepository } from '~/repositories';

import { scrollToTop, isIncludes } from '~/utilities/common-helpers';
import { All_SEO1 } from '~/utilities/constant';
import { MANUFACTURER, POPULAR_MANUFACTURERS } from '~/utilities/sites-url'
import { getLocale, changeServerSideLanguage } from '~/utilities/easy-helpers';

// const calculateGroupAndSort = (list) => {
//     // typeof item?.name === 'number' ? item?.name : '#',
//     // groupBy  方法用于将一个数组根据指定的条件进行分组，返回一个对象， sortBy 排序
//     return _groupBy(
//         // _sortBy(
//             list?.filter(
//                 item => item?.name
//             )?.map(item => ({
//                 name: item?.name,
//                 slug: item?.slug,
//                 initial: _upperCase(item?.name?.substring(0, 1)),
//                 id: item.id
//     }), 'name'), 'initial');
// }

// 品牌管理中品牌主页状态slugStatus: 0 关闭 1 开启，开启才能跳转到品牌主页
// 制造商和产品分类，关闭了总状态，从一级分类到产品详情页，仅用户端不展示和不可搜索，所有的页还是可以打开。
// 关于品牌分类
// 品牌分类 状态：未启用，不显示在用户端制造商列表页面(现在是对的)
// 产品上架数量为0个的品牌，品牌分类状态为未启用
// 关于品牌管理
// 状态：关闭此状态，该品牌下面的所有产品不展示， 也不能搜索（全部产品都关闭：包括最新产品，热卖，推荐，折扣， 包括推荐供应商）。
// 相关接口： getProductListFreeWebEs, getRecommendManufacturersListWeb, getPopularListWeb,  getRecommendListWeb, getDiscountListWeb, getNewProductListWeb,
// 品牌主页状态：关闭此状态，该品牌的产品无法跳转到制造商主页和制造商主页不展示在用户端（关闭后，不能跳转到供应商主页，(只针对供应商和型号在一起的情况， 其它能正常跳转： 如推荐供应商能正常跳)）
const ManufacturerPage = ({ paramMap, seo, global, ecomerce, languageType = "en", manufacturers }) => {
	const { i18Translate, getLanguageHost, getLanguageName, getDomainsData } = useLanguage();
	const { iAllManufacturers, iPopularManufacturers } = useI18();
	// console.log(manufacturers, '--del')
	// 静态数据导入 JSON 文件
	// const manufacturers = require(`~/public/staticData/allManufacturer/${languageType}.json`);

	let timer = useRef();
	const Router = useRouter();
	const dispatch = useDispatch();
	const { recommendManufacturerList } = ecomerce
	// 手动写_groupBy分组, 迭代函数将数组元素分组，并返回一个以分组键为属性名、以对应元素组成的数组为属性值的对象。如果输入的list不是数组或iteratee不是函数，
	// 则抛出错误。在循环遍历数组时，对每个元素应用iteratee函数得到分组键，如果结果对象中不存在该键，则初始化一个空数组，然后将当前元素添加到对应键的数组中
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
	// 分组排序
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

		// _sortBy 方法确实默认是区分大小写排序的。解决： 后端排序了，前端不处理， 或者 'name' 改为 (item) => item?.name.toLowerCase())
		// const arr1 = myGroupBy(_sortBy(arr, 'name'), item => item?.initial)
		const arr1 = myGroupBy(arr, item => item?.initial)
		// const arr1 = myGroupBy(_sortBy(arr, (item) => item?.name.toLowerCase()), item => item?.initial)

		let mergedArray = [];
		let mergedObj = {};
		// 遍历 arr 对象的键值对
		for (const [key, value] of Object.entries(arr1)) {
			// 检查键是否是数字  or  Number.isInteger(index)
			if (!isNaN(Number(key))) {
				// 合并对应的值到 mergedArray 中
				mergedArray = mergedArray.concat(value);
			} else {
				mergedObj[key] = value
			}
		}
		let params = {}
		if (mergedArray?.length > 0) {
			params['#'] = mergedArray // 搜索#内无数据时，不返回#
		}
		params = {
			...params,
			...mergedObj,
		}

		return params
		// return myGroupBy(_sortBy(arr, 'name'), item => item?.initial)
		// return _groupBy(_sortBy(arr, 'name'), 'initial')
	}

	const initialManufacturers = useMemo(() => {
		return calculateGroupAndSortNew(manufacturers)
		// const arr = manufacturers?.filter(item => item?.name)?.map(item => {
		// 	return {
		// 		name: item?.name,
		// 		cname: item?.cname,
		// 		slug: item?.slug,
		// 		initial: upperCase(item?.name?.substring(0, 1)),
		// 		id: item.id
		// 	}
		// })
		// return myGroupBy(_sortBy(arr, 'name'), item => item?.initial)

	}, [manufacturers])

	const [searchText, setSearchText] = useState(null);
	const [toShowManufacturer, setToShowManufacturer] = useState(initialManufacturers);
	const [current, setCurrent] = useState('')
	const [tabActive, seTabActive] = useState(iAllManufacturers)

	const handleAll = () => {
		Router.push(MANUFACTURER)
		// scrollToTop()
		// seTabActive('1')
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
						return <Link href={`${MANUFACTURER}/${isIncludes(item.slug)}`} key={nanoid()}>
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

	const optimizedRender = useMemo(() => {
		return Object.keys(toShowManufacturer).map((key) => (
			<React.Fragment key={nanoid()}>
				{renderGroup(key, toShowManufacturer[key])}
			</React.Fragment>
		));
	}, [toShowManufacturer]);
	// 字母导航
	const headerIndex = useMemo(() => {
		const indexs = Object.keys(toShowManufacturer)?.map(item => (
			// smooth false 滑动效果
			<ScrollLink
				to={item}
				spy={true}
				offset={-115}
				smooth={true} duration={500} activeClass="current-choose"
				className={current === item ? 'current-choose' : ''}
				onClick={() => handleCurrentChoose(item)}
				key={nanoid()}
			>{item}</ScrollLink>
		));
		return (
			<div id="pubSticky" className='ps-header--manufacturer mt30' style={{ position: 'sticky', maxWidth: '100%' }}>
				{indexs}
			</div>
		)
	}, [toShowManufacturer]);

	const handleCurrentChoose = id => {
		let handler = "";
		clearTimeout(handler);
		handler = setTimeout(() => {
			setCurrent(id)
			if (id === current) return
			window.scrollBy({
				top: -160,
				left: 0,
				behavior: "smooth"
			});
		}, 0);
	}

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
		// 测试速度
		// await fetch(`${process.env.url}/staticData/allManufacturer/en.json`)
		// // manufacturers = await res.json();
		// console.time()
		// await ManufacturerRepository.getAllManufacturersListWeb({
		//     languageType: 'en'
		// });
		// console.timeEnd()

		// const panelRes = await CommonRepository.apiGetSysFunctionTypeSonList({
		//     typeIdList: [2] // typeId: 2 or  typeIdList: [1, 2]
		// });
		// await ManufacturerRepository.searchManufacturersCatalogList1({
		// 	manufacturerId: 743,
		// 	slug: 'texas-instruments',
		// 	languageType: 'en',
		// })


		getList();
		if (process.browser) {
			window.addEventListener('scroll', stickyHeader);
		}
	}, []);
	// console.log(manufacturers, 'manufacturers---del')
	useEffect(() => {
		if (tabActive == '2') {
			timer.current = setTimeout(() => {
				getList()
			}, 300)
		}
		if (searchText) {
			const filtedResults = manufacturers.filter(item => toLower(item?.name)?.indexOf(searchText) >= 0);
			setToShowManufacturer(calculateGroupAndSortNew(filtedResults));
		} else {
			setToShowManufacturer(initialManufacturers);
		}
	}, [searchText]);

	// useEffect(() => {
	// 	const { asPath } = Router
	// 	const anchorPoint = asPath.split('#')?.[1]
	// 	if (anchorPoint == 'popular-manufacturers') {
	// 		seTabActive('2')
	// 	} else {
	// 		seTabActive('1')
	// 	}
	// }, [Router]);
	// useEffect(() => {
	//     const handleRouteChange = (url) => {
	//       const hash = url.split('#')[1];
	//     };
	//     // 添加路由变化事件监听器
	//     Router.events.on('hashChangeComplete', handleRouteChange);
	//     // 组件卸载时移除事件监听器
	//     return () => {
	//         Router.events.off('hashChangeComplete', handleRouteChange);
	//     };
	//   }, [Router.events]);

	const handleSearch = (e) => {
		clearTimeout(timer.current)
		const searchText = toLower(trim(e.target.value));
		setSearchText(searchText)
	}

	const iCompanyName = i18Translate('i18CompanyInfo.Origin Electronic Parts Mall', process.env.title)
	const manufacturerSeo = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "Webpage",
				"@id": getLanguageHost() + POPULAR_MANUFACTURERS,
				"url": getLanguageHost() + MANUFACTURER,
				"name": iAllManufacturers,
				"isPartOf": {
					"@type": "Website",
					"@id": `${getLanguageHost()}/#website`,
					"name": iCompanyName,
					"url": getLanguageHost() + '/',
				}
			},
			{
				"@type": "BreadcrumbList",
				"itemListElement": [
					{
						"@type": "Listitem",
						"position": 1,
						"name": iAllManufacturers,
						"item": getLanguageHost() + MANUFACTURER,
					}
				]
			}
		]
	}


	const iUeditorManufacturersDes = i18Translate('i18Ueditor.ManufacturersDes', "ManufacturersDes")

	const { manufacturerTit, manufacturerKey, manufacturerDes } = All_SEO1?.manufacturer
	const i18Title = i18Translate('i18Seo.manufacturerHome.title', manufacturerTit)
	const i18Key = i18Translate('i18Seo.manufacturerHome.keywords', manufacturerKey)
	const i18Des = i18Translate('i18Seo.manufacturerHome.description', manufacturerDes)
	return (
		<PageContainer paramMap={paramMap} seo={seo} global={global}>
			<Head>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(manufacturerSeo) }}></script>
			</Head>
			<div className="ps-manufacturer ps-page--shop ps-store-list pub-minh-1 custom-antd-btn-more pb60">
				{/* manufacturer-banner */}
				<div className={classNames('pub-top-bgc pub-top-bgc-minh260 ', banStyles.pubTopBgc, banStyles.allManufacturer)} style={{ marginTop: '-60px' }}>
					<div className={classNames(banStyles.banBgc)}></div>
					{/* <img className={classNames(banStyles.pubTopImg, banStyles.img1)} src='/static/img/bg/manufacturer.jpg' alt="banner" />
					<img className={classNames(banStyles.pubTopImg, banStyles.img2)} src='/static/img/bg/manufactureriPad.webp' alt="banner" />
					<img className={classNames(banStyles.pubTopImg, banStyles.img3)} src='/static/img/bg/manufacturerMobile.webp' alt="banner" style={{ minHeight: '260px' }} /> */}

					<div className='ps-container pub-top-bgc-content'>
						<h1 className='pub-font36 pub-fontw pub-top-bgc-title'>{iAllManufacturers}</h1>
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

				{/* 导航 */}
				<ManufacturerTabs tabActive={iAllManufacturers} />


				{/* <Affix offsetTop={5}> */}
				{
					tabActive !== 1 && (
						<div className="ps-container mt20">
							{/* <div className='pub-color18 pub-font24 pub-fontw mt20 mb10'>ALL MANUFACTURERS A-Z</div> */}
							{/* <div className="ps-stores-items"> */}
							{Object.keys(toShowManufacturer)?.length !== 0 && headerIndex}
							<div className="ps-header--manufacturer-groups">
								{/* 数据量过大使用loadsh有性能影响 */}
								{/* {_keys(toShowManufacturer).map((key) => renderGroup(key, toShowManufacturer[key]))} */}
								{/* // 使用Object.keys替代_keys */}
								{/* {Object.keys(toShowManufacturer)?.map((key) => (
                                        // 你可以在这里添加条件渲染或使用React.memo来进一步优化
                                        <React.Fragment key={key}>
                                            {renderGroup(key, toShowManufacturer[key])}
                                        </React.Fragment>
                                    ))} */}
								{optimizedRender}
								{Object.keys(toShowManufacturer)?.length === 0 && <SearchNoData />}
							</div>
						</div>
						// </div>
					)
				}
				{/* </Affix> */}


			</div>
		</PageContainer >
	);
};

export default connect(state => state)(ManufacturerPage)

export async function getServerSideProps({ req, query }) {
	const languageType = getLocale(req)
	const [translations, apiManufacturers] = await Promise.all([
		changeServerSideLanguage(req),
		ManufacturerRepository.getAllManufacturersListWeb({
			languageType,
		}),
	]);
	// if(process.env.NODE_ENV === 'development') {
	//     manufacturers = require(`~/public/staticData/allManufacturer/${languageType}.json`);
	// } else {
	//     const res = await fetch(`${process.env.url}/staticData/allManufacturer/${languageType}.json`)
	//     manufacturers = await res.json();
	// }


	return {
		props: {
			...translations,
			manufacturers: apiManufacturers?.data ?? [],
			query,
			languageType,
		}
	}
};

// CatalogPage.getStaticProps = () => {
//     return {
//         bodyAttributes: {
//             // 这里是你想要添加的属性
//             className: 'ltr',
//             itemType: "http://schema.org/WebPage",
//             itemScope
//         },
//     };
// };