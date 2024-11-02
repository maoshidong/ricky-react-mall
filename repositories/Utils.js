import { CURRENCY, I18NEXT_LOCALE } from '~/utilities/constant';
import { globalData } from '~/utilities/global-data';

// 根据域名获取当前语言和货币
const getLanguageCurrency = (url = I18NEXT_LOCALE.enHost) => {
	// return { lng: 'zh', cuy: 'RMB' }; //中文测试-及时注销
	let langCurr = { lng: 'en', cuy: 'USD' };
	if (!url) return langCurr;

	const regHost = /^(?:https?|ftp|file):\/\/([A-Za-z0-9.-]+)/;
	const host = url.match(regHost) ? url.match(regHost)[1] : I18NEXT_LOCALE.enHost;

	switch (host) {
		case 'www.origin-ic.com':
			langCurr = { lng: 'en', cuy: 'USD' };
			break;
		case I18NEXT_LOCALE.enHost:
			langCurr = { lng: 'en', cuy: 'USD' };
			break;
		case I18NEXT_LOCALE.zhHost:
			langCurr = { lng: 'zh', cuy: 'RMB' };
			break;
		default:
			langCurr = { lng: 'en', cuy: 'USD' };
	}

	return langCurr;
};

// 根据域名获取当前语言
const getCurrentLanguage = (url = I18NEXT_LOCALE.enHost) => {
	const language = getLanguageCurrency(url);
	return language.lng
};

// 根据域名获取
const getCurrentCurrency=(url)=>{
	const currency = getLanguageCurrency(url)
	return currency.cuy
}

// 获取当前货币信息
const getCurrencyInfo = ()=>{
	let lng = 'en'
	const isBrowser = global?.location

	if(isBrowser) {
		lng = getCurrentLanguage(global?.location?.href)
	}else {
		lng = globalData.lng
	}

	// 返回的数据格式： {label:'$',value:'USD'}
	return CURRENCY[lng]
}

export {
	getLanguageCurrency,
	getCurrentLanguage,
	getCurrentCurrency,
	getCurrencyInfo
}