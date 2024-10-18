import React, { useEffect, useState } from 'react'; // , lazy, Suspense
import { useDispatch, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import MenuProducts from '~/components/shared/menus/MenuProducts';
import AllCalelog from '~/components/shared/menus/AllCalelog';
import Resources from '~/components/shared/menus/Resources';
import useLanguage from '~/hooks/useLanguage';
import { getWinLocale } from '~/utilities/easy-helpers';
import ProductRepository from '~/repositories/ProductRepository';
import cloneDeep from 'lodash/cloneDeep';
import assign from 'lodash/assign';
import map from 'lodash/map';
// import AboutUs from '~/components/shared/menus/AboutUs'
// const MenuProducts = dynamic(() => import('./MenuProducts'));
// const AllCalelog = dynamic(() => import('./AllCalelog'));
// const Resources = dynamic(() => import('./Resources'));
const AboutUs = dynamic(() => import('~/components/shared/menus/AboutUs'));

import { setNewProductCatalogList } from '~/store/ecomerce/action';

// const MenuProducts = React.memo(MenuProducts1);

const NavContentBox = ({ curNavId, changeNavId }) => {
	const { i18Translate } = useLanguage();
	const iNewestProducts = i18Translate('i18MenuText.Newest Products', "Newest Products")
	// 最新产品
	const _NewestProducts = {
		"id": 'NewestProducts',
		"name": iNewestProducts,
		voList: []
	}
	// 最新产品数据
	const [newsProd, setNewsProd] = useState([cloneDeep(_NewestProducts)])
	const dispatch = useDispatch()
	const { newProductCatalogList } = useSelector(state => state.ecomerce)

	const handleNavMouseEnter = e => {
		const menu = document.getElementById('pubfixedTop');
		menu.classList.add('pub-menu-active');

		const menu1 = document.getElementById('navList');
		menu1.classList.add('pub-menu-active');
	}

	// 隐藏导航
	const handleNavMouseLeave = e => {
		const menu = document.getElementById('pubfixedTop');
		menu.classList.remove('pub-menu-active');
		changeNavId('')
	}

	const handleNavClose = e => {
		const menu = document.getElementById('pubfixedTop');
		if (menu) {
			menu.classList.remove('pub-menu-active');
		}

		const menu1 = document.getElementById('navList');
		if (menu1) {
			menu1.classList.remove('pub-menu-active');
		}
	}

	useEffect(() => {
		getNewproductData()
	}, [])

	// 获取最新分类数据
	const getNewproductData = async () => {
		// 已经有值了,就不调用接口了
		if (newProductCatalogList?.voList?.length > 0) {
			setNewsProd([newProductCatalogList])
			return
		}
		const res = await ProductRepository.apiGetNewProductCatalogListWeb(getWinLocale());
		if (res?.data) {
			const newPros = res?.data || []
			const _newlist = map(newPros, nd => { return { ...nd, isNewPro: true } })
			const newProd = assign({}, cloneDeep(_NewestProducts), { voList: _newlist })
			setNewsProd([newProd])
			dispatch(setNewProductCatalogList(newProd))
		}
	}

	// 是否为英文
	// const isEn = curLanguageCodeEn()

	return (
		<div
			id="pubfixedTop"
			className='nav-content-box'
			onMouseEnter={(e) => {
				handleNavMouseEnter(e);
			}}
			onMouseLeave={(e) => {
				handleNavMouseLeave(e);
			}}
		>
			<div
				className="pub-navigation-fixed-top"
			>
				{/* maxWidth:isEn?'1440px':'1582px' */}
				<div className='ps-container' style={{ height: '100%' }}>
					{/* {
                        curNavId === 'aboutUs' && <AboutUs />
                    }
                    {
                        curNavId === 'manufacturer' && <AllCalelog />
                    }
                    {
                        curNavId === 'resources' && <Resources />
                    } */}
					{/* 阻塞恢复 */}
					{/* <div className={curNavId === 'products' ? 'percentW100' : 'pub-seo-visibility zhus'}>
                        <MenuProducts curNavId={curNavId} />
                    </div> */}
					<div className={curNavId === 'aboutUs' ? 'percentW100' : 'pub-seo-visibility zhus'}>
						<AboutUs />
					</div>
					<div className={curNavId === 'manufacturer' ? 'percentW100' : 'pub-seo-visibility zhus'}>
						<AllCalelog />
					</div>
					<div className={curNavId === 'resources' ? 'percentW100' : 'pub-seo-visibility zhus'}>
						<Resources />
					</div>


				</div>
				{
					curNavId === 'products' && <MenuProducts curNavId={curNavId} newsProList={newsProd} />
				}
				{
					curNavId !== 'quality' && (
						<i onClick={(e) => handleNavClose(e)} className="nav-close ant-modal-close-x icon icon-cross2"></i>
					)
				}

			</div>

		</div>
	)
}

export default NavContentBox;