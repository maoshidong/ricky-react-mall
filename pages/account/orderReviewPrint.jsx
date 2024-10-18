import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import OrderRepository from '~/repositories/zqx/OrderRepository';
import { useCookies } from 'react-cookie';
import { decrypt } from '~/utilities/common-helpers';
import { changeServerSideLanguage } from '~/utilities/easy-helpers';

import dynamic from 'next/dynamic';
const OrderAddressInfo = dynamic(() => import('~/components/partials/account/OrderAddressInfo'));
const OrderSummaryTable = dynamic(() => import('~/components/partials/account/order/OrderSummaryTable'));



import useLanguage from '~/hooks/useLanguage';


// 新国家
const OrderReviewPrint = ({ paramMap, orderId = '', orderData = {} }) => {
	const { i18Translate } = useLanguage();
	const decryptOrder = decrypt(orderId)
	const [cookies] = useCookies(['account']);
	const [order, setOrder] = useState(orderData);
	let componentRef = useRef();

	const getOrder = async () => {
		if (!cookies?.account?.token) {
			return false;
		}
		if (orderData?.status) {
			setOrder(orderData);
			return
		}
		const responseData = await OrderRepository.getOrder(decryptOrder, cookies?.account?.token);
		if (responseData) {
			setOrder(responseData.data);
		}
	}

	useEffect(() => {
		getOrder();
	}, [orderId])

	return (
		// ps-section--shopping 可删除？
		<div className="ps-checkout" ref={(el) => (componentRef = el)}>
			<div className="ps-section__content">
				<div className="ps-form--checkout">
					<div className="ps-form__content">
						<div className="" style={{ margin: 0 }}>
							<div>
								<div className="ps-shipping-info" >
									<div className='pub-bgc-white'>
										<div className='pub-flex-wrap' style={{ gap: '20px' }}>
										</div>
									</div>
									<OrderAddressInfo order={order} />
									<div className='pub-left-title mb10 mt20 pub-sticky h40'>{i18Translate('i18MyCart.Cart', 'Cart')}</div>
									<div className='mt20 box-shadow' style={{ borderRadius: '6px', background: '#f5f7fa' }}>
										<OrderSummaryTable paramMap={paramMap} order={order} orderList={order?.orderDetails} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default connect((state) => state)(OrderReviewPrint);

export async function getServerSideProps({ req }) {
	const translations = await changeServerSideLanguage(req)

	return {
		props: {
			...translations,
		}
	}
}