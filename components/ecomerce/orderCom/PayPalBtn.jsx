import { Button } from 'antd';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { PAYPAL_CLIENT_ID } from '~/utilities/constant';
import { getCurrencyInfo } from '~/repositories/Utils';

import useEcomerce from '~/hooks/useEcomerce';
import useI18 from '~/hooks/useI18';

const PayPalBtnCom = ({ createOrder, onApprove, goPaymentSuc, subBtnName = '', isOrderSummary = false }) => {
	const {
		iSubmitPayment,
	} = useI18();
	const { setCurCartDataHok } = useEcomerce();
	const currencyInfo = getCurrencyInfo();

	const handleClose = () => { };
	const payCreateOrder = () => {
		return createOrder();
	};
	const payOnApprove = (data, actions) => {
		// setPaypalPayStatus(ORDER_STATUS.sucPayment)
		setCurCartDataHok({});
		onApprove();
	};
	// 支付成功跳转
	const payGoPaymentSuc = () => {
		setCurCartDataHok({});
		goPaymentSuc();
	};
	const initialOptionsPro = {
		'client-id': PAYPAL_CLIENT_ID,
		currency: currencyInfo.value,
		intent: 'authorize',
	};
	const initialOptions = {
		'client-id': PAYPAL_CLIENT_ID,
		currency: currencyInfo.value,
		intent: 'authorize', // 授权
		onClose: handleClose,
	};
	const btnStyle = {
		position: 'absolute',
		left: 0, top: 0,
		width: '100%',
		borderRadius: '4px',
	}
	return (
		<div
			// ps-block__footer
			className="custom-antd-btn-more"
			style={{ display: 'flex', justifyContent: 'end', position: 'relative', height: '32px', overflow: 'hidden', width: isOrderSummary ? '100%' : 'auto' }}
		>
			{/* <PayPalScriptProviderCom
				paypalCreateOrder={() => createOrderSummit(summitInfo?.vatPrice)}
				paypalOnApprove={onApprove}
				paypalOnSuccess={onApprove}
				paypalGoPaymentSuc={goPaymentSuc}
			/> */}
			{/* <PayPalScriptProvider options={initialOptionsPro}> */}
			<PayPalButtons
				className={isOrderSummary ? 'percentW100' : ''}
				options={initialOptions}
				createOrder={() => payCreateOrder()}
				onApprove={payOnApprove}
				onSuccess={onApprove}
				onError={() => {
					// payGoPaymentSuc(); // goPaymentSuc()  // 调用paypal支付失败，不能执行
				}}
				// 离开页面也会调用，不能执行
				onClose={() => {
					// const [{ loaded, status }, dispatch] = usePayPalScriptReducer();
					// payGoPaymentSuc();
				}}
				onCancel={() => {
					payGoPaymentSuc();
				}}
				style={{
					layout: 'horizontal',
					fontSize: 13,
					height: 32,
					width: 168,
				}}
			></PayPalButtons>
			{/* </PayPalScriptProvider> */}
			{/* ps-add-cart-footer-btn */}
			<Button
				// loading={isLoading}
				type="submit"
				ghost="true"
				className="login-page-login-btn custom-antd-primary pub-paypal-btn pub-font13"
				style={btnStyle}
			// style={{ borderRadius: '4px', width: isOrderSummary ? '100%' : 170, height: isOrderSummary ? '32px' : '30px' }}
			// onClick={(e) => e.preventDefault()}
			>
				{subBtnName || iSubmitPayment}
			</Button>
		</div>
	);
};

export default PayPalBtnCom