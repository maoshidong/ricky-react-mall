import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';

import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
import useLocalStorage from '~/hooks/useLocalStorage';
import Link from 'next/link';
// import Image from 'next/image';
import { useRouter } from 'next/router';
import Slider from 'react-slick';
import { Button, Swiper } from 'antd-mobile';
import dynamic from 'next/dynamic';

const FeatureList = dynamic(() => import('/components/shared/blocks/features'));
const Device = dynamic(() => import('/components/hoc/Device'));

import { getEnvUrl, ACCOUNT_QUOTE, REGISTER, ACCOUNT_COUPON } from '~/utilities/sites-url'


const DesktopSwiper = ({ auth, isDesktop }) => {
	const {
		iComponentProcurement, iOneStop,
	} = useI18();
	const { i18Translate, temporaryClosureZh } = useLanguage();
	const { isAccountLog } = auth
	const Router = useRouter()
	const sliderRef = useRef(null);
	const [slideIndex, setSlideIndex] = useState(0)
	const [_loginCallBack, setLoginCallBack] = useLocalStorage('loginCallBack', '/');

	const getCustomDots = () => {
		return (
			<div id='custom-dots' className='home-dots mt30'>
				<div onClick={e => prevSlide(e)} style={{ padding: '10px 0' }}>
					<div className={'custom-dots-item ' + (slideIndex == 0 ? 'custom-dots-item-active' : '')} onClick={nextSlide}></div>
				</div>
				{
					!temporaryClosureZh() && <div onClick={e => nextSlide(e)} style={{ padding: '10px 0' }}>
						<div className={'custom-dots-item ' + (slideIndex == 1 ? 'custom-dots-item-active' : '')} onClick={nextSlide}></div>
					</div>
				}
			</div>
		)
	}
	const nextSlide = (e) => {
		e.preventDefault();
		sliderRef.current.slickNext();
	}
	const prevSlide = (e) => {
		e.preventDefault();
		sliderRef.current.slickPrev();
	}
	const handleSlideChange = (currentSlide) => {
		setSlideIndex(currentSlide)
	};
	const handleRegister = (e) => {
		e.preventDefault()
		if (isAccountLog) {
			Router.push(getEnvUrl(ACCOUNT_COUPON))
			return
		}
		setLoginCallBack(getEnvUrl(ACCOUNT_COUPON))
		Router.push(`${getEnvUrl(REGISTER)}`)
	}

	//   fade: true, 用来指定是否使用渐变动画切换轮播项。 轮播项之间的切换将使用CSS渐变动画来实现，即当前项会逐渐淡出，下一项逐渐淡入
	const settings = {
		speed: 0, // 设置切换速度为 500 毫秒
		autoplay: true,
		autoplaySpeed: 4000,
		lazyLoad: false, // 是否懒加载 #e9f0f6
		fade: false, // true可以避免切换时闪烁(但是导致缓存不了图片，刷新有空白的情况)
	};
	return <div className='ps-home-banner home-banner-box pub-top-bgc' style={{background: 'f1f5fe'}}>
		<Slider
			ref={sliderRef}
			className='carousel-long-dot'
			{...settings}
			afterChange={(currentSlide) => handleSlideChange(currentSlide)}
		>
			<div className={`home-banner-item slide-item carousel-item pub-flex-align-center ` + (isDesktop ? 'home-banner1' : 'home-bannerPad')}
			>
				{/* <img
					priority={true}
					src='/static/img/bg/banner-home-quote.jpg'
					alt={iOriginMall}
					title={iOriginMall}
					className='pubObjectFitNone home-banner-img'
					style={{ width: '100%', display: 'block' }} /> */}
				{/* <Image
					priority={true}
					src='/static/img/bg/banner-home-quote.jpg'
					alt={iOriginMall}
					title={iOriginMall}
					layout='fill'
					className='pubObjectFitNone'
					style={{ width: '100%', display: 'block' }} /> */}
				<div className='ps-block-banner-content'
				>
					<div className='ps-container'>
						<div className='ps-block-banner-box'>
						{/* pub-top-bgc-title */}
							<div className='ps-block-banner-title' style={{maxWidth: '800px'}}>
								{iComponentProcurement}
								{/* {i18Translate('i18Home.componentProcurement', 'Maximize efficiency with our streamlined component procurement.')} */}
							</div>
							<h3 className='ps-block-banner-text mt15'>
								{iOneStop}
								{/* {i18Translate('i18Home.oneStop', 'Your one-stop shop for all electronic components.')} */}
							</h3>
							<Link href={getEnvUrl(ACCOUNT_QUOTE)}>
								<a className='banner-btn'>
									{i18Translate('i18Home.requestQuote', 'REQUEST A QUOTE')}
								</a>
							</Link>
							{getCustomDots()}
						</div>
					</div>
				</div>
			</div>

			{/* {slideIndex == 1 &&  */}
			{/* <Image
				src='/static/img/bg/loginDiscounts.jpg'
				alt={iOriginMall}
				title={iOriginMall}
				layout='fill'
				className='pubObjectFitNone'
				style={{ width: '100%', display: 'block' }} /> */}
			{
				!temporaryClosureZh() && <div className={`home-banner-item slide-item carousel-item pub-flex-align-center ` + (isDesktop ? 'home-banner2' : 'home-banner2-Pad')} style={{ position: 'relative' }}>
					{/* <img
						src='/static/img/bg/banner-home-sign.jpg'
						alt={iOriginMall}
						title={iOriginMall}
						className='pubObjectFitNone home-banner-img'
						style={{ width: '100%', display: 'block' }} /> */}
				
					<div className='ps-block-banner-content'>
						<div className='ps-container'>
							<div className='ps-block-banner-box'>
								<div className='ps-block-banner-title'  style={{maxWidth: '750px'}}>
									{i18Translate('i18Home.limitedTimeOffer', "Limited Time Offer: Register and Get $100 Voucher")}
									{/* {i18Translate('i18Home.limitedTimeOffer', "Don't miss this limited-time offer:")} */}
								</div>
								{/* <h3 className='pub-font38 pub-color555'> */}
								<h3 className='ps-block-banner-text mt15'>
									{i18Translate('i18Home.cashVoucher', "Register and Enjoy Exclusive Benefits")}
									{/* {i18Translate('i18Home.cashVoucher', "a $200 cash voucher upon registration.")} */}
								</h3>
								<Link href={`${getEnvUrl(REGISTER)}`}>
									<a onClick={(e) => handleRegister(e)} className='banner-btn w210'>
										{i18Translate('i18Home.singUp', "SIGN UP TODAY")}
									</a>
								</Link>
								{getCustomDots()}
							</div>
						</div>
					</div>
				</div>
			}
		</Slider>
		<FeatureList />
	</div>
}


