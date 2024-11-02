import React, { useState, useEffect, useRef } from 'react';
import { Table, Button } from 'antd'; //Input
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';

import PageContainer from '~/components/layouts/PageContainer';
import MinTableProductDetail from '~/components/ecomerce/minTableCom/MinTableProductDetail';
import MinAddMoreCart from '~/components/ecomerce/minCom/MinAddMoreCart';
import MinModalTip from '~/components/ecomerce/minCom/MinModalTip';
import MakeCartActive from '~/components/shared/blocks/add-cart-preview/MakeCartActive'
import MergeCart from '~/components/shared/blocks/add-cart-preview/MergeCart'
import AccountLeft from '~/components/partials/account/accountInfo/AccountLeft';
import { CustomInputNumber, CustomInput } from '~/components/common';

import { getStockThousandsData } from '~/utilities/ecomerce-helpers';

import ZqxCartRepository from '~/repositories/zqx/CartRepository';

import { getEnvUrl, ACCOUNT_ORDERS_CART, ACCOUNT_SHOPPING_CART } from '~/utilities/sites-url'
import { TABLE_COLUMN, DEL_ONE_TEXT } from '~/utilities/constant';
import {
    calculateTargetPriceTotal, toFixedFun,
} from '~/utilities/ecomerce-helpers';
import { handleMomentTime } from '~/utilities/common-helpers'
import useLanguage from '~/hooks/useLanguage';
import useEcomerce from '~/hooks/useEcomerce';
import { changeServerSideLanguage, redirectLogin } from '~/utilities/easy-helpers';  
import { getCurrencyInfo } from '~/repositories/Utils';

import last from 'lodash/last';

