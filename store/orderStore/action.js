export const actionTypes = {
    SET_UNPAID_ORDER: 'SET_UNPAID_ORDER',
};

export function setUnpaidOrder(payload) {
    return {  type: actionTypes.SET_UNPAID_ORDER, payload };
}
