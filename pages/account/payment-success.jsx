import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { connect } from 'react-redux';
import { Button, Popover } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import OrderRepository from '~/repositories/zqx/OrderRepository';

import useEcomerce from '~/hooks/useEcomerce';
import useLocalStorage from '~/hooks/useLocalStorage';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';

import dynamic from 'next/dynamic';
const OrderReviewPrint = dynamic(() => import('~/pages/account/orderReviewPrint'));
const ShowPaymentMethod = dynamic(() => import('~/components/partials/account/order/ShowPaymentMethod'));
const LogoCom = dynamic(() => import('~/components/shared/headers/zqx/LogoCom'));



import classNames from 'classnames';
// import ReCAPTCHA from 'react-google-recaptcha'; // 谷歌人机验证
import { useRouter } from 'next/router';
import { withCookies, useCookies } from 'react-cookie';
import Link from 'next/link'
import ReactToPrint from "react-to-print";
import { Spin } from 'antd';
import dayjs from 'dayjs';
import { PAY_STATUS, PAYMENT_TYPE, ORDER_STATUS, PAYPAL_CLIENT_ID } from '~/utilities/constant';
import { getEnvUrl, PAGE_CONTACT_US, ACCOUNT_ORDER_DETAIL } from '~/utilities/sites-url';

import { encrypt, decrypt, queryToObj } from '~/utilities/common-helpers';
import { changeServerSideLanguage } from '~/utilities/easy-helpers';
import { getCurrencyInfo } from '~/repositories/Utils';
import { PayPalButtons } from "@paypal/react-paypal-js";
import {
	UploadBankCopy, // 银行水单
	AttachOrderProduct, // 多订单产品
	AttachOrderPrice, // 附加订单
	DownLoadInvoice, // 下载invoice
	AlipayBtn, // 支付宝支付
	ExportToExcel // 导出订单ExCel
} from '~/components/ecomerce/orderCom/index'

