import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// import zxcvbn from 'zxcvbn';
import AccountRepository from '~/repositories/zqx/AccountRepository';
import { useRouter } from 'next/router';
import { withCookies } from 'react-cookie';
import { Form } from 'antd'; // Input
import { CustomInput, AlarmPrompt } from '~/components/common';
import { getEnvUrl, LOGIN, REGISTER } from '~/utilities/sites-url';
import { decrypt } from '~/utilities/common-helpers';

import LogoCom from '~/components/shared/headers/zqx/LogoCom';
import useLanguage from '~/hooks/useLanguage';

import { changeServerSideLanguage } from '~/utilities/easy-helpers';

const AccountRegisterPage = ({ cookies }) => {
	const { i18Translate, getDomainsData } = useLanguage();
	const iSignUp2 = i18Translate('i18Login.SignUp1', 'Sign Up (Step 2 of 2)')
	const iVerifyCodeFailed = i18Translate('i18Login.VerifyCodeFailed', 'Email verify code send failed!')
	const iRegister = i18Translate('i18MenuText.Register', 'Register')
	const iVerifyYourEmail = i18Translate('i18Login.Verify your email', 'Verify your email')
	const iEnterCodeTip = i18Translate('i18Login.EnterCodeTip', 'Please check your inbox and enter code below')
	const iRequired = i18Translate('i18Form.Required', 'Required')
	const iCode = i18Translate('i18Login.Code', 'Enter Code')
	const iCancel = i18Translate('i18FunBtnText.Cancel', "Cancel")
	const iNoVerificationTip = i18Translate('i18Login.NoVerificationTip', "Didn't receive the verification code?")
	const iResend = i18Translate('i18Login.Resend', "Resend")
	const iS = i18Translate('i18SmallText.s', "s")
	const iToRetry = i18Translate('i18Login.to retry', "to retry")

	const Router = useRouter();
	const { query } = Router;
	const [form] = Form.useForm();
	// const query = queryToObj(Router.asPath)
	// const [newCouponCode, setNewCouponCode] = useState(query.couponCode)

	const [checkTipText, setCheckoutTipText] = useState('')
	const [showCheckTip, setShowcheckTip] = useState(false)
	const [code, setCode] = useState(null);
	const [email, setEmail] = useState(null);
	const [password, setPassword] = useState('')

	const [countdown, setCountdown] = useState(60); // 初始倒计时时间为60秒

	// 注册
	const handleLoginSubmitNew = async () => {
		cookies.set('email', email, { path: '/' });
		const params = {
			email,
			password,
			confirmPassword: password,
			code,
			v: 2, languageType: getDomainsData()?.defaultLocale
		}

		const res = await AccountRepository.registerRequest(params);

		if (res && res.code == 0) {
			setTimeout(function () {
				Router.push(`${getEnvUrl(LOGIN)}?state=` + '3')
			}.bind(this), 0);
		} else {
			form.setFields([
				{
					name: 'code',
					value: form.getFieldValue('code'),
					errors: [res.msg]
				}
			]);
		}
	}

	// 重新发送验证码
	const handleResendCode = async () => {
		form.setFields([
			{
				name: 'code',
				errors: []
			}
		]);
		if (!email) return
		const data = {
			email,
			type: 'reg',
			languageType: getDomainsData()?.defaultLocale,
		};
		const res = await AccountRepository.sendEmailCode(data);
		if (res && res.code === 0) {
			setCountdown(60)
		} else {
			setShowcheckTip(true)
			setCheckoutTipText(res?.msg || { iVerifyCodeFailed })
		}
	}

	const handleCancel = () => {
		Router.push(`${getEnvUrl(REGISTER)}`)
	}

	useEffect(() => {
		if (query.email) {
			setEmail(decrypt(query.email))
			setPassword(decrypt(query.password))
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


	return (

		<div className="login-page-box custom-antd-btn-more">
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
				<div className="login-page-name">{iRegister}</div>
			</div>
			<div className="login-page-content only-bottom-border">
				<Form
					form={form}
					onFinish={handleLoginSubmitNew}
					className="pub-ant-input-padding0"
				>
					<div className="login-page-handle-box login-sign-up">
						<div className="login-sign-up-title">{iVerifyYourEmail}</div>
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
									message: <AlarmPrompt text={iRequired} style={{ margin: 0 }} />,
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

							{/* <button disabled={}>获取验证码</button>
                                <span>{countdown === 0 ? '' : `${countdown}秒后重新获取`}</span> */}
						</div>
						<div className="submit">
							<button
								type="submit" ghost="true"
								className='login-page-login-btn custom-antd-primary'
							>{iSignUp2}</button>
						</div>
						<div className="login-cancel" onClick={handleCancel}>{iCancel}</div>
					</div>
				</Form>
			</div>
		</div>

	)
}

export default withCookies(AccountRegisterPage)
export async function getServerSideProps({ req }) {
	const translations = await changeServerSideLanguage(req)

	return {
		props: {
			...translations,
		}
	}
}