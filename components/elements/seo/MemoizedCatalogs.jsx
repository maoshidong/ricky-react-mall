import Link from 'next/link'

const memoizedCatalogs = ({ href, item }) => {
	return (
		<Link
			href={href}
		>
			<a>{item.name}</a>
		</Link>
	)
}

export default memoizedCatalogs