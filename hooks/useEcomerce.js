import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
// import Cookies from 'js-cookie';

import ZqxProductRepository from '~/repositories/zqx/ProductRepository';
import ProductRepository from '~/repositories/ProductRepository';
import CartRepository from '~/repositories/zqx/CartRepository';
import AccountRepository from '~/repositories/zqx/AccountRepository';
import { setToken } from '~/repositories/Repository';

import { useCookies } from 'react-cookie';
import { checkIsAccountLog } from '~/store/auth/action';
import {
    setWishlistTtems,
    setCartItems,
    setCurCartData,
    setAllCartItems,
    setSpareCartList,
    setCartItemsSuccess,
    setRecentView,
} from '~/store/ecomerce/action';
import { getExpiresTime } from '~/utilities/common-helpers';
// import {
//     calculateTargetPriceTotal, toFixedFun, 
// } from '~/utilities/ecomerce-helpers';
import { calculateTotalAmount, toFixed } from '~/utilities/ecomerce-helpers';
import useLocalStorage from '~/hooks/useLocalStorage'
import useCart from '~/hooks/useCart';
import useLanguage from '~/hooks/useLanguage';
// import useAccount from '~/hooks/useAccount';

export default function useEcomerce(props) {

    const { getLanguageEmpty, getDomainsData } = useLanguage();
    const { saveOrderStepData } = useCart();
		// const { anonymousAuthLoginHooks } = useAccount();

    // const cachedPropsRef = useRef({
    //     arr: []
    // })
    const dispatch = useDispatch();


    const [loading, setLoading] = useState(false);
    const [isLoadCartList, setIsLoadCartList] = useState(false);
    const [cartItemsOnCookie] = useState(null);
    const [cookies, setCookie] = useCookies(['cart', 'auth', 'recentview', 'cur_cart_data']);
    const [products, getProducts] = useState([]);
    const [cartList, setCartList] = useState([]);

    const [sendTimeMap, setSendTimeMap] = useState([]); // 发货时间列表
    const [adddressMap, setAdddressMap] = useState([]); // 发货地址列表
    const [isFavoritesSuc, setIsFavoritesSuc] = useState(false); // 是否收藏成功

    const [quoteList, setQuoteList] = useLocalStorage('quoteList', new Array(5).fill({}));
    const [recentViewLoc, setRecentViewLoc] = useLocalStorage('recentViewLoc', []) // 首页浏览记录 

    const { cart, account, cur_cart_data } = cookies;
    const { id: curCartNo } = cur_cart_data || {}



    // 清空购物车数据, 即清空存储的购物车id等数据 cookies?.cur_cart_data?.id
    // 删除时机 1. SAVED FOR LATER列表删除的id和当前存储的id一致时删除 2. /account/shopping-cart新建购物车时删除  3. 点击支付跳转下一页时 4. 账号登录前
    // 存储时机：1. 激活购物车时 2.添加产品提示新建购物车时
    const setCurCartDataHok = data => {
        setCookie('cur_cart_data', data, { path: '/' })
        dispatch(setCurCartData(data));
    }

    // 请求购物车列表 传不存在的cartNo,即清空 orderId: 新建购物车id,也是订单id
    const addToLoadCarts = async (token, cartNo=0, orderId) => {
        // 取传过来的最新token和cartNo, 或者存储中的
        const res = await CartRepository.loadCarts(token || account?.token, cartNo || curCartNo, getDomainsData()?.defaultLocale,);
        if (res?.code == 0) {
            const { data } = res
            const newData = data?.map(item => {
                return {
                    ...item,
                    image: item.image ? item.image : getLanguageEmpty(),
                }
            })
            dispatch(setAllCartItems(newData));
            // 存cookies的数据，含id、quantity、stock
            const cokCart = data.map(item => {
                return {
                    id: item.productId,
                    quantity: item.cartQuantity,
                    stock: item.quantity,
                }
            })
            setCookie('cart', cokCart, { path: '/', expires: getExpiresTime(30) });
            dispatch(setCartItemsSuccess(cokCart));
            // 给客户购物车传email

            const cartSubTotal = Number(toFixed(calculateTotalAmount(newData), 2))
            // 购物车有数据, 价格为0才调用， 否则会把价格改为0了
            if(Number(cartSubTotal) > 0) {
                saveOrderStepData({
                    productPrice: cartSubTotal,
                    email: cookies?.email, step: 1,
                    orderId: cookies?.cur_cart_data?.orderId || orderId,
                })
            }           
        }
    }
    // 添加到询价单
    const saveAddToRfq = (params, isMore=false) => {
				const list = JSON.parse(localStorage.getItem('quoteList'))|| (new Array(3).fill({}))
        let sliceArr = list
        let fillIndex = 0 // 检查第一个数据为空的项
        sliceArr.map((item, index) => {
            if(Object.keys(item).length > 0) {
                fillIndex = index + 1
            }
        })
        // 多条
        if(isMore) {
            // 如果只有一条，且为空
            if(list?.length === 1 && fillIndex === 0) {
                setQuoteList(params)
            } else {
                const filterItems = [...list, ...params].filter(i => Object.keys(i).length !== 0) // 清除掉空对象
								setQuoteList(filterItems || [])
                // setQuoteList([...quoteList, ...params])
            }
        } else {
            // 单条
            sliceArr[fillIndex] = params // 放到第一个数据为空的项
            setQuoteList([...list])
        }
    }

    // 新建用户购物车 - 当前购物车没有产品时才调用
    const newAddUserCart = async (authorization, infoList, params) => {
        setCurCartDataHok({})
        let param = {
            infoList,
            type: params?.type || 1,
        }

        return new Promise(async (resolve,reject) => {
            try {
                const res = await CartRepository.addUserCartBasket(authorization || account?.token, param)
                if (res.code == 0) {
                    const { id, orderId } = res?.data
                    addToLoadCarts(authorization, id, orderId)
                    setCurCartDataHok(res?.data)
                    // if(callback) {
                    //     // 等待 setCurCartDataHok完成
                    //     setTimeout(() => {
                    //         callback()
                    //     }, 3000)
                    // }
                    resolve(res?.data)
                }
            } catch (error) {
                reject(error)
            }
        })
       
    }

    return {
        loading, isLoadCartList,
        cartItemsOnCookie,
        products, cartList,
        sendTimeMap, adddressMap,
        isFavoritesSuc,
        hooksQuoteList: quoteList,
        saveAddToRfq, addToLoadCarts, setCurCartDataHok, newAddUserCart,
        checkIsAccountLog: async (token) => {
            // 验证匿名登录 1: 匿名登录 2. 账号登录 0. 未登录
            const res = await AccountRepository.checkAnonymousAuth(token || account?.token);
            if (res?.data == 2) {
                dispatch(checkIsAccountLog(true));
            } else {
                dispatch(checkIsAccountLog(false));
            }
        },
        setCartList: async (payload, group = '') => {
            const res = await CartRepository.loadCarts(account?.token, curCartNo, getDomainsData()?.defaultLocale,);
            if (res?.data && res?.data?.length > 0) {
                // dispatch(setAllCartItems(res.data));
                let cartItems = res.data;
                payload.forEach((item) => {
                    let existItem = cartItems.find(
                        (val) => val.id === item.id
                    );
                    if (existItem) {
                        existItem.quantity = item.quantity;
                    }
                });
                setCartList(cartItems);

                setTimeout(
                    function () {
                        setLoading(false);
                    }.bind(this),
                    250
                );
            } else if (res?.data?.length === 0) {
                setCookie('cart', [], { path: '/', expires: getExpiresTime(30) });
                dispatch(setCartItemsSuccess([]));
            }
        },
        getProducts: async (payload, group = '') => {
            if (payload && payload.length > 0) {
                let ids = payload.map(item => item.id);
                const responseData = await ZqxProductRepository.getProductsByIds(ids);
                if (responseData?.data && responseData?.data?.data.length > 0) {
                    let cartItems = responseData.data.data;
                    payload.forEach((item) => {
                        let existItem = cartItems.find(
                            (val) => val.id === item.id
                        );
                        if (existItem) {
                            existItem.quantity = item.quantity;
                        }
                    });

                    getProducts(cartItems);

                    setTimeout(
                        function () {
                            setLoading(false);
                        }.bind(this),
                        250
                    );
                }
            } else {
                setLoading(false);
                getProducts([]);
            }
        },

        // 添加购物车
        addItem: async (newItem, items, group) => {
            // return
            const newItems = [newItem]
            // 去重
            // let uniqueArr = Array.from(new Set(newItems.map((item) => item.id))).map((id) => {
            //     return newItems.find((item) => item.id === id);
            // });

            // if (group === 'cart' || group === 'inputCart') {
            //     if (uniqueArr && account && account.token) {
            //         const items = uniqueArr.map(item => ({
            //             productId: item.id || item.productId,
            //             quantity: item.cartQuantity || item.quantity,
            //             // unitPrice: toFixedFun(calculateTargetPriceTotal(item) || 0, 4), // 用于价格变动对比
            //         }))
            //         // 新需求-新建购物车, 当购物车没有产品时
            //         if(!curCartNo) {
            //             newAddUserCart(account.token, items)
            //             return
            //         }
            //         // 当购物车有产品时
            //         await CartRepository.addToCarts(account.token, { items }, curCartNo, cur_cart_data?.orderId)
            //         addToLoadCarts(account.token) // 添加购物车成功之后需加载列表 
            //     } else {
            //         // 先匿名登录再添加
            //         const res = await AccountRepository.anonymousAuth1();
            //         if (res && res.code == 0) {
            //             const { data } = res
            //             const items = uniqueArr.map(item => ({
            //                 productId: item.id || item.productId,
            //                 quantity: item.quantity,
            //             }))
            //             setToken(data);
            //             setCookie('account', {
            //                 token: data,
            //                 account: {},
            //             }, { path: '/', expires: getExpiresTime(0.5) });
            //             // 新需求-新建购物车, 当购物车没有产品时
            //             if(!curCartNo) {
            //                 newAddUserCart(data, items)
            //                 return
            //             }
            //             // 当购物车有产品时
            //             await CartRepository.addToCarts(data, { items })
            //             addToLoadCarts(data)
            //         }
            //     }
            //     setCookie('cart', uniqueArr, { path: '/', expires: getExpiresTime(30) });
            //     dispatch(setCartItemsSuccess(uniqueArr));
            //     // dispatch(setCartItems(newItems));
            // }
            // if (group === 'wishlist' || group === 'quote') {
            //     setCookie('wishlist', uniqueArr, { path: '/', expires: getExpiresTime(30) });
            //     dispatch(setWishlistTtems(uniqueArr));
            // }

            // 首页浏览记录
            if (group === 'recentview') {
                let recentviewArr = recentViewLoc || [] // 已经存在的数据
                const { id, thumb, image, name, description, manufacturerSlug, datetime, manufacturerLogo } = newItem || {}
                const newItemArr = [
                    {
                        id, image: thumb || image, name, description, manufacturerSlug, manufacturer: newItem?.manufacturer,
												datetime, manufacturerLogo,
                    }
                ]

                // 新旧数据合并 
                const newArr = newItemArr.concat(recentviewArr).filter((item, index, self) => {
                    return self.findIndex(el => el.id == item.id) === index
                })
                setRecentViewLoc(newArr) // 存储到本地loc
                setCookie('recentview', newArr, { path: '/', expires: getExpiresTime(30) });
                dispatch(setRecentView(newArr));
            }
            return newItems;
        },

        // shopCart页面-添加购物车-new - 只在修改数量调用
        useAddCart: async (newAddCarts, allCartItems, object={}) => {

            const newAllCartItems = allCartItems?.map(item => {
                const data = newAddCarts.find(i => item.cartId == i.cartId); // cartId才是唯一的，因为报价时购物车可能有多个相同的productId
                return {
                    ...item,
                    ...data
                };
            });
            if(object.cartNo === 1) {
                dispatch(setSpareCartList(newAllCartItems));
            } else {
                dispatch(setAllCartItems(newAllCartItems));
            }
            // 添加购物车 - 修改数量
            if(object?.group == 'toAddCarts') {
                await CartRepository.addToCartsList(account?.token, {
                    items: newAddCarts.map(item => ({
                        productId: item.productId,
                        quantity: item.cartQuantity,
                        callBackId: item?.callBackId || null // 报价callBackId
                    })),
                    updateQuantityType: object?.updateQuantityType || 1,
                    type: object?.type || 1,
                }, object.cartNo || curCartNo, cur_cart_data?.orderId) // 购物车列表修改数量传type: 1
                addToLoadCarts(account?.token)
                // 存储在内存中， 无需再次调用
                // if(object.cartNo === 0) {
                //     addToLoadCarts(account?.token)
                // }
            }
        },

        // 添加多个产品 unitPrice 添加购物车: 全量改为增量 第二个参数不用了 object.type: 1 默认 2 报价 3 多订单 4 推送订单
        useAddMoreCart: async (newAddCarts, object) => {
            if(newAddCarts?.length === 0) {
                addToLoadCarts(object?.newToken)  // 不新增购物车，但是要请求购物车列表
                return
            }
            
            const items = newAddCarts?.map(item => ({
                productId: item?.productId || item?.id,
                quantity: item?.customQuantity || item?.cartQuantity || item?.quantity,
                // type: 1 默认 2 报价添加购物车传(items需要传callBackId： 报价id)  3 多订单 type: 2 or 3 传 callBackId和sku
                callBackId: object?.callBackId || item?.callBackId || null,
                sku: item?.sku || null, // otherParams有了
                ...item?.restParams, // 自动结构restParams内的参数
                // unitPrice: toFixedFun(calculateTargetPriceTotal(item) || 0, 4), // 用于价格变动对比
            }))
            const authorization = object?.newToken || account?.token // 拿最新传过来的token或者存储中的token
            if (authorization) {
                // 新需求-新建购物车, 当购物车没有产品时 拿不到最新的curCartNo, 就传cartNo < 0 |
                if(!curCartNo || object?.cartNo < 0 || object?.isNewCart) {
                    newAddUserCart(authorization, items, {
                        type: object?.type || 1,
                        callBackId: object?.callBackId || null
                    })
                    return
                }
                // 当购物车有产品时
                await CartRepository.addToCarts(authorization, 
                    { items, type: object?.type || 1, },
                    object?.cartNo || curCartNo, cur_cart_data?.orderId
                )
                addToLoadCarts(authorization)

            } else {
                // 没登录就先登录
								// console.log('没登录就先登录----del')
								// const res = await anonymousAuthLoginHooks()
								
                const res = await AccountRepository.anonymousAuth();
                if (res?.code == 0) {
                    const { data } = res
                    setToken(data);
                    setCookie('account', {
                        token: data,
                        account: {},
												isAccountLog: false,
												isLoggedIn: false,
                    }, { path: '/', expires: getExpiresTime(30) });

                    // 新需求-新建购物车, 当购物车没有产品时
                    if(!curCartNo || object?.cartNo < 0) {
                        newAddUserCart(data, items, {
                            type: object?.type || 1
                        })
                        return
                    }
                    await CartRepository.addToCarts(data, { items }, object.cartNo || curCartNo, cur_cart_data?.orderId)
                    addToLoadCarts(data)
                }
            }
        },

        // 删除购物车商品
        removeItem: async (selectedItem, items, group) => {
            let currentItems = items;
            if (currentItems.length > 0) {
                const index = currentItems.findIndex(
                    (item) => item.id == selectedItem.id
                );
                currentItems.splice(index, 1);
            }
            if (group === 'cart') {
                if (selectedItem && account && account.token) {
                    await CartRepository.removeCarts(account.token, {
                        cartIdList: [selectedItem.id]
                    }, curCartNo)
                }
                setCookie('cart', currentItems, { path: '/', expires: getExpiresTime(30) });
                dispatch(setCartItems(currentItems));
            }

            if (group === 'wishlist' || group === 'quote') {
                setCookie('wishlist', currentItems, { path: '/', expires: getExpiresTime(30) });
                dispatch(setWishlistTtems(currentItems));
            }
        },

        // 删除购物车所有商品
        removeItems: (group) => {
            if (group === 'wishlist' || group === 'quote') {
                setCookie('wishlist', [], { path: '/' });
                dispatch(setWishlistTtems([]));
            }
            if (group === 'cart') {
                setCookie('cart', [], { path: '/' });
                dispatch(setCartItems([]));
                dispatch(setAllCartItems([]));
            }
        },

        //获取产品发货时间枚举值
        async getSysShippingTime() {
            const res = await ZqxProductRepository.getdictType('sys_shipping_time', getDomainsData()?.defaultLocale);
            let sendTimeMap = []
            if (res && res?.data?.code === 0 ) {
                res?.data?.data?.map((item) =>{
                    sendTimeMap[item.dictCode]=item.dictLabel
                })
                setSendTimeMap(sendTimeMap)
            }
        },
        //获取发货地址枚举值
        async getGoodsSendFrom() {
            const res = await ZqxProductRepository.getdictType('goods_send_from', getDomainsData()?.defaultLocale);
            let adddressMap = []
            if (res && res?.data?.code === 0 ) {
                res?.data?.data?.map((item) =>{
                    adddressMap[item.dictCode]=item.dictLabel
                })
                setAdddressMap(adddressMap)
            }
        },

        // 商品收藏
        async addProductsFavorites(productIds=[], token) {
            const res = await ProductRepository.addProductsFavorites(productIds, token);
            if(res?.code === 0) {
                setIsFavoritesSuc(true)
                return res?.data
            }
        },
        // 删除商品收藏
        async delProductsFavorites(productIds=[]) {
            const res = await ProductRepository.myFavoritesDel(productIds);
            if(res?.code === 0) {
                setIsFavoritesSuc(false)
            }
        },
        async upDateIsFavoritesSuc(flag) {
            setIsFavoritesSuc(Number(flag) === 1)
        }

    };
}