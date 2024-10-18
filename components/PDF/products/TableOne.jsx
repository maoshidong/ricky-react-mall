import React from "react";
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { getCurrencyInfo } from '~/repositories/Utils';

const TableOneCom = ({ details, iPaymentPending, iPaymentCompleted, iSurchargeNumber, iOrderStatus, iName, iNo, iExtPrice }) => {
	const currencyInfo = getCurrencyInfo()

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
	return (
		<View style={styles.table}>
			<View style={styles.tableHeader}>
				<View style={[styles.tableTh, styles.tableR1, styles.noBorder]}>
					<Text>{iNo}</Text>
				</View>
				<View style={[styles.tableTh, styles.tableR3]}>
					<Text>{iSurchargeNumber}</Text>
				</View>
				<View style={[styles.tableTh, styles.tableR3]}>
					<Text>{iOrderStatus}</Text>
				</View>
				<View style={[styles.tableTh, styles.tableR2]}>
					<Text>
						{iName}
					</Text>
				</View>
				<View style={[styles.tableTh, styles.tableR66]}>
					<Text>{iExtPrice} {currencyInfo.value} {currencyInfo.label}</Text>
				</View>
			</View>

			<View style={styles.tableBody}>
				{
					details?.length ? details?.map((detail, index) => (
						<View key={detail.id} style={[styles.tableTr, index === details?.length - 1 ? styles.noBorder : null]}>
							<View style={[styles.tableTd, styles.tableR1, styles.noBorder]}>
								<Text style={styles.tableFirstItem}>{index + 1}</Text>
							</View>
							<View style={[styles.tableTd, styles.tableR3]}>
								<Text style={styles.productDetailItemValue}>{detail.orderId}</Text>
							</View>
							<View style={[styles.tableTd, styles.tableR3]}>
								<Text style={styles.productDetailItemValue}>
									<div className={detail?.status === 3 ? 'color-suc' : 'color-warn'}>
										{detail?.status === 3 ? iPaymentCompleted : iPaymentPending}</div>
								</Text>
							</View>

							{/* 附加费用 */}
							<View style={[styles.tableTd, styles.tableR2]}>
								<Text style={styles.productDetailItemValue}>{detail.productName}</Text>
							</View>

							<View style={[styles.tableTd, styles.tableR66]}>
								<Text>{currencyInfo.label}{detail.onePrice}</Text>
							</View>
						</View>
					)) : null
				}

			</View>
		</View>
	)
}

export default TableOneCom
