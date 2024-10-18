
import { getEnvUrl, ACCOUNT_QUOTE, PACKAGE_TRACKING, ACCOUNT_QUOTE_BOM_UPLOAD } from '~/utilities/sites-url';

// export const PAYPAL_CLIENT_ID = "AdQW1S8afP4NNAtlBPgiSkc0xg8oYaMnGzIXYvLKP-3J__tM5WY25JD21TFlA_IvubwKSbUgltCvEPYX" // 测试
export const PAYPAL_CLIENT_ID = 'AYk0Z7BsIC7qd2yx-pqMbxABkDtuozvIkm1qBaGZP48tPWyCEgqQ9XR-iKBW3T_TBAM06BUtLMPTmT8T'; // 线上
export const PAYPAL_INITIAL_OPTIONS = {
	'client-id': PAYPAL_CLIENT_ID,
	currency: 'USD',
	intent: 'authorize', // 表示你希望 PayPal 在用户确认订单后预授权扣款，但并不立即从用户账户中扣款。在预授权期限结束之前，你需要调用 PayPal 的其他 API 来完成付款。
	// intent: "capture", // 表示你希望 PayPal 在用户确认订单后立即从用户账户中扣款。这是默认值。
	// "data-client-token": "EGw1EGi9S-RRBd2ZU1HbogZCsJLn1Y9lbGNyiJExk8cL5GoWkhYlkoUI8YsWy8L2x1rTowkjFKvRkPSi",
};
// PayPal    Wire Transfer/Proforma
// const iPayPal = i18Translate('i18AboutOrder2.PayPal', 'PayPal')
// const iWireTransferProforma = i18Translate('s.Wire Transfer/Proforma', 'Wire Transfer/Proforma')
// 支付类型
export const PAYMENT_TYPE = {
    PayPal: 1,
    LianLian: 2,
    WireTransfer: 4,
    Alipay: 5,
}
export const PAY_STATUS = {
    1: 'Payment Pending',
    2: 'have paid',
    3: 'Refunded',
}
// 购物车订单类型 type: 1 默认 2 报价 3 多订单;
export const CART_TYPE = {
    1: 1,
    2: 2,
    3: 3,
}
// 状态（1 已提交 2：付款成功(管理： 待审核) 3 已完成  10：待发货  20：部分发货 30：全部发货  40：已取消，管理端如图供应商问题
export const ORDER_STATUS = {
    submit: 1, // 提交
    sucPayment: 2, // 付款成功
    fulfillment: 3, // 完成
    commodityDelivery: 10, // 待发货
    partDelivery: 20, // 部分发货
    waitDelivery: 30, // 全部发货
    canceled: 40, // 已取消
}
export const ORDER_STATUS_TEXT = [
    { label: 'Payment Pending', value: ORDER_STATUS.submit },
    { label: 'Processing', value: ORDER_STATUS.sucPayment }, // Processing
    { label: 'Order Completed', value: ORDER_STATUS.fulfillment },
    { label: 'Wait for Delivery', value: ORDER_STATUS.commodityDelivery },
    { label: 'Partially Shipped', value: ORDER_STATUS.partDelivery },
    { label: 'All Shipped', value: ORDER_STATUS.waitDelivery },
    { label: 'Canceled', value: ORDER_STATUS.canceled },
]

export const TABLE_COLUMN = {
    selectWidth: 60,
    cost: 'Cost(1kg)',
    select: 'Select',
    delete: 'Delete',
    deleteWidth: 60,
    shipped: 'Shipped',
    orderStatus: 'Status',
    orderDate: 'Order Date',
    orderNo: 'Order Number',
    productDetail: 'Product Detail', // 产品详情
    unitPrice: 'Unit Price', // 产品单价
    availability: 'Availability',
    orderQty: 'Ordered',  // 下单数量
    shipQty: 'Shipped', // 发货数量
    DateAdded: 'Date added',
    DateCreated: 'Date Created',
    operation: 'Operation',
    remark: 'Remark',
}

export const DATE_OPTIONS = [
    {label: 'Today', value: 1},
    {label: 'Last 3 days', value: 2},
    {label: 'Last 7 days', value: 3},
    {label: 'Last 30 days', value: 4},
    {label: 'Last 90 days', value: 5},
    {label: 'Last 180 days', value: 6},
    {label: 'Last 365 days', value: 7},
    // {label: 'Today', value: 1},
    // {label: 'Within three days', value: 2},
    // {label: 'Within seven days', value: 3},
    // {label: 'Within one month', value: 4},
    // {label: 'Within three months', value: 5},
    // {label: 'Within half a year', value: 6},
    // {label: 'Within a year', value: 7},
]

export const LEAD_TIME = [
    {label: '1-2 workdays', value: 1},
    {label: '1-3 workdays', value: 2},
    {label: '1 week', value: 3},
    {label: '1-2 weeks', value: 4},
    {label: '3-4 weeks', value: 5},
]

export const QUOTE_STATUS_TEXT = [
    {label: 'Pending', value: 9},
    {label: 'Complete', value: 2},
    {label: 'Sold Out', value: 3},
]

export const INSURANCE_TYPE = {
    0: 'Do Not Add Shipping Insurance.',
    1: "Add Shipping Insurance."
}

export const PUB_RESOURCE_TYPE = {
    resource: 1, // 资源管理
    attribute: 2, // 属性管理
    aboutWebsite: 3, // 关于网站
    helpCenter: 4, // 帮助中心
    companyNews: 5, // 公司新闻
    video: 7, // 视频管理
    appliedNote: 8, // 应用笔记
}
// 模板类型
export const PUB_ARTICLE_TYPE = {
    specialProduct: 1, // 特色产品
    article: 2, // 文章、博客...
    privacyPolicy: 3, // 隐私政策
    termsConditions: 4, // 条款条件政策
    appliedNote: 8, // 应用笔记
}
// 新闻所有模板类型
export const NEWS_ALL_TEMPLATE_TYPE = {
    functionTemp: 101, // 资源管理
    productTypeTemp: 102, // 属性管理
    brandsTemp: 103, // 供应商
}


