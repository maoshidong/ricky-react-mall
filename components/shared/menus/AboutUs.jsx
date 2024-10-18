import React from 'react';
import useLanguage from '~/hooks/useLanguage';
import Router from 'next/router';
import Link from 'next/link';
import { SERVICE_LIST } from '~/utilities/constant';
import { getEnvUrl, AboutUsRouterList, PAGE_ABOUT_US } from '~/utilities/sites-url';

const AboutUs = () => {
	const { i18Translate, i18MapTranslate, temporaryClosureZh } = useLanguage();
	const iUeditorAboutUs = i18Translate('i18Ueditor.UeditorAboutUs', 'UeditorAboutUs');
	const iAboutUs = i18Translate('i18MenuText.About Us', 'About us');

	// box-shadow: rgba(55, 99, 177, .2) 8px 8px 20px 0px, #fff -8px -8px 20px 0px; head 下阴影

	const goToPages = (e, item) => {
		e.preventDefault();
		const menu = document.getElementById('pubfixedTop');
		menu.classList.remove('pub-menu-active');
		Router.push(getEnvUrl(item.url));
	};

	return (
		<div className="nav-about-us custom-antd-btn-more" style={{ marginLeft: '-5px' }}>
			<div className="navigation-fixed-left nav-fixed-left">
				<div className="nav-pub-left mt10">
					{AboutUsRouterList.map((item, index) => {
						if (temporaryClosureZh() && item?.routerName === 'Certifications') return null;
						return (
							<div className={'nav-left-item ' + (index === 0 ? 'default-active' : '')} onClick={(e) => goToPages(e, item)} key={index}>
								<a
									title={`go to ${item.routerName}`}
									alt={`go to ${item.routerName}`}
									href={`${getEnvUrl(item?.url)}`}
									className="nav-left-item-url pub-font13 pub-color18"
									aria-label={`go to ${item.routerName}`}
								>
									{i18MapTranslate(`i18MenuText.${item.routerName}`, item.routerName)}
								</a>

								<div className="sprite-home-min sprite-home-min-3-9 sprite-home-min-3-10"></div>
							</div>
						);
					})}
				</div>
			</div>

			<div className="navigation-fixed-right">
				<div className="expertise-text">
					<h2 className="pub-font500 mt3 pub-font16"></h2>

					<div className="pub-flex-grow pub-link-a mt10 pub-lh18 vue-ueditor-wrap" dangerouslySetInnerHTML={{ __html: iUeditorAboutUs }}></div>

					<Link href={getEnvUrl(PAGE_ABOUT_US)}>
						<a
							className="pub-content navigation-view-all pub-cursor-pointer mb20 mt30"
							style={{ justifyContent: 'flex-start' }}
							aria-label={iAboutUs}
							title={iAboutUs}
							alt={iAboutUs}
						>
							<span className="sub-title pub-color-hover-link" title={i18Translate('i18MenuText.View more', 'View more')}>
								{i18Translate('i18MenuText.View more', 'View more')}
							</span>
							<span className="sprite-home-min sprite-home-min-3-9 mb2"></span>
						</a>
					</Link>
					{/* {
                        !curLanguageCodeEn() && <div className='pub-flex-grow pub-link-a mt10 pub-lh18' dangerouslySetInnerHTML={{ __html: iUeditorAboutUs }}></div>
                    }
                    
                    {
                        curLanguageCodeEn() && <>
                            <p className='mt10 pub-lh18'>
                                {ABOUT_US_ONE}
                            </p>
                            <p className='mt5 pub-lh18'>
                                {ABOUT_US_TWO}
                            </p>
                            <h2 className='pub-font500 mt15 pub-font16'>We've Got Everything You Need</h2>
                            <p className='mt5'>{GET_NEED}</p>

                            <Link href={getEnvUrl(PAGE_ABOUT_US)}>
                                <a
                                    className='pub-content navigation-view-all pub-cursor-pointer mt20'
                                    style={{justifyContent: 'flex-start'}}
                                    aria-label='go to About Us'
                                >
                                    <p className='sub-title'>{i18Translate('i18MenuText.Learn more', 'Learn more')}</p>
                                    <div className='sprite-home-min sprite-home-min-3-9'></div>
                                </a>
                            </Link>
                        </>
                    } */}
				</div>

				<div className="pub-flex">
					<div className="nav-service">
						{SERVICE_LIST.map((item, index) => {
							return (
								<div className="service-item mb15" key={'s' + index}>
									<div className={'mr20 ' + item.className}></div>
									<div className="w200 pub-flex-align-center">
										<p className="service-label pub-font16">{i18MapTranslate(`i18Footer.${item.label}`, item.label)}</p>
										{/* <div className='service-des pub-color555'>{item.des}</div> */}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AboutUs;