import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import { login, checkIsAccountLog, profileData } from '~/store/auth/action';
import { setUnpaidOrder } from '~/store/orderStore/action';
import { setPageLoading } from '~/store/setting/action';

import OrderRepository from '~/repositories/zqx/OrderRepository';
import QuoteRepositry from '~/repositories/zqx/QuoteRepositry';
import AccountRepository from '~/repositories/zqx/AccountRepository';
import { setToken } from '~/repositories/Repository';

import { getExpiresTime } from '~/utilities/common-helpers';
import useLocalStorage from '~/hooks/useLocalStorage'

import useEcomerce from '~/hooks/useEcomerce';

export default function useAccount(props) {

    const { useAddMoreCart, setCurCartDataHok } = useEcomerce();
		
		
    const reduxData = useSelector(state => state);
    const { auth, orderStore, ecomerce } = reduxData
    // const { allUnpaidOrder } = orderStore
    const { isAccountLog } = auth
    const [cookies, setCookie] = useCookies(['cart', 'auth']);
    const { account } = cookies;

    const [noUnpaidOrder, setNoUnpaidOrder] = useLocalStorage('noUnpaidOrder', '');
		const [quoteHistoryLoc, setQuoteHistoryLoc] = useLocalStorage('quoteHistoryLocal', []) // 询价历史记录 
		
    const dispatch = useDispatch();

    const syncCart = async (authorization) => {
        useAddMoreCart(
            ecomerce.cartItems,
            {
                cartNo: -1,
                newToken: authorization,
            }
        );
    }

    const afterLogin = async (authToken) => {
        const authorization = authToken || auth.token;
        syncCart(authorization);
    }

    const checkPaymentPending = async () => {
        // if(noUnpaidOrder === 'yes' && allUnpaidOrder?.length > 0) return []
        // 登录后才调用未支付订单检查
        // if(isAccountLog) {
            const params = {
                pageSize: 50,
                pageNum: 1,
                status: 1,
                notNeedAddition: 0,
            }
            const res = await OrderRepository.getOrderList(params, account?.token);
            if(res?.code === 0) {
                const { data } = res?.data || []
                dispatch(setUnpaidOrder(data || []));
                if(data?.length === 0) {
                    setNoUnpaidOrder('yes')
                }
            } else {
                dispatch(setUnpaidOrder([]));
            }
        // }
    }
    // 登录了，没有联系信息才保存
    const accountUpdateProfile = async (params) => {
        if(isAccountLog) {
            const resProfile = await AccountRepository.getProfile(auth.token);
            if(!resProfile?.data?.country) {
                await AccountRepository.updateProfile(params, auth?.token);
            }
        }
    }
    // 保存用户信息
    const saveProfile = async (token) => {
        if (!token){
            return false;
        }
        const res = await AccountRepository.getProfile(token);
        if (res?.code === 0) {
            dispatch(profileData(res.data));
            setCookie('profileData', {
               ...res?.data
            }, { path: '/' });
        }
    }
    // 账号登录和密码登录完成后，都需要执行的操作
    /**
     * @param  isAccountLog 账号登录或者匿名登录
     */
    const handAllLoginData = ({ res, isAccountLog, account }) => {
        if (res?.code === 0) {
            const token = res?.data
            setToken(token);
            setCookie('account', {
                token,
                account,
                isAccountLog,
                isLoggedIn: isAccountLog,
            }, { path: '/', expires: getExpiresTime(isAccountLog ? 0.5 : 30) });
						saveProfile(token)
						setCurCartDataHok({}) // 删除当前购物车数据
        }
    }
    // 处理账号登录后的数据返回
    const handleLoginToken = (res, account, accountType=1, callBack) => {
			console.log(res, account, accountType, '处理账号登录后的数据返回---del')
        const { data } = res
        setToken(data);
        dispatch(checkIsAccountLog(true));
        setCurCartDataHok({}) // 删除当前购物车数据
				saveProfile(data)
        setTimeout(
            function () {
                dispatch(login(data, account, accountType));
                setCookie('account', {
                    token: data,
                    account,
                    isAccountLog: true,
                    isLoggedIn: true,
                    accountType, // facebook: 2, gg: 3 (账号密码登录： 默认1)
                }, { path: '/' , expires: getExpiresTime(0.5)}); // 有效期半天

                afterLogin(data);
                setCookie('email', account, { path: '/' });
                if(callBack) {
                    callBack()
                }
            }.bind(this),
            0
        );
    }

    // 匿名登录
    const anonymousAuthLoginHooks = async () => {
        const res = await AccountRepository.anonymousAuth();
        handAllLoginData({ res, isAccountLog: false, account: {}  })
				return res
    }
		// 如果询价邮箱和登录邮箱一致，未登录的询价绑定到账户
		const bindQuoteList = async (token) => {
			const inquiryId = quoteHistoryLoc?.map(i => i?.inquiryId)?.filter(Boolean);
			if(inquiryId?.length === 0) return
			const res = await QuoteRepositry.apiAddHistoryToUser(token, [...new Set(inquiryId)])
			if (res?.code === 0) {
				setQuoteHistoryLoc([]) // 绑定成功，清空本地询价记录
			}
		}

    return {
        checkPaymentPending,
        accountUpdateProfile,
        saveProfile,
        handleLoginToken,
        anonymousAuthLoginHooks,
				handAllLoginData,
				bindQuoteList,
        async useHandleLogin(loginData, callBack) {
            dispatch(setPageLoading(true));
            const { account, password, recaptcha, isRemember, languageType, token } = loginData

            const res = await AccountRepository.loginRequest({
                account,
                password,
								languageType,
								token,
                v: 2,
                'g-recaptcha-response': recaptcha
            });
						// dispatch(setPageLoading(false));
            setCurCartDataHok({}) // 删除当前购物车数据
            if(isRemember) {
                setCookie('rememberPassword', {
                    account,
                    password,
                }, { path: '/', expires: getExpiresTime(30) });
            } else {
                setCookie('rememberPassword', {}, { path: '/' });
            }
            // callBack(res)
            if (res?.code == 0) {

                // handleLoginToken(res)
                const { data } = res
                setToken(data);
                dispatch(checkIsAccountLog(true));
                setTimeout(
                    function () {
                        const accountType = 1
                        dispatch(login(data, account, accountType));
                        setCookie('account', {
                            token: data,
                            account,
                            isAccountLog: true,
                            isLoggedIn: true,
                            accountType, // facebook: 2, gg: 3 (账号密码登录： 默认1)
                        }, { path: '/' , expires: getExpiresTime(0.5)});
    
                        afterLogin(data);
                        setCookie('email', account, { path: '/' });
                        callBack(res)
                    }.bind(this),
                    2
                );
                // 保存用户信息
                saveProfile(data)
								bindQuoteList(data)
            } else {
								dispatch(checkIsAccountLog(false));
                callBack(res)
            }
        }
    }
}