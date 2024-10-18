import { useEffect, useState, useRef } from 'react';
import { usePDF, Font } from '@react-pdf/renderer';
import OrderRepository from '~/repositories/zqx/OrderRepository';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { setSpinLoading } from '~/store/setting/action';
import { ZQX_ADDRESS } from '~/utilities/constant'
import useLanguage from '~/hooks/useLanguage';
import PDFComponent from '@/components/PDF/PDFComponent';

import useOrder from '~/hooks/useOrder';
import useI18 from '~/hooks/useI18';

// https://react-pdf.org/fonts#registerhyphenationcallback
/**
 * register chinese character
 */
// Font.register({ family: 'Noto Serif SC', fontStyle: 'normal', fontWeight: 'normal'});
Font.register(
	{
		family: 'Noto Serif SC',
		src: '/static/fonts/pdfFont.ttf',
		// src: 'https://cdn.jsdelivr.net/fontsource/fonts/noto-serif-sc@latest/chinese-simplified-400-normal.ttf', // 请求太慢
	}
)
// Font.register(
//     {
//         family: 'Roboto',
//         src: 'https://cdn.jsdelivr.net/fontsource/fonts/noto-serif-sc@latest/chinese-simplified-400-normal.ttf',
//     }
// )
// Font.register({ family: 'Roboto', src: 'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxM.woff2' });
// 图片转换为base64
export async function toDataURL(src, option) {
	return new Promise((resolve, reject) => {
		var img = new Image();
		img.crossOrigin = 'anonymous';
		img.onload = function () {
			var canvas = document.createElement('CANVAS');
			var ctx = canvas.getContext('2d');
			var dataURL;
			canvas.height = option?.height || 84;
			canvas.width = option?.width || 400;
			ctx.drawImage(this, 0, 0);
			dataURL = canvas.toDataURL();
			resolve(dataURL);
		};
		img.onerror = function (err) {
			reject(reject)
		}

		img.src = src + '?' + new Date().getTime();
		if (img.complete || img.complete === undefined) {
			img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
			img.src = src;
		}
	})

}

export const GeneratePDF = (props) => {
	const { i18Translate, curLanguageCodeZh } = useLanguage();
	const { payWayList, getPayWayList, getPayWayItem } = useOrder()
	const dispatch = useDispatch();
	const [cookies] = useCookies(['account']);
	// const iTTINADVANCE = i18Translate('i18AboutOrder2.Wire Transfer/Proforma', 'TT IN ADVANCE')

	const iTTINADVANCE = curLanguageCodeZh() ? getPayWayItem(+props?.invoiceType, payWayList)?.name : 'TT IN ADVANCE'

	const iAlipay = i18Translate('i18AboutOrder2.Alipay', 'Alipay')
	const iShipimmediately = i18Translate('i18AboutOrder2.Ship immediately', 'Ship immediately')
	const iInvoice = i18Translate('i18AboutProduct.invoice', 'INVOICE')
	const iPurchaseOrderNumber = i18Translate('i18AboutOrder2.Purchase Order Number', 'Purchase PO #');
	const iReference = i18Translate('i18AboutProduct.Customer Reference', 'CRN')
	const { iMFG, iShipTO,
		iSurchargeNumber, iRemainingPayment, iBILLTO, iOrderDate, iSalesOrder, iPaymentMethod,
		iShipMethod, iShipDate, iIncoterms, iNo, iProductDetail, iOrdered, iVATNumber, iShipAccount, iName,
		iUnitPrice, iExtPrice, iShippingFee, iBankFee, iPricesUSD, iOrderTotal, iMFG1, iPatronage, iTransactions, iCompany,
		iTermsConditions, iconfirmSpec, iNecessary, iCancelled, iResponsible, iChoose, iRemote, iUnable, iTracking,
		iBanker, iBank, iAccountName, iAccountNo, iSwiftCode, iBankAddress,
		iAllBank, iBankAdditional, iBankNote, iTotal, iSurchargeName, iPaymentPending, iStatus, iAmount, iPaymentCompleted
	} = useI18()

	// 这里多语只能通过透传
	const prop = {
		...props, iMFG, iShipTO, iSurchargeNumber, iRemainingPayment, iBILLTO, iOrderDate, iSalesOrder, iPaymentMethod,
		iShipMethod, iShipDate, iIncoterms, iNo, iProductDetail, iOrdered, iVATNumber, iShipAccount, iName, iInvoice,
		iUnitPrice, iExtPrice, iShippingFee, iBankFee, iPricesUSD, iOrderTotal, iMFG1, iTTINADVANCE, iAlipay, iShipimmediately,
		iPurchaseOrderNumber, iPatronage, iTransactions, iCompany, iTermsConditions, iconfirmSpec, iNecessary, iCancelled, iResponsible, iChoose, iRemote,
		iUnable, iTracking, iReference, iBanker, iBank, iAccountName, iAccountNo, iSwiftCode, iBankAddress, iSurchargeName, iPaymentPending, iStatus, iAmount, iPaymentCompleted,
		iAllBank, iBankAdditional, iBankNote, iTotal
	}

	const { token } = cookies?.account || {};
	const [num, setNum] = useState(0)
	const [instance, updateInstance] = usePDF({ document: <PDFComponent {...prop} /> });

	useEffect(async () => {
		dispatch(setSpinLoading({ payload: true, loadingText: props?.loadingText || '' }));
		if (instance?.blob && num === 0) {
			dispatch(setSpinLoading({ payload: true, loadingText: props?.loadingText || '' }));
			let formData = new FormData();
			formData.append('file', instance?.blob, 'file1.pdf');
			// 更新pdf
			const res = await OrderRepository.uploadEmilInvoice({
				formData,
				orderId: props?.orderId,
			}, token)
			if (res?.code === 0 && res?.data) {
				setNum(1)
			}
			dispatch(setSpinLoading({ payload: false, loadingText: '' }));
		} else { }
	}, [instance, props?.orderId])
	// useEffect(() => {
	// 	getPayWayList()
	// }, [])

	return null
	return <div>
		<button onClick={() => {
			window.open(instance.url)
		}}>Generate PDF</button>
	</div>
}

