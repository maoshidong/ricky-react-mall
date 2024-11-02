import Head from 'next/head';
import last from 'lodash/last';
import BreadCrumb from '~/components/elements/BreadCrumb';
import PageContainer from '~/components/layouts/PageContainer';
import RecommendNews from '~/components/News/RecommendNews';
import AddAttributesToImages from '~/components/elements/min/AddAttributesToImages';
import TagRelaManu from '~/components/News/MinCom/TagRelaManu';
import { Flex } from '~/components/common';
import NewsRepository from '~/repositories/zqx/NewsRepository';
import useLanguage from '~/hooks/useLanguage';
// import useI18 from '~/hooks/useI18';

import { handleMomentTime } from '~/utilities/common-helpers';
import { SEO_COMPANY_NAME, SEO_COMPANY_NAME_ZH, PUB_ARTICLE_TYPE } from '~/utilities/constant';
import { BLOG } from '~/utilities/sites-url'
import { getLocale, changeServerSideLanguage, redirect404 } from '~/utilities/easy-helpers';

const BlogDetail = ({ paramMap, res, otherNews }) => {
	const { i18Translate, curLanguageCodeZh } = useLanguage();
	// const { iAuthor } = useI18();
	const iHome = i18Translate('i18MenuText.Home', 'Home')
	const iBlog = i18Translate('i18MenuText.Blogs', 'Blog')
	const iPublishDate = i18Translate('i18ResourcePages.Publish Date', 'Publish Date')

	const iShare = i18Translate('i18AboutProduct.Share', 'Share')

	const { data } = res || {}
	const { content } = data || {}

	const breadcrumb = [
		{
			text: iHome,
			url: '/',
		},
		{
			text: iBlog,
			url: BLOG,
		},
		{
			text: content?.title,
		}
	];

	// useEffect(async () => {
	//     const param = {
	//         newsId: 37514,
	//         newsType: 2,
	//         // isNeedPreview: 1, // 未发布也可预览
	//     }
	//     const res = await NewsRepository.apiQueryNewsDetail(param);
	// }, [])

	const { id, newsType, seoKey, keywords, title, relaManuList = [], tagList = [], contentImage } = content || {}
	const titleSeo = `${title} ${curLanguageCodeZh() ? SEO_COMPANY_NAME_ZH : SEO_COMPANY_NAME}`

	// 假设你有一个包含 HTML 内容的字符串
	const htmlString = '<p>This is an <img src="example.jpg"> example <img src="example2.jpg"> string.</p>';
	// 使用正则表达式匹配所有的 <img> 标签，并添加 alt 属性
	// const replacedHtml = content?.content.replace(/<img([^>]*)>/g, `<img$1 alt="${title}" title="${title}">`);
	// 使用正则表达式匹配所有的 <img> 标签，并添加 alt 和 title 属性
	// const replacedHtml1 = htmlString.replace(/<img([^>]*)>/g, (match, p1) => {
	//     // 如果匹配到的 img 标签中没有 title 属性，则添加 alt 和 title 属性
	//     if (!p1.includes('title')) {
	//     return `<img${p1} alt="Image" title="Image">`;
	//     } else {
	//     // 否则只添加 alt 属性
	//     return `<img${p1} alt="Image">`;
	//     }
	// });

	return (
		<PageContainer paramMap={paramMap}>
			<Head>
				<title>{titleSeo}</title>
				<meta property="og:title" content={titleSeo} key="og:title" />
				<meta name="keywords" content={keywords} key="keywords" />
				<meta name="description" content={content?.contentSummary} key="description" />
				<meta name="og:description" content={content?.contentSummary} key="og:description" />
			</Head>
			<div className="articles-detail-page ps-page--single pub-bgc-f5 pb-60 pub-minh-1">
				<div className='ps-container'>

					<BreadCrumb breacrumb={breadcrumb} layout="fullwidth" />


					<div className='pub-flex mt25 blog-detail'>
						<div className='pub-flex-grow pub-border15 mr20' style={{ minHeight: '500px' }}>
							<div className='articles-detail-title'>
								<h1 className='pub-font22 pub-lh26 mb15'>{title}</h1>
							</div>
							<h2 className='mb20 pub-font16 pub-color555 pub-fontw pub-lh18'>{content?.contentSummary}</h2>

							<div className='mt5 mb13 vue-ueditor-wrap' style={{ alignItems: "flex-start", display: 'inline-block' }}>
								{/* 清除br标签 */}
								<AddAttributesToImages imgAlt={'Image of ' + title} imgTitle={title} imgUrl={contentImage} contents={content?.content} />
							</div>

							{/* 相关标签 */}
							<TagRelaManu relaManuList={relaManuList} content={content} tagList={tagList} />

							<div className='mt18 mb5 pub-flex pub-color555'>
								<div className='pub-font12'>{iPublishDate}: {handleMomentTime(content?.publishTime)}</div>
								{/* {content?.author && <div className='ml40'>{iAuthor} : {content?.author}</div>} */}
							</div>

						</div>
						{/* 详情右侧 */}
						<div className='pub-flex-shrink pub-fit-content pb-10 w300'>

							<div>
								<RecommendNews otherNews={otherNews} curContent={content} newsType={newsType} curNewId={id} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</PageContainer>
	);
};
export default BlogDetail;
// getServerSideProps -> getStaticProps
export async function getServerSideProps({ req, params, query }) {
	// slugs -> id
	let { slugs } = params;
	const { isNeedPreview } = query; // 未发布也可预览
	let newsId = Number(last(slugs));
	const param = {
		newsId,
		newsType: PUB_ARTICLE_TYPE.article,
		isNeedPreview: isNeedPreview || '',
		languageType: getLocale(req),
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
			param,
			otherNews,
		},
	}
};


// export async function getStaticPaths() {
//   // const res = await fetch('https://api.example.com/blog');
//   // const posts = await res.json();
// 	// pages/blog/[id].js
// 	// const posts = [
// 	// 	{id: '23498'},
// 	// ]
// 	// pages/blog/[...slugs].js
// 		const posts = [
// 			{slugs: '23498'},
// 		]
	
//   const paths = posts.map(post => ({
//     params: { slugs: post.slugs.split('/') },
//   }));

//   return {
//     paths,
//     fallback: false, // 如果你不希望返回未生成的页面，可以设置为false
//   };
// }

