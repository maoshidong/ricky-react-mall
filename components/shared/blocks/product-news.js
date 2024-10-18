import React from 'react';
import Link from 'next/link';
import TitleMore from '~/components/shared/public/titleMore';
import { CONTENT_SEARCH } from '~/utilities/sites-url';
import { isIncludes } from '~/utilities/common-helpers';
import { getNewsUrl } from '~/utilities/easy-helpers';
import useLanguage from '~/hooks/useLanguage';

const productNews = ({ newsServer }) => {
	const { i18Translate } = useLanguage();
	const list = newsServer?.slice(0, 4) || [];

	// 所有getDetailHref方法同时修改
	const getDetailHref = (item) => {
		const routerTitle = isIncludes(item?.title)
		const lastUrl = `/${routerTitle}/${item?.id}`
		return getNewsUrl(item?.newsType, lastUrl)
		
		// const { id, title, newsType } = item || {};
		// const routerTitle = isIncludes(title);
		// let href = BLOG + `/${routerTitle}/${id}`;
		// if (newsType == PUB_ARTICLE_TYPE.specialProduct) {
		// 	href = PRODUCT_HIGHLIGHTS + `/${routerTitle}/${id}`;
		// } else if (newsType == PUB_RESOURCE_TYPE.companyNews) {
		// 	href = NEWSROOM + `/${routerTitle}/${id}`;
		// } else if (newsType == PUB_RESOURCE_TYPE.helpCenter) {
		// 	href = HELP_CENTER + `/${routerTitle}/${id}`;
		// }
		// return href;
	};

	if (!list || !list.length) return null;
	const iViewMore = i18Translate('i18MenuText.View more', 'View more');
	const iProductNews = i18Translate('i18MenuText.Product News', 'PRODUCT NEWS');

	return (
		<>
			{list.length > 0 && (
				<div className="blocks-product-news ps-product-list pb-0" style={{ visibility: 'hidden', height: 0, paddingBottom: '0px !important' }} aria-hidden="true">
					<div className="ps-container">
						<TitleMore title={iProductNews} subTitle={iViewMore} linkUrl={CONTENT_SEARCH} />
						<div className="row">
							{list.map((item) => (
								<div key={item?.id}>
									<Link href={getDetailHref(item)}>
										<a className="col-xl-6 col-sm-12 pub-padding8 pub-quick-links-box" aria-hidden="true">
											<div className="product-news-item"></div>
										</a>
									</Link>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default productNews