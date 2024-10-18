import { actionTypes } from './action';

export const initState = {
    allUnpaidOrder: [], // 未支付订单
    deliveryAddress: [], // 邮寄地址
    billingAddress: [], // 账单地址
};

function reducer(state = initState, action) {
    switch (action.type) {
        case actionTypes.SET_UNPAID_ORDER:
            return {
                ...state,
                allUnpaidOrder: action.payload,
            };
        default:
            return state;
    }
}

export default reducer;
