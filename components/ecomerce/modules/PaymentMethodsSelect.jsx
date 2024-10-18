import React, { useState } from 'react';
import { Radio } from 'antd';
import useLanguage from '~/hooks/useLanguage';
import { PAYMENT_TYPE } from '~/utilities/constant';
import useI18 from '~/hooks/useI18';

// 检查，不需要就删除， 备份支付方式选择
const PaymentMethodsSelectCom = ({ changeMethod }) => {
	const { i18Translate, curLanguageCodeZh } = useLanguage();
	const { iAlipay } = useI18()

	const [showError, setShowError] = useState(false);
	const [payType, setPayType] = useState(curLanguageCodeZh() ? PAYMENT_TYPE.Alipay : PAYMENT_TYPE.PayPal);
	const iPaymentOptions = i18Translate('i18AboutOrder2.Payment Options', 'Payment Options');
	const iPayPal = i18Translate('i18AboutOrder2.PayPal', 'PayPal');
	const iWireTransferProforma = i18Translate('i18AboutOrder2.Wire Transfer/Proforma', 'Wire Transfer/Proforma');
	const iSelectPaymentTip = i18Translate('i18AboutOrder2.SelectPaymentTip', 'Please select a payment method');

	const handleChangeMethod = (e) => {
		const { value } = e.target;
		setPayType(value);
		changeMethod(value);
	};

	return (
		<div className="pub-bgc-white">
			<div className="pub-left-title mt5 mb11">{iPaymentOptions}</div>
			<div className="ps-block--payment-method pb-20 mt5">
				<div className="ps-block__header">
					<Radio.Group className="pay-radio" style={{ margin: 0 }} onChange={(e) => handleChangeMethod(e)} value={payType}>
						{/* 暂时去掉 lianlian支付 */}
						{/* <Radio className='pl-15 percentW100' value={PAYMENT_TYPE.LianLian}>
                        <div className='pub-flex-align-center'>
                            <div className='pt-5 h30 pub-flex-align-center'>{iDebitCreditCard}</div>
                            <div className='ml10 sprite-home-bank1 sprite-home-bank1-3-3'></div>
                            <div className='ml10 sprite-home-bank1 sprite-home-bank1-3-1'></div>
                            <div className='ml10 sprite-home-bank1 sprite-home-bank1-3-4'></div>
                        </div>
                    </Radio> */}

						{!curLanguageCodeZh() && <><Radio className="pl-15 percentW100" value={PAYMENT_TYPE.PayPal}>
							<div className="pay-methods pub-flex-align-center pub-fontw">
								<span className="mt2 pub-lh20">{iPayPal}&nbsp;&nbsp;&nbsp;&nbsp;</span>
								<span className="paypal-icon"></span>
							</div>
						</Radio>
						</>
						}

						{/* 支付宝支付 PayWayList */}
						{
							curLanguageCodeZh() &&
							// <Radio className="paypal pl-15 percentW100" value={PAYMENT_TYPE.WireTransfer}>
							// 	<div className="pay-methods pub-flex-align-center pub-fontw">
							// 		<div className="pay-methods" style={{ height: '16px' }}>
							// 			{iWireTransferProforma}
							// 		</div>
							// 	</div>
							// </Radio>
							<Radio className='pl-15 percentW100' value={PAYMENT_TYPE.Alipay}>
								<div className='pay-methods pub-flex-align-center pub-fontw'>
									<div className='pay-methods' style={{ height: '16px' }}>{iAlipay}&nbsp;&nbsp;&nbsp;&nbsp;</div>
									<span className='alipay-icon'></span>
								</div>
							</Radio>
						}

						<Radio className="paypal pl-15 percentW100" value={PAYMENT_TYPE.WireTransfer}>
							<div className="pay-methods pub-flex-align-center pub-fontw">
								<div className="pay-methods" style={{ height: '16px' }}>
									{iWireTransferProforma}
								</div>
							</div>
						</Radio>

					</Radio.Group>
					{showError && <div className="pub-error-tip ml22 mt10">{iSelectPaymentTip}</div>}
				</div>
			</div>
		</div>
	);
};

export default PaymentMethodsSelectCom