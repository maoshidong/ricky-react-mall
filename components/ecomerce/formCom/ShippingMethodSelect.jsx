import React, { useState, useEffect } from 'react';
import OrderRepository from '~/repositories/zqx/OrderRepository';
import { Form, Select } from 'antd';
import useLanguage from '~/hooks/useLanguage';

// Shipping Method 运输方式
const ShippingMethodSelectCom = ({ shippingMethodId, shippingMethodChange }) => {
	const { i18Translate } = useLanguage();
	const iSelectShippingMethod = i18Translate('i18AboutOrder2.Select Shipping Method', 'Select Shipping Method');
	i18Translate('i18Form.Required', 'Required');

	const [shippingMethodList, setShippingMethodList] = useState([]);

	const getShippingMethodList = async () => {
		const res = await OrderRepository.getDictList('sys_shipping_delivery');
		if (res?.code === 0) {
			res.data.map((item) => {
				const { dictValue, dictLabel } = item;
				item.value = dictValue;
				item.label = dictLabel;
			});
			setShippingMethodList(res?.data);
		}
	};

	useEffect(() => {
		getShippingMethodList();
	}, []);

	return (
		<Form.Item className={'pub-custom-select ' + (shippingMethodId ? 'select-have-val' : '')}>
			<Form.Item
				name="shippingWay"
				rules={[
					{
						required: true,
						message: 'Required',
					},
				]}
				noStyle
			>
				<Select
					className="w260"
					onChange={(e) => shippingMethodChange(e)}
					value={shippingMethodId} // 使用 value 属性设置选中的值
					options={shippingMethodList}
					getPopupContainer={(trigger) => trigger.parentNode}
				/>
			</Form.Item>
			<div className="pub-custom-holder pub-input-required">{iSelectShippingMethod}</div>
		</Form.Item>
	);
};

export default ShippingMethodSelectCom
