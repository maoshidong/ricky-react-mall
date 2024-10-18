
import React from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import { nanoid } from 'nanoid';
import { Button, Form } from 'antd';
import { toFixedFun, calculateTargetPriceTotal, floatMutilply, getThousandsData, calculateTotalAmount } from '~/utilities/ecomerce-helpers';
import { getProductUrl, onlyNumber } from '~/utilities/common-helpers';
import useLanguage from '~/hooks/useLanguage';
import { getCurrencyInfo } from '~/repositories/Utils';

const addCartPreview = ({ ecomerce, quantity, ...props }) => {
	const { i18Translate, getLanguageEmpty } = useLanguage();
	const iViewCart = i18Translate('i18MenuText.View Cart', 'View Cart')
	const iQuantity = i18Translate('i18PubliceTable.Quantity', 'Quantity')
	const iSubTotal = i18Translate('i18MyCart.SubTotal', "SubTotal")
	const iAddedToCart = i18Translate('i18MyAccount.Added to cart', "Added to cart")
	const iItemsInCart = i18Translate('i18MyCart.Items In Cart', "Items in cart")

	const currencyInfo = getCurrencyInfo();

	let {
		submitFn,
		continueFn,
		product = {},
		otherParams,
	} = props;

	const [form] = Form.useForm();
	const addCartList = otherParams?.addCartList || []
	const isMoreCart = otherParams?.type === 'more'

	const { allCartItems } = ecomerce
	// floatMutilply 两数相乘,价格乘以数量
	const itemTotal = getThousandsData(floatMutilply(calculateTargetPriceTotal({
		...product,
		quantity,
	}, quantity) || 0, quantity));
	// const itemTotal = getThousandsData(floatMutilply(calculateClearTargetPrice(product,quantity)||0,quantity));

	// 传过来的product,字段名不同, Manufacturer(filter,属性)
	const {
		id, productId, productNo, name, productName,
		manufacturer, manufacturerName, manufacturer_slug, manufacturerSlug, Manufacturer,
	} = product
	const curProductId = id || productId
	const curProductName = productNo || name || productName
	const curManufacturerName = manufacturer?.name || manufacturerName || Manufacturer
	const curManufacturerSlug = manufacturer_slug || manufacturer?.slug || manufacturerSlug || Manufacturer
	// const curProductManufacturer = manufacturerName || product?.Manufacturer || product?.manufacturer_slug
	const curProductImage = product?.thumb || product?.image || getLanguageEmpty()

	const amount = toFixedFun(calculateTotalAmount(allCartItems), 2);

	// 双击选中输入框内容
	const handleDoubleClick = e => {
		e.target.select();
	}
	const handleInputChange = (value) => {
		// setInputNumberValue(value);
	};

	return (
		// ps-container 
		<div className="add-to-cart" style={{ padding: 0 }}>
			<div className="ps-section__title">
				<div className='add-to-cart-title'>{iAddedToCart}</div>
			</div>
			<div className="ps-section__content clearfix">
				{/* 单个 */}
				{
					!isMoreCart && (<div className="ps-add-cart-item pub-border">
						<div className="ps-product--cart-mobile">
							<div className="ps-product__thumbnail">
								<Link href={getProductUrl(curManufacturerSlug, curProductName, curProductId)}>
									<a><img src={curProductImage} alt={curProductName} title={curProductName} /></a>
								</Link>
							</div>
							<div className="ps-product__content">
								{/* 型号，供应商 */}
								<div className='w220'>
									<div className='add-to-cart-productNo'>{curProductName}</div>
									<div className='w220'>
										<small>
											<span className='add-to-cart-manufacturer'>{curManufacturerName}</span>
										</small>
									</div>
								</div>
								<div >
									<div className='add-to-cart-quantity'>{iQuantity}: {quantity}</div>
									<div className='add-to-cart-total'>{currencyInfo.label}{itemTotal || 0}</div>
								</div>
							</div>
						</div>
					</div>
					)
				}
				{/* 添加多个产品 */}
				<div className='heightOverflowY300'>
					{
						isMoreCart && (
							addCartList?.map(i => {
								const curId = i?.productId || i?.id
								const curName = i?.name || i?.productName || i?.productNo || i?.partNum || i?.matchPartNum
								const curManufactureSlug = i?.manufacturerSlug || i?.Manufacturer || i?.manufacturer
								const curManufactureName = i?.manufacturerName || i?.Manufacturer || i?.manufacturer
								const curImg = i?.thumb || i?.image || getLanguageEmpty()
								return <div className="ps-add-cart-item pub-border" key={nanoid()}>
									<div className="ps-product--cart-mobile">
										{/* 型号，供应商 */}
										<div className="ps-product__thumbnail">
											<Link href={getProductUrl(curManufactureSlug, i?.name, i?.curId)}>
												<a><img src={curImg} alt={curName} title={curName} /></a>
											</Link>
										</div>
										<div className="ps-product__content">
											<div className='w220'>
												<div className='add-to-cart-productNo'>
													<Link href={getProductUrl(curManufactureSlug, curName, curId)}>
														<a className='pub-color-hover-link'>{curName}</a>
													</Link>
												</div>
												<div className='w220'>
													<span className='add-to-cart-manufacturer'>{curManufactureName}</span>
												</div>
											</div>
											<div className='pub-custom-input-suffix'>
												{/* <Form.Item className={'pub-custom-select select-have-val'}>
                                                    <Form.Item
                                                        name="quantity"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Required',
                                                            },
                                                        ]}
                                                        noStyle // 为 true 时不带样式，作为纯字段控件使用
                                                    >
                                                        <InputNumber
                                                            className="form-control w140"
                                                            type="number"
                                                            autoComplete="new-password"
                                                            defaultValue={Number(i?.cartQuantity || quantity)}
                                                            min={1}
                                                            onKeyPress={onlyNumber}
                                                            onDoubleClick={handleDoubleClick}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Form.Item>
                                                    <div className='pub-custom-holder pub-input-required'>Quantity</div>
                                                </Form.Item> */}
												<div className='add-to-cart-quantity'>{iQuantity}: {i?.cartQuantity || i?.customQuantity || quantity}</div>
												<div className='add-to-cart-total'>{currencyInfo.label}{toFixedFun(calculateTargetPriceTotal(i) || 0, 4)}</div>
											</div>
										</div>
									</div>
								</div>
							})
						)
					}
				</div>
				{/* 速度慢：匿名登录，创建购物车，获取列表 */}
				{/* <div className='add-to-cart-sub-total'>
					<div className='add-to-cart-sub-length'>{iItemsInCart}: {allCartItems.length}</div>
					<div className='add-to-cart-sub-tot'>{iSubTotal}: <span>{currencyInfo.label}{getThousandsData(amount || 0)}</span></div>
				</div> */}

				<div className="ps-add-cart-footer custom-antd-btn-more" style={{ float: 'none' }}>
					<Button
						type="primary" ghost
						className='ps-add-cart-footer-btn'
						onClick={() => { submitFn ? submitFn() : null }}
					>{iViewCart}</Button>
					<Button
						type="primary" ghost
						className='custom-antd-primary ps-add-cart-footer-btn'
						onClick={() => { continueFn ? continueFn() : null }}
					>{i18Translate('i18MyCart.Continue Shopping', "Continue Shopping")}</Button>
				</div>
			</div>
		</div>
	);
};
export default connect((state) => state)(addCartPreview);
