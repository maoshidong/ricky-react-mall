/*
 * React template helpers
 * Author: Nouthemes
 * Developed: diaryforlife
 * */

import cookies from 'js-cookie';
import { getExpiresTime } from '~/utilities/common-helpers';
import { PAYMENT_TYPE } from '~/utilities/constant';

export function getCartItemsFromCookies() {
    const cartItems = cookies.get('cart');
    if (cartItems) {
        return JSON.parse(cartItems);
    } else {
        return null;
    }
}

export function updateCartToCookies(payload) {
    cookies.set('cart', payload, { path: '/', expires: getExpiresTime(30) });
    // cookies.set('cart', payload, { path: '/', expires: 24 * 7 });
}

export function addItemToCartHelper(product) {
    let cart;
    let cookieCart = getCartItemsFromCookies();
    if (cookieCart) {
        cart = cookieCart;
        const existItem = cart.items.find((item) => item.id === product.id);
        if (existItem) {
            existItem.quantity += product.quantity;
        } else {
            /* if (!product.quantity) {
                product.quantity = 1;
            }*/
            cart.items.push(product);
        }
    } else {
        cart = {
            items: [],
        };
        cart.items.push(product);
    }
    updateCartToCookies(cart);
    return cart;
}

export function increaseQtyCartItemHelper(product) {
    let cart;
    let cookieCart = getCartItemsFromCookies();
    if (cookieCart) {
        cart = cookieCart;
        const selectedItem = cart.items.find((item) => item.id === product.id);

        if (selectedItem) {
            selectedItem.quantity = selectedItem.quantity + 1;
        }
        updateCartToCookies(cart);
        return cart;
    }
}

export function decreaseQtyCartItemHelper(product) {
    let cart;
    let cookieCart = getCartItemsFromCookies();
    if (cookieCart) {
        cart = cookieCart;
        const selectedItem = cart.items.find((item) => item.id === product.id);

        if (selectedItem) {
            selectedItem.quantity = selectedItem.quantity - 1;
        }
        updateCartToCookies(cart);
        return cart;
    }
}

export function removeCartItemHelper(product) {
    let cart;
    let cookieCart = getCartItemsFromCookies();
    if (cookieCart) {
        cart = cookieCart;
        const index = cart.items.findIndex((item) => item.id === product.id);
        cart.items.splice(index, 1);
        updateCartToCookies(cart);
        return cart;
    }
}

// new

export function calculateAmount(obj) {
    return toFixed(Object.values(obj)
        .reduce((acc, { quantity, attributes: { price } }) => acc + floatMutilply(quantity,price), 0)
        ,2);
}

export const getTargetPrice = (product) => {
    const prices = product?.attributes?.product_prices?.data;
    if (!prices) {
        return 1;
    }
    let targetPrice = 1;
    prices?.forEach(item => {
        if (item?.attributes?.quantity <= product.quantity) {
            targetPrice = item?.attributes?.unitPrice;
        }
    })
    return targetPrice;
}
// 计算产品目标价
export const calculateTargetPrice = (product) => {
    const prices = product?.attributes?.product_prices?.data;
    if (!prices) {
        return 0;
    }
    let targetPrice = 1;
    prices?.forEach(item => {
        if (item?.attributes?.quantity <= product.quantity) {
            targetPrice = item?.attributes?.unitPrice;
        }
    })

    return targetPrice;
}


export const calculateClearTargetPrice = (product,quantity) => {
  const prices = product?.prices;
  if (!prices) {
      return 0;
  }
  let targetPrice = 1;
  prices?.forEach(item => {
      if (item?.attributes?.quantity <= quantity) {
          targetPrice = item?.attributes?.unitPrice;
      }
  })
  return targetPrice;
}
export const calculateItemTotalPrice = (product) => {
    let targetPrice = calculateTargetPrice(product)
    return floatMutilply(targetPrice, product.quantity);
}



export function calculateCartQuantity(obj) {
    return Object.values(obj).reduce((acc, { quantity }) => acc + quantity, 0);
}

export function caculateArrayQuantity(obj) {
    return Object.values(obj).reduce((acc) => acc + 1, 0);
}

// 新接口计算方式-cart/list_my_products---del
// 计算产品阶梯价对应单价
export const calculateTargetPriceTotal = (product, payType) => {

  const prices = product?.voList || product?.product_prices || product?.pricesList || product?.prices; // 获取阶梯价格数组
  const pricesQuantity = product?.cartQuantity || product?.quantity
  if (!prices) {
      return 0;
  }
  let targetPrice = Number(toFixed(prices?.[0]?.unitPrice)); // 默认取第一个价格, PayPal单价保留两位
  if(payType !== PAYMENT_TYPE.PayPal) {
    targetPrice = Number(prices?.[0]?.unitPrice);
  }

  prices?.forEach(item => {
      if (item?.quantity <= pricesQuantity) {
        if(payType === PAYMENT_TYPE.PayPal) {
          targetPrice = Number(toFixed(item?.unitPrice, 4)); // PayPal 支付 只取单价的两位数
        } else {
          targetPrice = Number(item?.unitPrice);
        }
      }
  })

  return targetPrice;
}

// 单价 * 数量
export const calculateItemPriceTotal = (product, payType) => {
  let targetPrice = calculateTargetPriceTotal(product, payType)
  return floatMutilply(targetPrice, product.cartQuantity || product.quantity);
}

// 计算产品列表价格总和 - payType // PayPal 支付 只取单价的两位数
export function calculateTotalAmount(products, payType) {
  return products.reduce (
      (acc, product) => acc + calculateItemPriceTotal(product, payType), 0
  );
}

// 数组所有price之和
export function getProductsTotal (products) {
  let price = 0
  products.map(item => {
      price+= (Number(item.price))
  })
  return price
}

