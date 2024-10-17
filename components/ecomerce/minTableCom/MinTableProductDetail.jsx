import Link from 'next/link'
import { nanoid } from 'nanoid';
import { getProductUrl, handManufacturerUrl } from '~/utilities/common-helpers'
import MinCustomerReference from '~/components/ecomerce/minCom/MinCustomerReference';
import useLanguage from '~/hooks/useLanguage';
import { connect } from 'react-redux';

const MinProductDetail = ({
	auth,
	record,
	otherProps = {
		showImage: false,
		showDatasheetRohs: false,
	},
	showManufacturer = true, // 展示供应商
	manufacturerLink = false, // 供应商默认不跳转
	showCustomerReference = true, // 是否展示自定义备注
	disabled = false, // 是否可输入CustomerReference
	customerClass
}) => {
	const { getLanguageEmpty } = useLanguage();
	const { isAccountLog } = auth;

	const {
		productId, id, productName, name, partNum,
		manufacturerName, manufacturer, manufacturerSlug, manufacturerId,
		thumb, image,
	} = record || {}
	const curProductId = productId || id
	const curName = productName || name || partNum
	const curImage = thumb || image || getLanguageEmpty()
	const curManufacturerName = manufacturerName || manufacturer
	const curManufacturerSlug = manufacturerSlug
	const curManufacturerId = manufacturerId
	return (
		<div className='el-product-detail' key={nanoid()}>
			<div className='pub-flex-align-center'>
				{
					otherProps?.showImage && (
						<img
							className='pub-img mr15'
							src={curImage}
							alt={curName}
							title={curName}
						/>
					)
				}
			</div>
			<div>
				<div className="product-name">
					{
						curProductId > 0 ? <Link href={getProductUrl(curManufacturerSlug, curName, curProductId)}>
							<a className="color-link ps-product__title">{curName}</a>
						</Link> : curName
					}
				</div>

				{/* 供应商不跳转 */}
				{
					(showManufacturer && !manufacturerLink) && (
						<div className={'manufacturer ' + (showCustomerReference ? '' : '')}>
							{curManufacturerName}
						</div>
					)
				}

				{/* 供应商跳转 */}
				{
					(showManufacturer && manufacturerLink) && (
						<div className={'manufacturer ' + (showCustomerReference ? '' : '')}>
							{/* , curManufacturerId */}
							<Link href={handManufacturerUrl(curManufacturerSlug)}>
								<a>{curManufacturerName}</a>
							</Link>
						</div>
					)
				}

				<div className={customerClass}>{
					showCustomerReference && (
						<MinCustomerReference record={record} disabled={disabled} />
					)}
				</div>


				{/* 不要了，减少外链 */}
				{/* {
					otherProps?.showDatasheetRohs && (
						<div className='pub-flex-align-center'>
							{datasheet &&
								<a {...helpersHrefNofollow(datasheet)}>
									<div className='sprite-icon4-cart sprite-icon4-cart-2-1' style={{ marginTop: '7px' }}></div>
								</a>
							}
							{rohs == 1 &&
								<div className='sprite-icon4-cart sprite-icon4-cart-2-2 ml10' style={{ marginTop: '7px' }}></div>
							}
						</div>
					)
				} */}
			</div>
		</div>
	)
}

export default connect(state => state)(MinProductDetail)