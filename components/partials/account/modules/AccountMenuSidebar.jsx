import { useState } from 'react';
import { Menu } from 'antd';
import Link from 'next/link';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import {
	getEnvUrl,
	ACCOUNT_USER_INFORMATION,
	ACCOUNT_ADDRESS,
	ACCOUNT_VAT_NUMBER,
	ACCOUNT_FREIGHT_ACCOUNTS,
	ACCOUNT_COUPON,
	ACCOUNT_CHANGE_PASSWORD,
	ACCOUNT_ORDERS,
	ACCOUNT_ORDERS_PROJECT,
	ACCOUNT_ORDERS_CART, // 我的订单
	ACCOUNT_SAMPLE_LIST,
	ACCOUNT_QUOTE_HISTORY,
	ACCOUNT_SAVED_BOMS,
	ACCOUNT_FAVORITES,
	ACCOUNT_CUSTOMER_REFERENCE,
	ACCOUNT_BROWSE_HISTORY, // Inquiry & quotation
} from '~/utilities/sites-url';

const inventorySolutionsLink = '/account/inventory-solutions'
const subscriptionPreferencesLink = '/account/subscription-preferences'

import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';

import Device from '~/components/hoc/Device';
import { Popup } from 'antd-mobile';


const AccountMenuSidebar = ({ auth }) => {
	const { i18Translate } = useLanguage();
	const { iCustomerReference } = useI18();

	const Router = useRouter();
	// const [openKeys, setOpenKeys] = useState(['sub1']);
	const getItem = (label, key, icon, children, type) => {
		return {
			key,
			icon,
			children,
			label,
			type,
		};
	}

	const returnGetItem = (url, label) => {
		return getItem(
			<Link href={getEnvUrl(url)}>
				<a className='menu-label'>{label}</a>
			</Link>,
			url
		)
	}
	const iContactInformation = i18Translate('i18SmallText.Contact Information', 'Contact Information')
	const iAddressBook = i18Translate('i18MyAccount.Address Book', 'Address Books')
	const iVATNumber = i18Translate('i18AboutOrder2.VAT Number', 'VAT Numbers')
	const iFreightAccounts = i18Translate('i18MyAccount.Freight Accounts', 'Freight Accounts')
	const iCoupon = i18Translate('i18MyAccount.Coupon', 'Vouchers')
	const iChangePassword = i18Translate('i18MyAccount.Change Password', 'Change Password')

	const iOrderList = i18Translate('i18MyAccount.Order List', 'Orders')
	// const iOrderHistory = i18Translate('i18MyAccount.Order History', 'Order History')
	const iProject = i18Translate('i18MyCart.Project', 'Projects')
	const iSavedCarts = i18Translate('i18MyCart.Cart', "Carts")

	const iQuoteList = i18Translate('i18MyAccount.Quote List', "Quotes")
	const iSavedBOMs = i18Translate('i18MyAccount.BOMs', "BOMs")
	const iSample = i18Translate('i18MyAccount.Sample', "Samples")
	const iFavorites = i18Translate('i18MyAccount.Favorites', "Favorites")
	const iBrowseHistory = i18Translate('i18Home.recent', 'Browse Historys')

	const iInventorySolutions = i18Translate('i18MenuText.Inventory Solutions', 'Inventory Solutions')
	const iSubscriptionPreferences = i18Translate('i18MyAccount.Subscription Preferences', 'Subscription Preferences')


	// 子菜单列表
	const personalDetailsMenu = [
		returnGetItem(ACCOUNT_USER_INFORMATION, iContactInformation),
		returnGetItem(ACCOUNT_ADDRESS, iAddressBook),
		returnGetItem(ACCOUNT_VAT_NUMBER, iVATNumber),
		returnGetItem(ACCOUNT_FREIGHT_ACCOUNTS, iFreightAccounts),
		returnGetItem(ACCOUNT_COUPON, iCoupon),
		// returnGetItem(ACCOUNT_CHANGE_PASSWORD, iChangePassword),
	]
	if (auth?.accountType === 1) {
		personalDetailsMenu.push(returnGetItem(ACCOUNT_CHANGE_PASSWORD, iChangePassword))
	}
	const myOrdersMenu = [
		returnGetItem(ACCOUNT_ORDERS, iOrderList),
		// returnGetItem(ACCOUNT_ORDERS_HISTROY, iOrderHistory),
		returnGetItem(ACCOUNT_ORDERS_PROJECT, iProject), // 暂时关闭项目
		returnGetItem(ACCOUNT_ORDERS_CART, iSavedCarts), // 暂时关闭-购物车篮子
	]
	const inquiryQuotationMenu = [
		returnGetItem(ACCOUNT_QUOTE_HISTORY, iQuoteList),
		returnGetItem(ACCOUNT_SAVED_BOMS, iSavedBOMs),
		returnGetItem(ACCOUNT_SAMPLE_LIST, iSample),
		returnGetItem(ACCOUNT_FAVORITES, iFavorites),
		returnGetItem(ACCOUNT_CUSTOMER_REFERENCE, iCustomerReference),
		returnGetItem(ACCOUNT_BROWSE_HISTORY, iBrowseHistory),
	]
	const valueAddedServicesMenu = [
		returnGetItem(inventorySolutionsLink, iInventorySolutions),
		returnGetItem(subscriptionPreferencesLink, iSubscriptionPreferences),
	]
	const iPersonalDetails = i18Translate('i18MyAccount.Personal Details', 'Personal Details')
	const iMyOrders = i18Translate('i18MyAccount.My Orders', 'Orders') // 修改多语言
	const iInquiryQuotation = i18Translate('i18MyAccount.Inquiry & quotation', 'Inquiry & quotation')
	const iValueAddedServices = i18Translate('i18MyAccount.Value-added services', 'Value-added services')
	const items = [
		// <MailOutlined />
		getItem(iPersonalDetails, 'sub1', <div className='sprite-account-icons sprite-account-icons-1-1'></div>, personalDetailsMenu),
		getItem(iMyOrders, 'sub2', <div className='sprite-account-icons sprite-account-icons-1-2'></div>, myOrdersMenu),
		getItem(iInquiryQuotation, 'sub4', <div className='sprite-account-icons sprite-account-icons-1-3'></div>, inquiryQuotationMenu),
		getItem(iValueAddedServices, 'sub5', <div className='sprite-account-icons sprite-account-icons-1-4'></div>, valueAddedServicesMenu),
	];

	const defaultOpenKeys = items.map(item => item.key);
	return (
		<aside className="ps-widget--account-dashboard">
			<div className="pub-menu pub-border">
				<Menu
					mode="inline"
					defaultOpenKeys={defaultOpenKeys}
					// expandIcon="aaaa"
					defaultSelectedKeys={Router.asPath} // 选中
					// openKeys={openKeys}
					// onOpenChange={onOpenChange}
					style={{
						width: 250,
						// borderRadius: 20,
						borderRadius: 6
					}}
					items={items}
				/>
			</div>
		</aside>
	)
};

const MenuPopup = (props) => {
	const [visible, setVisible] = useState(false)

	const onOpen = () => {
		setVisible(true)
	}

	const onClose = () => {
		setVisible(false)
	}

	return <>
		<div className='common-bg-image-icon1 account-menu-side' onClick={() => onOpen()}></div>
		<Popup visible={visible} position='left' closeOnMaskClick onClose={() => onClose()}>
			<AccountMenuSidebar {...props} />
		</Popup>
	</>
}

const SideMenu = (props) => {
	return <Device>
		{({ isDesktop }) => {
			if (!isDesktop) {
				return <MenuPopup {...props} />
			} else {
				return <AccountMenuSidebar {...props} />
			}
		}}
	</Device>
}

export default connect((state) => state)(withCookies(SideMenu));