import React from 'react';

const ShopCartContext = React.createContext({
	isLog: false,
	accountShippingAddress: [], // 账号的邮寄地址
	accountBillingAddress: [], // 账号的账单地址
	summitInfo: {}, // 提交订单的信息集合
	shippingInfo: {},
	billingInfo: {}, // 下单选择或输入的账单地址
	address: {},
	voucheour: { price: 0, value: '' }, // 优惠券
	shippingPrice: 0, // 运费价格
	paymentInfo: { vatNumber: '', orderNumber: '' },
	cardInfo: {},
	updateIsLog: (data) => {},
	updateIsAccountShippingAddress: (data) => {},
	updateIsAccountBillingAddress: (data) => {},
	saveSummitInfo: (info) => {},
	saveCardInfo: (info) => {},
	updatePaymentInfo: (info) => {},
	updateAddress: (address) => {},
	updateVoucheour: (voucheour) => {},
	updateShippingPrice: (shippingPrice) => {},
	upDateShippingInfo: (info) => {},
});
export default ShopCartContext;

export const ProductsDetailContext = React.createContext({
   isHavePrice: true,
   isLog: false,
   detailQuantity: '',
   customerReference: "",
   productDetailData: {},
   descriptionSeo: "", // seo描述
   catalogSeries: "", // 分类相关系列
   otherProducts: {}, // 相关产品
	 productLatestList:[],// 最新产品前9条加上当前分类的前9条
	 prodList:[],// 产品最新29条
   updateIsHavePrice: data => {},
   updateDetailQuantity: data => {},
   updateIsLog: data => {},
   updateCustomerReference: data => {},
   updateProductDetailData: data => {},
})