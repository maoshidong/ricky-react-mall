import { Table } from 'antd';
import { toFixed } from '~/utilities/ecomerce-helpers';
import { TABLE_COLUMN } from '~/utilities/constant';
import useLanguage from '~/hooks/useLanguage';
import { getCurrencyInfo } from '~/repositories/Utils';


const ShippingMethodsTable = ({ shippingMethodsList, loading }) => {
    const { i18Translate, curLanguageCodeZh } = useLanguage();
    const iShippingMethod = i18Translate('i18ResourcePages.Shipping Method', 'Shipping Method')
    const iCost = i18Translate('i18ResourcePages.Cost', 'Cost')
    const iIncoterms = i18Translate('i18ResourcePages.Incoterms', 'Incoterms')
    const iEstimate = i18Translate('i18ResourcePages.Estimate', 'Estimated')

    const currencyInfo = getCurrencyInfo();

    const columns = [
        {
            title: iShippingMethod,
            dataIndex: 'typeName',
            // with: '200px',
            render: (text, record) => (
                <div>{record?.deliveryList?.[0]?.typeName}</div>
            ),
            // render: (text, row) => {
            //     return (
            //         <Radio
            //             style={{marginLeft: '7px'}}
            //             checked={shippingType == 1 && row.deliveryId == shippingWay}
            //             // onChange={() => { onDeliveryChange(row) }}
            //         >{text}</Radio>
            //     )
            // },
        },
        {
            title: iCost + '(1kg)',
            dataIndex: 'usdCost',
            // render: (text, record) => (
            //     <div>{record?.deliveryList?.[0]?.usdCost}</div>
            // ),
            render: (text, record) => {
                const cost = curLanguageCodeZh() ? record?.deliveryList?.[0]?.rmbCost : record?.deliveryList?.[0]?.usdCost
                return <a>{`${currencyInfo.label}${toFixed(cost, 2)}`}</a>
            },
        },
        {
            title: iIncoterms,
            dataIndex: 'incoterms',
            render: (text, record) => <>{record?.deliveryList?.[0]?.incoterms || '-'}</>,
        },
        {
            title: iEstimate,
            dataIndex: 'estimatedTime',
            render: (text, record) => <>{record?.deliveryList?.[0]?.estimatedTime || '-'}</>
        },
    ];

    return (
        <Table
            size='small'
            loading={loading}
            pagination={false}
            columns={columns}
            rowKey={record => record.value}
            dataSource={shippingMethodsList}
            className='pub-border-table'
            style={{maxWidth: '820px'}}
            // scroll={{x: 600}}
            scroll={shippingMethodsList?.length > 0 ? { x: 600 } : null}
            // onRow={(record) => {
            //     return {
            //         onClick: (e) => { onDeliveryChange(record) }, // 点击行
            //     };
            // }}
        />
    )
}

export default ShippingMethodsTable