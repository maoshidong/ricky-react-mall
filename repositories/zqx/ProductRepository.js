import Repository, { backendServerUrl, getAuthorizeRequest, postAuthorizeRequest } from '../Repository';
// 多语言-检查完了 - 有接口待确定
class ProductRepository {
	handleRes(res) {
		if (res?.data?.code === 200) {
			return res.data;
		}
		return null;
	}
	// 查询产品总数filter页面 - 新版      // 计算属性总数 - filter页面， 几个接口都传一样的参数，保持同步
	async getProductsCountNum(params = {}) {
		const res = await Repository.post(`${backendServerUrl}/app/catalogs/getProductListCountNumEs`, {
			...params,
			// isFilter: 1,
			esIndex: 'products_attribute_new',
		});
		return res?.data;
	}

	// 新版本
	async getProducts(params = {}) {
		const res = await Repository.post(`${backendServerUrl}/app/catalogs/getProductListByCatalogIdEs`, {
			languageType: 'en',
			...params,
			// isFilter: 1,
			esIndex: 'products_attribute_new',
		}); //
		return res;
	}
	// 旧版本
	// async getProducts111(catalogId, idList, pagination, keywordList, otherObj) {
	//     const params = {
	//         catalogId,
	//         idList,
	//         keywordList,
	//         manufacturerSlug: otherObj?.slug || '',
	//         pageNum: Number.isInteger(Number(pagination?.pageNum)) ? pagination?.pageNum : 1,
	//         pageSize: Number.isInteger(Number(pagination?.pageSize)) ? pagination?.pageSize : 20
	//     }
	//     const res = await Repository.post(`${backendServerUrl}/app/catalogs/getProductListByCatalogIdEs`, params); //
	//     return res
	// };
	// 提交样品申请
	async freeProductAdd(params) {
		return await postAuthorizeRequest(`${backendServerUrl}/freeProduct/add`, {
			languageType: 'en',
			...params,
		});
	}

	async freeProductList(params) {
		const res = await postAuthorizeRequest(`${backendServerUrl}/freeProduct/list`, params);
		return res?.data;
	}

	// async getProductDefaultImg() {
	// 	return await Repository.get(`${backendServerUrl}/common/getProductDefaultImage`);
	// }

	// async getHotCatagories() {
	// 	return await Repository.get(`${backendServerUrl}/home/hot/categories`);
	// }

	// async getHotProducts() {
	// 	return await Repository.get(`${backendServerUrl}/home/hot/products`);
	// }
	// 通过产品型号搜索
	async getProductsSearch(data) {
		const responseData = await Repository.post(`${backendServerUrl}/app/products/searchProductList`, { 
			languageType: 'en', ...data
		});
		if (responseData && responseData.status === 200) {
			return responseData.data;
		}
		return null;
	}

	// 新的产品搜索接口 - 暂时只有样品页面和快速订单使用
	async apiGetProductListFreeWebEs(data = {}) {
		if (!data?.keyword) {
			return {
				code: 0,
				data: {
					catalogCount: 0,
					catalogIdList: [],
					searchVos: {
						data: [],
					},
				},
			};
		}
		const responseData = await Repository.post(`${backendServerUrl}/app/products/getProductListFreeWebEs`, {
			esIndex: 'products', // 暂时不用products
			...data,
		});
		if (responseData && responseData.status === 200) {
			return responseData.data;
		}
		return null;
	}
	// 新的产品搜索接口
	async apiSearchProductByEs(data = {}) {
		if (!data?.keyword && data?.top20Flag !== 1) {
			return {
				code: 0,
				data: {
					catalogCount: 0,
					catalogIdList: [],
					searchVos: {
						data: [],
					},
				},
			};
		}

		const responseData = await Repository.post(`${backendServerUrl}/app/products/searchProductByEs`, {
			esIndex: 'products', // 暂时不用products
			...data,
		});
		if (responseData && responseData.status === 200) {
			return responseData.data;
		}
		return null;
	}
	// 获取7天内浏览量最多的有货商品10个
	async apiOneWeekHaveStockViewTop10() {
		const res = await Repository.get(`${backendServerUrl}/app/products/getOneWeekHaveStockViewTop10`, {});

		if (res?.status === 200) {
			return res?.data;
		}
		return [];
	}
	
	// 获取产品列表
	async getProductsListWeb(data = {}) {
		const res = await postAuthorizeRequest(`${backendServerUrl}/app/products/getProductListWebEs`, {
			esIndex: 'products',
			isSort: 1,
			...data,
		});
		// const res = await Repository.post(`${backendServerUrl}/app/products/getProductListWeb`, data);
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}
	// 获取产品详情相关产品
	async apiGetLikeProductList(data = {}) {
		const res = await postAuthorizeRequest(`${backendServerUrl}/app/products/getLikeProductList`, {
			esIndex: 'products',
			isSort: 1,
			languageType: 'en',
			...data,
		});
		if (res && res.status === 200) {
			return res.data;
		}
		return null;
	}

	// strapi的接口 - 废弃 - 但还有地方引用，小心删除
	async getProductsByIds(ids) {}

	async getNewProductsById(id, languageType, token) {
		return await getAuthorizeRequest(`${backendServerUrl}/app/products/productDetail?id=${id}&languageType=${languageType || 'en'}`, token);
	}
	// 字典, 是否加上多语言
	async getdictType(type, languageType="en") {
		return await Repository.get(`${backendServerUrl}/common/dict_list?dictType=${type}&languageType=${languageType}`);
	}

	//  根据产品ids 获取详情数据
	async getProductsInfoByIds(productIdList, languageType = 'en') {
		const res = await postAuthorizeRequest(`${backendServerUrl}/app/products/productDetailList`, {
			productIdList,
			languageType,
		});

		if (res && res.data?.code === 0) {
			return res.data?.data;
		}
		return null;
	}

	// 新增产品对比数据​ firstProductId  lastProductId
	async productCompareAdd(params) {
		const res = await Repository.post(`${backendServerUrl}/productCompare/add`, params);

		if (res && res.data?.code === 0) {
			return res.data?.data;
		}
		return null;
	}
	// 查询产品对比数据
	async productCompareList(params) {
		const res = await Repository.post(`${backendServerUrl}/productCompare/compareList`, params);
		// return this.handleRes(res);
		if (res && res.data?.code === 0) {
			return res.data?.data;
		}
		return null;
	}
}

export default new ProductRepository();
