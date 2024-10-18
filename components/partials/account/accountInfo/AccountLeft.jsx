import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';
import { useCookies } from 'react-cookie';
import AccountMenuSidebar from '~/components/partials/account/modules/AccountMenuSidebar';
import ModuleLogin from '~/components/ecomerce/modules/ModuleLogin';
import useLocalStorage from '~/hooks/useLocalStorage';
import useLanguage from '~/hooks/useLanguage';
import { getEnvUrl, LOGIN } from '~/utilities/sites-url';

const AccountLeft = ({ children }) => {
	const { i18Translate } = useLanguage();

	const [cookies, setCookie] = useCookies(['isAgreeCookies']);
	const [loginVisible, setLoginVisible] = useState(false);
	const [loginCallBack, setLoginCallBack] = useLocalStorage('loginCallBack', '/');
	const handleLogin = (res) => {
		setLoginVisible(false);
		Router.push(getEnvUrl(LOGIN));
	};
	useEffect(() => {
		// const isAccountFlag = typeof(cookies?.account?.account) == 'object' // 是对象就没登录, 错， account可能没有
		// 个人中心判断页面是否已经登录
		if (!cookies?.account?.isAccountLog) {
			setLoginCallBack(Router.asPath);
			Router.push(getEnvUrl(LOGIN));
		}
	}, [cookies]);
	const iMyAccount = i18Translate('i18MyAccount.My Account', 'My account');
	return (
		<div className="ps-page--my-account pub-bgc-f5">
			<div className="product-table-container ps-my-account ps-page--account pub-minh-1">
				<div className="ps-container">
					<div className="account-title pub-fontw pub-color18">{iMyAccount}</div>
					<div className="account-box">
						<div className="ps-page__left catalogs__top-fixed" style={{ padding: '0', width: '250px' }}>
							<AccountMenuSidebar />
						</div>
						<div className="ps-page__right">
							<div className="ps-page__content">{children}</div>
						</div>
					</div>
				</div>
			</div>

			<ModuleLogin visible={loginVisible} onCancel={() => setLoginVisible(false)} onLogin={handleLogin} />
		</div>
	);
};

export default connect(state => state)(AccountLeft);