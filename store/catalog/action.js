export const actionTypes = {
    SET_CATALOGS: 'SET_CATALOGS',
    SET_CATALOGS_SUCCESS: 'SET_CATALOGS_SUCCESS',
    GET_CATALOGS: 'GET_CATALOGS',
    GET_CATALOGS_SUCCESS: 'GET_CATALOGS_SUCCESS',

    GET_ALL_CATALOGS: 'GET_ALL_CATALOGS',
};

export function getAllCatalogs(payload) {
    return {  type: actionTypes.GET_ALL_CATALOGS, payload };
}

export function setCatalogs(catalogs) {
    return {
        type: actionTypes.SET_CATALOGS,
        payload: catalogs,
    };
}

export function setCatalogsSuccess(catalogs) {
    return {
        type: actionTypes.SET_CATALOGS_SUCCESS,
        payload: catalogs,
    };
}

export async function getCatalogs() {
    return {
        type: actionTypes.GET_CATALOGS,
    };
}

export function getCatalogsSuccess() {
    return { type: actionTypes.GET_CATALOGS_SUCCESS };
}
