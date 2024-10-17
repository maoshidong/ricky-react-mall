import React from 'react';
import Link from 'next/link';
import useProduct from '~/hooks/useProduct';
import useLanguage from '~/hooks/useLanguage';
import { calculateTargetPriceTotal, toFixedFun } from '~/utilities/ecomerce-helpers';
import { isIncludes } from '~/utilities/common-helpers';
import { getEnvUrl, PRODUCTS_DETAIL } from '~/utilities/sites-url';
import { getCurrencyInfo } from '~/repositories/Utils';

const ProductOnCart = ({ product }) => {
	const { i18Translate } = useLanguage();
	const { thumbnailImage } = useProduct();
	const currencyInfo = getCurrencyInfo();

	return (
		<Link href={`${getEnvUrl(PRODUCTS_DETAIL)}/${isIncludes(product?.productName)}/${product?.productId}`}>
			<div className="ps-product--cart-mobile">
				<div className="ps-product__thumbnail">
					<a>{thumbnailImage(product)}</a>
				</div>
				<div className="ps-product__content">
					<div>
						<div className="ps-product__color18 pub-color-hover-link">{product?.productName}</div>
						<div>{product?.manufacturerName || product?.manufacturerSlug}</div>
					</div>
					<div>
						<div>
							{i18Translate('i18PubliceTable.Quantity', 'Quantity')}: {product.cartQuantity}
						</div>
						<div className="ps-product__color18" style={{ display: 'flex', justifyContent: 'flex-end' }}>
							{currencyInfo.label} {toFixedFun(calculateTargetPriceTotal(product) || 0, 4)}
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default ProductOnCart;
