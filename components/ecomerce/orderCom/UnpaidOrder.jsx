import React from 'react';
import { connect } from 'react-redux'
import { Modal, Button } from 'antd';
import { nanoid } from 'nanoid';
import Link from 'next/link'
import { encrypt, handleMomentTime } from '~/utilities/common-helpers';
import { ACCOUNT_ORDER_DETAIL, SURCHARGE_DETAILS } from '~/utilities/sites-url'
import useLanguage from '~/hooks/useLanguage';
// 未支付订单弹窗
const UnpaidOrder = ({ visible, onCancel, orderStore }) => {
    const { i18Translate } = useLanguage();
    const { allUnpaidOrder } = orderStore
    // const { checkPaymentPending } = useAccount();
    // useEffect(() => {
    //     checkPaymentPending()
    // }, [])
    const iUnpaidOrdersTip = i18Translate('i18AboutOrder.UnpaidOrdersTip', 'You have unpaid orders.')
    const iOrderNumber = i18Translate('i18AboutOrder.Order Number', 'Order Number')
    const iOrderDate = i18Translate('i18AboutOrder.Order Date', 'Order Date')
    const iViewOrder = i18Translate('i18AboutOrder.View order', 'View order')
    const iCancel = i18Translate('i18FunBtnText.Cancel', 'Cancel')

    const getUrl = (item) => {
        const orderId = item?.orderId
        const url = orderId.includes('-') ? SURCHARGE_DETAILS : ACCOUNT_ORDER_DETAIL
        return `${url}/${encrypt(orderId?.split('-')?.[0])}`
    }

    return (
        <Modal
            centered
            title={iUnpaidOrdersTip}
            open={visible}
            onCancel={onCancel}
            closeIcon={<i className="icon icon-cross2"></i>}
            footer={null}
            className='pub-custom-input-box unpaid-order-list'
            width="590px"
        >
            <div className='heightOverflowY500'>
                {
                    allUnpaidOrder?.map(i => (
                        <div className='unpaid-order-item pub-flex-align-center' key={nanoid()}>
                            <div className='pub-font14 pub-color555'>
                                <div className='pub-flex-align-center'>
                                    <span className='pub-fontw unpaid-label'>{iOrderNumber}:</span>
                                    <Link href={`/account/order-detail/${encrypt(i?.orderId)}`}>
                                        <a className='pub-color-link pub-font16' onClick={onCancel}>{i?.orderId}</a>
                                    </Link>
                                </div>
                                <div className='pub-flex-align-center'>
                                    <span className='pub-fontw unpaid-label'>{iOrderDate}:</span>
                                    <span>{handleMomentTime(i?.createTime, 2)}</span>
                                </div>
                            </div>
        
                            <Link href={getUrl(i)}>
                                <a className='unpaid-order pub-flex-center' onClick={onCancel}>
                                    <p className='mb0 view-order'>{iViewOrder}</p>
                                    <div className='ml20 sprite-about-us sprite-about-us-1-3'></div>
                                </a>
                            </Link>
                            {/* <div className='unpaid-order pub-flex-center'>
                            View order
                            <div className='ml20 sprite-about-us sprite-about-us-1-3'></div>
                        </div> */}
                        </div>
                    ))
                }
            </div>

            <div className="ps-add-cart-footer custom-antd-btn-more">
                <Button
                    type="primary" ghost
                    className='w150'
                    onClick={onCancel}
                >{iCancel}</Button>
            </div>

        </Modal>
    );
};

export default connect((state) => state)(UnpaidOrder);