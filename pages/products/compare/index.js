import { PRODUCTS_DETAIL, MANUFACTURER, PRODUCTS, PRODUCTS_CATALOG, PRODUCTS_FILTER, PRODUCTS_COMPARE } from '~/utilities/sites-url'
const ComparePage = () => {
	return <div>1</div>
}

export default ComparePage

export async function getServerSideProps({ req, query }) {
	const s = query?.s
	// 不需要就删除， 用于永久重定向-重定向完成后就删除
	return {
		redirect: {
			destination: PRODUCTS_COMPARE + `/${s}`,
			permanent: true,
		}
	}

}