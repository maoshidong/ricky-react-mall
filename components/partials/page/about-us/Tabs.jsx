import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Link as ScrollLink } from 'react-scroll';
import { nanoid } from 'nanoid';

const Tabs = ({ tabsArr = [], otherArr = [], offset = -140, duration = 500 }) => {
	const [tabActive, seTabActive] = useState('1');
	const stickyHeader = () => {
		seTabActive('');
		// window?.pageXOffset || 
		let number = document.documentElement.scrollTop || document.body.scrollTop || 0;

		const header = document.getElementById('pubSticky');
		if (header !== null) {
			if (number >= 150) {
				header.classList.add('pubSticky');
			} else {
				header.classList.remove('pubSticky');
			}
		}
	};
	useEffect(() => {
		// if (process?.browser) {
		window.addEventListener('scroll', stickyHeader);
		// }
	}, []);

	// const arr = [
	//   {label: 'About Origin', value: '1'},
	//   {label: 'Our Advantage', value: 'our-advantage'},
	//   {label: 'Core Values', value: 'core-values'},
	//   {label: 'Certifications', value: '4'},
	// ]

	// const otherArr = [
	//   {label: 'Environmental', href: PAGE_IENVIRONMENTAL},
	//   {label: 'Contact Us', href: PAGE_CONTACT_US},
	//   {label: 'Inventory Solutions', href: PAGE_INVENTORY_SOLUTIONS},
	//   {label: 'Careers', href: PAGE_CAREERS},
	// ]

	const handleClick = item => {
		seTabActive(item.value)
	}
	// transition: color .3s ease-in-out;
	// 	smooth：启用或禁用平滑滚动。布尔值（true 或 false）。默认值是 true。
	// duration：滚动动画的持续时间，单位是毫秒。默认值是 500。
	// offset：滚动偏移量，单位是像素。用于在滚动到目标元素时调整最终位置。可以用于处理固定头部的情况。
	// delay：滚动开始前的延迟时间，单位是毫秒。默认值是 0。
	// spy：当滚动到目标元素时，自动更新链接的状态。布尔值（true 或 false）。
	// exact：当目标元素精确匹配时，更新链接的状态。布尔值（true 或 false）。
	return (
		<div id="pubSticky" className="tabs-container">
			{tabsArr?.map((item) => {
				return (
					<ScrollLink
						to={item.value}
						spy={true}
						offset={offset}
						smooth={true}
						duration={duration}
						activeClass="tabs-item tabs-active"
						className={'tabs-item ' + (tabActive == item.value ? 'tabs-active' : '')}
						onClick={() => handleClick(item)}
						key={nanoid()}
					>
						<h2 className="pub-color-hover" style={{ fontWeight: 'normal' }}>
							{item.label}
						</h2>
					</ScrollLink>
				);
			})}

			{otherArr?.map((item) => {
				return (
					<h2 key={nanoid()}>
						<Link href={item.href} key={nanoid()}>
							<a className="tabs-item pub-color-hover" style={{ fontWeight: 'normal' }}>
								{item.label}
							</a>
						</Link>
					</h2>
				);
			})}
		</div>
	);
};


export default Tabs