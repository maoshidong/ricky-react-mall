// pages/_document.js
import Document, { Html, Head, Main, NextScript } from "next/document";
import React from 'react';
import { I18NEXT_DOMAINS, I18NEXT_LOCALE } from '~/utilities/constant'
import { useTranslation, i18n } from 'next-i18next';
// import Script from 'next/script';
{/* <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-CDWFBKFV3Z"
                strategy="afterInteractive" // or "lazyOnload"
                defer
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-CDWFBKFV3Z');
                    `,
                }}
            /> */}

class MyDocument extends Document {

	// Next.js 版本 9.3 或更高版本，pages/_app.js 中的 getInitialProps 已被弃用。取而代之的是使用 getStaticProps 或 getServerSideProps。
	// static async getInitialProps(ctx) {
	//   const initialProps = await Document.getInitialProps(ctx);
	//   const domain = ctx.req?.headers?.host || ""; // 获取 lng 数据
	//   return { ...initialProps, domain };
	// }

	render() {
		// const { domain } = this.props;
		// const curDomainsData = I18NEXT_DOMAINS?.find(item => item.domain == domain)
		// const lng = curDomainsData?.defaultLocale || I18NEXT_LOCALE.en
		// const lng = I18NEXT_LOCALE.en
		const url = i18n?.language == I18NEXT_LOCALE.en ? '/static/img/min-favicon.png' : '/static/img/zhFavicon.png'

		return (
			// <Html lang={`${lng}-US}`}>  -${curDomainsData?.code.toUpperCase()}
			<Html lang={`${i18n?.language}`}>
				<Head>
				{/* <!-- Google Tag Manager --> */}
				<link rel="dns-prefetch" href="//www.googletagmanager.com" />
				<link rel="preconnect" href="//www.googletagmanager.com" />
				{/* <!-- Cloudflare --> */}
				<link rel="dns-prefetch" href="//cloudflare.com" />
				<link rel="preconnect" href="//cloudflare.com" />
				{/* <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
				<link rel="preconnect" href="//cdnjs.cloudflare.com" /> */}
				{/* <!-- Origin-ic.net --> */}
				{/* <link rel="dns-prefetch" href="//origin-ic.net" />
				<link rel="preconnect" href="//origin-ic.net" /> */}
				{/* <!-- Google / DoubleClick Ads --> */}
				<link rel="dns-prefetch" href="//googleads.g.doubleclick.net" />
				<link rel="preconnect" href="//googleads.g.doubleclick.net" />
				<link rel="dns-prefetch" href="//adservice.google.com" />
				<link rel="preconnect" href="//adservice.google.com" />
				{/* <!-- Google Analytics --> */}
				{/* <link rel="dns-prefetch" href="//www.google-analytics.com" />
				<link rel="preconnect" href="//www.google-analytics.com" />
				<link rel="dns-prefetch" href="//analytics.google.com" />
				<link rel="preconnect" href="//analytics.google.com" /> */}
				{/* <!-- PayPal --> */}
				<link rel="dns-prefetch" href="//www.paypal.com" />
				<link rel="preconnect" href="//www.paypal.com" />
				<link rel="dns-prefetch" href="//www.paypalobjects.com" />
				<link rel="preconnect" href="//www.paypalobjects.com" />
				
				{/* <!-- Preload for Critical Resources --> */}
				{/* <link rel="preload" href="https://www.googletagmanager.com/gtag/js?id=G-CDWFBKFV3Z" as="script" /> */}
				{/* <link rel="preload" href="https://www.google-analytics.com/analytics.js" as="script" /> */}
												
					{/* <script type="text/javascript" src="//www.17track.net/externalcall.js"></script> */}
					{/* Google tag (gtag.js) */}
					{/* <!-- Google tag (gtag.js)  监听流量--> */}
					{/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-CDWFBKFV3Z"></script>
					<script>
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments)}
						gtag('js', new Date());

						gtag('config', 'G-CDWFBKFV3Z');
					</script> */}
					{/* 恢复 async defer */}

					<link rel="shortcut icon" href={url} />
					<link rel="icon" href={url} />
					<link rel="apple-touch-icon-precomposed" href={url} />
					<meta name="twitter:card" content="summary_large_image" />
					{/* <link rel="shortcut icon" href='/static/img/min-favicon.png' /> */}
					{/* <link rel="icon" href='/static/img/favicon.png' />
                <link rel="apple-touch-icon-precomposed" href='/static/img/favi.png' /> */}

					{/* min-favicon test-ico.ico */}
					{/* favicon.png sizes="32x32"  sizes="192x192"*/}
					{/* type="image/png"   favi.png */}
					{/* <link rel="shortcut icon" href='/static/img/favicon.ico' />
                <link rel="icon" href='/static/img/favicon.ico' />
                <link rel="apple-touch-icon-precomposed" href='/static/img/favicon.ico' /> */}

					<script src="//cdn.shopify.com/s/files/1/0565/7503/3493/files/omsl1.js?v=1726147437" type="text/javascript"></script>
					
					{/* 暂时隐藏Lighthouse性能 用于在网页中引入Google Fonts字体的CSS链接。它的作用是提供了一种简单的方式来加载和应用指定的字体样式。 */}
					{/* <link
						href="https://fonts.googleapis.com/css?family=Work+Sans:400,500,600,700&amp;amp;subset=latin-ext"
						rel="stylesheet"
					/> */}
					{/* cf人机验证 */}
					<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
					{/*<script defer src="https://www.googletagmanager.com/gtag/js?id=G-CDWFBKFV3Z"></script>
					 <script defer src="https://www.googletagmanager.com/gtag/js?id=G-7DS1CF2E9H"></script> 
					<script defer dangerouslySetInnerHTML={{
						__html: `window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments)}
                            gtag('js', new Date());
                            gtag('config', 'G-CDWFBKFV3Z');`
					}}>
					</script>*/}

					{/* <script src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v11.0" crossorigin="anonymous"></script> */}
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;