import React, { useState } from 'react';

// 自定义的 Hooks，用于限制点击事件多次触发
export default function useClickLimit() {
	const [limitDisabled, setLimitDisabled] = useState(false);
	const handleLimitDisabled = (flag) => {
		setLimitDisabled(flag);
	};

	// 点击事件处理函数
	async function handleLimitClick(asyncCallback) {
		if (limitDisabled) {
			return;
		}

		// 请求未完成时设置 disabled 为 true
		setLimitDisabled(true);

		try {
			// 执行异步请求
			await asyncCallback();
			// 在这里可以写其他请求完成后的逻辑
		} catch (error) {
			// 处理请求错误
			setTimeout(() => {
				setLimitDisabled(false);
			}, 100);
		} finally {
			// 请求完成后将 disabled 设置为 false

			setTimeout(() => {
				setLimitDisabled(false);
			}, 100);
		}
	}

	return [limitDisabled, handleLimitClick, handleLimitDisabled];
}