import Link from 'next/link';
import { handleMomentTime } from '~/utilities/common-helpers';
import { BLOG, NEWSROOM, HELP_CENTER, VIDEOS, PRODUCT_HIGHLIGHTS, APPLICATION_NOTES } from '~/utilities/sites-url';
import { PUB_ARTICLE_TYPE, PUB_RESOURCE_TYPE } from '~/utilities/constant';
import { handManufacturerUrl, isIncludes } from '~/utilities/common-helpers';
import { getNewsUrl } from '~/utilities/easy-helpers';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';

const NewItemCom = ({ item }) => {
	const { i18Translate } = useLanguage();
	const { iBlogs, iProductHighlights, iApplicationNotes, iNewsArchive, iVideos, iAuthor } = useI18()
	const iPublishDate = i18Translate('i18ResourcePages.Publish Date', 'Publish Date');

	// slugStatus 1 品牌主页开启
	const { id, title, contentSummary, updateTime, publishTime, author, newsType, coverImageThumb, coverImage, manufacturerName, manufacturerSlug, slugStatus } = item || {};
	const filterImg = coverImageThumb || coverImage; // 先拿小图
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
	const getTagHref = () => {
		const { specialProduct, appliedNote } = PUB_ARTICLE_TYPE;
		const { companyNews, helpCenter, video } = PUB_RESOURCE_TYPE;
		let obj = {
			href: BLOG,
			label: iBlogs,
		};
		switch (Number(newsType)) {
			case specialProduct:
				obj = {
					href: PRODUCT_HIGHLIGHTS,
					label: iProductHighlights,
				};
				break;
			case video:
				obj = {
					href: VIDEOS,
					label: iVideos,
				};
				break;
			case companyNews:
				obj = {
					href: NEWSROOM,
					label: iNewsArchive,
				};
				break;
			case helpCenter:
				obj = {
					href: HELP_CENTER,
					label: 'Help & Support',
				};
				break;
			case appliedNote:
				obj = {
					href: APPLICATION_NOTES,
					label: iApplicationNotes,
				};
				break;
		}
		return obj;
	};

	return (
		<div className="pub-border15 box-shadow">
			<div className="pub-flex">
				<div className="pub-flex-grow">
					<h3>
						<Link href={getDetailHref()}>
							<a className="pub-left-title pub-color-hover-link">{title}</a>
						</Link>
					</h3>
					<p className="mt5 pub-color555 pub-lh18">{contentSummary}</p>

					<div className="mt16">
						{(manufacturerName) ?
							(+slugStatus === 1 ? <Link href={handManufacturerUrl(manufacturerSlug)}>
								<a className="new-tag mr10 pub-color-hover-link">{manufacturerName}</a>
							</Link> : <span className='new-tag mr10'>{manufacturerName}</span>) : null
						}
						<Link href={getTagHref()?.href}>
							<a className="new-tag mr10 pub-color-hover-link">{getTagHref()?.label}</a>
						</Link>
					</div>

					<div className="pub-flex mt20">
						{publishTime && (
							<div className="mr40 pub-color555">
								{iPublishDate}: {handleMomentTime(publishTime)}
							</div>
						)}
						{/* {author && (
							<div className="mr20 pub-color555">
								{iAuthor}: {author}
							</div>
						)} */}
						{updateTime && (
							<div className="pub-color555" style={{ opacity: 0 }}>
								Updated: {handleMomentTime(updateTime)}
							</div>
						)}
					</div>
				</div>

				{filterImg && (
					<img
						className="pub-flex-shrink pub-object-fit-contain ml40"
						src={filterImg}
						style={{ width: '64px', height: '64px' }}
						title={manufacturerName}
						alt={manufacturerName || title}
					/>
				)}
			</div>
		</div>
	);
};

export default NewItemCom