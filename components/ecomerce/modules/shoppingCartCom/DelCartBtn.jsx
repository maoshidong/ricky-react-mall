import { useState } from "react"
import { Button, Modal } from 'antd'
import { TABLE_COLUMN } from '~/utilities/constant';
import CartRepository from '~/repositories/zqx/CartRepository';
import { useCookies } from 'react-cookie';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';

const DelCartBtnCom = ({
    curCartItems,
    cartSelectedRows,
    curCartNo="",
    getList, getSpareList,
    handShowTip, // 操作没有产品id的提示
}) => {
    const { iDeleteSelected } = useI18();
    const { i18Translate } = useLanguage();
    const [removeModal, setRemoveModal] = useState(false) // 删除弹窗


    const [cookies, setCookie] = useCookies(['account']);

    const handDeleteSelected = () => {
        setRemoveModal(true)
    }
    const handleRemoveCancel = () => {
        setRemoveModal(false)
    }
    const handleRemoveOk = async () => {
        setRemoveModal(false)
        const cartIdList = cartSelectedRows.map(item => {
            return item.cartId
        })
        if(cartIdList?.length > 0) {

            const res = await CartRepository.removeCarts(cookies?.account?.token, {
                cartIdList,
            }, curCartNo)
            if (res && res.code == 0) {
                getList()
                getSpareList()
                // if (isAllClear) {
                //     removeItems('cart') DelCartBtn
                // } else {
                //     removeItem({ id: delCartId }, allCartItems, 'cart');
                // }
            }
        }
    }
    async function handleSaveLaterOk() {
        setRemoveModal(false)
        // return
        // // 全部saveLater
        // if (isAllClear) {
        //     const arr = curCartNo ? spareCartList : allCartItems
        //     const items = arr.map(item => {
        //         return {
        //             productId: item.productId,
        //             quantity: item.cartQuantity,
        //         }
        //     })
        //     handleChangeCartLocation(items, curCartNo)
        // } else {
        //     saveLater(curpProductId, curCartNo)
        // }
    }

    // 改变购物车数据存储位置
    const handleChangeCartLocation = async (items, fromCartNo, record = {}, cartData) => {
        let items = []
         cartSelectedRows?.map(item => {
            if(item?.productId < 0) return
            items.push({
                productId: item.productId,
                quantity: item.cartQuantity,
            })
        })
        // 有产品id小于0的
        if(items?.length < cartSelectedRows?.length) {
            handShowTip()

        }
        if(items?.length > 0) {
            const params = {
                fromCartNo: curCartNo,
                items,
                toCartNo: 1,
            }
    
            const res = await CartRepository.changeCartLocation(cookies?.account?.token, params)
    
            if (res && res.code == 0) {
                setRemoveModal(false)
                getList()
                getSpareList()
            }
        }
        // 成功弹窗
        // if (fromCartNo == 1 && curActive === 'save-for-later') {
        //     setIsCartView(true)
        //     if (record?.productId) {
        //         setSelectedRecord([record])
        //     }
        // }
    }

    return <><Button
        type="primary" ghost='true'
        className='login-page-login-btn ps-add-cart-footer-btn'
        onClick={handDeleteSelected}
        disabled={cartSelectedRows?.length === 0}
    >

        <div className='pub-flex-center'>
            <div className={`sprite-icon4-cart ` + (cartSelectedRows?.length === 0 ? 'sprite-icon4-cart-3-6' : 'sprite-icon4-cart-3-7')}></div>
            <div className='ml10'>
                {i18Translate('i18PubliceTable.Delete', TABLE_COLUMN.delete)}
            </div>
        </div>
    </Button>

                            {/* <Button
                                type="primary" ghost='true'
                                className='login-page-login-btn ps-add-cart-footer-btn'
                                // onClick={handleRemoveCancel}
                                disabled={cartSelectedRows?.length === 0}
                            >{i18Translate('i18PubliceTable.Delete', TABLE_COLUMN.delete)}</Button> */}


            <Modal
                okText={i18Translate('i18MyCart.Remove', "Remove")}
                title={i18Translate('i18MyCart.Remove', "Delete Line Item(s)")}
                open={removeModal}
                footer={null}
                width="450px"
                style={{
                    top: 300,
                }}
                onCancel={handleRemoveCancel}
                closeIcon={<i className="icon icon-cross2"></i>}
            >
                <div className='custom-antd-btn-more'>
                    <div style={{ color: '#181818', fontSize: '13px' }}>
                        {i18Translate('i18MyCart.DelTheseTip', "Are you sure you want to delete these item(s)?")}
                    </div>
                    <div className='ps-add-cart-footer' style={{ marginTop: '50px' }}>
                        {
                            curCartNo !== 1 && (
                                <Button
                                    type="primary" ghost='true'
                                    className='login-page-login-btn ps-add-cart-footer-btn w150 pub-flex-align-center'
                                    onClick={handleChangeCartLocation}
                                >

                                    <div className='sprite-icon4-cart sprite-icon4-cart-3-9'></div>
                                    <div className='ml10'>{i18Translate('i18MyCart.Saved For Later', "Saved For Later")}</div>
                                </Button>
                            )
                        }

                        <Button
                            type="primary" ghost='true'
                            className='login-page-login-btn mr10 ml10'
                            onClick={handleRemoveCancel}
                        >{i18Translate('i18FunBtnText.Cancel', 'Cancel')}</Button>
                        <button
                            type="submit" ghost='true'
                            className='login-page-login-btn custom-antd-primary w110 ml10'
                            onClick={handleRemoveOk}
                        >
                            {iDeleteSelected}
                        </button>
                        
                    </div>
                </div>
            </Modal>
            </>
}

export default DelCartBtnCom