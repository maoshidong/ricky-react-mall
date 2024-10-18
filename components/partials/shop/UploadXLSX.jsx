import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Upload, message, Button } from 'antd';
// import XLSX from 'xlsx';
import * as XLSX from 'xlsx';

import cloneDeep from 'lodash/cloneDeep';
import times from 'lodash/times';
import isEmpty from 'lodash/isEmpty';

import useI18 from '~/hooks/useI18';

// 定义允许上传的文件类型 xls、xlsx 和 csv
const allowedFileTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
const letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

// const UploadXLSX = ({ children, tableSourceUpload, uploadBeforeUpload }) => {
const UploadXLSX = forwardRef((props, ref) => {
	const { iColumn } = useI18()
	const { children, tableSourceUpload, uploadBeforeUpload } = props;
	const [fileList, setFileList] = useState([]);
	const [fileInfo, setFileInfo] = useState({});
	const [fileWorkbook, setFileWorkbook] = useState({});

	const renderTable = (data, fileInfo, sheetNamesArr = [], isShow) => {
		const columns = data[0]
			? data[0].map((item, index) => ({
				title: `Column ${index + 1}`,
				dataIndex: `column${index}`,
				key: `column${index}`,
			}))
			: [];
		const filterData = data?.filter((i) => Object.keys(i).length !== 0); // 清除掉空对象
		// data.slice(1) 不去掉文件表头了
		const dataSource = filterData.map((row, rowIndex) => ({
			key: `row${rowIndex}`,
			columnsLength: filterData?.[0].length || 0, // 文件列长度
			fileName: fileInfo?.file?.name, // 文件名称
			lastModified: Date.now(),
			sheetNamesArr,
			// lastModified: fileInfo?.file?.lastModified, // 文件修改时间
			...row.reduce((prev, val, index) => {
				prev[`column${index}`] = val;
				return prev;
			}, {}),
		}));

		const dtList = cloneDeep(dataSource)
		const _list = dtList.slice(0, 301)

		const colums = {};
		times(dataSource?.[0]?.columnsLength || 0, dsl => {
			colums[`column${dsl}`] = `${iColumn}: ${letter[dsl]}`
		})

		if (!isEmpty(colums)) {
			colums.columnsLength = dataSource?.[0]?.columnsLength || 0
			colums.sheetNamesArr = dataSource?.[0]?.sheetNamesArr || []
			colums.fileName = fileInfo?.file?.name,
				colums.lastModified = Date.now(),
				_list.unshift(colums)
		}

		tableSourceUpload(_list, isShow);
		// return (
		//   <Table
		//     dataSource={dataSource}
		//     columns={columns}
		//     pagination={false}
		//   />
		// );
	};
	// 上传前限制
	const beforeUpload = (file) => {
		const validFileType = allowedFileTypes.includes(file.type);
		const isLt2M = file.size / 1024 / 1024 < 2; // 小于2M

		let isMaxRowCount = true;
		// new Promise((resolve, reject) => {
		//   const reader = new FileReader();
		//   reader.onload = (e) => {
		//     const data = new Uint8Array(e.target.result);
		//     const workbook = XLSX.read(data, { type: 'array' });
		//     const sheetName = workbook.SheetNames[0];
		//     const worksheet = workbook.Sheets[sheetName];
		//     const range = XLSX.utils.decode_range(worksheet['!ref']);
		//     const rowCount = range.e.r + 1;  // 获取行数
		//     if (rowCount > 999) {
		//       isMaxRowCount = false
		//     } else {
		//       isMaxRowCount = true
		//     }
		//   };
		//   reader.readAsArrayBuffer(file);
		// });
		if (uploadBeforeUpload) {
			uploadBeforeUpload(validFileType, isLt2M, isMaxRowCount);
		}
		return validFileType && isLt2M && isMaxRowCount; // return true -允许上传, false - 不允许上传
	};

	const handleWorkbook = (index = 0, info = fileInfo, workbook = fileWorkbook, isShow) => {
		const sheetNamesArr = workbook?.SheetNames?.map((item, index) => {
			return {
				value: index,
				label: item,
			};
		});

		// 保存
		setFileInfo(info);
		setFileWorkbook(workbook);

		const firstSheetName = workbook.SheetNames[index];
		const worksheet = workbook.Sheets[firstSheetName];
		const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
		const range = XLSX.utils.decode_range(worksheet['!ref']);
		const rowCount = range.e.r + 1; // 获取行数
		if (rowCount > 300) {
			console.error('超过行数限制--del');
		}
		// 调用渲染表格的函数，并将parsedData传递过去
		renderTable(parsedData, info, sheetNamesArr, isShow);
	};
	// 将子组件实例传递给父组件
	React.useImperativeHandle(ref, () => ({
		handleWorkbook: handleWorkbook,
	}));

	const handleUploadChange = (info) => {
		let fileList = [...info.fileList];
		fileList = fileList.slice(-1); // 只保留最后一个上传的文件

		fileList = fileList.map((file) => {
			if (file.response) {
				file.url = file.response.url;
			}
			return file;
		});

		setFileList(fileList);

		if (info.file.status === 'done') {
			// 文件上传完成后的处理
			try {
				const fileReader = new FileReader();
				fileReader.onload = (e) => {
					const data = new Uint8Array(e.target.result);

					const workbook = XLSX.read(data, { type: 'array' });

					handleWorkbook(0, info, workbook, true);

					// const firstSheetName = workbook.SheetNames[0];
					// const worksheet = workbook.Sheets[firstSheetName];
					// const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
					// const range = XLSX.utils.decode_range(worksheet['!ref']);
					// const rowCount = range.e.r + 1;  // 获取行数
					// if (rowCount > 1000) {
					// }
					// // 调用渲染表格的函数，并将parsedData传递过去
					// renderTable(parsedData, info);
				};
				fileReader.readAsArrayBuffer(info.file.originFileObj);
			} catch (error) {
				console.error('文件解析失败：', error);
			}
		} else if (info.file.status === 'error') {
			message.error(`${info.file.name} 上传失败.`);
		}
	};
	const handleUploadProgress = (event) => {
		// const percent = Math.floor((event.loaded / event.total) * 100);
		// setUploadProgress(percent);
	};

	return (
		<Upload
			onChange={handleUploadChange}
			beforeUpload={beforeUpload}
			fileList={fileList}
			customRequest={({ onSuccess }) => onSuccess('ok')}
			showUploadList={false}
			// showUploadList={{ showDownloadIcon: false }}
			onProgress={handleUploadProgress}
		// onProgress={(e) => {
		//   if (e.percent) {
		//     // 在这里可以更新 UI 中的上传进度状态
		//   }
		// }}
		>
			{children}
		</Upload>
	);
});

export default UploadXLSX;