const MobileSwiper = ({ auth }) => {
	const {
		iOriginMall, iComponentProcurement, iOneStop
	} = useI18();
	const { i18Translate } = useLanguage();
	const { isAccountLog } = auth
	const Router = useRouter()
	const [loginCallBack, setLoginCallBack] = useLocalStorage('loginCallBack', '/');


	const handleRegister = (e) => {
		e.preventDefault()
		if (isAccountLog) {
			Router.push(getEnvUrl(ACCOUNT_COUPON))
			return
		}
		setLoginCallBack(getEnvUrl(ACCOUNT_COUPON))
		Router.push(`${getEnvUrl(REGISTER)}`)
	}

	return (
        <div
            className="m-static-banner home-banner3"
            style={{
                width: '100%',
                height: '200px',
                display: 'flex',
                backgroundColor: '#F1F4FF',
                alignItems: 'center',
            }}
        >
            <div className="ps-block-banner-content">
                <div className="ps-container">
                    <div className="ps-block-banner-box">
                        <div
                            className="ps-block-banner-title"
                            style={{
                                fontSize: '16px',
                                fontWeight: 600,
                                lineHeight: '22px',
                            }}
                        >
                            Streamline components procurement for maximum efficiency
                        </div>
                        <h3
                            className="ps-block-banner-text mt5"
                            style={{
                                lineHeight: '24px',
                                fontWeight: 400,
                                fontSize: '14px',
                            }}
                        >
                            Quality Electronic Components, Always Accessible
                        </h3>
                        <button
                            type="button"
                            className="adm-button adm-button-primary adm-button-shape-default mt10"
                            style={{
                                fontSize: '12px',
                            }}
                        >
                            <span>
                                <a
                                    className="banner-btn"
                                    href="https://www.origin-ic.com/quote"
                                    style={{
                                        fontSize: '12px',
                                    }}
                                >
                                    REQUEST A QUOTE
                                </a>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 首页轮播
const Banner = ({ auth, isMobile }) => {
    return (
      <Device isMobile={isMobile}>
        {({ isMobile: isDeviceMobile, isPad, isDesktop }) => {
 
          if (isDeviceMobile) {
            return <MobileSwiper auth={auth} />;
          }

          if (isPad || isDesktop) {
            return <DesktopSwiper auth={auth} isDesktop={isDesktop} />;
          }
 
          return <MobileSwiper auth={auth} />;
        }}
      </Device>
    );
}

export default dynamic(() => Promise.resolve(connect((state) => state)(Banner)), { ssr: false });