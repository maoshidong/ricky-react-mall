import { actionTypes } from './action';

export const initalState = {
    wishlistItems: [],
    compareItems: [],
    cartItems: [],
    allCartItems: [], // cartList接口数据
    spareCartList: [], // 备用cart
    curCartData: [], // 当前购物车的数据信息-包括订单id
    recommendManufacturerList: [], // 推荐供应商列表
    newProductCatalogList: {}, // 最新产品分类
    hotProductsList: [], // 推荐供应商列表
    recentView: [], // 最近浏览
    shoppingCartShipping: {},
    shoppingCartPayment: {},
    showCartStore: false, // 展示添加购物车的弹窗
};

function reducer(state = initalState, action) {
    switch (action.type) {
        // new
        case actionTypes.SET_WISHLIST_ITEMS_SUCCESS:
            return {
                ...state,
                wishlistItems: action.payload,
            };
        case actionTypes.SET_CART_ITEMS_SUCCESS:
            return {
                ...state,
                cartItems: action.payload,
            };
        case actionTypes.SET_ALL_CART_ITEMS:
            return {
                ...state,
                allCartItems: action.payload,
            };
        case actionTypes.SET_RECOMMEND_MANUFACTURER_LIST:
            return {
                ...state,
                recommendManufacturerList: action.payload,
            };
        case actionTypes.SET_NEW_PRODUCT_CATALOG_LIST:
            return {
                ...state,
                newProductCatalogList: action.payload,
            };
        case actionTypes.SET_HOT_PRODUCTS_LIST:
            return {
                ...state,
                hotProductsList: action.payload,
            };
        // 备份购物车
        case actionTypes.SET_SPARE_CART_LIST:
            return {
                ...state,
                spareCartList: action.payload,
            };
        // 当前购物车的数据信息-包括订单id
        case actionTypes.SET_CUR_CART_DATA:
            return {
                ...state,
                curCartData: action.payload,
            };
            
        case actionTypes.GET_CART_ITEMS_SUCCESS:
            return {
                ...state,
                cartItems: action.payload,
            };
        case actionTypes.SET_COMPARE_ITEMS_SUCCESS:
            return {
                ...state,
                compareItems: action.payload,
            };
        case actionTypes.SET_RECENT_VIEW_ITEMS_SUCCESS:
            return {
                ...state,
                recentView: action.payload,
            };
        case actionTypes.EMPTY_ITEMS_SUCCESS:
            return {
                ...state,
                wishlistItems: [],
                compareItems: [],
                cartItems: [],
                allCartItems: [],
                recentView: [],
                shoppingCartShipping: {},
                shoppingCartPayment: {},
            };
        case actionTypes.SET_SHIPPING_CART_SHIPPING:
            return {
                ...state,
                shoppingCartShipping: action.payload,
            };
        case actionTypes.SET_SHIPPING_CART_PAYMENT:
            return {
                ...state,
                shoppingCartPayment: action.payload,
            };
        case actionTypes.SET_SHOW_CART_STORE:
            return {
                ...state,
                showCartStore: action.payload,
            };
        default:
            return state;
    }
}

export default reducer;
