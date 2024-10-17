import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import AccountRepository from '~/repositories/zqx/AccountRepository';
import { useRouter } from 'next/router';
import { Form, Input, Popover } from 'antd';


import dynamic from 'next/dynamic';
const PasswordStrength = dynamic(() => import('~/components/partials/account/password-strength'));
const LogoCom = dynamic(() => import('~/components/shared/headers/zqx/LogoCom'));
const CustomInput = dynamic(() => import('~/components/common/input'));

import { encrypt, decrypt, helpersFormNoError } from '~/utilities/common-helpers';

import { CORRECT_EMAIL_TIP, EMAIL_REGEX } from '~/utilities/constant';
import { getEnvUrl, LOGIN } from '~/utilities/sites-url';

import useLanguage from '~/hooks/useLanguage';

import { changeServerSideLanguage } from '~/utilities/easy-helpers';

// 检查，不需要就删除， 不放到account目录下了？
const RetrievePassword = () => {
	const { i18Translate, getDomainsData } = useLanguage();
	const iEnterCodeTip = i18Translate('i18Login.EnterCodeTip', 'Please check your inbox and enter code below')
	const iRequired = i18Translate('i18Form.Required', 'Required')
	const iCode = i18Translate('i18Login.Code', 'Enter Code')
	const iCancel = i18Translate('i18FunBtnText.Cancel', "Cancel")
	const iNoVerificationTip = i18Translate('i18Login.NoVerificationTip', "Didn't receive the verification code?")
	const iResend = i18Translate('i18Login.Resend', "Resend")
	const iS = i18Translate('i18SmallText.s', "s")
	const iToRetry = i18Translate('i18Login.to retry', "to retry")
	const iPasswordNoMatch = i18Translate('i18Login.PasswordNoMatch', 'Confirmation Password does not match')
	const iEmailAddress = i18Translate('i18Form.Email Address', "Email Address")
	const iSubmit = i18Translate('i18Form.Submit', 'Submit')
	const iReseYourPassword = i18Translate('i18Login.Reset Your Password', 'Reset Your Password')
	const iVerificationTip = i18Translate('i18Login.VerificationTip', 'Verification is necessary. Please click submit button.')


	const Router = useRouter();
	const { query } = Router;

	const [form] = Form.useForm();
	const [checkTipText, setCheckoutTipText] = useState('')
	const [showCheckTip, setShowcheckTip] = useState(false)
	const [email, setEmail] = useState(null);
	const [code, setCode] = useState(null);
	const [retrieveState, setRetrieveState] = useState(query?.retrieveState || 1) // 1. 输入邮箱 2. 输入code 3. 输入密码

	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [passwordPass, setPasswordPass] = useState(false); // 密码强度

	const [countdown, setCountdown] = useState(60); // 初始倒计时时间为60秒

	const handleLoginSubmitNew = async (fieldsValue) => {
		if (retrieveState == 1) {
			handleResendCode()
			return
		}
		if (retrieveState == 2) {
			const data = {
				code,
				email,
				type: 'forgot'
			};
			const res = await AccountRepository.CheckSendCode(data);
			if (res && res.code === 0) {
				setRetrieveState(3)
				Router.push('/account/retrieve-password?email=' + encrypt(email) + '&retrieveState=' + 3 + '&code=' + encrypt(code))
			} else {
				form.setFields([
					{
						name: 'code',
						value: form.getFieldValue('code'),
						errors: [res.msg]
					}
				]);
			}
			return
		}

		let flag = true
		if (!passwordPass) {
			flag = false
			form.setFields([
				{
					name: 'password',
					value: form.getFieldValue('password'),
					errors: ['Password is invalid']
				}
			]);
		}

		if (fieldsValue['password'] !== fieldsValue['confirmPassword']) {
			flag = false
			form.setFields([
				{
					name: 'confirmPassword',
					value: form.getFieldValue('confirmPassword'),
					errors: [iPasswordNoMatch]
				}
			]);
		}
		if (!flag) return

		const params = {
			email,
			password,
			confirmPassword: password,
			code: decrypt(query?.code),
			v: 2,
		}

		const res = await AccountRepository.handleForgot(params);
		if (res && res.code == 0) {
			setTimeout(function () {
				Router.push(`${getEnvUrl(LOGIN)}?state=` + '4')
			}.bind(this), 250);
		} else {
			setShowcheckTip(true)
			setCheckoutTipText(res?.msg)
		}
	}

	// 重新发送验证码
	const handleResendCode = async () => {
		const data = {
			email,
			type: 'forgot',
			languageType: getDomainsData()?.defaultLocale,
		};
		const res = await AccountRepository.sendEmailCode(data);
		if (res && res.code === 0) {
			setCountdown(60)
			setRetrieveState(2)
			Router.push('/account/retrieve-password?email=' + encrypt(email) + '&retrieveState=' + 2)
		} else {
			setShowcheckTip(true)
			setCheckoutTipText(res?.msg)
		}
	}

	const passwordBlur = () => {
		if (!passwordPass) {
			form.setFields([
				{
					name: 'password',
					value: form.getFieldValue('password'),
					errors: ['Password is invalid']
				}
			]);
		}
		ConfirmpasswordBlur()
	}

	const ConfirmpasswordBlur = () => {
		if (password?.trim() != confirmPassword?.trim()) {
			form.setFields([
				{
					name: 'confirmPassword',
					value: form.getFieldValue('confirmPassword'),
					errors: [iPasswordNoMatch]
				}
			]);
		} else {
			form.setFields([
				{
					name: 'confirmPassword',
					value: form.getFieldValue('confirmPassword'),
					errors: []
				}
			]);
		}
	}

	const passwordChange = (flag) => {
		if (!flag && password) {
			if (!passwordPass) {
				form.setFields([
					{
						name: 'password',
						value: form.getFieldValue('password'),
						errors: ['Password is invalid']
					}
				]);
			}
			setPasswordPass(false)
		} else {
			setPasswordPass(true)
		}
	}
	const configPasswordChange = () => {

	}

	const handleCancel = () => {
		Router.push(getEnvUrl(LOGIN))
	}

	useEffect(() => {
		setRetrieveState(query?.retrieveState)
		if (query?.email) {
			setEmail(decrypt(query?.email))
		}
	}, [query])

	// 倒计时结束后清除定时器
	useEffect(() => {
		if (countdown === 0) return;

		const timer = setInterval(() => {
			setCountdown(prevCountdown => prevCountdown - 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [countdown]);

	const i18Title = i18Translate('i18Seo.retrievePassword.title', "")
	const i18Key = i18Translate('i18Seo.retrievePassword.keywords', "")
	const i18Des = i18Translate('i18Seo.retrievePassword.description', "")

	return (

		<div className="login-page-box custom-antd-btn-more">
			<Head>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />
			</Head>
			<div className="login-page-header">
				<Link href="/">
					<a className="ps-logo">
						<LogoCom />
						{/* <img
                                src={`/static/img/logo.png`}
                                alt={process.env.title}
                                title={process.env.title}
                                className="logwh"
                            /> */}
					</a>
				</Link>
				<h1 className="login-page-name">{iReseYourPassword}</h1>
			</div>
			<div className="login-page-content only-bottom-border">
				<Form
					form={form}
					onFinish={handleLoginSubmitNew}
					className="pub-ant-input-padding0"
				>
					<div className="login-page-handle-box login-sign-up">
						<div className="login-sign-up-title">{iReseYourPassword}</div>
						{retrieveState == 1 && (
							<>
								<div className="login-sign-up-email">{iVerificationTip}</div>
								{
									showCheckTip && (
										<div className="pub-error-tip">{checkTipText}</div>
									)
								}
								<Form.Item
									name="email"
									rules={[
										{
											required: true,
											message: iRequired,
										},
										{
											pattern: EMAIL_REGEX,
											message: CORRECT_EMAIL_TIP
										},
									]}
									validateTrigger="onBlur" // 设置触发验证的时机为失去焦点时
								>
									<CustomInput
										placeholder={iEmailAddress}
										onChange={e => (setEmail(e.target.value), helpersFormNoError(form, 'email'))}
									/>
								</Form.Item>
							</>
						)}


						{retrieveState == 2 && (
							<>
								<div className="login-sign-up-email">{iEnterCodeTip} {email}</div>
								{
									showCheckTip && (
										<div className="pub-error-tip">{checkTipText}</div>
									)
								}
								<Form.Item
									name="code"
									rules={[
										{
											required: true,
											message: iRequired,
										},
									]}>
									<CustomInput
										placeholder={iCode}
										onChange={e => setCode(e.target.value)}
									/>
								</Form.Item>
								<div className="login-sign-up-resend">
									{iNoVerificationTip}
									{countdown === 0 && <span className="pub-color-link" onClick={handleResendCode}>{iResend}</span>}
									{countdown !== 0 && <span className="code-retry">{countdown}{iS} {iToRetry}</span>}
									{/* <span onClick={handleResendCode}>Resend</span> */}
								</div>
							</>

						)}

						{retrieveState == 3 && (
							<div className="retrieve-state-password">
								{
									showCheckTip && (
										<div className="pub-error-tip">{checkTipText}</div>
									)
								}
								<Popover
									placement="right" trigger="click"
									content={<PasswordStrength passwordChange={passwordChange} password={password} />}
								>
									<Form.Item
										name="password"
										rules={[
											{
												required: true,
												message: iRequired,
											},
										]}>
										<Input.Password
											onBlur={e => passwordBlur(e.target.value)}
											onChange={e => setPassword(e.target.value)}
											placeholder="New Password"
										/>
									</Form.Item>
								</Popover>

								<Popover
									placement="right" trigger="click"
									content={<PasswordStrength passwordChange={configPasswordChange} password={confirmPassword} />}
								>
									<Form.Item
										name="confirmPassword"
										rules={[
											{
												required: true,
												message: iRequired,
											},
										]}>
										<Input.Password
											onBlur={e => ConfirmpasswordBlur(e.target.value)}
											onChange={e => setConfirmPassword(e.target.value)}
											placeholder="Confirm New Password"
										/>
									</Form.Item>
								</Popover>
							</div>
						)}


						<div className="submit">
							<button
								type="submit" ghost='true'
								className='login-page-login-btn custom-antd-primary'
							>{iSubmit}</button>
						</div>
						<div className="login-cancel" onClick={handleCancel}>{iCancel}</div>
					</div>
				</Form>
			</div>
		</div>

	)
}

export default RetrievePassword

export async function getServerSideProps({ req }) {
	const translations = await changeServerSideLanguage(req)

	return {
		props: {
			...translations,
		}
	}
}