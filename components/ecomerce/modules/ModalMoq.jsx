import React from 'react';
import { Modal, Table, Radio, Button } from 'antd';
import { TABLE_COLUMN } from '~/utilities/constant';
import MinTableProductDetail from '~/components/ecomerce/minTableCom/MinTableProductDetail';
import { calculateTargetPriceTotal, calculateItemPriceTotal, toFixedFun } from '~/utilities/ecomerce-helpers';
import useLanguage from '~/hooks/useLanguage';
import { getCurrencyInfo } from '~/repositories/Utils';

// 最小订货量
/**
 **currentCart 当前操作的型号数据
 **/
const ModalMoq = ({ isShowModal, closeModalMoq, currentCart, dataSource = [] }) => {
	const { i18Translate } = useLanguage();
	const iCartMoqTit = i18Translate('i18MyCart.CartMoqTit', 'QUANTITY UNAVAILABLE');
	const iCartMoqDes = i18Translate('i18MyCart.CartMoqDes', 'Your entry does not meet the minimum order quantity.');
	const iCartMoqChildTit = i18Translate('i18MyCart.CartMoqChildTit', 'Valid options are');
	const iYouSelected = i18Translate('i18MyCart.You Selected', 'You Selected');
	const iQuantity = i18Translate('i18PubliceTable.Quantity', 'Quantity');
	const iProductDetail = i18Translate('i18PubliceTable.Product Detail', TABLE_COLUMN.productDetail);
	const iUnitPrice = i18Translate('i18PubliceTable.UnitPrice', TABLE_COLUMN.unitPrice);
	const iExtPrice = i18Translate('i18PubliceTable.ExtPrice', 'Ext. Price');
	const iCancel = i18Translate('i18FunBtnText.Cancel', 'Cancel');
	const iUpdate = i18Translate('i18FunBtnText.Update', 'Update');
	const currencyInfo = getCurrencyInfo();
	// isUpdate  是否更新最小订货量
	const closeModal = (isUpdate = true) => {
		const params = dataSource?.map((item) => {
			return {
				productId: item?.productId,
				cartQuantity: item?.pricesList?.[0]?.quantity || 1,
				callBackId: currentCart?.callBackId || null, // 报价callBackId
			};
		});
		closeModalMoq(params, currentCart?.callBackId ? 2 : 1, isUpdate);
	};

	const columns = [
		{
			title: '',
			dataIndex: 'Select',
			width: TABLE_COLUMN.selectWidth,
			render: () => {
				return (
					<div className="pub-flex-align-center">
						<Radio className="ml7" checked={true}></Radio>
					</div>
				);
			},
		},
		{
			title: iQuantity,
			dataIndex: 'cartQuantity',
			width: 80,
			render: (_text, row) => {
				return <div className="pub-flex-align-center">{row?.pricesList?.[0]?.quantity}</div>;
			},
		},
		{
			title: iProductDetail,
			key: 'productDetail',
			dataIndex: 'productDetail',
			rowKey: 'productDetail',
			render: (_text, record) => <MinTableProductDetail record={record} showCustomerReference={false} />,
		},
		{
			title: iUnitPrice,
			dataIndex: 'UnitPrice',
			key: 'UnitPrice',
			width: 150,
			render: (_text, record) => (
				<>
					{currencyInfo.label}
					{toFixedFun(calculateTargetPriceTotal(record) || 0, 4)}
				</>
			),
		},
		{
			title: iExtPrice,
			dataIndex: 'ExtendedPrice',
			key: 'ExtendedPrice',
			width: 110,
			render: (_text, record) => (
				<>
					{currencyInfo.label}
					{toFixedFun(calculateItemPriceTotal(record, record.cartQuantity) || 0, 2)}
				</>
			),
		},
	];

	return (
		<div className="quote-bom-page upload-box ">
			<Modal
				title={iCartMoqTit}
				centered
				open={isShowModal}
				footer={null}
				onCancel={() => closeModal(false)}
				className="pub-border custom-antd-btn-more "
				style={{ minWidth: 750 }}
				maskClosable={false}
				closeIcon={<i className="icon icon-cross2"></i>}
			>
				{currentCart?.productName && (
					<>
						<div className="pub-font14 pub-fontw">{iYouSelected}:</div>
						<div>
							<span>{currentCart?.cartQuantity}</span>
							<span className="ml20">{currentCart?.productName}</span>
							{/* currentCart?.description */}
							<span className="ml20">{currentCart?.manufacturerName}</span>
						</div>
					</>
				)}

				<div className="mt10">{iCartMoqDes}</div>

				<div className="mt10 pub-font14 pub-fontw">{iCartMoqChildTit}:</div>
				<Table
					size="small"
					pagination={false}
					columns={columns}
					rowKey={(record) => record?.productId}
					dataSource={dataSource}
					className="mt8 pub-border-table "
					rowClassName="pub-cursor-pointer"
					// style={{ maxHeight: '400px', overflow: 'auto' }} // heightOverflowY300
					// onRow={(record) => {
					//     return {
					//       onClick: (e) => { addressChange(record) }, // 点击行
					//     };
					// }}
					scroll={dataSource?.length > 0 ? { x: 400, y: 300 } : null}
				/>

				<div className="ps-add-cart-footer">
					<Button type="primary" ghost="true" className="login-page-login-btn ps-add-cart-footer-btn w150" onClick={() => closeModal(true)}>
						{iCancel}
					</Button>
					<Button
						type="submit" ghost="true"
						className="login-page-login-btn ps-add-cart-footer-btn custom-antd-primary w150" onClick={() => closeModal(true)}
					>
						{iUpdate}
					</Button>
				</div>
			</Modal>
		</div>
	);
};

export default ModalMoq