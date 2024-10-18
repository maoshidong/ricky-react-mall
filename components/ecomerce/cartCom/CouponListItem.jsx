import React from 'react';
import { getValidityDay } from '~/utilities/common-helpers';
import useLanguage from '~/hooks/useLanguage';
import { getCurrencyInfo } from '~/repositories/Utils';

const CouponListItem = ({ children, couponItem, type = 1 }) => {
	const { i18Translate } = useLanguage();
	const iCoupon = i18Translate('i18MyAccount.Coupon', 'VOUCHER');
	const iUsed = i18Translate('i18MyAccount.Used', 'Used');
	const iOrdersOver = i18Translate('i18MyAccount.For orders over', 'For orders over');
	const iCouponTex1 = i18Translate('i18MyAccount.CouponTex1', 'Applies to All Products');
	const iCouponTex2 = i18Translate('i18MyAccount.CouponTex2', 'Registration Benefits');
	const iValidityPeriod = i18Translate('i18MyAccount.Validity period', 'Validity period');
	const iDays = i18Translate('i18SmallText.days', 'days');
	const currencyInfo = getCurrencyInfo();

	return (
		<div className={'pub-coupon-item pub-flex-align-center ' + (type !== 1 ? 'out-of-use' : '')}>
			<div className="">
				<div className="pub-color-link pub-font30 pub-lh28 pub-fontw">
					{currencyInfo.label}
					{couponItem.price} {iCoupon}
				</div>
				<div className="mt5 mb2 pub-color-link pub-fontw">
					{iOrdersOver} {currencyInfo.label}
					{couponItem.price}
				</div>
				<div className="pub-flex-align-center pub-before-point pub--before-point-mt5">
					<div className="pub-color555 pub-font13">{iCouponTex1}</div>
				</div>
				<div className="pub-flex-align-center pub-before-point pub--before-point-mt5">
					<div className="pub-color555 pub-font13">{iCouponTex2}</div>
				</div>
			</div>
			<div className="pub-flex-center pub-coupon-right pub-color555">
				<div className="pub-coupon-line"></div>
				<div>
					{type === 1 && (
						<div>
							<div>{iValidityPeriod}:</div>
							<div className="pub-center">
								<span className="pub-fontw">{getValidityDay(couponItem?.expire_date * 1000)}</span>
								<span className="ml5">{iDays}</span>
							</div>
							{children}
						</div>
					)}
					{type !== 1 && <div className="mr15 pub-font12 pub-color555">{iUsed}</div>}
				</div>
			</div>
		</div>
	);
};

export default CouponListItem;