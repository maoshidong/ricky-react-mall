import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Modal, Form, Input, Button, Checkbox } from 'antd';
import { CustomInput, CloudflareTurnstile } from '~/components/common';
import Link from 'next/link';


import useAccount from '~/hooks/useAccount';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
import useLocalStorage from '~/hooks/useLocalStorage'

import { AccountRepository } from '~/repositories';
import FacebookLoginCom from '~/components/partials/account/FacebookLoginCom'; // facebook登录组件
import GoogleLoginCom from '~/components/partials/account/GoogleLoginCom'; // google登录组件

import { REGISTER, RETRIEVE_PASSWORD } from '~/utilities/sites-url';
import styles from '~/scss/module/_account.module.scss'

const LoginModal = ({ visible, onCancel, onLogin }) => {
	const { i18Translate, curLanguageCodeZh, getDomainsData } = useLanguage();
	const { useHandleLogin } = useAccount();
	const { iEmail } = useI18();
	const [quoteHistoryLoc, setQuoteHistoryLoc] = useLocalStorage('quoteHistoryLocal', []) // 询价历史记录 

	const [reactCookies] = useCookies(['rememberPassword']);
	const { account, password } = reactCookies?.rememberPassword || {};

	const [form] = Form.useForm();
	const [formAccount, setFormAccount] = useState(account || '');
	const [formPassword, setFormPassword] = useState(password || '');
	const [isRemember, setIsRemember] = useState(account || false);
	const [errMsg, setErrMsg] = useState('');

	const [isCfErr, setIsCfErr] = useState(false); // 是否验证错误
	const [cfToken, setCfToken] = useState(''); // cf人机验证通过token
	const [isShowCfToken, setIsShowCfToken] = useState(false); // 密码错误3次以后，显示验证码，输入10次以后，账号锁定30分钟

	const handleVerify = async (token) => {
		setCfToken(token)
	};
	// 如果询价邮箱和登录邮箱一致，未登录的询价绑定到账户
	// const bindQuoteList = async (token) => {
	// 	const inquiryId = quoteHistoryLoc?.map(i => i?.inquiryId)?.filter(Boolean);
	// 	// 			if(inquiryId?.length === 0) return
	// 	const res = await QuoteRepositry.apiAddHistoryToUser(token, [...new Set(inquiryId)])
	// 	if (res?.code === 0) {
	// 		// 绑定成功，清空本地询价记录
	// 		setQuoteHistoryLoc([])
	// 	}
	// }

	const onHandleLogin = (res) => {
		if (res?.code === 0) {
			// 登录成功回调
			onLogin(res?.data);
			// bindQuoteList(res?.data)
		} else {
			setIsCfErr(true)
			setErrMsg(res?.msg);
		}
	};

	const checkLogin = async (account) => {
		const checkLogRes = await AccountRepository.apiLoginCheck({ account })
		// && !cfToken
		if (checkLogRes?.code === 0 && checkLogRes?.data > 1) {
			setIsShowCfToken(true)
		} else {
			setIsShowCfToken(false)
		}
	}

	const handleOk = () => {
		form.validateFields().then((values) => {
			setIsCfErr(false)
			const { account, password } = values;
			checkLogin(account)
			// form.resetFields();
			const loginData = {
				account,
				password,
				recaptcha: false,
				isRemember,
				languageType: getDomainsData()?.defaultLocale,
				token: cfToken,
			};
			useHandleLogin(loginData, onHandleLogin);
			// onLogin(values);
		});
	};

	const onChangeRemember = (e) => {
		setIsRemember(e.target.checked);
	};

	useEffect(() => {
		if (visible) {
			form.setFields([
				{
					name: 'account',
					value: formAccount || '',
				},
				{
					name: 'password',
					value: formPassword || '',
				},
			]);
		}
	}, [visible]);
	const iLogin = i18Translate('i18MenuText.Login', 'LOGIN');
	const iMustRegisterTip = i18Translate('i18Login.MustRegisterTip', 'Before you can continue you must register or login now');
	const iPassword = i18Translate('i18Login.Password', 'Password');
	const iRemembeMe = i18Translate('i18Login.Remember me', 'Remember me');
	const iRetrievePassword = i18Translate('i18Login.Retrieve password', 'Retrieve password');
	const iNoAccountTip = i18Translate('i18Login.NoAccountTip', "Don't have an account?");
	const iRegisterNow = i18Translate('i18Login.Register now', 'Register now');

	// maskClosable	点击蒙层是否允许关闭
	return (
		<Modal
			centered
			title={iLogin}
			open={visible}
			onCancel={onCancel}
			// maskClosable	点击蒙层是否允许关闭
			closeIcon={<i className="icon icon-cross2"></i>}
			footer={null}
			className="pub-custom-input-box"
			width="440px"
			onFinish={handleOk}
		>
			<div className="mb10 pub-font14">{iMustRegisterTip}</div>
			{errMsg && <div className="pub-danger mb15">{errMsg}</div>}
			<Form form={form}>
				<Form.Item name="account" rules={[{ required: true, message: i18Translate('i18Form.Required', 'Required') }]}>
					<div>
						<CustomInput value={formAccount} onChange={(e) => setFormAccount(e.target.value)} />
						<div className="pub-custom-input-holder pub-input-required">{iEmail}</div>
					</div>
				</Form.Item>
				<Form.Item
					name="password"
					rules={[{ required: true, message: i18Translate('i18Form.Required', 'Required') }]}
					className={'mt20 pub-custom-select ' + (formPassword ? 'select-have-val' : '')}
				>
					<div className={'pub-custom-select ' + (formPassword ? 'select-have-val' : '')}>
						{/* .Password */}
						<Input.Password value={formPassword} onChange={(e) => setFormPassword(e.target.value)} />
						{/* <Input
                    value={formPassword}
                    onChange={e => setFormPassword(e.target.value)}
                /> */}
						<div className="pub-custom-input-holder pub-input-required">{iPassword}</div>
					</div>
				</Form.Item>
				<div className={`${styles['login-page-manage']}`} style={{ marginTop: '-10px' }}>
					<div className="pub-flex-align-center">
						<Checkbox checked={isRemember} onChange={onChangeRemember}>
							<div className="pub-color555 pub-color-hover-link">{iRemembeMe}</div>
						</Checkbox>
					</div>
					<Link href={`${RETRIEVE_PASSWORD}/?retrieveState=` + 1}>
						<a className="retrieve-password pub-color-hover-link">{iRetrievePassword}？</a>
					</Link>
				</div>
			</Form>

			{(!curLanguageCodeZh() && isShowCfToken) && <div className="mt20"><CloudflareTurnstile onVerify={handleVerify} isErr={isCfErr} isShowTip={false} /></div>}

			<div className="ps-add-cart-footer custom-antd-btn-more">
				<Button type="primary" ghost className="custom-antd-primary percentW100" onClick={handleOk}>
					{i18Translate('i18MenuText.Login', 'Login')}
				</Button>
			</div>

			{!curLanguageCodeZh() && <>
				<div className="mt20">
					<FacebookLoginCom onLoginCallback={onLogin} />
				</div>
				<div className="mt20">
					<GoogleLoginCom onLoginCallback={onLogin} />
				</div>
			</>
			}

			<div className="mt60 pub-flex-center pub-font13">
				<div className="pub-color555">{iNoAccountTip}</div>
				<Link href={`${REGISTER}`}>
					<a className="ml10 pub-color-link">{iRegisterNow}</a>
				</Link>
				{/* <div className='ml10 pub-color-link'></div> */}
			</div>
		</Modal>
	);
};

export default LoginModal