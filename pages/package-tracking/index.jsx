import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Form, Button } from 'antd';
import { CustomInput, AlarmPrompt, CloudflareTurnstile } from '~/components/common';
import { useCookies } from 'react-cookie';
import { connect } from 'react-redux';
import Router from 'next/router';
import PageContainer from '~/components/layouts/PageContainer';
import MinLoginTip from '~/components/ecomerce/minCom/MinLoginTip';
import PageTopBanner from '~/components/shared/blocks/banner/PageTopBanner';

import { OrderRepository } from '~/repositories';
// import EmailInput from '~/components/ecomerce/formCom/EmailInput';

import { EMAIL_REGEX, CORRECT_EMAIL_TIP, All_SEO5 } from '~/utilities/constant';
import { helpersFormNoError } from '~/utilities/common-helpers';
import { ACCOUNT_ORDERS } from '~/utilities/sites-url'
import useLanguage from '~/hooks/useLanguage';
import { changeServerSideLanguage } from '~/utilities/easy-helpers';

// 订单跟踪，还需补充 - 可以查其它人的订单
const PackageTrackingPage = ({ paramMap, auth }) => {
	const { i18Translate, getDomainsData, curLanguageCodeZh } = useLanguage();
	const iPackageTracking = i18Translate('i18ResourcePages.PackageTrackingTip', "Package Tracking")
	const iViewOrder = i18Translate('i18AboutOrder.View order', 'VIEW ORDER')
	const iPackageTrackingLogTip = i18Translate('i18ResourcePages.PackageTrackingLogTip', 'to check order status.')
	const iPackageTrackingFomTit = i18Translate('i18ResourcePages.PackageTrackingFomTit', 'Please provide the following information for order search.')
	const iEmailTip = i18Translate('i18Form.EmailTip', 'Please input a valid email!')
	const iRequired = i18Translate('i18Form.Required', 'Required')
	const iEmail = i18Translate('i18Form.Email', 'Email')
	const iOrderNumber = i18Translate('i18AboutOrder.Order Number', 'Order Number')
	const iShippingZipcode = i18Translate('i18ResourcePages.Shipping Zipcode', 'Shipping Zipcode')
	const iTrackingOrderBtn = i18Translate('i18ResourcePages.TrackingOrderBtn', 'Get Order / Tracking Updates')
	const iTrackingOrderTip = i18Translate('i18ResourcePages.TrackingOrderTip', 'Input error, please check.')

	// const [cookies, setCookie] = useCookies(['account', 'email']);
	const { isAccountLog } = auth
	const [form] = Form.useForm();

	const [orderIsExist, setOrderIsExist] = useState(false)
	const [isCfErr, setIsCfErr] = useState(false); // 是否验证错误
	const [cfToken, setCfToken] = useState(''); // cf人机验证通过token
	const handleVerify = async (token) => {
		setCfToken(token)
	};


	const handleOk = async (fieldsValues) => {
		if (!cfToken) {
			setIsCfErr(true)
			return
		}
		const { email, orderId, postalCode } = fieldsValues || {}
		const params = {
			email: email?.trim(), orderId: orderId?.trim(),
			postalCode: postalCode?.trim(),  // 发货地址的邮编
			token: cfToken,
		}


		const res = await OrderRepository.getOrderPackageCheck(params, getDomainsData()?.defaultLocale);
		if (res?.code === 0) {
			setOrderIsExist(false)
			Router.push(res?.data)
		} else {
			setOrderIsExist(1)
		}
	}


	const checkEmail = (e) => {
		e.preventDefault();
		// setEmailInput(e.target.value)
		// if (helpersValidateEmail(_, e.target.value)) {
		//     form.setFields([
		//         {
		//             name: 'email',
		//             errors: []
		//         },
		//     ]);
		// } else {
		//     form.setFields([
		//         {
		//             name: 'email',
		//             errors: ['Please input a valid email!']
		//         },
		//     ]);
		// }
	}
	// email不固定
	// useEffect(() => {
	//     if(cookies?.isAccountLog) {
	//         formSetFields(cookies?.account?.account)
	//         setInputEmail(cookies?.account?.account)
	//     } else {
	//         setInputEmail(cookies?.email)
	//         formSetFields(cookies?.email)
	//     }

	// }, [cookies])


	const titleSeo = All_SEO5?.packageTracking?.packageTrackingTit
	const { packageTrackingTit, packageTrackingKey, packageTrackingDes } = All_SEO5?.packageTracking
	const i18Title = i18Translate('i18Seo.packageTracking.title', packageTrackingTit)
	const i18Key = i18Translate('i18Seo.packageTracking.keywords', packageTrackingKey)
	const i18Des = i18Translate('i18Seo.packageTracking.description', packageTrackingDes)
	return (
		<PageContainer paramMap={paramMap}>
			<Head>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />
			</Head>
			<div className='pub-bgc-f5 custom-antd-btn-more'>
				<PageTopBanner
					bgcImg="package.jpg"
					title={iPackageTracking}
					titleH1={true}
				>
					{
						isAccountLog && <Link href={ACCOUNT_ORDERS}>
							<a>
								<Button
									ghost='true'
									className='mt10 login-page-login-btn ps-add-cart-footer-btn custom-antd-primary w180'
								>
									{iViewOrder}
								</Button>
							</a>
						</Link>
					}
				</PageTopBanner>

				<div className='ps-container' style={{ maxWidth: '900px' }}>
					{/* 登录提示  */}
					{!isAccountLog && (
						<MinLoginTip tipText={iPackageTrackingLogTip} />
					)}


					<div className='mt20 pub-border15'>
						<div className='mb15 pub-left-title'>{iPackageTrackingFomTit}</div>
						<Form
							form={form}
							layout="vertical"
							className="pub-custom-input-suffix"
							autoComplete="new-password"
							onFinish={handleOk}
						>
							{/* <div className='mb20'> */}
							<Form.Item
								name="email"
								className='mb20'
								rules={[
									{
										required: true,
										message: <AlarmPrompt text={iEmailTip} />,
									},
									{
										pattern: EMAIL_REGEX,
										message: <AlarmPrompt text={CORRECT_EMAIL_TIP} />,
									}
								]}
								validateTrigger="onBlur" // 设置触发验证的时机为失去焦点时
							>
								<CustomInput
									className="form-control w300"
									type="text"
									autoComplete="new-password"
									onBlur={(e) => (checkEmail(e), form.validateFields(['email']))}
									// onBlur={(e) => checkEmail(e)}
									onChange={e => helpersFormNoError(form, 'email')}
									suffix={<div className='pub-custom-holder pub-input-required'>{iEmail}</div>}
								// onChange={handleEmailChange}
								// disabled={isAccountLog}
								/>
							</Form.Item>
							{/* <EmailInput form={form} name="email" /> */}
							{/* </div> */}
							<Form.Item
								name="orderId"
								className='mb20'
								rules={[{ required: true, message: <AlarmPrompt text={iRequired} /> }]}
							>
								<CustomInput
									className="form-control w300"
									type="text"
									autoComplete="new-password"
									suffix={<div className='pub-custom-holder pub-input-required'>{iOrderNumber}</div>}
								/>
							</Form.Item>
							<Form.Item
								name="postalCode"
								className='mb20'
								rules={[{ required: true, message: <AlarmPrompt text={iRequired} /> }]}
							>
								<CustomInput
									className="form-control w300"
									type="text"
									autoComplete="new-password"
									suffix={<div className='pub-custom-holder pub-input-required'>{iShippingZipcode}</div>}
								/>
							</Form.Item>

							{(!curLanguageCodeZh()) && <div className="mb20"><CloudflareTurnstile onVerify={handleVerify} isErr={isCfErr} /></div>}

							<button
								type="submit" ghost='true'
								className='login-page-login-btn ps-add-cart-footer-btn custom-antd-primary w300'
							// onClick={handleAddressSubmit}
							>
								{iTrackingOrderBtn}
							</button>

							{
								orderIsExist === 1 && (
									<div className='mt10 pub-danger'>{iTrackingOrderTip}</div>
								)
							}
						</Form>
					</div>
				</div>
			</div>
		</PageContainer>
	)
}

export default connect(state => state)(PackageTrackingPage)
export async function getServerSideProps({ req }) {
	const translations = await changeServerSideLanguage(req)
	return {
		props: {
			...translations,
		}
	}
}
