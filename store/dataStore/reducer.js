import { HYDRATE } from 'next-redux-wrapper';
// import { AllCatalogTree } from '~/utilities/AllCatalogTree'

import { actionTypes } from './action';

export const initState = {
		payWayListStore: [], // 支付方式列表
};

function reducer(state = initState, action) {
    switch (action.type) {
        case actionTypes.SET_PW_LIST:
            return {
                ...state,
                payWayListStore: action.payload,
            };
        default:
            return state;
    }
}

export default reducer;
