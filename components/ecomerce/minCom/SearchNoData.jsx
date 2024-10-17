import useLanguage from '~/hooks/useLanguage';

// 数据为空展示组件
const SearchNoData = ({ type = 1, noDataText }) => {
	const { i18Translate } = useLanguage();
	const iNoDataTip = noDataText || i18Translate('i18SmallText.NoResults', 'Sorry, your search returned no results');

	return (
		<div className={'tell-us-request custom-antd-btn-more ' + (type === 1 ? 'pub-border15' : '')} style={{ textAlign: 'center' }}>
			{type === 1 && <div className="mt20 mb20 pub-font24 pub-color555">{iNoDataTip}</div>}
			<div className="sptite-no-data" />
			<div className="mb15 pub-font14 pub-color888">{i18Translate('i18SmallText.NoDataYet', 'No data yet')}</div>
		</div>
	);
};

export default SearchNoData