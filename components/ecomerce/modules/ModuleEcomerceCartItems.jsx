import React, { useState, useEffect, useRef } from 'react';
import { connect, useDispatch } from 'react-redux';
import { withCookies, useCookies } from 'react-cookie';
import Link from 'next/link';

import cloneDeep from 'lodash/cloneDeep';

import useEcomerce from '~/hooks/useEcomerce';
import useClickLimit from '~/hooks/useClickLimit';
import useLanguage from '~/hooks/useLanguage';
import useAccount from '~/hooks/useAccount';


import { useRouter } from 'next/router';
import { setAllCartItems, setSpareCartList } from '~/store/ecomerce/action';
import { Button, Modal, Table, Spin } from 'antd';
import { CustomInput, Flex, ManufacturerNav } from '~/components/common';
import {
	calculateTargetPriceTotal,
	calculateItemPriceTotal, toFixedFun
} from '~/utilities/ecomerce-helpers';
import { onlyNumber, isIncludes, getExpiresTime } from '~/utilities/common-helpers';
import { TABLE_COLUMN } from '~/utilities/constant';
import { PRODUCTS_DETAIL, ACCOUNT_CART_HASH } from '~/utilities/sites-url'
import CartRepository from '~/repositories/zqx/CartRepository';

import { getCurrencyInfo } from '~/repositories/Utils';
import dynamic from 'next/dynamic'
const ShareCart = dynamic(() => import('~/components/ecomerce/modules/shoppingCartCom/ShareCart')); // 分享
const DownloadCart = dynamic(() => import('~/components/ecomerce/modules/shoppingCartCom/DownloadCart')); // 下载
const AddNewCarts = dynamic(() => import('~/components/ecomerce/modules/shoppingCartCom/AddNewCarts')); // 新建购物车
const AddMoreItems = dynamic(() => import('~/components/ecomerce/modules/shoppingCartCom/AddMoreItems')); // 添加更多型号
const MinTableStandardPrice = dynamic(() => import('~/components/ecomerce/minTableCom/MinTableStandardPrice')); // 阶梯价
import CartListEmpty from '~/components/partials/account/CartListEmpty'
import MinCustomerReference from '~/components/ecomerce/minCom/MinCustomerReference';
import LeadTimeEstimates from '~/components/ecomerce/cartCom/LeadTimeEstimates'
import AddCartPreview from '~/components/shared/blocks/add-cart-preview' // 添加购物车成功弹窗
import CartDuplicatePar from '~/components/ecomerce/minCom/CartDuplicatePart' // 购物车重复
import ModalMoq from '~/components/ecomerce/modules/ModalMoq' // 最小订货量
import AddToProject from '~/components/ecomerce/cartCom/CartProject/AddToProject' // 添加项目
import SavedCarts from '~/components/ecomerce/cartCom/cartBasket/SavedCarts' // 添加购物车篮子
import DelCartBtn from '~/components/ecomerce/modules/shoppingCartCom/DelCartBtn' // 删除购物车数据按钮
import MinModalTip from '~/components/ecomerce/minCom/MinModalTip' // 提示框
import FloatButton from '~/components/ecomerce/modules/FloatButton'
import FloatButtons from '~/components/ecomerce/modules/FloatButtons'

