import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { Form, Input, Row, Col, Spin } from 'antd';
import { CustomInput, AlarmPrompt } from '~/components/common';
import Router from 'next/router';
import PageContainer from '~/components/layouts/PageContainer';
import MinLoginTip from '~/components/ecomerce/minCom/MinLoginTip';
import QuantityNumber from '~/components/ecomerce/formCom/QuantityNumber';
import SearchNoData from '~/components/ecomerce/minCom/SearchNoData';
import PageTopBanner from '~/components/shared/blocks/banner/PageTopBanner';
import { getEnvUrl, ACCOUNT_SHOPPING_CART, ACCOUNT_QUOTE } from '~/utilities/sites-url';

import useEcomerce from '~/hooks/useEcomerce';
import useLanguage from '~/hooks/useLanguage';
import { ProductRepository } from '~/repositories';
import { changeServerSideLanguage } from '~/utilities/easy-helpers';
import { uppercaseLetters } from '~/utilities/common-helpers'

const tipText = "to save this list for future use and access all of the Quick Order features"
const tipText1 = "This product is not available! Can be added to RFQ and sent to us to check availability. Thanks"

// 快速订单，还需补充
const QuickOrderPage = ({ paramMap }) => {
	const { i18Translate } = useLanguage();
	const iQuickOrderTit = i18Translate('i18ResourcePages.QuickOrderTit', "Quick Order")
	const iQuickOrderDes = i18Translate('i18ResourcePages.QuickOrderDes', "Ships in 1 business day.")
	const iQuickOrderLogTip = i18Translate('i18ResourcePages.QuickOrderLogTip', tipText)
	const iNotAvailableTip = i18Translate('i18ResourcePages.NotAvailableTip', tipText1)
	const iSearchFound = i18Translate('i18ResourcePages.Search Found', "Search Found")
	const iInvalid = i18Translate('i18SmallText.Invalid', "Invalid")
	const iRequired = i18Translate('i18Form.Required', 'Required')
	// QuickOrderTit QuickOrderDes NotAvailableTip QuickOrderLogTip

	const [form] = Form.useForm();
	const [isLoading, setIsLoading] = useState(false);
	const [isShow, setIsShow] = useState(false);
	const [resultItems, setResultItems] = useState([]);

	const [keyword, setKeyword] = useState('');
	const [curId, setCurId] = useState('');
	const [curItem, setCurItem] = useState({ price: 1 });

	const { saveAddToRfq, useAddMoreCart } = useEcomerce();
	const [isFormComplete, setIsFormComplete] = useState(false); // 检查按钮是否可点

	const handleFormChange = (changedValues, allValues) => {
		// 在表单值发生变化时执行的回调函数
		const isComplete = Object.keys(allValues).every((key) => {
			const fieldValue = allValues[key];
			// 根据实际情况修改字段的判断条件
			return fieldValue !== undefined && fieldValue !== '';
		});

		setIsFormComplete(isComplete);
	};

	const handleOk = async (fieldsValues) => {
		setIsShow(false)
		if (!curId) {
			form.setFields([
				{
					name: 'name',
					errors: [iInvalid]
				},
			]);

			return
		}
		// 没价格, 没数量
		if (Number(curItem?.price) === 0 || Number(curItem?.quantity === 0)) {
			// 保存quote页面的数据
			const params = {
				PartNumber: keyword,
				Manufacturer: curItem?.manufacturerName,
				Quantity: fieldsValues?.quantity,
			}
			saveAddToRfq(params)
			Router.push(getEnvUrl(ACCOUNT_QUOTE))
			return
		}

		// 有价格
		const params = [
			{
				productId: curId, quantity: fieldsValues?.quantity,
			}
		]

		useAddMoreCart(
			params,
			{ cartNo: 0 }
		);
		Router.push(getEnvUrl(ACCOUNT_SHOPPING_CART))
	}

	const toSearchName = async () => {
		// const res = await ProductRepository.apiSearchProductByEs({
		const res = await ProductRepository.apiGetProductListFreeWebEs({
			keyword: keyword.trim(),
			pageListSize: 200,
		});
		setIsLoading(false)
		if (res?.code === 0) {
			// const { data } = res?.data?.searchVos || {}
			setResultItems(res?.data?.data || [])
			res?.data?.data?.map(i => {
				// 找相同的，自动赋予id
				if (i?.name == keyword) {
					setCurId(i?.id)
				}
			})

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

	const chooseName = item => {
		setIsShow(false)
		setCurId(item?.id)
		setKeyword(item?.name)
		setCurItem(item)
		setIsShow(false)
	}

	useEffect(() => {
		form.setFieldsValue({
			name: keyword
		});
	}, [keyword])

	// width: 200px;
	// overflow: hidden;
	// text-overflow: ellipsis;
	// -webkit-line-clamp: 2;
	// display: inline-block;
	// style={{flex: 1}}
	// search__highlight

	const iPartNumber = i18Translate('i18PubliceTable.PartNumber', 'Part Number')
	const iManufacturer = i18Translate('i18PubliceTable.Manufacturer', 'Manufacturer')
	const iAvailability = i18Translate('i18PubliceTable.Availability', 'Availability')

	let productItemsView =
		<div className={resultItems?.length !== 1 ? 'pb-5' : ''}>
			<div className='search-found pl-10'>{iSearchFound}</div>
			<div className='pub-custom-table-head1 pub-flex-align-center'>
				<div className='w300'>{iPartNumber}</div>
				<div className='w260'>{iManufacturer}</div>
				<div className='w80'>{iAvailability}</div>
			</div>

			<div className='search-contont-overflow'>
				{resultItems?.map((item) => {
					const boldResults = item.name.replace(new RegExp(keyword, 'gi'), match => `<strong style="color: #FF6B01">${match}</strong>`);
					return <div key={item?.id}>
						<div className="ps-product ps-product--search-result">
							<div className="ps-product__sub pl-15">
								<div className="ps-product__title" onClick={() => chooseName(item)}
								// style={{
								//     display: 'grid',
								//     gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
								//     gridGap: '10px',
								//     justifyContent: 'space-between',
								// }}
								>
									<div className='w300' dangerouslySetInnerHTML={{ __html: boldResults }} />
									<div className='w260 pub-line-clamp1'>{item?.manufacturerName}</div>
									<div className='w80'>{item?.quantity}</div>
								</div>
							</div>
						</div>
					</div>
				})}
				{
					resultItems?.length === 0 && (
						<SearchNoData type={2} />
					)
				}
			</div>
		</div>

	const titleSeo = `Quick Order | ${process.env.title}`

	const i18Title = i18Translate('i18Seo.quickOrder.title', titleSeo)
	const i18Key = i18Translate('i18Seo.quickOrder.keywords', "")
	const i18Des = i18Translate('i18Seo.quickOrder.description', "")
	return (
		<PageContainer paramMap={paramMap}>
			<Head>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />
			</Head>
			<div className='pub-bgc-f5 pub-minh-1'>
				<PageTopBanner
					bgcImg="quickOrder.jpg"
					title={iQuickOrderTit}
					titleH1={true}
					description={iQuickOrderDes}
					contentStyle={{ overflow: 'hidden' }}
					otherDescriptionClass={'pub-font24 pub-color555 pub-fontw'}
				/>

				<div className='ps-container'>
					<MinLoginTip tipText={iQuickOrderLogTip} />
					<div className='mt20 pub-border20 box-shadow'>
						<Form
							form={form}
							onValuesChange={handleFormChange}
							layout="vertical"
							className="mt10 pub-custom-input-suffix custom-antd-btn-more"
							onFinish={handleOk}
						>
							<Row gutter={20} className='mb5'>
								<Col className='ps-input-search-name' style={{ position: 'relative' }}>
									<Form.Item
										name="name"
										className='mb-1'
										rules={[{ required: true, message: <AlarmPrompt text={iRequired} /> }]}
										style={{ position: "relative" }}
									>
										<CustomInput
											className="form-control w700 quick-order-part-number"
											type="text"
											value={keyword}
											onChange={(e) => (setCurId(''), setKeyword(uppercaseLetters(e.target.value)))}
											// onBlur={() => setIsShow(false)}
											onFocus={() => setIsShow(true)}

											autoComplete="new-password"
											suffix={<div className='pub-custom-holder pub-input-required'>{iPartNumber}</div>}
										/>
										{
											isLoading && <Spin size="middle" style={{ position: 'absolute', right: '10px', top: '9px', zIndex: '1' }} />
										}

									</Form.Item>

									{
										(isShow && keyword?.length > 2) && (
											<div
												// ${isSearch ? ' active ' : ''}
												className={`ps-panel--search-result-hide`}>
												{/* ps-panel__content  */}
												<div className="w700">{productItemsView}</div>
											</div>
										)
									}

								</Col>
								<Col>
									<QuantityNumber />
								</Col>
								<Col>
									<button
										type="submit" ghost='true'
										className='login-page-login-btn ps-add-cart-footer-btn custom-antd-primary w140'
									// disabled={!isFormComplete}
									// onClick={handleAddressSubmit}
									>
										{
											Number(curItem?.price) > 0 ? i18Translate('i18FunBtnText.Add to Order', 'Add to Order') :
												i18Translate('i18FunBtnText.ADD TO RFQ', 'Add to RFQ')
										}

									</button>
								</Col>
							</Row>
						</Form>
						{
							Number(curItem?.quantity) === 0 && (
								<div className='mt-10 pub-danger'>{iNotAvailableTip}</div>
							)
						}
					</div>
				</div>
			</div>
		</PageContainer>
	)
}

export default QuickOrderPage
export async function getServerSideProps({ req }) {
	const translations = await changeServerSideLanguage(req)

	return {
		props: {
			...translations,
		}
	}
}