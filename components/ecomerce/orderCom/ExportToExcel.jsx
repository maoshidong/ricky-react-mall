import { Button } from 'antd';
import useLanguage from '~/hooks/useLanguage';
import { getCurrencyInfo } from '~/repositories/Utils';
import { toFixedFun } from '~/utilities/ecomerce-helpers';
import { exportExcelTable } from '~/utilities/excel-export';
import dayjs from 'dayjs';
import noop from 'lodash/noop';
import map from 'lodash/map';
import useI18 from '~/hooks/useI18';

/**
 * 导出Excel
 * @param
 * @orderDetails 订单导出的数据
 * @orderId 订单id 和orderDetails要一起传
 * @dataSource 其他导出的数据
 * @fileName 导出Excel文件名称
 * @sheetName 导出ExCelSheet名称
 * @columnWidth 列宽
 * @rowHeight 行高
 * @onCallBack 回调函数
 * @btnName 按钮名称
 * **/
const ExportToExcel = ({
	btnName = '',
	orderDetails = [],
	orderId = '',
	dataSource = [],
	fileName = '',
	sheetName = '',
	columnWidth = 9,
	rowHeight = 20,
	onCallBack = noop(),
}) => {
	const { curLanguageCodeZh } = useLanguage();
	const { iExport, iOrderDetails, iSort, iQuantity, iOrderNumber,
		iPartNumber, iManufacturer, iDescription, iCustomerReference, iAvailable,
		iBackorder, iOrderDate, iUnitPrice, iExtPrice } = useI18();
	const currencyInfo = getCurrencyInfo()
	const isZh = curLanguageCodeZh()

	// 导出按钮
	const handleExportExcelClick = () => {
		let list = [];
		// 如果传入的是订单数据，则当做订单导出处理；否则按照其他导出处理
		if (orderDetails?.length > 0) {
			list = map(orderDetails || [], (item, index) => {
				const { storageQuantity, quantity, snapshot, createTime, price, description, remark } = item;
				const { name: partNumber, manufacturerName: manufacturer } = JSON.parse(snapshot ?? '{}');
				const available = Math.min(storageQuantity, quantity);
				const backorder = Math.max(0, quantity - storageQuantity);

				return {
					[iSort]: index + 1,
					[iQuantity]: quantity,
					[iOrderNumber]: orderId,
					[iPartNumber]: partNumber,
					[iManufacturer]: manufacturer,
					[iDescription]: description,
					[iCustomerReference]: remark || '', // 客户编号
					[iAvailable]: available, // 可发货数量
					[iBackorder]: backorder, // 延期交货
					[iOrderDate]: dayjs(createTime).format(isZh ? 'YYYY年M月D日' : 'DD MMMM, YYYY - HH:mm:ss'),
					[iUnitPrice]: currencyInfo.label + toFixedFun(price / quantity || 0, 4), // 单价
					[iExtPrice]: currencyInfo.label + toFixedFun(price || 0, 2), // 总价
				};
			});
		} else {
			list = dataSource || [];
		}

		if (list?.length > 0) {
			exportExcelTable({
				fileName: fileName || 'PO' + orderId + '.xlsx',
				sheetName: sheetName || iOrderDetails,
				content: list,
				columnWidth: columnWidth, //columnWidth: [5, 8, 20, 20, 20, 25, 25, 12, 12, 25, 20, 20],
				rowHeight: rowHeight,
				onCallBack: onCallBack?.(),
			});
		}
	};

	return (
		<div className='ghost-btn'>
			<Button type="primary" ghost="true" className="login-page-login-btn ps-add-cart-footer-btn" onClick={handleExportExcelClick}>
				<div className="pub-flex-center">
					<div className="sprite-icon4-cart sprite-icon4-cart-5-7"></div>
					<div className="ml10">{btnName || iExport}</div>
				</div>
			</Button>
		</div>
	);
};

export default ExportToExcel;
