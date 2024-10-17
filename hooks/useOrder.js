import React, { useState, useEffect } from 'react';

import { ORDER_STATUS } from '~/utilities/constant'
import { OrderRepository } from '~/repositories';

import useLanguage from '~/hooks/useLanguage';
import useLocalStorage from '~/hooks/useLocalStorage';

export default function useOrder() {
    const { getDomainsData } = useLanguage()
		const [pwListCok, setPwListCok] = useLocalStorage('pwListLoc', []);
    // const { isAccountLog } = useSelector(state => state.auth)
    const [ payWayList, setPayWayList ] = useState([])


    // (订单完成， || 订单取消) 并且没账号登录   就进行屏蔽（订单用户等信息）;  
    // (订单完成， || 订单取消)，登录了，但是不是自己的订单也不能查看更多信息   IsHaveUserFlag:为1的时候 就是属于当前人的订单
    const isShowOrderInfo = order => {
        const { status, isHaveUserFlag } = order || {}
        if((status === ORDER_STATUS.fulfillment || status === ORDER_STATUS.canceled) && isHaveUserFlag !== 1
            // ((status === ORDER_STATUS.fulfillment || status === ORDER_STATUS.canceled) && !isAccountLog)
        ) {
           return false 
        }
        return true
    }
    // 获取支付方式
    const getPayWayList = async () => {
        const res = await OrderRepository.apiPayWayList(getDomainsData()?.defaultLocale)
        if(res?.code === 0) {
            // const arr = res?.data?.map(item => {
            //     return {}
            // })
            setPayWayList(res?.data)
						setPwListCok(res?.data)
        }
    }
    // 根据支付类型返回对应的支付对象
    const getPayWayItem = (payWayId, arr) => {
        // if(arr?.length > 0) {
            const item = arr?.find(item => item?.payWay === +payWayId)
            return item || {}
        // }
    }


    return {
        payWayList, getPayWayList, getPayWayItem,
        isShowOrderInfo
    }
}