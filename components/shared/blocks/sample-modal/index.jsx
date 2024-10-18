import React, { useState, useEffect, useContext } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import { setPageLoading } from '~/store/setting/action';
import { Form, Select, Button, Modal, Row, Col, Checkbox } from 'antd'; // Input,

import { CustomInput } from '~/components/common';
import ProductRepository from '~/repositories/zqx/ProductRepository';
import AccountRepository from '~/repositories/zqx/AccountRepository';
import ModuleLogin from '~/components/ecomerce/modules/ModuleLogin';
import ShippingMethodSelect from '~/components/ecomerce/formCom/ShippingMethodSelect';
import AddressForm from '~/components/ecomerce/formCom/AddressForm';
import BuySelectAddress from '~/components/ecomerce/orderCom/BuySelectAddress';
import { AccountDelivery } from '~/components/ecomerce/orderCom';
import MinModalTip from '~/components/ecomerce/minCom/MinModalTip';


import useClickLimit from '~/hooks/useClickLimit';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
import { ProductsDetailContext } from '~/utilities/shopCartContext';

import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'

// 样品申请数量
const QUANTITYLIST = [
	{ value: 1, label: 1 },
	{ value: 2, label: 2 },
	{ value: 3, label: 3 },
	{ value: 4, label: 4 },
	{ value: 5, label: 5 },
]

