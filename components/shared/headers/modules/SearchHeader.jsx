import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { connect, useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import { Spin } from 'antd';
import { CustomInput, RequireTip } from '~/components/common';
import ProductRepository from '~/repositories/zqx/ProductRepository';
import { isIncludes, encrypt, uppercaseLetters } from '~/utilities/common-helpers';
import { setPageLoading } from '~/store/setting/action';
import useLocalStorage from '~/hooks/useLocalStorage';
import useLanguage from '~/hooks/useLanguage';
import useDebounce from '~/hooks/useDebounce';
import { getEnvUrl, PRODUCTS_FILTER, PRODUCTS_DETAIL, PRODUCTS } from '~/utilities/sites-url';

// 修改版本
const SearchHeader = ({ searchStyle, style }) => {
	const { i18Translate } = useLanguage();
	const dispatch = useDispatch();
	const { pageLoading } = useSelector(state => state.setting)
	const iSearchFound = i18Translate('i18ResourcePages.Search Found', "Search Found")

	const initPageList = 50 // 请求数量
	const inputEl = useRef(null);
	const scrollDataRef = useRef(null);
	const pageListListRef = useRef(initPageList);
	const isEnter = useRef(false); // 是否已键盘回车键, 输入搜索词改变重置为false, 跳转之后重置为fasle,

	const [isSearch, setIsSearch] = useState(false); // 搜索状态，有搜索结果就展示结果列表
	const [keyword, setKeyword] = useState('');
	const [catalogNum, setCatalogNum] = useState(-1); // 搜索结果分类的分类数量
	const [catalogsVo, setCatalogsVo] = useState({});
	const [resultItems, setResultItems] = useState([]); // 结果列表
	const [resultTotal, setResultTotal] = useState(0); // 结果总数
	const [isAllMatch, setIsAllMatch] = useState(0); // 是否全匹配

	const [loading, setLoading] = useState(false); // 加载状态
	const [isToPage, setIsToPage] = useState(false); // 是否跳转页面
	const [isInvalid, setIsInvalid] = useState(false); // 无效输入

	const debouncedSearchTerm = useDebounce(keyword, 250);
	const [recentViewLoc, setRecentViewLoc] = useLocalStorage('recentViewLoc', []) // 首页浏览记录

	// 初始化数据
	function handleClearKeyword() {
		setKeyword('');
		setResultItems([]) // 跳转页面，清除列表数据
		setLoading(false);
		isEnter.current = false
	}

	const toPageHandle = () => {
		setIsSearch(false);
		setResultItems([]) // 跳转页面，清除列表数据
	}

	const goToPage = () => {
		inputEl.current.blur()
		if (isInvalid) return
		setKeyword('');
		// 如果只有一个匹配项或者isAllMatch：true(全匹配), 直接拿第一个结果跳转
		if (resultItems?.length === 1 || isAllMatch) {
			toPageHandle()
			Router.push(`${getEnvUrl(PRODUCTS_DETAIL)}/${isIncludes(resultItems[0]?.name)}/${resultItems[0].id}`);
			return
		} else {
			setTimeout(() => {
				toPageHandle()
				if (catalogNum === 1) {
					const { slug, id } = catalogsVo
					Router.push(`${getEnvUrl(PRODUCTS_FILTER)}/${isIncludes(slug)}/${id}?keywords=${encrypt(keyword.trim() || '')}`);
					return
				}
				if (catalogNum > 0) {
					Router.push(`${getEnvUrl(PRODUCTS)}?keywords=${encrypt(keyword || '')}` + "&results=" + resultTotal);
					return
				}
				Router.push(`${getEnvUrl(PRODUCTS)}?keywords=${encrypt(keyword || '')}` + "&results=" + resultTotal)
			}, 0)
		}
	}

	const toSearchName = flag => {
		dispatch(setPageLoading(false));
		setLoading(true);
		const products = ProductRepository.apiSearchProductByEs({
			keyword: keyword.trim(),
			pageListSize: pageListListRef.current,
		});

		products.then((result) => {
			const { catalogCount, isAllMatch, catalogsVo, searchVos } = result?.data || {}
			setLoading(false);
			setCatalogNum(catalogCount); // 分类数量
			setCatalogsVo(catalogsVo || {}); // 只有一个分类时 返回的数量
			setIsAllMatch(isAllMatch)
			setResultItems(searchVos?.data);
			setResultTotal(searchVos?.total || 0);
			// 传true或者已回车就跳转
			if (flag || isEnter.current) {
				isEnter.current = false // 跳转之后重置为fasle,
				setIsToPage(true)
			}
		});
	}

	useEffect(() => {
		if (isToPage) {
			goToPage()
		}
	}, [isToPage])

	const handEnter = e => {
		e?.preventDefault();
		if (keyword && keyword.trim().length < 3) {
			setIsInvalid(true)
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

	// function handleSubmit(e) {
	//     e.preventDefault();
	//     if (keyword && keyword.trim().length < 3) {
	//         setIsInvalid(true)
	//         return
	//     }

	//     if (keyword) {
	//         toSearchName(true)
	//     }
	//     // return
	//     // if(!loading && isSearch) {
	//     //     toSearchName(true)
	//     //     return
	//     // }
	// }

	useEffect(async () => {
		// 加载中,回车或者提交了,就不执行后续操作了
		if (pageLoading) {
			return
		}
		setIsInvalid(false)
		setLoading(false);
		if (debouncedSearchTerm.trim()) {
			setIsToPage(false)
			isEnter.current = false
			// 长度不小于3才搜索
			if (keyword && keyword.trim().length > 2) {
				toSearchName()
			} else {
				setResultItems([]);
			}
		} else {
			setResultItems([]);
		}
	}, [debouncedSearchTerm]);

	let productItemsView,
		clearTextView,
		loadingView,
		loadMoreView;
	// 有输入条件和结果才展示 isSearch
	if (resultItems && resultItems.length > 0 && keyword) {
		productItemsView =
			<div>
				<div className='search-found'>{iSearchFound}</div>
				{resultItems.map((item) => {
					// const boldResults = `${item?.name?.replace(keyword, `<strong>${keyword}</strong>`)}`   style="color: #1770DE"
					const boldResults = item.name.replace(new RegExp(keyword, 'gi'), match => `<strong style="color: #FF6B01">${match}</strong>`);

					return (
						<Link
							key={item.id}
							href={`${getEnvUrl(PRODUCTS_DETAIL)}/${isIncludes(item?.name)}/${item.id}`}
						>
							<a className="ps-product ps-product--search-result" onClick={() => handleClearKeyword()}>
								<p className="ps-product__sub ps-product__title" dangerouslySetInnerHTML={{ __html: boldResults }}></p>
								{/* <p className="ps-product__sub ps-product__title">
									{item.name}
								</p> */}
							</a>
						</Link>
					)
				})}
			</div>
	} else if (!keyword && !isToPage) {
		productItemsView = <div>
			<div className='search-found'>{i18Translate('i18Home.recent', "Recent Products")}</div>
			<div className='recent-products'>
				{recentViewLoc?.slice(0, 10)?.map((item, index) => (
					<div className='recent-products-name' key={'recentView' + index}>
						<Link href={`${getEnvUrl(PRODUCTS_DETAIL)}/${isIncludes(item?.name)}/` + item.id}>
							<a>{item.name}</a>
						</Link>
					</div>
				))}
			</div>
		</div>
	}

	if (!loading) {
		if (keyword !== '' && isSearch) {
			clearTextView = (
				<span className="ps-form__action" onClick={handleClearKeyword}>
					<i className="icon icon-cross2"></i>
				</span>
			);
		}
	} else {
		loadingView = (
			<span className="search-btn ps-form__action" style={{ right: '10px' }}>
				<Spin size="middle" style={{ marginBottom: '8px' }} />
			</span>
		);
	}

	// const searchCallback = () => {

	//     if(loading) return // 正在请求中就不再请求了
	//     pageListListRef.current = pageListListRef.current + initPageList
	// }

	// 监听滚动事件
	// useEffect(() => {
	//     const handleScroll = () => {
	//         // setIsSearch(true);
	//         isScrollButtom(scrollDataRef.current, searchCallback)
	//     };
	//     scrollDataRef.current.addEventListener('scroll', handleScroll);
	//     return () => {
	//         if (scrollDataRef.current) {
	//             scrollDataRef.current.removeEventListener('scroll', handleScroll);
	//         }
	//     };
	// }, []); // 只在组件挂载时绑定一次

	return (
		<>
			<form
				className="ps-form--quick-search ps-input-search-name"
				onSubmit={handEnter}
			>
				<div className={"ps-form__input " + (isSearch ? '' : '')} style={style}>
					<CustomInput
						ref={inputEl}
						className="form-control pub-borderd3"
						type="text"
						value={keyword}
						style={searchStyle}
						placeholder={i18Translate('i18SmallText.Enter Part Number', "Enter Part Number")}
						onBlur={e => setIsSearch(false)}
						// 失去焦点，isToPage为false, 不展示浏览记录  , setIsToPage(false)
						onFocus={e => (setIsSearch(true))}
						onChange={(e) => setKeyword(uppercaseLetters(e.target.value))}
					/>

					{loadingView}
					{
						!loading && (
							<div className={'search-btn sprite-icons-1-4 ' + (isSearch ? 'sprite-icons-1-4' : '')} onClick={handEnter}></div>
						)
					}
				</div>
				<div className={`ps-panel--search-result ${isSearch ? ' active ' : ' '}`}>
					<div className="ps-panel__content" ref={scrollDataRef}>{productItemsView}</div>
					{loadMoreView}
				</div>
			</form>

			{
				isInvalid && (
					<RequireTip style={{ left: '-5px' }} />
				)
			}
		</>
	);
};

export default connect((state) => state)(SearchHeader);