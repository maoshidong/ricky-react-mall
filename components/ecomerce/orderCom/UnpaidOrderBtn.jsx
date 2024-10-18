import React, { useState } from 'react';
import { connect } from 'react-redux';
import UnpaidOrder from '~/components/ecomerce/orderCom/UnpaidOrder';
import useLanguage from '~/hooks/useLanguage';
// 未支付订单按钮
const UnpaidOrderBtn = ({ orderStore, isShowUnpaid = false }) => {
	const { i18Translate } = useLanguage();
	// Unhandled Runtime Error
	// Error: Rendered more hooks than during the previous render.
	// Hooks 必须在每次渲染时以相同的顺序被调用，这样 React 才能正确地跟踪和管理它们。

	const [isShowModal, setIsShowModal] = useState(false);
	const { allUnpaidOrder } = orderStore;

	const showUnpaidOrder = () => {
		setIsShowModal(true);
	};

	const iUnpaidOrder = i18Translate('i18AboutOrder.Unpaid Order', 'Unpaid Order');
	const iViewOrderDetails = i18Translate('i18AboutProduct.View Order Details', 'View Order Details');
	if (allUnpaidOrder?.length === 0) return null;
	return (
		<>
			<div className="unpaid-order pub-flex-center" onClick={() => showUnpaidOrder()}>
				{isShowUnpaid ? iUnpaidOrder : iViewOrderDetails}
				<div className="ml20 sprite-about-us sprite-about-us-1-3"></div>
			</div>

			{isShowModal && <UnpaidOrder visible={isShowModal} onCancel={() => setIsShowModal(false)} />}
		</>
	);
};

export default connect((state) => state)(UnpaidOrderBtn);