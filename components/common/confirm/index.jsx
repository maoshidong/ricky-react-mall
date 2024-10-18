import { useState } from "react"
import { Modal, Button } from 'antd'
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';

/**
 * @删除二次确认
 * @param {*onConfirm} 确认删除时调用的回调函数
 * @param {*children} 子元素
*/
const Confirm = ({ children, onConfirm }) => {
	const { i18Translate } = useLanguage();
	const { iDeleteSelected } = useI18();

	const [removeModal, setRemoveModal] = useState(false)

	// 打开弹窗
	const handleOpenClick = () => {
		setRemoveModal(true)
	}

	// 关闭弹窗
	const handleRemoveCancel = () => {
		setRemoveModal(false)
	}

	// 确认操作
	const handleRemoveOk = () => {
		onConfirm?.()
		handleRemoveCancel()
	}

	return (<>
		<div onClick={handleOpenClick}>
			{children}
		</div>


		<Modal
			okText={i18Translate('i18MyCart.Remove', "Remove")}
			title={i18Translate('i18MyCart.Remove', "Delete Line Item(s)")}
			open={removeModal}
			footer={null}
			width="450px"
			style={{
				top: 300,
			}}
			onCancel={handleRemoveCancel}
			closeIcon={<i className="icon icon-cross2"></i>}
		>
			<div className='custom-antd-btn-more'>
				<div style={{ color: '#181818', fontSize: '13px' }}>
					{i18Translate('i18MyCart.DelTheseTip', "Are you sure you want to delete these item(s)?")}
				</div>
				<div className='ps-add-cart-footer' style={{ marginTop: '50px' }}>
					<Button
						type="primary" ghost='true'
						className='login-page-login-btn mr10 ml10'
						onClick={handleRemoveCancel}
					>
						{i18Translate('i18FunBtnText.Cancel', 'Cancel')}
					</Button>

					<Button
						type="submit" ghost='true'
						className='login-page-login-btn custom-antd-primary w110 ml10'
						onClick={handleRemoveOk}
					>
						{iDeleteSelected}
					</Button>

				</div>
			</div>
		</Modal>
	</>
	)
}

export default Confirm