// 查询快递公司运单号
// https://www.dhl.com/cn-en/home/tracking/tracking-global-forwarding.html?submit=1&tracking-id=运单号
// https://www.fedex.com/fedextrack/no-results-found?trknbr=运单号
// https://www.ups.com/track?loc=en_US&requester=QUIC&tracknum=运单号
// https://www.sf-international.com/us/en/dynamic_function/waybill/#search/bill-number/运单号

export const PAYPAL_VAT = 0.046
export const LIANLIAN_VAT = 0.046
export const WIRE_TRANSFER_VAT = 35.00



// 产品分享
export const DETAIL_FOLLOW_US = [
    { class: 'share-icon-facebook', url: 'https://facebook.com/sharer/sharer.php', name: 'facebook', alt: "Facebook" },
    { class: 'share-icon-linkedin', url: 'https://www.linkedin.com/shareArticle', name: 'linkedin', alt:"LinkedIn" },
    { class: 'share-icon-twitter', url: 'https://twitter.com/intent/tweet', name: 'twitter' },
    { class: 'share-icon-email', url: 'mailto:', name: 'mailto', alt: "Mailto" },
    // { class: 'sprite-home-min-3-4', url: '/' },
    // { class: 'sprite-home-min-3-5', url: '/' },
    // { class: 'sprite-home-min-3-6', url: '/' },
]
// 非产品
export const FOLLOW_US = [
    { class: 'sprite-home-min-3-1', url: 'https://www.facebook.com/Origin-Data-Global-Limited-100878739724371', name: 'facebook', alt: "Facebook" },
    // { class: 'sprite-home-min-3-2', url: 'https://www.linkedin.com/shareArticle', name: 'linkedin', alt: "LinkedIn" },
    { class: 'sprite-home-min-3-5', url: 'https://twitter.com/Origin_IC', name: 'twitter', alt: "X" }, // alt="Instagram"
    // { class: 'sprite-home-min-3-4', url: '/' },
    { class: 'sprite-home-min-3-3', url: 'https://www.youtube.com/@Origin_Data', name: 'youTube', alt: "YouTube" },
    { class: 'sprite-home-min-3-6', url: 'https://www.tiktok.com/@origin_data', name: 'tiktok', alt: "Tiktok" },
]
export const SERVICE_LIST = [
    { label: 'Massive Stock Inventory', className: 'sprite-3 sprite-3_2', des: 'Provide more than 800,000 kinds of spot inventory' },
    { label: 'Fast Delivery', className: 'sprite-3 sprite-3_3', des: 'Usually orders are shipped within 24 hours' },
    { label: '365 Days Warranty', className: 'sprite-3 sprite-3_4', des: 'All products have a full year warranty' },
    { label: 'Purchase Securely', className: 'sprite-footer-icon sprite-footer-icon-1-4', des: '' },
    // { label: 'Purchase Securely', className: 'sprite-3 sprite-3_1', des: '' }, // No order limit, Worldwide delivery
    { label: '24/7 Support', className: 'sprite-3 sprite-3_5', des: 'Customer support is on deck' }, // 24*7h Service   24/7 Support  
]

export const RESOURCES_TOOLS_LIST = [
    {name: "Quote Request", className: 'sprite-2 sprite-2_1', url: getEnvUrl(ACCOUNT_QUOTE)},
    {name: "BOM Tools", className: 'sprite-2 sprite-2_2', url: getEnvUrl(ACCOUNT_QUOTE_BOM_UPLOAD)}, 
    {name: 'Conversion Calculators', className: 'sprite-2 sprite-2_3', url: '/#'},
    {name: 'My Favourites', className: 'sprite-2 sprite-2_4', url: '/account/shopping-cart#my-favorites', needLog: true},
    {name: 'Package Tracking', className: 'sprite-2 sprite-2_5', url: getEnvUrl(PACKAGE_TRACKING)},
    {name: 'Order Status', className: 'sprite-2 sprite-2_6', url: '/account/orders', needLog: true},
]

export const PUB_PAGINATION = {
    pageNum: 1,
    pageSize: 20,
}
export const COUPON_TAB = [
    { name: 'Unused', value: 1 },
    { name: 'Used', value: 2 },
    { name: 'Expired', value: 3 },
]
// https://oss.origin-ic.net/authPdfZh/ISO13485.png
export const CERTIFICATIONS_LIST = [
        {
            id: 1, // id, 排序不可随意变
            image: 'erai.png',
            name: 'ERAI',
            text: `ERAI provides counterfeit part and supplier risk mitigation solutions across multiple industry sectors including defense, aerospace, medical, nuclear and commercial.`,
            url: 'https://oss.origin-ic.net/authPdf/ERAI.pdf',
            active: false,
        },
        {
            image: 'esd.png',
            name: 'ESD',
            text: `ESD certification is a certification process that verifies compliance with the requirements and standards for Electrostatic Discharge (ESD) control.`,
            url: 'https://oss.origin-ic.net/authPdf/Origin_ESD.pdf', active: false,
        },
        {
            image: '912OB.png',
            name: 'AS 9120B',
            text: `AS9120B is a standard for quality management systems in the aerospace industry. It applies to stockists and distributors of parts to manufacturers that supply the aerospace industry.`,
            url: 'https://oss.origin-ic.net/authPdf/Origin_AS9120B.pdf', active: false,
        },

        {
            image: '9001.png',
            name: 'ISO 9001',
            text: `ISO 9001:2015 is an international standard that specifies requirements for a quality management system (QMS).`,
            url: 'https://oss.origin-ic.net/authPdf/Origin_ISO9001.pdf', active: false,
        },

        {
            image: '13485.png',
            name: 'ISO 13485',
            text: `ISO 13485 is an international standard that specifies requirements for a quality management system (QMS) for medical devices and related services.`,
            url: 'https://oss.origin-ic.net/authPdf/Origin_ISO13485.pdf', active: false,
        },
        {
            id: 14001, // id, 排序不可随意变
            image: '14001.png',
            name: 'ISO 14001',
            text: `ISO 14001 is an international standard that provides a framework for environmental management systems.`,
            url: 'https://oss.origin-ic.net/authPdf/Origin_ISO14001.pdf', active: false,
        },
        {
            image: '22301.png',
            name: 'ISO 22301',
            text: `ISO 22301 is an international standard that specifies requirements for a business continuity management system (BCMS).`,
            url: 'https://oss.origin-ic.net/authPdf/Origin_ISO22301.pdf', active: false,
        },
        {
            image: '28000.png',
            name: 'ISO 28000',
            text: `ISO 28000 is an international standard that provides a framework for security management systems for the supply chain.`,
            url: 'https://oss.origin-ic.net/authPdf/Origin_ISO28000.pdf', active: false,
        },
        {
            image: '37001.png',
            name: 'ISO 37001',
            text: `ISO 37001 is an international standard that provides a framework for anti-bribery management systems.`,
            url: 'https://oss.origin-ic.net/authPdf/Origin_ISO37001.pdf', active: false,
        },

        {
            image: '37301.png',
            name: 'ISO 37301',
            text: `ISO 37301:2021 is an international standard that specifies requirements and provides guidance for implementing an effective compliance management system within an organization.`,
            url: 'https://oss.origin-ic.net/authPdf/Origin_ISO37301.pdf', active: false,
        },


        {
            image: '45001.png',
            name: 'ISO 45001',
            text: `ISO 45001 is an international standard that provides a framework for occupational health and safety (OH&S) management systems.`,
            url: 'https://oss.origin-ic.net/authPdf/Origin_ISO45001.pdf', active: false,
        },
]