const ModuleEcomerceCartItems = (props) => {
	const { i18Translate, getLanguageEmpty, getDomainsData } = useLanguage();
	const { anonymousAuthLoginHooks } = useAccount();
	const [cookies, setCookie] = useCookies(['account', 'cart', 'cur_cart_data']);

	const { paramMap, ecomerce, auth, laterCheckMore, curActive, serverAllCartItems = [] } = props;
	const { isAccountLog } = auth
	const dispatch = useDispatch();

	const { useAddCart, useAddMoreCart, newAddUserCart } = useEcomerce();
	const Router = useRouter();
	const { token, cartNo } = Router?.query; // 分享url中的token
	const { allCartItems, spareCartList, curCartData } = ecomerce
	const [containerBtns, setContainerBtns] = useState(null);

	const [loading, setloading] = useState(false)

	const [showSpecificProduct, setShowSpecificProduct] = useState(false) // 特殊产品提示
	const [pageCartList, setPageCartList] = useState(serverAllCartItems || allCartItems); // 购物车
	const [cartSelectedRows, setCartSelectedRows] = useState([]); // 主购物车勾选
	const [selectedRows, setSelectedRows] = useState([]); // 备用购物车勾选
	const [bList, setBList] = useState(spareCartList || [])
	const [isSearch, setIsSearch] = useState(false)
	const manuRef = useRef()

	// 购物车弹窗, 
	const [isCartView, setIsCartView] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState([]); // 当前选择的购物车型号


	const [isShowDuplicatePart, setIsShowDuplicatePart] = useState(false); // 购物车重复时弹窗
	const [duplicatePart, setDuplicatePart] = useState({});

	const [isShowModal, setIsShowModal] = useState(false) // 最小订货量
	const [currentCart, setCurrentCart] = useState({})
	const [currentCartObject, setCurrentCartObject] = useState({}) // 主购物车or备用购物车


	const [leadTimeEstimatesData, setLeadTimeEstimatesData] = useState({}); // 检查交货期数据
	const [isLeadTimeEstimates, setIsLeadTimeEstimates] = useState(false); // 检查交货期
	const [isShowStandardPrice, setIsShowStandardPrice] = useState(true); // 阶梯价
	const [showStandardPriceId, setShowStandardPriceId] = useState(''); // 哪个产品显示阶梯价

	const [limitDisabled, handleLimitClick, handleLimitDisabled] = useClickLimit();
	const [addToSpareCartLimit, setAddToSpareCartLimit] = useState(false); // 购物车到备用限制多点

	const currencyInfo = getCurrencyInfo()

	const getList = async () => {
		const flag = allCartItems.length > 0 ? false : true
		setCartSelectedRows([]) // 清除勾选
		setloading(flag)
		// 限制按钮多次点击
		await handleLimitClick(async () => {
			setAddToSpareCartLimit(true)
			const res = await CartRepository.loadCarts(
				cookies?.account?.token, cookies?.cur_cart_data?.id,
				getDomainsData()?.defaultLocale,
			);
			setloading(false)
			if (res.code == 0) {
				const { data } = res

				setPageCartList(data);
				dispatch(setAllCartItems(data));
				// 主购物车为空，清除
				if (data?.length === 0) {
					setCookie('cart', [], { path: '/', expires: getExpiresTime(30) });
				}
			}
			setAddToSpareCartLimit(false)
		})
	}

	// 更新备用购物车
	const getSpareList = async (obj) => {
		setAddToSpareCartLimit(true)
		setSelectedRows([]) // 清除勾选
		const res = await CartRepository.loadCarts(cookies?.account?.token, 1, getDomainsData()?.defaultLocale, obj?.manufacturerId || '', obj?.keywordList || []);
		if (res?.code == 0) {
			dispatch(setSpareCartList(res.data));
		}
		setAddToSpareCartLimit(false)
	}

	// 购物车数量改变
	const onChangeInput = (e, item, object) => {
		e.preventDefault();
		const { value } = e.target;
		const arr = object.cartNo === 1 ? spareCartList : allCartItems

		let tmpValue = value || 0;
		// 只取int
		if (value && value.replace(/[^0-9]/ig, "")) {
			tmpValue = value.replace(/[^0-9]/ig, "");
		}

		const cartQuantity = object?.group ? (parseInt(tmpValue) || 1) : parseInt(tmpValue)
		// 先判断最小订货量
		const minQUantity = Number(item.pricesList?.[0]?.quantity)
		const isFlag = Number(cartQuantity) < minQUantity // 小于最小订货量
		// : Number(cartQuantity) > minQUantity ? Number(cartQuantity) : minQUantity

		// 购物车输入框失去焦点
		if (object?.group === 'toAddCarts' && isFlag) {
			setIsShowModal(true)
			setCurrentCart(item)
			setCurrentCartObject(object)
			return
		}

		useAddCart([{
			cartId: item.cartId,
			productId: item.productId,
			callBackId: item.callBackId || null, // 报价的
			cartQuantity,
		}], arr, object)
	}

	// 关闭最小订货量弹窗
	const closeModalMoq = (params, type, isUpdate) => {
		setIsShowModal(false)
		const arrCart = currentCartObject.cartNo === 1 ? spareCartList : allCartItems
		if (isUpdate) {
			useAddCart(
				params,
				arrCart,
				{
					...currentCartObject, type
				},
			);
		} else {
			getList()
		}
	}

	// 勾选添加到备用
	const handleSaveLaterBtn = () => {
		let items = []
		cartSelectedRows?.map(item => {
			if (item?.productId < 0) return
			items.push({
				productId: item.productId,
				quantity: item.cartQuantity,
			})
		})
		// 有产品id小于0的
		if (items?.length < cartSelectedRows?.length) {
			setShowSpecificProduct(true)

		}
		if (items?.length > 0) {
			handleChangeCartLocation(items, cookies?.cur_cart_data?.id)
		}
	}

	// 添加分享链接cartNo中的产品到购物车
	const addShareCart = async (newToken) => {
		const token = Router?.query?.token.split(' ').join('+')
		const res = await CartRepository.shareCarts(token, {
			cartNo: Router?.query?.cartNo, token, languageType: getDomainsData()?.defaultLocale,
		})
		if (res.code === 0) {
			const params = res?.data?.map(item => {
				const { productId, cartQuantity } = item
				return {
					id: productId, quantity: cartQuantity,
				}
			})
			if (params.length === 0) return
			useAddMoreCart(
				params,
				{
					cartNo: 0,
					newToken,
				}
			);
		}

	}
	// 匿名登录
	const anonymousAuthLogin = async () => {
		await anonymousAuthLoginHooks()
		if (token && cartNo) {
			addShareCart(res.data)
		}
	}

	useEffect(() => {
		if (!cookies?.account?.token) {
			anonymousAuthLogin()
			return
		}

		if (token && cartNo) {
			addShareCart()
		}
	}, [Router?.query])

	// 添加前先判断购物车有没有相同的型号
	const handleiSSameProductId = (items, fromCartNo, record, cartData) => {
		if (fromCartNo == 1) {
			// 添加前先判断购物车有没有相同的型号
			const isSameProductId = allCartItems?.find(item => item?.productId === record?.productId)
			if (isSameProductId) {
				const params = {
					fromCartNo: fromCartNo,
					items,
					toCartNo: fromCartNo ? curCartData?.id : 1,
					record,
				}
				setIsShowDuplicatePart(true)
				setDuplicatePart(params)
				return
			} else {
				handleChangeCartLocation(items, fromCartNo, record, cartData)
			}
		}
	}

	// 改变购物车数据存储位置
	const handleChangeCartLocation = async (items, fromCartNo, record = {}, cartData) => {
		let _toCartNo = fromCartNo === 1 ? (curCartData?.id || cartData?.id) : 1

		if (!_toCartNo) {
			const _dt = items?.map(ms => {
				return {
					productId: ms.productId,
					quantity: ms.cartQuantity || ms.quantity || 1
				}
			})
			const carDt = await newAddUserCart("", _dt)
			_toCartNo = carDt?.id
		}

		const params = {
			fromCartNo: fromCartNo || curCartData?.id || cartData?.id, // 从哪到哪
			items,
			// toCartNo: fromCartNo === 1 ? (curCartData?.id || cartData?.id) : 1,
			toCartNo: _toCartNo,
		}

		handleLimitDisabled(true)
		setloading(true)
		const res = await CartRepository.changeCartLocation(cookies?.account?.token, params)
		handleLimitDisabled(false)
		setloading(false)
		if (res && res.code == 0) {
			getList()
			getSpareList()
		}

		// 成功弹窗
		if (fromCartNo == 1 && curActive === 'save-for-later') {
			setIsCartView(true)
			if (record?.productId) {
				setSelectedRecord([record])
			}
		}
	}


	// 主购物车保存到备用
	const saveLater = async (record, fromCartNo = 0) => {
		if (limitDisabled || addToSpareCartLimit) return // 限制多次点击
		handleLimitDisabled(true)
		const items = [
			{
				productId: record.productId,
				quantity: record.cartQuantity,
			}
		]
		// 当购物车没有产品时新建,
		if (!curCartData?.id) {
			const cartData = await newAddUserCart("", items)

			if (fromCartNo == 0) {
				handleChangeCartLocation(items, fromCartNo, record, cartData)
			} else {
				handleiSSameProductId(items, fromCartNo, record, cartData)
			}
			return
		}

		if (fromCartNo == 0) {
			handleChangeCartLocation(items, fromCartNo, record)
		} else {
			handleiSSameProductId(items, fromCartNo, record)
		}

	}

	const spareAddToCart = () => {
		const items = selectedRows.map(item => {
			return {
				...item,
				productId: item.productId,
				quantity: item.cartQuantity,
			}
		})
		setSelectedRecord(items)
		handleChangeCartLocation(items, 1, {})
	}

	const iShipsNow = i18Translate('i18MyCart.Ships Now', 'Ships Now')
	const iBackordered = i18Translate('i18MyCart.Backordered', 'Backordered')
	// 立即发货与延迟发货数量, 有applyTime时间就是延期发货 

	const iSort = i18Translate('i18PubliceTable.Sort', "Sort")
	const iProductDetail = i18Translate('i18PubliceTable.Product Detail', "Product Detail")
	const iQuantity = i18Translate('i18PubliceTable.Quantity', "Quantity")
	const iAvailability = i18Translate('i18PubliceTable.Availability', TABLE_COLUMN.availability)
	const iUnitPrice = i18Translate('i18PubliceTable.UnitPrice', TABLE_COLUMN.unitPrice)
	const iExtPrice = i18Translate('i18PubliceTable.ExtPrice', 'Ext. Price')
	// const iSpare = i18Translate('i18MyCart.Spare', 'Spare')

	const iMoveToCart = i18Translate('i18MyCart.Move to Cart', 'Move to Cart')
	// 勾选
	const cartRowSelection = {
		// columnWidth: '60px', // 设置行选择列的宽度为 cartSelectedRows productId
		selectedRowKeys: cartSelectedRows?.map(item => item?.productId), // 选中的key集合
		onChange: (selectedRowKeys, selectedRow) => {
			setCartSelectedRows(selectedRow)
		},
	};

	// 重新请求供应商
	const handleFetchData = () => {
		if (manuRef.current) {
			setTimeout(() => {
				manuRef?.current?.fetchData(6)
			}, 500)
		}
	}

	const columns = [
		{
			title: iSort,
			dataIndex: 'index',
			align: 'left',
			width: 130,
			render: (_text, record, index) =>
				<div className='cart-img-sort'>
					<span>{index + 1}</span>
					<img className='cart-img' src={record.image || getLanguageEmpty()} style={{ width: '70px', height: '70px' }} />
				</div>,
		},
		{
			title: iProductDetail,
			dataIndex: 'ProductDetail',
			key: 'productId',
			width: 230,
			render: (_text, record) => (
				<Flex flex justifyCenter column className='product-detail' style={{ height: '100%', width: '100%' }}>
					<Flex column>
						<div className=" product-name">
							{
								record?.productId > 0 ? <Link href={`${PRODUCTS_DETAIL}/${isIncludes(record.productName)}/${record?.productId}`}>
									<a target='_blank' className="ps-product__title color-link" >{record.productName}</a>
								</Link> : record.productName
							}
						</div>
						<div className='manufacturer'>
							<span>{record?.manufacturerName ?? ''}</span>
						</div>
					</Flex>
					<MinCustomerReference record={record} />
				</Flex>
			),
		},
		{
			title: iQuantity,
			dataIndex: 'Quantity',
			key: 'Quantity',
			width: 130,
			render: (text, record) => (
				<>
					<div className="form-group--number pub-border-table-border-b">
						<CustomInput
							className="form-control form-input w80"
							type="text"
							maxLength={9}
							placeholder={record.cartQuantity}
							onChange={(e) => onChangeInput(e, record, {
								// cartNo: 0,
							})}
							// 取消焦点
							onBlur={(e) => (
								onChangeInput(e, record, {
									// cartNo: 0,
									group: 'toAddCarts',
								}),
								setShowStandardPriceId('') // 隐藏
							)}
							// type 3, 多订单不能修改数量
							readOnly={record?.type === 3}
							// 回车与得到焦点，处理阶梯价
							onPressEnter={() => setShowStandardPriceId(false)}
							onFocus={() => setShowStandardPriceId(record?.cartId)}
							value={record.cartQuantity || ' '}
						/>

						{(showStandardPriceId === record?.cartId) && <MinTableStandardPrice
							isShoeModal={isShowStandardPrice}
							pricesList={record?.pricesList} // 阶梯价
							cartQuantity={record.cartQuantity}
							onCancel={() => setIsShowStandardPrice(false)}
						/>
						}
					</div>
				</>
			),
		},
		{
			title: iAvailability,
			dataIndex: 'Availability',
			key: 'Availability',
			width: 140,
			render: (text, record) => {
				const { cartQuantity, quantity, sendDate } = record
				return <>
					{/* {availabilityNum(record)} */}
					{/* 库存和购物车数量做对比，展示发货数量和是否延期发货， 有sendDate时间就是延期发货 */}
					{sendDate && <div> 0 - {iShipsNow}</div>}
					{/* 不延期且库存大于购物车数量 */}
					{(cartQuantity > quantity && !sendDate) && <div> {quantity} - {iShipsNow}</div>}
					{/* 不延期且库存小于购物车数量 */}
					{(cartQuantity <= quantity && !sendDate) && <div> {cartQuantity} - {iShipsNow}</div>}
					{/* 延期 */}
					{(cartQuantity > quantity || sendDate) && <div
						className='pub-danger pub-cursor-pointer'
						onClick={() => (setIsLeadTimeEstimates(true), setLeadTimeEstimatesData(record))}
					> {sendDate ? quantity : (cartQuantity - quantity)} - {iBackordered}</div>
					}

				</>
			},
		},
		{
			title: iUnitPrice,
			dataIndex: 'UnitPrice',
			key: 'UnitPrice',
			width: 80,
			render: (text, record) => (
				<>
					{currencyInfo.label}{
						toFixedFun(calculateTargetPriceTotal(record) || 0, 4)
					}
				</>
			),
		},
		{
			title: iExtPrice,
			dataIndex: 'ExtendedPrice',
			key: 'ExtendedPrice',
			width: 100,
			align: 'right',
			render: (text, record) => (
				<>
					{currencyInfo.label}{toFixedFun(calculateItemPriceTotal(record, record.cartQuantity) || 0, 2)}
				</>
			),
		},
	]

	const spareColumns = [
		{
			title: iSort,
			dataIndex: 'index',
			align: 'left',
			render: (text, record, index) =>
				<div className='cart-img-sort'>
					<span>{index + 1}</span>
					<img className='cart-img' src={record.image || getLanguageEmpty()} style={{ width: '70px', height: '70px' }} />
				</div>,
		},
		{
			title: iProductDetail,
			dataIndex: 'ProductDetail',
			key: 'productId',
			render: (text, record) => (
				<div className='product-detail'>
					<div className="color-link product-name">
						{/* 产品详情页减少层级 */}
						<Link href={`${PRODUCTS_DETAIL}/${isIncludes(record.productName)}/${record?.productId}`}>
							<a target='_blank' className="ps-product__title" >{record.productName}</a>
						</Link>
					</div>
					<div className='manufacturer mb8'>
						<span>{record?.manufacturerName ?? ''}</span>
					</div>
					<MinCustomerReference record={record} />
				</div>
			),
		},
		{
			title: iQuantity,
			dataIndex: 'Quantity',
			key: 'Quantity',
			render: (text, record) => (
				<>
					<div className="form-group--number">
						<CustomInput
							className="form-control form-input"
							type="text"
							onKeyPress={onlyNumber}
							maxLength={9}
							placeholder={record.cartQuantity}
							onChange={(e) => onChangeInput(e, record, {
								cartNo: 1,
							})}
							onBlur={(e) => onChangeInput(e, record, {
								cartNo: 1,
								group: 'toAddCarts',
							})}
							value={record.cartQuantity || ' '}
							// value={ecomerce.cartItems.length > 0 ? getCartQuantity(record.productId) : record.cartQuantity}
							style={{ width: '80px' }}
						// min={1}
						/>
					</div>
				</>
			),
		},
		{
			title: iAvailability,
			dataIndex: 'Availability',
			key: 'Availability',
			render: (text, record) => {
				const { cartQuantity, quantity } = record
				return <>
					{/* <div>{record?.quantity ?? 0} In Stock</div> */}
					{cartQuantity > quantity && <div> {quantity} - {iShipsNow}</div>}
					{cartQuantity <= quantity && <div> {cartQuantity} - {iShipsNow}</div>}
					{cartQuantity > quantity && <div className='pub-danger'> {cartQuantity - quantity} - {iBackordered}</div>}
				</>
			},
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
			title: iExtPrice,
			dataIndex: 'ExtendedPrice',
			key: 'ExtendedPrice',
			render: (text, record) => (
				<>
					{currencyInfo.label}{toFixedFun(calculateItemPriceTotal(record, record.cartQuantity) || 0, 2)}
				</>
			),
		},
		{
			title: iMoveToCart,
			dataIndex: 'index',
			align: 'right',
			render: (text, record) =>
				<div>
					<Button
						type="submit" ghost='true'
						className='login-page-login-btn '
						onClick={() => {
							saveLater(record, 1)
							const _list = cloneDeep(bList)
							_list.shift()
							setBList(_list)
							handleFetchData()
						}}
					>
						{iMoveToCart}
					</Button>
				</div>
		},
	]

	const rowSelection = {
		selectedRowKeys: selectedRows?.map(item => item?.productId), // 选中的key集合
		onChange: (selectedRowKeys, selectedRows) => {
			setSelectedRows(selectedRows)
		},
		getCheckboxProps: (record) => ({
			disabled: record.name === 'Disabled User',
			name: record.name,
		}),
		// renderCell: (checked, record, index, originNode) => {
		//     if (curActive != '1') {
		//       return null;
		//     }
		//     return originNode;
		//   },
	};

	const handleManufacturerFilters = (value) => {
		setIsSearch(true)
		// 更新备用购物车
		getSpareList(value)
	}

	useEffect(async () => {
		getList();
		getSpareList();
	}, []);

	useEffect(async () => {
		if (pageCartList !== allCartItems) {
			setPageCartList(allCartItems)
		}
	}, [allCartItems]);

	// 展示购物车
	const isShowCart = curActive === ACCOUNT_CART_HASH && (pageCartList.length > 0 || (cookies?.cart && cookies?.cart?.length !== 0))
	// 展示空
	const isShowViewProduct = curActive === ACCOUNT_CART_HASH && !isShowCart

	return <div className='shopping-cart-box'>
		<Spin spinning={false}>
			{
				isShowCart && (
					<div className='product-table-container table-no-scroll' ref={setContainerBtns}>
						<div className='ps-table-top-button' style={{ position: 'relative' }}>
							<div className='ps-items-num pub-flex-align-center'>
								<div className='sprite-icon4-cart sprite-icon4-cart-3-1'></div>
								{i18Translate('i18MyCart.Cart', "Cart")}: <span className='pub-fontw ml10'>{allCartItems.length} {i18Translate('i18SmallText.Items', "Item(s)")}</span>
							</div>

							<div className='pub-flex' style={{ gap: "30px" }}>
								<ShareCart />
								<DownloadCart allCartItems={allCartItems} />
								<AddNewCarts />
							</div>
						</div>
						<Table
							size='small'
							sticky
							columns={columns}
							rowSelection={{
								...cartRowSelection,
							}}
							loading={loading}
							dataSource={pageCartList}
							className='pub-border-table box-shadow'
							rowKey={record => record.productId}
							pagination={false}
							locale={{ emptyText: '' }}
						// scroll={pageCartList?.length > 0 ? { x: 600 } : null} // 手机端正常，但是阶梯价被隐藏
						/>
						{/* offsetTop={70} offsetBottom={260} */}
						{/* <Affix> sticky-box pub-btn-fixed */}
						{/* <WithScrollDistance> */}
						{/* <Affix target={() => containerBtns}> */}
						<FloatButton
							CartNo={cookies?.cur_cart_data?.id}
							allCartItems={allCartItems}
							cartSelectedRows={cartSelectedRows}
							getList={getList}
							getSpareList={getSpareList}
							onSave={handleSaveLaterBtn}
							onDelete={() => setShowSpecificProduct(true)}
						/>
						{/* <div className={(cartSelectedRows?.length > 0 ? 'sticky-box' : '') + ' mt20'}>
							<div>
							<Button
								type="primary" ghost='true'
								className='login-page-login-btn ps-add-cart-footer-btn mr20'
								onClick={handleSaveLaterBtn}
								disabled={cartSelectedRows?.length === 0}
							>
								<div className='pub-flex-align-center'>
									<div className={`sprite-icon4-cart ` + (cartSelectedRows?.length === 0 ? 'sprite-icon4-cart-3-8' : 'sprite-icon4-cart-3-9')}></div>
									<div className='ml10'>{i18Translate('i18MyCart.Saved For Later', "Saved For Later")}</div>
								</div>
							</Button>
							<DelCartBtn
								curCartItems={allCartItems}
								cartSelectedRows={cartSelectedRows}
								curCartNo={cookies?.cur_cart_data?.id}
								getList={getList}
								getSpareList={getSpareList}
								handShowTip={() => setShowSpecificProduct(true)}
							/>
							</div>
						</div> */}

					</div>
				)
			}


			{
				isShowViewProduct && <div>
					<CartListEmpty />
				</div>
			}

			{/* 暂时关闭项目-购物车篮子  && pageCartList?.length > 0 percentW50 */}
			{
				curActive === ACCOUNT_CART_HASH && (
					<div className='pub-flex-wrap mt15' style={{ gap: "20px" }}>
						{
							isAccountLog && (
								<SavedCarts />
							)
						}
						{
							isAccountLog && (
								<AddToProject />
							)
						}
					</div>
				)
			}


			{/* Add More Items */}
			{curActive === ACCOUNT_CART_HASH && <AddMoreItems isAccountLog={isAccountLog} />}

			{/* 备用购物车 */}
			{/* (spareCartList.length > 0) && */}
			{
				// (spareCartList.length > 0) && <>
				// 	<div className='pub-top-label pub-flex-align-center'>
				// 		<div className='pub-top-label-left'>
				// 			<div className='sprite-icon4-cart sprite-icon4-cart-3-3'></div>
				// 			<div className='pub-top-label-left-name ml10'>
				// 				{i18Translate('i18MyCart.Saved For Later', "Saved For Later")}:
				// 				<div className='spare-items ml10'>
				// 					<span className='pub-fontw'>{spareCartList.length} </span>
				// 					{i18Translate('i18SmallText.Items', "Item(s)")}</div>
				// 			</div>
				// 		</div>
				// 		{
				// 			curActive === ACCOUNT_CART_HASH && (
				// 				<div className='ml30 mt3 pub-content navigation-view-all'>
				// 					<div className='sub-title pub-color-link mr10' onClick={() => laterCheckMore()}>{i18Translate('i18MenuText.View more', 'View more')}</div>
				// 					<div className='sprite-home-min sprite-home-min-3-9' style={{ marginTop: '-2px' }}></div>
				// 				</div>
				// 			)
				// 		}
				// 	</div>
				// 	<Flex gap={20} style={{ marginTop: '5px' }}>
				// 		{curActive === 'save-for-later' && <ManufacturerNav onSearch={handleManufacturerFilters} factType={6} />}

				// 		<Flex flex column style={{ marginTop: '2px' }}>
				// 			<Table
				// 				rowSelection={{
				// 					...rowSelection,
				// 				}}
				// 				size='small'
				// 				columns={spareColumns}
				// 				loading={loading}
				// 				dataSource={curActive === 'save-for-later' ? spareCartList : spareCartList?.slice(0, 3)}
				// 				className='pub-border-table mt3'
				// 				rowKey={record => record.productId}
				// 				pagination={false}
				// 				scroll={spareCartList?.length > 0 ? { x: 1000 } : null}
				// 				locale={{ emptyText: '' }}
				// 			/>


				// 			<div className='mt20'>
				// 				<FloatButtons isShow={selectedRows?.length > 0}>
				// 					{
				// 						selectedRows?.length > 0 && <div className='pub-flex'>
				// 							<Button
				// 								type="submit" ghost='true'
				// 								className='login-page-login-btn custom-antd-primary mr20'
				// 								onClick={spareAddToCart}
				// 								disabled={selectedRows?.length === 0}
				// 							>{i18Translate('i18FunBtnText.AddToCart', 'Add to Cart')}</Button>

				// 							<DelCartBtn
				// 								curCartItems={spareCartList}
				// 								cartSelectedRows={selectedRows}
				// 								curCartNo={1}

				// 								getList={getList}
				// 								getSpareList={getSpareList}
				// 							/>
				// 						</div>
				// 					}
				// 				</FloatButtons>
				// 			</div>
				// 		</Flex>
				// 	</Flex>
				// </>

			}
			{/* 备用购物车为空 */}
			{
				(spareCartList.length === 0 && bList?.length === 0 && curActive === 'save-for-later') ? <CartListEmpty text={i18Translate('i18MyCart.No products found', 'No products found.')} /> :
					((spareCartList.length > 0 || isSearch) && <>
						<div className='pub-top-label pub-flex-align-center'>
							<div className='pub-top-label-left'>
								<div className='sprite-icon4-cart sprite-icon4-cart-3-3'></div>
								<div className='pub-top-label-left-name ml10'>
									{i18Translate('i18MyCart.Saved For Later', "Saved For Later")}:
									<div className='spare-items ml10'>
										<span className='pub-fontw'>{spareCartList.length} </span>
										{i18Translate('i18SmallText.Items', "Item(s)")}</div>
								</div>
							</div>
							{
								curActive === ACCOUNT_CART_HASH && (
									<div className='ml30 mt3 pub-content navigation-view-all'>
										<div className='sub-title pub-color-link mr10' onClick={() => laterCheckMore()}>{i18Translate('i18MenuText.View more', 'View more')}</div>
										<div className='sprite-home-min sprite-home-min-3-9' style={{ marginTop: '-2px' }}></div>
									</div>
								)
							}
						</div>
						<Flex gap={20} style={{ marginTop: '5px' }}>
							{curActive === 'save-for-later' && <ManufacturerNav ref={manuRef} onSearch={handleManufacturerFilters} factType={6} />}

							<Flex flex column style={{ marginTop: '2px' }}>
								<Table
									rowSelection={{
										...rowSelection,
									}}
									size='small'
									columns={spareColumns}
									loading={loading}
									dataSource={curActive === 'save-for-later' ? spareCartList : spareCartList?.slice(0, 3)}
									className='pub-border-table mt3 box-shadow'
									rowKey={record => record.productId}
									pagination={false}
									scroll={spareCartList?.length > 0 ? { x: 1000 } : null}
									locale={{ emptyText: '' }}
								/>


								<div className='mt20'>
									<FloatButtons isShow={selectedRows?.length > 0}>
										{
											selectedRows?.length > 0 && <div className='pub-flex'>
												<Button
													type="submit" ghost='true'
													className='login-page-login-btn custom-antd-primary mr20'
													onClick={() => {
														spareAddToCart()
														const _bl = cloneDeep(bList)
														_bl.splice(0, selectedRows?.length)
														setBList(_bl)
														handleFetchData()
													}}
													disabled={selectedRows?.length === 0}
												>{i18Translate('i18FunBtnText.AddToCart', 'Add to Cart')}</Button>

												<DelCartBtn
													curCartItems={spareCartList}
													cartSelectedRows={selectedRows}
													curCartNo={1}
													getList={() => {
														getList()
														const _bl = cloneDeep(bList)
														_bl.splice(0, selectedRows?.length)
														setBList(_bl)
														handleFetchData()
													}}
													getSpareList={getSpareList}
												/>
											</div>
										}
									</FloatButtons>
								</div>
							</Flex>
						</Flex>
					</>)
			}

			{/* 查看交货船期 */}
			{
				isLeadTimeEstimates && (
					<LeadTimeEstimates
						paramMap={paramMap}
						isShoeModal={isLeadTimeEstimates}
						record={leadTimeEstimatesData}
						onCancel={() => setIsLeadTimeEstimates(false)}
					/>
				)
			}
			{/* 购物车重复 */}
			{
				isShowDuplicatePart && <CartDuplicatePar
					isShow={isShowDuplicatePart}
					handleCancel={() => setIsShowDuplicatePart(false)}
					handleConfirm={(e) => (setIsShowDuplicatePart(false), handleChangeCartLocation(duplicatePart?.items, duplicatePart?.fromCartNo, duplicatePart?.record))}
				// const handleChangeCartLocation = async (items, fromCartNo = 0, record) => {
				/>
			}
			{/* 最小订货量 */}
			{
				isShowModal && (
					<ModalMoq
						isShowModal={isShowModal}
						currentCart={currentCart}
						dataSource={[currentCart]}
						closeModalMoq={(params, type, isUpdate) => closeModalMoq(params, type, isUpdate)}
					/>
				)
			}

			{isCartView && <Modal
				centered
				title={i18Translate('i18MyCart.Cart', 'CART')}
				footer={null}
				width={550}
				onCancel={(e) => setIsCartView(false)}
				open={isCartView}
				closeIcon={<i className="icon icon-cross2"></i>}
			>
				<AddCartPreview
					submitFn={() => { setIsCartView(false); Router.push(`/account/shopping-cart`) }}
					continueFn={() => setIsCartView(false)}
					product={selectedRecord[0]}
					otherParams={{
						type: "more",
						addCartList: selectedRecord,
					}}
					quantity={selectedRecord?.[0]?.cartQuantity}
				/>
			</Modal>
			}

			{/* 添加到备用没有产品id时的提示*/}
			{
				showSpecificProduct && <MinModalTip
					isShowTipModal={showSpecificProduct}
					width={440}
					tipTitle={i18Translate('i18SmallText.Operation tips', "OPERATION TIPS")}
					isChildrenTip={true}
					className="custom-antd-btn-more"
					cancelText={i18Translate('i18FunBtnText.OK', "OK")}
					onCancel={() => setShowSpecificProduct(false)}
					showHandleOk={false}
				>
					{i18Translate('i18MyCart.Action Contains', 'This action contains a specific product, which cannot be added to this project.')}
				</MinModalTip>
			}

		</Spin>
	</div>
};

export default connect((state) => state)(withCookies(ModuleEcomerceCartItems));
