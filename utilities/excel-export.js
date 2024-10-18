import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';

import dayjs from 'dayjs';
import noop from 'lodash/noop';
import forEach from 'lodash/forEach';
import keys from 'lodash/keys';
import values from 'lodash/values';
import isArray from 'lodash/isArray';

/**
 *function: 导出Excel表格
 *@params 参数
 * @fileName 导出表格名称
 * @sheetName 导出sheet名称
 * @content 导出数据：[{   'Sort': 1,'Quantity': 10}]
 * @columnWidth 列宽(数组或者数字)
 * @rowHeight 行高(数组或者数字)
 * **/
const exportExcelTable = async ({ fileName, sheetName, content, columnWidth = 9, rowHeight = 20, onCallBack = noop() }) => {
	// 创建工作簿
	const workbook = new Workbook();
	const worksheet = workbook.addWorksheet(sheetName || 'sheet1');

	// 单元格样式字体
	const font = { name: 'Arial', family: 4, size: 9 }; // 字体,大小，型号
	const alignment = { horizontal: 'left', vertical: 'middle' }; //设置对其方式

	// 设置单元格样式
	const setCellStyle = (row) => {
		row.eachCell((cell) => {
			cell.font = font; // 设置字体颜色和大小
			cell.alignment = alignment; // 设置对其方式
		});
	};

	// 添加数据行
	forEach(content || [], (item, index) => {
		if (index === 0) {
			// 添加表头
			const tableH = keys(item);
			const title = worksheet.addRow(tableH);
			setCellStyle(title); // 设置表头样式
		}

		const valuesText = values(item);
		const row = worksheet.addRow(valuesText);
		setCellStyle(row); // 设置内容样式
	});

	// 设置列宽
	worksheet.columns.forEach((column, index) => {
		// 判断是不是数组
		if (isArray(columnWidth)) {
			column.width = columnWidth?.[index] || 9;
		} else {
			column.width = columnWidth; // 设置列宽为9
		}
	});

	// 设置所有行的固定高度
	worksheet.eachRow((row, index) => {
		// 判断是不是数组
		if (isArray(rowHeight)) {
			row.height = rowHeight?.[index];
		} else {
			row.height = rowHeight; // 设置行高为20
		}
	});

	// 写入文件
	const buffer = await workbook.xlsx.writeBuffer();
	saveAs(new Blob([buffer]), fileName || `${dayjs().format('DD-MMMM-YYYY HH-mm')}.xlsx`);
	onCallBack?.(); // 执行一个回调
};

export {
	exportExcelTable
}