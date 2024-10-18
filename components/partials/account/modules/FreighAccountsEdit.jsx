import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Button, Radio, Checkbox, Space, Select } from 'antd'; //Row, Col,
import { CustomInput, Flex } from '~/components/common';
import AccountRepository from '~/repositories/zqx/AccountRepository';
import { REMARK_MAX_LENGTH } from '~/utilities/constant';
import useLanguage from '~/hooks/useLanguage';
import useApi from '~/hooks/useApi';
import useI18 from '~/hooks/useI18';

const FreighAccountsEditCom = ({ token, visible, handleCancel, handleSubmit, otherParams }) => {
	const { i18Translate } = useLanguage();
	const iAddAnAccount = i18Translate('i18AboutOrder2.Add an Account', 'ADD AN ACCOUNT');
	const iRemark = i18Translate('i18Form.Remark', 'Remark');
	const iSetDefault = i18Translate('i18OrderAddress.Set Default', ' Set Default');
	const iRequired = i18Translate('i18Form.Required', 'Required');
	const { iDeliveryInformation } = useI18();
	const { customerShipment, getCustomerSelectedShipment } = useApi();

	const [form] = Form.useForm();
	const { currentRecord, custDeliveryList, list } = otherParams || {}; // shipping billing

	const [isDefault, setIsDefault] = useState((list?.length === 0 || currentRecord?.isDefault ? true : false) ? true : false); // 地址是否默认
	const [isloading, setIsloading] = useState(false);
	const [shippingType, setShippingType] = useState(custDeliveryList?.[0]?.value || '');
	const [shipmentType, setShipmentType] = useState(null); // 客选发货: 0 自行自提 ,1 配送指定

	useEffect(() => {
		getCustomerSelectedShipment();

		return () => {
			setShipmentType(null);
		};
	}, []);

	const onChangeDefault = (e) => {
		setIsDefault(e.target.checked);
	};

	const handleOk = async (fieldsValues) => {
		if (isloading) {
			return;
		}
		setIsloading(true);
		const params = {
			...fieldsValues,
			remark: fieldsValues?.remark || '',
			isDefault: isDefault || list?.length === 0 ? 1 : 0,
			isOther: shippingType == 0 ? 1 : 0, // shippingType == 0 代表其它
			shippingType: Number(shippingType),
			shipmentType: shipmentType,
		};
		const res = await AccountRepository.addDelivery(params, token);
		setIsloading(false);
		if (res?.code === 0) {
			handleSubmit();
		}
	};

	useEffect(() => {
		form.setFieldsValue({
			...currentRecord,
		});
		if (!currentRecord?.id) {
			form.resetFields();
		}
	}, [currentRecord]);

	return (
		<Modal centered title={iAddAnAccount} open={visible} onCancel={(e) => handleCancel(e)} closeIcon={<i className="icon icon-cross2"></i>} footer={null} width="700px">
			<Form form={form} layout="vertical" className=" custom-antd-btn-more" autoComplete="new-password" onFinish={handleOk}>
				<Radio.Group className="" value={shippingType} onChange={(e) => setShippingType(e.target.value)} style={{ width: '100%' }}>
					<Space direction="vertical" style={{ width: '100%' }}>
						{custDeliveryList.map((item) => {
							return (
								<Flex style={{ width: '100%' }}>
									<Radio key={item.value} value={item.value} className="mb5">
										<div className="pt-10 mr10" style={{ height: '35px' }}>
											{item.label} {item?.value !== 0 && '#'}
										</div>
									</Radio>
									<div className="pub-flex pub-custom-input-suffix">
										{shippingType === item.value ? (
											<Flex gap={10} style={{ height: '35px' }}>
												{item?.value === 0 ? (
													<Form.Item className={'pub-custom-select ' + (shipmentType != null ? 'select-have-val' : '')}>
														<Form.Item name="shipmentType" className="mb0" rules={[{ required: true, message: iRequired }]} noStyle>
															<Select
																className="w200"
																value={shipmentType}
																onChange={setShipmentType}
																options={customerShipment}
																getPopupContainer={(trigger) => trigger.parentNode}
															/>
														</Form.Item>
														<div className="pub-custom-holder pub-input-required">{iRequired}</div>
													</Form.Item>
												) : (
													<Form.Item name="account" className="mb0" rules={[{ required: true, message: iRequired }]}>
														<CustomInput
															className="form-control ml0 w200"
															suffix={<div className="pub-custom-holder pub-input-required">{i18Translate('i18AboutOrder2.Courier Account', 'Courier Account')}</div>}
														/>
													</Form.Item>
												)}

												<Form.Item name="remark" className="mb0" rules={[{ required: +item?.value !== 0 ? false : true, message: iRequired }]}>
													<CustomInput
														maxLength={REMARK_MAX_LENGTH}
														className={`form-control ml0 ${item?.value !== 0 ? 'w200' : 'w350'}`}
														suffix={
															<div className={`pub-custom-holder ${item?.value !== 0 ? '' : 'pub-input-required'}`}>
																{item?.value !== 0 ? iRemark : iDeliveryInformation}
															</div>
														}
													/>
												</Form.Item>
											</Flex>
										) : null}
									</div>
								</Flex>
							);

							// 	<div className="pub-flex pub-custom-input-suffix">

							// 		{shippingType === item.value ? (
							// 			<Flex gap={10}>
							// 				{item?.value === 0 ? (
							// 					<Form.Item className={'pub-custom-select ' + (shipmentType != null ? 'select-have-val' : '')}>
							// 						<Form.Item name="shipmentType" className="mb0" rules={[{ required: true, message: iRequired }]} noStyle>
							// 							<Flex>
							// 								<Select
							// 									className="w200"
							// 									value={shipmentType}
							// 									onChange={setShipmentType}
							// 									options={customerShipment?.map((cs, key) => {
							// 										return { label: cs, value: key };
							// 									})}
							// 									getPopupContainer={(trigger) => trigger.parentNode}
							// 								/>
							// 							</Flex>
							// 						</Form.Item>
							// 						<div className="pub-custom-holder pub-input-required">{iRequired}</div>
							// 					</Form.Item>
							// 				) : (
							// 					<Form.Item name="account" className="mb0" rules={[{ required: true, message: iRequired }]}>
							// 						<CustomInput
							// 							className="form-control ml0 w200"
							// 							suffix={<div className="pub-custom-holder pub-input-required">{i18Translate('i18AboutOrder2.Courier Account', 'Courier Account')}</div>}
							// 						/>
							// 					</Form.Item>
							// 				)}

							// 				<Form.Item name="remark" className="mb0" rules={[{ required: item?.value !== 0 ? false : true, message: iRequired }]}>
							// 					<CustomInput
							// 						maxLength={REMARK_MAX_LENGTH}
							// 						className={`form-control ml0 ${item?.value !== 0 ? 'w200' : 'w350'}`}
							// 						suffix={<div className="pub-custom-holder">{item?.value !== 0 ? iRemark : iDeliveryInformation}</div>}
							// 					/>
							// 				</Form.Item>
							// 			</Flex>
							// 		) : null}
							// 	</div>
							// </Radio>
						})}
					</Space>
				</Radio.Group>

				{list?.length !== 0 && (
					<div className="mt10">
						<Checkbox checked={isDefault} onChange={onChangeDefault}>
							<span className="ml2 pub-color555">{iSetDefault}</span>
						</Checkbox>
					</div>
				)}

				<Form.Item>
					<div className="ps-add-cart-footer">
						<Button type="primary" ghost="true" className="login-page-login-btn ps-add-cart-footer-btn w150" onClick={handleCancel}>
							{i18Translate('i18FunBtnText.Cancel', 'Cancel')}
						</Button>
						<button type="submit" ghost="true" className="login-page-login-btn ps-add-cart-footer-btn custom-antd-primary w150">
							{i18Translate('i18FunBtnText.Save', 'Save')}
						</button>
					</div>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default connect((state) => state.auth)(FreighAccountsEditCom);