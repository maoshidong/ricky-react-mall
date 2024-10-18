import React, { useState, useEffect, useRef } from 'react';
import { Table, Modal, Button } from 'antd';
import { connect } from 'react-redux';
import AccountRepository from '~/repositories/zqx/AccountRepository';
import VatNumberEdit from '~/components/partials/account/modules/VatNumberEdit';
// import { handleMomentTime, scrollToTop } from '~/utilities/common-helpers';
import { TABLE_COLUMN, PUB_PAGINATION } from '~/utilities/constant';
// import useEcomerce from '~/hooks/useEcomerce';
import useLanguage from '~/hooks/useLanguage';

// 收藏列表 + 自定义标签列表
const FavoritesList = ({auth, curActive='my-favorites'}) => {
    const { i18Translate } = useLanguage();
    const iVATNumber = i18Translate('i18AboutOrder2.VAT Number', 'VAT Number')
    const iAddVATNumber = i18Translate('i18AboutOrder2.Add VAT Number', 'Add VAT Number')

    const { token } = auth
    // const isFavorites = Boolean(curActive === 'my-favorites')
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
    const [pageSize, setPageSize] =  useState(PUB_PAGINATION?.pageSize)

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
        const res = await AccountRepository.getVatNumberList(token);
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
        const res = await AccountRepository.delVatNumber({
            id: productIds
        });
        handleSucDel(res)
    }

    function openRemoveMadol(e, record) {
        e.preventDefault();
        setRemoveModal(true)
        setProductIds(record?.id)
    }
    // function openAllRemove() {
    //     setRemoveModal(true)
    //     setIsAllClear(true)
    //     if(isFavorites) {
    //         const items = myFavoritesList.map(item => {
    //             return item.productId
    //         })
    //         setProductIds(items)
    //     } else {
    //         const items = myFavoritesList.map(item => {
    //             return item.tagId
    //         })
    //         setProductIds(items)
    //     }
    // }

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
        const res = await AccountRepository.updateVatNumber(params, token);
        if(res?.code === 0) {
            getMyList();
        }
    }

    const iRemark = i18Translate('i18Form.Remark', 'Remark')
    const iOperation = i18Translate('i18PubliceTable.Operation', 'Operation')
    const iDelete = i18Translate('i18PubliceTable.Delete', TABLE_COLUMN.delete)
    const iDefault = i18Translate('i18MyAccount.Default', 'Default')
    const iSetDefault = i18Translate('i18OrderAddress.Set Default', 'Set Default')
    
    const tableColumn = [
        {
            title: iVATNumber,
            key: 'vatNumber',
            dataIndex: 'vatNumber',
            rowKey: 'vatNumber',
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
            width: TABLE_COLUMN.deleteWidth,
            dataIndex: 'ExtendedPrice',
            key: 'ExtendedPrice',
						align: 'right',
            render: (text, record) => (
                <>
                    { record?.isDefault !== 1 &&
                    <a className='pub-flex-align-center pub-flex-end' href="#" onClick={(e) => openRemoveMadol(e, record)}>
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
    let timer = useRef();
    useEffect(() => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            getMyList();
        }, 2);

        return () => {
            clearTimeout(timer.current);
          };
    }, [token, pageSize])


    return (
        <div className="product-table-container ps-section--account-setting custom-antd-btn-more pb30">
            <div className="ps-section__header">
                <div className='pub-left-title'>{iVATNumber}</div>
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
                    scroll={myFavoritesList?.length > 0 ? { x: 850 } : null}
                />

                <Button
                    type="primary"  ghost='true'
                    className='product-primary-btn custom-antd-primary mt20'
                    onClick={(e) => handleAddVatNumber(e)}
                    // disabled={isAddCart}
                >
                    <div className='pub-flex-center'>
                        <div className='sprite-account-icons sprite-account-icons-1-9 mr10'></div>
                        <div>{iAddVATNumber}</div>
                    </div>
                </Button>

            </div>

            {
                visible && (
                    <VatNumberEdit
                        visible={visible}
                        handleCancel={() => setVisible(false)}
                        handleSubmit={() => handleSubmit()}
                        otherParams = {{
                            // type: currentShippingAddress ? 'shipping' : 'billing',
                            // currentRecord,
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
                        {i18Translate('i18MyCart.ItemRemoveTip', "Are you sure you want to remove this item from your basket?")}
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

export default connect(state => state)(FavoritesList);