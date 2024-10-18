import React, { useState, useEffect, useRef } from 'react';
import { Form, Row, Col, Select, Button, Checkbox, Space } from 'antd'; //  Input,
import { CustomInput } from '~/components/common';
import CountryListSelectNew from '~/components/ecomerce/formCom/CountryListSelectNew';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
import OrderRepository from '~/repositories/zqx/OrderRepository';
import noop from 'lodash/noop';
import reverse from 'lodash/reverse';
import map from 'lodash/map';
/**
 * 
 * @onFinish, // 提交回调
 * @returns 
 */
const AddressFormCom = ({
	formFields = null, // 当前表单的数据
	onFinish, // 提交回调
	onCancle,
	isShowSame = false,
	isSame = false,
	isDefault = false,
	isShowDefault = false,
	onChangeSame = noop(),
	onChangeDefault = noop(),
	isShippingAddress = false,
	isShowOrderType = true,
	oTypeList = [], // 订单类型列表
	children,
}) => {
	const { i18Translate, getDomainsData, curLanguageCodeZh } = useLanguage();
	const { i18FormRules, iFirstName, iLastName, iRequired } = useI18();
	const iTelephone = i18Translate('i18Form.Telephone', 'Telephone');
	const iAddressLine = i18Translate('i18OrderAddress.Address Line', 'Address Line');
	const iStateProvince = i18Translate('i18OrderAddress.State Province', 'State/Province');
	const iCity = i18Translate('i18OrderAddress.City', 'City');
	const iOrderType = i18Translate('i18OrderAddress.Order Type', 'Order Type');
	const iCompanyName = i18Translate('i18OrderAddress.Company Name', 'Company Name');
	const iPostalCode = i18Translate('i18OrderAddress.Postal Code', 'Postal Code');
	const iSetDefault = i18Translate('i18OrderAddress.Set Default', ' Set Default');
	const iAddressSame1 = i18Translate('i18OrderAddress.AddressSame1', 'My Billing Address is the same way as my shipping');
	const iAddressSame2 = i18Translate('i18OrderAddress.AddressSame2', 'My Shipping Address is the same way as my billing');
	const iSubmit = i18Translate('i18Form.Submit', 'Submit');

	const [formAddress] = Form.useForm();
	const cityInputRef = useRef(null);
	const provincInputRef = useRef(null);

	// 订单类型
	const [orderType, setOrderType] = useState(formFields?.orderType);
	// 订单类型列表
	const [orderTypeList, setOrderTypeList] = useState(oTypeList);
	// 国家ID
	const [countryId, setCountryId] = useState(Number(formFields?.addressId) || '');
	// 城市列表，  省列表
	const [cityList, setCityList] = useState([]); // 省列表
	// 省下级城市
	const [newCityList, setNewCityList] = useState([]);
	// 城市的值
	const [cityVal, setCityVal] = useState(formFields?.city);
	const [cityId, setCityId] = useState(formFields?.cityId); // 城市id
	const [cityOpen, setCityOpen] = useState(false);
	const [customCityName, setCustomCityName] = useState(''); // 省市区值
	const [stateProvincVal, setStateProvincVal] = useState(formFields?.province); // 省市区值
	const [customProvinceName, setCustomProvinceName] = useState(''); // 省市区值
	const [open, setOpen] = useState(false);
	const [cityState, setCityState] = useState(0); // 0空，1只有省，2 省市

	// 是否同步地址
	const [sameAddres, setSameAddres] = useState(isSame);
	const [defaultAddres, setDefaultAddres] = useState(isDefault);

	useEffect(() => {
		getOrderTypeList();
	}, []);

	useEffect(() => {
		if (formFields) {
			formAddress.setFieldsValue({
				...formFields,
			});
		}
		if (!formFields?.id) {
			formAddress.resetFields();
		}
	}, [formFields]);

	// 获取订单类型
	const getOrderTypeList = async () => {
		const res = await OrderRepository.getDictList('address_order_type');
		if (res?.code === 0) {
			const tList = reverse(
				map(res.data, (rd) => ({
					value: Number(rd.dictValue),
					label: rd.dictLabel,
				}))
			);

			setOrderTypeList(tList);
		}
	};

	// 根据国家id(countryId: id )或者省州id(stateId:id)，查询城市列表
	const getCityListById = async (params) => {
		const res = await OrderRepository.getApiCountryCityList(params, getDomainsData()?.defaultLocale);
		if (res?.code === 0) {
			const _cityList = res?.data?.data || [];
			const list = map(_cityList, (cl) => {
				return {
					label: cl.name,
					value: cl.name,
					...cl,
				};
			});

			setNewCityList(list);
		}
	};

	// 根据国家id，查询省份，州
	const getStateProvinceListById = async (id) => {
		const res = await OrderRepository.getApiCountryStateList(id, getDomainsData()?.defaultLocale);
		if (res.code == 0) {
			const _stateList = res?.data?.data || [];
			let provinceId = ''; // 省、州的ID
			const _province = map(_stateList, (item) => {
				if (item.name === stateProvincVal) {
					provinceId = item.id;
				}
				return {
					value: item.name,
					label: item.name,
					...item,
				};
			});
			setCityList(_province);

			// 拿到省/州，再去获取城市数据
			provinceId && getCityListById({ stateId: provinceId });
		}
	};

	// 根据国家id，查询其下的省/州，城市
	const getStateProvinceCity = (id, option) => {
		if (id !== option?.id) return;

		// existence: 0 国家下没有省/州
		if (option?.existence === 0) {
			setCityState(1);
			getCityListById({ countryId: id });
		} else if (option?.existence > 0) {
			setCityState(2);
			getStateProvinceListById(id);
		}
	};

	// 国家选择
	const handleCountryChange = (id, option, flag) => {
		setCountryId(id);
		resetProvinceCity(flag);
		getStateProvinceCity(id, option);
	};

	// 切换选中国家，清除选中的省（州），市，城市---》选了其它国家后记得重置省、城市的值
	const resetProvinceCity = (flag) => {
		if (flag) {
			setStateProvincVal('');
			setCityList([]);
			formAddress.setFields([
				{
					name: 'province',
					value: '',
				},
			]);
			resetCity();
		}
	};

	// 省改变->城市  清空城市
	const resetCity = () => {
		setCityVal('');
		setCityId('');
		setNewCityList([]);
		formAddress.setFields([
			{
				name: 'city',
				value: '',
			},
		]);
	};

	const onChangeNewCityView = (e) => {
		const fintNewCity = newCityList?.find((item) => item.name == e);
		setCityVal(e);
		setCityId(fintNewCity?.id);
	};

	// 省市区获取下级 LPC54113J256BD64
	const handleSelectStateProvince = async (v, item) => {
		setStateProvincVal(v); // 省市区值
		if (!item?.id) {
			// 省使用输入值就清空城市
			setNewCityList([]);
			return;
		}

		getCityListById({ stateId: item?.id });

		if (cityState) {
			formAddress.setFields([
				{
					name: 'city',
					value: '',
				},
			]);
		}
	};


	// 账单地址自定义省输入框 - 编辑
	const customProvince = () => {
		const { value } = provincInputRef.current?.input || {}
		setStateProvincVal(value)
		setCustomProvinceName('')

		const newList = cityList.filter(item => item?.id)
		setCityList([...newList, { value, label: value }]) // 在列表添加一项
		setOpen(false);
		formAddress.setFields([{ name: 'province', value }]); // 清空输入框
	};
	// 账单地址自定义城市输入框 - 编辑
	const customCity = () => {
		const { value } = cityInputRef.current?.input || {}
		setCityVal(value)
		setCustomCityName('')

		const newList = newCityList.filter(item => item?.id)
		setNewCityList([...newList, { value, label: value }]) // 在列表添加一项
		setCityOpen(false);

		formAddress.setFields([{ name: 'city', value }]); // 清空输入框
	}


	// 是否同步地址
	const handleChangeSameAddress = (event) => {
		const _checked = event.target.checked;
		setSameAddres(_checked);
		onChangeSame?.(_checked);
	};

	// 是否设为默认地址
	const handleChangeSetDefaultAddress = (event) => {
		const _checked = event.target.checked;
		setDefaultAddres(_checked);
		onChangeDefault?.(_checked);
	};

	// 完成提交
	const handleFinishClick = () => {
		formAddress.validateFields().then((values) => {
			// console.log(values, '完成提交--values--del')
			if (onFinish) {
				onFinish({ ...values, cityId })
			}
			// onFinish?.({ ...values, cityId });
		});
		// debugger;

		// // return

	};

	// 公共CustomInput
	const colCustomInput = name => {
		return <CustomInput
			className="form-control w260"
			type="text"
			autoComplete="new-password"
			suffix={<div className='pub-custom-holder pub-input-required'>{name}</div>}
		/>
	}
	// 公共formItem
	const colFormItem = (formName, name) => {
		return <Col>
			<Form.Item name={formName} className="mb20" rules={i18FormRules}>
				{colCustomInput(name)}
			</Form.Item>
		</Col>
	}
	// 邮编组件
	const PostalCode = () => (
		<Col>
			<Form.Item name="postalCode" className="mb20" rules={i18FormRules}>
				{colCustomInput(iPostalCode)}
			</Form.Item>
		</Col>
	);

	//  autoComplete="off"
	return (
		// onFinish={handleFinishClick}
		<Form form={formAddress} layout="vertical" className="pub-custom-input-suffix custom-antd-btn-more">
			{/* 姓名 */}
			<Row gutter={20}>
				{colFormItem("firstName", iFirstName)}
				{!curLanguageCodeZh() && colFormItem("lastName", iLastName)}
				{/* 地址1 */}
				{colFormItem("addressLine1", `${iAddressLine} 1`)}
				{colFormItem("addressLine2", `${iAddressLine} 2`)}
				{/* 国家，城市 State/Province */}

				<Col>
					<CountryListSelectNew
						form={formAddress}
						countyId={countryId}
						countyChange={({ id, option, flag }) => handleCountryChange(id, option, flag)} // , helpersFormNoError(formAddress, 'countyId')
					/>
				</Col>
				<Col>
					{/* cityList没有省就展示输入框 */}
					{cityList?.length === 0 && <Form.Item name="province" className="mb20" rules={i18FormRules}>{colCustomInput(iStateProvince)}</Form.Item>}
					{/* cityList有省就展示下拉框 */}
					{cityList?.length > 0 && (
						<Form.Item className={'pub-custom-select ' + (stateProvincVal ? 'select-have-val' : '')}>
							<Form.Item
								name="province"
								rules={i18FormRules}
								noStyle // 为 true 时不带样式，作为纯字段控件使用
							>
								<Select
									open={open} // 是否展开下拉菜单
									onDropdownVisibleChange={setOpen} // 展开下拉菜单的回调
									mode="single"
									dropdownRender={(menu) => (
										<div className="custom-antd-btn-more">
											{menu}
											<Space
												style={{
													padding: '0 8px 4px',
												}}
											>
												<CustomInput
													placeholder={i18Translate('i18SmallText.Add State/Province', 'Add State/Province')}
													ref={provincInputRef}
													value={customProvinceName}
													onChange={(e) => setCustomProvinceName(e.target.value)}
													autoComplete="off"
													className="form-control"
												/>
												{/* 公共添加省-dropdownRender-省城市自定义下拉框  type="primary" */}
												<Button className="custom-antd-primary w100" onClick={() => customProvince()}>
													{i18Translate('i18SmallText.Add', 'Add')}
												</Button>
											</Space>
										</div>
									)}
									className="w260"
									onSelect={(v, option) => {
										handleSelectStateProvince(v, option);
										setStateProvincVal(v);
										resetCity();
									}}
									options={cityList}
									autoComplete="new-password"
									showSearch
									value={stateProvincVal}
									filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
									getPopupContainer={(trigger) => trigger.parentNode}
								/>
							</Form.Item>
							<div className="pub-custom-holder pub-input-required">{iStateProvince}</div>
						</Form.Item>
					)}
				</Col>

				<Col>
					{newCityList?.length === 0 && (
						<Form.Item name="city" className="mb20" rules={i18FormRules}>
							{colCustomInput(iCity)}
						</Form.Item>
					)}
					{/* cityList有省就展示下拉框 */}
					{newCityList?.length > 0 && (
						<Form.Item className={'pub-custom-select ' + (cityVal ? 'select-have-val' : '')}>
							<Form.Item
								name="city"
								className="mb20"
								rules={i18FormRules}
								noStyle // 为 true 时不带样式，作为纯字段控件使用
							>
								<Select
									open={cityOpen}
									onDropdownVisibleChange={setCityOpen}
									dropdownRender={(menu) => (
										<div className="custom-antd-btn-more">
											{menu}
											<Space
												style={{
													padding: '0 8px 4px',
												}}
											>
												<CustomInput
													placeholder={i18Translate('i18SmallText.Add City', 'Add City')}
													ref={cityInputRef}
													value={customCityName}
													onChange={(e) => setCustomCityName(e.target.value)}
													autoComplete="new-password"
													className="form-control"
												/>
												{/* 公共添加城市-dropdownRender-省城市自定义下拉框   type="primary" */}
												<Button className="custom-antd-primary w100" onClick={() => customCity()}>
													{i18Translate('i18SmallText.Add', 'Add')}
												</Button>
											</Space>
										</div>
									)}
									className="w260"
									onChange={(e) => onChangeNewCityView(e)}
									autoComplete="new-password"
									options={newCityList}
									showSearch
									value={cityVal}
									getPopupContainer={(trigger) => trigger.parentNode}
								/>
							</Form.Item>
							<div className="pub-custom-holder pub-input-required">{iCity}</div>
						</Form.Item>
					)}
				</Col>
				{colFormItem("phone", iTelephone)}

				{isShowOrderType ? (
					<Col>
						{/* 嵌套结构与校验信息 */}
						<Form.Item className={'pub-custom-select ' + (orderType || orderType == 0 ? 'select-have-val' : '')}>
							<Form.Item
								name="orderType"
								rules={i18FormRules}
								noStyle // 为 true 时不带样式，作为纯字段控件使用
							>
								<Select
									allowClear
									className="w260"
									onChange={(v) => setOrderType(v)}
									value={orderType}
									options={orderTypeList}
									getPopupContainer={(trigger) => trigger.parentNode}
								/>
							</Form.Item>
							<div className="pub-custom-holder pub-input-required">{iOrderType}</div>
						</Form.Item>
					</Col>
				) : (
					<PostalCode />
				)}

				<Col>
					<Form.Item name="companyName" className="mb20" rules={[{ required: Boolean(orderType == 1), message: iRequired }]}>
						<CustomInput
							className="form-control w260"
							type="text"
							autoComplete="new-password"
							suffix={<div className={'pub-custom-holder ' + (orderType == 1 ? 'pub-input-required' : '')}>{iCompanyName}</div>}
						/>
					</Form.Item>
				</Col>
				{/* 邮政编码 */}
				{isShowOrderType && <PostalCode />}
			</Row>
			{isShowSame && (
				<div className="mt-5">
					<Checkbox checked={sameAddres} onChange={handleChangeSameAddress} style={{ marginRight: '10px' }}>
						<span className="pub-color555">{isShippingAddress ? iAddressSame1 : iAddressSame2}</span>
					</Checkbox>
				</div>
			)}
			{/* 是否展示默认地址勾选框 */}
			{isShowDefault && (
				<div className="mb30">
					<Checkbox checked={defaultAddres} onChange={handleChangeSetDefaultAddress} style={{ marginRight: '10px' }}>
						<span className="pub-color555">{iSetDefault}</span>
					</Checkbox>
				</div>
			)}

			{children}

			<Form.Item className="mb0">
				<div className="mt0 ps-add-cart-footer">
					<Button type="primary" ghost="true" className="login-page-login-btn ps-add-cart-footer-btn w150" onClick={onCancle}>
						{i18Translate('i18FunBtnText.Cancel', 'Cancel')}
					</Button>
					<Button
						// type="submit" htmlType="submit"
						ghost="true"
						className="login-page-login-btn ps-add-cart-footer-btn custom-antd-primary w150"
						onClick={handleFinishClick}>
						{iSubmit}
					</Button>
				</div>
			</Form.Item>
		</Form>
	);
};

export default AddressFormCom;
