import ProductQuoteForm from '~/components/partials/product/ProductQuoteForm';

const ProductWidgetsCom = ({ newProduct, productPrices }) => {
	return (
		<section>
			<ProductQuoteForm newProduct={newProduct} productPrices={productPrices} />
		</section>
	);
};

export default ProductWidgetsCom;
