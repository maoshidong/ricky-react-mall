import React from 'react';
import Link from 'next/link';
import { Table, Button } from 'antd';
import { nanoid } from 'nanoid';
// 列表小组件
import { MinTableImage, MinTableProductDetail } from '~/components/ecomerce/minTableCom/index';
import RecommendNews from '~/components/News/RecommendNews';
import AddAttributesToImages from '~/components/elements/min/AddAttributesToImages';

import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
import { handleMomentTime, getProductUrl, handManufacturerUrl, isIncludes, capitalizeFirstLetter } from '~/utilities/common-helpers';
import { getEnvUrl, CONTENT_SEARCH, MANUFACTURER, PRODUCTS_FILTER, ALL_TAGS } from '~/utilities/sites-url'
import { PUB_RESOURCE_TYPE } from '~/utilities/constant'

const ProductHighlightsCom = ({ res, otherNews }) => {
	const { data } = res || {}
	const { content, specialFeatureList, specialProductList } = data || {}

	const { i18Translate } = useLanguage();
	const { iAuthor } = useI18();

	const iMoreProductHighlights = i18Translate('i18ResourcePages.More Product Highlights', 'More Product Highlights')
	const iMoreApplicationNotes = i18Translate('i18ResourcePages.More Application Notes', 'More Application Notes')
	const iTags = i18Translate('i18AboutProduct.Tags', 'Tags')
	const iPublishDate = i18Translate('i18ResourcePages.Publish Date', 'Publish Date')

	// 新闻数据
	const {
		title, seoKey, seoFlag, publishTime, coverImage,
		manufacturerSlug, manufacturerName, recommendManu, manufacturerLogo,
		recommendCatalogName, recommendCatalog, slugStatus,
		functionName, contentFunction, tagList,
		videoCode, newsType,
	} = content || {}

	const { appliedNote } = PUB_RESOURCE_TYPE
	const moreNewsTit = newsType == appliedNote ? iMoreApplicationNotes : iMoreProductHighlights

	let seoKeyProductName = []
	let manufacturerData = recommendManu ? [{ name: manufacturerName, id: recommendManu, slug: manufacturerSlug }] : [] // 所有供应商名称 + id, 默认先添加分类后面选择的供应商， 如何再push产品的供应商
	let manufacturerNames = recommendManu ? [manufacturerName] : [] // 所有供应商名称
	let catalogData = [] // 所有分类名称 + id
	let catalogNames = []
	console.log('specialProductList---del', specialProductList)
	specialProductList?.map(item => {
		// 产品列表
		const arr = item?.productList?.map(i => {

			manufacturerNames?.push(i?.manufacturerName)

			const lanCatalogName = i?.catalogName   // 语言产品分类名
			catalogNames?.push(lanCatalogName)
			manufacturerData?.push({
				name: i?.manufacturerName,
				slug: i?.manufacturerSlug,
				id: i?.manufacturerId,
			})
			catalogData?.push({
				name: lanCatalogName,
				id: i?.catalogId,
				slug: i?.catalogSlug,
			})
			return item?.name
		})

		seoKeyProductName?.push(arr)
	})

	// console.log('manufacturerNames---del', manufacturerNames)
	const uniqueArrMan = [...new Set(manufacturerNames)]; // 去重

	const uniqueArrCatalog = [...new Set(catalogNames)]; // 去重

	// Tags: 新闻分类，功能，添加产品的所有分类，品牌，filter页   

	const getSpecialFeatureList = () => {
		return (
			<div className=''>
				{
					specialFeatureList?.map(item =>
					(
						<div className='mb5 pub-color555' key={nanoid()}>
							<h2 className='mb3 pub-color555 pub-font14 pub-fontw'>{item?.firstTitle}</h2>
							<div className='pub-flex-wrap percentW100'>
								{
									item?.detailList?.length > 0 && item?.detailList?.map((i, index) => {
										return (

											<div key={nanoid()} className={!i?.secondTitle ? 'percentW100' : 'percentW50'}>
												{/* 有二级标题 percentW50 ::marker  */}
												{
													i?.secondTitle && (
														<ul className={'mb0 pub-flex ' + (index === 0 ? 'pl-40' : 'pl-60 ml-20')}>
															<li className='mb3'>
																<p className='pub-before-point'>{i?.secondTitle}</p>
																{/* 以\n截取，并且filter有值的 */}
																{
																	i?.content?.split('\n')?.length > 0 && i?.content?.split('\n')?.filter(item => item !== '' && item !== null && typeof item !== 'undefined')?.map(j => {
																		return <p key={nanoid()} className='pl-30 pr-15 pub-before-point pub-before-point-hollow pub-lh20'>{j}</p>
																	})
																}
															</li>
														</ul>

													)
												}
												{/* 无二级标题 */}
												{
													!i?.secondTitle && (
														<ul className='mb0'>
															<li className='percentW100 pub-flex-wrap'>
																{
																	i?.content?.split('\n')?.length > 0 && i?.content?.split('\n')?.filter(item => item !== '' && item !== null && typeof item !== 'undefined')?.map(j => {
																		return <p key={nanoid()} className='percentW50 pub-before-point pub-lh20 pr-15'>
																			{j}
																		</p>
																	})
																}
															</li>
														</ul>
													)
												}
											</div>
										)
									})
								}
							</div>
						</div>
					)
					)
				}
			</div>
		)
	}

	const iImage = i18Translate('i18PubliceTable.Image', 'Image')
	const iManufacturer = i18Translate('i18PubliceTable.Manufacturer', 'Manufacturer')
	const iDescription = i18Translate('i18AboutProduct.Description', 'Description')
	const iOperation = i18Translate('i18PubliceTable.Operation', 'Operation')
	const iViewDetails = i18Translate('i18FunBtnText.View Details', 'View Details')

	const columns = [
		{
			title: iImage,
			width: 85,
			dataIndex: 'image',
			render: (url, record) =>
				<MinTableImage record={record} />
		},
		{
			title: i18Translate('i18PubliceTable.PartNumber', 'Part Number'), // {i18Translate('i18PubliceTable.PartNumber', 'Part Number')}
			dataIndex: 'name',
			render: (text, record) => (
				<MinTableProductDetail
					record={record} showCustomerReference={false}
					manufacturerLink={true}
					showManufacturer={false}
					otherProps={{
						showImage: false,
						showDatasheetRohs: true,
					}} />
			)
		},

		{
			title: iManufacturer,
			dataIndex: 'description',
			render: (text, record) => (
				<div className='manufacturer'>
					{/* , record?.parentId || record?.manufacturerId */}
					{+record?.slugStatus === 1 ? <Link href={handManufacturerUrl(record?.manufacturerSlug)}>
						<a className='pub-color-hover-link'>{record?.manufacturerName}</a>
					</Link> : record?.manufacturerName}
				</div>
			)
		},
		{
			title: iDescription,
			dataIndex: 'description',
			render: (text, record) => (
				<>{text}</>
			)
		},
		{
			title: iOperation,
			dataIndex: 'View Details',
			width: 140,
			render: (text, record) => {
				return (
					<Link href={getProductUrl(record?.manufacturerName, record?.name, record?.productId)}>
						<a className='custom-antd-btn-more'>
							<Button
								type="primary" ghost
								className='custom-antd-primary ps-add-cart-footer-btn w120'
							>{iViewDetails}</Button>
						</a>
					</Link>
				)
			},
		},
	]


	// 管理端seoFlag === 2 就不拼接, 控制SEO关键词是否需要拼接产品型号,供应商名称,功能名称,分类名称

	const newSeoKey = seoKey || ""
	// 关键词拼接
	let seoKeyAddName = seoFlag === 2 ? newSeoKey : newSeoKey

	// seo拼接
	if (seoFlag !== 2) {
		if (seoKeyProductName?.join(',')) {
			seoKeyAddName = seoKeyProductName?.join(',') + ',' + seoKeyAddName
		}
		if (manufacturerName) {
			seoKeyAddName = manufacturerName + ',' + seoKeyAddName
		}
		if (recommendCatalogName) {
			seoKeyAddName = recommendCatalogName + ',' + seoKeyAddName
		}
		if (functionName) {
			seoKeyAddName = functionName + ',' + seoKeyAddName
		}
	}
	// 推荐分类链接 typefitIds -> functionIdList
	const getCatLink = () => {
		return <div className='mb10'><Link href={`${getEnvUrl(CONTENT_SEARCH)}?functionIdList=` + recommendCatalog}>
			<a className="new-tag ml10 pub-color-hover-link">{capitalizeFirstLetter(recommendCatalogName)}</a>
		</Link>
		</div>
	}
	// 功能链接
	const getFunctionLink = () => {
		return <div className='mb10'><Link href={`${CONTENT_SEARCH}?functionIdList=` + contentFunction}>
			<a className="new-tag ml10 pub-color-hover-link">{capitalizeFirstLetter(functionName)}</a>
		</Link>
		</div>
	}

	// 供应商链接
	const getManLink = () => {
		return uniqueArrMan?.map(i => {
			if (!i) return
			const findItem = manufacturerData?.find(item => item?.name === i)
			if (+slugStatus !== 1) return <div className="new-tag ml10 mb10">{capitalizeFirstLetter(i)}</div>
			// /${findItem?.parentId ||findItem?.id}
			return <div className='mb10' key={nanoid()}><Link href={`${MANUFACTURER}/${isIncludes(findItem?.slug)}`}>
				<a className="new-tag ml10 pub-color-hover-link">{capitalizeFirstLetter(i)}</a>
			</Link>
			</div>
		})
	}

	// 分类链接 - 是否拿最后的分类名
	const getCatalogLink = () => {
		return uniqueArrCatalog?.map(i => {
			const id = (catalogData?.find(item => item?.name === i))?.id
			const slug = (catalogData?.find(item => item?.name === i))?.slug
			return id ? <div className='mb10' key={nanoid()}><Link href={`${PRODUCTS_FILTER}/${isIncludes(slug)}/${id}`}>
				<a className="new-tag ml10 pub-color-hover-link">{capitalizeFirstLetter(i)}</a>
			</Link>
			</div> : null
		})
	}
	// 	1：Tag标签要和文章相关，最好是文章里包含有这个关键词。

	// 2：站内已发文章的tag标签太多了，tag标签要控制在1-5个就行，不要太多。


	// 字母标签
	// const getTagListLink = () => {
	// 	return tagList?.map(i => {
	// 		return <div className='mb10' key={nanoid()}><Link href={getEnvUrl(ALL_TAGS) + `/${isIncludes(i?.name)}/${i?.id}`}>
	// 			<a className="new-tag ml10 pub-color-hover-link">{capitalizeFirstLetter(i?.name)}</a>
	// 		</Link>
	// 		</div>
	// 	})
	// }

	// <meta property="og:title" content="你的分享标题">
	// <meta property="og:image" content="你的封面图链接">
	// <meta property="og:url" content="你的网页链接">
	// 清除 Facebook 的缓存。您可以使用 Facebook 的调试工具来刷新页面缓存并获取新的元数据。访问 Facebook Sharing Debugger(https://developers.facebook.com/tools/debug/)，输入分享页面的链接，然后点击 "Debug" 按钮。这将会更新 Facebook 对页面的缓存，并显示最新的元数据。

	return (
		<div className='pub-flex mt25 product-highlights-wrapper'>
			{/* pub-flex-grow */}
			<div className='nav-fixed-width pub-border15 mr20'>
				{
					videoCode && <div className='mt10' dangerouslySetInnerHTML={{ __html: videoCode }}></div>
				}

				<div className='articles-detail-title'>
					<h1 className='pub-font22 pub-lh26 mb15'>{content?.title}</h1>
				</div>

				<div className='pub-flex mt5 product-highlights-content'>
					<div className='vue-ueditor-wrap'>
						<h2 className='mb20 pub-font16 pub-color555 pub-fontw pub-lh18'>{content?.contentSummary}</h2>
						<AddAttributesToImages
							imgAlt={'Image of ' + title} imgTitle={title}
							contents={content?.content}
							imgUrl={coverImage} manufacturerLogo={manufacturerLogo}
							manufacturerName={manufacturerName}
							// , parentId || recommendManu
							manufacturerUrl={handManufacturerUrl(manufacturerSlug)}>
							{/* 清除br标签 */}
							{/* <div className='pub-flex-grow pub-link-a ' dangerouslySetInnerHTML={{ __html: content?.content?.replace(/<br\s*\/?>/gi, '') }}></div> */}
						</AddAttributesToImages>
					</div>
					{
						// (manufacturerLogo || coverImage) && <div className='pub-flex-shrink ml30 w240 cover-image-box pub-fit-content' style={{ maxWidth: '240px' }}>
						//     {
						//         manufacturerLogo && <div className='pub-flex-center mb20'>
						//             <LazyLoad>
						//                 <Link href={handManufacturerUrl(manufacturerSlug)}>
						//                     <a className='pub-flex-center' style={{ maxWidth: '50%' }}>
						//                         <img
						//                             className='pub-object-fit-contain'
						//                             src={manufacturerLogo}
						//                             title={manufacturerName} alt={manufacturerName}
						//                         />
						//                     </a>
						//                 </Link>
						//             </LazyLoad>
						//         </div>
						//     }

						//     <div className='pub-flex-center w200'>
						//         <LazyLoad>
						//             <img
						//                 alt={'Image of ' + title} title={title}
						//                 className='pub-object-fit-contain w200' src={coverImage || "https://oss.origin-ic.net/otherFile/bog.jpg"} />
						//         </LazyLoad>
						//     </div>

						// </div>
					}
				</div>


				{getSpecialFeatureList()}
				<div className='mt20'>
					{
						specialProductList?.map(item => {
							return <div className='mb20' key={nanoid()}>
								<h2 className='special-product pub-color555 pub-font14 pub-fontw'>{item?.title}</h2>

								<Table
									columns={columns}
									dataSource={item?.productList || []}
									size="small"
									bordered
									sticky
									pagination={false}
									rowKey={record => record.productId}
									className="pub-bordered"
									style={{ borderRadius: '6px' }}
									scroll={item?.productList?.length > 0 ? { x: 600 } : null}
								/>
							</div>
						})
					}
				</div>
				{/* Tags: 新闻分类，功能，添加产品的所有分类，品牌，filter页,  */}
				{
					(recommendCatalogName || functionName || uniqueArrMan?.length > 0 || uniqueArrCatalog?.length > 0) && <div className='pub-color555 pub-flex-wrap'>{iTags}:
						{
							recommendCatalogName && getCatLink()
						}
						{
							functionName && getFunctionLink()
						}
						{
							uniqueArrMan?.length > 0 && getManLink()
						}
						{
							uniqueArrCatalog?.length > 0 && getCatalogLink()
						}
						{/* {
							tagList?.length > 0 && getTagListLink()
						} */}
					</div>
				}


				<div className='mt18 mb5 pub-flex pub-color555'>
					<div className='pub-font12'>{iPublishDate}: {handleMomentTime(content?.publishTime)}</div>
					{/* {content?.author && <div className='ml40'>{iAuthor} : {content?.author}</div>} */}
				</div>

			</div>
			<div className='pub-flex-shrink pub-fit-content pb-10 w300'>
				{/* <div className='pub-border15'>
                    <h2 className='mb12 pub-font14 pub-fontw'>{iShare}</h2>
                    <ExternalShare paramMap={paramMap} />
                </div> */}
				<div>
					<RecommendNews title={moreNewsTit} otherNews={otherNews} curContent={content} publishTime={publishTime} />
				</div>
			</div>

		</div>
	);
};
export default ProductHighlightsCom;