import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import BreadCrumb from '~/components/elements/BreadCrumb';
import PageContainer from '~/components/layouts/PageContainer';
import NewsRepository from '~/repositories/zqx/NewsRepository';
import { getEnvUrl, CONTENT_SEARCH } from '~/utilities/sites-url';
import NewsContent from '~/components/News/NewsContent';
import PageTopBanner from '~/components/shared/blocks/banner/PageTopBanner';
import { PUB_RESOURCE_TYPE, PUB_PAGINATION, All_SEO4 } from '~/utilities/constant'
import useLanguage from '~/hooks/useLanguage';
import { changeServerSideLanguage, getLocale } from '~/utilities/easy-helpers';   


const NewsPage = ({ paramMap, newsData, newsTypeTreeServer }) => {
    const { i18Translate, getLanguageHost } = useLanguage();
    const iHome = i18Translate('i18MenuText.Home', 'Home')
    const iContentSearch = i18Translate('i18ResourcePages.Content Search', 'Content Search')
    const iNewsroom = i18Translate('i18MenuText.Newsroom', 'Newsroom')

    const breadcrumb = [
        {
            text: iHome,
            url: '/',
        },
        {
            text: iContentSearch,
            url: getEnvUrl(CONTENT_SEARCH),
        },
        {
            text: iNewsroom,
        }
    ];

    // const { data } = newsData
    // const [newsAllData, setNewsAllData] = useState(data || {})
    // const { pageNum, pageSize, pages, total } = newsAllData || {}


    const Router = useRouter();
    const schemaSeo = {
        "@context":"https://schema.org/",
        "@graph":[
            {
                "@type": "Webpage",
                "@id":getLanguageHost() + Router.asPath,
                "url":getLanguageHost() + Router.asPath,
                "name": iNewsroom,
            },
            // {
            //     "@type":"BreadcrumbList",
            //     "ItemListElement": [
            //         {
            //             "@type":"Listitem","position":"1",
            //             "name":"Newsroom","item":one,
            //         },
            //     ],
            //     // "ItemListElement":[
            //         // {
            //         //     "@type":"Listitem","position":"1",
            //         //     "name":"Product Index","item":one,
            //         // },
            //     //     getThree(),
            //     //     getFour(),
            //     //     getFive()
            //     // ],
            // },
            {
                "@type":"News",
                "name": iNewsroom,
            }
        ]
    }

    const { newsTit, newsKey, newsDes } = All_SEO4?.news
    const i18Title = i18Translate('i18Seo.newsroom.title', newsTit)
    const i18Key = i18Translate('i18Seo.newsroom.keywords', newsKey)
    const i18Des = i18Translate('i18Seo.newsroom.description', newsDes)
    return (
        <PageContainer paramMap={paramMap}>
            <Head>
                <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schemaSeo)}}></script>
                <title>{i18Title}</title>
                <meta property="og:title" content={i18Title} key="og:title" />
                <meta name="keywords" content={i18Key} key="keywords" />
                <meta name="description" content={i18Des} key="description" />
                <meta name="og:description" content={i18Des} key="og:description" />
                {/* <HeadKeyWordsDes /> */}
            </Head>
            <div className='pub-bgcdf5 pub-minh-1 pb60 custom-antd-btn-more'>
                <PageTopBanner
                    bgcImg="news.png"
                    title={iNewsroom}
                    titleH1={true}
                />

                <div className="ps-container ps-page-new">
       

                    <BreadCrumb breacrumb={breadcrumb} layout="fullwidth" />
                    <div className='mt25'>
                        <NewsContent newsData={newsData} newsTypeTreeServer={newsTypeTreeServer} />
                    </div>
                </div>
            </div>
        </PageContainer>
    );
};

export default NewsPage;

export async function getServerSideProps({ req, query }) {
    const { account="" } = req.cookies
    const serverToken = account.trim() !== "" && JSON.parse(account)?.token

    const param = {
        pageListNum: query?.pageNum || PUB_PAGINATION?.pageNum,
        pageListSize: query?.pageSize || PUB_PAGINATION?.pageSize,
        // typeIdList: [PUB_RESOURCE_TYPE.companyNews],
        languageType: getLocale(req),
        typeIdList: [190,169,172], // 栏目id /news 只展示当前栏目新闻
    }

    const params = {
        parentTypeId: 0,
        typeList: [PUB_RESOURCE_TYPE.resource, PUB_RESOURCE_TYPE.attribute],
        languageType: getLocale(req),
    }

    const [translations, newsData, newsTypeTreeServer] = await Promise.all([
        changeServerSideLanguage(req),
        NewsRepository.getQueryNewsList(param), // 新闻列表
        NewsRepository.apiGetNewsTypeTree(params), // 新闻树
    ]);

    const type = query?.type;

    return {
        props: {
            ...translations,
            newsData,
            serverToken,
            selectedNewsType: type || null,
            newsTypeTreeServer: newsTypeTreeServer?.data || {},
            // newsTypes: newsTypes?.data?.data,
            // news: news?.data?.data,
            // pagination: news?.data?.meta?.pagination,
        },
    }
};