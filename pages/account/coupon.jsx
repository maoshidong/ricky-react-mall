import React from 'react';
import Head from 'next/head';
import PageContainer from '~/components/layouts/PageContainer';
import AccountLeft from '~/components/partials/account/accountInfo/AccountLeft';
import Coupon from '~/components/partials/account/Coupon';

import { changeServerSideLanguage, redirectLogin } from '~/utilities/easy-helpers';  

import useLanguage from '~/hooks/useLanguage';

const Favorites = ({paramMap}) => {
    const { i18Translate } = useLanguage();

    const i18Title = i18Translate('i18Seo.coupon.title', "")
    const i18Key = i18Translate('i18Seo.coupon.keywords', "")
    const i18Des = i18Translate('i18Seo.coupon.description', "")

    return (
        <PageContainer paramMap={paramMap}>
            <Head>
                <title>{i18Title}</title>
                <meta property="og:title" content={i18Title} key="og:title" />
                <meta name="keywords" content={i18Key} key="keywords" />
                <meta name="description" content={i18Des} key="description" />
                <meta name="og:description" content={i18Des} key="og:description" />
            </Head>
            <AccountLeft>
                <Coupon />
            </AccountLeft>
        </PageContainer>
    );
};

export default Favorites;

export async function getServerSideProps({ req }) {
    const translations = await changeServerSideLanguage(req)
    // 判断是否登录,否则重定向到login
    const { account="" } = req.cookies
    const isAccountLog = account.trim() !== "" && JSON.parse(account)?.isAccountLog
    if(!isAccountLog) {
        return redirectLogin()
    }
    
    return {
        props: {
            ...translations,
        }
    }
}