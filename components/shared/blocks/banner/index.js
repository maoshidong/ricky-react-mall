import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';

import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
import useLocalStorage from '~/hooks/useLocalStorage';
import Link from 'next/link';
// import Image from 'next/image';
import { useRouter } from 'next/router';
//import Slider from 'react-slick';
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
	//const sliderRef = useRef(null);
	//const [slideIndex, setSlideIndex] = useState(0)
	const [_loginCallBack, setLoginCallBack] = useLocalStorage('loginCallBack', '/');

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
	// const settings = {
	// 	speed: 0, // 设置切换速度为 500 毫秒
	// 	autoplay: true,
	// 	autoplaySpeed: 4000,
	// 	lazyLoad: false, // 是否懒加载 #e9f0f6
	// 	fade: false, // true可以避免切换时闪烁(但是导致缓存不了图片，刷新有空白的情况)
	// };

	return (
        <div className="ps-home-banner home-banner-box pub-top-bgc" style="background: #f1f5fe; min-height: 500px;">
            <div className="home-banner-item pub-flex-align-center home-banner1">
                <div className="ps-block-banner-content">
                    <div className="ps-container">
                        <div className="ps-block-banner-box">
                            <div className="ps-block-banner-title" style={{ maxWidth: '800px' }}>
                                Maximize efficiency with our streamlined component procurement.
                            </div>
                            <h3 className="ps-block-banner-text mt15">
                                Your one-stop shop for all electronic components.
                            </h3>
                            <Link href={getEnvUrl(ACCOUNT_QUOTE)}>
                                <a className="banner-btn">REQUEST A QUOTE</a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
			<FeatureList />
        </div>
    );
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
	return <Device>
		{
			// isMobile,
			({ isPad, isDesktop }) => {
				// if (isMobile) return <MobileSwiper auth={auth} />

				if (isPad) return <DesktopSwiper auth={auth} isDesktop={isDesktop} />

				if (isDesktop) return <DesktopSwiper auth={auth} isDesktop={isDesktop} />
				return <MobileSwiper auth={auth} />
			}
		}
	</Device>
}

export default dynamic(() => Promise.resolve(connect((state) => state)(Banner)), { ssr: false });
