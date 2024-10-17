import { useState } from 'react';
import OrderRepository from '~/repositories/zqx/OrderRepository';
import ZqxProductRepository from '~/repositories/zqx/ProductRepository';
import useLanguage from '~/hooks/useLanguage';

export default function useApi() {
	const { getDomainsData } = useLanguage();
	const [dictAddressCustomerType, setDictAddressCustomerType] = useState([]); // 字典客户类型列表
	const [dictOrderTypeList, setDictOrderTypeList] = useState([]); // 字典订单类型列表，公司或个人

	const [sendTimeMap, setSendTimeMap] = useState([]); // 发货时间列表
	const [adddressMap, setAdddressMap] = useState([]); // 发货地址列表

	const [customerShipment, setCustomerShipment] = useState([]); // 客选发货
	const [surchargeType, setSurchargeType] = useState([]); // 附加费类型

	// 字典客户类型列表
	const apiDictAddressCustomerType = async () => {
		const res = await OrderRepository.getDictList('address_customer_type', getDomainsData()?.defaultLocale);
		if (res && res.data && res.data.length) {
			res.data.map((item) => {
				item.value = Number(item?.dictValue);
				item.label = item?.dictLabel;
			});
			const sortedList = [...res.data].sort((a, b) => a.label.localeCompare(b.label)); // 排序
			setDictAddressCustomerType(sortedList);
		}
	};
	// 订单类型，公司合作个人
	const apiDictOrderTypeList = async () => {
		const res = await OrderRepository.getDictList('address_order_type', getDomainsData()?.defaultLocale);
		if (res && res.data && res.data.length) {
			res.data.reverse().map((item) => {
				item.value = Number(item?.dictValue);
				item.label = item?.dictLabel;
			});
			setDictOrderTypeList(res.data);
		}
	};

	// 获取产品发货时间枚举值
	const getSysShippingTime = async () => {
		const res = await ZqxProductRepository.getdictType('sys_shipping_time', getDomainsData()?.defaultLocale);
		let sendTimeMap = [];
		if (res && res?.data?.code === 0) {
			res?.data?.data?.map((item) => {
				sendTimeMap[item.dictCode] = item.dictLabel;
			});
			setSendTimeMap(sendTimeMap);
		}
	};

	// 获取发货地址枚举值
	const getGoodsSendFrom = async () => {
		const res = await ZqxProductRepository.getdictType('goods_send_from', getDomainsData()?.defaultLocale);
		let adddressMap = [];
		if (res && res?.data?.code === 0) {
			res?.data?.data?.map((item) => {
				adddressMap[item.dictCode] = item.dictLabel;
			});
			setAdddressMap(adddressMap);
		}
	};

	// 获取客选发货类型
	const getCustomerSelectedShipment = async () => {
		const res = await ZqxProductRepository.getdictType('sys_customer_selected_shipment', getDomainsData()?.defaultLocale);
		let shipments = [];
		if (res && res?.data?.code === 0) {
			res?.data?.data?.map((item) => {
				shipments.push({
					label: item.dictLabel,
					value: item.dictValue,
				});
			});
			setCustomerShipment(shipments);
		}
	};

	// 附加费类型
	const getDictSurchargeType = async () => {
		const res = await ZqxProductRepository.getdictType('sys_surcharge_type', getDomainsData()?.defaultLocale);
		if (res?.data?.code === 0) {
			const arr = res?.data?.data?.map((item) => {
				return {
					...item,
					value: Number(item?.dictValue),
					label: item?.dictLabel,
				};
			});
			setSurchargeType(arr);
		}
	};

	return {
		dictAddressCustomerType,
		apiDictAddressCustomerType,
		dictOrderTypeList,
		apiDictOrderTypeList,
		sendTimeMap,
		adddressMap,
		getSysShippingTime,
		getGoodsSendFrom,
		getCustomerSelectedShipment,
		customerShipment,
		surchargeType,
		getDictSurchargeType,
	};
}