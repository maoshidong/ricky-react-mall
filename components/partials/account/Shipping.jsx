import React, { useState, useEffect, useContext } from 'react';
import dayjs from 'dayjs';
import { connect, useDispatch } from 'react-redux';
import Router from 'next/router';
import { withCookies } from 'react-cookie';
import { setShoppingCartShipping } from '~/store/ecomerce/action';
import { Form, Radio, Tooltip, DatePicker, Checkbox, Table, Space, Select } from 'antd'; //  Input,
import { CustomInput, Flex } from '~/components/common';
import OrderRepository from '~/repositories/zqx/OrderRepository';
import AccountRepository from '~/repositories/zqx/AccountRepository';
import FreighAccountsEdit from '~/components/partials/account/modules/FreighAccountsEdit'
import { calculateTotalAmount, toFixed } from '~/utilities/ecomerce-helpers';
import ShopCartContext from '~/utilities/shopCartContext'
import { getExpiresTime, scrollToTop } from '~/utilities/common-helpers';
import { PAYMENT_TYPE, TABLE_COLUMN } from '~/utilities/constant'
import { ACCOUNT_SHOPPING_CART } from '~/utilities/sites-url'
import { Notice, AlarmPrompt } from '~/components/common'
import useLocalStorage from '~/hooks/useLocalStorage'
import useLanguage from '~/hooks/useLanguage';
import useCart from '~/hooks/useCart';
import { getCurrencyInfo } from '~/repositories/Utils';
import useI18 from '~/hooks/useI18';
import useApi from '~/hooks/useApi';
import isEmpty from 'lodash/isEmpty'

const ShippingMethodWidth = 300
const AccountWidth = 200

