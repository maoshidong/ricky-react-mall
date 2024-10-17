import React, { useState, useEffect, useRef } from 'react';
import { Table, Input } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import PageContainer from '~/components/layouts/PageContainer';
import MinTableProductDetail from '~/components/ecomerce/minTableCom/MinTableProductDetail';
import MinAddMoreCart from '~/components/ecomerce/minCom/MinAddMoreCart';
import MinModalTip from '~/components/ecomerce/minCom/MinModalTip'; // 公共提示 
import AccountLeft from '~/components/partials/account/accountInfo/AccountLeft';
import FloatButtons from '~/components/ecomerce/modules/FloatButtons'
import { CustomInputNumber,CustomInput } from '~/components/common';

import { getStockThousandsData } from '~/utilities/ecomerce-helpers';

import ZqxCartRepository from '~/repositories/zqx/CartRepository';

import { getEnvUrl, ACCOUNT_ORDERS_PROJECT } from '~/utilities/sites-url'
import { TABLE_COLUMN, DEL_ONE_TEXT } from '~/utilities/constant';
import {
    calculateTargetPriceTotal,
    toFixedFun,
} from '~/utilities/ecomerce-helpers';
import { handleMomentTime } from '~/utilities/common-helpers'
import useLanguage from '~/hooks/useLanguage';
import { changeServerSideLanguage, redirectLogin } from '~/utilities/easy-helpers';  
import { getCurrencyInfo } from '~/repositories/Utils';

import last from 'lodash/last';

const ProjectDetailPage = ({ paramMap }) => {
    const { i18Translate, getDomainsData } = useLanguage();
    const iDateAdded = i18Translate('i18PubliceTable.DateAdded', TABLE_COLUMN.DateCreated)

    const inputRef = useRef(null)
    const [cookies, setCookie] = useCookies(['cart']);
    const { account } = cookies;
    const Router = useRouter();
    const { query } = Router
    const projectId = Number(last(query?.slugs)) || ''
    const [projectProdect, setProjectProdect] = useState([]) // 产品列表
    const [currentProject, setCurrentProject] = useState({})
    const [isEditFileName, setIsEditFileName] = useState(false) // 修改文件名
    const [selectedRows, setSelectedRows] = useState([]); // table表格选中项

    const [removeModal, setRemoveModal] = useState(false) // 删除弹框
    const [curData, setCurData] = useState({}) // 删除弹框
		const currencyInfo = getCurrencyInfo()

    const getProjectDetail = async () => {
        const res = await ZqxCartRepository.projectProductList(account?.token, {projectId, languageType: getDomainsData()?.defaultLocale});
        if(res?.code === 0) {
            setProjectProdect(res?.data)
        }
    }
    //改变数量
    const changeQuantity = async (e, record) => {
        // const { value } = e?.target
        const arr = projectProdect?.map(item => {
            return {
                ...item,
                quantity: item?.productId === record?.productId ? e : item?.quantity,
            }
        })
        setProjectProdect(arr)
        const params = {
            id: projectId,
            infoList: [
                {
                    id: record?.id,
                    productId: record?.productId,
                    projectId,
                    quantity: e,
                }
            ],
            quantity: projectProdect?.length,
        }
        await ZqxCartRepository.updateProject(account?.token, params);

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
            id: projectId,
            deleteList: [curData?.id],
            quantity: projectProdect?.length,
        }
        const res = await ZqxCartRepository.updateProject(account?.token, params);
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

    // 表格columns
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
            dataIndex: 'projectName',
            rowKey: 'projectName',
            key: 'projectName',
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
                            // onPressEnter={() => setShowStandardPriceId(false)}
                            value={record.quantity || ' '}
                            onChange={(e) => changeQuantity(e, record)}
                            min={1}
                        /> */}
												<CustomInputNumber
												  className="form-control form-input w80"
                          type="text"
													value={record.quantity || ' '}
													onChange={(e) => changeQuantity(e, record)}
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
                <div>{getStockThousandsData(record?.stockQuantity) + ` ${iAvailable}`}</div>
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
            id: projectId,
            projectName:  value
        }
        const res = await ZqxCartRepository.updateProject(account?.token, params);
        if(res?.code === 0) {
            setCurrentProject({
                ...currentProject,
                projectName: value,
            })
        }
    }

    const getProjectList = async () => {
        const res = await ZqxCartRepository.projectList(account?.token, {projectId});
        if (res?.code == 0) {
            setCurrentProject(res?.data?.find(item => item?.id === projectId))
            // setProjectList(res?.data || [])
        }
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
        if(projectId) {
            getProjectDetail()
            getProjectList()
        }
    }, [projectId])
    
    const iReturnProject = i18Translate('i18MyAccount.Return to Project', 'Return to Project Lists')

    const iSave = i18Translate('i18FunBtnText.Save', "Save")

    const i18Title = i18Translate('i18Seo.savedProjectDetail.title', "")
    const i18Key = i18Translate('i18Seo.savedProjectDetail.keywords', "")
    const i18Des = i18Translate('i18Seo.savedProjectDetail.description', "")


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
                    <div className='pub-flex-align-center pub-cursor-pointer' onClick={() => Router.push(getEnvUrl(ACCOUNT_ORDERS_PROJECT))}>
                        <div className='ml5 mr10 sprite-bom sprite-bom-2-5'></div>
                        {iReturnProject}
                    </div>

                    <div className='mt10 pub-font18 pub-fontw'>{i18Translate('i18MyAccount.Project Detail', 'PROJECT DETAIL')}</div>

                    <div className='pub-flex-align-center pb-15 mt10 pub-border15 mb20'>
                        {/* 修改名称 */}
                        <div className='pub-flex-align-center pub-lh18'>
                            { !isEditFileName && <div className='pub-font14 pub-fontw'>
                                {currentProject?.projectName}</div> }
                            { isEditFileName && (
                                <CustomInput
                                    ref={inputRef}
                                    className="form-control form-input pub-border w260"
                                    type="text"
                                    defaultValue={currentProject.projectName}
                                    onBlur={(e) => changeFileName(e)}
                                />
                            )}
                            { !isEditFileName ? <div onClick={() => handleEditId()} className='ml20 sprite-account-icons sprite-account-icons-2-2'></div> :
                                <button
                                type="submit" ghost='true'
                                className='login-page-login-btn custom-antd-primary w50 ml15'
                            >{iSave}</button>}
                        </div>

                        <div className='pub-flex-align-center ml60 bomTime'>
                            <div className='pub-color555 pub-lh18'>{iDateAdded}: {handleMomentTime(currentProject?.createTime, 2)}</div>
                        </div>
                    </div>

                    <div className='pub-flex-between'>
                        <div></div>
												<FloatButtons isShow={selectedRows?.length>0}>
                        	<MinAddMoreCart
                            // addCartBack={() => setSelectedRows([])}
                            selectedRows={selectedRows}
                            otherParams={{
                                addText: i18Translate('i18FunBtnText.AddToCart', "Add to Cart"),
                                widthClass: 'w120',
                            }}
                            propDisabled={selectedRows?.length === 0}
                        	/>
												</FloatButtons>
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