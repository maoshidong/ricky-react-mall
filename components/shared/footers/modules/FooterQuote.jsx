import { Button, Row, Col } from 'antd';
import Link from 'next/link';
import { PAGE_CONTACT_US } from '~/utilities/sites-url'
import classNames from 'classnames';
import styles from "./_FooterQuote.module.scss"
import useLanguage from '~/hooks/useLanguage';
// 参考https://cloud.tencent.com/edu/training
const FooterQuoteCom = ({ isMobile = false, paramMap }) => {
	const { i18Translate, curLanguageCodeZh } = useLanguage()
	// const { i18ContactUs } = useI18()
	const iSalesRepresentativeService = i18Translate('i18Footer.Sales Representative Service', 'Sales Representative Service')
	const iFotQuoteDes = i18Translate('i18Footer.fotQuoteDes', 'Please enter your requirements and submit them to us, Our sales representative will respond to you within 1 working day. Or you can submit an inquiry via EMAIL.')
	const iEmailRequestQuote = i18Translate('i18Footer.Email Request a Quote', 'Email Request a Quote')
	const iQuickResponse = i18Translate('i18Footer.Quick Response', 'Quick Response')
	const iCustomizedQuotes = i18Translate('i18Footer.Customized Quotes', 'Customized Quotes')
	const iCustomerSupport = i18Translate('i18Footer.Customer Support', 'Customer Support')
	const iProfessionalService = i18Translate('i18Footer.Professional Service', 'Professional Service')
	const arr = [
		{ img: 'fot-quote-1.svg', title: iQuickResponse },
		{ img: 'fot-quote-2.svg', title: iCustomizedQuotes },
		{ img: 'fot-quote-3.svg', title: iCustomerSupport },
		{ img: 'fot-quote-4.svg', title: iProfessionalService },
	]
	return (
		<div className='pub-bgc-f5'>
			<div className={styles.footerQuoteBox}>
				{/* className='ps-container pub-flex-wrap' */}
				<div className={styles.footerQuoteCon}>
					<div className={classNames('', styles.footerQuoteContainer)}>

						<div className={classNames('custom-antd-btn-more', styles.left)}>
							<h3 className={styles.subTit}>{iSalesRepresentativeService}</h3>
							<div className={styles.subDes} style={{ maxWidth: curLanguageCodeZh() ? '540px' : 'auto' }}>
								{iFotQuoteDes}</div>
							<Button
								type="primary" ghost='true'
								className={classNames('product-primary-btn custom-antd-primary', styles.btn)}
							>
								{curLanguageCodeZh() ? <span onClick={() => window.open(paramMap?.qqUrl, '_blank')}>{iEmailRequestQuote}</span> :
									<Link href={PAGE_CONTACT_US}>
										{iEmailRequestQuote}
									</Link>
								}
							</Button>
						</div>
					</div>

					{/* 右侧 */}
					<div className={styles.right}>
						<div className={styles.rightContent}>
							{/* style={{ maxWidth: '400px' }} */}
							<Row gutter={[10, 10]} className={styles.rightRow}>
								{
									arr?.map((item, index) => {
										return (
											// style={{ maxWidth: '200px' }} mb60
											<Col xl={12} lg={6} md={6} sm={6} xs={12} key={index} className={classNames('', styles.rightCol)}>
												<div className={styles.subInfo}>
													<div className={styles.subImgBox}>
														<img src={`/static/img/other/${item?.img}`} className={styles.infoImg} />
													</div>
													<div className={styles.subTitBox}>
														<h3 className={styles.subTit}>{item?.title}</h3></div>
												</div>
											</Col>
										)
									})
								}
							</Row>
						</div>
						<div className={styles.rightBg}>

						</div>
					</div>
				</div>
			</div >
		</div>
	)
}

export default FooterQuoteCom