import { useState, useRef, useEffect, Fragment } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { Spin } from 'antd';

import classNames from 'classnames';
import { Flex, RequireTip } from '~/components/common';
import { connect, useDispatch, useSelector } from 'react-redux';
import { uppercaseLetters, isIncludes, encrypt } from '~/utilities/common-helpers';

import useLanguage from '~/hooks/useLanguage';
import useLocalStorage from '~/hooks/useLocalStorage';
import useDebounce from '~/hooks/useDebounce';
import useI18 from '~/hooks/useI18';

import { ProductRepository } from '~/repositories';
import { setPageLoading } from '~/store/setting/action';
import { PRODUCTS_FILTER, PRODUCTS_DETAIL, PRODUCTS } from '~/utilities/sites-url';

const HotSearchCom = () => {
	const { i18Translate } = useLanguage();
	const { iRecent } = useI18();
	const iEenterPNumber = i18Translate('i18SmallText.Enter Part Number', 'Enter Part Number');
	const iSearchFound = i18Translate('i18ResourcePages.Search Found', "Search Found")

	const iPopularProducts = i18Translate('i18MenuText.Hot Products', 'Popular Products')

	const dispatch = useDispatch();
	const { pageLoading } = useSelector((state) => state.setting);
	const initPageList = 50 // 请求数量
	const pageListListRef = useRef(initPageList);
	const isEnter = useRef(false); // 是否已键盘回车键, 输入搜索词改变重置为false, 跳转之后重置为fasle,

	const inputRef = useRef(null);
	const hotSearchRef = useRef(null);
	const [isOpen, setIsOpen] = useState(false);

	const [isInvalid, setIsInvalid] = useState(false); // 无效输入
	const [keyword, setKeyword] = useState('');
	const [resultItems, setResultItems] = useState([]); // 结果列表
	const [loading, setLoading] = useState(false); // 加载状态
	const [isToPage, setIsToPage] = useState(false); // 是否跳转页面

	const [catalogNum, setCatalogNum] = useState(-1); // 搜索结果分类的分类数量
	const [catalogsVo, setCatalogsVo] = useState({});
	const [isAllMatch, setIsAllMatch] = useState(0); // 是否全匹配
	const [resultTotal, setResultTotal] = useState(0); // 结果总数
	const [_searchData, setSearchData] = useLocalStorage('searchData', {});

	const [weekSearchList, setWeekSearchList] = useState([]); // 获取7天内浏览量最多的有货商品10个


	const debouncedSearchTerm = useDebounce(keyword, 250);

	const [recentViewLoc] = useLocalStorage('recentViewLoc', []) // 首页浏览记录

	// 初始化数据
	const initData = () => {
		setKeyword('');
		setResultItems([]); // 跳转页面，清除列表数据
	};

	const toPageHandle = () => {
		setResultItems([]); // 跳转页面，清除列表数据
	};

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

		const handleClickOutside = (event) => {
			if (hotSearchRef.current && !hotSearchRef.current.contains(event.target)) {
				setIsOpen(false);
				setKeyword('')
			}
		};

		// 添加事件监听器到整个文档
		document.addEventListener('click', handleClickOutside);

		// 组件卸载时清除事件监听器
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		if (isOpen && inputRef.current) {
			setTimeout(() => {
				inputRef.current.focus();
			}, 50);
		}
	}, [isOpen]);

	// 跳转到对应的页面
	const jumpToThePage = () => {
		setIsToPage(false); // 需要重置为false, 不然下次不能触发jumpToThePage
		if (isInvalid) {
			return;
		}

		// 如果只有一个匹配项或者isAllMatch：true(全匹配), 直接拿第一个结果跳转
		if (resultItems?.length === 1 || isAllMatch) {
			toPageHandle();
			const firstItem = resultItems[0];
			Router.push(`${PRODUCTS_DETAIL}/${isIncludes(firstItem?.name)}/${firstItem.id}`);
		} else {
			setTimeout(() => {
				toPageHandle();
				let routePath = `${PRODUCTS}?keywords=${encrypt(keyword || '')}&results=${resultTotal}`;

				if (catalogNum === 1) {
					// 结果只返回一个型号
					const { slug, id } = catalogsVo;
					routePath = `${PRODUCTS_FILTER}/${isIncludes(slug)}/${id}?keywords=${encrypt(keyword.trim() || '')}`;
				} else if (catalogNum > 0) {
					routePath = `${PRODUCTS}?keywords=${encrypt(keyword || '')}&results=${resultTotal}`;
				}
				Router.push(routePath);
			}, 0);
		}
	};



	const toSearchName = (flag) => {
		setLoading(true);
		const products = ProductRepository.apiSearchProductByEs({
			keyword: keyword.trim(),
			pageListSize: pageListListRef.current,
		});

		products.then((result) => {
			const { catalogCount, isAllMatch, catalogsVo, searchVos } = result?.data || {};
			setLoading(false);
			setCatalogNum(catalogCount); // 分类数量
			setCatalogsVo(catalogsVo || {}); // 只有一个分类时 返回的数量
			setIsAllMatch(isAllMatch);
			setSearchData(result?.data || {});
			setResultItems(searchVos?.data);
			setResultTotal(searchVos?.total || 0);
			// 传true或者已回车就跳转
			if (flag || isEnter.current) {
				isEnter.current = false; // 跳转之后重置为fasle,
				setIsToPage(true);
			}
		});
	};

	useEffect(() => {
		if (isToPage) {
			jumpToThePage();
		}
	}, [isToPage]);

	useEffect(async () => {
		// 加载中,回车或者提交了,就不执行后续操作了
		if (pageLoading) {
			return;
		}
		setIsInvalid(false);
		setLoading(false);
		if (debouncedSearchTerm.trim()) {
			setIsToPage(false);
			isEnter.current = false
			// 长度不小于3才搜索
			if (keyword && keyword.trim().length > 2) {
				toSearchName();
			} else {
				setResultItems([]);
			}
		} else {
			setResultItems([]);
		}
	}, [debouncedSearchTerm]);

	// 打开搜索输入框
	const handleOpenClick = () => {
		setIsOpen(true);
	};

	// 关闭搜索框
	const handleCloseClick = () => {
		setIsOpen(false);
		setKeyword('')
	}

	// 输入框输入
	const handleChangeInput = (e) => {
		const value = e.target.value;
		setKeyword(uppercaseLetters(value));
	};

	// 搜索
	const handleEnterSearch = (e) => {
		e?.preventDefault();
		if (!!keyword && keyword.trim().length < 3) {
			setIsInvalid(true)
			return
		} else if (keyword === '') {
			if (!isOpen) {
				setIsOpen(!isOpen)
			}
			return
		}

		dispatch(setPageLoading(true));

		// 加载中只需要等待结果跳转
		if (loading) {
			isEnter.current = true
			return
		}

		// 有结果就直接跳转
		if (resultItems?.length > 0) {
			setIsToPage(true)
			return
		}
		if (keyword) {
			toSearchName(true)
		}
	}

	// 回车
	const handleKeyDown = (event) => {
		if (event.key === 'Enter') {
			handleEnterSearch()
		}
	}
	// weekSearchList

	// 	当使用 new RegExp 动态创建正则表达式时，你需要确保从变量中构建的正则表达式是有效的。如果 keyword 包含正则表达式的特殊字符（如 *、+、?、{、}、(、)、[、]、|、^、$），你必须对这些字符进行转义。

	// 可以使用一个函数来对正则表达式中的特殊字符进行转义。以下是如何处理动态正则表达式的一种方法：

	// 转义正则表达式中的特殊字符：你需要转义 keyword 中的特殊字符，以确保它能被正确处理。

	// 创建新的正则表达式：使用 new RegExp 创建正则表达式。

	// 实现步骤
	// 编写转义函数：
	// javascript
	// function escapeRegExp(string) {
	//   return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	// }
	// 这个函数会将所有正则表达式的特殊字符转义，使它们作为字面值匹配。

	// 使用转义函数：
	// javascript
	// const keyword = 'ABM3-8.000MHZ-D**2Y-T'; // 这是你的动态关键词
	// const escapedKeyword = escapeRegExp(keyword); // 转义特殊字符

	// const boldResults = item?.name?.replace(new RegExp(escapedKeyword, 'gi'), match => 
	//   `<strong style="color: #FF6B01">${match}</strong>`);
	// 例子
	// 假设 item.name 是 "ABM3-8.000MHZ-D**2Y-T is the code"，并且 keyword 是 "ABM3-8.000MHZ-D**2Y-T"。应用上述代码后：

	// escapeRegExp(keyword) 会将 ** 转义为 \\*\\*。
	// new RegExp(escapedKeyword, 'gi') 会创建一个有效的正则表达式。
	// .replace 方法会将匹配到的部分替换为带有 <strong> 标签的内容。
	// 完整示例
	// javascript
	// function escapeRegExp(string) {
	//   return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	// }

	// const keyword = 'ABM3-8.000MHZ-D**2Y-T'; // 这是你的动态关键词
	// const escapedKeyword = escapeRegExp(keyword); // 转义特殊字符

	// const item = { name: 'ABM3-8.000MHZ-D**2Y-T is the code' };

	// const boldResults = item?.name?.replace(new RegExp(escapedKeyword, 'gi'), match => 
	//   `<strong style="color: #FF6B01">${match}</strong>`);

	// console.log(boldResults);
	// 这样，你可以避免 SyntaxError 并确保你的正则表达式可以正确处理包含特殊字符的动态关键词。
	// ABM3-8.000MHZ-D**2Y-T

	let productItemsView
	// 有输入条件和结果才展示 isSearch
	if (resultItems && resultItems.length > 0 && keyword) {
		productItemsView =
			<div>
				<div className='search-found'>{iSearchFound}</div>
				<ul role='listbox'>
					{resultItems.map((item) => {
						// const boldResults = item?.name;
						const regex = new RegExp('ABM3-8\\.000MHZ-D\\*2Y-T', 'gi');
						const boldResults = item?.name?.replace(new RegExp(keyword?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), match => `<strong style="color: #FF6B01">${match}</strong>`);

						return (
							<li role='option' key={item.id} className='nav-search-item'>
								<Link
									href={`${PRODUCTS_DETAIL}/${isIncludes(item?.name)}/${item.id}`}
								>
									<a onClick={() => initData()}>
										<div dangerouslySetInnerHTML={{ __html: boldResults }}></div>
									</a>
								</Link>
							</li>
						)
					})}
				</ul>
			</div>
	} else if (!keyword && !isToPage) {
		productItemsView = <div>
			{/* Text content did not match. Server: "Popular Products" Client: "Recent Products" */}

			{recentViewLoc?.length > 0 && <Fragment>
				<div className='search-found'>{iRecent}</div>
				<ul role='listbox' className='recent-products'>
					{recentViewLoc?.slice(0, 10)?.map((item, index) => (
						<li role='option' className='recent-products-name' key={'recentView' + index} onClick={() => setIsOpen(false)}>
							<Link href={`${PRODUCTS_DETAIL}/${isIncludes(item?.name)}/` + item.id}>
								<Flex flex alignCenter justifyCenter className='search-history'>
									<a>{item.name}</a>
								</Flex>
							</Link>
						</li>
					))}
				</ul>
			</Fragment>}

			<div className='search-found'>{iPopularProducts}</div>
			<ul className='recent-products'>
				{weekSearchList?.map((item, index) => (
					//  onClick={() => setIsOpen(false)}
					<li className='recent-products-name' key={'weekSearch' + index}>
						<Link href={`${PRODUCTS_DETAIL}/${isIncludes(item?.name)}/` + item.id}>

							<a className='search-history'>{item.name}</a>

						</Link>
					</li>
				))}
			</ul>

		</div>
	}

	return (
		<div ref={hotSearchRef} id="hot-search" className={classNames('search-container', { 'is-open': isOpen })}>
			<div className="nav-search" onClick={handleOpenClick}>
				<span className="search-text">{iEenterPNumber}</span>
				<button className="nav-search-btn">
					<i className="nav-search-i search" />
				</button>
			</div>

			<div className="nav-search-dropdown">
				<div className="nav-search-bar">
					<div className="nav-search-bar-inner">
						<input
							ref={inputRef}
							value={keyword}
							type="text"
							maxLength="40"
							className="pls-nav-search-bar-input"
							aria-autocomplete="on"
							placeholder={iEenterPNumber}
							onChange={handleChangeInput}
							onKeyDown={handleKeyDown}
						/>
						<div className="nav-search-bar-btns">
							<button className="nav-search-btn ps-form__action" onClick={handleEnterSearch}>
								{loading ? <Spin size="middle" style={{ fontsize: '14px' }} /> : <i className="nav-search-i search" />}
							</button>
							<span className="nav-search-divider" />
							<button
								className="nav-search-btn"
								onClick={handleCloseClick}
							>
								<i className="nav-search-i search-close" />
							</button>
						</div>
					</div>
				</div>
				{!!productItemsView && <div className="nav-search-results">
					<div className="ps-panel__content">{productItemsView}

					</div>
				</div>
				}
			</div>
			{
				isInvalid && (
					<RequireTip style={{ left: '-278px' }} />
				)
			}
		</div>
	);
};

export default connect((state) => state)(HotSearchCom);
