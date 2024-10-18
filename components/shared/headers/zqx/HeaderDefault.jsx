import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import dynamic from 'next/dynamic';
const HeaderLogo = dynamic(() => import('~/components/shared/headers/zqx/HeaderLogo'));
// const SearchHeader = dynamic(() => import('~/components/shared/headers/modules/SearchHeader'));
const HeaderActions = dynamic(() => import('~/components/shared/headers/modules/HeaderActions'));
const NavigationDefault = dynamic(() => import('~/components/shared/navigation/NavigationDefault'));
const HotSearch = dynamic(()=>import('~/components/shared/headers/modules/HotSearch'))
import { stickyHeader } from '~/utilities/common-helpers';
import useAccount from '~/hooks/useAccount';
import NoSSR from 'react-no-ssr';
import useLanguage from '~/hooks/useLanguage';

const HeaderDefault = () => {
	const { i18Translate } = useLanguage();
	const iUeditorNotice = i18Translate('i18Ueditor.UeditorNotice', '')

	const [cookies, setCookie] = useCookies();
	const { isReceiveNotice } = cookies;
	const { checkPaymentPending } = useAccount();

	useEffect(() => {
		checkPaymentPending()
		// 头部导航透明
		window.addEventListener('scroll', stickyHeader);
		return () => {
			window.removeEventListener('scroll', stickyHeader);
		}
	}, [])

	return (
		<header
			className="header header--1 header--sticky pub-top-tabs-box"
			data-sticky="true"
			id="headerSticky"
			style={{ height: '60px',position:'relative' }}
		>
			<div className="header__top">
				<div className="header-container">
					<div className="header__left">
						<HeaderLogo />
						<NavigationDefault />
						<div className="header__center mr20">
							{/* <NoSSR> */}
							{/* <SearchHeader /> */}
							{/* </NoSSR> */}
						</div>
					</div>

					<div className="header__right">
						<HotSearch/>
						<HeaderActions />
						{/* <Menu /> */}
					</div>
				</div>
			</div>
			{/* 有通知就不展示占位元素 */}
			<NoSSR>
				{(!iUeditorNotice || isReceiveNotice) ? <div id="headerPlaceholder"></div> : null}
			</NoSSR>
		</header>
	);
};

export default HeaderDefault;
