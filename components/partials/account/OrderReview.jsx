import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import OrderAddressInfo from '~/components/partials/account/OrderAddressInfo';
import OrderSummaryTable from '~/components/partials/account/order/OrderSummaryTable';
import { DownloadPDF } from '~/components/PDF';
import ZqxProductRepository from '~/repositories/zqx/ProductRepository';
import { setSpinLoading } from '~/store/setting/action';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';

// 确认订单页面, 在这生成pdf
const OrderReview = ({ order = {}, paramMap }) => {
	const { i18Translate, getDomainsData } = useLanguage();
	const { iOrderBeing } = useI18();
	const dispatch = useDispatch();
	const [cookies] = useCookies(['account']);
	const { token } = cookies?.account || {};
	const [invoiceHtml, setInvoiceHtml] = useState('');
	const [customerShipment, setCustomerShipment] = useState([]); // 客选发货

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

	useEffect(() => {
		getCustomerSelectedShipment()
	}, [])

	useEffect(async () => {
		if (!order?.orderId) {
			return
		}

		dispatch(setSpinLoading({ payload: true, loadingText: iOrderBeing }));
		// 不需要从后端拿html了， 自己写：https://react-pdf.org
		// const res = await OrderRepository.getEmilInvoice(order, token)
		// setInvoiceHtml(res?.data) // ?.replace(/\s/g,'')
	}, [order])
	useEffect(async () => {
		// return
		// // 生成下载pdf
		// setTimeout(() => {
		//     if(!order?.orderId || !invoiceHtml) {
		//         return
		//     }
		//     if (pdfRef.current) {
		//         // 解决图片跨域
		//         const images = pdfRef.current.getElementsByTagName('img');
		//         Array.from(images).forEach(img => {
		//             const src = img.getAttribute('src');
		//             // 添加动态参数到图片 URL，例如 timestamp
		//             const timestamp = Date.now();
		//             img.setAttribute('src', `${src}?timestamp=${timestamp}`);
		//             img.setAttribute('crossOrigin', "anonymous");
		//         });
		//     }

		//     html2canvas(pdfRef.current, {
		//         scale: 5, // 设置截图的缩放比例 2-400(22M,  12)   1.4-100 9.5  1.3-2500 8.3 5-200(稳定版)
		//         dpi: 3000, // 设置每英寸像素数 700， 400
		//         useCORS: true, // Whether to attempt to load images from a server using CORS 用于解决图片跨域
		//         allowTaint: true, // 是否允许跨源图像污染画布
		//         // foreignObjectRendering: true, // 开启对外部对象（例如嵌入的 SVG）的渲染支持
		//       }).then(async canvas => {

		//         // 将 Canvas 转换成图像数据 - 前端生成的pdf，清晰，不过文件大   
		//         // jpeg->PNG webp
		//         const imageData = canvas.toDataURL('image/jpeg', 0.2); // 5-100 1
		//         // 计算 PDF 页面的尺寸（以像素为单位）
		//         const pdfWidth = canvas.width;
		//         const pdfHeight = canvas.height;
		//         // 创建一个新的 PDF 文档
		//         const pdf = new jsPDF('p', 'px', [pdfWidth, pdfHeight]);
		//         // pdf.setScale(0.5)
		//         // const pdf = new jsPDF({
		//         //     orientation: 'portrait',
		//         //     unit: 'pt',
		//         //     format: 'a4',
		//         //     compress: true,
		//         //     zoomFactor: 1.5, // 设置缩放级别为 1.5
		//         //   });
		//         // 将图像数据添加到 PDF 页面 PNG -> jpeg -> webp
		//         pdf?.addImage(imageData, 'PNG', 0, 0, pdfWidth, pdfHeight);
		//         // pdf.setZoom(0.5); // 设置缩放级别为 0.75
		//         // pdf?.save('invoice.pdf');


		//         canvas.toBlob(async blob => {
		//                 // const blob = new Blob([pdf], { type: 'application/pdf' });
		//                 var blob = pdf.output('blob');
		//                 let formData = new FormData();
		//                 formData.append('file', blob, 'file1.pdf');
		//                 // formData.set('Content-Type', 'application/pdf');

		//                 const res = await OrderRepository.uploadEmilInvoice({
		//                     formData: formData,
		//                     orderId: order?.orderId,
		//                 }, token)
		//                 if(res?.code === 0) {
		//                     setInvoiceUrl(res.data)
		//                 }

		//         }, 'application/pdf');
		//     });
		// }, 0)

	}, [invoiceHtml, order?.orderId])

	const text = "Please review your order for accuracy prior to submitting as we may be unable to add to or alter orders once submitted."

	const iOrderReviewTip = i18Translate('i18AboutOrder2.OrderReviewTip', text)
	return (
		// size='large'
		<div className="ps-shipping-info pub-relative" >
			<div className='pub-flex-align-center pub-tip '>
				<div className='mr10 sprite-icon4-cart sprite-icon4-cart-6-3'></div>
				{iOrderReviewTip}
			</div>
			{/* 地址信息 */}
			<OrderAddressInfo order={order} />

			<div className='pub-left-title mt15 mb10 pub-sticky h40'>{i18Translate('i18MyCart.Cart', 'Cart')}</div>
			<div className='mt20 box-shadow' style={{ borderRadius: '6px', background: '#f5f7fa' }}>
				<OrderSummaryTable paramMap={paramMap} order={order} orderList={order?.orderDetails} />
			</div>
			{/* style={{opacity: '0', height: '20px'}} */}
			{/* <div> */}
			{/* 同时修改另外一个DownloadPDF传参等 */}
			<DownloadPDF
				orderData={order}
				orderId={order?.orderId} invoiceType={order?.paymentWay}
				sendDateType={order?.sendDateType}
				paramMap={paramMap}
				customerShipment={customerShipment}
				loadingText={iOrderBeing}
			/>

			{/* <div style={{ position: 'absolute', top: '10%', right: '200%', width: '1000px'}}>
                    <div ref={pdfRef} dangerouslySetInnerHTML={{ __html: invoiceHtml }} />
                </div> */}
		</div>
		// </Spin>
	);
};
export default connect((state) => state)(OrderReview);
