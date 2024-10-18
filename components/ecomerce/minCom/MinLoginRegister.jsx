import Router, { useRouter } from 'next/router'
import { LOGIN, REGISTER } from '~/utilities/sites-url'
import { connect } from 'react-redux'
import useLocalStorage from '~/hooks/useLocalStorage'
import useLanguage from '~/hooks/useLanguage';

// 登录注册链接
const MinLoginRegister = ({ auth, tipText, routerPath = '/' }) => {
	const { i18Translate } = useLanguage();
	const router = useRouter();
	const { isAccountLog } = auth


	const [loginCallBack, setLoginCallBack] = useLocalStorage('loginCallBack', '/');

	const goLogin = (e) => {
		e.preventDefault();
		setLoginCallBack(router?.asPath)
		Router.push(LOGIN);
	}

	const goRegister = (e) => {
		e.preventDefault();
		setLoginCallBack(router?.asPath)
		Router.push(`${REGISTER}`)
	}
	if (isAccountLog) return null
	return (
		<>
			<div onClick={(e) => goLogin(e)} style={{ display: 'inline-block' }}>
				<a href={LOGIN} className='pub-color-link'>
					{i18Translate('i18MenuText.Login', 'Login')}
				</a>&nbsp;{i18Translate('i18SmallText.or', 'or')}&nbsp;
			</div>
			<div className='pub-color-link' onClick={(e) => goRegister(e)} style={{ display: 'inline-block' }}>
				<a href={`${REGISTER}`} className='pub-color-link'>
					{i18Translate('i18MenuText.register', 'Register')}
				</a>
				&nbsp;
			</div>
		</>
	)
}

export default connect(state => state)(MinLoginRegister)