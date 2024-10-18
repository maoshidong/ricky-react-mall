import Link from 'next/link';
import Head from 'next/head';
import { nanoid } from 'nanoid';
import { Row, Col } from 'antd';
import { connect } from 'react-redux';
import PageContainer from '~/components/layouts/PageContainer';
import { All_SEO6 } from '~/utilities/constant';
import { AllCatalogTree } from '~/utilities/AllCatalogTree';
import useLanguage from '~/hooks/useLanguage';
import { changeServerSideLanguage } from '~/utilities/easy-helpers';
import { isIncludes } from '~/utilities/common-helpers';
import {
	PRODUCTS_CATALOG,
	PRODUCTS,
	MANUFACTURER,
	SERIES_PRODUCT_NUMBER,
	PRODUCTS_LIST,
	ALL_TAGS,
	AboutUsRouterList,
	ToolsRouterList,
	SupportRouterList,
	HotProductsRouterList,
	QUALITY,
	HELP_SHIPPING_RATES,
	HELP_CENTER,
	NEWSROOM,
	VIDEOS,
	CONTENT_SEARCH,
	PRODUCT_HIGHLIGHTS,
	APPLICATION_NOTES,
} from '~/utilities/sites-url';


const SiteMapPage = ({paramMap}) => {
    const { i18Translate, i18MapTranslate, getLanguageName, curLanguageCodeZh, temporaryClosureZh } = useLanguage();
    const iSiteMapTit = i18Translate('i18Other.siteMapTit', "ORIGIN-DATA SITEMAP")
    const iProducts = i18Translate('i18Head.products', 'Products')
    const iAllProducts = i18Translate('i18MenuText.All Products', 'All Products')
    const iManufacturer = i18Translate('i18PubliceTable.Manufacturer', 'Manufacturer')
    const iSeriesProductNumber = i18Translate('i18MenuText.Series Product Number', 'Series Product Number')
    const iAllTags = i18Translate('i18MenuText.All Tags', 'All Tags')
    const iElectronicPartsIndex = i18Translate('i18Other.Electronic Parts Index', 'Electronic Parts Index')
    const iTools = i18Translate('i18SmallText.Tools', 'Tools')
    const iSupport = i18Translate('i18SmallText.Support', 'Support')
    const iAbout = i18Translate('i18SmallText.About', 'About')
    const iHelp = i18Translate('i18MenuText.Help', "Help")
    const iHelpCenter = i18Translate('i18MenuText.Help Center', 'Help Center')
    const iShippingRates = i18Translate('i18MenuText.Shipping Rates', 'Shipping Rates')
    const iNewsroom = i18Translate('i18MenuText.Newsroom', 'Newsroom')
    const iVideos = i18Translate('i18ResourcePages.videos', 'Videos')
    const iProductHighlights = i18Translate('i18ResourcePages.Product Highlights', 'Product Highlights')
    const iApplicationNotes = i18Translate('i18ResourcePages.Application Notes', 'Application Notes')
    const iContentSearch = i18Translate('i18ResourcePages.Content Search', 'Content Search')
    const iQuality = i18Translate('i18Head.quality', "quality")

    // const { allCatalogs } = catalog
    // const list = allCatalogs?.length > 0 ? allCatalogs : AllCatalogTree ?.slice(1, 11)
    const arr = AllCatalogTree?.map(item => {
        return {
            routerName: getLanguageName(item),
            url: `${PRODUCTS_CATALOG}/${isIncludes(item?.slug)}/${item?.id}`
        }
    })
    const siteMapRouterListEn = [
        {
            title: iProducts,
            childList: [
                { routerName: iAllProducts, url: PRODUCTS},
                ...HotProductsRouterList,
                { routerName: iSeriesProductNumber, url: SERIES_PRODUCT_NUMBER},
                { routerName: iAllTags, url: ALL_TAGS},
                { routerName: iElectronicPartsIndex, url: PRODUCTS_LIST},
                { routerName: iManufacturer, url: MANUFACTURER},
                ...arr,
            ]
        },
    ]
    const siteMapRouterList = [
        {
            title: iProducts,
            childList: [
                { routerName: iAllProducts, url: PRODUCTS},
                ...HotProductsRouterList,
                { routerName: iSeriesProductNumber, url: SERIES_PRODUCT_NUMBER},
                { routerName: iAllTags, url: ALL_TAGS},
                { routerName: iElectronicPartsIndex, url: PRODUCTS_LIST},
                { routerName: iManufacturer, url: MANUFACTURER},
                ...arr,
            ]
        },
        {
            title: `${iAbout}${curLanguageCodeZh() ? "" : " "}${i18Translate('i18CompanyInfo.Origin Data', 'Origin Data')}`,
            childList: [
                ...AboutUsRouterList,
                { routerName: iQuality, url: QUALITY},
            ],
        },
        {
            title: iTools,
            childList: ToolsRouterList,
        },
        {
            title: iSupport,
            childList: [
                ...SupportRouterList,
                { routerName: iVideos, url: VIDEOS},
                { routerName: iNewsroom, url: NEWSROOM},
                { routerName: iProductHighlights, url: PRODUCT_HIGHLIGHTS},
                { routerName: iApplicationNotes, url: APPLICATION_NOTES},
                { routerName: iContentSearch, url: CONTENT_SEARCH},
            ],
        },
        {
            title: iHelp,
            childList: [
                {routerName: iHelpCenter, url: HELP_CENTER},
                {routerName: iShippingRates, url: HELP_SHIPPING_RATES},
            ]
        },
    ]
    const siteArr = temporaryClosureZh() ? siteMapRouterListEn : siteMapRouterList

    const { siteMapTit, siteMapKey, siteMapDes } = All_SEO6?.siteMap
    const i18Title = i18Translate('i18Seo.siteMap.title', siteMapTit)
    const i18Key = i18Translate('i18Seo.siteMap.keywords', siteMapKey)
    const i18Des = i18Translate('i18Seo.siteMap.description', siteMapDes)
    return (
        <PageContainer paramMap={paramMap}>
            <Head>
                <title>{i18Title}</title>
                <meta property="og:title" content={i18Title} key="og:title" />
                <meta name="keywords" content={i18Key} key="keywords" />
                <meta name="description" content={i18Des} key="description" />
                <meta name="og:description" content={i18Des} key="og:description" />
            </Head>
            <div className='site-map-page pub-bgc-f5'>
                <div className='ps-container'>
                    <h1 className='pt-20 mb10 pub-font24 pub-fontw'>{iSiteMapTit}</h1>
                    <div className=''>
                        {/* <Row gutter={30}> */}
                            {
                                siteArr?.map(item => (
                                    // xs={24} sm={12} md={12} lg={8} xl={6} 
                                    <div key={nanoid()} className='mb20'>
                                        <h2 className='site-title mb17 pub-left-title'>{item?.title}</h2>
        
                                        <Row gutter={15} className='pub-flex-wrap'>
                                            {
                                                item?.childList?.map(i => {
                                                    return (
                                                        <Col xs={24} sm={12} md={8} lg={4} xl={4} key={nanoid()}>
                                                        <Link href={`${i?.url}`} className='mb10'>
																												
                                                            <a className='mb10 pub-color-link pub-line-clamp1 pub-color-link-line' style={{display: 'block'}}>
                                                                {i18MapTranslate(`i18MenuText.${i.routerName}`, i.routerName)}
                                                            </a>
																												
                                                        </Link>
                                                        </Col>
                                                    )
                                                })
                                            }
                                        </Row>
                                    </div>
                                ))
                            }

                        {/* </Row> */}
                    </div>
                </div>
            </div>
        </PageContainer>
    )
}

export default connect(state => state)(SiteMapPage)
export async function getServerSideProps({ req }) {
    const translations = await changeServerSideLanguage(req)

    return {
        props: {
            ...translations,
        }
    }
}