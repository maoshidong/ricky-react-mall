import React from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import { Button } from 'antd';
import { getProductUrl } from '~/utilities/common-helpers';
import useLocalStorage from '~/hooks/useLocalStorage';
import useLanguage from '~/hooks/useLanguage';

const AddRfqPreview = ({ ecomerce, quantity = 1, ...props }) => {
	const { i18Translate, getLanguageEmpty } = useLanguage();
	const iAddedRFQ = i18Translate('i18AboutProduct.Added to RFQ', 'Added to RFQ');
	const iViewRFQ = i18Translate('i18AboutProduct.View RFQ', 'View RFQ');
	const iItemsInRFQ = i18Translate('i18AboutProduct.Items in RFQ', 'Items in RFQ');

	let { submitFn, continueFn, otherParams } = props;

	const [quoteList, setQuoteList] = useLocalStorage('quoteList', new Array(5).fill({}));
	const addCartList = otherParams?.addCartList || [];
	const isMoreCart = otherParams?.type === 'more';
	let fillIndex = 0; // 检查第一个数据为空的项
	quoteList.map((item, index) => {
		if (Object.keys(item).length > 0) {
			fillIndex = index + 1;
		}
	});
	return (
		<div className="add-to-cart" style={{ padding: 0 }}>
			<div className="ps-section__title">
				<div className="add-to-cart-title">{iAddedRFQ}</div>
			</div>
			<div className="ps-section__content clearfix">
				{/* 添加多个产品 */}
				<div className="heightOverflowY300">
					{isMoreCart &&
						addCartList?.map((i, index) => {
							const {
								PartNumber, partNum,
								manufacturer,
							} = i
							const curId = i?.productId || i?.id;
							const curName = i?.name || i?.productName || i?.productNo || PartNumber || partNum; // 型号
							const curManufactureSlug = i?.manufacturerSlug || i?.Manufacturer; // 供应商短语
							const curManufactureName = i?.manufacturer?.name || i?.manufacturerName || i?.Manufacturer || manufacturer; // 供应商名称
							const curImg = i?.thumb || i?.image || getLanguageEmpty();
							return (
								<div className="ps-add-cart-item pub-border" key={index}>
									<div className="ps-product--cart-mobile">
										<div className="ps-product__thumbnail">
											<Link href={getProductUrl(curManufactureSlug, i?.name, i?.curId)}>
												<a>
													<img src={curImg} alt={curName} title={curName} />
												</a>
											</Link>
										</div>
										<div className="ps-product__content">
											{/* 型号和供应商 */}
											<div>
												<div className="add-to-cart-productNo">
													<Link href={getProductUrl(curManufactureSlug, curName, curId)}>
														<a className="pub-color-hover-link">{curName}</a>
													</Link>
												</div>
												<div className="w280">
													<span className="add-to-cart-manufacturer">{curManufactureName}</span>
												</div>
											</div>
											<div className="pub-custom-input-suffix">
												<div className="add-to-cart-quantity">
													{i18Translate('i18PubliceTable.Quantity', 'Quantity')}:{i?.cartQuantity || i?.Quantity || quantity}
												</div>
												<div className="add-to-cart-total" style={{ height: '20px' }}></div>
											</div>
										</div>
									</div>
								</div>
							);
						})}
				</div>

				<div className="add-to-cart-sub-total">
					<div className="add-to-cart-sub-length">
						{/* {iItemsInRFQ}: {fillIndex + 1} */}
						{iItemsInRFQ}: {addCartList?.length || 0}
					</div>
				</div>

				<div className="ps-add-cart-footer custom-antd-btn-more">
					<Button
						type="primary"
						ghost
						className="ps-add-cart-footer-btn"
						onClick={() => {
							submitFn ? submitFn() : null;
						}}
					>
						{iViewRFQ}
					</Button>
					<Button
						type="primary"
						ghost
						className="custom-antd-primary ps-add-cart-footer-btn"
						onClick={() => {
							continueFn ? continueFn() : null;
						}}
					>
						{i18Translate('i18MyCart.Continue Shopping', 'Continue Shopping')}
					</Button>
				</div>
			</div>
		</div>
	);
};
export default connect((state) => state)(AddRfqPreview);