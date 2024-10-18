import Image from 'next/image'
import { useI18, useLanguage } from "~/hooks"

const ConnectListom = ({ paramMap }) => {
	const { i18Translate, curLanguageCodeZh } = useLanguage()
	const { iConnect } = useI18()
	const iPhone = i18Translate('i18CompanyInfo.Phone', process.env.telephone);
	return (
		<div className="aaa">
			<aside className="widget_footer widget_contact-us">
				<h3 className="widget-title">{iConnect}</h3>
				<div className="widget_content">
					<div className="widget_content-item">
						<div className="sprite-home-min sprite-home-min-2-1"></div>
						<a className="concat-text pub-color-hover-link" href={`tel:${paramMap?.phone || iPhone}`}>
							{paramMap?.phone || iPhone}
						</a>
					</div>
					<div className="widget_content-item">
						<div className="sprite-home-min sprite-home-min-2-2"></div>
						<p className="concat-text pub-color-hover-link">{paramMap?.faxes || iPhone}</p>
					</div>
					<div className="widget_content-item">
						<div className="sprite-home-min sprite-home-min-2-3"></div>
						<p className="concat-text">
							<a className="pub-color-hover-link" href={`mailto:${paramMap?.email || process.env.email}`}>
								{paramMap?.email || process.env.email}
							</a>
						</p>
					</div>
					<div className="widget_content-item">
						{!curLanguageCodeZh() && <div className="sprite-home-min sprite-home-min-2-4"></div>}
						{curLanguageCodeZh() && <Image
							src="/static/img/common/qq_logo.jpg"
							width={21} height={21}
						/>}
						<span
							className="concat-text pub-color-hover-link"
							onClick={() => window.open(`${curLanguageCodeZh() ? paramMap?.qqUrl : paramMap?.skype}`, '_blank')}
							target="_blank">
							{i18Translate('i18CompanyInfo.Skype Live Chat', 'Skype Live Chat')}
						</span>
						{/* <a className="concat-text pub-color-hover-link" href={`${curLanguageCodeZh() ? paramMap?.qqUrl : paramMap?.skype}`} target="_blank">
								{i18Translate('i18CompanyInfo.Skype Live Chat', 'Skype Live Chat')}
							</a> */}

					</div>
				</div>
			</aside>
		</div>
	)
}

export default ConnectListom