import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd'; // Input,
import { CustomInput } from '~/components/common';
import useDebounce from '~/hooks/useDebounce';
import useLanguage from '~/hooks/useLanguage';
import { useCookies } from 'react-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { handleMomentTime } from '~/utilities/common-helpers';
import { TABLE_COLUMN, DEL_ONE_TEXT } from '~/utilities/constant';
import { getEnvUrl, QUOTE_BOM_DETAIL } from '~/utilities/sites-url';

import QuoteRepositry from '~/repositories/zqx/QuoteRepositry';

import MinModalTip from '~/components/ecomerce/minCom/MinModalTip' // 公共提示
import BomUploadBox from '~/components/partials/shop/BomUploadBox' // bom工具

const SavedBomsCom = () => {
	const { i18Translate } = useLanguage();

	const [cookies] = useCookies(['account']);
	const Router = useRouter();

	const [debounceName, setDebounceName] = useState("");
	const [bomList, setBomList] = useState([]) // 接口的bom列表
	const [editId, setEditId] = useState(''); // 编辑id
	const [removeModal, setRemoveModal] = useState(false) // 删除文件弹框
	const [fileId, setFileId] = useState('')

	const debouncedSearchTerm = useDebounce(debounceName);
	const partNumChange = e => {
		const { value } = e.target
		setDebounceName(value)
	}
	const delSelectedRows = () => {
		// setSelectedRows([])
	}

	const handleGetBomFileList = async () => {
		const res = await QuoteRepositry.getBomFileList({ bomName: debounceName }, cookies?.account?.token);
		if (res?.code === 0) {
			setBomList(res?.data || [])
		}
	}

	// 修改名称
	const changeName = async (e, record) => {
		const { value } = e.target
		const params = {
			id: record?.id,
			fileName: value,
		}
		const res = await QuoteRepositry.updateFileInfo(params);

		if (res?.code === 0) {
			const arr = bomList?.map(item => {
				return {
					...item,
					fileName: item?.id === record?.id ? value : item?.fileName,
				}
			})
			setBomList(arr)
			setEditId('')
		}
	}
	const openRemoveMadol = (e, record) => {
		e?.preventDefault();
		setRemoveModal(true)
		setFileId(record?.id)
	}
	const handleDel = async () => {
		const params = {
			fileId,
		}
		const res = await QuoteRepositry.deleteFileInfo(params);
		if (res?.code === 0) {
			handleGetBomFileList()
			setRemoveModal(false)
		}
	}
	const iBOMName = i18Translate('i18MyAccount.BOM Name', "BOM Name")
	const iDateAdded = i18Translate('i18PubliceTable.DateAdded', TABLE_COLUMN.DateCreated)
	const iVerifiedLines = i18Translate('i18Bom.verifiedLines', 'Verified Lines')
	const iTotalLines = i18Translate('i18Bom.totalLines', 'Total Lines')
	const iOperation = i18Translate('i18PubliceTable.Operation', TABLE_COLUMN.operation)
	const iDelete = i18Translate('i18PubliceTable.Delete', TABLE_COLUMN.delete)
	const iView = i18Translate('i18MenuText.view', 'View')

	const columns = [
		{
			title: iBOMName,
			dataIndex: 'fileName', // 列数据在数据项中对应的路径，支持通过数组查询嵌套路径
			// rowKey: 'fileName', // 表格行 key 的取值，可以是字符串或一个函数
			// key: 'fileName', // React 需要的 key，如果已经设置了唯一的 dataIndex，可以忽略这个属性
			width: 400,
			// render: (text) => (
			//     <>{text}</>
			// ),
			render: (text, record) => {
				return <div className='pub-flex-align-center'>
					{editId !== record?.id && text}
					{editId === record?.id && (
						<CustomInput
							className="form-control form-input pub-border w160"
							type="text"
							defaultValue={record?.fileName}
							onBlur={(e) => changeName(e, record)}
						/>
					)}
					<div
						onClick={() => setEditId(record?.id)}
						className='ml20 sprite-account-icons sprite-account-icons-2-2'
					></div>
				</div>
			},
		},

		{
			title: iDateAdded,
			dataIndex: 'createTime',
			render: (text) => (
				<>{handleMomentTime(text)}</>
			),
		},
		{
			title: iVerifiedLines,
			dataIndex: 'matchNum',
			render: (text) => (
				<>{text}</>
			),
		},
		{
			title: iTotalLines,
			dataIndex: 'totalNum',
			render: (text) => (
				<>{text}</>
			),
		},
		{
			title: iOperation,
			render: (text, record) => (
				<Link href={getEnvUrl(QUOTE_BOM_DETAIL) + `/${record?.id}`}>
					<a><button
						type="submit" ghost='true'
						className='login-page-login-btn custom-antd-primary w80'
						onClick={() => Router.push(getEnvUrl(QUOTE_BOM_DETAIL) + `/${record?.id}`)}
					>{iView}</button></a>
				</Link>
			),
		},
		{
			title: iDelete,
			width: TABLE_COLUMN.deleteWidth,
			align: 'right',
			render: (text, record) => (
				<div className='pub-font16 pub-flex-end' onClick={(e) => openRemoveMadol(e, record)}>
					<div className='sprite-icon4-cart sprite-icon4-cart-3-6'></div>
				</div>
			),
		},
	]

	useEffect(() => {
		handleGetBomFileList()
	}, [debouncedSearchTerm])


	const iBOMs = i18Translate('i18MyAccount.BOMs', "BOMs")
	const iMyBomsDes = i18Translate('i18MyAccount.MyBomsDes', "Your account can store up to 100 BOMs. Periodically delete old or unwanted BOMs to ensure you always have space to create new BOMs.")
	const iCreateNewBom = i18Translate('i18MyAccount.Create New Bom', "CREATE NEW BOM")
	return (
		<div
			className="product-table-container ps-account-order custom-antd-btn-more ps-section--account-setting pb-60"
		>
			<div className="ps-section__header">
				<div className='pub-left-title'>{iBOMs}</div>
				<div className='mt10 pub-color555'>{iMyBomsDes}</div>
			</div>
			<div className='pub-flex-between pub-custom-input-box mb20'>
				<div className='pub-search pub-custom-box-up w260'>
					<CustomInput
						onChange={e => (partNumChange(e), delSelectedRows())}
						className='form-control w260'
						value={debounceName}
						onKeyPress={e => {
							if (e.key === 'Enter') {
								handleGetBomFileList()
							}
						}}
					/>
					<div className={'pub-search-icon sprite-icons-1-3 '} style={{ top: '10px' }}></div>
					{/* Part Number /  */}
					<div className='pub-custom-input-holder'>{iBOMName}</div>
				</div>
			</div>

			<Table
				sticky
				columns={columns}
				dataSource={bomList}
				rowKey={record => record.id}
				size='small'
				className='pub-border-table box-shadow'
				pagination={false}
				scroll={bomList?.length > 0 ? { x: 1000 } : { x: 750 }}
				scrollToFirstRowOnChange={true} // 	当分页、排序、筛选变化后是否滚动到表格顶部
			/>

			<div className='mt20'>
				<BomUploadBox isDefaultUpload={false}>
					<Button
						ghost='true'
						className='login-page-login-btn custom-antd-primary w200'
					>
						<div className='pub-flex-center'>
							<div className='ml20 sprite-account-icons sprite-account-icons-2-3'></div>
							<div className='ml10'>{iCreateNewBom}</div>
						</div>
					</Button>
				</BomUploadBox>
			</div>
			{/* 提示引入弹窗组件 */}
			{
				removeModal && <MinModalTip
					isShowTipModal={removeModal}
					width={430}
					tipTitle={i18Translate('i18MyCart.REMOVE AN ITEM', "REMOVE AN ITEM")}
					tipText={i18Translate('i18MyCart.ItemRemoveTip', DEL_ONE_TEXT)}
					onCancel={() => setRemoveModal(false)}
					handleOk={() => handleDel()}
				/>
			}

		</div>
	)
}

export default SavedBomsCom