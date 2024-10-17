export const actionTypes = {
    SWITCH_DEMO_PANEL: 'SWITCH_DEMO_PANEL',
    SWITCH_DEMO_PANEL_SUCCESS: 'SWITCH_DEMO_PANEL_SUCCESS',
    SET_APP_HOST: 'SET_APP_HOST',
    IS_LOAD_I18: 'IS_LOAD_I18',
    SET_FUNCTION_PANEL_DATA: 'SET_FUNCTION_PANEL_DATA',
};

export function switchDemoPanel(payload) {
    return { type: actionTypes.SWITCH_DEMO_PANEL, payload };
}

export function switchDemoPanelSuccess(payload) {
    return { type: actionTypes.SWITCH_DEMO_PANEL_SUCCESS, payload };
}

// export function setAppHost(payload) {
//     return { type: actionTypes.SET_APP_HOST, payload };
// }

export function setIsLoadI18(payload) {
    return { type: actionTypes.SET_APP_HOST, payload };
}
 // 管理端功能面板
export function setFunctionPanelData(payload) {
    return { type: actionTypes.SET_FUNCTION_PANEL_DATA, payload };
}