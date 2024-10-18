
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';

import MinModalTip from '~/components/ecomerce/minCom/MinModalTip' // 公共提示
import { handleMomentTime } from '~/utilities/common-helpers'

// 邮件报价产品,过期提示
const EmialQuoteCartPromptCom = ({ cancel, handleOk, infoList = [] }) => {
	const { i18Translate } = useLanguage();
	const { iIsCreateNewCartTip, iClose } = useI18();
	const iTitle = i18Translate('i18AboutOrder.Shopping Cart Notification', 'Shopping Cart Notification')
	const iQuoteExpiryDate = i18Translate('i18QuotePage.Quote expiry date', 'Quote expiry date')
	const iQuotePastTip = i18Translate('i18QuotePage.quotePastTip', 'We apologize, but the product cannot be added to your shopping cart as the quote has expired.')
	const iQuotePastContactTip = i18Translate('i18QuotePage.quotePastContactTip', 'Please contact our sales representative for the latest quote. You can quickly add the product to an inquiry list using the button below. Thank you.')
	return <MinModalTip
		isShowTipModal={true}
		width={550}
		tipTitle={iTitle}
		tipText={iIsCreateNewCartTip}
		isChildrenTip={true}
		cancelText={iClose}
		submitText={i18Translate('i18FunBtnText.AddToRfq', "Add to Inquiry List")}
		onCancel={() => cancel()}
		handleOk={() => handleOk()}
	>
		<div>
			<div className='mb10'>{iQuoteExpiryDate}: {handleMomentTime(infoList?.[0]?.expireTime)}</div>
			<div className='pub-lh20'>{iQuotePastTip}</div>
			<div className='pub-lh20'>{iQuotePastContactTip}</div>
		</div>
	</MinModalTip>
}

export default EmialQuoteCartPromptCom