// 单个删除、多个删除提示
export const DEL_ONE_TEXT = 'Are you sure you want to remove this item from your basket?'
export const DEL_ALL_TEXT = 'Are you sure you want to clear your basket?'

// 型号搜索提示
export const INVALID_INPUT_TIP = "Please enter full or partial manufacturer part number, Minimum 3 letters or numbers."

export const REMARK_MAX_LENGTH = 120
export const EMPTY_IMAGE = '/static/img/products/empty.png' // 不使用这个了， 使用getLanguageEmpty, 多语言

// export const EMAIL_REGEX = /^([a-z0-9A-Z]+[-|\\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-zA-Z]{2,}$/
export const EMAIL_REGEX = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
// export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
export const CORRECT_EMAIL_TIP = 'Email address is invalid'
export const NUMBER_PATTERN = /^-?\d*\.?\d+$/;

export const PUB_SEO_TITLE = 'Electronic Components Distributor - Origin Data Electronics'



export const ORDER_SHIPPING_TIP = 'Cost price is 1kg,  If your package is of excessive weight or size, our sales will contact you prior to shipping and notify you of shipping costs.'
// export const ORDER_SHIPPING_TIP = 'If your package is of excessive weight or size, our sales will contact you prior to shipping and notify you of shipping costs.'
export const PRIVACY_POLICY_TIP = 'Login is deemed to have agreed to the Terms of Service and Privacy Policy'

export const INVENTORY_TIP = 'The purchased quantity is greater than the inventory quantity'

export const PACKAGE_SHIPPING_TIP = `Notice：if your package is of excessive weight or size，our sales will contact you prior to shipping and notify you of shipping costs.`

// 关于我们
export const ABOUT_US_ONE_ARR = [
    'Origin Data Electronics is a broad-line independent distributor of electronic components.We are committed to assisting customers in locating obsolete, end-of-life, hard-to-find parts,and commonly used materials. We provide timely and dependable',
    'quotes',
    'for hard-to-source electronic components and peripherals, with quick deliveries that our customers have come to rely on. Our online store showcases',
    'millions of parts',
    ', and we have garnered a loyal worldwide OEM client base through a tradition of excellent customer service and market flexibility.',
]
export const ABOUT_US_TWO_ARR = [
    'Our most crucial aspect is our strict QR system and professional',
    'QC team',
    ', which work together to ensure the quality of our products and services. We are members of ERAI. We have obtained',
    'ESD, AS9120B, IOS9001, ISO14001 ',
    ', and other certifications to maintain strict control over product and service quality.',
]
export const ABOUT_US_ONE = `Origin Data Electronics is a broad-line independent distributor of electronic components.We are committed to assisting customers in locating obsolete, end-of-life, hard-to-find parts,and commonly used materials. We provide timely and dependable quotes for hard-to-source electronic components and peripherals, with quick deliveries that our customers have come to rely on. Our online store showcases millions of parts, and we have garnered a loyal worldwide OEM client base through a tradition of excellent customer service and market flexibility.`
export const ABOUT_US_TWO = `Our most crucial aspect is our strict QR system and professional QC team, which work together to ensure the quality of our products and services. We are members of ERAI. We have obtained ESD, AS9120B, IOS9001, ISO14001, and other certifications to maintain strict control over product and service quality.`
export const GET_NEED = `Our experienced staff sets us apart, with years of experience in this industry and a deep understanding of the industry and the parts we sell. This allows us to collaborate with you to satisfy any of your requirements. At Origin Data, we pride ourselves on providing exceptional customer service and meeting all of your electronic component needs.`


// seo,
// 产品首页
export const PRODUCTS_META_KEYWORDS = `OriginData, Origin Data Electronics, electronic components search, find electronic components, find electronic component, electronic component search, electronic component search engine, find electronic parts, find chip, find chips, chip finder`
export const PRODUCTS_META_DESCRIPTION = `Find electronic component datasheets, inventory, and prices from hundreds of manufacturers. Origin Data Electronics is an AS9120B distributor.`
// 制造商首页
export const MANUFACTURER_META_KEYWORDS = `OriginData, Origin Data Electronics, Origin Data Electronics supplier, electronic component supplier, manufacturer line card, manufacturer list`
export const MANUFACTURER_META_DESCRIPTION = `Electronic component supplier linecard is available at Origin Data Electronics. Origin Data Electronics is an authorized distributor for industry leading electronic component suppliers.`

