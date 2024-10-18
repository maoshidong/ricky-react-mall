import React from 'react';
import { DefaultDescription, DefaultDescription1, DefaultDescription2 } from '~/components/elements'; // CustomersAlsoBought
import ModuleDetailTopInformation from '~/components/elements/detail/zqx/modules/ModuleDetailTopInformation';
import ProductDetailsRight from '~/components/elements/detail/ProductDetailsRight'; // 产品右侧
import useLanguage from '~/hooks/useLanguage';
import { ImageModal } from '~/components/common';
import { CustomersAlsoBought } from '~/components/elements';

const ProductDetailFullwidth = (props) => {
	// 多语
	const { i18Translate, getLanguageEmpty } = useLanguage();

	// props传参
	const { newProduct = {}, newsServer = [], quality, productPrices } = props;
	const { image, name, manufacturer, thumb } = newProduct;

	// 图片
	let images = [];

	if (image) {
		images.push({
			original: image,
			thumbnail: thumb || image,
			alt: name,
		});
	}

	if (images.length === 0) {
		images = [
			{
				original: getLanguageEmpty(),
				thumbnail: getLanguageEmpty(),
				alt: name,
				title: name,
			},
		];
	}

	return (
		// 详情左侧
		<div className="ps-page__container">
			<div className="ps-page__left">
				<div className="ps-product--detail ps-product--fullwidth">
					{/* 无图展示供应商大图，供应商也没有才展示空图片 */}
					<div className="ps-product__header pub-border20 box-shadow">
						<div>
							<div className="ps-product__image pub-border">
								{(image || (!manufacturer?.logo && !manufacturer?.bigLogo)) && (
									// 这里使用useMemo会报错 useMemo(()=>,[images]): 如在/products/detail/PDTC143EU/4591074页面 搜索 PDTC143EU, 进入详情
									<ImageModal title={name} alt={name} images={images} />
								)}

								{/* 有产品图 */}
								{image && (manufacturer?.logo || manufacturer?.bigLogo) && <img src={manufacturer?.logo || manufacturer?.bigLogo} className="ps-product__meta_Icon" alt={manufacturer?.name} title={manufacturer?.name} />}

								{/* 没有产品图,有供应商图 */}
								{!image && (manufacturer?.logo || manufacturer?.bigLogo) && <img src={manufacturer?.bigLogo || manufacturer?.logo} className="big-manufacturer-logo" alt={manufacturer?.name} title={manufacturer?.name} />}
							</div>

							{image && (
								<p className="ps-product__reference">
									{i18Translate('i18AboutProduct.ProductSpecifications', 'Images are for reference only See Product Specifications')}
								</p>
							)}
						</div>

						{/* 产品信息 */}
						<div className="ps-product__info">
							<ModuleDetailTopInformation newProduct={newProduct} />
						</div>
					</div>

					{/* 产品右侧 */}
					<div className="product-right-bot" style={{ display: 'none' }}>
						<ProductDetailsRight productPrices={productPrices} />
					</div>

					{/* 认证，运输方式，联系我们 */}
					<DefaultDescription newProduct={newProduct} quality={quality} />

					{/* 属性, datasheet */}
					<DefaultDescription2 newProduct={newProduct} newsServer={newsServer} quality={quality} />

					{/* 相似产品,系列 */}
					<DefaultDescription1 newProduct={newProduct} newsServer={newsServer} quality={quality} />

					{/* 最新18条产品数据,该分类下的9条和最新9条 */}
					<CustomersAlsoBought />
				</div>
			</div>

			<div className="ml20 product-right">
				<ProductDetailsRight productPrices={productPrices} />
			</div>
		</div>
	);
};

export default React.memo(ProductDetailFullwidth);
