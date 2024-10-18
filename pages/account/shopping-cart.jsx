import React, { useEffect, useState, useRef } from 'react';
import { connect, useDispatch } from 'react-redux';
import Head from 'next/head';
import Link from 'next/link';
import { Steps, Button, Modal } from 'antd';
import { withCookies, useCookies } from 'react-cookie';

// import { DownloadPDFPreLoad} from '~/components/PDF/PreloadPdf'; // 预加载pdf字体

import { OrderRepository, CartRepository, AccountRepository } from '~/repositories';



import {
	setAllCartItems,
} from '~/store/ecomerce/action';

import { setSpinLoading } from '~/store/setting/action';

import dynamic from 'next/dynamic'

import MinLoginTip from '~/components/ecomerce/minCom/MinLoginTip';
import OperationModal from '~/components/partials/account/OperationModal';
import PageContainer from '~/components/layouts/PageContainer';
import MyFavorites from '~/components/partials/account/MyFavorites' // 收藏
import UnpaidOrderTip from '~/components/ecomerce/orderCom/UnpaidOrderTip' // 未支付
import ModalMoq from '~/components/ecomerce/modules/ModalMoq' // 最小订货量
import MyProject from '~/components/ecomerce/cartCom/CartProject/MyProject'; // 项目
import MyCart from '~/components/ecomerce/cartCom/cartBasket/MyCart'; // 购物车
import { EmialQuoteCart } from '~/components/ecomerce/cartCom'; // 邮件报价产品添加到购物车的提示。

// 在 Next.js 中，当在服务器端渲染（Server Side Rendering，SSR）时，由于 HTML 在服务器和客户端会分别生成，
// 可能会出现 Prop 'className' 不匹配的警告。这是因为服务器端生成的 HTML 和客户端生成的 HTML 不完全一致，
// 导致 React 在客户端进行渲染时发现差异而发出的警告、导致刷新时样式错乱。所有不能使用服务端渲染，ssr需要设置为false
const ModuleEcomerceCartItems = dynamic(() => import('~/components/ecomerce/modules/ModuleEcomerceCartItems'), { ssr: false, });
// import ModuleEcomerceCartItems from '~/components/ecomerce/modules/ModuleEcomerceCartItems'; // num等于0的右侧小计
// 不可行，
// const ModuleCartSummary = dynamic(() => import('~/components/ecomerce/modules/ModuleCartSummary'));
// const Checkout = dynamic(() => import('~/components/partials/account/Checkout'));
// const ShippingPage = dynamic(() => import('~/pages/account/shipping'));
// const Payment = dynamic(() => import('~/components/partials/account/Payment'));
// const OrderReview = dynamic(() => import('~/pages/account/orderReview'));
// const PaymentSuccessPage = dynamic(() => import('~/pages/account/payment-success'));
// const ModulePaymentOrderSummary = dynamic(() => import('~/components/partials/account/modules/ModulePaymentOrderSummary'));

import ModuleCartSummary from '~/components/ecomerce/modules/ModuleCartSummary'; // num等于0的右侧小计
import Checkout from '~/components/partials/account/Checkout'
import ShippingPage from '~/pages/account/shipping'
import Payment from '~/components/partials/account/Payment'
import OrderReview from '~/pages/account/orderReview'
import PaymentSuccessPage from '~/pages/account/payment-success'
import ModulePaymentOrderSummary from '~/components/partials/account/modules/ModulePaymentOrderSummary'; // num不等于0的右侧小计

import Router, { useRouter } from 'next/router'
import { calculateTotalAmount, toFixed, calculateTargetPriceTotal, toFixedFun } from '~/utilities/ecomerce-helpers';
import { scrollToTop, getExpiresTime } from '~/utilities/common-helpers'
import ShopCartContext from '~/utilities/shopCartContext'
// import { PAYPAL_INITIAL_OPTIONS } from '~/utilities/constant';
// import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import {
	ACCOUNT_CART_PROJECT_HASH, ACCOUNT_CART_CART_HASH, PRIVACY_CENTER,
	PRIVACY_TERMS_AND_CONDITIONS, ACCOUNT_FAVORITES_HASH
} from '~/utilities/sites-url'


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import localStorage from 'localStorage'

