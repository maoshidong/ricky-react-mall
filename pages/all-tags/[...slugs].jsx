import React from 'react';
import Head from 'next/head';
import { changeServerSideLanguage, getLocale } from '~/utilities/easy-helpers';
import { SEO_COMPANY_NAME, PUB_PAGINATION } from '~/utilities/constant';
import qs from 'qs';
import { ALL_TAGS } from '~/utilities//sites-url';
import NewsRepository from '~/repositories/zqx/NewsRepository';
import PageContainer from '~/components/layouts/PageContainer';
import { isIncludes } from '~/utilities/common-helpers';
import NewItem from '~/components/News/NewItem';
import { Flex, SamplePagination } from '~/components/common';
import Link from 'next/link';
import BreadCrumb from '~/components/elements/BreadCrumb';
import useLanguage from '~/hooks/useLanguage';
import map from 'lodash/map'
import findIndex from 'lodash/findIndex'
import slice from 'lodash/slice'

const TagContents = ({ paramMap, numberList, newsList, firstLetter, tags, tagName, queryId, tagUrl }) => {

	const { i18Translate } = useLanguage();
	const iAllTags = i18Translate('i18MenuText.All Tags', 'All Tags')
	const iTags = i18Translate('i18AboutProduct.Tags', 'Tags');
	const iMoreTag = i18Translate('i18MenuText.More tag content', 'More tag content')
	const titleSeo = `${tagName} ${SEO_COMPANY_NAME}`
	const i18Title = i18Translate('i18Seo.allTagsDetails.title', titleSeo, { tag: tagName })
	const i18Key = i18Translate('i18Seo.allTagsDetails.keywords', titleSeo, { tag: `${tagName}, ` })
	const i18Des = i18Translate('i18Seo.allTagsDetails.description', titleSeo, { tag: `${tagName}, ` })

	const { total, pages, pageNum, pageSize } = newsList || {};
	// console.log(newsList, 'newsList----del')
	const currentUrl = `${ALL_TAGS}/${isIncludes(tagUrl)}/${queryId}`;

	const breadcrumb = [
		{
			text: iAllTags,
			url: '/all-tags',
		},
		{
			text: tagName,
		}
	];

	// 除分页外其它参数，传给分页组件
	const getOtherUrlParams = () => {
		let params = {};
		if (firstLetter) {
			params.key = firstLetter;
		}
		return qs.stringify(params);
	};

	return (
		<PageContainer
			paramMap={paramMap}
			pageOtherParams={{
				showFooter: false,
				showHead: true,
			}}
		>
			<Head>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta property="og:description" content={i18Des} key="og:description" />
				<meta property="og:url" content={`https://www.origin-ic.com${currentUrl}`} key="og:url" />
  				<meta property="og:image" content="https://www.origin-ic.com/static/img/logo.png" key="og:image" />
			</Head>

			<div className="ps-page--shop pb-60">
				<Flex column className="ps-container">
					<h2 className="mb16 pub-font500 pub-font14 pub-color888">
						<BreadCrumb breacrumb={breadcrumb} layout="fullwidth" />
					</h2>
					<h1 className='mb16 pub-font24'>
						{iTags}: {tagName}
					</h1>
					<Flex gap={20}>
						<Flex flex column>
							<div className="all-tags-item">
								{newsList?.data?.map((item, index) => {
									return (
										<div key={index}>
											<div className="mb10">
												<NewItem item={item} />
											</div>
										</div>
									);
								})}
							</div>

							{numberList?.length > 0 && (
								<>
									<div>
										<SamplePagination
											className="mt20"
											total={total}
											pageNum={pageNum}
											pageSize={pageSize}
											pagesTotal={pages}
											currentUrl={currentUrl}
											otherUrlParams={getOtherUrlParams()}
										/>
									</div>
								</>
							)}
						</Flex>

						<div className="pub-flex-shrink pub-fit-content pb-10 w300">
							<div className="pub-border15 related-blogs">
								<div className="mb10 pub-font16 pub-fontw">{iMoreTag}</div>
								{map(tags, ts => {
									return <Link key={ts?.id} href={ALL_TAGS + `/${isIncludes(ts?.name)}/${ts?.id}`}>
										<a className='margin-20 recommend-item pub-flex' style={{ border: 'none' }}>
											<h3 className="pub-font12 pub-color555 pub-lh16 pub-font500 pub-color-hover-link" style={{ width: '100%', padding: '10px 0' }}>{ts.name}</h3>
										</a>
									</Link>
								})}
							</div>
						</div>
					</Flex>
				</Flex>
			</div>
		</PageContainer>
	);
};

export default React.memo(TagContents);

export async function getServerSideProps({ req, query }) {
	const translations = await changeServerSideLanguage(req);

	const firstNumber = query?.key?.slice(0, 1) || "";
	const tagId = query?.slugs?.[1] || '';
	const tagUrl = query?.slugs?.[0] || '';

	const res = await NewsRepository.apiQueryWebTagFirstNumber(); // 所有首字母

	const params = {
		firstNumber,
		pageListNum: query?.pageNum || PUB_PAGINATION?.pageNum,
		pageListSize: query?.pageSize || PUB_PAGINATION?.pageSize,
		tagId,
		languageType: getLocale(req),
	};

	const resNews = await NewsRepository.apiQueryWebNewsListByTag(params); // 标签新闻列表
	const tagName = resNews?.data?.data?.[0]?.tagName || ''
	const param1 = {
		firstNumber,
		pageListNum: 1,
		pageListSize: 99999999,
		languageType: getLocale(req),
	}
	const childTag = await NewsRepository.apiQueryWebTagList(param1); // 首字母下标签

	const _tags = childTag?.data?.data || []
	let tags = []
	let tagIndex = findIndex(_tags, tg => tg.name === tagName)
	if (!(tagIndex === -1 || tagIndex === _tags.length - 1)) {
		tags = slice(_tags, tagIndex + 1, tagIndex + 11);
	}

	// if (!tagName) {  
	// 	return redirect404()
	// }

	return {
		props: {
			...translations,
			numberList: res?.data || [],
			newsList: resNews?.data || [],
			firstLetter: query?.key || '',
			queryId: tagId || '',
			tagName,
			tags: tags,
			tagUrl
		},
	};
}