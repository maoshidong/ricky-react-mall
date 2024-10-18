import React, { useState, useEffect, useRef } from 'react';
import OrderRepository from '~/repositories/zqx/OrderRepository';
import { Form, Select } from 'antd';
import useLanguage from '~/hooks/useLanguage';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';

// 新国家
const CountryListSelect = ({
	countyId,
	countyChange,
	form,
	isCheckChina = false, // 是否默认中国
}) => {
	const { i18Translate, getDomainsData } = useLanguage();
	const iCountry = i18Translate('i18OrderAddress.Country', 'Country');
	const [loading, setLoading] = useState(false); // 国家搜索加载状态
	const selectCountryRef = useRef(null);
	const [countryList, setCountryList] = useState([]); // 国家list
	const [historyCtryList, setHistoryCtryList] = useState([]); // 存储第一次国家列表

	// 获取国家列表数据
	const getCountyList = async (keyword) => {
		setLoading(true);
		const res = await OrderRepository.getApiCountryList(keyword, getDomainsData()?.defaultLocale);
		setLoading(false);
		if (res?.code == 0) {
			res?.data?.data?.map((item) => {
				item.value = item?.id;
				item.label = item?.name;
				item.addressCode = item?.id;
			});
			// 没有选中才默认
			if (isCheckChina && !countyId) {
				const firstItem = res.data?.data?.[0] || {};
				handleCountryChange(firstItem?.id, firstItem);
			}
			setCountryList(res.data?.data);

			if (selectCountryRef.current) {
				selectCountryRef.current.scrollTo(0, 0);
			}
		}
		return res;
	};

	// 选择国家
	const handleCountryChange = (v, item) => {
		// 四个参数：国家id，国家列表，清除省州市，选中item
		const params = {
			id: v,
			list: countryList,
			option: item,
			flag: true,
		};
		countyChange?.(params);
		setCountryList(historyCtryList);
	};

	// 根据条件查询国家
	const handleSearch = (val) => {
		getCountyList(val);
	};

	useEffect(() => {
		getCountyList('').then((res) => {
			setHistoryCtryList(cloneDeep(res.data?.data || []));
			if (countyId) {
				const _dt = res?.data?.data || [];
				const _filObj = find(_dt, (t) => t.id === countyId);
				countyChange?.({
					id: countyId,
					list: countryList,
					option: _filObj,
					flag: false,
				});
			}
		});
	}, []);

	useEffect(() => {
		form.setFields([
			{
				name: 'addressId',
				value: countyId,
			},
		]);
	}, [countyId]);

	return (
		// 嵌套结构与校验信息
		<Form.Item form={form} className={'pub-custom-select ' + (countyId ? 'select-have-val' : '')}>
			<Form.Item
				name="addressId"
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
					value={Number(countyId)} // 使用 value 属性设置选中的值 	defaultValue={countyId}
					getPopupContainer={(trigger) => trigger.parentNode}
					options={countryList}
				/>
			</Form.Item>
			<div className="pub-custom-holder pub-input-required">{iCountry}</div>
		</Form.Item>
	);
};

export default CountryListSelect
