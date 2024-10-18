import { Table } from 'antd';
import { toFixedFun } from '~/utilities/ecomerce-helpers';
import useLanguage from '~/hooks/useLanguage';
import { getCurrencyInfo } from '~/repositories/Utils';

const MinTableStandardPriceCom = (props) => {
	const { i18Translate } = useLanguage();
	const iQuantity = i18Translate('i18PubliceTable.Quantity', 'QTY');
	const iUnitPrice = i18Translate('i18PubliceTable.UnitPrice', 'UNIT PRICE');
	const iExtPrice = i18Translate('i18PubliceTable.ExtPrice', 'EXT PRICE');
	const iStandardPrice = i18Translate('i18MyCart.Standard Price', 'Standard Price');

	const currencyInfo = getCurrencyInfo();
	const { pricesList, cartQuantity } = props;

	const columns = [
		{
			title: iQuantity,
			dataIndex: 'ExtPrice',
			key: 'ExtPrice',
			width: 70,
			render: (text, record) => {
				return (
					<span className="">
						<div className="pub-color555">{record?.quantity}+</div>
					</span>
				);
			},
		},
		{
			title: iUnitPrice,
			dataIndex: 'ExtPrice',
			key: 'ExtPrice',
			width: 80,
			render: (text, record) => (
				<span className="pub-color555">
					{currencyInfo.label}
					{record?.unitPrice}
				</span>
			),
		},
		{
			title: iExtPrice,
			dataIndex: 'ExtPrice',
			key: 'ExtPrice',
			width: 90,
			align: 'right',
			render: (text, record) => (
				<span className="pub-color555">
					{currencyInfo.label}
					{toFixedFun(record?.unitPrice || 0, 2)}
				</span>
			),
		},
	];

	// 返回行的类名
	const getRowClassName = (record, index) => {
		let currentPriceId = 0;

		pricesList?.forEach((item) => {
			if (item?.quantity <= cartQuantity) {
				currentPriceId = item?.id;
			}
		});
		// return currentPriceId === priceId ? { background: '#fafafa' } : {};
		return currentPriceId === record?.id ? 'ant-table-cell standard-price-cur' : 'ant-table-cell';

		// if (record?.id === 0) {
		//     return 'first-row'; // 设置第一行的类名
		// }
		// return '';
	};

	return (
		<div className="standard-price modal-matched-part custom-antd-btn-more">
			<div className="pub-font16">{iStandardPrice}</div>

			<Table
				size="small"
				columns={columns}
				dataSource={pricesList}
				className="pub-border-table mt10"
				rowKey={(record) => record.id}
				// rowClassName='reset-table-row'
				// className="reset-table"
				// rowKey={record => record.productId}
				rowClassName={getRowClassName}
				pagination={false}
			/>
		</div>
	);
};

export default MinTableStandardPriceCom;