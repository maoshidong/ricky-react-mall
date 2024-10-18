
import { useEffect, useState } from 'react'
import { Form, Row, Col } from 'antd'
import TextArea from 'antd/lib/input/TextArea';
import { Flex, AlarmPrompt, CustomInput, RequireTip, CloudflareTurnstile } from '~/components/common'
import { MinModalTip } from '~/components/ecomerce'
import { EMAIL_REGEX, CORRECT_EMAIL_TIP } from '~/utilities/constant';
import { helpersFormNoError, uppercaseLetters, handleMomentTime } from '~/utilities/common-helpers';

import useI18 from '~/hooks/useI18';
import useLanguage from '~/hooks/useLanguage';
import useLocalStorage from '~/hooks/useLocalStorage'
import { useCookies } from 'react-cookie';
import { QuoteRepositry } from '~/repositories';

const CreateQuote = ({
	isShow,
	onCallback,
	onCallbackDel,
	email,
	profileData,
	filterItems,
	auth,
	onSearch
}) => {
	const { curLanguageCodeZh, getDomainsData } = useLanguage();
	const { iContactInformation, iSubmitQuote, iEmailTip, iEmail, iOk,
		iReceivedRfq, iReceivedRfq1, iRemark, iFirstName, iLastName,
		iRequired, iReceivedRfq2, iThankYou, iProject, iProcessRFQ, iPartNumber } = useI18()
	const [isShowModal, setIsShowModal] = useState(isShow)
	const [isValidation, setIsValidation] = useState(false)
	const [isShowSuc, setIsShowSuc] = useState(false);
	const [emailInput, setEmailInput] = useState(email || '');
	const [remark, setRemark] = useState(''); // 备注
	const [searchName, setSearchName] = useState('');
	const [isSearchTip, setIsSearchTip] = useState(false);
	const [quoteHistoryLoc, setQuoteHistoryLoc] = useLocalStorage('quoteHistoryLocal', []) // 询价历史记录 

	const [isCfErr, setIsCfErr] = useState(false); // 是否验证错误
	const [cfToken, setCfToken] = useState(''); // cf人机验证通过token

	const [form] = Form.useForm();
	const [cookies, setCookie] = useCookies(['email', '']);

	useEffect(() => {
		let fieldV = {
			firstName: profileData?.firstName || '',
		}

		if (Boolean(email != 'undefined')) {
			fieldV.email = email || ''
		}
		// 中文只需要firstName
		if (!curLanguageCodeZh()) {
			fieldV.lastName = profileData?.lastName || ''
		}

		form.setFieldsValue(fieldV);
	}, [email, profileData])
	const handleVerify = async (token) => {
		console.log(token, 'token--222--del')
		setCfToken(token)
		// const res = await fetch('/api/verify-turnstile', {
		//   method: 'POST',
		//   headers: {
		//     'Content-Type': 'application/json',
		//   },
		//   body: JSON.stringify({ token }),
		// });

		// const data = await res.json();
		// if (data.success) {
		//   console.log('Turnstile verified');
		// } else {
		//   console.log('Turnstile verification failed');
		// }
	};
	// console.log(cookies, 'cookies--222--del')
	// 添加询价
	const handleSubmitClick = () => {
		setIsCfErr(false)
		form.validateFields().then(async (values) => {
			const trueEmail = values?.email || cookies?.account?.account
			setCookie('email', trueEmail, { path: '/' });
			const hisLocParams = {
				email: trueEmail,
				remark: values?.remark,
				yourName: values?.firstName + ',' + values?.lastName || '',
			}

			const contact = {
				...hisLocParams,
				companyName: '',
				address: '',
				phone: '',
				payment: -1,
				delivery: 0,
				message: '',
			};

			const res = await QuoteRepositry.addToQuote(auth.token, {
				information: contact,
				items: filterItems,
				token: cfToken,
				languageType: getDomainsData()?.defaultLocale,
			});
			const { code, data } = res?.data || {}
			if (code === 0) {
				// 保存存储历史询价记录
				const hisLocList = filterItems?.map(i => (
					{ ...i, ...hisLocParams, createTime: new Date().toISOString(), inquiryId: data }
				))
				console.log(hisLocList, 'hisLocList--222--del')
				setQuoteHistoryLoc([...hisLocList, ...quoteHistoryLoc])

				setIsShowSuc(true);
				// form.resetFields()
				form.setFields([
					{
						name: 'remark',
						value: '',
					},
				]);
				onCallbackDel?.() // 询价成功,删除
			} else {
				setIsCfErr(true)
			}

			// handleCancel()
		}).catch((e) => {
			console.log(e)
			setIsValidation(true)
		});
	}

	// 取消弹窗
	const handleCancel = () => {
		onCallback?.()
		setIsShowModal(false)
	}

	// Ok确认后，关闭弹窗
	const handleOk = () => {
		handleCancel()
	}

	// 搜索输入框输入框变化时触发
	const searchChange = (e) => {
		setIsSearchTip(false);
		const v = uppercaseLetters(e.target.value)
		setSearchName(v);
	};

	// 搜索图标点击
	const handleSearch = (e) => {
		console.log(searchName, 9090)
		if (!searchName || searchName.length < 3) {
			setIsSearchTip(true);
			return;
		}

		onSearch?.(searchName);
		handleCancel();
	}

	// 备注
	const handleRemarkChange = (e) => {
		e.preventDefault();
		setRemark(e.target.value);
	}

	// 校验邮箱是否正确
	const validateEmail = (_, value) => {
		// 如果没有输入值，则直接返回 Promise.resolve()，
		// 表示校验通过（Ant Design 中规定 required 由单独的 rules 完成）
		if (!value) {
			return false;
		}
		const emailRegex = /^\S+@\S+\.\S+$/;
		if (emailRegex.test(value)) {
			return true;
		}
		// 格式不正确时返回 Promise.reject() 并提供错误信息
		return false;
	};

	// 邮箱验证
	const checkEmail = (e) => {
		e.preventDefault();
		setEmailInput(e.target.value);
		if (validateEmail(_, e.target.value)) {
			form.setFields([
				{
					name: 'email',
					errors: [],
				},
			]);
		} else {
			form.setFields([
				{
					name: 'email',
					errors: ['Please input a valid email!'],
				},
			]);
		}
	};



	const colFirstName = () => {
		return <Form.Item
			className="mb0"
			name='firstName'
			rules={[{ required: true, message: <AlarmPrompt text={iRequired} style={{ marginBottom: 0 }} /> }]}
		>
			<CustomInput
				className={"form-control " + (curLanguageCodeZh() ? 'percentW100' : 'percentW100')}
				style={{ background: "white" }}
				type="text"
				onChange={() => { }}
				suffix={
					<div>
						<div className="pub-custom-holder pub-input-required">{iFirstName}</div>
					</div>
				}
			/>
		</Form.Item>
	}
	const colLastName = () => {
		return <Form.Item
			className="mb0"
			name='lastName'
			rules={[{ required: true, message: <AlarmPrompt text={iRequired} style={{ marginBottom: 0 }} /> }]}
		>
			<CustomInput
				className="form-control percentW100"
				style={{ background: "white" }}
				type="text"
				onChange={() => { }}
				suffix={
					<div>
						<div className="pub-custom-holder pub-input-required">{iLastName}</div>
					</div>
				}
			/>
		</Form.Item>
	}

	return <>
		<MinModalTip
			width={610}
			isShowTipModal={isShowModal}
			tipTitle={iContactInformation}
			isChildrenTip
			handleOk={isShowSuc ? handleOk : handleSubmitClick}
			submitText={isShowSuc ? iOk : iSubmitQuote}
			showCancel={!isShowSuc}
			onCancel={handleCancel}
		>
			<Form form={form} autoComplete="off" onFinish={handleSearch}>
				{/* 提交成功后 */}
				{isShowSuc && <>
					<div className='ps-quote' style={{ background: 'white' }}>
						<Flex column className="success-quote mt20">
							<Flex>
								<div className="sprite-icon4-cart sprite-icon4-cart-1-14" />
								<div className="success-quote-title ml10">
									<div className="thank-you-text pub-fontw">{iReceivedRfq}</div>
									<div className="pub-color555 pub-font13">{iReceivedRfq1}</div>
									<div className="pub-color555 pub-font13">
										{iReceivedRfq2}{iThankYou}
									</div>
								</div>
							</Flex>
						</Flex>

						<Flex column className="success-quote mt20">
							<Flex justifyStart>
								<div className="sprite-doubt-icon sprite-doubt-icon-2-5" />
								<div className="success-quote-title ml10">
									<div className="success-quote-title pub-color18">{iProject}</div>
									<div className="pub-color555 pub-font13">
										{iProcessRFQ}
									</div>

									<div className="pub-search mt20 quote-part-search-top w300">
										<CustomInput
											id='partNumber'
											onChange={(e) => searchChange(e)}
											className="form-control pub-search-input w300"
											placeholder={iPartNumber}
											value={uppercaseLetters(searchName)}
										/>
										<div className={'pub-search-icon sprite-icons-1-3'} onClick={() => handleSearch('true')} />
									</div>
									{isSearchTip && <RequireTip className='mt6' isAbsolute={false} style={{ width: 'max-content' }} />}
								</div>
							</Flex>
						</Flex>
					</div>
				</>
				}
				{/* 提交成功前 */}
				{!isShowSuc && <div className="create-quote pub-border15 pub-custom-input-suffix" style={{ padding: '0', border: 'none', background: 'transparent' }}>
					{/* <h3 className="mb10 pub-fontw pub-font16 pub-color18">{iContactInformation}</h3> */}

					<Flex column gap={isValidation ? 10 : 20} width='100%' className='custom-suffix'>
						<Row gutter={20} className='mb5'>
							{!curLanguageCodeZh() && <Col xs={24} sm={12} md={12} xl={12}>
								{colFirstName()}
							</Col>
							}
							{curLanguageCodeZh() && <Col xs={24} sm={24} md={24} xl={24}>
								{colFirstName()}
							</Col>
							}

							{!curLanguageCodeZh() && <Col xs={24} sm={12} md={12} xl={12}>
								{colLastName()}
							</Col>
							}
						</Row>
						{!auth?.isAccountLog && <div>
							<Form.Item
								name="email"
								className="mb0"
								rules={[
									{
										required: true,
										message: <AlarmPrompt text={iEmailTip} style={{ marginBottom: 0 }} />,
									},
									{
										pattern: EMAIL_REGEX,
										message: <AlarmPrompt text={CORRECT_EMAIL_TIP} style={{ marginBottom: 0 }} />,
									},
								]}
								validateTrigger="onBlur" // 设置触发验证的时机为失去焦点时
							>
								<CustomInput
									className="form-control"
									style={{ background: "white", width: '100%' }}
									type="text"
									onBlur={(e) => (
										checkEmail(e),
										form.validateFields(['email'])
									)}
									onChange={() =>
										helpersFormNoError(form, 'email')
									}
									suffix={
										<div>
											<div className="pub-custom-holder pub-input-required">{iEmail}</div>
										</div>
									}
								/>
							</Form.Item>
						</div>
						}

						<Flex className="ps-quote-form" style={{ width: '100%' }}>
							<Form.Item style={{ marginBottom: '0px', width: '100%' }}>
								<Form.Item
									name="remark"
									className="mb0"
									noStyle
								>
									<TextArea

										// rows={2} 
										autoSize={{ minRows: 2, maxRows: 6 }}
										// maxLength={6}
										className="form-control"
										style={{ width: '100%', background: 'white' }}
										maxLength={512}
										onChange={(e) => handleRemarkChange(e)}
									/>
								</Form.Item>
								<div
									className="pub-custom-textarea-holder"
									style={{ left: '16px' }}>
									{iRemark}
								</div>
							</Form.Item>
						</Flex>
					</Flex>
				</div>
				}
			</Form >
			{(!curLanguageCodeZh() && !isShowSuc) && <div className="mt20"><CloudflareTurnstile onVerify={handleVerify} isErr={isCfErr} /></div>}
		</MinModalTip >
	</>
}

export default CreateQuote