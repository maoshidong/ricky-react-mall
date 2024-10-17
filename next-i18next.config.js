module.exports = {
    i18n: {
      defaultLocale: 'en',
      locales: ['en', 'zh'],
      localeDetection: false, // Disable automatic locale detection  设置为 true 时，系统会根据用户的浏览器设置或其他信息自动选择语言；
      // localeSubpaths: {}, // Disable locale subpaths
      domains: [
        {
          domain: 'www.origin-ic.com',
          defaultLocale: 'en',
					locales: ['en'],
        },
        {
            domain: 'www.szxlxc.com', // localhost:3003/  www.szxlxc.com
            defaultLocale: 'zh',
						locales: ['zh'],
        },
    ],
    },
    debug: false
  }