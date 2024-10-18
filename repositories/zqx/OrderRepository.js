import Repository, {
	backendServerUrl,
	getAuthorizeRequest,
	postAuthorizeRequest,
	postAuthorizeRequestBlob,
	getAuthorizeRequestBlob,
	serializeQuery,
} from '../Repository';
// import { helperLanguageName } from '~/utilities/common-helpers'
// 多语言-检查完了 - 有接口待确定
class OrderRepository {
	handleRes(res) {
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}
	// 获取公告 没用到
	// async getNoticeList(token) {
	// 	const responseData = await getAuthorizeRequest(`${backendServerUrl}/common/getNoticeList`, token);
	// 	if (responseData && responseData.status === 200) {
	// 		return responseData.data;
	// 	}
	// 	return null;
	// }
	// 优惠券列表
	async getVoucheList(token) {
		const responseData = await getAuthorizeRequest(`${backendServerUrl}/coupon/list?type=1&pageSize=100`, token);
		if (responseData && responseData.status === 200) {
			return responseData.data;
		}
		return null;
	}
	// 能否加上多语言
	async getDictList(type, languageType = 'en') {
		const responseData = await getAuthorizeRequest(`${backendServerUrl}/common/dict_list?dictType=${type}&languageType=${languageType}`);
		if (responseData && responseData.status === 200) {
			return responseData.data;
		}
		return null;
	}
	// 这是旧的国家接口, 已经用新接口替换了
	// async getShippingList(
	// 	token,
	// 	addressId = '',
	// 	params = {
	// 		keyWord: '',
	// 	}
	// ) {
	// 	// 改为post
	// 	const responseData = await postAuthorizeRequest(`${backendServerUrl}/common/getDeliveryRefList`, { addressId, keyWord: params?.keyWord }, token);
	// 	// const responseData = await getAuthorizeRequest(`${backendServerUrl}/common/getDeliveryRefList?addressId=${addressId || ''}`, token);
	// 	if (responseData && responseData.status === 200) {
	// 		return responseData.data;
	// 	}
	// 	return null;
	// }

	// 查询快递方式 英文传addressId， - 新的 中文传cityId
	async apiGetDeliveryListByAddressId(params) {
		const res = await postAuthorizeRequest(`${backendServerUrl}/common/getDeliveryListByAddressId`, params);
		return this.handleRes(res);
	}
	// 这是新的国家列表 helperLanguageName languageType: getDomainsData()?.defaultLocale
	async getApiCountryList(keyword = '', languageType = 'en', pageSize = 350) {
		// const res = await postAuthorizeRequest(`${backendServerUrl}/countryCit​/getCountryInfoList`, {keyWord, pageSize});
		const res = await postAuthorizeRequest(`${backendServerUrl}/web/countryCity/getCountryInfoList`, { keyword, languageType, pageSize });
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}
	// 新国家省/州列表
	async getApiCountryStateList(countryId = '', languageType = 'en', pageSize = 350) {
		const res = await postAuthorizeRequest(`${backendServerUrl}/web/countryCity/getCountryStateInfoList`, { countryId, languageType, pageSize });
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}
	// 新城市列表 countryId、stateId
	async getApiCountryCityList(params, languageType = 'en', pageSize = 350) {
		const res = await postAuthorizeRequest(`${backendServerUrl}/web/countryCity/getStateCityInfoList`, { languageType, ...params, pageSize });
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}

	// 旧的省、城市列表
	async getShippingCityList(token, countryId) {
		const responseData = await getAuthorizeRequest(`${backendServerUrl}/common/getCityListById?countryId=${countryId}`, token);
		if (responseData && responseData.status === 200) {
			return responseData.data;
		}
		return null;
	}

	// 创建订单 paymentWay: 付款方式 1 paypal 4 电汇  asBillingAddress: 邮寄地址和账单地址是否一致, shipmentType字段表示客选发货: 0 自行自提 ,1 配送指定
	async createOrder(data, token) {
		const responseData = await postAuthorizeRequest(
			`${backendServerUrl}/order/submit`,
			{
				languageType: 'en',
				...data,
			},
			token
		);
		if (responseData && responseData.status === 200) {
			return responseData.data;
		}
		return null;
	}
	// detailList
	// "mainOrderId": "string",
	// "paymentWay": "string",
	// "price": 0,
	// "productPrice": 0,
	// "vatPrice": 0
	// 附加费用订单, 补差价订单  - 注意： paypal支付保留两位数
	async createSubmitAttach(data, token) {
		const res = await postAuthorizeRequest(`${backendServerUrl}/order/submitAttach`, data, token);
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}

