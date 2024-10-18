import React, { useContext } from 'react';
import last from 'lodash/last';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import useLanguage from '~/hooks/useLanguage';
import { ProductsDetailContext } from '~/utilities/shopCartContext';
import { isIncludes } from '~/utilities/common-helpers';
import { getEnvUrl, SERIES_PRODUCT_NUMBER, MANUFACTURER, PRODUCTS_CATALOG, PRODUCTS_FILTER } from '~/utilities/sites-url';
import { Flex } from '~/components/common';

const PartialSpecificationCom = ({ attributeList, manufacturer, catalogsList }) => {
	const { i18Translate } = useLanguage();
	const iSeriesProductNumber = i18Translate('i18MenuText.Series Product Number', 'Series Product Number');

	const { productDetailData } = useContext(ProductsDetailContext);
	const { seriesAdmin } = productDetailData || {};
	let newList = !!attributeList ? [...attributeList] : [];

	if (!attributeList) {
		return null;
	}

	if (seriesAdmin?.id && newList?.length >= 0) {
		newList?.push({
			type: iSeriesProductNumber,
			attrValue: seriesAdmin?.seriesName?.toUpperCase(),
			isSeries: true,
		});
	}

	const manufacturers = [];
	const series = [];
	const remainingObjects = newList.filter((item) => {
		if (item.type === 'Manufacturer') {
			manufacturers.push(item);
			return false;
		} else if (item.type === 'Series') {
			series.push(item);
			return false;
		}
		return true;
	});

	const prioritizedList = [{ type: 'Category', attrValue: catalogsList }, ...manufacturers, ...series, ...remainingObjects];

	// const categories = [{ type: 'Category', attrValue: catalogsList }];
	// const manufacturers = newList.filter((item) => item.type === 'Manufacturer');
	// const series = newList.filter((item) => item.type === 'Series');
	// const prioritizedList = [...categories, ...manufacturers, ...series];
	// const remainingObjects = newList.filter((item) => item.type !== 'Manufacturer' && item.type !== 'Series');
	// prioritizedList.push(...remainingObjects);

	// 显示属性描述
	const renderDes = (item) => {
		switch (item?.type) {
			// 分类
			case 'Category':
				return (
					<Flex column>
						{catalogsList.map((cl, index) => {
							const url = `${PRODUCTS_CATALOG}/${isIncludes(cl?.slug)}/${cl?.id}`;
							const pageUrl = `${PRODUCTS_FILTER}/${isIncludes(cl?.slug)}/${cl?.id}`;
							const hrefUrl = index === catalogsList.length - 1 ? pageUrl : url;
							return (
								<div key={cl.id}>
									<Link href={hrefUrl}>
										<a className="pub-color-link" style={{ width: 'max-content' }}>
											{cl.name}
										</a>
									</Link>
								</div>
							);
						})}
					</Flex>
				);
			// 供应商
			case 'Manufacturer':
				return (
					manufacturer?.slugStatus === 1 ? <Link href={`${MANUFACTURER}/${isIncludes(manufacturer.slug)}`}>
						<a className="pub-color-link">{item.attrValue}</a>
					</Link> : item.attrValue
				);
			case 'Series':
				const lastCatalog = last(catalogsList);
				const _href = `${PRODUCTS_FILTER}/${isIncludes(lastCatalog?.slug)}/${lastCatalog?.id}?attrList=${item.productAttributeId}`;
				return (
					<Link href={_href}>
						<a className="pub-color-link">{item.attrValue}</a>
					</Link>
				);
			default:
				return item?.attrValue;
		}
	};
	// const renderDes = (item) => {
	// 	switch (item?.type) {
	// 		case 'Category':
	// 			return (
	// 				<Flex column>
	// 					{map(catalogsList, (cl, index) => {
	// 						const url = `${PRODUCTS_CATALOG}/${cl?.slug}`;
	// 						const pageUrl = `${PRODUCTS_FILTER}/${cl?.slug}`;
	// 						const hrefUrl = (catalogsList.length - 1 === index ? pageUrl : url) + `/${cl.id}`;
	// 						return (
	// 							<div key={cl.id}>
	// 								<Link href={hrefUrl}>
	// 									<a className="pub-color-link" style={{ width: 'max-content' }}>
	// 										{cl.name}
	// 									</a>
	// 								</Link>
	// 							</div>
	// 						);
	// 					})}
	// 				</Flex>
	// 			);
	// 		case 'Manufacturer':
	// 			return (
	// 				<Link href={`${MANUFACTURER}/${manufacturer.slug}`}>
	// 					<a className="pub-color-link">{item.attrValue}</a>
	// 				</Link>
	// 			);
	// 		case 'Series':
	// 			const catal = last(catalogsList);
	// 			const _href = `${PRODUCTS_FILTER}/${catal?.slug}/${catal.id}?attrList=${item.productAttributeId}`;
	// 			return (
	// 				<Link href={_href}>
	// 					<a className="pub-color-link">{item.attrValue}</a>
	// 				</Link>
	// 			);
	// 		default:
	// 			return item?.attrValue;
	// 	}
	// };
	// i18Translate('i18PubliceTable.Manufacturer', 'Manufacturer'),  i18Translate('i18CatalogHomePage.Categories', 'Category')
	return (
		prioritizedList && (
			<div className="table-responsive">
				<table className="table ps-table ps-table--specification" style={{ border: 'none', marginBottom: 0 }}>
					<thead>
						<tr className="table-product-th">
							<th>{i18Translate('i18AboutProduct.Type', 'TYPE')}</th>
							<th>{i18Translate('i18AboutProduct.Description', 'DESCRIPTION')}</th>
						</tr>
					</thead>
					<tbody>
						{prioritizedList?.map(
							(item) =>
								// 隐藏供应商、Packaging
								item?.type !== 'Packaging' &&
								item?.type && (
									<tr key={nanoid()} style={{ cursor: 'auto' }}>
										<td className="ellipsis">
											{item?.type === 'Category' && i18Translate('i18CatalogHomePage.Categories', 'Category')}
											{item?.type === 'Manufacturer' && i18Translate('i18PubliceTable.Manufacturer', 'Manufacturer')}
											{item?.type !== 'Category' && item?.type !== 'Manufacturer' && item?.type}
										</td>
										{!item?.isSeries && <td>{renderDes(item)}</td>}
										{item?.isSeries && (
											<td>
												<Link href={`${getEnvUrl(SERIES_PRODUCT_NUMBER)}/${isIncludes(seriesAdmin?.seriesName?.toUpperCase())}/${seriesAdmin?.id}`}>
													<a className="pub-color-link">{item?.attrValue}</a>
												</Link>
											</td>
										)}
									</tr>
								)
						)}
					</tbody>
				</table>
			</div>
		)
	);
};


export default React.memo(PartialSpecificationCom);
