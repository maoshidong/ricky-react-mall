import { useLanguage, useI18 } from "~/hooks"
import classNames from "classnames"
import styles from "~/scss/module/_tenc.module.scss"
// 询价提示
const QuoteStepTipCom = () => {
	const { i18Translate } = useLanguage()
	const { iStep } = useI18()
	const iStepsCreateQuote = i18Translate('i18QuotePage.Steps to Create a Quote', 'Steps to Create a Quote');
	const iCreateQuote = i18Translate('i18QuotePage.Create a Quote', 'Create a Quote');
	const iSubmitQuote = i18Translate('i18QuotePage.Submit a Quote', 'Submit a Quote');
	const iReplyQuote = i18Translate('i18QuotePage.Reply to a Quote', 'Reply to a Quote');
	const iStepsTip1 = i18Translate('i18QuotePage.stepsTip1', 'Add product information to the parts list by typing, pasting or uploading a file to create a quote.');
	const iStepsTip2 = i18Translate('i18QuotePage.stepsTip2', 'Simply fill in your contact information (name, email, notes) to submit a quote.');
	const iStepsTip3 = i18Translate('i18QuotePage.stepsTip3', 'Our sales team will review it and respond to your quote via email or Origin Data account within one business day.');

	return (
		<ul className='catalogs__top-fixed pub-color18' style={{ maxWidth: '470px', minWidth: '300px', paddingLeft: 0 }}>
			<li className='mb20 pub-font14 pub-fontw'>{iStepsCreateQuote}</li>
			<li className='pub-flex mb15 pub-font13'>
				<span className={classNames('mr10', styles.tenc, styles.tenc35)}></span>
				<div>
					<p>{iStep} 1: {iCreateQuote}</p>
					{iStepsTip1}
				</div>
			</li>

			<li className='pub-flex mb15 pub-font13'>
				<span className={classNames('mr10', styles.tenc, styles.tenc11)}></span>
				<div>
					<p>{iStep} 2: {iSubmitQuote}</p>
					{iStepsTip2}
				</div>
			</li>

			<li className='pub-flex mb15 pub-font13'>
				<span className={classNames('mr10', styles.tenc, styles.tenc64)}></span>
				<div>
					<p>{iStep} 3: {iReplyQuote}</p>
					{iStepsTip3}
				</div>
			</li>

		</ul >
	)
}

export default QuoteStepTipCom