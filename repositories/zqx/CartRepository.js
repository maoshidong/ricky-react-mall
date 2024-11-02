import Repository, { backendServerUrl, getAuthorizeRequest, postAuthorizeRequest } from '../Repository';
// 多语言-检查完了
class CartRepository {
	// 购物车篮子 - Basket
	// 新建、添加用户购物车
	/*
        每个购物车都有一个cartNo, 备用购物车为1
        type: 1 默认 2 报价添加购物车传(items需要传callBackId： 报价id)  3 多订单
        updateQuantityType: 1：
        sku: partNum + '--' + manufacturer 
        管理端：报价不能小于询价的数量
        用户端：多订单不能修改数量，客户只能下单和我们沟通过的指定数量
        询报价的型号， 下单时不能小于报价的数量
    */
	async addUserCartBasket(token, data) {
		if (!token) return {};
		const res = await postAuthorizeRequest(`${backendServerUrl}/cart/addUserCart`, data, token);
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}
	// 添加购物车  type: 1 默认 2 报价 3 多订单; 添加购物车传(items需要传callBackId： 报价id)  3 多订单  orderId: 管理端客户购物车记录 , cur_cart_data?.orderId
	async addToCarts(token, data, cartNo = 0, orderId) {
		const res = await postAuthorizeRequest(`${backendServerUrl}/cart/add_products`, { ...data, cartNo, orderId }, token);
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}
	// 添加购物车 - 修改数量
	async addToCartsList(token, data, cartNo = 0, orderId) {
		// 购物车列表修改数量传 type: 1
		const res = await postAuthorizeRequest(
			`${backendServerUrl}/cart/add_products`,
			{
				updateQuantityType: 1,
				...data,
				cartNo, orderId,
			},
			token
		);
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}
	// 删除购物车
	async removeCarts(token, data, cartNo = 0) {
		const res = await postAuthorizeRequest(`${backendServerUrl}/cart/remove_products`, { ...data, cartNo }, token);
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}
	// 购物车列表，cartNo 动态的 默认购物车，cartNo = 1 备用购物车
	async loadCarts(token, cartNo, languageType = 'en', manufacturerId = '', keywordList = []) {
		if (!token || !cartNo) return {};
		const _dt = {
			cartNo: cartNo,
			languageType: languageType,
		};

		if (manufacturerId) {
			_dt.manufacturerId = manufacturerId;
		}

		if (keywordList?.length > 0) {
			_dt.keywordList = keywordList;
		}

		// const res = await getAuthorizeRequest(`${backendServerUrl}/cart/list_my_products?cartNo=${cartNo}&languageType=${languageType}`, token);
		const res = await postAuthorizeRequest(`${backendServerUrl}/cart/list_my_products`, { ..._dt }, token);
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}
	// 生成购物车链接
	async shareCartsUrl(token, data) {
		if (!token) return {};
		const res = await postAuthorizeRequest(`${backendServerUrl}/cart/shareCartUrl`, { languageType: 'en', ...data }, token);
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}
	// 分享过来的购物车列表
	async shareCarts(token, data) {
		if (!token) return {};
		const res = await postAuthorizeRequest(`${backendServerUrl}/cart/listShareCart`, { languageType: 'en', ...data }, token);
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}
	// 购物车商品之间传递
	async changeCartLocation(token, data) {
		const res = await postAuthorizeRequest(`${backendServerUrl}/cart/changeCartProduct`, { ...data }, token);
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}
	// 领取优惠券？
	async recive(couponCode, token) {
		const res = await getAuthorizeRequest(`${backendServerUrl}/coupon/recive?couponCode=` + couponCode, token);
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}

	// 报价邮箱传过来的报价id集合 邮件点击加入到购物车时获取商品信息接口 timeStatus  1 没过期  2 过期
	async queryCallbackInfoList(token, data) {
		// const arr = [1159,1165,1166]
		const res = await postAuthorizeRequest(`${backendServerUrl}/web/tbInquiryCallBack/queryCallbackInfoList`, data, token);
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}
	// 报价邮箱传过来的推送订单id 
	async apiInfoListByPushNo(data) {
		// const arr = [1159,1165,1166]
		const res = await Repository.post(`${backendServerUrl}/order/queryInfoListByPushNo`, data);
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}

	// 删除购物车
	async deleteUserCartBasket(token, data) {
		if (!token) return {};
		const res = await postAuthorizeRequest(`${backendServerUrl}/cart/deleteUserCart`, data, token);
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}
	// 合并购物车
	async mergeUserCartBasket(token, data) {
		if (!token) return {};
		const res = await postAuthorizeRequest(`${backendServerUrl}/cart/mergeUserCart`, data, token);
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}
	// merge购物车中的产品去主要购物车
	async mergeUserCartToMainCartBasket(token, data) {
		if (!token) return {};
		const res = await postAuthorizeRequest(`${backendServerUrl}/cart/mergeUserCartToMainCart`, data, token);
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}
	// 激活购物车去主要购物车
	async activeUserCartToMainCart(token, data) {
		if (!token) return {};
		const res = await postAuthorizeRequest(`${backendServerUrl}/cart/activeUserCartToMainCart`, data, token);
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}
	// 修改购物车
	async updateUserCartBasket(token, data) {
		if (!token) return {};
		const res = await postAuthorizeRequest(`${backendServerUrl}/cart/updateUserCart`, data, token);
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}
	// 查询我的购物车列表
	async userCartListBasket(token, data) {
		if (!token) return {};
		const res = await postAuthorizeRequest(`${backendServerUrl}/cart/userCartList`, data, token);
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}
	// 查询购物车产品列表
	async userCartProductListBasket(token, data) {
		if (!token) return {};
		const res = await postAuthorizeRequest(
			`${backendServerUrl}/cart/userCartProductList`,
			{
				languageType: 'en',
				...data,
			},
			token
		);
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}

	// 项目列表 /web/userProject/projectList
	async projectList(token, data) {
		if (!token) return {};
		const res = await postAuthorizeRequest(`${backendServerUrl}/web/userProject/projectList`, data, token);
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}
	// 新建项目 ​/web​/userProject​/addProject
	async addProject(token, data) {
		if (!token) return {};
		const res = await postAuthorizeRequest(`${backendServerUrl}/web/userProject/addProject`, data, token);
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}
	// 修改项目
	async updateProject(token, data) {
		if (!token) return {};
		const res = await postAuthorizeRequest(`${backendServerUrl}/web/userProject/updateProject`, data, token);
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}
	// 删除项目
	async deleteProject(token, data) {
		if (!token) return {};
		const res = await postAuthorizeRequest(`${backendServerUrl}/web/userProject/deleteProject`, data, token);
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}
	// 查询我的项目产品列表，项目详情
	async projectProductList(token, data) {
		if (!token) return {};
		const res = await postAuthorizeRequest(
			`${backendServerUrl}/web/userProject/projectProductList`,
			{
				languageType: 'en',
				...data,
			},
			token
		);
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}

	// 客户购物车
	// 保存用户下单的每个步骤的信息，然后管理端展示
	async cartInfoToNextPage(token, data) {
		// if(!token) return {}
		const res = await postAuthorizeRequest(`${backendServerUrl}/web/cartDetailInfo/toNextPage`, data, token);
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}
}

export default new CartRepository();
