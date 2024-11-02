
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LazyLoad from 'react-lazyload';
import useLanguage from '~/hooks/useLanguage';
import TitleMore from '~/components/shared/public/titleMore';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { CommonRepository } from '~/repositories';

import { PAGE_CONTACT_US, PAGE_CERTIFICATIONS } from '~/utilities/sites-url';
// import PageTopBanner from '~/components/shared/blocks/banner/PageTopBanner';
import { PubPageBanner } from '~/components/common';


const PartQualityView = ({ minQuality }) => {
	const { i18Translate, i18MapTranslate, temporaryClosureZh, getDomainsData } = useLanguage();
	const [authList, setAuthList] = useState([])


	const [current, setCurrent] = useState(2);

	const getIcon = <CheckCircleTwoTone twoToneColor="#52c41a" className="mr10 mt3" />;
	const getContent = (contentTitle, arr = []) => {
		return (
			<div>
				<div className="steps-content-title">{contentTitle}</div>
				<div className="steps-content-li">
					<ul>
						{arr?.map((item) => {
							return (
								<li className="pub-flex">
									{getIcon}
									<p className="pub-lh18">{item}</p>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		);
	};
	const iCanRely = i18Translate('i18QualityPage.QualitySystemChildTitle', 'Safety compliance, Quality is everything');
	const iQualitySystemDes = i18Translate(
		'i18QualityPage.QualitySystemDes',
		'Origin Data is your trusted partner for safeguarding the integrity of your supply chain. Our specialists bring extensive experience and expertise in the electronics industry, dedicated to sharing knowledge with our clients. At Origin Data, we prioritize delivering top-tier service and quality control, utilizing sophisticated testing equipment and internationally recognized procedures to ensure supply chain safety. Upholding the highest standards of integrity and independence, we collaborate closely with clients to understand and address their unique requirements with customized solutions. Our services aim to mitigate product failure risks, enhance product quality, and maintain customer trust.'
	);
	const content1Title = i18Translate('i18QualityPage.ProcessTitle1', 'Shipment Received');
	const content2Title = i18Translate('i18QualityPage.ProcessTitle2', 'Package Verified & Inspected');
	const content3Title = i18Translate('i18QualityPage.ProcessTitle3', 'Quality Inspection');
	const content4Title = i18Translate('i18QualityPage.ProcessTitle4', 'Testing');
	const content5Title = i18Translate('i18QualityPage.ProcessTitle5', 'Shipping Verification');
	const content6Title = i18Translate('i18QualityPage.ProcessTitle6', 'Departs to Custom');

	const content2Arr = `
        The condition of the product's exteriorlouter carton;
        Product label and documentation accuracy to purchaseorder requirements
    `;
	const content3Arr = `
        Documentation and Packaging Inspection(non-destructive);
        General External Visual lnspection(non-destructive);
        Detailed External Visual Inspection(non-destructive);
        Mechanical lnspection(non-destructive);
        Remarking and Resurfacing Inspection(destructive)
    `;
	const content4Arr = `
        Substandard and counterfeit detection;
        Radiological(X-ray) Inspection;
        Lead Finish Evaluation;
        De-Lid/De-Capsulation Internal Analysis;
        Failure analysis;
        Lifecycle and reliability testing;
        Electrical testing
    `;
	const content5Arr = `
        Customers' shipping instructions and method;
        Shipping terms;
        Quantity;
        Sales order number and part number`;
	const iContent2Arr = i18Translate('i18QualityPage.ProcessContent2', content2Arr)?.split(';');
	const iContent3Arr = i18Translate('i18QualityPage.ProcessContent3', content3Arr)?.split(';');
	const iContent4Arr = i18Translate('i18QualityPage.ProcessContent4', content4Arr)?.split(';');
	const iContent5Arr = i18Translate('i18QualityPage.ProcessContent5', content5Arr)?.split(';');

	const steps = [
		{
			title: '1',
			// status: 'wait',
			text: content1Title,
			content: getContent(content1Title),
		},
		{
			title: '2',
			text: content2Title,
			content: getContent(content2Title, iContent2Arr),
		},
		{
			title: '3',
			text: content3Title,
			content: getContent(content3Title, iContent3Arr),
		},
		{
			title: '4',
			text: content4Title,
			content: getContent(content4Title, iContent4Arr),
		},
		{
			title: '5',
			text: content5Title,
			content: getContent(content5Title, iContent5Arr),
		},

		{
			title: '6',
			text: content6Title,
			content: getContent(content6Title),
		},
	];

	const content1 =
		"Our quality control inspection ensures that all packaging, labels, and components conform to the original manufacturer's specifications. Additionally, our 200x magnification process helps ensure the factory original condition of each component.";
	const content2 =
		"Using state-of-the-art X-ray testing technology with maximum efficiency, we inspect the internal dye to verify the authenticity of the component. This process helps to ensure that all components are original and consistent with the original manufacturer's specifications.";
	const content3 = "We use acetone verification testing to ensure that all component markings are consistent with the original manufacturer's specifications.";
	const content4 =
		"All Origin's shipping and receiving processes, as well as QC processes, are governed by our strict ISO guidelines and executed in our state-of-the-art ESD-compliant warehouse following the DIN Norm EN-61340-5-1 standard.";
	const content5 =
		"Our baking station ensures that all shipped products comply with the manufacturer's required MSL standard. Components are baked following IPC-J-STD 033B standards and are then vacuum-sealed prior to storage or shipment.";
	const content6 =
		'Our decapsulation process provides effective IC package decapsulation, gaining access to the die inside, which is necessary for electrical testing, counterfeit prevention, and more.';
	const content7 =
		'Our stand-alone chip programmers can verify existing chip data, buffer data to be written to the chip, check whether the chip is empty, or erase the chip.';
	const imgContect = [
		{
			img: '/static/img/certificarions/service1.png',
			title: i18Translate('i18QualityPage.ChildProcessTitle1', 'Inspection'),
			content: i18Translate('i18QualityPage.ChildProcessContent1', content1),
		},
		{
			img: '/static/img/certificarions/service2.png',
			title: i18Translate('i18QualityPage.ChildProcessTitle2', 'X-Ray Testing'),
			content: i18Translate('i18QualityPage.ChildProcessContent2', content2),
		},
		{
			img: '/static/img/certificarions/service3.png',
			title: 'Acetone Verification',
			title: i18Translate('i18QualityPage.ChildProcessTitle3', 'Acetone Verification'),
			content: i18Translate('i18QualityPage.ChildProcessContent3', content3),
		},
		{
			img: '/static/img/certificarions/service4.png',
			title: 'ESD Compliant Environment',
			title: i18Translate('i18QualityPage.ChildProcessTitle4', 'ESD Compliant Environment'),
			content: i18Translate('i18QualityPage.ChildProcessContent4', content4),
		},
		{
			img: '/static/img/certificarions/service5.png',
			title: i18Translate('i18QualityPage.ChildProcessTitle5', 'Component Baking'),
			content: i18Translate('i18QualityPage.ChildProcessContent5', content5),
		},
		{
			img: '/static/img/certificarions/service6.png',
			title: i18Translate('i18QualityPage.ChildProcessTitle6', 'Decapsulation'),
			content: i18Translate('i18QualityPage.ChildProcessContent6', content6),
		},
		{
			img: '/static/img/certificarions/service7.png',
			title: i18Translate('i18QualityPage.ChildProcessTitle7', 'Chip Programmer'),
			content: i18Translate('i18QualityPage.ChildProcessContent7', content7),
		},
	];

	const numList = [
		{
			name: 'Detection Accuracy',
			num: '99.99%',
		},
		{
			name: 'Years Experience',
			num: '20+',
		},
		{
			name: 'Testing Equipment',
			num: '300+',
		},
		{
			name: 'Day Orders',
			num: '2,500+',
		},
	];

	const serviceProcess = (
		params = {
			number: 0,
			divClass: 'img-box-one',
			imgClassActive: 'quality2-3.png',
			imgClass: 'quality2-1.png',
			textClass: '',
		}
	) => {
		return (
			<div onMouseEnter={() => setCurrent(params?.number)} className={`img-box ${params?.divClass} ` + (current === params?.number ? 'img-choose' : '')}>
				<LazyLoad height={110} once={true} offset={200}>
					<img
						src={'/static/img/certificarions/' + (current === params?.number ? params?.imgClassActive : params?.imgClass)}
						alt={steps?.[params?.number]?.title}
						title={steps?.[params?.number]?.title}
					/>
				</LazyLoad>
				<div className="pub-flex-center img-num">{steps?.[params?.number]?.title}</div>
				<div className={`img-text pub-font14 ` + params?.textClass}>{steps?.[params?.number]?.text}</div>
			</div>
		);
	};

	const getList = async () => {
		const res = await CommonRepository.apiAuthList({
			languageType: getDomainsData()?.defaultLocale
		})
		setAuthList(res?.data || [])
	}
	useEffect(() => {
		getList()
	}, [])

	const new_certifications_list = minQuality ? authList?.slice(0, 8) : authList
	const defaultDescription =
		'Origin Data Utilizing leading solutions to guarantee the integrity of authentic components and the stability of manufactured electronics.';
	return (
		<div className="ps-product_quality pub-minh-1 pb60">
			<PubPageBanner
				bgcImage="quality-bgc.webp"
				bgcImg="quality-bgc.webp"
				mobileBgcImg="quality-bgc.webp"
				title={i18Translate('i18QualityPage.bannerTitle', 'Origin Data Quality Control Laboratory')}
				titleH1={true}
				description={i18Translate('i18QualityPage.bannerDes', defaultDescription)}
				outerClassName='PartQualityViewBgc'
				style={{ marginTop: '-60px' }}
			>
				{/* <div className={classNames(banStyles.popularManufacturersBgc)}></div> */}
				<div className="pub-flex mt36">
					<Link href={PAGE_CONTACT_US}>
						<a style={{ color: 'white' }}>
							<div className="pub-flex-center contact-us pub-bgc-gradient w210">{i18Translate('i18MenuText.Contact Us', 'CONTACT US')}</div>
						</a>
					</Link>
				</div>
			</PubPageBanner>
			{/* 认证图标 */}
			<div className="wcontainer ps-product_quality_two">
				<h2 className="pub-font500 quality-two-title">{i18Translate('i18QualityPage.QualitySystemTitle', 'WE ARE A DEPENDABLE PARTNER IN SECURING YOUR SUPPLY CHAIN')}</h2>
				<div className="pub-flex-center">
					<div className="quality-two-left">
						<LazyLoad height={345} once={true} offset={100}>
							<img src="/static/img/certificarions/quality1.png" alt="quality" />
						</LazyLoad>
					</div>
					<div className="quality-two-right">
						<h3 className="pub-font500 quality-two-right-title pub-color555">{iCanRely}</h3>
						{/* QualitySystemDes */}
						<p className="mt10 pub-color555 pub-font13 pub-lh20">
							{iQualitySystemDes}
							{/* {ABOUT_US_TWO_ARR[0]} {ABOUT_US_TWO_ARR[1]}{ABOUT_US_TWO_ARR[2]} {ABOUT_US_TWO_ARR[3]} {ABOUT_US_TWO_ARR[4]} */}
						</p>
						{/* <div className='mt10 pub-color555 pub-font13 pub-lh20'>Our most crucial aspect is our strict QR system and professional QC team, which work together 
to ensure the quality of our products and services. We have obtained AS9120B, IOS9001, and 
other certifications to maintain strict control over product and service quality.</div> */}
						<div className="num-list pub-flex-align-center mt15">
							{numList.map((item) => {
								return (
									<div className="mt5" key={'num' + item.num}>
										<h4 className="pub-font500 quality-two-name pub-color18">{i18MapTranslate(`i18QualityPage.${item.name}`, item.name)}</h4>
										<div className="quality-two-num">{item.num}</div>
									</div>
								);
							})}
						</div>

						{/* <Link href={PAGE_CERTIFICATIONS}>
							<a className="pub-content mt30 mb30 view-more">
								<p className="sub-title pub-color-hover-link">{i18Translate('i18MenuText.View more', 'View more')}</p>
								<div className="sprite-home-min sprite-home-min-3-9"></div>
							</a>
						</Link> */}
					</div>
				</div>

				{(!temporaryClosureZh() && new_certifications_list?.length > 0) && <div style={{ marginTop: '100px' }}>
					<TitleMore
						title={i18Translate('i18QualityPage.certificationsTit', 'INTERNATIONALLY RECOGNIZED CERTIFICATIONS')}
						subTitle={i18Translate('i18MenuText.View more', 'View more')}
						childTex={i18Translate('i18QualityPage.certificationsDes', 'Origin Data ensures global clients receive top-tier protection against counterfeit electronic components and related threats through internationally recognized certification standards.')}
						linkUrl={PAGE_CERTIFICATIONS} />
					<div
						// pub-certifications  pub-border20
						className="pub-flex quality-certifications mt40"
						style={{ justifyContent: 'space-between' }}
					>
						{new_certifications_list.map((item, index) => {
							return (
								<a
									className="pub-flex-column-between pt-20 pb-20 col-3 col-md-2 col-lg-1 pub-color-hover-link box-shadow"
									key={'cert' + index} target="_blank" href={item.url}>
									<LazyLoad height={80} once={true} offset={100}>
										<img src={item?.imageUrl} alt={item.name} className="certificate-icon" />
									</LazyLoad>
									<h3 className="pub-font500 mt5 pub-font14 pub-color18" />
									{item.name}
								</a>
							);
						})}
					</div></div>
				}
			</div>

			{/* Steps 介绍 */}
			<div className="ps-product_quality_three product_quality_process">
				<h2 className="pub-font500 quality-three-title pub-color18">{i18MapTranslate(`i18QualityPage.ServiceProcessTitle`, 'SERVICE PROCESS')}</h2>
				<div className="pub-relative wcontainer">
					<div className="pub-flex-center">
						<div className="pub-relative quality-three-item">
							{/* <Image
                                    src={'/static/img/certificarions/' + (current === 0 ? 'quality2-3.png' : 'quality2-1.png')}
                                    alt="Shipment Received"
                                    title="Shipment Received"
                                /> */}
							{/* <div onMouseEnter={() => setCurrent(0)} className={'img-box img-box-one ' + (current === 0 ? 'img-choose' : '')}>
                                <LazyLoad height={110} once={true} offset={200}>
                                    <img src={'/static/img/certificarions/' + (current === 0 ? 'quality2-3.png' : 'quality2-1.png')} alt="quality" />
                                </LazyLoad>
                                <div className='pub-flex-center img-num'>1</div>
                                <div className='img-text pub-font14'>Shipment Received</div>
                            </div> */}

							{serviceProcess({
								number: 0,
								divClass: 'img-box-one',
								imgClassActive: 'quality2-3.png',
								imgClass: 'quality2-1.png',
							})}

							{serviceProcess({
								number: 1,
								divClass: 'img-box-two',
								imgClassActive: 'quality2-3.png',
								imgClass: 'quality2-1.png',
								textClass: 'w120',
							})}
							{serviceProcess({
								number: 2,
								divClass: 'img-box1 img-box-three',
								imgClassActive: 'quality2-3.png',
								imgClass: 'quality2-2.png',
							})}

							{/* <div onMouseEnter={() => setCurrent(1)} className={'img-box img-box-two ' + (current === 1 ? 'img-choose' : '')}>
                                <LazyLoad height={110} once={true} offset={200}>
                                    <img src={'/static/img/certificarions/' + (current === 1 ? 'quality2-3.png' : 'quality2-1.png')} alt="quality" />
                                </LazyLoad>
                                <div className='pub-flex-center img-num'>2</div>
                                <div className='w120 img-text pub-font14'>Package Verified & Inspected</div>
                            </div> */}

							{/* <div onMouseEnter={() => setCurrent(2)} className={'img-box img-box1 img-box-three ' + (current === 2 ? 'img-choose' : '')}>
                                <LazyLoad height={110} once={true} offset={200}>
                                    <img src={'/static/img/certificarions/' + (current === 2 ? 'quality2-3.png' : 'quality2-2.png')} alt="quality" />
                                </LazyLoad>
                                <div className='pub-flex-center img-num'>3</div>
                                <div className='img-text pub-font14'>Quality Inspection</div>
                            </div> */}
						</div>
						<LazyLoad height={110} once={true} offset={200}>
							<img src="/static/img/certificarions/quality2.png" alt="quality" style={{ width: '31%' }} />
						</LazyLoad>

						<div className="pub-relative quality-three-item quality-three-right">
							{serviceProcess({
								number: 3,
								divClass: 'img-box1 img-box-four',
								imgClassActive: 'quality2-3.png',
								imgClass: 'quality2-2.png',
							})}
							{serviceProcess({
								number: 4,
								divClass: 'img-box1 img-box-five',
								imgClassActive: 'quality2-3.png',
								imgClass: 'quality2-2.png',
							})}
							{serviceProcess({
								number: 5,
								divClass: 'img-box1 img-box-six',
								imgClassActive: 'quality2-3.png',
								imgClass: 'quality2-1.png',
							})}
							{/* <div onMouseEnter={() => setCurrent(3)} className={'img-box img-box1 img-box-four ' + (current === 3 ? 'img-choose' : '')}>
                                <LazyLoad height={110} once={true} offset={200}>
                                    <img src={'/static/img/certificarions/' + (current === 3 ? 'quality2-3.png' : 'quality2-2.png')} alt="quality" />
                                </LazyLoad>
                                <div className='pub-flex-center img-num'>4</div>
                                <div className='img-text pub-font14'>Testing</div>
                            </div> */}

							{/* <div onMouseEnter={() => setCurrent(4)} className={'img-box img-box1 img-box-five ' + (current === 4 ? 'img-choose' : '')}>
                                <LazyLoad height={110} once={true} offset={200}>
                                    <img src={'/static/img/certificarions/' + (current === 4 ? 'quality2-3.png' : 'quality2-2.png')} alt="quality" />
                                </LazyLoad>
                                <div className='pub-flex-center img-num'>5</div>
                                <div className='img-text pub-font14'>Shipping Verification</div>
                            </div> */}

							{/* <div onMouseEnter={() => setCurrent(5)} className={'img-box img-box-six ' + (current === 5 ? 'img-choose' : '')}>
                                <LazyLoad height={110} once={true} offset={200}>
                                    <img src={'/static/img/certificarions/' + (current === 5 ? 'quality2-3.png' : 'quality2-1.png')} alt="quality" />
                                </LazyLoad>
                                <div className='pub-flex-center img-num'>6</div>
                                <div className='img-text pub-font14'>Departs to Customer</div>
                            </div> */}
						</div>
					</div>

					<div className="steps-content percentW100 mt10">{steps[current].content}</div>
				</div>
			</div>

			<div className="service-process">
				<h2 className="pub-font500 service-process-top">{i18MapTranslate(`i18QualityPage.Our Services Include`, 'OUR SERVICES INCLUDE')}</h2>
				{imgContect.map((items, index) => {
					return (
						<div className="service-process-item box-shadow" key={index} style={{ padding: '30px 10px' }}>
							<div className="wcontainer pub-flex-align-center">
								<Image
									src={items.img}
									alt={items.title}
									title={items.title}
									width={267}
									height={100}
									// layout='fill'
									className="service-process-img"
								/>
								{/* <img className='service-process-img' src={items.img} /> */}
								<div className="service-process-title pub-color555">
									<div className="">
										<h3 className="pub-font16 pub-fontw">{items.title}</h3>
									</div>
									<p className="service-process-content pub-font13 pub-lh20">{items.content}</p>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			<div style={{ marginTop: '70px' }}>
				<TitleMore title={i18MapTranslate(`i18QualityPage.QualityCompanies`, "THIRD-PARTY QUALITY CONTROL COMPANIES WE WORK WITH")} />

				<div style={{ marginTop: '50px' }} className='mt50'>
					<LazyLoad height={80} once={true} offset={100} >
						<img src='/static/img/certificarions/qualityControl1.png' />
						<img src='/static/img/certificarions/qualityControl2.png' className='ml30' />
					</LazyLoad>
				</div>
			</div>

		</div >
	);
};
export default PartQualityView;
