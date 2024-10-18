import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useCookies } from 'react-cookie';
import { Form, Input, Button, Row, Col } from 'antd';

import QuoteRepositry from '~/repositories/zqx/QuoteRepositry';

import { CustomInput, CloudflareTurnstile } from '~/components/common';
import MinSucTip from '~/components/ecomerce/minCom/MinSucTip';
import { Flex } from '~/components/common';

import { CORRECT_EMAIL_TIP, EMAIL_REGEX } from '~/utilities/constant';
import { onlyNumber, onlyNumberPoint, getExpiresTime } from '~/utilities/common-helpers';


import useClickLimit from '~/hooks/useClickLimit';
import useLocalStorage from '~/hooks/useLocalStorage';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
import { getCurrencyInfo } from '~/repositories/Utils';


const addCartPreview = (props) => {
	const { i18Translate, curLanguageCodeZh, getDomainsData } = useLanguage();
	const [limitDisabled, handleLimitClick] = useClickLimit();
	const { i18FormRulesTip } = useI18();
	const [saveQuoteHistroy, setSaveQuoteHistroy] = useLocalStorage('localQuoteHistroy', []);
	const [quoteHistoryLoc, setQuoteHistoryLoc] = useLocalStorage('quoteHistoryLocal', []) // 询价历史记录 

	const { TextArea } = Input;
	let {
		submitFn,
		cancelFn,
		product,
		newProduct,
		auth,
		subName,
		isShowCancle = true,
		isRepetitionShow = true,
		isShowOk = true,
		btnStyle,
		readOnly = true,
		isSaveQuteHistroy = true
	} = props
	const { isAccountLog } = auth

	const [form] = Form.useForm();
	const [recaptcha, setRecaptcha] = useState(false);
	const [isAddSuccess, setIsAddSuccess] = useState(false); // 添加成功弹窗
	const [repetitionShow, setRepetitionShow] = useState(false); // 重复弹窗
	const [repetitionItem, setRepetitionItem] = useState({}); // 重复弹窗
	const [targetPrice, setTargetPrice] = useState('');
	const [curQuantity, setCurQuantity] = useState('');
	const [isCfErr, setIsCfErr] = useState(false); // 是否验证错误
	const [cfToken, setCfToken] = useState(''); // cf人机验证通过token

	const [cookies, setCookie] = useCookies(['email', '']);
	const { email, saveQuoteHistroyC } = cookies;
	const saveQuoteHistroyArr = saveQuoteHistroyC || []
	const currencyInfo = getCurrencyInfo()

	const { name, productNo, Manufacturer } = product || {}
	const { id, productId, productName, manufacturerName } = newProduct || {}
	const currentName = newProduct?.name || productName || name || productNo || ''
	const currentManufacturer = manufacturerName || newProduct?.manufacturer?.name || Manufacturer || product?.manufacturer_slug || ''
	const currentProductId = id || productId


	const handleChange = (e) => {
		const { value } = e.target;
		setCurQuantity(value);
	};
	const handleVerify = async (token) => {
		setCfToken(token)
	};

	useEffect(() => {

		const quantity = props?.quantity || ''

		setCurQuantity(quantity)
		form.setFieldsValue({
			partNum: currentName,
			manufacturer: currentManufacturer,
			targetPrice: '',
			remark: '',
			quantity,
			email: email || '',
		});
	}, [props, email]);

	// 编辑修改
	const editRfq = () => {
		setRepetitionShow(false)
		console.log(repetitionItem, 'repetitionItem----del')
		setCurQuantity(!Number(repetitionItem.quantity) || 1)
		setTimeout(() => {
			form.setFieldsValue({
				...repetitionItem,
				email: email || '',
			});
		}, 10)
	}

	// 关闭
	const handleCancel = () => {
		setRepetitionShow(false)
		form.resetFields()

		if (cancelFn) {
			cancelFn();
		}
	}

	const handleSubmit = async (fieldsValues) => {
		// if(!Email_Regex.test(fieldsValues.email)){
		// }
		// 部署需开启
		// if (!recaptcha) {
		//     message.error('Please check reCAPTCHA first.');
		//     return false;
		// }

		const { quantity, targetPrice, remark, partNum } = fieldsValues
		const queryEmail = isAccountLog ? cookies?.account?.account : fieldsValues?.email;
		const histroyParams = {
			productId: currentProductId, partNum: partNum || currentName, email: queryEmail, quantity, targetPrice, remark, manufacturer: currentManufacturer,
		}
		// const histroyParamsItem = {
		//     // data: [...new Set[[...saveQuoteHistroy, histroyParams]]],
		//     data: [...saveQuoteHistroy?.data, histroyParams],
		//     expiration: getExpiresTime(0.5)  // 存储过期时间的时间戳
		//   };
		// const histroyParamsItem = []

		const hisLocParams = {
			email: queryEmail,
			remark,
			yourName: 'CUSTOM',
		}

		const information = {
			...hisLocParams,
			companyName: '',
			address: '',
			phone: '',
			payment: -1,
			delivery: 0,
			message: '',
		};

		const items = [{
			productId: currentProductId,
			partNum: partNum || currentName || 'unknown',
			manufacturer: currentManufacturer || '',
			quantity,
			priceType: 0,
			targetPrice: targetPrice || '0',
			extPrice: '0',
		}]

		setIsCfErr(false)
		// 限制按钮多次点击
		await handleLimitClick(async () => {
			const responseData = await QuoteRepositry.addToQuote('', {
				information,
				items,
				languageType: getDomainsData()?.defaultLocale,
				token: cfToken,
				v: 2,
				'g-recaptcha-response': recaptcha
			});
			const { code, data } = responseData?.data || {}
			if (code === 0) {
				// 保存存储历史询价记录
				const hisLocList = items?.map(i => (
					{ ...i, ...hisLocParams, createTime: new Date().toISOString(), inquiryId: data }
				))
				setQuoteHistoryLoc([...hisLocList, ...quoteHistoryLoc])

				setIsAddSuccess(true)
				if (isSaveQuteHistroy) {
					const filterQuoteHistroyArr = saveQuoteHistroyArr?.filter(item => item?.productId !== currentProductId) // 去掉之前的
					setCookie('saveQuoteHistroyC', [...filterQuoteHistroyArr, histroyParams], { path: '/', expires: getExpiresTime(0.5) });
				}
				// 没登录才更新
				if (!isAccountLog) {
					setCookie('email', queryEmail, { path: '/' });
				}
				// setIsAddSuccess({ isAddSuccess: true })
				if (typeof submitFn === 'function') {
					// submitFn();
				}
			} else {
				setIsCfErr(true)
			}
		})
	}

	const handleHideModal = (e) => {
		e && e.preventDefault();
		setIsAddSuccess(false);
		if (cancelFn) {
			cancelFn();
		}
	};

	const handleDoubleClick = e => {
		e.target.select();
	}

	useEffect(() => {
		// 之前是否有相同的询价
		const repetition = isSaveQuteHistroy ? saveQuoteHistroyArr?.find(item => item?.productId === currentProductId) : undefined
		if (repetition) {
			setRepetitionShow(true)
			setRepetitionItem(repetition)
		} else {
			setRepetitionShow(false)
			setRepetitionItem({})
		}
	}, [])
	const iRequired = i18Translate('i18Form.Required', 'Required')
	const iPartNumber = i18Translate('i18PubliceTable.PartNumber', 'Part Number')
	const iManufacturer = i18Translate('i18PubliceTable.Manufacturer', 'Manufacturer')
	const iQuantity = i18Translate('i18PubliceTable.Quantity', 'Quantity')
	const iEmail = i18Translate('i18Form.Email', 'Email')
	const iRemark = i18Translate('i18Form.Remark', 'Remark')
	const iCancel = i18Translate('i18FunBtnText.Cancel', 'Cancel')
	const iSubmitQuote = i18Translate('i18Form.Submit Quote', 'Submit Quote')
	const iTargetPrice = i18Translate('i18PubliceTable.Target Price', 'Target Price')

	const iReceivedRfq = i18Translate('i18AboutProduct.ReceivedRfq', 'We have received your RFQ.')
	const iReceivedRfq1 = i18Translate('i18AboutProduct.ReceivedRfqTip1', 'Our sales representative will contact you within 1 business day via email.')
	const iReceivedRfq2 = i18Translate('i18AboutProduct.ReceivedRfqTip2', "Please check your email for the latest status of the RFQ. ")
	const iReceivedRfq3 = i18Translate('i18AboutProduct.ReceivedRfqTip3', "If you need to make any changes to the RFQ, please click the button below.")
	const iThankYou = i18Translate('i18SmallText.Thank you', "Thank you.")
	const iOK = i18Translate('i18FunBtnText.OK', "OK")
	const iEditRFQ = i18Translate('i18FunBtnText.Edit RFQ', "Edit RFQ")



	return (
		<div className="">
			<div className="ps-section__title">
				<h4></h4>
			</div>
			{
				(!repetitionShow && !isAddSuccess) && (
					<div className="ps-section__content clearfix">
						<Form
							form={form}
							onFinish={handleSubmit}
							labelCol={{
								style: { width: 110 }
							}}
							className='pub-custom-input-suffix'
						>
							<Row gutter={20}>
								<Col span="24">
									<Form.Item
										name="partNum"
										className='mb20'
									>
										<CustomInput
											className="form-control"
											type="text"
											// defaultValue={currentName}
											readOnly={readOnly}
											suffix={<div className='pub-custom-holder pub-input-required'>{iPartNumber}</div>}
										/>
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={20}>
								<Col span="24">
									<Form.Item
										name="manufacturer"
										className='mb20'
									>
										<CustomInput
											className="form-control"
											type="text"
											suffix={<div className='pub-custom-holder'>{iManufacturer}</div>}
										/>
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={20}>
								<Col span="12">
									<Form.Item
										name="quantity"
										className='mb20'
										rules={i18FormRulesTip()}
									>
										<CustomInput
											type='text'
											className="form-control"
											controls={false}
											maxLength={9}
											onKeyPress={onlyNumber}
											onDoubleClick={handleDoubleClick}
											onChange={handleChange}
											autoComplete="off" // 设置为 "off" 禁用浏览器输入记录
											suffix={<div className='pub-custom-holder pub-input-required'>{iQuantity}</div>}
										/>
									</Form.Item>
								</Col>
								<Col span="12">
									<Form.Item
										name="targetPrice"
										className='mb20'
									>
										<CustomInput
											type='text'
											className="form-control add-prefix"
											min={0}
											maxLength={9}
											onKeyPress={onlyNumberPoint}
											onDoubleClick={handleDoubleClick}
											controls={false}
											autoComplete="off" // 设置为 "off" 禁用浏览器输入记录
											prefix={currencyInfo.label}
											suffix={<div className='pub-custom-holder'>{iTargetPrice}</div>}
										/>
									</Form.Item>
								</Col>
							</Row>
							{
								!isAccountLog && (
									<Row gutter={20}>
										<Col span="24">
											<Form.Item
												name="email"
												className='mb20'
												rules={[
													{
														required: true,
														message: iRequired,
													},
													{
														pattern: EMAIL_REGEX,
														message: CORRECT_EMAIL_TIP
													}
												]}

											>
												<CustomInput
													type="text"
													className='form-control'
													suffix={<div className='pub-custom-holder pub-input-required'>{iEmail}</div>}
												/>
											</Form.Item>

											{/* 谷歌验证 */}
											{/* 
											<div className="form-group" 
												style={{"display":'flex',"justifyContent":"center"}}>
                        <ReCAPTCHA sitekey="6LfVNfckAAAAAC9bqCdLo_VsWk35slaHpbjtsgJN"
                      	onChange={onChange}/>
                      </div> 
											*/}
										</Col>
									</Row>
								)
							}

							<Row gutter={20}>
								<Col span="24">
									<div className="ps-quote-form">
										<div className="form-group form-input">
											{/* 嵌套结构与校验信息 */}
											<Form.Item className='pub-custom-select'>
												<Form.Item
													name="remark"
													className='mb20'
													noStyle
												>
													<TextArea
														autoSize={true}
														className='form-control'
														maxLength={256}
													/>
												</Form.Item>
												<div className='pub-custom-textarea-holder' style={{ left: '16px' }}>{iRemark}</div>
											</Form.Item>
										</div>
									</div>
								</Col>
							</Row>

							{(!curLanguageCodeZh() && curQuantity) && <div className="mt5"><CloudflareTurnstile onVerify={handleVerify} isErr={isCfErr} /></div>}

							<Flex justifyCenter={isShowCancle} className="ps-add-cart-footer custom-antd-btn-more submit" style={btnStyle}>
								{isShowCancle && <Button
									type="primary" ghost='true'
									className='ps-add-cart-footer-btn'
									onClick={handleCancel}
								>{iCancel}</Button>
								}
								<button
									type='submit' ghost='true'
									className={`custom-antd-primary login-page-login-btn product-primary-btn ${isShowCancle ? 'ps-add-cart-footer-btn' : 'w150'}`}
								>{subName || iSubmitQuote}</button>
							</Flex>
						</Form>
					</div>
				)}
			{/* isAddSuccess */}
			{
				isAddSuccess && (
					<>
						<div className='mt-10'>
							<MinSucTip
								susText={iReceivedRfq}
								subText={iReceivedRfq1}
								subText1={iReceivedRfq2 + iThankYou}
								isBottom={isShowOk}
							/>

						</div>
						{isShowOk &&
							<div className='custom-antd' style={{ textAlign: 'center' }}>
								<Button
									type="primary" ghost='true'
									className='ps-add-cart-footer-btn'
									onClick={(e) => handleHideModal(e)}
									style={{ width: '150px' }}
								>{iOK}</Button>
							</div>
						}
					</>
				)}

			{
				repetitionShow && isSaveQuteHistroy && (
					<>
						<div className='mt-10'>
							<MinSucTip
								susText={iReceivedRfq}
								subText={iReceivedRfq1 + iReceivedRfq2}
								subText1={iReceivedRfq3 + iThankYou}
							/>
						</div>

						<Flex justifyCenter={isRepetitionShow} className="ps-add-cart-footer custom-antd-btn-more" style={{ float: 'none' }}>
							<Button
								type="primary" ghost
								className={`${isRepetitionShow ? 'ps-add-cart-footer-btn' : ''} w150`}
								onClick={() => editRfq()}
							>{iEditRFQ}</Button>
							{isRepetitionShow && (
								<Button
									type="primary" ghost
									className='custom-antd-primary ps-add-cart-footer-btn w150'
									onClick={(e) => handleCancel(e)}
								>{iCancel}</Button>
							)}
						</Flex>
					</>
				)}
		</div>
	);
};


export default connect((state) => state)(addCartPreview);
