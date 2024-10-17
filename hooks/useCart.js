import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import ZqxCartRepository from '~/repositories/zqx/CartRepository';
import useLanguage from '~/hooks/useLanguage';
import { PAYMENT_TYPE } from '~/utilities/constant';

export default function useCart() {
	const { i18Translate } = useLanguage();

	const newProject = {
		label: i18Translate('i18MyCart.New Project', 'New Project'),
		value: 0,
	};
	const [cookies, setCookie] = useCookies(['cart']); // , 'cur_cart_data'
	const { account } = cookies;
	// 项目列表
	const [myProjectList, setMyProjectList] = useState([newProject]);
	const [projectList, setProjectList] = useState([]);
	const [cartListBasket, setCartListBasket] = useState([]); // 多个购物车列表

	// 项目列表
	const getMyProjectList = async () => {
		const res = await ZqxCartRepository.projectList(account?.token, {});
		if (res?.code == 0) {
			const arr = res?.data?.map((item) => {
				return {
					...item,
					label: item?.projectName,
					value: item?.id,
				};
			});
			setProjectList(arr || []);

			setMyProjectList([newProject, ...arr]);
		}
	};
	// 我的购物车列表
	const getUserCartListBasket = async () => {
		const res = await ZqxCartRepository.userCartListBasket(account?.token, {});
		if (res?.code == 0) {
			const arr = res?.data?.map((item) => {
				return {
					...item,
					label: item?.cartName,
					value: item?.id,
				};
			});
			setCartListBasket(arr || []);
		}
	};
	// 保存用户下单的每个步骤的信息，然后管理端展示
	// 1到2 传step = 2 可拿productPrice（总价）
	// 2-3 传step = 3 可拿email
	// 3-4 传step = 4 可拿shippingWay sendDate
	// 4-5 传step = 5 可拿paymentWay remark
	const saveOrderStepData = async (data) => {
		const params = {
			orderId: cookies?.cur_cart_data?.orderId,
			...data,
		};
		await ZqxCartRepository.cartInfoToNextPage(account?.token, params);
	};
	// 获取支付方式对应文本
	const getPayMethodText = (paymentWay) => {
		const iPayPal = i18Translate('i18AboutOrder2.PayPal', 'PayPal');
		const iWireTransferProforma = i18Translate('i18AboutOrder2.Wire Transfer/Proforma', 'Wire Transfer/Proforma');
		const textObj = {
			[PAYMENT_TYPE.PayPal]: iPayPal,
			[PAYMENT_TYPE.LianLian]: 'LianLian',
			[PAYMENT_TYPE.WireTransfer]: iWireTransferProforma,
			[PAYMENT_TYPE.Alipay]: i18Translate('i18AboutOrder2.Alipay', 'Alipay'),
		};
		return textObj[paymentWay];
	};

	return {
		projectList,
		myProjectList,
		getMyProjectList,
		cartListBasket,
		getUserCartListBasket,
		saveOrderStepData,
		getPayMethodText,
	};
}