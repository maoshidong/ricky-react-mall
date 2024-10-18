import React from 'react';
import PageContainer from '~/components/layouts/PageContainer';
import PageNoFound from '~/components/elements/PageNoFound';
import ProductRepository from '~/repositories/ProductRepository';

import { changeServerSideLanguage, getLocale } from '~/utilities/easy-helpers';


// 后端宝塔有配置？
const Page404PageNew = (props) => {
	const { paramMap, catalogListRes } = props
	// console.log(paramMap, 'paramMap----del')
	// console.log(props, 'props----del')
	return (
		<PageContainer paramMap={paramMap}>
			<PageNoFound catalogListRes={catalogListRes} />
		</PageContainer>
	);
};

export default Page404PageNew;

export async function getServerSideProps({ req }) {
	const languageType = getLocale(req)
	const [translations, catalogListRes] = await Promise.all([
		changeServerSideLanguage(req), // 语言包等页面基础逻辑
		await ProductRepository.apiGetRecommendCatalogList(0, languageType), // 新的分类树
	]);

	return {
		props: {
			...translations,
			catalogListRes: catalogListRes?.data || [],
		}
	}
}

// export async function getServerSideProps({ req }) {
//     const translations = await changeServerSideLanguage(req)
//     // context.res.writeHead(404, {
//     //     // Location: '/custom-error-page' // 可选：将用户重定向到另一个自定义错误页面
//     // });
//     // context.res.end();
//     // 通过以上方法，你可以确保在 Next.js 中正确地返回404状态码，当用户访问不存在的页面时，系统会显示自定义的404页面，并返回正确的状态码给浏览器，从而帮助搜索引擎正确处理不存在的页面。
//     return {
//         props: {
//             ...translations,
//         }
//     }
// }
// 软 404  页面未找到，404 - 软 404 是指当用户访问一个不存在的页面时，网站返回的状态码是200（表示成功），而不是标准的404（页面未找到）。这意味着网站会正常加载一个页面，但该页面通常会提示用户所请求的内容不存在。
// 如果你是网站管理员，并且希望避免软 404 问题，你可以考虑以下做法：

// 确保不存在的页面返回正确的404状态码。
// 避免使用 URL 重写将不存在的页面重定向到其他页面。
// 在404页面上提供有用的信息，帮助用户导航到其他相关内容或执行其他操作。