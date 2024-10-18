import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Form, Input, Row, Col } from 'antd';
import { PubPageBanner, CustomInput, CloudflareTurnstile } from '~/components/common';
import BreadCrumb from '~/components/elements/BreadCrumb';
import ModuleLogin from '~/components/ecomerce/modules/ModuleLogin';
import PageContainer from '~/components/layouts/PageContainer';
import MinSucTip from '~/components/ecomerce/minCom/MinSucTip';
import FollowUs from '~/components/ecomerce/minCom/FollowUs'
import { QuoteRepositry } from '~/repositories';
// import PageTopBanner from '~/components/shared/blocks/banner/PageTopBanner';
import { EMAIL_REGEX, CORRECT_EMAIL_TIP, ZQX_ADDRESS, All_SEO2 } from '~/utilities/constant';
import { helpersFormNoError } from '~/utilities/common-helpers'
import { ACCOUNT_QUOTE, PACKAGE_TRACKING, HELP_SHIPPING_RATES, ACCOUNT_QUOTE_HISTORY, PAGE_CONTACT_US } from '~/utilities/sites-url'
import { changeServerSideLanguage } from '~/utilities/easy-helpers';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';

const ContactUsPage = ({ paramMap, seo, global, isMobile }) => {
	const { i18Translate, curLanguageCodeZh, getDomainsData } = useLanguage();
	const { iHome, i18ContactUs, iRequired, iEmailTip, iFirstName, iLastName, iQuoteRequest } = useI18();

	const [cookies, setCookie] = useCookies(['email', '']);
	const Router = useRouter()
	const { email, profileData } = cookies;

	const { TextArea } = Input;
	const [form] = Form.useForm();

	const [isAddSuccess, setIsAddSuccess] = useState(false)
	const [loginVisible, setLoginVisible] = useState(false);
	const [curActiveUrl, setCurActiveUrl] = useState('')
	const [isCfErr, setIsCfErr] = useState(false); // 是否验证错误
	const [cfToken, setCfToken] = useState(''); // cf人机验证通过token
	const handleVerify = async (token) => {
		setCfToken(token)
	};

	const breadcrumb = [
		{
			text: iHome,
			url: '/',
		},
		{
			text: i18ContactUs,
			url: PAGE_CONTACT_US
		}
	];



	const handleSubmit = async (fieldsValue) => {
		const { email, firstName, lastName, phone, remark } = fieldsValue

		const information = {
			email,
			firstName,
			lastName,
			phone,
			remark,
			languageType: getDomainsData()?.defaultLocale,
			token: cfToken,
			type: 1,
		};
		setIsCfErr(false)
		const res = await QuoteRepositry.addToConcat('', information);

		if (res?.data?.code === 0) {
			setIsAddSuccess(true)
		} else {
			setIsCfErr(true)
		}
	}

	const handleViewQuotes = e => {
		if (!cookies?.account?.isAccountLog) {
			e.preventDefault()
			setLoginVisible(true)
			setCurActiveUrl(ACCOUNT_QUOTE_HISTORY)
			return
		}
	}

	const handleLogin = () => {
		setLoginVisible(false);
		Router.push(curActiveUrl)
	};

	useEffect(() => {
		if (profileData?.email) {
			form.setFieldsValue({
				...profileData
			});
		} else {
			form.setFieldsValue({
				email,
			});
		}
	}, []);


	const iContactUsBnTit = i18Translate('i18CareersPage.ContactUsBnTit', 'Contact Us')
	const iContactUsBnDes = i18Translate('i18CareersPage.ContactUsBnDes', "Please let us know your question, and we will be more than happy to assist you todiv the best of our abilities.")
	const iContactDetails = i18Translate('i18CareersPage.Contact Details', 'Contact Details')
	const iEmailUs = i18Translate('i18CareersPage.Email Us', 'Email Contact Us')
	const iCompanyAddress = i18Translate('i18CompanyInfo.address', ZQX_ADDRESS)
	const iReplyPromptly = i18Translate('i18CareersPage.ReplyPromptly', 'Fill out the form below, and we will reply promptly.')
	const iFollowUs = i18Translate('i18CareersPage.Follow Us', 'Follow Us')
	const iEmail = i18Translate('i18Form.Email', 'Email')
	const iTelephone = i18Translate('i18Form.Telephone', 'Telephone')
	const iYourMessage = i18Translate('i18Form.Your Message', 'Your Message')
	const iHelpTitle = i18Translate('i18CareersPage.HelpTitle', 'How can we help you?')
	const iPricingAvailability = i18Translate('i18CareersPage.PricingAvailability', 'Pricing & Availability')

	const iPackageTracking = i18Translate('i18CareersPage.PackageTracking', 'View and Track Open Orders')
	const iEstimateShippingCharges = i18Translate('i18CareersPage.Estimate Shipping Charges', 'Estimate Shipping Charges')
	const iViewQuotes = i18Translate('i18CareersPage.ViewQuotes', 'View and Order Existing Quotes')

	const getEmailUs = () => {
		return <div className='pub-color555 mb10 flex-gap'>
			<div className='pub-flex-align-center mb4'>
				<div className='sprite-about-us sprite-about-us-2-1 mr10'></div>
				<a className='pub-color-hover-link' href={`mailto:${paramMap?.email || process.env.email}`}>{paramMap?.email || process.env.email}</a>
			</div>
			<div className='pub-flex-align-center'>

				{!curLanguageCodeZh() && <div className="sprite-about-us sprite-about-us-2-2"></div>}
				{curLanguageCodeZh() && <Image
					src="/static/img/common/qq.png"
					width={12}
					height={12}
					style={{ objectFit: 'cover' }}
				/>}

				<a
					className='pub-color-hover-link ml10'
					href={`${curLanguageCodeZh() ? paramMap?.qqUrl : paramMap?.skype}`}
					target="_blank"
				>
					{i18Translate('i18CompanyInfo.Skype Live Chat', 'Skype Live Chat')}
				</a>
			</div>
		</div>
	}
	const colCustomInput = name => {
		return <CustomInput
			className="form-control"
			maxLength={30}
			type="text"
			suffix={<div className='pub-custom-holder pub-input-required'>{name}</div>}
		/>
	}
	const colFirstName = () => {
		return <Col xs={24} sm={12} md={12} xl={12}>
			<Form.Item
				name="firstName"
				rules={[
					{ required: true, message: iRequired },
				]}
			>
				{colCustomInput(iFirstName)}
			</Form.Item>
		</Col>
	}
	const colLastName = () => {
		return <Col xs={24} sm={12}>
			<Form.Item
				name="lastName"
				rules={[
					{ required: true, message: iRequired },
				]}
			>
				{colCustomInput(iLastName)}
			</Form.Item>
		</Col>
	}
	const colEmail = () => {
		return <Col xs={24} sm={12}>
			<Form.Item
				name="email"
				rules={[
					{
						required: true,
						message: iEmailTip,
					},
					{
						pattern: EMAIL_REGEX,
						message: CORRECT_EMAIL_TIP,
					},

				]}
				validateTrigger="onBlur" // 设置触发验证的时机为失去焦点时
			>
				<CustomInput
					className="form-control"
					type="text"
					onBlur={() => form.validateFields(['email'])}
					onChange={e => helpersFormNoError(form, 'email')}
					suffix={<div className='pub-custom-holder pub-input-required'>{iEmail}</div>}
				/>
			</Form.Item>
		</Col>
	}
	const colPhone = () => {
		return <Col xs={24} sm={12}>
			<Form.Item
				name="phone"
				rules={[
					{
						required: true,
						message: iRequired,
					},
				]}
			>
				{colCustomInput(iTelephone)}
			</Form.Item>
		</Col>
	}
	// tbInquiryConcat/add  lastName没传 1007

	const { contactUsTit, contactUsKey, contactUsDes } = All_SEO2?.contactUs
	const i18Title = i18Translate('i18Seo.contactUs.title', contactUsTit)
	const i18Key = i18Translate('i18Seo.contactUs.keywords', contactUsKey)
	const i18Des = i18Translate('i18Seo.contactUs.description', contactUsDes)
	return (
		<PageContainer isMobile={isMobile} paramMap={paramMap} seo={seo} global={global}>
			<Head>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />
			</Head>
			<div className="ps-contact-us ps-page--single ps-about-us pub-bgc-f5 pb60 pub-minh-1">
				{/* https://cloud.tencent.com/act/pro/game-social?from=18150 */}
				<PubPageBanner
					bgcImg="contactUsBgc.jpg"
					title={iContactUsBnTit}
					titleH1={true}
					description={iContactUsBnDes}
					outerClassName='contactUsBgc'
				/>
				{/* <PageTopBanner
					bgcImg="contactUsBgc.jpg"
					title={iContactUsBnTit}
					titleH1={true}
					description={iContactUsBnDes}
				/> */}

				<div className='ps-container'>
					<BreadCrumb breacrumb={breadcrumb} layout="fullwidth" />

					<div className='contact-us-box mt25'>
						<div className='contact-us-left pub-border15 w300 box-shadow'>
							<h2 className='pub-color18 pub-font16 pub-fontw mb5'>{iContactDetails}</h2>
							<div className='pub-color555 mb10 flex-gap'>
								<div className='pub-flex-align-center' style={{ marginBottom: '4px' }}>
									<div className='sprite-about-us sprite-about-us-2-3 mr10'></div>
									<a className='pub-color-hover-link' href={`tel:${paramMap?.phone || process.env.telephone}`}>{paramMap?.phone || process.env.telephone}</a>
								</div>
								<div className='pub-flex-align-center'>
									<div className='sprite-about-us sprite-about-us-2-4 mr10'></div>
									<p>{paramMap?.faxes || process.env.telephone}</p>
								</div>
							</div>

							{getEmailUs()}

							<div className='mb10 pub-color555' style={{ display: 'flex', marginTop: '8px', lineHeight: '16px' }}>
								<div className='sprite-about-us sprite-about-us-2-5 mr10'></div>
								<p>{iCompanyAddress}</p>
							</div>

							<h3 className='pub-color555 pub-font14 pub-fontw mb5'>{iFollowUs}</h3>
							<div className='pub-flex-align-center mb10 percentW100'>
								<FollowUs paramMap={paramMap} />
							</div>
						</div>

						<div className='contact-us-right'>
							<div className='contact-us-top pub-border15 box-shadow'>
								<h2 className='pub-color18 pub-font16 pub-fontw'>{iEmailUs}</h2>
								{
									isAddSuccess && (
										<MinSucTip />
									)
								}
								{
									!isAddSuccess && (
										<>
											<p className='pub-color555 pub-font13 mt10 mb15'>{iReplyPromptly}</p>
											<Form
												form={form}
												layout="vertical"
												className="pub-custom-input-suffix contact-form"
												onFinish={handleSubmit}
												style={{ width: "620px", maxWidth: '100%' }}
											>
												<Row gutter={20} className='mb5'>
													{colFirstName()}
													{!curLanguageCodeZh() && colLastName()}
													{colEmail()}
													{colPhone()}
												</Row>
												<Row gutter={20} className='mb5'>
													<Col xs={24}>
														<Form.Item
															name="remark"
															className=''
															rules={[
																{
																	required: true,
																	message: iRequired,
																},
															]}>
															<div>
																<TextArea
																	className='form-control textArea-control'
																	rows="1"
																	maxLength={512}
																	autoSize={true}
																// style={{ width: '620px' }}
																// addonBefore={<div className='pub-custom-holder pub-input-required'>Your Message</div>}
																// addonAfter={<div className='pub-custom-holder pub-input-required'>Your Message</div>}
																// suffix={<div className='pub-custom-holder pub-input-required'>Your Message</div>}
																/>
																<div className='pub-custom-textarea-holder pub-input-required'>{iYourMessage}</div>
															</div>
														</Form.Item>
													</Col>
												</Row>

												{(!curLanguageCodeZh()) && <div className=""><CloudflareTurnstile onVerify={handleVerify} isErr={isCfErr} /></div>}

												<div className="custom-antd-btn-more mt15 mb10">
													<button
														type="submit" ghost="true"
														className='custom-antd-primary ps-add-cart-footer-btn w140'
													// onClick={() => handleSave()}
													>{i18Translate('i18Form.Submit', 'Submit')}</button>
												</div>
											</Form>
										</>
									)
								}
							</div>

							<div className='help-user mt20 pub-border15 box-shadow'>
								<h2 className='pub-color18 pub-font16 pub-fontw'>{iHelpTitle}</h2>
								<div className='pub-flex-wrap help-user-item'>
									<div className='percentW50' style={{ minWidth: '200px' }}>
										<h3 className='mt5 mb5 pub-color555 pub-font14 pub-fontw'>{iPricingAvailability}</h3>
										<Link href={ACCOUNT_QUOTE}>
											<a className='pub-color-link'>{iQuoteRequest}</a>
										</Link>
										<div>
											<Link href={ACCOUNT_QUOTE_HISTORY}>
												<a className='pub-color-link' onClick={(e) => handleViewQuotes(e)}>{iViewQuotes}</a>
											</Link>
										</div>
									</div>
									<div className='percentW50' style={{ minWidth: '200px' }}>
										<div className='mt5 mb5 pub-color555 pub-font14 pub-fontw'>{iPricingAvailability}</div>
										<Link href={PACKAGE_TRACKING}>
											<a className='pub-color-link'>{iPackageTracking}</a>
										</Link>
										<div>
											<Link href={HELP_SHIPPING_RATES}>
												<a className='pub-color-link'>{iEstimateShippingCharges}</a>
											</Link>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<ModuleLogin
				visible={loginVisible}
				onCancel={() => setLoginVisible(false)}
				onLogin={handleLogin}
			/>

		</PageContainer>
	);
};
export default ContactUsPage;

export async function getServerSideProps({ req }) {
	const translations = await changeServerSideLanguage(req)

	return {
		props: {
			...translations,
		}
	}
}

