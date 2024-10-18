import Head from 'next/head';
import dynamic from 'next/dynamic';
const PageContainer = dynamic(() => import('~/components/layouts/PageContainer'));
const HotRecommendDiscount = dynamic(() => import('~/components/ecomerce/modules/HotRecommendDiscount'));
import ProductRepository from '~/repositories/ProductRepository';
import useLanguage from '~/hooks/useLanguage';
import { PUB_PAGINATION, All_SEO4 } from '~/utilities/constant';
import { changeServerSideLanguage, getLocale } from '~/utilities/easy-helpers';
import { useRouter } from 'next/router';

const HotProducts = ({ paramMap, seo, global, productsList, manufacturerListServer, totalServer }) => {

	const { i18Translate, curLanguageCodeZh } = useLanguage();

	const Router = useRouter()
	const { manufacturerId } = Router?.query || {}
	const finItem = manufacturerListServer?.find(item => item?.manufacturerId === Number(manufacturerId))

	const { hotProductsTit, hotProductsKey, hotProductsDes } = All_SEO4?.hotProducts;
	const i18Title = i18Translate('i18Seo.hotProducts.title', hotProductsTit, {
		manufacturerName: finItem?.name ? (finItem?.name + `${curLanguageCodeZh() ? '' : ' & '}`) : null,
	});
	const i18Key = i18Translate('i18Seo.hotProducts.keywords', hotProductsKey, {
		manufacturerName: finItem?.name ? (finItem?.name + `${curLanguageCodeZh() ? '' : ', '}`) : null, // 中文不需要加空格
	});
	const i18Des = i18Translate('i18Seo.hotProducts.description', hotProductsDes, {
		manufacturerName: finItem?.name ? (`${curLanguageCodeZh() ? '' : ' '}` + finItem?.name) : null,
	});


	return (
		<PageContainer paramMap={paramMap} seo={seo} global={global}>
			<Head>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />
			</Head>
			<HotRecommendDiscount productsList={productsList} manufacturerListServer={manufacturerListServer} totalServer={totalServer} />
		</PageContainer>
	);
};
export default HotProducts;

export async function getServerSideProps({ req, query }) {
    const { manufacturerId, keyword } = query || {}
    const languageType = getLocale(req)
    const params = {
        manufacturerId,
        keywordList: keyword?.split(',') || [],
        pageNum: query?.pageNum || PUB_PAGINATION?.pageNum,
        pageSize: query?.pageSize || PUB_PAGINATION?.pageSize,
        languageType,
    }
    const [translations, manufacturerListRes, productsRes ] = await Promise.all([
        changeServerSideLanguage(req),
        ProductRepository.getProductManufacturerList(1, languageType),
        ProductRepository.getHotProductsList(params)
    ]);
		
    return {
        props: {
            ...translations,
            productsList: productsRes?.data?.data || [],
            manufacturerListServer: manufacturerListRes?.data || {},
            totalServer: productsRes?.data?.total || 0,
        },
    }
};