const addCartPreview = (props) => {
	const { i18Translate, getDomainsData } = useLanguage();
	const { iCustomerReference } = useI18();
	const iOK = i18Translate('i18FunBtnText.OK', "OK")
	const iSampleRequest = i18Translate('i18AboutProduct.Sample Request', "Sample Request")
	const iPartNumber = i18Translate('i18PubliceTable.PartNumber', "Part Number")
	const iManufacturer = i18Translate('i18PubliceTable.Manufacturer', "Manufacturer")
	const iQuantity = i18Translate('i18PubliceTable.Quantity', "Quantity")
	const iRequired = i18Translate('i18Form.Required', 'Required')
	const iSampleRequestRequirements = i18Translate('i18AboutProduct.Sample Request Requirements', 'Sample Request Requirements')
	const textOne = "Origin Data is only open to terminal manufacturers, solution companies, and other R&D engineers to apply for samples."
	const textTwo = "After your sample order is approved by Origin Data, it will be sent out within 2 working days."
	const textThree = "Origin Data only accepts delivery through the customer's courier account."
	const iSampleRequire1 = i18Translate('i18AboutProduct.SampleRequire1', textOne)
	const iSampleRequire2 = i18Translate('i18AboutProduct.SampleRequire2', textTwo)
	const iSampleRequire3 = i18Translate('i18AboutProduct.SampleRequire3', textThree)
	const iSampleInfoTip = i18Translate('i18AboutProduct.SampleInfoTip', 'Please complete the shipping information to apply for samples')
	const iShippingMethod = i18Translate('i18ResourcePages.Shipping Method', 'Shipping Method')
	const iCourierAccount = i18Translate('i18AboutOrder2.Courier Account', "Courier Account")
	const iAddrBook = i18Translate('i18MyAccount.Add address Book', "Add the address to address book")

	const { paramMap } = useContext(ProductsDetailContext);
	// console.log(paramMap.sampleAmount, 'paramMap--1222--del')
	let {
		cancelFn,
		productDetailData,
		isSampleView,
		auth,
		curCustomerReference,
		quantityLimitIndex, // 可购买数量下标
	} = props

	const [limitDisabled, , handleLimitDisabled] = useClickLimit();
	const dispatch = useDispatch();
	const { isAccountLog } = auth
	const [cookies] = useCookies(['email', '']);
	const { email } = cookies;
	const [loginVisible, setLoginVisible] = useState(false);
	const [isContactUs, setIsContactUs] = useState(false);
	const [isSampleRequest, setIsSampleRequest] = useState(false);
	const { id, name, manufacturer } = productDetailData
	const [partNum, setPartNum] = useState(name ?? '')
	const [curManufacturer, setCurManufacturer] = useState(manufacturer?.name ?? '')
	const [remark, setRemark] = useState(curCustomerReference ?? '')
	const [quantity, setQuantity] = useState(1)

	const [form] = Form.useForm();
	const [formAddress] = Form.useForm();
	const [shippingMethodId, setShippingMethodId] = useState(null) // 运费id
	const [shippingAccount, setShippingAccount] = useState('')
	const [accountShippingAddress, setAccountShippingAddress] = useState([]); // 账号的邮寄地址
	const [selectShippingAddress, setSelectShippingAddress] = useState({}) // 选择的邮寄地址信息
	const [accountDeliveryList, setAccountDeliveryList] = useState([]); // 账号的运输方式列表
	const [deliveryInfo, setDeliveryInfo] = useState({})
	const [addrBook, setAddrBook] = useState(true)
	const [token, setToken] = useState(auth?.token)

	useEffect(() => {
		setRemark(curCustomerReference)
	}, [curCustomerReference])

	useEffect(() => {
		form.setFieldsValue({
			partNum: productDetailData?.name ?? '',
			manufacturer: productDetailData?.manufacturer?.name ?? '',
			email: '',
			company: '',
			firstName: '',
			lastName: '',
			addressLine1: '',
			phone: '',
			fax: '',
			payment: '',
			delivery: '',
			message: ''
		});
	}, []);

	// 获取联系地址
	const getAddress = async (_token) => {
		const res = await AccountRepository.getAddresses(_token || token, getDomainsData()?.defaultLocale);
		if (res?.code === 0) {
			const addr = res?.data || []

			const findAddr = find(addr, ar => ar.isDefault === 1)
			setAccountShippingAddress(addr)
			isEmpty(selectShippingAddress) && setSelectShippingAddress(findAddr || addr?.[0])
		}
		setIsContactUs(true)
	}

	// 获取账号的运输方式信息
	const getAccountDeliveryList = async (token) => {
		const res = await AccountRepository.getDeliveryList(token);
		if (res?.code === 0) {
			const deliData = res?.data || []
			const defaultDt = find(deliData, da => da.isDefault === 1)
			setAccountDeliveryList(deliData)
			isEmpty(deliveryInfo) && setDeliveryInfo(defaultDt || deliData?.[0])
		}
	}

	// 取消
	const handleCancel = () => {
		if (cancelFn) {
			cancelFn();
		}
	}

	// 提交样品申请数量 - 登录才能提交样品订单
	const handleSubmit = async () => {
		if (!isAccountLog) {
			setLoginVisible(true)
			// handleCancel()
			return
		}

		if (auth?.token) {
			getAddress(auth?.token)
			getAccountDeliveryList(auth?.token)
		}
	}

	// 登录成功回调
	const onLoginSuc = (token) => {
		setToken(token)
		getAddress(token)
		getAccountDeliveryList(token)
		setLoginVisible(false) // 取消登录弹框
		setIsSampleRequest(false)
		// handleCancel()
		dispatch(setPageLoading(false));
	}

	// 保存样品申请数据
	const handleAddressSubmit = async (values) => {
		if (limitDisabled) return // 限制多次点击
		const params = {
			email,
			productId: id,
			partNum,
			manufacturer: curManufacturer,
			remark,
			quantity,
			companyName: values?.companyName,
			phone: values?.phone,
			firstName: values?.firstName,
			lastName: values?.lastName,
			addressOne: values?.addressLine1,
			addressTwo: values?.addressLine2,
			addressId: values?.addressId,
			city: values?.city,
			postalCode: values?.postalCode,
			shippingWay: values?.shippingWay,
			shippingMethodId: values?.shippingMethodId || shippingMethodId,
			shippingAccount: values?.shippingAccount,
			languageType: getDomainsData()?.defaultLocale,
		}

		handleLimitDisabled(true)
		const res = await ProductRepository.freeProductAdd(params)
		handleLimitDisabled(false)
		if (res?.data?.code === 0) {
			setIsContactUs(false)
			setIsSampleRequest(true)
		}

		// 沒有地址才添加
		if (addrBook && accountShippingAddress?.length === 0) {
			saveAddressBook(values)
		}
	}

	// 保存一份到地址
	const saveAddressBook = (fieldsValues) => {
		const params = {
			...fieldsValues,
			isDefault: 0,
			asBillingAddress: 0,
			customerType: fieldsValues?.companyName ? 1 : 0,
			orderType: fieldsValues?.companyName ? 1 : 0,
			email: email,
			province: fieldsValues?.province || '-', // '需要改为非必填'
			type: '',
		};

		AccountRepository.saveOrUpdateAddress(params, token);
	}

	// 已有地址提交
	const handleSelectAddressFinish = () => {
		formAddress.validateFields().then((val) => {
			if (!isEmpty(selectShippingAddress)) {
				let dt = { ...val, ...selectShippingAddress }
				if (accountDeliveryList?.length > 0) {
					dt = {
						...dt,
						shippingWay: deliveryInfo?.id,
						shippingMethodId: deliveryInfo?.shippingType,
						shippingAccount: deliveryInfo?.account,
					}
				}
				handleAddressSubmit(dt)
			}
		})
	}

	return (
		<div className='custom-antd-btn-more'>
			{
				isSampleView && (
					<Modal
						centered
						title={iSampleRequest}
						width={720}
						onCancel={(e) => handleCancel(e)}
						open={isSampleView}
						footer={null}
						closeIcon={<i className="icon icon-cross2"></i>}
					>
						<div className="custom-antd-btn-more">
							<Form
								form={form}
								layout="vertical"
								className="pub-custom-input-box"
								onFinish={handleSubmit}
							>
								<div className="ps-section__content pub-flex-wrap">
									<div className='w300 mr30'>
										<Form.Item
											name="partNum"
											className='mb20 pub-cursor-not-allowed'
										>
											<>
												<CustomInput
													className="form-control pub-disabled-input"
													type="text"
													value={partNum}
													onChange={e => setPartNum(e.target.value)}
												/>
												<div className='pub-custom-input-holder'>{iPartNumber}</div>
											</>
										</Form.Item>
										<Form.Item
											name="manufacturer"
											className='mb20 pub-cursor-not-allowed'
										>
											<>
												<CustomInput
													className="form-control pub-disabled-input"
													type="text"
													value={curManufacturer}
													onChange={e => setCurManufacturer(e.target.value)}
												/>
												<div className='pub-custom-input-holder'>{iManufacturer}</div>
											</>
										</Form.Item>
										<Form.Item
											name="reference"
											className='mb20'
										>
											<div>
												<CustomInput
													className="form-control "
													type="text"
													value={remark}
													onChange={e => setRemark(e.target.value)}
												/>
												<div className='pub-custom-input-holder'>{iCustomerReference}</div>
											</div>
										</Form.Item>
										<Form.Item
											name="quantity"
											rules={[
												{
													required: true,
													message: iRequired,
												},
											]}>
											<div>
												<Select
													className={'w300 ' + (quantity ? 'select-have-val' : '')}
													onChange={(e) => setQuantity(e)}
													value={quantity}
													options={QUANTITYLIST.slice(0, quantityLimitIndex)}
													getPopupContainer={(trigger) => trigger.parentNode}
												>
												</Select>
												<div className='pub-custom-input-holder pub-input-required'>{iQuantity}</div>
											</div>
										</Form.Item>
									</div>
									<div className='w300 ml20 pub-font13'>
										<div className='mb15 pub-font14 pub-color555 pub-fontw'>{iSampleRequestRequirements}:</div>
										<div className='pub-color555 pub-lh16'>
											<div className='pub-flex pub-before-point pub--before-point-mt5'>
												<div className='mb10'>{iSampleRequire1}</div>
											</div>
											<div className='pub-flex pub-before-point pub--before-point-mt5'>
												<div className='mb10'>{iSampleRequire2}</div>
											</div>
											<div className='pub-flex pub-before-point pub--before-point-mt5'>
												<div className='mb10'>{iSampleRequire3}</div>
											</div>
										</div>
									</div>
								</div>
								<div className='ps-add-cart-footer'>
									<Button
										type="primary" ghost='true'
										className='login-page-login-btn ps-add-cart-footer-btn w150'
										onClick={handleCancel}
									>{i18Translate('i18FunBtnText.Cancel', 'Cancel')}</Button>
									<Button
										type="submit" ghost='true'
										className='login-page-login-btn ps-add-cart-footer-btn custom-antd-primary w150'
										onClick={handleSubmit}
									>
										{i18Translate('i18Form.Submit', 'Submit')}
									</Button>
								</div>
							</Form>

						</div>
					</Modal>
				)
			}

			<ModuleLogin
				visible={loginVisible}
				onCancel={() => setLoginVisible(false)}
				onLogin={onLoginSuc}
			/>

			{/* 联系信息 收货地址*/}
			{(accountShippingAddress?.length > 0) && isContactUs &&
				<MinModalTip
					className="custom-antd-btn-more"
					tipTitle={iSampleRequest}
					isShowTipModal={isContactUs}
					centered
					width={1000}
					onCancel={() => {
						setIsContactUs(false)
						setShippingMethodId(null)
						setShippingAccount('')
						setSelectShippingAddress({})
						formAddress.resetFields();
					}}
					handleOk={handleSelectAddressFinish}
					footer={null}
					isChildrenTip={true}
					submitText={i18Translate('i18Form.Submit', 'Submit')}
				>
					<>
						<div className="custom-antd-btn-more">
							<div className='pub-left-title pub-color555 pub-font14 pub-fontw mb15'>{i18Translate('i18OrderAddress.Shipping Address', 'Shipping Address')}</div>
							<BuySelectAddress
								addressList={accountShippingAddress}
								selectAddress={selectShippingAddress}
								countryList={[]}
								orderTypeList={[]}
								type="shipping"
								shippingCallback={val => { setSelectShippingAddress(val) }}
								onSubmit={getAddress}
							/>
						</div>
						<Form form={formAddress}>
							<div className="pub-custom-input-suffix custom-antd-btn-more">
								<div className='pub-font14 pub-fontw pub-color555 mb10 mt-5'>{iShippingMethod}</div>
								{accountDeliveryList?.length > 0 ?
									<AccountDelivery
										accountDeliveryList={accountDeliveryList}
										wayId={deliveryInfo?.id || ''}
										isShowIncoterms={false}
										style={{ padding: 0 }}
										onCreateFinished={() => { getAccountDeliveryList() }}
										onSelectShippingAccount={(value) => { setDeliveryInfo(value) }}
									/>
									: <Row gutter={20}>
										<Col>
											<ShippingMethodSelect
												shippingMethodId={shippingMethodId}
												shippingMethodChange={id => (setShippingMethodId(id))} />
										</Col>
										{
											shippingMethodId && (
												<Col>
													<Form.Item
														name="shippingAccount"
														rules={[{ required: true, message: iRequired }]}
													>
														<CustomInput
															className="form-control w260"
															type="text"
															onChange={(e) => (setShippingAccount(e.target.value))}
															value={shippingAccount}
															suffix={<div className='pub-custom-holder pub-input-required'>{iCourierAccount}</div>}
														/>
													</Form.Item>
												</Col>
											)
										}
									</Row>
								}
							</div>
						</Form>
					</>
				</MinModalTip>
			}
			{(accountShippingAddress?.length === 0) && isContactUs &&
				<Modal
					title={iSampleRequest}
					open={isContactUs}
					centered
					width={600}
					onCancel={() => setIsContactUs(false)}
					footer={null}
				>
					<div className='mb15 pub-color555'>{iSampleInfoTip}.</div>
					<AddressForm
						onFinish={(value) => {
							handleAddressSubmit(value)
							setShippingMethodId(null)
							setShippingAccount('')
						}}
						onCancle={() => { setIsContactUs(false) }}
						isShowOrderType={false}
					>
						<Checkbox checked={addrBook} onChange={(event) => { setAddrBook(event.target.checked) }} style={{ marginRight: '10px', marginBottom: '10px' }}>
							<span className="pub-color555">{iAddrBook}</span>
						</Checkbox>
						<div className='pub-font14 pub-fontw pub-color555 mb10 mt-5'>{iShippingMethod}</div>
						<Row gutter={20}>
							<Col>
								<ShippingMethodSelect
									shippingMethodId={shippingMethodId}
									shippingMethodChange={id => (setShippingMethodId(id))} />
							</Col>
							{
								shippingMethodId && (
									<Col>
										<Form.Item
											name="shippingAccount"
											rules={[{ required: true, message: iRequired }]}
										>
											<CustomInput
												className="form-control w260"
												type="text"
												onChange={(e) => (setShippingAccount(e.target.value))}
												value={shippingAccount}
												suffix={<div className='pub-custom-holder pub-input-required'>{iCourierAccount}</div>}
											/>
										</Form.Item>
									</Col>
								)
							}
						</Row>
					</AddressForm>
				</Modal>
			}

			<Modal
				title={iSampleRequest}
				open={isSampleRequest}
				centered
				width={565}
				onCancel={() => setIsSampleRequest(false)}
				footer={null}
				className='custom-antd-btn-more'
				closeIcon={<i className="icon icon-cross2"></i>}
			>
				<>
					<div className='pub-flex'>
						<div className='sprite-icon4-cart sprite-icon4-cart-1-14'></div>
						<div className='ml10'>
							<div className='mt-2 pub-success pub-font18 pub-fontw'>
								{i18Translate('i18AboutProduct.sampleTip1', 'We have received your sample request!')}</div>
							<div className='pub-lh18 pub-font13 pub-color18'>
								{i18Translate('i18AboutProduct.sampleTip2', 'Our sales representative will review the sample order within 2-3 business days. Please check your email for updates on the status of your application. Thank you.')}</div>
						</div>
					</div>
					<div className='ps-add-cart-footer'>
						<Button
							type="submit" ghost='true'
							className='login-page-login-btn ps-add-cart-footer-btn w150'
							onClick={() => setIsSampleRequest(false)}
						>
							{iOK}
						</Button>
					</div>
				</>
			</Modal>
		</div>
	);
};

export default connect(state => state)(addCartPreview);
