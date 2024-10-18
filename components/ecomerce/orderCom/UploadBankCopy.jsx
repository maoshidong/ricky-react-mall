import React, { useState } from 'react';
import { Button, Upload, Modal } from 'antd';
import useLanguage from '~/hooks/useLanguage';
import OrderRepository from '~/repositories/zqx/OrderRepository';
import MinModalTip from '~/components/ecomerce/minCom/MinModalTip'; // 公共提示
import { useCookies } from 'react-cookie';
import find from 'lodash/find';

// 银行支付上传银行水单按钮， 补充多语言
const UploadBankCopy = React.memo((props) => {
	const { i18Translate } = useLanguage();
	const iBankCopy = i18Translate('i18AboutOrder.Bank Copy', 'Bank Copy');
	const iUploadBankCopy = i18Translate('i18SmallText.Upload Bank Copy', 'Upload Bank Copy');
	const iUploadBankCopy1 = i18Translate('i18SmallText.View Bank Copy', 'View Bank Copy');
	const iAdd = i18Translate('i18SmallText.Add', 'Add');
	const iOperationTips = i18Translate('i18SmallText.Operation tips', 'OPERATION TIPS');
	const iOperationTipsDes = i18Translate('i18SmallText.OperationTipsDes', 'Are you sure you want to delete this section?');
	const iPdfAndPic = i18Translate('i18AboutOrder.pdfAndPic', 'You can only upload pictures or PDF files');
	const iBankUploadTip = i18Translate('i18AboutOrder.BankUploadTip', 'Upload no more than 5 files');

	const [delShowModal, setDelShowModal] = useState(false); // 删除文件
	const [delFileData, setDelFileData] = useState({});
	const [firstReader, setFirstReader] = useState(false); // 是否是第一次获取列表，用于判断之前上传的文件不能删除
	const [firstData, setFirstData] = useState([]); // 第一次列表的数据，用于判断之前上传的文件不能删除
	const [isShowModal, setIsShowModal] = useState(false);
	const [previewOpen, setPreviewOpen] = useState(false); // 预览
	const [previewImage, setPreviewImage] = useState(''); // 预览
	const [bankCopyKey, setBankCopyKey] = useState(''); // 预览
	const [isError, setIsError] = useState(false); // 预览
	const [fileType, setFileType] = useState(1); // 文件类型
	const [fileList, setFileList] = useState([]);
	const [cookies] = useCookies(['account']);

	const { order } = props;

	// 上传
	const orderUploadBankCopy = async (formData) => {
		setIsError(false);
		const res = await OrderRepository.orderUploadBankCopy(
			{
				formData,
				orderId: order?.orderId,
				fileType,
			},
			cookies?.account?.token
		);
		setIsShowModal(true);
		getBankCopyList();
		if (res?.code !== 0) {
		}
	};

	// 文件上传
	const uploadProps = {
		name: 'file',
		accept: '.pdf, image/*',
		action: '',
		showUploadList: false,
		onChange(info) {
			if (info.file.status === 'done') {
				// 将文件转换为 Blob
				const blob = info.file.originFileObj;
				// 创建 FormData 对象并添加 Blob
				let formData = new FormData();
				formData.append('file', blob);

				orderUploadBankCopy(formData);
			}
		},
	};

	// 获取文件列表
	const getBankCopyList = async () => {
		const res = await OrderRepository.getBankCopyList(order?.orderId, cookies?.account?.token);
		if (res?.code === 0) {
			const arr = res?.data?.map((item) => {
				return {
					id: item?.id,
					url: item?.tempUrl,
					name: item?.bankCopyKey,
					status: 'done',
					fileType: item?.type,
				};
			});

			setFileList(arr);
			if (!firstReader) {
				setFirstData(arr);
				setFirstReader(true);
			}
		}
	};

	const viewBankCopy = () => {
		getBankCopyList().then(() => {
			// 上传有数据才直接打开
			if (order?.haveBankCopy || fileList?.length > 0) {
				setIsShowModal(true);
			}
		});
	};

	const handlePreview = (file) => {
		if (file?.fileType == 2) {
			window.open(file.url, '_blank');
			return;
		}

		setPreviewImage(file?.url);
		setBankCopyKey(file?.name);
		setPreviewOpen(true);
	};

	const handleCancel = () => setPreviewOpen(false);

	// 上传前限制
	const beforeUpload = (file) => {
		const isImage = file.type.startsWith('image/');
		const isPDF = file.type === 'application/pdf';
		if (!isImage && !isPDF) {
			setIsError(true);
		}
		setFileType(isImage ? 1 : 2);
		return isImage || isPDF;
	};

	// 确定删除文件
	const delFile = async () => {
		const index = fileList?.indexOf(delFileData);
		const newFileList = fileList?.slice();
		newFileList?.splice(index, 1);
		setFileList(newFileList);
		const res = await OrderRepository.deleteBankCopyUrl(delFileData?.id, cookies?.account?.token);
		if (res.code === 0) {
			setDelShowModal(false);
		}
	};

	const handleRemove = (file) => {
		// 如果要删除的文件满足特定条件，则不执行删除操作
		if (file.name === '不删除的图片名称') {
			return false;
		}
		setDelShowModal(true);
		setDelFileData(file);
	};

	// 上传按钮
	const bankCopyBtn = () => {
		return (
			<Button type="primary" ghost="true" className="login-page-login-btn ps-add-cart-footer-btn custom-antd-primary " onClick={viewBankCopy}>
				<div className="pub-flex-center">
					<div>{order?.haveBankCopy || fileList?.length > 0 ? iUploadBankCopy1 : iUploadBankCopy}</div>
				</div>
			</Button>
		);
	};

	return (
		<div className="custom-antd-btn-more">
			{order?.haveBankCopy || fileList?.length > 0 ? bankCopyBtn() : <Upload {...uploadProps}>{bankCopyBtn()}</Upload>}

			{isShowModal && (
				<MinModalTip
					isShowTipModal={isShowModal}
					width={700}
					tipTitle={iBankCopy}
					isChildrenTip={true}
					className="custom-antd-btn-more"
					submitText={i18Translate('i18FunBtnText.Confirm', 'Confirm')}
					onCancel={() => setIsShowModal(false)}
					handleOk={() => (setIsShowModal(false), setFirstData(fileList), setFirstReader(false))}
				>
					<div className="custom-antd-btn-more">
						{/* 新增 */}
						{fileList?.length < 5 && (
							<div className="pub-flex-align-center mb10">
								<Upload {...uploadProps} beforeUpload={beforeUpload}>
									<Button type="primary" ghost className="ps-add-cart-footer-btn custom-antd-primary w100">
										{iAdd}
									</Button>
								</Upload>
								{isError && <span className="pub-danger pub-font12 ml10">{iPdfAndPic}</span>}
							</div>
						)}
						{fileList?.length >= 5 && <div className="pub-danger mb10">{iBankUploadTip}</div>}

						{/* 上传图片照片墙 */}
						<div className="cust-upload" style={{ height: '112px' }}>
							<Upload
								action="commonUploadUrl"
								listType="picture-card"
								fileList={fileList}
								onPreview={handlePreview}
								onRemove={handleRemove}
								showUploadList={{
									removeIcon: (file) => {
										// 判断数据是否已经存在了，存在的不可删除
										const isExist = find(firstData, (fd) => fd.id === file.id);
										if (isExist) {
											return <></>;
										}
									},
								}}
								style={{ width: 'auto' }}
							/>

							{/* 不可删除的 */}
							{/* <Upload
								action="commonUploadUrl"
								listType="picture-card"
								fileList={firstData}
								onPreview={handlePreview}
								onRemove={handleRemove}
								showUploadList={{
									showRemoveIcon: false, // 不显示上传列表中的删除按钮
								}}
								style={{ width: 'auto' }}
							></Upload> */}
							{/* 可删除的 */}
							{/* <Upload
								action="commonUploadUrl"
								listType="picture-card"
								fileList={fileList.filter((itemA) => !firstData.some((itemB) => itemB.id === itemA.id))}
								onPreview={handlePreview}
								onRemove={handleRemove}
								showUploadList={{
									showRemoveIcon: true, // 不显示上传列表中的删除按钮
								}}
								style={{ width: 'auto' }}
							></Upload> */}
						</div>
					</div>
				</MinModalTip>
			)}

			{/* 删除 */}
			{delShowModal && (
				<MinModalTip
					isShowTipModal={delShowModal}
					width={500}
					tipTitle={iOperationTips}
					isChildrenTip={true}
					className="custom-antd-btn-more"
					submitText={i18Translate('i18FunBtnText.Confirm', 'Confirm')}
					onCancel={() => setDelShowModal(false)}
					handleOk={() => delFile()}
				>
					{iOperationTipsDes}
				</MinModalTip>
			)}

			{/* 预览 */}
			<Modal open={previewOpen} title={bankCopyKey} footer={null} onCancel={handleCancel}>
				<img
					alt="example"
					style={{
						width: '100%',
					}}
					src={previewImage}
				/>
			</Modal>
		</div>
	);
});

export default UploadBankCopy