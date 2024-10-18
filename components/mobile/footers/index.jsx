import { Collapse } from "antd-mobile"
import Link from "next/link";
import Image from 'next/image';
import useLanguage from '~/hooks/useLanguage';
import { ZQX_ADDRESS } from '~/utilities/constant';
import FooterContactUs from '~/components/shared/footers/modules/FooterContactUs';
// import styles from '~/components/shared/footers/modules/_FoooterContactUs.module.scss;

const MessageArrow = () => {
	return <div className="common-bg-image-icon1 m-footer-arrow" />
}

const Message = ({ paramMap }) => {
	const { i18Translate, i18MapTranslate, curLanguageCodeZh } = useLanguage();
	const iPhone = i18Translate('i18CompanyInfo.Phone', process.env.telephone)
	const mapPhone = paramMap?.phone || iPhone
	const mapEmail = paramMap?.email || process.env.email

	return <>
		<Collapse arrow={<MessageArrow />}>
			<Collapse.Panel
				key="Connect" title={i18Translate('i18MenuText.Connect', "Connect")}
			>
				<div className="m-footer-person-item">
					<span className="common-bg-image-icon1 icon"></span>
					<a href={`tel:${mapPhone}`}>{mapPhone}</a>
				</div>
				<div className="m-footer-person-item">
					<span className="common-bg-image-icon1 icon"></span>
					<span>{paramMap?.faxes || iPhone}</span>
				</div>
				<div className="m-footer-person-item">
					<span className="common-bg-image-icon1 icon"></span>
					<Link href={`mailto:${mapEmail}`} target="_blank">{mapEmail}</Link>
				</div>
				<div className="m-footer-person-item">

					{!curLanguageCodeZh() && <div className="common-bg-image-icon1 icon"></div>}
					{curLanguageCodeZh() && <Image
						src="/static/img/common/qq.png"
						width={16} height={16}

					/>}
					<a
						href={`${curLanguageCodeZh() ? paramMap?.qqUrl : paramMap?.skype}`}
						target="_blank"
						className={curLanguageCodeZh() ? "ml10" : ''}
					>{i18Translate('i18CompanyInfo.Skype Live Chat', 'Skype Live Chat')}</a>
				</div>
			</Collapse.Panel>
			<Collapse.Panel
				key="Company" title={i18Translate('i18MenuText.company', "Company")}
			>
				<div className="m-footer-person-item">
					<Link href={'/page/about-us'} alt="go to about us">
						{i18MapTranslate(`i18MenuText.About Us`, 'About Us')}
					</Link>
				</div>
				<div className="m-footer-person-item">
					<Link href={'/page/certifications'} alt="go to certifications">
						{i18MapTranslate(`i18MenuText.Certifications`, 'Certifications')}
					</Link>
				</div>
				<div className="m-footer-person-item">
					<Link href={'/quality'} alt="go to quality">
						{i18MapTranslate(`i18MenuText.Quality`, 'Quality')}
					</Link>
				</div>
				<div className="m-footer-person-item">
					<Link href={'/page/careers'} alt="go to careers">
						{i18MapTranslate(`i18MenuText.Careers`, 'Careers')}
					</Link>
				</div>
				<div className="m-footer-person-item">
					<Link href={'/page/contact-us'} alt="go to contact Us">
						{i18MapTranslate(`i18MenuText.Contact Us`, 'Contact Us')}
					</Link>
				</div>
			</Collapse.Panel>
			<Collapse.Panel
				key="Resources" title={i18Translate('i18MenuText.Resources', "Resources")}
			>
				<div className="m-footer-person-item">
					<Link href={'/content-search'} alt="go to blog">
						{i18MapTranslate(`i18MenuText.Blog`, 'Blog')}
					</Link>
				</div>
				<div className="m-footer-person-item">
					<Link href={'/product-highlights'} alt="go to blog">
						{i18MapTranslate(`i18ResourcePages.Product Highlights`, 'Product Highlights')}
					</Link>
				</div>
				<div className="m-footer-person-item">
					<Link href={'/application-notes'} alt="go to blog">
						{i18MapTranslate(`i18ResourcePages.Application Notes`, 'Application Notes')}
					</Link>
				</div>
				<div className="m-footer-person-item">
					<Link href={'/products'} alt="go to all products">
						{i18MapTranslate(`i18MenuText.All Products`, 'All Products')}
					</Link>
				</div>
				<div className="m-footer-person-item">
					<Link href={'/bom-upload'} alt="go to BOM Tools">
						{i18MapTranslate(`i18MenuText.BOM Tools`, 'BOM Tools')}
					</Link>
				</div>
				<div className="m-footer-person-item">
					<Link href={'/help/free-sample'} alt="go to Free Sample">
						{i18MapTranslate(`i18MenuText.Free Sample`, 'Free Sample')}
					</Link>
				</div>
				<div className="m-footer-person-item">
					<Link href={'/page/inventory-solutions'} alt="go to Inventory Solutions">
						{i18MapTranslate(`i18MenuText.Inventory Solutions`, 'Inventory Solutions')}
					</Link>
				</div>
			</Collapse.Panel>
			<Collapse.Panel
				key="Help" title={i18Translate('i18MenuText.Help', "Help")}
			>
				<div className="m-footer-person-item">
					<Link href={'/help-center'} alt="go to Help Center">
						{i18MapTranslate(`i18MenuText.Help Center`, 'Help Center')}
					</Link>
				</div>
				<div className="m-footer-person-item">
					<Link href={'/account/orders'} alt="go to Order Status">
						{i18MapTranslate(`i18MenuText.Order Status`, 'Order Status')}
					</Link>
				</div>
				<div className="m-footer-person-item">
					<Link href={'/package-tracking'} alt="go to Package Tracking">
						{i18MapTranslate(`i18MenuText.Package Tracking`, 'Package Tracking')}
					</Link>
				</div>
				<div className="m-footer-person-item">
					<Link href={'/help/shipping-rates'} alt="go to Shipping Rates">
						{i18MapTranslate(`i18MenuText.Shipping Rates`, 'Shipping Rates')}
					</Link>
				</div>
			</Collapse.Panel>
			<Collapse.Panel
				key="Follow" title={i18Translate('i18CareersPage.Follow Us', 'Follow Us')}
			>
				<div className="m-footer-person-item">
					<div className="common-bg-image-icon1 f-icon" onClick={() => {
						window.open('https://www.facebook.com/Origin-Data-Global-Limited-100878739724371', '_blank')
					}}></div>
					<div className="common-bg-image-icon1 f-icon" onClick={() => {
						window.open('https://twitter.com/Origin_IC', '_blank')
					}}></div>
					<div className="common-bg-image-icon1 f-icon" onClick={() => {
						window.open('https://www.youtube.com/@Origin_Data', '_blank')
					}}></div>
					<div className="common-bg-image-icon1 f-icon" onClick={() => {
						window.open('https://www.tiktok.com/@origin_data', '_blank')
					}}></div>
				</div>
				<div className="m-footer-person-item">
					<div className="common-bank-image-icon bank-icon"></div>
					<div className="common-bank-image-icon bank-icon"></div>
					<div className="common-bank-image-icon bank-icon"></div>
					<div className="common-bank-image-icon bank-icon"></div>
					<div className="common-bank-image-icon bank-icon"></div>
					<div className="common-bank-image-icon bank-icon"></div>
				</div>

			</Collapse.Panel>
		</Collapse>
		<div className="m-footer-copyright">
			<div className="m-footer-copyright-top">
				<Link href="/policy/privacy-policy">{i18Translate('i18MenuText.Privacy Center', "Privacy Center")}</Link>
				<Link href="/policy/terms-and-conditions">{i18Translate('i18MenuText.Terms and Conditions', "Terms and Conditions")}</Link>
				<Link href="/help/site-map">{i18Translate('i18MenuText.Site Map', "Site Map")}</Link>
			</div>
			<div className="m-footer-copyright-bottom">
				{i18Translate('i18CompanyInfo.address', ZQX_ADDRESS)}
			</div>
		</div>
	</>
}

const Footer = ({ paramMap = {} }) => {
	const { i18Translate, i18MapTranslate } = useLanguage();

	return <div className="m-footer">
		<FooterContactUs isMobile={true} />
		{/* <div>我是手机端</div> */}
		{/* <FooterContactUs /> */}
		{/* <div className="m-footer-contact">
			<div>
				<div className="m-footer-contact-title">
					{i18Translate('i18Footer.needQuote', 'Need a quick quote?')}
				</div>
				<div className="m-footer-contact-desc">
					{i18Translate('i18Footer.tellUs', "Tell us what you're after")}
				</div>
				<div className="m-footer-contact-btn">
					<Link href={'/quote'}>
						{i18Translate('i18Footer.contactUs', "Contact us")}
					</Link>
				</div>
			</div>
		</div> */}
		<div className="m-footer-info">
			<Message paramMap={paramMap} />
		</div>
		<div className="m-footer-message">
		</div>
	</div>
}

export default Footer