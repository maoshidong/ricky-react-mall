import React from 'react';
import Head from 'next/head';
import { Row, Col } from 'antd';
import PageContainer from '~/components/layouts/PageContainer';
import PageTopBanner from '~/components/shared/blocks/banner/PageTopBanner';
import CertificarionsItem from '~/components/partials/page/CertificarionsItem';
// import { TitleMore } from '~/components/shared';
import { Tabs } from '~/components/partials';
import { Element } from 'react-scroll';

import useLanguage from '~/hooks/useLanguage';
import CommonRepository from '~/repositories/zqx/CommonRepository';

import { All_SEO2 } from '~/utilities/constant';
import { changeServerSideLanguage, getLocale } from '~/utilities/easy-helpers';
import styles from "scss/module/_firstLoad.module.scss";

const ContactUsPage = ({ paramMap, isMobile, authList }) => {
	const { i18Translate, curLanguageCodeZh } = useLanguage();

	// const getCertificationsItem = (item) => {
	//     return (
	//         <div
	//             className={`${styles.certificarionsItem} box-shadow`}
	//             style={{lineHeight: '18px'}}
	//         >
	//                 <div className='certificarions-first'>
	//                     <img src={item?.imageUrl} alt={item.name} title={item.name} />
	//                     <div className='certificarions-num pub-color18 pub-font13'>{item.name}</div>
	//                 </div>

	//                 <div className='certificarions-content'>
	//                     <div className='pub-color18 pub-font13 mt15 mb10'>{item.name}</div>
	//                     <div className='pub-color555' style={{textAlign: 'left'}}>{i18MapTranslate(`i18CareersPage.${item.name}`, item.text)}</div>
	//                     <a target="_blank" href={item.url} style={{display: 'inline-block'}}>
	//                         <div className='pub-color-link mt5'>{i18Translate('i18FunBtnText.Download', 'Download')}</div>
	//                     </a>
	//                 </div>
	//             </div>
	//     )
	// }
	const certificationsBnDes = "Origin Data Global is committed to its core value of continuous improvement, Quality, and we are proud to have achieved the following certifications, memberships and compliance in our efforts to enhance our operations, development, and delivery."
	const iEnvironmentalBnTit = i18Translate('i18CareersPage.CertificationsBnTit', 'Certifications')
	const iEnvironmentalBnDes = i18Translate('i18CareersPage.CertificationsBnDes', certificationsBnDes)
	const iCertifications = i18Translate('i18MenuText.Certifications', 'CERTIFICATIONS')
	const iMemberships = i18Translate('i18CareersPage.Memberships', 'MEMBERSHIPS')
	const iCompliance = i18Translate('i18CareersPage.Compliance', 'COMPLIANCE')

	const { certificationsTit, certificationsKey, certificationsDes } = All_SEO2?.certifications
	const i18Title = i18Translate('i18Seo.certifications.title', certificationsTit)
	const i18Key = i18Translate('i18Seo.certifications.keywords', certificationsKey)
	const i18Des = i18Translate('i18Seo.certifications.description', certificationsDes)

	let tabsArr = [
		{ label: iCertifications, value: '0' },
		{ label: iMemberships, value: '1' },
		{ label: iCompliance, value: '2' },
	]
	if (curLanguageCodeZh()) {
		tabsArr = tabsArr.filter(i => i.value !== '1')
	}

	// const aaa = authList
	// if(authList?.map(item => item?.type === 0))
	// authList?.map(item => {
	//     if(item?.type === 0) {
	//         tabsArr.push({label: iCertifications, value: '0'},)
	//     } else if(item?.type === 1) {
	//         tabsArr.push({label: iMemberships, value: '1'},)
	//     } else if(item?.type === 2) {
	//         tabsArr.push({label: iMemberships, value: '1'},)
	//     }
	// })
	// 根据类型返回数据
	const getTypeCertifications = (type, title) => {
		// 当前类型的数据
		const curArr = authList?.filter(item => item?.type == type)
		if (curArr?.length === 0) return null
		return <Element className='mb60' name={type}>
			{/* <h2 className='pub-color18 pub-font16 pub-fontw'>{title}</h2> */}
			<h2 className='pub-title'>{title}</h2>
			{/* <TitleMore title={title} /> */}
			<Row gutter={10} className={`${styles.certificarionsUl} row mt50 blocks-certificarions`}>
				{curArr?.map((item, index) => (
					<Col xs={24} sm={24} md={12} xl={4} lg={8} key={title + index}>
						{/* {getCertificationsItem(item)} */}
						<CertificarionsItem item={item} />
					</Col>
				))}
			</Row>
		</Element>
	}

	return (
		<PageContainer isMobile={isMobile} paramMap={paramMap}>
			<Head>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />
			</Head>
			<div className={`${styles.psCertifications} ps-page--single ps-about-us pub-bgc-f5 pub-minh-1`}>
				<PageTopBanner
					bgcImg="certificationsBgc.jpg"
					title={iEnvironmentalBnTit}
					titleH1={true}
					description={iEnvironmentalBnDes}
					otherTitleClass={'pub-color555'}
					otherDescriptionClass={'pub-color555'}
				/>
				<Tabs tabsArr={tabsArr} offset={-150} duration={300} />
				<div className='ps-container'>

					<div className='certifications-box pt-60'>
						{/* 暂时隐藏 */}
						{/* <div className='certifications-left pub-border15'>
                            <div className='certifications-tabs pub-color555'>
                                <div
                                    className={'certifications-item ' + (tabActive == '1' ? 'certifications-active' : '')}
                                    onClick={() => seTabActive('1')}
                                >Certifications</div>
                                <div
                                    className={'certifications-item ' + (tabActive == '2' ? 'certifications-active' : '')}
                                    onClick={() => seTabActive('2')}
                                >Memberships</div>
                                <div
                                    className={'certifications-item ' + (tabActive == '3' ? 'certifications-active' : '')}
                                    onClick={() => seTabActive('3')}
                                >Compliance</div>
                            </div>
                        </div> */}
						{/* certifications-right  */}
						{getTypeCertifications('0', iCertifications)}
						{getTypeCertifications('1', iMemberships)}
						{getTypeCertifications('2', iCompliance)}
					</div>
				</div>
			</div>
		</PageContainer>
	);
};
export default ContactUsPage;

export async function getServerSideProps({ req }) {
	const [translations, authList] = await Promise.all([
		changeServerSideLanguage(req),
		CommonRepository.apiAuthList({
			languageType: getLocale(req),
		}),
	]);

	return {
		props: {
			...translations,
			authList: authList?.data || [],
		}
	}
}
