import React, { useState } from 'react';
import { Form } from 'antd';
import useLanguage from '~/hooks/useLanguage';
import { onlyNumber } from '~/utilities/common-helpers';
import { CustomInputNumber, AlarmPrompt } from '~/components/common';

const QuantityNumberCom = () => {
	const { i18Translate } = useLanguage();
	const iRequired = i18Translate('i18Form.Required', 'Required');

	const [inputNumberValue, setInputNumberValue] = useState('');
	// 双击选中输入框内容
	const handleDoubleClick = (e) => {
		e.target.select();
	};
	const filterChinese = (value) => {
		// 过滤中文字符
		return value.replace(/[\u4e00-\u9fa5]/g, '');
	};
	const handleInputChange = (value) => {
		setInputNumberValue(value);
	};

	return (
		<div className="pub-custom-input-suffix">
			<Form.Item className={'pub-custom-select ' + (inputNumberValue ? 'select-have-val' : '')}>
				<Form.Item
					name="quantity"
					rules={[
						{
							required: true,
							message: <AlarmPrompt text={iRequired} />,
						},
					]}
					noStyle // 为 true 时不带样式，作为纯字段控件使用
				>
					{/* <InputNumber
                        className="form-control w140"
                        type="text"
                        autoComplete="new-password"
                        value={inputNumberValue}
                        // formatter={value => value ? String(value).replace(/[\u4e00-\u9fa5]/g, '') : ''}
                        // parser={value => value ? String(value).replace(/[\u4e00-\u9fa5]/g, '') : ''}
                        onKeyPress={onlyNumber}
                        onDoubleClick={handleDoubleClick}
                        onChange={handleInputChange}
                    /> */}
					<CustomInputNumber
						className="form-control w140"
						type="text"
						autoComplete="new-password"
						value={inputNumberValue}
						onKeyPress={onlyNumber}
						onDoubleClick={handleDoubleClick}
						onChange={handleInputChange}
					/>
				</Form.Item>
				<div className="pub-custom-holder pub-input-required">{i18Translate('i18PubliceTable.Quantity', 'Quantity')}</div>
			</Form.Item>
		</div>
	);
};

export default QuantityNumberCom