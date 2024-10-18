
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Table } from 'antd';
import Link from 'next/link';
import { calculateTargetPriceTotal, calculateItemPriceTotal, toFixedFun } from '~/utilities/ecomerce-helpers';
import { onlyNumber, isIncludes, encrypt } from '~/utilities/common-helpers';
import { getEnvUrl, PRODUCTS_DETAIL, PRODUCTS } from '~/utilities/sites-url';
import { TABLE_COLUMN } from '~/utilities/constant';
import useLanguage from '~/hooks/useLanguage';
import { getCurrencyInfo } from '~/repositories/Utils';
import { CustomInputNumber } from '~/components/common';

// 产品搜索结果 - 调用回调函数，没做添加询价、这些处理 - 询价页面搜索
const ModuleProductsSearch = ({ modalData, cancelModule, chooseModule }) => {
    const { i18Translate, getLanguageEmpty } = useLanguage();
    const iMatchedPartDetail = i18Translate('i18PubliceTable.MatchedPartDetail', 'Matched Part Detail')

    const { isShowModal, productList, productTotal } = modalData
  
    const [list, setList] = useState(productList)
    const [num, setNum] = useState('')

    const currencyInfo = getCurrencyInfo()

    const onChangeInput = (e, record) => {
        list.find(item => item.productId === record.productId)
        const arr = list.map(item => {
            return {
                ...item,
                cartQuantity: item.productId === record.productId ? e : item.cartQuantity, // 不输入数量不计算金额了，所以不拿默认的cartQuantity
                curCartQuantity: item.productId === record.productId ? e : item.cartQuantity, // 不输入数量不计算金额了,
            }

        })
        setList(arr)
        setNum(e)
    }
    // 返回数据给父组件，逻辑
    const handleAddItem = record => {
        chooseModule({
            ...record,
            quantity: num,
        })
    }

    const iProductResultsFound = i18Translate('i18AboutProduct.ProductResultsFound', 'Product Results Found For')
    const iProductDetail = i18Translate('i18PubliceTable.Product Detail', TABLE_COLUMN.productDetail)
    const iAvailability = i18Translate('i18PubliceTable.Availability', 'Availability')
    const iUnitPrice = i18Translate('i18PubliceTable.UnitPrice', TABLE_COLUMN.unitPrice)
    const iQuantity = i18Translate('i18PubliceTable.Quantity', "Quantity")
    const iExtPrice = i18Translate('i18PubliceTable.ExtPrice', 'Ext. Price')
    const iContactUs = i18Translate('i18MenuText.Contact Us', 'Contact us')
    const iShipsNow = i18Translate('i18MyCart.Ships Now', 'Ships Now')
    const iMore = i18Translate('i18SmallText.More', 'More')

    const columns = [
        {
            title: iProductDetail,
            dataIndex: 'ProductDetail',
            key: 'productId',
            width: 360,
            render: (text, record) => (
                <div className='el-product-detail'>
                    <img className='el-cart-img' alt={record?.manufacturerName + '|' + record?.name} src={record.image || getLanguageEmpty()} />
                    <div className='ml20'>
                        <div className="color-link product-name">
                            {/* 产品详情页减少层级 */}
                            <Link href={`${getEnvUrl(PRODUCTS_DETAIL)}/${isIncludes(record.name)}/${record?.productId}`}>
                                <a className="ps-product__title" >{record.name}</a>
                            </Link>
                        </div>
                        
                        <div className='manufacturer'>
                            {record?.manufacturerName ?? ''}
                        </div>

                        <div className='product-detail-description'>
                            {record?.description}
                        </div>
                        {/* 不要了，减少外链 */}
                        {/* <div className='pub-flex-align-center'>
                            {record?.datasheet &&
                                <a href={record.datasheet} target="_blank">
                                    <div className='sprite-icon4-cart sprite-icon4-cart-2-1' style={{marginTop: '7px'}}></div>
                                </a>
                            }
                            {record?.rohs == 1 &&
                                <div className='sprite-icon4-cart sprite-icon4-cart-2-2 ml10' style={{marginTop: '7px'}}></div>
                            }
                        </div> */}
                    </div>
                </div>
            ),
        },
        {
            title: iAvailability,
            dataIndex: 'Availability',
            key: 'Availability',
            render: (text, record) => (
                <>
                    {
                        record?.quantity > 0 && (record?.quantity + ` ${iShipsNow}`)
                    }
                    {
                        !record?.quantity && (iContactUs)
                    }
                </>
            ),
        },
        {
            title: iUnitPrice,
            dataIndex: 'UnitPrice',
            key: 'UnitPrice',
            render: (text, record) => (
                <>
                    {
                        toFixedFun(calculateTargetPriceTotal(record) || 0, 4) > 0 && (currencyInfo.label + toFixedFun(calculateTargetPriceTotal(record) || 0, 4))
                    }
                    {
                        toFixedFun(calculateTargetPriceTotal(record) || 0, 4) <= 0 && iContactUs
                    }
                </>
            ),
        },

        {
            title: iQuantity,
            dataIndex: 'Quantity',
            key: 'Quantity',
            width: 130,
            render: (text, record) => (
                <>
                    <div className="">
                        {/* <InputNumber
                            className="form-control w100"
                            type="text"
                            placeholder={record.cartQuantity}
                            onKeyPress={onlyNumber}
                            min={1}
                            // maxLength={9}
                            onChange={(e) => onChangeInput(e, record)}
                            // onBlur={(e) => onChangeInput(e, record, 'toAddCarts')}
                            value={record.cartQuantity}
                            // value={ecomerce.cartItems.length > 0 ? getCartQuantity(record.productId) : record.cartQuantity}
                            // min={1}
                        /> */}
												<CustomInputNumber
													className="form-control w100"
													type="text"
													min={1}
													placeholder={record.cartQuantity}
													onKeyPress={onlyNumber}
													onChange={(e) => onChangeInput(e, record)}
													value={record.cartQuantity}
												/>
                        <Button
                            type="submit"
                            className='product-primary-btn custom-antd-primary w100 mt15'
                            onClick={(e) => handleAddItem(record)}
                            // disabled={record.quantity === 0}
                        >{i18Translate('i18PubliceTable.Select', 'Choose')}</Button>
                    </div>
                </>
            ),
        },

        {
            title: iExtPrice,
            dataIndex: 'ExtPrice',
            key: 'ExtPrice',
            render: (text, record) => (
                <>
                    {currencyInfo.label}
                    {record.curCartQuantity ? toFixedFun(calculateItemPriceTotal(record, record.cartQuantity) || 0, 2) : 0}
                </>
            ),
        },
    ]
    
    // 查看过多
    const getMore = () => {

    }

    return (
        <Modal
            centered
            open={isShowModal}
            title={productTotal + ` ${iProductResultsFound} ` + '"' + modalData?.PartNumber + '"'}
            footer={null}
            onCancel={cancelModule}
            className="pub-border"
            style={{ minWidth: 950 }}
            closeIcon={<i className="icon icon-cross2"></i>}
        >
            <div className="modal-matched-part custom-antd-btn-more">
                <div>{iMatchedPartDetail}</div>
                <Table
                    size="small"
                    columns={columns}
                    dataSource={list}
                    rowKey={record => record?.productId}
                    pagination={false}
                    // bordered reset-table-row
                    rowClassName=''
                    className="pub-border-table mt15 table-vertical-top"
                    scroll={
                        Number(productTotal) > 4 ? 
                        {
                           y: 400,
                        } : {}
                    }
                    // style={{maxHeight: '400px', overflowY: 'scroll'}}
                />
                <div className="ps-add-cart-footer custom-antd-btn-more"  onClick={cancelModule} style={{float:'none'}}>
                    {/* {
                        productTotal > 20 && <Button
                            type="primary" ghost
                            className='ps-add-cart-footer-btny w150'
                            onClick={getMore}
                        >查看更多</Button>
                    } */}
                    {
                        productTotal > 20 && <Link href={`${PRODUCTS}?keywords=${encrypt(modalData?.PartNumber)}` + "&results=" + productTotal }>
                            <a>
                                <Button
                                    type="primary" ghost
                                    className='ps-add-cart-footer-btny w150'
                                    onClick={getMore}
                                >{iMore}</Button>
                            </a>     
                        </Link>
                        
                    }

                    <Button
                        type="primary" ghost
                        className='ps-add-cart-footer-btn custom-antd-primary'
                    >{i18Translate('i18FunBtnText.Cancel', 'Cancel')}</Button>
                </div>
            </div>
        </Modal>
    )
}

export default connect((state) => state)(ModuleProductsSearch);