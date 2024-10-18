import React, { useState } from 'react';
import { connect } from 'react-redux';

import { logOut } from '~/store/auth/action';
import { emptyItems } from '~/store/ecomerce/action';
import { checkIsAccountLog } from '~/store/auth/action';
import { setUnpaidOrder } from '~/store/orderStore/action';

import { withCookies } from 'react-cookie';
import AccountRepository from '~/repositories/zqx/AccountRepository';
import { setToken } from '~/repositories/Repository';
import useEcomerce from '~/hooks/useEcomerce';

import Router from 'next/router';

const Logout = ({
    dispatch,
    cookies,
    displayIcon = true,
    label = 'Logout',
    className,
}) => {
    const { setCurCartDataHok } = useEcomerce();

    const [isHoverLogOut, setIsHoverLogOut] = useState(false)
    // 退出登录
    const handleLogout = async (e) => {   
        window?.FB?.logout((res) => console.log(res, '---del'))
        e.preventDefault();
        localStorage.clear();
        sessionStorage.clear();
        setCurCartDataHok({}) // 删除当前购物车数据
        // document.cookie = "cookieName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // 暂时删
        cookies.remove('account', {path:'/'});
        cookies.remove('cart', {path:'/'});
        cookies.remove('wishlist', {path:'/'});
        cookies.remove('quote', {path:'/'});
        cookies.remove('profileData', {path:'/'}); // 用户账号信息
        dispatch(logOut());
        dispatch(emptyItems());
        dispatch(setUnpaidOrder([])); // 清空未支付订单
        dispatch(checkIsAccountLog(false));
        setToken(null)
        Router.push('/')
        await AccountRepository.handleLogout();
    };
    return (
        <li className={className}>
            <a className='pub-flex-align-center' onClick={handleLogout}
                onMouseEnter={() => {
                    setIsHoverLogOut(false)
                }}
                onMouseLeave={() => {
                    setIsHoverLogOut(true)
                }}
            >
                {displayIcon && <i className={isHoverLogOut ? "sptite-logout1" : "sptite-logout2"}></i>}
                <span className='ml10 pub-font14 pub-color555 pub-fontw'>{label}</span>
            </a>
        </li>
    );
}

export default connect(state => state.auth)(withCookies(Logout));

