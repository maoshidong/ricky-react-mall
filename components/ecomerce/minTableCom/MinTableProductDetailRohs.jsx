import Link from 'next/link'
import { getProductUrl } from '~/utilities/common-helpers'
import MinCustomerReference from '~/components/ecomerce/minCom/MinCustomerReference';

// 热卖，rohs在左侧 - 表格产品列表组件
const MinProductDetail = ({
	record
}) => {
	const {
		productId, id, productName, name,
		manufacturer, manufacturerName, manufacturerSlug, manufacturerId,
		datasheet, rohs,
	} = record
	const curProductId = productId || id
	const curProductName = productName || name
	const curManufacturerName = manufacturer?.name || manufacturerName
	const curManufacturerSlug = manufacturerSlug
	// const curManufacturerId = manufacturerId
	// const sulg = record?.Manufacturer?.split(' ').join('-') || ''

	return (
		<div className='el-product-detail' style={{ alignItems: 'flex-start' }}>
			{/* 不要了，减少外链 */}
			{/* {(datasheet || rohs == 1) &&
                <div className='mr15'>
                    {datasheet &&
                        <a href={datasheet} target="_blank">
                            <div className='mb10 sprite-pdf-rohs-1'></div>
                        </a>
                    }
                    {rohs == 1 &&
                        <div className='sprite-pdf-rohs-2'></div>
                    }
                </div>
            } */}
			<div className=''>
				<div className="color-link product-name">
					<Link href={getProductUrl(curManufacturerSlug, curProductName, curProductId)}>
						<a className="ps-product__title" >{curProductName}</a>
					</Link>
				</div>

				<div className='manufacturer mb8'>
					{curManufacturerName}
				</div>

				<MinCustomerReference record={record} />
			</div>
		</div>
	)
}

export default MinProductDetail