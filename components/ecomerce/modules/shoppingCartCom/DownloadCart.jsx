import * as XLSX from 'xlsx';
import useLanguage from '~/hooks/useLanguage';
import { calculateTargetPriceTotal, calculateItemPriceTotal, toFixedFun } from '~/utilities/ecomerce-helpers';
import { getCurrencyInfo } from '~/repositories/Utils';

const DownloadCartCom = ({ allCartItems = [] }) => {
	const { i18Translate } = useLanguage();
	const currencyInfo = getCurrencyInfo();

	const getExcel = (title, content, column, rowstr) => {
		//导出Excel
		// title标题 类型：字符
		// content表内容 类型：数组  注：数组中的对象中的属性，数量一致，否则导出后数据错位  案例：[{name:'1',age:'3'},{name:'1',age:'3'}]
		// column列宽 类型数组，案例：[20] 每列的宽度为20px ; [20,30,60] 可以自定义宽度
		// rowstr行高 类型：数字 案例：20 数据行高为20px
		let arr = [];
		if (content.length > 0) {
			arr.push(Object.keys(content[0]));
			content.forEach((row) => {
				arr.push(Object.values(row));
			});
		}
		var filename = title + '.xlsx'; //保存的表名字
		var data = arr; //二维数组
		var ws_name = 'Sheet1'; //Excel第一个sheet的名称
		var wb = XLSX.utils.book_new();
		var ws = XLSX.utils.aoa_to_sheet(data);
		var wscols = []; // 每列不同宽度px
		if (column && column.length > 1) {
			column.forEach((val) => {
				wscols.push({ wch: val });
			});
		} else if (column && column.length == 1) {
			arr[0].forEach((val) => {
				wscols.push({ wch: column[0] });
			});
		}
		ws['!cols'] = wscols;
		let wsrows = [{ hpx: 20 }]; // 每行固定高度px
		if (arr.length > 1 && rowstr) {
			for (let i = 1; i <= arr.length - 1; i++) {
				// total  列表条数
				wsrows.push({ hpx: rowstr });
			}
			ws['!rows'] = wsrows;
		}
		XLSX.utils.book_append_sheet(wb, ws, ws_name); //将数据添加到工作薄
		XLSX.writeFile(wb, filename); //导出Excel
		// setLoadingSpin(false)
	};
	// 导出
	const importHandle = () => {
		let list = [];
		allCartItems?.map((item, index) => {
			const { quantity, cartQuantity } = item; // quantity 库存， cartQuantity 购买数量
			const available = quantity > cartQuantity ? cartQuantity : quantity;
			const backorder = quantity - cartQuantity > 0 ? 0 : cartQuantity - quantity;
			list.push({
				Sort: index + 1,
				Quantity: cartQuantity,
				'Part Number': item?.productName,
				Manufacturer: item?.manufacturerName,
				Description: item?.description,
				'CUSTOMER REFERENCE': '', // 客户编号
				Available: available, // 可发货数量???
				BACKORDER: backorder, // 延期交货
				'Unit Price': currencyInfo.label + toFixedFun(calculateTargetPriceTotal(item) || 0, 4), // 单价
				'Ext.Price': currencyInfo.label + toFixedFun(calculateItemPriceTotal(item, item.cartQuantity) || 0, 2), // 总价
			});
		});
		getExcel('productList', list, [5, 10, 20, 20, 25, 25, 12, 12, 25, 25], 20);
	};
	return (
		<div className="ps-common-btn-padding pub-color-hover-link" onClick={importHandle}>
			<div className="sprite-icon4-cart sprite-icon4-cart-3-11" />
			<div className="ml10">{i18Translate('i18FunBtnText.Download', 'Download')}</div>
		</div>
	);
};

export default DownloadCartCom