import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { connect, useDispatch } from 'react-redux';
import Router, { useRouter } from 'next/router';
import Head from 'next/head';
import { Button, message } from 'antd';
import { withCookies } from 'react-cookie';
import { useCookies } from 'react-cookie';
import { setPageLoading } from '~/store/setting/action';

import dynamic from 'next/dynamic';
import AlipayBtn from '~/components/ecomerce/orderCom/AlipayBtn' // 不能dynamic，不然点击无效
const OrderReview = dynamic(() => import('~/components/partials/account/OrderReview'));

const PayPalScriptProviderCom = dynamic(() => import('~/components/ecomerce/orderCom/PayPalScriptProviderCom'));


import { OrderRepository, PaymentRepository } from '~/repositories';
import { getCurrencyInfo } from '~/repositories/Utils';

import ShopCartContext from '~/utilities/shopCartContext'
import { PAYMENT_TYPE, ORDER_STATUS, PAYPAL_CLIENT_ID } from "~/utilities/constant"
import { PRIVACY_TERMS_AND_CONDITIONS, PRIVACY_CENTER, ACCOUNT_SHOPPING_CART, } from "~/utilities/sites-url"
import { decrypt } from '~/utilities/common-helpers';
import { getThousandsData } from '~/utilities/ecomerce-helpers';
import { changeServerSideLanguage } from '~/utilities/easy-helpers';


import useEcomerce from '~/hooks/useEcomerce';
import useLanguage from '~/hooks/useLanguage';
import useLocalStorage from '~/hooks/useLocalStorage';


import noop from 'lodash/noop'

