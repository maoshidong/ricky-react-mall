const withPlugins = require("next-compose-plugins");
const withSitemap = require("next-sitemap");

module.exports = withPlugins(
  [
    // 其他插件...
    withSitemap({
      siteUrl: baseDomain,
      changefreq: 'daily',
      priority: 0.9,
      sitemapSize: 5000,
      generateRobotsTxt: false,
      generateIndexSitemap: false, // 取消生成 sitemap-0.xml
      // xmlIndent: ' ',
      exclude: ['/account/*', '/page/shipping', '/manufacturer/indexing', '/page/page-404'],
    }),
  ],
  // next.js 配置
);