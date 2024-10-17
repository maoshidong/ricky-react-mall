import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Button, Checkbox } from 'antd';
import { Flex } from '~/components/common';

import dynamic from 'next/dynamic';
const BreadCrumb = dynamic(() => import('~/components/elements/BreadCrumb'));
const PageContainer = dynamic(() => import('~/components/layouts/PageContainer'));


import MinAddCart from '~/components/ecomerce/minCom/MinAddCart';
import MinTableQuote from '~/components/ecomerce/minCom/MinTableQuote';
import { useRouter } from 'next/router';

import { changeServerSideLanguage, redirect404, getLocale } from '~/utilities/easy-helpers';
import { calculateItemPriceTotal, toFixedFun } from '~/utilities/ecomerce-helpers';
import { decrypt, encrypt, isIncludes } from '~/utilities/common-helpers';
import { PRODUCTS_DETAIL, MANUFACTURER, PRODUCTS, PRODUCTS_CATALOG, PRODUCTS_FILTER, PRODUCTS_COMPARE } from '~/utilities/sites-url'

import { ProductRepository } from '~/repositories';
import MinTableImage from '~/components/ecomerce/minTableCom/MinTableImage';
import FloatButton from '~/components/ecomerce/modules/FloatButtons';
import MinTableAvailability from '~/components/ecomerce/minTableCom/MinTableAvailability';

import { getCurrencyInfo } from '~/repositories/Utils';


import useLanguage from '~/hooks/useLanguage';
import useApi from '~/hooks/useApi';

import classNames from 'classnames';
import styles from './_compare.module.scss';
import stylesTable from '~/scss/module/_quoteForm.module.scss'

import each from 'lodash/each'
import includes from 'lodash/includes'
import map from 'lodash/map'
import uniq from 'lodash/uniq'
import split from 'lodash/split'
import find from 'lodash/find'
import cloneDeep from 'lodash/cloneDeep'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'

