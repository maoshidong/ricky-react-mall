export const actionTypes = {
	SET_PAGE_LOADING: 'SET_PAGE_LOADING',
	SET_SPIN_LOADING: 'SET_SPIN_LOADING',
	CHANGE_CURRENCY: 'CHANGE_CURRENCY',
	CHANGE_CURRENCY_SUCCESS: 'CHANGE_CURRENCY_SUCCESS',
	CHANGE_LANGUAGE: 'CHANGE_LANGUAGE',
	CHANGE_LANGUAGE_SUCCESS: 'CHANGE_LANGUAGE_SUCCESS',
};

export function setPageLoading(payload) {
	return { type: actionTypes.SET_PAGE_LOADING, payload };
}

export function setSpinLoading(payload) {
	return { type: actionTypes.SET_SPIN_LOADING, payload };
}

export function changeCurrency(currency) {
    return { type: actionTypes.CHANGE_CURRENCY, currency };
}

export function changeCurrencySuccess(currency) {
    return { type: actionTypes.CHANGE_CURRENCY_SUCCESS, currency };
}

export function changeLanguage(language) {
    return { type: actionTypes.CHANGE_LANGUAGE, language };
}

export function changeLanguageSuccess(language) {
    return { type: actionTypes.CHANGE_LANGUAGE_SUCCESS, language };
}
