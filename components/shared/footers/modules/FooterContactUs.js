import { Button } from 'antd';
import Link from 'next/link';
import { ACCOUNT_QUOTE } from '~/utilities/sites-url'
import classNames from 'classnames';
import styles from "./_FoooterContactUs.module.scss"
import useLanguage from '~/hooks/useLanguage';

const FooterContactUsCom = ({ isMobile=false }) => {
    const { i18Translate } = useLanguage()
    // const { i18ContactUs } = useI18()
    const iBtn = i18Translate('i18Footer.Get a quote now', 'Get a quote now')
    const title = () => <div className='' style={{maxWidth: '490px'}}>
        <h4 className={classNames('mb-5 pub-font500 pub-font24 pub-top-bgc-title pub-flex-align-center', styles.title)} style={{color: '#fff'}}>
            {i18Translate('i18Footer.needQuote', 'Ready to request a quote?')}
        </h4>
        <p className='pub-font16 pub-top-bgc-des mt10' style={{color: '#fff'}}>
            {i18Translate('i18Footer.tellUs', "Please let us know your requirements, and our sales representative will get back to you within 1 business day.")}
        </p>
    </div>
    return (
        isMobile ?
        <div className={styles.contactMobile}>
            <div className={classNames('ps-container custom-antd-btn-more', styles.contactCenter)}>
                <main>
                    {title()}
                    <Button
												type="primary" ghost='true'
												// className='product-primary-btn custom-antd-primary'
												className={classNames('product-primary-btn custom-antd-primary', styles.contactbtn)}
										>
												<Link href={ACCOUNT_QUOTE}>
												{/* <a className={classNames('pub-flex-center', styles.contactbtn)}>{i18ContactUs}</a> */}
												{iBtn}
												</Link>
										</Button>
                </main>
            </div>
            <div className={classNames(styles.rotate3, styles.rotate3Mobile)}></div>
        </div>
        // <div style={{ height: '30px', backgroundColor: '#f5f7fa'}}></div>  style={{ paddingTop: '30px' }}
        : <div className={classNames(styles.footerBox)}><div className={classNames('pb50 pub-bgc-f5')}>

            <div className={classNames(styles.contactBox)}>
                <div className={classNames('ps-container custom-antd-btn-more', styles.contactCenter)}>
                    <main>
                        {title()}
                        <Button
                            type="primary" ghost='true'
                            // className='product-primary-btn custom-antd-primary'
                            className={classNames('product-primary-btn custom-antd-primary', styles.contactbtn)}
                        >
                            <Link href={ACCOUNT_QUOTE}>
                            {/* <a className={classNames('pub-flex-center', styles.contactbtn)}>{i18ContactUs}</a> */}
                            {iBtn}
                            </Link>
                        </Button>
                        {/* <Button
                            type="primary" ghost
                            className='ps-add-cart-footer-btn'
                        >
                            <Link href={ACCOUNT_QUOTE}>{i18ContactUs}</Link>
                        </Button> */}
                        {/* <Link href={ACCOUNT_QUOTE}>
                            <a className={classNames('pub-flex-center', styles.contactbtn)}>
                                {i18ContactUs}
                            </a>
                        </Link> */}
                    </main>
                </div>
                <div className={styles.rotate3}></div>
            </div>
        </div>
        </div>
        
    )
}

export default FooterContactUsCom