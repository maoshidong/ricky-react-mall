import { forwardRef } from 'react';
import { Input } from 'antd';

/**
 *二次封装Input 统一限制下字符限制   className='pub-search-input'
 **/
const CustomInput = forwardRef(({ maxLength = 40, ...rest }, ref) => {
	return <Input ref={ref} maxLength={maxLength} {...rest} />;
});

export default CustomInput;
