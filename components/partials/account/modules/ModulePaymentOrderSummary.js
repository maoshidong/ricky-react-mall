import React, { useContext, useEffect, useRef, useState } from 'react';
import { Popover } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';

import useLocalStorage from '~/hooks/useLocalStorage';
import useLanguage from '~/hooks/useLanguage';
import useEcomerce from '~/hooks/useEcomerce';
import useI18 from '~/hooks/useI18';
import useOrder from '~/hooks/useOrder';


import { calculateTotalAmount, toFixedFun, getThousandsData, toFixed } from '~/utilities/ecomerce-helpers';
import ShopCartContext from '~/utilities/shopCartContext';
import { PAYMENT_TYPE, ORDER_STATUS } from '~/utilities/constant';
import { ACCOUNT_SHOPPING_CART, } from "~/utilities/sites-url"
import NoSSR from 'react-no-ssr';
import { getCurrencyInfo } from '~/repositories/Utils';
import { PaymentRepository } from '~/repositories';
import { useCookies } from 'react-cookie';
import Router, { useRouter } from 'next/router';
import { encrypt, decrypt } from '~/utilities/common-helpers';
import PayPalBtn from '~/components/ecomerce/orderCom/PayPalBtn'; // Paypal支付
import { Flex } from '~/components/common'
import noop from 'lodash/noop'; // round
import includes from 'lodash/includes';
// 下单右侧金额
const ModulePaymentOrderSummary = ({
	type,
	summaryStep,
	payment = false,
	order = {},
	shippingPrice = 0,
	voucheour = {},
	ecomerce,
	onContinue = noop()
}) => {
	const router = useRouter();
	const { setCurCartDataHok } = useEcomerce();
	const { i18Translate, curLanguageCodeEn } = useLanguage();
	const { payWayList, getPayWayList, getPayWayItem } = useOrder()
	const { iItems, iRemainingPayment } = useI18()
	const iVoucher = i18Translate('i18MyCart.Voucher', "Voucher")
	const iTotal = i18Translate('i18MyCart.Total', 'Total')
	const iSubTotal = i18Translate('i18MyCart.SubTotal', "SubTotal")
	const iSecurelyGuarantee = i18Translate('i18MyCart.SecurelyGuarantee', "Your data will be encrypted and transmitted securely")
	const iOrderSummary = i18Translate('i18MyCart.Order Summary', "Order Summary ")
	const iSurchargeSummary = i18Translate('i18MyCart.Surcharge Summary', "Surcharge Summary")
	const iContinue = i18Translate('i18SmallText.Continue', 'Continue')
	const iSubmitOrder = i18Translate('i18AboutOrder2.Submit Order', 'Submit Order')
	const currencyInfo = getCurrencyInfo()

	const { allCartItems, shoppingCartPayment } = ecomerce
	const { paymentWay } = shoppingCartPayment
	const { summitInfo, saveSummitInfo, paymentInfo = {} } = useContext(ShopCartContext);
	
	const [cookies] = useCookies(['account', 'paymentOrderId']);
	const [paypalPayStatus, setPaypalPayStatus] = useLocalStorage('paypalPayStatus', ORDER_STATUS.submit);
	const vatPriceRef = useRef(summitInfo?.vatPrice);

	// 从url中拿数据,  orderId可能是：1 前端自己加密的订单号 2 后端返回的
	// shopping-cart页面需要从?后拿orderId, orderDetail和surchargeDetails从/后拿
	const { payType, orderId, num } = router.query;
	// router.query的orderId 可能是数组或者字符串
	// console.log(order, 'order---111111--del')
	// console.log(decrypt('_nYSl9CTqefdfVfupnYTrg=='), 'orderId---222--del')
	// 	console.log(decrypt('fEaArk4L5_kuLx3NPJ9ipQ=='), 'orderId---222--del')

	// 1. vscode打开的文件标签过多，换行
		// 1、文件->首选项->设置
		// 2、wrapTabs搜索，勾选
		// 3.  控制超出选项卡后，选项卡是否应在多行之间换行。
	// 旧版，先别删除
	// const queryOrderId = typeof orderId === 'string' ? orderId : orderId?.[0]
	// const decryptOrderQuery = decrypt(queryOrderId) // 有order?.orderId 就不需要解密  加密解密问题（pbb1iICVTL7QI0plenC7ow==?flag=true    5的加密，导致解密失败）
	// const decryptOrder11 = order?.orderId || decryptOrderQuery // 有订单详情数据就拿，否则就拿解密数据  ,  去掉导致payment-success页拿不到orderId ?

	let decryptOrder = useRef(order?.orderId); // 加密后的
	let newestOrder = useRef(order?.orderId); // 加密后的
	useEffect(() => {
		decryptOrder.current = encrypt(order?.orderId) // order?.orderId是未加密的
		newestOrder.current = order?.orderId // 未加密的
	}, [order?.orderId])
	let shippingView, bankView, totalView
	let amount = 0; // 商品费用总和 
	let totalAmount = 0;  // 所有费用总和 


	// 计算税费
	const calculatedTax = (amount, shippingPrice) => {
		const { rate, fixedAmount, otherFee } = getPayWayItem(paymentWay, payWayList) // 管理端设置的金额比率和金额
		let taxNum = 0

		if (order?.vatPrice) {
			taxNum = order?.vatPrice
			return taxNum
		}
		// 税费 = 总金额加运费 * 税率 + 其它两种金额值- 新的：拿管理端配置的数据，算法一样了; 附加费也是一样的算法
		taxNum = Number(toFixed(
			(( (Number(amount) + Number(shippingPrice)) * 100) * (rate * 100)) / 10000)
			, 2) + fixedAmount + otherFee

		// 1. PayPal支付 
		// if ((paymentWay == PAYMENT_TYPE.PayPal1 || paymentWay == PAYMENT_TYPE.LianLian) && summaryStep >= 3) {
		// 	// 税费 = 总金额加运费 * 税率 + 其它两种金额值
		// 	taxNum = Number(toFixed(
		// 		(( (Number(amount) + Number(shippingPrice)) * 100) * (rate * 100)) / 10000)
		// 		, 2) + fixedAmount + otherFee
		// } else if (paymentWay == PAYMENT_TYPE.WireTransfer) {
		// 	taxNum = fixedAmount + otherFee
		// }
			// console.log(taxNum,'taxNum----del')
			// console.log(toFixed(taxNum || 0, 2),'taxNum----del')
		return Number(toFixed(taxNum || 0, 2))
	}

	if (allCartItems && allCartItems.length > 0) {
		allCartItems?.map(item => {
			amount += Number(toFixed(calculateTotalAmount([item], paymentWay), 2))
		})

		// PayPal 支付 只取单价的两位数  && summaryStep > 2(到Payment步骤后)
		// amount = (paymentWay === PAYMENT_TYPE.PayPal && summaryStep > 2) ? calculateTotalAmount(cartList, PAYMENT_TYPE.PayPal) : calculateTotalAmount(cartList);
		// 每个步骤总价的组成不一样, case 2,需要加上运费
		switch (summaryStep) {
			case 1:
				totalAmount = amount
				break;
			case 2:
				totalAmount = amount + parseFloat(shippingPrice)
				break;
			case 3:
				totalAmount = amount + parseFloat(shippingPrice) + calculatedTax(amount, shippingPrice)
				break;
		}
		totalAmount = totalAmount - (parseFloat(voucheour?.price) ?? 0)
		// totalAmount = amount + parseFloat(shippingPrice) + calculatedTax(amount, shippingPrice) - (parseFloat(voucheour?.price) ?? 0)
	}

	// 这个if要放到下面，因为checkout阶段选择优惠券后这样计算totalAmount没问题，但payment阶段，要用这里从接口获取的数据覆盖，
	if (payment && order) {
		amount = parseFloat(order?.productPrice ?? 0);
		// 结算金额 = 产品总额 + 运费 + 税额((产品+运费)*4.6%) - 优惠金额
		totalAmount = amount + parseFloat(shippingPrice) + calculatedTax(amount, shippingPrice) - parseFloat(order.couponPrice ? order.couponPrice : 0)
	}

	// 运费
	shippingView = (
		<div className='ps-block--checkout-content'>
			<span>{i18Translate('i18AboutOrder2.Shipping Fee', "Shipping Fee")}:</span>
			<span>{currencyInfo.label}{getThousandsData(shippingPrice || 0)}</span>
		</div>
	);
	// 税额
	bankView = (
		<div className='ps-block--checkout-content'>
			<span>
				{i18Translate('i18AboutOrder2.Bank Fee', "Bank Fee")}:
				{curLanguageCodeEn() && <Popover
					trigger='hover'
					placement='right'
					content={
						<Flex column gap={10} className='pub-popover' style={{ width: 'auto', lineHeight: '14px', margin: '5px 0' }}>
							<Flex flex>Bank Fee, which is charged by the bank. </Flex>
							<Flex flex column>
								<div className='pub-color18 pub-fontw'>PayPal's fee:</div>
								<div>
									{toFixed(getPayWayItem(PAYMENT_TYPE.PayPal, payWayList)?.rate * 100, 2)}% of the total amount plus other miscellaneous fees.
								</div>
							</Flex>
							<Flex flex column>
								<div className='pub-color18 pub-fontw'>Bank transfer fee:</div>
								<div>US$35 per transaction.</div>
							</Flex>
						</Flex>
					}>
					<QuestionCircleOutlined style={{ marginLeft: '6px', marginTop: '5px', fontSize: '14px', color: '#555', width: '20px' }} />
				</Popover>
				}
			</span>
			<span>{currencyInfo.label}{getThousandsData(calculatedTax(amount, shippingPrice))}</span>
		</div>
	);
	// Total
	totalView = (
		<div className='ps-block--checkout-content' style={{ fontSize: '16px' }}>
			<span>{iTotal}:</span>
			<span style={{ fontWeight: '600' }}>{currencyInfo.label}{getThousandsData(totalAmount || 0)}</span>
		</div>
	);

	// 附加费剩余付款
	const remainingPayment = () => {
		const curNum = getThousandsData(order?.payPendingPrice || 0)
		if(Number(curNum) === 0) return
		return (
			<div className='ps-block--checkout-content pub-font16'>
				<span>{iRemainingPayment}:</span>
				<span className='pub-fontw'>{currencyInfo.label}{curNum}</span>
			</div>
		)
	}
	// 优惠券
	const VoucherView = () => {
		const numCouponPrice = payment && order ? (toFixedFun((Number(order?.couponPrice) || 0), 2)) : (toFixedFun(voucheour.price || 0, 2))

		if (Number(numCouponPrice) === 0) return null
		return <div className='ps-block--checkout-content'>
			<span>{iVoucher}:</span>
			<span style={{ color: '#DF2424' }}>
				-{currencyInfo.label}{numCouponPrice}

			</span>
		</div>
	}

	// paypal支付调用
	const createOrder = async () => {
		// 如果即使在 useState 中使用了 summitInfo?.vatPrice 并且已经是最新值，但在 <PayPalButtons> 的 createOrder 属性中仍然无法获取到最新的 vatPrice 值，那么可能是由于闭包的原因导致的。
		if (payType != PAYMENT_TYPE.PayPal || !cookies?.paymentOrderId) return
		const dataType = {
			payType,
			orderId: newestOrder.current,
			vatNumber: paymentInfo?.vatNumber,
			orderNumber: paymentInfo?.orderNumber,
			vatPrice: Number(vatPriceRef.current),
			userId: order?.appUserId,
		}
		let res = await PaymentRepository.requestPayment(dataType, cookies?.account?.token)
		return res.data.payId
	}

	const onApprove = () => {
		setPaypalPayStatus(ORDER_STATUS.sucPayment)
		setCurCartDataHok({})
		// encrypt(decryptOrder)
		Router.push(`${ACCOUNT_SHOPPING_CART}?num=5&orderId=${decryptOrder.current}&payType=${payType}`);
	}

	const goPaymentSuc = () => {
		setCurCartDataHok({})
		setPaypalPayStatus(ORDER_STATUS.submit)
		// encrypt(decryptOrder)
		Router.push(`${ACCOUNT_SHOPPING_CART}?num=5&orderId=${decryptOrder.current}&payType=${payType}`);
	}
	// 下单继续按钮
	const submitOrContinue = () => {

		if (!includes([1, 2, 3, 4], summaryStep)) {
			return
		}

		return <div className="pub-flex ps-form__submit" style={{ marginTop: '16px', width: '100%' }}>
			{+payType === PAYMENT_TYPE.PayPal ? <PayPalBtn
				createOrder={createOrder}
				onApprove={onApprove}
				goPaymentSuc={goPaymentSuc}
				isOrderSummary={true}
				subBtnName={iSubmitOrder}
			/> :
				<button
					type="submit" ghost='true'
					style={{ width: '100%' }}
					onClick={() => { onContinue?.() }}
					className='login-page-login-btn ps-add-cart-footer-btn custom-antd-primary pub-font13'
				>
					{summaryStep == 4 ? iSubmitOrder : iContinue}
				</button>
			}
		</div>
	}

	useEffect(() => {
		// 没有获取到管理端的支付方式
		if (!amount || payWayList?.length === 0) return
		saveSummitInfo({
			...summitInfo,
			productPrice: toFixed(amount),
			price: toFixed(totalAmount || 0),
			vatPrice: calculatedTax(amount, shippingPrice)
		})
	}, [totalAmount, summaryStep, shoppingCartPayment, payWayList])

	useEffect(() => {
		vatPriceRef.current = summitInfo?.vatPrice;
	}, [summitInfo])
	useEffect(() => {
		getPayWayList()
	}, [])
	// return 11
	return (
		<NoSSR>
			<div className='catalogs__top-fixed' style={{ maxWidth: '100%' }}>
				<div className="ps-block--checkout-order pub-border box-shadow" style={{ maxWidth: '100%' }}>
					<div className='ps-block--checkout-total'>
						<div className='ps-block--checkout-summary'>
							{order?.type !== 2 ? iOrderSummary : iSurchargeSummary}
							{order?.type !== 2 ? `(${allCartItems.length || order?.orderDetails?.length} ${iItems})` : ''}
							{/* &nbsp;({allCartItems.length || order?.orderDetails?.length} {iItems}) */}
						</div>
						<div className='ps-block--checkout-content mt10'>
							<span>{iSubTotal}:</span>
							<span>{currencyInfo.label}{getThousandsData(amount)}</span>
						</div>
						{/* 运费 */}
						{(type && type != 'information' && order?.type !== 2) && shippingView}
						{/* 税额 */}
						{summaryStep >= 3 && bankView}

						{order?.type !== 2 && VoucherView()}
					</div>
					<div className="ps-block__content">
						{totalView}
						{order?.type === 2 && remainingPayment()}
						{
							submitOrContinue()
						}

					</div>
				</div>
				{summaryStep !== 6 && (
					<div className='data-security pub-border20 mt20 box-shadow' style={{ maxWidth: '100%' }}>
						<div className='sprite-icon4-cart sprite-icon4-cart-3-12'></div>
						<div className='data-security-text'>{iSecurelyGuarantee}</div>
					</div>
				)}
			</div>
		</NoSSR>
	);
};

export default connect(state => state)(ModulePaymentOrderSummary);