// parentId没处理
const ProductsCompare = ({ paramMap, productList, productIds, model }) => {

	const Router = useRouter();
	const { i18Translate, getLanguageName } = useLanguage();
	const iProductIndex = i18Translate('i18MenuText.Product Index', 'Product Index')
	const iCompare = i18Translate('i18AboutProduct.Compare', 'Compare')
	const iProduct = i18Translate('i18AboutProduct.Product information', 'Product information')
	const iAttributes = i18Translate('i18AboutProduct.Attributes information', 'Attributes information')
	const iOrdering = i18Translate('i18AboutProduct.Ordering Information', 'Ordering Information')
	const iRemove = i18Translate('i18MyCart.Remove', 'Remove')
	const iAvailabilityNotTip = i18Translate('i18AboutProduct.AvailabilityNotTip', 'Availability not shown, Contact us')
	const iAvailable = i18Translate('i18PubliceTable.Available', 'Available')

	const currencyInfo = getCurrencyInfo()

	const iProductInfos = {
		select: i18Translate('i18AboutProduct.Select All', 'Select All'),
		image: i18Translate('i18PubliceTable.Image', 'Image'),
		name: i18Translate('i18PubliceTable.Part Number', 'Part Number'),
		origin: i18Translate('i18CompanyInfo.Origin Data', 'Origin Data') + ' #',
		detailMfgName: i18Translate('i18PubliceTable.Manufacturer', 'Manufacturer'),
		description: i18Translate('i18AboutProduct.Description', 'Description'),
		datasheet: i18Translate('i18AboutProduct.Datasheet', 'Datasheet'),
		rohs: i18Translate('i18AboutProduct.RoHS Status', 'RoHS Status'),
	};

	const IOrderInfos = {
		quantity: i18Translate('i18Home.Product Stock', 'Stock'),
		shippingTimeId: i18Translate('i18MyCart.Factory Lead Time', 'Factory Lead Time'),
		pricesList: i18Translate('i18MenuText.Product Index', 'Pricing'),
		purchaseQuantity: i18Translate('i18PubliceTable.Quantity', 'Quantity'),
	};

	const [pList, setPlist] = useState([])
	const [checkList, setCheckList] = useState([])
	const { sendTimeMap, adddressMap } = useApi();

	const divRef = useRef(null);
	const [isShow, setIsShow] = useState(false)
	const [isHover, setIsHover] = useState('')

	const handCompareAdd = async () => {
		// 只有两个产品的时候才添加对比记录
		if (productIds?.length === 2) {
			await ProductRepository.productCompareAdd({
				firstProductId: productIds?.[0],
				lastProductId: productIds?.[1],
			})
			await ProductRepository.productCompareList({
				firstProductId: productIds?.[0],
			})
		}
	}

	useEffect(() => {
		handCompareAdd()
		const handleScroll = (e) => {
			if (divRef.current) {
				// 检查元素的滚动位置
				const distanceToDocumentLeft = e.target.scrollLeft

				if (distanceToDocumentLeft > 0) {
					if (!isShow) {
						setIsShow(true)
					}
				} else {
					setIsShow(false)
				}
			}
		};

		const divElement = divRef.current;

		if (divElement) {
			divElement.addEventListener('scroll', handleScroll);
		}

		return () => {
			setIsShow(false)
			if (divElement) {
				divElement.removeEventListener('scroll', handleScroll);
			}
		};
	}, []);

	useEffect(() => {
		if (productList) {
			const products = computedData(productList)
			setPlist(products)
		}
	}, [productList])

	const getBreadCrumb = (list) => {
		const iHome = i18Translate('i18MenuText.Home', 'Home')
		let classification = ''

		const breadcrumb = [
			{
				text: iHome,
				url: '/',
			},
			{
				text: iProductIndex,
				url: PRODUCTS
			}
		];

		let filterUrl = PRODUCTS_FILTER;
		let url = PRODUCTS_CATALOG;
		list?.forEach((item, index) => {
			if (index === 0) {
				classification = getLanguageName(item)
			}
			url = PRODUCTS_CATALOG + '/' + isIncludes(item?.slug);
			filterUrl = PRODUCTS_FILTER + '/' + isIncludes(item?.slug);
			breadcrumb.push({
				text: getLanguageName(item),
				// url: url + '/' + item.id,
				url: ((list?.length - 1) === index ? filterUrl : url) + '/' + item.id,
			})
		})
		breadcrumb.push({
			text: iCompare,
		})
		return [breadcrumb, classification];
	}


	const computedData = (plist) => {
		const inofs = {}
		each(iProductInfos, (v, k) => {
			inofs[v] = []
			each(plist, pl => {
				if (k === 'name') {
					inofs[v].push('name___' + pl?.[k] + '___' + pl?.id)
				} else if (k === 'select') {
					inofs[v].push('select___' + pl?.id)
				} else if (k === 'origin') {
					inofs[v].push(pl?.id + '-' + pl?.name)
				} else if (k === 'rohs') {
					inofs[v].push('rohs___' + pl?.[k])
				} else if (k === 'image') {
					inofs[v].push('image___' + pl?.id)
				} else if (k === 'detailMfgName') {
					// 拼接detailMfgName___供应商短语___供应商id___供应商名称 pl?.manufacturer?.parentId || 
					inofs[v].push('detailMfgName___' + pl?.manufacturerSlug + '___' + pl?.manufacturer?.id + '___' + pl?.manufacturer?.name + '___' + pl?.manufacturer?.slugStatus)
				} else if (k === 'datasheet') {
					inofs[v].push('datasheet___' + pl?.[k])
				} else {
					inofs[v].push(pl?.[k])
				}
			})
		})

		const attributeTypes = [];
		// 收集所有属性类型
		each(plist, item => {
			each(item?.attributeList || [], attr => {
				attributeTypes.push(attr.type);
			});
		});

		// 使用 Set 去重
		const uniqueTypes = uniq(attributeTypes);
		// 去掉值为 'Manufacturer' 的元素
		uniqueTypes = uniqueTypes.filter(type => type !== 'Manufacturer');

		const specInfo = {};

		// 初始化每个属性类型的属性值列表
		each(uniqueTypes, type => {
			specInfo[type] = [];
		});

		// 填充属性值列表
		each(plist, item => {
			each(uniqueTypes, type => {
				const matchingAttr = item?.attributeList.find(attr => attr.type === type);
				if (matchingAttr) {
					specInfo[type].push(matchingAttr.attrValue);
				} else {
					specInfo[type].push('-');
				}
			});
		});

		const orders = {}

		each(IOrderInfos, (v, k) => {
			orders[v] = []
			each(plist, pl => {
				if (k === 'shippingTimeId') {
					// const sendTime = pl?.[k] ? sendTimeMap[pl?.[k]] : iImmediately //发货时间
					orders[v].push('shippingTimeId____' + pl.id)
				} else if (k === 'purchaseQuantity') {
					orders[v].push('purchaseQuantity___' + pl.id)
				} else if (k === 'pricesList') {
					orders[v].push('pricesList___' + pl.id)
				} else if (k === 'quantity') {
					const qt = pl[k]
					const info = qt > 0 ? qt + ' ' + iAvailable : iAvailabilityNotTip
					orders[v].push(info)
				} else {
					orders[v].push(pl[k])
				}

			})
		})

		const prods = [
			{
				type: iProduct,
				values: inofs
			},
			{
				type: iAttributes,
				values: specInfo
			},
			{
				type: iOrdering,
				values: orders
			}
		]

		return prods
	};

	// 选中的数据
	const handleSelectChange = (type, id) => {
		let checks = [];

		if (type === 'all') {
			if (checkList?.length !== productIds.length) {
				checks = productIds;
			} else {
				checks = [];
			}
		} else if (type === 'id') {
			const findId = find(checkList, cl => cl === id);
			if (findId) {
				checks = prevCheckList => prevCheckList.filter(el => el !== id);
			} else {
				checks = prevCheckList => [id, ...prevCheckList];
			}
		}

		setCheckList(checks);
	}

	// 刪除对比商品
	const handleDeleteClick = () => {
		const pIds = cloneDeep(productIds)
		const bList = new Set(checkList)
		const _pl = filter(pIds, pi => !bList.has(pi));

		if (_pl?.length > 0) {
			const pros = encrypt(_pl.join(','));
			Router.replace(PRODUCTS_COMPARE + `/${pros}`);
		} else {
			Router.push('/')
		}
		setCheckList([])
	}

	const breacrumbs = productList?.[0]?.catalogsList || []
	const [breadcrumb, classification] = getBreadCrumb(breacrumbs);
	console.log(classification)
	const titleSeo = iCompare + ` | ${process.env.title}`
	const i18Title = i18Translate('i18Seo.Compare.title', titleSeo, { model: model.join(' vs ') })
	const i18Key = i18Translate('i18Seo.Compare.keywords', "", { model: model.join(', '), classification: `${classification}, ` })
	const i18Des = i18Translate('i18Seo.Compare.description', "", { model: model.join(', ') })

	return (
		<PageContainer paramMap={paramMap}>
			<Head>
				<title>{i18Title}</title>
				<meta property="title" content={iCompare} key="og:title" />
				<meta property="og:title" content={iCompare} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />
			</Head>
			<Flex flex column gap={20} className={styles.compareContainer}>
				{breacrumbs?.length > 0 && <div className={styles.breadcrumbs}>
					<BreadCrumb breacrumb={breadcrumb} />
				</div>
				}

				<h1 className={styles.titleDes}>{iCompare + ": "}
					{map(model, (ml, index) => {
						return (
							<span key={ml}>
								{ml}
								{index !== model.length - 1 && <em> vs </em>}
							</span>
						);
					})}
				</h1>

				<div ref={divRef} id='compare-container' className={classNames("table-responsive", styles.compareTable)}>
					{productList?.length > 0 && !isEmpty(pList) && (
						<table id='compare-table' className="table ps-table pub-border ps-table--specification">
							{map(pList, (pt, ptIndex) => (
								<React.Fragment key={`pList-${ptIndex}`}>
									<thead key={`thead-${ptIndex}`}>
										<tr className="table-product-th">
											<th className={styles.stickyFirstTheadTh}>{pt?.type}</th>
											{map(productList, pt => {
												return <th key={pt.id} style={{ background: '#E3E4E6' }} />
											})}
										</tr>
									</thead>
									<tbody key={`tbody-${ptIndex}`}>
										{map(pt.values, (v, key) => {
											const isSelect = find(v, ss => includes(ss, 'select___'));
											const kye = `row-${ptIndex}-${key}`
											return (
												<tr key={kye} className={styles.trClass} onMouseEnter={() => setIsHover(kye)} onMouseLeave={() => setIsHover('')}>
													{isSelect ? (
														<td className={classNames(styles.title, styles.stickyFirstColumn, isShow && styles.compareShow, isHover === kye && isShow && styles.compareStikyHover)} onClick={() => handleSelectChange('all')}>{key + ':'}
															<Checkbox
																checked={checkList?.length === productIds?.length}
																style={{ marginLeft: '8px' }}
															/>
														</td>
													) : (
														<td className={classNames(styles.title, styles.stickyFirstColumn, isShow && styles.compareShow, isHover === kye && isShow && styles.compareStikyHover)}>{key + ':'}</td>
													)}

													{map(v, (item, index) => {
														// 产品名称
														if (includes(item, 'name___')) {
															const nStr = split(item, '___');
															const name = nStr?.[1]
															const id = nStr?.[2]
															return <td key={`name-${index}`}>
																<Flex justifyCenter>
																	<Link href={`${PRODUCTS_DETAIL}/${isIncludes(name)}/${id}`}>
																		<a target='_blank' className={styles.part}>{name}</a>
																	</Link>
																</Flex>
															</td>
														}
														// 图片
														if (includes(item, 'image___')) {
															const id = split(item, '___')?.[1];
															const record = filter(productList, plt => plt.id === +id)?.[0] || {};
															return (
																<td key={`image-${index}`}>
																	<Flex flex justifyCenter>
																		<MinTableImage record={record} />
																	</Flex>
																</td>
															);
														}

														// select
														if (includes(item, 'select___')) {
															const id = split(item, '___')?.[1];
															return (
																<td key={`select-${index}`} onClick={() => handleSelectChange('id', id)}>
																	<Flex justifyCenter>
																		<Checkbox
																			checked={includes(checkList, id)}
																		/>
																	</Flex>
																</td>
															);
														}

														// 制造商
														if (includes(item, 'detailMfgName___')) {
															const mfg = split(item, '___');
															return <td key={`detailMfgName-${index}`}>
																<Flex justifyCenter>
																	{+mfg?.[4] === 1 ? <Link href={`${MANUFACTURER}/${isIncludes(mfg?.[1])}`}>
																		<a target='_blank' className={styles.part} style={{ fontSize: '13px' }}>{mfg?.[3]}</a>
																	</Link> : mfg?.[3]
																	}
																</Flex>
															</td>
														}

														// datasheet
														if (includes(item, 'datasheet___')) {
															const dSheet = split(item, 'datasheet___')?.[1];
															return (
																<td key={`pdf-${index}`}>
																	<Flex flex justifyCenter>
																		{dSheet ?
																			<div
																				onClick={() => window.open(dSheet, '_blank')}
																				className='sprite-icon4-cart sprite-icon4-cart-2-1 pub-cursor-pointer'
																			/> : '-'}
																	</Flex>
																</td>
															);
														}

														// rohs
														if (includes(item, 'rohs___')) {
															return (
																<td key={`rohs-${index}`}>
																	<Flex flex alignCenter justifyCenter>
																		<div className='sprite-icon4-cart sprite-icon4-cart-2-2' />
																		RoHS Compliant
																	</Flex>
																</td>
															);
														}

														if (includes(item, 'pricesList___')) {
															const id = split(item, 'pricesList___')?.[1];
															const prices = find(productList, pl => pl.id === +id)?.pricesList || []

															return (
																<td key={`pricesList-${index}`}>
																	{prices?.length > 0 ? (
																		<table key={`pricestable-${index}`} className={stylesTable.quoteTable}>
																			<thead key={`pricestable-thead-${index}`}>
																				<tr key={`pricestable-thead-tr-${index}`}>
																					<th style={{
																						width: '100px', fontWeight: '600',
																						padding: '8px',
																						color: '#555'
																					}}>{i18Translate('i18PubliceTable.QTY', 'QTY')}</th>
																					<th style={{ width: '100px', padding: '8px' }}>{i18Translate('i18PubliceTable.UnitPrice', 'UNIT PRICE')}</th>
																					<th className='ps-table-pub-text-right' style={{ width: '100px', padding: '8px' }}>{i18Translate('i18PubliceTable.ExtPrice', 'EXT PRICE')}</th>
																				</tr>
																			</thead>
																			<tbody key={`pricestable-tbody-${index}`}>
																				{prices.map((it, idx) => (
																					<tr key={it.id || idx}>
																						<td style={{ width: '100px', borderRight: 0 }}>{it?.quantity}+</td>
																						<td style={{ width: '100px', borderRight: 0 }}>{currencyInfo.label}{toFixedFun(it?.unitPrice, 4)}</td>
																						<td style={{ width: '100px', borderRight: 0 }} className='ps-table-pub-text-right'>
																							{currencyInfo.label}{toFixedFun(calculateItemPriceTotal({
																								voList: prices,
																								cartQuantity: it?.quantity
																							}), 2)}
																						</td>
																					</tr>
																				))}
																			</tbody>
																		</table>
																	) : (
																		<Flex justifyCenter>-</Flex>
																	)}
																</td>
															)
														}

														if (includes(item, 'purchaseQuantity___')) {
															const id = split(item, 'purchaseQuantity___')?.[1];
															let record = find(productList, pl => pl.id === +id)
															const _quote = !(record?.pricesList?.length > 0)
															if (record) {
																record.isQuote = _quote
																record.id = +id
																record.productId = +id
																record.manufacturerName = record?.manufacturer?.name || ''
															}
															return <td key={`purchaseQuantity-${index}`}>
																<Flex justifyCenter row>
																	{
																		!_quote && (
																			<MinAddCart layout='inline' isSuffix={false} record={record} />
																		)
																	}
																	{
																		(_quote) && (
																			<MinTableQuote layout='inline' isSuffix={false} record={record} />
																		)
																	}
																</Flex>
															</td>
														}

														if (includes(item, 'shippingTimeId____')) {
															const id = split(item, 'shippingTimeId____')?.[1];
															const record = find(productList, pl => pl.id === +id)
															return <td key={`shippingTimeId-${index}`}> <Flex justifyCenter><MinTableAvailability sendTimeMap={sendTimeMap} adddressMap={adddressMap} record={record} isShowQuantity={false} /></Flex></td>
														}

														return <td key={`item-${index}`} className={styles.pContent}><Flex justifyCenter wrap>{item}</Flex></td>;
													})}
												</tr>
											);
										})}
									</tbody>
								</React.Fragment>
							))}
						</table>
					)}
				</div>

				<FloatButton isShow={checkList?.length > 0}>
					<Button className='ant-btn ant-btn-primary ant-btn-background-ghost login-page-login-btn ps-add-cart-footer-btn' disabled={checkList?.length === 0} onClick={handleDeleteClick}>{iRemove}</Button>
				</FloatButton>
			</Flex>
		</PageContainer>
	);
};

export default ProductsCompare;

export async function getServerSideProps({ req, params }) {
	const translations = await changeServerSideLanguage(req)
	const languageType = getLocale(req);
	const { slugs } = params || {}
	const product_ids = slugs?.[0]
	let pIds = []

	if (product_ids) {
		const prodId = decrypt(product_ids)
		if (prodId) {
			pIds = prodId.split(',')
		} else {
			return redirect404()
		}
	}
	// if (catalogId === '844') {
	// 	return {
	// 		redirect: {
	// 			destination: keyword ? `${PRODUCTS_UNCLASSIFIED}?keyword=${keyword}` : PRODUCTS_UNCLASSIFIED,
	// 			permanent: true,
	// 		}
	// 	}
	// }

	let newProduct = []
	let model = []
	if (pIds?.length > 0) {
		newProduct = await ProductRepository.getProductsInfoByIds(pIds, languageType)
		model = map(newProduct || [], npt => npt?.name)
	}

	return {
		props: {
			...translations,
			productList: newProduct,
			productIds: pIds,
			model: model || []
		}
	}
}
