import React from 'react';
import Link from 'next/link';
import TitleMore from '~/components/shared/public/titleMore';
// import Image from 'next/image';
import LazyLoad from 'react-lazyload';
import { MANUFACTURER } from '~/utilities/sites-url';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
import { isIncludes } from '~/utilities/common-helpers';
// import { useSelector } from 'react-redux';

const featuredManufacturer = ({ type, manuServer }) => {
	const { i18Translate } = useLanguage();
	const { iFeaturedManufacturers } = useI18();
	// const { recommendManufacturerList } = useSelector(state => state.ecomerce)
	const isMIndex = type === 'mIndex';
	if (manuServer?.length === 0) return null;

	const mList = isMIndex ? manuServer : manuServer?.slice(0, 10);
	const iViewMore = i18Translate('i18MenuText.View more', 'View more');

	return (
		<div className="ps-product-list blocks-featured-manufacturer pt-80 pb-90">
			<div className="ps-container">
				{type !== 'mIndex' && <TitleMore title={iFeaturedManufacturers} subTitle={iViewMore} linkUrl={MANUFACTURER} />}
				<div className="row pub-margin-8 mt30">
					{mList?.map((item) => (
						// /${item?.parentId || item?.id}
						<Link href={`${MANUFACTURER}/${isIncludes(item.slug)}`} key={'m' + item?.id}>
							<a aria-label={`Visit ${item?.name} page`} className="col-xl-3 col-md-4 col-sm-4 col-6 col-sm-6" style={{ padding: '0 5px' }}>
								<div className="featured-manufacturer-item">
									<LazyLoad height={50}>
										<img className="featured-manufacturer-img" src={item.logo} alt={item?.name} title={item?.name} />
									</LazyLoad>
									{/* <img src='https://oss.origin-ic.com/otherFile/texasInstruments-logo.png' style={{height: '50px'}} /> */}
									{/* 143 76 */}
									{/* <Image className="featured-manufacturer-img" width="auto" height={50} layout="intrinsic" src={item.logo} alt={item?.name} title={item?.name} /> */}
								</div>
							</a>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default React.memo(featuredManufacturer)