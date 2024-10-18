import { forwardRef } from 'react';
import { InputNumber } from 'antd';

/**
 * 封装下数字输入框的限制
 * 默认最小值为1，最大值为999999999
 * 长度为9
 **/
const CustomInputNumber = forwardRef(({ max = 999999999, maxLength = 9, step = 1, ...rest }, ref) => {
	return <InputNumber ref={ref} max={max} maxLength={maxLength} step={step} {...rest} />;
});

export default CustomInputNumber;
