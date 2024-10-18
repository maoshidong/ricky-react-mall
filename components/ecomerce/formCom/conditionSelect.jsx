import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
/*
Select组件属性
allowClear	支持清除
showSearch	配置是否可搜索
onSearch	文本框值变化时的回调
open={open}  是否展开下拉菜单
onDropdownVisibleChange={setOpen}  展开下拉菜单的回调
dropdownRender	自定义下拉框内容
dropdownMatchSelectWidth  下拉菜单和选择器同宽。默认将设置 min-width，当值小于选择框宽度时会被忽略。false 时会关闭虚拟滚动，boolean | number
*/

function useDebounce(value, delay) {
	const [debouncedValue, setDebouncedValue] = useState(value);
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}

const PartNumSearch = ({ partNumCallBack, options }) => {
    const [partNum, setPartNum] = useState("");
    const debouncedSearchTerm = useDebounce(partNum, 300);

    useEffect(() => {
        partNumCallBack(partNum)
    }, [debouncedSearchTerm])

    return (
        <div className='pub-custom-input-box pub-custom-select ml20'>
            <Select
                // onChange={handleDateChange}
                allowClear
                options={options}
                className={'w200 ' + (checkDate ? 'select-have-val' : '')}
								getPopupContainer={(trigger) => trigger.parentNode}
            >
            </Select>
            <div className='pub-custom-input-holder'>{checkDate ? 'Date' : 'All Date'}</div>
        </div>
    )
}

export default PartNumSearch