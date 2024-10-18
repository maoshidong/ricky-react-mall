import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import Flex from '../flex';
import RequireTip from '../requireTip';
import CustomInput from '../input';
import FilterItem from '../filterItem';

import useI18 from '~/hooks/useI18';
import useLanguage from '~/hooks/useLanguage';
import ProductRepository from '~/repositories/ProductRepository';
import { uppercaseLetters } from '~/utilities/common-helpers';
import { useCookies } from "react-cookie"

/**
 * @制造商搜索
 * @param 参数类型
 * @factType 查询制造商的条件 收藏传:4  标签传:5 备用购物车传:6
 * @onSearch 回调搜索条件
*/
const ManufacturerNav = forwardRef(({ factType, onSearch }, ref) => {
	const { getDomainsData } = useLanguage();
	const [cookies] = useCookies(['account'])
	// 多语
	const { iSearchPartNumber, iEnterPartNumber, iAllManufacturers, iAppliedFilters } = useI18();

	// 搜索框内容
	const [withinName, setWithinName] = useState('');
	// 内容输入提示
	const [isInvalid, setIsInvalid] = useState(false);
	// 选中一个制造商
	const [manufacturer, setManufacturer] = useState({});
	// 添加的withinResults, 当前选中的条件
	const [withinResults, setWithinResults] = useState([]);
	// 制造商列表
	const [manufacturerList, setManufacturerList] = useState([]);

	const stickyRef = useRef(null);
	const contRef = useRef(null);
	const filterRef = useRef(null);

	const checkSticky = (_e, isEmpty = false) => {
		const el = stickyRef.current;
		if (el) {
			const rect = stickyRef.current.getBoundingClientRect();
			if (rect.top > 0) {
				const hh = 200 - (rect.top - 80);

				const fHeight = filterRef.current?.offsetHeight || 0
				if (fHeight > 0) {
					hh = hh - fHeight
				}
				if (isEmpty) {
					hh = hh - 44
				}

				if (contRef.current) {
					contRef.current.style.maxHeight = `calc(52vh + ${hh}px)`;
				}
			}
		}
	};

	useEffect(() => {
		// 监听浏览器滚动事件
		window.addEventListener('scroll', checkSticky);
		// 组件卸载前移除监听
		return () => window.removeEventListener('scroll', checkSticky);
	}, []);

	// 获取制造商列表
	const getProductManufacturerList = (factType) => {
		ProductRepository.getProductManufacturerList(factType || 1, getDomainsData()?.defaultLocale, cookies?.['account']?.token).then((res) => {
			if (res?.code === 0) {
				setManufacturerList(res?.data);
			}
		});
	};

	useEffect(() => {
		if (factType) {
			getProductManufacturerList(factType);
		}
	}, [factType]);

	// 提交搜索关键词
	const handleSearchWithin = (e) => {
		e.preventDefault();
		if (!withinName || withinName.length < 3) {
			checkSticky(null, true)
			setIsInvalid(true);
			return;
		}

		const findResult = withinResults?.find(wrs => wrs === withinName)
		if (!findResult) {
			setWithinResults([...withinResults, withinName]);
		}
		setWithinName('')
	};

	// 选择制造商
	const handleManufacturerChange = (item) => {
		setManufacturer(item);
	};

	const closeWithinResults = (index) => {
		setWithinResults((prev) => prev.filter((_, i) => i !== index));
	};

	// 搜索框输入
	const handleInputSearch = (e) => {
		setWithinName(uppercaseLetters(e.target.value))
		setIsInvalid(false)
		checkSticky(null, false)
	}

	useEffect(() => {
		checkSticky();
		onSearch?.({
			manufacturerId: manufacturer?.manufacturerId || '',
			keywordList: withinResults || [],
		})
	}, [withinResults, manufacturer]);

	useImperativeHandle(ref, () => ({
		fetchData: (type) => {
			getProductManufacturerList(type)
		}
	}))

	return (
		<Flex column ref={stickyRef} className="pub-left-nav catalogs__top-fixed">
			{/* 搜索框 */}
			<Flex column>
				{/* <div className="pub-font16 pub-fontw">{iSearchPartNumber}</div> */}
				<div className='w300 free-sample-part-number'>
					<div className="mt5 pub-search w300 pr-0 pub-custom-input-suffix">
						<form onSubmit={(e) => handleSearchWithin(e)} style={{ background: 'white', borderRadius: '6px' }}>
							<CustomInput
								onChange={handleInputSearch}
								className="form-control w300"
								value={withinName}
								// placeholder={iEnterPartNumber}
								suffix={<div className='pub-custom-holder'>{iEnterPartNumber}</div>}
							/>
							<i onClick={(e) => handleSearchWithin(e)} className="pub-search-icon sprite-icons-1-3" />
						</form>
						{isInvalid && <RequireTip className="mt6" isAbsolute={false} style={{ height: '38px' }} textStyle={{ whiteSpace: 'break-spaces' }} />}
					</div>
				</div>

				<div ref={filterRef}>
					{/* 条件集合 */}
					{(withinResults?.length > 0 || manufacturer?.name) && (
						<div className="applied-filters pub-flex-align-center mt10">
							<div className="pub-fontw pub-font14 mb3">{iAppliedFilters}:</div>

							{manufacturer?.name && <FilterItem text={manufacturer?.name} onClick={() => (setManufacturer({}))} isAbbreviation length={42} />}
							{withinResults?.map((item, index) => (
								<FilterItem text={item} key={index} onClick={() => closeWithinResults(index)} />
							))}
						</div>
					)}
				</div>
			</Flex>

			<div className="ps-block--menu-categories mt20">
				<div className="ps-block__header">
					<h3>{iAllManufacturers.toUpperCase()}</h3>
				</div>
				<div ref={contRef} className="ps-block__content" style={{ maxHeight: '52vh', overflow: 'auto' }}>
					<ul className="pub-menu-cata">
						{manufacturerList?.map((item, index) => (
							<li
								key={index}
								className={'menu-item-has-children ' + (manufacturer?.manufacturerId == item?.manufacturerId ? 'pub-left-active' : '')}
								onClick={() => handleManufacturerChange(item)}
							>
								{/* <Link href={handAllRouter({ manufacturerId: item?.manufacturerId })}> */}
								<a>{item.name}</a>
								{/* </Link> */}
							</li>
						))}
					</ul>
				</div>
			</div>
		</Flex>
	);
});

export default ManufacturerNav;
