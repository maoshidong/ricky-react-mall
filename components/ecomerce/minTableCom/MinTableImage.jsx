import useLanguage from '~/hooks/useLanguage';

const MinTableEcad = ({ record, imgClass }) => {
	const { getLanguageEmpty } = useLanguage();

	const { productName, name, image, thumb } = record;
	const curImage = thumb || image || getLanguageEmpty();
	const curProductName = productName || name;
	return <img className={imgClass || 'pub-img'} src={curImage} alt={curProductName} title={curProductName} onError={(e) => (e.target.src = getLanguageEmpty())} />;
};

export default MinTableEcad;
