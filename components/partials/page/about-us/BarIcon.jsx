import React from 'react';
import LazyLoad from 'react-lazyload';
import useLanguage from '~/hooks/useLanguage';

const BarIcon = () => {
	const { i18Translate } = useLanguage();
	const des1 = 'Provide more than 800,000 kinds of spot inventory';
	const des2 = "According to the customer's production plan, stock up in advance to reduce costs.";
	const des3 = 'All products have a full year warranty';
	const des4 = 'Usually orders are shipped within 24 hour';
	const des5 = 'we have a strict QR system and professional QC team.';
	const arr = [
		{
			label: i18Translate('i18AboutUs.AdvantageChildTitle1', 'Massive Stock'),
			des: i18Translate('i18AboutUs.AdvantageChildContent1', des1),
			img: 'advantage1.png',
		},
		{
			label: i18Translate('i18AboutUs.AdvantageChildTitle2', 'Competitive Pricing'),
			des: i18Translate('i18AboutUs.AdvantageChildContent2', des2),
			img: 'advantage2.png',
		},
		{
			label: i18Translate('i18AboutUs.AdvantageChildTitle3', '365 Days Warranty'),
			des: i18Translate('i18AboutUs.AdvantageChildContent3', des3),
			img: 'advantage3.png',
		},
		{
			label: i18Translate('i18AboutUs.AdvantageChildTitle4', 'Quick Response'),
			des: i18Translate('i18AboutUs.AdvantageChildContent4', des4),
			img: 'advantage4.png',
		},
		{
			label: i18Translate('i18AboutUs.AdvantageChildTitle5', 'Product Experts'),
			des: i18Translate('i18AboutUs.AdvantageChildContent5', des5),
			img: 'advantage5.png',
		},
		{
			label: i18Translate('i18AboutUs.AdvantageChildTitle6', 'Long Term Supply'),
			des: i18Translate('i18AboutUs.AdvantageChildContent2', des2),
			img: 'advantage6.png',
		},
	];

	return (
		<div className="bar-container">
			<div className="ps-container">
				<h3 className="pub-font500 bar-title">{i18Translate('i18AboutUs.AdvantageTitle', 'OUR ADVANTAGE')}</h3>

				<div className="bar-content pub-flex-wrap">
					{arr.map((item, i) => {
						return (
							// + (i !== 5 ? 'mr10' : '')
							<div key={i} className={'bar-item box-shadow'}>
								<LazyLoad height={70} once={true} offset={150}>
									<img src={'/static/img/about-us/' + item.img} />
								</LazyLoad>
								<h4 className="mt15 pub-font500 pub-color18 pub-font18">{item.label}</h4>
								<p className="pub-font13 pub-color888 pub-font13" style={{ lineHeight: '16px' }}>
									{item.des}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};


export default BarIcon