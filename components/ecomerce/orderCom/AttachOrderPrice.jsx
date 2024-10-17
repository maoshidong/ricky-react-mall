import React, { useState, useRef, useEffect } from 'react';
import { Button, Table } from 'antd';
import { useRouter } from 'next/router';

import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
import useApi from '~/hooks/useApi';
import useOrder from '~/hooks/useOrder';


import OrderRepository from '~/repositories/zqx/OrderRepository';
import MinModalTip from '~/components/ecomerce/minCom/MinModalTip'; // 公共提示
import { useCookies } from 'react-cookie';
import { toFixed } from '~/utilities/ecomerce-helpers';
// import PaymentMethodsSelect from '~/components/ecomerce/modules/PaymentMethodsSelect';
import { PayWaySelect } from '~/components/ecomerce'
import PayPalBtn from '~/components/ecomerce/orderCom/PayPalBtn' // Paypal支付
import { AlipayBtn } from '~/components/ecomerce';
import PaymentRepository from '~/repositories/zqx/PaymentRepository';
import { PAYMENT_TYPE, TABLE_COLUMN } from "~/utilities/constant"
import { SURCHARGE_DETAILS } from '~/utilities/sites-url'
import { encrypt } from '~/utilities/common-helpers';
import { getCurrencyInfo } from '~/repositories/Utils';
import { AlarmPrompt } from '~/components/common'

