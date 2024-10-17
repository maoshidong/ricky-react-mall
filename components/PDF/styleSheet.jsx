import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFViewer, Image as PDFImage, usePDF, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
	page: {
		padding: 26,
		paddingBottom: 150,
		backgroundColor: '#fff',
		fontFamily: 'Noto Serif SC',
	},
	header: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		paddingBottom: 20,
	},
	headerLeft: {
		width: 200,
	},
	headerLeftText: {
		display: 'flex',
		flexDirection: 'column',
		fontSize: 10,
		color: '#333',
	},
	headerLeftTextContract: {
		display: 'flex',
		flexDirection: 'column',
	},
	// 496*100 400*84   zhLogo 187*60
	logo: {
		width: 192, // 192 248
		height: 39, // 39 50
		marginBottom: 10,
		// fontFamily: 'Helvetica-Bold',
		// objectFit: 'cover',
	},
	logoZh: {
		width: 120, // 192 248
		height: 39, // 39 50
		marginBottom: 10,
	},
	headerRight: {
		display: 'flex',
		width: 350,
		flexDirection: 'column',
		textAlign: 'right',
		fontSize: 14,
		color: '#333',
	},
	headerRightTitle: {
		fontSize: 28,
		color: '#1770DE',
		fontWeight: 800,
		// fontFamily: 'Helvetica-Bold',
	},
	contentInfo: {
		display: 'flex',
		flexDirection: 'row',
		marginTop: 10,
	},
	contentInfoLeft: {
		display: 'flex',
		width: '50%',
		marginRight: 5,
		fontSize: 10,
		color: '#333',
		fontWeight: 200,
		lineHeight: '1.5',
		flexDirection: 'column',
		flexGrow: 6,
	},
	contentInfoRight: {
		display: 'flex',
		width: '50%',
		fontSize: 10,
		color: '#333',
		fontWeight: 200,
		lineHeight: '1.5',
		// alignItems:'center',
		flexDirection: 'column',
		flexGrow: 6,
	},
	contentInfoTitle: {
		width: 110,
		color: '#333333',
		fontSize: 12,
		fontWeight: 800,
		// fontFamily: 'Helvetica-Bold', // 使文本无法上下对齐
	},
	contentInfoTitleZh: {
		width: 58,
		color: '#333333',
		fontSize: 12,
		fontWeight: 800,
		// fontFamily: 'Helvetica-Bold', // 使文本无法上下对齐
	},
	contentInfoTitleZh1: {
		width: 70,
		color: '#333333',
		fontSize: 12,
		fontWeight: 800,
		// fontFamily: 'Helvetica-Bold', // 使文本无法上下对齐
	},
	contentBox: {
		display: 'flex',
		flexDirection: 'column',
		marginBottom: 5,
		padding: 5,
		border: '1px solid #999',
		borderRadius: 2,
	},
	contentInfoRightTextBox: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center', // 恢复
	},
	table: {
		border: '1px solid #999',
		borderRadius: 2,
		marginBottom: 5,
		// marginBottom: '30px',
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
		borderLeft: '1px solid #999',
	},
	tableTh: {
		padding: '7px 5px',
		fontSize: 12,
		color: '#333',
		fontWeight: 800,
		borderLeft: '1px solid #999',
		// fontFamily: 'Helvetica-Bold',
	},
	tableTr: {
		display: 'flex',
		borderBottom: '1px solid #999',
		flexDirection: 'row',
	},
	noBorder: {
		border: 'none',
	},
	tableR1: {
		width: '5%',
	},
	tableR2: {
		width: '45%',
	},
	tableR3: {
		width: '15%',
	},
	// tableR4:  {
	//     width: '10%'
	// },
	tableR5: {
		width: '15%',
	},
	tableR6: {
		width: '15%',
	},
	tableR66: {
		width: '50%',
		textAlign: 'right',
	},
	tableRight: {
		width: '20%',
		textAlign: 'right',
	},
	// 产品表格下样式
	tableDetail: {
		// width: '100%',
		// // display: 'flex',
		// alignItems: 'right',
		// // justifyContent: 'right',
		// marginTop: 6,
		// textAlign: 'right',
		// flexDirection: 'row',
		// justifyContent: 'space-between',

		// marginTop: '5px',
		textAlign: 'right',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end', // right
		alignItems: 'flex-end',
		// alignItems: 'center',

	},
	tableDetailLeft: {
		// width: '97%',
		height: '100%',
		paddingRight: '5px',
		// lineHeight: '26px',
	},

	tableDetailDescRight: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'flex-end', // 文本右对齐
		padding: '1px 5px',
		// width: '60px',
		// minWidth: 'auto',
		// minWidth: '3%',
		height: '100%',
		textAlign: 'right',
		// marginLeft: '10px',
		// lineHeight: '26px',
	},
	tableDetailLeftText: {
		fontSize: 12,
		color: '#333',
		marginBottom: 6,
		textAlign: 'right',
		marginRight: '1px',
	},
	tableDetailLeftTextBold: {
		// fontSize: 12,
		// fontWeight: 600,
		// fontFamily: 'Helvetica-Bold' // 导致上下不对齐
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
	//     paddingLeft: 20,
	//     color: '#333'
	// },
	// informationDetailItem: {
	//     display: 'flex',
	//     fontSize: 12,
	//     flexDirection: 'row',
	//     alignItems: 'center'
	// },
	// informationDetailItemLeft: {
	//     width: 110,
	//     fontSize: 12,
	//     fontWeight: 800,
	//     fontFamily: 'Helvetica-Bold'
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

	fixBot: {
		position: 'absolute',
		bottom: 24,
		right: 0,
		left: 24,
		width: '100%',
		marginTop: 6,
		padding: '6px 0 6px 0',
		textAlign: 'center',
		color: '#333',
	},
	pageNumber: {
		position: 'absolute',
		fontSize: 10,
		bottom: 24,
		right: 0,
		color: '#333',
	},
	footer: {
		display: 'flex',
		paddingTop: 8,
		fontSize: 10,
		color: '#333',
		borderTop: '1px solid #D3D3D3',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},

	productDetailItem: {
		display: 'flex',
		fontSize: 12,
		flexDirection: 'row',
		alignItems: 'center',
		wordBreak: 'break-all',
	},
	productDetailItemLabel: {
		// marginTop: 2,
		// fontFamily: 'Helvetica-Bold',
		fontWeight: 800,
	},
	productDetailItemValue: {
		wordBreak: 'break-all',
		fontWeight: 800,
		// width: 250
	},

	// 银行
	information: {
		marginBottom: 6,
		padding: 5,
		border: '1px solid #999',
		borderRadius: 2,
	},
	informationTitle: {
		marginBottom: 5,
		fontSize: 12,
		fontWeight: 800,
		// fontFamily: 'Helvetica-Bold',
	},
	informationDetail: {
		marginBottom: 5,
		paddingLeft: 15,
		color: '#333',
	},
	informationDetailItem: {
		display: 'flex',
		fontSize: 12,
		flexDirection: 'row',
		alignItems: 'center',
	},
	informationDetailItemLeft: {
		// width: 90,
		fontSize: 12,
		// fontWeight: 800,
		// fontFamily: 'Helvetica-Bold'
	},
	informationDescription: {
		fontSize: 12,
		color: '#333',
	},
	informationDescriptionNote: {
		display: 'flex',
		// color: '#333',
		flexDirection: 'column',
		alignItems: 'start',
	},
	informationDescriptionNoteTitle: {
		// fontWeight: 800,
		// fontFamily: 'Helvetica-Bold'
	},
	conditions: {
		padding: 5,
		border: '1px solid #999',
		borderRadius: 2,
	},
	conditionsTitle: {
		fontSize: 12,
		color: '#333',
		fontWeight: 800,
		// fontFamily: 'Helvetica-Bold',
	},
	conditionsItem: {
		fontSize: 10,
		color: '#333',
	},
	patronage: {
		marginTop: 6,
		padding: '6px 25px',
		// padding: '6px 25px',
		// textAlign: 'center',
		color: '#333',
	},
	patronageTitle: {
		fontSize: 12,
		fontWeight: 800,
		// fontFamily: 'Helvetica-Bold',
	},
	patronageInfo: {
		fontSize: 10,
	},
});

export default styles