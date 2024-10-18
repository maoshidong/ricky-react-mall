import React from 'react';
import Head from 'next/head';
import PageContainer from '~/components/layouts/PageContainer';
import AccountLeft from '~/components/partials/account/accountInfo/AccountLeft';
import FormChangeUserInformation from '~/components/shared/FormChangeUserInformation';
import AccountRepository from '~/repositories/zqx/AccountRepository';

import { changeServerSideLanguage, redirectLogin } from '~/utilities/easy-helpers'; 
import useLanguage from '~/hooks/useLanguage';

const UserInformationPage = ({ paramMap, profileRes }) => {
    const { i18Translate } = useLanguage();
    const i18Title = i18Translate('i18Seo.userInformation.title', "")
    const i18Key = i18Translate('i18Seo.userInformation.keywords', "")
    const i18Des = i18Translate('i18Seo.userInformation.description', "")
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
                <FormChangeUserInformation profileRes={profileRes} />
            </AccountLeft>
        </PageContainer>
    );
};

export default UserInformationPage;


export async function getServerSideProps({ req, query }) {
    const translations = await changeServerSideLanguage(req)

    const { account="" } = req.cookies
    const serverToken = account.trim() !== "" && JSON.parse(account)?.token

    // 判断是否登录,否则重定向到login
    const isAccountLog = account.trim() !== "" && JSON.parse(account)?.isAccountLog
    if(!isAccountLog) {
        return redirectLogin()
    }

    let res = []
    res = await AccountRepository.getProfile(serverToken);
    return {
        props: {
            ...translations,
            serverToken: serverToken,
            profileRes: res || {},
        },
    }
}
