import { HYDRATE } from 'next-redux-wrapper';
// import { AllCatalogTree } from '~/utilities/AllCatalogTree'

import { actionTypes } from './action';

export const initState = {
    isNewestCatalogsTree: false, // 不是最新分类树就调接口
    allCatalogs: [], // 所有分类树  AllCatalogTree || 
    catalogs: [],
};

function reducer(state = initState, action) {
    switch (action.type) {
        case actionTypes.GET_ALL_CATALOGS:
            return {
                ...state,
                allCatalogs: action.payload,
                isNewestCatalogsTree: true,
            };
        case actionTypes.SET_CATALOGS_SUCCESS:
            return {
                ...state,
                catalogs: action.payload,
            };
        case actionTypes.GET_CATALOGS:
            return {
                ...state,
                ...{ catalogs: action.payload },
            };
        case HYDRATE:
            return {
                ...state,
                catalogs: action.payload.catalog?.catalogs || [],
            };
        default:
            return state;
    }
}

export default reducer;
