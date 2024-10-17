// const withPlugins = require("next-compose-plugins");
// const withSitemap = require("next-sitemap");
// import * as withPlugins from 'next-compose-plugins'
// import * as withSitemap from 'next-sitemap'
// const baseDomain = 'https://www.origin-ic.net111'
// module.exports = withPlugins(
//   [
//     // 其他插件... 
//     withSitemap({
//     siteUrl: baseDomain,
//     changefreq: 'daily',
//     priority: 0.9,
//     sitemapSize: 5000,
//     generateRobotsTxt: false,
//     generateIndexSitemap: false, // 取消生成 sitemap-0.xml
//     // xmlIndent: ' ',
//     exclude: ['/account/*', '/page/shipping', '/manufacturer/indexing', '/page/page-404'],

//     async routes() {
//       let routesArray = [{route: '/', changefreq: 'daily', priority: 1}]; // 默认添加首页路由
  
//       // 获取分类数据
//       // const categoriesResponse = await axios.get("https://example.com/api/categories");
//       // const categoriesData = categoriesResponse.data;
//       const categoriesData =  [
//         {slug: 'aa',},
//         {slug: 'bb',},
//         {slug: 'cc',},
//         {slug: 'dd',},
//       ]
//       const categoryRoutes = categoriesData.map((category) => ({
//         route: `/category/${category.slug}`,
//         changefreq: "weekly",
//         priority: 0.8,
//         // ...
//       }));
//       routesArray = [...routesArray, ...categoryRoutes];
  
//       // 获取文章数据
//       const postsResponse = await axios.get("https://example.com/api/posts");
//       const postsData = postsResponse.data;
//       const postRoutes = postsData.map((post) => ({
//         route: `/post/${post.slug}`,
//         changefreq: "monthly",
//         priority: 0.6,
//         // ...
//       }));
//       routesArray = [...routesArray, ...postRoutes];
  
//       return routesArray;
//     },
//     }),
//   ],
//   // next.js 配置
// );




/**
 * @type {import('next-sitemap').IConfig}
 * @see https://github.com/iamvishnusankar/next-sitemap#readme
 * raect next-sitemap 把所有产品分类的url生成一个独立的 sitemap.xml
 * */
// import { baseDomain } from '~/repositories/Repository';
// import * as fs from 'fs'
// import * as path from 'path'
const fs = require('fs');
const path = require('path');
const baseDomain = 'https://www.origin-ic.com'
module.exports = {
    siteUrl: baseDomain,
    changefreq: 'daily',
    priority: 0.9,
    sitemapSize: 30000,
    generateRobotsTxt: false,
    generateIndexSitemap: false, // 取消生成 sitemap-0.xml
    // xmlIndent: ' ',
    exclude: ['/account/*', '/page/shipping', '/manufacturer/indexing', '/page/page-404'],
    sitemap: async () => {
      const transform = (config, path) => `${config.siteUrl}/en${path}`;
      // fetch all product categories from your database or API
      const categories = [
        {
          slug: 'Capacitors',
          url: baseDomain + '/products/catalog/capacitors/8',
          url: baseDomain + '/products/filter/capacitors/accessories/146',
          url: baseDomain + '/products/filter/capacitors/aluminum-polymer-capacitors/147',
        },
        {
          slug: 'Capacitors',
          url: baseDomain + '/products/catalog/circuit-protection/9',
        },
      ];
      
      // create a new sitemap for each category
      for (const category of categories) {
        const fileName = `sitemap-${category.slug}.xml`;
        const filePath = path.join(__dirname, 'allSitemaps', fileName);
      
        const urls = [
          // add URLs for this category to the `urls` array
          category.url
        ];
      
        // write sitemap XML data to file
        const stream = fs.createWriteStream(filePath);
        stream.write('<?xml version="1.0" encoding="UTF-8"?>\n');
        stream.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n');
        for (const url of urls) {
          stream.write(`  <url><loc>${url}</loc></url>\n`);
        }
        stream.write('</urlset>');
        stream.end();
      }
    },

    async routes() {
      let routesArray = [{route: '/', changefreq: 'daily', priority: 1}]; // 默认添加首页路由
  
      // 获取分类数据
      // const categoriesResponse = await axios.get("https://example.com/api/categories");
      // const categoriesData = categoriesResponse.data;
      const categoriesData =  [
        {slug: 'aa',},
        {slug: 'bb',},
        {slug: 'cc',},
        {slug: 'dd',},
      ]
      const categoryRoutes = categoriesData.map((category) => ({
        route: `/category/${category.slug}`,
        changefreq: "weekly",
        priority: 0.8,
        // ...
      }));
      routesArray = [...routesArray, ...categoryRoutes];
  
      // 获取文章数据
      const postsResponse = await axios.get("https://example.com/api/posts");
      const postsData = postsResponse.data;
      const postRoutes = postsData.map((post) => ({
        route: `/post/${post.slug}`,
        changefreq: "monthly",
        priority: 0.6,
        // ...
      }));
      routesArray = [...routesArray, ...postRoutes];
  
      return routesArray;
    },

    // async routes() {
    //   const categoriesData = [
    //     { id: 1, name: "电子产品" },
    //     { id: 2, name: "家居用品" },
    //     { id: 3, name: "服装配饰" }
    //   ];
  
    //   const categoryRoutes = categoriesData.map((category) => ({
    //     route: `/category/${category.id}`,
    //     changefreq: "weekly",
    //     priority: 0.7,
    //     // ...
    //   }));
  
    //   const productRoutes = categoriesData.flatMap((category) => ([
    //     { route: `/category/${category.id}/product-1`, changefreq: "weekly", priority: 0.7 },
    //     { route: `/category/${category.id}/product-2`, changefreq: "weekly", priority: 0.7 },
    //     // ...
    //   ]));
  
    //   return [
    //     ...categoryRoutes,
    //     ...productRoutes,
    //     // ...
    //   ];
    // },
    // async xmlSitemapStylesheet() {
    //   return `
    //     <?xml version="1.0" encoding="UTF-8"?>
    //     <?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
    //     <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    //       <!-- 自定义 sitemap 的内容 -->
    //     </urlset>
    //   `;
    // },

    alternateRefs: [
      {
        href: 'https://www.origin-ic.com',
        hreflang: 'es',
      },
      {
        href: 'https://www.origin-ic.com',
        hreflang: 'fr',
      },
    ],
    // Default transformation function
    transform: async (config, path) => {
      return {
        loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
        // changefreq: config.changefreq,
        // priority: config.priority,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
        // alternateRefs: config.alternateRefs ?? [],
      }
    },
    // additionalPaths: async (config) => [
    //   await config.transform(config, '/additional-page'),
    // ],
    robotsTxtOptions: {
      policies: [
        {
          userAgent: '*',
          allow: '/account',
        },
        {
          userAgent: 'Googlebot',
          allow: '/account',
        },
        {
          userAgent: 'test-bot',
          allow: ['/path', '/path-2'],
        },
        {
          userAgent: 'black-listed-bot',
          disallow: ['/sub-path-1', '/path-2'],
        },
      ],
    },
  }