const PaymentSuccessPage = (props) => {
	const {
		iPaymentCompleted, iPrint,
	} = useI18();
	const { i18Translate, i18MapTranslate, curLanguageCodeZh } = useLanguage();
	const iOrderDetails = i18Translate('i18AboutOrder.Order Details', "Order Details")
	const iOrderSusTip = i18Translate('i18AboutOrder2.OrderSusTip', "Thank you for your order")
	const iOrderNumber = i18Translate('i18AboutOrder.Order Number', "Order Number")
	const iOrderDate = i18Translate('i18AboutOrder.Order Date', 'Order Date')
	const iOrderStatus = i18Translate('i18MenuText.Order Status', "Order Status")
	const iCanceled = i18Translate('i18AboutOrder.Canceled', "Canceled")
	const iPaymentVerificationPending = i18Translate('i18AboutOrder.Payment Verification Pending', "Payment Verification Pending")
	const textTip = "If you have successfully made the payment, please wait. The system usually completes the verification of payment information within a few minutes."
	const iPaymentVerificationTip = i18Translate('i18AboutOrder.PaymentVerificationTip', textTip)
	const iAnEmail = i18Translate('i18AboutOrder.An email', 'An email')
	const iOrderSucTip1 = i18Translate('i18AboutOrder.OrderSucTip1', 'will be sent confirming the order you have just placed.')
	const iOrderSucTip2 = i18Translate('i18AboutOrder.OrderSucTip2', 'If you have questions or concerns about your order, please')
	const iOrderSucTip3 = i18Translate('i18AboutOrder.OrderSucTip3', 'and reference the order number.')

	const { removeItems } = useEcomerce();
	const { profileInfo = {}, isAccountLog } = props?.auth;

	let componentRef = useRef();
	const [order, setOrder] = useState(null); // 订单信息
	const [isShowPrintContent, setIsShowPrintContent] = useState(false); // useEffect才展示打印的

	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState(null);
	// 暂时注释
	// const [password, setPassword] = useState('')
	// const [strength, setStrength] = useState(0);
	// const [strengthClass, setStrengthClass] = useState('');

	// const [recaptcha, setRecaptcha] = useState(false);
	const Router = useRouter();
	const query = queryToObj(Router.asPath);
	const { orderId, orderld, token } = query;

	const decryptOrder = decrypt(orderId || orderld || '') // 解密订单号
	const [cookies] = useCookies(['account']);
	const [currentPayStatus, setCurrentPayStatus] = useState(ORDER_STATUS.submit) // 支付状态

	const [paypalPayStatus, setPaypalPayStatus] = useLocalStorage('paypalPayStatus', ORDER_STATUS.submit); // 支付状态
	const [address, setAddress] = useLocalStorage('cartAddress', {}); // 第二步地址信息
	const [_buySaveInfo, setBuySaveInfo] = useLocalStorage('cartBuySaveInfo', {});


	const { paramMap } = props
	const currencyInfo = getCurrencyInfo()

	// useEffect(() => {
	// 	if (profileInfo && !!Object.keys(profileInfo).length) {
	// 		const { uid } = profileInfo;
	// 	}
	// }, [profileInfo]);

	// const onChange = (value) => {
	// 	setRecaptcha(value);
	// }

	const getOrder = async () => {
		if ((!cookies?.account?.token) && !token) {
			return false;
		}

		setLoading(true)
		const res = await OrderRepository.getOrder(decryptOrder, cookies?.account?.token || token);

		if (!res?.data?.orderId) {
			Router.push('/404')
		}
		if (res?.code == 0) {
			const { data } = res
			// 支付没有及时回调状态
			if (data?.orderPay?.status == 0) {
				setCurrentPayStatus(paypalPayStatus)
			} else {
				setCurrentPayStatus(data?.payStatus)
			}
			setOrder(data);
			props?.callbackOrderData(data)
		}
		setLoading(false)
	}


	const initialOptions = {
		"client-id": PAYPAL_CLIENT_ID,
		currency: currencyInfo.value,
		intent: "authorize",
	};

	const createOrder = async () => {
		return order?.orderPay?.payId
	}
	const createSubmitOrder = async (order) => { }

	const onApprove = (data, actions) => {
		setPaypalPayStatus(ORDER_STATUS.sucPayment)
	}

	const onSuccess = (data, actions) => {
		setPaypalPayStatus(ORDER_STATUS.sucPayment)
	}

	useEffect(() => {
		if (order?.orderPay?.status == 0) {
			setCurrentPayStatus(paypalPayStatus)
		}
	}, [paypalPayStatus]);

	// 是否展示LianLian支付按钮
	const isShowLianPayBtn = () => {
		return order?.paymentWay == PAYMENT_TYPE.LianLian && order?.orderPay && order?.orderPay?.status != 1
	}

	// 点击LianLian支付
	const handleOrderPay = async () => {
		const payData = JSON.parse(order?.orderPay.response ?? '{}');
		payData.order.payment_url && window.open(payData.order.payment_url);
	}

	useEffect(() => {
		setTimeout(() => {
			removeItems('cart')
		}, 200)
		getOrder();
	}, [orderId]);

	useEffect(() => {
		// 点击支付按钮跳转到这，初始化一些数据
		if (isAccountLog) {
			const params = {
				...address,
				selectBillingAddress: {},
				selectShippingAddress: {},
			}
			setAddress(params)
		}
		setBuySaveInfo({})
	}, []);

	useEffect(() => {
		setIsShowPrintContent(true)
		const handleBackButton = () => {
			window.history.pushState(null, null, '/')
			Router.push('/')
		};

		window.addEventListener('popstate', handleBackButton);

		return () => {
			window.removeEventListener('popstate', handleBackButton);
		};
	}, [])

	let odLeftLabel = false; // 用于确定订单详情左侧标签的样式
	if (curLanguageCodeZh()) {
		odLeftLabel = true;
	}

	const content1 = () => {
		return <div className="ps-checkout">
			<div className="">
				<div className="ps-section__content">
					<div className="">
						<div>
							<div className="ps-block--payment-success pub-border20 box-shadow">
								<div className="ps-block__content" style={{ paddingBottom: '0px' }}>
									<div className='payment-success-thank-you pub-flex-align-center'>
										<div className='sprite-icon4-cart sprite-icon4-cart-1-14'></div>
										<div className='thank-you-text ml10 pub-fontw'>{iOrderSusTip}</div>
									</div>
									{/* 订单号 */}
									<div className='pub-flex-align-center mt15'>
										<div className={classNames(odLeftLabel ? 'order-detail-left-label-zh' : 'order-detail-left-label')}>{iOrderNumber}：</div>
										<Link className='ml10' href={`${ACCOUNT_ORDER_DETAIL}/${encrypt(order?.orderId)}`}>
											<span className='order-orderid'>{order?.orderId}</span>
										</Link>
									</div>
									<ShowPaymentMethod classN={classNames(odLeftLabel ? 'order-detail-left-label-zh' : 'order-detail-left-label')} order={order} />
									{/* 订单状态 */}
									<div className='pub-flex-align-center'>
										<div className={classNames(odLeftLabel ? 'order-detail-left-label-zh' : 'order-detail-left-label')}>{iOrderStatus}：</div>
										<div style={{ color: '#555' }}>
											{
												currentPayStatus === ORDER_STATUS.submit &&
												order?.status !== ORDER_STATUS.canceled &&
												(
													<span className='color-warn'>
														{i18MapTranslate(`i18AboutOrder.${PAY_STATUS[currentPayStatus]}`, PAY_STATUS[currentPayStatus])}</span>
												)
											}
											{
												order?.status === ORDER_STATUS.canceled &&
												(
													<span className='color-warn'>{iCanceled}</span>
												)
											}
											{/* orderPay 支付回调为1 - 订单没有取消 */}
											{
												(currentPayStatus === ORDER_STATUS.sucPayment && order?.orderPay?.status == '1' &&
													order?.status !== ORDER_STATUS.canceled
												) && (
													<span className='color-suc'>{iPaymentCompleted}</span>
												)
											}
											{
												(currentPayStatus === ORDER_STATUS.sucPayment && order?.orderPay?.status == '0') && (
													<div className='pub-flex-align-center color-warn'>
														{iPaymentVerificationPending}
														<Popover
															content={<div className='pub-popover'>
																{iPaymentVerificationTip}
															</div>}
															placement="right"
															trigger="hover"
														>
															<QuestionCircleOutlined style={{ marginLeft: '10px', fontSize: '14px', color: '#555', width: '20px' }} />
														</Popover>
													</div>
												)
											}
										</div>
									</div>
									{/* 订单日期 */}
									<div className='pub-flex-align-center'>
										<div className={classNames(odLeftLabel ? 'order-detail-left-label-zh' : 'order-detail-left-label')}>
											{iOrderDate}：</div><div style={{ color: '#555' }}>{dayjs(order?.createTime).format(curLanguageCodeZh() ? 'YYYY年M月D日' : 'DD MMMM, YYYY')}
										</div>
									</div>
									<p className='mt5'>
										{iAnEmail}
										（
										{order?.contact}
										）
										{iOrderSucTip1}<br />
										{iOrderSucTip2} <a target='_blank' className='ps-product__title color-link' href={getEnvUrl(PAGE_CONTACT_US)}>{i18Translate('i18MenuText.Contact Us', 'Contact us')}</a> {iOrderSucTip3}
									</p>
								</div>
								{/* 取消订单不展示按钮功能组 */}
								{
									order?.status !== ORDER_STATUS.canceled && (
										<div className="ps-block__bottom mb10 mt20" style={{ display: 'flex' }}>
											{/* 银行水单 */}
											{order?.paymentWay === '4' && <UploadBankCopy order={order} />}

											{/* PayPal支付按钮 */}
											{
												(order?.orderPay &&
													order?.status !== ORDER_STATUS.canceled &&
													currentPayStatus != ORDER_STATUS.sucPayment &&
													order?.paymentWay == PAYMENT_TYPE.PayPal
												) &&
												<div
													className='pub-flex-center w150 mr20'
													style={{ position: 'relative', height: '32px', overflow: "hidden", borderRadius: '6px' }}
												>
													{/* 支付方式为PayPal时的支付按钮 <PayPalBtn order={order} /> */}
													{/* <PayPalScriptProvider options={initialOptions}> */}
													<PayPalButtons
														options={initialOptions}
														createOrder={() => order?.orderPay ? createOrder(order) : createSubmitOrder(order)}
														onApprove={onApprove}
														onSuccess={onSuccess}
														onError={() => {
															console.log("Payment cancelled by user.");
														}}
														onClose={() => {
															console.log("Payment onClose by user.");
														}}
														onCancel={() => {
															console.log("Payment onCancel by user.");
														}}
														style={{
															layout: "horizontal",
															fontSize: 13,
															height: 32,
															width: 170,
														}}
													>
													</PayPalButtons>
													{/* </PayPalScriptProvider> */}
													<Button
														type="submit" ghost='true'
														className='login-page-login-btn ps-add-cart-footer-btn custom-antd-primary pub-paypal-btn pub-font13 w150 mt30'
														style={{ left: '0', cursor: 'pointer' }}
													>
														{i18Translate('i18MyCart.Payment', "Payment")}
													</Button>
												</div>
											}

											{/* 连连支付按钮 */}
											{isShowLianPayBtn() &&
												<Button
													type="submit" ghost='true'
													className='mr20 login-page-login-btn ps-add-cart-footer-btn custom-antd-primary pub-font13 w150'
													onClick={handleOrderPay}
												>
													{i18Translate('i18MyCart.Payment', "Payment")}
												</Button>
											}

											{order?.status !== ORDER_STATUS.canceled && currentPayStatus != ORDER_STATUS.sucPayment && order?.paymentWay == PAYMENT_TYPE.Alipay && (
												<AlipayBtn
													orderInfo={{
														payType: order.paymentWay,
														orderId: order.orderId,
													}}
													token={cookies?.account?.token || token}
													btnName={i18Translate('i18MyCart.Payment', "Payment")}
													onCallBack={v => setPaypalPayStatus(v)}
													isJumpToDetails={true}
												/>
											)}
										</div>
									)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	}
	const content2 = () => {
		if (!order?.status) return null
		return <div className='pub-react-to-print'>
			{/* ref={(el) => (componentRef = el)}  */}
			<div>
				<OrderReviewPrint paramMap={paramMap} orderData={order} orderId={orderId} />
			</div>
		</div>
	}
	// 打印
	// const getPrintCom1 = <div style={{ padding: '10px' }} ref={(el) => (componentRef = el)}>
	// 	111
	// </div>
	// function getPrintCom(el1) {
	// 	const aaa = <div ref={(el) => (componentRef.current = el)} style={{ padding: '10px' }}>111</div>
	// 	return componentRef
	// }
	// 创建一个包含 HTML 结构的组件
	// const PrintableContent = forwardRef((props, ref) => (
	// 	<div ref={ref} style={{ /* your styles here */ }}>
	// 		111
	// 	</div>
	// ));

	return (
		<>
			<Spin spinning={loading} size='large'>
				<div className="custom-antd-btn-more">
					<div className='pub-flex-between pub-flex-align-center mb10'>
						<div className='pub-left-title pub-font18'>{iOrderDetails}</div>
						<div className='pub-flex-align-center' style={{ gap: '20px' }}>
							{/* 多订单产品 */}
							{order?.attachProductList?.length > 0 && <div className='ml20'><AttachOrderProduct order={order} /></div>}
							{order?.additionList?.length > 0 && <AttachOrderPrice order={order} />}

							{/* 导出订单详情 */}
							{order && <ExportToExcel orderDetails={order?.orderDetails} orderId={order?.orderId} />}

							<ReactToPrint
								trigger={() =>
									<div className='ghost-btn'>
										<Button
											type="primary" ghost='true'
											className='login-page-login-btn ps-add-cart-footer-btn'
										>
											<div className='pub-flex-center'>
												<div className='sprite-icon4-cart sprite-icon4-cart-5-8'></div>
												<div className='ml10'>
													{iPrint}</div>
											</div>
										</Button>
									</div>
								}
								content={() => componentRef}
							/>
							{/* 下载发票 */}
							<DownLoadInvoice order={order} />
						</div>
					</div>

					{isShowPrintContent && <div ref={(el) => (componentRef = el)}>
						{content1()}
						{content2()}
					</div>}

					{/* 打印用 */}
					<div className='print-container' style={{ padding: '20px', }} ref={(el) => (componentRef = el)}>
						<div className='mt20 mb20'><LogoCom /></div>
						{content1()}
						{content2()}
					</div>

				</div>
				{/* 生成pdf */}
				{/* 同时修改另外一个DownloadPDF传参等 */}
				{/* <DownloadPDF
                    orderData={order}
                    orderId={order?.orderId} invoiceType={order?.paymentWay}
                    sendDateType={order?.sendDateType}
                    paramMap={paramMap}
                /> */}
			</Spin>
		</>
	);
};

export default connect(state => state)(withCookies(PaymentSuccessPage));

export async function getServerSideProps({ req }) {
	const translations = await changeServerSideLanguage(req)
	return {
		props: {
			...translations,
		}
	}
}