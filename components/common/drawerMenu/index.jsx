import Flex from '../flex';
import styles from './_drawerMenu.module.scss';

const subMenu = (subList = []) => {
	return (
		<div className={styles.menuSubItem}>
			<ul role="category-menu" className={styles.menuSections}>
				{subList?.map((ml) => (
					<li key={ml?.id} className={styles.menuItem}>
						<a className={styles.menuItemTitle}>
							{ml?.name} <i className="ant-menu-submenu-arrow" />
						</a>
						{ml?.voList?.length > 0 && subMenu(ml?.voList)}
					</li>
				))}
			</ul>
		</div>
	);
};

/**
 * @param menuList 菜单列表
 */
// 抽屉菜单
const DrawerMenu = ({ menuList = [] }) => {
	console.log(menuList);

	return (
		<Flex className={styles.drawerContainer}>
			<ul role="category-menu" className={styles.menuSections}>
				{menuList?.map((ml) => (
					<li key={ml?.id} className={styles.menuItem}>
						<a className={styles.menuItemTitle}>
							{ml?.name} <i className="ant-menu-submenu-arrow" />
						</a>
						{ml?.voList?.length > 0 && subMenu(ml?.voList)}
					</li>
				))}
			</ul>
		</Flex>
	);
};

export default DrawerMenu;
