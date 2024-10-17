import { useEffect } from 'react';
import { Page, Text, View, Document, Image as PDFImage } from '@react-pdf/renderer';
import { handleMomentTime } from '~/utilities/common-helpers';
import { getThousandsData } from '~/utilities/ecomerce-helpers';
import { I18NEXT_LOCALE } from '~/utilities/constant';
import { getCurrencyInfo } from '~/repositories/Utils';

import useLanguage from '~/hooks/useLanguage';
import useOrder from '~/hooks/useOrder';
import useLocalStorage from '~/hooks/useLocalStorage';

import styles from '@/components/PDF/styleSheet'; // pdf样式
import ProductTable from '@/components/PDF/products/ProductTable'; // 产品表格
import BankesInfo from '@/components/PDF/BankesInfo'; // 银行支付信息
import PaypalInfo from '@/components/PDF/PaypalInfo'; // paypal支付信息

const PDFComponent = ({
	type, // 1 普通订单 2 附加费用订单 
	url, invoiceType, sendDateType, paramMap, iAddress, ...invoiceDetail
}) => {
	const { curLanguageCodeZh } = useLanguage();
	const { payWayList, getPayWayList, getPayWayItem } = useOrder()
	const [pwListCok, setPwListCok] = useLocalStorage('pwListLoc', []);

	const isZh = curLanguageCodeZh()
	// useEffect(() => {
	// 	getPayWayList()
	// }, [])
	const {
		// invoiceNo,
		NameA, NameB,
		companyNameA, companyNameB,
		addressLine1A, addressLine2A,
		cityA, cityB,
		countryA, countryB, phoneA, phoneB,
		addressLine1B, addressLine2B,
		time, orderId,
		mainOrderId, // 附加订单来源的订单号
		vatNumber, shippingWay, shipAccount,
		// shipCostBorne,
		shipDate, shippingTalk, orderNumber,
		shippingFee, BankFee,
		vatPrice, // 附加费的税费总额
		Voucher,
		Total, details = [],
		payPendingPrice, // 未付款金额
		productPrice,

		// 下面为多语言
		iMFG,
		iShipTO,
		iSurchargeNumber, iRemainingPayment, iBILLTO, iOrderDate, iSalesOrder, iPaymentMethod, iShipimmediately,
		iShipMethod, iShipDate, iIncoterms, iNo, iProductDetail, iOrdered, iVATNumber, iShipAccount, iName,
		iUnitPrice, iExtPrice, iShippingFee, iBankFee, iPricesUSD, iOrderTotal, iMFG1, iTTINADVANCE, iAlipay,
		iInvoice, iPurchaseOrderNumber, iPatronage, iTransactions, iCompany, iTermsConditions, iconfirmSpec,
		iNecessary, iCancelled, iResponsible, iChoose, iRemote, iUnable, iTracking, iReference,
		iAdditional, iTotal, iBanker, iBank, iAccountName, iAccountNo, iSwiftCode, iBankAddress,
		iAllBank, iBankAdditional, iBankNote, iSurchargeName, iPaymentPending, iStatus, iAmount, iPaymentCompleted
	} = invoiceDetail
	const currencyInfo = getCurrencyInfo()

	// 支付方式
	const getPaymentMethod = () => {
		let method = 'PayPal'
		switch (+invoiceType) {
			case 1:
				method = getPayWayItem(1, pwListCok)?.name
				break;
			case 2:
				method = getPayWayItem(1, pwListCok)?.name
				break;
			case 4:
				method = isZh ? getPayWayItem(4, pwListCok)?.name : 'TT IN ADVANCE' // 英文pdf下电汇支付改为TT IN ADVANCE
				break;
			case 5:
				method = isZh ? getPayWayItem(5, pwListCok)?.name : '支付宝'
				break;
		}
		return method
	}

	let sty = styles.contentInfoTitle
	if (isZh) {
		sty = styles.contentInfoTitleZh
		if (orderNumber || vatNumber) {
			sty = styles.contentInfoTitleZh1
		}
	}

	return url ? <Document>
		<Page size={'A3'} style={styles.page} wrap>
			{/*PDF 头部*/}
			<View render={({ pageNumber, totalPages }) => (
				<View style={styles.header}>
					{/* 头部左边 */}
					<View style={styles.headerLeft}>
						{/* 头部logo */}
						<View>
							<PDFImage src={url} style={isZh ? styles.logoZh : styles.logo} />
						</View>
						<View style={styles.headerLeftText}>
							<Text>{iAddress}</Text>
							<View style={styles.headerLeftTextContract}>
								<Text>{paramMap?.phone || process.env.telephone}</Text>
								<Text>{paramMap?.email || process.env.email}</Text>
							</View>
						</View>
					</View>

					{/* 头部右边 */}
					<View style={styles.headerRight}>
						<Text style={styles.headerRightTitle}>{type === 1 ? iInvoice : iAdditional}</Text>
						<Text># {mainOrderId || orderId}</Text>
						<Text>{currencyInfo.value} {currencyInfo.label} {iSalesOrder}</Text>
					</View>
				</View>
			)} fixed />

			{/* 地址和订单 */}
			{type === 1 && <View style={styles.contentInfo}>
				{/* 收货地址 和 账单地址 */}
				<View style={styles.contentInfoLeft}>
					{/* 收货地址 */}
					<View style={styles.contentBox}>
						<Text style={styles.contentInfoTitle}>{iShipTO}:</Text>
						<Text>{NameA}</Text>
						<Text>{companyNameA}</Text>
						<Text>{addressLine1A}, {addressLine2A}</Text>
						<Text>{cityA}</Text>
						<Text>{countryA}</Text>
						<Text>{phoneA}</Text>
					</View>
					{/* 账单地址 */}
					<View style={styles.contentBox}>
						<Text style={styles.contentInfoTitle}>{iBILLTO}:</Text>
						<Text>{NameB}</Text>
						<Text>{companyNameB}</Text>
						<Text>{addressLine1B}, {addressLine2B}</Text>
						<Text>{cityB}</Text>
						<Text>{countryB}</Text>
						<Text>{phoneB}</Text>
					</View>
				</View>

				{/* 订单信息 */}
				<View style={styles.contentInfoRight}>
					<View style={styles.contentBox}>
						<View style={styles.contentInfoRightTextBox}>
							<Text style={sty}>{iOrderDate}:</Text>
							<Text>{handleMomentTime(time)}</Text>
						</View>
						<View style={styles.contentInfoRightTextBox}>
							<Text style={sty}>{iSalesOrder}:</Text>
							<Text>{orderId}</Text>
						</View>
						<View style={styles.contentInfoRightTextBox}>
							<Text style={sty}>{iPaymentMethod}:</Text>
							<Text>{getPaymentMethod()}</Text>
						</View>
						{vatNumber && <View style={styles.contentInfoRightTextBox}>
							<Text style={sty}>{iVATNumber}:</Text>
							<Text>{vatNumber}</Text>
						</View>
						}
						<View style={styles.contentInfoRightTextBox}>
							<Text style={sty}>{iShipMethod}:</Text>
							<Text>{shippingWay}</Text>
						</View>
						{shipAccount && <View style={styles.contentInfoRightTextBox}>
							<Text style={sty}>{iShipAccount}:</Text>
							<Text>{shipAccount}</Text>
						</View>
						}
						{/* 暂时去掉 */}
						{/* <View style={styles.contentInfoRightTextBox}>
							<Text style={styles.contentInfoTitle}>Ship Cost Borne:</Text>
							<Text>{shipCostBorne}</Text>
						</View> */}
						<View style={styles.contentInfoRightTextBox}>
							<Text style={sty}>{iShipDate}:</Text>
							<Text>
								{shipDate && 'Scheduled date: ' + handleMomentTime(shipDate)}
								{!shipDate && (sendDateType == "60" ? iShipimmediately : "Merge together")}
							</Text>
						</View>
						{!isZh && <View style={styles.contentInfoRightTextBox}>
							<Text style={sty}>{iIncoterms}:</Text>
							<Text>{shippingTalk}</Text>
						</View>}
						{orderNumber && <View style={styles.contentInfoRightTextBox}>
							<Text style={sty}>{iPurchaseOrderNumber}:</Text>
							<Text>{orderNumber}</Text>
						</View>
						}
					</View>
				</View>
			</View>}

			{/* 附加费用 */}
			{
				type === 2 && <ProductTable type={type} details={details} {...{ iSurchargeNumber, iSurchargeName, iPaymentMethod, iProductDetail, iOrdered, iUnitPrice, iExtPrice, iNo, iPaymentPending, iStatus, iAmount, iPaymentCompleted, iName }} />
			}

			{/* 产品表格 */}
			{
				type === 1 && <View style={styles.table}>
					<View style={styles.tableHeader}>
						<View style={[styles.tableTh, styles.tableR1, styles.noBorder]}>
							<Text>{iNo}</Text>
						</View>
						{
							type === 2 && <View style={[styles.tableTh, styles.tableR3]}>
								<Text>{iSurchargeNumber}</Text>
							</View>
						}
						<View style={[styles.tableTh, styles.tableR2]}>
							<Text>
								{
									type === 1 ? iProductDetail : iName
								}
							</Text>
						</View>

						{
							type === 1 && <View style={[styles.tableTh, styles.tableR3]}>
								<Text>{iOrdered}</Text>
							</View>
						}
						{
							type === 1 && <View style={[styles.tableTh, styles.tableR5]}>
								<Text>{iUnitPrice}</Text>
							</View>
						}

						{/* <View style={[styles.tableTh,styles.tableR4]}>
                        <Text>Quantity</Text>
                    </View> */}
						{
							type === 1 && <View style={[styles.tableTh, styles.tableR6, styles.tableRight]}>
								<Text>{iExtPrice}</Text>
							</View>
						}
						{
							type === 2 && <View style={[styles.tableTh, styles.tableR66]}>
								<Text>{iExtPrice} {currencyInfo.value} {currencyInfo.label}</Text>
							</View>
						}

					</View>
					<View style={styles.tableBody}>
						{
							details?.length ? details?.map((detail, index) => (
								<View key={detail.id} style={[styles.tableTr, index === details?.length - 1 ? styles.noBorder : null]}>
									<View style={[styles.tableTd, styles.tableR1, styles.noBorder]}>
										<Text style={styles.tableFirstItem}>{index + 1}</Text>
									</View>
									{
										type === 2 && <View style={[styles.tableTd, styles.tableR3]}>
											<Text style={styles.productDetailItemValue}>{detail.orderId}</Text>
										</View>
									}
									{
										type === 1 && <View style={[styles.tableTd, styles.tableR2]}>
											{
												detail?.snapshot ? (
													<>
														<View style={styles.productDetailItem}>
															<Text style={styles.productDetailItemLabel}>{iMFG1}#: </Text>
															<Text style={styles.productDetailItemValue}>{detail.productName}</Text>
														</View>
														<View style={styles.productDetailItem}>
															<Text style={styles.productDetailItemLabel}>{iMFG}: </Text>
															<Text style={styles.productDetailItemValue}>{JSON.parse(detail?.snapshot).manufacturerName}</Text>
														</View>
														{detail?.remark && <View style={styles.productDetailItem}>
															<Text style={styles.productDetailItemLabel}>{iReference}: </Text>
															<Text style={styles.productDetailItemValue}>{detail?.remark}</Text>
														</View>}
													</>
												) : null
											}
										</View>
									}
									{/* 附加费用 */}
									{
										type === 2 && <View style={[styles.tableTd, styles.tableR2]}>
											<Text style={styles.productDetailItemValue}>{detail.productName}</Text>
										</View>
									}
									{
										type === 1 && <View style={[styles.tableTd, styles.tableR3]}>
											<Text>{detail.quantity}</Text>
										</View>
									}
									{
										type === 1 && <View style={[styles.tableTd, styles.tableR5]}>
											<Text>{currencyInfo.label}{detail.onePrice}</Text>
										</View>
									}
									{
										type === 1 && <View style={[styles.tableTd, styles.tableR6, styles.tableRight]}>
											<Text>{currencyInfo.label}{detail.price}</Text>
										</View>
									}
									{
										type === 2 && <View style={[styles.tableTd, styles.tableR66]}>
											<Text>{currencyInfo.label}{detail.onePrice}</Text>
										</View>
									}


									{/* <View style={[styles.tableTd, styles.tableR4]}>
                                <Text>{detail.quantity}</Text>
                            </View> */}


								</View>
							)) : null
						}

					</View>
				</View>
			}

			{/* 产品表格下的价格数据 , display: 'flex', justifyContent: 'right' */}
			<View style={{ ...styles.tableDetail }}>
				<View style={styles.tableDetailLeft}>
					{
						type === 1 && <Text style={styles.tableDetailLeftText}>{iShippingFee}:</Text>
					}

					<Text style={styles.tableDetailLeftText}>{iBankFee}:</Text>
					{Number(Voucher) !== 0 && <Text style={styles.tableDetailLeftText}>Voucher:</Text>}
					<Text style={styles.tableDetailLeftText}>{type === 1 ? iOrderTotal : iTotal} :</Text>
					{(type === 2 && Number(payPendingPrice) !== 0) && <Text style={styles.tableDetailLeftText}>{type === 1 ? 'Order' : ''}{iRemainingPayment}:</Text>}
				</View>
				<View style={styles.tableDetailDescRight}>
					{
						type === 1 && <Text style={{ ...styles.tableDetailLeftText }}>
							{currencyInfo.label}{getThousandsData(shippingFee)}
						</Text>
					}
					{/* 税费 */}
					<Text
						style={{ ...styles.tableDetailLeftText }}>
						{currencyInfo.label}{type === 1 ? getThousandsData(BankFee) : getThousandsData(vatPrice)}
					</Text>
					{Number(Voucher) !== 0 && <Text
						style={{ ...styles.tableDetailLeftText }}>
						{currencyInfo.label}{getThousandsData(Voucher)}</Text>}

					<Text
						// ,{marginRight:'6px', , styles.tableDetailLeftTextBold }
						style={{ ...styles.tableDetailLeftText }}>
						{currencyInfo.label}
						{type === 1 ? getThousandsData(Total) : getThousandsData(Number(productPrice) + Number(vatPrice))}
					</Text>
					{
						// , ...styles.tableDetailLeftTextBold
						(type === 2 && Number(payPendingPrice) !== 0) && <Text style={{ ...styles.tableDetailLeftText }}>
							{currencyInfo.label}{getThousandsData(payPendingPrice)}
						</Text>
					}
					{/* { type === 2 && <Text style={[styles.tableDetailLeftText, styles.tableDetailLeftTextBold,{marginRight:'6px'}]}>
                        {currencyInfo.label}{payPendingPrice}</Text>} */}

				</View>

			</View>

			{type === 1 && <Text
				style={{ ...styles.tableDetailLeftText, width: '100%', textAlign: 'right', paddingRight: '5px' }}>{iPricesUSD}</Text>
			}

			{/* 银行信息 */}
			{
				(+invoiceType === 1 && type === 1) ? (
					<PaypalInfo />
				) : (type === 1 ? (isZh ? '' : <BankesInfo {...{
					iBanker, iBank, iAccountName, iAccountNo, iSwiftCode, iBankAddress,
					iAllBank, iBankAdditional, iBankNote
				}} />) : '') //isZh ? '' :
			}

			{/* 附加费都展示-改为只展示对应的 */}
			{
				(type === 2 && details?.find(item => item?.paymentWay === 1)) && <PaypalInfo />
			}
			{/* 银行信息 - 中文都去掉银行信息 */}
			{
				((type === 2 && !isZh) && details?.find(item => item?.paymentWay === 4)) && <BankesInfo {...{
					iBanker, iBank, iAccountName, iAccountNo, iSwiftCode, iBankAddress,
					iAllBank, iBankAdditional, iBankNote
				}} />
			}

			{/* 条约说明 */}
			{
				type === 1 && <View style={styles.conditions}>
					<Text style={styles.conditionsTitle}>{iTermsConditions}:</Text>
					<View>
						<Text style={styles.conditionsItem}>{iconfirmSpec}</Text>
						<Text style={styles.conditionsItem}>{iNecessary}</Text>
						<Text style={styles.conditionsItem}>{iCancelled}</Text>
						<Text style={styles.conditionsItem}>{iResponsible}</Text>
						<Text style={styles.conditionsItem}>{iChoose}</Text>
						<Text style={styles.conditionsItem}>{iRemote}</Text>
						<Text style={styles.conditionsItem}>{iUnable}</Text>
						<Text style={styles.conditionsItem}>{iTracking}</Text>
					</View>
				</View>
			}

			{/* PDF底部 */}
			<View style={styles.fixBot} render={({ pageNumber, totalPages }) => (
				<View >
					<View>
						<View style={styles.patronage}>
							<Text style={styles.patronageTitle}>{iPatronage}</Text>
							<Text style={{ fontSize: '9px' }}>{iTransactions}</Text>
							<Text style={styles.patronageInfo}>{isZh ? I18NEXT_LOCALE.zhHost : I18NEXT_LOCALE.enHost}</Text>
						</View>
						<View style={styles.footer} >
							<Text>{iCompany}</Text>
							<Text render={({ pageNumber, totalPages }) => (
								isZh ? `第 ${pageNumber} 页，共 ${totalPages} 页` : `Page ${pageNumber} of ${totalPages}`
							)} fixed />
						</View>
					</View>
				</View>
			)} fixed />
		</Page>
	</Document> : null

}

export default PDFComponent