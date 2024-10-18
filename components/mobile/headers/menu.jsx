import { Popup, Collapse } from 'antd-mobile';
import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import Image from 'next/image';
import useLanguage from '~/hooks/useLanguage';
import {
	PRODUCTS,
	PRODUCTS_NEWEST_PRODUCTS,
	PRODUCTS_HOT_PRODUCTS,
	PRODUCTS_RECOMMEND_PRODUCTS,
	PRODUCTS_DISCOUNT_PRODUCTS,
	ToolsRouterList,
	HELP_FREE_SAMPLE,
	PACKAGE_TRACKING,
	BLOG,
	PRODUCT_HIGHLIGHTS,
	APPLICATION_NOTES,
	HELP_CENTER,
	ACCOUNT_ORDERS,
	HELP_SHIPPING_RATES,
	PAGE_ABOUT_US,
	MANUFACTURER, POPULAR_MANUFACTURERS,
	QUALITY,
	AboutUsRouterList,
} from '~/utilities/sites-url';
import Link from 'next/link'
import { AllCatalogTree } from '~/utilities/AllCatalogTree'
import { useRouter } from "next/router";
import ModuleLogin from '~/components/ecomerce/modules/ModuleLogin'
import { isIncludes } from '~/utilities/common-helpers'

const Products = () => {
	const { i18Translate } = useLanguage();
	const viewAllProducts = i18Translate('i18MenuText.View all products', 'View all products')

	return <>
		{
			AllCatalogTree.slice(0, 10).map(item => (
				<div
					className="m-menu-list-sub-item"
					key={item.id}
				>
					<Link href={`/products/catalog/${isIncludes(item.slug)}/${item.id}`}>{item.name}</Link>
				</div>
			))
		}
		<div
			className="m-menu-list-sub-item pub-color-link"
		>
			<Link href={PRODUCTS}>
				{viewAllProducts}
			</Link>
		</div>
	</>
}

const Manufacturers = () => {
	const { i18Translate } = useLanguage();

	const list = [
		{ name: i18Translate('i18CatalogHomePage.Popular Manufacturers', 'Popular Manufacturers'), url: POPULAR_MANUFACTURERS },
		{ name: i18Translate('i18CatalogHomePage.View All Manufacturers', 'View All Manufacturers'), url: MANUFACTURER },
	]

	return <>
		{
			list.map(item => (
				<div key={item.url} className="m-menu-list-sub-item">
					<Link href={item.url}>{item.name}</Link>
				</div>
			))
		}
	</>
}

const Resources = ({ auth }) => {
	const { i18Translate, i18MapTranslate } = useLanguage();
	const iNewestProducts = i18Translate('i18MenuText.Newest Products', "Newest Products")
	const iHotProducts = i18Translate('i18MenuText.Hot Products', "Hot Products")
	const iRecommendedProducts = i18Translate('i18MenuText.Recommended Products', "Recommended Products")
	const iDiscountProducts = i18Translate('i18MenuText.Discount Products', "Discount Products")
	// Support
	const iFreeSample = i18Translate('i18MenuText.Free Sample', "Free Sample")
	const iPackageTracking = i18Translate('i18MenuText.Package Tracking', "Package Tracking")
	const iBlog = i18Translate('i18MenuText.Blog', "Blog")
	const iProductHighlights = i18Translate('i18ResourcePages.Product Highlights', "Product Highlights")
	const iApplicationNotes = i18Translate('i18ResourcePages.Application Notes', "Application Notes")
	// Help
	const iHelpCenter = i18Translate('i18MenuText.Help Center', "Help Center")
	const iOrderStatus = i18Translate('i18MenuText.Order Status', "Order Status")
	const iShippingRates = i18Translate('i18MenuText.Shipping Rates', "Shipping Rates")

	const Router = useRouter()
	const { isAccountLog } = auth

	const [loginVisible, setLoginVisible] = useState(false);

	const handleUrl = (e) => {

		e.preventDefault()
		if (!isAccountLog) {
			setLoginVisible(true)
			return
		}
		Router.push(ACCOUNT_ORDERS)
	}

	const handleLogin = () => {
		setLoginVisible(false);
		Router.push(ACCOUNT_ORDERS)
	};


	return <div className="m-menu-list-sub-item">
		<Link href={PRODUCTS_NEWEST_PRODUCTS}>{iNewestProducts}</Link>
		<Link href={PRODUCTS_HOT_PRODUCTS}>{iHotProducts}</Link>
		<Link href={PRODUCTS_RECOMMEND_PRODUCTS}>{iRecommendedProducts}</Link>
		<Link href={PRODUCTS_DISCOUNT_PRODUCTS}>{iDiscountProducts}</Link>
		{/* Tools */}
		{
			ToolsRouterList.map((i, idx) => {
				return <Link href={i?.url} key={"b" + idx}>
					{/* <a> */}
					{i18MapTranslate(`i18MenuText.${i.routerName}`, i.routerName)}
					{/* </a> */}
				</Link>

			})
		}
		{/* support */}
		<Link href={HELP_FREE_SAMPLE}>{iFreeSample}</Link>
		<Link href={PACKAGE_TRACKING}>{iPackageTracking}</Link>
		<Link href={BLOG}>{iBlog}</Link>
		<Link href={PRODUCT_HIGHLIGHTS}>{iProductHighlights}</Link>
		<Link href={APPLICATION_NOTES}>{iApplicationNotes}</Link>
		{/* Help */}
		<Link href={HELP_CENTER}>{iHelpCenter}</Link>
		<Link href={ACCOUNT_ORDERS}>
			<a onClick={(e) => handleUrl(e)}>{iOrderStatus}</a>
		</Link>
		<Link href={HELP_SHIPPING_RATES}>{iShippingRates}</Link>

		<ModuleLogin
			visible={loginVisible}
			onCancel={() => setLoginVisible(false)}
			onLogin={handleLogin}
		/>

	</div>
}

