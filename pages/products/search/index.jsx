import PageContainer from '~/components/layouts/PageContainer';
import ZqxProductRepository from '~/repositories/zqx/ProductRepository';
import { isIncludes, getProductUrl } from '~/utilities/common-helpers'
import { encrypt } from '~/utilities/common-helpers'
import { getEnvUrl, PRODUCTS_FILTER, PRODUCTS } from '~/utilities/sites-url'
// import { changeServerSideLanguage } from '~/utilities/easy-helpers';  

const SearchKeywordsPage = ({ a, keywords, keywordsProducts }) => {
    // const { catalogCount, catalogsVo, searchVos } = keywordsProducts || {}
    // 仅在客户端使用 next/router
    // http://localhost:3003/en/products/search?keywords=
    // if (typeof window !== 'undefined') {
    //     // 结果只有一个，跳转到详情 - KSZ8895MQXIA
    //     if(searchVos?.data?.length === 1) {
    //         const { manufacturerSlug, name, id } = searchVos?.data[0] || {}
    //         Router.push(getProductUrl(manufacturerSlug, name, id))
    //         // return null
    //     }

    //     // 多个产品, 只有一个分类 - STM0091041  DG408DY
    //     else if(catalogCount === 1) {
    //         const { parentSlug, slug, id } = catalogsVo || {}
    //         Router.push(`${getEnvUrl(PRODUCTS_FILTER)}/${isIncludes(parentSlug)}/${isIncludes(slug)}/${id}?keywords=${encrypt(keywords || '')}`);
    //         // return null
    //     }

    //     // 多个产品, 多个分类 - STM
    //     else if(catalogCount > 1) {
    //         Router.push(`${getEnvUrl(PRODUCTS)}?keywords=${encrypt(keywords || '')}`);
    //         // return null
    //     }

    //     // 搜索不到型号
    //     else if(catalogCount === 0) {
    //         Router.push(`${getEnvUrl(PRODUCTS)}?keywords=${encrypt(keywords || '')}`);
    //         // return null
    //     }
    // }

    return (
        <PageContainer>
            <div></div>
        </PageContainer>
    )
}

export default SearchKeywordsPage

export async function getServerSideProps({ req, query }) {
    // const translations = await changeServerSideLanguage(req)
        // const decodedKeyword = decodeURIComponent(query.keywords); // 解码参数
        // const processedKeyword = decodedKeyword.replace(/\+/g, '+'); // 恢复 '+' 号

        const { keywords } = query || {}
        const params = {
            keyword: keywords,
            keywordList: [keywords],
        }
        // getProductsByName、apiSearchProductByEs
        const keywordsProducts = await ZqxProductRepository.apiSearchProductByEs(params)
        
        // return {
        //     props: {
        //         a: processedKeyword,
        //         keywords: keywords || '',
        //         keywordsProducts: keywordsProducts?.data || [],
        //     },
        // }

        const { catalogCount, catalogsVo, searchVos } = keywordsProducts?.data || {}
        // 结果只有一个，跳转到详情 - KSZ8895MQXIA
        let url = `${getEnvUrl(PRODUCTS)}?keywords=${encrypt(keywords || '')}`
        if(searchVos?.data?.length === 1) {
            const { manufacturerSlug, name, id } = searchVos?.data[0] || {}
            url = getProductUrl(manufacturerSlug, name, id)
        } else  if(catalogCount === 1) {
            // 多个产品, 只有一个分类 - STM0091041
            const { parentSlug, slug, id } = catalogsVo || {}
            // /${isIncludes(parentSlug)}
            url = `${getEnvUrl(PRODUCTS_FILTER)}/${isIncludes(slug)}/${id}?keywords=${encrypt(keywords || '')}`
        }

        return {
            redirect: {
                destination: url,
                // permanent: true
            }
        }
};