// filter页
export const META_DESCRIPTION = 'are in stock at Origin Data Electronics. Origin Data Electronics offers inventory, pricing;' 
export const META_KEYWORDS = 'Origin Data Electronics, electronic parts suppliers, electronic parts distributor,'
export const META_DESCRIPTION_PRICING = 'are available at Origin Data Electronics. Origin Data Electronics offers inventory, pricing; datasheets for'
// 供应商详情  filter 和产品详页可点外，其他可以不让点
// 这是上次发现的一个4级的产品 - 完成

// 非产品页，其他一些页面可以用：    非产品页，h1标题，h2描述 (非产品页-完成了大部分)
export const PUB_META_KEYWORDS = `Origin Data Electronics, Origin Data, Origin-Data, OriginData, Electronic Component Parts Distributor, order on-line, no minimum order. Semiconductors, Connectors, Resistors, Inductors, Relays, Sensors, Embedded, Optoelectronics, Capacitors, New Technologies`
export const PUB_DESCRIPTION = `integrated circuits, IC, electronic parts, components, distributor, resistors, capacitors, inductors, embedded, relays, switches, optoelectronics, sensors, transistors, diodes, microcontrollersconnectors, semiconductors,`
// 非产品页，关于我们可以用：
export const PUB_ORIGIN_META_KEYWORDS = `Origin Data Electronics , Origin Data, Origin-Data, OriginData, electronic components , electronic components, electronic parts, electronic component distributor, electronic component distributors, electronic component, electronic parts distributor, buy electronic component, buy electronic components, electronic components distributor, electronic components distributors.`



// 联系信息
export const ZQX_ADDRESS = "15F, Hangdu Bldg,No.1006 Huafu Road, Shenzhen, China"


