import React from 'react';
import PubTabLink from '~/components/common/layout/PubTabLink';
import { MANUFACTURER, MANUFACTURER_CATEGORY, POPULAR_MANUFACTURERS } from '~/utilities/sites-url'
import useI18 from '~/hooks/useI18';
import useLanguage from '~/hooks/useLanguage';

const ManufacturerTabs = ({ tabActive }) => {
	const { i18Translate } = useLanguage();
	const { iAllManufacturers, iPopularManufacturers } = useI18();
	const iManufacturersCategory = i18Translate('i18CatalogHomePage.Manufacturers By Product Category', 'Manufacturers By Product Category')

	const headNavArr = [
		{ name: iAllManufacturers, tabLabel: iAllManufacturers, linkUrl: MANUFACTURER },
		{ name: iManufacturersCategory, tabLabel: iManufacturersCategory, linkUrl: MANUFACTURER_CATEGORY },
		{ name: iPopularManufacturers, tabLabel: iPopularManufacturers, linkUrl: POPULAR_MANUFACTURERS },
	]

	return (
		<PubTabLink headNavArr={headNavArr} tabActive={tabActive} />
	)
}

export default ManufacturerTabs