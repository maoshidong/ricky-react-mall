import React, { useEffect, useRef, useState } from 'react';
import DelCartBtn from '~/components/ecomerce/modules/shoppingCartCom/DelCartBtn';
import { Button } from 'antd';
import useLanguage from '~/hooks/useLanguage';
import { noop } from 'lodash';

const FloatButton = ({
	CartNo = '',
	getList = noop(),
	onSave = noop(),
	onDelete = noop(),
	getSpareList = noop(),
	cartSelectedRows = [],
	allCartItems,
	onCallBack = noop(),
	children,
}) => {
	const { i18Translate } = useLanguage();
	const observer = useRef(null);
	const targetRef = useRef(null);
	const [isBT, setIsBT] = useState(false);
	const [selectedRows, setSelectedRows] = useState(cartSelectedRows);

	useEffect(() => {
		observer.current = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.boundingClientRect.top > 0) {
						if (entry.intersectionRatio < 1) {
							setIsBT(true);
							onCallBack?.(true);
						} else {
							setIsBT(false);
							onCallBack?.(false);
						}
					}
				});
			},
			{ threshold: 1 }
		);

		if (targetRef.current) {
			observer.current.observe(targetRef.current);
		}

		return () => {
			if (targetRef.current) {
				observer.current.unobserve(targetRef.current);
			}
		};
	}, []);

	useEffect(() => {
		setSelectedRows(cartSelectedRows);
	}, [cartSelectedRows]);

	return (
		<>
			<div ref={targetRef} className="mt20" />
			<div className={selectedRows?.length > 0 && isBT ? 'pub-btn-fixed' : ''}>
				{children ? (
					children
				) : (
					<div className="ghost-btn">
						<Button type="primary" ghost="true" className="login-page-login-btn ps-add-cart-footer-btn mr20" onClick={onSave} disabled={selectedRows?.length === 0}>
							<div className="pub-flex-align-center">
								<div className={`sprite-icon4-cart ` + (selectedRows?.length === 0 ? 'sprite-icon4-cart-3-8' : 'sprite-icon4-cart-3-9')}></div>
								<div className="ml10">{i18Translate('i18MyCart.Saved For Later', 'Saved For Later')}</div>
							</div>
						</Button>
						<DelCartBtn
							curCartItems={allCartItems}
							cartSelectedRows={selectedRows}
							curCartNo={CartNo}
							getList={getList}
							getSpareList={getSpareList}
							handShowTip={onDelete}
						/>
					</div>
				)}
			</div>
		</>
	);
};

export default FloatButton