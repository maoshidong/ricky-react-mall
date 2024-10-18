import React, { useState, useEffect, useRef, useContext } from 'react';
import ReactToPrint from 'react-to-print';
import { Steps, Popover, Spin, Modal } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import { Table, Button } from 'antd';
import { OrderRepository, PaymentRepository } from '~/repositories';

import useLocalStorage from '~/hooks/useLocalStorage';
import useLanguage from '~/hooks/useLanguage';
import useOrder from '~/hooks/useOrder';
import useI18 from '~/hooks/useI18';

import classNames from 'classnames';

import ModulePaymentOrderSummary from '~/components/partials/account/modules/ModulePaymentOrderSummary';
import OrderAddressInfo from '~/components/partials/account/OrderAddressInfo';
import OrderSummaryTable from '~/components/partials/account/order/OrderSummaryTable';
import { AlipayBtn, ExportToExcel, DownLoadInvoice, AttachOrderPrice, AttachOrderProduct, UploadBankCopy } from '~/components/ecomerce/orderCom/index';
// import { DownloadPDF } from '~/components/PDF';

import PageHeaderShadow from '~/components/ecomerce/minCom/PageHeaderShadow';
import ShowPaymentMethod from '~/components/partials/account/order/ShowPaymentMethod';
import LogoCom from '~/components/shared/headers/zqx/LogoCom';

import { MinLoginTip } from '~/components/ecomerce';
import dayjs from 'dayjs';
import {
	encrypt,
	decrypt,
	handleMomentTime,
	helpersHrefNofollow,
	getStatusClass,
} from '~/utilities/common-helpers';
import { PAYMENT_TYPE, ORDER_STATUS, PAYPAL_CLIENT_ID, TABLE_COLUMN, ORDER_STATUS_TEXT } from "~/utilities/constant"
import { ACCOUNT_ORDER_DETAIL, SURCHARGE_DETAILS } from '~/utilities/sites-url'
import ShopCartContext from '~/utilities/shopCartContext'
import styles from "scss/module/_order.module.scss";
import { getCurrencyInfo } from '~/repositories/Utils'
import {
	PayPalButtons, PayPalScriptProvider,
} from "@paypal/react-paypal-js";

