
import useLanguage from '~/hooks/useLanguage';
import { GENERALIZED_WORD } from '~/utilities/constant';

const Features = () => {
	const { i18Translate, curLanguageCodeZh } = useLanguage();
	const iOriginMall = i18Translate('i18CompanyInfo.Origin Electronic Parts Mall', GENERALIZED_WORD);

	const iServiceCountry = i18Translate('i18Home.Service City', 'SERVICE COUNTRY');
	const iSupplierCooperation = i18Translate('i18PubliceTable.Manufacturer', 'MANUFACTURERS');
	const iProvideSolutions = i18Translate('i18Home.Provide Solutions', 'PROVIDE SOLUTIONS');
	const iServeCustomers = i18Translate('i18Home.Serve Customers', 'SERVE CUSTOMERSS');
	const iProductStock = i18Translate('i18Home.Product Stock', 'PRODUCTS AVAILABLE');
	const featuresList = [
		{ id: 2, title: iServiceCountry, description: curLanguageCodeZh() ? '300+' : '150+' },
		{ id: 4, title: iSupplierCooperation, description: '2,900+' },
		{ id: 5, title: iProvideSolutions, description: '15,000+' },
		{ id: 3, title: iServeCustomers, description: '200,000+' },
		{ id: 1, title: iProductStock, description: curLanguageCodeZh() ? '1,000,000+' : '1 Million+' },
	];
	const getClass = (index) => {
		let iconClass = '';
		switch (index) {
			case 0:
				iconClass = 'sprite-1 sprite-1_2';
				break;
			case 1:
				iconClass = 'sprite-1 sprite-1_4';
				break;
			case 2:
				iconClass = 'sprite-1 sprite-1_5';
				break;
			case 3:
				iconClass = 'sprite-1 sprite-1_3';
				break;
			case 4:
				iconClass = 'sprite-1 sprite-1_1';
				break;
			case 5:
				iconClass = 'sprite-1 sprite-1_6';
				break;
		}
		return iconClass;
	};
	const featuresToShow = featuresList.map((item, index) => (
		<li className="col-12 col-xl-3 col-sm-6 pub-padding10 gutter-row mb20" key={item.id}>
			<div className="ps-block__item">
				<div className="ps-block__left">
					<div className={getClass(index)} title={iOriginMall} alt={iOriginMall}></div>
				</div>
				<div className="ps-block__right">
					<div className="ps-block-description">{item.description}</div>
					<div className="ps-block-title mt10 pub-font16">{item.title}</div>
				</div>
			</div>
		</li>
	));
	// 新版本
	return (
		<div className="ps-site-features site-features">
			<div className="ps-container">
				<ul className="ps-block--site-features row mb0" style={{ marginLeft: '-50px' }}>
					{featuresToShow}
				</ul>
			</div>
		</div>
	);
	// return <DefaultFeatureList features={features} />
};

export default Features;
