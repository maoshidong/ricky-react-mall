import { Modal, Button } from 'antd';
import { connect } from 'react-redux';
import Link from 'next/link';
import { nanoid } from 'nanoid';
import { getProductUrl } from '~/utilities/common-helpers';
import { toFixedFun, calculateTargetPriceTotal } from '~/utilities/ecomerce-helpers';
import useLanguage from '~/hooks/useLanguage';
import { getCurrencyInfo } from '~/repositories/Utils';

// 激活购物车
const MakeCartActiveCom = ({ width = '500', isShowModal, onCancel, handleOk, projectProdect = [] }) => {
	const { i18Translate, getLanguageEmpty } = useLanguage();
	const iMakeCartActive = i18Translate('i18MyAccount.Make Cart Active', 'MAKE CART ACTIVE');
	const iActiveSusTip1 = i18Translate('i18MyAccount.ActiveSusTip1', 'Replace your Active basket with this one.');
	const iActiveSusTip2 = i18Translate('i18MyAccount.ActiveSusTip2', "Don't worry, all baskets will be saved to your account.");
	const iQuantity = i18Translate('i18PubliceTable.Quantity', 'Quantity');
	const currencyInfo = getCurrencyInfo();

	return (
		<Modal
			open={isShowModal}
			width={600}
			title={iMakeCartActive}
			onCancel={() => onCancel()}
			className="add-to-cart "
			centered
			footer={null}
			closeIcon={<i className="icon icon-cross2"></i>}
		>
			<div>{iActiveSusTip1}</div>
			<div>{iActiveSusTip2}</div>

			<div className="heightOverflowY300">
				{projectProdect?.map((i) => {
					const curId = i?.productId || i?.id;
					const curName = i?.name || i?.productName || i?.productNo || i?.partNum || i?.matchPartNum;
					const curManufactureSlug = i?.manufacturerSlug || i?.Manufacturer || i?.manufacturer;
					const curManufactureName = i?.manufacturerName || i?.Manufacturer || i?.manufacturer;
					const curImg = i?.thumb || i?.image || getLanguageEmpty();
					return (
						<div className="ps-add-cart-item pub-border" key={nanoid()}>
							<div className="ps-product--cart-mobile">
								<div className="ps-product__thumbnail">
									<Link href={getProductUrl(curManufactureSlug, i?.name, i?.curId)}>
										<a className="pub-flex w50">
											<img className="pub-img50" src={curImg} alt={curName} title={curName} />
										</a>
									</Link>
								</div>
								<div className="ps-product__content">
									<div>
										<div className="add-to-cart-productNo">
											<Link href={getProductUrl(curManufactureSlug, curName, curId)}>
												<a className="pub-color-hover-link">{curName}</a>
											</Link>
										</div>
										<div className="w250">
											<span className="add-to-cart-manufacturer">{curManufactureName}</span>
										</div>
									</div>
									<div className="pub-custom-input-suffix">
										<div className="add-to-cart-quantity">
											{iQuantity}: {Number(i?.cartQuantity || i?.quantity)}
										</div>
										<div className="add-to-cart-total">
											{currencyInfo.label}
											{toFixedFun(calculateTargetPriceTotal(i) || 0, 4)}
										</div>
										{/* calculateTargetPriceTotal */}
										{/* <Form.Item className={'pub-custom-select select-have-val'}>
                                            <Form.Item
                                                name="quantity"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: iRequired,
                                                    },
                                                ]}
                                                noStyle // 为 true 时不带样式，作为纯字段控件使用
                                            >
                                                <InputNumber
                                                    className="form-control w140"
                                                    type="number"
                                                    autoComplete="new-password"
                                                    defaultValue={Number(i?.cartQuantity || i?.quantity)}
                                                    min={1}
                                                    onKeyPress={onlyNumber}
                                                    // onDoubleClick={handleDoubleClick}
                                                    // onChange={handleInputChange}
                                                />
                                            </Form.Item>
                                            <div className='pub-custom-holder pub-input-required'>{iQuantity}</div>
                                        </Form.Item> */}
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			<div className="ps-add-cart-footer custom-antd-btn-more" style={{ float: 'none' }}>
				<Button
					type="primary"
					ghost
					className="ps-add-cart-footer-btn"
					onClick={() => {
						onCancel ? onCancel() : null;
					}}
				>
					{i18Translate('i18FunBtnText.Cancel', 'Cancel')}
				</Button>
				{handleOk && (
					<Button type="primary" ghost className="ps-add-cart-footer-btn custom-antd-primary" onClick={() => handleOk()}>
						{i18Translate('i18FunBtnText.Confirm', 'Active')}
					</Button>
				)}
			</div>
		</Modal>
	);
};

export default connect((state) => state)(MakeCartActiveCom);