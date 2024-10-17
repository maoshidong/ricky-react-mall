export const actionTypes = {
    IS_ACCOUNT_LOGIN: 'IS_ACCOUNT_LOGIN',
    LOGIN_REQUEST: 'LOGIN_REQUEST',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGOUT: 'LOGOUT',
    LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
    PROFILE:'PROFILE',
    CHECK_AUTHORIZATION: 'CHECK_AUTHORIZATION',
};

export function checkIsAccountLog(payload) {
    return { type: actionTypes.IS_ACCOUNT_LOGIN, payload };
}
export function profileData(profileInfo) {
    return {
        type: actionTypes.PROFILE,
        payload:{
            ...profileInfo
        }
    };
}
// facebook: 2, gg: 3 (账号密码登录： 默认1)
export function login(token, account, accountType=1) {
    return {
        type: actionTypes.LOGIN_REQUEST,
        payload: {
            token,
            account,
            accountType,
        }
    };
}

export function loginSuccess(payload) {
    return { 
        type: actionTypes.LOGIN_SUCCESS,
        payload,
    };
}

export function logOut() {
    return {type: actionTypes.LOGOUT };
}

export function logOutSuccess() {
    return { type: actionTypes.LOGOUT_SUCCESS };
}
