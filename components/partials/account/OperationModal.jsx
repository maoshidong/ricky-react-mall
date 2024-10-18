import React, { useState, useEffect } from 'react';
import { Form, Modal, Radio, Button, Row, Col, Checkbox } from 'antd'; //  Input,
import { CustomInput, AlarmPrompt, CloudflareTurnstile } from '~/components/common';
import { connect } from 'react-redux';
import { useCookies } from 'react-cookie';
import { withCookies } from 'react-cookie';
import Link from 'next/link';
import { login, profileData, checkIsAccountLog } from '~/store/auth/action';

import { setToken } from '~/repositories/Repository';
import { AccountRepository } from '~/repositories';

// import ReCAPTCHA from 'react-google-recaptcha';
import { useRouter } from 'next/router';
import { getExpiresTime } from '~/utilities/common-helpers';
import { calculateTotalAmount, toFixed } from '~/utilities/ecomerce-helpers';
import { getEnvUrl, REGISTER } from '~/utilities/sites-url'
import { CORRECT_EMAIL_TIP, EMAIL_REGEX } from '~/utilities/constant';

import useLanguage from '~/hooks/useLanguage';
import useEcomerce from '~/hooks/useEcomerce';
import useCart from '~/hooks/useCart';
import useAccount from '~/hooks/useAccount';

import FacebookLoginCom from "~/components/partials/account/FacebookLoginCom" // facebook登录组件
import GoogleLoginCom from '~/components/partials/account/GoogleLoginCom'; // google登录组件
import styles from '~/scss/module/_account.module.scss'


