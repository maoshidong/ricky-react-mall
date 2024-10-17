import React, { useEffect } from 'react';

import useLanguage from '~/hooks/useLanguage';
import useOrder from '~/hooks/useOrder';

// ShowPaymentMethod
const ShowPaymentMethodCom = ({ order, classN = 'w120' }) => {
	const { i18Translate } = useLanguage();
	// const { getPayMethodText1 } = useCart();
	const { payWayList, getPayWayList, getPayWayItem } = useOrder()
	const iPaymentMethod = i18Translate('i18AboutOrder2.Payment Method', 'Payment Method');
	useEffect(() => {
		getPayWayList()
	}, [])
	return (
		<div>
			<div className="ps-block--invoice pub-flex-align-center">
				<div className={classN}>{iPaymentMethod}：</div>
				<div>{getPayWayItem(order?.paymentWay, payWayList)?.name}</div>
				{/* <div>{getPayMethodText1(order?.paymentWay)}</div> */}
			</div>
		</div>
	);
};

export default ShowPaymentMethodCom