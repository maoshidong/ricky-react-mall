import React, { useEffect, useState, useRef, useContext } from 'react';
import Link from 'next/link';
import TabNav from '~/components/ecomerce/minCom/TabNav';
import useLanguage from '~/hooks/useLanguage';
import { Flex } from '~/components/common';
import { ProductsDetailContext } from '~/utilities/shopCartContext';
import { PRODUCTS_DETAIL, PRODUCTS, PRODUCTS_COMPARE } from '~/utilities/sites-url';
import { encrypt, isIncludes } from '~/utilities/common-helpers';
// import { useRouter } from 'next/router';
import classNames from 'classnames';
import styles from './_also.module.scss';
import map from 'lodash/map';
import truncate from 'lodash/truncate';

const ProductCard = ({ item }) => {
	const { getLanguageEmpty } = useLanguage();
	// const iDetails = i18Translate('i18MenuText.Details', 'Details')
	// const Router = useRouter();

	const _name = truncate(item?.name, { length: 17, separator: /,? +/ });
	const _manufact = truncate(item?.manufacturerName, { length: 26, separator: /,? +/ });

	// 跳转到详情页
	// const handleDetailsClick = () => {
	// 	Router.push(`${PRODUCTS_DETAIL}/${isIncludes(item?.name)}/${item?.productId}`)
	// }

	return (

		<Flex alignCenter justifyCenter className={classNames(styles.ProductCard, 'box-shadow')}>
			<Link href={`${PRODUCTS_DETAIL}/${isIncludes(item?.name)}/${item?.productId}`}>
				<a target='_blank'>
					<Flex column alignCenter gap={10} className={styles.CardItem}>
						{item?.image ? (
							<img src={item?.image} title={item?.name} alt={item?.name} />
						) : (
							<img src={getLanguageEmpty()} title={item?.name} alt={item?.name} />
						)}
						<div width={'100%'} className={classNames('mt10 pub-lh18 pub-center pub-line-clamp pub-clamp2', styles.label)} title={_name}>{_name}</div>
						{/* pub-line-clamp1 justifyCenter */}
						<div width={'100%'} className="pub-lh18 pub-center pub-line-clamp pub-clamp2" title={_manufact}>{_manufact}</div>
						{/* <button ghost="true" className="login-page-login-btn custom-antd-primary" onClick={handleDetailsClick}>
							{iDetails}
						</button> */}
					</Flex>
				</a>
			</Link>
		</Flex>
	);
};

// svg图标
const Svg = () => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
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

