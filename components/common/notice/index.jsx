import useLanguage from '~/hooks/useLanguage';
import { ORDER_SHIPPING_TIP } from '~/utilities/constant';

/**
 * Notice 信息提示
 * @param noticeIcon 传入图标组件
 * @param noticeStart 以什么开头（如：Notice，Tip，Message）
 * @param noticeContent 提示内容
 * @param type 根据类型显示提示消息
 * **/
const Notice = ({ noticeIcon = null, noticeStart = '', noticeContent = '', type = '', className = '', style = {} }) => {
	const { i18Translate } = useLanguage();
	const iNotice = i18Translate('i18ResourcePages.Notice', 'Notice');
	const iNoticeTip = i18Translate('i18AboutOrder2.PriceNotice', ORDER_SHIPPING_TIP);

	let noticeInfo = '';
	// 把提示信息都在组件中，通过type类型来显示notice
	if (!noticeContent) {
		switch (type) {
			case 'price':
			case 'costTip':
				noticeInfo = iNoticeTip;
				break;
			default:
		}
	}

	return (
		<div className={`pub-flex-align-center ps-quote-tip ${className}`} style={style}>
			{noticeIcon || <span className="sprite-icon4-cart sprite-icon4-cart-6-3 mr10" />}
			{noticeStart || iNotice}: {noticeContent || noticeInfo}
		</div>
	);
};

export default Notice;
