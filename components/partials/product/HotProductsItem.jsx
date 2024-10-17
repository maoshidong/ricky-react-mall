import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from 'antd';
import useLanguage from '~/hooks/useLanguage';
import { isIncludes } from '~/utilities/common-helpers';

import { GENERALIZED_WORD } from '~/utilities/constant';
import { PRODUCTS_DETAIL, PRODUCTS_HOT_PRODUCTS, PRODUCTS_RECOMMEND_PRODUCTS, PRODUCTS_DISCOUNT_PRODUCTS } from '~/utilities/sites-url';
import _ from 'lodash';
import LazyLoad from 'react-lazyload';

// 首页热卖,条件,折扣单个item  检查，不需要就删除
const HotProductsItem = ({ dataItem }) => {
	const { i18Translate, getLanguageEmpty } = useLanguage();
	const iOriginMall = i18Translate('i18CompanyInfo.Origin Electronic Parts Mall', GENERALIZED_WORD);
	const { name, productId, description, thumb, image, manufacturerLogo='' } = dataItem || {};
	const [imageSrc, setImageSrc] = useState(thumb || image);

	useEffect(() => {
		const img = new Image();
		img.onload = () => setImageSrc(thumb || image);
		img.onerror = () => setImageSrc(getLanguageEmpty());
		img.src = dataItem?.thumb || dataItem?.image;
	}, [image, thumb]);

	return (
		<div className="hot-product-catalog-item custom-antd">
			<h3>
				<Link href={`${PRODUCTS_DETAIL}/${isIncludes(name)}/${productId}`}>
					<a className="products-recommended-name pub-line-clamp1 pub-color-hover-link">{name}</a>
				</Link>
			</h3>

			<div className="products-recommended-bottom">
				<div style={{ width: `calc(100% - 60px)` }}>
					<div className="products-recommended-cont pub-line-clamp pub-clamp3">{description}</div>
					<Link href={`${PRODUCTS_DETAIL}/${isIncludes(name)}/${productId}`}>
						<a style={{ position: 'static' }}>
							<Button type="primary" ghost className="w120">
								<p>{i18Translate('i18MenuText.Details', 'Details')}</p>
							</Button>
						</a>
					</Link>
				</div>
				<div>
				<LazyLoad height={64} once={true} offset={0}>
					<img className="categories-img" alt={name} title={name} src={imageSrc || getLanguageEmpty()}    loading='lazy' />
				</LazyLoad>
				</div>
			</div>
			{/* 供应商logo */}
			<LazyLoad height={26} once={true} offset={0}>
			{manufacturerLogo && <img className="manufacturer-logo" alt={GENERALIZED_WORD} title={GENERALIZED_WORD} src={manufacturerLogo} loading='lazy' />}
			</LazyLoad>
		</div>
	);
};

export default React.memo(HotProductsItem)