// Origin Electronic Parts Mall  ->  Electronic Components Distributor - Origin Data Electronics
export const GENERALIZED_WORD = "Electronic Components Distributor - Origin Data Electronics" // 
export const SCOMPANY_NAME = "Origin Data Electronics"
export const SEO_COMPANY_NAME = "| Origin Data Electronics"
export const COMPANY_NAME_ZH = "芯链芯城" // 恢复中文 智勤芯商城 站点密钥 0x4AAAAAAAJDQfB5GfDuDj5b  密钥 0x4AAAAAAAJDQWLUiLKTAlRp5XuL1zb8IiE
export const SEO_COMPANY_NAME_ZH = "| 芯链芯城" // 恢复中文 智勤芯商城 站点密钥 0x4AAAAAAAJDQfB5GfDuDj5b  密钥 0x4AAAAAAAJDQWLUiLKTAlRp5XuL1zb8IiE
// 首页
const homeTit = GENERALIZED_WORD
const homeKey = "origin data, origin data electronics, electronic components distributor, electronic parts mall, electronic components wholesale"
const homeDes = "Electronic Components Distributor-Origin Data Electronics offers tens of millions of products from thousands of top manufacturers worldwide. Leading electronic component distributor, providing electronic component datasheets, real-time inventory and pricing."
// 产品目录总页
const productsTit = `Find Electronic Components ${SEO_COMPANY_NAME}`
const productsKey = "find electronic components, electronic components search, electronic parts mall, electronic components catalogs"
const productsDes = "Origin Data offers tens of millions of products from thousands of top manufacturers worldwide. Search for electronic component datasheets, real-time inventory, and prices. Origin is a member of ERAI."
// 文章内容总页
const contentSearchTit = `Electronic Component Information and Resources ${SEO_COMPANY_NAME}`
const contentSearchKey = "product highlights, product articles, technical resources, origin data, electronic parts mall"
const contentSearchDes = "Browse and search Technology Resource Center on the Origin Data site to explore articles, product highlights, the latest products, and reference designs related to electronic components and the electronics industry."
// 制造商
const manufacturerTit = `Supplier Line Card ${SEO_COMPANY_NAME}`
const manufacturerKey = "origin data, origin data supplier, manufacturer list, electronic component suppliers, manufacturer line card"
const manufacturerDes = "Origin Data offers the supply of electronic components such as Integrated Circuits(ICs), capacitors, Isolators, connectors, and more from thousands of top manufacturers worldwide. Immediate delivery available."
// 产品分类1级页
const oneCatalogTit = `Integrated Circuits (ICs) ${SEO_COMPANY_NAME}`
const oneCatalogKey = "1级分类名称(动态获取)"
const oneCatalogDes = "分类名字 - Origin Data provides real-time inventory updates and pricing. order now, 1级分类名字 ship quickly."
// 关于我们
const aboutUsTit = `About Origin Data Electronics ${SEO_COMPANY_NAME}`
const aboutUsKey = "origin data, origin-data, origin electronic parts mall, electronic component distributor, electronic components wholesale"
const aboutUsDes = "Origin Data offers electronic component supplies from thousands of top manufacturers worldwide. As one of the fastest-growing electronic component distributors globally, we provide immediate delivery options."
// 联系我们
const contactUsTit = `Contact Us ${SEO_COMPANY_NAME}`
const contactUsKey = "origin data contact us, origin electronic parts mall, electronic component distributor, electronic components wholesale"
const contactUsDes = "Contact Origin Data and send us your inquiries - we are happy to provide support."
// 认证
const certificationsTit = `Certifications ${SEO_COMPANY_NAME}`
const certificationsKey = "origin data, origin data certifications, origin electronic parts mall, electronic component distributor, electronic components wholesale"
const certificationsDes = "Origin Data is committed to safety and compliance, with a core value of continuous improvement and quality. We strive to enhance our operations, development, and delivery efforts. We have obtained ERAI membership and certifications such as AS9120B."
// 库存解决方案
const solutionsTit = `Inventory Solutions ${SEO_COMPANY_NAME}`
const solutionsKey = "origin data inventory solutions, origin electronic parts mall, electronic component distributor, electronic components wholesale"
const solutionsDes = "Looking to transfer excess or surplus electronic component inventory? Origin Data is interested. Simply provide us with your excess electronic components via phone, fax, or email, and we will contact you the same day with the best cash offer."
// 环境
const environmentalTit = `Environmental ${SEO_COMPANY_NAME}`
const environmentalKey = "origin data environmental, origin electronic parts mall, electronic component distributor, electronic components wholesale"
const environmentalDes = "Origin Data is dedicated to continuous improvement of processes that impact the environment, aiming to enhance environmental performance. "
// 职场
const careersTit = `Careers ${SEO_COMPANY_NAME}`
const careersKey = "origin data careers, origin electronic parts mall, electronic component distributor, electronic components wholesale"
const careersDes = "Explore exciting career opportunities at Origin Data. Join our dynamic team and take your career to new heights. Apply now!"
// 质量
const qualityTit = `Quality Policy ${SEO_COMPANY_NAME}`
const qualityKey = "origin data quality policy, origin electronic parts mall, electronic component distributor, electronic components wholesale, "
const qualityDes = "Committed to safety and compliance, quality is at the core of Origin Data. As a member of ERAI and certified in ESD, AS9120B, ISO9001, and other standards, we have stringent measures in place to control the quality of our products and services."
// 隐私政策 
const privacyPolicyTit = `Privacy Policy ${SEO_COMPANY_NAME}`
const privacyPolicyKey = "origin data privacy, origin data cookies, origin data security, origin data website"
const privacyPolicyDes = "Learn about Origin Data policy for collecting, using and protecting the personal data of our customers."
// 条件和条款
const termsTit = `Terms And Conditions ${SEO_COMPANY_NAME}`
const termsKey = "origin data terms and conditions, terms of use, conditions of order, origin data"
const termsDes = "View Origin Data's terms of use and conditions of order."
// 特色产品
const productHighlightsTit = `Product Highlights ${SEO_COMPANY_NAME}`
const productHighlightsKey = "origin data, new product, newest electronic components products, origin electronic parts mall"
const productHighlightsDes = "Check out the newest additions to Origin Data extensive inventory of electronic components. Place your order online today!"
// 博客
const blogTit = `Blog ${SEO_COMPANY_NAME}`
const blogKey = "origin data, blog, projects, education, origin electronic parts mall"
const blogDes = "Gain insights into Origin Data through a diverse range of content, including blogs, technology and product reviews, projects, teardowns, and educational articles."
// 帮助中心
const helpCenterTit = `Help Center ${SEO_COMPANY_NAME}`
const helpCenterKey = "origin data help center, ordering, shipping, delivery, origin electronic parts mall"
const helpCenterDes = "We are more than happy to assist you! Origin Data's online help center can provide assistance with placing orders, shipping, delivery, and other related inquiries."
// 公司新闻页
const newsTit = `Newsroom ${SEO_COMPANY_NAME}`
const newsKey = "industry news, origin data press releases, electronic components news, events, origin electronic parts mall"
const newsDes = "Stay up to date in the Origin Data newsroom and stay up to date on the latest happenings at Origin Data."
// 热卖产品
const hotProductsTit = `Hot Products ${SEO_COMPANY_NAME}`
const hotProductsKey = "origin data, hot products, popular products, best-selling products, origin electronic parts mall"
const hotProductsDes = "Origin Data - launches hot-selling products every day and every week, with a full range of products. Order now! Fast delivery."
// 推荐产品
const recommendProductsTit = `Recommended Products ${SEO_COMPANY_NAME}`
const recommendProductsKey = "origin data, recommended products, ready-made products, electronic component recommendations, origin electronic parts mall"
const recommendProductsDes = "Origin Data - Recommended products are launched every day and every week, with a full range of products. Order now! Fast delivery."
// 特价产品 (和博客的关键词和描述在管理端栏目中编辑)
const discountProductsTit = `Discount Products ${SEO_COMPANY_NAME}`
const discountProductsKey = "origin data, discount products, special products, preferential products, origin electronic parts mall"
const discountProductsDes = "Origin Data - launches special offers every day and every week, with a full range of products. Order now! Fast delivery."
// 询价页面
const quoteTit = `Request a Quote ${SEO_COMPANY_NAME}`
const quoteKey = "request a quote, electronic components inquiry, price and availability, BOMs, origin electronic parts mall"
const quoteDes = "Origin Data is ready for you to check the price and availability of millions of electronic components; it's even easier with the BOMs tool."
// BOM报价
const bomQuoteTit = `BOM Quote ${SEO_COMPANY_NAME}`
const bomQuoteKey = "request a quote, BOMs, electronic components inquiry, price and availability, origin electronic parts mall"
const bomQuoteDes = "Origin Data is ready for you to check the price and availability of millions of electronic components; it's even easier with the BOMs tool."
// 历史报价
const quoteHistoryTit = `Quote Request history ${SEO_COMPANY_NAME}`
const quoteHistoryKey = "quote request history, request a quote, BOMs, price and availability, origin data, origin electronic parts mall"
const quoteHistoryDes = "View historical quote records at Origin Data."
// 包裹跟踪
const packageTrackingTit = `Package Tracking ${SEO_COMPANY_NAME}`
const packageTrackingKey = "parcel tracking, orders, shipments, deliveries, origin electronic parts mall"
const packageTrackingDes = "Origin Data provides real-time status of orders, from order placement to delivery. Order now! Fast delivery."
// 运费
const shippingRatesTit = `Shipping Rates ${SEO_COMPANY_NAME}`
const shippingRatesKey = "Shipping method, shipping freight, shipping time, origin data, origin electronic parts mall"
const shippingRatesDes = "Origin Data offers fast shipping worldwide. View estimated shipping costs by selecting your country. Order now! Fast delivery."
// 样品
const freeSampleTit = `Free Sample Request ${SEO_COMPANY_NAME}`
const freeSampleKey = "Apply for samples, free electronic components, project support, origin data, origin electronic parts mall"
const freeSampleDes = "Origin Data supports small batch production testing and provides free electronic component samples."
// 网站地图
const siteMapTit = `Site Map ${SEO_COMPANY_NAME}`
const siteMapKey = "Origin Data，Site Map，origin electronic parts mall，Find Electronic Components，Electronic components distributor"
const siteMapDes = "Origin Data offers tens of millions of products from thousands of top manufacturers worldwide. Origin is a member of ERAI. Order now! Fast delivery."
// 产品系列主页
const seriesTit = `All Series Products ${SEO_COMPANY_NAME}`
const seriesKey = "series product number, origin data, origin electronic parts mall, find electronic components, electronic components distributor"
const seriesDes = "Origin Data offers product listings from thousands of top manufacturers around the world. Origin is a member of ERAI. Order now! Fast delivery."
// 产品索引
const productsListTit = `Electronic Parts Index ${SEO_COMPANY_NAME}`
const productsListKey = "electronic parts index, product list, origin electronic parts mall, find electronic components, electronic components distributor"
const productsListDes = "Origin Data Electronic Parts Index provides pricing on millions of products from thousands of top manufacturers around the world, Datasheet. Order now! Fast delivery."
// 产品索引详页
const productsDetailTit = `Electronic Parts Index ${SEO_COMPANY_NAME}`
const productsDetailKey = `Electronic Parts Index ${SEO_COMPANY_NAME}`
const productsDetailDes = `Electronic Parts Index ${SEO_COMPANY_NAME}`