// 产品附加费公共组件
const AttachOrderProductCom = (props) => {
	const {
		iPending, iPaymentPending, iPaymentCompleted, iSubmitPayment, iPaymentSurcharge,
	} = useI18();
	const { surchargeType, getDictSurchargeType } = useApi()
	const { i18Translate, i18MapTranslate, curLanguageCodeZh } = useLanguage();
	const { payWayList, getPayWayList, getPayWayItem } = useOrder()
	const payWayListRef = useRef([]); // 附加费生成的订单id

	const { order } = props
	const { additionList = [] } = order || {}

	const [isShowModal, setIsShowModal] = useState(true)
	const [paymentWay, setPaymentWay] = useState(curLanguageCodeZh() ? PAYMENT_TYPE.Alipay : PAYMENT_TYPE.PayPal); // 默认支付方式： 英文默认paypal, 中文默认支付宝
	const [cookies] = useCookies(['account']);
	const [showError, setShowError] = useState(false);
	const attachOrderRef = useRef(null); // 附加费生成的订单id

	const selectedRowsRef = useRef([]); // 勾选的附加费用列表
	const [selectedRows, setSelectedRows] = useState([]) // 勾选中的数据
	const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 勾选中的keys

	const Router = useRouter();
	const { flag } = Router?.query; // 从管理后台跳转的订单详情, 判断拿哪里的token
	const currencyInfo = getCurrencyInfo();
	const [aliInfo, setAliInfo] = useState({}) // 支付宝支付-信息集合

	// 没有未支付的就不展示按钮
	let arr = []
	additionList?.map(item => {
		if (item?.status !== 3) {
			arr.push(item)
		}
	})
	if (arr?.length === 0) return null

	// 更新勾选中的数据
	const updateSelData = arr => {
		selectedRowsRef.current = arr
		setSelectedRows(arr)
		setSelectedRowKeys(arr?.map(item => item?.id))
	}

	useEffect(() => {
		setShowError(selectedRows?.length === 0)
	}, [selectedRows])
	// 默认选中没支付的
	useEffect(() => {
		let arr = []
		additionList?.map(item => {
			if (item?.status !== 3) {
				arr.push(item)
			}
		})
		updateSelData(arr)


	}, [additionList])
	useEffect(() => {
		getPayWayList()
		getDictSurchargeType()
	}, [])

	useEffect(() => {
		if (paymentWay === PAYMENT_TYPE.Alipay && paymentWay && payWayList?.length > 0) {
			getAliPay(PAYMENT_TYPE.Alipay)
		}
	}, [paymentWay, payWayList])
	useEffect(() => {
		if (payWayList?.length > 0) {
			setPaymentWay(payWayList?.[0]?.payWay)
		}
		// console.log(payWayList, 'payWayListRef.1111-payWayListpayWayListpayWayList--del')
		payWayListRef.current = payWayList
	}, [payWayList])

	const viewBankCopy = () => {
		// 上传有数据才直接打开 
		if (additionList?.length > 0) {
			setIsShowModal(true)
		}
	}


	const bankCopyBtn = () => {

		return <Button
			type="primary" ghost='true'
			className='login-page-login-btn ps-add-cart-footer-btn custom-antd-primary'
			onClick={viewBankCopy}
		>
			<div className='pub-flex-center'>
				<div>{iPaymentSurcharge}</div>
			</div>
		</Button>
	}

	const iSelect = i18Translate('i18PubliceTable.Select', 'Select')
	// 勾选
	const rowSelection = {
		// type: 'radio',
		columnTitle: <div>{iSelect}</div>,
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
			updateSelData(selectedRow)
		},
		getCheckboxProps: (record) => ({
			disabled: record?.status === 3,
		}),
	};

	const iPrice = i18Translate('i18PubliceTable.Price', 'Price')
	const iStatus = i18Translate('i18PubliceTable.Status', TABLE_COLUMN.orderStatus)
	const iSelectPaymentTip = i18Translate('i18SmallText.Please Select', 'Please select a name')

	// 状态类 
	const getClass = record => {
		const { status } = record
		if (status === 1) return 'pub-primary-tag'
		let text = 'pub-tip-tag'
		if (status === 3) {
			text = 'pub-suc-tag'
		}
		return text
	}
	// 状态文本
	const getStatusText = record => {
		const { status } = record
		if (status === 1) return iPending
		let text = iPaymentPending
		if (status === 3) {
			text = iPaymentCompleted
		}
		return i18MapTranslate(`i18AboutOrder.${text}`, text)
	}

	const columns = [
		{
			title: iStatus,
			dataIndex: 'status',
			render: (text, record) => <div>
				<span className={getClass(record)}>{getStatusText(record)}</span>
				{/* <OrderStatus record={record} /> */}
			</div>
		},
		{
			title: i18Translate('i18SmallText.appellation', 'Name'),
			dataIndex: 'type',
			render: (text, record) => surchargeType?.find(i => i?.value === record?.type)?.dictLabel
		},
		{
			title: iPrice,
			dataIndex: 'price',
			render: (text, record) => (
				<div>{currencyInfo.label}{record?.price}</div>
			),
		},
	]

	// 计算税费
	const calculatedTax = (paymentWay, additionPrice) => {
		const { rate, fixedAmount, otherFee } = getPayWayItem(paymentWay, payWayListRef.current) // 管理端设置的金额比率和金额
		let taxNum = 0
		// 税费 = 总金额加运费 * 税率 + 其它两种金额值- 新的：拿管理端配置的数据，算法一样了; 附加费也是一样的算法
		taxNum = Number(toFixed(
			((Number(additionPrice) * (rate * 100) * 100)) / 10000), 2) + fixedAmount + otherFee

		// 1. PayPal支付 round
		// if (paymentWay == PAYMENT_TYPE.PayPal1) {
		// 	taxNum = Number(toFixed(
		// 		((Number(additionPrice) * (PAYPAL_VAT * 100) * 100)) / 10000
		// 	), 2)
		// } else if (paymentWay == PAYMENT_TYPE.WireTransfer) {
		// 	taxNum = WIRE_TRANSFER_VAT
		// }

		return Number(taxNum) || 0
	}


	const handleAttachOrder = data => {
		attachOrderRef.current = data
	}
	// 计算类型总价
	const getProductsTotal = (arr, payType) => {
		let price = 0
		arr.map(item => {
			price += payType === PAYMENT_TYPE.PayPal ? Number(toFixed(Number(item.price), 2)) : Number(item.price) // 注意： PayPal 支付 只取单价的两位数
		})
		return price
	}

	// paypal支付调用 - 注意： paypal支付保留两位数 
	const createOrder = async () => {

		const { current } = selectedRowsRef
		if (current === 0) {
			setShowError(true)
			return
		}
		// 改为list
		const detailList = current?.map(item => {
			const { id, price, type } = item
			return {
				additionId: id, // 附加费数据id
				type,
				price: toFixed(Number(price), 2),
			}
		})
		// 所有附加费的和
		const productPrice = Number(toFixed(getProductsTotal(current, PAYMENT_TYPE.PayPal), 2))
		const dataQuery = {
			detailList,
			mainOrderId: order?.orderId,
			paymentWay,
			productPrice,
			price: productPrice + Number(calculatedTax(paymentWay, productPrice)), // 总价=所有附加费的和+税费
			vatPrice: calculatedTax(paymentWay, productPrice),
		}

		// const { id, orderId, price, type } = selectedRows?.[0]
		// const params = {
		//     mainOrderId: orderId,
		//     additionId: id, // 附加费数据id
		//     paymentWay, type,
		//     price: calculatedTax(paymentWay, price) + Number(price), // 总价=税费+附加费
		//     productPrice: Number(price),
		//     vatPrice: calculatedTax(paymentWay, price),
		// }
		const resAttach = await OrderRepository.createSubmitAttach(dataQuery, cookies?.account?.token);

		handleAttachOrder(resAttach?.data)

		const dataType = {
			payType: paymentWay,
			orderId: resAttach?.data, // 附加费用生成的订单
			vatPrice: calculatedTax(paymentWay, productPrice),
			userId: order?.appUserId,
			isEmailFlag: 1, //  flag ? 1 : null
		}

		let res = await PaymentRepository.requestPayment(dataType, cookies?.account?.token)
		return res?.data?.payId
	}
	// 跳转到详情
	const goDetails = data => {
		if (selectedRowsRef.current?.length === 0) {
			setShowError(true)
			return
		}
		Router.push(`${SURCHARGE_DETAILS}/${data}`);
	}
	// onApprove
	const onApprove = () => {
		goDetails(encrypt(order?.orderId)) // attachOrderRef?.currentattachOrderRef?.current
	}
	const goPaymentSuc = () => {
		goDetails(encrypt(order?.orderId)) // attachOrderRef?.current
	}

	// 银行卡支付
	const handleOrderPay = async () => {
		if (selectedRows?.length === 0) {
			setShowError(true)
			return
		}

		// 改为list
		const detailList = selectedRows?.map(item => {
			const { id, price, type } = item || {}
			return {
				additionId: id, // 附加费数据id
				type,
				price: Number(price),
			}
		})
		// 所有附加费的和
		const productPrice = Number(toFixed(getProductsTotal(selectedRows), 2))
		const dataQuery = {
			detailList,
			mainOrderId: order?.orderId,
			paymentWay,
			productPrice,
			price: productPrice + Number(calculatedTax(paymentWay, 0)), // 总价=所有附加费的和+税费
			vatPrice: calculatedTax(paymentWay, 0),
		}
		// console.log(dataQuery,'dataQuery----del')
		// return
		const { price } = selectedRows?.[0]
		// const params = {
		//     mainOrderId: orderId,
		//     additionId: id, // 附加费数据id
		//     paymentWay, type,
		//     price: calculatedTax(paymentWay, price) + Number(price), // 总价=税费+附加费
		//     productPrice: Number(price),
		//     vatPrice: calculatedTax(paymentWay, price),
		// }
		// 生成附加费用订单
		const resAttach = await OrderRepository.createSubmitAttach(dataQuery, cookies?.account?.token);
		// const resD = await OrderRepository.getOrder(resAttach?.data, cookies?.account?.token); // 测试订单详情是否正确
		if (resAttach?.code === 0) {
			handleAttachOrder(resAttach?.data)

			const dataType = {
				payType: paymentWay, // 支付方式
				orderId: resAttach?.data, // 附加费用生成的订单
				vatPrice: calculatedTax(paymentWay, productPrice),
				userId: order?.appUserId,
			}
			let res = await PaymentRepository.requestPayment(dataType, cookies?.account?.token)
			if (res?.code === 0) {
				goDetails(encrypt(order?.orderId))
			}
		}
	}
	// 保存支付宝支付的最新数据
	const getAliPay = async (pWay) => {
		const { current } = selectedRowsRef
		if (current === 0) {
			setShowError(true)
			return
		}
		// 改为list
		const detailList = current?.map(item => {
			const { id, price, type } = item
			return {
				additionId: id, // 附加费数据id
				type,
				price: Number(price),
			}
		})

		const productPrice = Number(toFixed(getProductsTotal(current), 2))
		// 附加费用订单, 补差价订单参数
		const dataQuery = {
			detailList,
			mainOrderId: order?.orderId,
			paymentWay: pWay,
			productPrice,
			price: productPrice + Number(calculatedTax(pWay, productPrice)), // 总价=所有附加费的和+税费
			vatPrice: calculatedTax(pWay, productPrice),
		}

		const resAttach = await OrderRepository.createSubmitAttach(dataQuery, cookies?.account?.token);
		handleAttachOrder(resAttach?.data)
		const dataType = {
			payType: pWay,
			orderId: resAttach?.data, // 附加费用生成的订单
			vatPrice: calculatedTax(pWay, productPrice),
			userId: order?.appUserId,
			isEmailFlag: 1, //  flag ? 1 : null
		}
		setAliInfo(dataType)
	}

	const changeMethod = type => {
		setPaymentWay(type)

		if (type === PAYMENT_TYPE.Alipay) {
			getAliPay(PAYMENT_TYPE.Alipay)
		}
	}

	// 支付按钮
	const getPaypalBtn = () => {
		if (showError) return
		return <div className='ml20'

		>
			{/* 支付方式不为PayPal时 paypal-buttons AlipayBtn */}
			{paymentWay != PAYMENT_TYPE.PayPal && paymentWay != PAYMENT_TYPE.Alipay && <Button
				type="submit" ghost='true'
				className='login-page-login-btn custom-antd-primary pub-font13 w150'
				onClick={handleOrderPay}
				style={{ borderRadius: '4px' }}
			>
				{iSubmitPayment}
			</Button>
			}
			{/* paypal支付 */}
			{paymentWay == PAYMENT_TYPE.PayPal &&
				<div className='w150'>
					<PayPalBtn
						createOrder={createOrder}
						onApprove={onApprove}
						goPaymentSuc={goPaymentSuc}
					/>
				</div>
			}
			{/* 支付宝支付 */}
			{paymentWay == PAYMENT_TYPE.Alipay &&
				<AlipayBtn
					btnClassName='w150 mr0 ml0'
					// ref={aliPayRef}
					orderInfo={aliInfo}
					token={cookies?.account?.token}
					jumpUrl={`${SURCHARGE_DETAILS}/${encrypt(order?.orderId)}`}
				/>
				// <AlipayBtn
				//           orderInfo={{
				//               payType: paymentWay,
				//               orderId: order.orderId,
				//           }}
				//           token={cookies?.account?.token || token}
				//           btnName={i18Translate('i18MyCart.Payment', "Payment")}
				//           onCallBack={v => setPaypalPayStatus(v)}
				//           isJumpToDetails={true}
				//       /> 
			}
		</div>
	}
	// 点击表格行
	const handleRowClick = (record) => {
		if (record?.status === 3) return
		// 勾选的key列表
		const newSelectedRowKeys = [...selectedRowKeys];
		if (newSelectedRowKeys.includes(record.id)) {
			newSelectedRowKeys.splice(newSelectedRowKeys.indexOf(record.id), 1);
		} else {
			newSelectedRowKeys.push(record.id);
		}
		setSelectedRowKeys(newSelectedRowKeys);

		// 勾选的列表数据
		const index = selectedRows.findIndex(row => row.id === record.id);
		let newSelectedRows = [...selectedRows];
		if (index > -1) {
			// 如果已经选中，则取消勾选
			newSelectedRows.splice(index, 1);
		} else {
			// 如果未选中，则勾选
			newSelectedRows.push(record);
		}
		updateSelData(newSelectedRows)

	};


	return (
		<div className='custom-antd-btn-more'>
			{bankCopyBtn()}
			{
				isShowModal && <MinModalTip
					isShowTipModal={isShowModal}
					width={700}
					tipTitle={iPaymentSurcharge}
					isChildrenTip={true}
					className="custom-antd-btn-more"
					// submitText={i18Translate('i18FunBtnText.AddToCart', "Add to Cart")}
					onCancel={() => setIsShowModal(false)}
					handleOk={() => handleOk()}
					showHandleOk={false}
					footerOk={getPaypalBtn()}
				>
					<div className="modal-matched-part custom-antd-btn-more">
						<Table
							size="small"
							columns={columns}
							rowSelection={{
								...rowSelection,
							}}
							dataSource={order?.additionList}
							rowKey={record => record?.id}
							pagination={false}
							rowClassName='pub-cursor-pointer'
							className="pub-border-table mt15"
							scroll={
								order?.additionList?.length > 4 ?
									{
										y: 400,
									} : {}
							}
							onRow={(record, rowIndex) => ({
								onClick: () => {
									handleRowClick(record, rowIndex);
								},
							})}
						// style={{maxHeight: '400px', overflowY: 'scroll'}}
						/>
						<div className='pub-error-tip' style={{ height: '20px' }}>{showError && <AlarmPrompt text={iSelectPaymentTip} />}</div>
						{/* <div className="">
							<PaymentMethodsSelect changeMethod={changeMethod} />
							
						</div> */}
						<div className="pub-left-title mt5 mb11">{i18Translate('i18AboutOrder2.Payment Options', 'Payment Options')}</div>
						<PayWaySelect changeMethod={changeMethod} />

						{/* <div className='mt20'
                            style={{ display: 'flex', justifyContent: 'end',
                            position: 'relative', height: '32px', overflow: "hidden", height: '52px' }}
                        >
              
                            {paymentWay != PAYMENT_TYPE.PayPal && <Button
                                    type="submit" ghost='true'
                                    className='login-page-login-btn ps-add-cart-footer-btn custom-antd-primary pub-font13 w150'
                                    onClick={handleOrderPay}
                                    style={{borderRadius: '4px'}}
                                >
                           
                                </Button>
                            }

                        </div> */}
					</div>
				</MinModalTip>
			}
		</div>
	)
}

export default AttachOrderProductCom