const CustomersAlsoBought = () => {
	const { i18Translate } = useLanguage();
	const iAlsoBought = i18Translate('i18SmallText.Customers Also Bought', 'Customers Also Bought');
	const iComparisonParts = i18Translate('i18AboutProduct.Comparison Parts', 'Compare Products')
	const iMore = i18Translate('i18SmallText.More', 'More')
	const iSeeAll = i18Translate('i18MenuText.View more', 'View All')

	const { productDetailData, productLatestList, compareListSer } = useContext(ProductsDetailContext);

	// 最新产品和分类的数据数量
	const pl = productLatestList?.length || 1

	const parentRef = useRef()
	// const alsoRef = useRef(); //内容的宽度
	const [tabActive, setTabActive] = useState(productLatestList?.length > 0 ? iAlsoBought : iComparisonParts);
	const [current, setCurrent] = useState(1);

	// 产品列表总的宽度
	const allProdWidth = (pl + 1) * 170 + pl * 10 + 12
	// 父框的总宽度
	const prWidth = parentRef?.current?.offsetWidth || 1
	// 总宽度除以可视区域的宽度，等于左右移动的次数
	const times = Math.ceil(allProdWidth / prWidth)
	// 可视区域的宽度，除以每个模块的宽度，可展示的个数
	const ps = Math.ceil(prWidth / 180) - 1
	// 移动距离
	const cheap = ps * 180

	useEffect(() => {
		// if (alsoRef?.current) {
		// 	alsoRef.current.style.transform = `translateX(0px)`;
		// }
		setCurrent(1)
	}, [])

	let headNavArr = [{ label: iAlsoBought }, { label: iComparisonParts }];
	// 如果对比数据没有的话，就不展示了
	if (compareListSer?.length === 0) {
		headNavArr = headNavArr?.filter(item => item?.label !== iComparisonParts)
	}

	// 如果展示数据为0
	if (productLatestList?.length === 0) {
		headNavArr = headNavArr?.filter(item => item?.label !== iAlsoBought)
	}

	// tab页选择
	const handleTabNav = (e, item) => {
		e.preventDefault();
		setTabActive(item?.label)
	};

	// 前面一页
	const handlePrevClick = () => {
		if (current !== 1) {
			const cur = current - 1;
			let floatCheap = allProdWidth - prWidth * (times - cur + 1) + 120
			if (cur === 1) {
				floatCheap = 0
			}

			if (parentRef.current) {
				parentRef.current.scrollLeft = floatCheap
			}
			// if (alsoRef.current) {
			// 	alsoRef.current.style.transform = `translateX(-${floatCheap}px)`;
			// }
			setCurrent(cur);
		}
	};

	// 后面一页
	const handleNextClick = () => {
		if (current <= times) {
			const ct = current + 1
			let floatCheap = (cheap) * current - 45
			if (ct === times) {
				floatCheap = allProdWidth - prWidth
			}
			if (parentRef.current) {
				parentRef.current.scrollLeft = floatCheap
			}
			// if (alsoRef.current) {
			// 	alsoRef.current.style.transform = `translateX(-${floatCheap}px)`;
			// }
			setCurrent(ct)
		}
	};

	return (
		headNavArr?.length > 0 && <div className="ps-product__content pub-border20 box-shadow" style={{ padding: 0 }}>
			<TabNav tabActive={tabActive} headNavArr={headNavArr} handleTabNav={handleTabNav} />

			{productLatestList?.length > 0 && (
				<div className={classNames(styles.alsoContainer, tabActive === iAlsoBought ? 'pub-color555 pt-20 pr-20 pb-20 pl-20 pub-seo-also' : 'pub-seo-visibility-also')}>
					{current > 1 && (
						<button className={styles.btnPrev} onClick={handlePrevClick}>
							<Svg />
						</button>
					)}

					<Flex flex ref={parentRef} className={styles.alsoContainer}>
						{/* ref={alsoRef} */}
						<div className={styles.alsoSections}>
							<section>
								<Flex gap={10}>
									{map(productLatestList, (pll) => (
										<ProductCard key={pll?.productId} item={pll} />
									))}

									{/* More 更多 See All  查看全部 */}
									<Flex alignCenter justifyCenter className={classNames(styles.ProductCard, 'box-shadow')}>
										<Link href={`${PRODUCTS}?flag=true`}>
											<a target='_blank' className={styles.CardItem}>
												<Flex justifyCenter alignCenter style={{ height: '100%', width: '100%' }}>
													<Flex flex column alignCenter justifyCenter gap={20}>
														<span>20 {iMore}</span>
														<button>{iSeeAll}</button>
													</Flex>
												</Flex>
											</a>
										</Link>
									</Flex>
								</Flex>
							</section>
						</div>
					</Flex>

					{times !== current && <button className={styles.btnNext} onClick={handleNextClick}>
						<Svg />
					</button>
					}
				</div>
			)}

			<div className={(tabActive == iComparisonParts ? 'pub-color555 pt-20 pr-20 pb-20 pl-20' : 'pub-seo-visibility1')}>
				<div className="pub-flex-wrap">
					{/* 对比记录 82747 */}
					{
						compareListSer?.map((item, index) => {
							return (
								<Link
									href={PRODUCTS_COMPARE + `/${encrypt([productDetailData?.id, item?.lastProductId].join(','))}`}
									key={'c ' + index}
								>
									<a target='_blank' className="new-tag mr10 mb10 pub-color-hover-link">
										{productDetailData?.name} <span className={styles.vsFont}>VS</span> {item?.productName}</a>
								</Link>
							)
						})
					}
				</div>
			</div>
		</div>
	);
};

export default React.memo(CustomersAlsoBought);