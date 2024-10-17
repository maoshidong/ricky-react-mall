import React, { useState, useEffect } from 'react';
import { i18n } from 'next-i18next';
import useLanguage from '~/hooks/useLanguage';
import { getWinLocale } from '~/utilities/easy-helpers';
import { I18NEXT_LOCALE, GENERALIZED_WORD } from '~/utilities/constant';

const LogoCom = () => {
	if (!i18n?.language) return null;
	const { i18Translate, curLanguageCodeZh } = useLanguage();
	const iOriginMall = i18Translate('i18CompanyInfo.Origin Electronic Parts Mall', GENERALIZED_WORD);

	const [logoUrl, setLogoUrl] = useState(curLanguageCodeZh() ? '/static/img/zhLogo.png' : '/static/img/logo.png')

	useEffect(() => {
		const url = getWinLocale() === I18NEXT_LOCALE.zh ? '/static/img/zhLogo.png' : '/static/img/logo.png'
		setLogoUrl(url)
	}, [getWinLocale()])


	// return 111
	return <img src={logoUrl} title={iOriginMall} alt={iOriginMall} style={{ height: '38px' }} />;
};
export default LogoCom;