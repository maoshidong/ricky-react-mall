import React, { useState, useEffect, useRef } from 'react';

import { Table, Button, Modal } from 'antd'; // Input,
import { CustomInput } from '~/components/common';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import Link from 'next/link';


import useCart from '~/hooks/useCart';
import useEcomerce from '~/hooks/useEcomerce';
import useDebounce from '~/hooks/useDebounce';
import useLanguage from '~/hooks/useLanguage';
import { handleMomentTime } from '~/utilities/common-helpers';
import { TABLE_COLUMN, DEL_ONE_TEXT } from '~/utilities/constant';
import { getEnvUrl, ACCOUNT_CART_DETAIL, ACCOUNT_SHOPPING_CART, ACCOUNT_CART_CART_HASH } from '~/utilities/sites-url'

import ZqxCartRepository from '~/repositories/zqx/CartRepository';
import MinTopTitle from '~/components/ecomerce/minCom/MinTopTitle'
import MinModalTip from '~/components/ecomerce/minCom/MinModalTip' // 公共提示 
import MakeCartActive from '~/components/shared/blocks/add-cart-preview/MakeCartActive' // 激活

const MyCartCom = ({ showTitle = true, tabActive, getTotal }) => {
	const { i18Translate, getDomainsData } = useLanguage();
	const iDateAdded = i18Translate('i18PubliceTable.DateAdded', TABLE_COLUMN.DateCreated)
	const iCartName = i18Translate('i18MyAccount.Cart Name', 'Cart Name')
	const iItems = i18Translate('i18SmallText.Items', 'Items')
	const iView = i18Translate('i18MenuText.view', 'View')
	const iOperation = i18Translate('i18PubliceTable.Operation', TABLE_COLUMN.operation)
	const iDelete = i18Translate('i18PubliceTable.Delete', TABLE_COLUMN.delete)
	const iMergeCarts = i18Translate('i18MyAccount.Merge Carts', 'Merge Carts')
	const iMakeCartActive = i18Translate('i18MyAccount.Make Cart Active', 'Make Cart Active')
	const iSave = i18Translate('i18FunBtnText.Save', "Save")

	const inputRef = useRef(null);
	const Router = useRouter();
	const [cookies] = useCookies(['cart']);
	const { account } = cookies;

	const { addToLoadCarts, setCurCartDataHok } = useEcomerce();

	const { cartListBasket, getUserCartListBasket } = useCart();
	const [list, setList] = useState([]);
	const [cartName, setCartName] = useState("");
	const [removeModal, setRemoveModal] = useState(false) // 删除弹框
	const [curData, setCurData] = useState({}) // 删除弹框
	const [selectedRows, setSelectedRows] = useState([]); // table表格选中项
	const [editId, setEditId] = useState(''); // 编辑id

	// 激活弹窗
	const [isShowModal, setIsShowModal] = useState(false)
	const [isShowTipModal, setIsShowTipModal] = useState(false) // 提示modal
	const [projectProdect, setProjectProdect] = useState([])

	const debouncedSearchTerm = useDebounce(cartName);

	// 合并
	const [isMerge, setIsMerge] = useState(false)

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
			cartId: curData?.id
		}
		const res = await ZqxCartRepository.deleteUserCartBasket(account?.token, params);
		if (res?.code === 0) {
			handleRemoveCancel()
			getUserCartListBasket()
			// 删除的id和当前存储的id一致时调用删除
			if (curData?.id === cookies?.cur_cart_data?.id) {
				setCurCartDataHok({})
			}
		}
	}

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
			// 只勾选了一个时，获取当前购物车详情，获取产品列表
			if (selectedRows?.length === 1) {
				ZqxCartRepository.userCartProductListBasket(account?.token, { cartId: selectedRows?.[0]?.id, languageType: getDomainsData()?.defaultLocale, }).then(res => {
					if (res?.code === 0) {
						setProjectProdect(res?.data)
					}
				});
			}

		},
	};
	// 修改名称
	const changeName = async (e, record) => {
		const { value } = e.target
		const params = {
			id: record?.id,
			cartName: value
		}
		const res = await ZqxCartRepository.updateUserCartBasket(account?.token, params);
		if (res?.code === 0) {
			const arr = list?.map(item => {
				return {
					...item,
					cartName: item?.id === record?.id ? value : item?.cartName,
				}
			})
			setList(arr)
			setEditId('')
		}
	}
	// InputRef.current?.focus()
	const handleEditId = record => {
		setEditId(record?.id)

	}
	useEffect(() => {
		if (editId) {
			inputRef?.current?.focus()
		}
	}, [editId])

	const columns = [
		{
			title: i18Translate('i18MyAccount.Cart number', 'Cart number'),
			dataIndex: 'orderId',
			rowKey: 'orderId',
			key: 'orderId',
			render: (text, record) => {
				return <span>{record?.orderId}</span>
			},
		},
		{
			title: iCartName,
			dataIndex: 'cartName',
			rowKey: 'cartName',
			key: 'cartName',
			width: 400,
			render: (text, record) => {
				return <div className='pub-flex-align-center'>
					<Link href={getEnvUrl(ACCOUNT_CART_DETAIL) + `/${record?.id}`}>
						<a className='pub-color-hover-link' style={{ maxWidth: '300px' }} >{editId !== record?.id && text}</a>
					</Link>
					{editId === record?.id && (
						<CustomInput
							ref={inputRef}
							className="form-control form-input pub-border w300"
							type="text"
							defaultValue={record?.cartName}
							onBlur={(e) => changeName(e, record)}
						/>
					)}
					{editId !== record?.id ? <div
						onClick={() => handleEditId(record)}
						className='ml15 sprite-account-icons sprite-account-icons-2-2'
					></div> :
						<button
							type="submit" ghost='true'
							className='login-page-login-btn custom-antd-primary w50 ml15'
							onClick={() => handleEditId(record)}
						>{iSave}</button>
					}
					{/* <div
                        onClick={() => handleEditId(record)}
                        className='ml15 sprite-account-icons sprite-account-icons-2-2'
                    ></div> */}
				</div>
			},
		},

		{
			title: iItems,
			dataIndex: 'quantity',
			rowKey: 'quantity',
			key: 'quantity',
			render: (text, record) => {
				return <span>{record?.quantity}</span>
			},
		},
		{
			title: iOperation,
			render: (text, record) => (
				<Link href={getEnvUrl(ACCOUNT_CART_DETAIL) + `/${record?.id}`}>
					<a><button
						type="submit" ghost='true'
						className='login-page-login-btn custom-antd-primary w80'
						onClick={() => Router.push(getEnvUrl(ACCOUNT_CART_DETAIL) + `/${record?.id}`)}
					>{iView}</button></a>
				</Link>
			),
		},
		{
			title: iDateAdded,
			dataIndex: 'createTime',
			rowKey: 'createTime',
			key: 'createTime',
			render: (text) => (
				<>{handleMomentTime(text)}</>
			),
		},
		{
			title: iDelete,
			dataIndex: 'del',
			key: 'del',
			width: TABLE_COLUMN.deleteWidth,
			align: 'center',
			render: (text, record) => (
				<>
					<div className='pub-font16 pub-flex-center' onClick={(e) => openRemoveMadol(e, record)}>
						<div className='sprite-icon4-cart sprite-icon4-cart-3-6'></div>
					</div>
				</>
			),
		},
	]

	const handleMergeCarts = () => {
		setIsMerge(true)
	}
	// 确认合并
	const handleMerge = async () => {
		const mergeList = selectedRows?.map(item => {
			return item?.id
		})
		const params = {
			mergeList,
		}
		const res = await ZqxCartRepository.mergeUserCartBasket(account?.token, params);
		if (res?.code == 0) {
			setIsMerge(false)
			getUserCartListBasket()
			delSelectedRows()
		}
	}
	// 激活购物车
	const handleActive = async () => {
		if (selectedRows?.length === 1) {
			setIsShowModal(true)
			// const params = {
			//     id: 1001,
			//     infoList: [
			//         {  productId: 1,quantity: 10,}
			//     ]
			// }
			// const res = await ZqxCartRepository.mergeUserCartToMainCartBasket(account?.token, {cartName});
		} else {
			setIsShowTipModal(true)
		}
	}

	const delSelectedRows = () => {
		setSelectedRows([])
	}

	const getTableList = async (cartName) => {
		const res = await ZqxCartRepository.userCartListBasket(account?.token, { cartName });
		if (res?.code == 0) {
			setList(res?.data || [])
		}
	}
	const partNumChange = e => {
		const { value } = e.target
		setCartName(value)
		// getTableList(value)
	}
	useEffect(() => {
		getTableList(debouncedSearchTerm)
	}, [debouncedSearchTerm]);
	// 购物车激活
	const handleCartActive = async () => {
		setCurCartDataHok(selectedRows?.[0])
		addToLoadCarts('', selectedRows?.[0]?.id)
		setIsShowModal(false)
		Router.push(getEnvUrl(ACCOUNT_SHOPPING_CART))
		// const infoList = projectProdect?.map(item => {
		//     return {
		//         productId: item?.productId,
		//         quantity: item?.quantity,
		//     }
		// })
		// const params = {
		//     id: selectedRows?.[0]?.id,
		//     infoList,
		// }
		// const res = await ZqxCartRepository.activeUserCartToMainCart(account?.token, params);
		// if (res?.code == 0) {
		//     getUserCartListBasket()
		//     addToLoadCarts()

		// }
	}

	useEffect(() => {
		setList(cartListBasket)
	}, [cartListBasket])

	useEffect(() => {
		if (getTotal) {
			getTotal(list?.length)
		}
	}, [list])
	const iMergeTip1 = i18Translate('i18MyAccount.MergeTip1', 'You must select two or more carts to merge your carts.')
	const iMergeTip2 = i18Translate('i18MyAccount.MergeTip2', 'Are you sure you want to merge these carts?')
	const iActiveTip1 = i18Translate('i18MyAccount.ActiveTip1', 'You must first select a cart to make active.')
	const iActiveTip2 = i18Translate('i18MyAccount.ActiveTip2', 'You may only make one cart active at any given time. Please correct your selection.')
	const iMySavedCarts = i18Translate('i18Head.My Cart', 'My Cart Lists')

	if (tabActive !== ACCOUNT_CART_CART_HASH) return null
	return (
		<div className='ps-account-order custom-antd-btn-more pb60'>
			{/* pub-sticky */}
			<div className='mb3'>
				{
					!showTitle && <MinTopTitle className='sprite-icon4-cart sprite-icon4-cart-3-3'>
						{iMySavedCarts}:
						<div className="spare-items ml10"><span className="pub-fontw">{list?.length} {i18Translate('i18SmallText.Items', "Item(s)")}</span></div>
					</MinTopTitle>
				}
			</div>

			<div className="ps-section__header">
				{
					showTitle && <div className='pub-left-title mb15'>{iMySavedCarts}</div>
				}

				<div className='pub-flex-between pub-custom-box-up mb20 account-cart-table-header'>
					<div className='pub-search pub-custom-box-up w300'>
						<CustomInput
							onChange={e => (partNumChange(e), delSelectedRows())}
							className='form-control w300' // w260
							// placeholder="Part Number / QTN"
							// onPressEnter={e => handleSearch(e)}
							onKeyPress={e => {
								if (e.key === 'Enter') {
									getTableList(debouncedSearchTerm)
								}
							}}
							value={cartName}
						// onPressEnter={() => {
						//     log("Enter 键被按下");
						// }}
						/>
						{/* onClick={handleSearch} */}
						<div className={'pub-search-icon sprite-icons-1-3 '} style={{ top: '10px' }} />
						<div className='pub-custom-input-holder'>{iCartName}</div>
					</div>

					<div className='mt3'>
						<Button
							ghost='true'
							className='login-page-login-btn mr20 w120'
							onClick={() => handleMergeCarts()}
						>{iMergeCarts}</Button>
						<Button
							ghost='true'
							className='login-page-login-btn custom-antd-primary w150'
							onClick={() => handleActive()}
						>{iMakeCartActive}</Button>
					</div>
				</div>

				<Table
					sticky
					columns={columns}
					rowSelection={{
						...rowSelection,
						selectedRowKeys: selectedRows?.map(item => { return item?.id }),
					}}
					dataSource={list}
					rowKey={record => record.id}
					size='small'
					className='pub-border-table box-shadow'
					pagination={false}
					scroll={list?.length > 0 ? { x: 1000 } : null}
					scrollToFirstRowOnChange={true} // 	当分页、排序、筛选变化后是否滚动到表格顶部
				/>

			</div>

			{/* 是否激活 */}
			{
				isShowModal && <MakeCartActive
					isShowModal={isShowModal}
					onCancel={() => setIsShowModal(false)}
					handleOk={() => handleCartActive()}
					projectProdect={projectProdect || []}
				/>
			}
			{/* 是否合并 */}
			{
				isMerge && <MinModalTip
					isShowTipModal={isMerge}
					width={430}
					tipTitle={iMergeCarts}
					tipText={selectedRows?.length > 1 ? iMergeTip2 : iMergeTip1}

					submitText={i18Translate('i18FunBtnText.Confirm', "Merge")}
					onCancel={() => setIsMerge(false)}
					// handleOk={() => { continueFn ? continueFn() : null}}
					handleOk={() => { selectedRows?.length > 1 ? handleMerge() : '' }}
					showHandleOk={selectedRows?.length > 1}
				/>
			}
			{/* 激活提示 */}
			{
				isShowTipModal && <MinModalTip
					isShowTipModal={isShowTipModal}
					width={430}
					tipTitle={i18Translate('i18MyAccount.Make Cart Active', 'MAKE CART ACTIVE')}
					tipText={selectedRows?.length === 0 ? iActiveTip1 : iActiveTip2}

					onCancel={() => setIsShowTipModal(false)}
				// handleOk={() => setIsShowModal(true)}
				>
				</MinModalTip>
			}

			{/* 删除提示 */}
			<Modal
				title={i18Translate('i18MyCart.REMOVE AN ITEM', "REMOVE AN ITEM")}
				open={removeModal}
				footer={null}
				width="440"
				centered
				onCancel={handleRemoveCancel}
				closeIcon={<i className="icon icon-cross2"></i>}
			>
				<div className='custom-antd-btn-more'>
					<div>
						{i18Translate('i18MyCart.ItemRemoveTip', DEL_ONE_TEXT)}
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

export default MyCartCom