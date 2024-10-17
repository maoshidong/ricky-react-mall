import React, { useState } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { useCookies } from 'react-cookie';
import { Form, Input, Popover } from 'antd';

import dynamic from 'next/dynamic';
const PageContainer = dynamic(() => import('~/components/layouts/PageContainer'));
const AccountMenuSidebar = dynamic(() => import('~/components/partials/account/modules/AccountMenuSidebar'));
const PasswordStrength = dynamic(() => import('~/components/partials/account/password-strength'));


import AccountRepository from '~/repositories/zqx/AccountRepository';
import { getEnvUrl, LOGIN } from '~/utilities/sites-url'
import useClickLimit from '~/hooks/useClickLimit';
import useLanguage from '~/hooks/useLanguage';
import { changeServerSideLanguage, redirectLogin } from '~/utilities/easy-helpers';

const notMatchText = "Confirmation Password does not match"

const ChangePassword = ({ paramMap }) => {
	const { i18Translate } = useLanguage();
	const iPasswordInvalid = i18Translate('i18Login.PasswordInvalid', 'Password is invalid')
	const iPasswordNoMatch = i18Translate('i18Login.PasswordNoMatch', notMatchText)

	const [cookies, setCookie] = useCookies(['account']);
	const [form] = Form.useForm();
	const [currentPassword, setCurrentPassword] = useState('')
	const [password, setPassword] = useState('')
	const [checkTipText, setCheckoutTipText] = useState('')
	const [showCheckTip, setShowcheckTip] = useState(false)
	const [passwordPass, setPasswordPass] = useState(false); // 密码强度
	const [confirmPassword, setConfirmPassword] = useState(''); // 确认密码
	const [popoverOpen, setPopoverOpen] = useState(false); // 展示Popover

	const [limitDisabled, handleLimitDisabled] = useClickLimit();

	const passwordChange = (flag) => {
		if (!flag && password) {
			if (!passwordPass) {
				form.setFields([
					{
						name: 'password',
						value: form.getFieldValue('password'),
						errors: [iPasswordInvalid]
					}
				]);
			}
			setPasswordPass(false)
		} else {
			setPasswordPass(true)
		}
	}
	const passwordBlur = () => {
		if (!passwordPass) {
			form.setFields([
				{
					name: 'password',
					value: form.getFieldValue('password'),
					errors: [iPasswordInvalid]
				}
			]);
		}
		ConfirmpasswordBlur()
	}
	const configPasswordChange = () => {

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

	const handleSubmit = async (fieldsValue) => {

		let flag = true
		if (!passwordPass) {
			flag = false
			form.setFields([
				{
					name: 'password',
					value: form.getFieldValue('password'),
					errors: [iPasswordInvalid]
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
			email: cookies?.account?.account,
			oldPassword: fieldsValue?.currPassword,
			password: fieldsValue?.confirmPassword,
			confirmPassword: fieldsValue?.confirmPassword,
			v: 2,
		}
		if (limitDisabled) return
		handleLimitDisabled(true)
		const res = await AccountRepository.handleForgot(params);

		if (res && res.code == 0) {
			setTimeout(function () {
				Router.push(`${getEnvUrl(LOGIN)}?state=` + '4');
			}.bind(this), 250);
		}
		else {
			setShowcheckTip(true)
			setCheckoutTipText(res?.msg)
		}
		handleLimitDisabled(false)
	}
	const iMyAccount = i18Translate('i18MyAccount.My Account', 'My account')
	const iChangePassword = i18Translate('i18MyAccount.Change Password', 'Change Password')
	const iCurrentPassword = i18Translate('i18Login.Current Password', 'Current Password')
	const iNewPassword = i18Translate('i18Login.New Password', 'New Password')
	const iConfirmPassword = i18Translate('i18Login.Confirm Password', 'Confirm Password')
	const iChange = i18Translate('i18Form.Submit', 'Change')

	const i18Title = i18Translate('i18Seo.changePassword.title', "")
	const i18Key = i18Translate('i18Seo.changePassword.keywords', "")
	const i18Des = i18Translate('i18Seo.changePassword.description', "")

	return (
		<PageContainer paramMap={paramMap}>
			<Head>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />
			</Head>
			<section className="ps-my-account ps-page--account pub-minh-1 pub-bgc-f5" style={{ position: 'relative' }}>
				<div className="ps-container">
					<div className='account-title pub-fontw pub-color18'>{iMyAccount}</div>
					<div className="account-box">
						<div className="ps-page__left catalogs__top-fixed" style={{ padding: '0' }}>
							<AccountMenuSidebar />
						</div>
						<div className="ps-page__right">
							<div className="ps-page__content box-shadow">
								<div className="ps-section--account-setting pub-border15">
									<div className="ps-section__header">
										<div className='pub-left-title mb20'>{iChangePassword}</div>
									</div>
									<div className="mb15 w260">
										{
											showCheckTip && (
												<div className="mb15 pub-error-tip">{checkTipText}</div>
											)
										}
										<Form
											form={form}
											layout="vertical"
											// pub-custom-input-suffix pub-custom-input-box
											className="pub-custom-input-box"
											onFinish={handleSubmit}
											autoComplete="off" // input 使用禁用浏览器输入记录

										>
											<div className="form-group form-forgot">
												<Form.Item
													name="currPassword"
													rules={[{ required: true, message: i18Translate('i18Form.Required', 'Required') }]}
													className={'mb20 pub-custom-select ' + (currentPassword ? 'select-have-val' : '')}
												>
													<div className={'pub-custom-select ' + (currentPassword ? 'select-have-val' : '')}>
														<Input.Password
															value={currentPassword}
															onChange={e => setCurrentPassword(e.target.value)}
															autoComplete="new-password" // 密码框使用禁用浏览器输入记录
														/>
														<div className='pub-custom-input-holder pub-input-required'>{iCurrentPassword}</div>
													</div>
												</Form.Item>
											</div>
											<Popover
												open={popoverOpen === 1}
												placement="right" trigger="Hover click"
												content={<PasswordStrength passwordChange={passwordChange} password={password} />}
											>
												<div className="form-group form-forgot">
													<Form.Item
														name="password"
														rules={[{ required: true, message: iPasswordInvalid }]}
														className={'mb20 pub-custom-select ' + (password ? 'select-have-val' : '')}
													>
														<div className={'pub-custom-select ' + (password ? 'select-have-val' : '')}>
															<Input.Password
																value={password}
																className="w260"
																onChange={e => setPassword(e.target.value)}
																onBlur={e => (passwordBlur(e.target.value), setPopoverOpen(''))}
																onFocus={() => setPopoverOpen(1)} // 得到焦点展示Popover
																autoComplete="new-password" // 密码框使用禁用浏览器输入记录
															/>
															<div className='pub-custom-input-holder pub-input-required'>{iNewPassword}</div>
														</div>
													</Form.Item>
												</div>
											</Popover>

											<Popover
												open={popoverOpen === 2}
												placement="right" trigger="Hover click"
												content={<PasswordStrength passwordChange={configPasswordChange} password={confirmPassword} />}
											>
												<div className="form-group form-forgot">
													<Form.Item
														name="confirmPassword"
														rules={[{ required: true, message: iPasswordNoMatch }]}
														className={'mb20 pub-custom-select ' + (confirmPassword ? 'select-have-val' : '')}
													>
														<div className={'pub-custom-select ' + (confirmPassword ? 'select-have-val' : '')}>
															<Input.Password
																value={confirmPassword}
																className="w260"
																onChange={e => setConfirmPassword(e.target.value)}
																onBlur={e => (ConfirmpasswordBlur(e.target.value), setPopoverOpen(''))}
																onFocus={() => setPopoverOpen(2)} // 得到焦点展示Popover
																autoComplete="new-password" // 密码框使用禁用浏览器输入记录
															/>
															<div className='pub-custom-input-holder pub-input-required'>{iConfirmPassword}</div>
														</div>
													</Form.Item>
												</div>
											</Popover>

											<div className="custom-antd-btn-more mt30">
												<button
													type="submit" ghost="true"
													className='custom-antd-primary ps-add-cart-footer-btn w100'
												// style={{margin: 'left'}}
												// onClick={() => { continueFn ? continueFn() : null}}
												>{iChange}</button>
											</div>
										</Form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</PageContainer>
	)
};

export default ChangePassword;

export async function getServerSideProps({ req }) {
	const translations = await changeServerSideLanguage(req)
	// 判断是否登录,否则重定向到login
	const { account = "" } = req.cookies
	const isAccountLog = account.trim() !== "" && JSON.parse(account)?.isAccountLog
	if (!isAccountLog) {
		return redirectLogin()
	}

	return {
		props: {
			...translations,
		}
	}
}