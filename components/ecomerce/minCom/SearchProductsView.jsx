import Link from 'next/link';
import SearchNoData from '~/components/ecomerce/minCom/SearchNoData';
import { getProductUrl } from '~/utilities/common-helpers';
import useLanguage from '~/hooks/useLanguage';

// 搜索产品下拉框组件
const SearchProductsView = ({ resultItems = [], chooseName, searcKeyword }) => {
	const { i18Translate } = useLanguage();
	const iSearchFound = i18Translate('i18ResourcePages.Search Found', 'Search Found');
	const iPartNumber = i18Translate('i18PubliceTable.PartNumber', 'Part Number');
	const iManufacturer = i18Translate('i18PubliceTable.Manufacturer', 'Manufacturer');
	const iAvailability = i18Translate('i18PubliceTable.Availability', 'Availability');

	return (
		<div className={resultItems?.length !== 1 ? 'pb-5' : ''}>
			<div className="search-found pl-10">{iSearchFound}</div>
			<div className="pub-custom-table-head1 pub-flex-align-center">
				<div className="w260">{iPartNumber}</div>
				<div className="w220">{iManufacturer}</div>
				<div className="w70">{iAvailability}</div>
			</div>

			<div className="search-contont-overflow">
				{resultItems?.map((item) => {
					const boldResults = item.name.replace(new RegExp(searcKeyword, 'gi'), (match) => `<strong style="color: #FF6B01">${match}</strong>`);
					return (
						<div key={item?.id}>
							<div className="ps-product ps-product--search-result">
								<div className="ps-product__sub pl-15">
									<Link href={getProductUrl(item?.name, item?.id)}>
										<a className="ps-product__title" onClick={(e) => chooseName(e, item)}>
											{/* <div className="w260">{item?.name}</div> */}
											<div className="w260" dangerouslySetInnerHTML={{ __html: boldResults }} />
											<div className="w220 pub-line-clamp1">{item?.manufacturerName}</div>
											<div className="w70">{item?.price > 0 ? item?.quantity : 0}</div>
										</a>
									</Link>
								</div>
							</div>
						</div>
					);
				})}

				{resultItems?.length === 0 && <SearchNoData type={2} />}
			</div>
		</div>
	);
};

export default SearchProductsView