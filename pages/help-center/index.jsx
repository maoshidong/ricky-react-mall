import React, { useState } from 'react';
import { Row, Col } from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { nanoid } from 'nanoid';
import PageContainer from '~/components/layouts/PageContainer';
import PageTopBanner from '~/components/shared/blocks/banner/PageTopBanner';
import Tabs from '~/components/partials/page/about-us/Tabs';
import NewsRepository from '~/repositories/zqx/NewsRepository';
import { PUB_RESOURCE_TYPE, All_SEO5 } from '~/utilities/constant';
import { isIncludes } from '~/utilities/common-helpers'
import useLanguage from '~/hooks/useLanguage';
import { getLocale, changeServerSideLanguage } from '~/utilities/easy-helpers';
import { getEnvUrl, HELP_CENTER } from '~/utilities/sites-url';

const HelpSupportPage = ({ paramMap, newsTypeTreeServer }) => {
	const { i18Translate, getZhName, getLanguageHost } = useLanguage();
	const iHelpCenterTit = i18Translate('i18ResourcePages.HelpCenterTit', "Hello! How can we help?")
	const iHelpCenterDes = ''
	// const iHelpCenterDes = i18Translate('i18ResourcePages.HelpCenterDes', "Origin Data Global is dedicated to helping customers find obsolete, end-of-life, hard-to-find parts and commonly used materials.")

	const [resourceTypeTree, setResourceTypeTree] = useState(newsTypeTreeServer?.[0]?.voList || []) // 资源树 
	// const { data } = newsData
	// const [newsAllData, setNewsAllData] = useState(data || {})

	// useEffect(async () => {
	//     const newsData = await NewsRepository.getQueryNewsListdel();
	// }, [])

	const Router = useRouter();
	const schemaSeo = {
		"@context": "https://schema.org/",
		"@graph": [
			{
				"@type": "Webpage",
				"@id": getLanguageHost() + Router.asPath,
				"url": getLanguageHost() + Router.asPath,
				"name": 'Help Center',
			},
			{
				"@type": "News",
				"name": 'Help Center',
			}
		]
	}

	// const clickCurItem = async (e, item) => {
	// }

	const tabsArr = resourceTypeTree?.map(item => {
		return {
			label: getZhName(item),
			value: item?.id.toString(),
		}
	})

	const { helpCenterTit, helpCenterKey, helpCenterDes } = All_SEO5?.helpCenter
	const i18Title = i18Translate('i18Seo.helpCenter.title', helpCenterTit)
	const i18Key = i18Translate('i18Seo.helpCenter.keywords', helpCenterKey)
	const i18Des = i18Translate('i18Seo.helpCenter.description', helpCenterDes)

	return (
		<PageContainer paramMap={paramMap}>
			<Head>
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaSeo) }}></script>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />
				<meta property="og:image" content="https://www.origin-ic.com/static/img/logo.png" />
			</Head>
			<div className='help-support-page pub-bgcdf5 pub-minh-1 pb60 custom-antd-btn-more'>
				<PageTopBanner
					bgcImg="help-center1.jpg"
					title={iHelpCenterTit}
					titleH1={true}
					description={iHelpCenterDes}
					descriptionClass='w500'
				/>

				<Tabs tabsArr={tabsArr} />
				<div className="ps-container ps-page-new">

					{/* <BreadCrumb breacrumb={breadcrumb} layout="fullwidth" /> */}

					{/* <SkeletonProduct  /> */}
					<div className='pub-flex mt25'>
						{/* <div className='catalogs__top-fixed w300'>
                            <MinSearch
                                handleSearch={(e) => handleSearch(e)}
                                isMultipleKeyword={false}
                                searchPlaceholder=''
                            />
                            <div className='mt20'>
                                {
                                    resourceTypeTree?.map(item => {
                                        return (
                                            <LeftNav
                                                leftNavTitle={item?.name}
                                                leftNavList={item?.voList}
												 clickCurItem={clickCurItem}
                                                // leftNavList={resourceTypeTree?.filter(item => item?.voList?.length !== 0)}
                                                // leftNavList={[
                                                //     {name: 'Delivery Information',},
                                                //     {name: 'Place an Order',},
                                                //     {name: 'Products',},
                                                //     {name: 'Orders & Shipping',},
                                                //     {name: 'Tools',},
                                                // ]}
                                            />
                                        )    
                                    })
                                }

                            </div>
                        </div> */}
						<div className='pub-flex-grow pub-border pub-fit-content'>
							{
								resourceTypeTree?.map(i => {
									return (
										<div name={i?.id.toString()} key={nanoid()}>
											{i?.voList?.map(item => {
												return item?.webContentList?.length > 0 && <div key={nanoid()} id={'nav' + item?.id} className='pt-15 pr-20 pl-20 pb-5 child-item'>
													<div className='pub-left-title mb10'>{getZhName(item)}</div>
													<Row gutter={15}>
														{
															item?.webContentList?.map(j => {
																return <Col xs={24} sm={24} md={12} lg={8} xl={8} className='mb10' key={nanoid()}>
																	<Link href={`${getEnvUrl(HELP_CENTER)}/${isIncludes(j?.title)}/${j?.id}`}>
																		<a className='pub-color-hover-link'>{j?.title}</a>
																	</Link>
																</Col>
															})
														}
													</Row>
												</div>
											})
											}
										</div>
									)
								})
							}
						</div>
					</div>
				</div>
			</div>
		</PageContainer>
	);
};

export default HelpSupportPage;

export async function getServerSideProps({ req, query }) {
	const translations = await changeServerSideLanguage(req)
	const { account = "" } = req.cookies
	const serverToken = account.trim() !== "" && JSON.parse(account)?.token
	const type = query?.type;
	const params = {
		parentTypeId: 0,
		// type: PUB_RESOURCE_TYPE.resource, // 资源
		typeList: [PUB_RESOURCE_TYPE.helpCenter],
		languageType: getLocale(req),
	}
	const newsTypeTreeServer = await NewsRepository.apiGetNewsTypeTree(params);

	return {
		props: {
			...translations,
			serverToken,
			selectedNewsType: type || null,
			newsTypeTreeServer: newsTypeTreeServer?.data,
		},
	}
};