import React, { useState } from 'react';
import Link from 'next/link';
import { Row, Col } from 'antd';
import { connect } from 'react-redux';
import TitleMore from '~/components/shared/public/titleMore';
import { isIncludes } from '~/utilities/common-helpers';
import { PRODUCTS_CATALOG, PRODUCTS_FILTER, PRODUCTS } from '~/utilities/sites-url';
import ProductRepository from '~/repositories/ProductRepository';
import useLanguage from '~/hooks/useLanguage';
import { GENERALIZED_WORD } from '~/utilities/constant';

const PopularProducts = (props) => {
	const { i18Translate, getLanguageName, getLanguageEmpty, getDomainsData } = useLanguage();
	const iOriginMall = i18Translate('i18CompanyInfo.Origin Electronic Parts Mall', GENERALIZED_WORD);

	const { recommenCatalogRes, isMobile } = props;

	const arrData = [
		isMobile ? recommenCatalogRes?.slice(0, 1) : recommenCatalogRes?.slice(0, 7) || [],
		isMobile ? recommenCatalogRes?.slice(0, 0) : recommenCatalogRes?.slice(7, 14) || [],
	];

	const [catalogDescription, setCatalogDescription] = useState('');
	const [currentItem, setCurrentItem] = useState('');
	const [currentChooseItem, setCurrentChooseItem] = useState({});
	const [catalogList, setCatalogList] = useState(arrData); //
	const [childCatalogList, setChildCatalogList] = useState([]);

	const handleChange = async (item, index) => {
		setCurrentItem(index);
		setCurrentChooseItem(item);
		setChildCatalogList(item?.voList);

		const res = await ProductRepository.apiGetCatalogDescription(item?.id, getDomainsData()?.defaultLocale); // 分类描述等信息,
		if (res.code === 0) {
			const { description } = res?.data;
			setCatalogDescription(description);
		}
	};

	const iAbout = i18Translate('i18SmallText.About', 'About');
	const iViewMore = i18Translate('i18MenuText.View more', 'View more');
	const iPopular = i18Translate('i18Home.popular', 'POPULAR AND COMPREHENSIVE PRODUCT CATEGORIES');
	const iViewCatalogs = i18Translate('i18Home.viewCatalogs', 'View all catalogs');
	// 点击推荐分类展示下级内容
	const childCatalogView = () => (
		<div className="pupular-categories-child-catalog">
			<div className="ps-container pupular-categories-child row">
				<div className="pupular-categories-left">
					<div className="pupular-categories-about">{iAbout}</div>
					<div className="pupular-categories-description pub-line-clamp pub-clamp9" dangerouslySetInnerHTML={{ __html: catalogDescription }}></div>

					<Link href={`${PRODUCTS_CATALOG}/${isIncludes(currentChooseItem?.slug)}/${currentChooseItem?.id}`}>
						<a className="mt20 pub-content pub-lh18 pub-cursor-pointer" style={{ justifyContent: 'left' }}>
							<h3 className="sub-title pub-color-hover-link">{iViewMore}</h3>
							<div className="sprite-home-min sprite-home-min-3-9"></div>
						</a>
					</Link>
				</div>

				<div className="pupular-categories-right">
					{/* 旧版本 gutter={15} className="pub-margin-8" */}
					<Row>
						{childCatalogList?.slice(0, 12)?.map((subItem) => (
							<Col xs={24} sm={24} md={12} lg={8} xl={8} key={subItem?.id}>
								<Link
									key={'PopularProducts' + subItem.id}
									href={
										subItem?.voList.length > 0
											? `${PRODUCTS_CATALOG}/${isIncludes(subItem?.slug)}/${subItem?.id}`
											: `${PRODUCTS_FILTER}/${isIncludes(subItem?.slug)}/${subItem?.id}`
									}
								>
									<a>
										<div className="products-right-catalog-up pub-flex-align-center" style={{borderRadius: '0 !important'}}>
											<img
												className="mt5 mb5 pub-img60"
												src={subItem?.image || getLanguageEmpty()}
												title={subItem?.name || iOriginMall}
												alt={subItem?.name || iOriginMall}
											/>
											<p className="right-catalog-name pub-lh16 pub-line-clamp pub-clamp2">{getLanguageName(subItem)}</p>
										</div>
									</a>
								</Link>
							</Col>
						))}
					</Row>
				</div>
			</div>
		</div>
	);

	if (!catalogList || !catalogList.length) return null;

	return (
		<div className="blocks-pupular-categories">
			<div>
				<TitleMore title={iPopular} subTitle={iViewCatalogs} linkUrl={PRODUCTS} />
				<div className="ps-section__content ps-product-container pupular-categories-box">
					{catalogList.map((item, index) => (
						<div key={'catalogList' + index}>
							<div className="row ps-container">
								{item.map((subItem, i) => (
									<div
										className={'ps-carousel-item pupular-categories-item col-6 col-xl-2 col-sm-3 pub-cursor-pointer box-shadow'}
										key={i}
										onClick={(e) => handleChange(subItem, index * 7 + i)}
									>
										<img className="categories-img" title={getLanguageName(subItem)} alt={getLanguageName(subItem)} src={subItem?.image} style={{ margin: '0 auto' }} />
										<div className={(currentItem === index * 7 + i ? 'active' : '') + ' categories-name'}>{getLanguageName(subItem)}</div>
									</div>
								))}
							</div>
							{index === 0 && currentItem !== '' && currentItem <= 6 && childCatalogView()}
							{index === 1 && currentItem !== '' && currentItem >= 7 && childCatalogView()}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default connect((state) => state)(PopularProducts);