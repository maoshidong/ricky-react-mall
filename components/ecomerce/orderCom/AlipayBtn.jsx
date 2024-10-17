import React, { useEffect, useState, useRef } from 'react';
import { Button, Spin, message } from 'antd';
import Router from 'next/router';
import { encrypt } from '~/utilities/common-helpers';
import OrderRepository from '~/repositories/zqx/OrderRepository';
import PaymentRepository from '~/repositories/zqx/PaymentRepository';
import MinModalTip from '~/components/ecomerce/minCom/MinModalTip';
import useEcomerce from '~/hooks/useEcomerce';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18'
import { PAYMENT_TYPE, ORDER_STATUS } from '~/utilities/constant';
import noop from 'lodash/noop';

// 支付宝支付组件
/**
 * jumpUrl 跳转地址
 */
const AlipayBtn = React.forwardRef(({ orderInfo, token, btnName, btnClassName, onCallBack = noop(), isJumpToDetails = false, jumpUrl = '' }, ref) => {
	const {
		iSubmitPayment,
	} = useI18();
	const { i18Translate } = useLanguage();

	const iAlipay = i18Translate('i18AboutOrder2.Alipay', 'Alipay');

	const { setCurCartDataHok } = useEcomerce();
	const alipayRef = useRef();
	const [isShowAlipay, setIsShowAlipay] = useState(false);
	const [spinLoading, setSpinLoading] = useState(true);
	const timeAlipayRef = useRef();

	useEffect(() => {
		if (isShowAlipay) {
			timeAlipayRef.current = setInterval(getAlipayStatus, 2000);
		}

		return () => {
			clearInterval(timeAlipayRef.current);
		};
	}, [isShowAlipay]);

	React.useImperativeHandle(ref, () => ({
		onSubmit: () => {
			handleOrderPayClick()
		}
	}))

	// 查询订单状态
	const getAlipayStatus = async () => {
		const res = await OrderRepository.getAlipayStatusByOrderId(orderInfo.orderId);
		if (res?.data !== 0) {
			handlePayCancelClick(true);
		}
	};

	// 提交支付订单
	const handleOrderPayClick = async () => {
		setSpinLoading(true)
		// && token
		if (orderInfo) {
			let res = await PaymentRepository.requestPayment({
				isEmailFlag: 1,
				...orderInfo,
			}, token);
			if (res.data && orderInfo.payType == PAYMENT_TYPE.Alipay) {
				// 支付宝支付
				if (+res?.code === 0) {
					const alipayForm = res.data?.response || '';
					setIsShowAlipay(true);
					// setTimeout(() => {
					// 	setSpinLoading(false);
					// }, 1000);
					if (alipayRef.current) {
						alipayRef.current.srcdoc = alipayForm;
						alipayRef.current.onload = function () {
							// 完全加载后取消loading
							setSpinLoading(false);
						};
					}
				} else {
					message.error(res?.msg || '');
				}
			}
		}
	};

	// 取消支付 or 支付后调用
	const handlePayCancelClick = (paySuccess) => {
		if (orderInfo) {
			setIsShowAlipay(false);
			clearInterval(timeAlipayRef);
			// 清除购物车数据
			setCurCartDataHok({});
			onCallBack?.(ORDER_STATUS.submit);
			// 订单支付成功
			if (paySuccess) {
				onCallBack?.(ORDER_STATUS.sucPayment);
			}

			if (jumpUrl) {
				Router.push(jumpUrl)
			} else {
				if (isJumpToDetails && paySuccess) {
					Router.push(`/account/order-detail/${encrypt(orderInfo?.orderId)}`);
				} else if (isJumpToDetails) {
					Router.push(`/account/shopping-cart?num=5&orderId=${encrypt(orderInfo?.orderId)}&payType=${orderInfo?.payType}`);
				}
			}
		}
	};

	return (
		<div className="custom-antd-btn-more ps-block__footer" style={{ display: 'flex', justifyContent: 'end', height: '32px', overflow: 'hidden' }} >
			<Button
				type="submit"
				ghost='true'
				className={`login-page-login-btn ps-add-cart-footer-btn custom-antd-primary pub-font13 ${btnClassName ? btnClassName : 'w160'}`}
				style={{ borderRadius: '4px' }}
				onClick={handleOrderPayClick}
			>
				{btnName || iSubmitPayment}
			</Button>

			<MinModalTip isShowTipModal={isShowAlipay} isChildrenTip={true} width={1000} tipTitle={iAlipay} onCancel={() => handlePayCancelClick()}>
				<Spin spinning={spinLoading} size="large" tip="加载中，请稍等...">
					<iframe ref={alipayRef} style={{ height: '570px' }} target="_self" />
				</Spin>
			</MinModalTip>
		</div>
	);
});

export default AlipayBtn;
