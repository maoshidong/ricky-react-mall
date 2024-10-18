import React, { useState, useEffect } from 'react';
import { Radio, Skeleton } from 'antd';
import { PAYMENT_TYPE } from '~/utilities/constant';
import useOrder from '~/hooks/useOrder';
import useLanguage from '~/hooks/useLanguage';


import classNames from 'classnames';
import styles from './module/_PayWaySelect.module.scss';

// 支付方式选择，数据来源管理端
const PaymentMethodsSelectCom = ({ changeMethod, isDefault = true, proPayType = '' }) => {
	const { i18Translate, curLanguageCodeZh } = useLanguage();
	const { payWayList, getPayWayList } = useOrder()

	// curLanguageCodeZh() ? PAYMENT_TYPE.Alipay : PAYMENT_TYPE.PayPal1
	const [payType, setPayType] = useState(proPayType || '');

	const handleChangeMethod = (e) => {
		const { value } = e.target;
		setPayType(value);
		changeMethod(value);
	};
	useEffect(() => {
		getPayWayList()
	}, [])
	useEffect(() => {
		if (proPayType) {
			setPayType(proPayType)
		}
	}, [proPayType])
	useEffect(() => {
		if (payWayList?.length > 0 && isDefault) {
			setPayType(payWayList?.[0]?.payWay)
		}
	}, [payWayList])
	// console.log(payWayList, 'getPayWayList---del')

	return (
		<div className="percentW100">{payWayList?.length === 0 ? <Skeleton active={true} paragraph={{ rows: 2, title: true }} /> :
			<Radio.Group className={classNames(styles.payWayBox, 'payWayBox')} onChange={(e) => handleChangeMethod(e)} value={payType}>
				{
					payWayList?.map(item => {
						return <Radio className={classNames(styles.payWayItem, "pl-15 percentW100")} value={item?.payWay}>
							<div className={classNames(styles.payMethods, "pub-flex-align-center pub-fontw")}>
								<div className='pub-flex-align-center' style={{ height: '30px' }}>
									<span className="mt2 pub-lh20">{item?.name}&nbsp;&nbsp;&nbsp;&nbsp;</span>
									{item?.payWay === PAYMENT_TYPE.PayPal && <span className={styles.paypalIcon}></span>}
									{item?.payWay === PAYMENT_TYPE.Alipay && <span className={styles.alipayIcon}></span>}
								</div>
							</div>
						</Radio>
					})
				}
			</Radio.Group>
		}
		</div>
	);
};

export default PaymentMethodsSelectCom