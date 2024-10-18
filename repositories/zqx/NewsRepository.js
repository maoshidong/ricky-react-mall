import Repository, { backendServerUrl, postAuthorizeRequest } from '../Repository';
// import { postAuthorizeRequest } from '~/utilities/common-helpers';
// 多语言-检查完了
class NewsRepository {
	// /dev-api/biz/news/queryNewsList
	// 新闻列表 - 和栏目树传相同的参数， 只在content-search？   columnIdList:栏目id,  languageType
	// typefitIds:  Resource Type
	// typeIdList:<Resource Type> [PUB_RESOURCE_TYPE.resource], // Product Type
	// functionIdList:<Function> // 功能function, id
	// manufactureIdList 选中的供应商
	// keyword 搜索关键词
	// type: 1, // 博客，特色产品，应用笔记等都属于 type 1
	// newsType: 1, // 只是特色产品
	async getQueryNewsList(
		params = {
			pageNum: 1,
			pageSize: 20,
		}
	) {
		// , languageType: "en"
		const reponse = await postAuthorizeRequest(`${backendServerUrl}/web/news/queryNewsList`, {
			languageType: "en",
			...params,
		}).then((response) => {
			return response?.data;
		});
		return reponse;
	}
	// 产品相关新闻
	async apiQueryProductRelaNews(params = {}) {
		const reponse = await postAuthorizeRequest(`${backendServerUrl}/web/news/queryProductRelaNews`, {
			languageType: "en",
			...params,
		}).then((response) => {
			return response?.data;
		});
		return reponse;
	}

	// 新闻详情
	async apiQueryNewsDetail(params) {
		const reponse = await Repository.post(`${backendServerUrl}/web/news/queryNewsDetail`, {
			languageType: "en",
			...params,
		}).then((response) => {
			return response?.data;
		});
		return reponse;
	}

	// 栏目树 - 和新闻列表传相同的参数， 只在content-search？
	// params:  typeList: 类型(1, 2, 3, 4, 5)  functionIdList:  功能栏目id  typeIdList： 类型栏目id

	async apiGetNewsTypeTree(params = { parentTypeId: 0 }) {
		const reponse = await postAuthorizeRequest(`${backendServerUrl}/web/news/getNewsTypeTree`, {
			languageType: 'en',
			...params,
		}).then((response) => {
			return response?.data;
		});
		return reponse;
	}

	// 查询分类相关新闻  type: PUB_RESOURCE_TYPE.resource, // 资源类型：博客，特色产品，应用笔记等都属于 type 1   newsType 只是特色产品
	async apiQueryCatalogRelaNews(params = {}) {
		const reponse = await postAuthorizeRequest(`${backendServerUrl}/web/news/queryCatalogRelaNews`, {
			languageType: 'en',
			...params,
		}).then((response) => {
			return response?.data;
		});
		return reponse;
	}

	// 供应商相关新闻
	async apiQueryManufactureRelaNews(params = {}) {
		const reponse = await postAuthorizeRequest(`${backendServerUrl}/web/news/queryManufactureRelaNews`, {
			languageType: 'en',
			...params,
		}).then((response) => {
			return response?.data;
		});
		return reponse;
	}

	// 查询分类查关联品牌 
	async apiGetCatalogRelaManufacturer(id, languageType="en") {
		const reponse = await Repository.get(`${backendServerUrl}/app/catalogs/getCatalogRelaManufacturer?id=${id}&languageType=${languageType}`).then((response) => {
			return response?.data;
		});
		return reponse;
	}
	// 标签首字符集合 - 应该不需要多语言
	async apiQueryWebTagFirstNumber(id) {
		const reponse = await Repository.get(`${backendServerUrl}/web/news/queryWebTagFirstNumber`).then((response) => {
			return response?.data;
		});
		return reponse;
	}
	// 标签下文章列表 这个不知道怎么加了
	async apiQueryWebNewsListByTag(params) {
		const reponse = await Repository.post(`${backendServerUrl}/web/news/queryWebNewsListByTag`, {
			// languageType: 'en',
			...params,
		}).then((response) => {
			return response?.data;
		});
		return reponse;
	}
	// 标签列表
	async apiQueryWebTagList(params) {
		const reponse = await Repository.post(`${backendServerUrl}/web/news/queryWebTagList`, {
			languageType: 'en',
			...params,
		}).then((response) => {
			return response?.data;
		});
		return reponse;
	}

	// 客户订阅
	// 订阅列表
	async apiUserSubscribeList(token, params) {
		if(!token) return
		const reponse = await postAuthorizeRequest(`${backendServerUrl}/web/userSubscribe/labelList`, {
			languageType: 'en',
			...params,
		}, token).then((response) => {
			return response?.data;
		});
		return reponse;
	}
	
	// 修改订阅
	async apiUserSubscribeUpdate(params, token) {
		const reponse = await postAuthorizeRequest(`${backendServerUrl}/web/userSubscribe/updateSubscribe`, {
			languageType: 'en',
			...params,
		}, token).then((response) => {
			return response?.data;
		});
		return reponse;
	}
	
	// 发起订阅， 登录和不登录都可 /web/userSubscribe/applySubscribe
	async apiApplySubscribe(params, token) {
		const reponse = await postAuthorizeRequest(`${backendServerUrl}/web/userSubscribe/applySubscribe`, {
			languageType: 'en',
			...params,
		}, token).then((response) => {
			return response?.data;
		});
		return reponse;
	}

	// /queryWebTagFirstNumber  标签首字符集合
	// /queryWebNewsListByTag 标签下文章列表
	// /queryWebTagList 标签列表

	// 内容列表 - queryWebWorkContentList queryNewsList
	// async apiQueryWebWorkContentList(params = {}) {
	// 	const reponse = await postAuthorizeRequest(`${backendServerUrl}/web/news/queryWebWorkContentList`, params).then((response) => {
	// 		return response?.data;
	// 	});
	// 	return reponse;
	// }
	// // queryWebWorkContentDetail queryNewsDetail
	// async apiQueryWebWorkContentDetail(params = {}) {
	// 	const reponse = await postAuthorizeRequest(`${backendServerUrl}/web/news/queryNewsDetail`, params).then((response) => {
	// 		return response?.data;
	// 	});
	// 	return reponse;
	// }
}

export default new NewsRepository();
