import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
// import { login, checkIsAccountLog } from '~/store/auth/action';

// import AccountRepository from '~/repositories/zqx/AccountRepository';
// import { setToken } from '~/repositories/Repository';

// import { getExpiresTime } from '~/utilities/common-helpers';
import { Modal, Form, Input, Button, Row, Col, Checkbox } from 'antd';
import { CustomInput } from '~/components/common';

// 暂时不使用，不需要就删除？
export default function useAccount(props) {
	const dispatch = useDispatch();
	const reduxData = useSelector((state) => state);
	const { auth, ecomerce } = reduxData;
	const [cookies, setCookie] = useCookies(['cart', 'auth']);

	const useFormItemCompanyName = () => {
		return (
			<Form.Item name="companyName" className="mb20" rules={[{ required: true, message: 'Required' }]}>
				<CustomInput className="form-control w260" type="text" autoComplete="off" suffix={<div className="pub-custom-input-holder pub-input-required">Company Name</div>} />
			</Form.Item>
		);
	};

	return {
		useFormItemCompanyName,
	};
}