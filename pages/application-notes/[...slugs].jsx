import React from 'react';
import Head from 'next/head';
import last from 'lodash/last';
import BreadCrumb from '~/components/elements/BreadCrumb';
import PageContainer from '~/components/layouts/PageContainer';

import ProductHighlightsCom from '~/components/News/ProductHighlightsCom';
import NewsRepository from '~/repositories/zqx/NewsRepository';
import ExternalShare from '~/components/shared/public/ExternalShare';
import useLanguage from '~/hooks/useLanguage';

import { PUB_ARTICLE_TYPE } from '~/utilities/constant';
import { getEnvUrl, APPLICATION_NOTES } from '~/utilities/sites-url'
import { getLocale, changeServerSideLanguage, redirect404 } from '~/utilities/easy-helpers';
import { Flex } from '~/components/common';
// import Flex from '~/components/common/Flex';

const ProductHighlightsIndex = ({ paramMap, res, otherNews }) => {
	const { data } = res || {}
	const { content, specialProductList, } = data || {}

	const { i18Translate, curLanguageCodeZh } = useLanguage();
	const iHome = i18Translate('i18MenuText.Home', 'Home')
	const iApplicationNotes = i18Translate('i18ResourcePages.Application Notes', 'Application Notes')
	const iShare = i18Translate('i18AboutProduct.Share', 'Share')

	const breadcrumb = [
		{
			text: iHome,
			url: '/',
		},
		{
			text: iApplicationNotes,
			url: getEnvUrl(APPLICATION_NOTES),
		},
		{
			text: content?.title,
		}
	];

	const {
		title, seoKey, seoFlag, coverImage,
		manufacturerName, recommendCatalogNameCn, recommendCatalogName, functionName, functionNameCn,
	} = content || {}

	let seoKeyProductName = []
	let manufacturerData = [] // 所有供应商名称 + id
	let manufacturerNames = [] // 所有供应商名称
	let catalogData = [] // 所有分类名称 + id
	let catalogNames = []
	specialProductList?.map(item => {
		const arr = item?.productList?.map(i => {
			manufacturerNames?.push(i?.manufacturerName)
			catalogNames?.push(i?.catalogName)
			manufacturerData?.push({
				name: i?.manufacturerName,
				id: i?.manufacturerId,
			})
			catalogData?.push({
				name: i?.catalogName,
				id: i?.catalogId,
			})
			return i?.name
		})

		seoKeyProductName?.push(arr)
	})

	// Tags: 新闻分类，功能，添加产品的所有分类，品牌，filter页



	// 管理端seoFlag === 2 就不拼接, 控制SEO关键词是否需要拼接产品型号,供应商名称,功能名称,分类名称
	// functionName + ',' + recommendCatalogName + ',' + manufacturerName + ',' + seoKeyProductName?.join(',') + ',' + 


	const newSeoKey = seoKey || ""
	// 关键词拼接
	let seoKeyAddName = seoFlag === 2 ? newSeoKey : newSeoKey
	// 语言分类名
	const lanCatalogName = curLanguageCodeZh() ? recommendCatalogNameCn : recommendCatalogName
	// 语言函数名
	const lanFunctionName = curLanguageCodeZh() ? functionNameCn : functionName

	if (seoFlag !== 2) {
		if (seoKeyProductName?.join(',')) {
			seoKeyAddName = seoKeyProductName?.join(',') + ',' + seoKeyAddName
		}
		if (manufacturerName) {
			seoKeyAddName = manufacturerName + ',' + seoKeyAddName
		}
		if (recommendCatalogName) {
			seoKeyAddName = lanCatalogName + ',' + seoKeyAddName
		}
		if (functionName) {
			seoKeyAddName = lanFunctionName + ',' + seoKeyAddName
		}
	}

	// useEffect(async () => {
	//     const param = {
	//         newsId: 1,
	//         type: 2,
	//     }
	//     const res = await NewsRepository.apiQueryNewsDetail(param);

	// }, [])
	// <meta property="og:title" content="你的分享标题">
	// <meta property="og:image" content="你的封面图链接">
	// <meta property="og:url" content="你的网页链接">
	// 清除 Facebook 的缓存。您可以使用 Facebook 的调试工具来刷新页面缓存并获取新的元数据。访问 Facebook Sharing Debugger(https://developers.facebook.com/tools/debug/)，输入分享页面的链接，然后点击 "Debug" 按钮。这将会更新 Facebook 对页面的缓存，并显示最新的元数据。
	const titleSeo = `${title} | ${process.env.title}`

	return (
		<PageContainer paramMap={paramMap}>
			<Head>
				<title>{titleSeo}</title>
				<meta property="og:image" content={coverImage}></meta>
				<meta property="og:title" content={titleSeo} key="og:title" />

				<meta name="keywords" content={seoKeyAddName} key="keywords" />
				<meta name="description" content={content?.contentSummary} key="description" />
				<meta name="og:description" content={content?.contentSummary} key="og:description" />
			</Head>
			<div className="articles-detail-page product-table-container ps-page--single pub-bgc-f5 pb-60">
				<div className='ps-container'>
					<Flex justifyBetween>
						<BreadCrumb breacrumb={breadcrumb} layout="fullwidth" />
						<Flex alignCenter style={{ paddingTop: '14px', paddingRight: '6px' }}>
							<i className="fa fa-share-alt pub-color-link" style={{ cursor: 'auto' }} />
							<span className='ml10 mr10 pub-font14'>{iShare}</span>
							<ExternalShare paramMap={paramMap} />
						</Flex>
					</Flex>

					<ProductHighlightsCom paramMap={paramMap} res={res} otherNews={otherNews} />
				</div>
			</div>
		</PageContainer>
	);
};
export default ProductHighlightsIndex;

export async function getServerSideProps({ req, params, query }) {
	let { slugs } = params;
	const { isNeedPreview } = query; // 未发布也可预览
	let newsId = last(slugs);
	const param = {
		newsId,
		newsType: PUB_ARTICLE_TYPE.specialProduct,
		languageType: getLocale(req),
		isNeedPreview: isNeedPreview || '',
	}

	const [translations, res] = await Promise.all([
		changeServerSideLanguage(req),
		NewsRepository.apiQueryNewsDetail(param), // 详情
	]);

	if (res?.code !== 0) {
		return redirect404()
	}

	const { publishTime, columnId } = res?.data?.content || {}
	const params1 = {
		pageListNum: 1,
		pageListSize: 5,
		publishTime,
		columnIdList: [columnId],
		languageType: getLocale(req),
	}
	const otherNews = await NewsRepository.getQueryNewsList(params1);

	return {
		props: {
			...translations,
			res,
			otherNews,
		},
	}
};

