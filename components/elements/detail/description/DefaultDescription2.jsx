import React, { useState, useContext } from 'react';
// import { Modal } from 'antd';
import PartialSpecification from '~/components/elements/detail/description/PartialSpecification';
import TabNav from '~/components/ecomerce/minCom/TabNav';
// import QuoteModal from '~/components/shared/blocks/quote-modal';
import { ProductsDetailContext } from '~/utilities/shopCartContext';
import useLanguage from '~/hooks/useLanguage';

/**
 * @产品概述, 相关文章, 相关产品, 热门搜索
 * **/
const DefaultDescription2 = () => {
	const { i18Translate } = useLanguage();
	const iAttributes = i18Translate('i18AboutProduct.Attributes', 'Attributes');
	const iTechnicalDocuments = i18Translate('i18AboutProduct.Technical Documents', 'Technical Documents');
	const iDatasheet = i18Translate('i18AboutProduct.Datasheet', 'Datasheet');

	const { productDetailData } = useContext(ProductsDetailContext);
	const [tabActive, seTabActive] = useState(iAttributes);
	// const [isQuoteView, setIsQuoteView] = useState(false);
	const { name, datasheet, attributeList, catalogsList, manufacturer } = productDetailData || {};

	// 询价
	// const handleHideQuoteModal = (e) => {
	// 	e && e.preventDefault();
	// 	setIsQuoteView(false);
	// };

	// 切换tab页面
	const handleTabNav = (e, item) => {
		e.preventDefault();
		seTabActive(item?.label);
	};

	// tab页内容
	const headNavArr = [
		{
			label: iAttributes,
		},
		{
			label: iTechnicalDocuments,
		},
	];

	return (
		<div className="ps-product__content pub-border20 box-shadow" style={{ padding: 0 }}>
			<TabNav tabActive={tabActive} headNavArr={headNavArr} handleTabNav={handleTabNav} />
			{tabActive === iAttributes && <PartialSpecification attributeList={attributeList} catalogsList={catalogsList} manufacturer={manufacturer} />}
			{datasheet && tabActive === iTechnicalDocuments && (
				// <div className={tabActive === iTechnicalDocuments ? 'pub-color555 pt-20 pr-20 pb-20 pl-20' : 'pub-seo-visibility'}>
				<div className="pub-color555 pt-20 pr-20 pb-20 pl-20">
					<h3 className="mb5 pub-border-b346">{iDatasheet}</h3>
					<div className="pub-color-hover-link" onClick={() => window.open(datasheet, '_blank')}>
						<i className="sprite-icon4-cart sprite-icon4-cart-2-4 icon-pdf " />
						{name} {iDatasheet} (PDF)
					</div>
				</div>
			)}

			{/* 详情页询价 */}
			{/* <Modal
				centered
				title={i18Translate('i18FunBtnText.REQUEST A QUOTE', 'Request a Quote')}
				footer={null}
				width={550}
				onCancel={(e) => handleHideQuoteModal(e)}
				open={isQuoteView}
				closeIcon={<i className="icon icon-cross2"></i>}
			>
				{isQuoteView && (
					<QuoteModal
						cancelFn={() => {
							handleHideQuoteModal();
						}}
						submitFn={handleHideQuoteModal}
						newProduct={productDetailData}
					/>
				)}
			</Modal> */}
		</div>
	);
};

export default DefaultDescription2;