const ProjectDetailPage = ({ paramMap }) => {
    const { i18Translate, getDomainsData } = useLanguage();
    const iDateAdded = i18Translate('i18PubliceTable.DateAdded', TABLE_COLUMN.DateCreated)
    // const iMergeCarts = i18Translate('i18MyAccount.Merge Carts', 'Merge Carts')
    const iMakeCartActive = i18Translate('i18MyAccount.Make Cart Active', 'Make Cart Active')
    const {  addToLoadCarts, setCurCartDataHok } = useEcomerce();

    const inputRef = useRef(null)
    const [cookies] = useCookies(['cart']);
    const { account } = cookies;
    const Router = useRouter();
    const { query } = Router
    const cartId = Number(last(query?.slugs)) || ''
    const [projectProdect, setProjectProdect] = useState([])
    const [currentProject, setCurrentProject] = useState({})
    const [isEditFileName, setIsEditFileName] = useState(false) // 修改文件名
    const [selectedRows, setSelectedRows] = useState([]); // table表格选中项

    const [removeModal, setRemoveModal] = useState(false) // 删除弹框
    const [curData, setCurData] = useState({}) // 删除弹框

    // 激活弹窗
    const [isShowModal, setIsShowModal] = useState(false)
    const [isShowTipModal, setIsShowTipModal] = useState(false) // 提示modal

    
    // 合并
    const [isMergeTip, setIsMergeTip] = useState(false) // 没有勾选时提示
    const [isMerge, setIsMerge] = useState(false)

		const currencyInfo = getCurrencyInfo()

    const getProjectDetail = async () => {
        const res = await ZqxCartRepository.userCartProductListBasket(account?.token, {cartId, languageType: getDomainsData()?.defaultLocale});
        if(res?.code === 0) {
            setProjectProdect(res?.data)
        }
    }
    //改变数量
    const changeQuantity = async (e, record) => {

        const { value } = e?.target
        const arr = projectProdect?.map(item => {
            return {
                ...item,
                quantity: item?.productId === record?.productId ? value : item?.quantity,
            }
        })
        setProjectProdect(arr)
        const params = {
            id: cartId,
            infoList: [
                {
                    id: record?.id,
                    productId: record?.productId,
                    cartId,
                    quantity: value,
                }
            ],
            quantity: projectProdect?.length,
        }
        await ZqxCartRepository.updateUserCartBasket(account?.token, params);

    }
    const openRemoveMadol = (e, record) => {
        e?.preventDefault();
        setRemoveModal(true)
        setCurData(record)
        // setDelChooseData([record])
    }

    const handleRemoveCancel = () => {
        setRemoveModal(false)
        setCurData({})
        // setDelChooseData([])
    }
    const handleRemoveOk = async () => {
        const params = {
            id: cartId,
            deleteList: [curData?.id],
            quantity: projectProdect?.length,
        }
        const res = await ZqxCartRepository.updateUserCartBasket(account?.token, params);
        if(res?.code === 0) {
            handleRemoveCancel()
            getProjectDetail()
        }
    }
    const iSort = i18Translate('i18PubliceTable.Sort', "Sort")
    const iProductDetail = i18Translate('i18PubliceTable.Product Detail', "Product Detail")
    const iQuantity = i18Translate('i18PubliceTable.Quantity', "Quantity")
    const iAvailability = i18Translate('i18PubliceTable.Availability', TABLE_COLUMN.availability)
    const iAvailable = i18Translate('i18PubliceTable.Available', 'Available')
    const iUnitPrice = i18Translate('i18PubliceTable.UnitPrice', TABLE_COLUMN.unitPrice)
    const iOperation = i18Translate('i18PubliceTable.Operation', TABLE_COLUMN.operation)
    const iDelete = i18Translate('i18PubliceTable.Delete', TABLE_COLUMN.delete)

    const columns = [
        {
            title: iSort,
            dataIndex: 'index',
            align: 'left',
            width: 70,
            render: (text, record, index) =>
                <div className='cart-img-sort'>
                    <span>{index + 1}</span>
                </div>,
        },
        {
            title: iProductDetail,
            dataIndex: 'cartName',
            rowKey: 'cartName',
            key: 'cartName',
            width: 450,
            render: (text, record) => {
                return  <MinTableProductDetail
                    record={record}
                    otherProps={{
                        showImage: true,
                        showDatasheetRohs: false,
                    }}
                    showCustomerReference={true}
                />
            },
        },
        {
            title: iQuantity,
            dataIndex: 'quantity',
            rowKey: 'quantity',
            key: 'quantity',
            render: (text, record) => (
                <>
                    <div className="form-group--number pub-border-table-border-b">
                        {/* <InputNumber
                            className="form-control form-input w80"
                            type="text"
                            maxLength={9}
                            // onChange={(e) => onChangeInput(e, record, {
                            //     cartNo: 0,
                            // })}
                            // onKeyDown
                            // onPressEnter={() => setShowStandardPriceId(false)} onBlur
                            value={record.quantity || ' '}
                            onBlur={(e) => changeQuantity(e, record)}
                            min={1}
                        /> */}
												<CustomInputNumber
												  className="form-control form-input w80"
													type="text"
													value={record.quantity || ' '}
													onBlur={(e) => changeQuantity(e, record)}
													min={1}
												/>
                    </div>
                </>
            )
        },
        {
            title: iAvailability,
            dataIndex: 'quantity',
            rowKey: 'quantity',
            key: 'quantity',
            render: (text, record) => (
                <div>{record?.stockQuantity?getStockThousandsData(record?.stockQuantity) + ` ${iAvailable}`:''}</div>
            ),
        },
        {
            title: iUnitPrice,
            dataIndex: 'UnitPrice',
            key: 'UnitPrice',
            render: (text, record) => (
                <>
                    {currencyInfo.label}{
                        toFixedFun(calculateTargetPriceTotal(record) || 0, 4)
                    }
                </>
            ),
        },
        {
            title: iOperation,
            render: (text, record) => (
                <MinAddMoreCart
                    // addCartBack={() => setSelectedRows([])}
                    selectedRows={[{
                        ...record,
                        cartQuantity: record?.quantity,
                    }]}
                    otherParams={{
                        addText: i18Translate('i18FunBtnText.AddToCart', "Add to Cart"),
                        widthClass: 'w110',
                    }}
                    // propDisabled={selectedRows?.length === 0}
                />
                // <button
                //     type="submit" ghost='true'
                //     className='login-page-login-btn custom-antd-primary w110'
                // >Add to Cart</button>
            ),
        },
        // {
        //     title: 'Visited',
        //     dataIndex: 'createTime',
        //     rowKey: 'createTime',
        //     key: 'createTime',
        //     render: (text) => (
        //         <>{handleMomentTime(text)}</>
        //     ),
        // },

        {
            title: iDelete,
            dataIndex: 'del',
            key: 'del',
            width: TABLE_COLUMN.deleteWidth,
            render: (text, record) => (
                <>
                    <div className='pub-font16' onClick={(e) => openRemoveMadol(e, record)}>
                        <div className='sprite-icon4-cart sprite-icon4-cart-3-6'></div>
                    </div>
                </>
            ),
        },
    ]

    // 加上选择
    const rowSelection = {
        columnWidth: '45px', // 设置行选择列的宽度为 cartQuantity
        onChange: (selectedRowKeys, selectedRows) => {
            const arr = selectedRows?.map(item => {
                return {
                    ...item,
                    cartQuantity: item?.quantity,
                }
            })
            setSelectedRows(arr)
        },
    };

    const changeFileName = async (e) => {
        setIsEditFileName(false)
        const { value } = e.target
        const params = {
            id: cartId,
            cartName:  value
        }
        const res = await ZqxCartRepository.updateUserCartBasket(account?.token, params);
        if(res?.code === 0) {
            setCurrentProject({
                ...currentProject,
                cartName: value,
            })
        }
        
    }

    const getProjectList = async () => {
        const res = await ZqxCartRepository.userCartListBasket(account?.token, {cartId});
        if (res?.code == 0) {
					setCurCartDataHok()
            setCurrentProject(res?.data?.find(item => item?.id === cartId) || {})
            // setProjectList(res?.data || [])
        }
    }
    // 合并购物车
    const handleMergeCarts = async () => {
        if(selectedRows?.length > 0) {
            setIsMerge(true)
        } else {
            setIsMergeTip(true)
        }
    }
    // 购物车确认合并
    const handleSureMergeCarts = async () => {

        const infoList = selectedRows?.map(item => {
            return {
                productId: item?.productId,
                quantity: item?.quantity,
            }
        })
        const mergeList = selectedRows?.map(item => {
            return item?.id
        })
        const params = {
            // mergeList,
            infoList,
        }
        const res = await ZqxCartRepository.mergeUserCartToMainCartBasket(account?.token, params);
        if (res?.code == 0) {
            setIsMerge(false)
            Router.push(getEnvUrl(ACCOUNT_SHOPPING_CART))
        }
    }
    // 购物车激活
    const handleActive = async () => {
        setIsShowModal(true)
    }

    // 购物车确认激活
    const handleCartActive = async () => {

        setCurCartDataHok(currentProject || {})
        addToLoadCarts('', cartId)
        setIsShowModal(false)
        Router.push(getEnvUrl(ACCOUNT_SHOPPING_CART))
        
        // const infoList = projectProdect?.map(item => {
        //     return {
        //         productId: item?.productId,
        //         quantity: item?.quantity,
        //     }
        // })
        // const params = {
        //     id: cartId,
        //     infoList,
        // }
        // const res = await ZqxCartRepository.activeUserCartToMainCart(account?.token, params);
        // if (res?.code == 0) {
        //     Router.push(getEnvUrl(ACCOUNT_SHOPPING_CART))
        // }
    }

    const handleEditId = () => {
        setIsEditFileName(!isEditFileName)
    }
    useEffect(() => {
        if(isEditFileName) {
            inputRef?.current?.focus()
        }
    }, [isEditFileName])

    useEffect(() => {
        if(cartId) {
            getProjectDetail()
            getProjectList()
        }
    }, [cartId])
    const iActiveTip1 = i18Translate('i18MyAccount.ActiveTip1', 'You must first select a cart to make active.')
    const iActiveTip2 = i18Translate('i18MyAccount.ActiveTip2', 'You may only make one cart active at any given time. Please correct your selection.')
    const iReturnSavedCarts = i18Translate('i18MyAccount.Return to Saved Carts', 'Return to Cart Lists')

    const iMergeTip3 = i18Translate('i18MyAccount.MergeTip3', 'You must select one or more carts to merge your carts.')
    const iSave = i18Translate('i18FunBtnText.Save', "Save")

    const i18Title = i18Translate('i18Seo.savedCartDetail.title', "")
    const i18Key = i18Translate('i18Seo.savedCartDetail.keywords', "")
    const i18Des = i18Translate('i18Seo.savedCartDetail.description', "")

    return (
        <PageContainer paramMap={paramMap}>
            <Head>
                <title>{i18Title}</title>
                <meta property="og:title" content={i18Title} key="og:title" />
                <meta name="keywords" content={i18Key} key="keywords" />
                <meta name="description" content={i18Des} key="description" />
                <meta name="og:description" content={i18Des} key="og:description" />
            </Head>
            <AccountLeft>
                <div className='pub-bgc-f5 pub-minh-1 pt-15'>
                    <div className='product-table-container ps-container custom-antd-btn-more pub-bgcdf5 pb60'>
                        
                        <div className='pub-flex-align-center pub-cursor-pointer' onClick={() => Router.push(getEnvUrl(ACCOUNT_ORDERS_CART))}>
                            <div className='ml5 mr10 sprite-bom sprite-bom-2-5'></div>
                            {iReturnSavedCarts}
                        </div>

                        <div className='mt10 pub-font18 pub-fontw'>
                            {i18Translate('i18MyAccount.Saved Cart Detail', 'SAVED CART DETAIL')}</div>

                        <div className='pub-flex-align-center pb-15 mt10 pub-border15 mb20'>
                            <div className='pub-flex-align-center pub-lh18'>
                                {/* { !isEditFileName && <div onClick={() => setIsEditFileName(!isEditFileName)} className='pub-font14 pub-fontw'>{currentProject?.cartName}</div> } */}
                                { !isEditFileName && <div className='pub-font14 pub-fontw'>{currentProject?.cartName}</div> }
                                { isEditFileName && (
                                    <CustomInput
                                        ref={inputRef}
                                        className="form-control form-input pub-border w260"
                                        type="text"
                                        defaultValue={currentProject.cartName}
                                        onBlur={(e) => changeFileName(e)}
                                    />
                                )}
                                { !isEditFileName ? <div onClick={() => handleEditId()} className='ml20 sprite-account-icons sprite-account-icons-2-2'></div> :
                                    <button
                                    type="submit" ghost='true'
                                    className='login-page-login-btn custom-antd-primary w50 ml15'
                                >{iSave}</button>}
                                {/* <div onClick={() => handleEditId()} className='ml20 sprite-account-icons sprite-account-icons-2-2'></div> */}
                            </div>
                            <div className='pub-flex-align-center ml60 bomTime'>
                                <div className='pub-color555 pub-lh18'>{iDateAdded}: {handleMomentTime(currentProject?.createTime, 2)}</div>
                            </div>
                        </div>

                        <div className='pub-flex-between pub-custom-input-box '>
                            <div></div>

                            <div className='mt3'>
                                {/* 暂时去掉 */}
                                {/* <Button
                                    ghost='true'
                                    className='login-page-login-btn mr20 w120'
                                    onClick={() => handleMergeCarts() }
                                >{iMergeCarts}</Button> */}
                                <Button
                                    ghost='true'
                                    className='login-page-login-btn custom-antd-primary w150'
                                    onClick={() => handleActive() }
                                >{iMakeCartActive}</Button>
                            </div>
                        </div>

                        <Table
                            sticky
                            columns={columns}
                            rowSelection={{
                                ...rowSelection,
                            }}
                            dataSource={projectProdect}
                            rowKey={record => record.id}  
                            size='small'
                            className='pub-border-table mt10'
                            pagination={false}
                            scroll={projectProdect?.length > 0 ? { x: 1000 } : {x: 750}}
                            scrollToFirstRowOnChange={true} // 	当分页、排序、筛选变化后是否滚动到表格顶部
                        />
                    </div>
                </div>
            </AccountLeft>
            {/* 合并提示 */}
            {
                isMergeTip && <MinModalTip
                    isShowTipModal={isMergeTip}
                    width={430}
                    onCancel={() => setIsMergeTip(false)}
                    tipTitle={i18Translate('i18MyAccount.Merge Carts', 'MERGE CARTS')}
                    tipText={iMergeTip3}
                />
            }
            {/* 合并 */}
            {
                isMerge && <MergeCart
                    isShowModal={isMerge}

                    onCancel={() => setIsMerge(false)}
                    handleOk={() => handleSureMergeCarts()}
                    projectProdect={selectedRows || []}
                />
            }
            {/* 激活 */}
            {
                isShowModal && <MakeCartActive
                    isShowModal={isShowModal}
                    onCancel={() => setIsShowModal(false)}
                    handleOk={() => handleCartActive()}
                    projectProdect={projectProdect || []}
                />
            }

            {/* 激活提示 */}
            {
                isShowTipModal && <MinModalTip
                    isShowTipModal={isShowTipModal}
                    width={430}
                    tipTitle={i18Translate('i18MyAccount.Merge Carts', 'MERGE CARTS')}
                    tipText={selectedRows?.length === 0 ? iActiveTip1 : iActiveTip2}

                    onCancel={() => setIsShowTipModal(false)}
                    // handleOk={() => setIsShowModal(true)}
                >
                </MinModalTip>
            }

            {
                removeModal && <MinModalTip
                    isShowTipModal={removeModal}
                    width={440}
                    tipTitle={i18Translate('i18MyCart.REMOVE AN ITEM', "REMOVE AN ITEM")}
                    tipText={i18Translate('i18MyCart.ItemRemoveTip', DEL_ONE_TEXT)}

                    onCancel={() => handleRemoveCancel()}
                    handleOk={() => handleRemoveOk()}
                >
                </MinModalTip>
            }

            {/* <Modal
                title='REMOVE AN ITEM'
                open={removeModal}
                footer={null}
                width="440"
                centered
                onCancel={handleRemoveCancel}
                closeIcon={<i className="icon icon-cross2"></i>}
            >
                <div className='custom-antd-btn-more'>
                    <div>
                        {DEL_ONE_TEXT}
                    </div>
                    <div className='ps-add-cart-footer'>

                        <Button
                            type="primary" ghost='true'
                            className='login-page-login-btn ps-add-cart-footer-btn w90'
                            onClick={handleRemoveCancel}
                        >Cancel</Button>
                        <button
                            type="submit" ghost='true'
                            className='login-page-login-btn ps-add-cart-footer-btn custom-antd-primary w90'
                            onClick={handleRemoveOk}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </Modal> */}

        </PageContainer>
    );
};

export default ProjectDetailPage;

export async function getServerSideProps({ req }) {
    const translations = await changeServerSideLanguage(req)
    // 判断是否登录,否则重定向到login
    const { account="" } = req.cookies
    const isAccountLog = account.trim() !== "" && JSON.parse(account)?.isAccountLog
    if(!isAccountLog) {
        return redirectLogin()
    }

    return {
        props: {
            ...translations,
        }
    }
}