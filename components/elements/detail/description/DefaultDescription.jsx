import React, { useState, useContext, useMemo } from 'react';
import { Modal } from 'antd';
import Image from 'next/image';
import DescriptionShipping from '~/components/elements/detail/description/DescriptionShipping';
import TabNav from '~/components/ecomerce/minCom/TabNav';
import QuoteModal from '~/components/shared/blocks/quote-modal';
import PurchaseInquiry from './PurchaseInquiry';
import { ProductsDetailContext } from '~/utilities/shopCartContext';
import useLanguage from '~/hooks/useLanguage';
import { Flex } from '~/components/common';

// 属性，发货，联系我们 
const DefaultDescription = () => {
	const { i18Translate, curLanguageCodeZh } = useLanguage();
	const iCertifications = i18Translate('i18MenuText.Certifications', 'Certifications')
	const iContactUs = i18Translate('i18MenuText.Contact Us', 'Contact Us')
	const iShippingRates = i18Translate('i18MenuText.Shipping Rates', 'Shipping Rates')
	const iPurchase = i18Translate('i18MenuText.Purchase & Inquiry', 'Purchase & Inquiry')
	const iSubmitQuote = i18Translate('i18Form.Submit Quote', 'SUBMIT QUOTE');
	const iEstimate = i18Translate('i18ResourcePages.Estimate', 'Estimate')
	const iCommunicateDes1 = i18Translate('i18CareersPage.CommunicateDes1', 'Thank you for visiting our website, if you have any questions, please contact us, we will be happy to serve you.')
	const iCommunicateDes2 = i18Translate('i18CareersPage.CommunicateDes2', 'You can contact us by email, Skype and by filling out the form below.')
	const iSubmitInformation = i18Translate('i18FunBtnText.REQUEST A QUOTE', 'Request a quote') // 所有位置
	// const iSubmitInformation = i18Translate('i18CareersPage.SubmitInformation', 'Request a quote') // 所有位置
	const iSalesEmail = i18Translate('i18CompanyInfo.SalesEmail', process.env.email)

	const { productDetailData, isHavePrice, authList, paramMap } = useContext(ProductsDetailContext)
	const [tabActive, seTabActive] = useState(isHavePrice ? iCertifications : iContactUs)
	const [isQuoteView, setIsQuoteView] = useState(false);

	const handleHideQuoteModal = (e) => {
		e && e.preventDefault();
		setIsQuoteView(false);
	};

	const handleTabNav = (e, item) => {
		e.preventDefault();
		seTabActive(item?.label)
	}

	let headNavArr = [
		{ label: iPurchase },
		{ label: iShippingRates },
		{ label: iContactUs },
	]

	if (isHavePrice) {
		headNavArr.unshift({ label: iCertifications })
	}

	// 使用 useMemo 缓存组件 
	const cachedSubmitQuote = useMemo(() => {
		return <>
			<Flex className='mt5 pub-color555 mb15 pub-flex-align-center'>
				<div className='sprite-account-icons sprite-account-icons-2-2 mr10' />
				{iSubmitInformation}
			</Flex>

			<div style={{ width: '550px', marginTop: '30px' }}>
				<QuoteModal
					newProduct={productDetailData}
					subName={iSubmitQuote}
					isShowCancle={false}
					btnStyle={{ margin: '30px 0 10px' }}
					isRepetitionShow={false}
					isShowOk={false}
				/>
			</div>
		</>
	}, []);

	return (
		<div className="ps-product__content pub-border20 box-shadow" style={{ padding: 0 }}>
			<TabNav
				tabActive={tabActive} headNavArr={headNavArr} handleTabNav={handleTabNav}
			/>
			{
				tabActive === iCertifications && <div className="pub-flex pub-color555 pt-20 pr-20 pb-20 pl-20" style={{ justifyContent: 'space-between' }}>
					{
						authList?.slice(0, 9).map(item => {
							return (
								<a key={item.name} target="_blank" href={item.url}>
									<img loading="lazy" src={item?.imageUrl} alt={item.name} width={90} height={82} className="certificate-icon" />
								</a>
							)
						})
					}
				</div>
			}

			<div className={(tabActive === iContactUs ? 'ps-product-contact-us custom-antd-btn-more' : 'pub-seo-visibility')}>
				<h3 className='ps-product-contact-us-title'>
					{i18Translate("i18CareersPage.Let's communicate", "Let's communicate")}
				</h3>
				<p className='ps-product-contact-us-color'>{iCommunicateDes1}<br />{iCommunicateDes2}</p>

				<div className='pub-flex-align-center pub-flex-wrap mb20'>
					<div className='widget_content-item pub-flex-align-center mr50 mt20'>
						<div className='sprite-home-min sprite-home-min-2-3' />
						<div className='concat-text ml10 pub-color-link'>
							<a target='_blank' className='pub-flex mt2' href={`mailto:${paramMap?.email || iSalesEmail}`}>{paramMap?.email || iSalesEmail}</a>
						</div>
					</div>
					<div className='widget_content-item pub-flex-align-center mt20'>

						{!curLanguageCodeZh() && <div className='sprite-home-min sprite-home-min-2-4' />}
						{curLanguageCodeZh() && <Image src="/static/img/common/qq.png" width={21} height={21} />}
						<span
							className='concat-text ml10 pub-color-link pub-flex mt2'
							onClick={() => window.open(`${curLanguageCodeZh() ? paramMap?.qqUrl : paramMap?.skype}`, '_blank')}
							target="_blank"
						>{i18Translate('i18CompanyInfo.Skype Live Chat', 'Skype Live Chat')}</span>

						{/* <a
							className='concat-text ml10 pub-color-link pub-flex mt2'
							href={`${curLanguageCodeZh() ? paramMap?.qqUrl : paramMap?.skype}`}
							target="_blank"
						>{i18Translate('i18CompanyInfo.Skype Live Chat', 'Skype Live Chat')}</a> */}
					</div>
				</div>

				{/* 循环引用 */}
				{cachedSubmitQuote}
			</div>

			<div className={(tabActive === iShippingRates ? '' : 'pub-seo-visibility')}>
				<DescriptionShipping titleText={`${iShippingRates} - ${iEstimate}`} />
			</div>

			<div className={(tabActive === iPurchase ? '' : 'pub-seo-visibility')}>
				<PurchaseInquiry />
			</div>

			{/* 详情页询价 */}
			{isQuoteView && (
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
			)}
		</div>
	);
};

export default DefaultDescription;
