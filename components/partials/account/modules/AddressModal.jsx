import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { Modal } from 'antd';
import AccountRepository from '~/repositories/zqx/AccountRepository';
import useLanguage from '~/hooks/useLanguage';
import AddressForm from '~/components/ecomerce/formCom/AddressForm';

const AddressModalCom = ({ token, visible, orderTypeList = [], handleCancel, handleSubmit, otherParams }) => {
	const { i18Translate } = useLanguage();
	const iAddShippingAddress = i18Translate('i18OrderAddress.Add Shipping Address', 'ADD SHIPPING ADDRESS');
	const iAddBillingAddress = i18Translate('i18OrderAddress.Add Billing Address', 'ADD BILLING ADDRESS');
	const title = currentShippingAddress ? iAddShippingAddress : iAddBillingAddress;

	const [cookies] = useCookies(['email', 'account']);
	const { account } = cookies;
	const { type, currentRecord, addressList } = otherParams || {}; // shipping billing
	const [isSame, setIsSame] = useState(false); // 地址是否同步
	const [isDefault, setIsDefault] = useState((addressList?.length === 0 || currentRecord?.isDefault ? true : false) ? true : false); // 地址是否默认
	const [isloading, setIsloading] = useState(false);
	const currentShippingAddress = type === 'shipping' ? true : false;

	const handleOk = async (fieldsValues) => {
		// console.log('完成提交--111--del')
		// return
		if (isloading) {
			return;
		}
		setIsloading(true);
		const params = {
			id: currentRecord?.id,
			...fieldsValues,
			asBillingAddress: isSame ? 1 : 0,
			isDefault: isDefault || addressList?.length === 0 ? 1 : 0,
			customerType: fieldsValues?.companyName ? 1 : 0,
			email: account?.account,
			province: fieldsValues?.province || '-', // '需要改为非必填'
			type: currentShippingAddress ? '' : 1,
		};
		console.log(currentShippingAddress, params)
		// debugger
		if (currentShippingAddress) {

			const res = await AccountRepository.saveOrUpdateAddress(params, token);

			setIsloading(false);
			if (res?.code === 0) {

				handleSubmit?.();
			}
		} else {
			const res = await AccountRepository.saveOrUpdateBillingAddress(params, token);
			setIsloading(false);
			if (res?.code === 0) {
				handleSubmit?.();
			}
		}
	};

	return (
		<Modal
			centered
			title={title}
			open={visible}
			onCancel={(e) => handleCancel(e)}
			closeIcon={<i className="icon icon-cross2"></i>}
			footer={null}
			width="600px"
			getContainer={false}
		>
			<AddressForm
				formFields={currentRecord}
				onFinish={handleOk}
				onCancle={handleCancel}
				isShowSame={!currentRecord?.id}
				isSame={false}
				isShowDefault={!currentRecord?.isDefault}
				isDefault={isDefault}
				isShowOrderType
				isShippingAddress={currentShippingAddress}
				oTypeList={orderTypeList}
				onChangeSame={setIsSame}
				onChangeDefault={setIsDefault}
			/>
		</Modal>
	);
};

export default connect((state) => state.auth)(AddressModalCom);