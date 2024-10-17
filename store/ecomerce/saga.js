import { all, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { actionTypes } from './action';

import {
    setCartItemsSuccess,
    setWishlistTtemsSuccess,
    setCompareItemsSuccess,
    setRecentViewSuccess,
    emptyItemsSuccess,
} from './action';

// new
function* getWishlistItems({ payload }) {
    try {
        yield put(setWishlistTtemsSuccess(payload));
    } catch (err) {
        console.log(err);
    }
}

function* setCartItems({ payload }) {
    try {
        yield put(setCartItemsSuccess(payload));
    } catch (err) {
        console.log(err);
    }
}

function* emptyItemsSaga() {
    try {
        yield put(emptyItemsSuccess());
    } catch (err) {
        console.log(err);
    }
}

function* getCompareItems({ payload }) {
    try {
        yield put(setCompareItemsSuccess(payload));
    } catch (err) {
        console.log(err);
    }
}

function* getRecentViewItems({ payload }) {
    try {
        yield put(setRecentViewSuccess(payload));
    } catch (err) {
        console.log(err);
    }
}

export default function* rootSaga() {
    // new
    yield all([takeEvery(actionTypes.SET_WISHLIST_ITEMS, getWishlistItems)]);
    yield all([takeLatest(actionTypes.SET_CART_ITEMS, setCartItems)]);
    yield all([takeLatest(actionTypes.EMPTY_ITEMS, emptyItemsSaga)]);
    // yield all([takeEvery(actionTypes.SET_COMPARE_ITEMS, getRecentViewItems)]);
    yield all([takeEvery(actionTypes.SET_RECENT_VIEW_ITEMS, getRecentViewItems)]);
}
