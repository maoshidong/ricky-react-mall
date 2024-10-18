import React from 'react';
import useLanguage from '~/hooks/useLanguage';

/**
 * @添加到收藏夹
 * @datasheet PDF路徑
 * **/
const Datasheet = ({ datasheet, name }) => {
	const { i18Translate } = useLanguage();
	const iDataSheet = i18Translate('i18AboutProduct.Datasheet', 'Datasheet');

	return (
		<h2 className="pub-flex-align-center pub-cursor-pointer mb10 mr30">
			<div onClick={() => window.open(datasheet, '_blank')}>
				<i className="sprite-icon4-cart sprite-icon4-cart-2-4 icon-pdf " />
				<p className="pub-color-hover-link">{name || iDataSheet}</p>
			</div>
			<br />
		</h2>
	);
};

export default React.memo(Datasheet);
