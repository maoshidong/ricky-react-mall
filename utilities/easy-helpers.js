import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {i18n} from 'next-i18next'
import { globalData } from './global-data';
import CommonRepository from '~/repositories/zqx/CommonRepository';

import { VIDEOS, BLOG, PRODUCT_HIGHLIGHTS, APPLICATION_NOTES, HELP_CENTER, NEWSROOM } from '~/utilities/sites-url';
import { PUB_ARTICLE_TYPE, PUB_RESOURCE_TYPE, PUB_PAGINATION, I18NEXT_LOCALE, I18NEXT_DOMAINS } from '~/utilities/constant';

// import { setFunctionPanelData } from '~/store/app/action';
// import { makeStore } from '~/store/store';
// makeStore().dispatch(setFunctionPanelData(panelRes?.data));

// 通过getServerSideProps的req获取当前域名的defaultLocale
export const getLocale = req => {
    const reqHost = req?.headers?.host || I18NEXT_LOCALE.enHost;
    const curDomainsData = I18NEXT_DOMAINS?.find(item => item.domain === reqHost)
		return curDomainsData?.defaultLocale || I18NEXT_LOCALE.en
    // return reqHost.includes('com') ? I18NEXT_LOCALE.zh : (curDomainsData?.defaultLocale || I18NEXT_LOCALE.en)
}
// 通过window获取当前域名的defaultLocale
export const getWinLocale = () => {
    const domain = typeof window !== 'undefined' ? window?.location?.host : I18NEXT_LOCALE.enHost;
    const curDomainsData = I18NEXT_DOMAINS?.find(item => item?.domain == domain)
		return curDomainsData?.defaultLocale || I18NEXT_LOCALE.en
    // return domain.includes('com') ? I18NEXT_LOCALE.zh : (curDomainsData?.defaultLocale || I18NEXT_LOCALE.en)
}

/**
 * @切换语言
 * @判断设备
 * @管理端面板设置
 */ 
export const changeServerSideLanguage = async (req) => {
    try {
        const locale = req ? getLocale(req) : I18NEXT_LOCALE.en
        globalData.changeLanguage(locale)
				// const translations = {}
        // 切换语言包
        const translations = await serverSideTranslations(locale, ['common'])
				
        // 判断设备         
        const UA = req.headers['user-agent'];
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(UA);
        // const isMobile = Boolean(UA.match(
        //     /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
        //   ))

        // 管理端面板设置
        const panelRes = await CommonRepository.apiGetSysFunctionTypeSonList({
            typeIdList: [2] // typeId: 2 or  typeIdList: [1, 2]
        });

        return {
            ...translations,
            ...panelRes?.data,
            isMobile,
        }
    } catch (error) {
        return null
    }
}

export const changeClientSideLanguage = async (lng=I18NEXT_LOCALE.en,callback) => {
    i18n?.changeLanguage(lng,callback)
}

/**
 * 
 * @param {*} permanent 每个页面getServerSideProps获取是否是账户登录，及token
 * @returns 
 */
export const pageIsAccountLogToken = req => {
	const { account = "" } = req?.cookies
	const isAccountLog = account.trim() !== "" && JSON.parse(account)?.isAccountLog
	const serverToken = account.trim() !== "" && JSON.parse(account)?.token
	const curAccount = account.trim() !== "" && JSON.parse(account)?.account
	return { isAccountLog,	serverToken, curAccount }
}

// 重定向到404
export const redirect404 = (permanent=false) => {      
    return {
        redirect: {
            destination: '/404', // 重定向到 404 页面   
            permanent, // 设为 false 表示临时重定向
        }
    }; 
}

// 重定向到login
export const redirectLogin = (url='/login', params) => {  
    const destinationUrl = params ? `${url}?${params}` : url
    return {
        redirect: {
            destination: destinationUrl, // 重定向到 404 页面  1 是订单列表  
            // destination: `/login?loginCallBack=${type}&${params}`, // 重定向到 404 页面  1 是订单列表  
            permanent: false, // 设为 false 表示临时重定向
        }
    }; 
}

export const getFaceBookAppid = () => {
    if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'local') {
        return process.env.NEXT_PUBLIC_LOCAL_FACEBOOK;
    } else {
        return process.env.NEXT_PUBLIC_PROD_FACEBOOK;
    }
}

// 系列化参数， 记住之前选中的运输方式？  表头慢
// 需要测试加上 languageType 的接口
export const easySerializeQuery = (query) => {
    const res = Object.keys(query)
        // .filter(key => Boolean(query[key]) !== true) // 过滤掉值为null的属性
        .filter(key => query[key] !== null) // 过滤掉值为null的属性
        .map(
            (key) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`
        )
        .join('&');
    return res === '?' ? '' : res
};

// 处理新闻模块getServerSideProps下公共的逻辑
export const newsPagesHelp = (req, query) => {
    const { account="" } = req.cookies
    const serverToken = account.trim() !== "" && JSON.parse(account)?.token
    // url中的分类ids集合, Resource Type
    const typefitIds = query?.typefitIds ? (query?.typefitIds?.split(',')) : []
    const functionIdList = query?.functionIdList ? (query?.functionIdList?.split(',')) : []
    // 选中的供应商
    const manufactureIdList = query?.manufactureIdList?.split(',') || []
    // url的key
    const queryKey = query?.key || ''

    const param = {
        keyword: queryKey,
        pageListNum: query?.pageNum || PUB_PAGINATION?.pageNum,
        pageListSize: query?.pageSize || PUB_PAGINATION?.pageSize,
        typeIdList: typefitIds?.map(item => Number(item)),
        functionIdList: functionIdList?.map(item => Number(item)),
        manufactureIdList: manufactureIdList?.map(item => Number(item)),
        languageType: getLocale(req),
    }
    return {
        serverToken, typefitIds, functionIdList, manufactureIdList, queryKey, param
    }
}


// 判断跳转到哪个文章类型的url
export const getNewsUrl = (newsType, lastUrl) => {
	const { specialProduct, article, appliedNote } = PUB_ARTICLE_TYPE;
	const { companyNews, helpCenter, video } = PUB_RESOURCE_TYPE;
	let href = '/';
	switch (Number(newsType)) {
		case specialProduct:
			href = PRODUCT_HIGHLIGHTS + lastUrl;
			break;
		case video:
			href = VIDEOS + lastUrl;
			break;
		case companyNews:
			href = NEWSROOM + lastUrl;
			break;
		case helpCenter:
			href = HELP_CENTER + lastUrl;
			break;
		case appliedNote:
			href = APPLICATION_NOTES + lastUrl;
			break;
		case article:
			href = BLOG + lastUrl;
			break;
	}
	return href;
}