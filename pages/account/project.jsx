import React from 'react';
import Head from 'next/head';
import PageContainer from '~/components/layouts/PageContainer';

import AccountLeft from '~/components/partials/account/accountInfo/AccountLeft';
import MyProject from '~/components/ecomerce/cartCom/CartProject/MyProject';
import RequireAuth from '~/components/hoc/RequireAuth';
import useLanguage from '~/hooks/useLanguage';
import { changeServerSideLanguage, redirectLogin } from '~/utilities/easy-helpers'; 
import { ACCOUNT_CART_PROJECT_HASH } from '~/utilities/sites-url'


const ProjectPage = ({paramMap}) => {

    const { i18Translate } = useLanguage();
    const iMyProject = i18Translate('i18MyAccount.My Project', 'My Project Lists')
    const i18Title = i18Translate('i18Seo.savedProject.title', iMyProject)
    const i18Key = i18Translate('i18Seo.savedProject.keywords', "")
    const i18Des = i18Translate('i18Seo.savedProject.description', "")
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
                <MyProject tabActive={ACCOUNT_CART_PROJECT_HASH} />
            </AccountLeft>
        </PageContainer>
    );
};

export default RequireAuth(ProjectPage);

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