import React from 'react';
import Head from 'next/head';
import BreadCrumb from '~/components/elements/BreadCrumb';
import PageContainer from '~/components/layouts/PageContainer';
import PageTopBanner from '~/components/shared/blocks/banner/PageTopBanner';

import { All_SEO3 } from '~/utilities/constant';
import { getEnvUrl, PAGE_CAREERS } from '~/utilities/sites-url';
import useLanguage from '~/hooks/useLanguage';
import { changeServerSideLanguage } from '~/utilities/easy-helpers';   

const Careers = ({ seo, global }) => {
    // return <div>Mobile careers Page</div>
    const { i18Translate } = useLanguage();
    
    const breadcrumb = [
        {
            text: i18Translate("i18MenuText.Home", "Home"),
            url: '/',
        },
        {
            text: i18Translate('i18MenuText.Careers', "Careers"),
            url: getEnvUrl(PAGE_CAREERS)
        }
    ];


    const { careersTit, careersKey, careersDes } = All_SEO3?.careers
    const i18Title = i18Translate('i18Seo.careers.title', careersTit)
    const i18Key = i18Translate('i18Seo.careers.keywords', careersKey)
    const i18Des = i18Translate('i18Seo.careers.description', careersDes)

    return (
        <PageContainer seo={seo} global={global}>
            <Head>
                <title>{i18Title}</title>
                <meta property="og:title" content={i18Title} key="og:title" />
                <meta name="keywords" content={i18Key} key="keywords" />
                <meta name="description" content={i18Des} key="description" />
                <meta name="og:description" content={i18Des} key="og:description" />
            </Head>
            <div className="ps-careers ps-page--single ps-about-us pub-bgc-f5 pub-minh-1">
                <PageTopBanner
                    bgcImg="careersBan.jpg"
                    title={i18Translate("i18CareersPage.bannerTitle", "Careers at Origin Data")}
                    titleH1={true}
                    description={i18Translate("i18CareersPage.bannerDes", "Our diverse team of professionals is redefining the industry and helping expand the boundaries of our technological future. Join us.")}
                    otherTitleClass={'pub-color555'}
                    otherDescriptionClass={'pub-color555 pub-lh20'}
                />

                <div className='ps-container'>
                    <BreadCrumb breacrumb={breadcrumb} layout="fullwidth" />

                    <div className='pub-border15 pub-flex-center mt30 box-shadow' style={{padding: '100px 0'}}>
                        <span className='pub-font16 pub-color555'></span>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
};
export default Careers;

export async function getServerSideProps({ req }) {
    const translations = await changeServerSideLanguage(req)

    return {
        props: {
            ...translations,
        }
    }
}