const Quality = () => {
	const { i18Translate } = useLanguage();
	const iQuality = i18Translate('i18Head.quality', 'Quality')

	return <div className="m-menu-list-sub-item">
		<Link href={`/quality`}>{iQuality}</Link>
	</div>
}

const AboutUs = () => {
	const { i18MapTranslate } = useLanguage();
	// 中文关闭 - 没改: 手机端
	return AboutUsRouterList.map(({ routerName, url }) => (
		<div key={routerName} className="m-menu-list-sub-item">
			<Link href={url}>{i18MapTranslate(`i18MenuText.${routerName}`, routerName)}</Link>
		</div>
	))
}

const Menu = ({ children, auth }) => {
	const [visible, setVisible] = useState(false)
	const [activeKey, setActiveKey] = useState()
	const { i18Translate } = useLanguage();

	const navList = [
		{
			label: i18Translate('i18Head.products', 'Products'),
			value: 'PRODUCTS',
			url: PRODUCTS
		},
		{
			label: i18Translate('i18Head.manufacturer', 'Manufacturers'),
			value: 'MANUFACTURERS',
			url: MANUFACTURER
		},
		{
			label: i18Translate('i18Head.resources', 'Resources'),
			value: 'RESOURCES',
			url: '/#'
		},
		{
			label: i18Translate('i18Head.quality', 'Quality'),
			value: 'QUALITY',
			url: QUALITY
		},
		{
			label: i18Translate('i18Head.aboutUs', 'About Us'),
			value: 'ABOUTS',
			url: PAGE_ABOUT_US
		}
	]

	const onOpen = () => {
		setVisible(true)
	}

	const onClose = () => {
		setVisible(false)
	}

	const catalogList = useMemo(() => {
		return {
			'PRODUCTS': <Products />,
			'MANUFACTURERS': <Manufacturers />,
			'RESOURCES': <Resources auth={auth} />,
			'QUALITY': <Quality />,
			'ABOUTS': <AboutUs />,
		}
	}, [])

	return <>
		{
			React.cloneElement(children, {
				...children.props,
				onClick() {
					onOpen()
				}
			})
		}
		<Popup
			className="m-menu-container"
			visible={visible}
			onClose={onClose}
			position='left'
			closeOnMaskClick
		>
			<div className="m-menu-top">
				<Link href='/'>
					{/* width={238} height={48} */}
					<a><Image src={"/static/img/logo.png"} width={130} height={25} alt="logo" /></a>
				</Link>
			</div>
			<div className="m-menu-list">
				<Collapse activeKey={activeKey} onChange={(keys) => {
					setActiveKey(keys[1])
				}}>
					{
						navList.map(({ label, value, url }, index) => (
							<Collapse.Panel className="m-menu-list-item" key={index + 1} title={label}>
								{
									catalogList[value]
								}
							</Collapse.Panel>
						))
					}
				</Collapse>
				{/* <List>
                    {
                        navList.map(
                            ({label,value,url}) => (
                                <List.Item className="m-menu-list-item" key={value}>
                                    <Link href={url}>
                                        {label}
                                    </Link>
                                </List.Item>
                                // <Collapse.Panel className="m-menu-list-item" key={value} title={label}>hello1</Collapse.Panel>
                            )
                        )
                    }
                </List> */}
			</div>
		</Popup>
	</>
}

export default connect(state => state)(Menu);