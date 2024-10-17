import React, { useState, useEffect } from 'react';
import { useTranslation, i18n } from 'next-i18next';
import * as rdd from 'react-device-detect';

export default function useMobile() {
	const [deviceMode, setDeviceMode] = useState('DESKTOP');
	const [deviceCom, setDeviceCom] = useState('');

	// 初始化视图配置
	const initViewport = () => {
		const width = 750; // 设计稿宽度
		const scale = window.innerWidth / width;
		let meta = document.querySelector('meta[name=viewport]');
		let content = `width=${width}, init-scale=${scale}, user-scalable=no`;
		if (!meta) {
			meta = document.createElement('meta');
			meta.setAttribute('name', 'viewport');
			document.head.appendChild(meta);
		}
		meta.setAttribute('content', content);
	};

	// 设置设备对应组件, 设置设备类型
	const getDeviceCom = (mCom, padCom, desktopCom) => {
		if (rdd.isMobile) {
			if (window?.screen?.width <= 750) {
				setDeviceMode('MOBILE');
				if (mCom) {
					setDeviceCom(mCom);
				}
			} else {
				setDeviceMode('PAD');
				setDeviceCom(padCom || mCom);
			}
			initViewport();
			setDeviceCom(desktopCom || mCom);
			return;
		}

		let currentMode = 'DESKTOP';
		const w = window.innerWidth;

		if (w <= 750) {
			currentMode = 'MOBILE';
			setDeviceCom(mCom);
			initViewport();
		} else if (w > 750 && w < 1200) {
			currentMode = 'PAD';
			initViewport();
			setDeviceCom(padCom || mCom);
		} else {
			currentMode = 'DESKTOP';
			setDeviceCom(desktopCom || mCom);
		}

		setDeviceMode(currentMode);
	};

	useEffect(() => {
		getDeviceCom();
		window.addEventListener('resize', getDeviceCom);
		return () => {
			window.removeEventListener('resize', getDeviceCom);
		};
	}, []);

	return {
		deviceCom,
		getDeviceCom,
		deviceMode,
	};
}
