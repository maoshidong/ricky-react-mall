export const actionTypes = {
	SET_PW_LIST: 'SET_PW_LIST',
};

export function setPayWayListStore(payload) {
	return {  type: actionTypes.SET_PW_LIST, payload };
}