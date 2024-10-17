import { useState, useEffect } from "react";
import Head from "next/head";
import Cookies from 'js-cookie';

import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { logOut } from '~/store/auth/action';

import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';


import dynamic from 'next/dynamic';
import PageContainer from '~/components/layouts/PageContainer';
const LoginRegister = dynamic(() => import('~/components/partials/account/LoginRegister'));
const MinModalTip = dynamic(() => import('~/components/ecomerce/minCom/MinModalTip'));

import { changeServerSideLanguage } from '~/utilities/easy-helpers';
// import { LOGIN } from '~/utilities/sites-url';

import { useCookies } from 'react-cookie';
// import { useTranslation, i18n } from 'next-i18next';


export const config = { amp: 'hybrid' }
const LoginPage = ({ paramMap }) => {
	const { i18Translate, getLanguageHost } = useLanguage();
	const { iEmail } = useI18();
	const dispatch = useDispatch();
	const Router = useRouter();
	const canonicalUrl = Router.asPath?.split("?")?.[0] // 每个页面不带参数的完整url
	const i18Title = i18Translate('i18Seo.login.title', "")
	const i18Key = i18Translate('i18Seo.login.keywords', "")
	const i18Des = i18Translate('i18Seo.login.description', "")

	const [showTip, setShowTip] = useState(false)
	const [cookies, setCookie] = useCookies(['cart']);

	// const [loginCallBack, setLoginCallBack] = useLocalStorage('loginCallBack', '/');

	// 展示停用提示
	const back403 = () => {
		setShowTip(true)
	}
	const cancel = () => {
		setShowTip(false)
		Cookies.remove('showAccountTip', true)
	}
	useEffect(() => {
		dispatch(logOut());
		setShowTip(Cookies.get('showAccountTip'))
		if (Cookies.get('showAccountTip')) {
			Cookies.remove('account')
			Cookies.remove('profileData');

			// setLoginCallBack(LOGIN)
		}
	}, [])
	return (
		<PageContainer isShowHeadFooter={false}>
			<div className="login-page-box custom-antd-btn-more ant-form-box">
				<Head>
					<link rel="canonical" href={`${getLanguageHost()}${canonicalUrl}`} />
					<title>{i18Title}</title>
					<meta property="og:title" content={i18Title} key="og:title" />
					<meta name="keywords" content={i18Key} key="keywords" />
					<meta name="description" content={i18Des} key="description" />
					<meta name="og:description" content={i18Des} key="og:description" />
				</Head>
				<LoginRegister defaultKey="1" back403={() => back403()} />
				{/* 停用提示 */}
				<MinModalTip
					isShowTipModal={showTip}
					width={550}
					tipTitle={i18Translate('i18AboutOrder2.Account', 'Account')}
					isChildrenTip={true}
					showCancel={false}
					maskClosable={false}
					onCancel={() => cancel()}
					handleOk={() => cancel()}
				>
					<div>
						<p>{i18Translate('i18Login.403Tip1', 'Sorry, this account has been deactivated.')}</p>
						<p>{i18Translate('i18Login.403Tip2', 'If you have any questions, please contact our customer service representative.')}</p>
						<p>{iEmail}:
							<a
								className='pub-color-link' href={`mailto:${paramMap?.serviceEmail || 'service@origin-ic.net'}`}>
								{paramMap?.serviceEmail || 'service@origin-ic.net'}
							</a>
						</p>
					</div>
				</MinModalTip>
			</div>
		</PageContainer>

	)
}

export default LoginPage

export async function getServerSideProps({ req }) {
	const translations = await changeServerSideLanguage(req)
	// 中文关闭
	// if(getLocale(req) === 'zh') {
	//     return redirect404()
	// }
	return {
		props: {
			...translations,
		}
	}
}