/**
 * @支付订单详情
 * 24001173-1
*/
const OrderDetail = ({ paramMap, token, orderId, otherParams }) => {
	const {
		iOrderSubmitted, iPaymentPending, iPaymentVerificationPending, iPaymentCompleted, iProcessing, iProcessingCompleted,
		iWaitForDelivery, iPartiallyShipped, iAllShipped, iOrderComplete, iOrderCompleted, iCheckOrderTip, iPrint,
	} = useI18();
	const { i18Translate, i18MapTranslate, curLanguageCodeZh } = useLanguage();
	const currencyInfo = getCurrencyInfo()
	const iOrderNumber = i18Translate('i18AboutOrder.Order Number', "Order Number")
	const iOrderStatus = i18Translate('i18MenuText.Order Status', "Order Status")
	const iStatus = i18Translate('i18PubliceTable.Status', TABLE_COLUMN.orderStatus)
	const iShipped = i18Translate('i18AboutOrder.Shipped', TABLE_COLUMN.shipQty)
	const iShippingDate = i18Translate('i18AboutOrder2.Shipping Date', 'Shipping Date')
	const iShipping = i18Translate('i18AboutProduct.Shipping', 'Shipping')
	const iCanceled = i18Translate('i18AboutOrder.Canceled', "Canceled")

	const iSort = i18Translate('i18PubliceTable.Sort', "Sort")
	const iShippingMethod = i18Translate('i18ResourcePages.Shipping Method', "Shipping Method")
	const iTracking = i18Translate('i18AboutOrder2.Tracking', "Tracking")
	const iTrackShipping = i18Translate('i18AboutOrder2.Track a shipping', "Track a shipping")
	const iSurchargeDetails = i18Translate('i18AboutOrder.Surcharge Details', "Surcharge Details")
	const iOrderDetails = i18Translate('i18AboutOrder.Order Details', "Order Details")
	const textTip = "If you have successfully made the payment, please wait. The system usually completes the verification of payment information within a few minutes."
	const iPaymentVerificationTip = i18Translate('i18AboutOrder.PaymentVerificationTip', textTip)
	const iPayment = i18Translate('i18MyCart.Payment', 'Payment')

	// 订单详情弹窗
	const { orderDetail, OrderDetailModal } = otherParams || {}

	const Router = useRouter();
	const { flag } = Router?.query; // 从管理后台跳转的订单详情, 判断拿哪里的token
	const [cookies] = useCookies(['account']);
	const [order, setOrder] = useState(orderDetail || {});
	const [tabActive, seTabActive] = useState(-2) // 第几次发货
	const [currentShipping, setCurrentShipping] = useState([]); // 每一次发货信息
	const [deliveryList, setDeliveryList] = useState([]); // 发货信息
	const [loading, setLoading] = useState(false);
	const [currentState, setCurrentState] = useState(1); // 订单状态
	const [navTabActive, setNavTabActive] = useState('Order Details') // 导航状态
	const [orderList, setOrderList] = useState([]);
	const [currentPayStatus, setCurrentPayStatus] = useState(ORDER_STATUS.submit) // 支付状态
	const [shippingWayText, setShippingWayText] = useState('') // 支付文本
	const [showPayment, setShowPayment] = useState(false) // 是否展示支付按钮
	const [customShippingDelivery, setCustomShippingDelivery] = useState([]) // 管理端自定义运输方式
	const [isShowPrintContent, setIsShowPrintContent] = useState(false); // useEffect才展示打印的

	const [paypalPayStatus, setPaypalPayStatus] = useLocalStorage('paypalPayStatus', ORDER_STATUS.submit);
	const { isShowOrderInfo } = useOrder()
	const { paymentInfo = {} } = useContext(ShopCartContext);

	let componentRef = useRef();

	const getSucText = (status = paypalPayStatus) => {
		let text = (status == 2 && order?.orderPay) ? iPaymentVerificationPending : iPaymentPending
		if (order?.orderPay?.status == '1') {
			text = iPaymentCompleted
		}
		return text
	}
	// 状态步骤条
	const [items, setItems] = useState([
		{
			title: '',
			status: 'wait',
			current: ORDER_STATUS.submit,
			description: iOrderSubmitted, // 提交
			icon: <div className={`${styles['sprite-max-icons-order']} ${styles['sprite-max-icons-order-1-2']}`} />,
		},
		{
			title: '',
			status: 'wait',
			current: ORDER_STATUS.sucPayment,
			description: iPaymentPending, // 付款成功
			icon: <div className={`${styles['sprite-max-icons-order']} ` + ((currentState <= 2 && currentState !== 3) ? styles['sprite-max-icons-order-1-3'] : styles['sprite-max-icons-order-1-4'])} />,
		},
		{
			title: '',
			current: ORDER_STATUS.sucPayment, // commodityDelivery
			status: 'wait',
			description: iProcessing, // 商品出库
			icon: <div className={`${styles['sprite-max-icons-order']} ` + ((currentState <= 2 && currentState !== 3) ? styles['sprite-max-icons-order-1-5'] : styles['sprite-max-icons-order-1-6'])} />,
		},
		{
			title: '',
			status: 'wait',
			current: ORDER_STATUS.commodityDelivery, // waitDelivery -> commodityDelivery
			description: iWaitForDelivery, // 等待收货   
			icon: <div className={`${styles['sprite-max-icons-order']} ` + ((currentState < 20 && currentState !== 3) ? styles['sprite-max-icons-order-1-7'] : styles['sprite-max-icons-order-1-8'])} />,
		},
		{
			title: '',
			current: ORDER_STATUS.fulfillment,
			status: 'wait',
			description: iOrderComplete, // 完成
			icon: <div className={`${styles['sprite-max-icons-order']} ` + (currentState !== 3 ? styles['sprite-max-icons-order-1-9'] : styles['sprite-max-icons-order-1-10'])} />,
		},
	])

	const handleRes = (res, text) => {
		if (res?.code === 0) {
			const { data } = res
			if (data?.orderPay?.status == 0) {
				if (paypalPayStatus != 1) {
					setCurrentPayStatus(paypalPayStatus)
				}
			} else {
				setCurrentPayStatus(data?.payStatus)
			}

			if (data?.deliveryList) {
				const values = data?.deliveryList
				setDeliveryList(values)
				setCurrentShipping(data?.orderDetails)
				seTabActive(-1)
			}
			setOrder(data);
			setOrderList(data?.orderDetails)
			setCurrentState(data?.status)
			if (text === 'paySuc') {
				handleStatus(ORDER_STATUS.sucPayment, order);
			}

		}
	}

	const getOrder = async (text) => {

		if (orderDetail?.orderId) {
			handleRes({
				code: 0,
				data: orderDetail || {},
			}, text)
			return
		}

		// 订单列表抽屉
		if (!cookies?.account?.token && !flag) {
			return false;
		}
		setLoading(true)
		if (flag) {
			const res = await OrderRepository.getEmailOrder(orderId.join('/'), cookies?.account?.token);
			setLoading(false)
			handleRes(res?.data, text)
		} else {
			// decrypt(orderId[0]
			const res = await OrderRepository.getOrder(orderDetail?.orderId, cookies?.account?.token);
			setLoading(false)
			handleRes(res, text)
		}
	}
	// 返回步骤条描述
	const getOrderDes = (desc, year, hour) => {
		return (
			<>
				<div className={'order-detail-desc pub-fontw ' + (desc === iPaymentCompleted ? '' : '')} style={{ whiteSpace: 'nowrap' }}>{desc}</div>
				<div className='order-detail--time'>{year}</div>
				<div className='order-detail--time'>{hour}</div>
			</>
		)
	}

	const goPushError = (arr, errObj) => {
		arr.push({
			title: '',
			status: 'error',
			current: ORDER_STATUS.canceled,
			description: <div className='order-canceled'>
				<div className='order-detail-desc pub-fontw' style={{ whiteSpace: 'nowrap' }}>{errObj.text}</div>
				<div className='order-detail--time'>{errObj.year}</div>
				<div className='order-detail--time'>{errObj.hour}</div>
			</div>,
			icon: <div className={`${styles['sprite-max-icons-order']} ${styles['sprite-max-icons-order-1-11']} ml-2`} />,
		})
		setItems([...arr]);
	}

	//status状态（1 已提交 2：待审核 3 已完成  10：待发货  20：部分发货 30：全部发货  40：已取消）
	// 步骤条展示数据 PAY_STATUS 支付状态  1：未支付 2：已支付  3：已退款
	const handleStatus = (orderStatus, order) => {
		const { createTime, updateTime, orderPay, deliveryList } = order || {}
		const status = order.status == '1' ? orderStatus : order.status
		// 取创建时间
		const year = handleMomentTime(createTime)
		const hour = dayjs(createTime).format('HH:mm:ss');
		// 取更新时间
		const upYear = handleMomentTime(updateTime)
		const upHour = dayjs(updateTime).format('HH:mm:ss');
		// 取支付成功时间
		const sucYear = handleMomentTime(orderPay?.updateDate)
		const sucHour = dayjs(orderPay?.updateDate).format('HH:mm:ss');

		let values = [[{ createDate: '' }]]
		if (deliveryList) {
			values = deliveryList
		}
		// 取最后一次发货时间或者管理端订单状态最后操作时间 
		const deliveryYear = deliveryList ? handleMomentTime(deliveryList?.[deliveryList.length - 1]?.createDate) : handleMomentTime(updateTime);
		const deliverysucHour = deliveryList ? dayjs(values[values.length - 1][0].createDate).format('HH:mm:ss') : dayjs(updateTime).format('HH:mm:ss');

		let flag = true

		items.map((item, index) => {
			// 支付成功和待处理同样的current
			if (flag || status == item?.current) {
				if (index == 0 && status >= ORDER_STATUS.submit) {
					// 使用固定的description...', 解决时间重复渲染问题
					item.description = getOrderDes(iOrderSubmitted, year, hour)
					item.icon = <div className={`${styles['sprite-max-icons-order']} ${styles['sprite-max-icons-order-1-2']}`} />
				}

				if (index == 1 && status >= ORDER_STATUS.sucPayment) {
					item.description = getOrderDes(getSucText(status), sucYear, sucHour)
					item.icon = <div className={`${styles['sprite-max-icons-order']} ${styles['sprite-max-icons-order-1-4']}`} />
				}
				// commodityDelivery -> sucPayment  || status == ORDER_STATUS.fulfillment
				if (index == 2 && status >= ORDER_STATUS.sucPayment) {
					// 订单完成，或者已有发货操作
					const curDes = (status >= ORDER_STATUS.commodityDelivery || status == ORDER_STATUS.fulfillment) ? iProcessingCompleted : iProcessing
					item.description = getOrderDes(curDes, sucYear, sucHour) // comYear, comHour
					item.icon = <div className={`${styles['sprite-max-icons-order']} ${styles['sprite-max-icons-order-1-6']}`} />
				}
				// 发货状态
				if (index == 3 && (status >= ORDER_STATUS.partDelivery || status == ORDER_STATUS.fulfillment)) {
					// 订单完成，或者全部发货
					const curDes = (status === ORDER_STATUS.waitDelivery || status == ORDER_STATUS.fulfillment) ? iAllShipped : iPartiallyShipped
					// const label = ORDER_STATUS_TEXT?.find(item => item?.value === order?.status)?.label

					item.description = getOrderDes(curDes, deliveryYear, deliverysucHour
					)
					item.icon = <div className={`${styles['sprite-max-icons-order']} ${styles['sprite-max-icons-order-1-8']}`} />
				}
				// 更新订单状态
				if (index == 4 && status == 3) {
					item.description = getOrderDes(iOrderCompleted, upYear, upHour)
					item.icon = <div className={`${styles['sprite-max-icons-order']} ${styles['sprite-max-icons-order-1-10']}`} />
				}
				item.status = 'finish';
			} else {
				item.status = 'wait';
			}
			// 打断map循环     
			if (status == item?.current) {
				flag = false
			}
		})
		// 追加取消
		// 未支付 && 已取消
		if (currentPayStatus != ORDER_STATUS.sucPayment && status === ORDER_STATUS.canceled) {
			const filterArr = items.filter(item =>
				item.current !== ORDER_STATUS.sucPayment &&
				item.current !== ORDER_STATUS.commodityDelivery &&
				item.current !== ORDER_STATUS.waitDelivery &&
				item.current !== ORDER_STATUS.fulfillment
			)
			goPushError(filterArr, {
				text: iCanceled,
				year: upYear,
				hour: upHour,
			})
		} else if (!deliveryList && status === ORDER_STATUS.canceled) {
			// 未发货 && 已取消
			const filterArr = items.filter(item =>
				item.current !== ORDER_STATUS.commodityDelivery &&
				item.current !== ORDER_STATUS.waitDelivery &&
				item.current !== ORDER_STATUS.fulfillment
			)
			goPushError(filterArr, {
				text: iCanceled,
				year: upYear,
				hour: upHour,
			})
		} else {
			setItems([...items]);
		}


	}

	const callBackFun = text => {
		setShippingWayText(text)
	}

	useEffect(() => {
		getOrder();
	}, [token, orderId])

	useEffect(() => {
		handleStatus(currentPayStatus, order);
	}, [order])

	useEffect(() => {
		if (order?.deliveryList) {
			const values = order?.deliveryList
			if (!values[tabActive]) {
				setCurrentShipping(order?.orderDetails)
				setOrderList(order?.orderDetails)
				return
			} else {
				setCurrentShipping(values[tabActive])
			}

			let arr = []
			// 查找发货的产品id
			values[tabActive]?.map(item => {
				const haveItem = order?.orderDetails.find(i => i.productId == item.productId)
				if (haveItem) {
					arr.push(haveItem)
				}
			})
			setOrderList(arr)
		}
	}, [tabActive])

	const getShippingDeliveryList = async () => {
		const res = await OrderRepository.getDictList('sys_custom_shipping_delivery')
		if (res?.code === 0) {
			setCustomShippingDelivery(res.data)
		}
	}

	const getShippingType = (deliveryType) => {
		let lable = ''
		customShippingDelivery?.map(item => {
			if (item.dictCode == deliveryType) {
				lable = item?.dictLabel
			}
		})
		return lable
	}

	useEffect(() => {
		setIsShowPrintContent(true)
		getShippingDeliveryList()
	}, [])

	const shippingColumns = [
		{
			title: iSort,
			dataIndex: 'index',
			width: 200,
			render: (text, record, index) =>
				<div className='cart-img-sort'>
					<span>{iShipping} {index + 1}</span>
				</div>,
		},
		{
			title: iShippingMethod,
			dataIndex: 'deliveryType',
			width: 240,
			render: (text, record, index) =>
				<span>{getShippingType(record?.[0]?.deliveryType) || shippingWayText?.split('-')[0]}</span>
		},
		{
			title: iTracking,
			dataIndex: 'deliveryNo',
			width: 350,
			render: (text, record, index) =>
				<div className='pub-color-link'>
					<a target='_blank' href={record[0].deliveryLink} rel="external nofollow noopener noreferrer">{record[0].deliveryNo}</a>
					{/* rel="external nofollow noopener noreferre
                    rel="external" 用于指示链接是指向外部网站或页面的链接。
                    rel="nofollow" 用于告诉搜索引擎不要追踪该链接。
                    rel="noopener" 用于防止打开的新窗口能够访问原始页面的 window.opener 对象。
                    rel="noreferrer" 用于防止打开的新窗口向目标页面发送 Referer 头信息。 */}
					{/* <Link target='_blank' href={record[0].deliveryLink} rel="external nofollow noopener noreferrer"> */}
					<a {
						...helpersHrefNofollow(record[0].deliveryLink)
					}><Button
						type="primary" ghost
						className='ps-add-cart-footer-btn ml20'
					>{iTrackShipping}
						</Button></a>
					{/* </Link> */}
				</div>
		},
		{
			title: iShippingDate,
			dataIndex: 'updateDate',
			width: 150,
			render: (text, record) =>
				<span>{handleMomentTime(record[0].updateDate)}</span>
			// <span>{dayjs(record[0].updateDate).format('DD MMMM, YYYY HH:mm:ss')}</span>
		},
	]
	// 产品发货时间
	const getProductShippingDate = (productId) => {
		let res = []
		deliveryList?.map(i => {
			i?.map(j => {
				if (j?.productId === productId) {
					res.push(<div>{handleMomentTime(j?.updateDate)}</div>)
				}
			})
		})
		if (res?.length === 0) return null
		return res
	}

	// 多次发货
	const getProductShippingNum = (productId) => {
		let res = []
		deliveryList?.map(i => {
			i?.map(j => {
				if (j?.productId === productId) {
					res.push(<div>{j?.num}</div>)
				}
			})
		})
		if (res?.length === 0) return null
		return res
	}

	// 状态类
	const getClass = record => {
		const { productId } = record
		let status = 1
		order?.orderDetails?.map(item => {
			if (item?.productId == productId) {
				status = item?.status
			}
		})
		return getStatusClass(status)
	}

	const getStatusText = record => {
		const { productId } = record
		let status = 1
		order?.orderDetails?.map(item => {
			if (item?.productId == productId) {
				status = item?.status
			}
		})
		const label = ORDER_STATUS_TEXT.find(i => i.value == status)?.label
		return i18MapTranslate(`i18AboutOrder.${label}`, label)

	}

	// order?.orderDetails
	const columns = [
		// 产品状态
		{
			title: iStatus,
			dataIndex: 'status',
			render: (text, record) => <div>
				<span className={getClass(record)}>{getStatusText(record)}</span>
				{/* <OrderStatus record={record} /> */}
			</div>
		},

		{
			title: iShipped,
			dataIndex: 'num',
			render: (text, row) =>
				<div className='pub-flex-align-center' style={{ height: '90px' }}>
					<div>
						{/* {tabActive >= 0 ? row.num : row.sendNum} - Shipped */}
						{tabActive >= 0 && row.num + '- Shipped'}
						{tabActive < 0 && getProductShippingNum(row?.productId)}
					</div>
				</div>
		},

		{
			title: iShippingDate,
			dataIndex: 'Shipping Date',
			render: (text, record, index) => <div>
				{tabActive >= 0 && (handleMomentTime(deliveryList?.[tabActive]?.[index]?.updateDate))}
				{
					tabActive < 0 && getProductShippingDate(record?.productId)
				}
			</div>
		},
	];

	const initialOptions = {
		"client-id": PAYPAL_CLIENT_ID,
		currency: currencyInfo.value,
		intent: "authorize", // 表示你希望 PayPal 在用户确认订单后预授权扣款，但并不立即从用户账户中扣款。在预授权期限结束之前，你需要调用 PayPal 的其他 API 来完成付款。
		// intent: "capture", // 表示你希望 PayPal 在用户确认订单后立即从用户账户中扣款。这是默认值。
		// "data-client-token": "EGw1EGi9S-RRBd2ZU1HbogZCsJLn1Y9lbGNyiJExk8cL5GoWkhYlkoUI8YsWy8L2x1rTowkjFKvRkPSi",
	};

	const createOrder = async (order) => {
		return order?.orderPay?.payId
	}

	// 支付过期重新提交
	const createSubmitOrder = async (order) => {

		const { vatPrice, appUserId } = order || {}
		const dataType = {
			payType: PAYMENT_TYPE.PayPal,
			orderId: order?.orderId,
			vatNumber: paymentInfo?.vatNumber,
			orderNumber: paymentInfo?.orderNumber,
			vatPrice,
			userId: appUserId,
			isEmailFlag: 1, // flag ? 1 : null
		}
		let res = await PaymentRepository.requestPayment(dataType, cookies?.account?.token || (flag ? orderId?.join('/') : orderDetail?.orderId)) // decrypt(orderId[0]
		return res.data.payId
	}

	const onApprove = (data, actions) => {
		setPaypalPayStatus(ORDER_STATUS.sucPayment)
		getOrder('paySuc');
	}

	// 是否展示LianLian支付按钮
	const isShowLianPayBtn = () => {
		return order?.paymentWay == PAYMENT_TYPE.LianLian && order?.orderPay?.status != 1
	}

	// 是否展示支付宝支付
	const isShowAliPay = () => {
		// && currentPayStatus != ORDER_STATUS.sucPayment
		return order?.status !== ORDER_STATUS.canceled && order?.status != ORDER_STATUS.sucPayment && order?.paymentWay == PAYMENT_TYPE.Alipay
	}

	const showTip = () => {
		// currentPayStatus
		return order?.status == ORDER_STATUS.sucPayment && order?.status == '1'
	}

	// 没点击过支付按钮 - 调起支付
	const handlePay = async (type) => {
		const { vatPrice, appUserId } = order || {}
		const dataType = {
			payType: order?.paymentWay,
			orderId: order?.orderId,
			vatNumber: paymentInfo?.vatNumber,
			orderNumber: paymentInfo?.orderNumber,
			vatPrice,
			userId: appUserId,
		}
		let res = await PaymentRepository.requestPayment(dataType, cookies?.account?.token || (flag ? orderId?.join('/') : orderDetail?.orderId)) // decrypt(orderId[0])
		if (res?.code === 0) {
			getOrder()
			if (type == PAYMENT_TYPE.LianLian) {
				const payData = JSON.parse(res.data.response ?? '{}');
				payData.order.payment_url && window.open(payData.order.payment_url);
			}
		}
	}

	// 点击LianLian支付 4066330000000004  4200000000000000
	const handleOrderPay = async () => {
		// 点击过支付按钮 - 有支付信息
		if (order?.orderPay) {
			const payData = JSON.parse(order?.orderPay.response ?? '{}');
			payData.order.payment_url && window.open(payData.order.payment_url);
		} else {
			handlePay(PAYMENT_TYPE.LianLian)
		}
	}

	const isShowWireTransferPayBtn = () => {
		return order?.paymentWay == PAYMENT_TYPE.WireTransfer && !order?.orderPay
	}

	const lianPayRef = useRef(null);
	// 银行转账
	const handleWireTransferOrderPay = async () => {
		handlePay()
	}

	// 银行支付，订单详情的支付按钮还要不要？？？
	useEffect(() => {
		if (order?.orderPay?.status == 0) {
			if (paypalPayStatus != 1) {
				setCurrentPayStatus(paypalPayStatus)
			}
		}
	}, [paypalPayStatus]);

	// 订单状态集合
	const pay_status = {
		1: iPaymentPending,
		2: getSucText(), // 获取文本
		3: iOrderCompleted,
		10: iProcessing,
		20: iPartiallyShipped,
		30: iAllShipped,
		40: iCanceled,
	}

	const orderUrl = `${ACCOUNT_ORDER_DETAIL}/${encrypt(order?.orderId)}`
	const surchargeOrderUrl = `${SURCHARGE_DETAILS}/${encrypt(order?.orderId)}`
	let headNavArr = [
		{
			name: i18Translate('i18AboutOrder.Order Details', "Order Details"),
			tabLabel: 'Order Details',
			linkUrl: flag ? `${orderUrl}?flag=true` : orderUrl,
		},
	]

	const getAdditionItem = curOrderId => {
		return {
			name: iSurchargeDetails,
			tabLabel: 'Surcharge Details',
			linkUrl: flag ? `${surchargeOrderUrl}?flag=true` : surchargeOrderUrl,
		}
	}

	// 导航status不为1的导航, 即创建过的附加
	order?.additionList?.map(item => {
		if (item.status !== 1) {
			headNavArr.push(getAdditionItem(item?.additionOrderId))
		}
	})

	const handleTabNav = (e, item,) => {
		e.preventDefault();
		setNavTabActive(item?.tabLabel)
	}

	// 去掉重复的订单, 去重
	const uniqueOrders = headNavArr.reduce((acc, current) => {
		// 判断当前对象的additionOrderId是否已经在acc数组中出现过
		const isExist = acc.some(order => order.linkUrl === current.linkUrl);
		// 如果不存在，则将当前对象加入acc数组
		if (!isExist) {
			acc.push(current);
		}
		return acc;
	}, []);

	let odLeftLabel = false; // 用于确定订单详情左侧标签的样式
	if (curLanguageCodeZh()) {
		odLeftLabel = true;
	}
	// 订单信息
	const content1 = () => {

		return <div className="ps-page__content">
			<div className="ps-section--account-setting">
				<div className="">
					<div className='pub-react-to-print'>

						<div className=''>
							<div className="pub-border20 pub-bgc-white box-shadow">
								<div className=''>
									{/* 订单号 */}
									<div className="">
										<div className="ps-block--invoice pub-flex-align-center">
											<div className={classNames(odLeftLabel ? 'order-detail-left-label-zh' : 'order-detail-left-label')}>{iOrderNumber}：</div>
											<div className='order'>{order?.orderId}</div>
										</div>
									</div>
									{isShowOrderInfo(order) && <ShowPaymentMethod classN={classNames(odLeftLabel ? 'order-detail-left-label-zh' : 'order-detail-left-label')} order={order} />}
									{/* 订单状态 */}
									{isShowOrderInfo(order) && <div className="ps-block--invoice pub-flex-align-center">
										<div className={classNames(odLeftLabel ? 'order-detail-left-label-zh' : 'order-detail-left-label')}>{iOrderStatus}：</div>
										<div>
											<div className={'pub-flex-align-center invoice-pay-status ' +
												((currentPayStatus == ORDER_STATUS.submit || (currentPayStatus == ORDER_STATUS.sucPayment && order?.status == '1') || order?.status == ORDER_STATUS.canceled) ? 'color-warn' : '')}>
												{order?.status == '1' ?
													i18MapTranslate(`i18AboutOrder.${pay_status[paypalPayStatus]}`, pay_status[paypalPayStatus]) :
													i18MapTranslate(`i18AboutOrder.${pay_status[order?.status]}`, pay_status[order?.status])}

												{/* 状态提示 */}
												{showTip() && <Popover
													content={<div className='pub-popover'>
														{iPaymentVerificationTip}
													</div>}
													placement="right"
													trigger="hover"
												>
													<QuestionCircleOutlined style={{ marginLeft: '10px', fontSize: '14px', color: '#555', width: '20px' }} />
												</Popover>
												}
											</div>
										</div>
									</div>}

									{/* 取消订单不展示 */}
									{
										(order?.status !== ORDER_STATUS.canceled && isShowOrderInfo(order)) && (
											<div
												className='pub-flex-wrap pub-flex-align-center mt25'
												style={{ overflow: "hidden", gap: '20px' }}
											>
												{/* 银行水单 */}
												{
													order?.paymentWay == '4' && <UploadBankCopy order={order} />
												}

												{/* 支付方式为PayPal时的支付按钮, PayPal支付按钮 */}
												{
													(
														order?.status !== ORDER_STATUS.canceled &&
														currentPayStatus != ORDER_STATUS.sucPayment &&
														order?.paymentWay == PAYMENT_TYPE.PayPal) &&
													<div className='pub-flex-center w150' style={{ position: 'relative', height: '32px', paddingTop: '6px' }}>
														{/* <PayPalBtn order={order} /> */}
														{/* <PayPalScriptProvider options={initialOptions} style={{ marginTop: '3px' }}> */}
														<PayPalButtons
															options={initialOptions}
															// flag为从管理端或者邮箱调整的url, flag为true则重新获取payId
															createOrder={() => (order?.orderPay && !flag) ? createOrder(order) : createSubmitOrder(order)}
															// onClick={handlePayment} // 注意此处的回调函数
															onApprove={onApprove}
															onSuccess={onApprove}
															onError={(err) => {

															}}
															onClose={() => {
																// const [{ loaded, status }, dispatch] = usePayPalScriptReducer();
															}}
															onCancel={() => {
																console.log("Payment onCancel by user.");
															}}

															style={{
																layout: "horizontal",
																// color: "gold",
																// color: 'blue',
																// shape: "pill",

																fontSize: 13, // 16,
																height: 32,
																width: 148,
																// marginTop: 3,
															}}
														>
														</PayPalButtons>
														{/* </PayPalScriptProvider> */}
														<Button
															type="submit" ghost='true'
															className='login-page-login-btn ps-add-cart-footer-btn custom-antd-primary pub-paypal-btn pub-font13 w150 mt30'
															style={{ left: '0', borderRadius: '4px' }}
														>
															{iPayment}
														</Button>
													</div>
												}
												{/* 连连支付按钮 */}
												{isShowLianPayBtn() &&
													<Button
														// loading={isLoading}
														type="submit" ghost='true'
														className='login-page-login-btn ps-add-cart-footer-btn custom-antd-primary pub-font13 w150'
														onClick={handleOrderPay}
													>
														{iPayment}
													</Button>
												}
												{/* 银行转账 */}
												{isShowWireTransferPayBtn() &&
													<Button
														// loading={isLoading}
														type="submit" ghost='true'
														className='login-page-login-btn ps-add-cart-footer-btn custom-antd-primary pub-font13 w150'
														onClick={handleWireTransferOrderPay}
													>
														{iPayment}
													</Button>
												}

												{isShowAliPay() && (
													<AlipayBtn
														orderInfo={{
															payType: order.paymentWay,
															orderId: order.orderId,
															appUserId: order?.appUserId,
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

							<div className='pub-border20 pub-bgc-white mt20 box-shadow'>
								<div className='ps-order-status-box' style={{ padding: "25px 20px" }}>
									<Steps
										labelPlacement="vertical"
										items={items}
									/>
								</div>

							</div>

							{(order?.status && isShowOrderInfo(order)) && <OrderAddressInfo order={order} callBackFun={callBackFun} />}

						</div>

					</div>

				</div>
			</div>
		</div>
	}
	// 发货信息
	const content2 = () => {
		if (!isShowOrderInfo(order) || !deliveryList.length > 0) return null
		return <div className='order-tracking mt20 pub-border15 pub-bgc-white'>
			<div className='pub-left-title mb10'>{i18Translate('i18AboutOrder2.Shipping Information', 'Shipping Information')}</div>
			<Table
				size="small"
				pagination={false}
				rowKey={(record, index) => index + 'shipp'}
				columns={shippingColumns}
				dataSource={deliveryList}
				className='pub-border-table shipping-table'
				scroll={deliveryList?.length > 0 ? { x: 800 } : null}
			/>
		</div>
	}
	// 发货和订单产品列表
	const getShippProducts = () => {
		if (!isShowOrderInfo(order)) return null
		return <div className={"ps-container " + (OrderDetailModal ? 'ml0' : '')}>
			<div className='' style={{ display: 'flex' }}>
				<div className={'ps-shopping-cart-left cart-add-more ' + (order?.deliveryList ? '' : 'mr0')}>

					<div className={'cart-tabs mt20 h45 ' + (OrderDetailModal ? '' : 'pub-sticky')} style={{ borderBottom: 'none' }}>

						{
							deliveryList?.length === 0 &&
							<div className='pub-left-title pub-fontw'>{i18Translate('i18MyCart.Cart', 'Cart')}</div>
						}
						{
							deliveryList?.length > 0 &&
							<div
								className={'cart-tabs-item ' + (tabActive == '-1' ? 'cart-tabs-active ' : '')}
								onClick={() => seTabActive('-1')}
							>{i18Translate('i18MyCart.Cart', 'Cart')}</div>
						}
						{
							deliveryList?.length > 0 && deliveryList.map((item, index) => {
								return <div
									key={index + 'Shipping'}
									className={'cart-tabs-item ' + (tabActive == index ? 'cart-tabs-active' : '')}
									onClick={() => seTabActive(index)}
								>{iShipping} {index + 1}</div>
							})
						}

					</div>
					{/* table-responsive */}
					<div className="mt10 box-shadow">
						<OrderSummaryTable paramMap={paramMap} order={order} orderList={orderList} num={7} OrderDetailModal={OrderDetailModal} />
					</div>
				</div>

				{order?.deliveryList && <div className='ps-block--checkout-order ml20' style={{ background: 'none' }}>
					<div className={'pub-left-title pub-fontw mt20 h45 w380 ' + (OrderDetailModal ? '' : 'pub-sticky')}></div>
					{/* table-responsive */}
					<div className="mt20">
						<Table
							size="small"
							pagination={false}
							rowKey={record => record.id + 'shipping'}
							columns={columns}
							dataSource={currentShipping}
							sticky={OrderDetailModal ? undefined : true}
							className='pub-border-table shipping-table table-title-top'
						/>
					</div>
				</div>
				}

			</div>
		</div>
	}

	return (
		<section
			className="ps-order-detail shopping-cart-container ps-page--account custom-antd-btn-more pt-0"
			style={{ paddingBottom: '0' }}>
			<Spin spinning={loading} size='large'>
				<div className={(OrderDetailModal ? 'ps-container ml0' : '')}>
					{
						uniqueOrders?.length > 1 && <PageHeaderShadow
							tabActive={navTabActive} headNavArr={uniqueOrders} handleTabNav={handleTabNav}
						/>
					}
				</div>
				<div className={"ps-container pt-20 " + (OrderDetailModal ? 'ml0' : '')}>
					<div className="pub-flex-wrap" style={{ gap: '20px' }}>

						<div className={"ps-shopping-cart-left " + (isShowOrderInfo(order) ? '' : 'percentW100')}>
							{/* 标题和按钮组 */}
							{!isShowOrderInfo(order) && <MinLoginTip tipText={iCheckOrderTip} className="mb15" />}

							<div className='pub-flex-between pub-flex-align-center mb10'>
								<div className='pub-left-title pub-font18'>{iOrderDetails}</div>
								{isShowOrderInfo(order) && <div className='pub-flex-align-center' style={{ gap: '20px' }}>
									{/* 多订单产品 */}
									{
										order?.attachProductList?.length > 0 && <AttachOrderProduct order={order} />
									}
									{/* 订单附加费用，订单完成不需要附加费了 */}
									{(order?.additionList?.length > 0 && order?.status !== ORDER_STATUS.fulfillment) && <AttachOrderPrice order={order} />}

									{/* Export to Excel */}
									{order && <ExportToExcel orderId={order?.orderId} orderDetails={order?.orderDetails} />}

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
															{iPrint}
														</div>
													</div>
												</Button>
											</div>
										}
										content={() => componentRef}
										style={{ padding: '30px' }}
									/>
									{/* 下载发票 */}
									<DownLoadInvoice order={order} />
								</div>}
							</div>

							<div>

								{content1()}
								{content2()}

							</div>
						</div>
						{/* 右侧小计 */}
						{isShowOrderInfo(order) && <div className="ps-form__orders" style={{ maxWidth: '100%' }}>
							<ModulePaymentOrderSummary
								type="detail"
								payment={true}
								order={order}
								summaryStep={6}
								shippingPrice={order?.shippingPrice}
								voucheour={{ price: order?.couponPrice }}
							/>
						</div>}

						{/* 同时修改另外一个DownloadPDF传参等 - 临时修改客户pdf使用 */}
						{/* <DownloadPDF
							orderData={order}
							orderId={order?.orderId} invoiceType={order?.paymentWay}
							sendDateType={order?.sendDateType}
							paramMap={paramMap}
						/> */}

					</div>

				</div>

				{getShippProducts()}


				{/* 打印用 */}
				<div className='print-container' style={{ padding: '20px', }} ref={(el) => (componentRef = el)}>
					<div className='mt20 mb20'><LogoCom /></div>
					{content1()}
					{content2()}
					{getShippProducts()}
				</div>

			</Spin>

			{
				showPayment && <Modal
					centered
					title={iPayment}
					footer={null}
					width={620}
					onCancel={(e) => setShowPayment(false)}
					open={showPayment}
					closeIcon={<i className="icon icon-cross2"></i>}
					className='custom-antd-btn-more'
				>
					<div>
						<iframe
							ref={lianPayRef}
							name="payment-iframe"
							// sandbox='allow-scripts'
							id="payment-iframe"
							style={{ width: '580px' }}
							width="580px !important"
							height="550px"
							src="https://celer-gateway.lianlianpay-inc.com/publish/76a6997dbe9541ebbc279e66c179ad1d" />
					</div>
				</Modal>
			}

		</section>
	);
};


export default connect(state => state.auth)(OrderDetail);