// // 产品分类, 产品详页(完成) 动态数据        帮助中心-详情页(管理端没有key和des), 公司新闻页(管理端没有key和des)-详情页
 // 未完成
export const All_SEO1 = {
    home: { homeTit, homeKey, homeDes },
    products: { productsTit, productsKey, productsDes },
    contentSearch: { contentSearchTit, contentSearchKey, contentSearchDes },
    manufacturer: { manufacturerTit, manufacturerKey, manufacturerDes },
    oneCatalog: { oneCatalogTit, oneCatalogKey, oneCatalogDes }, // 动态， 不在这处理
}
export const All_SEO2 = {
    aboutUs: { aboutUsTit, aboutUsKey, aboutUsDes },
    contactUs: { contactUsTit, contactUsKey, contactUsDes },
    certifications: { certificationsTit, certificationsKey, certificationsDes },
    solutions: { solutionsTit, solutionsKey, solutionsDes },
    environmental: { environmentalTit, environmentalKey, environmentalDes },
}
export const All_SEO3 = {
    careers: { careersTit, careersKey, careersDes },
    quality: { qualityTit, qualityKey, qualityDes },
    privacyPolicy: { privacyPolicyTit, privacyPolicyKey, privacyPolicyDes },
    terms: { termsTit, termsKey, termsDes },
    productHighlights: { productHighlightsTit, productHighlightsKey, productHighlightsDes },
}
export const All_SEO4 = {
    blog: { blogTit, blogKey, blogDes },
    news: { newsTit, newsKey, newsDes },
    hotProducts: { hotProductsTit, hotProductsKey, hotProductsDes },
    recommendProducts: { recommendProductsTit, recommendProductsKey, recommendProductsDes },
    discountProducts: { discountProductsTit, discountProductsKey, discountProductsDes },
}

export const All_SEO5 = {
    helpCenter: { helpCenterTit, helpCenterKey, helpCenterDes },
    quote: { quoteTit, quoteKey, quoteDes },
    bomQuote: { bomQuoteTit, bomQuoteKey, bomQuoteDes },
    quoteHistory: { quoteHistoryTit, quoteHistoryKey, quoteHistoryDes },
    packageTracking: { packageTrackingTit, packageTrackingKey, packageTrackingDes },
}
export const All_SEO6 = {
    shippingRates: { shippingRatesTit, shippingRatesKey, shippingRatesDes },
    freeSample: { freeSampleTit, freeSampleKey, freeSampleDes },
    siteMap: { siteMapTit, siteMapKey, siteMapDes },
    series: { seriesTit, seriesKey, seriesDes },
    productsList: { productsListTit, productsListKey, productsListDes },
}

// 货币
export const CURRENCY = {
	en: {label:'$',value:'USD'},
	zh: {label:'¥',value:'RMB'}
}

 // 测试zh
 /**
	* 注意：这里的host不带https
	*/
export const I18NEXT_LOCALE = {
    en: "en",
    enHost: "www.origin-ic.com",
    zh: "zh",
    zhHost: "www.szxlxc.com",
}

// localhost:3003      192.168.3.132   

