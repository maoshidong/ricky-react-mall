import { useState, useEffect, useRef } from 'react';
import useLanguage from '~/hooks/useLanguage';
import { I18NEXT_LOCALE } from '~/utilities/constant'

// 或者安装@cloudflare/turnstile实现
const CloudflareTurnstileCom = ({ onVerify, isErr, isShowTip = true }) => {
	const { getDomainsData, i18Translate } = useLanguage();
	const [curToken, setCurToken] = useState('');
	const [initCom, setInitCom] = useState(false); // 是否初始化完成
	const cfRef = useRef(null);
	const tipText = i18Translate('i18Form.cfCaptcha', 'Please fill out the CAPTCHA and try again.')
	useEffect(() => {
		//确保 Turnstile 的 JavaScript 脚本只被加载一次   Ensure Turnstile script is loaded only once  或者在 _document.js 中添加   <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
		// if (!document.querySelector('script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]')) {
		// 	const script = document.createElement('script');

		// 	script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
		// 	// script.src = `https://challenge.cloudflare.com/cdn-cgi/scripts/7089c43e/cloudflare-static/email-decode.min.js`;
		// 	script.async = true;
		// 	document.body.appendChild(script);
		// }
		// return () => {
		// 	document.body.removeChild(script);
		// };
	}, []);
	{/* <Spin size="small" spinning={!Adddress} /> */ }
	const SITE_KEY = "0x4AAAAAAAJDQfB5GfDuDj5b"

	const renderTurnstile = () => {
		if (typeof window !== 'undefined' && window.turnstile) {

			window.turnstile.render(cfRef.current, {
				sitekey: SITE_KEY,
				callback: (token) => {
					// 处理成功回调
					console.log('Turnstile successful. Token:----del', token);
					onVerify(token)
					setCurToken(token)
					setInitCom(true)
					// 在这里可以处理 token，比如发送到服务器进行验证
				},
				errorCallback: () => { },
			});
		}
	};

	useEffect(() => {
		renderTurnstile();

		// const handleVerify = () => {
		// 	const token = document.querySelector('.cf-turnstile').getAttribute('data-token');
		// };

		// window.addEventListener('cf-turnstile:verified', handleVerify);
		// return () => {
		// 	window.removeEventListener('turnstile:verified', handleVerify);
		// };
	}, []);

	const reloadTurnstile1 = () => {
		if (cfRef.current) {
			console.log('isErr--del', '先移除旧的组件')
			const el = cfRef.current;
			// 先移除旧的组件
			el.innerHTML = '';
			// 重新设置数据属性或重新初始化
			el.setAttribute('data-sitekey', SITE_KEY);
			el.setAttribute('data-lang', I18NEXT_LOCALE.en);
			// 可以添加其他重新加载逻辑
		}
	};

	useEffect(() => {
		// 注意： 点击后马上设置为false, 验证错误后为true, 才能重新加载
		if (isErr) {
			if (typeof window !== 'undefined' && window.turnstile && initCom) {
				window.turnstile.reset(cfRef.current); // 重置 Turnstile
				onVerify('')
				setCurToken('')
			}

			// renderTurnstile()
		}
	}, [isErr])

	// 站点密钥 0x4AAAAAAAJDQfB5GfDuDj5b     密钥 0x4AAAAAAAJDQWLUiLKTAlRp5XuL1zb8IiE  getDomainsData()?.defaultLocale

	// const [isCfErr, setIsCfErr] = useState(false); // 是否验证错误
	// const [cfToken, setCfToken] = useState(''); // cf人机验证通过token
	// const [isShowCfToken, setIsShowCfToken] = useState(false); // 密码错误3次以后，显示验证码，输入10次以后，账号锁定30分钟
	// const handleVerify = async (token) => {
	// 	setCfToken(token)
	// };
	// token: cfToken,  languageType: getDomainsData()?.defaultLocale,

	return (
		<div>
			<div
				ref={cfRef}
				className="cf-turnstile"
				data-sitekey={SITE_KEY}
				// data-checkpoint='a65d60882cae56fc0a8df5003e6f1ceb'
				data-lang={I18NEXT_LOCALE.en}
				style={{ height: '65px', borderRadius: '6px' }}
			></div>
			{(isErr && isShowTip && !curToken) && <div className='mt5 pub-danger pub-font13'>{tipText}</div>}
		</div>
		// <div className="turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}></div>
	);
}

export default CloudflareTurnstileCom