import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import Link from 'next/link';
import { Tabs, Form, Input, Button, Checkbox, Popover } from 'antd';
import { CustomInput, CloudflareTurnstile, AlarmPrompt } from '~/components/common'
import { withCookies } from 'react-cookie';
import { useCookies } from 'react-cookie';
import { AccountRepository } from '~/repositories';
import { setPageLoading } from '~/store/setting/action';
import { useRouter } from 'next/router';

import { helpersFormNoError, encrypt } from '~/utilities/common-helpers';
import { CORRECT_EMAIL_TIP, EMAIL_REGEX } from '~/utilities/constant';
import { LOGIN, REGISTER, PRIVACY_CENTER, PRIVACY_TERMS_AND_CONDITIONS, ACCOUNT_ORDER } from '~/utilities/sites-url'


import useLocalStorage from '~/hooks/useLocalStorage';
import useAccount from '~/hooks/useAccount';
import useLanguage from '~/hooks/useLanguage';

import dynamic from 'next/dynamic';
const MinModalTip = dynamic(() => import('~/components/ecomerce/minCom/MinModalTip'));

import PasswordStrength from '~/components/partials/account/password-strength'; // 密码强度
import ReactLoadingg from '~/components/layouts/ReactLoadingg';
import LogoCom from '~/components/shared/headers/zqx/LogoCom';
import FacebookLoginCom from "~/components/partials/account/FacebookLoginCom"
import GoogleLoginCom from '~/components/partials/account/GoogleLoginCom'; // google登录组件


// 不要删
import { GoogleOAuthProvider, useGoogleLogin, GoogleLogin } from '@react-oauth/google';
import jwtDecode from "jwt-decode"; // 3.0版本引入 
// import { jwtDecode } from "jwt-decode"; // 4.0版本引入

import styles from '~/scss/module/_account.module.scss'
import stylesLoad from "~/components/layouts/_reactLoading.module.scss";

