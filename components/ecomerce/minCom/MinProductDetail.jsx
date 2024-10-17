import Link from 'next/link';
import { nanoid } from 'nanoid';
import { connect } from 'react-redux';
import { isIncludes } from '~/utilities/common-helpers';
import { PRODUCTS_DETAIL, MANUFACTURER } from '~/utilities/sites-url';

// 目前只在filter筛选页表格产品详情使用 - 供应商短语是否正确
const MinProductDetail = ({ record, firstCatalogName }) => {
	const curManufacturerName = record?.manufacturerName || record?.Manufacturer;

	return (
		<div className="el-product-detail" key={nanoid()}>
			<div className="">
				<div className="product-name">
					{/* 产品详情页减少层级 /${firstCatalogName}/${isIncludes(sulg || record?.manufacturerSlug, '#')} */}
					<Link href={`${PRODUCTS_DETAIL}/${isIncludes(record?.name)}/${record?.productId || record?.id}`}>
						<a className="color-link ps-product__title pub-font14 pub-fontw">{record?.name}</a>
					</Link>
				</div>

				<div className="manufacturer">
					{(record?.manufacturerId && +record?.slugStatus === 1) && curManufacturerName ? (
						<Link href={`${MANUFACTURER}/${isIncludes(record?.manufacturerSlug)}`}>
							<a className="pub-color-hover-link">{curManufacturerName}</a>
						</Link>
					) : (
						curManufacturerName
					)}
				</div>

				<div className="product-detail-description pub-font12">{record?.description}</div>

				<div className="pub-flex-align-center">
					{record?.datasheet && (
						// <a
						//     {...helpersHrefNofollow(record.datasheet)}
						//     alt={record?.name + "| Datasheet"}
						//     title={record?.name + "| Datasheet"}>
						<div onClick={() => window.open(record.datasheet, '_blank')} className="sprite-icon4-cart sprite-icon4-cart-2-1 mt7 pub-cursor-pointer"></div>
					)}
					{record?.rohs == 1 && <div className="sprite-icon4-cart sprite-icon4-cart-2-2 ml10 mt7"></div>}
				</div>
			</div>
		</div>
	);
};

export default connect((state) => state)(MinProductDetail);