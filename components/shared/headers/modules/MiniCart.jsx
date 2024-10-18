import React, { useState, useRef, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Button } from 'antd';
import Router from 'next/router';
import { withCookies, useCookies } from 'react-cookie';

import dynamic from 'next/dynamic';
const QuoteNum = dynamic(() => import('/components/shared/headers/modules/QuoteNum'));
const ProductOnCart = dynamic(() => import('/components/elements/products/ProductOnCart'));

import AccountRepository from '~/repositories/zqx/AccountRepository';
import { setToken } from '~/repositories/Repository';
import { profileData } from '~/store/auth/action';

import { calculateTotalAmount, getThousandsData } from '~/utilities/ecomerce-helpers';
import { getExpiresTime } from '~/utilities/common-helpers'
import { getEnvUrl, ACCOUNT_SHOPPING_CART } from '~/utilities/sites-url'
import useLocalStorage from '~/hooks/useLocalStorage'
import useLanguage from '~/hooks/useLanguage';
import useAccount from '~/hooks/useAccount';
import { getCurrencyInfo } from '~/repositories/Utils';

const MiniCart = ({ ecomerce, cookies }) => {
	const { i18Translate } = useLanguage();
	const { anonymousAuthLoginHooks } = useAccount();

	// const [quoteList, setQuoteList] = useLocalStorage('quoteList', new Array(5).fill({}));

	const { allCartItems } = ecomerce
	const dispatch = useDispatch();

	const [cookiesReact] = useCookies(['account', 'cart']);
	const [isShowCart, setIsShowCart] = useState(false)

	const timer = useRef(null)

	const currencyInfo = getCurrencyInfo()

	// const getProfile = async (token) => {
	// 	if (!token) {
	// 		return false;
	// 	}
	// 	const res = await AccountRepository.getProfile(token);
	// 	if (res && res.code == 0) {
	// 		dispatch(profileData(res.data));
	// 		cookies.set('profileData', {
	// 			...res.data
	// 		}, { path: '/' });
	// 		Router.push(getEnvUrl(ACCOUNT_SHOPPING_CART))
	// 	}
	// }
	const anonymousAuthLogin = async (e) => {
		e?.preventDefault();
		setIsShowCart(false)
		if (cookiesReact?.account?.token) {
			Router.push(getEnvUrl(ACCOUNT_SHOPPING_CART))
			return false;
		}
		await anonymousAuthLoginHooks()
		Router.push(ACCOUNT_SHOPPING_CART)
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

	let cartItemsView;

	if (allCartItems && allCartItems.length > 0 && isShowCart) {
		const amount = getThousandsData(calculateTotalAmount(allCartItems))
		// 购物车列表
		const productItems = allCartItems.slice(0, 5).map((item, index) => {
			return (
				<div className='min-cart-list' key={item.productId}>
					<ProductOnCart product={item} />
				</div>
			);
		});
		cartItemsView = (
			<div className="ps-cart__content" id="pub-modal-box">
				<div className='pub-modal-content'>
					<div className='pub-modal-arrow'></div>
					<div className='pub-modal-title'>{i18Translate('i18Head.My Cart', 'MY CART')}</div>
					<div className='ps-cart__list' style={{ minWidth: '464px' }}>
						<div className='ps-cart-num'>({allCartItems.length} {i18Translate('i18SmallText.Items', 'Items')}) {i18Translate('i18MyCart.InYourCart', 'in Your Cart')}</div>

						<div className="ps-cart__items" style={{ borderRadius: '6px' }}>{productItems}</div>

						<div className="ps-cart-count">
							{i18Translate('i18MyCart.ItemSubtotal', 'Item Subtotal')}({currencyInfo.value}):<span>{currencyInfo.label}{amount ? amount : 0}</span>
						</div>

						<div className="ps-add-cart-footer custom-antd-btn-more" onClick={anonymousAuthLogin} style={{ float: 'none' }}>
							<Button
								type="primary" ghost
								className='ps-add-cart-footer-btn custom-antd-primary'
							>{i18Translate('i18MenuText.View Cart', 'View Cart')}</Button>
						</div>
					</div>
				</div>
			</div>
		);
	} else if (isShowCart) {
		cartItemsView = (
			<div className="ps-cart__content" id="pub-modal-box">
				<div className="ps-cart__items pub-modal-content">
					<div className='pub-modal-arrow'></div>
					<div className='pub-modal-title'>{i18Translate('i18Head.My Cart', 'MY CART')}</div>
					<div className='ps-cart__list'>
						<div className='ps-cart-empty'>
							<div className='ps-cart-empty-text'>{i18Translate('i18Head.CartEmpty', 'Your shopping cart is empty')}</div>
						</div>
						<div className="ps-add-cart-footer custom-antd-btn-more" onClick={anonymousAuthLogin} style={{ float: 'none' }}>

							<Button
								type="primary" ghost
								className='ps-add-cart-footer-btn custom-antd-primary'
							>{i18Translate('i18MenuText.View Cart', 'View Cart')}</Button>

						</div>
					</div>
				</div>
			</div>
		);
	}
	return (
		<div className='pub-flex-align-center'>
			<QuoteNum />
			<div
				className="ps-cart--mini pub-flex-align-center" style={{ height: '60px', cursor: 'pointer', zIndex: 1000 }}
				onMouseEnter={() => handEnter()}
				onMouseLeave={() => handLeave()}
			>
				<div className='ps-cart--mini-content'>
					<div
						className="header__extra"
						onClick={(e) => anonymousAuthLogin(e)}

					>

						<a href={getEnvUrl(ACCOUNT_SHOPPING_CART)} className='pub-flex-align-center'>
							<div className={"mr5 header-icon-cart sprite-home-min sprite-home-min-1-3 " + (allCartItems?.length > 0 ? 'sprite-home-min-1-4' : ' ')}></div>
							<p className={'mb0 number-box ' + (allCartItems.length > 0 ? 'link-number-box' : '')}>{allCartItems.length}</p>
						</a>

					</div>
					<div className={isShowCart ? 'pub-modal-box-bgc' : ''}></div>
					{cartItemsView}

				</div>

			</div>
		</div>
	);
};

export default connect((state) => state)(withCookies(MiniCart));
