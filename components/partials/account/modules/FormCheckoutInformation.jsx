import React, { useState, useEffect, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import { connect, useDispatch } from 'react-redux';
import { withCookies } from 'react-cookie';
import { useCookies } from 'react-cookie';
import { Form, Space, Select, Checkbox, message, Button } from 'antd'; //  Input,
import { CustomInput, AlarmPrompt } from '~/components/common';
import OrderRepository from '~/repositories/zqx/OrderRepository';
import AccountRepository from '~/repositories/zqx/AccountRepository';
import BuySelectAddress from '~/components/ecomerce/orderCom/BuySelectAddress';
import VoucherModal from '~/components/ecomerce/cartCom/VoucherModal'
import { setShoppingCartShipping } from '~/store/ecomerce/action';
import ShopCartContext from '~/utilities/shopCartContext'
import { getExpiresTime } from '~/utilities/common-helpers';
// import { calculateTotalAmount, toFixed } from '~/utilities/ecomerce-helpers';

import useLocalStorage from '~/hooks/useLocalStorage';
import useLanguage from '~/hooks/useLanguage';
import useCart from '~/hooks/useCart';
import useApi from '~/hooks/useApi';
import useI18 from '~/hooks/useI18';

const Email_Regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

// 新国家 - 省是输入的，城市就改为输入框， 省列表出现多个手动添加的省， 输入框和下拉输入框同步，  输入值和下拉结果颜色匹配
const FormCheckoutInformation = ({ cookies, auth, ecomerce, address = {}, voucheourList, refInstance }) => {
	const { i18Translate, getDomainsData, curLanguageCodeZh } = useLanguage();
	const {
		i18FormRulesTip, iFirstName, iLastName, iRequired, iContinue, iEmailTip,
	} = useI18();
	const iEmailAddress = i18Translate('i18Form.Email Address', "Email Address")
	const iTelephone = i18Translate('i18Form.Telephone', 'Telephone')
	const iAddressLine = i18Translate('i18OrderAddress.Address Line', 'Address Line')
	const iOrderType = i18Translate('i18OrderAddress.Order Type', 'Order Type')
	const iCustomerType = i18Translate('i18OrderAddress.Customer Type', 'Customer Type')
	const iCountry = i18Translate('i18OrderAddress.Country', 'Country')
	const iCity = i18Translate('i18OrderAddress.City', 'City')
	const iCompanyName = i18Translate('i18OrderAddress.Company Name', 'Company Name')
	const iStateProvince = i18Translate('i18OrderAddress.State Province', 'State/Province')
	const iPostalCode = i18Translate('i18OrderAddress.Postal Code', 'Postal Code')
	const iAddressSame1 = i18Translate('i18OrderAddress.AddressSame1', 'My Billing Address is the same way as my shipping')

	const { dictAddressCustomerType, apiDictAddressCustomerType, dictOrderTypeList, apiDictOrderTypeList } = useApi();

	const AlarmRequired = () => <AlarmPrompt text={iRequired} />

	const { saveOrderStepData } = useCart();
	const selectCountryRef = useRef(null);
	const provincInputRef = useRef(null);
	const cityInputRef = useRef(null);
	const bilInputRef = useRef(null);
	const bilCityInputRef = useRef(null);
	const { isAccountLog } = auth
	const [pageCookies] = useCookies(['account']);
	const { account } = pageCookies;
	const Router = useRouter();
	const { query } = Router
	const [form] = Form.useForm();
	const dispatch = useDispatch()
	const [loading, setLoading] = useState(false); // 国家搜索加载状态
	const [voucheour, setVoucheour] = useLocalStorage('cartVoucheour', { price: 0, value: '' });
	const [cartAddress, setCartAddress] = useLocalStorage('cartAddress', {});  // 第二步地址信息
	const { shoppingCartShipping } = ecomerce
	const {
		address: cartAddressContext, accountShippingAddress, accountBillingAddress,
		updateIsAccountShippingAddress, updateIsAccountBillingAddress,
		updateAddress, updateShippingPrice, updateVoucheour
	} = useContext(ShopCartContext); // 上下文数据
	const [selectShippingAddress, setSelectShippingAddress] = useState({}) // 选择的邮寄地址信息
	const [selectBillingAddress, setSelectBillingAddress] = useState({}) // 选择的账号地址信息
	const isUseAddressList = accountShippingAddress?.length > 0 && accountBillingAddress?.length > 0  // 登录账号的邮寄地址和账单地址长度都大于0才使用列表选择，否则使用输入框
	// const [voucheourList, setVoucheourList] = useState([]); // 优惠券列表
	// 初始化当前用户选中的账号地址
	const getInitAddressId = (addressList, type = 1) => {
		// 上次用户选的 - 
		const prevSaveAddressId = type === 1 ? cartAddress?.selectShippingAddress?.id : cartAddress?.selectBillingAddress?.id
		let initAddress = addressList?.[0]
		addressList.map(i => {
			// 拿用户自己选择的地址
			if (i?.id === prevSaveAddressId) {
				initAddress = i
			} else if (i.isDefault === 1) {
				initAddress = i
			}
		})
		return initAddress
	}

	useEffect(() => {
		updateIsAccountShippingAddress() // 更新用户账号的地址列表
		updateIsAccountBillingAddress()
	}, [])

	useEffect(() => {

		if (isUseAddressList) {
			setSelectShippingAddress(getInitAddressId(accountShippingAddress))
			setSelectBillingAddress(getInitAddressId(accountBillingAddress, 2))
		}
	}, [accountShippingAddress, accountBillingAddress])

	// 处理国家是否可使用优惠券
	const handleVoucheour = (curAddressData) => {
		// 处理优惠券 两个地方使用到，可以写公共方法-
		// 某些国家不能使用 couponStatus： 1 可使用 2 不可使用 - 影响订单总额？Total:
		if (isAccountLog) {
			const voucheourParams = { price: 0, value: '' } // 清空优惠券使用的数据
			// couponStatus 表示国家能否使用优惠卷（1：可使用，2：不可使用）
			// if (curAddressData?.couponStatus === 1) {
			// 	if (voucheourList?.length > 0) {
			// 		let subTotal = 0
			// 		allCartItems?.map(item => {
			// 			subTotal += Number(toFixed(calculateTotalAmount([item]), 2))
			// 		})
			// 		const arr = voucheourList.filter(i => i.price <= subTotal) // 查找少于总金额的优惠券
			// 		const max = Math.max(...arr.map(item => item.price)); // 查找属性的最大值
			// 		const maxItem = arr.find(item => item.price === max); // 查找属性最大值所在的项

			// 		// 存在赋值，不存在初始化
			// 		if (maxItem && subTotal > maxItem?.price) {
			// 			updateVoucheour({ price: maxItem?.price, value: maxItem?.id }) // 存储使用优惠券
			// 		} else {
			// 			updateVoucheour(voucheourParams)
			// 		}
			// 	}
			// } else 
			if (curAddressData?.couponStatus === 2) {
				updateVoucheour(voucheourParams)
			}
		}
	}

	useEffect(() => {
		// 处理优惠券 两个地方使用到，可以写公共方法-
		// 某些国家不能使用 couponStatus： 1 可使用 2 不可使用 - 影响订单总额？Total:
		handleVoucheour(selectShippingAddress)
		// if(isAccountLog) {
		//     const voucheourParams = { price: 0, value: '' } // 清空优惠券使用的数据
		//     if(selectShippingAddress?.couponStatus === 1) {
		//         if(voucheourList?.length > 0) {
		//             let subTotal = 0
		//             allCartItems?.map(item => {
		//                 subTotal += Number(toFixed(calculateTotalAmount([item]), 2))
		//             })
		//             const arr = voucheourList.filter(i => i.price <= subTotal) // 查找少于总金额的优惠券
		//             const max = Math.max(...arr.map(item => item.price)); // 查找属性的最大值
		//             const maxItem = arr.find(item => item.price === max); // 查找属性最大值所在的项

		//             // 存在赋值，不存在初始化
		//             if (maxItem && subTotal > maxItem?.price) {
		//                 updateVoucheour({ price: maxItem?.price, value: maxItem?.id }) // 存储使用优惠券
		//             } else {
		//                 updateVoucheour(voucheourParams)
		//             }
		//         }

		//     } else if(selectShippingAddress?.couponStatus === 2) {
		//         updateVoucheour(voucheourParams)
		//     }
		// }

		// 邮寄地址自动填充
		if (accountShippingAddress?.length > 0 && !isUseAddressList) {
			form.setFieldsValue(getInitAddressId(accountShippingAddress));
		}
	}, [selectShippingAddress])

	const [isSave, SetSave] = useState(true);
	const [isShowVoucher, setIsShowVoucher] = useState(false);
	const [isSelectBillLocal, setIsSelectBillLocal] = useLocalStorage('isSelectBill', 2); // 地址是否一致 1 不一致 2 一致
	const [isSelectBill, setIsSelectBill] = useState(true); // 地址是否一致

	const [selectOrderType, setSelectOrderType] = useState(address?.orderType)
	const [shippingList, setShippingList] = useState([]); // 全部国家列表
	const [selectCountry, setSelectCountry] = useState(address?.addressId); // 国家

	const [countryId, setCountryId] = useState('');
	const [cityList, setCityList] = useState([]); // 邮寄地址省列表
	const [newCityList, setNewCityList] = useState([]); // 邮寄地址城市列表
	// const [cityState, setCityState] = useState(0); // 0空，1只有省，2 省市
	// 省下拉框可自定义添加数据
	const [open, setOpen] = useState(false);
	const [customProvinceName, setCustomProvinceName] = useState(''); // 省市区值

	const [cityOpen, setCityOpen] = useState(false);
	const [bilOpen, setBilOpen] = useState(false);
	const [bilCityOpen, setCityBilOpen] = useState(false);

	// const [billingCitySelectCity, setBillingCitySelectCity] = useState(billingAddress?.billingCity || []);
	const [billingCountryId, setBillingCountryId] = useState('');
	const [billingCityList, setBillingCityList] = useState([]); // 账单地址省
	const [bilNewCityList, setBilNewCityList] = useState([]); // 账单地址下级城市
	const [bilCityState, setBilCityState] = useState(0); // 0空，1只有省，2 省市

	React.useImperativeHandle(refInstance, () => ({
		onSubmit: () => {
			form.validateFields().then(res => {
				handleSubmit(res)
			})
		}
	}))

	// 提交信息-下一步
	const handleSubmit = async (fieldsValue) => {
		let data = {}
		// 非地址选择，手动输入地址
		if (!isUseAddressList) {
			// 登录后，拿账号的邮箱，无需验证
			if (!Email_Regex.test(fieldsValue.email) && !isAccountLog) {
				message.error(iEmailTip)
				return;
			}
			data = {
				address: {
					// ...cartAddressContext?.address,
					...fieldsValue, email: isAccountLog ? account?.account : fieldsValue.email,
					cityId: cartAddressContext?.address?.cityId,   // 更新地址的城市id, 用于获取城市对应的运输方式
				},
				selectBillingAddress: { ...fieldsValue },
				asBillingAddress: isSelectBill,
				isSaveAddress: isUseAddressList ? 0 : 1,  // 是否自动给用户保存一份账单地址
			};
		}
		// 登录了，没有联系信息才保存 !pageCookies?.profileData?.country
		let resProfile = {}
		if (isAccountLog) {
			resProfile = await AccountRepository.getProfile(pageCookies?.account?.token);
			if (!resProfile?.data?.country) {
				// 注意：如果地址是选择的，该如何取参数
				const { firstName, lastName, phone, addressId, orderType, companyName, customerType } = fieldsValue || {}
				// 保存联系信息参数
				const updateProfileParams = {
					firstName, lastName, phone, country: addressId,
					orderType, companyName, customerType
				}
				// 无联系信息时，保存联系信息，
				await AccountRepository.updateProfile(updateProfileParams, pageCookies?.account?.token);
			}
		}
		const customerType = resProfile?.data?.customerType

		// 选择账号的地址列表
		if (isUseAddressList) {
			const {
				addressId, phone, addressLine1, addressLine2, city, province,
				companyName, firstName, lastName, postalCode
			} = selectBillingAddress // 选择的账号账单地址
			// 处理账号账单地址
			const handleSelectBillingAddress = {
				email: account?.account, // 用户邮箱
				billingAddressId: addressId, billingPhone: phone, // 国家id，电话
				billingAddressLine1: addressLine1, billingAddressLine2: addressLine2,
				billingCity: city, billingState: province, billingCompanyName: companyName, // 省,城市,公司名
				billingFirstName: firstName, billingLastName: lastName, billingPostalCode: postalCode,
			}

			// 选中的邮寄地址 province (提交订单city为省/州，newCity为城市)
			// 对应账单地址 billingState 为省/州，
			const selectShipping = { ...selectShippingAddress, customerType, city: selectShippingAddress?.province, newCity: selectShippingAddress?.city }

			data = {
				address: {
					...fieldsValue, ...selectShipping
				},
				selectShippingAddress: selectShipping, // 保存Shipping地址
				selectBillingAddress: { ...selectBillingAddress, ...handleSelectBillingAddress }, // 保存Bill地址
				isSaveAddress: 0,  // 是否自动给用户保存一份账单地址,选择地址 就不再添加了
			}
		}

		if (voucheour.value) data.couponId = voucheour.value; // 存储当前优惠券id
		// if (isSelectBill) data.isSaveAddress = isSelectBill; // 是否自动给用户保存一份账单地址
		localStorage.setItem('shipping-address', JSON.stringify(fieldsValue)) // 目前只在当前文件使用
		updateAddress(data); // 存储地址信息
		saveOrderStepData({
			email: fieldsValue.email || account?.account,
			step: 3,
		})
		setTimeout(() => { Router.push(`/account/shopping-cart?num=2`); }, 0)


	}

	// 运输方式列表
	const getDeliveryRefList = async (keyWord, isUpdate) => {
		if (keyWord) {
			setLoading(true);
		}
		const res = await OrderRepository.getApiCountryList(keyWord, getDomainsData()?.defaultLocale);
		setLoading(false);
		if (res.code == 0) {
			const sAddress = localStorage.getItem('shipping-address') || ''
			const shippingAddress = sAddress !== 'undefined' && sAddress !== '' ? JSON.parse(sAddress) : ''

			res?.data?.data?.map(item => {
				const { id, name } = item
				item.value = id
				item.label = name;
				item.addressCode = id;
				// 邮寄地址
				if (shippingAddress?.addressId == item.value) {
					setSelectCountry(item.value);
					// 默认执行， 解决重新点击国家输入框重置国家搜索条件， 但是账号地址也有个国家，调用了两次国家接口，注意城市不
					// handleChange中已经执行了，这里不再执行
					if (!isUpdate) {
						setCountryId(id)
					}
				}
				// 账单地址
				if (shippingAddress?.billingAddressId == item.value) {
					// 默认执行， 解决重新点击国家输入框重置国家搜索条件， 但是账号地址也有个国家，调用了两次国家接口，注意城市不
					// handleChange中已经执行了，这里不再执行
					if (!isUpdate) {
						setBillingCountryId(id)
					}
				}
			})

			setShippingList(res.data?.data);
			// 每次 options 更新后，将滚动条设置回顶部
			if (selectCountryRef.current) {
				selectCountryRef.current.scrollTo(0, 0);
			}
		}
	}

	const handleChange = (option) => {
		form.setFields([
			{ name: 'city', value: '' },
			{ name: 'newCity', value: '' },
		]);
		const curItem = shippingList.find(item => item.id == option)
		// 处理国家是否可使用优惠券
		handleVoucheour(curItem)
		// setSelectCountry(option)
		setCountryId(curItem?.id)
		// 更新运费信息
		updateShippingPrice(0)
		const cartShipping = {
			...shoppingCartShipping,
			shippingType: '', // 运费选项 Shipping Method or Use My Courier Account
			shippingWay: '', // 运费选项id id
			shippingRemark: '', // Use My Courier Account-Account
		}
		cookies.set('shoppingCartShipping', cartShipping, { path: '/', expires: getExpiresTime(30) })
		dispatch(setShoppingCartShipping(cartShipping))
	}

	// 账单国家改变
	const billingHandleCountryChange = (option) => {
		form.setFields([
			{
				name: 'billingState',
				value: ''
			},
			{
				name: 'billingCity',
				value: ''
			},
		]);
		const curItem = shippingList.find(item => item.id == option)
		setBillingCountryId(curItem.id)
	}

	const billOnChange = (e) => {
		const val = e.target.checked;
		setIsSelectBillLocal(val ? 2 : 1);
		// if (!val) {
		//     form.setFieldsValue({
		//         billingAddressLine1: billingAddress?.addressLine1 ?? '',
		//         billingAddressLine2: billingAddress?.addressLine2 ?? '',
		//         billingCity: billingAddress?.city ?? '',
		//         billingCompanyName: billingAddress?.billingCompanyName ?? '',
		//         billingFirstName: billingAddress?.firstName ?? '',
		//         billingLastName: billingAddress?.lastName ?? '',
		//         billingPostalCode: billingAddress?.postalCode ?? '',
		//     })
		// }
	}

	useEffect(() => {
		const flag = isSelectBillLocal === 2 ? true : false
		setIsSelectBill(flag);
	}, [isSelectBillLocal])

	const orderTypeOnChange = (e) => {
		setSelectOrderType(e);
		form.setFieldValue({ orderType: e });
	}

	const onCustomerTypeChange = (option) => {
		form.setFieldValue({ customerType: option.value })
	}

	useEffect(() => {
		apiDictAddressCustomerType(); // 客户类型
		apiDictOrderTypeList(); // 订单类型
		getDeliveryRefList(); // 发货类型
	}, [])

	useEffect(() => {
		const sAddress = localStorage.getItem('shipping-address') || ''
		const shippingAddress = sAddress !== 'undefined' && sAddress !== '' ? JSON.parse(sAddress) : ''
		setSelectOrderType(shippingAddress?.orderType)
		form.setFieldsValue(shippingAddress ? shippingAddress : address); // 回显客户存储的地址
	}, [address, selectCountry])

	useEffect(() => {
		if (!isSave) {
			form.resetFields();
		}
	}, [isSave])

	const handleProvinceCity = (res, type) => {
		if (res.code == 0) {
			const { data } = res?.data || {}
			data?.map(item => {
				item.value = item.name; // stateCode
				item.label = item.name;
			})
			// 账单地址
			if (type == 'billing') {
				setBilNewCityList([])
				setBillingCityList(data)
			} else {
				// 邮寄地址
				setNewCityList([])
				setCityList(data)
			}
		}
	}

	// 国家更新时，对应的城市、运输方式也更新
	const getCity = async (id, type) => {
		if (!id) return
		// const res = await OrderRepository.getShippingCityList({}, id); // 旧的
		const fintCurrentItem = shippingList?.find(item => item.id == id)

		// existence 判断该国家是否有省市区
		if (fintCurrentItem?.existence === 0) {
			const res = await OrderRepository.getApiCountryCityList({ countryId: id, languageType: getDomainsData()?.defaultLocale, });

			if (res.code == 0) {
				const { data } = res?.data || {}
				data?.map(item => {
					item.value = item.name;
					item.label = item.name;
				})
				// 账单地址
				if (type == 'billing') {
					setBilNewCityList([])
					setBillingCityList(data)
				} else {
					// 邮寄地址
					setNewCityList(data)
					setCityList([])
				}
			}
		} else {
			const res = await OrderRepository.getApiCountryStateList(id, getDomainsData()?.defaultLocale);

			handleProvinceCity(res, type)
		}
	}
	// 邮寄地址选择国家
	const getFormCountry = () => {
		return (
			<div className="col-sm-6">
				<div className="">
					<Form.Item name="addressId" label={iCountry} rules={i18FormRulesTip()}>
						<Select
							ref={selectCountryRef}
							showSearch
							filterOption={false} // 禁用了 Select 默认的前端筛选功能。
							className='w300'
							autoComplete="new-password" // 下拉框禁止使用浏览器记录
							// getDeliveryRefList('') 解决重新点击国家输入框重置国家搜索条件， 但是账号地址也有个国家，调用了两次国家接口，注意城市不是国家对不上
							onChange={(e) => (handleChange(e))}
							onSelect={() => getDeliveryRefList('', true)}
							onSearch={handleSearch}
							loading={loading}
							// suffix={loading ? <Spin indicator={antIcon} /> : null} // 使用自定义Spin作为后缀
							options={shippingList}
							getPopupContainer={(trigger) => trigger.parentNode}
						>
						</Select>
					</Form.Item>
				</div>
			</div>
		)
	}

	// 邮寄地址选中城市
	const onChangeNewCityView = (e) => {
		const fintNewCity = newCityList?.find(item => item.name == e)

		const params = {
			...cartAddress,
			address: {
				...cartAddress?.address,
				cityId: fintNewCity?.id, // 更新地址的城市id, 用于获取城市对应的运输方式
			}
		}

		updateAddress(params);
	}

	const onChangeBliCityView = async (e) => {
		// 当前省对象
		const currentItem = billingCityList.find(item => item.name === e)
		if (!currentItem?.id) {
			// 省使用输入值就清空城市
			setBilNewCityList([])
			return
		}
		const res = await OrderRepository.getApiCountryCityList({ stateId: currentItem?.id, languageType: getDomainsData()?.defaultLocale, });

		if (res.code == 0) {
			const { data } = res?.data || {}
			data?.map(item => {
				item.value = item.name;
				item.label = item.name;
			})
			setBilNewCityList(data)
			form.setFields([
				{
					name: 'billingCity',
					value: ''
				},
			]);
		}
	}

	// 账单地址自定义城市输入框
	const customBilCity = () => {
		const { value } = bilCityInputRef.current?.input || {}
		setCustomProvinceName('')

		const newList = bilNewCityList.filter(item => item?.id)
		setBillingCityList([...newList, {
			value, label: value,
		}])
		setCityBilOpen(false);
		form.setFields([
			{ name: 'billingCity', value },
		]);
	}

	// 账单地址自定义省输入框
	const customBilProvince = () => {
		const { value } = bilInputRef.current?.input || {}
		if (!value) return
		setCustomProvinceName('')

		const newList = billingCityList.filter(item => item?.id)
		setBillingCityList([...newList, {
			value, label: value,
		}])
		setBilOpen(false);
		form.setFields([{ name: 'billingState', value }]);
		form.setFields([{ name: 'billingCity', value: '' }]); // 省改变，清空城市
		// 省使用输入值就清空城市
		setBilNewCityList([])
	}
	// 账单省输入、选中框
	const getBillingCityView = () => {
		// billingCityList bilNewCityList
		// const list = bilCityState === 2 ? billingCityList : []
		let view = ''
		if (billingCityList.length === 0) {
			view = <CustomInput
				className="w300"
				type="text"
				autoComplete="new-password"
			/>
		} else {
			view = <Select className="w300"
				open={bilOpen}
				onDropdownVisibleChange={setBilOpen}
				getPopupContainer={(trigger) => trigger.parentNode}
				mode="single" // mode="combobox"
				dropdownRender={(menu) => (
					<div className='custom-antd-btn-more'>
						{menu}
						<Space
							className='mt10'
							style={{
								padding: '0 8px 4px',
							}}
						>
							<CustomInput
								placeholder={i18Translate('i18SmallText.Add State/Province', 'Add State/Province')}
								ref={bilInputRef}
								value={customProvinceName}
								onChange={(e) => setCustomProvinceName(e.target.value)}
								autoComplete="new-password"
								className='form-control'
							/>
							{/* 公共添加城市-dropdownRender-省城市自定义下拉框 */}
							<Button className='custom-antd-primary w100'
								type="primary"
								onClick={() => customBilProvince()}
							>
								{i18Translate('i18SmallText.Add', 'Add')}
							</Button>
						</Space>
					</div>
				)}
				showSearch
				filterOption={(input, option) =>
					(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
				}
				autoComplete="new-password"
				placeholder={iStateProvince} onChange={(e) => onChangeBliCityView(e)} options={billingCityList}>
			</Select>
		}
		return view
	}

	// 账单城市输入、选中框 custom-antd-btn-more
	const getBilNewCityView = () => {
		// const list = bilCityState === 1 ? billingCityList : bilNewCityList
		let view = ''
		if (bilNewCityList.length === 0) {
			view = <CustomInput
				className="w300"
				type="text"

				autoComplete="new-password"
			/>
		} else {
			view = <Select
				open={bilCityOpen}
				onDropdownVisibleChange={setCityBilOpen}
				getPopupContainer={(trigger) => trigger.parentNode}
				mode="single" // mode="combobox"
				dropdownRender={(menu) => (
					<div className='custom-antd-btn-more'>
						{menu}
						<Space
							className='mt10'
							style={{
								padding: '0 8px 4px',
							}}
						>
							<CustomInput
								ref={bilCityInputRef}
								value={customProvinceName}
								onChange={(e) => setCustomProvinceName(e.target.value)}
								autoComplete="new-password"
								className='form-control'
								placeholder={i18Translate('i18SmallText.Add City', 'Add City')}
							/>
							{/* 公共添加城市-dropdownRender-省城市自定义下拉框 */}
							<Button className='custom-antd-primary w100'
								type="primary" ghost
								onClick={() => customBilCity()}
							>
								{i18Translate('i18SmallText.Add', 'Add')}
							</Button>
						</Space>
					</div>
				)}
				showSearch
				filterOption={(input, option) =>
					(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
				}
				className="w300"
				placeholder={iStateProvince}
				// onChange={() => onChangeCityView()}
				autoComplete="new-password"
				options={bilNewCityList}>

			</Select>
		}
		return view
	}

	// 邮寄国家搜索
	const handleSearch = val => {
		getDeliveryRefList(val)
	}

	useEffect(async () => {
		getCity(countryId)
	}, [countryId])

	useEffect(async () => {
		getCity(billingCountryId, 'billing')
	}, [billingCountryId])

	useEffect(() => {
		const { showVoucher } = query
		// || voucheour?.value 导致优惠券弹框不弹出
		if (!showVoucher) return
		setIsShowVoucher(Boolean(showVoucher))
	}, [query])

	// const handlePopupScroll = (e) => {
	//     if (e.target.className === 'ant-select-dropdown-menu') {
	//         // 当鼠标滚动在选项框内时，阻止页面滚动  
	//         e.preventDefault();
	//     }
	// };

	// 客户类型
	const getFormCustomerType = () => {
		return (
			<div className="col-sm-6">
				<Form.Item name="customerType" label={iCustomerType} rules={i18FormRulesTip()}>
					<Select
						onChange={onCustomerTypeChange}
						options={dictAddressCustomerType}
						className='w300'
						getPopupContainer={(trigger) => trigger.parentNode}
					>
					</Select>
				</Form.Item>
			</div>
		)
	}
	// 订单类型
	const getFormOrderType = () => {
		return (
			<div className="col-sm-6">
				<div className="">
					<Form.Item name="orderType" label={iOrderType}
						rules={[{ required: true, message: <AlarmRequired />, }]}
					>
						<Select
							onChange={orderTypeOnChange}
							options={dictOrderTypeList}
							className='w300'
							getPopupContainer={(trigger) => trigger.parentNode}
						>
						</Select>
					</Form.Item>
				</div>
			</div>
		)
	}
	// 公司名称
	const getFormCompanyName = () => {
		return (
			<div className="col-sm-6">
				<div className="">
					<Form.Item
						name="companyName"
						label={iCompanyName}
						rules={[
							{
								required: true,
								message: <AlarmRequired />,
							},
						]}>
						<CustomInput
							className="w300"
							type="text"
						/>
					</Form.Item>
				</div>
			</div>
		)
	}

	// 选择优惠券
	const handleVoucherChange = (value) => {
		setIsShowVoucher(false)
		let voucherObj = {}
		if (!!value) {
			const arr = value.split('-');
			voucherObj = { price: arr[1], value: arr[0] }
		} else {
			voucherObj = { price: 0, value: 0 }
		}
		updateVoucheour(voucherObj);
	}

	// 邮寄地址自定义省输入框添加省
	const customProvince = (menu) => {
		const { value } = provincInputRef.current?.input || {}
		if (!value) return
		setCustomProvinceName('') // 添加输入值成功后清空输入框

		const newList = cityList.filter(item => item?.id)

		setCityList([...newList, {
			value, label: value,
		}])
		setTimeout(() => {
			setOpen(false);
			form.setFields([
				{ name: 'province', value },
			]); // name: 'city'
			form.setFields([
				{ name: 'city', value: '' },
			]); // 省改变，清空城市
		}, 0);
		// 省使用输入值就清空城市
		setNewCityList([])
	}
	// 邮寄地址选中省，省市区获取下级
	const onChangeCityView = async (e, type) => {
		const fintCurrentProvincId = cityList?.find(item => item.name == e)
		if (!fintCurrentProvincId?.id) {
			// 省使用输入值就清空城市
			setNewCityList([])
			return
		}
		const res = await OrderRepository.getApiCountryCityList({ stateId: fintCurrentProvincId?.id, languageType: getDomainsData()?.defaultLocale, });
		if (res.code == 0) {
			const { data } = res?.data || {}
			data?.map(item => {
				item.value = item.name;
				item.label = item.name;
			})
			// 账单地址
			if (type == 'billing') {
				setBilNewCityList(data)
			} else {
				// 邮寄地址
				setNewCityList(data)
			}
			form.setFields([
				{
					name: 'city', // newCity -> city
					value: ''
				},
			]);
		}
	}
	// 邮寄地址省，省市区
	const getCityView = () => {
		// const list = cityState === 2 ? cityList : []
		let view = ''
		if (cityList.length === 0) {
			view = <CustomInput
				className="w300"
				type="text"
				autoComplete="new-password"
			/>
		} else {
			view = <Select
				open={open}
				onDropdownVisibleChange={setOpen}
				getPopupContainer={(trigger) => trigger.parentNode}
				mode="single" // mode="combobox"
				dropdownRender={(menu) => (
					<div className='custom-antd-btn-more'>
						{menu}
						<Space
							className='mt10'
							style={{
								padding: '0 8px 4px',
							}}
						>
							<CustomInput
								ref={provincInputRef}
								value={customProvinceName}
								onChange={(e) => setCustomProvinceName(e.target.value)}
								autoComplete="new-password"
								className='form-control'
								placeholder={i18Translate('i18SmallText.Add State/Province', 'Add State/Province')}
							/>
							{/* 注意： 公共添加城市-dropdownRender-省城市自定义下拉框 */}
							<Button className='custom-antd-primary w100 mt5'
								type="primary"
								onClick={() => customProvince(menu)}
							>{i18Translate('i18SmallText.Add', 'Add')}</Button>

						</Space>

					</div>
				)}
				className="w300" placeholder={iStateProvince}
				onChange={(e) => onChangeCityView(e)}
				options={cityList}
				showSearch
				filterOption={(input, option) =>
					(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
				}
				autoComplete="new-password"
			>
			</Select>
		}
		return view
	}
	// 州/省 // LianLian支付city必须-改为必填
	const getProvinceCom = () => {
		return (<div className="col-sm-6">
			<div className="">
				<Form.Item
					name="province"
					label={iStateProvince}
					rules={i18FormRulesTip()}>
					{getCityView()}
				</Form.Item>
			</div>
		</div>)
	}

	// 邮寄地址自定义城市输入框
	const customCity = () => {
		const { value } = cityInputRef.current?.input || {}
		if (!value) return
		setCustomProvinceName('')

		const newList = newCityList.filter(item => item?.id)

		setNewCityList([...newList, {
			value, label: value,
		}])
		setCityOpen(false);
		form.setFields([
			{ name: 'city', value }, // newCity
		]);
	}
	// label="City" cityState // 0空，1只有省，2 省市
	// 邮寄地址城市
	const getNewCityView = () => {
		// const list = cityState === 1 ? cityList : newCityList
		let view = ''
		if (newCityList.length === 0) {
			view = <CustomInput
				className="w300"
				type="text"
				autoComplete="new-password"
			/>
		} else {
			view = <Select
				open={cityOpen}
				onDropdownVisibleChange={setCityOpen}
				getPopupContainer={(trigger) => trigger.parentNode}
				mode="single" // mode="combobox"
				dropdownRender={(menu) => (
					<div className='custom-antd-btn-more'>
						{menu}
						<Space
							className='mt10'
							style={{
								padding: '0 8px 4px',
							}}
						>
							<CustomInput
								ref={cityInputRef}
								value={customProvinceName}
								onChange={(e) => setCustomProvinceName(e.target.value)}
								autoComplete="new-password"
								className='form-control'
								placeholder={i18Translate('i18SmallText.Add City', 'Add City')}
							/>
							{/* 公共添加城市-dropdownRender-省城市自定义下拉框 */}
							<Button className='custom-antd-primary w100'
								type="primary"
								onClick={() => customCity()}
							>
								{i18Translate('i18SmallText.Add', 'Add')}
							</Button>
						</Space>
					</div>
				)}
				showSearch
				filterOption={(input, option) =>
					(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
				}
				className="w300"
				placeholder={iStateProvince}
				autoComplete="new-password"
				options={newCityList}
				onChange={(e) => onChangeNewCityView(e)}
			>

			</Select>
		}
		return view
	}
	// 城市
	const getCityCom = () => {
		return (<div className="col-sm-6">
			<div className="">
				<Form.Item
					name="city"
					label={iCity}
					rules={i18FormRulesTip()}>
					{getNewCityView()}
				</Form.Item>
			</div>
		</div>)
	}

	// 州/省有数据放前面，没数据放后
	const getProvinceCity = () => {
		if (newCityList?.length > 0 && cityList?.length === 0) {
			return <>
				{getCityCom()}
				{getProvinceCom()}
			</>
		} else {
			return <>
				{getProvinceCom()}
				{getCityCom()}
			</>
		}
	}
	// 表单共用
	// 公共formItem
	const colFormItem = (formName, label, required = true, text) => (
		<div className="col-sm-6">
			<Form.Item name={formName} label={label} rules={i18FormRulesTip(required, text)}>
				<CustomInput className="w300" type="text" />
			</Form.Item>
		</div>
	)

	return (
		<>
			<Form
				ref={refInstance}
				form={form}
				layout="vertical"
				className="ps-form__billing-info pub-label-pad custom-antd-btn-more"
				onFinish={handleSubmit}>
				<div className='ps-shopping-address-content pub-border20 box-shadow' style={{ background: '#fff', }}>
					<div className='pub-left-title mb15'>{i18Translate('i18OrderAddress.Shipping Address', 'Shipping Address')}</div>

					{/* 账号登录, 地址选择 */}
					{
						isUseAddressList && (
							<div>
								<BuySelectAddress
									addressList={accountShippingAddress}
									selectAddress={selectShippingAddress}
									countryList={shippingList}
									orderTypeList={dictOrderTypeList}
									type="shipping"
									shippingCallback={val => setSelectShippingAddress(val)}
								/>
							</div>
						)}

					{
						!isUseAddressList && (
							<>
								<div className='row maxW640'>
									{!isAccountLog && (colFormItem("email", iEmailAddress))}
									{!isAccountLog && (colFormItem("phone", iTelephone))}
									{isAccountLog && (getFormCountry())}
									{
										isAccountLog && (
											getFormCustomerType()
										)
									}
								</div>

								{/* 选择国家,客户类型，电话 */}
								<div className='row maxW640'>
									{!isAccountLog && (getFormCountry())}
									{!isAccountLog && (getFormCustomerType())}
									{isAccountLog && (colFormItem("phone", iTelephone))}
								</div>

								<div className='row maxW640'>
									{getFormOrderType()}
									{
										selectOrderType == 1 && (
											getFormCompanyName()
										)
									}
								</div>
								{/* firstName、lastName */}
								<div className='row' style={{ maxWidth: '640px' }}>
									{colFormItem("firstName", iFirstName)}
									{!curLanguageCodeZh() && colFormItem("lastName", iLastName)}
								</div>
								{/* 地址 */}
								<div className="row" style={{ maxWidth: '640px' }}>
									{colFormItem("addressLine1", `${iAddressLine} 1`)}
									{colFormItem("addressLine2", `${iAddressLine} 2`, false)}
								</div>
								{/* 城市，postalCode */}
								{/* 出现bug: 1. 添加省，输入框为空时， 跳转到了下一页 2. 添加省应该直接选中省， 结果跑到城市了 3. 省改变应该清空城市 */}
								<div className="row" style={{ maxWidth: '640px' }}>
									{getProvinceCity()}
									{colFormItem("postalCode", `${iPostalCode} 1`)}
								</div>
							</>
						)}
					{/* 没有用户地址 */}
					{
						!isUseAddressList && (
							<div className='row' style={{ maxWidth: '640px' }}>
								<div className="col-sm-12">
									<div className="">
										<Form.Item
											name="orderType"
											rules={i18FormRulesTip(false)}>
											<Checkbox checked={isSelectBill} onChange={billOnChange}>
												<span className='billing-address'>{iAddressSame1}</span>
											</Checkbox>
										</Form.Item>
									</div>
								</div>
							</div>
						)}
					{/************************ isSelectBill **********************/}
					{/* 账号登录, 地址选择 */}
					{
						isUseAddressList && (
							<div>
								<div className='pub-left-title billing-info mb15'>{i18Translate('i18OrderAddress.Billing Address', 'Billing Address')}</div>
								<BuySelectAddress
									addressList={accountBillingAddress}
									selectAddress={selectBillingAddress}
									countryList={shippingList}
									orderTypeList={dictOrderTypeList}
									type="bill"
									billCallback={val => setSelectBillingAddress(val)}
								/>
							</div>

						)}
					{/* 账单地址输入 */}
					{
						!isUseAddressList && (
							<div className={isSelectBill ? 'is-selectBill' : 'no-selectBill'}>
								<div className='pub-left-title billing-info mb15'>{i18Translate('i18OrderAddress.Billing Address', 'Billing Address')}</div>
								<div className='row mt30' style={{ maxWidth: '640px' }}>
									{colFormItem("billingCompanyName", iCompanyName, !isSelectBill)}
									{colFormItem("billingPhone", iTelephone, !isSelectBill)}
								</div>

								<div className='row' style={{ maxWidth: '640px' }}>
									{colFormItem("billingFirstName", iFirstName, !isSelectBill)}
									{!curLanguageCodeZh() && colFormItem("billingLastName", iLastName, !isSelectBill)}
								</div>
								<div className="row" style={{ maxWidth: '640px' }}>
									{colFormItem("billingAddressLine1", `${iAddressLine} 1`, !isSelectBill)}
									{colFormItem("billingAddressLine2", `${iAddressLine} 2`, false)}
								</div>
								<div className="row" style={{ maxWidth: '640px' }}>
									<div className="col-sm-6">
										<div className="">
											<Form.Item
												name="billingAddressId"
												label={iCountry}
												rules={[{ required: !isSelectBill, message: <AlarmRequired />, }]}
											>
												<Select
													showSearch
													filterOption={false}
													className='w300'
													onChange={(e) => (billingHandleCountryChange(e))}
													onSelect={() => getDeliveryRefList('', true)}
													onSearch={handleSearch}
													loading={loading}
													options={shippingList}
													autoComplete="new-password" // 下拉框禁止使用浏览器记录
													getPopupContainer={(trigger) => trigger.parentNode}
												>
												</Select>
											</Form.Item>
										</div>
									</div>
									<div className="col-sm-6">
										<div className="">
											<Form.Item
												name="billingState"
												label={iStateProvince}
												rules={[
													{
														required: Boolean(billingCityList.length > 0) && bilCityState === 2,
														message: <AlarmRequired />,
													},
												]}>
												{getBillingCityView()}
											</Form.Item>
										</div>
									</div>
								</div>

								<div className="row" style={{ maxWidth: '640px' }}>
									<div className="col-sm-6">
										<Form.Item
											name="billingCity"
											label={iCity}

											rules={[
												{
													required: !isSelectBill,
													message: <AlarmRequired />,
												},
											]}>
											{getBilNewCityView()}
										</Form.Item>
									</div>
									{colFormItem("billingPostalCode", iPostalCode, !isSelectBill)}
								</div>
							</div>

						)}
				</div>
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
			</Form>

			{
				isShowVoucher && (
					<VoucherModal
						isShowModal={isShowVoucher}
						couponData={voucheourList}
						handleCancel={(voucherObj) => handleVoucherChange(voucherObj)}
						hideVoucherModal={() => setIsShowVoucher(false)}
					/>
				)
			}
		</>
	);
};
const FormCheckoutInformationCom = connect((state) => state)(withCookies(FormCheckoutInformation))
export default React.forwardRef((props, ref) => <FormCheckoutInformationCom {...props} refInstance={ref} />);
