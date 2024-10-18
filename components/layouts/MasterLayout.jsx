import React, { useEffect } from 'react';
// import { BackTop } from 'antd';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import {
	setCartItems, setCurCartData,
	setWishlistTtems,
	setRecentView,
	setShoppingCartShipping,
	setShoppingCartPayment,
} from '~/store/ecomerce/action';

import {
	loginSuccess, profileData
} from '~/store/auth/action';
// import PageLoader from '~/components/elements/common/PageLoader'; // 页面开门效果
// import NavigationList from '~/components/shared/navigation/NavigationList';
import { setToken } from '~/repositories/Repository';
import { AccountRepository } from '~/repositories';
import useEcomerce from '~/hooks/useEcomerce';
// import styles from "scss/module/_minPage.module.scss";

const MasterLayout = ({ children }) => {

	const dispatch = useDispatch();
	const { addToLoadCarts } = useEcomerce();
	const [cookies] = useCookies([
		'cart', 'wishlist', 'account', 'shoppingCartShipping',
		'shoppingCartPayment', 'cur_cart_data',
	]);

	function initEcomerceValues() {
		if (cookies) {
			// 当前购物车的数据
			if (cookies.cur_cart_data) {
				dispatch(setCurCartData(cookies.cur_cart_data));
			}
			if (cookies.cart) {
				addToLoadCarts() // 加载购物车列表
				dispatch(setCartItems(cookies.cart));
			}
			if (cookies.shoppingCartShipping) {
				// 购物车第三步信息
				dispatch(setShoppingCartShipping(cookies.shoppingCartShipping));
			}
			if (cookies.shoppingCartPayment) {
				dispatch(setShoppingCartPayment(cookies.shoppingCartPayment));
			}
			if (cookies.wishlist) {
				dispatch(setWishlistTtems(cookies.wishlist));
			}
			// 首页浏览记录
			if (cookies.recentview) {
				dispatch(setRecentView(cookies.recentview));
			}

			if (cookies.account) {
				// const isAccountFlag = typeof(cookies?.account?.account) == 'object' // 是对象就没登录, 错， account可能没有
				dispatch(loginSuccess({
					...cookies.account,
					isAccountLog: cookies?.account?.isAccountLog || false,
					isLoggedIn: cookies?.account?.isAccountLog || false,
				}));
				dispatch(profileData(cookies.profileData));
				setToken(cookies?.account?.token);
				// if(isAccountFlag) {
				//     // 没登录就清除用户信息
				//     cookies.set('profileData', {
				//     }, { path: '/' });
				// }
			}
		}
	}

	const checkIp = async () => {
		await AccountRepository.apiUserCheckIpCountry();
	}

	useEffect(() => {
		// setUserAgent(navigator.userAgent)
		initEcomerceValues();
	}, []);
	useEffect(() => {
		// if (cookies?.account?.token) {
		checkIp(cookies?.account?.token)
		// }
	}, [cookies?.account?.token]);

	return (
		<>
			{children}
			{/* <PageLoader /> */}
			{/* <NavigationList /> */}
			{/* <BackTop style={{right: '50px'}}>
                <button className={styles.psBtnBacktop} style={{borderRadius: '4px'}}>
                    <i className="icon-arrow-up" />
                </button>
            </BackTop> */}
		</>
	);
};

export default MasterLayout;
