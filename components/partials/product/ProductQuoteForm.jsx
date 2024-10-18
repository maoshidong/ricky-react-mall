import React, { useState, useContext, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { Modal, Button, Form } from 'antd';

import useEcomerce from '~/hooks/useEcomerce';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
import { calculateItemPriceTotal, toFixedFun } from '~/utilities/ecomerce-helpers';

import AddCartPreview from '~/components/shared/blocks/add-cart-preview';
import AddRfqPreview from '~/components/shared/blocks/add-cart-preview/AddRfqPreview';
import CartDuplicatePart from '~/components/ecomerce/minCom/CartDuplicatePart';
import QuoteModal from '~/components/shared/blocks/quote-modal';
import AddProjectModal from '~/components/ecomerce/cartCom/CartProject/AddProjectModal'
import ObserverAddCart from '~/components/partials/product/ObserverAddCart'

import { InputNumberV2, DeliveryTime } from '~/components/common';
import { ProductsDetailContext } from '~/utilities/shopCartContext'
import { ACCOUNT_QUOTE } from '~/utilities/sites-url'
import { scrollToTop } from '~/utilities/common-helpers'
import { getCurrencyInfo } from '~/repositories/Utils';
import styles from '~/scss/module/_quoteForm.module.scss'

const ProductQuoteForm = ({
	ecomerce,
	newProduct = {},
	productPrices,
	auth,
}) => {
	const { i18Translate, getLanguageEmpty } = useLanguage();
	const { iUnitPrice, iExtPriceUp } = useI18();

	const iRFQ = i18Translate('i18AboutProduct.RFQ', "RFQ")

	const { isAccountLog } = auth
	const [form] = Form.useForm();
	const { allCartItems } = ecomerce
	const [quantity, setQuantity] = useState(''); // 输入框数量
	const Router = useRouter();
	const { saveAddToRfq, useAddMoreCart } = useEcomerce();
	const [isCartView, setIsCartView] = useState(false); // 添加购物车弹窗
	const [isShowModal, setIsShowModal] = useState(false); // 添加项目弹窗
	const [isRfqView, setIsRfqView] = useState(false); // 添加Rfq弹窗
	const [isQuoteView, setIsQuoteView] = useState(false);
	const [isShowDuplicatePart, setIsShowDuplicatePart] = useState(false);
	// const [adddressMap, setAdddressMap] = useState({});
	const [newProductData, setNewProductData] = useState({});
	const [observerShow, setObserverShow] = useState(true);
	const observerEl = useRef(null)
	const currencyInfo = getCurrencyInfo()

	const { productDetailData, isHavePrice, customerReference, paramMap } = useContext(ProductsDetailContext)
	const {
		id, name, description, manufacturer, manufacturerSlug, image, thumb,
		addressId,
	} = productDetailData
	// console.log(productDetailData, 'productDetailData-----del')
	const iInvalidQuantity = i18Translate('i18AboutProduct.InvalidQuantity', 'invalid quantity')
	const iQuantity = i18Translate('i18PubliceTable.Quantity', 'Quantity')
	const iAddToCart = i18Translate('i18FunBtnText.AddToCart', 'ADD TO CART')
	const iPricesUSD = i18Translate('i18AboutProduct.PricesUSD', `All prices are in ${currencyInfo.value}`)
	const iAvailabilityNotTip = i18Translate('i18AboutProduct.AvailabilityNotTip', 'Availability not shown, Contact us')
	const iREQUESTAQUOTE = i18Translate('i18FunBtnText.REQUEST A QUOTE', 'REQUEST A QUOTE')
	const iQTY = i18Translate('i18PubliceTable.QTY', 'QTY')

	// 控制数量输入框
	const setFormFields = () => {
		form.setFields([
			{
				name: 'quantity',
				value: form.getFieldValue('quantity'),
				errors: [iInvalidQuantity]
			}
		]);
	}
	// 校验输入框数量是否有效
	const checkQuantityValid = () => {
		let flag = false
		if (((Number(quantity) % 1) !== 0) || Number(quantity) < 1) {
			setFormFields()
			flag = true
		}
		return flag
	}

	const handleShowQuoteModal = (_e, type) => {
		if (((Number(quantity) % 1) !== 0) && type !== 'no-quantity') {
			setFormFields()
			return
		}
		if (Number(quantity) < 1 && type !== 'no-quantity') {
			setFormFields()
			return
		}
		setIsQuoteView(true);
	};

	// 点击add to rfq
	const handleShowRfqModal = (e) => {
		e?.preventDefault();
		if (checkQuantityValid()) return

		const params = {
			PartNumber: name,
			Manufacturer: manufacturer?.name,
			Quantity: quantity,
		}
		saveAddToRfq(params)
		setIsRfqView(true);
	}

	const handleHideQuoteModal = (e) => {
		e && e.preventDefault();
		setIsQuoteView(false);
	};

	// 先判断最小订货量
	const handleMinQUantity = () => {
		let flag = false
		const minQUantity = Number(productPrices?.[0]?.quantity)
		const errText = `${i18Translate('i18AboutProduct.MOQ', 'MOQ')}：${minQUantity}`
		if (Number(quantity) < minQUantity) {
			form.setFields([
				{
					name: 'quantity',
					errors: [errText]
				}
			]);
			flag = true
		}
		return flag
	}

	// 添加项目
	const handleAddProject = (e) => {
		e?.preventDefault();
		if (checkQuantityValid() || handleMinQUantity()) return
		setIsShowModal(true)
	}

	// 头部固定栏点击添加
	const addBack = val => {
		setObserverShow(false)
		scrollToTop()
		handleIsSame()
	}

	const handleIsSame = () => {
		// 先判断最小订货量
		if (handleMinQUantity()) {
			return
		}

		// 先判断购物车有没有相同的型号
		const isSameProductId = allCartItems?.find(item => item?.productId === id)
		if (isSameProductId) {
			setIsShowDuplicatePart(true)
			return
		} else {
			handleShowCartView()
		}
	}

	const handleShowCartView = () => {
		if (!isHavePrice) {
			handleShowQuoteModal()
			return
		}
		setNewProductData({
			id,
			// 没有图片展示后台配置的空图片，后台也没配置就展示
			image: image || thumb || getLanguageEmpty(),
			productNo: name,
			description: description,
			prices: productPrices,
			manufacturer_slug: manufacturerSlug,
			manufacturerName: manufacturer?.name,
		})
		handleAddItemToCart()
	};

	const handleHideCartView = (e) => {
		e && e?.preventDefault();
		setIsCartView(false);
	};

	function handleAddItemToCart() {
		if (((Number(quantity) % 1) !== 0)) {
			setFormFields()
			return
		}
		if (Number(quantity) < 1) {
			setFormFields()
			return
		}
		const params = [
			{ id, quantity, remark: customerReference }
		]

		useAddMoreCart(
			params,
			{ cartNo: 0, }
		);
		setIsCartView(true);
	}
	// 产品阶梯价行样式
	const getRowColor = (priceId) => {
		let currentPriceId = 0;

		productPrices?.forEach((item) => {
			if (item?.quantity <= quantity) {

				currentPriceId = item?.id;
			}
		});

		return currentPriceId === priceId ? { background: '#e3e7ee', color: '#181818' } : {};
	}

	const getQuantityPrice = q => {
		let currentPrice = 0;
		productPrices?.forEach((item) => {
			if (item?.quantity <= q) {
				currentPrice = item?.unitPrice;
			}
		});
		return currentPrice
	}

	const onChangeInput = (value) => {
		if (((Number(value) % 1) !== 0)) {
			form.setFields([
				{
					name: 'quantity',
					value: value,
					errors: [iInvalidQuantity]
				}
			]);
		}
		setQuantity(value);
	}
	const observerChangeInput = (value) => {
		console.log(value, 'observerChangeInput---del')
		form.setFields([
			{
				name: 'quantity',
				value: value,
				errors: []
			}
		]);
		setQuantity(value);
	}
	const Adddress = newProduct?.shipFrom // addressId ? adddressMap[addressId] : ''//发货地址

	const isDiscountPrice = false

	useEffect(() => {
		const options = {
			root: null, // 使用视口作为根元素
			rootMargin: '-100px 0px -100px 0px', // 进入视口时，底部提前 60px
			threshold: 0, // 触发条件为目标元素有任何部分进入视口
		};
		const observer = new IntersectionObserver(([entery]) => {

			if (entery.isIntersecting) {

				setObserverShow(true)
			} else {
				setObserverShow(false)
			}
		}, options);
		if (observerEl.current) observer.observe(observerEl.current)
		return () => {
			if (observerEl.current) observer.unobserve(observerEl.current)
		}
	}, [])

	return (
		<Form
			form={form}
			onFinish={(e) => handleIsSame(e)}
		>
			<div className="ps-product__right-quote">
				{
					// 无库存时
					!isHavePrice ?
						<div className="product-not-shown">
							<div>
								{iAvailabilityNotTip}
							</div>
							<div className='product-not-shown-title' onClick={(e) => handleShowQuoteModal(e)}>{iREQUESTAQUOTE}</div>
						</div>
						:
						// 有库存
						<DeliveryTime quantity={newProduct?.quantity} Adddress={Adddress} />
				}

				<div className="ps-product__btn-group ps-product__btn-group-wrap pub-custom-input-box" style={{ display: 'block', paddingBottom: '0', maxWidth: "400px" }}>
					<div className='ps-product-title'>{iQuantity}</div>
					<Form.Item
						name="quantity"
						rules={[
							{
								required: true,
								message: iInvalidQuantity
							},
						]}
					>
						<InputNumberV2
							className="pub-border"
							onChange={onChangeInput}
							// onKeyPress={(e)=>console.log(e,999)}
							// onKeyPress={onlyNumber}
							placeholder={iQuantity}
							value={Number(quantity)}
							controls={false}
							style={{ width: '100%' }}
						/>
					</Form.Item>
				</div>

				<div className='ps_product__amount'>
					{
						isHavePrice && Number(quantity) > productPrices?.[0]?.quantity &&
						<div>
							{/* 自适应也要改 */}
							<table className={styles.quoteTable}>
								<thead>
									<tr>
										<th>{iQTY}</th>
										<th>{iUnitPrice}</th>
										<th>{iExtPriceUp}</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>{quantity}</td>
										<td>{currencyInfo.label}{toFixedFun(getQuantityPrice(quantity), +paramMap?.priceDecimal)}</td>
										<td>
											{currencyInfo.label}
											{toFixedFun(calculateItemPriceTotal({ voList: productPrices, cartQuantity: quantity }) || 0, +paramMap?.subtotalDecimal)}
										</td>
									</tr>
								</tbody>
							</table>
							<div className='ps_product_total'>
								{/* getThousandsData 改为千分位会取整，导致价格不对 */}
								{currencyInfo.label}{toFixedFun(calculateItemPriceTotal({
									voList: productPrices,
									cartQuantity: quantity,
								}), +paramMap?.subtotalDecimal)}
							</div>
						</div>
					}
				</div>
				{/* 产品详页，当下滑翻页超过了图片的位置，
				图片、型号、品牌、数量、加入购物车，动画到置顶的位置 */}
				<div ref={observerEl} className="ps-product__actions-btn-container custom-antd-btn-more">
					{isHavePrice ?
						<>
							<Button
								type="primary" ghost='true'
								className='product-primary-btn custom-antd-primary'
								onClick={(e) => handleIsSame(e)}
								style={{ width: '100%' }}
							>
								{iAddToCart}
							</Button>

							{/* 暂时关闭项目isAccountLog */}
							{
								isAccountLog && (
									<Button
										type="primary" ghost='true'
										className='product-primary-btn ml20'
										onClick={(e) => handleAddProject(e)}
										style={{ width: '100%' }}
									>
										{i18Translate('i18MyCart.Add To Project', 'ADD TO PROJECT')}
									</Button>
								)
							}
						</>
						:
						<>
							<Button
								type="primary" ghost='true'
								className='mr20 product-primary-btn custom-antd-primary'
								onClick={(e) => handleShowQuoteModal(e)}
								style={{ width: '100%' }}
							>
								{i18Translate('i18FunBtnText.REQUEST QUOTE', 'REQUEST QUOTE')}
							</Button>
							<Button
								type="primary" ghost='true'
								className='product-primary-btn'
								onClick={(e) => handleShowRfqModal(e)}
								style={{ width: '100%' }}
							>
								{i18Translate('i18FunBtnText.ADD TO RFQ', 'ADD TO RFQ')}
							</Button>
						</>

					}
				</div>
				{/* 阶梯价 */}
				{
					(productPrices?.[0]?.unitPrice > 0) &&
					<div className='ps-product__prices'>
						<div className='usd-pricing'>{iPricesUSD}</div>
						<table className={`${styles.quoteTable} ${isDiscountPrice ? styles.discountTh : ''}`}>
							<thead>
								<tr>
									<th>{iQTY}</th>
									<th>{iUnitPrice}</th>
									{/* // 补充多语言 styles.discountTh */}
									{isDiscountPrice && <th>DISC PRICE</th>}
									<th>{iExtPriceUp}</th>
								</tr>
							</thead>
							<tbody>
								{
									productPrices.map((item) => (
										<tr key={item.id}>
											<td style={getRowColor(item?.id)}>{item?.quantity}+</td>
											{/* textDecoration: 'line-through'  */}
											<td style={getRowColor(item?.id)}>{currencyInfo.label}{toFixedFun(item?.unitPrice, +paramMap?.priceDecimal)}</td>
											{isDiscountPrice && <td style={getRowColor(item?.id)}>{currencyInfo.label}{toFixedFun(item?.unitPrice, +paramMap?.priceDecimal)}</td>}
											{/* 数量*折扣价 */}
											<td style={getRowColor(item?.id)}>
												{currencyInfo.label}{toFixedFun(calculateItemPriceTotal({
													voList: productPrices,
													cartQuantity: item?.quantity,
												}), +paramMap?.subtotalDecimal)}
											</td>
										</tr>
									))
								}

							</tbody>
						</table>

						<div className='ps-table-need-more'>
							<div className="ps-table-more">
								<div>{i18Translate('i18AboutProduct.NeedMore', 'Need More?')}</div>
								<div className='product-quote-btn' onClick={(e) => handleShowQuoteModal(e, 'no-quantity')}>{i18Translate('i18AboutProduct.Click To Quote', "Click To Quote")} </div>
							</div>
							<div className='ps-table-more-costs'>
								{i18Translate('i18AboutProduct.CostsTip', "This price does not include VAT and shipping costs.")}
							</div>
						</div>

					</div>
				}

				{
					!isHavePrice &&
					<div className="product-right-flag">
						{i18Translate('i18AboutProduct.RfqsTip', 'Please send your rfqs, our sales representive will send you offer within 24 hours.')}
					</div>
				}

				{
					isShowDuplicatePart && (
						<CartDuplicatePart
							isShow={isShowDuplicatePart}
							handleCancel={() => setIsShowDuplicatePart(false)}
							handleConfirm={() => (setIsShowDuplicatePart(false), handleShowCartView())}
						/>
					)}

				{
					isShowModal && (
						<AddProjectModal
							isShowModal={isShowModal}
							productList={[
								{ productId: id, quantity, name },
							]}
							handleOk={() => setIsShowModal(false)}
							handCancel={() => setIsShowModal(false)}
						/>
					)}

				{isCartView && (
					<Modal
						centered
						title={i18Translate('i18MyCart.Cart', 'CART')}
						footer={null}
						width={550}
						onCancel={(e) => handleHideCartView(e)}
						open={isCartView}
						closeIcon={<i className="icon icon-cross2"></i>}
					>
						<AddCartPreview
							submitFn={() => { handleHideCartView(); Router.push(`/account/shopping-cart`) }}
							continueFn={handleHideCartView}
							product={newProductData}
							quantity={quantity}
						/>
					</Modal>
				)}

				{isRfqView && (
					<Modal
						centered
						title={iRFQ}
						footer={null}
						width={550}
						onCancel={() => setIsRfqView(false)}
						open={isRfqView}
						closeIcon={<i className="icon icon-cross2"></i>}
					>
						<AddRfqPreview
							submitFn={() => { setIsRfqView(false); Router.push(ACCOUNT_QUOTE) }}
							continueFn={() => setIsRfqView(false)}
							quantity={Number(quantity)}
							otherParams={{
								addCartList: [productDetailData],
								type: 'more',
							}}
						/>
					</Modal>
				)}

				{/* 详情页询价 */}
				{
					isQuoteView && (
						<Modal
							centered
							title={i18Translate('i18FunBtnText.REQUEST A QUOTE', "Request a Quote")}
							footer={null}
							width={550}
							onCancel={(e) => handleHideQuoteModal(e)}
							open={isQuoteView}
							closeIcon={<i className="icon icon-cross2" />}
						>
							{isQuoteView && (
								<QuoteModal
									cancelFn={handleHideQuoteModal}
									submitFn={handleHideQuoteModal}
									newProduct={newProduct}
									quantity={quantity}
								/>
							)}
						</Modal>
					)}

				{!observerShow && <ObserverAddCart
					addBack={(e) => addBack(e)}
					curIsSame={(e) => handleIsSame(e)}
					onChangeInput={(e) => observerChangeInput(e)}
					buyQuantity={quantity}
				/>}

			</div>
		</Form>
	);
};

export default connect((state) => state)(ProductQuoteForm);
