import React from 'react';
import useLanguage from '~/hooks/useLanguage';

const FreeSample = ({ name, onSample }) => {
	const { i18Translate } = useLanguage();

	return (
		<h2
			onClick={onSample}
			className="pub-flex-align-center data-sheet__desc data-sheet__border__none ps-product-data-list pub-color-hover-link mb10"
			aria-label={`${name} Free Sample - Apply for samples`}
		>
			<i className="product-sample-icon sprite-icon2-4-4" />
			<p className="pub-color-hover-link">{i18Translate('i18MenuText.Free Sample', 'Free Sample')}</p>
		</h2>
	);
};

export default FreeSample