import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import FacebookLogin from 'react-facebook-login';
import { setPageLoading } from '~/store/setting/action';

import AccountRepository from '~/repositories/zqx/AccountRepository';
// import { getFaceBookAppid } from "~/utilities/easy-helpers"
import useAccount from '~/hooks/useAccount';


const FacebookLoginComponents = ({ onLoginCallback }) => {

	const [isShowFaceBook, setIsShowFaceBook] = useState(false) // 解决在每次进入页面时都能正常加载和使用，
	const dispatch = useDispatch();
	const { handleLoginToken } = useAccount();

	useEffect(() => {
		setIsShowFaceBook(true)
	}, [])

	// customerType: facebook: 1, 谷歌: 2  accountType：  facebook: 2, 谷歌: 3 (账号密码登录： 默认1)
	const responseFacebook = async (response) => {
		const accountType = 2
		// 处理登录成功的响应
		dispatch(setPageLoading(true));
		const { id, email, accessToken, userID, name } = response // facebook返回的数据
		const params = {
			email, accessToken, userId: userID, userName: name, accountType,
		}
		if (!id) {
			dispatch(setPageLoading(false));
			return
		}

		const res = await AccountRepository.checkOtherLogin(params);
		dispatch(setPageLoading(false));
		if (res?.code === 0) {
			handleLoginToken(res, email, accountType, onLoginCallback)
		}
	}
	{
		/*测试环境facebook appId: 422368536950245*/
		/*生产环境facebook appId: 342847434974927*/
	}
	// 谷歌：  客户端 ID  新的(.com) 327096280454-3bkjnq448g1fcuvsl80jc99luhisc58d.apps.googleusercontent.com   263173349798-0sg9dt7mbsd9fo624n6cfn04rc3736f6.apps.googleusercontent.com
	// 客户端密钥 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
	return (
		<div>
			{
				isShowFaceBook && <FacebookLogin
					appId="342847434974927"
					// appId={getFaceBookAppid()}
					autoLoad={false}
					isSdkLoaded={true}
					fields="name,email,picture"
					callback={(res) => responseFacebook(res)}
					cssClass="facebook-login-button"
					icon={<span className="facebook-google-1"></span>}
					textButton="Sign in with Facebook"
					disableMobileRedirect={true} // 以防止 Facebook 自动重定向到移动设备上的应用程序。
					language="en"
				/>
			}
		</div>

	)
}

export default FacebookLoginComponents