import { combineReducers } from 'redux';
import auth from './auth/reducer';
import setting from './setting/reducer';
import app from './app/reducer';
import ecomerce from './ecomerce/reducer';
import orderStore from './orderStore/reducer';
import catalog from './catalog/reducer';
import dataStore from './dataStore/reducer';

export default combineReducers({
    auth,
    setting,
    app,
    ecomerce,
    orderStore,
    catalog,
		dataStore,
});
