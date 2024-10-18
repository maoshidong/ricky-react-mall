import React, { useState, useEffect, useMemo, useContext } from 'react';
import { connect } from 'react-redux';
import { Radio, Table } from 'antd';

import ShopCartContext from '~/utilities/shopCartContext';
import { TABLE_COLUMN } from '~/utilities/constant';
import AddressModal from '~/components/partials/account/modules/AddressModal';
import useLanguage from '~/hooks/useLanguage';
import noop from 'lodash/noop';
import OrderRepository from '~/repositories/zqx/OrderRepository';

const BuySelectAddress = ({
	addressList,
	selectAddress, // 当前选中的账号地址
	type, countryList, orderTypeList,
	shippingCallback, billCallback, onSubmit = noop()
}) => {
	const { i18Translate, getDomainsData, curLanguageCodeZh } = useLanguage();
	const memoizedAddressList = useMemo(() => addressList, [addressList]);
	const { updateIsAccountShippingAddress, updateIsAccountBillingAddress } = useContext(ShopCartContext);
	const [isShowModal, setIsShowModal] = useState(false); // 地址弹窗
	const [currentRecord, setCurrentRecord] = useState({});
	const [allCountryList, setAllCountryList] = useState(countryList || []); // 全部国家列表

	// 国家列表
	const getCountryList = async () => {
		const res = await OrderRepository.getApiCountryList('', getDomainsData()?.defaultLocale);
		if (res.code == 0) {
			setAllCountryList(res.data?.data);
		}
	}

	useEffect(() => {
		setAllCountryList(countryList)
		if (countryList?.length === 0) {
			getCountryList()
		}
	}, [countryList])

	const addressChange = (e) => {
		const curAddress = addressList.find((i) => i?.id === e?.id);

		if (type === 'shipping') {
			shippingCallback(curAddress);
		} else {
			billCallback(curAddress);
		}
	};

	// 添加地址
	const handAddAddress = (e) => {
		e.preventDefault();
		setIsShowModal(true);
		setCurrentRecord({});
	};

	// 点击编辑
	const handleEdit = (e, record) => {
		e.preventDefault();
		setIsShowModal(true);
		setCurrentRecord(record || {});
	};

	// 提交地址
	const handleSubmit = () => {
		setIsShowModal(false);
		onSubmit?.();
		updateIsAccountShippingAddress();
		updateIsAccountBillingAddress();
	};

	const iSelect = i18Translate('i18PubliceTable.Select', TABLE_COLUMN.select);
	const iName = i18Translate('i18OrderAddress.Name', 'Contact Name');
	const iCountry = i18Translate('i18OrderAddress.Country', 'Country');
	const iCity = i18Translate('i18OrderAddress.City', 'City');
	const iTelephone = i18Translate('i18OrderAddress.Telephone', 'Telephone');
	const iAddress = i18Translate('i18MyCart.Address', 'Address');
	const iEdit = i18Translate('i18OrderAddress.Edit', 'Edit');
	const iAddAddress = i18Translate('i18OrderAddress.Add Address', 'Add Address');
	const iPostalCode = i18Translate('i18OrderAddress.Postal Code', 'Postal Code');

	const columns = [
		{
			title: iSelect,
			dataIndex: 'Select',
			width: TABLE_COLUMN.selectWidth,
			render: (text, row) => {
				return (
					<div className="pub-flex-align-center">
						<Radio className="ml7" checked={row.id == selectAddress?.id}></Radio>
					</div>
				);
			},
		},
		{
			title: iName,
			dataIndex: 'name',
			width: 160,
			render: (text, row) => {
				return (
					<div className="pub-flex-align-center">
						{!curLanguageCodeZh() && row?.lastName} {row?.firstName}
					</div>
				);
			},
		},
		{
			title: iTelephone,
			dataIndex: 'phone',
			width: 130,
			render: (text) => <div className="pub-flex-align-center">{text}</div>,
		},

		{
			title: iAddress,
			dataIndex: 'Address',
			render: (text, row) => (
				<div className="pub-flex-align-center">
					{row?.addressLine1}, {row?.addressLine2}
				</div>
			),
		},
		{
			title: iCountry,
			dataIndex: 'Country',
			width: 160,
			render: (text, row) => <div className="pub-flex-align-center">{allCountryList?.find((item) => item?.id == row?.addressId)?.name}</div>,
		},
		{
			title: iCity,
			dataIndex: 'city',
			width: 120,
			render: (text, row) => <div className="pub-flex-align-center">{text}</div>,
		},

		{
			title: iPostalCode,
			dataIndex: 'PostalCode',
			render: (text, row) => <div className="pub-flex-align-center">{row?.postalCode}</div>,
		},
		{
			title: iEdit,
			dataIndex: 'Edit',
			width: 60,
			align: 'center',
			render: (text, row) => (
				<div style={{ display: 'flex', justifyContent: 'center', marginLeft: '7px' }}>
					<div className="sprite-account-icons-2-1 select-address-item-edit pub-flex-align-center" onClick={(e) => handleEdit(e, row)}></div>
				</div>
			),
		},
		// {
		//     title: 'Operation',
		//     dataIndex: 'Operation',
		//     width: 100,
		//     render: (text, record) =>
		//         {
		//             const elm = record?.isDefault ? <span className='pub-primary-tag'>Default</span> : ''
		//             return elm
		//         },
		// },
	];

	return (
		<div>
			{/* <Radio.Group className='percentW100' value={selectAddress?.id} onChange={addressChange}> */}
			<div className="buy-select-address">
				<Table
					size="small"
					pagination={false}
					columns={columns}
					rowKey={(record) => record.id}
					dataSource={memoizedAddressList}
					className="pub-border-table"
					rowClassName="pub-cursor-pointer"
					onRow={(record) => {
						return {
							onClick: (e) => {
								addressChange(record);
							}, // 点击行
						};
					}}
					scroll={memoizedAddressList?.length > 0 ? { x: 750 } : {}}
				/>
			</div>

			<div className="mt5 mb13 pub-color-link w100" onClick={(e) => handAddAddress(e)}>
				{iAddAddress}
			</div>

			{isShowModal && (
				<AddressModal
					visible={isShowModal}
					orderTypeList={orderTypeList}
					handleCancel={() => setIsShowModal(false)}
					handleSubmit={() => handleSubmit()}
					otherParams={{
						type,
						currentRecord,
						addressList: memoizedAddressList,
					}}
				/>
			)}
		</div>
	);
};

export default connect((state) => state)(BuySelectAddress);