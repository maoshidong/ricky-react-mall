import { Text, View, StyleSheet } from '@react-pdf/renderer';
import styles from '@/components/PDF/styleSheet';

/**
 * @银行信息
 * */
const BankesInfoCom = ({ iBanker, iBank, iAccountName, iAccountNo, iSwiftCode, iBankAddress,
	iAllBank, iBankAdditional, iBankNote
}) => {
	// css 样式
	const stylesBank = StyleSheet.create({
		// lh20: {
		//     lineHeight: '20px',
		// },
		informationLeft: {
			// width: 96,
			// // fontSize: 12,
			// fontWeight: 800,
			// fontFamily: 'Helvetica-Bold'
		},
		// information: {
		//     marginBottom: 6,
		//     padding: 5,
		//     border: '1px solid #999',
		//     borderRadius: 2
		// },
		// informationTitle: {
		//     marginBottom: 5,
		//     fontSize: 12,
		//     fontWeight: 800,
		//     fontFamily: 'Helvetica-Bold'
		// },
		// informationDetail: {
		//     marginBottom: 5,
		//     paddingLeft: 15,
		//     color: '#333'
		// },
		// informationDetailItem: {
		//     display: 'flex',
		//     fontSize: 12,
		//     flexDirection: 'row',
		//     alignItems: 'center'
		// },

		// informationDescription: {
		//     fontSize: 12,
		//     color: "#333"
		// },
		// informationDescriptionNote: {
		//     display: 'flex',
		//     // color: '#333',
		//     flexDirection: 'column',
		//     alignItems: 'start'
		// },
		// informationDescriptionNoteTitle: {
		//     // fontWeight: 800,
		//     // fontFamily: 'Helvetica-Bold'
		// },
		// conditions: {
		//     padding: 5,
		//     border: '1px solid #999',
		//     borderRadius: 2
		// },
		// conditionsTitle: {
		//     fontSize: 12,
		//     color: '#333',
		//     fontWeight: 800,
		//     fontFamily: 'Helvetica-Bold'
		// },
		// conditionsItem: {
		//     fontSize: 10,
		//     color: '#333'
		// },
		// patronage: {
		//     marginTop: 6,
		//     padding: '6px 25px',
		//     // padding: '6px 25px',
		//     // textAlign: 'center',
		//     color: '#333'
		// },
		// patronageTitle: {
		//     fontSize: 12,
		//     fontWeight: 800,
		//     fontFamily: 'Helvetica-Bold'
		// },
		// patronageInfo: {
		//     fontSize: 10
		// },
	})

	return (
		<View style={styles.information}>
			<View>
				<Text style={styles.informationTitle}>{iBanker}:</Text>
			</View>
			<View style={styles.informationDetail}>
				<View style={styles.informationDetailItem}>
					<Text style={stylesBank.informationLeft}>{iBank}</Text>
				</View>
				<View style={styles.informationDetailItem}>
					<Text style={stylesBank.informationLeft}>{iAccountName}</Text>
				</View>
				<View style={styles.informationDetailItem}>
					<Text style={stylesBank.informationLeft}>{iAccountNo}</Text>
				</View>
				<View style={styles.informationDetailItem}>
					<Text style={stylesBank.informationLeft}>{iSwiftCode}</Text>
				</View>
				<View style={styles.informationDetailItem}>
					<Text style={stylesBank.informationLeft}>{iBankAddress}</Text>
				</View>
			</View>
			<View style={styles.informationDescription}>
				<Text>
					{iAllBank}
				</Text>
				<Text>
					{iBankAdditional}
				</Text>
				<View style={styles.informationDescriptionNote}>
					<Text style={styles.informationDescriptionNoteTitle}>{iBankNote}</Text>
				</View>
			</View>
		</View>
	)
}

export default BankesInfoCom