/*
* 库存千分位
*/
export const getStockThousandsData = (dataString) => {
    if (dataString !== 0 && !dataString) {
      return '-';
    }
    // 如果数据为带有小数的。则需要小数点第三位小数四舍五入为两位   数据千分位加分号
    const numTextFloat = `${toFixedFun(dataString, 0)}`.replace(
      /\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,
      '$&,',
    );
    return numTextFloat;
  };
  
/* eslint-disable no-restricted-properties */
/* eslint-disable no-param-reassign */
/** 最大尾数 */
export const maxMantissa = (args1, args2) => {
    let r1 = 0;
    let r2 = 0;
    try {
      r1 = args1.toString().split('.')[1].length;
    } catch (error) {
      r1 = 0;
    }
  
    try {
      r2 = args2.toString().split('.')[1].length;
    } catch (error) {
      r2 = 0;
    }
  
    return Math.max(r1, r2);
  };

  /** 两数相减 */
  export const floatSub = (args1, args2) => {
    const r = maxMantissa(args1, args2);
    const t = 10 ** r;
    return (args1 * t - args2 * t) / t;
  };

  /** 两数相乘 */
  export const floatMutilply = (args1, args2) => {
    const r = maxMantissa(args1, args2);
    const t = 10 ** r;
    return parseFloat(((args1 * t * (args2 * t)) / t ** 2).toFixed(4));
  };
  export const floatDivide = (args1, args2) => {
    return (args1 / args2).toFixed(3); // 相除并保留三位小数
  };
 
  /** 四舍五入函数 */
  export const toFixedFun = (data,len) => {
    const number = Number(data);
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(number) || number >= Math.pow(10, 21)) {
      return number.toString();
    }
    if (typeof len === 'undefined' || len === 0) {
      return Math.round(number).toString();
    }
    // 对数字末尾加0
    function padNum(num) {
      const dotPos = num.indexOf('.');
      if (dotPos === -1) {
        // 整数的情况
        num += '.';
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < len; i++) {
          num += '0';
        }
        return num;
      }
      // 小数的情况
      const need = len - (num.length - dotPos - 1);
      // eslint-disable-next-line no-plusplus
      for (let j = 0; j < need; j++) {
        num += '0';
      }
      return num;
    }
    let result = number.toString();
    const numberArr = result.split('.');
  
    if (numberArr.length < 2) {
      // 整数的情况
      return padNum(result);
    }
    const intNum = numberArr[0]; // 整数部分
    const deciNum = numberArr[1]; // 小数部分
    const lastNum = deciNum.substring(len, len + 1) || '0'; // 最后一个数字
  
    if (deciNum.length === len) {
      // 需要截取的长度等于当前长度
      return result;
    }
    if (deciNum.length < len) {
      // 需要截取的长度大于当前长度 1.3.toFixed(2)
      return padNum(result);
    }
    // 需要截取的长度小于当前长度，需要判断最后一位数字
    result = `${intNum}.${deciNum.substring(0, len)}`;
    if (parseInt(lastNum, 10) >= 5) {
      // 最后一位数字大于5，要进位
      const times = Math.pow(10, len); // 需要放大的倍数
      let changedInt = Number(result.replace('.', '')); // 截取后转为整数
      // eslint-disable-next-line no-plusplus
      changedInt++; // 整数进位
      changedInt /= times; // 整数转为小数，注：有可能还是整数
      result = padNum(`${changedInt}`);
    }
    return result;
  };
  
  /** toFixed */
  export const toFixed = (value = 0, len = 2) => {
    return toFixedFun(value, len);
  };
  
  // 将数字保留两位小数，不足的补“.00”,如：123.036
  export const to2ZeroDecimal = (x) => {
    const value = Math.round(parseFloat(`${x}`) * 100) / 100;
    let res = value.toString();
    const arr = res.split('.'); // ['123', '036']
    if (arr.length === 1) {
      res += '.00';
    }
    if (arr.length > 1) {
      if (arr[1].length < 2) {
        res += '0';
      }
    }
    return res;
  };
  
  // 将数字以每三位逗号分隔
  export const toCommaNumber = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+\b)/g, ',');
  };
  
  /*
   * 千分位，并且保留两位小数, num->保持几位
   */
  export const getThousandsData = (dataString, num=2) => {
    if (dataString !== 0 && !dataString) {
      return '-';
    }
    // 如果数据为带有小数的。则需要小数点第三位小数四舍五入为两位   数据千分位加分号
    const numTextFloat = `${toFixedFun(dataString, num)}`.replace(
      /\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,
      '$&,',
    );
    return numTextFloat;
  };
  
  /*
   * 千分位，不保留两位小数
   */
  export const getThousandsDataInt = (dataString) => {
    if (dataString !== 0 && !dataString) {
      return '';
    }
    // 如果数据为整数，只需要做千分位加分号处理
    const numTextInt = `${Number(dataString)}`.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    return numTextInt;
  };
  
  /** 获取处理过的价格，0显示0.00，数字的显示千分位等，字符串的先处理再显示二进制，其他原路返回或者显示'-' */
  export const getPrice = (price) => {
    if (price === 0) {
      return '￥0.00';
    }
    if (!price) {
      return '-';
    }
    const strPrice = Number(price);
    // eslint-disable-next-line no-restricted-globals
    if (typeof strPrice === 'number' && !isNaN(strPrice)) {
      return `￥${typeof price === 'number' ? getThousandsData(price) : getThousandsData(strPrice)}`;
    }
    return price ? `￥${price}` : '-';
  };
  
  /** 格式化金额 */
  export const moneyFormat = (money) => {
    return toFixedFun(money || 0, 2);
  };