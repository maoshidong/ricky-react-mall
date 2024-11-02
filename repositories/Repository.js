import axios from 'axios';
import Cookies from 'js-cookie';
import Router from 'next/router';
import { getCurrentCurrency, getCurrentLanguage } from './Utils';
import { globalData } from '~/utilities/global-data';
import { LOGIN } from '~/utilities/sites-url';

export const baseDomain = 'https://www.origin-ic.com'; // API for products 
export const basePostUrl = 'http://localhost:1337'; // API for post  http://localhost:1337 http://47.243.250.5:1337
export const baseStoreURL = 'http://localhost:1337'; // API for vendor(store) http://localhost:1337 http://47.243.250.5:1337

// 获取 cookie
const myCookie = Cookies.get('account');
// const myCookie1 = JSON.parse(myCookie || '')
// import Cookies from 'js-cookie';
let currentAuthToken = null;
let userAgent = {};

export const setToken = (token) => {
    currentAuthToken = token;
}

export const setUserAgent = (agent) => {
    userAgent = agent;
}
export const customHeaders = {
    Accept: 'application/json',
};

// 注意：是否需要更新staticData, 热卖、推荐、折扣 2天刷一次,  filter暂时不要静态的   127.0.0.1:8080
// 注意：现在部署后需要清楚缓存？
// 重启服务器或者数据库造成商城和官网服务断的,需要重新启动       cartNo: 0 检查修改为准确的
// 更新： 所有分类AllCatalogTree,  分类有变化时， 更新FooterSeo
// 打包配置 
// export const baseUrl = `/static`;
// export const baseStaticUrl = `/static`;
// export const backendServerUrl = `/app/api`;
// export const commonUploadUrl = `${backendServerUrl}/common/webUpload`;

// 部署前更新语言包 - 目前需要

const HOST_DOMAIN = 'https://www.origin-ic.com';
const HOST = 'http://47.243.250.5:8088'; // 外网
const HOST1 = 'http://172.31.101.11:8088'; // 内网
const TEST_HOST = 'http://192.168.3.146:8088'; // 3.146   
const TEST_HOST1 = 'http://192.168.3.155:8088';

export const baseUrl = HOST_DOMAIN + `static`;
export const baseStaticUrl = HOST_DOMAIN + `static`;
export const backendServerUrl = HOST;
export const commonUploadUrl = `${backendServerUrl}/common/webUpload`;


// export const baseUrl = `http://172.0.0.1:8088/static`;
// export const baseStaticUrl = `http://172.0.0.1:8088/static`;
// export const backendServerUrl = `http://172.0.0.1:8088/app/api`;
// export const uploadQuoteUrl = `${backendServerUrl}/common/webUpload`;


// Rendered cell should include style property for positioning.
// Malformed UTF-8 data:  const decryptOrderQuery = decrypt(queryOrderId)  $ node -v   v16.19.1  宝塔 node Got "16.16.0"   i18next-parser
// error cheerio@1.0.0: The engine "node" is incompatible with this module. Expected version ">=18.17". Got "16.16.0"
// error Found incompatible module.
// info Visit https://yarnpkg.com/en/docs/cli/install for documentation about this command
// 需要测试的  订单打印 发货地跟着站点管理走？  ，     emailQuoteIds=1266,1267   1101,1103 
// 联系我们人机验证, addToConcat
// 所有banner按照腾讯的bgc,  		// encodeURIComponent()

// https://www.origin-ic.com/products/detail/25QHTF22-57.363667-OE/13498212
// 引荐来源网页
// https://www.origin-ic.com/products/detail/25QHTF22-57.363667-PD/13566532

// 找中文的人机验证 - 管理端单元格上下滑动效果   
// 要在 Cloudflare 中更新 DNS TXT 记录以验证域名， facebook-domain-verification=okvv5zgkq4s3nwguhhj8hdjk20h52x  改为  facebook-domain-verification=okvv5zgkq4s3nwguhhj8hdjk20h52x
// 修复：用户端表头的问题; 换成右图这种导航类型，鼠标放上去展示，非点击； 每一层都可以点击
// 面板设置默认图模块; 所有页面banner图更换； Trans 翻译 带标签元素问题；


const axiosInstance = axios.create({
    baseUrl,
    headers: {
        ...customHeaders
    },
})
// 添加请求拦截器
axiosInstance.interceptors.request.use(function(config) {
    let lng = 'en'
    let cuy = 'USD'
    const isBrowser = global?.location

    if(isBrowser) {
        lng = getCurrentLanguage(global?.location?.href)
        cuy = getCurrentCurrency(global?.location?.href)
    }else {
        lng = globalData.lng
        cuy = globalData.cuy
    }

    // config.headers['accept-language'] = 'zh'  // 先拿参数 languageType 'zh'
    // config.headers['accept-currency'] = 'RMB'  // Currency 'RMB'
    config.headers['accept-language'] = (lng == 'en' || lng == 'zh') ? lng : 'en'  // 先拿参数 languageType 'zh'
    config.headers['accept-currency'] = (cuy == 'RMB' || cuy == 'USD') ? cuy : 'USD'  // Currency 'RMB'

    return config
})
// 添加响应拦截器
axiosInstance.interceptors.response.use(function (res) {
    const isBrowser = global?.location
		// 账户停用
    if(res?.data?.code === 10021) {
        // res.data.shouldRedirectToLogin = true;
        Cookies.set('showAccountTip', true)
        Cookies.remove('account')
        if(isBrowser) {
            Router.push(LOGIN)
        }
    }
		// 账户禁用
    if(res?.data?.code === 404) {
        // res.data.shouldRedirectToLogin = true; // 在服务器端，你可以返回一个特定的状态码或标志，以便在客户端执行相应的跳转
        Cookies.remove('account')
        if(isBrowser) {
            Router.push(LOGIN)
        }
    }
    return res;
  }, function (error) {
    // 例如，处理网络错误或服务器返回的状态码不是 2xx 的情况
    // if (error?.res && error?.res?.status === 401) {
    //   return Promise.reject(error);
    // }
  });

