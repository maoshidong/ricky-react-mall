import React, { useState, useRef } from 'react';
import MinModalTip from '~/components/ecomerce/minCom/MinModalTip';
import MappingBomModal from '~/components/partials/shop/MappingBomModal';
import UploadXLSX from '~/components/partials/shop/UploadXLSX';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';

/* 
bom上传入口组件-worksheetList - 表数组
*/
const BomUploadBoxCom = ({ isDefaultUpload = true, children }) => {
	const { i18Translate } = useLanguage();
	const { iFileError, iAccept2, iSizError, iMaximum, iLineItemsExceeded, iRowLimit,
		iWarning, iRowTip, iCancel
	} = useI18();
	const [isShowModal, setIsShowModal] = useState(false);
	const [isShowTipModal, setIsShowTipModal] = useState(false); // 提示modal
	const [tipTitle, setTipTitle] = useState('ERR'); // 提示modal
	const [tipText, setTipText] = useState('Err'); // 提示modal
	const [tableSource, setTableSource] = useState([]); // 表数据
	const [columnsLength, setColumnsLength] = useState(0);
	const upLoadRef = useRef(null);
	const [isMore300, setIsMore300] = useState(false); // 是否超过300行

	const uploadBeforeUpload = (validFileType, isLt2M, isMaxRowCount) => {
		if (!validFileType) {
			setTipTitle(iFileError);
			setTipText(iAccept2);
			setIsShowTipModal(true);
			return;
		}
		if (!isLt2M) {
			setTipTitle(iSizError);
			setTipText(iMaximum);
			setIsShowTipModal(true);
		}
		if (!isMaxRowCount) {
			setTipTitle(iLineItemsExceeded);
			setTipText(iRowLimit);
			setIsShowTipModal(true);
		}
	};
	const bomModalChangeSheet = (val) => {
		upLoadRef.current.handleWorkbook(val, false);
	};

	const tableSourceUpload = (data, isShow) => {
		// bom限制行数量301
		if (data?.length > 301 && isShow) {
			setIsMore300(true)
			setTipTitle(iWarning);
			setTipText(iRowTip);
			setIsShowTipModal(true);
		} else {
			setIsMore300(false)
			setIsShowModal(true);
		}
		// 只取前300条
		setTableSource(data?.slice(0, 301));
		setColumnsLength(data?.[0]?.columnsLength || 0);
	};

	const handleComfirm = () => {
		setIsShowTipModal(false)
		setIsShowModal(true)
	}

	// bom限制行数量301
	const text = 'Drop files here! Maximum file size 2MB. File types accepted xls, xlxs & csv with no more than 300 lines.';
	const text1 = "Values you'd like to match should be within the first 10 columns of your file.";
	const iUploadLimit1 = i18Translate('i18Bom.uploadLimit1', text);
	const iUploadLimit2 = i18Translate('i18Bom.uploadLimit2', text1);

	return (
		<div className="quote-bom-page upload-box">
			<UploadXLSX tableSourceUpload={tableSourceUpload} uploadBeforeUpload={uploadBeforeUpload} ref={upLoadRef}>
				{isDefaultUpload && (
					<div className="upload-box">
						<div className="sprite-about-us sprite-about-us-1-1"></div>
						<div className="mt15 upload-text">{iUploadLimit1}</div>
						<div className="pub-flex-center pub-color555 pub-font13">{iUploadLimit2}</div>
					</div>
				)}
				{!isDefaultUpload && children}
			</UploadXLSX>

			{isShowModal && (
				<MappingBomModal
					isShowModal={isShowModal}
					tableSource={tableSource}
					columnsLength={columnsLength}
					isMore300={isMore300}
					cancelModule={() => setIsShowModal(false)}
					chooseModule={() => setIsShowModal(false)}
					bomModalChangeSheet={(val) => bomModalChangeSheet(val)}
				/>
			)}

			{isShowTipModal && (
				<MinModalTip
					isShowTipModal={isShowTipModal}
					tipTitle={tipTitle}
					tipText={tipText}
					cancelText={iCancel}
					width={568}
					handleOk={isMore300 ? handleComfirm : null}
					onCancel={() => setIsShowTipModal(false)}
				/>
			)}
		</div>
	);
};

export default BomUploadBoxCom