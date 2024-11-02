import Link from 'next/link';
import useLanguage from '~/hooks/useLanguage';
import { Flex, DefaultImage } from '~/components/common';
import { isIncludes, handleMomentTime } from '~/utilities/common-helpers';
import { getNewsUrl } from '~/utilities/easy-helpers';

const NewItemCom = ({ item }) => {
	const { i18Translate } = useLanguage();
	const iLearnMore = i18Translate('i18MenuText.Learn more', 'Learn more');
	const iPublishDate = i18Translate('i18ResourcePages.Publish Date', 'Publish Date');

	const { id, title, contentSummary, newsType } = item || {};
	// 所有getDetailHref方法同时修改
	const getDetailHref = () => {
		// const routerTitle = isIncludes(title)
		const lastUrl = `/${id}` // /${routerTitle} 标题太长，不要了
		return getNewsUrl(newsType, lastUrl)

		// let href = '/';
		// const { specialProduct, article, appliedNote } = PUB_ARTICLE_TYPE;
		// const { companyNews, helpCenter, video } = PUB_RESOURCE_TYPE;
		// switch (Number(newsType)) {
		// 	case specialProduct:
		// 		href = PRODUCT_HIGHLIGHTS + lastUrl;
		// 		break;
		// 	case video:
		// 		href = VIDEOS + lastUrl;
		// 		break;
		// 	case companyNews:
		// 		href = NEWSROOM + lastUrl;
		// 		break;
		// 	case helpCenter:
		// 		href = HELP_CENTER + lastUrl;
		// 		break;
		// 	case appliedNote:
		// 		href = APPLICATION_NOTES + lastUrl;
		// 		break;
		// 	case article:
		// 		href = BLOG + lastUrl;
		// 		break;
		// }
		// return href;

	};

	return (
		<div className="pub-border15 box-shadow" style={{ height: '100%', width: '100%', padding: '10px' }}>
			<Link href={getDetailHref()}>
				<a className="pub-flex">
					<Flex>
						<DefaultImage style={{ width: '70px', height: '70px' }} title={item?.title} imgUrl={item?.coverImage} imgStyle={{ height: '64px', width: '64px' }} />
					</Flex>
					<div className="pub-flex-grow">
						<h3 className="pub-left-title pub-font14 pub-lh20 pub-line-clamp pub-clamp2 pub-color-hover-link">{title}</h3>
						<p className="mt5 pub-lh18 mb10 pub-font12 pub-line-clamp pub-clamp3">{contentSummary}</p>
						<Flex justifyBetween>
							<span className="pub-color555">
								{iPublishDate}: {handleMomentTime(item?.publishTime)}
							</span>
							<div className="pub-color-link">{iLearnMore}</div>
						</Flex>
					</div>
				</a>
			</Link>
		</div>
	);
};

export default NewItemCom