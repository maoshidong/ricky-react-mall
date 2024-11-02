import React, { useMemo } from 'react';
import Link from 'next/link';
import { HELP_SITE_MAP, PRIVACY_CENTER, PRIVACY_TERMS_AND_CONDITIONS, PRODUCTS_LIST } from '~/utilities/sites-url';
import { ZQX_ADDRESS } from '~/utilities/constant';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';

import { helpersAn, helpersO9 } from '~/utilities/common-helpers'

// 底部地址
const FooterCopyright = () => {
	const { i18Translate, curLanguageCodeZh, getLanguageHost } = useLanguage();
	const { iProductIndex, iKeywords } = useI18();

	const date = new Date()
	const year = date.getFullYear()

	const iPrivacyCenter = i18Translate('i18MenuText.Privacy Center', 'Privacy Center');
	const iTerms = i18Translate('i18MenuText.Terms and Conditions', 'Terms and Conditions');
	const iSiteMap = i18Translate('i18MenuText.Site Map', 'Site Map');
	const iCopyright = i18Translate('i18Footer.copyright', 'Copyright © 2024 Origin Data Global Limited, All rights reserved.', { year }); // Copyright © 2024 Origin Data Global Limited, All rights reserved.
	const iCopyright1 = i18Translate('i18Footer.copyright1', 'ICP record/License number');
	const iCopyright2 = i18Translate('i18Footer.copyright2', 'Guangdong ICP No. 2024267145');
	const iAddress = i18Translate('i18CompanyInfo.address', ZQX_ADDRESS);


	// 子元素数量最大值 DOM 规模过大
	const productList = useMemo(() => {
		const productLists = helpersAn();
		const productLists2 = helpersO9();
		return (
			<div className='pub-flex-align-center mb20 pub-font12 pub-color555' style={{ textAlign: 'left', }}>
				<div>{iProductIndex}: &nbsp;</div>
				<div className='pub-flex' style={{ gap: '15px' }}>
					{/* <a href={PRODUCTS_LIST} title="Part Number" target="_blank">Electronic Parts Index</a> */}
					{productLists?.map(item => {
						return <a className='pub-color-hover pub-color555' key={'c' + item} href={PRODUCTS_LIST + `/${item}`} title={"Part Number Start with " + item} target="_blank">{item}</a>
					})}
					{productLists2?.map(item => {
						return <a className='pub-color-hover pub-color555' key={'b' + item} href={PRODUCTS_LIST + `/${item}`} title={"Part Number Start with " + item} target="_blank">{item}</a>
					})}
				</div>
			</div>
		)
	}, [helpersAn(), helpersO9()]);
	// const productList2 = useMemo(() => {
	// 	const productLists = helpersO9();
	// 	return (
	// 		<div>
	// 			{productLists?.map(item => {
	// 				return <a key={'b' + item} href={PRODUCTS_LIST + `/${item}`} title={"Part Number Start with " + item} target="_blank">{item}</a>
	// 			})}
	// 		</div>
	// 	)
	// }, [helpersO9()]);
	const iElectronicComponentsDistributor = i18Translate('i18CompanyInfo.Electronic Components Distributor', 'Electronic Components Distributor');
	const objPro = { title: iElectronicComponentsDistributor, target: "_blank" }
	const strongText = () => <strong>{iElectronicComponentsDistributor}</strong>

	return (
		<div className="ps-footer__copyright">
			{productList}
			<div className="ps-footer-privacy pub-flex-center">
				<Link href={PRIVACY_CENTER} style={{ display: 'inline-block' }} className="color-link">
					<a className="pub-color-hover-link">{iPrivacyCenter}</a>
				</Link>
				<Link href={PRIVACY_TERMS_AND_CONDITIONS} style={{ display: 'inline-block' }} className="color-link">
					<a className="pub-color-hover-link">{iTerms}</a>
				</Link>
				<Link href={HELP_SITE_MAP} style={{ display: 'inline-block' }} className="color-link">
					<a className="pub-color-hover-link">{iSiteMap}</a>
				</Link>
			</div>

			<p>{iAddress}</p>
			<p className='pub-flex-center'>{iCopyright}&nbsp;&nbsp;
				<span
					className={`pub-flex ${curLanguageCodeZh() ? '' : 'pub-seo-visibility1'}`}
					// style={{ width: curLanguageCodeZh() ? '0' : '1px' }}>
					style={{ width: curLanguageCodeZh() ? 'auto' : '1px' }}>
					{iCopyright1}:&nbsp;&nbsp;
					<a href="https://beian.miit.gov.cn/#/Integrated/recordQuery" className='ml0 need-link' rel="nofollow">{iCopyright2}</a>

				</span>
			</p>

			{/* seo底部-补充多语言 */}
			<p className='pub-seo-visibility1'>
				{iKeywords}: <a href={`${getLanguageHost()}/${curLanguageCodeZh() ? 'sitemap-cn.xml' : 'sitemap.xml'}`} {...objPro}>
					{strongText()}</a>
				<a href={`${getLanguageHost()}/sitemap.html`} {...objPro}>
					{strongText()}</a>
				<a href={`${getLanguageHost()}/${curLanguageCodeZh() ? 'product-list-cn.xml' : 'sitemapindex.xml'}`} {...objPro}>
					{strongText()}</a>
				<a href={`${getLanguageHost()}/${curLanguageCodeZh() ? 'sitemap-head-cn.xml' : 'sitemap-head.xml'}`} {...objPro}>
					{strongText()}</a>
			</p>



		</div>
	);
};

export default FooterCopyright;
