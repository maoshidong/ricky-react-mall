import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { Button } from 'antd';
import Link from 'next/link';
import {
	PRODUCTS_HOT_PRODUCTS,
	HELP_CENTER,
	HELP_FREE_SAMPLE,
	ACCOUNT_ORDERS,
	PACKAGE_TRACKING,
	HELP_SHIPPING_RATES,
	ToolsRouterList,
	// HotProductsRouterList,
	NEWSROOM,
	BLOG,
	PRODUCT_HIGHLIGHTS,
	APPLICATION_NOTES,
} from '~/utilities/sites-url';
import { RESOURCES_TOOLS_LIST } from '~/utilities/constant';
import ModuleLogin from '~/components/ecomerce/modules/ModuleLogin'
import useLanguage from '~/hooks/useLanguage';

const Resources = ({ auth }) => {
	const { i18Translate, i18MapTranslate } = useLanguage();
	// const iProducts = i18Translate('i18Head.products', "Products")
	const iContent = i18Translate('i18SmallText.Content', "Content")
	const iTools = i18Translate('i18SmallText.Tools', "Tools")
	const iSupport = i18Translate('i18SmallText.Support', "Support")
	const iHelp = i18Translate('i18MenuText.Help', "Help")


	const { isAccountLog } = auth
	const Router = useRouter()
	const [loginVisible, setLoginVisible] = useState(false);
	const [curActiveUrl, setCurActiveUrl] = useState('')

	// box-shadow: rgba(55, 99, 177, .2) 8px 8px 20px 0px, #fff -8px -8px 20px 0px; head 下阴影

	// const goToPages = (e, item) => {
	//     e.preventDefault();
	//     const menu = document.getElementById('pubfixedTop');
	//     menu.classList.remove('pub-menu-active');
	//     Router.push(`/page/${item.url}`)
	// }
	// const goToAboutUs = () => {
	//     Router.push(`/page/about-us`)
	// }

	const handleUrl = (e, item) => {
		e.preventDefault()
		if (item?.needLog && !isAccountLog) {
			setLoginVisible(true)
			setCurActiveUrl(item?.url)
			return
		}
		Router.push(item?.url)
	}

	const handleLogin = () => {
		setLoginVisible(false);
		Router.push(curActiveUrl)
	};

	const ResourcesList = [
		{
			title: iContent,
			childList: [
				{ routerName: 'Blog', url: BLOG },
				{ routerName: 'Product Highlights', url: PRODUCT_HIGHLIGHTS, type: 2 }, // type: 2 用于判断多语言取的是哪个
				{ routerName: 'Application Notes', url: APPLICATION_NOTES, type: 2 },
				{ routerName: 'News Archive', url: NEWSROOM },
			]

		},
		// {
		//     title: iProducts,
		//     childList: HotProductsRouterList,
		// },
		{
			title: iTools,
			childList: ToolsRouterList,
		},
		{
			title: iSupport,
			childList: [
				{ routerName: 'Free Sample', url: HELP_FREE_SAMPLE },
				{ routerName: 'Package Tracking', url: PACKAGE_TRACKING },
				// {routerName: 'Blog', url: BLOG},
				// {routerName: 'Product Highlights', url: PRODUCT_HIGHLIGHTS, type: 2}, // type: 2 用于判断多语言取的是哪个
				// {routerName: 'Application Notes', url: APPLICATION_NOTES, type: 2 },
			],
		},
		{
			title: iHelp,
			childList: [
				{ routerName: 'Help Center', url: HELP_CENTER },
				{ routerName: 'Order Status', url: ACCOUNT_ORDERS, needLog: true },
				{ routerName: 'Shipping Rates', url: HELP_SHIPPING_RATES },
				// {routerName: 'RMA Policy', url: ''}
			],
		},
	]
	const resourcesTtext = "Our diverse network allows us to supply electronic components for a variety of industries, including automotive, consumer products, contract manufacturers, electronic manufacturing services (EMS), energy systems and controls, industrial automation, measurement technology, medical devices, telecommunications and welding."

	return (
		<div className="nav-resources custom-antd-btn-more" style={{ marginLeft: '-5px' }}>
			<div className="nav-fixed-left">
				<div className='nav-pub-left pub-color555 mt25 mb30 mr20'>
					<h2 className="mb10 pub-font16 pub-fontw">{i18Translate('i18MenuText.Resources', "Resources")}</h2>
					<p className="pub-lh18">{i18Translate('i18Head.resourcesDes', resourcesTtext)}</p>

					<Link href={PRODUCTS_HOT_PRODUCTS}>
						<a><Button type="primary" ghost className='pub-flex-center mt25 w180'>
							<p className="mr18">{i18Translate('i18MenuText.view', "View")} {i18Translate('i18MenuText.Hot Products', "Hot Products")}</p>
							<div className="sprite-home-min sprite-home-min-3-9"></div>
						</Button></a>
					</Link>
				</div>
			</div>
			<div className="nav-fixed-right navigation-fixed-right">
				<div className='pub-flex mb60' style={{ marginBottom: '120px !important' }}>
					{
						ResourcesList?.map((item, index) => {
							return <div className="nav-resources-list" key={"a" + index}>
								<h3 className="mb12 pub-font16 pub-fontw">{item.title}</h3>
								{
									item?.childList.map((i, idx) => {
										return <div className="mb10" key={"b" + idx}>
											<Link href={i?.url}>
												<a className='pub-color-hover-link' onClick={(e) => handleUrl(e, i)}>
													{
														i?.type === 2 ? i18MapTranslate(`i18ResourcePages.${i.routerName}`, i.routerName) : i18MapTranslate(`i18MenuText.${i.routerName}`, i.routerName)
													}
												</a>
											</Link>
										</div>
									})
								}
							</div>
						})
					}

				</div>

				<div className="resources-tools mb20" style={{ marginLeft: '-40px' }}>
					<ul className='row pub-margin-8'>
						{RESOURCES_TOOLS_LIST.map((item) => (
							<li
								key={item.name}
								className='col-xl-2 col-lg-4 col-md-6 col-sm-12'
							>
								<Link href={item?.url}>
									<a onClick={(e) => handleUrl(e, item)} className='pub-flex-align-center pub-color-hover-link' style={{ flexDirection: 'column' }}>
										<div className={item.className}></div>
										<h4 className="pub-font500 mt15">
											{i18MapTranslate(`i18MenuText.${item.name}`, item.name)}
										</h4>
									</a>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>

			<ModuleLogin
				visible={loginVisible}
				onCancel={() => setLoginVisible(false)}
				onLogin={handleLogin}
			/>
		</div>
	)
}

export default connect(state => state)(Resources);