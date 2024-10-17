import { I18NEXT_LOCALE, CURRENCY } from './constant';
/*
	lng 语言
	cuy 币种
*/
class GlobalData {
	lng = I18NEXT_LOCALE.en;
	cuy = CURRENCY[I18NEXT_LOCALE.en].value;

	changeLanguage(lng = I18NEXT_LOCALE.en) {
		this.lng = lng;
		this.cuy = CURRENCY[lng]?.value;
	}
}

export const globalData = new GlobalData();
