import { connect } from 'react-redux'
import Link from 'next/link'
import { encrypt } from '~/utilities/common-helpers';
import UnpaidOrderBtn from '~/components/ecomerce/orderCom/UnpaidOrderBtn'
import useLanguage from '~/hooks/useLanguage';

const UnpaidOrderTip = ({ orderStore }) => {
    const { i18Translate } = useLanguage();
    const { allUnpaidOrder } = orderStore

    
    const iUnpaidOrdersTip = i18Translate('i18AboutOrder.UnpaidOrdersTip', 'You have unpaid orders.')
    const iOrderNumber = i18Translate('i18AboutOrder.Order Number', 'Order Number')
    if(allUnpaidOrder?.length === 0) return null
    return (
        <div className='pub-flex-wrap unpaid-order-tip pub-flex-align-center mb10'>
            <div className='pub-flex'>
                <div className='mr10 mt4 sprite-icon4-cart sprite-icon4-cart-6-3'></div>
                <div>
                    <div className='pub-font16 pub-color18 pub-fontw'>{iUnpaidOrdersTip}</div>
                    <div>
                        <span className='pub-font14 pub-color555 pub-fontw mr20'>{iOrderNumber}: </span>
                        <Link href={`/account/order-detail/${encrypt(allUnpaidOrder[0]?.orderId)}`}>
                            <a className='pub-color-link pub-font16 pub-lh20'>{allUnpaidOrder[0]?.orderId}</a>
                        </Link>
                    </div>
                </div>
            </div>
            
            <div style={{margin: '5px auto'}}>
                <UnpaidOrderBtn />
            </div>
            
        </div>
    );
};

export default connect((state) => state)(UnpaidOrderTip);