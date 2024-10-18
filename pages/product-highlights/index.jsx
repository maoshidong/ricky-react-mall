import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import BreadCrumb from '~/components/elements/BreadCrumb';
import PageContainer from '~/components/layouts/PageContainer';
import NewsRepository from '~/repositories/zqx/NewsRepository';
// import RefineSearch from '~/components/News/RefineSearch';
// import NewItem from '~/components/News/NewItem';
// import SearchNoData from '~/components/ecomerce//minCom/SearchNoData'; // 无数据展示
// import MinPagination from '~/components/ecomerce/minCom/MinPagination' // 分页
import { getEnvUrl, CONTENT_SEARCH } from '~/utilities/sites-url'
import { PUB_RESOURCE_TYPE, PUB_PAGINATION, All_SEO3 } from '~/utilities/constant'
import NewsContent from '~/components/News/NewsContent';
import useLanguage from '~/hooks/useLanguage';
import { changeServerSideLanguage, getLocale, newsPagesHelp } from '~/utilities/easy-helpers';   

// seo信息、h1等标签
const ProductHighlightsPage = ({ paramMap, newsData, newsTypeTreeServer }) => {
    const { i18Translate, getLanguageHost } = useLanguage();
    const iHome = i18Translate('i18MenuText.Home', 'Home')
    const iContentSearch = i18Translate('i18ResourcePages.Content Search', 'Content Search')
    const iProductHighlights = i18Translate('i18ResourcePages.Product Highlights', 'Product Highlights')
    const iApplicationNotesDes = i18Translate('i18ResourcePages.ApplicationNotesDes', 'Stay Updated on the Latest Products and Technologies to Expand Your Knowledge.')
    
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
            text: iProductHighlights,
        }
    ];

    // const { data } = newsData
    // const [newsAllData, setNewsAllData] = useState(data || {})
    // const { pageNum, pageSize, pages, total } = newsAllData || {}

    // useEffect(async () => {
    //     const newsData = await NewsRepository.getQueryNewsList();
    // }, [])


    const Router = useRouter();
    const schemaSeo = {
        "@context":"https://schema.org/",
        "@graph":[
            {
                "@type": "Webpage",
                "@id":getLanguageHost() + Router.asPath,
                "url":getLanguageHost() + Router.asPath,
                "name": iProductHighlights,
            },
            // {
            //     "@type":"BreadcrumbList",
            //     "ItemListElement": [
            //         {
            //             "@type":"Listitem","position":"1",
            //             "name":"Product Highlights","item":one,
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
                "name": iProductHighlights,
            }
        ]
    }

    // const curColumn = newsTypeTreeServer?.find(item => item?.templateType === PUB_ARTICLE_TYPE.specialProduct)
    // const { url, description } = curColumn || {}


    const { productHighlightsTit, productHighlightsKey, productHighlightsDes } = All_SEO3?.productHighlights
    const i18Title = i18Translate('i18Seo.productHighlights.title', productHighlightsTit)
    const i18Key = i18Translate('i18Seo.productHighlights.keywords', productHighlightsKey)
    const i18Des = i18Translate('i18Seo.productHighlights.description', productHighlightsDes)

    return (
        <PageContainer paramMap={paramMap}>
            <Head>
                <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schemaSeo)}}></script>
                <title>{i18Title}</title>
                <meta property="og:title" content={i18Title} key="og:title" />
                <meta name="keywords" content={i18Key} key="keywords" />
                <meta name="description" content={i18Des} key="description" />
                <meta name="og:description" content={i18Des} key="og:description" />
            </Head>
            <div className='pub-bgcdf5 pub-minh-1 pb60 custom-antd-btn-more'>
                <div className='pub-top-bgc pub-top-bgc-minh260'>
                    <img className='pub-top-img' src='/static/img/bg/product-highlights.png' alt="banner" />
                    <div className='ps-container pub-top-bgc-content'>
                        <h1 className='mb20 pub-fontw pub-font36 pub-lh36 pub-top-bgc-title'>{iProductHighlights}</h1>
                        <p className='pub-font16 pub-lh18 pub-top-bgc-des pub-font50'>{iApplicationNotesDes}</p>
                    </div>
                </div>
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

export default ProductHighlightsPage;

export async function getServerSideProps({ req, query }) {
    const { account="" } = req.cookies
    const serverToken = account.trim() !== "" && JSON.parse(account)?.token
    const languageType = getLocale(req)
    const param = {
        pageListNum: query?.pageNum || PUB_PAGINATION?.pageNum,
        pageListSize: query?.pageSize || PUB_PAGINATION?.pageSize,
        languageType,
        typeIdList: [40], // 栏目id，只展示当前栏目新闻
    }
    const params = {
        parentTypeId: 0,
        typeList: [PUB_RESOURCE_TYPE.resource, PUB_RESOURCE_TYPE.attribute],
        languageType,
    }

    const [translations, newsData, newsTypeTreeServer] = await Promise.all([
        changeServerSideLanguage(req),
        NewsRepository.getQueryNewsList(param), // 新闻列表
        NewsRepository.apiGetNewsTypeTree(params), // 栏目树
    ]);

    return {
        props: {
            ...translations,
            newsData,
            serverToken,
            selectedNewsType: query?.type || null,
            newsTypeTreeServer: newsTypeTreeServer?.data,
        },
    }
};