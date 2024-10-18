import React, { useState, useEffect, useRef } from "react";
// import { useMouse } from 'ahooks';
// import { useMouseLeave } from 'react-use';
import Link from 'next/link'
// import dynamic from 'next/dynamic'
// const NavContentBox = dynamic(() => import('/components/shared/menus/NavContentBox'));

import NavContentBox from '~/components/shared/menus/NavContentBox';
import { PRODUCTS, PAGE_ABOUT_US, MANUFACTURER, QUALITY } from '~/utilities/sites-url'
// import { get } from "react-scroll/modules/mixins/scroller";
// const NavContentBox = dynamic(() => import('./NavContentBox'));

import useLanguage from '~/hooks/useLanguage';

// 头部导航菜单
const MenuList = () => {
	const { i18Translate, temporaryClosureZh } = useLanguage();

	let newTimerId = useRef();
	let isAdd = useRef(false);
	// const mouse = useMouse();
	// useEffect(() => {
	//             // screenX: 871, screenY: 638, clientX: 422, clientY: 60, pageX: 867
	//     // 鼠标位置  || mouse.clientX < 360 || mouse.clientX > 830
	//     if(mouse.clientY > 60) {
	//         clearTimeout(newTimerId.current);
	//     }

	// }, [mouse])

	const [curNavId, setCurNavId] = useState('')
	let timer = useRef();


	const handleClose = () => {
		// setCurNavId('')
		isAdd.current = false
		clearTimeout(newTimerId.current)
		// 不隐藏导航下拉框，方便调试
		const menu = document.getElementById('navList');
		menu.classList.remove('pub-menu-active');
	}

	const openNav = (item, time = 400) => {
		clearTimeout(newTimerId.current) // 先重置上一个
		if (item.key === 'quality') {
			setCurNavId(item.key)
			return
		}
		const menu = document.getElementById('navList');
		newTimerId.current = setTimeout(() => {
			setCurNavId(item.key)
			menu.classList.add('pub-menu-active');
		}, time)
	}

	// const [refLeave] = useMouseLeave(handleMouseLeave);
	const navMouseEnter = item => {
		openNav(item)
	}

	const navMouseLeave = item => {
		clearTimeout(newTimerId.current)
		const menu = document.getElementById('navList');
		newTimerId.current = setTimeout(() => {
			menu.classList.remove('pub-menu-active');
		}, 200)
	}

	const clickNav = (e, item) => {
		if (item?.key === 'resources') {
			e.preventDefault()
		}
		openNav(item, 0)
	}

	const iProducts = i18Translate('i18Head.products', "Products")
	const iManufacturer = i18Translate('i18Head.manufacturer', "manufacturers")
	const iResources = i18Translate('i18Head.resources', "resources")
	const iQuality = i18Translate('i18Head.quality', "quality")
	const iAboutUs = i18Translate('i18Head.aboutUs', "About Us")

	const source = [
		{ id: 1, slug: PRODUCTS, label: iProducts, key: "products", prefetch: false },
		{ id: 2, slug: MANUFACTURER, label: iManufacturer, key: "manufacturer", prefetch: true },
		{ id: 3, slug: `/#`, label: iResources, key: "resources", prefetch: false },
		{ id: 4, slug: QUALITY, label: iQuality, key: "quality", prefetch: false },
		{ id: 5, slug: PAGE_ABOUT_US, label: iAboutUs, key: "aboutUs", prefetch: false },
	]

	const changeNavId = (val) => {
		handleClose()
	}

	let menuView;
	if (source) {
		menuView = source?.map((item, index) => {
			if (temporaryClosureZh() && item?.id === 3) return null
			return (
				<Link href={item.slug} key={index}>
					<a
						// 点击事件放在这里才正确，修改：悬浮展开导航有误
						onClick={(e) => clickNav(e, item)}
						onMouseEnter={() => navMouseEnter(item)}
						onMouseLeave={() => navMouseLeave(item)}
						className={'menu-item ' + (item.key === curNavId ? 'menu-item-active ' : '')}
					// aria-label={`go to ${item.label}`}
					>
						<h3 className="pub-font500">{item.label.toUpperCase()}</h3>
					</a>
				</Link>
			)
		});
	}

	useEffect(() => {
		return () => {
			clearTimeout(timer.current)
			clearTimeout(newTimerId.current)
		};
	}, [])

	return (
		<div className="menu--product-categories" id="navList">

			{menuView}
			<NavContentBox curNavId={curNavId} changeNavId={changeNavId} />
		</div>
	)
}

export default MenuList