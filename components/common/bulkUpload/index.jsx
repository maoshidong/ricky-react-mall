import { useState } from 'react';
import { Button, Upload } from 'antd';
import MinModalTip from '~/components/ecomerce/minCom/MinModalTip';
import useI18 from '~/hooks/useI18';
import MappingBomModal from '~/components/partials/shop/MappingBomModal';
import * as XLSX from 'xlsx';

import cloneDeep from 'lodash/cloneDeep';
import times from 'lodash/times';
import isEmpty from 'lodash/isEmpty';
import each from 'lodash/each';

// 定义允许上传的文件类型 xls、xlsx 和 csv,text,txt
const allowedFileTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv', 'text/plain'];
const letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
/**
 * @文件批量上传Bom询价
*/
const BulkUpload = ({ onAddToList }) => {
	const { iUploadaList, iFileError, iAccept1, iSizError, iMaximum, iWarning, iRowTip, iCancel, iColumn } = useI18() // 多语
	const [isShowTipModal, setIsShowTipModal] = useState(false);
	const [tipTitle, setTipTitle] = useState('ERR') // 提示modal
	const [tipText, setTipText] = useState('Err') // 提示modal
	const [fileList, setFileList] = useState([]); // 上传文件列表
	const [fileInfo, setFileInfo] = useState({}); // 上传文件信息
	const [fileWorkbook, setFileWorkbook] = useState({});
	const [tableSource, setTableSource] = useState([]) // 表数据
	const [columnsLength, setColumnsLength] = useState(0) // 列的数量
	const [isWorkSheet, setIsWorkSheet] = useState(false) // 
	const [isPreview, setIsPreview] = useState(false) // 上传数据审核弹窗
	const [isMore300, setIsMore300] = useState(false) // 是否超过了300行

	// 导入的数据是否超出限定的行数300
	const exceedRows = (dtList, rowsCount = 301, isShow = true) => {
		let flag = false
		// 限制行数量301
		if (dtList?.length > rowsCount) {
			flag = true
			setTipTitle(iWarning)
			setTipText(iRowTip)
			if (!!isShow) {
				setIsShowTipModal(true)
			} else {
				setIsShowTipModal(false)
			}
			setIsMore300(true)
		} else {
			setIsMore300(false)
			flag = false
		}

		return flag
	}

	// 上传文件之前 限制大小
	const beforeUpload = (file) => {
		const validFileType = allowedFileTypes.includes(file.type);
		const isLt2M = file.size / 1024 / 1024 < 2; // 小于2M

		let isMaxRowCount = true;

		if (!validFileType) {
			setTipTitle(iFileError);
			setTipText(iAccept1);
			setIsShowTipModal(true);
			return false;
		}

		if (!isLt2M) {
			setTipTitle(iSizError);
			setTipText(iMaximum);
			setIsShowTipModal(true);
			return false;
		}

		// return true -允许上传, false - 不允许上传
		return validFileType && isLt2M && isMaxRowCount;
	};

	// 生成表格数据
	const renderTable = (data, fileInfo, sheetNamesArr = [], isShow) => {
		const filterData = data?.filter((i) => Object.keys(i).length !== 0); // 清除掉空对象
		const dataSource = filterData.map((row, rowIndex) => ({
			key: `row${rowIndex}`,
			columnsLength: filterData?.[0].length || 0, // 文件列长度
			fileName: fileInfo?.file?.name, // 文件名称
			lastModified: Date.now(),
			sheetNamesArr,
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
			_list.unshift(colums)
		}

		setIsWorkSheet(true)
		setTableSource(_list) // 取前300行数据
		setColumnsLength(dataSource?.[0]?.columnsLength || 0)

		// bom限制行数量301
		if ((!exceedRows(dataSource, 301, !!isShow))) {
			setIsPreview(true)
		}
	};

	// 切换Excel表中的sheet
	const bomModalChangeSheet = val => {
		handleWorkbook(val);
	}

	// 处理Excel数据
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
		// if (rowCount > 300) {
		// 	console.error('超过行数限制--del');
		// }
		// 调用渲染表格的函数，并将parsedData传递过去
		renderTable(parsedData, info, sheetNamesArr, isShow);
	};

	// 处理Text数据
	const handleTextData = (txtList = []) => {
		const tl = cloneDeep(txtList)
		const _tList = tl.slice(0, 300) // 取前300行数据

		let columns = {} // 存储列头的数据
		let tbList = [] // table表格的数据
		let colLength = 0 // 列columns的数量

		if (_tList?.length > 0) {
			columns.key = 'row0' // 如果数据存在，设置列头的key数据
			each(_tList, (ml, mlIndex) => {
				const mples = ml.split('\t'); // 只对tab制表符做处理

				const key = `row${mlIndex + 1}`

				let obj = { key: key } // 存储行的数据
				each(mples, (mp, index) => {
					const cDtIndex = `column${index}`

					obj[cDtIndex] = mp

					// 更新columns对象，确保包含当前列的索引
					if (!columns.hasOwnProperty(cDtIndex)) {
						columns[cDtIndex] = `${iColumn}: ${letter[index]}`;
					}
				})

				tbList.push(obj)
			})
		}

		if (!isEmpty(columns)) {
			colLength = Object.keys(columns).filter(key => key.startsWith('column')).length
			columns.columnsLength = colLength
			tbList.unshift(columns)
		}

		setIsWorkSheet(false)
		setTableSource(tbList)
		setColumnsLength(colLength)
		// 是否超出限定行数
		if (!exceedRows(txtList, 300)) {
			setIsPreview(true)
		}

	}

	// 更改文件列表
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

		// 文件上传完成后的处理
		try {
			if (info.file.status === 'done') {
				const fileReader = new FileReader();
				if (info.file.type === 'text/plain') {
					// 如果是文本文件
					fileReader.onload = (e) => {
						const dt = e.target.result;
						const list = dt?.split('\n')
							.map(line => line.replace(/\r$/, ''))
							.filter(line => line.trim() !== ''); // 过滤掉空字符串元素

						handleTextData(list)
					};
					fileReader.readAsText(info.file.originFileObj);
				} else {
					// 如果是其他类型文件（假设是Excel文件）
					fileReader.onload = (e) => {
						const data = new Uint8Array(e.target.result);
						const workbook = XLSX.read(data, { type: 'array' });
						handleWorkbook(0, info, workbook, true);
					};
					fileReader.readAsArrayBuffer(info.file.originFileObj);
				}
			} else if (info.file.status === 'error') {
				throw new Error(`${info.file.name} 上传失败.`);
			}
		} catch (error) {
			console.error('文件处理失败：', error);
		}
	};

	// 确认上传数据
	const handleUploadAList = (dt) => {
		const list = []
		dt?.forEach(item => {
			const quantity = isNaN(item?.quantity) ? null : item?.quantity;
			const targetPrice = isNaN(item?.TargetPrice) ? null : item?.TargetPrice;

			list.push({
				PartNumber: item.partNum,
				Quantity: quantity,
				Manufacturer: item?.manufacturer || '',
				TargetPrice: targetPrice
			})
		})

		onAddToList(list)

		setIsPreview(false)
	}

	const handleComfirm = () => {
		setIsShowTipModal(false)
		setIsPreview(true)
	}

	return (
		<>
			<Upload accept=".xlsx,.xls,.csv,.text,.txt" showUploadList={false} fileList={fileList} onChange={handleUploadChange} beforeUpload={beforeUpload}>
				<Button type="submit" ghost>
					{iUploadaList}
				</Button>
			</Upload>

			{isPreview && (
				<MappingBomModal
					isWorkSheet={isWorkSheet}
					isViewBom={false}
					isShowModal={isPreview}
					tableSource={tableSource}
					isTargetPrice={true}
					isMore300={isMore300}
					columnsLength={columnsLength}
					cancelModule={() => setIsPreview(false)}
					chooseModule={() => setIsPreview(false)}
					bomModalChangeSheet={(val) => bomModalChangeSheet(val)}
					onCallbackData={handleUploadAList}
				/>
			)}

			{isShowTipModal && (
				<MinModalTip
					isShowTipModal={isShowTipModal}
					tipTitle={tipTitle}
					tipText={tipText}
					cancelText={iCancel}
					width={568}
					handleOk={isMore300 ? handleComfirm : null}
					onCancel={() => setIsShowTipModal(false)}
				/>
			)}
		</>
	);
};

export default BulkUpload;
