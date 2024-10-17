import { PayPalButtons, PayPalScriptProvider, usePayPalScript, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { PAYPAL_CLIENT_ID } from '~/utilities/constant';
import { getCurrencyInfo } from '~/repositories/Utils';
import noop from 'lodash/noop'

// PayPalScriptProvider放在应用的顶层组件中，而不是在每个子组件中都放置一个PayPalScriptProvider。
// 是因为PayPalScriptProvider负责加载PayPal的JavaScript SDK，如果在多个地方重复加载，可能会导致冲突或性能问题。导致渲染失败
// ‌将PayPalScriptProvider移动到顶层组件‌：
// 将PayPalScriptProvider放置在应用的顶层组件中，确保整个应用只加载一次PayPal SDK。然后，你可以在应用的任何地方使用PayPalButtons，而不需要重复加载SDK。
/**
 * 
 * @param {*} param0 
 * 后端配置了支付成功回调地址
 * @returns 
 */
const PayPalScriptProviderComponent = ({
	paypalCreateOrder,
	paypalOnApprove,
	paypalOnSuccess,
	paypalGoPaymentSuc,
}) => {
	const currencyInfo = getCurrencyInfo();

	const initialOptionsPro = {
		'client-id': PAYPAL_CLIENT_ID,
		currency: currencyInfo.value, // 币种
		intent: 'authorize', // 授权
	};
	const initialOptions = {
		...initialOptionsPro,
		onClose: noop(),
	};

	return (
		// <div>
		// <PayPalScriptProvider options={initialOptionsPro}>
		<PayPalButtons
			className="percentW100"
			options={initialOptions}
			createOrder={paypalCreateOrder}
			onApprove={paypalOnApprove}
			onSuccess={paypalOnSuccess}
			onError={() => {
				console.log('onError--del')
				// goPaymentSuc()  // 调用paypal支付失败，不能执行
			}}
			onClose={() => { }} // 离开页面也会调用，不能执行
			onCancel={() => {
				console.log('onCancel requestPayment成功成功，但是取消支付--del')
				paypalGoPaymentSuc()
			}}
			style={{
				layout: "horizontal",
				fontSize: 13,
				height: 32,
				width: 170,
			}}
		>
		</PayPalButtons>

		// </PayPalScriptProvider>
		// </div>

	)
}

export default PayPalScriptProviderComponent