const Review = (props) => {
	const { i18Translate } = useLanguage();
	const { setCurCartDataHok } = useEcomerce();
	const iTotal = i18Translate('i18MyCart.Total', "Total")
	const iSubmitOrder = i18Translate('i18AboutOrder2.Submit Order', 'Submit Order')
	const iSubmittingOrderTip = i18Translate('i18AboutOrder2.SubmittingOrderTip', 'By submitting your order you agree to')
	const iTermsAndConditions = i18Translate('i18MenuText.Terms and Conditions', 'Terms and Conditions')
	const iPrivacyCenter = i18Translate('i18MenuText.Privacy Center', 'privacy Center')
	const iAnd = i18Translate('i18SmallText.And', "and")

	const { paramMap, refInstance } = props
	const dispatch = useDispatch();
	const pdfRef = useRef();
	const aliPayRef = useRef()
	const { updateShippingPrice, summitInfo, paymentInfo = {}, cardInfo = {} } = useContext(ShopCartContext);
	const [order, setOrder] = useState(null);
	const [vatPrice, setVatPrice] = useState(summitInfo?.vatPrice);
	const vatPriceRef = useRef(summitInfo?.vatPrice);
	const router = useRouter();
	const { payType = 1, orderId = '' } = router.query;
	const decryptOrder = decrypt(orderId)
	const { token } = props?.auth;
	const [cookies] = useCookies(['account', 'paymentOrderId']);
	const [paypalPayStatus, setPaypalPayStatus] = useLocalStorage('paypalPayStatus', ORDER_STATUS.submit);
	const [noUnpaidOrder, setNoUnpaidOrder] = useLocalStorage('noUnpaidOrder', '');

	const [invoiceHtml] = useState('');
	const [invoiceUrl] = useState('');

	const [isLoading] = useState(false)
	const currencyInfo = getCurrencyInfo()
	const payPalBtnRef = useRef()

	React.useImperativeHandle(refInstance, () => ({
		onSubmit: () => {
			if (payType != PAYMENT_TYPE.PayPal && payType != PAYMENT_TYPE.Alipay) {
				handleOrderPay()
			} else if (payType == PAYMENT_TYPE.Alipay) {
				// 支付宝支付
				aliPayRef?.current?.onSubmit()
			} else if (payType == PAYMENT_TYPE.PayPal) {
				// paypal支付
				payPalBtnRef.current?.click()
			}
		}
	}))

	// React.useImperativeHandle(refInstance,()=>({
	// 	onsubmit:()=>{
	// 		if(payType != PAYMENT_TYPE.PayPal && payType != PAYMENT_TYPE.Alipay){
	// 			handleOrderPay()
	// 		}else if(payType == PAYMENT_TYPE.Alipay){
	// 			aliPayRef?.current?.onSubmit()
	// 		}else if(payType == PAYMENT_TYPE.PayPal){
	// 			createOrder()
	// 		}
	// 	}
	// }))

	const getOrder = async () => {
		if (!cookies?.account?.token || !decryptOrder) {
			return false;
		}
		const res = await OrderRepository.getOrder(decryptOrder, cookies?.account?.token);
		if (res.code == 0) {
			updateShippingPrice(res?.data?.shippingPrice || 0)
			setOrder(res.data);
			props?.callbackOrderData(res.data)
		}
	}

	useEffect(() => {
		getOrder();
	}, [decryptOrder])

	// 点击支付按钮-非PayPal支付 4066330000000004
	const handleOrderPay = async () => {
		const data = {
			payType,
			orderId: decryptOrder,
			vatNumber: paymentInfo?.vatNumber,
			orderNumber: paymentInfo?.orderNumber,
			vatPrice: Number(summitInfo?.vatPrice),
			invoiceUrl,
		}

		if (payType == 4) data.cardInfo = JSON.stringify({ ...cardInfo });
		dispatch(setPageLoading(true));

		let res = await PaymentRepository.requestPayment(data, token)

		// return
		setNoUnpaidOrder('')

		dispatch(setPageLoading(false));
		if (res.code === 0) {
			if (payType == PAYMENT_TYPE.PayPal) {
				try {
					let response = JSON.parse(res.data.response).links.filter((item) => {
						return item.rel === 'approve';
					})[0];
					window.location = response.href;
				} catch (e) {
					message.error('Paypal Launch Failed')
				}
			} else if (payType == PAYMENT_TYPE.LianLian) {
				// 调用接口创建支付订单，传入支付成功页面地址， 连连支付 - 改用弹窗支付
				// 接口调用成功之后打开支付页面
				if (res.data.response) {
					const payData = JSON.parse(res.data.response ?? '{}');
					payData.order.payment_url && window.open(payData.order.payment_url);
					goPaymentSuc()
				}
			}
			else {
				setPaypalPayStatus(ORDER_STATUS.submit)
				setCurCartDataHok({})
				Router.push(`${ACCOUNT_SHOPPING_CART}?num=5&orderId=${orderId}`);
			}
		}
	}

	const initialOptionsPro = {
		"client-id": PAYPAL_CLIENT_ID,
		currency: currencyInfo.value,
		intent: "authorize",
	};

	const initialOptions = {
		"client-id": PAYPAL_CLIENT_ID,
		currency: currencyInfo.value,
		intent: "authorize", // 授权
		onClose: noop(),
	};

	const createOrderSummit = useCallback(async (price) => {
		// 如果即使在 useState 中使用了 summitInfo?.vatPrice 并且已经是最新值，但在 <PayPalButtons> 的 createOrder 属性中仍然无法获取到最新的 vatPrice 值，那么可能是由于闭包的原因导致的。
		if (payType != PAYMENT_TYPE.PayPal || !cookies?.paymentOrderId) return
		const dataType = {
			payType,
			orderId: decryptOrder,
			vatNumber: paymentInfo?.vatNumber,
			orderNumber: paymentInfo?.orderNumber,
			vatPrice: Number(vatPriceRef.current),
			userId: order?.appUserId,
		}

		let res = await PaymentRepository.requestPayment(dataType, token)
		return res.data.payId
	}, [vatPrice]);


	const onApprove = (data, actions) => {
		setPaypalPayStatus(ORDER_STATUS.sucPayment)
		setCurCartDataHok({})
		Router.push(`${ACCOUNT_SHOPPING_CART}?num=5&orderId=${orderId}&payType=${payType}`);
	}

	// 支付成功跳转
	const goPaymentSuc = () => {
		setCurCartDataHok({})
		setPaypalPayStatus(ORDER_STATUS.submit)
		Router.push(`${ACCOUNT_SHOPPING_CART}?num=5&orderId=${orderId}&payType=${payType}`);
	}

	useEffect(() => {
		// 检查，不需要就删除
		if ((!decrypt(cookies?.paymentOrderId || '') && !props?.isLoading)) {
			setCurCartDataHok({})
			for (let i = 0; i < 20; i++) {
				window.history.pushState({}, 'shopping-cart', ACCOUNT_SHOPPING_CART);
			}
			Router.push(ACCOUNT_SHOPPING_CART);
		}
	}, [])

	useEffect(() => {
		vatPriceRef.current = summitInfo?.vatPrice;
		setVatPrice(summitInfo?.vatPrice)
	}, [summitInfo])

	const i18Title = i18Translate('i18Seo.shoppingCart.title', "")
	const i18Key = i18Translate('i18Seo.shoppingCart.keywords', "")
	const i18Des = i18Translate('i18Seo.shoppingCart.description', "")
	return (
		<div style={{ position: 'relative' }}>
			<Head>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />


				{/* <!-- Google tag (gtag.js) -->
				<script async src="https://www.googletagmanager.com/gtag/js?id=AW-11224453510">
				</script>
				<script>
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());

					gtag('config', 'AW-11224453510');
				</script> */}
				<script defer src="https://www.googletagmanager.com/gtag/js?id=AW-11224453510"></script>
				<script defer dangerouslySetInnerHTML={{
					__html: `window.dataLayer = window.dataLayer || [];
									function gtag(){dataLayer.push(arguments)}
									gtag('js', new Date());
									gtag('config', 'AW-11224453510');`
				}}>
				</script>

			</Head>
			<div className="ps-order-review ps-checkout ps-section--shopping">
				<div></div>
				<div>
					<div className="ps-section__content">
						<div className="ps-form--checkout">
							<div className="ps-form__content">
								<div className="" style={{ margin: 0 }}>
									<div>
										<OrderReview payType={payType} order={order ?? {}} paramMap={paramMap} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='pub-border15 mt10 pub-bgc-white box-shadow'>
					<div className='ps-total-price'>{iTotal}：{currencyInfo.label}{getThousandsData(order?.price ?? 0)}</div>
					<div className="ps-form__submit">
						<div
							className="ps-block__footer mt20"
							style={{ display: 'flex', position: 'relative', height: '32px', overflow: "hidden" }}
						>
							{/* 支付方式不为PayPal时 paypal-buttons */}
							{payType != PAYMENT_TYPE.PayPal && payType != PAYMENT_TYPE.Alipay && <Button
								loading={isLoading}
								type="submit" ghost='true'
								className='login-page-login-btn ps-add-cart-footer-btn custom-antd-primary pub-font13 w160'
								onClick={handleOrderPay}
							>
								{iSubmitOrder}
							</Button>
							}

							{payType == PAYMENT_TYPE.Alipay && (
								<AlipayBtn
									ref={aliPayRef}
									orderInfo={{
										payType,
										orderId: decryptOrder,
										vatNumber: paymentInfo?.vatNumber,
										orderNumber: paymentInfo?.orderNumber,
										vatPrice: Number(summitInfo?.vatPrice),
										invoiceUrl,
									}}
									token={token}
									btnName={iSubmitOrder}
									onCallBack={(v) => { setPaypalPayStatus(v) }}
									isJumpToDetails={true}
								/>
							)}

							{/* 支付方式为PayPal时的支付按钮 */}
							{payType == PAYMENT_TYPE.PayPal &&
								<div className='w150'>
									{/* <PayPalScriptProvider options={initialOptionsPro}> */}
									<PayPalScriptProviderCom
										paypalCreateOrder={() => createOrderSummit(summitInfo?.vatPrice)}
										paypalOnApprove={onApprove}
										paypalOnSuccess={onApprove}
										paypalGoPaymentSuc={goPaymentSuc}
									/>
									{/* <PayPalButtons
											options={initialOptions}
											createOrder={() => createOrderSummit(summitInfo?.vatPrice)}
											onApprove={onApprove}
											onSuccess={onApprove}
											onError={() => {
												console.log('onError--del')
												// goPaymentSuc()  // 调用paypal支付失败，不能执行
											}}
											// 离开页面也会调用，不能执行
											onClose={() => { }}
											onCancel={() => {
												console.log('onCancel requestPayment1 成功，但是取消支付--del')
												goPaymentSuc()
											}}
											style={{
												layout: "horizontal",
												fontSize: 13,
												height: 32,
												width: 170,
											}}
										>
										</PayPalButtons> */}
									{/* </PayPalScriptProvider> */}
									<Button
										ref={payPalBtnRef}
										loading={isLoading}
										type="submit" ghost='true'
										className='login-page-login-btn ps-add-cart-footer-btn custom-antd-primary pub-paypal-btn pub-font13 w150 mt30'
										style={{ borderRadius: '4px' }}
									>
										{iSubmitOrder}
									</Button>
								</div>
							}
						</div>
					</div>
					<div className='ps-total-Privacy mt10 mb5'>{iSubmittingOrderTip}&nbsp;
						<a href={PRIVACY_TERMS_AND_CONDITIONS} target="_blank" style={{ display: 'inline-block' }}
							className="color-link">
							{iTermsAndConditions}
						</a>
						&nbsp;{iAnd}&nbsp;
						<a href={PRIVACY_CENTER} target="_blank" style={{ display: 'inline-block' }}
							className="color-link">
							{iPrivacyCenter}
						</a>
					</div>
				</div>
				<div style={{ height: 0, overflowY: 'scroll' }}>
					<div ref={pdfRef} dangerouslySetInnerHTML={{ __html: invoiceHtml }} style={{ opacity: '1' }} />
				</div>
			</div>
		</div>
	);
};

const ReviewComponent = connect((state) => state)(withCookies(Review))

export default React.forwardRef((props, ref) => <ReviewComponent {...props} refInstance={ref} />);

export async function getServerSideProps({ req }) {
	const translations = await changeServerSideLanguage(req)

	return {
		props: {
			...translations,
		}
	}
}
