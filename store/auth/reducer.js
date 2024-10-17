import { actionTypes } from './action';

export const initState = {
	isAccountLog: false,
	isLoggedIn: false,
	account: '',
	token: '',
	profileInfo: {},
};

function reducer(state = initState, actions) {
	switch (actions.type) {
		case actionTypes.IS_ACCOUNT_LOGIN:
			return {
				...state,
				...{ isAccountLog: actions.payload, isLoggedIn: actions.payload },
			};
		case actionTypes.LOGIN_REQUEST:
			return {
				...state,
				...actions.payload,
			};
		case actionTypes.LOGIN_SUCCESS:
			return {
				...state,
				...{ isLoggedIn: true, isAccountLog: true },
				...actions.payload,
			};
		case actionTypes.LOGOUT:
			return {
				...state,
				...{
					isLoggedIn: false,
					isAccountLog: false,
					account: '',
					token: '',
					profileInfo: {},
				},
			};
		case actionTypes.LOGOUT_SUCCESS:
			return {
				...state,
				...{
					isLoggedIn: false,
					isAccountLog: false,
					account: '',
					token: '',
					profileInfo: {},
				},
			};
		case actionTypes.PROFILE:
			return {
				...state,
				profileInfo: {
					...actions.payload,
				},
			};
		default:
			return state;
	}
}

export default reducer;
