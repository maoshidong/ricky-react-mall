import Repository, { backendServerUrl } from '../Repository';
// 多语言-检查完了
class CommonRepository {
    // /dev-api/biz/sysFunction/getSysFunctionTypeSonList
    // "buttonFlag": 0, 传2则不返回
    // "buttonName": "string", 具体字段
    // "paramFlag": 0,  传2则不返回
    // "paramName": "string",
    // "typeId": 0  // 类型id   typeIdList: [1, 2]
    async apiGetSysFunctionTypeSonList(params) {
        const res = await Repository.post(`${backendServerUrl}/web/sysFunction/getSysFunctionTypeSonList`, params);
        return res?.data
    };
    // 语言包
    async getLanguageAdminIfoNext(languageType) {
        const res = await Repository.get(`${backendServerUrl}/web/webLanguage/getLanguageAdminIfo?languageType=${languageType || 'en'}`, {
        });
        return res?.data
    };
    // 认证列表
    async apiAuthList(params) {
        const res = await Repository.post(`${backendServerUrl}/common/authList`, {
            ...params,
            status: 1,
        });
        return res?.data
    };
		// /  shareUrlLink  分享映射链接管理
//  /getShareUrlLink 获取链接对应短语
// /getShareUrlByCode 根据短语获取链接
		// 获取链接对应短语
		async apiGetShareUrlByCode(params) {
			const res = await Repository.post(`${backendServerUrl}/shareUrlLink/getShareUrlByCode`, params);
			return res?.data
		};
		// 根据短语获取链接
		async apiGetShareUrlLink(params) {
			const res = await Repository.post(`${backendServerUrl}/shareUrlLink/getShareUrlLink`, params);
			return res?.data
		};
	
		
		// 不需要就删除
    // async getStaticJson(dataId="", languageType="en") {
    //     const host = process.env.NODE_ENV === 'development' ? "http://localhost:3003" : "https://www.origin-ic.com"
    //     // 服务端请求需要加上 域名
    //     const randomParam = `_=${Math.random()}`;
    //     const res = await Repository.post(`${host}/api/getData?dataId=${dataId}&languageType=${languageType}&${randomParam}`);
    //     return res
    // };
}

export default new CommonRepository();
