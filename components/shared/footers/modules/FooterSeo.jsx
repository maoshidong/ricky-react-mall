import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { isIncludes } from '~/utilities/common-helpers';
import {
	getEnvUrl, SERIES_PRODUCT_NUMBER, PRODUCTS_LIST,
	PRODUCTS_CATALOG, PRODUCTS_FILTER
} from '~/utilities/sites-url'
import { helpersAn, helpersO9 } from '~/utilities/common-helpers'
import { I18NEXT_LOCALE, I18NEXT_DOMAINS } from '~/utilities/constant'
import { AllCatalogTree } from '~/utilities/AllCatalogTree'
import useLanguage from '~/hooks/useLanguage';

// 记得把class改为className
// import CatalogStaticLink from '~/components/shared/footers/modules/CatalogStaticLink'
// import StaticLink from '~/components/shared/footers/modules/StaticLink'
// import dynamic from 'next/dynamic'
// const CatalogStaticLink = dynamic(() => import('/components/shared/footers/modules/CatalogStaticLink'));
// const StaticLink = dynamic(() => import('/components/shared/footers/modules/StaticLink'));
// const MemoizedCatalogsCom = dynamic(() => import('/components/elements/seo/MemoizedCatalogs'));
import styles from "scss/module/_minPage.module.scss";

const LongTailWord = "electronic parts, electronic components, electronics parts, electronics supply, electronics components, electronics supplies, electronics supply store, electronic supply store, electronic supplies, electronic component suppliers, electronic suppliers, electronic components distribution, electronic gadgets online, electronic engineering services, electronic product design, electronic circuit design, electronic parts store, electronic component suppliers, electronic hobby kits, electronic instrument calibration, electronic prototyping services, electronic assembly services, electronic component sourcing, electronic accessories wholesale, electronic project kits, electronic component manufacturing, electronic components wholesale, electronic design automation, electronic component packaging, Electronic parts catalog"
// 底部seo
const FooterSeo = () => {
	const { i18Translate, getZhName } = useLanguage();
	const iAsia = i18Translate('i18Other.Asia', "Asia")
	const iAustralia = i18Translate('i18Other.Australia', "Australia")
	const iEurope = i18Translate('i18Other.Europe', "Europe")
	const iMiddleEast = i18Translate('i18Other.Middle East', "Middle East")
	const iNorthAmerica = i18Translate('i18Other.North America', "North America")
	const iSouthAmerica = i18Translate('i18Other.South America', "South America")
	// console.time("mapTime"); // 开始计时   console.timeEnd("mapTime"); // 结束计时并打印时间差

	// 子元素数量最大值 DOM 规模过大
	const productList = useMemo(() => {
		const productLists = helpersAn();
		return (
			<div>
				{/* <a href={PRODUCTS_LIST} title="Part Number" target="_blank">Electronic Parts Index</a> */}
				{productLists?.map(item => {
					return <a key={'c' + item} href={PRODUCTS_LIST + `/${item}`} title={"Part Number Start with " + item} target="_blank">{item}</a>
				})}
			</div>
		)
	}, [helpersAn()]);
	const productList2 = useMemo(() => {
		const productLists = helpersO9();
		return (
			<div>
				{productLists?.map(item => {
					return <a key={'b' + item} href={PRODUCTS_LIST + `/${item}`} title={"Part Number Start with " + item} target="_blank">{item}</a>
				})}
			</div>
		)
	}, [helpersO9()]);
	// preload 优先级较高，提前加载较晚出现，但对当前页面非常重要的资源
	// prefetch 优先级较低，提前加载后继路由需要的资源。一般用以加载其它路由资源，
	// 按分类爬虫，每个分类链接都有顶级分类名 - DOM 规模过大 
	const memoizedCatalogs = (voList) => {
		let arr = voList?.map(subItem => {
			return (
				<div key={'a' + subItem?.id}>
					<a
						href={
							subItem?.voList?.length ?
								`${getEnvUrl(PRODUCTS_CATALOG)}/${isIncludes(subItem?.slug)}/${subItem?.id}`
								:
								`${getEnvUrl(PRODUCTS_FILTER)}/${isIncludes(subItem?.slug)}/${subItem?.id}`
						}
					>{subItem.name}</a>
					{/* <MemoizedCatalogsCom
	                href={
	                    subItem?.voList?.length ?
	                    `${getEnvUrl(PRODUCTS_CATALOG)}/${(subItem?.slug)}/${subItem?.id}`
	                    :
	                    `${getEnvUrl(PRODUCTS_FILTER)}/${isIncludes(subItem?.slug)}/${subItem?.id}`
	                }
	                item={subItem}
	            /> */}
					{memoizedCatalogs(subItem.voList)}
				</div>
			);
		});

		return arr;
	};

	// 使用useMemo缓存静态组件的内容，所有分类url链接
	// const staticCatalogContent = useMemo(() => {
	// 	return <CatalogStaticLink />
	// }, []);

	// const staticContent = useMemo(() => {
	// 	return <StaticLink />
	// }, []);

	return (
		// <div>
		// 	{productList}
		// 	{productList2}

		<div className='pub-seo-visibility1'>
			{/* textIndent: '-9999px', 隐藏可爬虫aria-hidden="true"  */}
			<a href={SERIES_PRODUCT_NUMBER} aria-hidden="true">{LongTailWord}</a>
			{/* {staticCatalogContent}
			{staticContent} */}
			{productList}
			{productList2}
			<div>
				{memoizedCatalogs(AllCatalogTree?.slice(0, 25))}
			</div>
			<div>
				{memoizedCatalogs(AllCatalogTree?.slice(25, 52))}
			</div>


			<div className={styles['language-box']}>
				{
					I18NEXT_DOMAINS?.map((item, index) => {
						return <div key={item?.domain}>
							{
								index === 0 && <span className='pub-fontw mb10'>{iAsia}</span>
							}
							{
								index === 10 && <span className='pub-fontw mb10'>{iAustralia}</span>
							}
							{
								index === 12 && <span className='pub-fontw mb10'>{iEurope}</span>
							}
							{
								index === 39 && <span className='pub-fontw mb10'>{iMiddleEast}</span>
							}
							{
								index === 1 && <span className='pub-fontw mb10'>{iNorthAmerica}</span>
							}
							{
								index === 43 && <span className='pub-fontw mb10'>{iSouthAmerica}</span>
							}
							<a
								href={`https://${item.domain}`}
								data-code={item?.code.toUpperCase()}
								className='language-item pub-flex-align-center pub-color-hover-link mb10'
								rel={item?.defaultLocale === I18NEXT_LOCALE.zh ? 'nofollow' : null}
							>
								<div className={'mr10 sprite-language ' + item?.class}></div>
								<p>{getZhName(item)}</p>
							</a>
						</div>
					})
				}
			</div>
		</div>

	)
}

export default connect((state) => state)(FooterSeo);
