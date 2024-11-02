import React, { useState, useEffect, useRef } from 'react';

import { Table, Button, Modal } from 'antd'; // , Input
import { CustomInput } from '~/components/common';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import Link from 'next/link';

import useCart from '~/hooks/useCart';
import useDebounce from '~/hooks/useDebounce';
import useLanguage from '~/hooks/useLanguage';

import { scrollToTop, handleMomentTime } from '~/utilities/common-helpers';
import { TABLE_COLUMN, DEL_ONE_TEXT } from '~/utilities/constant';
import { ACCOUNT_PROJECT_DETAIL, ACCOUNT_CART_PROJECT_HASH } from '~/utilities/sites-url'


import ZqxCartRepository from '~/repositories/zqx/CartRepository';
import CreateNewProject from '~/components/ecomerce/cartCom/CartProject/CreateNewProject'
import MinTopTitle from '~/components/ecomerce/minCom/MinTopTitle'

const MyProjectCom = ({ showTitle = true, tabActive, getTotal }) => {
	const { i18Translate } = useLanguage();
	const iMyProject = i18Translate('i18MyAccount.My Project', 'My Project Lists')
	const iProjectName = i18Translate('i18MyAccount.Project Name', 'Project Name')
	const iProducts = i18Translate('i18Head.products', 'Products')
	const iOperation = i18Translate('i18PubliceTable.Operation', TABLE_COLUMN.operation)
	const iView = i18Translate('i18MenuText.view', 'View')
	const iDateAdded = i18Translate('i18PubliceTable.DateAdded', TABLE_COLUMN.DateCreated)
	const iDelete = i18Translate('i18PubliceTable.Delete', TABLE_COLUMN.delete)
	const iSave = i18Translate('i18FunBtnText.Save', "Save")

	const inputRef = useRef(null);
	const Router = useRouter();
	const [cookies] = useCookies(['cart']);
	const { account } = cookies;

	const { projectList, getMyProjectList } = useCart();
	const [editId, setEditId] = useState(''); // 编辑id
	const [list, setList] = useState(projectList || []);
	const [projectName, setProjectName] = useState(""); // 搜索
	const debouncedSearchTerm = useDebounce(projectName);


	const [removeModal, setRemoveModal] = useState(false) // 删除弹框
	const [curData, setCurData] = useState({}) // 删除弹框
	// 删除弹窗
	const openRemoveMadol = (e, record) => {
		e?.preventDefault();
		setRemoveModal(true)
		setCurData(record)
		// setDelChooseData([record])
	}
	// 取消删除
	const handleRemoveCancel = () => {
		setRemoveModal(false)
		setCurData({})
		// setDelChooseData([])
	}
	// 确认删除
	const handleRemoveOk = async () => {
		const params = {
			projectId: curData?.id
		}
		const res = await ZqxCartRepository.deleteProject(account?.token, params);
		if (res?.code === 0) {
			handleRemoveCancel()
			getMyProjectList()
		}
	}
	// 修改名称
	const changeName = async (e, record) => {
		const { value } = e.target
		const params = {
			id: record?.id,
			projectName: value
		}
		const res = await ZqxCartRepository.updateProject(account?.token, params);
		if (res?.code === 0) {
			const arr = list?.map(item => {
				return {
					...item,
					projectName: item?.id === record?.id ? value : item?.projectName,
				}
			})
			setList(arr)
			setEditId('')
		}
	}

	const delSelectedRows = () => {
		// setSelectedRows([])
	}
	const partNumChange = e => {
		const { value } = e.target
		setProjectName(value)
	}
	const getTableList = async (projectName) => {
		const res = await ZqxCartRepository.projectList(account?.token, { projectName });
		if (res?.code == 0) {
			setList(res?.data || [])
		}
	}

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
			title: iProjectName,
			dataIndex: 'projectName',
			rowKey: 'projectName',
			key: 'projectName',
			width: 400,
			render: (text, record) => {
				return <div className='pub-flex-align-center'>
					<Link href={ACCOUNT_PROJECT_DETAIL + `/${record?.id}`}>
						<a className='pub-color-hover-link' style={{ maxWidth: '300px' }}>{editId !== record?.id && text}</a>
					</Link>
					{/* 编辑状态输入框 */}
					{editId === record?.id && (
						<CustomInput
							ref={inputRef}
							className="form-control form-input pub-border"
							style={{ maxWidth: '300px' }}
							type="text"
							defaultValue={record?.projectName}
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

				</div>
			},
		},
		{
			title: iProducts,
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
				<Link href={ACCOUNT_PROJECT_DETAIL + `/${record?.id}`}>
					<a><button
						type="submit" ghost='true'
						className='login-page-login-btn custom-antd-primary w80'
						onClick={() => Router.push(ACCOUNT_PROJECT_DETAIL + `/${record?.id}`)}
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
			right: 'right',
			render: (text, record) => (
				<>
					<div className='pub-font16 pub-flex-end' onClick={(e) => openRemoveMadol(e, record)}>
						<div className='sprite-icon4-cart sprite-icon4-cart-3-6'></div>
					</div>
				</>
			),
		},
	]
	useEffect(() => {
		scrollToTop()
		getMyProjectList()
	}, [])
	useEffect(() => {
		setList(projectList)
	}, [projectList])
	useEffect(() => {
		if (getTotal) {
			getTotal(list?.length)
		}
	}, [list])
	useEffect(() => {
		getTableList(debouncedSearchTerm)
	}, [debouncedSearchTerm]);
	if (tabActive !== ACCOUNT_CART_PROJECT_HASH) return null
	return (
		<div className='ps-account-order custom-antd-btn-more pb60'>
			{/* pub-sticky */}
			<div className='mb3'>
				{
					!showTitle && <MinTopTitle className='sprite-icon4-cart sprite-icon4-cart-3-3'>
						{iMyProject}:
						<div className="spare-items ml10"><span className="pub-fontw">{list?.length} {i18Translate('i18SmallText.Items', "Item(s)")}</span></div>
					</MinTopTitle>
				}
			</div>

			<div className="ps-section__header">
				{
					showTitle && <div className='pub-left-title mb15'>{iMyProject}</div>
				}

				<div className='pub-flex-between pub-custom-input-box mb20'>
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
							value={projectName}
						// onPressEnter={() => {
						//     log("Enter 键被按下");
						// }}
						/>
						{/* onClick={handleSearch} */}
						<div className={'pub-search-icon sprite-icons-1-3 '} style={{ top: '10px' }}></div>
						<div className='pub-custom-input-holder'>{iProjectName}</div>
					</div>
				</div>


				<Table
					sticky
					// loading={loading}
					columns={columns}
					dataSource={list}
					// rowKey={record => `${record.orderId} + ${(Math.floor(Math.random() * (max - min + 1)) + min)}` }
					// rowKey={record => nanoid()}
					rowKey={record => record.id}
					size='small'
					className='pub-border-table box-shadow'
					pagination={false}
					scroll={list?.length > 0 ? { x: 1000 } : null}
					scrollToFirstRowOnChange={true} // 	当分页、排序、筛选变化后是否滚动到表格顶部
				/>

			</div>

			<div className='mt20  box-shadow'>
				<CreateNewProject />
			</div>

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

export default MyProjectCom