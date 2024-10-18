import React from 'react';
import dynamic from 'next/dynamic'
const MenuList = dynamic(() => import('~/components/shared/menus/MenuList'));

const NavigationDefault = () => {
	return (
		<nav className="navigation">
			<div className="navigation__left">
			</div>
			<div className="navigation__right">
				<MenuList />
			</div>

		</nav>
	);
}

export default NavigationDefault;