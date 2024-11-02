import React, { useState } from 'react';
import { connect } from 'react-redux';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
import TitleMore from '~/components/shared/public/titleMore';
import HotProductsItem from '~/components/partials/product/HotProductsItem';
import Link from 'next/link';
import { PRODUCTS_HOT_PRODUCTS, PRODUCTS_RECOMMEND_PRODUCTS, PRODUCTS_DISCOUNT_PRODUCTS } from '~/utilities/sites-url';
import { Flex } from '~/components/common';

// FEATURED PRODUCTS
const ProductsRecommended = ({ hotProductsList, recommendResServer = [], greatResServer = [] }) => {
	const initActive = hotProductsList?.length > 0 ? 0 : recommendResServer?.length > 0 ? 1 : 2;
	const { i18Translate } = useLanguage();
	const { iHotProducts, iRecommendedProducts, iDiscountProducts } = useI18();
	const [currentActive, setCurrentActive] = useState(initActive);

	if ([...hotProductsList, ...recommendResServer, ...greatResServer]?.length === 0) return null;

	let titleList = [];
	if (hotProductsList?.length > 0) {
		titleList.push({
			title: iHotProducts,
			index: 0,
		});
	}
	if (recommendResServer?.length > 0) {
		titleList.push({
			title: iRecommendedProducts,
			index: 1,
		});
	}
	if (greatResServer?.length > 0) {
		titleList.push({
			title: iDiscountProducts,
			index: 2,
		});
	}

	const contentView1 = (list, curIndex) => {
		return (
			<div className={`hot-product-catalog ` + (currentActive === curIndex ? '' : 'pub-seo-visibility')}>
				{list.map((item, index) => {
					return (
						<div key={index} className="box-shadow">
							<HotProductsItem dataItem={item} />
						</div>
					);
				})}
			</div>
		);
	};

	const changeActive = (index) => {
		setCurrentActive(index);
	};

	const viewMoreBox = () => {
		const arr = [PRODUCTS_HOT_PRODUCTS, PRODUCTS_RECOMMEND_PRODUCTS, PRODUCTS_DISCOUNT_PRODUCTS];
		return (
			<Flex justifyCenter>
				<Link href={arr[currentActive]}>
					<a className="pub-flex-center mb15">
						<div className="pub-color-hover-link">{i18Translate('i18MenuText.View more', 'View more')}</div>
						<div className="sprite-home-min sprite-home-min-3-9 mb2 ml15"></div>
					</a>
				</Link>
			</Flex>
		);
	};
	return (
		// ps-product-list  pt-60
		<div className={'blocks-products-recommended pt-0'}>
			<div className="">
				<TitleMore
					title={i18Translate('i18HomeNextPart.productsTitle', 'Featured Products')}
					// subTitle={i18Translate('i18MenuText.View more', 'View more')}
				/>
				<div className="pub-flex-center cart-tabs mb10 mt30" style={{ gap: '30px' }}>
					{titleList?.map((item, index) => {
						return (
							<div key={index} className={'cart-tabs-item mr0 ' + (currentActive === item?.index ? 'cart-tabs-active' : '')} onClick={() => changeActive(item?.index)}>
								{item.title}
							</div>
						);
					})}
				</div>
				{viewMoreBox()}
				{contentView1(hotProductsList, 0)}
				{contentView1(recommendResServer, 1)}
				{contentView1(greatResServer, 2)}
			</div>
		</div>
	);
};

export default connect(state => state)(ProductsRecommended)