import useEcomerce from '~/hooks/useEcomerce';
import useLocalStorage from '~/hooks/useLocalStorage';
import useLanguage from '~/hooks/useLanguage';
import useCart from '~/hooks/useCart';

import Device from '~/components/hoc/Device';
import { changeServerSideLanguage, getLocale } from '~/utilities/easy-helpers';
import { getCurrencyInfo } from '~/repositories/Utils';
import { setToken } from '~/repositories/Repository';


const ShoppingCartScreen = ({ ecomerce, seo, global, auth, serverAllCartItems, paramMap, serverToken }) => {
	const { i18Translate, getDomainsData } = useLanguage();
	// const { handAllLoginData } = useAccount();
	// const { iCustomerReference } = useI18();

	const dispatch = useDispatch();

	const router = useRouter();
	const [newCookies, setCookie] = useCookies(['shoppingCartPayment', 'cart', 'auth', 'account'])
	const { id: cartId } = newCookies?.cur_cart_data || {}
	// const cartId = 111 gtag 
	useEffect(() => {
		// 可能是账户登录， 也可能是匿名登录
		if (!newCookies?.account?.isAccountLog) {
			// dispatch(logOut());
			// 如果不是账号登录，就存储, 如果是账户登录  如果存储， 会导致前端token存储时间加长， 后端token到期失效，对不上401
			setToken(serverToken);
			setCookie('account', {
				...newCookies?.account,
				token: serverToken,
			}, { path: '/', expires: getExpiresTime(30) });
		}
		// setCookie('account', {
		// 	token: res.data,
		// 	isAccountLog: false,
		// 	isLoggedIn: false,
		// 	account: {},
		// }, { path: '/', expires: getExpiresTime(30) });
	}, [serverToken])

	const { allCartItems } = ecomerce
	const { removeItem, addToLoadCarts, useAddCart } = useEcomerce();
	const { saveOrderStepData } = useCart();

	const [isShowModal, setIsShowModal] = useState(false)
	const [moqModal, setMoqModal] = useState(false) // 最小订货量弹窗
	const [dataSource, setDataSource] = useState([]) // 最小订货量数组
	const [isShowNoPricesModal, setIsShowNoPricesModal] = useState(false) // 无价格弹窗
	const [noPricesIds, setNoPricesIds] = useState(false) // 无价格ids
	const [tabActive, seTabActive] = useState('shopping-cart') // 头部导航状态
	const [current, setCurrent] = useState(0);
	const [unLoginFlag, setUnLoginFlag] = useState(false);
	const [voucheourList, setVoucheourList] = useState([]);  // 优惠券列表

	const [accountShippingAddress, setAccountShippingAddress] = useState([]); // 账号的邮寄地址
	const [accountBillingAddress, setAccountBillingAddress] = useState([]);  // 账号的账单地址
	const [summitInfo, setSummitInfo] = useLocalStorage('cartSummitInfo', {}); // 创建订单传的参数， 不要加创建订单不需要的字段
	const [shippingInfo, setShippingInfo] = useLocalStorage('cartShippingInfo', {}); // 运输地址
	const [billingInfo, setBillingInfo] = useLocalStorage('cartBillingInfo', {}); // 账单地址
	const [address, setAddress] = useLocalStorage('cartAddress', {}); // 第二步地址信息
	const [voucheour, setVoucheour] = useLocalStorage('cartVoucheour', { price: 0, value: '' }); // 优惠券
	const [shippingPrice, setShippingPrice] = useLocalStorage('cartShippingPrice', 0); // 运输方式价格
	const [paymentInfo, setPaymentInfo] = useLocalStorage('cartPaymentInfo', {}); // 支付信息
	const [cardInfo, setCardInfo] = useLocalStorage('cartCardInfo', {});


	const [isLoading, setIsLoading] = useState(false)
	const stepType = ['information', 'information', 'shipping', 'payment', 'orderView', 'payment'] // 每个步骤结算的类型
	const [orderData, setOrderData] = useState({})

	// 获取各个导航的数量 getTotal
	const [myCartTotal, setMyCartTotal] = useState(0) // 购物车列表数量
	const [myProjectTotal, setMyProjectTotal] = useState(0) // 收藏列表
	const [myFavouritesTotal, setMyFavouritesTotal] = useState(0) // 项目列表

	const currencyInfo = getCurrencyInfo()

	const checkoutRef = useRef()
	const shippingRef = useRef()
	const paymentRef = useRef()
	const orderReviewRef = useRef()

	var { num = 0, emailQuoteIds } = router.query;
	const { token, isAccountLog } = auth;
	// 获取用户账号的地址列表
	const getAddress = async () => {
		if (!token) {
			return false;
		}
		const res = await AccountRepository.getAddresses(token, getDomainsData()?.defaultLocale);
		if (res?.code === 0) {
			setAccountShippingAddress(res?.data)
			// responseData?.data?.forEach((item) => {
			//     setShippingInfo(item);
			// });
		}
	}
	const getBillingAddress = async () => {
		if (!token) {
			return false;
		}
		const res = await AccountRepository.getBillingAddresses(token, getDomainsData()?.defaultLocale);
		if (res?.code === 0) {
			setAccountBillingAddress(res?.data)
		}
	}

	//获取折扣券列表
	const getVoucheListHandle = async () => {
		const res = await OrderRepository.getVoucheList(token)
		if (res?.code === 0) {
			const { list } = res?.data
			list.map(item => {
				item.value = `${item.id}-${item.price}`;
				item.label = currencyInfo.label + `${item.price}`;
			})
			setVoucheourList(list);
		}
	}
	useEffect(async () => {
		if (token) {
			if (isAccountLog) {
				getVoucheListHandle();
			}
			getAddress();
			getBillingAddress();
			addToLoadCarts()
		}
	}, [token, isAccountLog])

	useEffect(() => {
		if (num < 4) {
			callbackOrderData({}) // num<4没有订单详情
		}

		setCurrent(num);
		const header = document.getElementById('headerSticky');
		if (num == 0) {
			if (token) {

			}
			if (header) {
				header?.classList.add('header-sticky-shadow');
			}
		} else {
			if (header) {
				header.classList.remove('header-sticky-shadow');
			}
		}
		if (!num && token) {
			setPaymentInfo({})
			localStorage.removeItem('cartSummitInfo') // 提交订单需要的数据
			localStorage.removeItem('cartShippingInfo')
		}
	}, [num, token]);


	const updateIsAccountShippingAddress = (info) => {
		getAddress()
	}

	const updateIsAccountBillingAddress = (info) => {
		getBillingAddress()
	}
	const saveSummitInfo = (info) => {
		setSummitInfo(info);
	}

	const saveCardInfo = (info) => {
		setCardInfo(info);
	}

	// 更新地址
	const updateAddress = (address) => {
		setAddress(address);
	}
	// 订单信息
	const updatePaymentInfo = (info) => {
		setPaymentInfo(info);
	}
	const updateShippingPrice = (price) => {
		setShippingPrice(price);
	}
	// 优惠券
	const updateVoucheour = (voucheour) => {
		setVoucheour(voucheour);
	}

	const handleToBuy = () => {
		const cartSubTotal = Number(toFixed(calculateTotalAmount(allCartItems), 2))
		if (cartSubTotal > 5000000) {
			setIsShowModal(true)
			return
		}

		if (cartSubTotal === 0) return
		if (isAccountLog) {

			Router.push('/account/shopping-cart?num=1');
			saveOrderStepData({ productPrice: cartSubTotal, step: 2 })
		} else {
			setUnLoginFlag(true);
		}
	}
	// 删掉没价格的
	const proceedWithOrder = async (e) => {
		setIsShowNoPricesModal(false)
		handleToBuy()
		const res = await CartRepository.removeCarts(newCookies?.account?.token, {
			cartIdList: noPricesIds,
		}, newCookies?.cur_cart_data?.id)
		if (res && res.code == 0) {
			noPricesIds?.map(i => {
				removeItem({ id: i }, allCartItems, 'cart');
			})
			addToLoadCarts()
		}
	}

	// 执行购买操作
	const secureCheck = async () => {
		let noPricesIds = [] // 检查是否有缺货的，缺货就弹窗, 因为添加购物车时有虽然有货，但库存可能有变动
		let moqData = [] // 检查是否有数量不符和最小购买数量的，否则就弹窗 
		allCartItems?.map(i => {
			if (!i?.pricesList) {
				noPricesIds.push(i?.cartId)
			}
			if (i?.cartQuantity < i?.pricesList?.[0]?.quantity) {
				moqData.push(i)
			}
		})
		if (moqData?.length > 0) {
			setMoqModal(true)
			setDataSource(moqData || [])
			return
		}

		if (noPricesIds?.length > 0) {
			setNoPricesIds(noPricesIds)
			setIsShowNoPricesModal(true)
			return
		}
		handleToBuy()
	}

	const onChange = (value) => {
		if (num <= value || value > 4) return
		Router.push(`/account/shopping-cart?num=` + value);
		setCurrent(value);
	};

	// 返回购物车主页面
	const getContentView = () => {
		let contentView = null;

		contentView = (
			<div className="ps-shopping-cart-product-wrap">
				<div className='ps-shopping-cart-item-box'>
					<div style={{ width: '100%' }} className="ps-section__content">

						<ModuleEcomerceCartItems
							paramMap={paramMap}
							serverAllCartItems={serverAllCartItems}
							curActive={tabActive}
							laterCheckMore={() => (seTabActive('save-for-later'), scrollToTop())}
						/>
						{/* 暂时去掉 laterCheckMore */}
					</div>
				</div>
			</div>
		)
		return contentView;
	}

	const callbackOrderData = data => {
		setOrderData(data || {})
	}
	const iCart = i18Translate('i18MyCart.Cart', 'Cart')
	const iAddress = i18Translate('i18MyCart.Address', 'Address')
	const iShipping = i18Translate('i18AboutProduct.Shipping', 'Shipping')
	const iPayment = i18Translate('i18MyCart.Payment', 'Payment')
	const iOrderPreview = i18Translate('i18MyCart.Order Preview', 'Order Preview')
	// 下单步骤,
	const steps = [
		{
			title: iCart,
			content: <>{getContentView()}</>,
			icon: <div className={'mt1 sprite-max-icons-cart ' + (num >= 0 ? 'sprite-max-icons-cart-1-2' : 'sprite-max-icons-cart-1-1')}></div>,
			disabled: num > 4
		},
		{
			title: iAddress,
			content: <><Checkout ref={checkoutRef} cartList={allCartItems} voucheourList={voucheourList} /></>,
			icon: <div className={'mt2 sprite-max-icons-cart ' + (num >= 1 ? 'sprite-max-icons-cart-1-4' : 'sprite-max-icons-cart-1-3')}></div>,
			disabled: num > 4 || num < 1
		},
		{
			title: iShipping,
			content: <><ShippingPage ref={shippingRef} /></>,
			icon: <div className={'sprite-max-icons-cart ' + (num >= 2 ? 'sprite-max-icons-cart-1-6' : 'sprite-max-icons-cart-1-5')} style={{ marginTop: '4px' }}></div>,
			disabled: num > 4 || num < 2
		},
		{
			title: iPayment,
			content: <><Payment ref={paymentRef} /></>,
			icon: <div className={'sprite-max-icons-cart ' + (num >= 3 ? 'sprite-max-icons-cart-1-8' : 'sprite-max-icons-cart-1-7')} style={{ marginTop: '4px' }}></div>,
			disabled: num > 4 || num < 3
		},
		{
			title: iOrderPreview,
			content: <OrderReview
				ref={orderReviewRef}
				isLoading={isLoading}
				paramMap={paramMap}
				callbackOrderData={callbackOrderData}
			// handlePaypalPay={handlePaypalPay}
			/>,
			icon: <div className={'sprite-max-icons-cart ' + (num >= 4 ? 'sprite-max-icons-cart-1-10' : 'sprite-max-icons-cart-1-9')} style={{ marginTop: '4px' }}></div>,
			disabled: num !== 4
		},
		// {
		//     title: 'Pay success',
		//     content: <PaymentSuccessPage />,
		//     disabled: num !== 5
		// }
	];

	const handleContinueClick = () => {
		const currStep = Number(current) ? Number(current) : Number(num)
		switch (currStep) {
			case 1:
				checkoutRef?.current?.onSubmit()
				break
			case 2:
				shippingRef?.current?.onSubmit()
				break
			case 3:
				paymentRef?.current?.onSubmit()
				break
			case 4:
				// console.log(orderReviewRef?.current, 'orderReviewRef?.current----del')
				// return
				// paymentRef?.current?.onSubmit()
				orderReviewRef?.current?.onSubmit()
				break
		}
	}

	useEffect(() => {
		dispatch(setSpinLoading({ payload: false, loadingText: '' }));
		dispatch(setAllCartItems(serverAllCartItems));
	}, []);

	// 自动选中优惠券
	useEffect(() => {
		// 处理优惠券 两个地方使用到，可以写公共方法
		const voucheourParams = { price: 0, value: '' }
		// 购物车页面先清空优惠券，
		if (num == 0) {
			updateVoucheour(voucheourParams)
		}

		if (num == 0 && allCartItems?.length > 0 && voucheourList?.length > 0 && isAccountLog) {
			let subTotal = 0
			allCartItems?.map(item => {
				subTotal += Number(toFixed(calculateTotalAmount([item]), 2))
			})

			if (voucheourList.length === 0) {
				updateVoucheour(voucheourParams)
			} else {
				const arr = voucheourList.filter(i => i.price <= subTotal) // 查找少于总金额的优惠券
				const max = Math.max(...arr.map(item => item.price)); // 查找属性的最大值
				const maxItem = arr.find(item => item.price === max); // 查找属性最大值所在的项

				// 存在赋值，不存在初始化
				if (maxItem && subTotal > maxItem?.price) {
					updateVoucheour({ price: maxItem?.price, value: maxItem?.id })
				} else {
					updateVoucheour(voucheourParams)
				}
				return
			}
		} else if (num == 0) {
			// updateVoucheour(voucheourParams)
		}
		// return () => {
		//     // 退出页面，清空
		//     updateVoucheour(voucheourParams)
		// }
	}, [voucheourList, allCartItems, num])

	const iShoppingCart = i18Translate('i18MyCart.Shopping Cart', 'SHOPPING CART')
	const iSaveForLater = i18Translate('i18MyCart.SaveForLater', 'SAVED FOR LATER')
	const iMyFavourites = i18Translate('i18MenuText.My Favourites', 'MY FAVORITES')
	const iCustomerReference = i18Translate('i18AboutProduct.Customer Reference', 'CUSTOMER REFERENCE')
	const iProject = i18Translate('i18MyCart.Project', 'PROJECT LISTS')
	const iSavedCarts = i18Translate('i18MyCart.Saved Carts', 'CART LISTS')
	const tabArr = [
		{ name: iShoppingCart, tabLabel: 'shopping-cart' },
		{ name: iSaveForLater, tabLabel: 'save-for-later' },
	]
	if (isAccountLog) {
		tabArr.push(
			{ name: iSavedCarts, tabLabel: ACCOUNT_CART_CART_HASH }, // 暂时关闭购物车
			{ name: iMyFavourites, tabLabel: ACCOUNT_FAVORITES_HASH },
			{ name: iCustomerReference, tabLabel: 'customer-reference' },
			{ name: iProject, tabLabel: ACCOUNT_CART_PROJECT_HASH }, // 暂时关闭项目
		)
	}

	const handleTabNav = (e, item) => {
		e.preventDefault();
		seTabActive(item?.tabLabel)
		Router.push(`/account/shopping-cart#` + item?.tabLabel)
	}

	// 关闭最小订货量弹窗
	const closeModalMoq = params => {
		setMoqModal(false)
		useAddCart(
			params,
			allCartItems,
			{
				group: 'toAddCarts',
				// cartNo: 0, // 拿cookies的
			},
		);
	}
	{/* num等于0右侧小计 */ }
	const getCartSummary = (isDesktop) => {
		if (num != 0) return

		const summaryEle = () => {
			return <div className=""><div>
				<div className='ps-summary-box pub-border box-shadow'>
					<ModuleCartSummary
						voucheourList={voucheourList}
						products={allCartItems}
					/>
					<div className='pl-20 pr-20'>
						<Button
							type="submit" ghost='true'
							className='login-page-login-btn custom-antd-primary'
							onClick={secureCheck}
							// 商品价格为0或者商品总价小于优惠券,禁用
							disabled={allCartItems.length === 0 || Number(toFixed(calculateTotalAmount(allCartItems), 2)) < voucheour?.price}
							style={{ width: '100%' }}
						>
							<div className='pub-flex-center'>
								<div className='sprite-icon4-cart sprite-icon4-cart-3-13'></div>
								<div className='ml10 pub-lh20'>{i18Translate('i18MyCart.SECURE CHECKOUT', "SECURE CHECKOUT")}</div>
							</div>
						</Button>

					</div>
					<div className='ps-summary-box-tip'>{iSecureCheckoutTip}&nbsp;
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
			</div>


				<div className='data-security pub-border20 mt20 box-shadow' style={{ width: '100%' }}>
					<div className='sprite-icon4-cart sprite-icon4-cart-3-12' />
					<div className='data-security-text'>{iSecurelyGuarantee}</div>
				</div>
			</div>
		}

		return <div className="ps-section__footer catalogs__top-fixed" style={{ maxWidth: '100%', maxWidth: '380px' }}>
			<div className="justify-space-between">
				{!isDesktop ? (summaryEle()) :
					// <Affix offsetTop={70} offsetBottom={260}>
					summaryEle()
				}
			</div>
		</div>
	}
	// 返回导航数量
	const getNavTotal = tabLabel => {
		let total = 0
		if (tabLabel === ACCOUNT_CART_CART_HASH) total = myCartTotal
		if (tabLabel === ACCOUNT_CART_PROJECT_HASH) total = myProjectTotal
		if (tabLabel === ACCOUNT_FAVORITES_HASH) total = myFavouritesTotal
		// FF8B1E      const [myFavouritesTotal, setMyFavouritesTotal] = useState(0) // 收藏列表
		if (+total === 0) return
		return <span className='pub-total-box'>{total}</span>
	}


	useEffect(() => {
		const { asPath } = router
		const anchorPoint = asPath.split('#')?.[1]
		// seTabActive(anchorPoint)

		if (anchorPoint) {
			seTabActive(anchorPoint)
		} else {
			seTabActive('shopping-cart')
		}
	}, [router]);

	const iSecureCheckoutTip = i18Translate('i18MyCart.SecureCheckoutTip', "Shipping costs calculated at next step prior to final checkout By submitting your order you agree to")
	const iAnd = i18Translate('i18SmallText.And', "and")
	const iTermsAndConditions = i18Translate('i18MenuText.Terms and Conditions', "Terms and Conditions")
	const iPrivacyCenter = i18Translate('i18MenuText.Privacy Center', "Privacy Center")
	const iSecurelyGuarantee = i18Translate('i18MyCart.SecurelyGuarantee', "Your data will be encrypted and transmitted securely")

	const i18Title = i18Translate('i18Seo.shoppingCart.title', "")
	const i18Key = i18Translate('i18Seo.shoppingCart.keywords', "")
	const i18Des = i18Translate('i18Seo.shoppingCart.description', "")


	let itemsGoogle = [] // 检查是否有数量不符和最小购买数量的，否则就弹窗 
	allCartItems?.map(i => {
		const { productId, productName, manufacturerName, cartQuantity } = i
		itemsGoogle.push({
			id: productId, name: productName, manufacturerName,
			quantity: cartQuantity, price: toFixedFun(calculateTargetPriceTotal(i) || 0, 4),
		})
	})

	return (
		<PageContainer paramMap={paramMap} seo={seo} global={global} cartHideFooter={true}>
			<Head>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />
				{/* <script>
				gtag('event', 'ads_conversion_Shopping_Cart_1', {{
					'transaction_id': cartId, // 替换为实际的交易ID
					'value': 29.99, // 替换为实际的交易金额
					'currency': 'USD', // 替换为实际的货币类型
					'items': [{
						'id': 'product_id', // 替换为实际的产品ID
						'name': 'Product Name', // 替换为实际的产品名称
						'quantity': 1, // 替换为实际的产品数量
						'price': 29.99 // 替换为实际的产品价格
					}]
				}});
			</script>  defer */}

				{/* <script defer src="https://www.googletagmanager.com/gtag/js?id=AW-11224453510"></script> */}
				<script defer dangerouslySetInnerHTML={{
					__html: `window.dataLayer = window.dataLayer || [];
									function gtag(){dataLayer.push(arguments)}
									gtag('event', 'ads_conversion_Shopping_Cart_1', {
										cartNo: ${cartId}, currency: '${currencyInfo.value}',
										items: ${JSON.stringify(itemsGoogle)}
									});`
				}}>
				</script>
				{/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-CDWFBKFV3Z"></script>
				<script dangerouslySetInnerHTML={{
					__html: `gtag('event', 'ads_conversion_Shopping_Cart_1', {
					cartNo: ${cartId}, currency: '${currencyInfo.value}',
					items: ${JSON.stringify(itemsGoogle)}
				})`
				}}>
				</script> */}
			</Head>

			<div style={{ background: '#f5f7fa' }}>
				{/* 导航切换 */}
				{num == 0 && <div className='pub-top-tabs' style={{ background: '#fff' }}>
					<div className='ps-container'>
						<div className='ps-tab-cart'>
							<div className='ps-tab-root'>
								{
									tabArr.map((item, index) => {
										return <div
											key={'tab' + index}
											className={'ps-tab-root-item ' + (tabActive == item?.tabLabel ? 'ps-tab-active' : '')}
											onClick={(e) => handleTabNav(e, item, index)}
										>
											{/* 一个页面只能有一个h1标签 */}
											{
												tabActive == item?.tabLabel ?
													<h1 className='pub-line-clamp1'>{item.name}</h1> :
													<span className='pub-line-clamp1 pub-fontw'>{item.name}</span>
											}
											{getNavTotal(item?.tabLabel)}
										</div>
									})
								}
							</div>
						</div>
					</div>
				</div>
				}

				<div className="shopping-cart-container ps-container ps-page--simple custom-antd-btn-more pb60">
					{
						(num != 0 && num != 5) && (
							<div className="ps-return-cart mb15">
								<div className='pub-flex-align-center'>
									<Link href="/account/shopping-cart">
										<div className='sprite-icon4-cart sprite-icon4-cart-5-2'></div>
									</Link>
									<Link href="/account/shopping-cart">
										<div className='ps-return-text ml10'>{i18Translate('i18MyCart.Return to shopping cart', 'Return to shopping cart')}</div>
									</Link>
								</div>
							</div>
						)
					}
					{
						(num === 0) && <UnpaidOrderTip />
					}

					{tabActive === 'shopping-cart' && <ShopCartContext.Provider value={{
						accountShippingAddress,
						accountBillingAddress,
						shippingInfo,
						billingInfo,
						address,
						voucheour,
						shippingPrice,
						paymentInfo,
						summitInfo,
						cardInfo,
						updateIsAccountShippingAddress,
						updateIsAccountBillingAddress,
						saveCardInfo,
						saveSummitInfo,
						updatePaymentInfo,
						updateVoucheour,
						updateAddress,
						updateShippingPrice,
					}}>
						<div className="pub-flex-wrap ps-section--shopping ps-shopping-cart" style={{ gap: "20px" }}>
							<div className='ps-shopping-cart-left'>
								{/* 登录提示 */}
								{(!isAccountLog && num === 0) && (
									<div className='mt-20'>
										<MinLoginTip
											tipText={i18Translate('i18MyCart.CartLogTip', 'to access cart Lists or to save this order.')} />
									</div>
								)}


								{/* && noCart (使用下单导航不展示了)*/}
								{(current < 5 && allCartItems.length > 0) && <div className='ps-shopping-steps-wrap pub-border20 mb20 box-shadow' style={{ background: '#fff' }}>
									<Steps
										className="ps-shopping-steps"
										responsive={true} // 当屏幕宽度小于 532px 时自动变为垂直模式
										current={Number(current) ? Number(current) : Number(num)}
										onChange={onChange}
										items={steps}
									/>
								</div>
								}
								<div className="steps-content">
									{
										current !== 5 && (num < 5 ? steps[num].content : <PaymentSuccessPage
											callbackOrderData={callbackOrderData}
											paramMap={paramMap}
										/>)
									}
								</div>
							</div>
							{/* num等于0时的右侧小计 */}
							<Device>
								{
									({ isDesktop }) => {
										return getCartSummary(isDesktop)
									}
								}
							</Device>
							{/* num不等于0时的右侧小计 */}
							{
								num != 0 && (
									<ModulePaymentOrderSummary
										isLoading={isLoading}
										payment={Boolean(Number(num) > 3)}
										type={stepType[num]}
										summaryStep={Number(num)}
										products={allCartItems}
										shippingPrice={shippingPrice}
										voucheour={voucheour}
										order={orderData}
										// handleSubmit={handlePaypalPay}
										onContinue={handleContinueClick}
									/>
								)
							}
						</div>
					</ShopCartContext.Provider>
					}

					{tabActive === 'save-for-later' &&
						getContentView()
					}
					<MyProject showTitle={false} tabActive={tabActive} getTotal={total => setMyProjectTotal(total)} />
					<MyCart showTitle={false} tabActive={tabActive} getTotal={total => setMyCartTotal(total)} />
					<MyFavorites curActive={tabActive} getTotal={total => setMyFavouritesTotal(total)} /> {/* 收藏 */}
				</div>
				<EmialQuoteCart />
			</div>

			{/* 提前加载paypal */}
			{/* <PayPalScriptProvider options={assign({}, PAYPAL_INITIAL_OPTIONS, { currency: currencyInfo.value })}></PayPalScriptProvider> */}

			{!!unLoginFlag && <OperationModal setUnLoginFlag={setUnLoginFlag} isOpenModal={unLoginFlag} />}

			{/* 检查没有价格的商品 */}
			<Modal
				centered
				title="Non-orderable product"
				footer={null}
				width={550}
				onCancel={() => setIsShowNoPricesModal(false)}
				open={isShowNoPricesModal}
				closeIcon={<i className="icon icon-cross2"></i>}
			>
				<div className='mb30 pub-color18 pub-font13'>If you choose to proceed with the order, the system will remove the unorderable products from your order.</div>
				<div className='custom-antd-btn-more' style={{ textAlign: 'center' }}>
					<Button
						type="primary" ghost='true'
						className='ps-add-cart-footer-btn'
						onClick={() => setIsShowNoPricesModal(false)}
						style={{ width: '150px' }}
					>Return to Cart</Button>
					<Button
						type="primary" ghost='true'
						className='ml20 ps-add-cart-footer-btn custom-antd-primary'
						onClick={(e) => proceedWithOrder(e)}
						style={{ width: '150px' }}
					>Proceed with Order</Button>
				</div>
			</Modal>

			{/* 最小订货量 */}
			{
				moqModal && (
					<ModalMoq
						isShowModal={moqModal}
						currentCart={{}}
						dataSource={dataSource}
						closeModalMoq={(params) => closeModalMoq(params)}
					/>
				)
			}

			{/* 订单总金额设限 */}
			<Modal
				centered
				title="secure checkout"
				footer={null}
				width={550}
				onCancel={(e) => setIsShowModal(false)}
				open={isShowModal}
				closeIcon={<i className="icon icon-cross2"></i>}
			>
				<div className='mb30 pub-color18 pub-font13'>{`The order submission failed. The single transaction amount cannot exceed 5 million ${currencyInfo.value}.`}</div>
				<div className='custom-antd' style={{ textAlign: 'center' }}>
					<Button
						type="primary" ghost='true'
						className='ps-add-cart-footer-btn'
						onClick={(e) => setIsShowModal(false)}
						style={{ width: '150px' }}
					>Close</Button>
				</div>
			</Modal>
		</PageContainer>
	);
};

export default connect((state) => state)(withCookies(ShoppingCartScreen));

export async function getServerSideProps({ req, query }) {
	const translations = await changeServerSideLanguage(req)
	// 注意: 防止JSON.parse报错
	const { account = "", cur_cart_data = "" } = req.cookies
	let serverToken = account.trim() !== "" && JSON.parse(account)?.token

	if (!serverToken) {
		// return redirect404()
		const res = await AccountRepository.anonymousAuth();
		serverToken = res?.data
	}
	let res = []
	if (!Number(query?.num) || Number(query?.num) === 0) {
		res = await CartRepository.loadCarts(serverToken, JSON.parse(cur_cart_data || '{}')?.id || '', getLocale(req));
	}
	return {
		props: {
			...translations,
			serverToken,
			serverAllCartItems: res?.data || [],
			req: req?.headers?.host,
		},
	}
}

