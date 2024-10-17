import React, { useMemo } from 'react';
import LazyLoad from 'react-lazyload';

import { SERVICE_LIST } from '~/utilities/constant'

import useLanguage from '~/hooks/useLanguage';

import dynamic from 'next/dynamic'
const FooterWidgets = dynamic(() => import('~/components/shared/footers/modules/FooterWidgets'))
const FooterCopyright = dynamic(() => import('~/components/shared/footers/modules/FooterCopyright'))
const FooterQuote = dynamic(() => import('~/components/shared/footers/modules/FooterQuote'))
// const FooterSeo = dynamic(() => import('/components/shared/footers/modules/FooterSeo'))
import FooterSeo from '~/components/shared/footers/modules/FooterSeo';
import FooterContactUs from './modules/FooterContactUs';

/**
 * 
 * @param {*} param0  cartHideFooter: 1 询价页面
 * @returns 
 */
const FooterFullwidth = ({ footer, cartHideFooter, paramMap = {} }) => {
	const { i18Translate, i18MapTranslate } = useLanguage();
	const { copyright, subscribe, certificates, ...rest } = footer || {};

	// 使用 useMemo 缓存组件 
	const cachedFooterSeo = useMemo(() => {
		return <FooterSeo />;
	}, []);

	return (
		<>
			{!cartHideFooter && <FooterContactUs />}
			{cartHideFooter === 1 && <FooterQuote paramMap={paramMap} />}
			{/* <LazyLoad height={45} once={true} offset={1000}>
                                <img
                                    src='/static/img/bg/contact-us.png'
                                    alt="quick quote"
                                    title="quick quote"
                                    className='pub-top-img'
                                />
                            </LazyLoad> */}
			{/* {
				!cartHideFooter && <div className='footer-contact-us pub-bgc-f5'>
					<div className='pub-top-bgc contact-us-content'>
						<Image
							className='pub-top-img'
							layout='fill'
							// height={192}
							src='/static/img/bg/contact-us.png'
							alt="quick quote"
							title="quick quote"
						/>

						<div className='ps-container pub-top-bgc-content content-quote'>
							<div className=''>
								<h4 className='mb-5 pub-font500 pub-font36 pub-top-bgc-title' style={{color: '#fff'}}>
									{i18Translate('i18Footer.needQuote', 'Need a quick quote?')}
								</h4>
								<p className='pub-font24 pub-top-bgc-des' style={{color: '#fff'}}>
									{i18Translate('i18Footer.tellUs', "Tell us what you're after")}
								</p>
							</div>
							<Link href={ACCOUNT_QUOTE}>
								<a className="pub-flex-center contact-btn w140 mt10">
									{i18Translate('i18Footer.contactUs', "Contact us")}
								</a>
							</Link>
						</div>
					</div>
				</div>
			} */}

			<footer className="ps-footer">
				<div className="ps-container custom-antd">
					{/* 阻塞 */}
					{cachedFooterSeo}
					<ul className='footer-service'>
						{
							(!cartHideFooter || cartHideFooter === 1) && SERVICE_LIST?.map((item, index) => {
								return (
									<li className='footer-service-item' key={index}>
										<LazyLoad height={45} once={true} offset={100}>
											<div className={item.className}></div>
										</LazyLoad>
										<div className='footer-service-label ml20'>
											{i18MapTranslate(`i18Footer.${item.label}`, item.label)}
										</div>
									</li>
								)
							})
						}
					</ul>

					<FooterWidgets {...rest} subscribe={subscribe} paramMap={paramMap} />
					<FooterCopyright {...rest} copyright={copyright} />

				</div>
			</footer>
		</>
	);
}
export default FooterFullwidth;
