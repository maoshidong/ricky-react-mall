import React from 'react';
import LazyLoad from 'react-lazyload';
import { Row, Col } from 'antd';
import TitleMore from '~/components/shared/public/titleMore';
import useLanguage from '~/hooks/useLanguage';
import { GENERALIZED_WORD } from '~/utilities/constant';

const IndustryApplication = () => {
	const { i18Translate } = useLanguage();
	const iOriginMall = i18Translate('i18CompanyInfo.Origin Electronic Parts Mall', GENERALIZED_WORD);

	const text2 = [
		'Temperature Measurement',
		'Blood Glucose Meter',
		'Medical Ultrasound',
		'Medical Instrumentation',
		'DiagnosticsTherapy Devices',
		'Wearable Health Monitor',
	];
	const text3 = [
		'Cluster Display',
		'Ethernet Connectivity',
		'Premium Audio Amplifiers',
		'Voice and Acoustic Signal Processing',
		'Automotive LED Driver Technology',
		'Electrification & Powertrain',
	];
	const text4 = [
		'Intelligent Buildings',
		'Building Automation Systems',
		'Power Solutions',
		'Environmental Monitoring',
		'Energy Technology',
		'Lighting Technology',
		'Smoke Detection',
	];
	const text5 = ['AI Accelerators', 'Server Equipment', 'Optical Networking'];
	const text6 = ['Intelligent Motion Control', 'Industrial Power Supplies', 'Industrial Robotics', 'Mounted Robotics', 'Mobile Robotics', 'Factory Automation'];
	const text7 = ['Software Defined Radio', 'Wideband RF Signal Processing', 'Wireless Infrastructure', '5G mmWave Wireless Communications'];
	const text8 = [
		'Metering & Energy Monitoring',
		'Electric MetersEnergy Monitoring',
		'Energy Storage & Power Conversion',
		'Energy Storage Systems',
		'Solar Inverters',
		'Wind Turbines',
	];
	const text9 = ['Remote pilotless aircraft', 'Avionics', 'Integrated Microwave Assemblies', 'Unmanned Systems', 'Wave Imaging and Sensing'];
	const text10 = [
		'Electronic Test & Measurement',
		'Automated Test Equipment',
		'Battery Test',
		'Analytical Instruments',
		'Weigh Scales',
		'Automotive Testing Solutions',
	];
	const text1 = ['Home Theater and Gaming', 'Personal Electronics', 'Hearables and Wearables', 'Edge Devices', 'Smart Home Solutions'];

	const iText1 = i18Translate('i18HomeNextPart.consumerDes')?.split(',') || text1;
	const iText2 = i18Translate('i18HomeNextPart.medicalDes')?.split(',') || text2;
	const iText3 = i18Translate('i18HomeNextPart.automotiveDes')?.split(',') || text3;
	const iText4 = i18Translate('i18HomeNextPart.aiDes')?.split(',') || text4;
	const iText5 = i18Translate('i18HomeNextPart.dataCenterDes')?.split(',') || text5;
	const iText6 = i18Translate('i18HomeNextPart.industrialDes')?.split(',') || text6;
	const iText7 = i18Translate('i18HomeNextPart.communicationsDes')?.split(',') || text7;
	const iText8 = i18Translate('i18HomeNextPart.energyDes')?.split(',') || text8;
	const iText9 = i18Translate('i18HomeNextPart.aerospacesDes')?.split(',') || text9;
	const iText10 = i18Translate('i18HomeNextPart.instrumentationDes')?.split(',') || text10;

	const list = [
		{
			img: '/static/img/bg/consumer.jpg',
			label: i18Translate('i18HomeNextPart.consumerTitle', 'Consumer'),
			text: iText1,
		},
		{
			img: '/static/img/bg/Medical.jpg',
			label: i18Translate('i18HomeNextPart.medicalTitle', 'Medical'),
			text: iText2,
		},
		{
			img: '/static/img/bg/Automotive.jpg',
			label: i18Translate('i18HomeNextPart.automotiveTitle', 'Automotive'),
			text: iText3,
		},
		{
			img: '/static/img/bg/ai.jpg',
			label: i18Translate('i18HomeNextPart.aiTitle', 'AI'),
			text: iText4,
		},
		{
			img: '/static/img/bg/Data Center.jpg',
			label: i18Translate('i18HomeNextPart.dataCenterTitle', 'Data Center'),
			text: iText5,
		},

		{
			img: '/static/img/bg/Industrial.jpg',
			label: i18Translate('i18HomeNextPart.industrialTitle', 'Industrial'),
			text: iText6,
		},
		{
			img: '/static/img/bg/Communications.jpg',
			label: i18Translate('i18HomeNextPart.communicationsTitle', 'Communications'),
			text: iText7,
		},
		{
			img: '/static/img/bg/Energy.jpg',
			label: i18Translate('i18HomeNextPart.energyTitle', 'Energy'),
			text: iText8,
		},
		{
			img: '/static/img/bg/Aerospace.jpg',
			label: i18Translate('i18HomeNextPart.aerospacesTitle', 'Aerospace'),
			text: iText9,
		},
		{
			img: '/static/img/bg/Instrumentation.jpg',
			label: i18Translate('i18HomeNextPart.instrumentationTitle', 'Instrumentation'),
			text: iText10,
		},
	];

	return (
		<div className="ps-product-list blocks-industry-application pt-60">
			<div className="ps-container">
				<TitleMore title={i18Translate('i18HomeNextPart.applications', 'WIDE RANGE OF PRODUCT APPLICATIONS')} />
				<Row gutter={20} className="row industry-application-cont pub-margin-8 mt50 pb-25">
					{list &&
						list.map((item, index) => (
							<Col key={index} xs={12} sm={8} md={8} xl={6} lg={6} className="industry-application-item pub-padding8">
								<div className="industry-application-img box-shadow">
									<LazyLoad height={160} once={true} offset={600}>
										<img className="product-news-img" src={item.img} alt={iOriginMall} title={iOriginMall} />
									</LazyLoad>
									<div className="industry-text industry-application-show pub-line-clamp">
										<div className="pub-font18" key={'text1' + index}>
											{item.label}
										</div>
									</div>
									<ul className="industry-text industry-application-des pub-line-clamp">
										{Array.isArray(item?.text) &&
											item?.text?.map((i, index) => {
												return (
													<li key={'d' + index} className="des">
														{i}
													</li>
												);
											})}
									</ul>
								</div>
							</Col>
						))}
				</Row>
			</div>
		</div>
	);
};

export default IndustryApplication;
