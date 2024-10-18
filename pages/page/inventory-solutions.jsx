import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useCookies } from 'react-cookie';
import { Upload, Button, Form, Input, Row, Col, List } from 'antd';
import { CustomInput, AlarmPrompt, CloudflareTurnstile } from '~/components/common';
import BreadCrumb from '~/components/elements/BreadCrumb';
import PageContainer from '~/components/layouts/PageContainer';
import { commonUploadUrl } from '~/repositories/Repository';
import QuoteRepositry from '~/repositories/zqx/QuoteRepositry';

import useLocalStorage from '~/hooks/useLocalStorage'
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
import { All_SEO2 } from '~/utilities/constant';
import { getEnvUrl, PAGE_CAREERS, PAGE_CONTACT_US } from '~/utilities/sites-url';
import { changeServerSideLanguage } from '~/utilities/easy-helpers';

import styles from "./_page.module.scss";

const InventorySolutions = ({ paramMap, isMobile }) => {
	const { i18Translate, curLanguageCodeEn, curLanguageCodeZh, getDomainsData } = useLanguage();
	const { iFirstName, iLastName } = useI18();
	const [cookies, setCookie] = useCookies(['email', '']);
	const { email } = cookies;
	const [emailVal, setEmailVal] = useState(email || '')
	const [isCfErr, setIsCfErr] = useState(false); // 是否验证错误
	const [cfToken, setCfToken] = useState(''); // cf人机验证通过token

	const { TextArea } = Input;
	const [form] = Form.useForm();

	const [contactFileList, setContactFileList] = useLocalStorage('contactFileList', []);
	const [fileList, setFileList] = useState(contactFileList || []);
	const [isAddSuccess, setIsAddSuccess] = useState(false)

	const breadcrumb = [
		{
			text: i18Translate('i18MenuText.Home', 'Home'),
			url: '/',
		},
		{
			text: i18Translate('i18MenuText.Inventory Solutions', 'Inventory Solutions'),
			url: getEnvUrl(PAGE_CAREERS)
		}
	];
	const handleVerify = async (token) => {
		setCfToken(token)
	};

	// useEffect(() => {
	//     const data = "https://oss.origin-ic.net/concatFile/ODGde0927126d82155741d5eeb7dd3d490606d56d11faed6fb261e4bda45de605f9.xlsx"
	//     contactFileList.push(data)
	//     setContactFileList(contactFileList)
	// }, [])
	// 文件上传
	const uploadProps = {
		name: 'file',
		action: commonUploadUrl,
		showUploadList: false,
		onChange(info) {
			if (info.file.status !== 'uploading') {
				const { code, data } = info?.file?.response
				if (code === 0) {
					setFileList((prevFileList) => [
						...prevFileList,
						{
							uid: info.file.uid,
							name: info.file.name,
							url: data,
							status: 'done',
						},
					]);
					// contactFileList.push(data)
					// setContactFileList(contactFileList)
				}
				else {

				}
			}
			if (info.file.status === 'done') {

			} else if (info.file.status === 'error') {

			}
		},
		itemRender(originNode, file) {

		}
	};
	// 移除文件
	const handleRemove = (file) => {
		setFileList((prevFileList) =>
			prevFileList.filter((item) => item.uid !== file.uid)
		);
	};


	const handleSubmit = async (fieldsValue) => {
		const fileUrList = fileList?.map(i => {
			return i?.url
		})

		const { email, firstName, lastName, phone, remark } = fieldsValue

		let isError = false
		if (!validateEmail(_, email)) {
			isError = true
			form.setFields([
				{
					name: 'email',
					errors: ['Please input a valid email!']
				},
			]);
		}
		if (isError) return

		const information = {
			email,
			firstName,
			lastName,
			phone,
			remark,
			fileUrList: fileUrList.join(';'),
			languageType: getDomainsData()?.defaultLocale,
			token: cfToken,
			type: 2,
		};

		const res = await QuoteRepositry.addToConcat('', information);

		if (res?.data?.code === 0) {
			setIsAddSuccess(true)
			setContactFileList([])
		}
	}

	const iEmail = i18Translate('i18Form.Email', 'Email')
	const iEmailTip = i18Translate('i18Form.EmailTip', 'Please input a valid email!')
	const iTelephone = i18Translate('i18Form.Telephone', 'Telephone')
	const iRemark = i18Translate('i18Form.Remark', 'Remark')
	const iRequired = i18Translate('i18Form.Required', 'Required')

	const validateEmail = (_, value) => {
		// 如果没有输入值，则直接返回 Promise.resolve()，
		// 表示校验通过（Ant Design 中规定 required 由单独的 rules 完成）
		if (!value) {
			return false;
		}

		const emailRegex = /^\S+@\S+\.\S+$/;
		if (emailRegex.test(value)) {
			return true;
			//   return Promise.resolve();
		}
		// 格式不正确时返回 Promise.reject() 并提供错误信息
		return false;
	};

	const checkEmail = (e) => {
		e.preventDefault();
		// setEmailInput(e.target.value)
		if (validateEmail(_, e.target.value)) {
			form.setFields([
				{
					name: 'email',
					errors: []
				},
			]);
		} else {
			form.setFields([
				{
					name: 'email',
					errors: [<AlarmPrompt text={iEmailTip} />]
				},
			]);
		}
	}

	const colCustomInput = name => {
		return <div>
			<CustomInput
				className="form-control"
				type="text"
			/>
			<div className='pub-custom-input-holder pub-input-required'>{name}</div>
		</div>
	}
	const firstNameItem = () => {
		return (
			<Form.Item
				name="firstName"
				rules={[
					{
						required: true,
						message: <AlarmPrompt text={iRequired} />,
					},
				]}>
				{colCustomInput(iFirstName)}
			</Form.Item>
		)
	}
	const lastNameItem = () => {
		return (
			<Form.Item
				name="lastName"
				rules={[
					{
						required: true,
						message: <AlarmPrompt text={iRequired} />,
					},
				]}
			>
				<div>
					<CustomInput
						className="form-control"
						type="text"
					/>
					<div className='pub-custom-input-holder pub-input-required'>{iLastName}</div>
				</div>
			</Form.Item>
		)
	}
	const emailItem = () => {
		return (
			<Form.Item
				name="email"
				rules={[
					{
						required: true,
						message: <AlarmPrompt text={iRequired} />,
					},
				]}>
				<div>
					<CustomInput
						className="form-control"
						type="text"
						onBlur={(e) => checkEmail(e)}
						value={emailVal || ''}
						onChange={e => setEmailVal(e.target.value)}
					/>
					<div className='pub-custom-input-holder pub-input-required'>{iEmail}</div>
				</div>
			</Form.Item>
		)
	}
	const phoneItem = () => {
		return (
			<Form.Item
				name="phone"
				rules={[
					{
						required: true,
						message: <AlarmPrompt text={iRequired} />,
					},
				]}
			>
				<div>
					<CustomInput
						maxLength={30}
						className="form-control"
						type="text"
					/>
					<div className='pub-custom-input-holder pub-input-required'>{iTelephone}</div>
				</div>
			</Form.Item>
		)
	}
	const remarkItem = () => {
		return (
			<Form.Item
				name="remark"
				rules={[
					{
						message: iRequired,
					},
				]}>
				<div>
					<TextArea
						className='form-control'
						rows="1"
						maxLength={512}
						autoSize={true}
					/>
					<div className='pub-custom-input-holder'>{iRemark}</div>
				</div>
			</Form.Item>
		)
	}

	useEffect(() => {
		if (email) {
			form.setFields([
				{
					name: 'email',
					value: email
				},
			]);
		}
	}, [email]);

	useEffect(() => {
		setContactFileList(fileList)
	}, [fileList])


	const iInventorySolutionsBnTit = i18Translate('i18CareersPage.InventorySolutionsBnTit', 'Inventory Solutions')
	const iContactInformation = i18Translate('i18SmallText.Contact Information', 'Contact Information')
	const iUploadTitle = i18Translate('i18CareersPage.UploadTitle', 'Upload pictures or files of your inventory')
	const iUploadLimit = i18Translate('i18CareersPage.UploadLimit', 'Drop files here! Maximum file size 2MB. You may also provide pictures or upload files of your inventory')
	const iSubmitInventoryRequest = i18Translate('i18CareersPage.Submit Inventory Request', 'Submit Inventory Request')

	const iInventoryDes = i18Translate('i18Ueditor.InventoryDes', "Looking to move your surplus or excess inventory of electronic components? We're interested. We buy surplus or excess inventory, whether it is a truckload or a small box, we're always ready to help you reclaim yourwarehouse space while realizing the best recovery possible, in cash, from surplus.")
	// 提交成功提示
	const iInventorySucTip1 = i18Translate('i18CareersPage.InventorySucTip1', 'We have received your inventory')
	const iInventorySucTip2 = i18Translate('i18CareersPage.InventorySucTip2', 'Our sales representative will contact you within 1-3 business day via email.')
	const iInventorySucTip3 = i18Translate('i18CareersPage.InventorySucTip3', 'Please check your email for the latest status of the  inventory. Thank you.')

	const { solutionsTit, solutionsKey, solutionsDes } = All_SEO2?.solutions
	const i18Title = i18Translate('i18Seo.inventorySolutions.title', solutionsTit)
	const i18Key = i18Translate('i18Seo.inventorySolutions.keywords', solutionsKey)
	const i18Des = i18Translate('i18Seo.inventorySolutions.description', solutionsDes)
	return (
		<PageContainer isMobile={isMobile} paramMap={paramMap}>
			<Head>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />
			</Head>
			<div className={`${styles.psInventorySolutions} ps-page--single ps-about-us pub-bgc-f5 pub-minh-1 custom-antd-btn-more`}>
				<Form
					form={form}
					layout="vertical"
					className="pub-custom-input-box custom-antd-btn-more"
					onFinish={handleSubmit}
				>

					<div className='pub-top-bgc pub-top-bgc-minh260'>
						<img className='pub-top-img' src='/static/img/bg/inventorySolutionsBan.jpg' alt="banner" />

						<div className='ps-container pub-color555 pub-top-bgc-content'>
							<h1 className='mb20 pub-fontw pub-font36 pub-top-bgc-title vue-ueditor-wrap' style={{ lineHeight: '46px' }}>{iInventorySolutionsBnTit}</h1>

							{
								!curLanguageCodeEn() && <div
									className='pub-font14 pub-color555 pub-lh20 pub-top-bgc-des'
									style={{ maxWidth: '650px' }}
									dangerouslySetInnerHTML={{ __html: iInventoryDes }}
								></div>
							}

							{
								curLanguageCodeEn() && <div
									className='pub-font14 pub-color555 pub-lh20 pub-top-bgc-des'
									style={{ maxWidth: '650px' }}
								>
									<p>Looking to move your surplus or excess inventory of electronic components? We're interested. We buy surplus or excess inventory, whether it is a truckload or a small box, we're always ready to help you reclaim yourwarehouse space while realizing the best recovery possible, in cash, from surplus.</p>
									<p className='mt10'>If you're considering selling excess or surplus inventory, just phone, fax or email us with your surplus of
										electronic components, and we will contact you with our best cash offer the same day.</p>
									<p className='mt10'>If you don't have proper count or no time to count inventory, we will come to see inventory & give you
										offer on the spot. You will save lot of time, space & money by selling your surplus to us Guaranteed!</p>
									<p className='mt10'>Notice: We buy only brand new and original parts.</p>
								</div>
							}

							<div className='pub-flex mt25'>
								<Link href={getEnvUrl(PAGE_CONTACT_US)}>
									<a>
										<Button type="primary" ghost='true' className='w220 pub-flex-center custom-antd-primary h42'>
											<p>{i18Translate('i18AboutUs.Contact Sales', 'CONTACT SALES')}</p>
											<div className='ml20 sprite-about-us sprite-about-us-1-3'></div>
											{/* <div className='ml20 sprite-home-min sprite-home-min-3-9'></div> */}
										</Button>
									</a>
								</Link>
							</div>

						</div>
					</div>

					{/* Submit Inventory Request */}
					<div className='ps-container'>
						<BreadCrumb breacrumb={breadcrumb} layout="fullwidth" />

						{
							isAddSuccess && (
								<div className='mt20 pub-border15'>
									<div className='pub-flex mt10 mb20'>
										<div className='sprite-about-us sprite-about-us-1-5 mr10 mt5'></div>
										<div>
											<div className='pub-font18 pub-fontw pub-color-success w290'>{iInventorySucTip1}</div>

											<div className='pub-font13 pub-color555'>
												<p>{iInventorySucTip2}</p>
												<p>{iInventorySucTip3}</p>
											</div>
										</div>
									</div>
								</div>
							)
						}

						{
							!isAddSuccess && (
								<div>
									<div className='mt20 pub-border box-shadow'>
										<h2 className={styles.leftTitle}>{iUploadTitle}</h2>
										<div className={`${styles.uploadCenter} pub-flex-center`}>
											<Upload {...uploadProps}>
												<div className={styles.uploadBox}>
													<div className='sprite-about-us sprite-about-us-1-1' style={{ margin: "0 auto" }}></div>
													<div className={`${styles.uploadText} mt15`}>{iUploadLimit}</div>
												</div>
											</Upload>
											<div>
												{fileList?.length > 0 && (
													<List
														dataSource={fileList}
														className='mt20'
														renderItem={(file) => (
															<List.Item style={{ borderBottom: 0, padding: 0 }}>
																<div className='pub-color555'>{file.name}</div>
																<div className='ml5 sprite-about-us sprite-about-us-1-4' onClick={() => handleRemove(file)}></div>
																{/* <Button danger onClick={() => handleRemove(file)}>
                                                            删除
                                                            </Button> */}
															</List.Item>
														)}
													/>
												)}
											</div>
										</div>
									</div>

									<div className='mt20 pub-border15 box-shadow'>
										<h2 className='mb20 pub-left-title'>{iContactInformation}</h2>
										<Row gutter={20} className={`${styles.inventorySolutionsRow} mb5`}>
											{/* xs={2} sm={4} md={6} lg={8} xl={10} */}
											<Col xs={24} sm={12} md={8} xl={6}>
												{firstNameItem()}
											</Col>
											{!curLanguageCodeZh() && <Col xs={24} sm={12} md={8} xl={6}>
												{lastNameItem()}
											</Col>}
											<Col xs={24} sm={12} md={8} xl={6}>
												{emailItem()}
											</Col>
											<Col xs={24} sm={12} md={8} xl={6}>
												{phoneItem()}
											</Col>
											<Col xs={24} sm={24} md={16} xl={!curLanguageCodeZh() ? 24 : 18}>
												{remarkItem()}
											</Col>
										</Row>

										{(!curLanguageCodeZh()) && <div className=""><CloudflareTurnstile onVerify={handleVerify} isErr={isCfErr} /></div>}
									</div>

									<button
										type="submit"
										ghost="true"
										className='custom-antd-primary ps-add-cart-footer-btn mt30 w220'
									>
										{iSubmitInventoryRequest}
									</button>
								</div>
							)
						}
					</div>
				</Form>
			</div>
		</PageContainer>
	);
};
export default InventorySolutions;

export async function getServerSideProps({ req }) {
	const translations = await changeServerSideLanguage(req)

	return {
		props: {
			...translations,
		}
	}
}