export const I18NEXT_DOMAINS = [
     // defaultLocale 恢复中文 zh - 中文域名也展示英文时，注意：中文域名的新闻也还是只展示中文的时候不修改
    { domain: 'www.szxlxc.com', httpDomain: 'https://www.szxlxc.com', defaultLocale: 'zh', code: 'cn', name: "China", cname: "中国", class: "sprite-language-1-1" },
    { domain: 'www.origin-ic.com', httpDomain: 'https://www.origin-ic.com', defaultLocale: 'en', code: 'us', name: "United States", cname: "美国", class: "sprite-language-4-5" },
    // { domain: 'www.origin-ic.net', defaultLocale: 'en', code: 'us', name: "United States", cname: "美国", class: "sprite-language-4-5" }, // 即将废弃

    // { domain: 'hk.origin-ic.net', defaultLocale: 'zh', code: 'hk', name: "Hong Kong,China", cname: "中国香港", class: "sprite-language-2-1" },
    // { domain: 'in.origin-ic.net', defaultLocale: 'en', code: 'in', name: "India", cname: "印度", class: "sprite-language-3-1" },
    // { domain: 'jp.origin-ic.net', defaultLocale: 'en', code: 'jp', name: "Japan", cname: "日本", class: "sprite-language-4-1" },
    // { domain: 'my.origin-ic.net', defaultLocale: 'en', code: 'my', name: "Malaysia", cname: "马来西亚", class: "sprite-language-5-1" },
    // { domain: 'ph.origin-ic.net', defaultLocale: 'en', code: 'ph', name: "Philippines", cname: "菲律宾", class: "sprite-language-6-1" },
    // { domain: 'sg.origin-ic.net', defaultLocale: 'en', code: 'sg', name: "Singapore", cname: "新加坡", class: "sprite-language-7-1" },
    // { domain: 'kr.origin-ic.net', defaultLocale: 'en', code: 'kr', name: "South Korea", cname: "韩国", class: "sprite-language-8-1" },
    // { domain: 'tw.origin-ic.net', defaultLocale: 'en', code: 'tw', name: "Taiwan,China", cname: "中国台湾", class: "sprite-language-9-1" },
    	
    // { domain: 'th.origin-ic.net', defaultLocale: 'en', code: 'th', name: "Thailand", cname: "泰国", class: "sprite-language-10-1" },
    // { domain: 'au.origin-ic.net', defaultLocale: 'en', code: 'au', name: "Australia", cname: "澳大利亚", class: "sprite-language-1-2" },
    // { domain: 'nz.origin-ic.net', defaultLocale: 'en', code: 'nz', name: "New Zealand", cname: "新西兰", class: "sprite-language-2-2" },
    // { domain: 'at.origin-ic.net', defaultLocale: 'en', code: 'at', name: "Austria", cname: "奥地利", class: "sprite-language-3-2" },
    // { domain: 'be.origin-ic.net', defaultLocale: 'en', code: 'be', name: "Belgium", cname: "比利时", class: "sprite-language-4-2" },
    // { domain: 'bg.origin-ic.net', defaultLocale: 'en', code: 'bg', name: "Bulgaria", cname: "保加利亚", class: "sprite-language-5-2" },
    // { domain: 'cz.origin-ic.net', defaultLocale: 'en', code: 'cz', name: "Czech Republic", cname: "捷克共和国", class: "sprite-language-6-2" },
    // { domain: 'dk.origin-ic.net', defaultLocale: 'en', code: 'dk', name: "Denmark", cname: "丹麦", class: "sprite-language-7-2" },
    // { domain: 'ee.origin-ic.net', defaultLocale: 'en', code: 'ee', name: "Estonia", cname: "爱沙尼亚", class: "sprite-language-8-2" },
    // { domain: 'fi.origin-ic.net', defaultLocale: 'en', code: 'fi', name: "Finland", cname: "芬兰", class: "sprite-language-9-2" },

    // { domain: 'fr.origin-ic.net', defaultLocale: 'en', code: 'fr', name: "France", cname: "法国", class: "sprite-language-10-2" },
    // { domain: 'de.origin-ic.net', defaultLocale: 'en', code: 'de', name: "Germany", cname: "德国", class: "sprite-language-1-3" },
    // { domain: 'gr.origin-ic.net', defaultLocale: 'en', code: 'gr', name: "Greece", cname: "希腊", class: "sprite-language-2-3" },
    // { domain: 'hu.origin-ic.net', defaultLocale: 'en', code: 'hu', name: "Hungary", cname: "匈牙利", class: "sprite-language-3-3" },
    // { domain: 'ie.origin-ic.net', defaultLocale: 'en', code: 'ie', name: "Ireland", cname: "爱尔兰", class: "sprite-language-4-3" },
    // { domain: 'it.origin-ic.net', defaultLocale: 'en', code: 'it', name: "Italy", cname: "意大利", class: "sprite-language-5-3" },
    // { domain: 'lv.origin-ic.net', defaultLocale: 'en', code: 'lv', name: "Latvia", cname: "拉脱维亚", class: "sprite-language-6-3" },
    // { domain: 'lt.origin-ic.net', defaultLocale: 'en', code: 'lt', name: "Lithuania", cname: "立陶宛", class: "sprite-language-7-3" },
    // { domain: 'lu.origin-ic.net', defaultLocale: 'en', code: 'lu', name: "Luxembourg", cname: "卢森堡", class: "sprite-language-8-3" },
    // { domain: 'nl.origin-ic.net', defaultLocale: 'en', code: 'nl', name: "Netherlands", cname: "荷兰", class: "sprite-language-9-3" },

    // { domain: 'no.origin-ic.net', defaultLocale: 'en', code: 'no', name: "Norway", cname: "挪威", class: "sprite-language-1-4" },
    // { domain: 'pl.origin-ic.net', defaultLocale: 'en', code: 'pl', name: "Poland", cname: "波兰", class: "sprite-language-2-4" },
    // { domain: 'pt.origin-ic.net', defaultLocale: 'en', code: 'pt', name: "Portugal", cname: "葡萄牙", class: "sprite-language-3-4" },
    // { domain: 'ro.origin-ic.net', defaultLocale: 'en', code: 'ro', name: "Romania", cname: "罗马尼亚", class: "sprite-language-4-4" },
    // { domain: 'sk.origin-ic.net', defaultLocale: 'en', code: 'sk', name: "Slovakia", cname: "斯洛伐克", class: "sprite-language-5-4" },
    // { domain: 'si.origin-ic.net', defaultLocale: 'en', code: 'si', name: "Slovenia", cname: "斯洛文尼亚", class: "sprite-language-6-4" },
    // { domain: 'es.origin-ic.net', defaultLocale: 'en', code: 'es', name: "Spain", cname: "西班牙", class: "sprite-language-7-4" },
    // { domain: 'se.origin-ic.net', defaultLocale: 'en', code: 'se', name: "Sweden", cname: "瑞典", class: "sprite-language-8-4" },
    // { domain: 'ch.origin-ic.net', defaultLocale: 'en', code: 'ch', name: "Switzerland", cname: "瑞士", class: "sprite-language-9-4" },
    // { domain: 'gb.origin-ic.net', defaultLocale: 'en', code: 'gb', name: "United Kingdom", cname: "英国", class: "sprite-language-10-4" },
    // { domain: 'il.origin-ic.net', defaultLocale: 'en', code: 'il', name: "Israel", cname: "以色列", class: "sprite-language-1-5" },

		// { domain: 'www.origin-ic.com', defaultLocale: 'en', code: 'us', name: "United States", cname: "美国", class: "sprite-language-4-5" },
    // { domain: 'ca.origin-ic.net', defaultLocale: 'en', code: 'ca', name: "Canada", cname: "加拿大", class: "sprite-language-2-5" },
    // { domain: 'mx.origin-ic.net', defaultLocale: 'en', code: 'mx', name: "Mexico", cname: "墨西哥", class: "sprite-language-3-5" },
    // { domain: 'br.origin-ic.net', defaultLocale: 'en', code: 'br', name: "Brazil", cname: "巴西", class: "sprite-language-5-5" }
]





// 分类有变化时， 更新FooterSeo

