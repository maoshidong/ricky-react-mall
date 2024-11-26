import Head from 'next/head';

import dynamic from 'next/dynamic';
const PageContainer = dynamic(() => import('~/components/layouts/PageContainer'));
const ProductListFirstLetter = dynamic(() => import('~/components/ecomerce/modules/ProductListFirstLetter'));

import { All_SEO6 } from '~/utilities/constant';
import { changeServerSideLanguage } from '~/utilities/easy-helpers';  

import useLanguage from '~/hooks/useLanguage';

const ProductsListPage = ({ paramMap, serverList=[], query={}, firstLetter='', serverData={} }) => {
    const { i18Translate } = useLanguage();

    const titleSeo = All_SEO6?.productsList?.productsListTit
    const seoKeywords = All_SEO6?.productsList?.productsListKey
    const seoDescription = All_SEO6?.productsList?.productsListDes

    const i18Title = i18Translate('i18Seo.productsList.title', titleSeo)
    const i18Key = i18Translate('i18Seo.productsList.keywords', seoKeywords)
    const i18Des = i18Translate('i18Seo.productsList.description', seoDescription)

    // const titleSeo = `Electronic Parts Index ${firstLetter} | ${process.env.title}`
    return (
        <PageContainer paramMap={paramMap} pageOtherParams={{
            showFooter: false,
            showHead: true,
        }}>
            <Head>
                <title>{i18Title}</title>
                <meta property="og:title" content={i18Title} key="og:title" />
                <meta name="keywords" content={i18Key} key="keywords" />
                <meta name="description" content={i18Des} key="description" />
                <meta property="og:description" content={i18Des} key="og:description" />
                <meta property="og:image" content="https://www.origin-ic.com/static/img/logo.png" key="og:image" />
            </Head>
            <ProductListFirstLetter serverList={serverList} serverData={serverData} query={query} firstLetter={firstLetter} showNoData={false} />
        </PageContainer>
    )
}

export default ProductsListPage

export async function getServerSideProps({ req }) {
    const translations = await changeServerSideLanguage(req)
    return {
        props: {
            ...translations,
        }
    }
}