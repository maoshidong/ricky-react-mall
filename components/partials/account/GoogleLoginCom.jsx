import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { setPageLoading } from '~/store/setting/action';

import AccountRepository from '~/repositories/zqx/AccountRepository';
import useAccount from '~/hooks/useAccount';

import jwtDecode from "jwt-decode";
import { GoogleOAuthProvider, useGoogleLogin, GoogleLogin } from '@react-oauth/google';


// 不要删  组件结构：确保 GoogleOAuthProvider 和使用 Google OAuth 的组件都在同一个 React 渲染树中。
// 	关键点
// scope: 确保在 scope 中包含 openid，这样 Google 才会返回 id_token。
// id_token: 这是一个 JWT，可以直接使用或解析以获取用户信息。
// access_token: 这是用于 API 调用的 Bearer token，通常不是 JWT 格式。

// accessType: 'offline' 和 prompt: 'consent' 是用于 OAuth 2.0 授权请求的参数。
// accessType: 'offline'：表示应用请求离线访问权限，允许它在用户未在线时仍能访问其数据。这通常意味着会获取一个刷新令牌。
// prompt: 'consent'：指示授权服务器始终要求用户同意授权，即使用户之前已经授权。这用于确保用户清楚应用正在请求访问其信息。

const GoogleLoginComponent = ({ onLoginCallback }) => {
	const dispatch = useDispatch();
	const { handleLoginToken } = useAccount();


	// customerType: facebook: 1, 谷歌: 2  accountType：  facebook: 2, 谷歌: 3 (账号密码登录： 默认1)

	// const gugeClientId = "442651506335-ghbn7h7cr7ma83uvt5uamk4tg84um7uh.apps.googleusercontent.com" // 旧的
	// const gugeClientId = "263173349798-0sg9dt7mbsd9fo624n6cfn04rc3736f6.apps.googleusercontent.com" // 新的-错误的谷歌登录邮箱   赞 (wz136229605@gmail.com)
	// 谷歌：  客户端 ID     	// 客户端密钥 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
	const gugeClientId = "327096280454-3bkjnq448g1fcuvsl80jc99luhisc58d.apps.googleusercontent.com" // 新的
	return <GoogleOAuthProvider
		clientId={gugeClientId}
		// prompt='consent'
		prompt='select_account'
		ux_mode='popup' // or 'redirect'
		locale="en"
		auto_select={false}
		logo_alignment="center"
		width={'100%'}
		style={{ width: '100%' }}
	>
		<GoogleLogin
			width={'100%'}
			isSignedIn={true}
			auto_select={false}
			prompt='select_account'
			ux_mode='popup' // popup or 'redirect'   使用 Google 登录按钮的用户体验流程
			// promptMomentNotification={}
			onSuccess={async (response) => {
				console.log('response-gglogin', response)
				const accessToken = response.credential;
				const userObject = jwtDecode(accessToken);
				console.log('response-userObject', userObject)
				// return

				dispatch(setPageLoading(true));
				const accountType = 3
				const params = {
					email: userObject.email, accessToken, customerType: 2, accountType,
				}

				const res = await AccountRepository.checkOtherLogin(params);
				dispatch(setPageLoading(false));
				if (res?.code === 0) {
					handleLoginToken(res, userObject.email, accountType, onLoginCallback)
				}

			}}
			onError={error => console.log('error-gglogin')}
		/>
	</GoogleOAuthProvider>
}

export default GoogleLoginComponent