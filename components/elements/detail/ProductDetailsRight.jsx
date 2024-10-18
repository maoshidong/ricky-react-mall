import React, { useContext } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Flex } from '~/components/common';
import { ProductsDetailContext } from '~/utilities/shopCartContext';
import { PAGE_CERTIFICATIONS, PRODUCTS_DETAIL } from '~/utilities/sites-url';
import { isIncludes } from '~/utilities/common-helpers';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
import useLocalStorage from '~/hooks/useLocalStorage';
const ProductWidgets = dynamic(() => import('/components/partials/product/ProductWidgets'));

const ProductDetailsRight = (props) => {
	const { i18Translate, temporaryClosureZh } = useLanguage();
	const { iRecent } = useI18();
	const [recentViewLoc] = useLocalStorage('recentViewLoc', []) // 首页浏览记录
	const { productPrices } = props;
	const { productDetailData, isHavePrice, authList } = useContext(ProductsDetailContext);

	return (
		<div className="ps-page__right">
			<div className="pub-border20 box-shadow">
				<ProductWidgets newProduct={productDetailData} productPrices={productPrices} />
			</div>

			{/* 无价格的认证 */}
			{!isHavePrice && authList?.length > 0 && !temporaryClosureZh() && (
				<div className="mt20 pub-border15 box-shadow" style={{ paddingRight: '14px', paddingBottom: '15px' }}>
					<div className="pub-left-title">{i18Translate('i18MenuText.Certifications', 'Certifications')}</div>
					<Link href={PAGE_CERTIFICATIONS}>
						<a className="pub-flex-wrap mt10 mb10" style={{ gap: '20px' }}>
							{authList?.map((item) => {
								return <img key={item.name} src={item?.imageUrl} alt={item.name} className="certificate-icon" style={{ width: '80px', height: '73px' }} />;
							})}
						</a>
					</Link>
				</div>
			)}

			{recentViewLoc?.length > 0 && <div className="mt20 pub-border20 box-shadow">
				<div className="pub-left-title mb10">{iRecent}</div>
				<ul className='mb0 pl-0'>
					{recentViewLoc?.slice(0, 10)?.map((item, index) => (
						<li role='option' className='pub-hover-Box mb4' key={'recentView' + index}>
							<Link href={`${PRODUCTS_DETAIL}/${isIncludes(item?.name)}/` + item.id}>
								<a className='pub-flex'>
									<div className="percentW50 pub-line-clamp1 mr10" title={item?.name}>{item.name}</div>
									<div className="percentW50 pub-line-clamp1" title={item?.manufacturer}>{item?.manufacturer}</div>
									{/* {item.name}&nbsp;&nbsp;&nbsp;&nbsp;Texas Instruments */}
								</a>
							</Link>
						</li>
					))}
				</ul>
			</div>}


		</div>
	);
};

export default React.memo(ProductDetailsRight)