import React, { useState, useEffect, useRef } from 'react';
import { CustomInput, RequireTip } from '~/components/common';
import { nanoid } from 'nanoid';
import useLanguage from '~/hooks/useLanguage';
import { uppercaseLetters } from '~/utilities/common-helpers';

// 搜索关键词输入框公共组件
const MinSearch = ({
	handleSearch,
	isMultipleKeyword = true, // 默认多个keyword
	searchPlaceholder,
	otherParams = {},
	defaultKeyword = '',
	onEnter,
}) => {
	const { i18Translate } = useLanguage();
	const iSearchPlaceholder = searchPlaceholder || i18Translate('i18PubliceTable.PartNumber', 'Part Number');

	const inputEl = useRef(null);
	const [isInvalid, setIsInvalid] = useState(false); // 无效输入
	const [isSearch, setIsSearch] = useState(false);
	const [withinName, setWithinName] = useState(defaultKeyword || '');
	const [searchKeywords, setSearchKeywords] = useState([]);

	const [isInitialRender, setIsInitialRender] = useState(true);

	const handleAddWithin = async (e) => {
		onEnter?.();
		inputEl.current.blur();
		e.preventDefault();
		// 默认多个keyword
		if (isMultipleKeyword) {
			if (!withinName || withinName.length < 3) {
				setIsInvalid(true);
				return;
			}
			setWithinName('');
			setSearchKeywords([...searchKeywords, withinName]);
		} else {
			handleSearch(withinName);
		}
	};
	const closeWithinResults = (index) => {
		setSearchKeywords((prev) => prev.filter((_, i) => i !== index));
	};

	useEffect(() => {
		if (isInitialRender) {
			setIsInitialRender(false);
		} else {
			handleSearch(searchKeywords || []);
		}
	}, [searchKeywords]);
	useEffect(() => {
		if (otherParams?.delSearchKeywords && isInitialRender && searchKeywords && searchKeywords?.length > 0) {
			setSearchKeywords([]);
		}
	}, [otherParams]);

	return (
		<div>
			<div className="pub-search pub-custom-input-box w300 blog-content-left-search">
				<form onSubmit={(e) => handleAddWithin(e)}>
					<CustomInput
						style={{ paddingTop: '0px' }}
						ref={inputEl}
						onChange={(e) => (setWithinName(uppercaseLetters(e.target.value)), setIsInvalid(false))}
						onBlur={(e) => setIsSearch(false)}
						onFocus={(e) => setIsSearch(true)} // 导致筛选条件需要点击第二次才生效, 解决方案：1.去掉onBlur、onFocus事件，2.使其失去焦点inputEl.current.blur()
						value={withinName}
						className="form-control pub-search-input w300"
						placeholder={iSearchPlaceholder}
					/>
					<div
						onClick={(e) => handleAddWithin(e)}
						// className={'pub-search-icon sprite-icons-1-3 '}
						className={'pub-search-icon sprite-icons-1-3 ' + (isSearch ? 'sprite-icons-1-4' : '')}
					></div>
				</form>
			</div>
			{isInvalid && (
				// <div className="mt3 pub-danger">{i18Translate('i18Head.enterLimit', INVALID_INPUT_TIP)}</div>
				<RequireTip className="mt6" isAbsolute={false} style={{ height: '38px' }} textStyle={{ whiteSpace: 'break-spaces' }} />
			)}

			{/* 展示已经添加的搜索词 */}
			{searchKeywords?.length > 0 && (
				<div className="applied-filters mt10 pub-flex-align-center" style={{ marginBottom: '-10px' }}>
					<div className="mb10 pub-fontw pub-font14">Search Entry:</div>

					{searchKeywords?.map((item, index) => (
						<div className="product-filter-selected-group pub-border pub-flex-align-center pub-font12" key={nanoid()} style={{ wordBreak: 'break-all' }}>
							<div className="pub-lh18">{item}</div>
							<div className="filter-close" onClick={(e) => closeWithinResults(index)}>
								<div className="ml5 sprite-about-us sprite-about-us-1-4"></div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default MinSearch