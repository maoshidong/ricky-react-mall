
import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import NewsRepository from '~/repositories/zqx/NewsRepository';
import { handleMomentTime, isIncludes } from '~/utilities/common-helpers';
import { getNewsUrl } from '~/utilities/easy-helpers';
import { DefaultImage } from '~/components/common';
// import { VIDEOS, BLOG, PRODUCT_HIGHLIGHTS, APPLICATION_NOTES, HELP_CENTER, NEWSROOM } from '~/utilities/sites-url';
// import { PUB_ARTICLE_TYPE, PUB_RESOURCE_TYPE } from '~/utilities/constant';
import useLanguage from '~/hooks/useLanguage';

const RecommendNewsCom = ({ curContent, title, otherNews }) => {
	const { i18Translate, getDomainsData } = useLanguage();
	const iPublishDate = i18Translate('i18ResourcePages.Publish Date', 'Publish Date')
	const iMoreBlogs = i18Translate('i18ResourcePages.More Blogs', 'More Blogs') // 修改多语言


	const { id, publishTime, columnId, newsType } = curContent || {}
	const [recommendList, setRecommendList] = useState(otherNews?.data?.data || [])
	const getList = async () => {
		const params = {
			pageListNum: 1,
			pageListSize: 5,
			publishTime,
			columnIdList: [columnId],
			languageType: getDomainsData()?.defaultLocale,
			// curLanguageCodeZh
		}

		const res = await NewsRepository.getQueryNewsList(params);

		if (res?.code === 0) {
			const arr = res?.data?.data.filter(item => item?.id !== id)
			setRecommendList(arr)
		}
	}
	// 所有getDetailHref方法同时修改
	const getDetailHref = (item) => {

		const routerTitle = isIncludes(item?.title)
		const lastUrl = `/${routerTitle}/${item?.id}`

		return getNewsUrl(newsType, lastUrl)
	}

	useEffect(() => {
		setRecommendList(otherNews?.data?.data || [])
	}, [otherNews])
	useEffect(() => {
		if (recommendList?.length === 0) {
			getList()
		}
	}, [curContent])
	return (
		<div className="">
			{
				recommendList?.length > 0 && (
					<div className="pub-border15 related-blogs">
						<div className="mb10 pub-font16 pub-fontw">{title || iMoreBlogs}</div>
						{
							recommendList?.map(item => {
								return (
									<Link href={getDetailHref(item)} key={nanoid()}>
										<a className="margin-20 recommend-item mb10 pub-flex">
											<DefaultImage
												className='pub-flex-center mr20 pub-flex-shrink'
												title={item?.title}
												imgUrl={item?.coverImage}
												imgClassName="w30"
												imgStyle={{ objectFit: 'contain', height: '30px' }}
											/>
											{/* {
                                                item?.coverImage && (
                                                    <div className="pub-flex-center mr20 pub-flex-shrink">
                                                        <img
                                                            className="w30"
                                                            alt={'Image of ' + item?.title} title={item?.title} style={{objectFit: 'contain', maxHeight: '150px'}} src={item?.coverImage} />
                                                    </div>
                                                )
                                            } */}

											<div className="pub-flex-wrap">
												<h3 className="pub-font12 pub-color555 pub-lh16 pub-font500 mb6 pub-color-hover-link">{item?.title}</h3>
												<div className="mb7 pub-color555 pub-font12 pub-italic">{iPublishDate}: {handleMomentTime(item?.publishTime)}</div>
											</div>

										</a>
									</Link>
								)
							})
						}
					</div>
				)
			}

		</div>
	)
}

export default RecommendNewsCom