
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Table, Form } from 'antd';
import Link from 'next/link';

import useEcomerce from '~/hooks/useEcomerce';
import useLocalStorage from '~/hooks/useLocalStorage';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';

import { calculateItemPriceTotal, toFixedFun } from '~/utilities/ecomerce-helpers';
import { onlyNumber, isIncludes, encrypt } from '~/utilities/common-helpers';
import { getEnvUrl, PRODUCTS_DETAIL, PRODUCTS } from '~/utilities/sites-url';
import { TABLE_COLUMN } from '~/utilities/constant'

import TablePriceList from '~/components/ecomerce/minCom/TablePriceList'
import MinCustomerReference from '~/components/ecomerce/minCom/MinCustomerReference';
import { CustomInputNumber } from '~/components/common';

import NormalProductRepository from '~/repositories/ProductRepository';
import { getCurrencyInfo } from '~/repositories/Utils';

// 产品搜索结果 - 调用回调函数，做了添加询价、这些处理
const ModuleProductsChoose = props => {
	const { i18Translate, getLanguageEmpty } = useLanguage();
	const { iInvalidQuantity } = useI18();
	const iMatchedPartDetail = i18Translate('i18PubliceTable.MatchedPartDetail', 'Matched Part Detail')

	const [form] = Form.useForm();
	const { saveAddToRfq, useAddMoreCart } = useEcomerce();
	const { isShowProductsChoose, productList, cancelModule, moreData, ecomerce } = props
	const [list, setList] = useState(productList)
	const [userProductTag, setUserProductTag] = useState(moreData?.userProductTag)
	const [quoteList, setQuoteList] = useLocalStorage('quoteList', new Array(5).fill({})); // 存储的询价单
	const [chooseItems, setChooseItems] = useState(quoteList || []) // 当前选中的所有

	const currencyInfo = getCurrencyInfo()
	// 输入框数量改变时
	const onChangeInput = (e, record, index) => {
		form.setFields([
			{
				name: `quantity_${index}`,
				errors: []
			},
		]);
		list.find(item => item.productId === record.productId)
		const arr = list.map(item => {
			return {
				...item,
				cartQuantity: item.productId === record.productId ? e : item.cartQuantity,
			}

		})
		setList(arr)

	}


	const handleAddItem = async (record, index) => {
		const { productId, cartQuantity } = record
		if (!cartQuantity) {
			form.setFields([
				{
					name: `quantity_${index}`,
					errors: [iInvalidQuantity]
				},
			]);
			return
		}

		await NormalProductRepository.editProductTag({
			productId: record?.productId,
			tag: userProductTag,
		});

		const params = [
			{
				id: productId, quantity: cartQuantity,
			}
		]

		useAddMoreCart(
			params,
			{ cartNo: 0 }
		);
		cancelModule();



	}
	// 是否有货
	const getIsChoose = (record) => {
		return record.quantity === 0 || !record?.pricesList || record?.pricesList?.length === 0 || record?.pricesList?.[0]?.unitPrice === 0
	}
	// 是否已经添加过
	const getIsAddRfq = (record) => {
		const isRes = chooseItems.find(item => item?.PartNumber === record?.name)
		return isRes
	}
	const handleAddQfq = (record) => {
		// if(getIsAddRfq(record)) return

		const { name, manufacturerName, cartQuantity } = record
		const params = {
			PartNumber: name,
			Manufacturer: manufacturerName,
			Quantity: cartQuantity,
		}
		setChooseItems([...chooseItems, params])
		saveAddToRfq(params)
	}

	const handleDoubleClick = e => {
		e.target.select();
	}
	const changeCustomerReference = val => {
		setUserProductTag(val)
	}


	const iProductResultsFound = i18Translate('i18AboutProduct.ProductResultsFound', 'Product Results Found For')
	const iRQFAdded = i18Translate('i18AboutProduct.RQF added', 'RQF added')
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
			width: 250,
			render: (text, record) => (
				<div className='el-product-detail'>
					<img className='el-cart-img' alt={record?.manufacturerName + '|' + record?.name} title={record?.name} src={record.image || getLanguageEmpty()} />
					<div className='ml20'>
						<div className="color-link product-name">
							{/* 产品详情页减少层级 */}
							<Link href={`${getEnvUrl(PRODUCTS_DETAIL)}/${isIncludes(record.name)}/${record?.productId}`}>
								<a className="ps-product__title" >{record.name}</a>
							</Link>
						</div>

						<div className='manufacturer mb8'>
							<span>{record?.manufacturerName}</span>
						</div>
						<MinCustomerReference record={record} changeCustomerReference={changeCustomerReference} />
					</div>
				</div>
			),
		},
		{
			title: iAvailability,
			dataIndex: 'Availability',
			key: 'Availability',
			width: 150,
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
			width: 200,
			render: (text, record) => (
				<TablePriceList pricesList={record?.pricesList} />
			),
		},

		{
			title: iQuantity,
			dataIndex: 'Quantity',
			key: 'Quantity',
			width: 130,
			render: (text, record, index) => (
				<>
					<Form
						form={form}
						className="pub-custom-input-box input-err-no-pad"
					>
						<Form.Item
							name={`quantity_${index}`}
							className="mt5 mb0"
						>
							<>
								{/* <InputNumber
                            className="form-control w100"
                            type="text"
                            placeholder={record.cartQuantity}
                            onKeyPress={onlyNumber}
                            min={1}
                            maxLength={9}
                            onDoubleClick={handleDoubleClick}
                            onChange={(e) => onChangeInput(e, record, index)}
                            // onBlur={(e) => onChangeInput(e, record, 'toAddCarts')}
                            value={record.cartQuantity}
                            // value={ecomerce.cartItems.length > 0 ? getCartQuantity(record.productId) : record.cartQuantity}
                            // min={1}
                        	/> */}
								<CustomInputNumber
									className="form-control w100"
									type="text"
									placeholder={record.cartQuantity}
									onKeyPress={onlyNumber}
									min={1}
									onDoubleClick={handleDoubleClick}
									onChange={(e) => onChangeInput(e, record, index)}
									value={record.cartQuantity}
								/>
							</>
						</Form.Item>
					</Form>
					{/* 有货 */}
					{!getIsChoose(record) &&
						<Button
							type="submit"
							className='product-primary-btn custom-antd-primary w100 mt10'
							onClick={(e) => handleAddItem(record, index)}
							disabled={getIsChoose(record)}
						>{i18Translate('i18PubliceTable.Select', 'Choose')}</Button>
					}
					{getIsChoose(record) &&
						<Button
							type="submit"
							className='product-primary-btn custom-antd-primary w100 mt10'
							onClick={(e) => handleAddQfq(record)}
							disabled={getIsAddRfq(record)}
						>
							{
								getIsAddRfq(record) && iRQFAdded
							}
							{
								!getIsAddRfq(record) && i18Translate('i18FunBtnText.ADD TO RFQ', "Add to RFQ")
							}
						</Button>
					}

					{/* </div> */}
				</>

			),
		},

		{
			title: iExtPrice,
			dataIndex: 'ExtPrice',
			key: 'ExtPrice',
			width: 110,
			render: (text, record) => (
				<>
					{currencyInfo.label}{toFixedFun(calculateItemPriceTotal(record, record.cartQuantity) || 0, 2)}
				</>
			),
		},

	]

	// 查看过多
	const getMore = () => {
		// Router.push(`/products/search?s=${modalData?.PartNumber || ''}`);
		// Router.push(`${getEnvUrl(PRODUCTS)}?keywords=${encrypt(keyword || '')}` + "&results=" + resultTotal)
	}

	const { total } = moreData

	return (
		// transitionName="" transitionName="" 和 maskTransitionName="" 去除动画 CSS，但是需要注意的是。该方法为内部方法，我们不保证下个大版本重构时该属性会被保留。
		<Modal
			centered
			open={isShowProductsChoose}
			title={total + ` ${iProductResultsFound} ` + '"' + moreData?.PartNumber + '"'}
			// open={removeModal}

			footer={null}
			onCancel={cancelModule}
			className="pub-border modal-min"
			style={{ minWidth: 950, maxWidth: '100vw' }}
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
						total > 4 ?
							{
								y: 400,
							} : {
								x: 800
							}
					}
				// style={{maxHeight: '400px', overflowY: 'scroll'}}
				/>
				<div className="ps-add-cart-footer custom-antd-btn-more" onClick={cancelModule} style={{ float: 'none' }}>
					{
						total > 20 && <Link href={`${PRODUCTS}?keywords=${encrypt(moreData?.PartNumber)}` + "&results=" + total}>
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

export default connect((state) => state)(ModuleProductsChoose);