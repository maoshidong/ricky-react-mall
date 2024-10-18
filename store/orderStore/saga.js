import { all, put, takeEvery } from 'redux-saga/effects';
// import CatalogRepository from "~/repositories/zqx/CatalogRepository";

import { setCatalogsSuccess, actionTypes } from './action';

function* getCatalogs() {
    try {
        // const catalogs = yield CatalogRepository.getAllCatalogs();
        // yield put(setCatalogsSuccess(catalogs?.data?.data ?? []));
    } catch (err) {
        console.log(err);
    }
}

export default function* rootSaga() {
    yield all([takeEvery(actionTypes.SET_UNPAID_ORDER, getCatalogs)]);
}
