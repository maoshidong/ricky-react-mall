import { Modal, Button } from 'antd';
import Link from 'next/link';
import useLanguage from '~/hooks/useLanguage';
import { useRouter } from 'next/router';
import { ACCOUNT_SHOPPING_CART } from '~/utilities/sites-url'

// 添加购物车重复弹窗
const CartDuplicatePartCom = ({ isShow, handleCancel, handleConfirm }) => {
    const { i18Translate } = useLanguage();
    const iDuplicatePartTit = i18Translate('i18MyCart.DuplicatePartTit', 'DUPLICATE PART REMINDER')
    const iDuplicatePartDes = i18Translate('i18MyCart.DuplicatePartDes', 'This part number already exists in your cart. If you proceed, duplicated parts and their quantities will be combined and displayed as single line items.')
    const iViewCart = i18Translate('i18MenuText.View Cart', 'View Cart')
    // DuplicatePartTit  DuplicatePartDes
    const Router = useRouter();
    return (
            <Modal
                centered
                title={iDuplicatePartTit}
                footer={null}
                width={500}
                onCancel={(e) => handleCancel(e)}
                open={isShow}
                closeIcon={<i className="icon icon-cross2"></i>}
            >
                <div className='pub-lh20'>{iDuplicatePartDes}</div>

                <div className="ps-add-cart-footer custom-antd-btn-more" style={{float:'none'}}>
                    <Button
                        type="primary" ghost
                        className='ps-add-cart-footer-btn'
                        onClick={() => { handleCancel ? handleCancel() : null}}
                    >{i18Translate('i18FunBtnText.Cancel', 'Cancel')}</Button>
                    <Button
                        type="primary" ghost
                        className='ps-add-cart-footer-btn'
                        // onClick={() => Router.push(`/account/shopping-cart`)}
                    >
                        <Link href={ACCOUNT_SHOPPING_CART}>{iViewCart}</Link>
                    </Button>
                    <Button
                        type="primary" ghost
                        className='custom-antd-primary ps-add-cart-footer-btn'
                        onClick={() => { handleConfirm ? handleConfirm() : null}}
                    >{i18Translate('i18FunBtnText.AddToCart', 'ADD TO CART')}</Button>
                </div>
            </Modal>
    )
}

export default CartDuplicatePartCom