import Head from "next/head";

import { useRouter } from 'next/router';
import useLanguage from '~/hooks/useLanguage';

import dynamic from 'next/dynamic';
const LoginRegister = dynamic(() => import('~/components/partials/account/LoginRegister'));

import { changeServerSideLanguage } from '~/utilities/easy-helpers';

const RegisterPage = () => {
	const { i18Translate, getLanguageHost } = useLanguage();
	const Router = useRouter();
	const canonicalUrl = Router.asPath?.split("?")?.[0] // 每个页面不带参数的完整url
	const i18Title = i18Translate('i18Seo.register.title', "")
	const i18Key = i18Translate('i18Seo.register.keywords', "")
	const i18Des = i18Translate('i18Seo.register.description', "")
	return (

		<div className="login-page-box custom-antd-btn-more ant-form-box">
			<Head>
				<link rel="canonical" href={`${getLanguageHost()}${canonicalUrl}`} />
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />
			</Head>
			<LoginRegister defaultKey="2" />
		</div>

	)
}

export default RegisterPage

export async function getServerSideProps({ req }) {
	const translations = await changeServerSideLanguage(req)

	return {
		props: {
			...translations,
		}
	}
}