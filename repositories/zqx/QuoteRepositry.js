import Repository, { backendServerUrl, postAuthorizeRequest, postAuthorizeRequestBlob } from '../Repository';
// 多语言-检查完了
class QuoteRepository {
		// 添加询价
    async addToQuote(token, data) {
        const responseData = await postAuthorizeRequest(`${backendServerUrl}/inquiry/add`, {...data}, token);
        if (responseData && responseData.status === 200) {
            return responseData;
        }
        return null;
    }
		// 绑定询价历史到登录账户
    async apiAddHistoryToUser(token, data) {
        const res = await postAuthorizeRequest(`${backendServerUrl}/inquiry/addHistoryToUser`, data, token);
        if (res?.status === 200) {
            return res?.data;
        }
        return null;
    }
    // 我的询价列表
    async myInquiryList(token, data) {
			if(!token) return null
        const res = await postAuthorizeRequest(`${backendServerUrl}/inquiry/queryInquiryList`, {...data}, token);
        if (res && res.status === 200) {
            return res?.data;
        }
        return null;
    }

    // 新增联系数据  languageType 及 type   1是留言 2是库存
    async addToConcat(token, data) {
        const responseData = await Repository.post(`${backendServerUrl}/tbInquiryConcat/add`, {
					languageType: 'en', ...data
				}, token);
        if (responseData && responseData.status === 200) {
            return responseData;
        }
        return null;
    }

    // async downloadExcelSample() {
    //     const responseData = await postAuthorizeRequest(`${backendServerUrl}/inquiry/import_excel`, {...data}, token);
    //     if (responseData && responseData.status === 200) {
    //         return responseData.data;
    //     }
    //     return null;
    // }

    // async parseExcel(data) {
    //     const responseData = await postAuthorizeRequest(`${backendServerUrl}/inquiry/import_excel`, {...data}, token);
    //     if (responseData && responseData.status === 200) {
    //         return responseData.data;
    //     }
    //     return null;
    // }

    // bom获取当前用户下文件列表
    async getBomFileList(data, token) {
        const res = await postAuthorizeRequest(`${backendServerUrl}/web/bomManage/getFileInfoList`, data, token);
        if (res && res.status === 200) {
            return res.data;
        }
        return null;
    }
    // 上传bom表单中的数据生成匹配数据
    async uploadBomIsExistList(data, token) {
        const res = await postAuthorizeRequest(`${backendServerUrl}/web/bomManage/uploadBomIsExistList`, data, token);
        if (res && res.status === 200) {
            return res.data;
        }
        return null;
    }
    async uploadBomExportBom(data, token) {
        const res = await postAuthorizeRequestBlob(`${backendServerUrl}/web/bomManage/exportBom`, data, token);
        if (res && res.status === 200) {
            return res.data;
        }
        return null;
    }
    // 查询bom表单中的数据
    async getBomExistData(data, token) {
        const res = await postAuthorizeRequest(`${backendServerUrl}/web/bomManage/getBomMatchInfoList`, {
            languageType: 'en', ...data,
        }, token);
        if (res && res.status === 200) {
            return res.data;
        }
        return null;
    }
    // 移出产品信息
    async removeBomMatchInfo(data, token) {
        const res = await postAuthorizeRequest(`${backendServerUrl}/web/bomManage/removeBomMatchInfo`, data, token);
        if (res && res.status === 200) {
            return res.data;
        }
        return null;
    }
    // 修改匹配信息 /web/bomManage/updateMatchInfo
    async updateMatchInfo(data, token) {
        const res = await postAuthorizeRequest(`${backendServerUrl}/web/bomManage/updateMatchInfo`, data, token);
        if (res && res.status === 200) {
            return res.data;
        }
        return null;
    }
    // 修改匹配信息
    async addMatchInfo(data, token) {
        const res = await postAuthorizeRequest(`${backendServerUrl}/web/bomManage/addMatchInfo`, data, token);
        if (res && res.status === 200) {
            return res.data;
        }
        return null;
    }
    // 修改文件
    async updateFileInfo(data, token) {
        const res = await postAuthorizeRequest(`${backendServerUrl}/web/bomManage/updateFileInfo`, data, token);
        if (res && res.status === 200) {
            return res.data;
        }
        return null;
    }
    // 修改文件 /web/bomManage/deleteFileInfo
    async deleteFileInfo(data, token) {
        const res = await postAuthorizeRequest(`${backendServerUrl}/web/bomManage/deleteFileInfo`, data, token);
        if (res && res.status === 200) {
            return res.data;
        }
        return null;
    }

}

export default new QuoteRepository();
