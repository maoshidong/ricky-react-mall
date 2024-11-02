import { Modal, Button } from 'antd';
import useLanguage from '~/hooks/useLanguage';
// keyboard: 是否支持键盘 esc 关闭
// 公共提示框Modal
const MinModalTip = ({
	width = 500, // 宽度
	maskClosable = true, // 点击蒙层是否允许关闭
	isShowTipModal, // 控制显示隐藏
	tipTitle = 'TIP', // 标题
	tipText = '', // 内容
	cancelText = '', // 取消文本
	submitText = '', // 确认文本
	otherText = '', // 其它按钮文本
	onCancel, // 取消操作
	handleOk, // 确认操作
	handleOther, // 其它操作
	showHandleOk = true, // 展示确认按钮
	showCancel = true, // 展示取消按钮
	isChildrenTip = false, // 同时内容是否以组件插槽展示
	children, // 插槽内容
	footerOk, // 底部确认插槽
	...rest
}) => {
	const { i18Translate } = useLanguage();
	const iCancel = cancelText || i18Translate('i18FunBtnText.Cancel', 'Cancel');
	const iConfirm = submitText || i18Translate('i18FunBtnText.Confirm', 'Confirm');

	// 自定义 Modal 的样式
	const customStyle = {
		top: '50%',
		// marginTop: '-15%',
		// transition: 'none',
		// transformOrigin: 'initial',
		transform: 'translateY(-70%)',  // 由于默认居中，需要调整回原来的位置参数  146 236    443
		// paddingBottom: '0',
		// display: 'flex',
		// alignItems: 'center',  // 垂直居中
		// justifyContent: 'center',  // 水平居中
		// margin: '0 auto'  // 水平居中（备用方案）
	};
	return (
		<Modal
			open={isShowTipModal}
			width={width}
			title={tipTitle?.toUpperCase()}
			onCancel={() => onCancel()}
			footer={null}
			closeIcon={<i className="icon icon-cross2"></i>}
			maskClosable={maskClosable}
			centered
			// style={customStyle}  // 应用自定义样式
			{...rest}
		>
			{!isChildrenTip && <div className="pub-lh20">{tipText}</div>}
			{isChildrenTip && <div>{children}</div>}

			{/* 弹框操作按钮组 */}
			<div className="ps-add-cart-footer custom-antd-btn-more" style={{ float: 'none' }}>
				{showCancel && (
					<Button
						type="primary"
						ghost
						className="ps-add-cart-footer-btn"
						onClick={() => {
							onCancel ? onCancel() : null;
						}}
					>
						{iCancel}
					</Button>
				)}
				{otherText && handleOther && (
					<Button type="primary" ghost className="ps-add-cart-footer-btn custom-antd-primary" onClick={() => handleOther()}>
						{otherText}
					</Button>
				)}
				{/* 确认按钮 */}
				{handleOk && showHandleOk && (
					<Button type="primary" ghost className="ps-add-cart-footer-btn custom-antd-primary" onClick={() => handleOk()}>
						{iConfirm}
					</Button>
				)}
				{footerOk}
			</div>
		</Modal>
	);
};

export default MinModalTip