// 日期展示判断
// Ship Date: Scheduled date (日期)
// Ship Date: Ship immediately sendDateType：60
// Ship Date: Merge together  sendDateType：61  同时修改所有的DownloadPDF传参等
export const DownloadPDF = ({
	orderData = {}, orderId,
	invoiceType, // 支付方式
	sendDateType,
	paramMap,
	customerShipment,
	loadingText
}) => {
	const { i18Translate, curLanguageCodeZh } = useLanguage();
	const dispatch = useDispatch();

	// type 1 普通订单 2 附加费用订单
	const { type, mainOrderId,
		payPendingPrice, // 未付款金额
		productPrice,  // 所有创建了附加费的金额， 已支付 + 未支付
		vatPrice,
		shippingWay,
		shipmentType
	} = orderData || {}

	const [data, setData] = useState(null)
	const [cookies] = useCookies(['account']);
	const { token } = cookies?.account || {};
	const iAddress = i18Translate('i18CompanyInfo.address', ZQX_ADDRESS)

	let deliveryListRef = useRef([]) // 发货方式
	const [isGetInvoice, setIsGetInvoice] = useState(false) // 发货方式请求完成才调用  OrderRepository.getInvoice， 否则pdf发货方式展示不出来

	const getZhAdress = async () => {
		if (!orderData?.addressSnapshot) return // 没有数据不请求发货方式
		const ads = orderData?.addressSnapshot ? JSON.parse(orderData?.addressSnapshot) : ''
		let params = null
		if (curLanguageCodeZh()) {
			params = {
				cityId: ads.cityId,
			}
		} else {
			params = {
				countryId: ads?.addressId
			}
		}
		const res = await OrderRepository.apiGetDeliveryListByAddressId(params)
		setIsGetInvoice(true) // 不够成不成功都放行
		if (res?.code === 200) {
			deliveryListRef.current = res?.data || []
		}
	}

	useEffect(() => {
		getZhAdress()
	}, [orderData])

	useEffect(() => {
		// !orderData?.addressSnapshot  // 没有数据不请求发货方式  customerShipment: 管理端配置的客选发货类型
		if (!orderId || customerShipment?.length == 0) return
		if (!isGetInvoice) return
		dispatch(setSpinLoading({ payload: true, loadingText: loadingText || '' }));
		OrderRepository.getInvoice({ orderId, invoiceType }, token).then(async (res) => {
			// const url = curLanguageCodeZh() ? '/static/img/zhLogo.png' : '/static/img/zhLogo.png'
			const url = curLanguageCodeZh() ? '/static/img/zhLogo.png' : await toDataURL('https://oss.origin-ic.com/email/logo.png')
			if (res.code === 0) {
				const dt = {
					...res.data, url, type, mainOrderId, payPendingPrice, vatPrice, productPrice,
					invoiceType, sendDateType, paramMap, iAddress,
				}
				// 配送方式为other，客选发货（0：自行自提 Pick up by yourself ，1：配送指定Delivery to designated）
				if (shippingWay == 0 && (shipmentType === 1 || shipmentType === 0)) {
					dt.shipAccount = ''
					dt.shippingWay = customerShipment?.find(cs => +cs.value === +shipmentType)?.label || ''
				}
				const deliveryList = deliveryListRef.current
				// 中文环境显示的配送方式
				if (curLanguageCodeZh() && deliveryList?.length > 0) {
					deliveryList?.forEach(dlist => {
						dlist?.deliveryList.forEach(lt => {
							if (lt.regionId == +shippingWay) {
								dt.shippingWay = lt.typeName
							}
						})
					})
				}
				setData(dt)
			} else {
				setData(null)
			}
		})
	}, [orderId, customerShipment, isGetInvoice])

	return <div>
		{data ? <GeneratePDF loadingText={loadingText} {...data} /> : null}
	</div>
}
