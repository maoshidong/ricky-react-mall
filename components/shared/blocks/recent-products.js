import { useEffect, useState } from 'react';
import Link from 'next/link';
import LazyLoad from 'react-lazyload';
import { connect } from 'react-redux';
import { Carousel } from 'antd';
import classNames from 'classnames';
import TitleMore from '~/components/shared/public/titleMore';
import { isIncludes, handleMomentTime } from '~/utilities/common-helpers';
import { getEnvUrl, PRODUCTS_DETAIL } from '~/utilities/sites-url';
import { GENERALIZED_WORD } from '~/utilities/constant';
import useLanguage from '~/hooks/useLanguage';
import styles from './_RecentProducts.module.scss';

const RecentProducts = ({ ecomerce }) => {
	const { i18Translate, getLanguageEmpty } = useLanguage();
	const iOriginMall = i18Translate('i18CompanyInfo.Origin Electronic Parts Mall', GENERALIZED_WORD);

	const { recentView } = ecomerce;

	const recentViewLoc = recentView;
	const [perRow, setPerRow] = useState(6);

	const handleWindowResize = () => {
		const { innerWidth } = window;
		if (innerWidth > 1450) {
			setPerRow(6);
		}
		if (innerWidth <= 1500) {
			setPerRow(5);
		}
		if (innerWidth <= 1230) {
			setPerRow(4);
		}
		if (innerWidth <= 1000) {
			setPerRow(3);
		}
		// if (innerWidth <= 780) {
		//     setPerRow(3)
		// }
		if (innerWidth <= 530) {
			setPerRow(1);
		}

		if (innerWidth > 530 && innerWidth <= 780) {
			setPerRow(2);
		}
	};

	useEffect(() => {
		window.addEventListener('resize', handleWindowResize);
		// 初始化一次
		handleWindowResize();
		return () => {
			window.removeEventListener('resize', handleWindowResize);
		};
	}, []);

	// 每次循环的hooks数量应该一致，不要在这之前添加其它代码(hooks)， 报错 Error: Rendered more hooks than during the previous render. useState(6) ?
	if (!recentViewLoc || !recentViewLoc.length) return null;

	return (
		<div className={classNames("ps-product-list blocks-recent-products pub-bgcdf5 pt-60 pb-55", styles.blocksRecentProducts)}>
			<div className="ps-container">
				<TitleMore title={i18Translate('i18Home.recent', 'RECENT PRODUCTS')} />
				<div className="ps-section__content recent-products-cont pub-margin-8 pt-50">
					<Carousel slidesPerRow={perRow} centerPadding={15}>
						{recentViewLoc?.map((item, index) => (
							<div className="ps-carousel-item" key={'recent' + index}>
								<div className="pub-padding8 pub-text-left">
									<Link href={`${getEnvUrl(PRODUCTS_DETAIL)}/${isIncludes(item?.name)}/` + item.id}>
										<a>
											<div className={classNames("recent-products-item box-shadow", styles.recentProductsItem)}>
												{item.manufacturerLogo && (
													<LazyLoad height={70} once={true} offset={500}>
														<img
															src={item.manufacturerLogo}
															alt={item?.manufacturerSlug || iOriginMall}
															title={item?.manufacturerSlug || iOriginMall}
															className="manufacturer-img"
														/>
													</LazyLoad>
												)}
												<LazyLoad height={70} once={true} offset={500}>
													<img
														src={item.image || getLanguageEmpty()}
														alt={item?.name || iOriginMall}
														title={item?.name || iOriginMall}
														className="recent-img"
														onError={(e) => {
															e.target.src = getLanguageEmpty();
														}}
													/>
												</LazyLoad>

												<h3 className="recent-products-name pub-line-clamp pub-clamp2">{item.name}</h3>
												<p className="recent-products-content pub-line-clamp pub-clamp2">{item?.description}</p>
												<div className="recent-products-time mt15">
													<div className="recent-products-icon sprite-icons-1-8 mr10"></div>

													<div className="time">
														{i18Translate('i18Home.visited', 'Visited')}: {handleMomentTime(item?.datetime)}
													</div>
												</div>
											</div>
										</a>
									</Link>
								</div>
							</div>
						))}
					</Carousel>
				</div>
			</div>
		</div>
	);
};

export default connect((state) => state)(RecentProducts);