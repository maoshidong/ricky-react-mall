import React from "react";
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import TableTwo from '@/components/PDF/products/TableTwo';
import { getCurrencyInfo } from '~/repositories/Utils';
// 附加费订单产品表格
const ProductTableCom = ({ type, details, iSurchargeNumber, iSurchargeName, iProductDetail, iOrdered, iUnitPrice, iExtPrice, iNo, iPaymentPending, iStatus, iAmount, iPaymentCompleted, iPaymentMethod, iName }) => {
	const currencyInfo = getCurrencyInfo()

	// css 样式
	const styles = StyleSheet.create({
		table: {
			border: '1px solid #999',
			borderRadius: 2
		},
		tableHeader: {
			display: 'flex',
			borderBottom: '1px solid #999',
			flexDirection: 'row',
		},
		tableBody: {
			display: 'flex',
			fontSize: 12,
			color: '#333',
			flexDirection: 'column',
		},
		tableTd: {
			padding: 5,
			borderLeft: '1px solid #999'
		},
		tableTh: {
			padding: '7px 5px',
			fontSize: 12,
			color: '#333',
			fontWeight: 800,
			borderLeft: '1px solid #999',
			fontFamily: 'Helvetica-Bold'
		},
		tableTr: {
			display: 'flex',
			borderBottom: '1px solid #999',
			flexDirection: 'row',
		},
		noBorder: {
			border: 'none'
		},
		tableR1: {
			width: '5%'
		},
		tableR2: {
			width: '45%'
		},
		tableR3: {
			width: '15%'
		},
		// tableR4:  {
		//     width: '10%'
		// },
		tableR5: {
			width: '15%'
		},
		tableR6: {
			width: '15%'
		},
		tableR66: {
			width: '50%',
			textAlign: 'right'
		},
		tableRight: {
			width: '20%',
			textAlign: 'right'
		},
	})

	// 类型为2 是附加费
	if (type === 2) return <TableTwo details={details} {...{ iSurchargeNumber, iPaymentCompleted, iPaymentPending, iStatus, iNo, iPaymentMethod, iAmount, iPaymentCompleted, iName }} />

	return (
		<View style={styles.table}>
			{/* 表格表头展示 */}
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
							type === 1 ? iProductDetail : iSurchargeName
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
						<Text>{iUnitPrice} {currencyInfo.value} {currencyInfo.label}</Text>
					</View>
				}
				{
					type === 1 && <View style={[styles.tableTh, styles.tableR6, styles.tableRight]}>
						<Text>{iExtPrice} {currencyInfo.value} {currencyInfo.label}</Text>
					</View>
				}
				{
					type === 2 && <View style={[styles.tableTh, styles.tableR66]}>
						<Text>{iExtPrice} {currencyInfo.value} {currencyInfo.label}</Text>
					</View>
				}
			</View>

			{/* 表格主体展示 */}
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
													<Text style={styles.productDetailItemLabel}>MFG#: </Text>
													<Text style={styles.productDetailItemValue}>{detail.productName}</Text>
												</View>
												<View style={styles.productDetailItem}>
													<Text style={styles.productDetailItemLabel}>MFG: </Text>
													<Text style={styles.productDetailItemValue}>{JSON.parse(detail?.snapshot).manufacturerName}</Text>
												</View>
												{detail?.remark && <View style={styles.productDetailItem}>
													<Text style={styles.productDetailItemLabel}>CRN: </Text>
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
						</View>
					)) : null
				}
			</View>
		</View>
	)
}

export default ProductTableCom