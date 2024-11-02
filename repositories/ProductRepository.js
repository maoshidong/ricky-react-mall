import Repository, { baseUrl, serializeQuery, backendServerUrl, getAuthorizeRequest, postAuthorizeRequest } from './Repository';
// 多语言-检查完了 - 有接口待确定
class ProductRepository {
	// 没有用了
	// async getProducts1(params) {
	//     const reponse = await Repository.get(
	//         `${baseUrl}/products?${serializeQuery(params)}`
	//     )
	//         .then((response) => {
	//             if (response.data && response.data.length > 0) {
	//                 return response.data;
	//             } else {
	//                 return null;
	//             }
	//         })

	//         .catch((error) => {
	//             return null;
	//         });
	//     return reponse;
	// }

	// 获取所有的分类树 id 0 查所有分类,
	async apiGetRecommendCatalogList(id = 0, languageType = 'en') {
		let params = {
			id,
		};
		// 不传中英文都返回
		if (languageType) {
			params.languageType = languageType;
		}
		const param = serializeQuery(params);
		const reponse = await Repository.get(`${backendServerUrl}/app/catalogs/getCatalogTree?${param}`).then((response) => {
			return response?.data;
		});
		return reponse;
	}
	// 获取分类描述
	async apiGetCatalogDescription(id, languageType = 'en') {
		const reponse = await Repository.get(`${backendServerUrl}/app/catalogs/getCatalogDescription?id=${id}&languageType=${languageType}`).then((response) => {
			return response?.data;
		});
		return reponse;
	}
	// 推荐分类
	async getRecommendCatalogListWeb(languageType = 'en') {
		const reponse = await Repository.get(`${backendServerUrl}/app/catalogs/getRecommendCatalogListWeb?languageType=${languageType}`).then((response) => {
			return response?.data;
		});
		return reponse;
	}
	// 热门、推荐、则扣产品供应商 - 需要加上多语言?  type 1 热卖 2 推荐 3 折扣,收藏:4  标签:5 备用购物车：6
	async getProductManufacturerList(type = 1, languageType = 'en', token) {
		const reponse = await postAuthorizeRequest(`${backendServerUrl}/app/products/getProductManufacturerList`, { type, languageType }, token).then((response) => {
			return response?.data;
		});
		return reponse;
	}
	// 推荐产品 - indexFlag: 1, 不返回价格、备注等字段
	async getRecommendListWeb(
		params = {
			manufacturerId: '',
			pageNum: 1,
			pageSize: 20,
		}
	) {
		const reponse = await postAuthorizeRequest(`${backendServerUrl}/app/products/getRecommendListWeb`, {
			languageType: 'en',
			...params,
		}).then((response) => {
			return response?.data;
		});
		return reponse;
	}
	// 热门产品 - indexFlag: 1, 不返回价格、备注等字段
	async getHotProductsList(
		params = {
			manufacturerId: '',
			pageNum: 1,
			pageSize: 20,
		}
	) {
		const reponse = await postAuthorizeRequest(`${backendServerUrl}/app/products/getPopularListWeb`, {
			languageType: 'en',
			...params,
		}).then((response) => {
			return response?.data;
		});
		return reponse;
	}

	// 折扣商品
	async getGreatDealsList(
		params = {
			manufacturerId: '',
			pageNum: 1,
			pageSize: 20,
		}
	) {
		const reponse = await postAuthorizeRequest(`${backendServerUrl}/app/products/getDiscountListWeb`, {
			languageType: 'en',
			...params,
		}).then((response) => {
			return response?.data;
		});
		return reponse;
	}

	// 最新产品全部分类
	async apiGetNewProductCatalogListWeb(languageType = 'en') {
		const res = await Repository.get(`${backendServerUrl}/app/catalogs/getNewProductCatalogListWeb?languageType=${languageType}`, {});
		return res?.data;
	}
	// 最新产品列表
	async apiGetNewProductListWeb(
		params = {
			keyword: '',
			pageNum: 1,
			pageSize: 20,
		}
	) {
		const reponse = await Repository.post(`${backendServerUrl}/app/products/getNewProductListWeb`, params).then((response) => {
			return response?.data;
		});
		return reponse;
	}

