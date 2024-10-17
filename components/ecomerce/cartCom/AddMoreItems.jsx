import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Form, Row, Col } from 'antd';
import { CustomInput, RequireTip } from '~/components/common';
import { onlyNumber, uppercaseLetters } from '~/utilities/common-helpers';

import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
import { INVALID_INPUT_TIP } from '~/utilities/constant';

const AddMoreItemsCom = ({ auth, callSubmit, isShowReference = false }) => {
	const { i18Translate } = useLanguage();
	const { i18FormRulesTip, iCustomerReference } = useI18();

	const { isAccountLog } = auth;
	const [isFormComplete, setIsFormComplete] = useState(false); // 检查Add More Items按钮是否可点击
	const [form] = Form.useForm();
	const [isInvalid, setIsInvalid] = useState(false);
	const [qNumber, setQNumber] = useState('');

	const handleFormChange = (changedValues, allValues) => {
		// 在表单值发生变化时执行的回调函数 every - 所有都符合才是ture, some - 有一个符合就是ture
		const isComplete = Object.keys(allValues).some((key) => {
			if (key === 'userProductTag') return false;
			const fieldValue = allValues[key];
			// 根据实际情况修改字段的判断条件
			return fieldValue !== undefined && fieldValue !== '';
		});

		setIsFormComplete(isComplete);
	};

	// 提交
	const handleSubmit = async (fieldsValue) => {
		const pNumber = fieldsValue?.['PartNumber'] || '';
		if (pNumber?.length < 3) {
			setIsInvalid(true);
			return false;
		}

		if (callSubmit) {
			callSubmit(fieldsValue);
			form.resetFields();
			setQNumber('')
		}
	};

	// 输入part Number
	const handleChangePartNumber = (e) => {
		const value = uppercaseLetters(e.target.value);
		setQNumber(value);
		form.setFields([
			{
				name: 'PartNumber',
				value: value,
			},
		]);
	};

	return (
		<Form form={form} className="ps-form-modal__account mt20" onValuesChange={handleFormChange} onFinish={handleSubmit} layout="vertical">
			<Row gutter={20}>
				<Col>
					<div className="form-group pub-custom-input-box w260">
						<Form.Item
							name="PartNumber"
							rules={i18FormRulesTip()}
						>
							<div>
								<CustomInput
									className="form-control form-input pub-border w260"
									type="text"
									value={qNumber}
									onChange={(e) => {
										handleChangePartNumber(e);
										setIsInvalid(false);
									}}
								/>
								<div className="pub-custom-input-holder pub-input-required">{i18Translate('i18PubliceTable.PartNumber', 'Part Number')}</div>
							</div>
						</Form.Item>
					</div>
				</Col>
				<Col>
					<div className="form-group pub-custom-input-box">
						<Form.Item
							name="Quantity"
							rules={i18FormRulesTip()}
						>
							<div>
								{/* InputNumber */}
								<CustomInput type="number" controls={false} addonAfter={null} min={1} onKeyPress={onlyNumber} className="pub-border" style={{ width: '140px' }} />
								<div className="pub-custom-input-holder pub-input-required">{i18Translate('i18PubliceTable.Quantity', 'Quantity')}</div>
							</div>
						</Form.Item>
					</div>
				</Col>
				{isAccountLog && isShowReference && (
					<Col>
						<div className="form-group form-forgot pub-custom-input-box">
							<Form.Item
								name="userProductTag"
								rules={[
									{
										message: i18Translate('i18Form.Required', 'Required'),
									},
								]}
							>
								<div>
									<CustomInput className="form-control form-input w240" />
									<div className="pub-custom-input-holder">{iCustomerReference}</div>
								</div>
							</Form.Item>
						</div>
					</Col>
				)}
				<Col>
					<div className="form-group form-forgot pub-custom-input-nolable">
						<Form.Item>
							<button type="submit" ghost="true" className="login-page-login-btn custom-antd-primary w110 ml10" disabled={!isFormComplete}>
								{i18Translate('i18Bom.addParts', 'Add to Parts')}
							</button>
						</Form.Item>
					</div>
				</Col>
			</Row>
			{isInvalid && (
				<RequireTip
					isAbsolute={false}
					style={{ width: 'max-content', marginTop: '-9px', marginBottom: '20px' }}
					text={i18Translate('i18Head.enterLimit', INVALID_INPUT_TIP)}
				/>
			)}
		</Form>
	);
};


export default connect((state) => state)(AddMoreItemsCom);