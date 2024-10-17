import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import OrderRepository from '~/repositories/zqx/OrderRepository';

import useLocalStorage from '~/hooks/useLocalStorage';
import useOrder from '~/hooks/useOrder';
import useLanguage from '~/hooks/useLanguage';
import { getEnvUrl, ACCOUNT_SHOPPING_CART } from '~/utilities/sites-url';
import ZqxProductRepository from '~/repositories/zqx/ProductRepository';
import classNames from 'classnames';

//订单地址信息
// 新国家
const OrderAddressInfo = ({ order, callBackFun }) => {
	const { i18Translate, i18MapTranslate, curLanguageCodeZh, getDomainsData } = useLanguage();
	const { payWayList, getPayWayList, getPayWayItem } = useOrder();
	const iAddress = i18Translate('i18MyCart.Address', 'Address');
	const iShippingAddress = i18Translate('i18OrderAddress.Shipping Address', 'Shipping Address');
	const iBillingAddress = i18Translate('i18OrderAddress.Billing Address', 'Billing Address');
	const iShipping = i18Translate('i18AboutProduct.Shipping', 'Shipping');
	const iEdit = i18Translate('i18OrderAddress.Edit', 'Edit');
	const iShippingMethod = i18Translate('i18ResourcePages.Shipping Method', 'Shipping Method');
	const iMyShippingAccount = i18Translate('i18ResourcePages.Shipping Account', 'Shipping Account');
	const iShippingInstructions = i18Translate('i18AboutOrder2.Shipping Instructions', 'Shipping Instructions')
	const iShippingDate = i18Translate('i18AboutOrder2.Shipping Date', 'Shipping Date');
	const iPaymentMethod = i18Translate('i18AboutOrder2.Payment Method', 'Payment Method');
	const iVATNumber = i18Translate('i18AboutOrder2.VAT Number', 'VAT Number');
	const iPurchaseOrderNumber = i18Translate('i18AboutOrder2.Purchase Order Number', 'Purchase PO #');

	const Router = useRouter();
	const [country, setCountry] = useState(''); // 从国家列表中筛选的国家名称
	const [billingCountry, setBillingCountry] = useState(''); // 从国家列表中筛选的国家名称
	const [shippingWay, setShippingWay] = useState(''); // 支付方式
	const [sendDateType, setSendDateType] = useState('');
	const [paywayText, setPaywayText] = useState('');
	const addressSnapshot = JSON.parse(order?.addressSnapshot ?? '{}'); // 账单地址
	const billingAddressSnapshot = JSON.parse(order?.billingAddressSnapshot ?? '{}'); // 邮寄地址

	const [paymentInfo] = useLocalStorage('cartPaymentInfo', {}); // 订单支付方式页存储的数据
	const { cityId, addressId, city, newCity, addressLine1, addressLine2, email, phone, companyName, orderType, firstName, lastName, postalCode } = addressSnapshot;

	const [customerShipment, setCustomerShipment] = useState([]); // 客选发货
	const [shippingAccount, setShippingAccount] = useState('') // 客户邮寄账号
	const [shipmentRemark, setShipmentRemark] = useState('') // 客户选择其他邮寄方式的时候的备注

	// 每个国家对应的运输方式
	const getDeliveryRefList = async () => {
		const res = await OrderRepository.getApiCountryList('', getDomainsData()?.defaultLocale);
		if (res.code == 0) {
			const { data } = res?.data || {};
			data?.map((item) => {
				const { id, name } = item;
				// 邮寄地址国家名称
				if (id == addressId) {
					setCountry(name);
				}
				// 账单地址国家名称
				if (id == billingAddressSnapshot?.addressId) {
					setBillingCountry(name);
				}
			});
		}
		// 获取国家对应的运输方式-新 英文传addressId， 中文传cityId
		let params = {
			countryId: addressId || shoppingCartShipping?.addressId,
		};
		if (curLanguageCodeZh()) {
			params = {
				cityId,
			};
		}
		const res1 = await OrderRepository.apiGetDeliveryListByAddressId(params);
		res1?.data?.map((item) => {
			item?.deliveryList.map((i) => {
				if (i.regionId == order.shippingWay) {
					setShippingWay(i);
				}
			});
		});
	};

	const getDeliveryTypeList = async () => {
		const res = await OrderRepository.getDictList('shipping_delivery_type');
		res?.data?.map((item) => {
			if (item.dictCode == order.sendDateType) {
				setSendDateType(i18MapTranslate(`i18AboutOrder2.${item.dictValue}`, item.dictValue));
			}
		});
	};

	// 获取客选发货类型
	const getCustomerSelectedShipment = async () => {
		const res = await ZqxProductRepository.getdictType('sys_customer_selected_shipment', getDomainsData()?.defaultLocale);
		let shipments = [];
		if (res && res?.data?.code === 0) {
			res?.data?.data?.map((item) => {
				shipments.push({
					label: item.dictLabel,
					value: item.dictValue
				});
			});
			setCustomerShipment(shipments);
		}
	};

	// 管理端自定义的运输方式
	const getShippingDeliveryList = async () => {
		const res = await OrderRepository.getDictList('sys_custom_shipping_delivery');
		res.data.map((item) => {
			if (item.dictCode == order.shippingWay) {
				setShippingWay(item);
			}
		});
	};

	// 发货方式信息
	const getshippingWay = () => {
		let showText = '';
		let _account = ''
		// order?.shippingWay === 0 用户账号运输方式的Other数据   Use My Courier Accoun-Other-111111
		if (shippingWay?.dictCode || order?.shippingWay == 0) {
			// showText = `${iMyCourierAccount} - ` + shippingWay?.dictLabel + ' - ' + order?.shippingRemark;
			if (order?.shippingWay == 0) {
				const _filt = customerShipment?.find(cs => +cs.value === +order?.shipmentType)?.label || ''
				// showText = `${iMyCourierAccount} - ${iOther}` + ' - ' + order?.shippingRemark;
				showText = _filt
				setShipmentRemark(order?.shippingRemark)
			} else {
				showText = shippingWay?.dictLabel
				_account = order?.shippingRemark
			}
		} else {
			// usdCost 选择快递方式的费用  + ' - ' + currencyInfo.label + shippingWay?.usdCost;
			showText = shippingWay?.typeName;
			// 拼接数据
			// if (shippingWay.incoterms) {
			// 	showText = showText + ' - ' + shippingWay?.incoterms;
			// }
			// if (shippingWay.estimated) {
			// 	showText = showText + ' - ' + shippingWay?.estimated;
			// }
		}
		if (callBackFun) {
			callBackFun(showText);
		}
		setShippingAccount(_account)
		setPaywayText(showText);
	};

	useEffect(() => {
		getshippingWay();
	}, [shippingWay, order, customerShipment]);

	const currentNum = useRef(0);
	useEffect(() => {
		if (currentNum.current === 0 && addressId) {
			currentNum.current = 1;
			getDeliveryRefList();
			getDeliveryTypeList();
			getShippingDeliveryList();
		}
	}, [addressId]);

	useEffect(() => {
		getPayWayList()
		getCustomerSelectedShipment()
	}, [])

	// 点击编辑回到对应步骤
	const getEdit = (query) => {
		if (Number(Router?.query?.num) !== 4) return null;
		return (
			<Link href={`${getEnvUrl(ACCOUNT_SHOPPING_CART)}?num=` + query} className="ml15">
				<a className="ml15 mt3 pub-color-link pub-font13 pub-lh18">{iEdit}</a>
			</Link>
		);
	};

	if (!order?.addressSnapshot) return null;

	let isShippingLeft = false; // 用于判断发货模块左边标签的宽度
	let isPaymentRight = false; // 用于判断支付模块左边标签的的宽度
	let isInstr = false; // 是否展示发货说明
	if (curLanguageCodeZh()) {
		isShippingLeft = true;
		isPaymentRight = true;
	} else {
		if (order?.shippingWay == 0) {
			isInstr = true;
		}
	}

	return (
		<>
			<div className="pub-border15 mt20 pub-bgc-white box-shadow">
				{/* Address */}
				<div className="pub-flex-align-center pub-left-title mb10">
					<div className="pub-fontw">{iAddress}</div>
					{getEdit(1)}
				</div>
				<div className="ps-order__review">
					{/* 账单地址 */}
					<div className="ps-shipping-address">
						<div className="min-title pub-fontw mb10">{iShippingAddress}</div>
						<p>
							{firstName} {!curLanguageCodeZh() && lastName}
						</p>
						{orderType === 1 && <p>{companyName}</p>}
						<p>{addressLine1 || '-'}</p>
						{!!addressLine2 && <p>{addressLine2}</p>}
						<p>
							{city},&nbsp;{newCity},&nbsp;{postalCode}
						</p>
						<p>{country}</p>
						<p>{phone}</p>
						<p>{email}</p>
					</div>
					{/* 邮寄地址 */}
					<div className="ps-billing-address">
						<div className="min-title pub-fontw mb10">{iBillingAddress}</div>
						<p>
							{billingAddressSnapshot.firstName} {!curLanguageCodeZh() && billingAddressSnapshot.lastName}
						</p>
						{billingAddressSnapshot.companyName && <p>{billingAddressSnapshot.companyName}</p>}

						<p>{billingAddressSnapshot?.addressLine1}</p>
						{billingAddressSnapshot?.addressLine2 && <p>{billingAddressSnapshot.addressLine2}</p>}
						<p>
							{billingAddressSnapshot.billingState || billingAddressSnapshot.city},&nbsp;
							{billingAddressSnapshot.billingState ? billingAddressSnapshot.city : billingAddressSnapshot.newCity},&nbsp;{billingAddressSnapshot.postalCode}
						</p>
						<p>{billingCountry || country}</p>
						<p>{billingAddressSnapshot.phone}</p>
					</div>
				</div>
			</div>

			<div className="pub-flex-wrap pub-flex-align-center mt10" style={{ marginLeft: 0, alignItems: 'stretch', gap: '10px' }}>
				<div className="ps-order__delivery pub-border15 pub-bgc-white box-shadow">
					<div className="pub-flex-align-center pub-left-title mb10">
						<div className="pub-fontw">{iShipping}</div>
						{getEdit(2)}
					</div>

					<div className="delivery-item">
						<div className={classNames(isShippingLeft ? 'payment-methods-zh' : 'payment-methods', isInstr && 'payment-methods-instr')}>{iShippingMethod}：</div>
						<div className="payway">{paywayText}</div>
					</div>

					{!!shippingWay?.dictCode &&
						<div className="delivery-item">
							<div className={classNames(isShippingLeft ? 'payment-methods-zh' : 'payment-methods', isInstr && 'payment-methods-instr')}>{iMyShippingAccount}：</div>
							<div className="payway">{shippingAccount}</div>
						</div>
					}

					{order?.shippingWay == 0 &&
						<div className="delivery-item">
							<div className={classNames(isShippingLeft ? 'payment-methods-zh' : 'payment-methods', isInstr && 'payment-methods-instr')}>{iShippingInstructions}：</div>
							<div className="payway">{shipmentRemark}</div>
						</div>
					}

					<div className="delivery-item">
						<div className={classNames(isShippingLeft ? 'payment-methods-zh' : 'payment-methods', isInstr && 'payment-methods-instr')}>{iShippingDate}：</div>
						<div className="payway">
							{order?.sendDate && sendDateType + ': ' + order?.sendDate}
							{!order?.sendDate && sendDateType}
						</div>
					</div>
					{/* 运输保险-暂时隐藏 */}
					{/* <div className='delivery-item'>
                        <div className='payment-methods'>{iShippingInsurance}：</div>
                        <div className='payway'>
                            {INSURANCE_TYPE[order.insurance ?? 0]}
                        </div>
                    </div> */}
				</div>

				<div className="ps-order__delivery pub-border15 pub-bgc-white box-shadow">
					<div className="pub-flex-align-center pub-left-title mb10">
						<div className="pub-fontw">{i18Translate('i18MyCart.Payment', 'Payment')}</div>
						{getEdit(3)}
					</div>

					<div className="">
						<div className="delivery-item">
							<div className={classNames(isPaymentRight ? 'payment-methods-r-zh' : 'payment-methods-r')}>{iPaymentMethod}：</div>
							<div className="payway">{getPayWayItem(order.paymentWay, payWayList)?.name}</div>
						</div>
						<div className="delivery-item">
							<div className={classNames(isPaymentRight ? 'payment-methods-r-zh' : 'payment-methods-r')}>{iVATNumber}：</div>
							<div className="payway">{order?.orderPay?.vatNumber || paymentInfo?.vatNumber}</div>
						</div>
						<div className="delivery-item">
							<div className={classNames(isPaymentRight ? 'payment-methods-r-zh' : 'payment-methods-r')}>{iPurchaseOrderNumber}：</div>
							<div className="payway">{order?.orderPay?.orderNumber || paymentInfo?.orderNumber}</div>
						</div>
					</div>
				</div>
			</div>

			{order?.remark && (
				<div className="pub-border15 mt10 pub-bgc-white box-shadow">
					<div className="pub-flex-align-center pub-left-title mb10">
						<div className="pub-fontw">{i18Translate('i18Form.Remark', 'Remark')}</div>
						{getEdit(3)}
					</div>

					<div className="delivery-item">
						<div className="payway pub-color555 pub-word-wrap">{order?.remark || '-'}</div>
					</div>
				</div>
			)}
		</>
	);
};

export default OrderAddressInfo