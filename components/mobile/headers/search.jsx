'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { Popup, Input, Space, Modal, Empty, SearchBar, Toast, SpinLoading } from 'antd-mobile';
import { ProductRepository } from '~/repositories';
import { useRouter } from 'next/router';
import { List as VirtualList } from 'react-virtualized';

import useLocalStorage from '~/hooks/useLocalStorage';
import useLanguage from '~/hooks/useLanguage';
import { useDebounceFn } from 'ahooks';
import { isIncludes } from '~/utilities/common-helpers';
import { PRODUCTS_DETAIL } from '~/utilities/sites-url';

const SearchContent = (props) => {
	const [, setRecentProducts] = useLocalStorage('recentProducts', [])

	const [productList, setProductList] = useState([])

	const fetchList = useCallback(async (value) => {
		try {
			const res = await ProductRepository.apiSearchProductByEs({
				"esIndex": "products",
				"keyword": value,
				"pageListSize": 200
			})

			if (res.code === 0) {
				setProductList(res.data?.searchVos?.data || [])
			} else {
				Toast.show({
					content: res.msg
				})
				setProductList([])
			}

		} catch (error) {
			setProductList([])
		}
	}, [])

	const { run } = useDebounceFn((v) => fetchList(v), { wait: 200 })


	const saveRecentProducts = (item, limit = 10) => {
		setRecentProducts(recentProducts => {
			const recent = recentProducts.find(ret => ret.id === item.id)

			if (recent) {
				recentProducts = recentProducts.filter(ret => ret.id !== recent.id)
			}

			return [item].concat(recentProducts).slice(0, limit)
		})
	}

	const renderItem = ({ key, index, style }) => {
		const item = productList[index]

		return <div className="search-r-item" style={style} key={key} onClick={() => {
			saveRecentProducts(item)

			props.push(`${PRODUCTS_DETAIL}/${isIncludes(item.name)}/${item.id}`)
			Modal.clear()
			props.onClose()
		}}>{item.name}</div>
	}

	return <div className="search-box">
		<Space className="search-box-header" justify="end">
			<div className="common-bg-image-icon2 search-box-close" onClick={() => {
				Modal.clear()
			}} />
		</Space>
		<SearchBar
			className="search-box-bar"
			placeholder="Search product"
			onChange={v => {
				run(v)
			}}
			onClear={() => {
				setProductList([])
			}}
		/>
		{
			productList?.length
				? <VirtualList
					style={{ width: '100%' }}
					width={680}
					height={500}
					rowCount={productList.length}
					rowHeight={50}
					rowRenderer={renderItem}
				/>
				: <Empty description="暂无数据" />
		}
	</div>
}

const RecentProducts = ({ push, onClose }) => {
	const [recentProducts] = useLocalStorage('recentProducts', [])
	const { i18Translate } = useLanguage();
	const iPopularProducts = i18Translate('i18MenuText.Hot Products', 'Popular Products')
	const [weekSearchList, setWeekSearchList] = useState([]); // 获取7天内浏览量最多的有货商品10个

	// 获取7天内浏览量最多的有货商品10个 ProductRepository.apiOneWeekHaveStockViewTop10
	const getWeekSearch = () => {
		ProductRepository.apiOneWeekHaveStockViewTop10({}).then(res => {
			if (res?.code === 0) {
				setWeekSearchList(res?.data)
			}
		})
	}

	useEffect(() => {
		getWeekSearch()
	}, []);

	return <div className="m-search-history">
		{
			recentProducts?.length ?
				(
					<Space style={{ '--gap': '20px' }} wrap>
						{
							recentProducts.map(item => (
								<div
									className="m-search-tag"
									key={'recent' + item.id}
									onClick={() => {
										push(`${PRODUCTS_DETAIL}/${isIncludes(item.name)}/${item.id}`)

										onClose()
									}}
								>{item.name}</div>
							))
						}
					</Space>
				)
				: null
		}
		<div className="m-search-title mt20">{iPopularProducts}</div>
		{
			weekSearchList?.length ?
				(
					<Space style={{ '--gap': '10px' }} wrap>
						{
							weekSearchList.map(item => (
								<div
									className="m-search-tag"
									key={item.id}
									onClick={() => {
										push(`${PRODUCTS_DETAIL}/${isIncludes(item.name)}/${item.id}`)

										onClose()
									}}
								>{item.name}</div>
							))
						}
					</Space>
				)
				: null
		}
	</div>
}


const Search = ({ children }) => {
	const [recentProducts] = useLocalStorage('recentProducts', [])
	const { i18Translate } = useLanguage();
	const iRecent = i18Translate('i18Home.recent', "Recent Products")
	const Router = useRouter()
	const [visible, setVisible] = useState(false)


	const onOpen = () => {
		setVisible(true)
	}

	const onClose = () => {
		setVisible(false)
	}

	return <>
		{
			React.cloneElement(children, {
				onClick() {
					onOpen()
				}
			})
		}
		<Popup
			visible={visible}
			position='top'
			onClose={onClose}
			destroyOnClose
		>
			<div className="m-search">
				<div className="m-search-header">
					<div className="m-search-h-l">
						<Input className="input" placeholder="Part Number / Keyword" clearable onClick={() => {
							Modal.show({
								className: 'search-modal',
								content: <SearchContent {...Router} onClose={onClose} />
							})
						}} />
					</div>
					<div className="common-bg-image-icon2 m-search-h-r" onClick={() => onClose()}></div>
				</div>
				<div className="m-search-content">
					<div className="m-search-inner">
						{recentProducts?.length > 0 && <div className="m-search-title">{iRecent}</div>}

						<RecentProducts {...Router} onClose={onClose} />
					</div>
				</div>
			</div>
		</Popup>
	</>
}

export default Search