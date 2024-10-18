import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useSelector } from 'react-redux';
import OrderRepository from '~/repositories/zqx/OrderRepository';
import { downloadClick } from '~/utilities/common-helpers';
import { ORDER_STATUS } from '~/utilities/constant';
import useLanguage from '~/hooks/useLanguage';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
/*
 @@ // 下载invoice isUpdate 下载前是否需要更新pdf
*/
const DownLoadInvoiceCom = ({ order = {}, text = '', fileNamePrefix = '', children, isUpdate = false }) => {
	if (order?.status === ORDER_STATUS.canceled) return null;
	const { i18Translate } = useLanguage();
	const [cookies] = useCookies(['account']);
	const { token } = cookies?.account || {};
	const [update, setUpdate] = useState(false); // 显示pdf执行更新
	const { spinLoading } = useSelector((state) => state.setting);

	const Router = useRouter();
	const { flag, orderId } = Router?.query;
	// 下载
	const handDownload = (res, invoiceUrl) => {
		// const urlArr = invoiceUrl?.split('/');
		// const fileName = fileNamePrefix + (urlArr?.[urlArr?.length - 1] || `_${order?.orderId}`); // // 初始订单详情没有invoiceUrl, 需要重新拼接 status
		const fileName = fileNamePrefix || `${i18Translate(`i18AboutProduct.invoice`, 'invoice')}`;
		downloadClick(res, 'application/pdf', `${fileName}_${order?.orderId?.split('-')?.[0]}`); // 下载文件名
	};

	const handDown = async () => {
		setUpdate(false);
		const res = await OrderRepository.downloadInvoice(
			{
				orderId: order?.orderId,
				invoiceType: order?.paymentWay,
				info: Boolean(flag) ? orderId?.join('/') : null, // flag为true时：从管理端进入的情况
			},
			token
		);

		handDownload(res, order?.invoiceUrl);
	};

	const handlePdf = async () => {
		if (!isUpdate) {
			handDown();
		} else {
			// 使用传入的children更新pdf
			setUpdate(true);
		}
	};
	useEffect(() => {
		if (update && !spinLoading) {
			handDown();
		}
	}, [spinLoading]);

	return (
		<div className="ghost-btn">
			<Button type="primary" ghost="true" className="login-page-login-btn ps-add-cart-footer-btn" onClick={handlePdf}>
				<div className="pub-flex-center">
					<div className="sprite-icon4-cart sprite-icon4-cart-5-9"></div>
					<div className="ml10">{text || i18Translate('i18FunBtnText.DownLoad PDF', 'DownLoad Invoice')}</div>
				</div>
			</Button>
			{update && children}
		</div>
	);
};

export default DownLoadInvoiceCom

{/* 非银行支付订单有效倒计时 */ }
{/* {(countDownTime?.difference > 0 && order?.orderPay?.status == 0) && orderCountDown()} */ }

// 订单倒计时 paypal支付有效期：6小时
// const orderCountDown = () => {
//     return <div className="ps-block--invoice pub-flex-align-center mt4">
//         <div style={{ width: '120px' }}>Payment deadline：</div>
//         <div className='order pub-flex-align-center pub-color555'>
//             <span className='pub-danger' style={{ width: 'auto' }}>{countDownTime?.hours}:{countDownTime?.minutes}:{countDownTime?.seconds}</span>
//             <span className='pub-font14 ml6' style={{ width: 'auto' }}>(Timeout, cancel order)</span>
//         </div>
//     </div>
// }
// let timeRef = useRef();
// // 倒计时 - 两个地方使用，可以写公共方法 backCountdownData
// const updateCountdown = () => {
//     const { difference, hours, minutes, seconds } = backCountdownData(order?.orderPay?.createDate)
//     if (difference == 0) {
//         clearInterval(timeRef.current)
//     }
//     setCountDownTime({
//         difference, hours, minutes, seconds
//     })
// }
// useEffect(() => {
//     // 初始化
//     if (order?.paymentWay && order?.paymentWay != 4) {
//         updateCountdown();
//         // // 每秒更新一次倒计时
//         timeRef.current = setInterval(updateCountdown, 1000);
//         return () => clearInterval(timeRef.current);
//     }
// }, [order])