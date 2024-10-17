// import { useState } from 'react';
// import { Select } from 'antd';
import { getLanguageCurrency } from '~/repositories/Utils';
import { globalData } from '~/utilities/global-data';
import { CURRENCY } from '~/utilities/constant';

const Currency = () => {
	let lngCuy = { lng: 'en', cuy: 'USD' }

	const isBrowser = global?.location
	if (isBrowser) {
		lngCuy = getLanguageCurrency(global?.location?.href)
	} else {
		lngCuy = { lng: globalData.lng, cuy: globalData.cuy }
	}

	const currencyInfo = CURRENCY[lngCuy.lng]

	// const [currentCurrency, setCurrentCurrency] = useState(1);
	// 货币
	// const currOptions = [
	// 	{
	// 		id: 1,
	// 		currency: 'USD',
	// 		saleExchangeRate: '7.1',
	// 		purchaseExchangeRate: '7.1',
	// 		description: '美金',
	// 		createTime: '2024-05-21T08:54:42.000+08:00',
	// 		updateTime: '2024-05-21T08:54:44.000+08:00',
	// 	},
	// 	{
	// 		id: 2,
	// 		currency: 'RMB',
	// 		saleExchangeRate: '1.00',
	// 		purchaseExchangeRate: '1.00',
	// 		description: '人民币',
	// 		createTime: '2024-05-21T08:54:47.000+08:00',
	// 		updateTime: '2024-05-21T08:54:50.000+08:00',
	// 	},
	// 	{
	// 		id: 3,
	// 		currency: 'HKD',
	// 		saleExchangeRate: '0.90',
	// 		purchaseExchangeRate: '0.90',
	// 		description: '港币',
	// 		createTime: '2024-05-21T08:54:52.000+08:00',
	// 		updateTime: '2024-05-21T08:54:55.000+08:00',
	// 	},
	// 	{
	// 		id: 4,
	// 		currency: 'EUR',
	// 		saleExchangeRate: '8.00',
	// 		purchaseExchangeRate: '8.00',
	// 		description: '欧元',
	// 		createTime: '2024-05-21T08:54:57.000+08:00',
	// 		updateTime: '2024-05-21T08:55:00.000+08:00',
	// 	},
	// ];

	// const handleCurrencyChange = (value) => {
	// 	setCurrentCurrency(value);
	// };

	return (
		<div className="pub-flex-center" style={{ textAlign: 'center' }}>
			<div className="pub-color18 pub-font12 mt5">{currencyInfo?.label} {currencyInfo?.value}</div>
			{/* <Select
				className="mt5"
				options={map(currOptions, (curo) => {
					return { ...curo, value: curo.id, label: curo.currency };
				})}
				defaultValue={currentCurrency}
				onChange={handleCurrencyChange}
			/> */}
		</div>
	);
};

export default Currency;
