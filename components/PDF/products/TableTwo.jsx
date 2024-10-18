import React, { useEffect } from "react";
// import { connect, useSelector } from 'react-redux'
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { getCurrencyInfo } from '~/repositories/Utils';

import useLanguage from '~/hooks/useLanguage';
import useCart from '~/hooks/useCart';
import useOrder from '~/hooks/useOrder';
import useLocalStorage from '~/hooks/useLocalStorage';

import { getThousandsData } from '~/utilities/ecomerce-helpers';
// 附加费
const TableTwoCom = ({ details, iSurchargeNumber, iPaymentCompleted, iPaymentPending, iStatus, iNo, iPaymentMethod, iAmount, iName }) => {
	const { curLanguageCodeZh } = useLanguage();
	const { getPayMethodText } = useCart();
	const { getPayWayItem } = useOrder()
	const currencyInfo = getCurrencyInfo()

	const [pwListCok, setPwListCok] = useLocalStorage('pwListLoc', []);
	// const { payWayListStore } = useSelector((state) => state.dataStore);
	// const { spinLoading } = useSelector((state) => state.setting);

	// css 样式
	const styles = StyleSheet.create({
		table: {
			border: '1px solid #999',
			borderRadius: 2,
			marginBottom: 5,
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
			fontSize: 11,
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
			width: '22%'
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
			width: '13%',
			textAlign: 'right'
		},
		tableRight: {
			width: '20%',
			textAlign: 'right'
		},
		suc: {
			color: "#4FA72D !important"
		},
		warn: { color: "#FF6B01 !important" },
	})

	return (
		<View style={styles.table}>
			{/* 表格表头展示 */}
			<View style={styles.tableHeader}>
				<View style={[styles.tableTh, styles.tableR1, styles.noBorder]}>
					<Text>{iNo}</Text>
				</View>
				<View style={[styles.tableTh, styles.tableR3]}>
					<Text>{iSurchargeNumber}</Text>
				</View>
				<View style={[styles.tableTh, styles.tableR3]}>
					<Text>{iStatus}</Text>
				</View>
				<View style={[styles.tableTh, styles.tableR3]}>
					<Text>{iPaymentMethod}</Text>
				</View>
				<View style={[styles.tableTh, styles.tableR2]}>
					<Text>
						{iName}
					</Text>
				</View>
				<View style={[styles.tableTh, styles.tableR66]}>
					<Text>{iAmount}</Text>
				</View>
			</View>

			{/* 表格主体展示 */}
			<View style={styles.tableBody}>
				{
					details?.length ? details?.map((item, index) => (
						<View key={item.id} style={[styles.tableTr, index === details?.length - 1 ? styles.noBorder : null]}>
							<View style={[styles.tableTd, styles.tableR1, styles.noBorder]}>
								<Text style={styles.tableFirstItem}>{index + 1}</Text>
							</View>
							<View style={[styles.tableTd, styles.tableR3]}>
								<Text style={styles.productDetailItemValue}>{item.orderId}</Text>
							</View>
							<View style={[styles.tableTd, styles.tableR3]}>
								<Text style={[styles.productDetailItemValue]} >
									{item?.status === 3 ? iPaymentCompleted : iPaymentPending}
								</Text>
							</View>
							<View style={[styles.tableTd, styles.tableR3]}>
								<Text style={styles.productDetailItemValue}>{getPayWayItem(item?.paymentWay, pwListCok)?.name}</Text>
								{/* <Text style={styles.productDetailItemValue}>{curLanguageCodeZh() && item?.paymentWay == 5 ? '支付宝' : getPayMethodText(item?.paymentWay)}</Text> */}
							</View>
							{/* 附加费用 */}
							<View style={[styles.tableTd, styles.tableR2]}>
								<Text style={styles.productDetailItemValue}>{item.productName}</Text>
							</View>
							<View style={[styles.tableTd, styles.tableR66]}>
								<Text>{currencyInfo.label}{getThousandsData(item.onePrice)}</Text>
							</View>
						</View>
					)) : null
				}
			</View>
		</View>
	)
}

export default TableTwoCom