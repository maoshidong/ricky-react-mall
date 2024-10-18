import React, { useEffect } from 'react';
import { Row, Col } from 'antd';
import Link from 'next/link';
import Router from 'next/router';
// import LazyLoad from 'react-lazyload';
// import Image from 'next/image';
import { connect, useDispatch } from 'react-redux';
import useLanguage from '~/hooks/useLanguage';
import { setRecommendManufacturerList } from '~/store/ecomerce/action';
import ManufacturerRepository from '~/repositories/zqx/ManufacturerRepository';
import { MANUFACTURER, POPULAR_MANUFACTURERS, MANUFACTURER_CATEGORY } from '~/utilities/sites-url';
import { isIncludes } from '~/utilities/common-helpers';

const AllCalelog = ({ ecomerce, type }) => {
	const { i18Translate, getLanguageEmpty, getDomainsData } = useLanguage();
	const iManufacturersCategory = i18Translate('i18CatalogHomePage.Manufacturers By Product Category', 'Manufacturers By Product Category')
	const isMIndex = type === 'mIndex'

	const dispatch = useDispatch();
	const { recommendManufacturerList } = ecomerce

	async function getList() {
		const res = await ManufacturerRepository.getRecommendListWeb({ languageType: getDomainsData()?.defaultLocale });
		if (res && res?.code === 0) {
			const list = res?.data?.data || []
			dispatch(setRecommendManufacturerList(list))
		}
	}

	const goToPages = (e, item) => {
		e.preventDefault();
		const menu = document.getElementById('pubfixedTop');
		menu.classList.remove('pub-menu-active');
		Router.push(item.url)
	}

	const list = [
		{ name: i18Translate('i18CatalogHomePage.Popular Manufacturers', 'Popular Manufacturers'), url: POPULAR_MANUFACTURERS },
		{ name: iManufacturersCategory, url: MANUFACTURER_CATEGORY },
		{ name: i18Translate('i18CatalogHomePage.View All Manufacturers', 'View All Manufacturers'), url: MANUFACTURER },
	]
	useEffect(() => {
		if (recommendManufacturerList?.length > 0) return
		getList();
	}, [])

	const mList = isMIndex ? recommendManufacturerList : recommendManufacturerList?.slice(0, 20)

	// 不影响性能
	return (
		<div className='menu-manufacturers' style={{ marginLeft: '-5px' }}>

			<div className='navigation-fixed-left nav-fixed-left'>
				<div className='nav-pub-left mt10'>
					{
						list.map((item, i) => {
							return (
								<div className={'nav-left-item ' + (i === 0 ? 'default-active' : '')} key={'a' + i} onClick={(e) => goToPages(e, item)}>
									<a href={item.url} className='nav-left-item-url pub-font13 pub-color18'

									>{item.name}</a>
									<div className='sprite-home-min sprite-home-min-3-9 sprite-home-min-3-10'></div>
								</div>
							)
						})
					}
				</div>
			</div>

			<div className='navigation-fixed-right'>
				<Row gutter={20}>
					{
						mList && mList?.map((item, index) =>
						(

							<Col span={6} key={index}>
								{/* /${item?.parentId || item?.id} */}
								<Link href={`${MANUFACTURER}/${isIncludes(item.slug)}`}>
									<a>
										<div className="menu-manufacturers-item box-shadow">
											{/* <LazyLoad height={50} once={true} offset={0}> */}
											<img
												className='menu-manufacturers-item-img'
												src={item?.logo || item?.image || getLanguageEmpty()}
												alt={item.name}
												title={item.name}
											/>
											{/* </LazyLoad> */}

											{/* <Image    
                                                className='menu-manufacturers-item-img'  
                                                
                                                width={120}
                                                height={60}
                                                src={item?.logo || item?.image || getLanguageEmpty()}
                                                title={item?.name} alt={item?.name}
                                            /> */}
										</div>
									</a>
								</Link>
							</Col>

						)
						)
					}
				</Row>
			</div>

		</div>
	)
}

export default connect(state => state)(AllCalelog)