import { NameNumCol } from '~/components/common'
import { handManufacturerUrl } from '~/utilities/common-helpers'
import useI18 from '~/hooks/useI18';
const ByManufacturerCom = ({ catalogName, catalogId, resByManufacturer }) => {
	const { iByManufacturers } = useI18()
	const list = resByManufacturer?.map(i => {
		return {
			name: i.manufacturerName,
			number: i.productCount,
			href: `${handManufacturerUrl(i.manufacturerSlug)}?catalogId=${catalogId}`
		}
	})
	return (
		<div className='mt30'>
			<h2 className='mb10 pub-left-title'>{catalogName} {iByManufacturers}</h2>
			<NameNumCol list={list} />
		</div>
	)
}

export default ByManufacturerCom