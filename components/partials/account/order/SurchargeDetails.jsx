
import React, { useState, useEffect, useRef } from 'react';
import ReactToPrint from 'react-to-print';
import { Spin } from 'antd';
import Link from 'next/link';
// import { QuestionCircleOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import { Table, Button } from 'antd';
import { uniqBy } from 'lodash';

import OrderRepository from '~/repositories/zqx/OrderRepository';
import PaymentRepository from '~/repositories/zqx/PaymentRepository';

import useOrder from '~/hooks/useOrder';
import useLocalStorage from '~/hooks/useLocalStorage';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
import useApi from '~/hooks/useApi';

import ModulePaymentOrderSummary from '~/components/partials/account/modules/ModulePaymentOrderSummary';
import UploadBankCopy from '~/components/ecomerce/orderCom/UploadBankCopy';  // 银行水单
import { DownLoadInvoice } from '~/components/ecomerce/orderCom'; // 下载invoice
import PageHeaderShadow from '~/components/ecomerce/minCom/PageHeaderShadow';
import PayPalBtn from '~/components/ecomerce/orderCom/PayPalBtn'
import { AlipayBtn } from '~/components/ecomerce';
// import ShowPaymentMethod from '~/components/partials/account/order/ShowPaymentMethod';
import { DownloadPDF } from '~/components/PDF';
import { MinLoginTip } from '~/components/ecomerce';
import LogoCom from '~/components/shared/headers/zqx/LogoCom';

import { getCurrencyInfo } from '~/repositories/Utils';

import { decrypt } from '~/utilities/common-helpers';
import { PAYMENT_TYPE, ORDER_STATUS } from "~/utilities/constant"
import { encrypt } from "~/utilities/common-helpers"
import { ACCOUNT_ORDER_DETAIL, SURCHARGE_DETAILS } from '~/utilities/sites-url'



