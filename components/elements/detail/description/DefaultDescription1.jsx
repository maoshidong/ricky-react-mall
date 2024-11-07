import React, { useState, useContext } from 'react';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import last from 'lodash/last';
import TabNav from '~/components/ecomerce/minCom/TabNav';
import NewItem from '~/components/News/NewItem';
import PubProductsTable from '~/components/ecomerce/minTableCom/PubProductsTable';
import { ProductsDetailContext } from '~/utilities/shopCartContext';
import { PRODUCTS_FILTER } from '~/utilities/sites-url';
import useLanguage from '~/hooks/useLanguage';
import { isIncludes } from '~/utilities/common-helpers'

// 产品概述, 相关文章, 相关产品, 热门搜索
const DefaultDescription1 = ({ newsServer }) => {
	const { i18Translate } = useLanguage();
	const iProductOverview = i18Translate('i18AboutProduct.Product Overview', 'Product Overview')
	const iRelatedArticles = i18Translate('i18AboutProduct.Related Articles', 'Related Articles')
	const iSimilarProducts = i18Translate('i18AboutProduct.Similar Products', 'Similar Products')
	const iPopularSearches = i18Translate('i18AboutProduct.Popular Searches', 'Popular Searches')
	const iSeries = i18Translate('i18Other.Series', "Series")
	const iEcadModel = i18Translate('i18PubliceTable.ECAD Model', 'ECAD Model')

	const { productDetailData, catalogSeries, descriptionSeo, otherProducts } = useContext(ProductsDetailContext)

	const [tabActive, seTabActive] = useState(iProductOverview)

	const {
		id, catalogsList,
	} = productDetailData || {};

	const handleTabNav = (e, item) => {
		e.preventDefault();
		seTabActive(item?.label)
	}

	let headNavArr = [
		{
			label: iProductOverview,
		},
		{
			label: iRelatedArticles,
		},
		{
			label: iSimilarProducts,
		},
	//	{
	// 		label: iPopularSearches,
	// 	},
	]

	// 没有相关新闻
	if (newsServer?.length === 0) {
		headNavArr = headNavArr?.filter(item => item?.label !== iRelatedArticles)
	}

	if (otherProducts?.data?.length < 2) {
		headNavArr = headNavArr?.filter(item => item?.label !== iSimilarProducts)
	}

	return (
		<div className="ps-product__content pub-border20 box-shadow" style={{ padding: 0 }}>
			<TabNav tabActive={tabActive} headNavArr={headNavArr} handleTabNav={handleTabNav} />

			{/* 有货型号 - From Manufacturer: 品牌, it is an 描述, part of 一级分类名称，二级分类名称等分类名称. 型号 tags: 热卖，推荐，特价。型号 stock status: In stock; order now! Ships immediately. 
					没货型号 - From Manufacturer: 品牌, it is an 描述, part of 一级分类名称，二级分类名称等分类名称. 型号 stock status: need to confirm with us, contact us! Quick Reply. */}
			{
				<p className={(tabActive === iProductOverview ? 'pub-color555 pt-20 pr-20 pb-20 pl-20' : 'pub-seo-visibility')}>{descriptionSeo}</p>
			}
			{newsServer?.length > 0 && (
				<div
					className={(tabActive === iRelatedArticles ? 'pub-color555 pt-20 pr-20 pb-20 pl-20' : 'pub-seo-visibility')}
				>
					{
						newsServer?.map(item => {
							return (
								<div key={nanoid()}>
									<div className='mb10'><NewItem item={item} /></div>
								</div>
							)
						})
					}
				</div>
			)}

			{
				<div className={(tabActive === iSimilarProducts ? 'pub-color555' : 'pub-seo-visibility')} style={{ maxWidth: '100%' }}>
					<PubProductsTable
						productsList={otherProducts?.data?.filter(i => i?.productId !== id) || []}
						total={5} pages={1}
						filterLable={[iEcadModel]}
						isShowPage={false}
						isNeedRFq={false}
						isShadow={false}
						isShowBottom={false}
						tableClass='ps-similar-table'
					/>
				</div>
			}
			{/* {
				<div className={(tabActive === iPopularSearches ? 'pub-color555 pt-20 pr-20 pb-20 pl-20' : 'pub-seo-visibility1')}>
					<div className="pub-flex-wrap">
						{
							catalogSeries?.map(item => {
								return (
									<Link
										href={`${PRODUCTS_FILTER}/${isIncludes(last(catalogsList)?.slug)}/${last(catalogsList)?.id}?attrList=${item?.productAttributeId}`}
										key={nanoid()}
									>
										<a target='_blank' className="new-tag mr10 mb10 pub-color-hover-link">{item?.attrValue} {iSeries}</a>
									</Link>
								)
							})
						}
					</div>
				</div>
			} */}

			{/* 详情页询价 */}
			{/* {isQuoteView && (
				<Modal
					centered
					title={i18Translate('i18FunBtnText.REQUEST A QUOTE', "Request a Quote")}
					footer={null}
					width={550}
					onCancel={(e) => handleHideQuoteModal(e)}
					open={isQuoteView}
					closeIcon={<i className="icon icon-cross2"></i>}
				>
					{isQuoteView && <QuoteModal
						cancelFn={() => { handleHideQuoteModal(); }}
						submitFn={handleHideQuoteModal}
						newProduct={productDetailData}
					/>}
				</Modal>
			)} */}
		</div>
	);
};

export default React.memo(DefaultDescription1);
