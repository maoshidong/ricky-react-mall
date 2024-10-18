import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { connect } from 'react-redux';
// import { Form, Input } from 'antd';
import { CustomInput } from '~/components/common';

// Input，其中的 Input 组件是受控组件。在受控组件中，value 属性是用于指定输入框的值的，如何没有提供与输入框的值相关联的状态或处理函数，value={email} 并不会改变输入框的值。
const EmailInputCom = ({ form, name, auth }) => {
	const { getFieldDecorator } = form;
	const { isAccountLog } = auth;
	const [cookies, setCookie] = useCookies(['account', 'email']);

	const [inputEmail, setInputEmail] = useState('');
	const handleEmailChange = (e) => {
		setInputEmail(e.target.value);
	};

	useEffect(() => {
		if (cookies?.isAccountLog) {
			form.setFields([
				{
					name: 'email',
					value: cookies?.account?.account,
				},
			]);
			setInputEmail(cookies?.account?.account);
		} else {
			setInputEmail(cookies?.email);
			form.setFields([
				{
					name: 'email',
					value: cookies?.email,
				},
			]);
		}
	}, [cookies]);

	return (
		// 提示错误 next-dev.js:20  Warning: Instance created by `useForm` is not connected to any Form element. Forget to pass `form` prop?
		// <Form.Item
		//     name="email"
		//     rules={[{ required: false, message: 'Required' }]}
		// >
		//                 <Input
		//     name="email"
		//     className="form-control w300"
		//     type="text"
		//     autoComplete="new-password"
		//     value={inputEmail}
		//     onChange={handleEmailChange}
		//     suffix={<div className='pub-custom-holder pub-input-required'>Email</div>}
		//     disabled={isAccountLog}
		// />
		// </Form.Item>
		// 没有了 <Form.Item> 包裹，所以在父组件中将无法使用 rules 属性进行验证。如果需要进行验证，您可以考虑在父组件中手动处理验证逻辑。
		<CustomInput
			name="email"
			className="form-control w300"
			type="text"
			autoComplete="new-password"
			value={inputEmail}
			onChange={handleEmailChange}
			suffix={<div className="pub-custom-holder pub-input-required">Email</div>}
			disabled={isAccountLog}
		/>
	);
};

export default connect(state => state)(EmailInputCom)