import React from 'react';
import Head from 'next/head';
import BreadCrumb from '~/components/elements/BreadCrumb';
import PageContainer from '~/components/layouts/PageContainer';
import PageTopBanner from '~/components/shared/blocks/banner/PageTopBanner';
import { All_SEO2, SCOMPANY_NAME } from '~/utilities/constant';
import { getEnvUrl, PAGE_IENVIRONMENTAL } from '~/utilities/sites-url';
import { changeServerSideLanguage } from '~/utilities/easy-helpers';
import useLanguage from '~/hooks/useLanguage';
import styles from "./_page.module.scss";
import stylesPub from '~/scss/module/_pub.module.scss';
export const config = { amp: 'hybrid' }

const Environmental = ({ paramMap, isMobile }) => {
	const { i18Translate, curLanguageCodeEn } = useLanguage();
	const iEnvironmentalDes = i18Translate('i18Ueditor.EnvironmentalDes', "Origin Data is committed to the continual improvement of processes affecting the environment to enhance environmental")
	const iEnvironmentalConTit = i18Translate('i18CareersPage.EnvironmentalConTit', "Environmental Policy and Objectives")

	const breadcrumb = [
		{
			text: i18Translate('i18MenuText.Login', 'Home'),
			url: '/',
		},
		{
			text: i18Translate('i18MenuText.Environmental', 'Environmental'),
			url: getEnvUrl(PAGE_IENVIRONMENTAL)
		}
	];


	const environmentalBnDes = "To demonstrate Origin Data commitment to protect the environment and mitigate adverse environmental impacts, in 2023 Origin Data became certified to ISO 14001:2015 with annual compliance auditing."
	const iEnvironmentalBnTit = i18Translate('i18CareersPage.EnvironmentalBnTit', 'Environmental')
	const iEnvironmentalBnDes = i18Translate('i18CareersPage.EnvironmentalBnDes', environmentalBnDes)
	const { environmentalTit, environmentalKey, environmentalDes } = All_SEO2?.environmental
	const i18Title = i18Translate('i18Seo.environmental.title', environmentalTit)
	const i18Key = i18Translate('i18Seo.environmental.keywords', environmentalKey)
	const i18Des = i18Translate('i18Seo.environmental.description', environmentalDes)

	return (
		<PageContainer isMobile={isMobile} paramMap={paramMap}>
			<Head>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />
			</Head>
			<div className={`${styles.psEnvironmental} ps-page--single ps-about-us pub-bgc-f5 pub-minh-1`}>
				<PageTopBanner
					bgcImg="environmentalBgc.jpg"
					title={iEnvironmentalBnTit}
					titleH1={true}
					description={iEnvironmentalBnDes}
					otherDescriptionClass={'pub-lh20'}
				/>

				<div className='ps-container'>
					<BreadCrumb breacrumb={breadcrumb} layout="fullwidth" />

					<div className='mt25 pub-lh18 pub-color555 pub-border15'>
						<h2 className='pub-left-title'>{iEnvironmentalConTit}</h2>
						<div className={styles.environmentalContent}>
							{
								!curLanguageCodeEn() && <div className='pub-flex-grow pub-link-a mt10 pub-lh18 vue-ueditor-wrap' dangerouslySetInnerHTML={{ __html: iEnvironmentalDes }}></div>
							}
							{
								curLanguageCodeEn() && <div>
									<p className='mt10'>Origin Data is committed to the continual improvement of processes affecting the environment to enhance environmental
										performance and complying with all legal and other requirements related to our environmental aspects – with a goal of preventing
										pollution and the conservative use of resources. We look to:</p>

									<ul className={stylesPub.saveListUl}>
										<li>Reduce our carbon footprint</li>
										<li>Reduce our use of water</li>
										<li>Increase the amount of recycled materials</li>
									</ul>

									<p className='mt10'>At Origin Data our environmental policy encompasses all relevant environmental laws and regulations globally. We also work closely
										with our manufacturers to provide our customers with products that are compliant with relevant environmental laws and regulations.</p>

									<p className='mt10'>{SCOMPANY_NAME} is a broad line independent distributor of electronic components, Origin Data intends to properly identify all
										environmental aspects of the products we carry. We are committed to include accurate and traceable identification to part numbers via
										documentation from our manufacturers. In addition, we will prevent the mixing of products with different environmental aspects through
										strict inventory control and conservative return policies.</p>

									<h3 className='mt10 pub-font14 pub-fontw'>Environmental Information</h3>

									<p className='mt5'>This information is designed to help you understand the environmental issues facing the electronics industry today and those in the
										future. Additionally, we want you to know that Origin Data and its manufacturers are working together to assure our customers that
										products in compliance with existing directives and legislation are available.</p>

									<p className='mt10'>We will strive to keep the most up-to-date information available to you. Please feel free to contact us with any suggestions for our
										environmental web pages or questions about our policies.</p>

									<p className='mt10'>
										Contact us for more info at
										<a href={`mailto:${paramMap?.excessEmail || 'excess@origin-ic.net'}`} className='pub-color-link'> {paramMap?.excessEmail || 'excess@origin-ic.net'}</a>
									</p>
								</div>
							}
							<img
								className={`${styles.environmentalImg} ml40`}
								src='/static/img/bg/environmental.png' alt="banner"
								style={{ width: 'fit-content', height: 'fit-content' }}
							/>
						</div>
					</div>
				</div>
			</div>
		</PageContainer>
	);
};
export default Environmental;

export async function getServerSideProps({ req }) {
	const translations = await changeServerSideLanguage(req)

	return {
		props: {
			...translations,
		}
	}
}


