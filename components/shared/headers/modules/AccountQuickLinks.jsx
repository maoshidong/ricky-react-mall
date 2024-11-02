import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import Link from 'next/link';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import Logout from '~/components/partials/account/Logout';

import useLocalStorage from '~/hooks/useLocalStorage';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
import {
	LOGIN,
	ACCOUNT_ORDERS,
	ACCOUNT_USER_INFORMATION,
	ACCOUNT_ADDRESS,
	ACCOUNT_FREIGHT_ACCOUNTS,
	ACCOUNT_COUPON,
	ACCOUNT_ORDERS_CART,
	ACCOUNT_ORDERS_PROJECT,
	ACCOUNT_QUOTE_HISTORY,
	ACCOUNT_QUOTE_BOM_UPLOAD,
	ACCOUNT_FAVORITES,
	ACCOUNT_CUSTOMER_REFERENCE,
	ACCOUNT_BROWSE_HISTORY,
} from '~/utilities/sites-url';
// modules 有未使用的
const AccountQuickLinks = (props) => {
	const { i18Translate, temporaryClosureZh } = useLanguage();
	const { iCustomerReference } = useI18();
	const Router = useRouter();
	const [loginCallBack, setLoginCallBack] = useLocalStorage('loginCallBack', '/');

	const [cookies, setCookie] = useCookies(['email', 'account']);
	const { profileData } = cookies

	const { auth, profileInfo = {} } = props;
	const [isShow, setIsShow] = useState(true);
	const [isShowCart, setIsShowCart] = useState(false)
	const timer = useRef(null)

	useEffect(() => {
		if (profileInfo && !!Object.keys(profileInfo).length) {
			// const { uid1 } = profileInfo;
			setIsShow(true);
		}
	}, [profileInfo])


	const iAddressBook = i18Translate('i18MyAccount.Address Book', 'Address Books')
	const iFreightAccounts = i18Translate('i18MyAccount.Freight Accounts', 'Freight Accounts')
	const iCoupon = i18Translate('i18MyAccount.Coupon', 'Vouchers')
	const iOrderList = i18Translate('i18MyAccount.Order List', 'Orders')
	const iCart = i18Translate('i18MyCart.Cart', 'Carts')

	const iProject = i18Translate('i18MyCart.Project', 'Projects')
	const iQuote = i18Translate('i18QuotePage.quote', 'Quotes')
	const iBOM = i18Translate('i18MyCart.Bom', 'Boms')
	const iFavorites = i18Translate('i18MyAccount.Favorites', "Favorites")

	const iBrowseHistory = i18Translate('i18Home.recent', 'Browse Historys')

	const accountActions = [
		{ label: iAddressBook, href: ACCOUNT_ADDRESS },
		{ label: iFreightAccounts, href: ACCOUNT_FREIGHT_ACCOUNTS },
		{ label: iCoupon, href: ACCOUNT_COUPON },
		{ label: iOrderList, href: ACCOUNT_ORDERS },
		{ label: iCart, href: ACCOUNT_ORDERS_CART },

		{ label: iProject, href: ACCOUNT_ORDERS_PROJECT },
		{ label: iQuote, href: ACCOUNT_QUOTE_HISTORY },
		{ label: iBOM, href: ACCOUNT_QUOTE_BOM_UPLOAD },
		{ label: iFavorites, href: ACCOUNT_FAVORITES },
		{ label: iCustomerReference, href: ACCOUNT_CUSTOMER_REFERENCE },

		{ label: iBrowseHistory, href: ACCOUNT_BROWSE_HISTORY },

	]
	const linksView = accountActions.map((item, index) => (
		<li key={index} className='mb10 pub-color-hover-link percentW100'>
			<Link href={item.href}>
				<a className='pub-font14 percentW100' style={{ 'display': 'inline-block' }}>{item.label}</a>
			</Link>
		</li>
	));

	const goLogin = (e) => {
		e.preventDefault();

		const saveUrl = Boolean(Router.asPath === "/") ? ACCOUNT_USER_INFORMATION : Router.asPath
		setLoginCallBack(saveUrl)
		Router.push(LOGIN);
	}

	// 鼠标进入
	const handEnter = () => {
		clearTimeout(timer.current);
		timer.current = setInterval(() => {
			setIsShowCart(true)
		}, 300)
	}
	// 鼠标离开
	const handLeave = () => {
		clearTimeout(timer.current);
		setIsShowCart(false)

	}
	useEffect(() => {
		return () => {
			clearTimeout(timer.current);
		}
	}, [])

	const iMyAccount = i18Translate('i18MyAccount.My Account', 'MY ACCOUNT')
	const iLogout = i18Translate('i18Login.Logout', 'Logout')
	// auth.isAccountLog === true && Boolean(typeof (auth.account) === 'string')
	// .ps-cart__content  展示隐藏用户导航
	// cookies?.account?.isAccountLog === true && Boolean(typeof (cookies?.account?.account) === 'string') && profileData?.firstName
	if ((auth.isAccountLog === true && Boolean(typeof (auth.account) === 'string'))) {
		return (
			<div
				className="pub-flex-align-center ml10 pl-10 ps-cart--mini ps-block--user-account"
				style={{ height: '60px', cursor: 'pointer', zIndex: 1000 }}
				onMouseEnter={() => handEnter()}
				onMouseLeave={() => handLeave()}
			>
				<div className='sprite-icons-1-9'></div>
				{
					profileData?.firstName && <div>
						<span className='ml10 pub-font13 pub-lh16'>Hi,{profileData?.firstName}</span>
						<p className='ml10 pub-font13  pub-lh16'>{i18Translate('i18MyAccount.My Account', 'My account')}</p>
					</div>
				}
				{/* profileData?.firstName sprite-icons-1-9*/}
				{
					(isShowCart && isShow) && <div className="ps-cart__content" id="pub-modal-box" style={{ display: 'block !important', border: 'none !important' }}>
						<div className='pub-modal-content' style={{border: 'none'}}>
							{/* <div className='pub-modal-arrow'></div> */}
							<div className='pub-modal-title'>{iMyAccount}</div>

							<div className="ps-block__content">
								<ul className="ps-list--arrow">
									{linksView}
									<Logout
										displayIcon={true}
										label={iLogout}
										className={'ps-block__footer'}
									/>
								</ul>
							</div>

						</div>
					</div>
				}
				<div className={(isShowCart && isShow) ? 'pub-modal-box-bgc' : ''}></div>
			</div>
		);
	} else {
		if (temporaryClosureZh()) return null
		return (
			<div className="ps-block--user-header">
				<div className="ps-block__right custom-antd-btn-more">
					<Button type="primary" ghost="true" className='custom-antd-primary ml15' onClick={(e) => goLogin(e)}>
						<a href={LOGIN} rel="nofollow">
							{i18Translate('i18MenuText.Login', 'Login')} /&nbsp;
							{i18Translate('i18MenuText.register', 'Register')}</a>
					</Button>
				</div>
			</div>
		);
	}
};

export default connect((state) => state)(AccountQuickLinks);
