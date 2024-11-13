import React from 'react';
import Head from 'next/head';
import PageContainer from '~/components/layouts/PageContainer';
import NewsContent from '~/components/News/NewsContent';

import { NewsRepository } from '~/repositories';

import { PUB_RESOURCE_TYPE, All_SEO1 } from '~/utilities/constant';
import { NewsContentContext } from '~/utilities/productsContext';
import { getLocale, changeServerSideLanguage, newsPagesHelp } from '~/utilities/easy-helpers';

import useLanguage from '~/hooks/useLanguage';

const ContentSearchPage = ({
	paramMap, newsData, newsTypeTreeServer, typefitIds, queryKey, functionIdList, manufactureIdList
}) => {
	const { i18Translate, getLanguageName } = useLanguage();
	const { contentSearchTit, contentSearchKey, contentSearchDes } = All_SEO1?.contentSearch
	const i18Title = i18Translate('i18Seo.contentSearch.title', contentSearchTit)
	const i18Key = i18Translate('i18Seo.contentSearch.keywords', contentSearchKey)
	const i18Des = i18Translate('i18Seo.contentSearch.description', contentSearchDes)


	// 根据不同的条件，返回不同TKD，报错urlTKD的不一致
	const getName = (str = ', ') => {
		// 资源类型名Resource Type
		if (typefitIds?.length === 1) {
			const findItem = newsTypeTreeServer?.find(item => item.id === Number(typefitIds?.[0]))
			const cur = getLanguageName(findItem) + str
			return cur
		}
		// 功能Function参数名
		if (functionIdList?.length === 1) {
			// 多种类型集合voList
			let allVoList = []
			newsTypeTreeServer?.map(item => {
				// 234: 供应商的id
				if (item?.id !== 234) {
					allVoList = [...allVoList, ...item?.voList]
				}
			})
			const findItem = allVoList?.find(item => item.id === Number(functionIdList?.[0]))
			const cur = getLanguageName(findItem) + str
			return cur
		}
		// 供应商条件名称
		if (manufactureIdList?.length === 1) {
			const manItem = newsTypeTreeServer?.find(item => item.id === 234) // id234为供应商
			const findItem = manItem?.voList?.find(item => item.id === Number(manufactureIdList?.[0]))
			const cur = getLanguageName(findItem) + str
			return cur
		}
		return ''
	}

	return (
		<PageContainer paramMap={paramMap}>
			<Head>
				<title>{getName(" & ") + i18Title}</title>
				<meta property="og:title" content={getName() + i18Title} key="og:title" />
				<meta name="keywords" content={getName() + i18Key} key="keywords" />
				<meta name="description" content={getName() + i18Des} key="description" />
				<meta property="og:description" content={getName() + i18Des} key="og:description" />
				<meta property="og:image" content="https://www.origin-ic.com/static/img/logo.png" />
			</Head>
			<div className='pub-bgcdf5 pub-minh-1 pb60 custom-antd-btn-more'>
				<div className="ps-container ps-page-new pub-flex pt-30">
					<NewsContentContext.Provider
						value={{
							typefitIds: typefitIds?.map(item => Number(item)),
							functionIdList: functionIdList?.map(item => Number(item)),
							manufactureIdList: manufactureIdList?.map(item => Number(item)),
							queryKey,
						}}
					>
						<NewsContent
							newsData={newsData} newsTypeTreeServer={newsTypeTreeServer}
							isAdda={true}
						/>
					</NewsContentContext.Provider>
					{/* textIndent: '-9999px', height: 0, pub-seo-visibility */}
					<h1 className="mb0 content-search-hidden-block" style={{ visibility: 'hidden', height: 1 }} aria-hidden="true">Electronic Component Information and Resources</h1>
				</div>
			</div>
		</PageContainer>
	);
};

export default ContentSearchPage;

export async function getServerSideProps({ req, query }) {
	const translations = await changeServerSideLanguage(req)
	const {
		serverToken, typefitIds, functionIdList, manufactureIdList,
		queryKey, param,
	} = newsPagesHelp(req, query)

	// const { account="" } = req.cookies
	// const serverToken = account.trim() !== "" && JSON.parse(account)?.token
	// url中的分类ids集合
	// const typefitIds = query?.typefitIds ? (query?.typefitIds?.split(',')) : []
	// const functionIdList = query?.functionIdList ? (query?.functionIdList?.split(',')) : []
	// // 选中的供应商
	// const manufactureIdList = query?.manufactureIdList?.split(',') || []
	// // url的key
	// const queryKey = query?.key || ''

	// const param = {
	//     keyword: queryKey,
	//     pageListNum: query?.pageNum || PUB_PAGINATION?.pageNum,
	//     pageListSize: query?.pageSize || PUB_PAGINATION?.pageSize,
	//     typeIdList: typefitIds?.map(item => Number(item)),
	//     functionIdList: functionIdList?.map(item => Number(item)),
	//     manufactureIdList: manufactureIdList?.map(item => Number(item)),
	//     languageType: getLocale(req),
	// }
	// 新闻列表
	const newsData = await NewsRepository.getQueryNewsList(param);
	const { resource, attribute, helpCenter, companyNews, video } = PUB_RESOURCE_TYPE

	const params = {
		parentTypeId: 0,
		typeList: [resource, attribute, helpCenter, companyNews, video],
		languageType: getLocale(req),
	}
	// 栏目树
	const newsTypeTreeServer = await NewsRepository.apiGetNewsTypeTree(params);
	const type = query?.type;

	return {
		props: {
			...translations,
			newsData: newsData || {},
			serverToken,
			selectedNewsType: type || null,
			newsTypeTreeServer: newsTypeTreeServer?.data,

			typefitIds,
			functionIdList,
			manufactureIdList,
			queryKey,
			param,
		},
	}
};