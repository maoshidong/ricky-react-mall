import { actionTypes } from './action';

export const initialState = {
	pageLoading: false, // 页面头部动态加载条
	spinLoading: false, // 页面spin加载
	spinLoadingText: '', // 页面spin加载文案
	currency: {
		symbol: '$',
		text: 'USD',
	},
	language: {
		locale: 'en-GB',
		flag: 'gb',
		label: 'English',
	},
};

function reducer(state = initialState, action) {
	switch (action.type) {
		// 页面加载
		case actionTypes.SET_PAGE_LOADING:
			return {
				...state,
				pageLoading: action.payload,
			};
		// 页面spin加载
		case actionTypes.SET_SPIN_LOADING:
			return {
				...state,
				spinLoading: action.payload.payload,
				spinLoadingText: action.payload.loadingText,
			};
		case actionTypes.CHANGE_CURRENCY_SUCCESS:
			return {
				...state,
				...{ currency: action.currency },
			};
		case actionTypes.CHANGE_LANGUAGE_SUCCESS:
			return {
				...state,
				...{ language: action.language },
			};
		default:
			return state;
	}
}

export default reducer;