// shopping-cart-shipping
const Shipping = ({
	products, shippingInfo, editAddress, token, updateShippingPrice,
	shippingPrice, voucheour = {}, cookies, ecomerce, auth, refInstance
}) => {
	const { i18Translate, i18MapTranslate, curLanguageCodeZh } = useLanguage();
	const iContinue = i18Translate('i18SmallText.Continue', 'Continue')
	const iShipimmediately = i18Translate('i18AboutOrder2.Ship immediately', 'Ship immediately')
	const iMergeTogetherTip = i18Translate('i18AboutOrder2.MergeTogetherTip', 'Multiple order splaced through out the day can be packaged & delivered as one consignment,reducing hand lingtime.')
	const iOther = i18Translate('i18SmallText.Other', "Other")
	const iScheduledDate = i18Translate('i18AboutOrder2.Scheduled date', "Scheduled date")
	const iSelectShippingMethod = i18Translate('i18AboutOrder2.Select Shipping Method', "Select Shipping Method")
	const iShippingType = i18Translate('i18AboutOrder2.Shipping Type', "Shipping Type")
	const iAccount = i18Translate('i18AboutOrder2.Account', "Account")
	const iAddAnAccount = i18Translate('i18AboutOrder2.Add an Account', "Add an Account")
	const iRemark = i18Translate('i18Form.Remark', 'Remark')
	const iSelectShippingOptions = i18Translate('i18AboutOrder2.Select Shipping Options', 'Select Shipping Options')
	const iPleaseSelectShippingDate = i18Translate('i18AboutOrder2.Please Select Shipping Date', 'Please Select Shipping Date')
	const iSelect = i18Translate('i18PubliceTable.Select', TABLE_COLUMN.select)
	const iShippingMethod = i18Translate('i18ResourcePages.Shipping Method', 'Shipping Method')
	const iCost = i18Translate('i18ResourcePages.Cost', 'Cost')
	const iIncoterms = i18Translate('i18ResourcePages.Incoterms', 'Incoterms')
	const iEstimate = i18Translate('i18ResourcePages.Estimate', 'Estimated')
	const { iUseMyShippingAccount, iEnterCourierAccount, iDeliveryInformation, iPickUpMethod } = useI18()

	const dispatch = useDispatch();
	const [form] = Form.useForm();
	const { shoppingCartShipping } = ecomerce
	const { isAccountLog } = auth
	const { saveSummitInfo } = useContext(ShopCartContext)
	const [buySaveInfo, setBuySaveInfo] = useLocalStorage('cartBuySaveInfo', {});
	const { saveOrderStepData } = useCart();
	const [sendList, setSendList] = useState([]);
	const [sendDate, setSendDate] = useState('');
	const [sendDateType, setSendDateType] = useState(iShipimmediately);
	const [insurance] = useState(shoppingCartShipping?.insurance || 0);
	const [sendEmum, setSendEmum] = useState({});
	const [shippingRemark, setShippingRemark] = useState(shoppingCartShipping?.shippingRemark || shippingInfo?.shippingWay); // 运输账号
	const [shippingWay, setShippingWay] = useState(''); // 选中的运输方式 shippingInfo?.shippingWay shoppingCartShipping?.shippingWay - 如果存储默认值，地址国家修改时要清除默认值
	const [deliveryList, setDeliveryList] = useState([]); // 国家对应的运输方式
	const [accountDeliveryList, setAccountDeliveryList] = useState([]); // 账号的运输方式
	const [visible, setVisible] = useState(false);  // 账号的运输方式-添加弹窗
	const [shippingWayId, setShippingWayId] = useState('');  // 账号的运输方式-选中以id为准, 可能有多个运输方式相同的
	const [shippingType, setShippingType] = useState(1); // 运输类型
	const [custDeliveryList, setCustDeliveryList] = useState([]); // 管理端自定义的账号运输方式
	const [showError, setShowError] = useState(false);
	const [errText, setErrText] = useState('')
	const [showErrorSendDate, setShowErrorSendDate] = useState(false);
	const { asBillingAddress, isSaveAddress, address, selectBillingAddress } = editAddress || {};  // editAddress  存储有前面提交的地址信息
	const currencyInfo = getCurrencyInfo();
	const { customerShipment, getCustomerSelectedShipment } = useApi();
	const [shipmentType, setShipmentType] = useState(null) // 客选发货: 0 自行自提 ,1 配送指定

	const {
		// 账号地址信息
		cityId, // 更新地址的城市id, 用于获取城市对应的运输方式
		addressId, addressLine1, addressLine2, phone, email,
		city, companyName, customerType, firstName, lastName, newCity,
		orderType, postalCode, province
	} = address || {}

	// 国家id
	const countryId = addressId || shoppingCartShipping?.addressId

	const {
		billingAddressId, billingPhone, billingAddressLine1, billingAddressLine2, billingCity,
		billingState, billingCompanyName, billingFirstName, billingLastName, billingPostalCode,
	} = selectBillingAddress || {} // 账单地址

	// 邮寄地址 - 数据收集  || city
	const addressObj = {
		addressId,
		billingAddressId: asBillingAddress ? addressId : billingAddressId, // 不相同传，以区分不同国家
		addressLine1, addressLine2,
		phone,
		email,
		city: province || city, newCity: newCity || city, cityId,
		companyName,
		customerType,
		firstName, lastName: curLanguageCodeZh() ? '' : lastName,
		orderType,
		postalCode,
	}

	useEffect(() => {
		getCustomerSelectedShipment()
	}, [])

	// 返回账单地址
	const getBillingAddress = () => {
		const billingAddress = {
			email,
			addressId: billingAddressId, billingAddressId, phone: billingPhone,
			addressLine1: billingAddressLine1, addressLine2: billingAddressLine2,
			city: billingCity, newCity: billingCity, billingState, companyName: billingCompanyName,
			firstName: billingFirstName, lastName: curLanguageCodeZh() ? '' : billingLastName, postalCode: billingPostalCode,
		}

		return asBillingAddress ? addressObj : billingAddress
	}

	React.useImperativeHandle(refInstance, () => ({
		onSubmit: () => {
			handleSubmit()
		}
	}))

	// 下一步
	const handleSubmit = async () => {
		// 如果登录了,并且账号没有运输账号，这时用户手动输入，那就保存下来 account ,remark
		let flag = true
		setShowError(false)
		setShowErrorSendDate(false)

		// shippingWay 0 other - 账号保存的
		if (!shippingWay && shippingWay !== 0) {
			flag = false
			setShowError(1)
			setErrText(i18Translate('i18AboutOrder2.Select Shipping Method', 'Please Select Shipping Method'))
		}

		if (shippingType == 2 && !shippingRemark) {
			flag = false
			setShowError(1)
			setErrText(shippingWay === 0 ? iDeliveryInformation : iEnterCourierAccount)
		}

		if (shippingType == 2 && shippingWay === 0 && shipmentType === null) {
			flag = false
			setShowError(1)
			setErrText(iPickUpMethod)
		}

		if (!sendDateType) {
			flag = false
			setShowErrorSendDate(1)
		}
		if ((sendDateType == iScheduledDate && !sendDate)) {
			flag = false
			setShowErrorSendDate(2)
		}
		if (!flag) {
			scrollToTop()
			return
		}

		const orderDetails = products?.map(item => ({
			productId: item.productId,
			price: toFixed(calculateTotalAmount([item], PAYMENT_TYPE.PayPal), 4), // PayPal 支付 只取单价的两位数
			quantity: item.cartQuantity,
		}))
		const getProductsTotal = (arr) => {
			let price = 0
			arr.map(item => {
				price += (Number(item.price))
			})
			return price
		}
		const price = toFixed((getProductsTotal(orderDetails) + shippingPrice - voucheour.price || 0), 2); // 产品价格总和 + 加运输费用 - 优惠券
		const cartShipping = {
			shippingType, // 运费选项 Shipping Method or Use My Courier Account
			shippingWay, // 运费选项id id
			shippingRemark, // Use My Courier Account-Account
			sendDateType, // 发货日期类型
			sendDate: sendDateType != iScheduledDate ? '' : dayjs(sendDate).format('YYYY-MM-DD'),  // 发货日期
			insurance, // 是否选择运费险
			addressId: address?.addressId, // 运费地址国家id
		}

		cookies.set('shoppingCartShipping', {
			...cartShipping,
			sendDate: '',
		}, { path: '/', expires: getExpiresTime(30) })
		dispatch(setShoppingCartShipping(cartShipping))

		// information 提交汇总  asBillingAddress: 邮寄地址和账单地址一样 收集地址等信息
		const data = {
			orderDetails,
			addDeliveryAddress: addressObj, // 邮寄地址
			billingAddress: getBillingAddress(), // 账单地址
			country: address?.addressId,
			productPrice: toFixed(getProductsTotal(orderDetails), 2),
			price,
			shippingType,
			sendDateType: sendEmum[sendDateType],
			sendDate: sendDateType != iScheduledDate ? '' : sendDate,
			shippingWay,
			shippingRemark,
			shippingPrice: toFixed(shippingPrice, 4),
			insurance,
			asBillingAddress,
			savaAddress: isSaveAddress,   // 是否自动给用户保存一份账单地址
			// couponId  创建订单时再拿
			shipmentType, // 客选发货 自提方式
		};

		setBuySaveInfo({
			...buySaveInfo,
			shippingWayId,  // 账号的运输方式-选中以id为准
		})

		saveSummitInfo(data);

		setTimeout(() => {
			saveOrderStepData({
				shippingWay,
				sendDate: sendDateType != iScheduledDate ? sendDateType : sendDate,
				step: 4,
			})
			Router.push(`${ACCOUNT_SHOPPING_CART}?num=3`);
		}, 0)
		// 保存用户运输账号
		if (isAccountLog && accountDeliveryList?.length === 0 && shippingType == 2) {
			const params = {
				account: shippingRemark,
				remark: '',
				isDefault: 1,
				isOther: shippingWay == 0 ? 1 : 0, // shippingType == 0 代表其它
				shippingType: Number(shippingWay),
				shipmentType
			}
			await AccountRepository.addDelivery(params, token);
		}
	}

	// 日期选择
	const dateOnchange = (date, dateString) => {
		setSendDate(dateString);
	}

	// 日期禁用范围
	const disabledDate = current => {
		return current && current < dayjs().subtract(1, 'days').endOf('day')
	}

	const changeSendDateType = (e) => {
		setShowErrorSendDate(false) // 改变不提示
		setSendDateType(e.target.value);
	}

	// const changeInsuranceType = (e) => {
	// 	setInsurance(e.target.value);
	// }

	// 点击 - Use My Courier Account
	const customerChange = (e) => {
		setShippingRemark('')
		// 勾选
		if (e.target.checked) {
			setShippingType(2);
			updateShippingPrice(0);
			const findWay = custDeliveryList.find(item => {
				item.id == shippingInfo?.shippingWay;
			});
			const id = findWay && findWay.length ? findWay[0].id : custDeliveryList[0].id
			setShippingWay(id);
			setBuySaveInfo({
				...buySaveInfo,
				shippingWayId: id,
				shippingMethod: {
					[countryId]: { regionId: '', shippingType: 2, shippingWay: id, shippingWayId: id }
				}
			})
		}
		// 取消勾选
		else {
			setShippingType(1);
			const deliveryItem = deliveryList?.find(item => item?.deliveryList[0].value == shippingInfo?.shippingWay)
			updateShippingPrice(deliveryItem?.usdCost || 0);
			setShippingWay(shippingInfo?.shippingWay)
		};
	}

	// 选择国家对应的运输方式
	const onDeliveryChange = (selectedRows) => {
		setShippingRemark('')
		const regionId = selectedRows?.deliveryList[0]?.regionId
		setShippingType(1);
		setBuySaveInfo({
			...buySaveInfo,
			shippingWayId: '',
			shippingMethod: {
				[countryId]: { regionId: regionId, shippingType: 1 }
			}
		})
		setShippingWay(regionId);
		const { usdCost, rmbCost } = selectedRows?.deliveryList[0] || {}
		const num = (!selectedRows && shippingType === 2) ? 0 : (curLanguageCodeZh() ? rmbCost : usdCost) // 运输价格
		updateShippingPrice(num || 0); //  || 0 避免undefined, 报错
	}

	const getDeliveryTypeList = async () => {
		const res = await OrderRepository.getDictList('shipping_delivery_type')
		let sendEmum1 = {}
		res?.data?.map(item => {
			item.value = item.dictCode + ""
			item.label = item.dictValue;
			item.dictValue = i18MapTranslate(`i18AboutOrder2.${item.dictValue}`, item.dictValue)
			sendEmum1[item.dictValue] = item.dictCode;
		})
		setSendList(res?.data)
		setSendEmum(sendEmum1)
	}

	const getDeliveryRefList = async () => {
		// 获取国家对应的运输方式-新 英文传addressId， 中文传cityId
		let params = {
			countryId: addressId || shoppingCartShipping?.addressId
		}
		if (curLanguageCodeZh()) {
			params = {
				cityId,
			}
		}
		const res = await OrderRepository.apiGetDeliveryListByAddressId(params);
		if (res?.code === 200) {
			const arr = res?.data?.map(item => {
				const newDeliveryList = item?.deliveryList?.map(aitem => {
					const { regionId, typeName } = aitem
					return {
						...aitem,
						value: regionId,
						label: typeName,
					}
				})
				return {
					...item,
					deliveryList: newDeliveryList,
				}
			})
			setDeliveryList(arr);
		}
	}

	// 我们管理后台设置的运输方式
	const getShippingDeliveryList = async () => {
		const res = await OrderRepository.getDictList('sys_custom_shipping_delivery')
		res.data.map(item => {
			item.value = item.dictCode + ""
			item.label = item.dictValue
		})
		setCustDeliveryList(
			[
				...res.data,
				{ dictCode: 0, dictValue: 'Other', value: 0, label: iOther }
			]
		)
	}

	const curChooseAccountDelivery = item => {
		setShowError('')
		setShippingWay(item?.shippingType);
		setShippingWayId(item?.id)
		setShippingRemark(!!item?.isOther ? item?.remark : item?.account)
		setShipmentType(item?.shipmentType == 1 ? item?.shipmentType : 0)
	}

	const getAccountDeliveryList = async () => {
		const res = await AccountRepository.getDeliveryList(token);
		if (res?.code === 0) {
			setAccountDeliveryList(res?.data)
		}
	}

	useEffect(() => {
		getDeliveryTypeList();
		getShippingDeliveryList();

	}, [])

	useEffect(() => {
		// Use My Courier Account 运费0
		if (shoppingCartShipping.shippingType == 2) {
			updateShippingPrice(0)
		}
		getDeliveryRefList();


		setSendDate(shoppingCartShipping.sendDate)
		setSendDateType(shoppingCartShipping.sendDateType)
		setShippingType(shoppingCartShipping.shippingType)
	}, [shoppingCartShipping])

	useEffect(() => {
		if (!token) {
			return false;
		}
		getAccountDeliveryList()
	}, [token])

	const columns = [
		{
			title: iSelect,
			dataIndex: 'select',
			width: TABLE_COLUMN.selectWidth,
			render: (text, row) => {
				return (
					<Radio
						className='ml7'
						checked={shippingType == 1 && row?.deliveryList[0]?.regionId == shippingWay}
					>{text}</Radio>
				)
			},
		},
		{
			title: iShippingMethod,
			dataIndex: 'typeName',
			width: ShippingMethodWidth,
			render: (_text, row) => {
				return (
					<>{row?.deliveryList[0]?.typeName}</>
				)
			},
		},
		{
			title: iCost + '(1kg)',
			width: AccountWidth,
			dataIndex: 'usdCost',
			// render: (_text, record) => <a>{`${currencyInfo.label}${toFixed(record?.deliveryList?.[0]?.usdCost, 2)}`}</a>,
			render: (text, record) => {
				const cost = curLanguageCodeZh() ? record?.deliveryList?.[0]?.rmbCost : record?.deliveryList?.[0]?.usdCost
				return <a>{`${currencyInfo.label}${toFixed(cost, 2)}`}</a>
			},
		},
		{
			title: iIncoterms,
			dataIndex: 'incoterms',
			render: (_text, row) => <>{row?.deliveryList[0]?.incoterms || '-'}</>,
		},
		{
			title: iEstimate,
			dataIndex: 'estimatedTime',
			align: 'right',
			render: (_text, row) => <span style={{ marginRight: '8px' }}>{row?.deliveryList[0]?.estimatedTime || '-'}</span>
		},
	];

	const handleAddCourierAccount = () => {
		setVisible(true)
	}

	const freighHandleSubmit = () => {
		setVisible(false)
		getAccountDeliveryList();
	}

	{/* 账号的运输方式-无 */ }
	const customerRadioChange = (e) => {
		setShowError('')
		const { value } = e.target
		setShippingWay(value);
		setShippingRemark('')
		setBuySaveInfo({
			...buySaveInfo,
			shippingWayId: '',
			shippingMethod: {
				[countryId]: { regionId: '', shippingType: 2, shippingWay: value }
			}
		})
	}

	// 账号保存的
	const customerAccountRadioChange = (e) => {
		setShowError('')
		const curItem = accountDeliveryList.find(i => i?.id == e?.id) || {}
		curChooseAccountDelivery(curItem)
		setBuySaveInfo({
			...buySaveInfo,
			shippingWayId: curItem?.id,
			shippingMethod: {
				[countryId]: {
					regionId: '',
					shippingType: 2,
					shippingWay: curItem?.shippingType,
					shippingWayId: curItem?.id,
					shippingRemark: !!curItem?.isOther ? curItem?.remark : curItem?.account,
					shipmentType: curItem?.shipmentType || 1
				}
			}
		})
	}

	let shippingColumns = [
		{
			title: iSelect,
			dataIndex: 'select',
			width: TABLE_COLUMN.selectWidth,
			render: (_text, row) => {
				return (
					<div className='pub-flex-align-center'>
						<Radio
							className='ml7'
							checked={row.id == shippingWayId}
						></Radio>
					</div>
				)
			},
		},
		{
			title: iShippingType,
			dataIndex: 'shippingType',
			width: ShippingMethodWidth,
			render: (_text, row) => {
				return (
					<div className='pub-flex-align-center'>
						{custDeliveryList.find(i => i?.value == row?.shippingType)?.label || iOther} #
					</div>
				)
			},
		},
		{
			title: iAccount,
			dataIndex: 'AccountWidth',
			width: AccountWidth,
			render: (_text, row) => {
				return (
					<div className='pub-flex-align-center'>
						{row?.account}
					</div>
				)
			},
		},

		{
			title: iIncoterms,
			dataIndex: 'incoterms',
			render: () => (
				<>FOB HK</>
			),
		},
		{
			title: iRemark,
			dataIndex: 'remark',
			align: 'right',
			render: (text) => <span >{text}</span>,
		},
	]
	// .com暂时没有 iIncoterms
	if (curLanguageCodeZh()) {
		shippingColumns = shippingColumns.filter(item => item?.title !== iIncoterms)
	}

	const getCourierAccountView = () => {
		if (shippingType != 2) return null
		return (
			<div className="mt15 col-sm-12">
				{/* 账号的运输方式-无 */}
				{
					accountDeliveryList?.length === 0 &&
					<Radio.Group className="ml15" value={shippingWay} onChange={customerRadioChange} style={{ width: '100%' }}>
						<Space direction="vertical" style={{ width: '100%' }}>
							{custDeliveryList?.map((item) => {
								let comElement = <CustomInput
									value={shippingRemark}
									onChange={(e) => {
										setShippingRemark(e.target.value);
									}}
									placeholder={iEnterCourierAccount}
									style={{
										width: 200,
										height: '35px'
									}}
								/>

								if (shippingWay === 0) {
									comElement = (
										<Flex gap={10} flex style={{ marginRight: '15px' }}>
											<Select
												className="w260"
												value={shipmentType}
												onChange={setShipmentType}
												placeholder={iSelect}
												options={customerShipment}
												getPopupContainer={(trigger) => trigger.parentNode}
											/>
											<CustomInput
												value={shippingRemark}
												onChange={(e) => {
													setShippingRemark(e.target.value);
												}}
												placeholder={iDeliveryInformation}
												style={{
													width: '100%',
													height: '35px'
												}}
											/>
										</Flex>
									);
								}

								return (
									<Flex key={item?.dictCode} alignCenter style={{ width: '100%' }}>
										<Radio value={item.dictCode}>
											{item.dictValue + ' # '}
										</Radio>
										{shippingWay === item.dictCode ? comElement : null}
									</Flex>
								);
							})}
						</Space>
					</Radio.Group>
				}

				{
					accountDeliveryList?.length > 0 &&
					<>
						{/* 账号的运输方式-有 */}
						<Table
							size="small"
							pagination={false}
							columns={shippingColumns}
							rowKey={record => record.id}
							dataSource={accountDeliveryList}
							className='pub-border-table'
							rowClassName="pub-cursor-pointer"
							onRow={(record) => {
								return {
									onClick: () => { customerAccountRadioChange(record) }, // 点击行
								};
							}}
							scroll={accountDeliveryList?.length > 0 ? { x: 550 } : null}
						/>
						<div
							className='mt10 pub-color-link w120'
							onClick={(e) => handleAddCourierAccount(e)}
						>{iAddAnAccount}</div>
					</>
				}
			</div>
		)
	}

	useEffect(() => {
		// 如果-Use My Courier Account 选中默认的账号运输方式
		if (shippingType == 2 && accountDeliveryList?.length > 0) {
			let curItem = accountDeliveryList[0]
			accountDeliveryList.map(i => {
				// 拿用户自己选择的
				if (i?.id === buySaveInfo?.shippingWayId) {
					curItem = i
				} else if (i.isDefault === 1) {
					curItem = i
				}
			})
			curChooseAccountDelivery(curItem)
		}
	}, [shippingType, accountDeliveryList])

	useEffect(() => {
		if (!isEmpty(buySaveInfo)) {
			const methodInfo = buySaveInfo?.shippingMethod?.[countryId] // 选中的发货方式和类型
			if (!isEmpty(methodInfo)) {
				setShippingType(methodInfo?.shippingType)
				if (methodInfo?.shippingType == 2) {
					// methodInfo?.shippingWay && setShippingWay(methodInfo?.shippingWay); // 暂时不保存上次的运输方式
					methodInfo?.id && setShippingWayId(methodInfo?.id)
					methodInfo?.account && setShippingRemark(methodInfo?.account)
				} else {
					// setShippingWay(methodInfo?.regionId)  // 暂时不保存上次的运输方式
				}
			} else {
				setBuySaveInfo({
					...buySaveInfo,
					shippingMethod: {}
				})
			}
		}
	}, [])

	return (
		<Form
			form={form}
			onFinish={handleSubmit}
		>
			<div className="ps-shipping-info pub-border20 mb20 box-shadow" style={{ background: '#fff' }}>
				<div className="row">
					<div className="col-sm-12">
						<h4 className="ps-form__heading">{iSelectShippingMethod}</h4>
						<Notice type='price' className='mb10' />
						{
							deliveryList?.length > 0 && (
								<Table
									size='small'
									pagination={false}
									columns={columns}
									rowKey={record => record.companyId}
									dataSource={deliveryList}
									className='pub-border-table'
									rowClassName="pub-cursor-pointer"
									onRow={(record) => {
										return {
											onClick: () => { onDeliveryChange(record) }, // 点击行
										};
									}}
									scroll={deliveryList?.length > 0 ? { x: 550 } : null}
								/>
							)
						}
					</div>

					<div className='ps-select-shipping-way percentW100'>
						<div className="col-sm-12">
							<Checkbox checked={shippingType == 2} onChange={customerChange}>
								<div>{iUseMyShippingAccount}</div>
							</Checkbox>
						</div>
						{/* Use My Courier Account */}
						{getCourierAccountView()}
						{showError && <AlarmPrompt className='ml20 mt10' text={errText} />}
					</div>
				</div>
			</div>

			<div className='pub-border20 box-shadow' style={{ background: '#fff' }}>
				<h4 className="ps-form__heading">{iSelectShippingOptions}</h4>
				<div className="ml15">
					<Radio.Group value={sendDateType} style={{ display: 'flex', flexDirection: 'column', }} onChange={changeSendDateType}>
						<div>
							{sendList?.[0] && <Radio value={sendList[0].dictValue} style={{ height: '35px' }}> {sendList[0].dictValue}</Radio>}
						</div>
						<div >
							{sendList[1] &&
								<Radio value={sendList[1].dictValue}>
									{sendList[1].dictValue}
									<Tooltip title={iMergeTogetherTip} placement="top" >
										<span className='sprite-icon4-cart sprite-icon4-cart-6-7'></span>
									</Tooltip>
								</Radio>
							}

						</div>

						{sendList[2] &&
							<Radio value={sendList[2].dictValue}>
								<div className='mt14 mb5' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									{sendList[2].dictValue}

								</div>
							</Radio>}

						{
							sendDateType === iScheduledDate && <div
								style={{ marginBottom: 0 }}
							>
								<DatePicker
									placeholder=''
									className='pub-border'
									onChange={dateOnchange}
									defaultValue={sendDate && dayjs(sendDate, 'YYYY/MM/DD')}
									format="YYYY/MM/DD"
									disabledDate={disabledDate}
									style={{ marginLeft: '23px', width: '280px', }}
								/>
							</div>
						}
						{showErrorSendDate && <div className='pub-error-tip ml25 mt10'>
							{showErrorSendDate === 1 ? iSelectShippingOptions : iPleaseSelectShippingDate}
						</div>}
					</Radio.Group>
				</div>
			</div>
			{/* 保险 */}
			{/* <div className='select-insurance pub-border20 mt20' style={{ background: '#fff' }}>
                <div className="ps-form__heading">{iSelectShippingInsurance}</div>
                <div className="mb5 ml15">
                    <Radio.Group style={{ display: 'flex', flexDirection: 'column', }} value={insurance} onChange={changeInsuranceType}>
                        <Radio value={0}>
                            <span className='pub-fontw'>Do Not Add Shipping Insurance</span>
                            &nbsp;- Do not insure this order against damage or loss. I acknowledge that Origin Data Electronics is not responsible in the event all or any portion of my order becomes damaged or lost in transit by my selected transit company. Origin Data Electronics is relieved from all responsibility regarding damage or loss of the order at the time the order is turned over to my selected transit company.</Radio>
                        <Radio value={1} className='mt10'>
                            <span className='pub-fontw'>Add Shipping Insurance</span>
                            &nbsp;- Shipping insurance price is calculated based upon your selected carrier's published rates.</Radio>
                    </Radio.Group>
                </div>
            </div> */}

			{/* 操作栏 */}
			<div className="pub-flex ps-form__submit">
				<div className="ps-block__footer">
					<button
						type="submit" ghost='true'
						className='login-page-login-btn ps-add-cart-footer-btn custom-antd-primary pub-font13 w160 mt30'
					>
						{iContinue}
					</button>
				</div>
			</div>
			{/* 账号的运输方式-添加弹窗 */}
			{
				visible && (
					<FreighAccountsEdit
						visible={visible}
						handleCancel={() => setVisible(false)}
						handleSubmit={() => freighHandleSubmit()}
						otherParams={{
							custDeliveryList,
							list: accountDeliveryList,
						}}
					/>
				)
			}
		</Form>
	);
};

const ShippingComponent = connect((state) => state)(withCookies(Shipping))

export default React.forwardRef((props, ref) => <ShippingComponent {...props} refInstance={ref} />);
