import React, { useState, useContext, useEffect } from 'react';
import { connect } from 'react-redux';
// import { useRouter } from 'next/router';
import { calculateTotalAmount, toFixedFun, floatSub, getThousandsData } from '~/utilities/ecomerce-helpers';
import ShopCartContext from '~/utilities/shopCartContext'
// import useLocalStorage from '~/hooks/useLocalStorage'
import useLanguage from '~/hooks/useLanguage';

import VoucherModal from '~/components/ecomerce/cartCom/VoucherModal'
import ModuleLogin from '~/components/ecomerce/modules/ModuleLogin'
import { getCurrencyInfo } from '~/repositories/Utils';
import styles from './module/_ModuleCartSummary.module.scss';

// 订单右侧Summary
const ModuleCartSummary = ({ products, voucheourList, auth }) => {
	const { i18Translate } = useLanguage();
	const iTotal = i18Translate('i18MyCart.Total', 'Total')
	const iSubTotal = i18Translate('i18MyCart.SubTotal', "SubTotal")
	const iNotAvailable = i18Translate('i18MyCart.Not Available', "Not available")
	const iVoucher = i18Translate('i18MyCart.Voucher', "Voucher")
	const [loginVisible, setLoginVisible] = useState(false);

	const { isAccountLog } = auth
	// const Router = useRouter();
	const { voucheour, updateVoucheour } = useContext(ShopCartContext)
	// const [loginCallBack, setLoginCallBack] = useLocalStorage('loginCallBack', '/');
	const currencyInfo = getCurrencyInfo()

	// 优惠券选择
	const [isShowModal, setIsShowModal] = useState(false)
	const [tabActive, seTabActive] = useState(1) // 头部导航状态
	// const [couponData, setCouponData] = useState({})

	let amount = 0;
	if (products && products.length > 0) {
		amount = calculateTotalAmount(products);
	}
	const [totalAmount, setTotalAmount] = useState(amount)
	// 选择优惠券
	const handleChange = (value) => {
		setIsShowModal(false)
		let voucherObj = {}
		if (!!value) {
			const arr = value.split('-');
			voucherObj = { price: arr[1], value: arr[0] }
		} else {
			voucherObj = { price: 0, value: 0 }
		}

		updateVoucheour(voucherObj);
		setTotalAmount(floatSub(amount, voucherObj.price));
	}

	useEffect(() => {
		setTotalAmount(floatSub(amount, voucheour?.price))
	}, [amount, voucheour])

	const handleLogin = () => {
		setLoginVisible(false);
	};

	return (
		<>
			<div className={styles.psShoppingTotal}>
				<div className={styles.psHeader}>
					{i18Translate('i18MyCart.Order Summary', "Order Summary")}
				</div>
				{/* className='ps-block__sub ps-block-new__content' */}
				<div className={`${styles.psNewContent} ${styles.psSub}`}>
					<div>{iSubTotal}：<span>{currencyInfo.label}{getThousandsData(amount || 0)}</span></div>
					<div className='mb5'>{iVoucher}：
						{/* 登录了 */}
						{isAccountLog && <span>
							{voucheourList?.length > 0 ?
								<div className='pub-color-link pub-flex-align-center' onClick={() => (setIsShowModal(true), seTabActive(1))}>
									<span className='mt3'>-{currencyInfo.label}{toFixedFun(voucheour?.price || 0, 2)}</span>
									<div className='ml10 sprite-home-min sprite-home-min-3-9'></div>
								</div>
								: <span className="pub-color888">{iNotAvailable}</span>}
						</span>
						}
						{/* 没登录 */}
						{!isAccountLog &&
							<>
								<span className='pub-color555'>{i18Translate('i18SmallText.To View', 'to view')}</span>
								{/* onClick={e => goLogin(e)} */}
								<span onClick={() => { setLoginVisible(true) }}>
									<a className='pub-color-link'>{i18Translate('i18MenuText.Login', 'Log in')} &nbsp;</a>
								</span>
							</>
						}
					</div>
				</div>
				{/* className="ps-block__content ps-block-new__content" */}
				<div className={styles.psNewContent}>
					<div className={styles.psTotalAmount}>
						{iTotal}：<span>{currencyInfo.label}{getThousandsData(Number(totalAmount) > 0 ? totalAmount : 0)}</span>
						{/* <div className="pub-flex ps-form__submit" style={{ justifyContent: 'flex-end' }}>
							<div className="ps-block__footer">
								<button
									type="submit" ghost='true'
									className='login-page-login-btn ps-add-cart-footer-btn custom-antd-primary pub-font13 w160 mt30'
								>
									{i18Translate('i18SmallText.Continue', 'Continue')}
								</button>
							</div>
						</div> */}
					</div>

				</div>
			</div>

			{/* 选中优惠券 */}
			{
				isShowModal && (
					<VoucherModal
						isShowModal={isShowModal}
						couponData={voucheourList}
						handleCancel={(voucherObj) => handleChange(voucherObj)}
						hideVoucherModal={() => setIsShowModal(false)}
					/>
				)
			}

			{loginVisible && <ModuleLogin
				visible={loginVisible}
				onCancel={() => setLoginVisible(false)}
				onLogin={handleLogin}
			/>
			}
		</>
	);
};

export default connect((state) => state)(ModuleCartSummary);
