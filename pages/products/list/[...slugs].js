import React, { useEffect } from 'react';
import Head from 'next/head';
import last from 'lodash/last';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
const PageContainer = dynamic(() => import('~/components/layouts/PageContainer'));
const ProductListFirstLetter = dynamic(() => import('~/components/ecomerce/modules/ProductListFirstLetter'));
import ProductRepository from '~/repositories/ProductRepository';
const router = useRouter();

import { SEO_COMPANY_NAME, SEO_COMPANY_NAME_ZH } from '~/utilities/constant';
import useLanguage from '~/hooks/useLanguage';
import { changeServerSideLanguage } from '~/utilities/easy-helpers';  

const ProductsListPage = ({ paramMap, serverList, query, firstLetter, serverData }) => {
    const { curLanguageCodeZh, i18Translate } = useLanguage();
		// console.log(serverList,'serverList----del')
    const titleSeo = `Electronic Parts Index ${firstLetter} ${curLanguageCodeZh() ? SEO_COMPANY_NAME_ZH : SEO_COMPANY_NAME}`
    const seoKeywords = `${firstLetter}, product list, origin electronic parts mall, find electronic components, electronic components distributor`
    const seoDescription = `Origin Data ${firstLetter} provides pricing, datasheets for millions of products from thousands of top manufacturers around the world. Order now! Fast delivery.`

    const i18Title = i18Translate('i18Seo.productsListDetail.title', titleSeo, { firstLetter })
    const i18Key = i18Translate('i18Seo.productsListDetail.keywords', seoKeywords, { firstLetter })
    const i18Des = i18Translate('i18Seo.productsListDetail.description', seoDescription, { firstLetter })

	  // useEffect(async () => {
		// 	const params = {
		// 		keyword: 's',
		// 			pageListNum: 1,
		// 			pageListSize: 300,
		// 	}
		// 	await ProductRepository.getProductListFirstLetter(params)
		// }, [])
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
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <ProductListFirstLetter serverList={serverList} serverData={serverData} query={query} firstLetter={firstLetter} />
        </PageContainer>
    )
}

export default ProductsListPage

export async function getServerSideProps({ req, query }) {
	const { slugs } = query || {}
	const firstLetter = last(slugs).toUpperCase() || 'A';
	const params = {
			keyword: firstLetter,
			pageListNum: query?.pageNum || 1,
			pageListSize: query?.pageSize || 1000,
	}

		const [translations, res] = await Promise.all([
			changeServerSideLanguage(req), // 语言包等页面基础逻辑
			ProductRepository.getProductListFirstLetter(params),
		]);

    return {
        props: {
            ...translations,
            serverList: res?.data?.data || [],
            serverData: res?.data || {},
            query,
            firstLetter,
        },
    }
};