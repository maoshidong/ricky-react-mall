import React, { useEffect, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { Link as ScrollLink } from 'react-scroll';
import Head from 'next/head';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/router';

import upperCase from 'lodash/upperCase';
import toLower from 'lodash/toLower';
import trim from 'lodash/trim';

import { CustomInput } from '~/components/common';
import classNames from 'classnames';
import banStyles from '~/components/common/layout/_PubPageBanner.module.scss';
import { connect, useDispatch } from 'react-redux';
import useLanguage from '~/hooks/useLanguage';

import PageContainer from '~/components/layouts/PageContainer';
import SearchNoData from '~/components/ecomerce/minCom/SearchNoData'; // 无数据展示
import ManufacturerTabs from '~/components/partials/manufacturer/ManufacturerTabs'; // 页面导航
import { setRecommendManufacturerList } from '~/store/ecomerce/action';
import { ManufacturerRepository } from '~/repositories';

import { isIncludes } from '~/utilities/common-helpers';
import { All_SEO1 } from '~/utilities/constant';
import { MANUFACTURER } from '~/utilities/sites-url'
import { getLocale, changeServerSideLanguage } from '~/utilities/easy-helpers';
import styles from '~/components/elements/detail/description/also/_also.module.scss';

// 品牌主页状态：关闭此状态，该品牌的产品无法跳转到制造商主页和制造商主页不展示在用户端（关闭后，不能跳转到供应商主页，(只针对供应商和型号在一起的情况， 其它能正常跳转： 如推荐供应商能正常跳)）
const ManufacturerCategoryPage = ({ paramMap, manufacturers, manufacturersCategory }) => {
	const { i18Translate, getLanguageHost, getLanguageName, getDomainsData } = useLanguage();

	const iManufacturersCategory = i18Translate('i18CatalogHomePage.Manufacturers By Product Category', 'Manufacturers By Product Category')

	let timer = useRef();
	const scrollRef = useRef(null); // 左右滚动

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
		return calculateGroupAndSortNew(manufacturersCategory)
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

	}, [manufacturersCategory])

	const [searchText, setSearchText] = useState(null);
	const [toShowManufacturer, setToShowManufacturer] = useState(manufacturersCategory);
	const [current, setCurrent] = useState('')
	const [tabActive, seTabActive] = useState('Manufacturers By Product Category')
	const [showLeft, setShowLeft] = useState(false);

	const renderGroup = (i) => {
		return (
			// <Element name={key} key={key}>
			<div className='manufacturer-item box-shadow'>
				<h3 className='manufacturer-header' name={i?.typeName}>
					{i?.typeName}
				</h3>
				{/* 新版 */}
				<div className='ul'>
					{i?.mfgList?.map(item => {
						return <Link href={`${MANUFACTURER}/${isIncludes(item.pointSlug)}`} key={nanoid()}>
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
		return toShowManufacturer?.map((i) => (
			<React.Fragment key={nanoid()}>
				{renderGroup(i)}
			</React.Fragment>
		));
	}, [toShowManufacturer]);


	// svg图标
	const Svg = () => {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 28 28" fill="none">
				<path
					d="M7.94619 0.875L20.4517 13.3817C20.533 13.4628 20.5974 13.5592 20.6414 13.6653C20.6854 13.7714 20.7081 13.8851 20.7081 14C20.7081 14.1149 20.6854 14.2286 20.6414 14.3347C20.5974 14.4408 20.533 14.5372 20.4517 14.6183L7.94619 27.125"
					stroke="white"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				// stroke-width="1.5"
				// stroke-linecap="round"
				// stroke-linejoin="round"
				></path>
			</svg>
		);
	};

	const handScrollLeft = () => {
		if (scrollRef.current) {
			scrollRef.current.scrollLeft += 1500;
			setShowLeft(true)
		}
	}
	const handScrollRight = () => {
		if (scrollRef.current) {
			scrollRef.current.scrollLeft -= 1500;
			setShowLeft(false)
		}
	}
	console.log(showLeft, 'showLeft---del')
	// 字母导航 box-shadow
	const headerIndex = useMemo(() => {
		const indexs = toShowManufacturer?.map(item => (
			// smooth false 滑动效果
			<ScrollLink
				to={item?.typeName}
				spy={true}
				offset={-115}
				smooth={true} duration={500} activeClass="current-choose"
				className={current === item ? 'current-choose' : ''}
				onClick={() => handleCurrentChoose(item)}
				key={nanoid()}
			>{item?.typeName}</ScrollLink>
		));
		return (
			<div id="pubSticky" className={classNames('mt30 ', showLeft ? 'outerBefore' : 'outerAfter')}
				style={{ position: 'sticky', maxWidth: '100%', overflow: 'hidden !important', zIndex: 11, top: '60px' }}>
				{showLeft && <button className={styles.btnPrev} style={{ position: 'absolute', left: 0, zIndex: 999, height: '44px' }} onClick={handScrollRight}>
					<Svg />
				</button>}
				<div ref={scrollRef} className='ps-header--manufacturer pub-line-clamp1' style={{ position: 'relative', scrollBehavior: 'smooth', overflow: 'hidden !important' }}>
					{indexs}
				</div>
				{!showLeft && <button className={styles.btnNext} style={{ position: 'absolute', right: 0, height: '44px' }} onClick={handScrollLeft}>
					<Svg />
				</button>}
			</div>
		)
	}, [toShowManufacturer, showLeft]);


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
// showLeft ? 'outerBefore' : 'outerAfter

	useEffect(async () => {


		if (process.browser) {
			window.addEventListener('scroll', stickyHeader);
		}
	}, []);
	useEffect(() => {
		if (searchText) {
			// const filtedResults = manufacturers.filter(item => toLower(item?.name)?.indexOf(searchText) >= 0);
			let filtedResults = []
			manufacturersCategory?.map(i => {
				const mfgList = i?.mfgList?.filter(j => toLower(j?.name)?.indexOf(searchText) >= 0)
				if (mfgList?.length > 0) {
					filtedResults.push({
						...i,
						mfgList,
					})
				}

			});
			setToShowManufacturer(filtedResults);
		} else {
			setToShowManufacturer(manufacturersCategory);
		}
	}, [searchText]);

	const handleSearch = (e) => {
		clearTimeout(timer.current)
		const searchText = toLower(trim(e.target.value));
		setSearchText(searchText)
	}

	const iUeditorManufacturersDes = i18Translate('i18Ueditor.ManufacturersDes', "ManufacturersDes")



	const { manufacturerTit, manufacturerKey, manufacturerDes } = All_SEO1?.manufacturer
	const i18Title = i18Translate('i18Seo.manufacturerCategory.title', manufacturerTit)
	const i18Key = i18Translate('i18Seo.manufacturerCategory.keywords', manufacturerKey)
	const i18Des = i18Translate('i18Seo.manufacturerCategory.description', manufacturerDes)
	return (
		<PageContainer paramMap={paramMap}>
			<Head>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />
			</Head>
			<div className="ps-manufacturer ps-page--shop ps-store-list pub-minh-1 custom-antd-btn-more pb60">
				<div className={classNames('pub-top-bgc pub-top-bgc-minh260 ', banStyles.pubTopBgc, banStyles.allManufacturer)} style={{ marginTop: '-60px' }}>
					<div className={classNames(banStyles.banBgc)}></div>
					<div className='ps-container pub-top-bgc-content'>
						<h1 className='pub-font36 pub-fontw pub-top-bgc-title'>{iManufacturersCategory}</h1>
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
							{/* <span className='sprite-account-icons sprite-account-icons-1-4'></span> */}

							{/* <div onClick={handScrollLeft}>左</div> <div onClick={handScrollRight}>右</div> */}
						</div>
					</div>
				</div>
				<ManufacturerTabs tabActive={tabActive} />


				<div className="ps-container mt20">
					{Object.keys(toShowManufacturer)?.length !== 0 && headerIndex}
					<div className="ps-header--manufacturer-groups">
						{optimizedRender}
						{toShowManufacturer?.length === 0 && <SearchNoData />}
					</div>
				</div>

			</div>
		</PageContainer >
	);
};

export default connect(state => state)(ManufacturerCategoryPage)

export async function getServerSideProps({ req, query }) {
	const languageType = getLocale(req)
	const [translations, apiManufacturers] = await Promise.all([
		changeServerSideLanguage(req),
		ManufacturerRepository.apiImfgListByCatalog({
			languageType,
		}),
	]);
	return {
		props: {
			...translations,
			manufacturers: apiManufacturers?.data ?? [],
			manufacturersCategory: apiManufacturers?.data ?? [],
			query,
			languageType,
		}
	}
};