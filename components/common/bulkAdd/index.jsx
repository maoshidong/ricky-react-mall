import { useState } from 'react';
import { Button, Input, Select, Table } from 'antd';
import { MinModalTip } from '~/components/ecomerce';
import Flex from '../flex';
import CustomInput from '../input';
import CustomInputNumber from '../inputNumber';
import { onlyNumber, onlyNumberPoint, uppercaseLetters } from '~/utilities/common-helpers';
import { getCurrencyInfo } from '~/repositories/Utils';
import useI18 from '~/hooks/useI18';
import styles from './_bulkAdd.module.scss'

import cloneDeep from 'lodash/cloneDeep';
import forEach from 'lodash/forEach';
import some from 'lodash/some';
import each from 'lodash/each';
import includes from 'lodash/includes';

const BulkAddCom = ({ onAddToList }) => {
	const { iPartNumber, iManufacturer, iQuantity, iTargetPrice, iBulkAdd, iUpload, iAddToList, iFIRST, iSECOND, iTHIRD, iSkip,
		iFOURTH, iFIFTH, iSIXTH, iSEVENTH, iEIGHTH, iNINTH, iCustomerReference, iAttrition, iQuantity1, iQuantity2, iQuantity3, limitTip,
		iSeparated, iTableSelect, iWarning, iRowTip, iCancel } =
		useI18();
	const currencyInfo = getCurrencyInfo();

	const [isBulk, setIsBulk] = useState(false); // 批量添加弹窗
	const [currentSelect, setCurrentSelect] = useState({}); // 存储对应的列
	const [curSetp, setCurStep] = useState(0);
	const [bulk, setBulk] = useState();
	const [tableList, setTableList] = useState([]);
	const [isMore300, setIsMore300] = useState(false);
	const [isShowTipModal, setIsShowTipModal] = useState(false);

	const options = [
		{ index: 0, tag: iFIRST, label: iPartNumber, value: 'PartNumber' },
		{ index: 1, tag: iSECOND, label: iManufacturer, value: 'Manufacturer' },
		{ index: 2, tag: iTHIRD, label: iQuantity, value: 'Quantity' },
		{ index: 3, tag: iFOURTH, label: iTargetPrice, value: 'TargetPrice' },
		{ index: 4, tag: iFIFTH, label: iCustomerReference, value: 'CustomerReference' },
		{ index: 5, tag: iSIXTH, label: iQuantity1, value: 'Quantity1' },
		{ index: 6, tag: iSEVENTH, label: iQuantity2, value: 'Quantity2' },
		{ index: 7, tag: iEIGHTH, label: iQuantity3, value: 'Quantity3' },
		{ index: 8, tag: iNINTH, label: iAttrition, value: 'Attrition%' },
	];

	// 批量添加弹窗
	const handleShowBulkAdd = () => {
		setIsBulk(true);
	};

	// 关闭弹窗，顺便清空一些数据
	const handleCancelClick = () => {
		setCurStep(0);
		setBulk();
		setCurrentSelect({});
		setTableList([]);
		setIsBulk(false);
	};

	// 下拉框选择
	const handleSelectChange = (v, index) => {
		const sList = cloneDeep(currentSelect);

		forEach(sList, (value, key) => {
			if (value === v) {
				sList[key] = undefined;
			}
		});

		sList[index] = v;
		setCurrentSelect(sList);
	};

	// 判断是否选择了PartNumber和Manufacturer
	const isExistPartNumberAndManu = () => {
		// 型号和数量是必填
		return !some(currentSelect, (value) => value === 'PartNumber') || !some(currentSelect, (value) => value === 'Quantity');
	};

	// 批量输入
	const handleTextChange = (e) => {
		setBulk(e.target.value);
	};

	// 点击上传按钮
	const handleUploadClick = () => {
		const _bulkList = cloneDeep(bulk);
		const multipleList = _bulkList.split('\n').map(line => line.replace(/\r$/, '')).filter(line => line.trim() !== '');
		let tbList = [];
		if (multipleList?.length > 0) {
			each(multipleList, (ml) => {
				const isTab = includes(ml, '\t'); // tab
				const isSpace = includes(ml, ' '); // 空格
				const isComma = includes(ml, ','); // 逗号
				let mples = ml.split('\t');
				if (isTab) {
					mples = ml.split('\t');
				} else if (isSpace) {
					mples = ml.split(' ');
				} else if (isComma) {
					mples = ml.split(',');
				}

				if (mples?.length > 0) {
					const _tbList = {
						[currentSelect[0]]: mples?.[0],
						[currentSelect[1]]: mples?.[1],
						[currentSelect[2]]: mples?.[2],
						[currentSelect[3]]: mples?.[3],
						[currentSelect[4]]: mples?.[4],
						[currentSelect[5]]: mples?.[5],
						[currentSelect[6]]: mples?.[6],
						[currentSelect[7]]: mples?.[7],
						[currentSelect[8]]: mples?.[8],
					};

					tbList.push(_tbList);
				}
			});
		}

		const lt = cloneDeep(tbList)
		const list = lt.slice(0, 300)
		if (tbList?.length > 300) {
			setIsShowTipModal(true)
			// 只取前300行的数据
			setIsMore300(true)
		} else {
			setIsMore300(false)
			setCurStep(curSetp + 1);
		}

		each(list, (tb) => {
			const quantity = isNaN(tb?.Quantity) ? null : tb?.Quantity;
			const targetPrice = isNaN(tb?.TargetPrice) ? null : tb?.TargetPrice;
			tb.Quantity = quantity;
			tb.TargetPrice = targetPrice;
			return tb;
		});

		setTableList(list);
	};

	const handleDoubleClick = (e) => {
		e.target.select();
	};

	// 删除某一行数据
	const handleRemoveRow = (rowIndex) => {
		const rows = tableList.filter((_item, index) => index !== rowIndex);
		setTableList(rows);
	};

	// 输入框change
	const partNumberChange = (value, index, key) => {
		const _tbList = cloneDeep(tableList);
		_tbList[index][key] = value;
		setTableList(_tbList);
	};

	const columns = [
		{
			title: 'Row',
			key: 'Row',
			width: 22,
			render: (_text, _record, index) => {
				return <div style={{ verticalAlign: 'middle', marginTop: '7px' }}>{index + 1}</div>;
			},
		},
		{
			title: iPartNumber,
			key: 'PartNumber',
			width: 130,
			render: (_text, record, index) => (
				<CustomInput
					className="form-control form-input pub-border w280"
					placeholder={iPartNumber}
					value={record?.PartNumber}
					onChange={(e) => partNumberChange(uppercaseLetters(e.target.value), index, 'PartNumber')}
				/>
			),
		},
		{
			title: iManufacturer,
			key: 'Manufacturer',
			width: 130,
			render: (_text, record, index) => (
				<CustomInput
					className="form-control form-input pub-border w280"
					type="text"
					placeholder={iManufacturer}
					value={record?.Manufacturer}
					onChange={(e) => partNumberChange(e.target.value, index, 'Manufacturer')}
				/>
			),
		},
		{
			title: iQuantity,
			dataIndex: 'Quantity',
			key: 'Quantity',
			width: 66,
			render: (_text, record, index) => (
				<CustomInputNumber
					className="form-control form-input pub-border w120"
					type="text"
					min={1}
					placeholder={iQuantity}
					value={record?.Quantity}
					onKeyPress={onlyNumber}
					onDoubleClick={handleDoubleClick}
					onChange={(e) => partNumberChange(e, index, 'Quantity')}
				/>
			),
		},
		{
			title: iTargetPrice,
			key: 'TargetPrice',
			width: 80,
			render: (_text, record, index) => (
				<CustomInputNumber
					prefix={currencyInfo.label}
					className="form-input w160"
					style={{ borderRadius: '6px' }}
					type="text"
					placeholder={iTargetPrice}
					value={record?.TargetPrice}
					controls={false}
					onKeyPress={onlyNumberPoint}
					onDoubleClick={handleDoubleClick}
					onChange={(e) => partNumberChange(e, index, 'TargetPrice')}
				/>
			),
		},
		{
			title: <div className="sprite-icon4-cart sprite-icon4-cart-3-7 sprite-icon4-cart-3-6 ml14" />,
			key: 'ExtendedPrice',
			align: 'right',
			verticalAlign: 'middle',
			className: 'pub-table-vertical-align-middle',
			width: 20,
			render: (_text, _record, index) => (
				<div style={{ verticalAlign: 'middle' }}>
					<div className="sprite-icon4-cart sprite-icon4-cart-3-6 mt10 ml14" onClick={() => handleRemoveRow(index)} />
				</div>
			),
		},
	];

	// 添加part list中
	const handleAddToList = () => {
		// 只存型号不为空的
		onAddToList(tableList?.slice(0, 300)?.filter(i => i?.PartNumber));
		handleCancelClick();
	};

	const handleComfirm = () => {
		setIsShowTipModal(false)
		setCurStep(curSetp + 1);
	};

	return (
		<>
			<Button type="submit" ghost onClick={handleShowBulkAdd}>
				{iBulkAdd}
			</Button>

			{isShowTipModal && (
				<MinModalTip
					isShowTipModal={isShowTipModal}
					tipTitle={iWarning}
					tipText={iRowTip}
					cancelText={iCancel}
					width={568}
					handleOk={handleComfirm}
					onCancel={() => setIsShowTipModal(false)}
				/>
			)}

			<MinModalTip
				width={1200}
				tipTitle={iBulkAdd}
				isShowTipModal={isBulk}
				isChildrenTip={true}
				onCancel={handleCancelClick}
				showCancel={false}
				maskClosable={false}
				footerOk={
					<Flex gap={10}>
						{curSetp === 0 ? (
							<Button type="submit" className='custom-antd-primary w100' ghost disabled={!bulk || isExistPartNumberAndManu()} onClick={handleUploadClick}>
								{iUpload}
							</Button>
						) : (
							<Button type="primary" className='login-page-login-btn ps-add-cart-footer-btn w100' ghost onClick={() => setCurStep(0)}>
								{iCancel}
							</Button>
						)}
						<Button type="submit" className='custom-antd-primary w100' ghost disabled={curSetp === 0} onClick={handleAddToList}>
							{iAddToList}
						</Button>
					</Flex>
				}
			>
				<Flex column gap={10}>
					<p>{iSeparated}</p>
					{curSetp === 0 ? (
						<>
							<Flex gap={10} className={styles.divScroll}>
								{options.map((op, index) => (
									<Flex key={op.tag} column gap={8} className={styles.divSelectContainer}>
										<p>{`${index + 1}. `}{op.tag}</p>
										<div>
											<Select
												className="w120"
												placeholder={iTableSelect}
												options={[{ index: -1, tag: iSkip, label: iSkip, value: 'Skip' }, ...options?.slice(0, 4)]}
												value={currentSelect[op.index] != 'undefined' ? currentSelect[op.index] : undefined}
												onChange={(v) => handleSelectChange(v, op.index)}
											// getPopupContainer={(trigger) => trigger.parentNode}
											/>
										</div>
									</Flex>
								))}
							</Flex>

							<Input.TextArea value={bulk} placeholder="BSS138	onsemi	1000	0.0321" style={{ height: '300px', cursor: 'unset' }} onChange={handleTextChange} />
						</>
					) : (
						<>
							{/* {isMore300 && <div className="pub-font13 pub-danger">{limitTip}</div>} */}
							<Flex column width="100%" style={{ height: '375px' }} className="modal-matched-part custom-antd-btn-more">
								<Table
									size="small"
									columns={columns}
									dataSource={tableList}
									pagination={false}
									style={{ width: '100%', height: '375px' }}
									bordered
									scroll={{ y: tableList?.length > 6 ? 333 : null }}
									className="pub-table-vertical-align-top pub-border-table table-vertical-top"
									rowClassName="pub-cursor-pointer"
								/>
							</Flex>
						</>
					)}
				</Flex>
			</MinModalTip>
		</>
	);
};

export default BulkAddCom;