const SurchargeDetailsCom = ({ token, orderId, otherParams, paramMap }) => {
	const {
		iPaymentPending, iPaymentCompleted, iCheckOrderTip, iSurchargeNumber, iAmount, iPrint
	} = useI18();
	const { surchargeType, getDictSurchargeType } = useApi()
	const { i18Translate } = useLanguage();
	// const { getPayMethodText1 } = useCart();

	const iOrderNumber = i18Translate('i18AboutOrder.Order Number', "Order Number")
	const iOrderStatus = i18Translate('i18MenuText.Order Status', "Order Status")

	// 订单详情弹窗
	const { orderDetail, OrderDetailModal } = otherParams || {}

	const Router = useRouter();
	const { flag } = Router?.query; // 从管理后台跳转的订单详情, 判断拿哪里的token
	const [cookies] = useCookies(['account']);
	const [order, setOrder] = useState(orderDetail || {});
	const [tabActive, seTabActive] = useState(-2) // 第几次发货
	const [navTabActive, setNavTabActive] = useState('Surcharge Details') // 导航状态

	const [loading, setLoading] = useState(false);
	const [currentPayStatus, setCurrentPayStatus] = useState(ORDER_STATUS.submit) // 支付状态

	const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 勾选中的keys

	const [paypalPayStatus, setPaypalPayStatus] = useLocalStorage('paypalPayStatus', ORDER_STATUS.submit);
	const { payWayList, getPayWayList, getPayWayItem, isShowOrderInfo } = useOrder()

	let componentRef = useRef();
	let surchargeOrderData = useRef();

	const currencyInfo = getCurrencyInfo()

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
				seTabActive(-1)
			}
			setOrder(data);

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
		//  // 订单列表抽屉
		if (!cookies?.account?.token && !flag) {
			return false;
		}
		setLoading(true)

		if (flag) {
			const res = await OrderRepository.getEmailOrder(orderId.join('/'), cookies?.account?.token);

			setLoading(false)
			handleRes(res?.data, text)
		} else {
			const res = await OrderRepository.getOrder(decrypt(orderId[0]), cookies?.account?.token);

			setLoading(false)
			handleRes(res, text)
		}

	}

	//status状态（1 已提交 2：待审核 3 已完成  10：待发货  20：部分发货 30：全部发货  40：已取消）
	//PAY_STATUS 支付状态  1：未支付 2：已支付  3：已退款
	const handleStatus = () => { }

	useEffect(() => {
		getOrder();
	}, [token, orderId])
	useEffect(() => {
		handleStatus(currentPayStatus, order);
	}, [order])


	useEffect(() => {
		if (order?.deliveryList) {
			const values = order?.deliveryList

			let arr = []
			// 查找发货的产品id
			values[tabActive]?.map(item => {
				const haveItem = order?.orderDetails.find(i => i.productId == item.productId)
				if (haveItem) {
					arr.push(haveItem)
				}
			})

		}
	}, [tabActive])

	const columnsSurcharge = [
		{
			title: iSurchargeNumber,
			dataIndex: 'additionOrderId',
			width: '160px',
			align: 'left',
		},

		// 附加费 2 提交支付 3 支付成功
		{
			title: iOrderStatus,
			dataIndex: 'status',
			width: '160px',
			align: 'left',
			render: (snapshot, record) => {
				return <div className={record?.status === 3 ? 'color-suc' : 'color-warn'}>
					{record?.status === 3 ? iPaymentCompleted : iPaymentPending}</div>
			}
		},
		{
			title: i18Translate('i18AboutOrder2.Payment Method', 'Payment Method'),
			dataIndex: 'PaymentMethod',
			width: '160px',
			align: 'left',
			render: (snapshot, record) => getPayWayItem(record?.payType, payWayList)?.name
			// render: (snapshot, record) => getPayMethodText1(record?.payType)
		},
		{
			title: i18Translate('i18SmallText.appellation', 'Name'),
			dataIndex: 'status',
			align: 'left',
			render: (text, record) => surchargeType?.find(i => i?.value === record?.type)?.dictLabel
		},
		{
			title: iAmount,
			dataIndex: 'price',
			align: 'right',
			render: (text, record) => (
				<div>{currencyInfo.label}{record?.price}</div>
			)
		},
	]

	useEffect(() => {
		if (order?.orderPay?.status == 0) {
			if (paypalPayStatus != 1) {
				setCurrentPayStatus(paypalPayStatus)
			}
		}
	}, [paypalPayStatus]);

	const iSurchargeDetails = i18Translate('i18AboutOrder.Surcharge Details', "Surcharge Details")

	// const textTip = "If you have successfully made the payment, please wait. The system usually completes the verification of payment information within a few minutes."
	// const iPaymentVerificationTip = i18Translate('i18AboutOrder.PaymentVerificationTip', textTip)
	const iPayment = i18Translate('i18MyCart.Payment', 'Payment')
	// flag
	const orderUrl = `${ACCOUNT_ORDER_DETAIL}/${encrypt(order?.orderId)}`
	const surchargeOrderUrl = `${SURCHARGE_DETAILS}/${encrypt(order?.orderId)}`
	const headNavArr = [
		{
			name: i18Translate('i18AboutOrder.Order Details', "Order Details"),
			tabLabel: 'Order Details',
			linkUrl: flag ? `${orderUrl}?flag=true` : orderUrl,
		},
		{
			name: iSurchargeDetails,
			tabLabel: 'Surcharge Details',
			linkUrl: flag ? `${surchargeOrderUrl}?flag=true` : surchargeOrderUrl,
		},
	]
	const handleTabNav = (e, item,) => {
		e.preventDefault();
		setNavTabActive(item?.tabLabel)
	}
	// 勾选
	const rowSelection = {
		columnTitle: <div>{i18Translate('i18PubliceTable.Select', 'Select')}</div>,
		columnWidth: '60px', // 设置行选择列的宽度为
		selectedRowKeys, // 选中的key集合
		onChange: (selectedRowKeys, selectedRow) => {
			// const arr = []
			// const params = selectedRow?.map(i => {
			//     // const cur = selectedRows?.find(item => item?.id === i?.id)
			//     arr.push(i?.id)
			//     return {
			//         ...i, 
			//     }
			// })
			// updateSelData(selectedRow)
		},
		getCheckboxProps: (record) => ({
			disabled: true,
		}),
	};

	// 附加费重新处理订单数据
	const surchargeOrder = () => {
		const createSurchargeData = order?.additionList?.filter(item => item.status !== 1) // 已创建附加费订单的数据
		const uniqueArray = uniqBy(createSurchargeData, 'additionOrderId'); // 去重，为了拿税费
		let vatPrice = 0 // 所有附加费订单的税费总额
		let padVatPrice = 0 // 未支付的税费
		uniqueArray?.map(item => {
			vatPrice += item?.vatPrice
			if (item?.status === 2) {
				padVatPrice = item?.vatPrice
			}
		})


		const paySurchargeData = order?.additionList?.filter(item => item.status === 2) // 未支付的数据
		let productPrice = 0 // 所有创建了附加费的金额， 已支付 + 未支付
		let payPendingPrice = 0 // 所有创建了附加费, 未支付的产品金额
		createSurchargeData?.map(item => productPrice += Number(item?.price))
		paySurchargeData?.map(item => payPendingPrice += Number(item?.price))

		const newOrderData = {
			...order,
			type: 2,
			orderDetails: order?.additionList || [],
			productPrice,
			payPendingPrice: payPendingPrice + padVatPrice, // 未支付的：产品金额 + 税费
			vatPrice, // 35.74 已支付 + 未支付
			padVatPrice, // 未支付的税费
			additionOrderId: paySurchargeData?.[0]?.additionOrderId, // 未支付的数据的附加费订单号， 用于支付
			payType: paySurchargeData?.[0]?.payType, // 未支付的支付类型
			paymentWay: paySurchargeData?.[0]?.payType, // 未支付的支付类型
			couponPrice: 0, // 附加费没有优惠券
		}

		surchargeOrderData.current = newOrderData

		setSelectedRowKeys(paySurchargeData?.map(item => item?.id)) // 默认选择未支付的订单 
		return newOrderData
	}

	useEffect(() => {
		if (payWayList?.length === 0) return
		surchargeOrder()
	}, [order, payWayList])
	useEffect(() => {
		getPayWayList()
		getDictSurchargeType()
	}, [])

	// const createOrder = async (order) => {
	//     return order?.orderPay?.payId
	// }
	const onApprove = (data, actions) => {
		// setPaypalPayStatus(ORDER_STATUS.sucPayment)
		getOrder('paySuc');
	}
	const goPaymentSuc = () => {
		// setPaypalPayStatus(ORDER_STATUS.sucPayment)
		getOrder('paySuc');
	}
	// paypal重新发起支付
	const createSubmitOrder = async (order) => {
		// if (paymentWay !== PAYMENT_TYPE.PayPal ) return
		const { padVatPrice, appUserId } = surchargeOrderData.current || {}
		const dataType = {
			payType: PAYMENT_TYPE.PayPal,
			orderId: surchargeOrderData.current?.additionOrderId,
			vatNumber: '',
			orderNumber: '',
			vatPrice: padVatPrice,
			userId: appUserId,
			isEmailFlag: 1,
		}
		let res = await PaymentRepository.requestPayment(dataType, cookies?.account?.token || (flag ? orderId?.join('/') : decrypt(orderId[0])))
		return res.data.payId
	}

	const getOrderPrint = () => {
		return <div className="ps-page__content">
			<div className="ps-section--account-setting">
				<div className="">
					<div id='pdfPage' className='pub-react-to-print'>
						{/* ref={(el) => (componentRef = el)} */}
						<div style={{ padding: '10px' }}>
							{/* 订单号 */}
							<div className="mt10">
								<div className="ps-block--invoice pub-flex-align-center">
									<div className=''>{iOrderNumber}：</div>
									<div className='order'>{order?.orderId}</div>
									<Link href={flag ? `${orderUrl}?flag=true` : orderUrl}>
										<a className='view-more mb-5' style={{ display: 'contents' }}>
											<span className='sub-title pub-color-link ml20'>
												{i18Translate('i18AboutProduct.View Order Details', 'View Order Details')}
											</span>
										</a>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	}
	const getOrderProduct = () => {
		return <div className='mt30'>
			<div className={'' + (order?.deliveryList ? '' : 'mr0')}>
				<Table
					size="small"
					pagination={false}
					rowKey={record => record.id}
					columns={columnsSurcharge}
					rowSelection={{
						...rowSelection,
					}}
					dataSource={order?.additionList?.filter(item => item.status !== 1)}
					sticky={OrderDetailModal ? undefined : true}
					className='pub-border-table shipping-table box-shadow'
				/>
				{/* 取消订单不展示 */}
				{
					order?.status !== ORDER_STATUS.canceled && <div className='pub-flex-align-center mt20'>
						{/* paypal支付 payType */}
						{(surchargeOrderData.current?.payType === PAYMENT_TYPE.PayPal && surchargeOrderData.current?.payPendingPrice > 0) &&
							<div className='mr10'>
								<PayPalBtn
									createOrder={() => createSubmitOrder(order)} // 现在没有orderPay也可调起
									// createOrder={() => order?.orderPay ? createOrder(order) : createSubmitOrder(order)}
									onApprove={onApprove}
									goPaymentSuc={goPaymentSuc}
									subBtnName={iPayment}
								/>
							</div>
						}
						{(surchargeOrderData.current?.payType === PAYMENT_TYPE.Alipay && surchargeOrderData.current?.payPendingPrice > 0) &&
							<div className='mr10'>
								<AlipayBtn
									orderInfo={{
										payType: PAYMENT_TYPE.Alipay,
										orderId: surchargeOrderData.current?.additionOrderId,
									}}

									btnName={iPayment}
									onCallBack={v => console.log('--alipay--del')}
									token={cookies?.account?.token}
								// jumpUrl={Router.asPath}

								// btnClassName='w150 mr0 ml0'
								// // ref={aliPayRef}
								// orderInfo={{}}
								// token={cookies?.account?.token}
								// jumpUrl={`${SURCHARGE_DETAILS}/${encrypt(order?.orderId)}`}
								/>
							</div>
						}

						{
							surchargeOrderData.current?.payType === PAYMENT_TYPE.WireTransfer && (
								<div
									className='pub-flex-wrap pub-flex-align-center'
									style={{ overflow: "hidden", gap: '20px' }}
								>
									{/* 银行水单 +order?.paymentWay === PAYMENT_TYPE.WireTransfer &&  */}
									{
										<UploadBankCopy order={order} />
									}
								</div>
							)}
					</div>
				}
			</div>
		</div>
	}

	return (
		// .ps-my-account
		<section
			className="ps-order-detail shopping-cart-container ps-page--account custom-antd-btn-more pt-0"
			style={{ paddingBottom: '0' }}>
			<Spin spinning={loading}>
				<PageHeaderShadow tabActive={navTabActive} headNavArr={headNavArr} handleTabNav={handleTabNav} />
				<div>
					<div className={"ps-container pt-20 " + (OrderDetailModal ? 'ml0' : '')}>
						<div className="pub-flex-wrap" style={{ gap: '20px' }}>

							<div className="ps-shopping-cart-left">
								{!isShowOrderInfo(order) && <MinLoginTip tipText={iCheckOrderTip} className="mb15" />}
								{/* 标题和按钮组 */}
								{isShowOrderInfo(order) && <div className='pub-flex-between pub-flex-align-center mb10'>
									<div className='pub-left-title pub-font18'>{iSurchargeDetails}</div>
									<div className='pub-flex-align-center' style={{ gap: '20px' }}>
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
										<DownLoadInvoice
											order={{
												...order,
												orderId: order?.additionList?.[0]?.additionOrderId,
												// paymentWay: 5,
											}}
											text={i18Translate('i18FunBtnText.DownLoad Surcharge', "DownLoad Surcharge")}
											fileNamePrefix={iSurchargeNumber}
											isUpdate={true}
										>
											{/* 生成, 更新pdf */}
											{/* 同时修改另外一个DownloadPDF传参等 */}
											{
												surchargeOrderData.current && <DownloadPDF
													type={2}
													orderData={{
														...surchargeOrderData.current,
														mainOrderId: order?.orderId,
														type: 2,
													}} // 附加费订单信息重组
													orderId={order?.additionList?.[0]?.additionOrderId} //固定附加费id
													invoiceType={order?.paymentWay}
													sendDateType={order?.sendDateType}
													paramMap={paramMap}
												/>
											}
										</DownLoadInvoice>
									</div>
								</div>}


								{getOrderPrint()}
								{getOrderProduct()}

								{/* 打印用 print-container */}
								<div className='print-container' style={{ padding: '20px', display: 'block' }} ref={(el) => (componentRef = el)}>
									<div className='mt20 mb20'><LogoCom /></div>
									{getOrderPrint()}
									{getOrderProduct()}
								</div>

							</div>

							{/* {
                            !OrderDetailModal && ( */}
							{isShowOrderInfo(order) && <div className="ps-form__orders" style={{ maxWidth: '100%' }}>
								{/* 附加费 */}
								<ModulePaymentOrderSummary
									type="detail"
									payment={true}
									order={surchargeOrderData.current}
									// order={{
									//     ...order,
									//     type: 2,
									//     orderDetails: order?.additionList || [],
									// }}
									summaryStep={6}
									shippingPrice={0} // 附加费为0
									voucheour={{ price: 0 }}
								/>
							</div>}


						</div>



					</div>

				</div>

			</Spin>

			{/* 生成, 更新pdf */}
			{/* 同时修改另外一个DownloadPDF传参等 */}
			{/* {
                surchargeOrderData.current && <DownloadPDF
                    type={2}
                    orderData={{
                        ...surchargeOrderData.current,
                        mainOrderId: order?.orderId,
                        type: 2,
                    }} // 附加费订单信息重组
                    orderId={order?.additionList?.[0]?.additionOrderId} //固定附加费id
                    invoiceType={order?.paymentWay}
                    sendDateType={order?.sendDateType}
                    paramMap={paramMap}
                />
            } */}


		</section>
	);
};


export default connect(state => state.auth)(SurchargeDetailsCom);