	// 获取字母开头的产品数据
	async getProductListFirstLetter(
		params = {
			keyword: '',
			pageListNum: 1,
			pageListSize: 500,
		}
	) {
		const reponse = await Repository.post(`${backendServerUrl}/app/products/getProductListByFirstLetter`, params).then((response) => {
			return response?.data;
		});
		return reponse;
	}

	// 品牌系列列表
	async apiQueryProductSeriesList(params) {
		const res = await Repository.post(`${backendServerUrl}/web/productSeries/queryProductSeriesList`, {
			languageType: 'en',
			...params,
		});
		return res?.data;
	}
	// 已绑定系列品牌列表
	async apiQuerySeriesManufactureList(params) {
		const res = await Repository.post(`${backendServerUrl}/web/productSeries/querySeriesManufactureList`, {
			languageType: 'en',
			...params,
		});
		return res?.data;
	}
	// 获取系列关联产品列表
	async apiGetSeriesProductList(params) {
		const res = await Repository.post(`${backendServerUrl}/app/products/getSeriesProductList`, {
			languageType: 'en',
			...params,
		});
		return res?.data;
	}
	// 系列详情 /web/productSeries/querySeriesDetail
	async apiQuerySeriesDetail(params) {
		const res = await Repository.post(`${backendServerUrl}/web/productSeries/querySeriesDetail`, {
			languageType: 'en',
			...params,
		});
		return res?.data;
	}

	// 添加商品访问记录
	async addProductRecord(data, token) {
		const responseData = await postAuthorizeRequest(`${backendServerUrl}/productViewCount/addViewCount?productId=` + data?.productId, token);
		// const responseData = await Repository.post(`${backendServerUrl}/productViewCount/addViewCount?productId=` + data?.productId);
	}
	// 添加商品备注
	async editProductTag(params) {
		const responseData = await postAuthorizeRequest(`${backendServerUrl}/tbUserProductTag/editProductTag`, params);
	}
	// 商品备注列表
	async getProductTagList(params, token) {
		const res = await postAuthorizeRequest(
			`${backendServerUrl}/tbUserProductTag/tagProductList`,
			{
				languageType: 'en',
				...params,
			},
			token
		);
		return res?.data;
	}
	// 删除商品备注列表
	async delProductTag(tagIdList = []) {
		const res = await postAuthorizeRequest(`${backendServerUrl}/tbUserProductTag/deleteProductTag`, { tagIdList });
		return res?.data;
	}
	// 添加商品收藏
	async addProductsFavorites(productId, token) {
		const res = await postAuthorizeRequest(`${backendServerUrl}/productCollect/add`, { productId }, token);
		return res?.data;
	}
	// 收藏列表
	async myFavoritesList(params, token) {
		const res = await postAuthorizeRequest(
			`${backendServerUrl}/productCollect/list`,
			{
				languageType: 'en',
				...params,
			},
			token
		);
		return res?.data;
	}
	// 删除收藏列表
	async myFavoritesDel(productIdList = []) {
		const res = await postAuthorizeRequest(`${backendServerUrl}/productCollect/delete`, { productIdList });
		return res?.data;
	}
	// 浏览历史列表
	async myViewHistoryList(params) {
		const res = await postAuthorizeRequest(`${backendServerUrl}/app/products/getProductViewHistoryList`, {
			languageType: 'en',
			...params,
		});
		return res?.data;
	}
	// 删除浏览历史列表
	async myViewHistoryDel(params) {
		const res = await postAuthorizeRequest(`${backendServerUrl}/productViewCount/deleteViewHistory?productId=` + params?.productId);
		return res?.data;
	}

	/**
	 * @获取未分类供应商列表
	 * @param languageType 语言类型
	 * **/
	async getUncategorizedManufacturerList(languageType = 'en', manufacturerIdList) {
		const reponse = await Repository.post(`${backendServerUrl}/app/products/getUncategorizedManufacturerList`, { languageType, manufacturerIdList }).then((response) => {
			return response?.data;
		});
		return reponse;
	}

	/**
	 * @获取分类下的最新18条数据
	 */
	async getNewProductListWebForDetail(
		params = {
			pageNum: 1,
			pageSize: 20,
		}
	) {
		const reponse = await Repository.post(`${backendServerUrl}/app/products/getNewProductListWebForDetail`, {
			languageType: 'en',
			...params,
		}).then((response) => {
			return response?.data;
		});
		return reponse;
	}
}

export default new ProductRepository();
