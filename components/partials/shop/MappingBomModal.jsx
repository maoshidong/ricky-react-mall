import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { nanoid } from 'nanoid';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import { Modal, Select, Table, Button } from 'antd';
import { getEnvUrl, QUOTE_BOM_DETAIL } from '~/utilities/sites-url';
import useLocalStorage from '~/hooks/useLocalStorage';
import QuoteRepositry from '~/repositories/zqx/QuoteRepositry';
import { setPageLoading } from '~/store/setting/action';
import useClickLimit from '~/hooks/useClickLimit';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
import times from 'lodash/times'

/**
 * @worksheetList - 表数组
*/
const MappingBomModal = ({
	isShowModal, cancelModule, tableSource, columnsLength = 10,
	bomModalChangeSheet,
	isWorkSheet = true,
	isViewBom = true,
	isTargetPrice = false,
	isMore300 = false,
	onCallbackData,
}) => {
	const { i18Translate } = useLanguage();
	const iLineNote = i18Translate('i18Bom.lineNote', 'Line Note')
	const iOptional = i18Translate('i18MyAccount.Optional', 'Optional')
	const iAssignAs = i18Translate('i18MyAccount.Assign as', 'Assign as')
	const { iUploadaList } = useI18()
	const dispatch = useDispatch();
	const [limitDisabled, handleLimitDisabled] = useClickLimit();

	const Router = useRouter();
	const [cookies, setCookie] = useCookies(['account']);
	const [currentSelect, setCurrentSelect] = useState([]) // 当前选中的数组，下标及对应值 1-partNum,2-quantity,3-remark
	const [worksheetList, setWorksheetList] = useState(tableSource?.[0]?.sheetNamesArr || [])
	const [isAssignSuc, setIsAssignSuc] = useState(true)
	const [isShowTip, setIsShowTip] = useState(false)
	const [isLimitTip, setIsLimitTip] = useState(false)

	// 保存用户上传的bom到本地
	const [storageBomList, setStorageBomList] = useLocalStorage('storageBom', []);

	const aArr = [
		{ partNumber: 'ACS70331EESATR-005U3' },
	]
	const [titleList, setTitleList] = useState(tableSource?.[0] || {}) // 表头
	const [bomTableList, setBomTableList] = useState(tableSource?.slice(1) || aArr || []);
	const [quantity, setQuantity] = useState(0) // 表头的下标
	const [rowQuantity, setRowQuantity] = useState(2) // 行数开始的下标
	const [isDisabled, setIsDisabled] = useState(false)

	const quantityList = [
		{ value: 1, label: 'Row 1' },
		{ value: 2, label: 'Row 2' },
		{ value: 3, label: 'Row 3' },
		{ value: 4, label: 'Row 4' },
		{ value: 5, label: 'Row 5' },
		{ value: 6, label: 'Row 6' },
		{ value: 7, label: 'Row 7' },
		{ value: 8, label: 'Row 8' },
		{ value: 9, label: 'Row 9' },
	]

	useEffect(() => {
		setTitleList(tableSource?.[0])
		setBomTableList(tableSource?.slice(1))
	}, [tableSource])
	useEffect(() => {
		setBomTableList(tableSource?.slice(rowQuantity)) // 取前300条数据 5CGXFC4C6F23C6N
	}, [rowQuantity])

	useEffect(() => {
		setIsLimitTip(isMore300)
	}, [isMore300])

	const handleUploadBomIsExistList = async (data) => {
		if (limitDisabled) return  // 限制多次点击
		setIsShowTip(false)
		handleLimitDisabled(true)
		dispatch(setPageLoading(true));
		const res = await QuoteRepositry.uploadBomIsExistList(data, cookies?.account?.token);
		dispatch(setPageLoading(false));
		handleLimitDisabled(false)

		if (res?.code === 0) {
			Router.push(getEnvUrl(QUOTE_BOM_DETAIL + `/${res?.data}`));
		}
	}

	const viewBom = async () => {
		// 型号和数量必填
		if (currentSelect.includes(1) && currentSelect.includes(2)) {
			const partNumIndex = currentSelect.indexOf(1); // 选中的型号列
			const quantityIndex = currentSelect.indexOf(2); // 选中的数量列
			const manufacturerIndex = currentSelect.indexOf(3);
			const remarkIndex = currentSelect.indexOf(4);
			const targetPriceIndex = currentSelect.indexOf(4);
			// 只保存选中的
			let dtoList = [] // 只存型号不为空的
			bomTableList?.map(item => {
				const pDt = {
					partNum: item?.[`column${partNumIndex}`] || '',
					quantity: item?.[`column${quantityIndex}`] || '',
					manufacturer: item?.[`column${manufacturerIndex}`] || '',
				}
				if (isTargetPrice) {
					pDt.TargetPrice = item?.[`column${targetPriceIndex}`] || ''
				} else {
					pDt.remark = item?.[`column${remarkIndex}`] || ''
				}
				// 只存型号不为空的
				if (pDt?.partNum) {
					dtoList.push(pDt)
				}
			})

			if (isViewBom) {
				const nanoidVal = nanoid()
				const params = [
					{
						dtoList,
						// voList: dtoList,
						nanoid: nanoidVal,
						fileName: tableSource?.[0]?.fileName,
						lastModified: tableSource?.[0]?.lastModified,
					},
					...storageBomList,
				]
				setStorageBomList(params)

				const uploadParams = {
					// dtoList: [
					//     {
					//         remark: "NXP Semiconductors",
					//         partNum: "MK64FN1M0VLL12",
					//         quantity: 10
					//     },
					//     {
					//         remark: "Microchip Technology",
					//         partNum: "KSZ8895MQXIA",
					//         quantity: 10,
					//     },
					//     {
					//         remark: "Microchip Technology",
					//         partNum: "KSZ9031RNXIA-TR",
					//         quantity: 100,
					//     }
					// ],
					dtoList,
					// nanoid: nanoidVal,
					fileName: tableSource?.[0]?.fileName,
					// lastModified: tableSource?.[0]?.lastModified,
				}

				handleUploadBomIsExistList(uploadParams)
			} else {
				onCallbackData?.(dtoList)
				setIsShowTip(false)
			}

		} else {
			setIsAssignSuc(false)
			setIsShowTip(true)
		}
	}

	const handleChange = (value, index) => {
		setIsAssignSuc(true)
		let arr = currentSelect
		let newArr = arr?.map((item, i) => {
			// 如果之前有选中当前选项,先清空之前的
			return item === value ? '' : item
		})
		newArr[index] = value
		setCurrentSelect(newArr)
	}

	const columns = [
		{
			title: <div className='w40' style={{ fontWeight: 600, fontSize: '12px', lineHeight: '12px' }}>{i18Translate('i18SmallText.row', 'ROW')}</div>,
			dataIndex: 'index',
			width: columnsLength > 4 ? 50 : 26,
			render: (_text, _record, index) =>
				<div className='w40'>
					<span>{index + 1}</span>
				</div>,
		},
	]

	times(columnsLength || 0, (index) => {
		columns.push({
			title: (
				<div>
					<div style={{ fontWeight: 600, fontSize: '12px' }}>{titleList?.[`column${index}`]}</div>
					<Select
						placeholder={`${iAssignAs}…`}
						onChange={(e) => (handleChange(e, index))}
						value={currentSelect[index]}
						className={"w150 " + ((!isAssignSuc && !currentSelect[index]) ? 'pub-danger-border' : '')}
					>
						<Option value={0}>{i18Translate('i18QuotePage.Skip', 'Skip')}</Option>
						<Option value={1}>{i18Translate('i18PubliceTable.PartNumber', 'Part Number')}</Option>
						<Option value={2}>{i18Translate('i18PubliceTable.Quantity', 'Quantity')}</Option>
						<Option value={3}>{i18Translate('i18PubliceTable.Manufacturer', 'Manufacturer')}</Option>
						{isTargetPrice ? (
							<Option value={4}>{i18Translate('i18PubliceTable.Target Price', 'Target Price')}</Option>
						) : (
							<Option value={4}>{iLineNote} ({iOptional})</Option>
						)}
					</Select>
				</div>
			),
			dataIndex: `column${index}`,
			ellipsis: true,
			width: 170, // 设置列的最小宽度
			render: (text) => (
				<div>{text}</div>
			),
		})
	})

	// bomTableList?.map((item, index) => {
	// 	if (index < columnsLength) {
	// 		columns.push({
	// 			title: (
	// 				<div>
	// 					<div className='cart-img-sort'>{titleList?.[`column${index}`]}</div>
	// 					<Select
	// 						placeholder={`${iAssignAs}…`}
	// 						onChange={(e) => (handleChange(e, index))}
	// 						value={currentSelect[index]}
	// 						className={"w150 " + ((!isAssignSuc && !currentSelect[index]) ? 'pub-danger-border' : '')}
	// 					// getPopupContainer={(trigger) => trigger.parentNode}
	// 					// getPopupContainer={() => document.getElementById('sTableRef')}
	// 					>
	// 						<Option value={1}>{i18Translate('i18PubliceTable.PartNumber', 'Part Number')}</Option>
	// 						<Option value={2}>{i18Translate('i18PubliceTable.Quantity', 'Quantity')}</Option>
	// 						<Option value={3}>{i18Translate('i18PubliceTable.Manufacturer', 'Manufacturer')}</Option>
	// 						<Option value={4}>{iLineNote} ({iOptional})</Option>
	// 					</Select>
	// 				</div>
	// 			),
	// 			dataIndex: `column${index}`,
	// 			ellipsis: true,
	// 			width: 170, // 设置列的最小宽度
	// 			render: (text) => (
	// 				<div>{text}</div>
	// 			),
	// 		})
	// 	}
	// })


	// 加上选择
	// const rowSelection = {
	//     columnTitle: <div className='pub-font14 pub-color18 pub-fontw'></div>,
	//     columnWidth: '60px', // 设置行选择列的宽度为
	//     // selectedRowKeys, // 选中的key集合
	//     // onChange: (selectedRowKeys, selectedRows) => {
	//     //     setSelectedRows(selectedRows)
	//     // },
	//     // getCheckboxProps: (record) => ({
	//     //     disabled: !(record?.pricesList?.length > 0),
	//     // }),
	// };

	const uploadFileMapping = i18Translate('i18Bom.uploadFileMapping', 'UPLOADED FILE MAPPING')
	const mapTip1 = i18Translate('i18Bom.mapTip1', 'A preview of the upload is available below and columns have been mapped based on their contents.')
	const mapTip2 = i18Translate('i18Bom.mapTip2', 'Please select the row where part info begins and verify that all columns are mapped appropriately.')
	const mapTip3 = i18Translate('i18Bom.mapTip3', 'Please select the required Part Number and quantity.')
	const limitTip = i18Translate('i18Bom.limitTip', 'You have reached the line item limit of 300 for this tool.')
	const selectWorksheet = i18Translate('i18Bom.selectWorksheet', 'Sheet')
	const rowBegin = i18Translate('i18Bom.rowBegin', 'Row Start')
	const iView = i18Translate('i18MenuText.view', 'View')

	return (
		<div className="quote-bom-page upload-box">
			<Modal
				title={uploadFileMapping}
				centered
				open={isShowModal}
				footer={null}
				onCancel={() => {
					cancelModule?.()
					setIsShowTip(false)
				}}
				className="pub-border custom-antd-btn-more bom-upload-modal"
				style={{ minWidth: 1100 }}
				maskClosable={false}
				closeIcon={<i className="icon icon-cross2"></i>}
			>
				<div className="pub-font13 pub-color555">{mapTip1}</div>
				<div className="pub-font13 pub-color555">{mapTip2}</div>
				{/* <div className="pub-font16 pub-color18">Check that your file information is correct, then map your columns.</div>
                <div className="pub-font13 pub-color555">Make sure that the values you'd like us to match against are available in the first 10 columns of your file.</div>
                <div className="pub-font13 pub-color555">Part Number and quantity must be selected below to process your BOM.</div> */}

				<div className="mt10 pub-flex-align-center" style={{ gap: '20px' }}>
					{isWorkSheet && (
						<div>
							<span className="pub-font13 pub-color18">{selectWorksheet}:</span>
							<Select
								className="ml10"
								onChange={(e) => (setQuantity(e), bomModalChangeSheet(e))}
								value={quantity} // 使用 value 属性设置选中的值
								options={worksheetList}
								getPopupContainer={(trigger) => trigger.parentNode}
								dropdownMatchSelectWidth={150}
							>
							</Select>
						</div>
					)}
					<div>
						<span className="pub-font13 pub-color18">{rowBegin}:</span>
						<Select
							className='ml10 w100'
							onChange={(e) => setRowQuantity(e)}
							value={rowQuantity} // 使用 value 属性设置选中的值
							options={quantityList}
							getPopupContainer={(trigger) => trigger.parentNode}
						>
						</Select>
					</div>
				</div>
				{isShowTip && <div className="mt10 pub-font13 pub-danger">{mapTip3}</div>}
				{/* {isLimitTip && <div className="mt10 pub-font13 pub-danger">{limitTip}</div>} */}
				<div id='sTableRef'>
					<Table
						size="small"
						pagination={false}
						columns={columns}
						rowKey={record => record?.productId}
						dataSource={bomTableList?.slice(0, 10)}
						// rowSelection={{
						//     ...rowSelection,
						// }}
						// , x: true
						bordered
						scroll={{ y: 350 }}
						className="mt20 pub-bordered table-vertical-top pub-table-thead bom-upload-table"
						rowClassName="pub-cursor-pointer"
					/>
				</div>
				{/* <div className="mt5 mb-10 pub-danger pub-text-right">Please map a column that has a Manufacturer Part Number or Quantity</div> */}

				<div className='ps-add-cart-footer'>
					<Button
						type="primary" ghost='true'
						className='login-page-login-btn ps-add-cart-footer-btn w150'
						onClick={() => {
							cancelModule?.()
							setIsShowTip(false)
						}}
					>{i18Translate('i18FunBtnText.Cancel', "Cancel")}</Button>
					<button
						type="submit" ghost='true'
						className='login-page-login-btn ps-add-cart-footer-btn custom-antd-primary w150'
						disabled={isDisabled}
						onClick={viewBom}
					>
						{isViewBom ? `${iView} BOM` : iUploadaList}
					</button>
				</div>

			</Modal>
		</div>
	)
}

export default MappingBomModal