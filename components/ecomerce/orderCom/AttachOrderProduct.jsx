import React, { useState, useEffect } from 'react';
import { Button, Table } from 'antd';
import useLanguage from '~/hooks/useLanguage';
import MinModalTip from '~/components/ecomerce/minCom/MinModalTip'; // 公共提示
import { useCookies } from 'react-cookie';
import { handleMomentTime } from '~/utilities/common-helpers';
import MinAddMoreCart from '~/components/ecomerce/minCom/MinAddMoreCart'; // 添加多个购物车按钮
import FloatButtons from '~/components/ecomerce/modules/FloatButtons';
import { getCurrencyInfo } from '~/repositories/Utils';

// 多订单产品公共组件
const AttachOrderProductCom = (props) => {
	const { i18Translate } = useLanguage();
	const iAddNewOrder = i18Translate('i18AboutOrder.Add New Order', 'Add New Order');

	const { order } = props;

	const { attachProductList = [] } = order || {};

	const [isShowModal, setIsShowModal] = useState(true);
	const [cookies] = useCookies(['account']);

	const [selectedRows, setSelectedRows] = useState([]); // 勾选中的数据
	const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 勾选中的keys

	// 没有未支付的就不展示按钮
	let arr = [];
	attachProductList?.map((item) => {
		// status: 2 已支付
		if (item?.status !== 2) {
			arr.push(item);
		}
	});

	if (arr?.length === 0) return null;

	// 更新勾选中的数据
	const updateSelData = (arr) => {
		setSelectedRows(arr);
		setSelectedRowKeys(arr?.map((item) => item?.id));
	};

	// 默认选中没支付的
	useEffect(() => {
		let arr = [];
		attachProductList?.map((item) => {
			if (item?.status !== 2) {
				arr.push(item);
			}
		});
		updateSelData(arr);
	}, [attachProductList]);
	const currencyInfo = getCurrencyInfo();

	const viewBankCopy = () => {
		// 上传有数据才直接打开
		if (order?.attachProductList?.length > 0) {
			setIsShowModal(true);
		}
	};

	const bankCopyBtn = () => {
		return (
			<Button type="primary" ghost="true" className="login-page-login-btn ps-add-cart-footer-btn custom-antd-primary" onClick={viewBankCopy}>
				<div className="pub-flex-center">
					<div>{iAddNewOrder}</div>
				</div>
			</Button>
		);
	};

	// 勾选
	const rowSelection = {
		// columnTitle: <div>{iSelect}</div>,
		columnWidth: '60px', // 设置行选择列的宽度为
		selectedRowKeys, // 选中的key集合
		onChange: (selectedRowKeys, selectedRow) => {
			const params = selectedRow?.map((i) => {
				return {
					...i,
				};
			});
			setSelectedRows(params);
			setSelectedRowKeys(arr); // 选中的key集合
		},
		getCheckboxProps: (record) => ({
			disabled: record?.status === 2,
		}),
	};

	const iPartNumber = i18Translate('i18PubliceTable.PartNumber', 'Part Number');
	const iManufacturer = i18Translate('i18PubliceTable.Manufacturer', 'Manufacturer');

	const iQuantity = i18Translate('i18PubliceTable.Quantity', 'Quantity');
	const iUnitPrice = i18Translate('i18PubliceTable.UnitPrice', 'Unit Price');
	const iLeadtime = i18Translate('i18MyAccount.Lead time', 'Lead time');
	const iRemark = i18Translate('i18Form.Remark', 'Remark');

	const columns = [
		{
			title: iPartNumber,
			dataIndex: 'partNum',
			key: 'exppartNum',
			// width: 180,
			render: (text, record) => <div style={{ minWidth: '140px', maxWidth: '220px' }}>{record?.partNum}</div>,
		},
		{
			title: iManufacturer,
			dataIndex: 'manufacturer',
			key: 'expmanufacturer',
			render: (text, record) => <div style={{ minWidth: '120px', maxWidth: '160px' }}>{record?.manufacturer}</div>,
		},
		//   {
		//     title: iPackage,
		//     dataIndex: 'packaging',
		//     key: 'wxpexppackage',
		//     render: (text, record) => (
		//       <div className="pub-direction-column">{text}</div>
		//     ),
		//   },
		//   {
		//     title: iDC,
		//     dataIndex: 'dc',
		//     key: 'expdc',
		//     render: (text, record) => (
		//       <div className="pub-direction-column">{text}</div>
		//     ),
		//   },
		//   {
		//     title: iRohs,
		//     dataIndex: 'rohs',
		//     key: 'expRohs',
		//     render: (text, record) => (
		//       <div className="pub-direction-column">{text ? 'Rohs' : ''}</div>
		//     ),
		//   },
		{
			title: iQuantity,
			dataIndex: 'quantity',
			key: 'expQuantity',
			// width: 70,
			render: (text, record) => <div className="pub-direction-column">{text}</div>,
		},
		{
			title: `${iUnitPrice} (${currencyInfo.value})`,
			dataIndex: 'price',
			key: 'expprice',
			// width: 120,
			render: (text, record) => (
				<div style={{ minWidth: '110px' }} className="pub-direction-column">
					{currencyInfo.label}
					{text}
				</div>
			),
		},
		{
			title: iLeadtime,
			dataIndex: 'leadTime',
			key: 'expLead time ',
			width: 110,
			render: (text, record) => <div className="pub-direction-column">{handleMomentTime(record?.applyTime)}</div>,
		},
		{
			title: iRemark,
			key: 'remark',
			dataIndex: 'remark',
			rowKey: 'expremark',
			render: (text, record) => <div className="w150">{text}</div>,
		},
	];
	// 点击表格行
	const handleRowClick = (record) => {
		if (record?.status === 2) return; // disabled 点击无效
		// 勾选的key列表
		const newSelectedRowKeys = [...selectedRowKeys];
		if (newSelectedRowKeys.includes(record.id)) {
			newSelectedRowKeys.splice(newSelectedRowKeys.indexOf(record.id), 1);
		} else {
			newSelectedRowKeys.push(record.id);
		}

		setSelectedRowKeys(newSelectedRowKeys);

		// 勾选的列表数据
		const index = selectedRows.findIndex((row) => row.id === record.id);
		let newSelectedRows = [...selectedRows];
		if (index > -1) {
			// 如果已经选中，则取消勾选
			newSelectedRows.splice(index, 1);
		} else {
			// 如果未选中，则勾选
			newSelectedRows.push(record);
		}
		setSelectedRows(newSelectedRows);
	};

	return (
		<div className="custom-antd-btn-more">
			{bankCopyBtn()}
			{isShowModal && (
				<MinModalTip
					isShowTipModal={isShowModal}
					width={1100}
					tipTitle={iAddNewOrder}
					isChildrenTip={true}
					className="custom-antd-btn-more"
					// submitText={i18Translate('i18FunBtnText.AddToCart', "Add to Cart")}
					onCancel={() => setIsShowModal(false)}
					handleOk={() => setIsShowModal(false)}
					showHandleOk={false}
				>
					<div className="modal-matched-part custom-antd-btn-more">
						<Table
							size="small"
							columns={columns}
							rowSelection={{
								...rowSelection,
							}}
							dataSource={order?.attachProductList}
							rowKey={(record) => record?.id}
							pagination={false}
							// bordered reset-table-row
							rowClassName="pub-cursor-pointer"
							className="pub-border-table mt15 table-vertical-top"
							scroll={
								order?.attachProductList?.length > 5
									? {
											y: 400,
											x: 100,
									  }
									: {
											x: 1000,
									  }
							}
							onRow={(record, rowIndex) => ({
								onClick: () => {
									handleRowClick(record, rowIndex);
								},
							})}
							// style={{maxHeight: '400px', overflowY: 'scroll'}}
						/>
						<div style={{ height: '52px' }}>
							<FloatButtons isShow={selectedRows?.length>0}>
								{selectedRows.length !== 0 && (
									<MinAddMoreCart
										selectedRows={selectedRows}
										otherParams={{
											initIsCartView: false,
											widthClass: 'w120',
											type: 3, // 默认1, 报价2, 多订单3
										}}
									/>
								)}
							</FloatButtons>
						</div>
						{/* <div className="ps-add-cart-footer custom-antd-btn-more"  onClick={cancelModule} style={{float:'none'}}>
                                {
                                    productTotal > 20 && <Link href={`${PRODUCTS}?keywords=${encrypt(modalData?.PartNumber)}` + "&results=" + productTotal }>
                                        <a>
                                            <Button
                                                type="primary" ghost
                                                className='ps-add-cart-footer-btny w150'
                                                onClick={getMore}
                                            >{iMore}</Button>
                                        </a>     
                                    </Link>
                                }

                                <Button
                                    type="primary" ghost
                                    className='ps-add-cart-footer-btn custom-antd-primary'
                                >{i18Translate('i18FunBtnText.Cancel', 'Cancel')}</Button>
                        </div> */}
					</div>
				</MinModalTip>
			)}
		</div>
	);
};

export default AttachOrderProductCom