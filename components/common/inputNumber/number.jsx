import React, { useState, forwardRef, useEffect } from 'react';
import useLanguage from '~/hooks/useLanguage';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './_inputNumber.module.scss';
import isNaN from 'lodash/isNaN';

const processPropsValue = (value) => {
	if (value === null) {
		return '';
	}
	return value + '';
};

const text2Number = (value) => {
	if (value === '') {
		return null;
	}
	return isNaN(parseFloat(value)) ? null : parseFloat(value);
};

// 判断数字是否
const fixNumber = (value, min, max, isMax) => {
	if (value !== null) {
		if (max !== undefined && value > max) {
			if (isMax) {
				value = max;
			} else {
				value = value.toString().slice(0, -1);
			}
		} else if (min !== undefined && value < min) {
			value = min;
		}
	}

	return text2Number(value);
};

const checkValue = (value, precision) => {
	// 允许负数
	// const reg = new RegExp(`^-?(\\d+)?(\\.\\d{0,${precision}})?$`);
	// const reg = new RegExp(`(^[1-9]\\d*(\\.\\d{0,${precision}})?$)|(^0(\\.\\d{0,${precision}})?$)`);

	// 不允许负数
	const reg = new RegExp(`^(\\d+)?(\\.\\d{0,${precision}})?$`)

	if (value.startsWith('-')) {
		value = value.slice(0, 1);
	}

	if (value === '') {
		return true;
	}

	return reg.test(value);
};

const InputNumberV2 = forwardRef(({
	value: propsValue = null,
	precision = 0,
	max = 999999999,
	isMax = false,
	onChange,
	min,
	className,
	required = '',
	...rest
}, ref) => {
	const { i18Translate } = useLanguage();
	const iQuantity = i18Translate('i18PubliceTable.Quantity', "Quantity")
	const [value, setValue] = useState(processPropsValue(propsValue));

	useEffect(() => {
		if (propsValue !== text2Number(value)) {
			setValue(processPropsValue(propsValue));
		}
	}, [propsValue]);

	const handleChange = (e) => {
		const eValue = e.target.value;

		if (!checkValue(eValue, precision)) {
			return;
		}

		const newValue = text2Number(eValue);
		const newFixValue = fixNumber(newValue, min, max, isMax);

		if (newFixValue !== newValue) {
			setValue(processPropsValue(newFixValue));
		} else {
			setValue(eValue);
		}

		onChange?.(newFixValue);
	};

	return (
		<div className={styles['pub-custom-input-box']}>
			<input
				{...rest}
				ref={ref}
				type="text"
				value={value}
				autoComplete='off'
				className={classNames(styles['zqx-input-number'], className)}
				onChange={handleChange}
			/>
			{required && (<div className='pub-custom-input-holder pub-input-required'>
				{required || iQuantity}
			</div>)}
		</div>
	);
});

InputNumberV2.propTypes = {
	max: PropTypes.number,
	min: PropTypes.number,
	value: PropTypes.number,
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
	precision: PropTypes.number,
	className: PropTypes.string,
	style: PropTypes.object,
	isMax: PropTypes.bool
};

export default InputNumberV2;