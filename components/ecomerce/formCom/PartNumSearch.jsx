import React, { useState, useEffect } from 'react';
import { CustomInput } from '~/components/common';
import useLanguage from '~/hooks/useLanguage';
import { uppercaseLetters } from '~/utilities/common-helpers';

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

const PartNumSearch = ({ keyword = '', partNumParam, partNumCallBack, onKeyPress }) => {
	const { i18Translate } = useLanguage();
	const iPartNumber = keyword || i18Translate('i18PubliceTable.PartNumber', 'Part Number')

	const [partNum, setPartNum] = useState(partNumParam || "");
	const debouncedSearchTerm = useDebounce(partNum, 300);

	useEffect(() => {
		partNumCallBack(partNum)
	}, [debouncedSearchTerm])

	return (
		<div className='pub-search pub-custom-input-box w260'>
			<CustomInput
				value={partNum}
				onChange={e => setPartNum(uppercaseLetters(e.target.value))}
				className='form-control w260'
				onKeyPress={onKeyPress}
			/>
			<div className={'pub-search-icon sprite-icons-1-3'} style={{ top: '10px' }}></div>
			<div className='pub-custom-input-holder'>{iPartNumber}</div>
		</div>
	)
}

export default PartNumSearch