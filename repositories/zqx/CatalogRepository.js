import Repository, { backendServerUrl, serializeQuery } from '../Repository';
// 多语言-检查完了
class CatalogRepository {
    // 获取分类面包屑      
    async getCatalogBreadcrumbList(catalogId, languageType) {
        let params = {
            id: Number(catalogId),
            catalogsBreadcrumb: 'en',
        }
        if(languageType) {
            params.languageType = languageType
        }
        const param = serializeQuery(params)
        const res = await Repository.get(`${backendServerUrl}/app/catalogs/getCatalogSlugList?${param}`)
        return res?.data?.data || []
    }
    // {
    //     "keyword": "demoData",  搜索1关键词
    //     "keywordList": [    多个关键词
    //       "demoData"
    //     ],
    //     "attributeIdList": [  勾选属性idlist
    //       1
    //     ],
    //     "keyword2": 1,    分类id CatalogId
    //     "keyword3": 1,    品牌id CatalogId
    //     "isSort": 1,    是否排序      之前改过的接口getProductListWebEs  加上这个字段  ，新接口不用排
    //     "isFilter": 1,  就用在新接口那个属性筛选上
    //     "esIndex": "products_attribute_new",
    //     "pageListNum": 1, "pageListSize": 1
    //     isManyType： 1 只选择了一种属性    
    //   }
    // filter页面， 几个接口都传一样的参数，保持同步 
    // 获取属性-新版
    async getProductFilter(params={}) {
        return await Repository.post(`${backendServerUrl}/app/catalogs/getProductFilterEs`,  {
            ...params,
            isFilter: 1,
            esIndex: "products_attribute_new",
        })
    }

    // 获取分类系列列表
    async apiGetCatalogSeriesList(params={}) {
        return await Repository.post(`${backendServerUrl}/app/catalogs/getCatalogSeriesList`,  params)
    }
    // 搜索分类关联品牌
    async apiSearchCatalogManufacturersList(params={}) {
        const res = await Repository.post(`${backendServerUrl}/app/catalogs/searchCatalogManufacturersList`,  {
					languageType: 'en',
					...params,
				})
				return res?.data || []
    }


    // 获取属性-旧版
    // async getProductFilter(catalogId, idList, otherData) {
    //     const params = {
    //         catalogId,
    //         idList,
    //         keywordList: otherData?.keywordList || [],
    //         manufacturerSlug: otherData?.slug || '',
    //     }
    //     return await Repository.post(`${backendServerUrl}/app/catalogs/getProductFilter`, params)
    // }
}

export default new CatalogRepository();
