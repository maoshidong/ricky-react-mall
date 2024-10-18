import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PageContainer from '~/components/layouts/PageContainer';
import { Row, Col, Button, Spin, Form } from 'antd';
import { CustomInput, AlarmPrompt, PubPageBanner } from '~/components/common';
import { BannerFree } from '~/components/partials';
import ProductRepository from '~/repositories/zqx/ProductRepository';
import BreadCrumb from '~/components/elements/BreadCrumb';
import SearchProductsView from '~/components/ecomerce/minCom/SearchProductsView';
import classNames from 'classnames';
import banStyles from '~/components/common/layout/_PubPageBanner.module.scss';

// import PageTopBanner from '~/components/shared/blocks/banner/PageTopBanner';
import { getProductUrl, uppercaseLetters } from '~/utilities/common-helpers';
import { All_SEO6 } from '~/utilities/constant';
import { getEnvUrl, HELP_SHIPPING_RATES, PRODUCTS } from '~/utilities/sites-url';
import useLanguage from '~/hooks/useLanguage';
import { changeServerSideLanguage } from '~/utilities/easy-helpers';

const left1 = "Browse extensive library of products using our parametric search table to find the exact part to meet your specifications. You will find links on the product pages to check product availability."
// const left2 = "specifications. You will find links on the product pages to check product availability."
const right1 = "Enter part number in the box below to check availability. After submitting the part number, you will be presented. with options to submit a sample request. (Samples are free for qualifying products.)"
// const right2 = "with options to submit a sample request. (Samples are free for qualifying products.)"
const FreeSamplePage = ({ paramMap }) => {
	const { i18Translate } = useLanguage();
	const iFreeSampleTit = i18Translate('i18ResourcePages.FreeSampleTit', "Free Sample Request")
	const iFreeSampleDes = i18Translate('i18ResourcePages.FreeSampleDes', "OriginData offers free samples for ten thousands of its most popular products. We encourage our customers to submit a request, and our customer support team will do its best to fulfill your request.")
	const iHome = i18Translate('i18MenuText.Home', 'Home')
	const iEnterTip = i18Translate('i18ResourcePages.EnterTip', 'Enter Orderable Part Number')
	const iLeftTit = i18Translate('i18ResourcePages.LeftTit', "Looking for the right part?")
	const iLeftDes = i18Translate('i18ResourcePages.LeftDes', left1)
	const iRightTit = i18Translate('i18ResourcePages.RightTit', "Already know what you want?")
	const iRightDes = i18Translate('i18ResourcePages.RightDes', right1)
	const iBrowseProducts = i18Translate('i18FunBtnText.Browse Products', "BROWSE PRODUCTS")
	const iInvalid = i18Translate('i18SmallText.Invalid', "Invalid")
	const iRequired = i18Translate('i18Form.Required', 'Required')
	const iSampleNoQuantityTip = i18Translate('i18ResourcePages.SampleNoQuantityTip', 'Availability: 0 pcs. Sample cannot be requested for this product.')

	const [form] = Form.useForm();

	const breadcrumb = [
		{
			text: iHome,
			url: '/',
		},
		{
			text: iFreeSampleTit,
			url: getEnvUrl(HELP_SHIPPING_RATES)
		}
	];

	const Router = useRouter()
	// const [isShow, setIsShow] = useState('')
	const [keyword, setKeyword] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [resultItems, setResultItems] = useState([]);
	const [isShowErr, setIsShowErr] = useState(false);

	const getContent = (title, cont1, cont2) => {
		return (
			<>
				<h2 className="mb10 pub-left-title">{title}</h2>
				<p className="pd-0 pub-lh20">
					{cont1} <br />
					{cont2}
				</p>
			</>
		)
	}

	const chooseName = (e, item) => {
		e.preventDefault();
		const { manufacturerSlug, name, id, quantity } = item
		// 数量0，不可申请 quantity,    注意：如果数量为1， 但价格为0，事实上是没有数量的, 
		if (quantity === 0) {
			setIsShowErr(true)
			return
		}
		Router.push(`${getProductUrl(manufacturerSlug, name, id)}?showSample=1`)
	}
	const toSearchName = async () => {
		setIsShowErr(false)
		const res = await ProductRepository.apiGetProductListFreeWebEs({
			keyword: keyword.trim(),
			pageListSize: 300,
		});
		setIsLoading(false)
		if (res?.code === 0) {
			setResultItems(res?.data?.data || [])
		}
	}

	const handleOk = async () => {
		if (!keyword || keyword?.length < 3) {
			form.setFields([
				{
					name: 'name',
					errors: [iInvalid]
				},
			]);
			return
		}
	}

	let timerSearch = useRef();
	useEffect(() => {
		if (!keyword || keyword?.length < 3) {
			return
		}
		setIsLoading(true)
		clearTimeout(timerSearch.current);
		timerSearch.current = setTimeout(() => {
			toSearchName();
		}, 300);

		return () => {
			clearTimeout(timerSearch.current);
		};
	}, [keyword])

	const productItemsView = <SearchProductsView resultItems={resultItems} chooseName={chooseName} searcKeyword={keyword} />

	const { freeSampleTit, freeSampleKey, freeSampleDes } = All_SEO6?.freeSample
	const i18Title = i18Translate('i18Seo.freeSample.title', freeSampleTit)
	const i18Key = i18Translate('i18Seo.freeSample.keywords', freeSampleKey)
	const i18Des = i18Translate('i18Seo.freeSample.description', freeSampleDes)

	return (
		<PageContainer paramMap={paramMap}>
			<Head>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />
			</Head>

			<div className={classNames('free-sample-page pub-bgc-f5 custom-antd-btn-more')}>
				<div className={classNames('pub-top-bgc pub-top-bgc-minh260', banStyles.pubTopBgc)} style={{ maxHeight: '450px' }}>
					<img className={classNames(banStyles.pubTopImg)} src='/static/img/bg/freeSampleAll/free-sample.png' alt="banner" />

					<div className='ps-container pub-top-bgc-content pub-flex-between' style={{ overflow: 'visible' }}>
						<div>
							<h1 className='pub-font36 pub-fontw pub-top-bgc-title'>{iFreeSampleTit}</h1>
							<p
								className={classNames(`pub-font16 pub-font50 pub-text-left pub-lh20 w600 `, banStyles.pubTopBgcDes)}
								style={{ maxWidth: '100%', }}
							>
								{iFreeSampleDes}
							</p>
						</div>

						<BannerFree />
					</div>

				</div>

				{/* <PubPageBanner
					bgcImg="free-sample.png"
					title={iFreeSampleTit}
					titleH1={true}
					description={iFreeSampleDes}
				/> */}

				<div className="ps-container ps-input-search-name">
					<BreadCrumb breacrumb={breadcrumb} layout="fullwidth" />
					<Form
						form={form}
						layout="vertical"
						className="mt10 pub-custom-input-suffix custom-antd-btn-more"
						onFinish={handleOk}
					>
						<Row gutter={20} className="mt24">
							<Col xs={24} sm={24} md={24} lg={24} xl={11}>
								<div className="mb20 pub-border15 box-shadow">
									{getContent(iLeftTit, iLeftDes)}
									<div className="pub-flex mt25 mb5">
										<Link href={getEnvUrl(PRODUCTS)}>
											<a>
												<Button type="primary" ghost='true' className='w200 pub-flex-center custom-antd-primary'>
													<p>{iBrowseProducts}</p>
													<div className='ml20 sprite-about-us sprite-about-us-1-3'></div>
												</Button>
											</a>
										</Link>
									</div>
								</div>
							</Col>
							<Col xs={24} sm={24} md={24} lg={24} xl={13}>
								<div className="mb20 pub-border15 box-shadow">
									{getContent(iRightTit, iRightDes)}
									<div className="mt20 mb-10 pub-danger">{isShowErr && iSampleNoQuantityTip}</div>
									<div className="pub-flex">
										<div className="w600 free-sample-part-number">
											<div className='mt15 mb-1 pub-search pub-custom-input-suffix w600'>
												<Form.Item
													name="name"
													className='mb-1'
													rules={[{ required: true, message: <AlarmPrompt text={iRequired} /> }]}
													style={{ position: "relative" }}
												>
													<CustomInput
														// value={keyword}
														onChange={(e) => {
															const value = uppercaseLetters(e.target.value)
															form.setFieldsValue({ name: value })
															setKeyword(value)
														}}
														// onBlur={() => setIsShow(false)}
														// onFocus={() => setIsShow(true)}
														// onChange={e => (partNumChange(e), setIsShow(true))}
														className='form-control w600' // w260
														suffix={<div className='pub-custom-holder'>{iEnterTip}</div>}
													/>
													{/* onClick={handleSearch} */}
												</Form.Item>

												{
													!isLoading && <div className={'pub-search-icon sprite-icons-1-3 '} style={{ top: '10px' }}></div>
												}
												{
													isLoading && <Spin size="middle" style={{ position: 'absolute', right: '10px', top: '9px', zIndex: '1' }} />
												}
											</div>
											{
												(resultItems?.length > 0 && keyword?.length > 2) && (
													<div
														// ${isSearch ? ' active ' : ''}
														className={`ps-panel--search-result-hide`}>
														<div className="w600">{productItemsView}</div>
													</div>
												)
											}
										</div>

									</div>
								</div>
							</Col>
						</Row>
					</Form>
				</div>
			</div>
		</PageContainer>
	)
}

export default FreeSamplePage
export async function getServerSideProps({ req }) {
	const translations = await changeServerSideLanguage(req)
	return {
		props: {
			...translations,
		}
	}
}