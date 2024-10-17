import React from 'react';
import useLanguage from '~/hooks/useLanguage';

const AddToFavorites = ({ isFavoritesSuc, onAddFavorites }) => {
	const { i18Translate } = useLanguage();

	return (
		<h2 className="pub-color-hover-link mb10 mr30" onClick={onAddFavorites}>
			<div>
				<i className={`sprite-icon4-cart icon-pdf ` + (isFavoritesSuc ? 'sprite-icon4-cart-2-6' : 'sprite-icon4-cart-2-5')} />
				<p>
					{isFavoritesSuc
						? i18Translate('i18AboutProduct.Added to favorites', 'Added to favorites')
						: i18Translate('i18AboutProduct.Add to favorites', 'Add to favorites')}
				</p>
			</div>
		</h2>
	);
};

export default React.memo(AddToFavorites);