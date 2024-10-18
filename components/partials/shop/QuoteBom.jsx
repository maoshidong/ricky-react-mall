import React, { useState, useEffect, useRef } from 'react';
import { Progress, Modal, Button } from 'antd';
import { CustomInput } from '~/components/common';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { useCookies } from 'react-cookie';
import Link from 'next/link';
import { nanoid } from 'nanoid';
import { QuoteRepositry } from '~/repositories';

import MinModalTip from '~/components/ecomerce/minCom/MinModalTip';
import MinLoginRegister from '~/components/ecomerce/minCom/MinLoginRegister';
import MappingBomModal from '~/components/partials/shop/MappingBomModal';
import UploadXLSX from '~/components/partials/shop/UploadXLSX';

import { getEnvUrl, QUOTE_BOM_DETAIL } from '~/utilities/sites-url'
import { handleMomentTime } from '~/utilities/common-helpers';
import { DEL_ONE_TEXT, TABLE_COLUMN } from '~/utilities/constant';

import useAccount from '~/hooks/useAccount';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
import classNames from 'classnames';
import styles from '~/scss/module/_pub.module.scss';

const QuoteBom = ({ auth, isBorder = true, isBoxShadow = true }) => {
	const { i18Translate } = useLanguage();
	const { iFileError, iAccept2, iSizError, iMaximum, iRowLimit,
		iWarning, iRowTip, iCancel
	} = useI18()

	// bom限制行数量301
	const text = i18Translate('i18Bom.uploadLimit1', "Drop files here! Maximum file size 2MB. File types accepted xls, xlxs & csv with no more than 300 lines.")
	const text1 = i18Translate('i18Bom.uploadLimit2', "Values you'd like to match should be within the first 10 columns of your file.")
	const text2 = i18Translate('i18Bom.accountLimit', "Your account can store up to 3 BOMs. Periodically delete old or unwanted BOMs to ensure you always have space to create new BOMs.")
	const iDateAdded = i18Translate('i18PubliceTable.DateAdded', TABLE_COLUMN.DateCreated)
	const iBomTit = i18Translate('i18Bom.BomTit', 'Welcome to the parts list manager (BOM tool)')
	const iBomDes = i18Translate('i18Bom.BomDes', 'Faster upload, improved parts matching, enhanced list management')
	const iUploadTip = i18Translate('i18Bom.uploadTip', 'Bill of Materials Upload')
	const iBomUseTit = i18Translate('i18Bom.BomUseTit', 'What is a BOM and why should you use it?')
	const iBomUseDes = i18Translate('i18Bom.BomUseDes', 'A Bill of Materials or BOM is a comprehensive list of the parts or components required to manufacture a product. Use our BOM Tool to get real-time prices and availability for your entire parts list.')

	const defaultList = `
		Real time price and availability for your entire parts list;
		Try it as a Guest user (up to three lists as Guest. Log in or create a web account in to save the lists and create a quote);
		Match your parts using any of these criteria: Manufacturer part numbers or Product descriptions or keywords;
		Easy and fast file upload;
		Intuitive columns data mapping;
		Enhanced data match results;
		Automated refresh of pricing & stock on saved lists;
		Ability to add extra lines to uploaded and saved lists;
		Ability to proceed to PO/basket for all or selected lines;
		Excel download option, maintaining your original file formats
	`
	const iBOMfeaturesList = i18Translate('i18Bom.BOMfeaturesList', defaultList)?.split(';');
	const iBOMFeatures = i18Translate('i18Bom.BOM Features', 'BOM Features');

	const iUploadSteps = i18Translate('i18Bom.Upload Steps', 'Upload Steps')?.split(';');
	const UploadStepsList = `
		Upload your spreadsheet (xls, xlsx or csv);
		Assign the necessary data from your spreadsheet;
		Your BOM is ready. Use it to buy, get quotes or share it with your team
	`
	const iUploadStepsList = i18Translate('i18Bom.UploadStepsList', UploadStepsList)?.split(';');


	const upLoadRef = useRef(null);
	const { anonymousAuthLoginHooks } = useAccount();
	const [cookies] = useCookies(['account']);
	const { isAccountLog } = auth
	const Router = useRouter();

	const [open, setOpen] = useState(false);
	const [isShowModal, setIsShowModal] = useState(false)
	const [isShowTipModal, setIsShowTipModal] = useState(false) // 提示modal
	const [tipTitle, setTipTitle] = useState('ERR') // 提示modal
	const [tipText, setTipText] = useState('Err') // 提示modal
	const [tableSource, setTableSource] = useState([]) // 表数据
	const [columnsLength, setColumnsLength] = useState(0)

	// 保存的bom生成记录列表
	const [bomList, setBomList] = useState([]) // 接口的bom列表
	const [isEditFileName, setIsEditFileName] = useState(false) // 修改文件名
	const [removeModal, setRemoveModal] = useState(false) // 删除文件弹框
	const [fileId, setFileId] = useState('')
	const [isMore300, setIsMore300] = useState(false) // 是否超过300

	const handleUploadBomIsExistList = async (data) => {
		return
	}

	const handleGetBomFileList = async () => {
		const res = await QuoteRepositry.getBomFileList({}, cookies?.account?.token);
		if (res?.code === 0) {
			setBomList(res?.data || [])
		}
	}

	// 修改文件名称
	const changeFileName = async (e, item) => {
		const { value } = e.target
		const params = {
			id: item?.id,
			fileName: value,
		}

		await QuoteRepositry.updateFileInfo(params);
	}

	// 删除文件
	const delFile = async (item) => {
		setFileId(item?.id)
		setRemoveModal(true)
	}

	// 删除UploadHistory弹窗确认
	const handleRemoveOk = async () => {
		const params = {
			fileId,
		}
		const res = await QuoteRepositry.deleteFileInfo(params);
		if (res?.code === 0) {
			handleGetBomFileList()
			setRemoveModal(false)
		}
	}

	// 删除UploadHistory弹窗取消
	const handleRemoveCancel = () => {
		setRemoveModal(false)
	}

	useEffect(() => {
		if (!cookies?.account?.token) {
			anonymousAuthLoginHooks()
			return
		}
		handleGetBomFileList()
	}, [cookies])

	const bomModalChangeSheet = val => {
		upLoadRef.current.handleWorkbook(val, false);
	}

	// 文件上传前检查 
	const uploadBeforeUpload = (validFileType, isLt2M, isMaxRowCount) => {
		if (!validFileType) {
			setTipTitle(iFileError)
			setTipText(iAccept2)
			setIsShowTipModal(true)
			return
		}
		if (!isLt2M) {
			setTipTitle(iSizError)
			setTipText(iMaximum)
			setIsShowTipModal(true)
		}
		if (!isMaxRowCount) {
			setTipTitle(iLineItemsExceeded)
			setTipText(iRowLimit)
			setIsShowTipModal(true)
		}
	}

	const tableSourceUpload = (data, isShow) => {
		// bom限制行数量301
		if (data?.length > 301 && isShow) {
			setIsMore300(true)
			setTipTitle(iWarning)
			setTipText(iRowTip)
			setIsShowTipModal(true)
		} else {
			setIsMore300(false)
			setIsShowModal(true)
		}

		setTableSource(data?.slice(0, 301))
		setColumnsLength(data?.[0]?.columnsLength || 0)
		// 上传bom表单中的数据生成匹配数据
		handleUploadBomIsExistList(data)
	}

	const handleComfirm = () => {
		setIsShowTipModal(false)
		setIsShowModal(true)
	}

	const flag = isAccountLog || bomList?.length <= 2

	return (
		<div className="quote-bom-page upload-box">
			<div className={`${isBorder ? '' : 'mt20 ml20'}`}>
				<div className='pub-font14 pub-fontw'>{iBomTit}</div>
				<div>{iBomDes}</div>
			</div>

			<div className={`mt20 ${isBorder && ('pub-border')} ${isBoxShadow && 'box-shadow'}`}>
				{
					isBorder ?
						<h3 className='left-title'>{iUploadTip}</h3>
						:
						<span className='left-title-simple' style={{ fontSize: '15px' }}>{iUploadTip}</span>
				}
				<div className={classNames('ppub-flex-wrap', styles.uploadBox)}>
					<div className={classNames('upload-center pub-flex-center', styles.uploadCol)} style={{ paddingBottom: isBorder ? '30px' : 'none' }}>
						{
							flag && (
								<UploadXLSX
									tableSourceUpload={tableSourceUpload}
									uploadBeforeUpload={uploadBeforeUpload}
									ref={upLoadRef}
								>
									<div className='upload-box'>
										<div className='sprite-about-us sprite-about-us-1-1'></div>
										<div className='mt15 upload-text'>{text}</div>
										<div className='pub-flex-center pub-color555 pub-font13'>{text1}</div>
									</div>
								</UploadXLSX>
							)
						}
						{
							!flag && (
								<div className='upload-box not-allow-upload'>
									<div className='sprite-bom sprite-bom-2-1'></div>
									<div className='mt15 upload-text'>You have reached your limit of 3 uploaded files. To upload more files, please either:</div>
									<div className='pub-flex-center pub-color555 pub-font13 '>Delete some previous files from the list below</div>
								</div>
							)
						}
					</div>

					<div className={classNames('ml20 mr20 mb20', styles.uploadCol)}>
						<div className='mb5 pub-font14 pub-fontw'>{iBomUseTit}</div>
						<p className='mb15'>{iBomUseDes}</p>
						<div className='mb10 pub-font14 pub-fontw'>{iUploadSteps}</div>
						<ul className={styles.saveListUl}>
							{iUploadStepsList?.map((item) => {
								return (
									<li>
										{item}
									</li>
								);
							})}
							{/* <li>Upload your spreadsheet (xls, xlsx or csv). </li>
							<li>Assign the necessary data from your spreadsheet.</li>
							<li>Your BOM is ready. Use it to buy, get quotes or share it with your team</li> */}
						</ul>
					</div>
				</div>
			</div>
			{
				!isAccountLog && (
					<div className='pub-flex-align-center ps-quote-tip mt18' style={{ padding: '14px 15px' }}>
						<span className='ml5 mr10 sprite-bom sprite-bom-1-2'></span>
						<div>
							<div className="pub-color555 pub-font14 pub-fontw">
								{i18Translate('i18Bom.howSave', "Want to save your uploaded BOM lists?")}</div>
							<div className="pub-flex-align-center">
								<MinLoginRegister routerPath={Router.asPath} />
								<div className="pub-flex-align-center">
									<span>{i18Translate('i18Bom.loginTip', 'to save uploaded BOMs and view, edit, and create quotes from them.')}</span>
								</div>
							</div>
						</div>
					</div>
				)
			}

			<div className={`${isBorder ? 'pub-border15' : 'pub-t15-20'} mt20 ${isBoxShadow && 'box-shadow'}`}>
				<div className='pub-flex-between pub-fontw pub-font16 pub-color18'>
					{
						isBorder ?
							<h3 className='pub-fontw'>{i18Translate('i18Bom.uploadHistory', "Upload history")}</h3>
							:
							<span style={{ fontSize: '15px' }}>{i18Translate('i18Bom.uploadHistory', "Upload history")}</span>
					}
				</div>
				<p className='mb6 pub-color555'>{text2}</p>
				{bomList?.length > 0 && <div className='mb20 quote-history'>
					{
						bomList?.map(item => {
							return <div className='quote-history-item mb10 pub-flex-between' key={nanoid()}>
								<div className='pub-flex-align-center w260 pub-lh18'>
									{!isEditFileName && item?.fileName}
									{isEditFileName && (
										<CustomInput
											className="form-control form-input pub-border w150"
											type="text"
											defaultValue={item?.fileName}
											onBlur={(e) => changeFileName(e, item)}
										/>
									)}
									<div onClick={() => setIsEditFileName(true)} className='ml20 sprite-account-icons sprite-account-icons-2-2 mr10'></div>
								</div>
								<div className='w200 pub-lh18'>{iDateAdded}: {handleMomentTime(item?.createTime)}</div>
								<div className='w200 pub-lh18'>
									{i18Translate('i18Bom.verifiedLines', "Verified Lines")}: {item?.matchNum} / {i18Translate('i18Bom.totalLines', "Total Lines")}: {item?.totalNum}</div>
								<div className="pub-flex-align-center">
									<Link href={`${getEnvUrl(QUOTE_BOM_DETAIL)}/` + item?.id}>
										<a>
											<button
												ghost='true'
												className='login-page-login-btn ps-add-cart-footer-btn custom-antd-primary w120'
											>
												<p>{i18Translate('i18MenuText.view', 'View')}</p>
											</button>
										</a>
									</Link>
									<div className='ml20 sprite-icon4-cart sprite-icon4-cart-3-6' onClick={() => delFile(item)}></div>
								</div>
							</div>
						})
					}

				</div>}


			</div>

			<div className={`${isBorder ? 'pub-border15' : 'pub-t15-20'} mt20 ${isBoxShadow && 'box-shadow'}`}>
				{/* 物料清单特性 */}
				<p className='mb10 pub-font14 pub-fontw'>{iBOMFeatures}</p>
				<ul className={styles.saveListUl}>
					{iBOMfeaturesList?.map((item) => {
						return (
							<li>
								{item}
							</li>
						);
					})}
					{/* <li>Real time price and availability for your entire parts list</li>
					<li>Try it as a Guest user (up to three lists as Guest. Log in or create a web account in to save the lists and create a quote)</li>
					<li>Match your parts using any of these criteria: Manufacturer part numbers or Product descriptions or keywords</li>
					<li>Easy and fast file upload</li>
					<li>Intuitive columns data mapping</li>
					<li>Enhanced data match results</li>
					<li>Automated refresh of pricing & stock on saved lists</li>
					<li>Ability to add extra lines to uploaded and saved lists</li>
					<li>Ability to proceed to PO/basket for all or selected lines</li>
					<li>Excel download option, maintaining your original file format</li> */}
				</ul>
			</div>

			<Modal
				title=""
				open={open}
				footer={null}
				style={{
					top: 300,
				}}
				width={360}
				onCancel={() => setOpen(false)}
				maskClosable={false}
				closable={false}
				closeIcon={<i className="icon icon-cross2"></i>}
			>
				<div className="pub-font16 pub-color555 pub-center">
					<div className="pub-fontw">Please wait while we upload and check</div>
					<div className="pub-fontw">your file size and format</div>
				</div>
				<div className="mt30 pub-flex-center pub-center">
					<Progress
						type="circle" percent={75} width={68}
						strokeColor="#1770DE"
						trailColor="#E3E4E6"
					/>
				</div>
			</Modal>

			{
				isShowModal && (
					<MappingBomModal
						isShowModal={isShowModal}
						tableSource={tableSource}
						columnsLength={columnsLength}
						isMore300={isMore300}
						cancelModule={() => setIsShowModal(false)}
						chooseModule={() => setIsShowModal(false)}
						bomModalChangeSheet={(val) => bomModalChangeSheet(val)}
					/>
				)
			}

			{
				isShowTipModal && <MinModalTip
					isShowTipModal={isShowTipModal}
					tipTitle={tipTitle}
					tipText={tipText}
					cancelText={iCancel}
					width={568}
					handleOk={isMore300 ? handleComfirm : null}
					onCancel={() => setIsShowTipModal(false)}
				/>
			}

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
			</Modal>
		</div >
	)
}

export default connect((state) => state)(QuoteBom);