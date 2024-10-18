import React, { useEffect, useState } from 'react';
import { Select, Form, Row, Col } from 'antd';
import OrderRepository from '~/repositories/zqx/OrderRepository';
import useLanguage from '~/hooks/useLanguage';
import ShippingMethodsTable from '~/components/ecomerce/orderCom/ShippingMethodsTable';
import { Notice } from '~/components/common/index';
import { CountryListSelectNew, ProvinceListSelectNew, CityListSelectNew } from '~/components/ecomerce/formCom';

// 新国家
const DescriptionShipping = ({ titleText = 'Shipping Rates - Estimate' }) => {
	const { i18Translate, getDomainsData, curLanguageCodeZh } = useLanguage();
	// 附加功能：根据用户所处国家默认选择
	const ShippingRatesDes1 =
		'Origin Data Global ships to hundreds of countries worldwide.  Use the dropdown to select a designation country to view rates in US dollars.';
	const ShippingRatesDes2 = 'Orders shipped to certain countries could qualify for free shipping depending on order amount and/or package size and weight.';
	const iShippingRatesDes1 = i18Translate('i18ResourcePages.ShippingRatesDes1', ShippingRatesDes1);
	const iShippingRatesDes2 = i18Translate('i18ResourcePages.ShippingRatesDes2', ShippingRatesDes2);
	const iSelectCountryTip = i18Translate('i18ResourcePages.SelectCountryTip', 'SELECT COUNTRY TO SHIP TO');
	const iSelectCountry = i18Translate('i18ResourcePages.Select Country', 'Select Country');
	const iShippingRates = i18Translate('i18MenuText.Shipping Rates', 'Shipping Rates');
	const iFor = i18Translate('i18SmallText.For', 'for');

	const [tableLoading, setTableLoading] = useState(false);
	const [loading, setLoading] = useState(false); // 国家搜索加载状态
	const [shippingList, setShippingList] = useState([]);
	const [selectCountry, setSelectCountry] = useState({}); // 当前选中国家的数据集合
	const [selectProvince, setSelectProvince] = useState({}); // 当前选中省的数据集合
	const [selectCity, setSelectCity] = useState({}); // 当前选中城市的数据集合
	const [shippingMethodsList, setShippingMethodsList] = useState([]); // 国家对应的运费方式

	const [formAddress] = Form.useForm();
	// 国家列表
	const getDeliveryRefList = async (keyWord) => {
		setLoading(true);
		const res = await OrderRepository.getApiCountryList(keyWord, getDomainsData()?.defaultLocale);
		setLoading(false);
		if (res.code == 0) {
			const { data } = res?.data || {};

			data?.map((item) => {
				const { id, name } = item;
				item.value = id;
				item.label = name;
				item.addressCode = id;
			});

			setShippingList(data);
		}
	};

	const handleSearch = (keyWord) => {
		getDeliveryRefList(keyWord);
	};

	// 获取国家对应的运输方式 addressId, cityId
	const getShippingShipping = async (params) => {
		setTableLoading(true);
		const res = await OrderRepository.apiGetDeliveryListByAddressId(params); // 新
		setTableLoading(false);
		if (res?.code === 200) {
			setShippingMethodsList(res?.data);
		}
	};

	const handleChange = (option) => {
		const curItem = shippingList.find((item) => item.id == option);
		setSelectCountry(curItem);
		getShippingShipping({ countryId: curItem?.id });
	};

	// 国家选择
	const handleCountryChange = (item) => {
		setSelectCountry(item);
		setShippingMethodsList([]); // 清空国家对应的运费方式
		setSelectProvince({}); // 清空省选择
		setSelectCity({}); // 清空城市选择
	};

	// 省选择
	const provinceChange = (item) => {
		setSelectProvince(item);
		setShippingMethodsList([]);
		setSelectCity({}); // 清空城市选择
	};

	// 城市选择 cityId
	const cityChange = (item) => {
		getShippingShipping({ cityId: item?.id });
		setSelectCity(item?.option);
	};

	useEffect(() => {
		getDeliveryRefList();
	}, []);

	return (
		<div style={{ padding: '15px 20px 30px' }}>
			<h3 className="mb15 pub-font16 pub-color555 pub-fontw">{titleText}</h3>
			<p className="mb5 pub-color555">
				{iShippingRatesDes1}
				<br />
				{iShippingRatesDes2}
			</p>

			<h3 className="pub-font14 pub-color555 pub-fontw mt12">{iSelectCountryTip}:</h3>
			{!curLanguageCodeZh() && (
				<Select
					showSearch
					filterOption={false} // 禁用了 Select 默认的前端筛选功能。 }
					placeholder={iSelectCountry}
					className="mt7 mb12 w300"
					onChange={(e) => handleChange(e)}
					onSelect={() => getDeliveryRefList('')}
					onSearch={handleSearch}
					loading={loading}
					options={shippingList}
					getPopupContainer={(trigger) => trigger.parentNode}
				/>
			)}

			{curLanguageCodeZh() && (
				<Form form={formAddress} layout="vertical" autoComplete="off" className="pub-custom-input-suffix custom-antd-btn-more mt10">
					<Row gutter={20}>
						<Col>
							<CountryListSelectNew isCheckChina={true} form={formAddress} countyId={selectCountry?.id} countyChange={(params) => handleCountryChange(params)} />
						</Col>
						<Col>
							<ProvinceListSelectNew form={formAddress} countyId={selectCountry?.id} provinceChange={(params) => provinceChange(params)} />
						</Col>
						<Col>
							<CityListSelectNew form={formAddress} countyId={selectCountry?.id} provinceId={selectProvince?.id} cityChange={(params) => cityChange(params)} />
						</Col>
					</Row>
				</Form>
			)}
			{/* 中文需要选中城市才展示 */}
			{((!curLanguageCodeZh() && selectCountry?.id) || (curLanguageCodeZh() && selectCity?.id)) && (
				<>
					<div className="mb20 pub-font14 pub-color555 pub-fontw">
						{iShippingRates} {iFor} {curLanguageCodeZh() ? selectCity?.label : selectCountry?.label}
					</div>
					<ShippingMethodsTable shippingMethodsList={shippingMethodsList} tableLoading={tableLoading} />
				</>
			)}

			<Notice type="costTip" className="mt20" style={{ fontSize: '13px' }} />
		</div>
	);
};

export default React.memo(DescriptionShipping)
