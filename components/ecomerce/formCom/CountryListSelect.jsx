import React, { useState, useEffect } from 'react';
import OrderRepository from '~/repositories/zqx/OrderRepository';
import { Form, Select } from 'antd';
import useLanguage from '~/hooks/useLanguage';

// 新国家-检查，不需要就删除
const CountryListSelect = ({ countyId, countyChange }) => {
	const { i18Translate, getDomainsData } = useLanguage();
	const iCountry = i18Translate('i18OrderAddress.Country', 'Country');

	const [loading, setLoading] = useState(false); // 国家搜索加载状态
	const [countyList, setCountyList] = useState([]);

	const getCountyList = async (keyWord) => {
		setLoading(true);
		const res = await OrderRepository.getApiCountryList(keyWord, getDomainsData()?.defaultLocale);
		setLoading(false);
		if (res.code == 0) {
			res?.data?.data?.map((item) => {
				const { id, name } = item;
				item.value = id;
				item.label = name;
				item.addressCode = id;
			});
			setCountyList(res?.data?.data);
		}
	};

	const handleSearch = (keyWord) => {
		getCountyList(keyWord);
	};

	useEffect(() => {
		getCountyList();
	}, []);
	useEffect(() => {
		setCountyList([]);
	}, [countyId, provinceId]);
	// if(countyList?.length === 0) return null
	return (
		<Form.Item
			name="countyId"
			rules={[
				{
					required: true,
					message: 'Required',
				},
			]}
		>
			<div className="pub-custom-select">
				<Select
					showSearch
					filterOption={false} // 禁用了 Select 默认的前端筛选功能。
					className={'w260 ' + (countyId ? 'select-have-val' : '')}
					onChange={(e) => countyChange(e)}
					onSelect={() => getCountyList('')}
					onSearch={handleSearch}
					loading={loading}
					value={countyId} // 使用 value 属性设置选中的值
					options={countyList}
					getPopupContainer={(trigger) => trigger.parentNode}
				></Select>
				<div className="pub-custom-input-holder pub-input-required">{iCountry}</div>
			</div>
		</Form.Item>
	);
};

export default CountryListSelect
