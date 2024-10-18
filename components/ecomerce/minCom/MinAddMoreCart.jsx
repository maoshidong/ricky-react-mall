import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';
import { useRouter } from 'next/router';
import useEcomerce from '~/hooks/useEcomerce';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';

import { hasDuplicateProductId } from '~/utilities/common-helpers';
import { ACCOUNT_SHOPPING_CART } from '~/utilities/sites-url';

import AddCartPreview from '~/components/shared/blocks/add-cart-preview';
import MinModalTip from '~/components/ecomerce/minCom/MinModalTip'; // 公共提示 
import CartDuplicatePar from '~/components/ecomerce/minCom/CartDuplicatePart'

let isNewCart = false
// 添加多个产品到购物车的按钮
const MinAddCart = ({record, ecomerce, selectedRows,
    otherParams={
        initIsCartView: false,
        widthClass: 'w120',
        type: 1, // 默认1, 报价2, 3多订单
    },
    propDisabled=false,
    addCartBack,
		isShowItem=false
}) => {
    const { i18Translate } = useLanguage();
    const { useAddMoreCart } = useEcomerce();
    const { iAddCurrentCart, iAddNewCart, } = useI18();

    const { addText, initIsCartView, callBackId } = otherParams || {}
    const iAddText = addText || i18Translate('i18FunBtnText.AddToCart', 'ADD TO CART') // 按钮文本
    const Router = useRouter();
    const { allCartItems } = ecomerce

    const [isCartView, setIsCartView] = useState(initIsCartView);
    const [isShowDuplicatePart, setIsShowDuplicatePart] = useState(false); // 在购物车是否有型号
    const [isAddNewCart, setIsAddNewCart] = useState(false); // type=2时，询问用户是否新建购物车
    // const [isNewCart, setIsNewCart] = useState(false); // 点击新建购物车按钮

    // 添加购物车操作
    const handleAddItemToCart = () => {

        const params = selectedRows?.map(item => {
            const {id, productId, cartQuantity, customQuantity, quantity, pricesList } = item
            let params = {
                id: id || productId, quantity: cartQuantity || customQuantity || quantity || 1,
                callBackId: callBackId || item?.callBackId, // 报价， 多订单才有callBackId, 其它为null
                pricesList: pricesList || [],
            }
  
            let restParams = {}
            // 报价， 多订单专用传sku
            if(otherParams?.type === 2 || otherParams?.type === 3) {
                params.sku = item?.partNum + '--' + item?.manufacturer;
                restParams.sku = item?.partNum + '--' + item?.manufacturer;
            }
            // 多订单传字段 - 不需要了，后端能拿到相应字段
            // if(otherParams?.type === 3) {
            //     restParams = {
            //         ...otherParams,
            //         sendDate: item?.applyTime,
            //         applyTimeType: item?.applyTimeType,
            //     }
            // }
            return {
                ...params,
                restParams,
            }
        })

        
        useAddMoreCart(
            params,
            { type: otherParams?.type, callBackId, isNewCart, cartNo: 0 }
        );
        // 添加购物车成功的回调函数
        if(addCartBack) {
            addCartBack()
        }
    }
    // 弹出添加购物车成功后的窗口
    const handleShowCartView = () => {

        // 直接跳转到购物车 
        if(otherParams?.type === 2 || otherParams?.type === 3) {
            handleAddItemToCart('cart')    
            Router.push(ACCOUNT_SHOPPING_CART)
            return
        }
        handleAddItemToCart('cart')    
        setIsCartView(true);   
    };
    // 隐藏
    const handleHideCartView = (e) => {
        e && e?.preventDefault();
        setIsCartView(false);
    };
    // 默认类型1时执行
    const handleCart = (addType) => {
        // 添加前先判断购物车有没有相同的型号, 新建购物车时就不用判断
        const isSameProductId = hasDuplicateProductId(selectedRows, allCartItems)
        if(isSameProductId && !addType) {
            setIsShowDuplicatePart(true)
            return
        }
        handleShowCartView()
    }

    const handleAddCart = (e) => {
        // type=2时， 并且当前购物车有数量时，询问用户是否新建购物车
        if(otherParams?.type === 2 && allCartItems?.length > 0) {
            setIsAddNewCart(true)
            return
        }
        handleCart()
    }
    // 取消操作
    const cancelAddNewCart = () => {
        setIsAddNewCart(false)
        setIsShowDuplicatePart(false)
    }
    // 添加到当前购物车
    const handleOther = () => {
        isNewCart = false
        cancelAddNewCart()
        handleCart()
    }
    // 新建购物车
    const addNewCart = () => {
        isNewCart = true
        cancelAddNewCart()
        handleCart('addNewCart')
    }

    return (
        <div className="custom-antd-btn-more input-err-no-pad">
            {/* 按钮 */}
            <Button
                type="submit" ghost='true'
                // custom-antd-primary
                className={'login-page-login-btn ' + otherParams.widthClass}
                onClick={(e) => handleAddCart(e)}
                disabled={propDisabled}
                // disabled={!(quantity > 0)}
            >
							{iAddText}{isShowItem && ` (${selectedRows?.length})`}
						</Button>
            {/* 型号重复 */}
            {
                isShowDuplicatePart && <CartDuplicatePar
                    isShow={isShowDuplicatePart}
                    handleCancel={() => setIsShowDuplicatePart(false)}
                    handleConfirm={(e) => (setIsShowDuplicatePart(false), handleShowCartView())}
                />
            }
            {/* 是否新建购物车 */}
            {
                isAddNewCart && <MinModalTip
                    isShowTipModal={isAddNewCart}
                    width={430}
                    tipTitle={i18Translate('i18MyCart.Cart', 'Cart')}
                    tipText={i18Translate('i18MyCart.createNewCart', "Current cart has products, Do you want to add this product to the current cart or create a new cart?")}
                    otherText={iAddCurrentCart}
                    submitText={iAddNewCart}
                    onCancel={() => cancelAddNewCart()}
                    handleOk={() => addNewCart()}
                    handleOther={() => handleOther()}
                />
            }

            
            {isCartView && <Modal
                centered
                title={i18Translate('i18MyCart.Cart', 'CART')}
                footer={null}
                width={550}
                onCancel={(e) => handleHideCartView(e)}
                open={isCartView}
                closeIcon={<i className="icon icon-cross2"></i>}
            >
                <AddCartPreview
                    submitFn={() => {handleHideCartView();Router.push(ACCOUNT_SHOPPING_CART)}}
                    continueFn={handleHideCartView}
                    product={selectedRows[0]}
                    otherParams={{
                        type: "more",
                        addCartList: selectedRows,
                    }}
                    quantity={1}
                />
            </Modal>
            }
        </div>
    )
}

export default connect((state) => state)(MinAddCart);