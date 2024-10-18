import React, { useState, useEffect, useRef } from 'react';
// 检查，不需要就删除
function ScrollDistanceListener({ children }) {
	const [scrollDistance, setScrollDistance] = useState(0);
	const ref = useRef(null);

	useEffect(() => {
		const handleScroll = () => {
			if (ref.current) {
				const { top, height } = ref.current.getBoundingClientRect();
				const distanceToBottom = Math.max(0, window.innerHeight - top - height);
				setScrollDistance(distanceToBottom);
			}
		};

		// 初始滚动距离计算
		handleScroll();

		// 监听滚动事件
		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<div ref={ref} className={(scrollDistance === 0 ? 'pub-btn-fixed' : '') + ' mt20'}>
			{React.Children.map(children, (child) => {
				// 将 scrollDistance 作为 prop 传递给每个子组件
				return React.cloneElement(child, { scrollDistance });
			})}
		</div>
	);
}

export default ScrollDistanceListener;