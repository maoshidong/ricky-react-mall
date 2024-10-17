import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { CustomInput } from '~/components/common';
import NormalProductRepository from '~/repositories/ProductRepository';

import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';

const MinCustomerReference = ({ auth, record, changeCustomerReference, disabled = false }) => {
	const { i18Translate } = useLanguage();
	const { iCustomerReference } = useI18();
	const { isAccountLog } = auth;

	const { userProductTag } = record;

	const [remark, setRemark] = useState(userProductTag);

	const setCustomerReference = (tag) => {
		NormalProductRepository.editProductTag({
			productId: record?.productId || record?.id,
			tag: remark,
		});
	};

	useEffect(() => {
		setRemark(userProductTag);
	}, [userProductTag]);
	useEffect(() => {
		if (changeCustomerReference) {
			changeCustomerReference(remark);
		}
	}, [remark]);

	if (!isAccountLog || !record) return null;

	return (
		<div className={"pub-custom-input-box mt10 "}>
			<div>
				<CustomInput
					className="form-control form-input w180"
					value={remark}
					onChange={(e) => setRemark(e.target.value)}
					onBlur={(e) => setCustomerReference(e.target.value)}
					disabled={disabled}
				/>
				<div className="pub-custom-input-holder">{iCustomerReference}</div>
			</div>
		</div>
	);
};

export default connect(state => state)(MinCustomerReference)