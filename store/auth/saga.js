import { all, put, takeEvery, takeLatest } from 'redux-saga/effects';
// import {notification } from 'antd';
// import Router from 'next/router';

import { actionTypes, loginSuccess, logOutSuccess } from './action';
import { getCartItems } from '../ecomerce/action';

function* loginSaga({ payload }) {
    try {
        yield put(getCartItems());
        yield put(loginSuccess(payload));
    } catch (err) {
        console.log(err);
    }
}

function* logOutSaga() {
    try {
        yield put(logOutSuccess());
        // Router.push('/')
    } catch (err) {
        console.log(err);
    }
}

export default function* rootSaga() {
    yield all([takeLatest(actionTypes.LOGIN_REQUEST, loginSaga)]);
    yield all([takeEvery(actionTypes.LOGOUT, logOutSaga)]);
}
