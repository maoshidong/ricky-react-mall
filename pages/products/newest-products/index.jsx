import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
const PageContainer = dynamic(() => import('~/components/layouts/PageContainer'));
const HotRecommendDiscount = dynamic(() => import('~/components/ecomerce/modules/HotRecommendDiscount'));
import ProductRepository from '~/repositories/ProductRepository';
import NewsRepository from '~/repositories/zqx/NewsRepository';
import useLanguage from '~/hooks/useLanguage';
import { PUB_PAGINATION, PUB_ARTICLE_TYPE, I18NEXT_LOCALE } from '~/utilities/constant';
import { changeServerSideLanguage, getLocale } from '~/utilities/easy-helpers';

const NewestProducts = ({
	paramMap, productsList, catalogResTree, totalServer, catalogId, catalogName, newsRes, newsProduct, newsAppliedNote
}) => {
	const { i18Translate, curLanguageCodeZh } = useLanguage();

	// const finItem = catalogResTree?.find(item => item?.catalogId === Number(catalogId))
	// const textItem = catalogResTree?.map(item => {
	// 	const finItem = manufacturerListServer?.find(item => item?.manufacturerId === Number(manufacturerId))
	// 	const { id, name, voList } = item
	// 	return getItem(
	// 		<Link href={handAllRouter({ catalogId: id })}
	// 		>
	// 			<a className='menu-label pub-flex-align-center pt-0 pb-0' style={{ marginLeft: '-16px', height: '100%', }}>
	// 				{name?.slice(0, 40)}
	// 			</a>
	// 		</Link>,
	// 		id, null, getChildItem(voList))
	// })

	// / 递归调用查找子对象
	const findDataById = (data, id) => {
		for (let i = 0; i < data.length; i++) {
			if (data[i].id == id) {
				return data[i];
			} else if (data[i].voList.length > 0) {
				const result = findDataById(data[i].voList, id); // 递归调用查找子对象
				if (result) {
					return result;
				}
			}
		}
		return null; // 未找到匹配的数据
	}

	const textItem = findDataById(catalogResTree, catalogId)
	// console.log(textItem, 'textItem---del')
	const i18Title = i18Translate('i18Seo.newestProducts.title', "", {
		name: textItem?.name ? (textItem?.name + `${curLanguageCodeZh() ? '' : ' & '}`) : null, // 中文不需要加空格
	})
	const i18Key = i18Translate('i18Seo.newestProducts.keywords', "", {
		name: textItem?.name ? (textItem?.name + `${curLanguageCodeZh() ? '' : ', '}`) : null,
	})
	const i18Des = i18Translate('i18Seo.newestProducts.description', "", {
		name: textItem?.name ? (`${curLanguageCodeZh() ? '' : ' '}` + textItem?.name) : null,
	})

	// useEffect(async() => {W
	// 	const param = { pageListNum: 1, pageListSize: 9, languageType: 'en',newsType: PUB_RESOURCE_TYPE.article, }

	//     const newsRes = await NewsRepository.getQueryNewsList(param); // 新闻

	// 		// type: 1, // 博客，特色产品，应用笔记等都属于 type 1
	// 		// newsType: 1, // 只是特色产品
	// 		const newPro = await NewsRepository.apiQueryCatalogRelaNews(param); 
	//     // const catalogRes = await ProductRepository.apiGetNewProductCatalogListWeb(); 


	// }, [])


	return (
		<PageContainer paramMap={paramMap}>
			<Head>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />
			</Head>
			<HotRecommendDiscount
				productsList={productsList}
				catalogResTree={catalogResTree}
				catalogId={catalogId} // 选中的分类
				catalogName={catalogName} // 选中的分类名称
				totalServer={totalServer}
				newest={true}
				newsRes={newsRes}
				newsProduct={newsProduct}
				newsAppliedNote={newsAppliedNote}
			/>
		</PageContainer>
	);
};
export default NewestProducts;

export async function getServerSideProps({ req, query }) {
	const { catalogId, keyword } = query || {}
	const languageType = getLocale(req)
	// 新闻公共字段
	const newsParams = { pageListNum: 1, pageListSize: 9, languageType }
	if (!!catalogId) {
		newsParams.catalogId = catalogId
	}
	// 最新产品列表参数
	const params = {
		keywordList: keyword?.split(',') || [], // 关键词
		catalogIdList: [catalogId], // 分类
		pageNum: query?.pageNum || PUB_PAGINATION?.pageNum,
		pageSize: query?.pageSize || PUB_PAGINATION?.pageSize,
		languageType,
	}
	const [translations, catalogRes, productsRes, newsBlog, newsProduct, newsAppliedNote] = await Promise.all([
		changeServerSideLanguage(req), // 页面基础信息
		ProductRepository.apiGetNewProductCatalogListWeb(languageType), // 分类列表
		ProductRepository.apiGetNewProductListWeb(params), // 最新产品列表
		NewsRepository.apiQueryCatalogRelaNews({ ...newsParams, newsType: PUB_ARTICLE_TYPE.article }), // blog
		NewsRepository.apiQueryCatalogRelaNews({ ...newsParams, newsType: PUB_ARTICLE_TYPE.specialProduct }), // 特色产品
		NewsRepository.apiQueryCatalogRelaNews({ ...newsParams, newsType: PUB_ARTICLE_TYPE.appliedNote }), // 应用笔记
	]);


	let catalogName = "" // 选中的分类名称
	function filterTree(data) {
		return data?.map(item => {
			const { name, id, voList } = item || {}
			let obj = {
				name, id,
				voList: voList?.length > 0 ? filterTree(voList) : []
			}
			if (catalogId == id) {
				catalogName = name
			}
			return obj
		});
	}
	const handCatalogRes = filterTree(catalogRes?.data || []); // 去掉多余的字段


	return {
		props: {
			...translations,
			productsList: productsRes?.data?.data || [],
			totalServer: productsRes?.data?.total || 0,
			catalogResTree: handCatalogRes || [],
			catalogId: catalogId || "",
			catalogName,
			newsRes: newsBlog?.data || [], // 博客
			newsProduct: newsProduct?.data || [], // 特色产品
			newsAppliedNote: newsAppliedNote?.data || [], // 应用笔记
		},
	}
};

