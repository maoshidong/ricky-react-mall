import { actionTypes } from './action';

export const initState = {
    isShowDemoPanel: false,
    functionPanelData: {}, // 管理端功面板设置数据
};

function reducer(state = initState, action) {
    switch (action.type) {
        case actionTypes.SWITCH_DEMO_PANEL_SUCCESS:
            return {
                ...state,
                ...{ isShowDemoPanel: action.payload },
            };
        case actionTypes.SET_FUNCTION_PANEL_DATA:
            return {
                ...state,
                ...{ functionPanelData: action.payload },
            };
        default:
            return state;
    }
}

export default reducer;
