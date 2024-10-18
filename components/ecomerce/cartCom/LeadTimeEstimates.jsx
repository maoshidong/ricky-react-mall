import { Button, Modal, Table } from 'antd';
import useLanguage from '~/hooks/useLanguage';
import dayjs from 'dayjs';

//   // 使用示例
//   const today = new Date(); // 当前日期
//   const thirtyDaysLater = getDateAfterDays(today); // 30天后的日期
const LeadTimeEstimates = (props) => {
	const { i18Translate } = useLanguage();
	const iLeadTimeEstimates = i18Translate('i18MyCart.Lead Time Estimates', 'Lead Time Estimates');
	const iQuantityExpected = i18Translate('i18MyCart.Quantity Expected', 'Quantity Expected');
	const iFactoryLeadTime = i18Translate('i18MyCart.Factory Lead Time', 'Factory Lead Time');
	// const iDeliveryDatePastDue = i18Translate('i18MyCart.Delivery Date Past Due', 'Delivery Date Past Due')
	const iLeadTimeTip = i18Translate('i18MyCart.LeadTimeTip', 'Ship dates are approximate and subject to change.');
	const iCancel = i18Translate('i18FunBtnText.Cancel', 'Cancel');

	const { paramMap, record = {}, isShoeModal, onCancel } = props;

	const getDateAfterDays = (numDays) => {
		const newDate = new Date();
		newDate.setDate(newDate.getDate() + Number(numDays));
		return newDate;
	};

	const columns = [
		{
			title: iQuantityExpected,
			dataIndex: 'ExtPrice',
			key: 'ExtPrice',
			width: 210,
			render: (text, record) => {
				const { cartQuantity, quantity, storageQuantity } = record;
				const num = Math.abs(Number(quantity - (cartQuantity || storageQuantity)));
				return (
					<span className="">
						<div className="pub-color555">
							{/* 区分购物车内的计算和订单内的计算 cartQuantity || storageQuantity */}
							{num > 0 ? num : quantity}
						</div>
					</span>
				);
			},
		},
		{
			title: iFactoryLeadTime,
			dataIndex: 'sendDate',
			key: 'sendDate',
			render: (text, record) => (
				<span className="pub-color555">
					{/* '1 Jul, 2024' */}
					{record?.sendDate ? dayjs(record?.sendDate).format('DD MMMM, YYYY') : dayjs(getDateAfterDays(paramMap?.sendDate)).format('DD MMMM, YYYY')}
				</span>
			),
		},
	];
	// 计算可发货数量 因订单立即出货和延期出货分离，这个提示就不要了
	// const getQuantity = () => {
	//     const { storageQuantity, cartQuantity, quantity } = record
	//     // 是否延期, 有storageQuantity说明是在详情, 加上0是因为订单详情还没有发货是否发货字段
	//     const num = storageQuantity || cartQuantity || 0

	//     return record?.sendDate ? 0 : (num > quantity ? quantity : num)

	// }

	return (
		<Modal
			centered
			open={isShoeModal}
			title={iLeadTimeEstimates}
			// open={removeModal}
			footer={null}
			onCancel={onCancel}
			className="pub-border"
			width={470}
			closeIcon={<i className="icon icon-cross2"></i>}
		>
			<div className="modal-matched-part custom-antd-btn-more">
				{/* <div>{getQuantity()} {iCanshipimmediately}</div> */}

				<Table
					size="small"
					columns={columns}
					dataSource={[record]}
					rowKey={(record) => record?.productId}
					pagination={false}
					rowClassName=""
					className="pub-border-table mt5 table-vertical-top"
				/>
				<div className="mt10 pub-color555">{iLeadTimeTip}</div>
				<div className="ps-add-cart-footer" onClick={onCancel} style={{ float: 'none' }}>
					<Button type="primary" ghost className="ps-add-cart-footer-btn">
						{iCancel}
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default LeadTimeEstimates;