import { useState } from 'react';
import { Form, Row, Col } from 'antd';
import { CustomInput, InputNumberV2, AlarmPrompt, RequireTip } from '~/components/common';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
import { onlyNumber, uppercaseLetters } from '~/utilities/common-helpers';
import { INVALID_INPUT_TIP } from '~/utilities/constant';
import dynamic from 'next/dynamic';
import ProductRepository from '~/repositories/zqx/ProductRepository';
const QuoteBom = dynamic(() => import('~/components/partials/shop/QuoteBom')); // Bom上传
const ModuleProductsChoose = dynamic(() => import('~/components/ecomerce/modules/ModuleProductsChoose')); // Bom上传
import debounce from 'lodash/debounce';

const ShareCartCom = ({ isAccountLog }) => {
	const { i18Translate, getDomainsData } = useLanguage();
	const { iCustomerReference } = useI18();
	const iQuantity = i18Translate('i18PubliceTable.Quantity', "Quantity")

	const [form] = Form.useForm();
	const [tabActive, seTabActive] = useState('1') // 当前选中
	const [isFormComplete, setIsFormComplete] = useState(false); // 检查Add More Items按钮是否可点击
	const [addMoreData, setAddMoreData] = useState({})
	const [productList, setProductList] = useState([])
	const [isShowProductsChoose, setIsShowProductsChoose] = useState(false)
	const [isInvalid, setIsInvalid] = useState(false)
	const [PtNumber, setPtNumber] = useState()

	const handleFormChange = (changedValues, allValues) => {
		// 在表单值发生变化时执行的回调函数 every - 所有都符合才是ture, some - 有一个符合就是ture
		const isComplete = Object.keys(allValues).some((key) => {
			if (key === 'userProductTag') return false
			const fieldValue = allValues[key];
			// 根据实际情况修改字段的判断条件

			return fieldValue !== undefined && fieldValue !== '';
		});

		setIsFormComplete(isComplete);
	};
	// add more items sumbit
	const handleSubmit = async (fieldsValue) => {
		setIsInvalid(false)
		const { PartNumber, Quantity, userProductTag } = fieldsValue
		setAddMoreData({
			...addMoreData,
			PartNumber, Quantity, userProductTag,
		})
		if (!PartNumber || PartNumber.length < 3) {
			setIsInvalid(true)
			return
		}

		const iInvalid = i18Translate('i18SmallText.Invalid', "Invalid")

		if (productList?.length === 0) {
			form.setFields([
				{
					name: 'PartNumber',
					errors: [iInvalid]
				},
			]);
			return
		}
		const arr = productList?.map(item => {
			return {
				...item,
				cartQuantity: Quantity,
				userProductTag,
			}
		})
		setProductList(arr)
		setIsShowProductsChoose(true)
		setIsFormComplete(false)
		setTimeout(() => {
			form.resetFields(); // 清空表单数据
		}, 0)
	}

	// add more items sumbit 型号改变调用
	const partNumberChange = async (e) => {
		setIsInvalid(false)
		const { value } = e.target
		const _value = uppercaseLetters(value)

		form.setFieldsValue({
			PartNumber: _value,
		})

		if (_value.length >= 3) {
			const params = {
				pageListNum: 1,
				pageListSize: 20,
				languageType: getDomainsData()?.defaultLocale,
			}
			const res = await ProductRepository.getProductsSearch({
				keyword: _value.trim(),
				...params,
			});

			if (res.code === 0) {
				const { data, total } = res.data
				setProductList(data)
				setAddMoreData({
					total
				})
			}
		}
	}

	const debouncedHandleInput = debounce(partNumberChange, 100); // 在连续调用时，等待 1000 毫秒后执行函数 debouncedHandleInput
	// 而 styled-components 本质上是通过创建新的组件来应用样式的。当组件重新渲染时，styled-components 可能会重新生成新的类名，从而导致之前的样式规则失效。这也可能会影响到包裹在 styled-components 内部的表单组件，例如 <Form> 组件。
	// const CartBox = styled.div`
	// 	padding: 10px 0 10px 0px;
	// 	.cart-tabs-item {
	// 		padding: 0 20px 10px;
	// 		font-size: 14px;
	// 		font-weight: 600;
	// 		cursor: pointer;
	// 	}
	// `;

	return (
		<div>
			<div className='pub-top-label mt15'>
				<div className='pub-top-label-left'>
					<div className='sprite-icon4-cart sprite-icon4-cart-3-2'></div>
					<div className='pub-top-label-left-name ml10'>
						{i18Translate('i18SmallText.addMoreItems', "Add More Items")}
					</div>
				</div>
			</div>

			<div className='custom-antd-btn-more mb15 mt3'>
				<div className='pub-border cart-add-more box-shadow'>
					<div className='cart-tabs'>
						<div
							className={'cart-tabs-item ' + (tabActive == '1' ? 'cart-tabs-active' : '')}
							onClick={() => seTabActive('1')}
						>
							{i18Translate('i18MyCart.Manual Entry', 'Manual Entry')}
						</div>
						<div
							className={'cart-tabs-item ' + (tabActive == '2' ? 'cart-tabs-active' : '')}
							onClick={() => seTabActive('2')}
						>
							{i18Translate('i18MenuText.BOM Tools', 'BOM Upload')}
						</div>
					</div>
					{
						tabActive === '1' && (
							<Form
								form={form}
								className="ps-form-modal__account mt20"
								onValuesChange={handleFormChange}
								onFinish={handleSubmit}
								layout="vertical"
							>
								<Row gutter={20} style={{ marginLeft: '10px' }}>
									<Col>
										<div className="form-group pub-custom-input-box w240">
											<Form.Item
												name="PartNumber"
												rules={[
													{
														required: true,
														message: <AlarmPrompt text={i18Translate('i18Form.Required', 'Required')} />,
													},
												]}>
												<CustomInput
													className="form-control form-input pub-border w240"
													type="text"
													value={PtNumber}
													onChange={(e) => {
														setPtNumber(uppercaseLetters(e.target.value))
														debouncedHandleInput(e)
													}}
												/>
												<div className='pub-custom-input-holder pub-input-required'>
													{i18Translate('i18PubliceTable.PartNumber', 'Part Number')}
												</div>
											</Form.Item>
										</div>
									</Col>
									<Col>
										<div className="form-group pub-custom-input-box">
											<Form.Item
												name="Quantity"
												rules={[
													{
														required: true,
														message: <AlarmPrompt text={i18Translate('i18Form.Required', 'Required')} />,
													},
												]}>
												<div>
													<InputNumberV2
														controls={false}
														// addonAfter={null}
														min={1}
														onKeyPress={onlyNumber}
														className="pub-border"
														style={{ width: '140px', height: '35px' }}
														required={iQuantity}
													/>
												</div>
											</Form.Item>
										</div>
									</Col>
									{
										isAccountLog && (
											<Col>
												<div className="form-group form-forgot pub-custom-input-box">
													<Form.Item
														name="userProductTag"
														rules={[
															{
																message: <AlarmPrompt text={i18Translate('i18Form.Required', 'Required')} />,
															},
														]}>
														<div>
															<CustomInput
																className="form-control form-input w240"
															/>
															<div className='pub-custom-input-holder'>
																{iCustomerReference}
															</div>
														</div>
													</Form.Item>
												</div>
											</Col>
										)}
									<Col>
										<div className="form-group form-forgot pub-custom-input-nolable">
											<Form.Item>
												<button
													type="submit" ghost='true'
													className='login-page-login-btn custom-antd-primary ml10 w90'
													disabled={!isFormComplete}
												>{i18Translate('i18FunBtnText.AddToCart', "Add to Cart")}</button>
											</Form.Item>
										</div>
									</Col>
								</Row>
								{isInvalid && <RequireTip style={{ width: 'max-content', marginLeft: '20px', marginTop: '-9px' }} isAbsolute={false} text={i18Translate('i18Head.enterLimit', INVALID_INPUT_TIP)} />}
							</Form>
						)
					}
					{
						tabActive === '2' && (
							<div className='ps-quote' style={{ background: 'none', paddingBottom: '0px' }}>
								<QuoteBom isBorder={false} isBoxShadow={false} />
							</div>
						)
					}
				</div>
			</div>

			{
				isShowProductsChoose && (
					<ModuleProductsChoose
						isShowProductsChoose={isShowProductsChoose}
						cancelModule={() => setIsShowProductsChoose(false)}
						// submitProductsChoose={submitProductsChoose}
						productList={productList}
						moreData={addMoreData}
					/>
				)
			}
		</div>
	)
}

export default ShareCartCom