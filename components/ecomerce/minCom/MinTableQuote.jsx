import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';

import { onlyNumber } from '~/utilities/common-helpers';
import { Modal, Form, Button } from 'antd';
import { CustomInput } from '~/components/common';
import QuoteModal from '~/components/shared/blocks/quote-modal';
import classNames from 'classnames';

const MinTableQuote = ({ record, quantityChange, layout, isSuffix = true }) => {
	const { i18Translate } = useLanguage();
	const { iInvalidQuantity, iQuantity, iRequestAQuote } = useI18();

	const [form] = Form.useForm();
	const [isQuoteView, setIsQuoteView] = useState(false);
	const [quantity, setQuantity] = useState(-1);

	const handleShowQuoteModal = (e) => {
		e.preventDefault();
		setIsQuoteView(true);
	};

	const handleHideQuoteModal = (e) => {
		e?.preventDefault();
		setIsQuoteView(false);
	};

	const handleQuantity = (e) => {
		const { value } = e.target;
		setQuantity(value);
		quantityChange?.(record, value);
	};

	const handleAddCart = (e, record) => {
		if (quantity && Number(quantity) > 0) {
			handleShowQuoteModal(e, record);
		} else {
			form.setFields([
				{
					name: 'quantity',
					errors: [iInvalidQuantity],
				},
			]);
		}
	};

	useEffect(() => {
		if (quantity === -1) return;
		if (quantity && Number(quantity) > 0) {
			form.setFields([
				{
					name: 'quantity',
					errors: [],
				},
			]);
		} else {
			form.setFields([
				{
					name: 'quantity',
					errors: [iInvalidQuantity],
				},
			]);
		}
	}, [quantity]);

	const handleDoubleClick = (e) => {
		e.target.select();
	};

	return (
		<div className="custom-antd custom-antd-btn-more input-err-no-pad">
			<Form form={form} layout={layout || 'vertical'} className="pub-custom-input-box">
				<Form.Item name="quantity" className={classNames('mb0', layout ? '' : 'mt5')}>
					<div>
						<CustomInput
							type="number"
							controls={false}
							addonAfter={null}
							min={1}
							maxLength={9}
							style={{ height: '35px', padding: '2px 10px' }}
							placeholder={isSuffix ? '' : iQuantity}
							onDoubleClick={handleDoubleClick}
							onKeyPress={onlyNumber}
							className="form-control w120"
							onChange={(e) => handleQuantity(e)}
						/>
						{isSuffix && <div className="pub-custom-input-holder pub-input-required">{iQuantity}</div>}
					</div>
				</Form.Item>
				<Form.Item>
					<Button
						type="primary"
						htmlType="submit" ghost="true" className={classNames('login-page-login-btn w120', layout ? 'mt2' : 'mt10')} onClick={(e) => handleAddCart(e, record)}>
						{i18Translate('i18FunBtnText.Quote', 'QUOTE')}
					</Button>
				</Form.Item>
			</Form>

			{isQuoteView && (
				<Modal
					centered
					title={iRequestAQuote}
					footer={null}
					width={550}
					onCancel={(e) => handleHideQuoteModal(e)}
					open={isQuoteView}
					closeIcon={<i className="icon icon-cross2"></i>}
				>
					{isQuoteView && (
						<QuoteModal
							cancelFn={() => {
								handleHideQuoteModal();
							}}
							submitFn={handleHideQuoteModal}
							product={record}
							newProduct={record}
							quantity={quantity}
						/>
					)}
				</Modal>
			)}
		</div>
	);
};

export default connect((state) => state)(MinTableQuote);