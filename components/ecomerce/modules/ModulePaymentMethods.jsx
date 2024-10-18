import React, { useContext, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Radio, Form, Input, Table } from 'antd';
import { CustomInput } from '~/components/common';
import { useCookies } from 'react-cookie';

import AccountRepository from '~/repositories/zqx/AccountRepository';
import VatNumberEdit from '~/components/partials/account/modules/VatNumberEdit';
import { PayWaySelect } from '~/components/ecomerce'

import useClickLimit from '~/hooks/useClickLimit';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
import useOrder from '~/hooks/useOrder';

import ShopCartContext from '~/utilities/shopCartContext';
import { PAYMENT_TYPE, TABLE_COLUMN } from '~/utilities/constant'
import { toFixedFun } from '~/utilities/ecomerce-helpers';
import { scrollToTop } from '~/utilities/common-helpers';
import { getCurrencyInfo } from '~/repositories/Utils';


const ModulePaymentMethods = (props) => {
	const { i18Translate } = useLanguage();
	const { iContinue } = useI18()
	const { payWayList, getPayWayList } = useOrder()

	const iVATNumber = i18Translate('i18AboutOrder2.VAT Number', 'VAT Number')
	const iAddVATNumber = i18Translate('i18AboutOrder2.Add VAT Number', 'Add VAT Number')
	const iPurchaseOrderNumber = i18Translate('i18AboutOrder2.Purchase Order Number', 'Purchase Order Number')
	const currencyInfo = getCurrencyInfo();
	const { TextArea } = Input;
	const [form] = Form.useForm();
	let {
		order,
		profile,
		paymentMethodsChange,
		summitOrder,
		ecomerce,
		auth,
		refInstance,
	} = props;

	const { isAccountLog } = auth
	const [limitDisabled, handleLimitDisabled] = useClickLimit();
	const [cookiesData] = useCookies(['paymentOrderId']);
	const { shoppingCartPayment } = ecomerce

	const { credit = 0 } = profile;
	const { paymentInfo, saveCardInfo, updatePaymentInfo } = useContext(ShopCartContext)

	const [payType, setPayType] = useState('');

	const [visible, setVisible] = useState(false);
	const [vatList, setVatList] = useState([]);
	const [curVatId, setCurVatId] = useState(paymentInfo?.curVatId || '');

	const [showError, setShowError] = useState(false);

	const amount = parseFloat(order?.productPrice ?? 0);
	const totalAmount = amount + parseFloat(order?.shippingPrice) - parseFloat(order?.couponPrice ? order?.couponPrice : 0)
	const isCanCredit = credit > parseFloat(totalAmount);

	React.useImperativeHandle(refInstance, () => ({
		onSubmit: () => {
			handleSubmit(form.getFieldsValue())
		}
	}))

	// function handleChangeMethod(e) {
	//     setPayType(e.target.value);
	//     paymentMethodsChange(e.target.value)
	// }
	const changeMethod = (val) => {
		setPayType(val);
		paymentMethodsChange(val)
		setShowError(false)
	}
	async function handleSubmit(fieldsValue) {
		if (limitDisabled) return  // 限制多次点击
		if (!payType) {
			setShowError(true)
			scrollToTop()
			return
		}
		payType === PAYMENT_TYPE.LianLian ? saveCardInfo({ ...fieldsValue }) : saveCardInfo({});
		summitOrder(payType);
		// 登录且没有vat
		if (isAccountLog && vatList?.length === 0 && paymentInfo?.vatNumber) {
			handleLimitDisabled(true)
			const params = {
				vatNumber: paymentInfo?.vatNumber,
				isDefault: 1,
				remark: '',
			}
			const res = await AccountRepository.addVatNumber(params, cookiesData?.account?.token);
			if (res?.code === 0) {
				getList()
			}
		}
	}

	const getList = async () => {
		const res = await AccountRepository.getVatNumberList(cookiesData?.account?.token);
		if (res?.code === 0) {

			// let curItem = res?.data?.[0]
			// res?.data.map(i => {
			//     if (i.isDefault === 1) {
			//         curItem = i
			//     }
			// })

			setVatList(res?.data)
			handleLimitDisabled(false)
			// 非必填
			// if(isAccountLog) {
			//     onVatChange(curItem)
			// }
		}
	}


	useEffect(() => {
		setPayType(shoppingCartPayment.paymentWay)
	}, [shoppingCartPayment])
	useEffect(() => {
		if (cookiesData?.account?.token) {
			getList()
		}
	}, [cookiesData])
	useEffect(() => {
		getPayWayList()
	}, [])

	const iRemark = i18Translate('i18Form.Remark', TABLE_COLUMN.remark)
	const columns = [
		{
			title: <span className='ml6'>{iVATNumber}</span>,
			dataIndex: 'vatNumber',
			width: 350,
			render: (text, row) => {
				return (
					<div className='pub-flex-align-center'>
						<Radio
							className='ml6'
							checked={row.id == curVatId}
						// onChange={() => { onDeliveryChange(row) }}
						></Radio>
						<div style={{ maxWidth: '300px', whiteSpace: 'normal' }}>{text}</div>
					</div>
				)
			},
		},
		{
			title: iRemark,
			dataIndex: 'remark',
			width: 500,
			// ellipsis: true, // 设置文字溢出时省略 white-space: normal !important; /* 强制换行 */
			render: (text) => <div style={{ maxWidth: '480px', whiteSpace: 'normal' }}>{text}</div>,
		},
	];
	// 点击表格行
	const onVatChange = (record) => {
		if (record?.id === curVatId) {
			setCurVatId('')
			updatePaymentInfo({ ...paymentInfo, vatNumber: '', curVatId: '' })
		} else {
			setCurVatId(record?.id)
			updatePaymentInfo({ ...paymentInfo, vatNumber: record?.vatNumber, curVatId: record?.id })
		}

	}
	const handleAddVatNumber = () => {
		setVisible(true)
	}
	const vathandleSubmit = () => {
		setVisible(false)
		getList();
	}

	// 下单选择支付方式
	const iPaymentOptions = i18Translate('i18AboutOrder2.Payment Options', 'Payment Options')
	const iSelectPaymentTip = i18Translate('i18AboutOrder2.SelectPaymentTip', 'Please select a payment method')


	return (
		<Form labelCol={{ span: 10 }} onFinish={handleSubmit} form={form} name="paymentForm">
			<div className='pub-border pub-bgc-white box-shadow'>
				<div className='pub-left-title ml20 mt15 mb11'>{iPaymentOptions}</div>
				<div className="ps-block--payment-method pb-20 mt5">

					<div className="ps-block__header">
						<div className='ml20 mr20'>
							<PayWaySelect changeMethod={changeMethod} proPayType={payType} isDefault={false} />
						</div>
						{/* <Radio.Group
                            className='pay-radio'
                            onChange={(e) => handleChangeMethod(e)}
                            value={payType}
                        >
                            {currencyInfo.value==='USD'?<>
                             <Radio className='pl-15 percentW100' value={PAYMENT_TYPE.PayPal11}>
                                <div className='pay-methods pub-flex-align-center pub-fontw'>
                                    <span className='mt2 pub-lh20'>{iPayPal}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                    <span className='paypal-icon'></span>
                                </div>
                             </Radio>

                             {
                                credit > 0 && <Radio disabled={!isCanCredit} value={3}>Net 30 （For pre-approved customers only）
                                    {payType == 3 && isCanCredit && <div className='ps-pre-apptoved'>
                                        <p><strong>Remaining credit limit：</strong>{currencyInfo.label}{toFixedFun(credit, 2)}</p>
                                    </div>}
                                </Radio>
                             }
														 </>:
														 <Radio className='pl-15 percentW100' value={PAYMENT_TYPE.Alipay}>
                                <div className='pay-methods pub-flex-align-center pub-fontw'>
                                    <div className='pay-methods' style={{height: '16px'}}>{iAlipay}&nbsp;&nbsp;&nbsp;&nbsp;</div>
																		<span className='alipay-icon'></span>
                                </div>
                             </Radio>
													 }
													 
													 <Radio className='paypal pl-15 percentW100' value={PAYMENT_TYPE.WireTransfer}>
                              <div className='pay-methods pub-flex-align-center pub-fontw'>
                                  <div className='pay-methods' style={{height: '16px'}}>{iWireTransferProforma}</div>
                              </div>
                            </Radio>
                        </Radio.Group> */}
						{showError && <div className='pub-error-tip ml22 mt10'>{iSelectPaymentTip}</div>}

					</div>

				</div>
			</div>

			<div className='pub-border15 mt20 pub-bgc-white box-shadow'>
				{/* 增加新的增值税编号 */}
				<div className='form-input'>
					<div className='pub-left-title mb13'>{iVATNumber}</div>

					{/* 账号保存的vat */}
					{
						vatList?.length > 0 && <>
							<Table
								size='small'
								pagination={false}
								columns={columns}
								rowKey={record => record.id}
								dataSource={vatList}
								className='pub-border-table maxW640'
								rowClassName="pub-cursor-pointer"
								onRow={(record) => {
									return {
										onClick: (e) => { onVatChange(record) }, // 点击行
									};
								}}
							/>
							<div
								className='mt10 pub-color-link w120'
								onClick={(e) => handleAddVatNumber(e)}
							>{iAddVATNumber}</div>
						</>
					}

					{
						vatList?.length === 0 && <CustomInput
							onChange={(e) => updatePaymentInfo({ ...paymentInfo, vatNumber: e.target.value })}
							value={paymentInfo?.vatNumber}
							className="w240 pub-border form-control"
							controls={false}
							step={1}
						/>
					}



				</div>
			</div>
			<div className='pub-border15 mt20 pub-bgc-white form-input box-shadow'>
				{/* 客户订单号码；购货合同号 */}
				<div className='pub-left-title mb15'>{iPurchaseOrderNumber}</div>
				<CustomInput
					onChange={(e) => updatePaymentInfo({ ...paymentInfo, orderNumber: e.target.value })}
					value={paymentInfo?.orderNumber}
					className="w240 pub-border form-control"
					controls={false}
					step={1}
				/>
			</div>
			<div className='pub-border15 mt20 pub-bgc-white box-shadow'>
				<div className='pub-left-title mb15'>{iRemark}</div>
				<TextArea
					className='form-control'
					rows="1"
					// 服务限制了1500
					maxLength={1400}
					autoSize={true}
					value={paymentInfo?.remark}
					onChange={(e) => updatePaymentInfo({ ...paymentInfo, remark: e.target.value })}
				/>
			</div>

			<div className="form-group">
				<button
					type="submit" ghost='true'
					className='login-page-login-btn ps-add-cart-footer-btn custom-antd-primary pub-font13 w160 mt30'
				>
					{iContinue}
				</button>
			</div>

			{
				visible && (
					<VatNumberEdit
						visible={visible}
						handleCancel={() => setVisible(false)}
						handleSubmit={() => vathandleSubmit()}
						otherParams={{
							// type: currentShippingAddress ? 'shipping' : 'billing',
							// currentRecord,
							list: vatList,
						}}
					/>
				)
			}
		</Form>


	);
};

const ModulePaymentMethodsComponent = connect(state => state)(ModulePaymentMethods)

export default React.forwardRef((props, ref) => <ModulePaymentMethodsComponent {...props} refInstance={ref} />);
