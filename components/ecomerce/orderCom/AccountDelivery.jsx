
import { useEffect, useState } from 'react';
import { Table, Radio } from 'antd';
import FreighAccountsEdit from '~/components/partials/account/modules/FreighAccountsEdit';
import useLanguage from '~/hooks/useLanguage';
import { TABLE_COLUMN } from '~/utilities/constant';
import OrderRepository from '~/repositories/zqx/OrderRepository';
import noop from 'lodash/noop';

const ShippingMethodWidth = 300;
const AccountWidth = 200;
// 账号运输方式
const AccountDelivery = ({
	accountDeliveryList,
	cutDeliList = [],
	isShowIncoterms = true,
	style = {},
	wayId = '',
	onCreateFinished = noop(),
	onSelectShippingAccount = noop(),
}) => {
	const { i18Translate } = useLanguage();
	const iSelect = i18Translate('i18PubliceTable.Select', TABLE_COLUMN.select);
	const iIncoterms = i18Translate('i18ResourcePages.Incoterms', 'Incoterms');
	const iShippingType = i18Translate('i18AboutOrder2.Shipping Type', 'Shipping Type');
	const iAccount = i18Translate('i18AboutOrder2.Account', 'Account');
	const iRemark = i18Translate('i18Form.Remark', 'Remark');
	const iAddAnAccount = i18Translate('i18AboutOrder2.Add an Account', 'Add an Account');
	const iOther = i18Translate('i18SmallText.Other', 'Other');

	const [visible, setVisible] = useState(false);
	const [shippingWayId, setShippingWayId] = useState(wayId);
	const [custDeliveryList, setCustDeliveryList] = useState(cutDeliList); // 管理端自定义的账号运输方式

	useEffect(() => {
		if (cutDeliList?.length === 0) {
			getShippingDeliveryList();
		}
		if (wayId) {
			setShippingWayId(wayId);
		}
	}, [wayId]);

	// 动态列，根据isShowIncoterms 是否展示, .com暂时没有
	const incoterms = {
		title: iIncoterms,
		dataIndex: 'incoterms',
		render: () => <>FOB HK</>,
	};

	// 表格列
	const shippingColumns = [
		{
			title: iSelect,
			dataIndex: 'select',
			width: TABLE_COLUMN.selectWidth,
			render: (_text, row) => {
				return (
					<div className="pub-flex-align-center">
						<Radio className="ml7" checked={row.id == shippingWayId}></Radio>
					</div>
				);
			},
		},
		{
			title: iShippingType,
			dataIndex: 'shippingType',
			width: ShippingMethodWidth,
			render: (_text, row) => {
				return <div className="pub-flex-align-center">{custDeliveryList.find((i) => i?.value == row?.shippingType)?.label || iOther} #</div>;
			},
		},
		{
			title: iAccount,
			dataIndex: 'AccountWidth',
			width: AccountWidth,
			render: (_text, row) => {
				return <div className="pub-flex-align-center">{row?.account}</div>;
			},
		},
		{
			title: iRemark,
			dataIndex: 'remark',
			render: (text) => <div className="pub-flex-align-center">{text}</div>,
		},
	];

	if (isShowIncoterms) {
		shippingColumns.splice(3, 0, incoterms);
	}

	// 创建账号配送方式弹窗
	const handleAddCourierAccountClick = () => {
		setVisible(true);
	};

	// 创建提交账号
	const HandleSubmitClick = () => {
		setVisible(false);
		onCreateFinished();
	};

	// 选中Shipping Method，Courier Account
	const customerAccountRadioChange = (record) => {
		setShippingWayId(record?.id);
		onSelectShippingAccount(record);
	};

	// 我们管理后台设置的运输方式
	const getShippingDeliveryList = async () => {
		const res = await OrderRepository.getDictList('sys_custom_shipping_delivery');
		res.data.map((item) => {
			item.value = item.dictCode + '';
			item.label = item.dictValue;
		});
		setCustDeliveryList([...res.data, { dictCode: 0, dictValue: 'Other', value: 0, label: iOther }]);
	};

	return (
		<div className="mt15 col-sm-12" style={style}>
			<>
				<Table
					size="small"
					pagination={false}
					columns={shippingColumns}
					rowKey={(record) => record.id}
					dataSource={accountDeliveryList}
					className="pub-border-table"
					rowClassName="pub-cursor-pointer"
					onRow={(record) => {
						return {
							onClick: () => {
								customerAccountRadioChange(record);
							},
						};
					}}
					scroll={accountDeliveryList?.length > 0 ? { x: 550 } : null}
				/>

				<div className="mt10 pub-color-link w120" onClick={handleAddCourierAccountClick}>
					{iAddAnAccount}
				</div>
			</>

			{visible && (
				<FreighAccountsEdit
					visible={visible}
					handleCancel={() => setVisible(false)}
					handleSubmit={HandleSubmitClick}
					otherParams={{
						custDeliveryList,
						list: accountDeliveryList,
					}}
				/>
			)}
		</div>
	);
};

export default AccountDelivery;
