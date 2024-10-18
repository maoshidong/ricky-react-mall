import useLanguage from '~/hooks/useLanguage';
import AlarmPrompt from '~/components/common/alarmPrompt';
// import { AlarmPrompt } from '~/components/common';
import { TABLE_COLUMN, GENERALIZED_WORD } from '~/utilities/constant';
import { getCurrencyInfo } from '~/repositories/Utils';

export default function useI18() {
	const { i18Translate } = useLanguage();
	const currencyInfo = getCurrencyInfo();

	return {
		// i18Form

		iRequired: i18Translate('i18Form.Required', 'Required'),
		iFirstName: i18Translate('i18Form.First Name', 'First Name'),
		iLastName: i18Translate('i18Form.Last Name', 'Last Name'),


		i18FormRulesTip: (required = true, text) => [{ required, message: <AlarmPrompt text={text || i18Translate('i18Form.Required', 'Required')} /> }],
		i18FormRules: [{ required: true, message: <AlarmPrompt text={i18Translate('i18Form.Required', 'Required')} /> }],



		/****************** i18Home ******************/
		iComponentProcurement: i18Translate('i18Home.componentProcurement', 'Streamline components procurement for maximum efficiency'),
		iOneStop: i18Translate('i18Home.oneStop', 'Quality Electronic Components, Always Accessible'),
		iRecent: i18Translate('i18Home.recent', 'Recent Products'),


		/****************** i18MyCart ******************/
		// 订单  订单状态集合 - 拿i18翻译的数据还是对应的text？？？？？   返回状态text  ORDER_STATUS_TEXT
		iAddCurrentCart: i18Translate('i18MyCart.Add Current Cart', 'Add Current Cart'),
		iAddNewCart: i18Translate('i18MyCart.Add New Cart', 'Add New Cart'),


		/****************** i18AboutUs ******************/
		iContactSales: i18Translate('i18AboutUs.Contact Sales', 'Contact Sales'),


		/****************** i18Footer ******************/
		// i18ContactUs: i18Translate('i18Footer.contactUs', 'Contact us'),
		i18ContactUs: i18Translate('i18MenuText.Contact Us', 'Contact Us'),


		/****************** i18MyAccount ******************/
	  iPending: i18Translate('i18MyAccount.Pending', 'Pending'),
		iSubscriptionSuccessful: i18Translate('i18MyAccount.Subscription Successful', 'Subscription Successful.'),
		iUnsubscribeOperationTips: i18Translate('i18MyAccount.Unsubscribe Operation Tips', 'Unsubscribe Operation Tips'),
		iUnsubscribeTip: i18Translate('i18MyAccount.UnsubscribeTip', 'Are you sure you want to Unsubscribe?'),


		/****************** i18AboutOrder ******************/
		iPaymentPending: i18Translate('i18AboutOrder.Payment Pending', 'Payment Pending'),
		iPaymentCompleted: i18Translate('i18AboutOrder.Payment Completed', 'Payment Completed'),
		iProcessing: i18Translate('i18AboutOrder.Processing', 'Processing'),
		iProcessingCompleted: i18Translate('i18AboutOrder.Processing Completed', 'Processing Completed'),
		iWaitForDelivery: i18Translate('i18AboutOrder.Wait for Delivery', 'Wait for Delivery'),
		iPartiallyShipped: i18Translate('i18AboutOrder.Partially Shipped', 'Partially Shipped'),
		iPaymentVerificationPending: i18Translate('i18AboutOrder.Payment Verification Pending', 'Payment Verification Pending'),
		iPaymentSurcharge: i18Translate('i18AboutOrder.Payment  Surcharge', 'Payment  Surcharge'),
		iIsCreateNewCartTip: i18Translate('i18AboutOrder.isCreateNewCart', 'The system has detected that there are other products currently in your shopping cart. Please choose whether you want to add the products to your current cart or create a new cart.'),
		iSurchargeNumber: i18Translate('i18AboutOrder.Surcharge Number', 'Surcharge Number'),
		iSurchargeName: i18Translate('i18AboutOrder.Surcharge Name', 'Surcharge Name'),
		iCheckOrderTip: i18Translate('i18AboutOrder.checkOrderTip', 'To check all the information of your order'),
		iOrderDetails: i18Translate('i18AboutOrder.Order Details', 'Order Details'),
		iOrderNumber: i18Translate('i18AboutOrder.Order Number', 'Order Number'),
		iBackorder: i18Translate('i18AboutOrder.Backorder', 'Backorder'),
		iOrderDate: i18Translate('i18AboutOrder.Order Date', 'Order Date'),
		iSalesOrder: i18Translate('i18AboutOrder.Sales Order', 'Sales Order'),
		iShipMethod: i18Translate('i18AboutOrder.Ship Method', 'Ship Method'),
		iOrderTotal: i18Translate('i18AboutOrder.Order Total', 'Order Total'),
		iShipDate: i18Translate('i18AboutOrder.Ship Date', 'Ship Date'),
		iShipAccount: i18Translate('i18AboutOrder.Ship Account', 'Ship Account'),
		iMFG: i18Translate('i18AboutOrder.MFG', 'MFG'),
		iMFG1: i18Translate('i18AboutOrder.MFG1', 'MFG1'),
		iTotal: i18Translate('i18AboutOrder.Total', 'Total'),
		iAdditional: i18Translate('i18AboutOrder.Additional', 'ADDITIONAL FEE'),
		iBanker: i18Translate('i18AboutOrder.Banker', `BANKER'S INFORMATION`),
		iBank: i18Translate('i18AboutOrder.Bank', `Banker: HSBC Hong Kong`),
		iAccountName: i18Translate('i18AboutOrder.Account Name', `Account Name: Origin Data Electronics`),
		iAccountNo: i18Translate('i18AboutOrder.Account No', `Account No.: 400787321838`),
		iSwiftCode: i18Translate('i18AboutOrder.Swift Code', `Swift Code: HSBCHKHHHKH`),
		iBankAddress: i18Translate('i18AboutOrder.Bank Address', `Bank Address: Head Office, 1 Queen's Road Central, Hong Kong`),
		iAllBank: i18Translate('i18AboutOrder.All Bank', `All bank fees are the responsibility of the customer.`),
		iBankAdditional: i18Translate(
			'i18AboutOrder.Bank Additional',
			`Please note that it will take additional 2-3 business days to process a wire transfer from the time that it is sent. Additionally, inventory will NOT be reserved and your order will not be processed until your wire payment has been confirmed.`
		),
		iBankNote: i18Translate(
			'i18AboutOrder.Bank Note',
			`Note: Once payment has been received, your order will be processed. After the shipment, We will send shipping information to you immediately.`
		),
		iAllShipped: i18Translate('i18AboutOrder.All Shipped', 'All Shipped'),
		iOrderComplete: i18Translate('i18AboutOrder.Order Complete', 'Order Complete'),
		iOrderCompleted: i18Translate('i18AboutOrder.Order Completed', 'Order Completed'),
		iDate: i18Translate('i18AboutOrder.Date', 'Date'),


		/****************** i18CatalogHomePage ******************/
		iResultsRemaining: i18Translate('i18CatalogHomePage.Results remaining', 'Results remaining'),
		iAllManufacturers: i18Translate('i18CatalogHomePage.All Manufacturers', 'All Manufacturers'),
		iPopularManufacturers: i18Translate('i18CatalogHomePage.Popular Manufacturers', 'Popular Manufacturers'),
		iFeaturedManufacturers: i18Translate('i18CatalogHomePage.Featured Manufacturers', 'GLOBAL FEATURED MANUFACTURERS'),


		/****************** i18Form ******************/
		iRemark: i18Translate('i18Form.Remark', 'Remark'),
		iSubmitQuote: i18Translate('i18Form.Submit Quote', 'Submit Quote'),
		iEmailAddress: i18Translate('i18Form.Email Address', 'Email Address'),
		iEmail: i18Translate('i18Form.Email', 'Email'),
		iEmailTip: i18Translate('i18Form.EmailTip', 'Please input a valid email!'), // CORRECT_EMAIL_TIP

		
		/****************** i18SmallText ******************/
		iContactInformation: i18Translate('i18SmallText.Contact Information', 'Contact Information'),
		iRow: i18Translate('i18SmallText.row', 'Row'),
		iThankYou: i18Translate('i18SmallText.Thank you', 'Thank you.'),
		iOrderBeing: i18Translate('i18SmallText.Order Being', 'The order is being generated, please wait'),
		iName: i18Translate('i18SmallText.appellation', 'Name'),
		iPatronage: i18Translate('i18SmallText.Patronage', 'THANK YOU FOR YOUR PATRONAGE'),
		iWarning: i18Translate('i18SmallText.Warning', 'Warning'),
		iTransactions: i18Translate(
			'i18SmallText.Transactions',
			`All transactions with Origin Data, including its subsidiaries and/or afliates,are subject to Origin Data's Terms of Use and Conditions of Order, available at`
		),
		iTermsConditions: i18Translate('i18SmallText.Terms Conditions', 'TERMS & CONDITIONS'),
		iconfirmSpec: i18Translate(
			'i18SmallText.Confirm Specifications',
			'Please confirm the specifications of the product before placing an order and indicate any special order instructions on the ordering page.'
		),
		iNecessary: i18Translate('i18SmallText.Necessary', 'If necessary, you can also contact us by email to modify order details before shipment.'),
		iCancelled: i18Translate('i18SmallText.Cancelled', 'Orders cannot be cancelled after the package has been shipped.'),
		iResponsible: i18Translate(
			'i18SmallText.Responsible',
			'Customers are responsible for paying all possible charges, including sales tax, value-added tax, and customs charges.'
		),
		iChoose: i18Translate('i18SmallText.Choose', 'You can choose to pay shipping fees via your own shipping account or have us pay for it.'),
		iRemote: i18Translate(
			'i18SmallText.Remote',
			`If you are located in a remote area, please confirm with the logistics company in advance. Delivery to these areas may require additional fees (35-50 ${currencyInfo.value}).`
		),
		iUnable: i18Translate('i18SmallText.Unable', 'We are unable to appoint a delivery date; delivery time usually takes 2 to 7 working days.'),
		iTracking: i18Translate(
			'i18SmallText.Tracking',
			'A tracking number will be provided once the order has been shipped. (Please note that it might take up to 24 hours for carriers to display updated information.)'
		),
		iContinue: i18Translate('i18SmallText.Continue', 'Continue'),
		iByCategories: i18Translate('i18SmallText.By Categories', 'By Categories'),
		iByManufacturers: i18Translate('i18SmallText.By Manufacturers', 'By Manufacturers'),
		iUnclassified: i18Translate('i18SmallText.Unclassified', 'Unclassified'),
		iSearchPartNumber: i18Translate('i18SmallText.Search Part Number', 'Search Part Number'),
		iEnterPartNumber: i18Translate('i18SmallText.Enter Part Number', 'Enter Part Number'),
		iAppliedFilters: i18Translate('i18SmallText.Search Entry', 'Applied Filters'),
		iResults: i18Translate('i18SmallText.Results', 'Results'),
		iNewest: i18Translate('i18SmallText.Newest', 'Newest '),
		iCategoryFilters: i18Translate('i18SmallText.Category Filters', 'Category Filters'),
		iNewByCategory: i18Translate('i18SmallText.New by Category', 'New by Category'),
		iFilters: i18Translate('i18SmallText.Filters', 'Filters'),
		ION: i18Translate('i18SmallText.ON', 'ON'),
		IOFF: i18Translate('i18SmallText.OFF', 'OFF'),
		iItems: i18Translate('i18SmallText.Items', 'Items'),
		iShipsFrom: i18Translate('i18SmallText.Ships From', 'Ships From'),
		iKeywords: i18Translate('i18SmallText.Keywords', 'keywords'),


		/****************** i18FunBtnText ******************/
		iClose: i18Translate('i18FunBtnText.Close', 'Close'),
		iDeleteSelected: i18Translate('i18FunBtnText.Delete Selected', 'Delete Selected'),
		iViewQuote: i18Translate('i18FunBtnText.View Quote', 'View Quote'),
		iRequestAQuote: i18Translate('i18FunBtnText.REQUEST A QUOTE', 'Request a Quote'),
		iOk: i18Translate('i18FunBtnText.OK', 'OK'),
		iExport: i18Translate('i18FunBtnText.Export to Excel', 'Export to Excel'),
		iCancel: i18Translate('i18FunBtnText.Cancel', 'Cancel'),
		iPrint: i18Translate('i18FunBtnText.Print', "Print"),


		/****************** i18MenuText ******************/
		iHome: i18Translate('i18MenuText.Home', 'Home'),
		iProductIndex: i18Translate('i18MenuText.Product Index', 'Product Index'),
		iNewestProducts: i18Translate('i18MenuText.Newest Products', 'Newest Products'),
		iHotProducts: i18Translate('i18MenuText.Hot Products', 'Hot Products'),
		iRecommendedProducts: i18Translate('i18MenuText.Recommended Products', 'Recommended Products'),
		iDiscountProducts: i18Translate('i18MenuText.Discount Products', 'Discount Products'),
		iBlogs: i18Translate('i18MenuText.Blog', 'Blogs'),
		iViewMore: i18Translate('i18MenuText.View more', 'View more'),
		iNewsArchive: i18Translate('i18MenuText.News Archive', 'News Archive'),
		iVideos: i18Translate('i18MenuText.Videos', 'Videos'),
		iQuoteHistory: i18Translate('i18MenuText.Quote History', 'Quote History'),
		iQuoteRequest: i18Translate('i18MenuText.Quote Request', 'Quote Request'),
		iBomUpload: i18Translate('i18MenuText.BOM Tools', 'BOM Upload'),
		iPrivacyCenter: i18Translate('i18MenuText.Privacy Center', 'Privacy Center'),
		iTermsAndConditions: i18Translate('i18MenuText.Terms and Conditions', 'Terms and Conditions'),
		iConnect: i18Translate('i18MenuText.Connect', 'Connect'),


		/****************** i18QuotePage ******************/
		iStep: i18Translate('i18QuotePage.Step', 'Step'),
		iRfqTip1: i18Translate('i18QuotePage.rfqTip1', 'Please enter your RFQ.'),
		iRfqTip2: i18Translate('i18QuotePage.rfqTip2', 'Inquiry error, please enter again your RFQ'),
		// iLoginTip: i18Translate('i18QuotePage.loginTip', 'to view historical orders.'), // 旧的
		iLoginTip: i18Translate(
			'i18QuotePage.loginTip',
			'to effortlessly create and manage your quotes! Simply add parts to your quote list, click "Create Quote," provide your contact details, and submit. Your quote will be promptly sent to our sales team for processing. Alternatively, you can email us directly to request a quote at'
		),
		iQuoteTip: i18Translate(
			'i18QuotePage.quoteTip',
			'Once you are done adding parts to your Quote Cart just click the Request a Quote button and your quote will be sent to us for processing. You can also send us an email directly for a quote, Email: '
		),
		iPartList: i18Translate('i18QuotePage.partList', 'Part List'),
		iAddMoreParts: i18Translate('i18QuotePage.addMoreParts', 'Add Row'),
		iQuoteNoResults: i18Translate('i18QuotePage.quoteNoResults', 'Sorry, your quote request history no results'),
		iBulkAdd: i18Translate('i18QuotePage.Bulk Add', 'Bulk Add'),
		iUpload: i18Translate('i18QuotePage.Upload', 'Upload'),
		iBack: i18Translate('i18QuotePage.Back', 'Back'),
		iAddToList: i18Translate('i18QuotePage.Add To List', 'Add To List'),
		iSkip: i18Translate('i18QuotePage.Skip', 'Skip'),
		iFIRST: i18Translate('i18QuotePage.FIRST', 'FIRST'),
		iSECOND: i18Translate('i18QuotePage.SECOND', 'SECOND'),
		iTHIRD: i18Translate('i18QuotePage.THIRD', 'THIRD'),
		iFOURTH: i18Translate('i18QuotePage.FOURTH', 'FOURTH'),
		iFIFTH: i18Translate('i18QuotePage.FIFTH', 'FIFTH'),
		iSIXTH: i18Translate('i18QuotePage.SIXTH', 'SIXTH'),
		iSEVENTH: i18Translate('i18QuotePage.SEVENTH', 'SEVENTH'),
		iEIGHTH: i18Translate('i18QuotePage.EIGHTH', 'EIGHTH'),
		iNINTH: i18Translate('i18QuotePage.NINTH', 'NINTH'),
		iAttrition: i18Translate('i18QuotePage.Attrition', 'Attrition%'),
		iSeparated: i18Translate(
			'i18QuotePage.Separated',
			`Paste your tab or comma  or space separated list in the text field below. Utilize the drop downs above the text field to map the order of the information contained in your list from left to right. If you don't have some of the information available to be mapped in your list just leave them unselected.`
		),
		iUploadaList: i18Translate('i18QuotePage.Upload a List', 'Upload a List'),


		/****************** i18Bom ******************/
		iPartsListBOMTools: i18Translate('i18Bom.PartsListBOMTools', 'Parts List (BOM) Tools'),
		iFileError: i18Translate('i18Bom.FILE ERROR', 'FILE ERROR'),
		iAccept1: i18Translate('i18Bom.Accept1', 'Your submitted file is in the wrong format. Please upload a valid file format: csv, xls, xlsx, txt or text'),
		iAccept2: i18Translate('i18Bom.Accept2', 'Your submitted file is in the wrong format. Please upload a valid file format: csv, xls or xlsx'),
		iSizError: i18Translate('i18Bom.SIZ ERROR', 'SIZ ERROR'),
		iMaximum: i18Translate('i18Bom.Maximum', 'Maximum file size 2MB'),
		iLineItemsExceeded: i18Translate('i18Bom.LINE ITEMS EXCEEDED', 'LINE ITEMS EXCEEDED'),
		iRowLimit: i18Translate('i18Bom.Row Limit', 'The number of lines in your file exceeds the 300 maximum. Please reduce the number of lines & try again.'),
		iProject: i18Translate('i18Bom.Project', 'Have another project?'),
		iProcessRFQ: i18Translate('i18Bom.Process RFQ', `You don't need to wait for your RFQ to process to get started. Start your next search now!`),
		limitTip: i18Translate('i18Bom.limitTip', 'You have reached the line item limit of 300 for this tool.'),
		iRowTip: i18Translate(
			'i18Bom.RowTip',
			'Your entry exceeds the line item limit of this feature. Any entries beyond the initial 300 line items will not be included on your list.'
		),
		iCreateQuote: i18Translate('i18Bom.Create Quote', 'Create Quote'),


		/****************** i18AboutProduct ******************/
		iCustomerReference: i18Translate('i18AboutProduct.Customer Reference', 'Customer Reference'),
		iReceivedRfq: i18Translate('i18AboutProduct.ReceivedRfq', 'We have received your RFQ.'),
		iReceivedRfq1: i18Translate('i18AboutProduct.ReceivedRfqTip1', 'Our sales representative will contact you within 1 business day via email.'),
		iReceivedRfq2: i18Translate('i18AboutProduct.ReceivedRfqTip2', 'Please check your email for the latest status of the RFQ. '),
		iDescription: i18Translate('i18AboutProduct.Description', 'Description'),
		iPricesUSD: i18Translate('i18AboutProduct.PricesUSD', `All prices are in ${currencyInfo.value}`),
		iInvalidQuantity: i18Translate('i18AboutProduct.Invalid Quantity', 'Invalid Quantity'),
		iRemainingPayment: i18Translate('i18AboutProduct.Remaining Payment', 'Remaining Payment'),


		/****************** i18PubliceTable ******************/
		iSort: i18Translate('i18PubliceTable.Sort', 'Sort'),
		iAvailable: i18Translate('i18PubliceTable.Available', 'Available'),
		iNo: i18Translate('i18PubliceTable.No.', 'No.'),
		iProductDetail: i18Translate('i18PubliceTable.Product Detail', 'Product Detail'),
		iOrdered: i18Translate('i18PubliceTable.Ordered', TABLE_COLUMN.orderQty),
		iStatus: i18Translate('i18PubliceTable.Status', 'Status'),
		iAmount: i18Translate('i18PubliceTable.Amount', 'Amount'),
		iColumn: i18Translate('i18PubliceTable.Column', 'Column'),
		iTableSelect: i18Translate('i18PubliceTable.Select', 'Select'),
		iTableImage: i18Translate('i18PubliceTable.Image', 'Image'),
		iTableProductDetail: i18Translate('i18PubliceTable.Product Detail', 'Product Detail'),
		iTablePrice: i18Translate('i18PubliceTable.Price', 'Price'),
		iTableAvailability: i18Translate('i18PubliceTable.Availability', 'Availability'),
		iPartNumber: i18Translate('i18PubliceTable.PartNumber', 'Part Number'),
		iManufacturer: i18Translate('i18PubliceTable.Manufacturer', 'Manufacturer'),
		iManufacturers: i18Translate('i18PubliceTable.Manufacturer', 'Manufacturers'),
		iTargetPrice: i18Translate('i18PubliceTable.Target Price', 'Target Price'),
		iOperation: i18Translate('i18PubliceTable.Operation', TABLE_COLUMN.operation),
		iAddPartNumber: i18Translate('i18PubliceTable.PartNumber', 'Add Part Number'),
		iTableECADModel: i18Translate('i18PubliceTable.ECAD Model', 'ECAD Model'),
		iQuantity: i18Translate('i18PubliceTable.Quantity', 'Quantity'),
		iQuantity1: i18Translate('i18PubliceTable.Quantity1', 'Quantity1'),
		iQuantity2: i18Translate('i18PubliceTable.Quantity2', 'Quantity2'),
		iQuantity3: i18Translate('i18PubliceTable.Quantity3', 'Quantity3'),
		iProductDetail: i18Translate('i18PubliceTable.Product Detail', 'Product Detail'),
		iOrdered: i18Translate('i18PubliceTable.Ordered', 'Ordered'),
		iUnitPrice: i18Translate('i18PubliceTable.UnitPrice', 'Unit Price'),
		iExtPrice: i18Translate('i18PubliceTable.ExtPrice', 'Ext.Price'),
		iExtPriceUp: i18Translate('i18PubliceTable.ExtPrice', 'EXT PRICE'),


		/****************** i18OrderAddress ******************/
		iShipTO: i18Translate('i18OrderAddress.SHIP TO', 'SHIP TO'),
		iBILLTO: i18Translate('i18OrderAddress.BILL TO', 'BILL TO'),


		/****************** i18CompanyInfo ******************/
		iOriginMall: i18Translate('i18CompanyInfo.Origin Electronic Parts Mall', GENERALIZED_WORD),
		iCompany: i18Translate('i18CompanyInfo.Origin Data limited', 'Origin Data Global Limited'),


		/****************** i18ResourcePages ******************/
		iProductHighlights: i18Translate(`i18ResourcePages.Product Highlights`, 'Product Highlights'),
		iApplicationNotes: i18Translate(`i18ResourcePages.Application Notes`, 'Application Notes'),
		iIncoterms: i18Translate('i18ResourcePages.Incoterms', 'Incoterm'),
		iAuthor: i18Translate('i18ResourcePages.Author', 'Author'),


		/****************** i18AboutOrder2 ******************/
		iAlipay: i18Translate('i18AboutOrder2.Alipay', 'Alipay'),
		iShippingFee: i18Translate('i18AboutOrder2.Shipping Fee', 'Shipping Fee'),
		iBankFee: i18Translate('i18AboutOrder2.Bank Fee', 'Bank Fee'),
		iVATNumber: i18Translate('i18AboutOrder2.VAT Number', 'VAT Number'),
		iPaymentMethod: i18Translate('i18AboutOrder2.Payment Method', 'Payment Method'),
		iOtherInformation: i18Translate('i18AboutOrder2.Other information', 'Other information'),
		iOrderSubmitted: i18Translate('i18AboutOrder2.Order Submitted', 'Order Submitted'),
		iSubmitPayment: i18Translate('i18AboutOrder2.Submit Payment', 'Submit Payment'),
		iUseMyShippingAccount: i18Translate('i18AboutOrder2.MyCourierAccount', 'Use My Shipping Account'),
		iEnterCourierAccount: i18Translate('i18AboutOrder2.Enter Courier Account', 'Enter Shipping Account'),
		iDeliveryInformation: i18Translate('i18AboutOrder2.Delivery information', 'Please enter your delivery information'),
		iPickUpMethod: i18Translate('i18AboutOrder2.Pick-up method', 'please select pick-up method'),
	};
}