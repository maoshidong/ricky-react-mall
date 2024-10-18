export const getEnvUrl = url => {
    return url
}

export const LOGIN = "/login"
export const REGISTER = "/register"   // /account/register ？？？？？
export const RETRIEVE_PASSWORD = "/retrieve-password"
export const ACCOUNT_QUOTE = "/quote"
export const ACCOUNT_QUOTE_BOM_UPLOAD = "/bom-upload" // #bom工具
export const QUOTE_BOM_DETAIL = "/quote/bom-detail"
export const QUALITY = "/quality" // 质量
export const QUICK_ORDER = "/quick-order" // 快速订单
export const PACKAGE_TRACKING = "/package-tracking" // 包裹跟踪

// 项目 account/shopping-cart# account/retrieve-password
export const ACCOUNT_PROJECT_DETAIL = "/account/project-detail"
export const ACCOUNT_CART_HASH = 'shopping-cart' // 购物车哈希
export const ACCOUNT_CART_PROJECT_HASH = 'my-project' // 购物车项目哈希
export const ACCOUNT_CART_CART_HASH = 'my-cart' // 购物车篮子哈希
export const ACCOUNT_FAVORITES_HASH = 'my-favorites' // 购物车收藏哈希

export const ACCOUNT_SHOPPING_CART = "/account/shopping-cart"
export const ACCOUNT_ORDER = "/account/orders" // 订单列表
export const ACCOUNT_ORDER_DETAIL = "/account/order-detail" // 订单详情
export const SURCHARGE_DETAILS = "/account/surcharge-details" // 附加费用订单详情
// 个人中心菜单
export const ACCOUNT_USER_INFORMATION = "/account/user-information"
export const ACCOUNT_ADDRESS = "/account/addresses"
export const ACCOUNT_VAT_NUMBER = "/account/vat-number"
export const ACCOUNT_FREIGHT_ACCOUNTS = "/account/freight-accounts"
export const ACCOUNT_COUPON = "/account/coupon"
export const ACCOUNT_CHANGE_PASSWORD = "/account/change-password"
// My Orders
export const ACCOUNT_ORDERS = "/account/orders"
export const ACCOUNT_ORDERS_HISTROY = "/account/orders-histroy"
export const ACCOUNT_ORDERS_PROJECT = "/account/project" // 项目
export const ACCOUNT_ORDERS_CART = "/account/cart" // 购物车篮子
export const ACCOUNT_CART_DETAIL = "/account/cart-detail" // 购物车篮子

export const ACCOUNT_FAVORITES = "/account/favorites"
export const ACCOUNT_CUSTOMER_REFERENCE = "/account/customer-reference"
export const ACCOUNT_BROWSE_HISTORY = "/account/browse-history"

export const ACCOUNT_INVENTORY_SOLUTIONS = "/account/inventory-solutions"
export const ACCOUNT_SAMPLE_LIST = "/account/sample-list"
export const ACCOUNT_QUOTE_HISTORY = "/account/quote-history"
export const ACCOUNT_SAVED_BOMS = "/account/saved-boms"
// 产品
export const PRODUCTS = "/products" // ${process.env.language-edit}  添加上语言前缀
export const PRODUCTS_NEWEST_PRODUCTS = "/products/newest-products"
export const PRODUCTS_HOT_PRODUCTS = "/products/hot-products"
export const PRODUCTS_RECOMMEND_PRODUCTS = "/products/recommend-products"
export const PRODUCTS_DISCOUNT_PRODUCTS = "/products/discount-products"
export const PRODUCTS_DETAIL = "/products/detail" // ${PRODUCTS_DETAIL} 产品详情页减少层级  rel="prefetch"
export const PRODUCTS_CATALOG = "/products/catalog"
export const PRODUCTS_FILTER = "/products/filter"
export const PRODUCTS_LIST = "/products/list"
export const SERIES_PRODUCT_NUMBER = "/series-product-number"
export const PRODUCTS_COMPARE = "/products/compare"
export const PRODUCTS_UNCLASSIFIED = '/products/unclassified' // 未分类产品

export const MANUFACTURER = "/manufacturer" // 供应商短语是否正确  {/* 品牌管理中品牌主页状态slugStatus: 0 关闭 1 开启，开启才能跳转到品牌主页*/}
export const MANUFACTURER_CATEGORY = "/manufacturer-category"
export const POPULAR_MANUFACTURERS = "/popular-manufacturers" // 推荐供应商
// 新闻
export const NEWSROOM = "/news" // 公司新闻  
export const NEWS = "/content-search" // 新闻内容页
export const CONTENT_SEARCH = "/content-search"  // 新闻首页
export const PRODUCT_HIGHLIGHTS = "/product-highlights" // 特色产品
export const APPLICATION_NOTES = "/application-notes" // 应用笔记
export const VIDEOS = "/videos"
export const BLOG = "/blog"
export const ALL_TAGS = "/all-tags"

export const PRIVACY_CENTER = "/policy/privacy-policy" // 隐私政策 
export const PRIVACY_TERMS_AND_CONDITIONS = "/policy/terms-and-conditions" // 条款和条件


export const HELP_SITE_MAP = "/help/site-map" // 网站地图
export const HELP_SHIPPING_RATES = "/help/shipping-rates" // 运费费用
export const HELP_FREE_SAMPLE = "/help/free-sample" // 免费样品
export const HELP_CENTER = "/help-center" // 帮助中心


export const PAGE_ABOUT_US = "/page/about-us"
export const PAGE_CERTIFICATIONS = "/page/certifications"
export const PAGE_INVENTORY_SOLUTIONS = "/page/inventory-solutions"
export const PAGE_IENVIRONMENTAL = "/page/environmental"
export const PAGE_CAREERS = "/page/careers"
export const PAGE_CONTACT_US = "/page/contact-us"




export const AboutUsRouterList = [
    { routerName: 'About Us', url: PAGE_ABOUT_US },
    { routerName: 'Certifications', url: PAGE_CERTIFICATIONS },
    { routerName: 'Inventory Solutions', url: PAGE_INVENTORY_SOLUTIONS },
    // { routerName: 'Our Advantage', url: `${PAGE_ABOUT_US}#our-advantage`},
    { routerName: 'Environmental', url: PAGE_IENVIRONMENTAL },
    { routerName: 'Careers', url: PAGE_CAREERS },
    // { routerName: 'Core Values', url: `${PAGE_ABOUT_US}#core-values` },
    { routerName: 'Contact Us', url: PAGE_CONTACT_US },
]
export const ToolsRouterList = [
    {routerName: 'Quote Request', url: ACCOUNT_QUOTE},
    {routerName: 'BOM Tools', url: ACCOUNT_QUOTE_BOM_UPLOAD},
    {routerName: 'Conversion Calculators', url: '/#'},
    {routerName: 'Quick Order', url: QUICK_ORDER},
]
export const SupportRouterList = [
    {routerName: 'Free Sample', url: HELP_FREE_SAMPLE, needLog: true},
    {routerName: 'Package Tracking', url: PACKAGE_TRACKING},
    {routerName: 'Blogs', url: BLOG},
]
export const HotProductsRouterList = [
    {routerName: 'Newest Products', url: PRODUCTS_NEWEST_PRODUCTS},
    {routerName: 'Hot Products', url: PRODUCTS_HOT_PRODUCTS},
    {routerName: 'Recommended Products', url: PRODUCTS_RECOMMEND_PRODUCTS},
    {routerName: 'Discount Products', url: PRODUCTS_DISCOUNT_PRODUCTS},
]