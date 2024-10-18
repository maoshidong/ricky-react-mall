import React, { useEffect, useRef, useState } from 'react';
import { noop } from 'lodash';

const FloatButton = ({ onCallBack = noop(), isShow = false, children, curClass = '' }) => {
	const observer = useRef(null);
	const targetRef = useRef(null);
	const [isBT, setIsBT] = useState(false);

	useEffect(() => {
		observer.current = new IntersectionObserver(
			(entries) => {
				// console.log(entries, '-entries---del')
				entries.forEach((entry) => {
					if (entry.boundingClientRect.top > 0) {
						if (entry.intersectionRatio < 1) {
							setIsBT(true);
							onCallBack?.(true);
						} else {
							setIsBT(false);
							onCallBack?.(false);
						}
					}
				});
			},
			{ threshold: [0.8, 1] }
		);

		if (targetRef.current) {
			observer.current.observe(targetRef.current);
		}

		return () => {
			if (targetRef.current) {
				observer.current.unobserve(targetRef.current);
			}
		};
	}, []);

	return (
		<div className="0">
			<div ref={targetRef} className="0" />
			<div className={`${curClass} ` + (isShow && isBT ? 'pub-btn-fixed' : '')}>{children}</div>
		</div>
	);
};

export default FloatButton