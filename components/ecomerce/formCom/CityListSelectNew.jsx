import React, { useState, useEffect, useRef } from 'react';
import OrderRepository from '~/repositories/zqx/OrderRepository';
import { Form, Select } from 'antd';
import useLanguage from '~/hooks/useLanguage';
import map from 'lodash/map';

// 新城市选择
const CountryListSelect = ({ countyId, provinceId, cityChange, form }) => {
	const { i18Translate, getDomainsData } = useLanguage();

	const [loading, setLoading] = useState(false); // 国家搜索加载状态
	const selectCountryRef = useRef(null);
	const [countryList, setCountryList] = useState([]); // 城市list
	const [curItem, setCurItem] = useState({}); // 存储当前选中的城市对象

	// 获取国家列表数据
	const getCountyList = async (keyword) => {
		if (!provinceId) return; //没有国家id不执行
		setLoading(true);
		const res = await OrderRepository.getApiCountryCityList({
			stateId: provinceId,
			languageType: getDomainsData()?.defaultLocale,
		});
		setLoading(false);
		if (res.code == 0) {
			const _stateList = res?.data?.data || [];
			let provinceId = ''; // 省、州的ID
			const _province = map(_stateList, (item) => {
				// if (item.name === stateProvincVal) {
				// 	provinceId = item.id;
				// }
				return {
					value: item.name,
					label: item.name,
					...item,
				};
			});

			setCountryList(_province);
			// setCountryList(_stateList);

			if (selectCountryRef.current) {
				selectCountryRef.current.scrollTo(0, 0);
			}
		}
		return res;
	};

	useEffect(() => {
		form.setFields([
			{
				name: 'city',
				value: '',
			},
		]);
		// 清空城市
		setCurItem({});
		setCountryList([]);
		getCountyList();
	}, [countyId, provinceId]);

	// 选择国家
	const handleCountryChange = (v, item) => {
		// 四个参数：国家id，国家列表，清除省州市，选中item
		const params = {
			id: item?.id,
			list: countryList,
			option: item,
			flag: true,
		};
		cityChange?.(params);
		setCurItem(item);
	};

	// 根据条件查询国家
	const handleSearch = (val) => {
		getCountyList(val);
	};

	useEffect(() => {
		// getCountyList('').then((res) => {
		// 	if(!res.data?.data) return //没有国家id不执行
		// 	setHistoryCtryList(cloneDeep(res.data?.data || []));
		// 	if (provinceId) {
		// 		const _dt = res?.data?.data || [];
		// 		const _filObj = find(_dt, (t) => t.id === provinceId);
		// 		cityChange?.({
		// 			id: provinceId,
		// 			list: countryList,
		// 			option: _filObj,
		// 			flag: false,
		// 		});
		// 	}
		// });
	}, []);

	return (
		// 嵌套结构与校验信息 province
		<Form.Item form={form} className={'pub-custom-select ' + (curItem?.id ? 'select-have-val' : '')}>
			<Form.Item
				name="city"
				rules={[
					{
						required: true,
						message: i18Translate('i18Form.Required', 'Required'),
					},
				]}
				noStyle // 为 true 时不带样式，作为纯字段控件使用
			>
				<Select
					ref={selectCountryRef}
					showSearch
					filterOption={false} // 禁用了 Select 默认的前端筛选功能。
					className="w260"
					autoComplete="new-password"
					onSelect={(v, item) => {
						handleCountryChange(v, item);
					}}
					onSearch={handleSearch}
					loading={loading}
					value={curItem?.id} // 使用 value 属性设置选中的值
					options={countryList}
					getPopupContainer={(trigger) => trigger.parentNode}
				/>
			</Form.Item>
			<div className="pub-custom-holder pub-input-required">{i18Translate('i18OrderAddress.City', 'City')}</div>
		</Form.Item>
	);
};

export default CountryListSelect
