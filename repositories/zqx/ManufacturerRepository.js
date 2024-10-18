import Repository, { backendServerUrl } from '../Repository';
import { I18NEXT_DOMAINS, I18NEXT_LOCALE } from '~/utilities/constant'

// const CATALOG_PROPERTIES = ['name,slug,image,locale,description,catalogId,parentCatalogId']
const languageType = 'en'
// 多语言-检查完了
class ManufacturerRepository {
    // parentId处理了 parentId没处理
    // 供应商需要处理parentId的接口
    // 所有供应商 /app/manufacturers/getAllManufacturersListWeb; 
    // 推荐供应商 /app/manufacturers/getRecommendManufacturersListWeb;   有parentId
    // 产品详情 /app/products/productDetail;                             有parentId
    // 产品系列 /web/productSeries/queryProductSeriesList;
    // 新闻详情 /web/news/queryNewsDetail                        
    // 查询分类查关联品牌 /app/catalogs/getCatalogRelaManufacturer        有parentId
    // 新闻列表(列表中相关的供应商) /web/news/queryNewsList        
    // 根据产品ids 获取详情数据 /app/products/productDetailList           有parentId
    // 所有供应商
    async getAllManufacturersListWeb(params) {
        const res = await Repository.post(`${backendServerUrl}/app/manufacturers/getAllManufacturersListWeb`, {
            languageType: 'en',
			...params,
        })
        return res?.data
    }

    // 推荐供应商 - 旧的
    async getRecommendListWeb(params={
        pageNum: 1,
        pageSize: 50,
        keyword: '',
    }) {
        const reponse = await Repository.post(`${backendServerUrl}/app/manufacturers/getRecommendManufacturersListWeb`, {
            languageType: 'en',
            ...params,
        })
        .then((response) => {
            return response?.data
        })
        return reponse;
    }
    // 推荐供应商 - 新的
    async apiRecommendManufacturers(params={
        pageNum: 1,
        pageSize: 50,
        keyword: '',
    }) {
        const reponse = await Repository.post(`${backendServerUrl}/app/manufacturers/getRecommendManufacturersListWeb`, {
            languageType: 'en',
            ...params,
        })
        .then((response) => {
            return response?.data
        })
        return reponse;
    }
    // 供应商对应的分类 - 新的,传slug, 不传manufacturerId了  检查： 分类传供应商id
    async apiManufacturersCatalogList(params) {
        // 没有参数旧不调用，快速返回
        if(!params?.manufacturerSlug) {
            return {data: {}}
        }
        const reponse = await Repository.post(`${backendServerUrl}/app/manufacturers/searchManufacturersCatalogList`, {
            languageType: 'en',
            ...params,
        })
        .then((response) => {
            return response?.data
        })
        return reponse;
    }

    // 用户端查询所有品牌  分页 manufacturers/getAllManufacturersListWebForNews
    async apiNewsManufacturers(params) {
        const res = await Repository.post(`${backendServerUrl}/app/manufacturers/getAllManufacturersListWebForNews`, {
            languageType,
			...params,
        })
        return res?.data
    }
    // 制造商按产品类别 
    async apiImfgListByCatalog(params) {
        const res = await Repository.post(`${backendServerUrl}/app/manufacturers/mfgListByCatalog`, {
            languageType,
						...params,
        })
        return res?.data
    }
		
		

}

export default new ManufacturerRepository();
