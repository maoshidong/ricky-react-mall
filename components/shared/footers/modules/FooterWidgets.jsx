import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
import NoSSR from 'react-no-ssr';

import FollowUs from '~/components/ecomerce/minCom/FollowUs';
import { useCookies } from 'react-cookie';
import { NewsRepository } from '~/repositories';
import { EMAIL_REGEX } from '~/utilities/constant';

import {
	getEnvUrl,
	PACKAGE_TRACKING,
	ACCOUNT_ORDERS,
	HELP_SHIPPING_RATES,
	HELP_FREE_SAMPLE,
	CONTENT_SEARCH,
	HELP_CENTER,
	NEWSROOM,
	ACCOUNT_QUOTE_BOM_UPLOAD,
} from '~/utilities/sites-url';

const FooterWidgets = ({ paramMap = {} }) => {

	let concatElm;
	const { i18Translate, i18MapTranslate, curLanguageCodeZh, temporaryClosureZh, getDomainsData } = useLanguage();
	const { iSubscriptionSuccessful, iEmailAddress, iEmailTip } = useI18();
	const [cookies, setCookie] = useCookies(['account']);
	const [isSubscriptionSuccess, setIsSubscriptionSuccess] = useState(false) // 已订阅
	const [curEmail, setCurEmail] = useState(false)
	const [isError, setIsError] = useState(false)

	const iPhone = i18Translate('i18CompanyInfo.Phone', process.env.telephone);
	const iFollowUs = i18Translate('i18CareersPage.Follow Us', 'Follow Us');
	// 联系我们
	concatElm = (
		<aside className="widget widget_footer widget_contact-us">
			<h3 className="widget-title">{i18Translate('i18MenuText.Connect', 'Connect')}</h3>
			<div className="widget_content">
				<div className="widget_content-item">
					<div className="sprite-home-min sprite-home-min-2-1"></div>
					<a className="concat-text pub-color-hover-link" href={`tel:${paramMap?.phone || iPhone}`}>
						{paramMap?.phone || iPhone}
					</a>
				</div>
				<div className="widget_content-item">
					<div className="sprite-home-min sprite-home-min-2-2"></div>
					<p className="concat-text pub-color-hover-link">{paramMap?.faxes || iPhone}</p>
				</div>
				<div className="widget_content-item">
					<div className="sprite-home-min sprite-home-min-2-3"></div>
					<p className="concat-text">
						<a className="pub-color-hover-link" href={`mailto:${paramMap?.email || process.env.email}`}>
							{paramMap?.email || process.env.email}
						</a>
					</p>
				</div>
				<div className="widget_content-item">
					{!curLanguageCodeZh() && <div className="sprite-home-min sprite-home-min-2-4"></div>}
					{curLanguageCodeZh() && <Image
						src="/static/img/common/qq.png"
						width={21} height={21}
					/>}
					<span
						className="concat-text pub-color-hover-link"
						onClick={() => window.open(`${curLanguageCodeZh() ? paramMap?.qqUrl : paramMap?.skype}`, '_blank')}
						target="_blank">
						{i18Translate('i18CompanyInfo.Skype Live Chat', 'Skype Live Chat')}
					</span>
					{/* <a className="concat-text pub-color-hover-link" href={`${curLanguageCodeZh() ? paramMap?.qqUrl : paramMap?.skype}`} target="_blank">
						{i18Translate('i18CompanyInfo.Skype Live Chat', 'Skype Live Chat')}
					</a> */}

				</div>
			</div>
		</aside>
	);

	const getElm = (arr, name) => {
		return (
			<aside className="widget widget_footer">
				<h3 className="widget-title mb10">{i18MapTranslate(`i18MenuText.${name}`, name)}</h3>
				<ul className="ps-list--link">
					{arr?.map((item, index) => (
						<li key={'elm' + index}>
							<Link href={item.url}>
								{/* aria-label={`go to ${item.name}`} */}
								<a>
									{i18MapTranslate(`i18MenuText.${item.name}`, item.name)}
								</a>
							</Link>
						</li>
					))}
				</ul>
			</aside>
		);
	};


	const payFollowUs = [
		{ class: 'sprite-home-bank sprite-home-bank-3' },
		{ class: 'sprite-home-bank sprite-home-bank-1' },
		{ class: 'sprite-home-bank sprite-home-bank-4' },
		{ class: 'sprite-home-bank sprite-home-bank-6' },
		{ class: 'sprite-home-bank sprite-home-bank-5' },
		{ class: 'sprite-home-bank sprite-home-bank-2' },
	];
	const companyArr = [
		{ name: "About Us", url: '/page/about-us' },
		{ name: "Certifications", url: '/page/certifications' },
		{ name: "Quality", url: '/quality' },
		{ name: "Newsroom", url: getEnvUrl(NEWSROOM) },
		{ name: "Careers", url: '/page/careers' },
		{ name: "Contact Us", url: '/page/contact-us' },
	]
	const resourcesArr = [
		{ name: "Blog", url: CONTENT_SEARCH },
		{ name: "All Products", url: '/products' },
		{ name: "BOM Tools", url: getEnvUrl(ACCOUNT_QUOTE_BOM_UPLOAD) },
		{ name: "Free Sample", url: HELP_FREE_SAMPLE },
		{ name: "Inventory Solutions", url: '/page/inventory-solutions' },
		// {name: 'Conversion Calculators', url: '#'}, // 没做
	]
	const helpArr = [
		{ name: "Help Center", url: HELP_CENTER },
		{ name: "Order Status", url: ACCOUNT_ORDERS, needLog: true },
		{ name: "Package Tracking", url: PACKAGE_TRACKING },
		{ name: "Shipping Rates", url: HELP_SHIPPING_RATES },
	]
	const companyElm = getElm(temporaryClosureZh() ? companyArr?.filter(item => item?.name !== 'Certifications') : companyArr, i18Translate('i18MenuText.company', "Company"))
	const resourcesElm = getElm(temporaryClosureZh() ? resourcesArr?.filter(item => item?.name !== 'Free Sample') : resourcesArr, i18Translate('i18MenuText.Resources', "Resources"))
	const helpElm = getElm(helpArr, i18Translate('i18MenuText.Help', "Help"))
	const onSubmit = async () => {
		if (!curEmail) {
			// message.warning('Please input your email!')
			return;
		}
		// const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!curEmail.match(EMAIL_REGEX)) {
			setIsError(true)
			return;
		}

		const params = {
			languageType: getDomainsData()?.defaultLocale,
			email: curEmail,
			appUserId: curEmail === cookies?.profileData?.email ? cookies?.profileData?.uid : '', // 如果输入的邮箱和登录的邮箱不一致， 就不传uid
		}
		const res = await NewsRepository.apiApplySubscribe(params);
		if (res?.code === 0) {
			setIsSubscriptionSuccess(true)
		}
	}
	useEffect(async () => {
		const res = await NewsRepository.apiUserSubscribeList(cookies?.account?.token, { languageType: getDomainsData()?.defaultLocale })
		let arr = []
		res?.data?.map(item => {
			if (item?.status === 1) {
				arr.push(item?.id)
			}
		})
		if (arr?.length > 0) {
			setIsSubscriptionSuccess(true)
		}
	}, [])


	return (
		<div className="ps-footer__widgets">
			{concatElm}
			{companyElm}
			{resourcesElm}
			{!temporaryClosureZh() && helpElm}

			<aside className="widget widget_footer">

				<div className="widget-title">{iFollowUs}</div>
				<div className='pub-flex-align-center mb30'>
					<FollowUs paramMap={paramMap} />
				</div>

				<NoSSR>
					<div className='pub-flex-align-center w200' style={{ flexWrap: 'wrap' }}>
						{
							payFollowUs.map((item, i) => {
								if (temporaryClosureZh()) return null
								return (
									<div
										key={'Follow1' + i} className={"mr10 mb10 " + item.class}
									>
									</div>
								)
							})
						}
					</div>
				</NoSSR>

			</aside>

			<aside className="widget widget_footer w280">
				<div style={{ display: 'flex', alignItems: 'center' }}>
					{
						isSubscriptionSuccess && (
							<div className='mt10 mb20' style={{ display: 'flex' }}>
								<div className='sprite-about-us sprite-about-us-1-5 mr10'></div>
								<div>
									<div className='pub-font16 pub-fontw pub-color-success'>{iSubscriptionSuccessful}</div>
									<div className='mt3 pub-lh16' style={{ maxWidth: '220px' }}>
										{i18MapTranslate('i18MyAccount.subSucTip', 'Keep an eye on your inbox for news and updates from Origin Data!')}
										{/* Keep an eye on your inbox for news
										<br />
										and updates from Origin DATA ! */}
									</div>
								</div>
							</div>
						)
					}
					{
						!isSubscriptionSuccess && <div className="widget-title" style={{ marginBottom: 0 }}>{i18MapTranslate('i18MyAccount.Get the Latest News', 'Get the Latest News')}</div>
					}
				</div>

				{
					!isSubscriptionSuccess && (
						<div className="form-group--nest mt15">
							<input
								className="form-control"
								type="email"
								placeholder={iEmailAddress}
								onChange={(e) => { setCurEmail(e.target.value); setIsError(false) }}
								style={{ width: '200px', height: '32px', padding: '0 4px 0 14px', background: '#fff' }}
							/>

							<button onClick={onSubmit} className={"ps-btn " + (curEmail ? "subscribe-email" : '')} style={{ width: '80px', height: '32px', padding: 0, backgroundColor: '#5B99E7' }}>
								{i18MapTranslate('i18MyAccount.Subscribe', 'Subscribe')}</button>
						</div>
					)

				}
				{isError && <p className='mt5 pub-danger'>{iEmailTip}</p>}
			</aside>


		</div>
	);
}

export default FooterWidgets;

{/* <Popover
			content={<div style={{
				fontSize: '12px',
				color: '#666',
				borderRadius: '6px',
				marginTop: '2px'
			}}>
				Subcribe to get information about products and coupons
			</div>}
			placement="top"
			trigger="hover"
		>
			<QuestionCircleOutlined className='ml10 pub-font14 pub-color666' />
		</Popover> */}
