import React from 'react'
import TablePriceList from '~/components/ecomerce/minCom/TablePriceList'
import MinAddCart from '~/components/ecomerce/minCom/MinAddCart'
import MinTableQuote from '~/components/ecomerce/minCom/MinTableQuote'

// import cloneDeep from 'lodash/cloneDeep';
// import isEqual from 'lodash/isEqual'; // 使用 lodash 库中的 isEqual 方法进行深比较

// const MemoizedMinAddCart = React.memo(MinAddCart, (prevProps, nextProps) => {
//     const prevRecord = cloneDeep(prevProps.record);
//     const nextRecord = cloneDeep(nextProps.record);
//     return isEqual(prevRecord, nextRecord);
// });
const MemoizedMinAddCart = React.memo(MinAddCart);

// 阶梯价 + 添加购物车 + 添加询价
const MinTablePrice = ({ record }) => {

    // const MemoizedMinAddCart = () => {
    //     const cachedComponent = useMemo(() => <MinAddCart record={record} />, [record]);
    //     return cachedComponent;
    //   };

    return (
        <div className='pub-flex'>
            <TablePriceList pricesList={record?.pricesList || record?.voList} />
            {
                record?.pricesList?.length > 0 && (
                    <div className='mt5 ml20'>
                        <MemoizedMinAddCart record={record} />
                    </div>
                )
            }
            {
                (!(record?.pricesList?.length > 0)) && (
                    <div className='mt5 ml20'>
                        <MinTableQuote record={record} />
                    </div>
                )
            }
        </div>
    )
}

export default MinTablePrice