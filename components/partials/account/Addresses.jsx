import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useCookies } from 'react-cookie';
import { Spin, Table, Button, Modal } from 'antd';

import AccountRepository from '~/repositories/zqx/AccountRepository';
import OrderRepository from '~/repositories/zqx/OrderRepository';

import AccountMenuSidebar from './modules/AccountMenuSidebar';
import AddressModal from '~/components/partials/account/modules/AddressModal';

import { TABLE_COLUMN, DEL_ONE_TEXT } from '~/utilities/constant';
import useLanguage from '~/hooks/useLanguage';
import styles from '~/scss/module/_account.module.scss'

// 名在前，姓在后 first Name为名， last Name为姓
const Addresses = ({ token }) => {
    const { i18Translate, getDomainsData } = useLanguage();

    const [cookies, setCookie] = useCookies(['account']);
    const { account } = cookies || {}

    const [tabActive, seTabActive] = useState('1')
    const [orderTypeList, setOrderTypeList] = useState([]); // 客户类型
    const [shippingAddress, setShippingAddress] = useState([]); // 邮寄地址列表
    const [billingAddress, setBillingAddress] = useState([]); // 账单地址列表
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);

    const [removeModal, setRemoveModal] = useState(false)
    const [addressId, setAddressId] = useState([])
    const [currentRecord, setCurrentRecord] = useState({})

    const currentShippingAddress = tabActive === '1' ? true : false

    const getOrderTypeList = async () => {
        const res = await OrderRepository.getDictList('address_order_type')
        if(res?.code === 0) {
            res.data.reverse().map((item) => {
                item.value = Number(item.dictValue);
                item.label = item.dictLabel;
            })
            setOrderTypeList(res.data);
        }
    }

    const getAddress = async () => {
        const res = await AccountRepository.getAddresses(token, getDomainsData()?.defaultLocale);

        setLoading(false)
        if(res?.code === 0) {
            setShippingAddress(res?.data)
        }
    }
    const getBillingAddress = async () => {
            const res = await AccountRepository.getBillingAddresses(token, getDomainsData()?.defaultLocale);
            if(res?.code === 0) {
                setBillingAddress(res?.data)
            }
    }

    useEffect(() => {
        if(token) {
            getOrderTypeList()
            getAddress();
            getBillingAddress();
        }      
    }, [token])

    // 删除
    const handleDeliveryAddressDel = async (e) => {
        e.preventDefault();
        if(currentShippingAddress) {
            const res = await AccountRepository.deliveryAddressDel(addressId,token);
            if(res?.code === 0) {
                setRemoveModal(false)
                getAddress()
            }
        } else {
            const res = await AccountRepository.billingAddressDel(addressId,token);
            if(res?.code === 0) {
                setRemoveModal(false)
                getBillingAddress()
            }
        }
    }

    function openRemoveMadol(e, record) {
        e.preventDefault();
        if(record?.id) {
            setAddressId([record?.id])
        } else {
            const arrs = currentShippingAddress ? shippingAddress : billingAddress
            const ids = arrs?.map(i => {
                return i?.id
            })
            setAddressId(ids)
        }
        setRemoveModal(true)

    }
    const handleEdit = (e, record) => {
        e.preventDefault();
        setVisible(true)
        setCurrentRecord(record || {})
    }
    const handleSetDefault = async (e, record) => {
        e.preventDefault();
        const params = {
            ...record,
            email: account?.account,
            isDefault: 1,
            asBillingAddress: 0,
            type: currentShippingAddress ? '' : 1,
            // orderType: 0, // 客户类型
        }
        if(currentShippingAddress) {
            const res = await AccountRepository.saveOrUpdateAddress(params, token);
            if(res?.code === 0) {
                getAddress();
                getBillingAddress();
            }
        } else {
            const res = await AccountRepository.saveOrUpdateBillingAddress(params, token);
            if(res?.code === 0) {
                getAddress();
                getBillingAddress();
            }
        }
    }

    const handleSubmit = () => {
        setVisible(false)
        getAddress();
        getBillingAddress();
    }
    // const getClass = record => {
    //     const { status } = record
    //     const { quantity, sendNum, cancelQuantity } = record?.orderDetails?.[0]
    //     let className = 'pub-primary-tag'
    //     if (status === 2 || status === 3 || status === 20 || status === 30) {
    //         className = 'pub-suc-tag'
    //     }
    //     if(quantity - sendNum > cancelQuantity) {
    //         className = 'pub-tip-tag'
    //     }
    //     if (status === 40) {
    //         className = 'pub-err-tag'
    //     }
    //     return className
    // }
    // 更新时勾选账单地址一致，没有给账单地址添加操作
    // 传国家可以返回国家名称吗
    // 更新操作可以使列表没有默认地址
    const iName = i18Translate('i18OrderAddress.Name', 'Name')
    const iCity = i18Translate('i18OrderAddress.City', 'City')
    const iAddress = i18Translate('i18MyCart.Address', 'Address')
    const iEdit = i18Translate('i18OrderAddress.Edit', 'Edit')
    const iAddAddress = i18Translate('i18OrderAddress.Add Address', 'Add Address')
    const iPostalCode = i18Translate('i18OrderAddress.Postal Code', 'Postal Code')
    const iOperation = i18Translate('i18PubliceTable.Operation', 'Operation')
    const iDelete = i18Translate('i18PubliceTable.Delete', TABLE_COLUMN.delete)
    const iDefault = i18Translate('i18MyAccount.Default', 'Default')
    const iSetDefault = i18Translate('i18OrderAddress.Set Default', 'Set Default')

    const columns = [
        {
            title: iName,
            dataIndex: 'name',
            align: 'left',
            render: (text, record, index) =>
                <div className='cart-img-sort'>
                    <span>{record?.lastName} {record?.firstName}</span>
                </div>,
        },
        {
            title: iCity,
            dataIndex: 'city',
            align: 'left',
            render: (text, record, index) =>
                <div className='cart-img-sort'>
                    <span>{text}</span>
                </div>,
        },
        {
            title: iAddress,
            dataIndex: 'address',
            render: (text, record) => (
                <div>{record?.addressLine1} {record?.addressLine2}</div>
            )
        },
        {
            title: iPostalCode,
            dataIndex: 'postalCode',
            align: 'left',
            render: (text, record, index) =>
                <div className='cart-img-sort'>
                    <span>{record?.postalCode}</span>
                </div>,
        },

        {
            title: iEdit,
            dataIndex: 'Edit',
            render: (text, record) => (
                <div className='pub-flex-align-center'>
                    <div className='sprite-account-icons-2-1' onClick={(e) => handleEdit(e, record)}></div>
                </div>
            )
        },
        {
            title: iOperation,
            dataIndex: 'Operation',
            width: 100,
            render: (text, record) => 
                {
                    const elm = record?.isDefault ? <span className='pub-primary-tag'>{iDefault}</span> :
                                                <span className='pub-color-link' onClick={(e) => handleSetDefault(e, record)}>{iSetDefault}</span>
                    return elm
                },            
        },
        {
            // <div onClick={(e) => openRemoveMadol(e)} className='sprite-icon4-cart sprite-icon4-cart-3-7 sprite-icon4-cart-3-6'></div>
            title: iDelete,
            width: TABLE_COLUMN.deleteWidth,
            dataIndex: 'ExtendedPrice',
            key: 'ExtendedPrice',
						align: 'right',
            render: (text, record) => 
                // { 
                //     const elm = <div className='pub-font16' onClick={(e) => openRemoveMadol(e, record)}>
                //         <div className='sprite-icon4-cart sprite-icon4-cart-3-6'></div>
                //     </div>
                //     return elm
                // }
                { 
                    const elm = record?.isDefault !== 1 ? <div className={'pub-font16 pub-flex-end' + (record?.isDefault ? 'pub-cursor-not-allowed' : '')} onClick={(e) => openRemoveMadol(e, record)}>
                        <div className='sprite-icon4-cart sprite-icon4-cart-3-6'></div>
                    </div> : ''
                    return elm
                }
            ,
        },
    ]

    const isShowNoAddress = (tabActive == '1' && shippingAddress?.length === 0) || (tabActive == '2' && billingAddress?.length === 0)
    const iMyAccount = i18Translate('i18MyAccount.My Account', 'My account')
    const iAddressBook = i18Translate('i18MyAccount.Address Book', 'Address Book')
    const iAddressesIntroduce = i18Translate('i18MyAccount.AddressesIntroduce', 'Addresses may be used for any of invoicing, delivery, and billing purposes.')
    const iShippingAddress = i18Translate('i18OrderAddress.Shipping Address', 'Shipping Address')
    const iBillingAddress = i18Translate('i18OrderAddress.Billing Address', 'Billing Address')

    return (
        <section className="ps-my-account ps-page--account pub-minh-1 custom-antd-btn-more">
            <div className={`ps-container ${styles.addressesBook}`}>
                <div className='account-title pub-fontw pub-color18'>{iMyAccount}</div>
                <div className='account-box'>
                    <div className="ps-page__left catalogs__top-fixed" style={{padding: '0'}}>
                        <AccountMenuSidebar currentLink={'/account/addresses'} />
                    </div>
                    <div className='ml20 ps-page__right'>
                        <div className="ps-page__content">
                            <div className='mb20'>
                                <div className='pub-left-title mb10'>{iAddressBook}</div>
                                <div className='pub-color555 mb-5'>{iAddressesIntroduce}</div>
                            </div>

                            <div className="ps-section--account-setting">
                                <div className={`ps-section__header ${styles.addressesBookTabs}`}>
                                    <div className='cart-tabs'>
                                        <div
                                            className={'cart-tabs-item ' + (tabActive == '1' ? 'cart-tabs-active' : '')}
                                            onClick={() => seTabActive('1')}
                                        >{iShippingAddress}</div>
                                        <div
                                            className={'cart-tabs-item ' + (tabActive == '2' ? 'cart-tabs-active' : '')}
                                            onClick={() => seTabActive('2')}
                                        >{iBillingAddress}</div>
                                    </div>
                                </div>
                                <Spin spinning={loading}>
                                    <div className="ps-section__content pt-5" style={{backgroundColor: 'transparent', padding: 0}}>
                                        <div>
                                            {/* 无地址 */}
                                            {
                                                isShowNoAddress && (
                                                    <div className={`pub-flex-center ${styles.noAddresses}`} onClick={() => (setVisible(true), setCurrentRecord({}))}>
                                                        <div className={styles.noAddressesCon}>
                                                            <div className='sprite-account-icons sprite-account-icons-2-8 ant-menu-item-icon'></div>
                                                            <div className='mt10 pub-font14 pub-fontw pub-color-link'>{iAddAddress}</div>
                                                        </div>
                                                    </div>
                                                   
                                                )
                                            }
                    
                                            {
                                                !isShowNoAddress &&  (
                                                    <Table
                                                        size='small'
                                                        columns={columns}
                                                        scroll={{x: 750}}
                                                        loading={loading}
                                                        dataSource={tabActive == '1' ? shippingAddress : billingAddress}
                                                        className='pub-border-table box-shadow'
                                                        rowKey={record => record.id}
                                                        pagination={false}
                                                    />
                                                )
                                            }

                                            {
                                                !isShowNoAddress && (
                                                    <Button
                                                        // type="primary"
                                                        type="submit" ghost='true'
                                                        className='mt20 custom-antd-primary'
                                                        onClick={() => (setVisible(true), setCurrentRecord({}))}
                                                    >
                                                        <div className='pub-flex-center'>
                                                            <div className='sprite-account-icons sprite-account-icons-1-9 mr10'></div>
                                                            <div>{iAddAddress}</div>
                                                        </div>  
                                                    </Button>
                                                )
                                            }

                                            {
                                                visible && (
                                                    <AddressModal
                                                        visible={visible}
                                                        handleCancel={() => setVisible(false)}
                                                        handleSubmit={() => handleSubmit()}
                                                        orderTypeList={orderTypeList}
                                                        otherParams = {{
                                                            type: currentShippingAddress ? 'shipping' : 'billing',
                                                            currentRecord,
                                                            addressList: currentShippingAddress ? shippingAddress : billingAddress,
                                                        }}
                                                    />
                                                )
                                            }
                                        </div>
                                    </div>
                                </Spin>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                title={i18Translate('i18MyCart.REMOVE AN ITEM', "REMOVE AN ITEM")}
                open={removeModal}
                footer={null}
                width="440px"
                style={{
                    top: 300,
                }}
                onCancel={() => setRemoveModal(false)}
            >
                <div className='custom-antd-btn-more'>
                    <div>
                        {i18Translate('i18MyCart.ItemRemoveTip', DEL_ONE_TEXT)}
                    </div>
                    <div className='ps-add-cart-footer mt50'>

                        <Button
                            type="primary" ghost='true'
                            className='login-page-login-btn ps-add-cart-footer-btn w90'
                            onClick={() => setRemoveModal(false)}
                        >{i18Translate('i18FunBtnText.Cancel', "Cancel")}</Button>
                        <button
                            type="submit" ghost='true'
                            className='login-page-login-btn ps-add-cart-footer-btn custom-antd-primary w90'
                            onClick={(e) => handleDeliveryAddressDel(e)}
                        >
                            {i18Translate('i18FunBtnText.Confirm', "Confirm")}
                        </button>
                    </div>
                </div>
            </Modal>
        </section>
    );
}

export default connect((state) => state.auth)(Addresses);
