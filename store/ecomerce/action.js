export const actionTypes = {

    EMPTY_ITEMS: 'EMPTY_ITEMS',
    EMPTY_ITEMS_SUCCESS: 'EMPTY_ITEMS_SUCCESS',

    SET_WISHLIST_ITEMS: 'SET_WISHLIST_ITEMS',
    SET_WISHLIST_ITEMS_SUCCESS: 'SET_WISHLIST_ITEMS_SUCCESS',
    GET_WISHLIST_ITEMS: 'GET_WISHLIST_ITEMS',
    GT_WISHLIST_ITEMS_SUCCESS: 'GET_WISHLIST_ITEMS_SUCCESS',

    SET_CART_ITEMS: 'SET_CART_ITEMS',
    SET_CART_ITEMS_SUCCESS: 'SET_CART_ITEMS_SUCCESS',
    SET_ALL_CART_ITEMS: 'SET_ALL_CART_ITEMS', // cartList接口数据
    SET_SPARE_CART_LIST: 'SET_SPARE_CART_LIST', // 备份cart
    SET_CUR_CART_DATA: 'SET_CUR_CART_DATA', // 当前购物车的数据信息-包括订单id
    SET_RECOMMEND_MANUFACTURER_LIST: 'SET_RECOMMEND_MANUFACTURER_LIST', // 推荐供应商
    SET_NEW_PRODUCT_CATALOG_LIST: 'SET_NEW_PRODUCT_CATALOG_LIST', // 最新产品分类
    SET_HOT_PRODUCTS_LIST: 'SET_HOT_PRODUCTS_LIST', // 热门产品
    DELETE_CART_ITEMS: 'DELETE_CART_ITEMS',
    DELETE_CART_ITEMS_SUCCESS: 'DELETE_CART_ITEMS_SUCCESS',
    GET_CART_ITEMS: 'GET_CART_ITEMS',
    GET_CART_ITEMS_SUCCESS: 'GET_CART_ITEMS_SUCCESS',

    SET_COMPARE_ITEMS_SUCCESS: 'SET_COMPARE_ITEMS_SUCCESS',
    GET_COMPARE_ITEMS: 'GET_COMPARE_ITEMS',
    GET_COMPARE_ITEMS_SUCCESS: 'GET_COMPARE_ITEMS_SUCCESS',

    SET_RECENT_VIEW_ITEMS: 'SET_RECENT_VIEW_ITEMS',
    SET_RECENT_VIEW_ITEMS_SUCCESS: 'SET_RECENT_VIEW_ITEMS_SUCCESS',
    GET_RECENT_VIEW_ITEMS: 'GET_RECENT_VIEW_ITEMS',
    GET_RECENT_VIEW_ITEMS_SUCCESS: 'GET_RECENT_VIEW_ITEMS_SUCCESS',

    SET_SHIPPING_CART_SHIPPING: 'SET_SHIPPING_CART_SHIPPING',
    SET_SHIPPING_CART_PAYMENT: 'SET_SHIPPING_CART_PAYMENT',

    SET_SHOW_CART_STORE: 'SET_SHOW_CART_STORE',
};

/****************** Whishlist *************************/
export function setWishlistTtems(payload) {
    return { type: actionTypes.SET_WISHLIST_ITEMS, payload };
}

export function setWishlistTtemsSuccess(payload) {
    return { type: actionTypes.SET_WISHLIST_ITEMS_SUCCESS, payload };
}

/****************** Cart *************************/
export function setCartItems(payload) {
    return { type: actionTypes.SET_CART_ITEMS, payload };
}

export function setCartItemsSuccess(payload) {
    return { type: actionTypes.SET_CART_ITEMS_SUCCESS, payload };
}
// 购物车
export function setAllCartItems(payload) {
    return { type: actionTypes.SET_ALL_CART_ITEMS, payload };
}
// 备份购物车
export function setSpareCartList(payload) {
    return { type: actionTypes.SET_SPARE_CART_LIST, payload };
}
// 当前购物车的数据信息-包括订单id
export function setCurCartData(payload) {
    return { type: actionTypes.SET_CUR_CART_DATA, payload };
}
// 推荐供应商
export function setRecommendManufacturerList(payload) {
    return { type: actionTypes.SET_RECOMMEND_MANUFACTURER_LIST, payload };
}
// 最新产品分类
export function setNewProductCatalogList(payload) {
    return { type: actionTypes.SET_NEW_PRODUCT_CATALOG_LIST, payload };
}
// 热门产品
export function setHotProductsList(payload) {
    return { type: actionTypes.SET_HOT_PRODUCTS_LIST, payload };
}

export function getCartItems(payload) {
    return { type: actionTypes.GET_CART_ITEMS, payload };
}

export function getCartItemsSuccess(payload) {
    return { type: actionTypes.GET_CART_ITEMS_SUCCESS, payload };
}

export function setCompareItemsSuccess(payload) {
    return { type: actionTypes.SET_COMPARE_ITEMS_SUCCESS, payload };
}
/****************** RecentView *************************/
export function setRecentView(payload) {
    return { type: actionTypes.SET_RECENT_VIEW_ITEMS, payload };
}

export function setRecentViewSuccess(payload) {
    return { type: actionTypes.SET_RECENT_VIEW_ITEMS_SUCCESS, payload };
}

/****************** shoppingCartShipping *************************/
export function setShoppingCartShipping(payload) {
    return { type: actionTypes.SET_SHIPPING_CART_SHIPPING, payload };
}

/****************** shoppingCartPayment *************************/
export function setShoppingCartPayment(payload) {
    return { type: actionTypes.SET_SHIPPING_CART_PAYMENT, payload };
}

// 展示添加购物车的弹窗
export function setShowCartStore(payload) {
    return { type: actionTypes.SET_SHOW_CART_STORE, payload };
}


/****************** Empty *************************/
export function emptyItems() {
    return { type: actionTypes.EMPTY_ITEMS };
}

export function emptyItemsSuccess() {
    return { type: actionTypes.EMPTY_ITEMS_SUCCESS };
}