// { domain: 'www.origin-ic.com1111', defaultLocale: 'en', code: 'us', name: "United States", cname: "美国", class: "sprite-language-4-5" },
//   next-translate   req 参数包含了当前请求的相关信息，包括当前域名。
//   <Image  loading="lazy"    <LazyLoad height={78} once={true} offset={600}>  订单登录失效跳转登录 新闻的title为seo标题，描述的seo描述，  文章添加描述

// {i18MapTranslate(`i18Home.${item.name}`, item.name)}

// i18Head  i18Footer  i18Home i18Bom  i18Form  i18MyCart  i18Login  i18Ueditor  i18Other
// i18AboutUs i18AboutProduct i18CareersPage  i18CompanyInfo  i18CatalogHomePage
//   i18QualityPage   i18QuotePage  i18SmallText i18PubliceTable i18MenuText
//  i18HomeNextPart  i18FunBtnText    i18ResourcePages  i18OrderAddress  i18AboutOrder i18AboutOrder2 i18MyAccount


// next-i18next.config.js  _app.js 文件中已经使用了 appWithTranslation 来包裹 public/locales/zh/common.json 语言包
// { useTranslation } from 'next-i18next';   const { t, i18n } = useTranslation('common'); 
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
// export async function getServerSideProps ({ locale }) {
//   return {
//     props: {
//       ...(await serverSideTranslations(locale, ['common'])),
//     },
//   };
// }



{/* 产品图用LazyLoad， 避免以下报错 */}
{/* Error: Failed to parse src "//media.digikey.com/Photos/On%20Semi%20Photos/MFG_488~403A-03~B,%20S~2.jpg" on `next/image`, protocol-relative URL (//) must be changed to an absolute URL (http:// or https://) */}

// yarn add @fullhuman/postcss-purgecss   PurgeCSS 来自动消除未使用的 CSS   "@fullhuman/postcss-purgecss": "^5.0.0",  yarn remove @fullhuman/postcss-purgecss
// 使用工具如 PurgeCSS 来自动消除未使用的 CSS。PurgeCSS 可以分析你的代码，并从 CSS 文件中移除未使用的样式，从而减少文件大小和加载时间。这可以帮助进一步优化你的应用程序的性能和加载速度。

// 插件删除？
// CSS 模块化管理  npm install --save @zeit/next-css

// 可以在 Next.js 中配置 PostCSS 插件来压缩 CSS 文件。可以使用 cssnano 插件来压缩 CSS。首先安装插件：  npm install postcss-preset-env cssnano --save-dev   
// 然后在项目根目录创建 postcss.config.js 文件，并配置插件：

// javascript
// module.exports = {
//     plugins: [
//         'postcss-preset-env',
//         'cssnano'
//     ]
// };


// 部署后 在sem点击重启   --- 已检查
// 减少 datasheet ，rohs外链   管理端分类添加seo修改， 用户端最新产品需求 去掉连连支付 
// HTML 尺寸过大 filter 148, 335, 270
// 404 ,/manufactur, /page/policy/terms-and-conditions

// 重复标题
// /products/catalog/fets-mosfets/1116   重复标题
// /products/catalog/discrete-semiconductor-products/transistors/fets-mosfets/1116
// /products/catalog/Evaluation-Boards/1105    重复标题
// /products/catalog/development-boards-kits-programmers/Evaluation-Boards/1105
// /products/catalog/connectors-interconnects/coaxial-connectors-rf/202


// 如果要过滤掉某些特定的属性，可以在对象字面量中排除这些属性，例如：
// const filteredData = data.map(({ gender, ...item }) => item);
// 谷歌文档, 搜索结构化, 多语言, 登录注册, all-tags

// 首页调整，facebook登录， 同意隐私



// javascript
// module.exports = {
//   webpack: (config, { isServer }) => {
//     if (!isServer) {
//       config.optimization.splitChunks.cacheGroups = {
//         default: false,
//       };
//       config.optimization.splitChunks.chunks = 'async';
//     }
//     return config;
//   },
// };


{/* <svg t="1565490740122" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6137" width="20" height="20"><path d="M288 480c54.4 0 96-41.6 96-96s-41.6-96-96-96-96 41.6-96 96 41.6 96 96 96z m0-128c19.2 0 32 12.8 32 32s-12.8 32-32 32-32-12.8-32-32 12.8-32 32-32z" p-id="6138" fill="#bfbfbf"></path><path d="M864 160h-704c-54.4 0-96 41.6-96 96v512c0 54.4 41.6 96 96 96h704c54.4 0 96-41.6 96-96v-512c0-54.4-41.6-96-96-96z m-736 608v-512c0-19.2 12.8-32 32-32h704c19.2 0 32 12.8 32 32v364.8l-169.6-169.6c-38.4-38.4-99.2-38.4-134.4 0l-348.8 348.8h-83.2c-19.2 0-32-12.8-32-32z m736 32h-531.2l304-304c12.8-12.8 32-12.8 44.8 0l214.4 214.4v57.6c0 19.2-12.8 32-32 32z" p-id="6139" fill="#bfbfbf"></path></svg>

<svg t="1565490740122" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6137" width="20" height="20"><path d="M288 480c54.4 0 96-41.6 96-96s-41.6-96-96-96-96 41.6-96 96 41.6 96 96 96z m0-128c19.2 0 32 12.8 32 32s-12.8 32-32 32-32-12.8-32-32 12.8-32 32-32z" p-id="6138" fill="#009900"></path><path d="M864 160h-704c-54.4 0-96 41.6-96 96v512c0 54.4 41.6 96 96 96h704c54.4 0 96-41.6 96-96v-512c0-54.4-41.6-96-96-96z m-736 608v-512c0-19.2 12.8-32 32-32h704c19.2 0 32 12.8 32 32v364.8l-169.6-169.6c-38.4-38.4-99.2-38.4-134.4 0l-348.8 348.8h-83.2c-19.2 0-32-12.8-32-32z m736 32h-531.2l304-304c12.8-12.8 32-12.8 44.8 0l214.4 214.4v57.6c0 19.2-12.8 32-32 32z" p-id="6139" fill="#009900"></path></svg> */}