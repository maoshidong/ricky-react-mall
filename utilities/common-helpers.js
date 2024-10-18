// import moment from 'moment';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx'; // utils writeFile
// import qs from 'qs';
import CryptoJS from 'crypto-js'; // /aes
import { ORDER_STATUS, I18NEXT_LOCALE } from '~/utilities/constant';
import { MANUFACTURER, PRODUCTS_DETAIL } from '~/utilities/sites-url'
import { i18n } from 'next-i18next';
import { getCurrencyInfo } from '~/repositories/Utils';
// import { exportExcelTable } from '~/utilities/excel-export';

import { toFixedFun, calculateTotalAmount, toFixed } from '~/utilities/ecomerce-helpers';

    // 为了减少初始大小？？？
    // 十六位十六进制数作为密钥
    const SECRET_KEY = CryptoJS.enc.Utf8.parse('2ddd3396da14d099');
    // 十六位十六进制数作为密钥偏移量
    const SECRET_IV = CryptoJS.enc.Utf8.parse('cb163a21fbd4447c');
/**
 * 加密方法
 * @param data
 * @returns {string}
 */
// 注意： 加上async， 返回值为promise
export function encrypt(data) {
    // const CryptoJS = await import('crypto-js');
    if (typeof data === "object") {
        try {
            // eslint-disable-next-line no-param-reassign
            data = JSON.stringify(data);
        } catch (error) {
            console.log("encrypt error:", error);
        }
    }
    const dataHex = CryptoJS.enc.Utf8.parse(data || '');
    const encrypted = CryptoJS.AES.encrypt(dataHex, SECRET_KEY, {
        iv: SECRET_IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString();
}

/**
* 解密方法
* @param data
* @returns {string}
*/
export function decrypt(data) {
    // const CryptoJS = await import('crypto-js');
    // return '24001087'
    const encryptedHexStr = CryptoJS.enc.Hex.parse(data || '');
    const str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    const decrypt = CryptoJS.AES.decrypt(str, SECRET_KEY, {
        iv: SECRET_IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}
// 组合url参数
export const buildUrl = async (baseURL, params={}) => {
    const qs = await import('qs');
    const queryParams = qs.stringify(params)
    if(queryParams) {
        return`${baseURL}?${queryParams}`;
    }
    return baseURL
}
// 在 expires 字段中，2024-09-26T07:53:20.000Z 代表的是一个具体的时间点，使用的是 ISO 8601 格式。

// 日期部分：2024-09-26 表示的是年份（2024）、月份（09，即9月）和日期（26）。
// 时间部分：T07:53:20.000Z 中的 T 是一个分隔符，表示日期和时间的开始。07:53:20.000 表示具体的时间，分别是小时、分钟和秒。
// 时区部分：后面的 Z 表示这是一个 UTC（协调世界时）时间，意味着这个时间不受任何时区的影响。
// 过期时间设置 北京时间（CST）比协调世界时（UTC）快8小时
export const getExpiresTime = (day = 1) => {
    // return new Date(new Date().getTime() + 60 * 1000);
    return new Date(new Date().getTime() + 60 * 60 * 24 * 1000 * day);
}
// 下载点击
export const downloadClick = (res, type="'text/xlsx'", name="file.xlsx") => {
    const url = window.URL.createObjectURL(new Blob([res], { type }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', name); // currentBom.fileName
    document.body.appendChild(link);
    link.click();  
}
// 滑动到顶部
export const scrollToTop = () => {
    window.scrollBy({
        top: -window.scrollY,
        left: 0,
    });
}

export const stickyHeader = () => {
    let number =
        window.pageXOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
    const header = document.getElementById('headerSticky');
    const headerPlaceholder = document.getElementById('headerPlaceholder');
    if (header !== null) {
        if (number >= 1) {
            header?.classList.add('header--sticky-top');
            headerPlaceholder?.classList.add('header-placeholder');
        } else {
            header?.classList.remove('header--sticky-top');
            headerPlaceholder?.classList.remove('header-placeholder');
        }
    }
};

export const stickyCatalogs = (defaultNum=100, sticky=1500) => {
    const scrollNum = defaultNum

    let number =
        window.pageXOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

    const header = document.getElementById('catalogs');
    if (header !== null) {
        if (number >= scrollNum) {
            header.classList.add('catalogs__top-fixed');
        } else {
            header.classList.remove('catalogs__top-fixed');
        }
        if (number >= sticky) {
            header.classList.add('catalogs__top-sticky');
        } else {
            header.classList.remove('catalogs__top-sticky');
        }
    }
    const rightCatalogs = document.getElementById('rightCatalogs');
    if (rightCatalogs !== null) {
        if (number >= scrollNum) {
            rightCatalogs.classList.add('rightCatalogs__float');
        } else {
            rightCatalogs.classList.remove('rightCatalogs__float');
        }
    }
};

export const generateTempArray = (maxItems) => {
    let result = [];

    for (let i = 0; i < maxItems; i++) {
        result.push(i);
    }
    return result;
};

export const copy = (link) => {
    let url = link || window.location.href
    var textField = document.createElement('textarea');
    textField.innerText = url;
    document.body.appendChild(textField);
    textField.select();
    var successful = document.execCommand('copy');    // 执行 copy 操作
    textField.remove();
    return successful;
};
export const queryToObj = function (url) {
    let result = {}
    if (url.includes('?')) {
        const urlSplit = url.split('?')
        const len = urlSplit.length - 1
        let queryParam = urlSplit[len] || ''
        queryParam
            .split('&')
            .filter(str => str !== '')
            .forEach(str => {
                const [key, value] = str.split('=')
                result[key] = value
            })
        return result
    }
    return result
}
// 数据是否有相同的产品id
export const hasDuplicateProductId = (array1, array2) => {
    const ids = new Set();
  
    // 遍历第一个数组，将所有 id 存入集合
    for (const obj1 of array1) {
      ids.add(obj1?.productId);
    }
  
    // 遍历第二个数组，检查每个对象的 id 是否已存在于集合中
    for (const obj2 of array2) {
      if (ids.has(obj2?.productId)) {
        return true; // 如果存在相同的 id，则返回 true
      }
    }
  
    return false; // 如果没有相同的 id，则返回 false
  }

export const dateTime = function (datetime) {
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1;
    var date = datetime.getDate();
    return year + '-' + month + '-' + date
}
  // 允许0-9、小数点以及删除键
//   const isValidKey = /[0-9\.]|Backspace|Delete/.test(keyCode);
export const onlyNumber = function (e) {
    // 获取当前按键的 ASCII 码
    const keyCode = e.which ? e.which : e.keyCode;

    // const isValidKey = /[0-9\.]|Backspace|Delete/.test(keyCode);
    // 判断输入值是否为数字或退格键 48: 数字0   8: 回退键
    if (
        (keyCode < 48 || keyCode > 57) && // 0-9
        (keyCode < 96 || keyCode > 106) && // 九宫格数字0-9
        keyCode!== 1 && keyCode!== 8 && keyCode !== undefined ) {

				// 检查是否是回车键 -0 回车不执行preventDefault， 保证回车生效
				if (e.key === 'Enter') {
					return;
				}
        // 阻止默认行为，即不允许用户输入该值
        e.preventDefault();
    }
    // onlyNumberPoint(e)
}

export const onlyNumberPoint = function (e) {
    // 获取当前按键的 ASCII 码
    const keyCode = e.which ? e.which : e.keyCode;
    // 判断输入值是否为数字或退格键
    if (
        (keyCode < 48 || keyCode > 57) && // 0-9
        (keyCode < 96 || keyCode > 106) && // 九宫格数字0-9
        keyCode!== 46 && keyCode!== 13 && keyCode!== 8) {
        // 阻止默认行为，即不允许用户输入该值
        e.preventDefault();
    }

      // 判断小数点是否已被输入
        const currentValue = e.target.value;
        const currentPointIndex = currentValue.indexOf('.');
        // 如果小数点已存在且当前输入的是小数点，则阻止默认行为
        if (currentPointIndex !== -1 && keyCode === 46) {
            e.preventDefault();
        }
}
// 在网站的URL中，通常需要将一些特殊字符转义成连字符 -，以确保URL的正确性和兼容性。以下是常见需要转义的特殊字符：
// 空格 ( ) - 在URL中应该被转义为 %20，但根据需要有时也会转义为 -。
// 逗号 (,) - 在URL中应该被转义为 %2C，但有时也会转义为 -。
// 斜杠 (/) - 在URL中应该被转义为 %2F，但有时也会转义为 -。
// 井号 (#) - 在URL中应该被转义为 %23，但有时也会转义为 -。
// 冒号 (:) - 在URL中应该被转义为 %3A，但有时也会转义为 -。
// 括号 (( 和 )) - 在URL中应该被转义为 %28 和 %29，但有时也会转义为 -。
// 星号 (*) - 在URL中应该被转义为 %2A，但有时也会转义为 -。
// 美元符号 ($) - 在URL中应该被转义为 %24，但有时也会转义为 -。
// 百分号 (%) - 在URL中应该被转义为 %25，但有时也会转义为 -。
// 与号 (&) - 在URL中应该被转义为 %26，但有时也会转义为 -。
// 加号 (+) - 在URL中应该被转义为 %2B，但有时也会转义为 -。
// 等号 (=) - 在URL中应该被转义为 %3D，但有时也会转义为 -。
// 方括号 ([ 和 ]) - 在URL中应该被转义为 %5B 和 %5D，但有时也会转义为 -。
// 分号 (;) - 在URL中应该被转义为 %3B，但有时也会转义为 -。
// 单引号 (') 和 双引号 (") - 在URL中应该被转义为 %27 和 %22，但有时也会转义为 -。
// 小于号 (<) 和 大于号 (>) - 在URL中应该被转义为 %3C 和 %3E，但有时也会转义为 -。
// 问号 (?) - 在URL中应该被转义为 %3F，但有时也会转义为 -。
// 反斜杠 (\) - 在URL中应该被转义为 %5C，但有时也会转义为 -。
// 点号 (.) - 在URL中通常被保留，但根据需要也可能被转义为 -。
// 这些字符如果不进行转义或保护，可能会导致URL解析错误或者安全问题。因此，根据实际情况和需求，有时会选择将这些字符转义为连字符 -，以确保URL的可靠性和适用性。
/**
*@全站所有的url中不要有特殊符号，所有符号转义成-
*例如：制造商名称、型号等等中带有任何特殊符号
*空格 , / # : （ ）* $ % & + = [ ] ; ' " < > ? \ ® _ . 
®(&reg)
*1. 如果特殊符号在开头和末位，直接不要
*2. 有多个特殊符号连在一起，只留一个 
*3. 每次前后不能有-
*全站都是这个规则，以后开发任何新的也是这个规则
*/
export const isIncludes = (string, symbol) => {
    let returnStr = string || ''
    // 问题可能在于 %28 的替换。在 URI 编码中，%28 表示左括号 (，而你的代码中替换的是 encodeURIComponent(string) 后的结果，这个结果本身已经包含了对 ( 的编码处理。如果你想将 ( 替换为 -，可以在 encodeURIComponent 之前替换
    // 将所有的 ( 替换为 - 将所有的 ) 替换为 -
    returnStr = returnStr.replace(/\(/g, '-').replace(/\)/g, '-')
    .replace(/'/g, '-').replace(/"/g, '-')
    .replace(/®/g, '-')      
		// encodeURIComponent(宜普公司为轻型混合动力汽车和电动汽车应用推出高功率转换器)
    // .replace(/%28/g, '-')
    // .replace(/%29/g, '-')
    returnStr = returnStr
    .replace(/%20/g, '-').replace(/%2C/g, '-').replace(/%2F/g, '-').replace(/%23/g, '-')
    .replace(/%3A/g, '-') // 中文冒号
    .replace(/%EF%BC%9A/g, '-') // 英文冒号
		.replace(/%2A/g, '-').replace(/%24/g, '-').replace(/%25/g, '-')
    .replace(/%26/g, '-').replace(/%2B/g, '-').replace(/%3D/g, '-').replace(/%5B/g, '-')
    .replace(/%5D/g, '-').replace(/%3B/g, '-').replace(/%27/g, '-').replace(/%22/g, '-')
    .replace(/%3C/g, '-').replace(/%3E/g, '-').replace(/%3F/g, '-').replace(/%5C/g, '-')
    .replace(/%AE/g, '-').replace(/%5F/g, '-')
    // .replace(/%2E/g, '-')  // 点号转义成-;
    .replace(/\./g, '-')  // 将点号转义成-
    // 去掉开头和结尾的连字符，并将连续的连字符替换为单个连字符

    returnStr = returnStr?.replace(/^-+|-+$/g, '').replace(/-+/g, '-');

    // 对应的特殊字符改为-
    if(returnStr?.includes('?')) {
        returnStr = returnStr.replace(/\?/g, "-")
    }
    if(string?.includes('%')) {
        returnStr = returnStr.replace(/%/g, "-")
    }
    if(string?.includes('_')) {
        returnStr = returnStr.replace(/_/g, "-")
    }

    if(string?.includes('/')) {
        returnStr = returnStr.replace(/\//g, "-")
		}

		return returnStr.replace(/[^a-zA-Z0-9]+/g, '-'); // 匹配所有非字母和非数字的字符
		// (/#/g, "-"); (' ')->(/\s/g, "-")
    // return string?.includes(symbol) ? string.replace(/[#\s]/g, "-") : string;

}

export const getEnvUrl = url => {
    return '/' + url
}

export const getProductUrl = (manufacturerSlug, productName, productId) => {
    return productId ? 
    (
        manufacturerSlug ? `${PRODUCTS_DETAIL}/${isIncludes(productName)}/${productId}`
                         : `${PRODUCTS_DETAIL}/${isIncludes(productName)}/${productId}`
    )
    : `/products`
}
// parentId没处理
export const handManufacturerUrl = manufacturerSlug => {
    return `${MANUFACTURER}/${manufacturerSlug}`
}

// 统一的时间格式
export const handleMomentTime = (time, type=1) => {
    if(i18n?.language === I18NEXT_LOCALE.zh) {
        if(type === 1) {
            return dayjs(time).format('YYYY年M月D日');
        } else if (type === 2) {
            return dayjs(time).format('YYYY年M月D日 HH:mm:ss');
        }
    } else {
        if(type === 1) {
            return dayjs(time).format('DD MMM, YYYY')
        } else if (type === 2) {
            return dayjs(time).format('DD MMM, YYYY - HH:mm:ss')
        }
    }
    // const date = dayjs().format('YYYY年M月D日 dddd');
    // MMM-简写

}
// 返回状态class
export const getStatusClass = status => {
    let className = 'pub-primary-tag'
    if (status == 1) {
        className = 'pub-tip-tag'
    }
    if (status == 3) {
        className = 'pub-suc-tag'
    }
    if (status == 40) {
        className = 'pub-err-tag'
    }
    return className
}
// export const getStatusClass = record => {
//     const { status } = record
//     const { quantity, sendNum, cancelQuantity } = record?.orderDetails?.[0] || {}
//     let className = 'pub-primary-tag'
//     if (status === 2 || status === 3 || status === 20 || status === 30) {
//         className = 'pub-suc-tag'
//     } else if (quantity - sendNum > cancelQuantity) {
//         className = 'pub-tip-tag'
//     }
//     if (status === 40) {
//         className = 'pub-err-tag'
//     }
//     return className
// }

const iPartiallyShipped = 'Partially Shipped'
const iAllShipped = 'All Shipped'
// 返回状态text
const status = {
    1: 'Payment Pending',
    2: 'Processing',
    3: 'Order Completed',
    10: 'Wait for Delivery',
    20: iPartiallyShipped,
    30: iAllShipped,
    40: 'Canceled'
}
export const getStatusText = record => {
    let statusText = ''
    if(record.status === ORDER_STATUS.partDelivery) {
        const { cancelQuantity } = record?.orderDetails?.[0]
        // 该商品有取消的就是部分发货
        if(cancelQuantity > 0) {
            statusText = iPartiallyShipped
        } else {
            statusText = iAllShipped
        }
    } else {
        statusText = status[record.status]
    }
    return statusText
}

// 计算过期剩余天数
export const getValidityDay = (time) => {
    // 给定的过期时间戳（单位：毫秒）
    const expirationTimestamp = time; // 示例：2021年9月8日
    // 获取当前时间的时间戳（单位：毫秒）
    const currentTimestamp = new Date().getTime();
    // 计算剩余的秒数
    const remainingSeconds = Math.floor((expirationTimestamp - currentTimestamp) / 1000);
    // 计算剩余的天数
    const remainingDays = Math.ceil(remainingSeconds / (24 * 60 * 60));
    return remainingDays
}
// 计算商品价格总和
export const getAllCartPrices = (allCartItems) => {
    let amount = 0
    allCartItems?.map(item => {
        amount+=Number(toFixed(calculateTotalAmount([item]), 2))
    })
    return amount
}

// 计算Rfq数量  fillIndex数量为 Rfq数量
export const helpersRfqQuantity = quoteList => {
    let fillIndex = 0 // 检查第一个数据为空的项
    quoteList.map(item => {
        if(Object.keys(item).length > 0) {
            fillIndex+= 1
        }
    })

    return fillIndex
}

export const helpersFormError = (form, name) => {
    form.setFields([
        {
            name,
            errors: ['Required']
        },
    ]);
}
export const helpersFormNoError = (form, name) => {
    form.setFields([
        {
            name,
            errors: []
        },
    ]);
}
// 邮箱验证
export const helpersValidateEmail = (_, value) => {
    // 如果没有输入值，则直接返回 Promise.resolve()，
    // 表示校验通过（Ant Design 中规定 required 由单独的 rules 完成）
    if (!value) {
        return false;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (emailRegex.test(value)) {
        return true;
        //   return Promise.resolve();
    }
    // 格式不正确时返回 Promise.reject() 并提供错误信息
    return false;
};
// 返回新窗口、禁止爬取外部链接标签属性   供应商官网网址，产品详情页pdf，dj的url
					{/* rel="external nofollow noopener noreferre
                    rel="external" 用于指示链接是指向外部网站或页面的链接。
                    rel="nofollow" 用于告诉搜索引擎不要追踪该链接。
                    rel="noopener" 用于防止打开的新窗口能够访问原始页面的 window.opener 对象。
                    rel="noreferrer" 用于防止打开的新窗口向目标页面发送 Referer 头信息。 */}
					{/* <Link target='_blank' href={record[0].deliveryLink} rel="external nofollow noopener noreferrer"> */}
export const helpersHrefNofollow = href => {
    return {
        href,
        target: '_blank',
        rel: "external nofollow noopener noreferrer",
    }
}

function updateObject(obj, key, value) {
    for (let prop in obj) {
      if (Array.isArray(obj[prop])) {
        helperLanguageName(obj[prop], key, value);
      } else if (typeof obj[prop] === 'object') {
        updateObject(obj[prop], key, value);
      } else {
        // 如果是简单类型，则直接赋值
        obj[key] = value;
      }
    }
  }
// 处理接口返回的中英文数据
export const helperLanguageName = (arr=[], key="name", valueKey="cname") => {
    arr.forEach((item) => {
        if (Array.isArray(item)) {
            helperLanguageName(item, key, value);
        } else if (typeof item === 'object') {
          updateObject(item, key, value);
        } else {
          // 如果是简单类型，则直接赋值
          item[key] = value;
        }
      });
}

export const helpersAn = () => {
    const arr = [];
    // 生成 A-Z
    for (let i = 65; i <= 83; i++) {
        arr.push(String.fromCharCode(i));
    }
    return arr
}
export const helpersO9 = () => {
    const arr = [];
    // 生成 A-Z
    for (let i = 84; i <= 90; i++) {
        arr.push(String.fromCharCode(i));
    }

    // 生成 0-9
    for (let i = 0; i <= 9; i++) {
        arr.push(`${i}`);
    }
    return arr
}
export const helpersAz09 = () => {
    const arr = [];
    // 生成 A-Z
    for (let i = 65; i <= 90; i++) {
        arr.push(String.fromCharCode(i));
    }

    // 生成 0-9
    for (let i = 0; i <= 9; i++) {
        arr.push(`${i}`);
    }
    return arr
}

export const pageHeaderShadow = () => {
    const header = document.getElementById('headerSticky');
    if (header) {
        header?.classList.add('header-sticky-shadow');
    }
}
// 判断是否滚动到底部
export const isScrollButtom = (refCurrent, callback) => {
    const containerHeight = refCurrent.clientHeight; // 容器的高度
    const contentHeight = refCurrent.scrollHeight; // 容器内容的总高度
    const scrollTop = refCurrent.scrollTop; // 容器滚动的距离

    // 判断滚动条是否到达底部
    if (Number(contentHeight - scrollTop - containerHeight) <= 10 ) {
        callback()
    }
}
// json文件，  js实现， 当value的值为空时，  value == key的值
export const fillEmptyValues = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'object') {
        fillEmptyValues(obj[key]);
      } else {
        // obj[key] = '';
        if (obj[key] === '') {
            obj[key] = key;
        }
      }
    }
    return obj
  }
// 也可以使用可以使用递归来遍历 JSON 对象，并在值为空时将其设置为键的值。以下是一个示例的 JavaScript 方法实现：
// export const replaceEmptyValues = (obj) => {
//     for (let key in obj) {
//       if (typeof obj[key] === 'object' && obj[key] !== null) {
//         replaceEmptyValues(obj[key]); // 递归调用，处理嵌套的对象
//       } else if (obj[key] === null || obj[key] === '') {
//         obj[key] = key; // 当值为空时，将其设置为键的值
//       }
//     }
//     return obj;
//   }

// 导出
export const importHandle = (orderData={}) => {
	const currencyInfo = getCurrencyInfo()
        let list = []
        if (orderData && orderData.orderDetails.length) {
            orderData.orderDetails.map((item, index) => {
                const { storageQuantity, quantity } = item
                const snapshot = JSON.parse(item?.snapshot ?? '{}');
                const available = storageQuantity > quantity ? quantity : storageQuantity
                const backorder = storageQuantity - quantity > 0 ? 0 : quantity - storageQuantity
                list.push({
                    'Sort': index + 1,
                    'Quantity': item.quantity,
                    'Order Number': orderData.orderId,
                    'Part Number': snapshot.name,
                    'Manufacturer': snapshot.manufacturerName,
                    'Description': item.description,
                    'Customer Reference': "", // 客户编号
                    'Available': available, // 可发货数量
                    'Backorder': backorder, // 延期交货
                    'Order Date': dayjs(item.createTime).format('DD MMMM, YYYY - HH:mm:ss'),
                    'Unit Price': currencyInfo.label + toFixedFun(item?.price / item?.quantity || 0, 4), // 单价
                    'Ext.Price': currencyInfo.label + toFixedFun(item.price || 0, 2), // 总价
                })
            })
            // 1. 命名：PO2404030002
            // 2.表格中列头，有大写有小写，有的带冒号，有的不带；字体：Arial Unicode MS，字号：9，数据居中，左对齐；列宽9，行高20

						// exportExcelTable({
						// 	fileName:'PO' + orderData.orderId+".xlsx",
						// 	sheetName:'Order Details',
						// 	content:list,
						// })
            getExcel('PO' + orderData.orderId, list, [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9], 20)
            // getExcel('PO' + orderData.orderId, list, [5, 8, 20, 20, 20, 25, 25, 12, 12, 25, 20, 20], 9)
        }
}

const getExcel = (title, content, column, rowstr) => {
    //导出Excel
    // title标题 类型：字符
    // content表内容 类型：数组  注：数组中的对象中的属性，数量一致，否则导出后数据错位  案例：[{name:'1',age:'3'},{name:'1',age:'3'}]
    // column列宽 类型数组，案例：[20] 每列的宽度为20px ; [20,30,60] 可以自定义宽度
    // rowstr行高 类型：数字 案例：20 数据行高为20px
    let arr = []
    if (content.length > 0) {
        arr.push(Object.keys(content[0]))
        content.forEach(row => {
            arr.push(Object.values(row))
        });
    }
    var filename = title + ".xlsx"; //保存的表名字
    var data = arr;  //二维数组
    var ws_name = "Order Details"; //Excel第一个sheet的名称 
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.aoa_to_sheet(data);
    var wscols = []// 每列不同宽度px
    if (column && column.length > 1) {
        column.forEach(val => {
            wscols.push({ wch: val })
        });
    } else if (column && column.length == 1) {
        arr[0].forEach(val => {
            wscols.push({ wch: column[0] })
        });
    }
    ws["!cols"] = wscols;
    let wsrows = [{ hpx: 20 }];  // 每行固定高度px
    if (arr.length > 1 && rowstr) {
        for (let i = 1; i <= arr.length - 1; i++) {   // total  列表条数
            wsrows.push({ hpx: rowstr });
        }
        ws["!rows"] = wsrows;
    }
    XLSX.utils.book_append_sheet(wb, ws, ws_name);  //将数据添加到工作薄
    XLSX.writeFile(wb, filename); //导出Excel
}
// 判断设备
export const isMobile = (req) => {
    if(!req && typeof window === 'undefined') return false
    const UA = req?.headers['user-agent'];
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(UA || window?.navigator?.userAgent);
    return Boolean(isMobile)
}
export const getIsMobile = (req) => {
    if(!req && typeof window === 'undefined') return false
    const UA = req?.headers['user-agent'];
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(UA || window?.navigator?.userAgent);
    return Boolean(isMobile)
}

// 订单倒计时公共方法 返回倒计时时间戳和时分秒
export const backCountdownData = (date) => {
    // 获取订单创建时间（假设为后端传递过来的时间）
    const createDate = new Date(date);
    // 计算订单过期时间为创建时间后(paypal6小时过期)
    const expirationTime = new Date(createDate.getTime() + (6 * 60 * 60 * 1000));

    const currentTime = new Date();
    const difference = expirationTime - currentTime > 0 ? expirationTime - currentTime : 0;

    // 计算剩余时间
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    return {
        difference,
        hours: hours >= 10 ? hours : `0${hours}`,
        minutes: minutes >= 10 ? minutes : `0${minutes}`,
        seconds: seconds >= 10 ? seconds : `0${seconds}`,
    }
}

/**
 * @首字母大写
 * */
export const capitalizeFirstLetter = (str = '') => {
	if(!str){
		return str
	}
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 字符串中的字母大写
*/
export const uppercaseLetters=(characters)=>{
	if(!characters){
		return characters
	}

	return characters?.toUpperCase()
}

// js手动实现分组