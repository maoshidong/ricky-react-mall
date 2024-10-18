import React, { useState, useEffect, useContext } from 'react';
import { connect, useDispatch } from 'react-redux';

import { useRouter } from 'next/router';
import { message } from 'antd';
import { withCookies } from 'react-cookie';
import { useCookies } from 'react-cookie';
import { setShoppingCartPayment } from '~/store/ecomerce/action';
import ModulePaymentMethods from '~/components/ecomerce/modules/ModulePaymentMethods';

import OrderRepository from '~/repositories/zqx/OrderRepository';
import AccountRepository from '~/repositories/zqx/AccountRepository';

import { calculateTotalAmount, toFixed } from '~/utilities/ecomerce-helpers';
import ShopCartContext from '~/utilities/shopCartContext'
import { getExpiresTime, encrypt } from '~/utilities/common-helpers';
import { ACCOUNT_SHOPPING_CART } from '~/utilities/sites-url'

import useClickLimit from '~/hooks/useClickLimit';
import useAccount from '~/hooks/useAccount';
import useEcomerce from '~/hooks/useEcomerce';
import useCart from '~/hooks/useCart';
import useLanguage from '~/hooks/useLanguage';



const Payment = ({ auth, ecomerce, cookies, refInstance }) => {
	const { getDomainsData } = useLanguage();
	const dispatch = useDispatch();
	const { allCartItems, shoppingCartPayment, curCartData } = ecomerce
	const [cookiesData] = useCookies(['paymentOrderId']);

	const [limitDisabled, handleLimitClick] = useClickLimit();
	const { accountUpdateProfile } = useAccount();
	const { saveOrderStepData } = useCart();

	const { summitInfo, voucheour, paymentInfo } = useContext(ShopCartContext)
	// const [allOrderDetails, setAllOrderDetails] = useState(summitInfo?.orderDetails)
	const { token, isAccountLog } = auth;
	const Router = useRouter();
	const [order, setOrder] = useState({
		...summitInfo,
		couponPrice: voucheour.price ?? 0
	});
	const [profile, setProfile] = useState({});
	const { addToLoadCarts } = useEcomerce();

	const { vatNumber, orderNumber, remark } = paymentInfo || {}
	// 支付方式改变
	const paymentMethodsChange = paymentWay => {
		dispatch(setShoppingCartPayment({
			...shoppingCartPayment,
			paymentWay
		}))
		// let data = summitInfo?.orderDetails
		// data = allCartItems?.map(item => ({
		//     productId: item.productId,
		//     price: toFixed(calculateTotalAmount([item], paymentWay), 2),
		//     quantity: item.cartQuantity,
		// }))
		// setAllOrderDetails(data)
	}
	// 根据阶梯价和数量计算单价
	const getQuantityPrice = (pricesList, q) => {
		let currentPrice = 0;
		pricesList?.forEach((item) => {
			if (item?.quantity <= q) {
				currentPrice = item?.unitPrice;
			}
		});
		return currentPrice
	}

	// 创建订单, 生成订单
	const summitOrder = async (payType) => {
		if (limitDisabled) return  // 限制多次点击
		const shoppingPaymentData = {
			paymentWay: payType, // 支付方式
			vatNumber,
			orderNumber,
			remark,
		}

		// 生成订单需要传的参数
		const createOrderData = {
			...summitInfo,
			...shoppingPaymentData,
			savaAddress: (isAccountLog && summitInfo?.savaAddress && !cookiesData?.paymentOrderId) ? 1 : 0, // 登录状态、地址为手动输入的，并且提交时没有订单号才传1
			// id: decrypt(cookiesData?.paymentOrderId || '') || '',
			orderId: curCartData?.orderId || '30000100', // 传购物车的id
			// 产品信息-在其它窗口删掉了购物车数据
			orderDetails: allCartItems?.map(item => ({
				productId: item.productId,
				price: toFixed(calculateTotalAmount([item], shoppingPaymentData?.paymentWay), 2),
				// 根据阶梯价和数量计算单价
				onePrice: Number(toFixed(getQuantityPrice(item?.pricesList, item?.cartQuantity), 4)),
				// onePrice: item?.unitPrice,
				callBackId: item?.callBackId || null, // 报价id, int类型 默认只能null
				productName: item?.productName || null, // 报价id, int类型 默认只能null
				sku: item?.sku || null, // 报价id, int类型 默认只能null
				quantity: item?.cartQuantity, // 下单的数量
				storageQuantity: item?.quantity, // 库存的数量: 下单成功后固定该订单库存和发货数量,
				sendDate: item?.sendDate, // 发货时间, type 3
				remark: item?.userProductTag, // 打标签,备注
			})),
		}

		// 登录了，没有联系信息才保存联系信息 - s
		const { firstName, lastName, phone, addressId, orderType, companyName, customerType } = createOrderData?.addDeliveryAddress || {}
		// 保存联系信息参数
		const updateProfileParams = {
			firstName, lastName, phone, country: addressId,
			orderType, companyName, customerType
		}
		accountUpdateProfile(updateProfileParams)

		// 登录了才有优惠券
		if (voucheour?.price > 0 && isAccountLog) {
			createOrderData.couponId = voucheour?.price > 0 ? voucheour?.value : null // 优惠券的最新数据都从voucheour拿，不然提交订单可能导致价格错误
		}

		cookies.set('shoppingCartPayment', shoppingPaymentData, { path: '/', expires: getExpiresTime(30) })
		dispatch(setShoppingCartPayment(shoppingPaymentData))

		await handleLimitClick(async () => {
			const res = await OrderRepository.createOrder({
				...createOrderData,
				languageType: getDomainsData()?.defaultLocale,
			}, cookiesData?.account?.token);

			if (res && res.code === 0) {
				// 登录状态、地址为手动输入的，并且提交时没有订单号才传1  -  搜索解决前才可删除
				cookies.set('paymentOrderId', encrypt(res?.data?.orderId), { path: '/', expires: getExpiresTime(30) })
				setTimeout(() => {
					saveOrderStepData({
						paymentWay: payType,
						remark,
						step: 5,
					})
					Router.push(`${ACCOUNT_SHOPPING_CART}?num=4&orderId=${encrypt(res.data.orderId)}&payType=${payType}`);
				}, 0);
			} else {
				message.error(res.msg)
			}
		})
	}
	const getProfile = async () => {
		if (!token) {
			return false;
		}
		const res = await AccountRepository.getProfile(token);
		if (res && res.code == 0) {
			setProfile(res.data);
		}
	}

	useEffect(() => {
		if (token) {
			addToLoadCarts()
		}
		getProfile();
	}, [token])

	return (
		<div className="ps-checkout ps-section--shopping ps-section--payment">
			<div className="">
				<div className="ps-section__content">
					<div className="ps-form--checkout">
						<div className="ps-form__content">
							<div className="">
								<div className="">
									<ModulePaymentMethods ref={refInstance} summitOrder={summitOrder} paymentMethodsChange={paymentMethodsChange} profile={profile} order={order} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

	);
};

const PaymentComponent = connect(state => state)(withCookies(Payment))

export default React.forwardRef((props, ref) => <PaymentComponent {...props} refInstance={ref} />) 
