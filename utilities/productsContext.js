import React from 'react';

export const ProductsFilterContext = React.createContext({
	filterAttrIds: '', // 已选属性集合
	filterKeyword: '', // 页面搜索关键词
	currentUrl: '', // 无参数的url
	manufacturerData: '',
	isOneInitial: true,
	updateFilterAttrIds: (data) => {},
	updateFilterKeyword: (data) => {},
	updateCurrentUrl: (data) => {},
	updateManufacturerData: (data) => {},
	updateIsOneInitial: (data) => {},
});

export const NewsContentContext = React.createContext({
	typefitIds: [], // 已选属性集合
	functionIdList: [],
	queryKey: '', // 搜索词
});