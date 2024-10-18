import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { PRIVACY_CENTER, PRIVACY_TERMS_AND_CONDITIONS } from '~/utilities/sites-url'
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
import classNames from 'classnames';
import { getExpiresTime } from '~/utilities/common-helpers';
import styles from './_AgreeCookies.module.scss';

const AgreeCookies = () => {
	const { i18Translate } = useLanguage();
	const { iCancel, iContinue, iPrivacyCenter, iTermsAndConditions } = useI18();

	const [cookies, setCookie] = useCookies(['isAgreeCookies']);
	const { isAgreeCookies } = cookies;

	const [isShowCookies, setIsShowCookies] = useState(false);
	const iAnd = i18Translate('i18SmallText.And', "and")
	const iContent = i18Translate('i18Footer.CookieContent', `By clicking “Continue”, you agree to the storing of cookies on your device to enhance site navigation, analyze site usage, and assist in our marketing efforts. Visitors have the right to withdraw their consent. For additional information you may view the cookie details. Read more about our`);

	const handleAgreeSure = () => {
		setIsShowCookies(true)
		setCookie('isAgreeCookies', 1, { path: '/', expires: getExpiresTime(360) });
	}
	const agree = () => {
		const bodyElement = document?.body;
		bodyElement.classList.remove('agree-cookies-body');
		handleAgreeSure()
		// setCookie('isAgreeCookies', true, { path: '/' });
	}

	const isHide = !(isShowCookies && !isAgreeCookies) // 条件成立返回null
	useEffect(() => {
		if (isHide) return null // 必须要，不然有遮罩层，滑动不了?
		const bodyElement = document?.body;
		if (isAgreeCookies) {
			bodyElement.classList.remove('agree-cookies-body');
		} else {
			bodyElement.classList.add('agree-cookies-body');
		}
	}, [])

	useEffect(() => {
		setIsShowCookies(true)
	}, [])

	// console.log('isAgreeCookies', isAgreeCookies)
	if (isHide) return null
	// if ((!isShowCookies && isAgreeCookies !== 1)) return null
	return (
		<div className={classNames('agree-cookies pub-bgc-opacity ' + (isAgreeCookies ? 'agree-cookies-hidden' : '', styles.agreeCookies))}>
			<div className={styles.agreeCookiesContent}>

				{/* <div className="mt25 mb10 pub-font18 pub-fontw pub-color555">Cookie Consent</div> */}
				<div className={styles.agreeCookiesText}>
					<div className={classNames('pub-font16 pub-lh20', styles.text)}>{iContent}
						<a target="_blank" href={PRIVACY_CENTER} className="pub-color-link"> {iPrivacyCenter}</a>&nbsp;{iAnd}&nbsp;
						<a target="_blank" href={PRIVACY_TERMS_AND_CONDITIONS} className="pub-color-link"> {iTermsAndConditions}</a>
					</div>

					<div className={styles.btn}>
						<div className={styles.acceptAll} onClick={() => agree()}>
							<img
								src={`/static/img/icons/agree.svg`}
								alt={process.env.title}
								title={process.env.title}
								className={styles.agree}
							/>
							<span className="ml8 pub-font16 pub-fontw">{iContinue}</span>
						</div>
						<span className='pub-color-link ml30' onClick={() => agree()}>{iCancel}</span>
					</div>
				</div>

			</div>
		</div>
	)
}

export default AgreeCookies