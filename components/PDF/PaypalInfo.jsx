import { Page, Text, View, StyleSheet, PDFViewer, Image as PDFImage, usePDF, Font } from '@react-pdf/renderer';
import styles from '@/components/PDF/styleSheet';

const PaypalInfoCom = () => {
	const stylesPay = StyleSheet.create({
		informationLeft: {
			// width: 90,
			// fontSize: 12,
			// fontWeight: 800,
			// fontFamily: 'Helvetica-Bold'
		},
	})
	return (
		<View style={styles.information}>
			<View>
				<Text style={styles.informationTitle}>PAYMENT INFORMATION:</Text>
			</View>
			<View style={styles.informationDetail}>
				<View style={styles.informationDetailItem}>
					<Text style={stylesPay.informationLeft}>Paypal Account: accounting@origin-ic.com</Text>
				</View>
			</View>
			<View style={styles.informationDescription}>
				<Text>
					All bank fees are the responsibility of the customer.
				</Text>
				<Text>
					Please fill in the full company name or order number in the transfer information for identification. You could also add it in the remarks column, If it could not be entered completely.
				</Text>
			</View>
		</View>
	)
}

export default PaypalInfoCom