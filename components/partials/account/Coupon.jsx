import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { nanoid } from 'nanoid';
import { message } from 'antd';
import CouponView from './modules/CouponView';
import { useRouter } from 'next/router';
import CartRepository from '~/repositories/zqx/CartRepository';
import { COUPON_TAB } from '~/utilities/constant';
import useLanguage from '~/hooks/useLanguage';

const CouponCom = ({ token }) => {
	const { i18Translate, i18MapTranslate } = useLanguage();
	const Router = useRouter();
	const [reload, setReload] = useState(0);
	const { couponCode } = Router.query;
	const [couponnewCode, setCouponNewCode] = useState(couponCode);

	const [tabActive, seTabActive] = useState(1); // 头部导航状态

	useEffect(() => {
		setTimeout(async () => {
			if (couponnewCode) {
				const responseData = await CartRepository.recive(couponnewCode);
				if (responseData.code + '' === '0') {
					//领取成功
					message.success('You have received new Voucher');
				} else {
					message.warn(responseData.msg);
				}
				setReload(new Date().getTime());
				return;
			}
		}, 50);
	}, []);

	// Coupon usage instructions
	const iCouponTit = i18Translate('i18MyAccount.CouponTit', 'Voucher usage instructions:');
	const iCouponIntroduce1 = i18Translate(
		'i18MyAccount.CouponIntroduce1',
		'Voucher can only be used for consumption in our store and cannot be exchanged for cash. No change will be given.'
	);
	const iCouponIntroduce2 = i18Translate(
		'i18MyAccount.CouponIntroduce2',
		'Voucher can only be used within the validity period and will become invalid upon expiration.'
	);
	const iCouponIntroduce3 = i18Translate('i18MyAccount.CouponIntroduce3', 'Voucher cannot be used in combination.');
	const iCouponIntroduce4 = i18Translate('i18MyAccount.CouponIntroduce4', 'Final interpretation right of Voucher belongs to our store.');

	return (
		<div className="">
			<div className="mb15">
				<div className="pub-left-title">{i18Translate('i18MyAccount.Coupon', 'Voucher')}</div>
			</div>

			<div className="pub-border cart-add-more box-shadow">
				<div>
					<div className="mb20 cart-tabs ">
						{COUPON_TAB.map(item => {
							return (
								<div
									key={nanoid()}
									className={'cart-tabs-item pub-color888 ' + (tabActive == item?.value ? 'cart-tabs-active' : '')}
									onClick={(e) => seTabActive(item?.value)}
								>
									{i18MapTranslate(`i18MyAccount.${item?.name}`, item?.name)}
								</div>
								// <div
								// 	key={nanoid()}
								// 	className={'cart-tabs-item pub-color888' + (tabActive == item?.value ? 'cart-tabs-active' : '')}
								// 	onClick={(e) => seTabActive(item?.value)}
								// >
								// 	{i18MapTranslate(`i18MyAccount.${item?.name}`, item?.name)}
								// </div>
							);
						})}
					</div>
					<CouponView currentKey={tabActive} type={tabActive} key={tabActive} reload={reload} />

					{/* <Tabs
                    defaultActiveKey="1"
                    onChange={onChange}
                    items={[
                    {
                        label: `Available`,
                        key: '1',
                        children: <CouponView currentKey={key} key={1} reload={reload}/>,
                    },
                    {
                        label: `Used`,
                        key: '2',
                        children: <CouponView currentKey={key} key={2} reload={reload}/>,
                    },
                    {
                        label: `Expired`,
                        key: '3',
                        children: <CouponView currentKey={key} key={3} reload={reload}/>,
                    },
                    ]}
                /> */}
				</div>
			</div>

			<div className="mt20 pub-border15 box-shadow">
				<div className="pub-left-title">{iCouponTit}</div>
				<div className="mt7 mb-2 pub-color555">1.{iCouponIntroduce1}</div>
				<div className="mt7 mb-2 pub-color555">2.{iCouponIntroduce2}</div>
				<div className="mt7 mb-2 pub-color555">3.{iCouponIntroduce3}</div>
				<div className="mt7 mb-2 pub-color555">4.{iCouponIntroduce4}</div>
			</div>
		</div>
	);
};

export default connect((state) => state.auth)(CouponCom);