const LoginRegisterCom = (props) => {
	const { i18Translate, curLanguageCodeZh, getDomainsData } = useLanguage();
	const iRequired = i18Translate('i18Form.Required', 'Required')
	const iLogin = i18Translate('i18MenuText.Login', 'LOGIN')
	const iRegister = i18Translate('i18MenuText.register', 'REGISTER')
	const iLogin1 = i18Translate('i18MenuText.Login', 'Login')
	const iPasswordInvalid = i18Translate('i18Login.PasswordInvalid', 'Password is invalid') // THANK YOU FOR CREATING
	const iPasswordNoMatch = i18Translate('i18Login.PasswordNoMatch', 'Confirmation Password does not match')
	const iRememberMe = i18Translate('i18Login.Remember me', 'Remember me')
	const iRetrievePassword = i18Translate('i18Login.Retrieve password', 'Retrieve password')
	const iEmailAddress = i18Translate('i18Form.Email Address', 'Email Address')
	const iPassword = i18Translate('i18Login.Password', 'Password')
	const iEmailTip = i18Translate('i18Form.EmailTip', CORRECT_EMAIL_TIP)
	const iConfirmPassword = i18Translate('i18Login.Confirm Password', 'Confirm Password')
	const iSignUp1 = i18Translate('i18Login.SignUp1', 'Sign Up (Step 1 of 2)')

	const { cookies, setting, defaultKey, back403 } = props;
	const dispatch = useDispatch();

	const [loginCallBack, setLoginCallBack] = useLocalStorage('loginCallBack', '/');
	const { useHandleLogin, handleLoginToken } = useAccount();

	const [newUseCookies, setCookie] = useCookies(['rememberPassword', 'email']);
	const [form] = Form.useForm();
	const Router = useRouter();
	const { query } = Router

	const [isLogOrder, setIsLogOrder] = useState(false)   // 订单是否属于登录的账号
	// 邮件进入订单列表带过来的参数，
	useEffect(() => {
		const { loginCallBack, orderId } = query || {}
		if (loginCallBack === '1') setLoginCallBack(`${ACCOUNT_ORDER}?orderId=${orderId}`)
		if (loginCallBack === '2') {
			setIsLogOrder(true)
			setLoginCallBack(`${ACCOUNT_ORDER}?orderId=${orderId}`)
		}
	}, [query])

	// const [loading, setLoading] = useState(false)
	// const [isShowFaceBook, setIsShowFaceBook] = useState(false) // 解决在每次进入页面时都能正常加载和使用，
	const [checkTipText, setCheckoutTipText] = useState('')
	const [showCheckTip, setShowcheckTip] = useState(false)
	const [isRemember, setIsRemember] = useState(true)
	const [defaultActiveKey, setDefaultActiveKey] = useState(defaultKey || '1') // 1.登录 2.注册 3.注册成功 4. 找回

	const [passwordPass, setPasswordPass] = useState(false); // 密码强度
	const [popoverOpen, setPopoverOpen] = useState(false); // 展示Popover

	// 页面加载状态
	const { pageLoading } = setting
	const [isLoading, setIsLoading] = useState(pageLoading);
	const [isShowModal, setIsShowModal] = useState(pageLoading);

	const [isCfErr, setIsCfErr] = useState(false); // 是否验证错误
	const [cfToken, setCfToken] = useState(''); // cf人机验证通过token
	const [isShowCfToken, setIsShowCfToken] = useState(false); // 密码错误3次以后，显示验证码，输入10次以后，账号锁定30分钟

	const handleVerify = async (token) => {
		setCfToken(token)
	};

	// form 提示文本
	const RequiredTip = () => <AlarmPrompt text={iRequired} style={{ margin: 0 }} />

	useEffect(() => {
		// setIsShowFaceBook(true)
		setIsLoading(pageLoading)
		setIsShowModal(pageLoading)
	}, [pageLoading])

	// 注册
	const [email, setEmail] = useState(null);
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	const onChange = (key) => {
		const url = key === '1' ? LOGIN : REGISTER
		setDefaultActiveKey(key)
		Router.replace(url)
	};

	const onChangeRemember = e => {
		setIsRemember(e.target.checked)
	};
	// 登录回调
	const onHandleLogin = (res) => {
		// 停用
		if (res?.code === 10021) {
			dispatch(setPageLoading(false));
			back403()
			return
		}
		if (res?.code === 0) {
			if (loginCallBack === '/404') {
				Router.push('/')
				return
			}
			// 登录成功回调
			Router.push(loginCallBack);
		} else {
			dispatch(setPageLoading(false));
			// setIsCfErr(true)
			setShowcheckTip(true)
			setCheckoutTipText(res?.msg)
		}
	}

	const checkLogin = async (account) => {
		// const checkLogRes1 = await AccountRepository.apiLoginOpen({ account }) // 邮箱被锁定15分钟， 开锁
		const checkLogRes = await AccountRepository.apiLoginCheck({ account })
		// && !cfToken
		if (checkLogRes?.code === 0 && checkLogRes?.data > 1) {
			setIsShowCfToken(true)
		} else {
			setIsShowCfToken(false)
		}
	}

	// 登录、注册
	const handleLoginSubmitNew = async (e) => {
		// Router.push('/'); return
		if (defaultActiveKey != 2) {
			// 登录
			setShowcheckTip(false)
			const { account, loginPassword } = e
			checkLogin(account)

			const loginData = {
				account, password: loginPassword,
				recaptcha: false, // 谷歌验证
				isRemember,
				languageType: getDomainsData()?.defaultLocale,
				// token: '0.k2MnxomwJV2DeS9S2Jfq9dWGRh4VManC4A09eVrVfwte2IWX4_rmPmHc_mjIo-SBJbWL0bRzE23jcG3n4doJWfjSTRWImlEkpqLhczcOoyuPLDuFCJ5YiQ85w9wjP5yjXgW39P4xxfy2jBvFSUKlKO1gbwSse3RJ6gBhqAZRrAz8_HaD1BJkkLJUwAh51nB6vDQ90r9xsQ6pV5kcXgqbbzz_ajCIoAEK2sME9Z5f6jeIOMVs1IYlWMUdICh64VBdQS0iBXtTbYpMgnu1-ZuEHExxkhw-t4S5OIE4OwyLH9qp8MbIE8E6l1ojA_dwMBaji7JeqCjR5ILtvxZdw0284l8F-bTqv3PKGssqbnZIN-Oh991ridJPKyH4Cg0DIkjvk1qu53CTh4Okw77wZczqQMdjAN9BIk3P551bS1ioa4qOZZv_1XiH9gf9lEFos9G0.7nbRtRtNaf01xvpRQunoSA.e19e75a54119fc18e5ba231bd8dc1a29fcd3f9d51d127f947fc781ce60b22b9d',
				token: cfToken,
			}
			// setLoading(true)
			dispatch(setPageLoading(true));
			useHandleLogin(loginData, onHandleLogin)
		} else {
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
			if (e['password'] !== e['confirmPassword']) {
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

			const data = {
				email,
				type: 'reg',
				languageType: getDomainsData()?.defaultLocale,
			};
			const res = await AccountRepository.sendEmailCode(data);
			if (res && res.code === 0) {
				Router.push('/account/register?email=' + encrypt(e.email) + '&password=' + encrypt(e.password))
			} else {
				setShowcheckTip(true)
				setCheckoutTipText(res?.msg)
			}
		}
	};

	const handleRetrievePassword = () => {
		Router.push('/account/retrieve-password?retrieveState=' + 1)
	}
	// 不要删
	// customerType: facebook: 1, gg: 2  accountType：  facebook: 2, gg: 3 (账号密码登录： 默认1)
	// const responseFacebook = async (response) => {
	//     const accountType = 2
	//     // 处理登录成功的响应
	//     dispatch(setPageLoading(true));
	//     const { id, email, accessToken, userID, name } = response // facebook返回的数据
	//     const params = {
	//         email, accessToken, userId: userID, userName: name, accountType,
	//     }
	//     if(!id) {
	//         dispatch(setPageLoading(false));
	//         return
	//     }

	//     const res = await AccountRepository.checkOtherLogin(params);
	//     dispatch(setPageLoading(false));
	//     if(res?.code === 0) {
	//         handleLoginToken(res, email, accountType)

	//         Router.push(loginCallBack);
	//     }
	// }

	// useEffect(() => {
	//     // 清除 Facebook SDK 的初始化状态, 请注意：清除后登录就没有window.FB了
	//     delete window.FB;
	//   }, []);
	// wz136229605@gmail.com
	// wangzan123+

	// const gugeClientId = "442651506335-ghbn7h7cr7ma83uvt5uamk4tg84um7uh.apps.googleusercontent.com" // 旧的
	// const gugeClientId = "263173349798-0sg9dt7mbsd9fo624n6cfn04rc3736f6.apps.googleusercontent.com" // 新的-错误的谷歌登录邮箱   赞 (wz136229605@gmail.com)
	const gugeClientId = "327096280454-3bkjnq448g1fcuvsl80jc99luhisc58d.apps.googleusercontent.com" // 新的
	// const gugeClientId = "327096280454-adjif0o3a3q3oov4ddngv8irnq30eomc.apps.googleusercontent.com" // 新的-第二个



	// function GoogleLoginCom() {

	// 	const dispatch = useDispatch();
	// 	const { useHandleLogin, handleLoginToken } = useAccount();
	// 	const Router = useRouter();
	// 	const [loginCallBack, setLoginCallBack] = useLocalStorage('loginCallBack', '/');


	// 	const login = useGoogleLogin({
	// 		clientId: gugeClientId,
	// 		accessType: 'offline',
	// 		// scope: 'openid email profile',
	// 		prompt: 'consent', //  确保每次请求都要求用户同意权限。
	// 		onSuccess: async (response) => {
	// 			console.log('response--google--del', response)

	// 			const { email = '', access_token: accessToken } = response
	// 			const resUserInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
	// 				method: 'GET',
	// 				headers: {
	// 					Authorization: `Bearer ${accessToken}`,
	// 				},
	// 			});
	// 			// email:	"info@origin-ic.net"
	// 			// email_verified:	true
	// 			// family_name: "wang"
	// 			// given_name:	"zan"
	// 			// name:	"zan wang"
	// 			// picture:	"https://lh3.googleusercontent.com/a/ACg8ocIwozMwL4q9fIV3YRye4PIB4nW0oMIP7xW2Plx0W0CiCb-O2w=s96-c"
	// 			// sub:"107772878155226057239
	// 			const userObject = await resUserInfo.json();

	// 			// const userObject1 = jwtDecode(response.access_token); // 解析报错 "Invalid token specified: Unexpected token"
	// 			// console.log('response--22--del', userObject1)
	// 			return
	// 			// const aaa = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImIyZjgwYzYzNDYwMGVkMTMwNzIxMDFhOGI0MjIwNDQzNDMzZGIyODIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0NDI2NTE1MDYzMzUtZ2hibjdoN2NyN21hODN1dnQ1dWFtazR0Zzg0dW03dWguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0NDI2NTE1MDYzMzUtZ2hibjdoN2NyN21hODN1dnQ1dWFtazR0Zzg0dW03dWguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDE5MTMwNjM2NTAyMTkwNzU4NzEiLCJlbWFpbCI6Ind6MTM2MjI5NjA1QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYmYiOjE3MjU0MTU3MzYsIm5hbWUiOiLnjovotZ4iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSXF5R1E4VWM5bW9DbWk5Vks4V3VMVlJBbGdBSWgyYVE2MVl6WHFyU1ZFR1hMLW1BPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6Iui1niIsImZhbWlseV9uYW1lIjoi546LIiwiaWF0IjoxNzI1NDE2MDM2LCJleHAiOjE3MjU0MTk2MzYsImp0aSI6IjIzY2RkMTA0MzkxOGJlMTE1MTczOWE2MDI3ODJiMzhlZDkyN2E4MDMifQ.mMe0D5ZBechHxghCLB8Z6wvjmbSFVNAnN5_6Qqdw85C-EvWqSyqSIEIaRZnPoi8U4BifiwsccBM683HLFz5a_ZYpOb6iSYLcsqSGqK7tNLDLTtJ8MHdREJmb6HSsdIOUxDVsXwIZLYfZGotcGXhLX2IRFtn1JqEt_jcUSkdTlrO9XT5tSvVLnBrjrDbhJRjpR6ToVEgNC2JNhodEmBhNIwfjHOVwvMFWT_ZwFPSOtq1rQ-HTCPqY7LFaD5DDyQAOC4GtAZB7x7BMVrwRLZabcRlHovTRvjPl0RXRf_w4XHQOktrbyrmfZqH3XGIPEZPAFq6qh6Z3Qh1bET1pMIJ5UQ"
	// 			const params = {
	// 				email: userObject?.email, accessToken: aaa, customerType: 2, accountType: 3,
	// 			}
	// 			// 处理登录成功的响应
	// 			dispatch(setPageLoading(true));
	// 			const res = await AccountRepository.checkOtherLogin(params);
	// 			dispatch(setPageLoading(false));
	// 			if (res?.code === 0) {
	// 				handleLoginToken(res, email)
	// 				Router.push(loginCallBack);
	// 			}
	// 		},
	// 		onError: (error) => {

	// 		}
	// 	});

	// 	return <Button style={{ width: '100%' }} onClick={() => login()} className="pub-flex-center">
	// 		<div className="pub-flex-center w180">
	// 			<span className="facebook-google-2"></span>Sign in with Google
	// 		</div>
	// 	</Button>
	// }
	function LoginButton() {
		const login = useGoogleLogin({
			clientId: gugeClientId,
			accessType: 'offline',
			prompt: 'consent',
			onSuccess: async (response) => {

				// const accessToken = response.credential;
				// const userObject = jwtDecode(accessToken);
				const { email = '', access_token: accessToken } = response
				const userObject = jwtDecode(accessToken);
				// 处理登录成功的响应
				dispatch(setPageLoading(true));
				const params = {
					email: userObject.email, accessToken, customerType: 2,
				}

				const res = await AccountRepository.checkOtherLogin(params);
				dispatch(setPageLoading(false));
				if (res?.code === 0) {
					handleLoginToken(res, email)
					Router.push(loginCallBack);
				}
			},
			onError: (error) => {


			}
		});

		return <button onClick={() => login()}>Login with Google</button>;
	}

	const iTermsAndConditions = i18Translate('i18MenuText.Terms and Conditions', 'Terms and Conditions')
	const iPrivacyCenter = i18Translate('i18MenuText.Privacy Center', 'privacy Center')
	const iAnd = i18Translate('i18SmallText.And', "and")
	const iAgreedProtocol = i18Translate('i18Login.AgreedProtocol', "Login is deemed to have agreed to")

	// 登录表单
	const getLoginContent = () => {
		return (
			<div className="form-item login-page-handle pub-ant-input-padding0">
				{
					showCheckTip && (
						<div className="pub-error-tip">{checkTipText}</div>
					)
				}
				<Form.Item
					name="account"
					rules={[
						{
							required: defaultActiveKey == 1 ? true : false,
							message: <RequiredTip />,
						},
						defaultActiveKey == 1 && ({
							pattern: EMAIL_REGEX,
							message: <AlarmPrompt text={iEmailTip} />
						}),

					]}
					validateTrigger="onBlur" // 设置触发验证的时机为失去焦点时 
				>
					{/*  type="text" autoComplete="off" */}
					<CustomInput onChange={e => helpersFormNoError(form, 'account')} placeholder={iEmailAddress} />
				</Form.Item>

				<Form.Item
					name="loginPassword"
					rules={[
						{
							required: defaultActiveKey == 1 ? true : false,
							message: <RequiredTip />,
						},
					]}>
					<Input.Password autoComplete="new-password" placeholder={iPassword} />
				</Form.Item>

				<div className={`${styles['login-page-manage']}`}>
					<div>
						<Checkbox checked={isRemember} onChange={onChangeRemember} style={{ marginRight: '10px' }}>
							<span className="pub-font12 pub-color555 pub-color-hover-link">{iRememberMe}</span>
						</Checkbox>

					</div>
					{/* Router.push('/account/retrieve-password?retrieveState=' + 1) */}
					<div onClick={handleRetrievePassword} className="retrieve-password">
						<Link href={'/account/retrieve-password?retrieveState=' + 1}>
							<a className='pub-color-hover-link'>{iRetrievePassword}？</a>
						</Link>

					</div>
				</div>
				{/* && isShowCfToken */}
				{(!curLanguageCodeZh() && isShowCfToken) && <div className="mt20"><CloudflareTurnstile onVerify={handleVerify} isErr={showCheckTip} isShowTip={false} /></div>}

				<Form.Item>
					<div className="submit">
						<Button
							// loading={loading}
							type="primary" htmlType="submit" ghost='true'
							className='login-page-login-btn custom-antd-primary'
						>{iLogin1}</Button>
					</div>
				</Form.Item>
				{/* <div className="mb20 or-login-type pub-flex-align-center">
                    <div className="or-line"></div>
                    <div className="ml10 mr10">OR</div>
                    <div className="or-line"></div>
                </div> */}
				{/* Sign in with Google */}
				{/* 替换 YOUR_APP_ID 为您在 Facebook 开发者网站上创建的应用程序的 App ID - 342847434974927  密钥：e0c8e3786d0dadb2aee591879abcf114。
                autoLoad 属性设置为 false，以便用户点击按钮时触发登录流程。
                isSdkLoaded={true} 确保 Facebook SDK 已加载完毕后再执行自动登录，以避免弹框自动关闭的问题。
                fields 属性指定您希望从 Facebook 返回的用户信息字段。在示例中，我们请求用户的姓名、邮箱和头像。
                callback 属性是一个回调函数，用于处理登录成功后的响应。 */}
				{/* Sign in with Facebook */}



				{!curLanguageCodeZh() &&
					<div>
						<Form.Item>
							<FacebookLoginCom onLoginCallback={() => Router.push(loginCallBack)} />
							<div className='mt20'>
								<GoogleLoginCom onLoginCallback={() => Router.push(loginCallBack)} />
								{/* <GoogleOAuthProvider clientId={gugeClientId}>
									<GoogleLoginCom />
									<LoginButton />
								</GoogleOAuthProvider> */}
							</div>


						</Form.Item>
						{/* 用此方法登录，Your non-sensitive scopes不能勾选 .../auth/userinfo.profile  和  openid？ 勾选了调不起 */}
						{/* <Form.Item labelCol={{ span: 24 }} style={{ width: '100%' }}>

							<GoogleOAuthProvider
								clientId={gugeClientId}
								prompt='consent'
								width={'100%'}
								style={{ width: '100%' }}
							>
								<GoogleLogin
									width={'100%'}
									isSignedIn={true}
									onSuccess={async (response) => {
										console.log('response-gglogin', response)
										const accessToken = response.credential;
										const userObject = jwtDecode(accessToken);
										console.log('response-userObject', userObject)
										// return

										dispatch(setPageLoading(true));
										const accountType = 3
										const params = {
											email: userObject.email, accessToken, customerType: 2, accountType,
										}

										const res = await AccountRepository.checkOtherLogin(params);
										dispatch(setPageLoading(false));
										if (res?.code === 0) {
											handleLoginToken(res, userObject.email, accountType)
											Router.push(loginCallBack);
										}

									}}
									onError={error => console.log('error-gglogin')}
								/>
							</GoogleOAuthProvider>
						</Form.Item> */}

					</div>
				}
				{/* <div>Sign in with Facebook</div>third party
                </FacebookLogin>

                {/* <div className="submit">
                <Button
                    type="primary" ghost
                    className='login-page-login-btn custom-antd-primary'
                    style={{marginRight: '15px'}}
                    onClick={handleLoginSubmitNew}
                >Login</Button>
            </div> */}
						<span id="qqLoginBtn"></span>
				{ curLanguageCodeZh() && <img src={'/static/img/common/qqLogin.png'} alt="" />}
				<div className="login-page-privacy">
					<div>
						{iAgreedProtocol}&nbsp;
						<a href={PRIVACY_TERMS_AND_CONDITIONS} target="_blank"
							className="color-link">
							{iTermsAndConditions}
						</a>
						&nbsp;{iAnd}&nbsp;
						<a href={PRIVACY_CENTER} target="_blank" style={{ display: 'inline-block' }}
							className="color-link">
							{iPrivacyCenter}
						</a>
					</div>
				</div>
			</div >
		)
	}

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
	const configPasswordChange = () => {

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

	const items = [
		{
			key: '1',
			// label: <Link href={`${LOGIN111}`}><a className="pub-fontw">{iLogin}</a></Link>,
			label: iLogin,
			// children: <>login</>
			children: getLoginContent(),
		},
		{
			key: '2',
			// label: <Link href={`${REGISTER111}`}><a className="pub-fontw">{iRegister}</a></Link>,
			label: iRegister,
			// children:<>register</>
			children: defaultActiveKey == '2' && (
				<div className="register-page-handle ps-my-account pub-ant-input-padding0" style={{ minHeight: 'auto' }}>
					{
						showCheckTip && (
							<div className="pub-error-tip">{checkTipText}</div>
						)
					}
					<Form.Item
						name="email"
						rules={[
							{
								required: defaultActiveKey == 2 ? true : false,
								message: <RequiredTip />,
							},
							{
								pattern: EMAIL_REGEX,
								message: <AlarmPrompt text={iEmailTip} style={{ margin: 0 }} />
							}
						]}
						validateTrigger="onBlur" // 设置触发验证的时机为失去焦点时
					>
						<CustomInput
							placeholder={iEmailAddress}
							onChange={e => (setEmail(e.target.value), helpersFormNoError(form, 'email'))}
						/>
					</Form.Item>

					<div className="form-group form-forgot">
						<Popover
							open={popoverOpen === 1}
							placement="right" trigger="click"
							content={<PasswordStrength passwordChange={passwordChange} password={password} />}
						>
							<Form.Item
								name="password"
								rules={[
									{
										required: defaultActiveKey == 2 ? true : false,
										message: <RequiredTip />
									},
								]}>
								<Input.Password
									onBlur={e => (passwordBlur(e.target.value), setPopoverOpen(''))}
									onFocus={() => setPopoverOpen(1)} // 得到焦点展示Popover
									onChange={e => setPassword(e.target.value)}
									placeholder={iPassword}
								/>
							</Form.Item>
						</Popover>
					</div>

					{/* 注册确认密码 */}
					<Popover
						open={popoverOpen === 2}
						placement="right" trigger="Hover click"
						content={<PasswordStrength passwordChange={configPasswordChange} password={confirmPassword} />}
					>
						<Form.Item
							name="confirmPassword"
							rules={[
								{
									required: defaultActiveKey == 2 ? true : false,
									message: <RequiredTip />,
								},
							]}>
							<Input.Password
								onBlur={e => (ConfirmpasswordBlur(e.target.value), setPopoverOpen(false))}
								onFocus={() => setPopoverOpen(2)}
								onChange={e => setConfirmPassword(e.target.value)}
								placeholder={iConfirmPassword}
							/>
						</Form.Item>
					</Popover>

					<div className="submit"></div>
					<button
						type="submit" ghost='true'
						className='login-page-login-btn custom-antd-primary'
					>{iSignUp1}</button>
				</div>
			)
		},
	];


	const setInfo = () => {
		form.setFields([
			{
				name: 'account',
				value: newUseCookies?.rememberPassword?.account || '',
			},
			{
				name: 'loginPassword',
				value: newUseCookies?.rememberPassword?.password || '',
			},
		]);
		setIsRemember(newUseCookies?.rememberPassword)
	}

	useEffect(() => {
		setDefaultActiveKey(query?.state || defaultKey || '1')
		setInfo()

		if (query?.state == '3') {
			form.setFields([
				{
					name: 'account',
					value: cookies?.cookies?.email,
				},
			]);
		}
		// setTimeout(() => {
		//     setInfo()
		// }, 1200)
	}, [query])

	useEffect(() => {
		setShowcheckTip(false)
		if (defaultActiveKey == '2') {
			form.setFieldsValue({ password });
		}
	}, [defaultActiveKey])

	// const nameSeo = defaultActiveKey == '1' ? `${iLogin1} | ${process.env.title}` : `${iRegister} | ${process.env.title}`
	const iIsLogOrderTip = i18Translate('i18Login.isLogOrderTip', 'The order was not found. The system detected that the order does not belong to the currently logged in account. If you want to view the order, please log in with the account used when placing the order. Thank you')

	const iRegSusTip1 = i18Translate('i18Login.RegSusTip1', 'THANK YOU FOR CREATING')
	const iRegSusTip2 = i18Translate('i18Login.RegSusTip2', 'AN ACCOUNT')
	const iPasswordResetSuccessful = i18Translate('i18Login.Password reset successful', 'Password reset successful')
	const iPleaseLogin = i18Translate('i18Login.please log in', 'please log in')

	return (
		<>
			{isLoading && <ReactLoadingg isLoading={isLoading} />}
			{isShowModal && <div className={stylesLoad.pubModalBgc}></div>}
			<div className="login-page-header">
				<Link href="/">
					<a className="ps-logo">
						<LogoCom />
					</a>
				</Link>
				<h1 className="login-page-name">{defaultActiveKey == 1 ? i18Translate('i18MenuText.Login', 'Login') : i18Translate('i18MenuText.register', 'Register')}</h1>
			</div>
			<div className="login-page-content only-bottom-border pub-flex-align-center">
				<Form
					form={form}
					onFinish={handleLoginSubmitNew}
					// autoComplete="off"
					style={{ position: 'absolute', right: '25%' }}
				>
					<div className="login-page-handle-box" style={{ position: 'relative', right: '0', top: 0 }}>
						{
							(defaultActiveKey != '3' && defaultActiveKey != '4') && (

								<Tabs activeKey={defaultActiveKey} centered items={items} onChange={onChange} />
							)
						}
						{/* 注册成功 */}
						{
							defaultActiveKey == '3' && (
								<div className="register-success">{iRegSusTip1}<br />{iRegSusTip2}</div>
							)
						}
						{
							defaultActiveKey == '4' && (
								<div className="register-success">{iPasswordResetSuccessful}<br />{iPleaseLogin}</div>
							)
						}

						{
							(defaultActiveKey == '3' || defaultActiveKey == '4') && (
								getLoginContent()
							)
						}

					</div>
				</Form>
			</div>

			{/* 订单是否属于登录账号的提示 */}
			<MinModalTip
				isShowTipModal={isLogOrder}
				width={550}
				tipTitle={i18Translate('i18SmallText.Operation tips', "OPERATION TIPS")}
				tipText={iIsLogOrderTip}
				submitText={i18Translate('i18FunBtnText.OK', "OK")}
				showCancel={false}
				maskClosable={false}
				onCancel={() => setIsLogOrder(false)}
				handleOk={() => setIsLogOrder(false)}
			>

			</MinModalTip>

		</>
	)
}

export default connect(state => state)(withCookies(React.memo(LoginRegisterCom)))