const OperatioModal = (props) => {
	const { i18Translate, curLanguageCodeZh, getDomainsData } = useLanguage();
	const { setCurCartDataHok } = useEcomerce();
	const { saveOrderStepData } = useCart();
	const { anonymousAuthLoginHooks, bindQuoteList } = useAccount();

	// const [limitDisabled, handleLimitClick, handleLimitDisabled] = useClickLimit();
	const [form] = Form.useForm();
	// const [isLog, setIsLog] = useLocalStorage('isLog', false);
	const [newUseCookies] = useCookies(['rememberPassword', 'cur_cart_data']);
	const { useAddMoreCart, addToLoadCarts } = useEcomerce();
	const [isRemember, setIsRemember] = useState(true)
	const [recaptcha, setRecaptcha] = useState(false);
	const [checkType, setCheckType] = useState('login')
	const [isErr, setIsErr] = useState(false)
	const [isCfErr, setIsCfErr] = useState(false); // 是否验证错误
	const [cfToken, setCfToken] = useState(''); // cf人机验证通过token
	const [isShowCfToken, setIsShowCfToken] = useState(false); // 密码错误3次以后，显示验证码，输入10次以后，账号锁定30分钟

	const { isOpenModal, setUnLoginFlag, cookies, dispatch, ecomerce } = props;
	const { allCartItems } = ecomerce

	const Router = useRouter();
	const getProfile = async (token) => {
		if (!token) {
			return false;
		}
		const res = await AccountRepository.getProfile(token);
		if (res && res.code == 0) {
			dispatch(profileData(res.data));
			cookies.set('profileData', {
				...res.data
			}, { path: '/' });
		}
	}

	const afterLogin = async (authToken) => {
		const { auth } = props;
		const authorization = authToken || auth.token;
		setTimeout(() => {
			syncCart(authorization); // 购买流程不添加购物车
		}, 0)
		bindQuoteList(authToken)
	}
	const syncCart = async (authorization) => {
		const { ecomerce } = props;
		const { cartItems } = ecomerce;
		// 下单前登录，需要把账号的购物车添加到cartNo=1(不需要了，下单的购物车cartNo不固定为0了), 即此次下单只购买匿名登录添加的产品
		// const carts = await CartRepository.loadCarts1(authorization);
		// if (carts.code == 0) {
		//     const params = carts?.data.map(i => {
		//         return {
		//             productId: i?.productId,
		//             quantity: i?.cartQuantity,
		//         }
		//     })
		//     // 有才执行
		//     if(params?.length > 0) {
		//         const items = {
		//             fromCartNo: 0,
		//             items: params,
		//             toCartNo: 1,
		//         }
		//         await CartRepository.changeCartLocation(authorization, items)
		//     }
		// }

		useAddMoreCart(
			cartItems,
			{ cartNo: -1, newToken: authorization }
		);
		// Router.push('/account/shopping-cart?num=1' + '&showVoucher=' + 1); // 这里登录弹出优惠券
	}

	// const onChange = (value) => {
	//     setRecaptcha(value);
	// }

	const onChangeRemember = e => {
		setIsRemember(e.target.checked)
	};

	const handleRetrievePassword = () => {
		Router.push(`/account/retrieve-password?retrieveState=` + 1)
	}

	const handleLoginSubmit = async (fieldsValue) => {
		// 暂时隐藏人机验证--del
		// if (!recaptcha) {
		//     message.error('Please check reCAPTCHA first.');
		//     return false;
		// }
		const checkLogRes = await AccountRepository.apiLoginCheck({ account: fieldsValue.account })
		// && !cfToken
		if (checkLogRes?.code === 0 && checkLogRes?.data > 1) {
			setIsShowCfToken(true)
			// return
		} else {
			setIsShowCfToken(false)
		}
		setIsCfErr(false)
		const response = await AccountRepository.loginRequest({
			...fieldsValue,
			languageType: getDomainsData()?.defaultLocale,
			token: cfToken,
			v: 2,
			'g-recaptcha-response': recaptcha
		});
		// 记住密码
		if (isRemember) {
			cookies.set('rememberPassword', {
				account: fieldsValue.account,
				password: fieldsValue.password,
			}, { path: '/', expires: getExpiresTime(30) });
		} else {
			cookies.remove('rememberPassword', { path: '/' });
		}

		if (response && response.code == 0) {
			// showVoucher弹出优惠券
			setCurCartDataHok({}) // 删除当前购物车数据
			const cartSubTotal = Number(toFixed(calculateTotalAmount(allCartItems), 2))
			saveOrderStepData({ productPrice: cartSubTotal, step: 2 })
			Router.push('/account/shopping-cart?num=1' + '&showVoucher=' + 1);
			const { cookies, dispatch } = props;
			dispatch(checkIsAccountLog(true));

			setToken(response.data);
			setUnLoginFlag(false); // 隐藏弹框
			setTimeout(
				function () {
					dispatch(login(response.data, fieldsValue.account));
					cookies.set('account', {
						token: response.data,
						account: fieldsValue.account,
						isAccountLog: true,
						isLoggedIn: true,
					}, { path: '/', expires: getExpiresTime(0.5) });
					cookies.set('email', fieldsValue.account, { path: '/' });

					afterLogin(response.data);

				}.bind(this),
				100
			);
		} else {
			setIsErr(response?.msg)
			setIsCfErr(true)
			// message.error('Please check your username or password.')
		}
	};
	const anonymousAuthLogin = async () => {
		if (cfToken) {
			setIsCfErr(false)
			const auth = cookies.get('account');
			if (auth && auth?.token) {
				setUnLoginFlag(false);
				const cartSubTotal = Number(toFixed(calculateTotalAmount(allCartItems), 2))
				saveOrderStepData({ productPrice: cartSubTotal, step: 2 })
				Router.push('/account/shopping-cart?num=1');
			} else {
				// 匿名登录 - 进入购物车确实已经是账号登录或者匿名登录了，这里应该不需要了
				const res = await anonymousAuthLoginHooks()
				const { dispatch } = props;
				setUnLoginFlag(false);
				dispatch(login(res?.data, {}));
			}
		} else {
			setIsCfErr(true)
		}
	}
	const registerOrCheck = () => {
		Router.push(`${REGISTER}`);
	}

	const handleVerify = async (token) => {
		console.log(token, 'token--222--del')
		setCfToken(token)
	};

	const onLoginCallback = () => {
		Router.push('/account/shopping-cart?num=1');
		setUnLoginFlag(false);
	}

	useEffect(() => {
		form.setFields([
			{
				name: 'account',
				value: newUseCookies?.rememberPassword?.account || '',
			},
			{
				name: 'password',
				value: newUseCookies?.rememberPassword?.password || '',
			},
		]);
		setIsRemember(newUseCookies?.rememberPassword)
	}, [isOpenModal])

	const iPassword = i18Translate('i18Login.Password', 'Password')
	const iEmail = i18Translate('i18Form.Email', 'Email')
	const iRemembeMe = i18Translate('i18Login.Remember me', 'Remember me')
	const iRetrievePassword = i18Translate('i18Login.Retrieve password', 'Retrieve password')
	const iRequired = i18Translate('i18Form.Required', 'Required')
	const iEmailTip = i18Translate('i18Form.EmailTip', CORRECT_EMAIL_TIP)
	const iRegister = i18Translate('i18MenuText.register', 'Register')
	const iLogin = i18Translate('i18MenuText.Login', 'Login')
	const iReturningCustomer = i18Translate('i18Login.Returning Customer', 'Returning Customer')
	const iReturningCustomerDes = i18Translate('i18Login.ReturningCustomerDes', 'Log to use your saved infomation and enjoy the benefits of your account.')
	const iNewCustomer = i18Translate('i18Login.New Customer', 'New Customer')
	const iNewCustomerDes = i18Translate('i18Login.NewCustomerDes', 'Creat my Origin Data Global account,processing order will go faster')
	const iCheckoutAsGuest = i18Translate('i18Login.Checkout as Guest', 'Checkout as Guest')
	const iCheckoutAsGuestDes = i18Translate('i18Login.CheckoutAsGuestDes', 'Save time now - you dont need to restister to check out.')
	const iPasswordInvalid = i18Translate('i18Login.PasswordInvalid', 'Password is invalid') // THANK YOU FOR CREATING
	// ps-form--account styled-components
	return (
		<Modal onCancel={() => setUnLoginFlag(false)} width={560} footer={null} open={isOpenModal} closeIcon={<i className="icon icon-cross2"></i>}>
			<div className="ps-my-account ps-operation-account custom-antd-btn-more login-page-box ant-form-box" >
				<div>
					<Radio.Group onChange={(e) => setCheckType(e.target.value)} className='ps-radio__group' name="radiogroup" defaultValue='login'>
						<Radio className='ps-radio__item' checked={checkType == 'login'} value='login'>
							<span className='ps-radio__item-label'>{iReturningCustomer}</span>
						</Radio>
						<Form
							form={form}
							className="ps-form--account ps-form-modal__account pub-label-pad"
							onFinish={handleLoginSubmit}
							autoComplete="off"
							layout="vertical"
						>
							<div className="ps-tab active" id="sign-in">
								<div className='ps-account-title'>{iReturningCustomerDes}</div>
								{
									checkType == 'login' &&
									<div className="ps-form__content" style={{ padding: '0px' }}>
										<Row gutter={20}>
											<Col span={12} >
												<div className="form-group mb0">
													<Form.Item
														name="account"
														label={iEmail}
														rules={[
															{
																required: true,
																message: <AlarmPrompt text={iRequired} />,
															},
															{
																pattern: EMAIL_REGEX,
																message: <AlarmPrompt text={iEmailTip} />
															},
														]}>
														<CustomInput
															className="form-control form-input pub-border"
															type="text"
															placeholder={iEmail}
															autoComplete="off"
															style={{ width: '214px' }}
														/>
													</Form.Item>
												</div>
											</Col>
											<Col span={12} >
												<div className="form-group form-forgot mb0">
													<Form.Item
														name="password"
														label={iPassword}
														rules={[
															{
																required: true,
																message: <AlarmPrompt text={iRequired} />,
															},
														]}>
														<CustomInput
															className="form-control form-input"
															type="password"
															placeholder={iPassword}
															autoComplete="off"
															style={{ width: '214px' }}
														/>
													</Form.Item>
												</div>
											</Col>
										</Row>
										<div className={`${styles['login-page-manage']} mt-5`} style={{ paddingRight: '10px' }}>
											<div>
												<Checkbox checked={isRemember} onChange={onChangeRemember} style={{ marginRight: '10px' }}>
													<span className="pub-font12 pub-color555">{iRemembeMe}</span>
												</Checkbox>
											</div>
											<div onClick={handleRetrievePassword} className="retrieve-password">{iRetrievePassword}？</div>
										</div>
										{/* cf人机验证通过token */}
										{(!curLanguageCodeZh() && isShowCfToken) && <div className="mt20 mb20"><CloudflareTurnstile onVerify={handleVerify} isErr={isCfErr} isShowTip={false} /></div>}
										{
											//  && !isShowCfToken
											(isErr) && <p className='pub-font12 pub-danger'>{<AlarmPrompt text={isErr} />}</p>
										}

										<div className="form-group submit ps-form-position mt16">
											<button
												type="submit"
												className='product-primary-btn custom-antd-primary goRegister__btn w100'
											>{iLogin}</button>
											<div className='pub-flex mt15'>
												<div className='w200'>
													{/* 第三方登录没有优惠券，不需要加： &showVoucher=1 */}
													<FacebookLoginCom
														onLoginCallback={() => onLoginCallback()}
													/>
												</div>
												<div className='w220 ml20'>
													{/* 第三方登录没有优惠券，不需要加： &showVoucher=1 */}
													<GoogleLoginCom
														onLoginCallback={() => onLoginCallback()}
													/>
												</div>
											</div>
										</div>

									</div>
								}
							</div>
						</Form>

						{/* New Customer */}
						<Radio className='ps-radio__item ps-label-border' checked={checkType == 'register'} value='register'>
							<span className='ps-radio__item-label'>{iNewCustomer}</span>
						</Radio>
						<div className='ps-goRegister__tips'>
							<div className='goRegister__tip'>{iNewCustomerDes}</div>
							{checkType == 'register' &&
								<Link href={`${getEnvUrl(REGISTER)}`}>
									<a>
										<Button
											type="primary"
											className='product-primary-btn custom-antd-primary goRegister__btn'
											onClick={registerOrCheck}
											style={{ width: "100px" }}
										>{iRegister}</Button>
									</a>
								</Link>
							}
						</div>

						{/* Checkout as Guest */}
						{!curLanguageCodeZh() && <Radio className='ps-radio__item ps-label-border' checked={checkType == 'checkout'} value='checkout'>
							<span className='ps-radio__item-label'>{iCheckoutAsGuest}</span>
						</Radio>
						}
						{!curLanguageCodeZh() && <div className='ps-goRegister__tips'>
							<div className='goRegister__tip'>{iCheckoutAsGuestDes}</div>

							{
								checkType == 'checkout' && <div className='ps-checkout'>
									{(!curLanguageCodeZh()) && <div className="mt20 mb20"><CloudflareTurnstile onVerify={handleVerify} isErr={isCfErr} /></div>}
									<button onClick={anonymousAuthLogin} className='ps-btn ps-btn-type'>
										{iCheckoutAsGuest}
									</button>
								</div>
							}
						</div>
						}
					</Radio.Group>


				</div>
			</div>
		</Modal>

	);
}
const mapStateToProps = state => {
	return state;
};
export default connect(mapStateToProps)(withCookies(OperatioModal));
