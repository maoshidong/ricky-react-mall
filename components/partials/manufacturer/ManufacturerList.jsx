import React from 'react';
import Link from 'next/link';
import LazyLoad from 'react-lazyload';
import { MANUFACTURER } from '~/utilities/sites-url';
import { GENERALIZED_WORD } from '~/utilities/constant';
import useLanguage from '~/hooks/useLanguage';
import { isIncludes } from '~/utilities/common-helpers';

// 供应商列表公共组件
const ManufacturerListCom = ({ manufacturerList = [] }) => {
	const { i18Translate, getLanguageName } = useLanguage();
	const iOriginMall = i18Translate('i18CompanyInfo.Origin Electronic Parts Mall', GENERALIZED_WORD);

	return (
		<div className="row pub-margin-8 pl-0">
			{manufacturerList?.map((item, index) => (
				// /${item?.parentId || item?.id}
				<Link href={`${MANUFACTURER}/${isIncludes(item.slug)}`} key={index}>
					<a className="col-xl-3 col-md-4 col-sm-4 col-6 col-sm-6" style={{ padding: '0 5px' }}>
						<h3 className="featured-manufacturer-item">
							<LazyLoad height={50} once={true} offset={1500}>
								<img className="featured-manufacturer-img" src={item?.logo} alt={getLanguageName(item) || iOriginMall} title={getLanguageName(item) || iOriginMall} />
							</LazyLoad>
						</h3>
					</a>
				</Link>
			))}
		</div>
	);
};

export default React.memo(ManufacturerListCom)