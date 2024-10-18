import React, { useState, useEffect, useRef } from 'react';
import { Table, Modal, Button } from 'antd';
import { connect } from 'react-redux';
import AccountRepository from '~/repositories/zqx/AccountRepository';
import OrderRepository from '~/repositories/zqx/OrderRepository';
import FreighAccountsEdit from '~/components/partials/account/modules/FreighAccountsEdit';
import { TABLE_COLUMN, DEL_ONE_TEXT, DEL_ALL_TEXT } from '~/utilities/constant';
import useLanguage from '~/hooks/useLanguage';

// import { handleMomentTime, scrollToTop } from '~/utilities/common-helpers'
// import { PUB_PAGINATION } from '~/utilities/constant'
// import useEcomerce from '~/hooks/useEcomerce';

// 收藏列表 + 自定义标签列表
const FreighAccounts = ({auth, curActive='my-favorites'}) => {
    const { i18Translate } = useLanguage();
    const iAddAnAccount = i18Translate('i18AboutOrder2.Add an Account', "Add an Account")
    const iOther = i18Translate('i18SmallText.Other', "Other")

    
    const { token } = auth
    const isFavorites = Boolean(curActive === 'my-favorites')
    // const { sendTimeMap, adddressMap } = useEcomerce();

    const [loading, setLoading] = useState(false);
    const [isAllClear, setIsAllClear] = useState(false)
    const [productIds, setProductIds] = useState([])
    const [removeModal, setRemoveModal] = useState(false)

    const [visible, setVisible] = useState(false);

    const [myFavoritesList, setmyFavoritesList] = useState([])
    // const [total, setTotal] =  useState(0)
    // const [pages, setPages] =  useState(1)
    // const [pageNum, setPageNum] =  useState(PUB_PAGINATION?.pageNum)
    // const [pageSize, setPageSize] =  useState(PUB_PAGINATION?.pageSize)

    const [custDeliveryList, setCustDeliveryList] = useState([]);

    const handleList = res => {
        setLoading(false)
        if(res?.code === 0) {
            // const { data, total, pages } = res?.data
            setmyFavoritesList(res?.data)
            // setTotal(total)
            // setPages(pages)
            // scrollToTop()
        }
    }
    const getMyList = async () => {
        if (!token) {
            return false;
        }
        setLoading(true)
        const res = await AccountRepository.getDeliveryList(token);
        handleList(res)
    }


    function handleRemoveCancel() {
        setRemoveModal(false)
        setProductIds([])
        setIsAllClear(false)
    }
    // 删除成功后
    const handleSucDel = res => {
        if (res && res.code == 0) {
            getMyList()
            handleRemoveCancel()
        }
    }
    async function handleRemoveOk() {
        const res = await AccountRepository.delDelivery({
            id: productIds
        });
        handleSucDel(res)
    }

    function openRemoveMadol(e, record) {
        e.preventDefault();
        setRemoveModal(true)
        setProductIds(record?.id)
    }

    const handleAddVatNumber = () => {
        setVisible(true)
    }

    const handleSubmit = () => {
        setVisible(false)
        getMyList();
    }

    const handleSetDefault = async (e, record) => {
        e.preventDefault();
        const params = {
            ...record,
            isDefault: 1,
        }
        const res = await AccountRepository.updateDelivery(params, token);
        if(res?.code === 0) {
            getMyList();
        }
    }

    const getShippingDeliveryList = async () => {
        const res = await OrderRepository.getDictList('sys_custom_shipping_delivery')
        res.data.map(item => {
            item.value = item.dictCode + ""
            item.label = item.dictValue
        })
        setCustDeliveryList(
            [
                ...res.data,
                {value: 0, label: iOther}
            ]
        )
    }
    const iShippingOptions = i18Translate('i18MyAccount.Shipping Options', 'Shipping Options')
    const iRemark = i18Translate('i18Form.Remark', 'Remark')
    const iOperation = i18Translate('i18PubliceTable.Operation', 'Operation')
    const iDelete = i18Translate('i18PubliceTable.Delete', TABLE_COLUMN.delete)
    const iDefault = i18Translate('i18MyAccount.Default', 'Default')
    const iSetDefault = i18Translate('i18OrderAddress.Set Default', 'Set Default')
    const tableColumn = [
        {
            title: iShippingOptions,
            key: 'shippingType',
            dataIndex: 'shippingType',
            rowKey: 'shippingType',
            render: (text, record) => (
                <>{custDeliveryList.find(i => i?.value == text)?.label}</>
            ),
        },
        {
            title: i18Translate('i18AboutOrder2.Courier Account', "Courier Account"),
            key: 'account',
            dataIndex: 'account',
            rowKey: 'account',
            render: (text, record) => (
                <>{text}</>
            ),
        },
        {
            title: iRemark,
            key: 'remark',
            dataIndex: 'remark',
            rowKey: 'remark',
            render: (text, record) => (
                <>{text}</>
            ),
        },
        
        {
            title: iOperation,
            dataIndex: 'Operation',
            width: 130,
            render: (text, record) => 
                {
                    const elm = record?.isDefault ? <span className='pub-primary-tag'>{iDefault}</span> :
                                                <span className='pub-color-link' onClick={(e) => handleSetDefault(e, record)}>{iSetDefault}</span>
                    return elm
                },
        },

        {
            title: iDelete,
            dataIndex: 'ExtendedPrice',
            key: 'ExtendedPrice',
            width: TABLE_COLUMN.deleteWidth,
						right: 'right',
            render: (text, record) => (
                <>
                    { record?.isDefault !== 1 &&
                        <a className='pub-font16 pub-flex-end' href="#" onClick={(e) => openRemoveMadol(e, record)}>
                            <div className='sprite-icon4-cart sprite-icon4-cart-3-6'></div>
                        </a>
                    }

                </>
            ),
        },
    ]

    useEffect(() => {
        getMyList()
    }, [token])
    useEffect(() => {
        getShippingDeliveryList()
    }, [])
    let timer = useRef();
    useEffect(() => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            getMyList();
        }, 2);

        return () => {
            clearTimeout(timer.current);
          };
    }, [token])

    const iFreightAccounts = i18Translate('i18MyAccount.Freight Accounts', 'Freight Accounts')
    return (
        <div className="product-table-container ps-section--account-setting custom-antd-btn-more pb30">
            <div className="ps-section__header">
                <div className='pub-left-title'>{iFreightAccounts}</div>
            </div>
            <div>
                <Table
                    loading={loading}
                    columns={tableColumn}
                    dataSource={myFavoritesList}
                    rowKey={record => record.id}
                    size='small'
                    pagination={false}
                    sticky
                    className='pub-border-table table-vertical-top box-shadow'
                    scroll={myFavoritesList?.length > 0 ? { x: 850 } : {x: 750}}
                />

                <Button
                    type="primary" 
                    ghost='true'
                    className='product-primary-btn custom-antd-primary mt20'
                    onClick={(e) => handleAddVatNumber(e)}
                    // disabled={isAddCart}
                >
                    <div className='pub-flex-center'>
                        <div className='sprite-account-icons sprite-account-icons-1-9 mr10'></div>
                        <div>{iAddAnAccount}</div>
                    </div>
                </Button>

            </div>

            {
                visible && (
                    <FreighAccountsEdit
                        visible={visible}
                        handleCancel={() => setVisible(false)}
                        handleSubmit={() => handleSubmit()}
                        otherParams = {{
                            custDeliveryList,
                            list: myFavoritesList,
                        }}
                    />
                )
            }

            <Modal
                title={isAllClear ? i18Translate('i18MyCart.REMOVE ALL ITEMS', "REMOVE ALL ITEMS") : i18Translate('i18MyCart.REMOVE AN ITEM', "REMOVE AN ITEM")}
                open={removeModal}
                footer={null}
                width={isAllClear ? "440px" : "420px"}
                centered
                onCancel={handleRemoveCancel}
                closeIcon={<i className="icon icon-cross2"></i>}
            >
                <div className='custom-antd-btn-more'>
                    <div>
                        {isAllClear
                            ? DEL_ALL_TEXT
                            : i18Translate('i18MyCart.ItemRemoveTip', DEL_ONE_TEXT)}
                    </div>
                    <div className='ps-add-cart-footer'>

                        <Button
                            type="primary" ghost='true'
                            className='login-page-login-btn ps-add-cart-footer-btn w90'
                            onClick={handleRemoveCancel}
                        >{i18Translate('i18FunBtnText.Cancel', "Cancel")}</Button>
                        <button
                            type="submit" ghost='true'
                            className='login-page-login-btn ps-add-cart-footer-btn custom-antd-primary w90'
                            onClick={handleRemoveOk}
                        >
                            {i18Translate('i18FunBtnText.Confirm', "Confirm")}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default connect(state => state)(FreighAccounts);