// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const TerserPlugin = require('terser-webpack-plugin');
const {i18n} = require('./next-i18next.config')
const withImages = require('next-images')
const withTM = require('next-transpile-modules')([
  'antd-mobile',
])
// const ANALYZE = true
const path = require('path');
// const withCSS = require('@zeit/next-css');

const nextSettings = {
    optimizeFonts: false,
    // disable eslint
    eslint: {
        ignoreDuringBuilds: true,
    },
		// transpilePackages:['antd','@ant-design'],
    // Change your site title here
    env: {
        language: 'en',
        title: 'Electronic Components Distributor - Origin Data Electronics',
        url: 'https://www.origin-ic.com',
        zhUrl: 'https://www.szxlxc.com',
        telephone: '+86(0755)83898879',
        email: "Sales@origin-ic.net",
        logUrl: 'https://www.origin-ic.com/static/img/logo.png',
        zhLogUrl: 'https://www.szxlxc.com/static/img/zhLogo.png',
        titleDescription: 'Origin Data Global Limited',
        pubAboutUsTitle: 'About Origin Data Global Limited - Electronics Component Distributor',
        analyze: true,
    },
    // cookie: {
    //     domain: 'origin-ic.com1', // 将此处替换为您的主域名
    // },
    images: {
        domains: ['www.origin-ic.net', 'www.origin-ic.com', 'www.szxlxc.com', 'oss.origin-ic.net','oss.origin-ic.com', 'http://localhost:3003/', 'http://127.0.0.1:3003/'],
    },

    i18n,

   
    webpack: (config, { isServer, dev }) => {
        // @components，将其映射到实际的组件目录。然后，我们就可以在页面中使用别名来导入组件了。
        config.resolve.alias['@components'] = path.join(__dirname, 'src/components');

        // 找出体积较大或未使用的模块
        // if (process.env.analyze) {
          // config.plugins.push(new BundleAnalyzerPlugin({
          //   analyzerMode: 'server',   //  'server':  启动一个 HTTP 服务器并显示报告。  'static': 生成一个静态 HTML 文件。 'disabled': 禁用分析器。
          //   analyzerPort: 8888,
          //   openAnalyzer: true,
					// 	// reportFilename: 'bundle-report.html', // 输出的报告文件名
          // }))
        // }
        // config.resolve.alias['@components'] = path.join(__dirname, 'src/components');
        if(!isServer) {

					//  // 示例：转译 'antd' 和 '@ant-design' 包, 替换 transpilePackages:['antd','@ant-design'](next.js不兼容该写法)
					//  config.module.rules.push({
					// 	test: /\.js$/,
					// 	include: /node_modules\/(antd|@ant-design)/,  // /node_modules\/(antd|@ant-design)/
					// 	use: {
					// 		loader: 'babel-loader',
					// 		options: {
					// 			presets: ["@babel/preset-env", { "modules": false }], // ['next/babel']  -> ["@babel/preset-env"]
					// 		},
					// 	},
					// });

					config.resolve.fallback = { fs: false }
					config.ignoreWarnings = [
						{
							message: /Critical dependency: the request of a dependency is an expression/,
						},
					];
        }

 
        if (!dev) {
					// config.devtool = 'nosources-source-map'; // 源代码映射
          config.optimization.usedExports = true; // 启用摇树优化
          config.mode.production = true; // 生产
					
          config.optimization.minimize = true; // 开启代码压缩
          config.optimization.minimizer.push(new TerserPlugin({
            terserOptions: {
                compress: {
                  // 去除注释内容 是用来在压缩阶段移除所有注释的。
                  comments: false,
									drop_console: true, // 删除 console.log 等调试信息
                },
                output: {
                  // // 删除注释  最简化输出 在 compress.comments: false 的情况下通常没有作用，因为它控制的是输出的注释。
                  comments: false,
                },
              },
              extractComments: false, // 去除代码块之外的注释  是用来阻止 Terser 将注释提取到单独文件中的。
          }));

          config.module.rules.push(
            {
              test: /\.css\.scss$/,
              use: [
                'style-loader',
                'css-loader',
                {
                  loader: 'postcss-loader',
                  options: {
                    postcssOptions: {
                      plugins: [
                        'postcss-preset-env', // 自动添加浏览器前缀,解决兼容问题
                        'cssnano' // 一系列小的转换来优化你的 CSS 代码，比如删除重复的选择器、合并规则等。
                      ]
                    }
                  }
                }
              ]
            },
            // {
            //   test: /\.json$/,
            //   loader: 'json-loader',
            // }
          );
        }
        return config
      },

      async redirects() {
        return [
          {
            source: '/zh/:path*', 
            has: [
              {
                type: 'host',
                value: 'www.origin-ic.com',
              },
            ],
            destination: 'https://www.szxlxc.com/:path*', 
            permanent: true,
          },
        ];
      },
    // async rewrites() {
    //   return [
    //     {
    //       source: '/scss/:path*', // 匹配 /scss/* 路径
    //       destination: '/path/to/your/scss/:path*', // 实际样式文件存放路径
    //     },
    //   ];
    // },
    // 重定向
    // async redirects() {
    //     return [
    //       {
    //         source: '/en',
    //         destination: '/',
    //         permanent: true
    //       },
    //     ];
    //   },
      experimental: {
				amp: true,
      }
};

module.exports = withTM(withImages(nextSettings));
// module.exports = withCSS(nextSettings);

// const withLess = require('@zeit/next-less');

// module.exports = withLess({
//   less: {
//     javascriptEnabled: true,
//     modifyVars: {
//       // 在这里修改Ant Design的主题变量
//       // 示例：修改主题为蓝色
//       '@primary-color': '#1890ff',
//     },
//   },
// });

// import { nextSitemap } from 'next-sitemap'
// import { getServerSideProps } from 'next';
// import { getSiteMap } from 'next-sitemap';
// require('next-sitemap')
// const nextSettings = withSitemap(
//     {
//         optimizeFonts: false,
//         // disable eslint
//         eslint: {
//             ignoreDuringBuilds: true,
//         },
//         // Change your site title here
//         env: {
//             title: 'Origin Data Global Limited',
//             titleDescription: 'Origin Data Origin Data',
//         },
//         images: {
//             domains: ['www.origin-ic.com111'],
//         },
//         siteUrl: 'https://www.origin-ic.com111/',
//         // exclude: ['/admin'],
//     }
// )

// module.exports = nextSettings;
// export default nextSettings;