	// 获取邮件html 不需要从后端拿html了， 自己写：https://react-pdf.org
	// invoiceType:  PayPal: 1,  LianLian: 2, WireTransfer: 4,
	// async getEmilInvoice(data, token, invoiceType = 4) {
	// 	const responseData = await getAuthorizeRequest(
	// 		`${backendServerUrl}/order/emailInvoice?orderId=${data?.orderId}&invoiceType=${data?.paymentWay || invoiceType}`,
	// 		data,
	// 		token
	// 	);
	// 	// const responseData = await getAuthorizeRequest(`${backendServerUrl}/order/emailInvoice?orderId=` + data?.orderId, data, token);
	// 	if (responseData && responseData.status === 200) {
	// 		return responseData.data;
	// 	}
	// 	return null;
	// }
	// 生成邮件EmilInvoice
	async uploadEmilInvoice(data, token) {
		// let totalSize = 0;
		// for (let pair of data.formData.entries()) {
		//   totalSize += pair[1].size;
		// }

		const responseData = await postAuthorizeRequestBlob(`${backendServerUrl}/order/uploadInvoice?orderId=` + data?.orderId, data?.formData, token);
		if (responseData && responseData.status === 200) {
			return responseData.data;
		}
		return null;
	}
	// 下载邮件pdf - /order/downloadInvoice?orderId=2403280004&invoiceType=1
	async downloadInvoice(data, token) {
		const {
			orderId, // 订单号
			invoiceType, // 支付方式类型
			info, // 管理端跳转到详情的url中的token(flag===true说明是从管理端跳转过来的url)
		} = data || {};
		// const responseData = await getAuthorizeRequestBlob(`${backendServerUrl}/order/downloadInvoice`, data, token);
		// &info=${info || token}
		// const responseData = await getAuthorizeRequestBlob(
		//     `${backendServerUrl}/order/downloadInvoice?orderId=${orderId}&invoiceType=${invoiceType}`, {}, token);
		let params = {
			orderId,
			invoiceType,
		};
		if (info) {
			params.info = info;
		}
		const param = serializeQuery(params);

		const responseData = await getAuthorizeRequestBlob(`${backendServerUrl}/order/downloadInvoice?${param}`, {}, token);
		if (responseData && responseData.status === 200) {
			return responseData.data;
		}
		return null;
	}
	// 获取订单信息，供pdf生成使用 orderId 订单号 invoiceType 支付方式
	async getInvoice(payload, token) {
		try {
			const params = serializeQuery(payload);
			const res = await getAuthorizeRequest(`${backendServerUrl}/order/emailInvoiceNew?${params}`, token);

			return res.data;
		} catch (error) {
			return error;
		}
	}
	// type: 1 普通订单  2 附加费   IsHaveUserFlag:为1的时候 就是属于当前人的订单
	// 账号下的单必须是该账户才能查看， 匿名下的单完成后只能查看订单号和状态
	async getOrder(orderId, token) {
		if (!token) return null;
		const responseData = await getAuthorizeRequest(`${backendServerUrl}/order/${orderId}`, token);
		if (responseData && responseData.status === 200) {
			return responseData.data;
		}
		return null;
	}
	// 邮件查看订单详情 - 邮寄进来的url 可不登录查看, Repository.post
	async getEmailOrder(orderId, token) {
		return postAuthorizeRequest(`${backendServerUrl}/order/orderDetail`, { token: orderId }, token);
	}
	// 获取订单列表 notNeedAddition:1 不返回附加费订单 status:订单状态
	async getOrderList(data, token) {
		if (!token) return;
		const responseData = await postAuthorizeRequest(`${backendServerUrl}/order/newList`, {
			notNeedAddition: 1, ...data, 
		}, token);
		if (responseData && responseData.status === 200) {
			return responseData.data;
		}
		return null;
	}
	// 上传订单bankCopy文件 /order/uploadBankCopy
	async orderUploadBankCopy(data, token) {
		// const responseData = await postAuthorizeRequest(`${backendServerUrl}/order/uploadBankCopy`, data, token);
		// 文件类型fileType: 1 图片 2 pdf
		const responseData = await postAuthorizeRequestBlob(
			`${backendServerUrl}/order/uploadBankCopy?orderId=${data?.orderId}&fileType=${data?.fileType}`,
			data?.formData,
			token
		);
		if (responseData && responseData.status === 200) {
			return responseData.data;
		}
		return null;
	}
	// 获取银行订单的水单bankCopyList
	async getBankCopyList(orderId, token) {
		if (!token) return null;
		const responseData = await getAuthorizeRequest(`${backendServerUrl}/order/getBankCopyList?orderId=${orderId}`, token);
		if (responseData && responseData.status === 200) {
			return responseData.data;
		}
		return null;
	}
	// 删除订单bankCopy /order/deleteBankCopyUrl
	async deleteBankCopyUrl(bankCopyId, token) {
		if (!token) return null;
		const responseData = await postAuthorizeRequest(`${backendServerUrl}/order/deleteBankCopyUrl?bankCopyId=${bankCopyId}`, token);
		if (responseData && responseData.status === 200) {
			return responseData.data;
		}
		return null;
	}

	// 获取bankCopy文件临时查看地址 ​/order​/getBankCopyUrl get请求, key参数

	// 订单跟踪
	async getOrderPackageCheck(data, languageType="en") {
		const res = await Repository.post(`${backendServerUrl}/order/orderPackageCheck`, {
			languageType,
			...data,
		});
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}

	// 邮件过来的订单列表url, 根据订单id查询支付状态,  订单已完成，并且是账号下的单才在用户后台查看订单详情
	async apiOrderStatus(orderId, languageType="en") {
		const res = await Repository.get(`${backendServerUrl}/order/orderStatus?orderId=${orderId}&languageType=${languageType}`);
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}

	// 根据订单id查询支付状态
	async getAlipayStatusByOrderId(orderId) {
		const res = await getAuthorizeRequest(`${backendServerUrl}/pay/queryAlipayAsyncCallStatus?orderId=${orderId}`);
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}

	// 获取管理端配置的支付方式
	async apiPayWayList(languageType='en') {
		const res = await Repository.get(`${backendServerUrl}/pay/payWayList?languageType=${languageType}`);
		return this.handleRes(res);
	}
}

export default new OrderRepository();
