import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';
import useLanguage from '~/hooks/useLanguage';
import TitleMore from '~/components/shared/public/titleMore';
import HotProductsItem from '~/components/partials/product/HotProductsItem';
// import { HotProductsCatalog } from '~/components/partials';
import ProductRepository from '~/repositories/ProductRepository';
import { getEnvUrl, PRODUCTS_HOT_PRODUCTS, PRODUCTS_RECOMMEND_PRODUCTS, PRODUCTS_DISCOUNT_PRODUCTS } from '~/utilities/sites-url';

// FEATURED PRODUCTS
const ProductsRecommended = ({
	hotProductsList, recommendResServer = [], greatResServer = [],
	type = '1', // 首页
}) => {
    const { i18Translate, getDomainsData } = useLanguage();
    const [currentItem, setCurrentItem] = useState(0)
    const currentItemRef = useRef(0);
    const [pubList, setPubList] = useState(hotProductsList ?? [])

	const [hotList, setHotList] = useState(hotProductsList)
	const [recommendList, setRecommendList] = useState(recommendResServer)
	const [greatDealsList, setGreatDealsList] = useState(greatResServer)

    // 热卖产品
    // async function getHotListData() {
    //     const res = await ProductRepository.getHotProductsList({
    //         indexFlag: 1,
    //         languageType: getDomainsData()?.defaultLocale
    //     });
    //     if(res?.code == 0) {
    //         const { data } = res?.data
    //         const arr = data.slice(0, 9) || []
    //         setHotList(arr)
    //         handleChange(currentItemRef.current, arr)
    //     }
    // }
    // 推荐产品
    // async function getRecommendList() {
    //     const res = await ProductRepository.getRecommendListWeb({
    //         indexFlag: 1,
    //         languageType: getDomainsData()?.defaultLocale
    //     });
    //     if(res?.code == 0) {
    //         const { data } = res?.data
    //         const arr = data.slice(0, 9) || []
    //         setRecommendList(arr)
    //         handleChange(currentItemRef.current, arr)
    //     }
    // }
    // 折扣产品
    // async function getGreatDealsListData() {
    //     const res = await ProductRepository.getGreatDealsList({
    //         indexFlag: 1,
    //         pageSize: 9,
    //         languageType: getDomainsData()?.defaultLocale
    //     });
    //     if(res?.code == 0) {
    //         const { data } = res?.data
    //         const arr = data.slice(0, 9) || []
    //         setGreatDealsList(arr)
    //         handleChange(currentItemRef.current, arr)
    //     }
    // }
    // 切换
    const handleChange = (index, arr) => {
		// 热卖
		if (index == 0) {
			const arrItem = arr ? arr : hotList
			setPubList(arrItem)
		}
		// 推荐
		if (index == 1) {
			const arrItem = arr ? arr : recommendList
			setPubList(arrItem)
		}
		// 折扣
		if (index == 2) {
			const arrItem = arr ? arr : greatDealsList
			setPubList(arrItem)
		}
		currentItemRef.current = index
		setCurrentItem(index)
	}

	const list = [
		{
			title: i18Translate('i18MenuText.Hot Products', "Hot Products"),
			details: i18Translate('i18HomeNextPart.hotProductsDes', "Global Most Popular Products"),
			class: 'hotProductsBgc'
		},
		{
			title: i18Translate('i18MenuText.Recommended Products', "Recommended Products"),
			details: i18Translate('i18HomeNextPart.recommendedProductsDes', "Hand-picked by our suppliers"),
			class: 'hotRecommendedBgc'
		},
		{
			title: i18Translate('i18MenuText.Discount Products', "Discount Products"),
			details: i18Translate('i18HomeNextPart.discountProductsDes', "Showcasing our best offers and savings"),
			class: 'greatDealsBgc'
		},
	]

	const moreProducts = (e, url) => {
		e.preventDefault();
		Router.push(url);
	}

	const getLabel = (i, index) => {
		let url = PRODUCTS_HOT_PRODUCTS
		if (index === 1) {
			url = getEnvUrl(PRODUCTS_RECOMMEND_PRODUCTS)
		}
		if (index === 2) {
			url = getEnvUrl(PRODUCTS_DISCOUNT_PRODUCTS)
		}

		return <div
			className={'products-recommended-label ' + i.class + (index === currentItem ? ' products-recommended-active' : '')}
			onMouseEnter={(e) => handleChange(index)}
			onClick={e => moreProducts(e, url)}
		>
			<div className='title'>{i.title}</div>
			<p className={'description pub-line-clamp ' + (index === currentItem ? 'pub-clamp6' : 'pub-clamp2')}>
				{i.details}
			</p>
			<div className='label-content'>
				<h3 className='sub-title'>
					<a href={url} className='pub-fontw'>{i18Translate('i18MenuText.View more', 'View more')}</a>
				</h3>
				<div className='sprite-home-min sprite-home-min-3-9'></div>
			</div>
		</div>
	}

	// 右侧内容  border="1" width: 65%; height: 571px; border: 1px solid #333;
	const contentView = list => {
		if (pubList?.length === 0) {
			return <div style={{ width: '65%', height: '571px', border: '1px solid #d3d7de' }}></div>
		}
		return <table cellSpacing="0" className='list row custom-antd' style={{ borderCollapse: 'collapse !important', }}>
			<tbody className='percentW100'>
				<tr className='percentW100'>
					{list.map((item, index) => (
						<th
							className={'ps-carousel-item products-recommended-item col-xl-4 col-lg-6 col-md-12'}
							key={index}
						>
							<HotProductsItem dataItem={item} />
						</th>
					))}
				</tr>
			</tbody>
		</table>
	}

	useEffect(() => {
		handleChange(currentItemRef.current)
	}, [hotProductsList, recommendResServer, greatResServer])

	useEffect(() => {
		// 没有才重新获取
		// if (type === '1') {
		// 	getHotListData();
		// 	getRecommendList();
		// 	getGreatDealsListData();
		// }
	}, []);

	// 做爬虫，初始化需要push所有数据
	let allList = pubList
	if (currentItemRef.current === 0) {
		allList = [
			...pubList,
			...recommendResServer,
			...greatResServer,
		]
	}

	if (currentItemRef.current === 1) {
		allList = [
			...pubList,
			...greatResServer,
		]
	}

	if (currentItemRef.current === 2) {
		allList = [
			...pubList,
		]
	}


	return (
		<div className={'blocks-products-recommended ' + (type === '1' ? 'pb-80' : 'pb-80 pt-0')}>
			<div className="ps-container">
			{/* 精心挑选的特色产品 */}
				{type === '1' && <TitleMore title={i18Translate('i18HomeNextPart.productsTitle', "CAREFULLY SELECTED FEATURED PRODUCTS")} />}
				<div className={'ps-section__content products-recommended-box ' + (type === '1' ? 'pt-50' : '')}>
					<div className='product-recommended-box-left' style={{ marginRight: '-1px' }}>
						{getLabel(list[0], 0)}
						{getLabel(list[1], 1)}
						{getLabel(list[2], 2)}
					</div>
					{contentView(allList)}
				</div>
			</div>
		</div>
	);
};

export default connect(state => state)(ProductsRecommended)