export default axiosInstance

const handleStaleDated = () => {
    // currentAuthToken = null
    // localStorage.clear();
    // sessionStorage.clear();
    // document.cookie = "cookieName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    Router.push(LOGIN);
}

export const postAuthorizeRequest = async (url, data, token) => {
    const response = await axiosInstance.post(url, data, {
        headers: {
            Authorization: `Bearer ${token || currentAuthToken}`,
        }
    });
    if (response?.data?.code === 401) {
        handleStaleDated()
    }
    return response
}
export const postAuthorizeRequestBlob = async (url, data, token) => {
    const response = await axiosInstance.post(url, data, {
        responseType: 'arraybuffer',  // 告知 axios 期望接收二进制数据流
        headers: {
            // responseType: 'blob',
            contentType: 'application/pdf',
            // 'Content-Type': 'multipart/form-data', // 确保 FormData 被正确解析
            // Accept: 'multipart/form-data',
            Authorization: `Bearer ${token || currentAuthToken}`,
        },
    });
    if (response?.data?.code === 401) {
        handleStaleDated()
    }
    return response
}

export const getAuthorizeRequest = async (url, token=false) => {
    const response = await axiosInstance.get(url,{
        headers: {
            Authorization: `Bearer ${token || currentAuthToken}`,
        }
    });
    if (response?.data?.code === 401) {
        handleStaleDated()
    }
    return response;
}

export const getAuthorizeRequestBlob = async (url, data, token=false) => {
    const response = await axiosInstance.get(url, {
        params: {...data},
        headers: {
            Authorization: `Bearer ${token || currentAuthToken}`,
        },
        responseType: 'blob',
    });
    if (response?.data?.code === 401) {
        handleStaleDated()
    }
    return response;
}

export const serializeQuery = (query) => {
    return Object.keys(query)
        .map(
            (key) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`
        )
        .join('&');
};


// 注意：是否需要更新staticData, 热卖、推荐、折扣 2天刷一次,  filter暂时不要静态的   127.0.0.1:8080
// 重启服务器或者数据库造成商城和官网服务断的,需要重新启动       cartNo: 0 检查修改为准确的
// 更新： 所有分类AllCatalogTree,  分类有变化时， 更新FooterSeo
// 打包配置 
// export const baseUrl = `/static`;
// export const baseStaticUrl = `/static`;
// export const backendServerUrl = `/app/api`;
// export const uploadQuoteUrl = `${backendServerUrl}/inquiry/import_excel`;
// export const commonUploadUrl = `${backendServerUrl}/common/webUpload`;

// const HOST_domain = 'https://www.origin-ic.com/';
// const HOST = 'http://47.243.250.5:8088';
// const TEST_HOST = 'http://192.168.3.146:8088'; // 3.86 -> 10.8 -> 3.146
// const TEST_HOST1 = 'http://192.168.3.155:8088'; // 3.86 -> 10.8 -> 3.146


// export const baseUrl = HOST + `static`;
// export const baseStaticUrl = HOST + `static`;
// export const backendServerUrl = HOST + `app/api`;
// // export const backendServerUrl = TEST_HOST;
// export const uploadQuoteUrl = `${backendServerUrl}/inquiry/import_excel`;
// export const commonUploadUrl = `${backendServerUrl}/common/webUpload`;

// 本地环境配置地址
// export const baseUrl = `${baseDomain}/static`;
// export const baseStaticUrl = `http://localhost/static`;
// export const backendServerUrl = `http://localhost/app/api`;
// export const uploadQuoteUrl = `${backendServerUrl}/inquiry/import_excel`;
// export const baseRequestUrl = `http://localhost:1337/api`; // 已经全部去掉该strapi接口的使用
// export const baseAjaxRequestUrl = `http://localhost:1337/api`;  // 已经全部去掉该strapi接口的使用,

// export const baseUrl = `http://120.78.91.46/static`;
// export const baseStaticUrl = `http://120.78.91.46/static`;
// export const baseRequestUrl = `http://120.78.91.46/strapi/api`; // 已经全部去掉该strapi接口的使用
// export const baseAjaxRequestUrl = `http://120.78.91.46/strapi/api`;
// export const backendServerUrl = `http://120.78.91.46/app/api`;
// export const uploadQuoteUrl = `${backendServerUrl}/inquiry/import_excel`;