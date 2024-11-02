import React, { useEffect } from 'react';
import Head from 'next/head';
// import Router from 'next/router';
import { useRouter } from 'next/router';
import { Element } from 'react-scroll';
import useLanguage from '~/hooks/useLanguage';

import PageContainer from '~/components/layouts/PageContainer';
// import PageTopBanner from '~/components/shared/blocks/banner/PageTopBanner';
import { PubPageBanner } from '~/components/common'

import Certificate from '~/components/partials/page/about-us/Certificate';
import Experience from '~/components/partials/page/about-us/Experience';
import BarIcon from '~/components/partials/page/about-us/BarIcon'
import Articles from '~/components/partials/page/about-us/Articles'
import Tabs from '~/components/partials/page/about-us/Tabs'
// import CanvasCom from '~/components/elements/CanvasCom'


import { All_SEO2, SCOMPANY_NAME } from '~/utilities/constant';
import { PAGE_IENVIRONMENTAL, PAGE_CONTACT_US, PAGE_INVENTORY_SOLUTIONS, PAGE_CAREERS } from '~/utilities/sites-url';
import { changeServerSideLanguage } from '~/utilities/easy-helpers';
// import CommonRepository from '~/repositories/zqx/CommonRepository';
// import axios from 'axios';

// const HeadOriginKeyWordsDes = dynamic(() => import('../../components/elements/seo/HeadOriginKeyWordsDes'));

// import HeadOriginKeyWordsDes from '~/components/elements/seo/HeadOriginKeyWordsDes';


const AboutUsPage = ({ paramMap, blocks, isMobile, test }) => {
	// console.log(test, 'test--del')
	const { i18Translate } = useLanguage();

	const Router = useRouter();

	useEffect(async () => {
		// const response3 = await fetch(`../../public/staticData/homeProducts/discount.json`);
		// const data = await response.json();
		// const response = await axios.get(`/api/getData?dataId=${1}`);

		//     const test = require("https://www.origin-ic.com111/staticData/test.json");

		// let test = []
		// if(process.env.NODE_ENV === 'development') {
		//     test = require("~/public/staticData/test.json");
		// }else{
		//     const res3 = await fetch(`${process.env.url}/staticData/homeProducts/discount.json`)
		//     const res4 = await fetch(`${process.env.url}/staticData/recommendManufacturers/en.json`)
		// }
		// console.log(getData1, 'getData1-111--del')

		const { asPath } = Router
		const anchorPoint = asPath.split('#')?.[1]
		if (anchorPoint == 'our-advantage' || anchorPoint == 'core-values') {
			setTimeout(() => {
				window.scrollBy({
					top: -170,
					left: 0,
					behavior: 'smooth'
				});
			}, 20);
		}
	}, [Router]);

	const tabsArr = [
		{ label: i18Translate('i18MenuText.About Origin', 'About Origin'), value: '1' },
		{ label: i18Translate('i18MenuText.Our Advantage', 'Our Advantage'), value: 'our-advantage' },
		{ label: i18Translate('i18MenuText.Core Values', 'Core Values'), value: 'core-values' },
		{ label: i18Translate('i18MenuText.Certifications', 'Certifications'), value: '4' },
	]
	const otherArr = [
		{ label: i18Translate('i18MenuText.Environmental', 'Environmental'), href: PAGE_IENVIRONMENTAL },
		{ label: i18Translate('i18MenuText.Contact Us', 'Contact Us'), href: PAGE_CONTACT_US },
		{ label: i18Translate('i18MenuText.Inventory Solutions', 'Inventory Solutions'), href: PAGE_INVENTORY_SOLUTIONS },
		{ label: i18Translate('i18MenuText.Careers', 'Careers'), href: PAGE_CAREERS },
	]
	const bannerDes = `${SCOMPANY_NAME} are members of ERAI. We have obtained ESD, AS9120B, IOS9001, ISO14001, and other certifications to maintain strict control over product and service quality.`

	const { aboutUsTit, aboutUsKey, aboutUsDes } = All_SEO2?.aboutUs
	const i18Title = i18Translate('i18Seo.aboutUs.title', aboutUsTit)
	const i18Key = i18Translate('i18Seo.aboutUs.keywords', aboutUsKey)
	const i18Des = i18Translate('i18Seo.aboutUs.description', aboutUsDes)

	return (
		<PageContainer isMobile={isMobile} paramMap={paramMap}>
			<Head>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />
			</Head>
			<div className="ps-containeps-page--single ps-about-us custom-antd-btn-more">
				<PubPageBanner
					bgcImg="aboutBan.webp"
					title={i18Translate('i18AboutUs.bannerTitle', 'Why Origin Data')}
					titleH1={true}
					titleStyle={{ color: '#fff' }}
					desStyle={{ color: '#fff' }}
					description={i18Translate('i18AboutUs.bannerDes', bannerDes)}
					descriptionClass="w700"
					outerClassName='aboutUsBgc'
				/>
				{/* <PageTopBanner
					bgcImg="aboutBan.png"
					title={i18Translate('i18AboutUs.bannerTitle', 'Why Origin Data')}
					titleH1={true}
					description={i18Translate('i18AboutUs.bannerDes', bannerDes)}
					descriptionClass="w700"
				/> */}

				<Tabs tabsArr={tabsArr} otherArr={otherArr} offset={-80} duration={300} />
				<div className=''>

					<Element name={'1'} key={'1'}>
						<Experience />
					</Element>

					<Element name={'our-advantage'}>
						<BarIcon />
					</Element>
					<Element name={'core-values'}>
						<Articles />
					</Element>
					<Element name={'4'} className="pub-bgcdf5">
						<Certificate props={blocks?.[1]} />
					</Element>
					{/* <CanvasCom width={400} height={300} /> */}
				</div>

				{/* <Manufacture blocks={blocks} /> */}
				{/* <Content data={blocks?.[0]} />
                <div className="bg--environment">
                    <LazyLoad>
                        <img src="/static/img/about-us/environment.jpg" />
                    </LazyLoad>
                </div>
                 */}
			</div>
		</PageContainer>
	);
};
export default AboutUsPage;
export async function getServerSideProps({ req }) {
	const translations = await changeServerSideLanguage(req)

	// const test = require(`../../public/staticData/test.json`);
	// let test = []
	// if(process.env.NODE_ENV === 'development') {
	//     test = require("~/public/staticData/test.json");
	// }else{
	//     const response = await fetch(`https://www.origin-ic.com111/staticData/test.json`)
	//     test = await response.json();
	// }
	// const data = await fetch(`${req?.headers?.host}/api/getData?dataId=${1}`);
	// const response = await axios.get(`/api/getData?dataId=${1}`);
	// const getData = await CommonRepository.getStaticJson(1);
	return {
		props: {
			...translations,
			// getData: getData?.data || [],
		}
	}
}

