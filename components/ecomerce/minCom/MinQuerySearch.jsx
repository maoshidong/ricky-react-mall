import React, { useState, useEffect, useRef } from 'react';
import { CustomInput, RequireTip } from '~/components/common';
import { nanoid } from 'nanoid';
import useLocalStorage from '~/hooks/useLocalStorage';
import useLanguage from '~/hooks/useLanguage';
import { uppercaseLetters } from '~/utilities/common-helpers';

// 型号搜索输入框公共组件
const MinQuerySearch = ({ handleSearch, otherParams, onEnter }) => {
	const { i18Translate } = useLanguage();

	const inputEl = useRef(null);
	const [isInvalid, setIsInvalid] = useState(false); // 无效输入
	const [isSearch, setIsSearch] = useState(false);
	const { queryKeywords = [] } = otherParams;
	const [withinName, setWithinName] = useState('');

	const [searchKeywords, setSearchKeywords] = useLocalStorage('searchKeywords', queryKeywords || []);
	const [curQueryKeywords, setCurQueryKeywords] = useState(queryKeywords || []);

	const [isInitialRender, setIsInitialRender] = useState(true);

	// useEffect(() => {
	//     if(curQueryKeywords?.length != queryKeywords?.length && !isInitialRender) {
	//         setCurQueryKeywords(queryKeywords)
	//     }
	// }, [Router])

	const handleAddWithin = async (e) => {
		onEnter?.();
		inputEl.current.blur();
		e.preventDefault();
		if (!withinName || withinName.length < 3) {
			setIsInvalid(true);
			return;
		}
		setWithinName('');
		setSearchKeywords([...searchKeywords, withinName]);
		setCurQueryKeywords([...curQueryKeywords, withinName]);
	};
	const closeWithinResults = (index) => {
		setSearchKeywords((prev) => prev.filter((_, i) => i !== index));
		setCurQueryKeywords((prev) => prev.filter((_, i) => i !== index));
	};
	// 展示已经添加的搜索词
	const getSearchEntry = () => {
		if (queryKeywords?.length === 0) return null;
		return (
			<div className="applied-filters mt10 pub-flex-align-center" style={{ marginBottom: '-10px' }}>
				<div className="mb10 pub-fontw pub-font14">{i18Translate('i18SmallText.Search Entry', 'Search Entry')}:</div>
				{queryKeywords?.map((item, index) => {
					return (
						<div className="product-filter-selected-group pub-border pub-flex-align-center pub-font12" key={nanoid()} style={{ wordBreak: 'break-all' }}>
							<div className="pub-lh18">{item}</div>
							<div className="filter-close" onClick={() => (inputEl.current.blur(), closeWithinResults(index))}>
								<div className="ml5 sprite-about-us sprite-about-us-1-4"></div>
							</div>
						</div>
					);
				})}
			</div>
		);
	};

	useEffect(() => {
		// if(curQueryKeywords?.length != queryKeywords?.length) {
		//     setCurQueryKeywords(queryKeywords)
		//     return
		// }

		if (isInitialRender) {
			setIsInitialRender(false);
		} else {
			handleSearch(curQueryKeywords || []);
		}
	}, [curQueryKeywords]);

	// 什么时候清除
	useEffect(() => {
		if (otherParams?.delSearchKeywords && isInitialRender && searchKeywords && searchKeywords?.length > 0) {
			setSearchKeywords([]);
		}
	}, [otherParams]);

	return (
		<div>
			<div className="pub-search pub-custom-input-box w300">
				<form onSubmit={(e) => handleAddWithin(e)}>
					<CustomInput
						style={{ paddingTop: 0 }}
						ref={inputEl}
						onChange={(e) => (setWithinName(uppercaseLetters(e.target.value)), setIsInvalid(false))}
						// onBlur={() => setIsSearch(false)}
						// onFocus={() => setIsSearch(true)} // 导致筛选条件需要点击第二次才生效, 解决方案：1.去掉onBlur、onFocus事件，2.使其失去焦点inputEl.current.blur()
						value={withinName}
						className="form-control pub-search-input w300"
						placeholder={i18Translate('i18SmallText.Enter Part Number', 'Enter Part Number')}
					/>
					<div onClick={(e) => handleAddWithin(e)} className={'pub-search-icon sprite-icons-1-3 ' + (isSearch ? 'sprite-icons-1-4' : '')}></div>
				</form>
			</div>
			{isInvalid && (
				// <div className="mt3 pub-danger">{i18Translate('i18Head.enterLimit', INVALID_INPUT_TIP)}</div>
				<RequireTip className="mt6" isAbsolute={false} style={{ height: '38px' }} textStyle={{ whiteSpace: 'break-spaces' }} />
			)}

			{getSearchEntry()}

			{/* {queryKeywords?.length > 0 && (
                <div className='applied-filters mt10 pub-flex-align-center' style={{ marginBottom: '-10px' }}>
                    <div className='mb10 pub-fontw pub-font14'>Search Entry:</div>
                    {
                        queryKeywords?.map((item, index) => {
                            const handleClick = (currentIndex) => {
                                return () => {
                                    closeWithinResults(currentIndex);
                                };
                            };

                            return (
                                <div className='product-filter-selected-group pub-border pub-flex-align-center pub-font12' key={nanoid()}>
                                    <div className='pub-lh18'>{item}</div>
                                    <div className='filter-close' onClick={handleClick(index)}>
                                        <div className='ml5 sprite-about-us sprite-about-us-1-4'></div>
                                    </div>
                                </div>
                            );
                        })
                    }

                    {
                        curQueryKeywords?.map((item, index) => (
                            <div className='product-filter-selected-group pub-border pub-flex-align-center pub-font12' key={nanoid()}>
                                <div className='pub-lh18'>{item}</div>
                                <div className='filter-close' onClick={() => closeWithinResults(index)}>
                                    <div className='ml5 sprite-about-us sprite-about-us-1-4'
                                        
                                    ></div>
                                </div>
                            </div>
                        ))}
                </div>
            )} */}
		</div>
	);
};

export default MinQuerySearch