import { Modal, Button, Form, InputNumber } from 'antd';
import { connect } from 'react-redux';
import Link from 'next/link';
import { nanoid } from 'nanoid';
import { getProductUrl, onlyNumber } from '~/utilities/common-helpers';
import { CustomInputNumber } from '~/components/common';

import useLanguage from '~/hooks/useLanguage';

import { getThousandsData, floatMutilply, calculateTargetPriceTotal } from '~/utilities/ecomerce-helpers';

// 激活购物车
const MergeCartCom = ({ ecomerce, width = '500', isShowModal, onCancel, handleOk, projectProdect = [] }) => {
	const { i18Translate, getLanguageEmpty } = useLanguage();
	const iMergeCarts = i18Translate('i18MyAccount.Merge Carts', 'Merge Carts');
	const iMergDes1 = i18Translate('i18MyAccount.MergDes1', 'Merge this basket with your current Active basket. ');
	const iMergDes2 = i18Translate('i18MyAccount.MergDes2', 'This could increase part quantities if there are duplicates.');
	const iQuantity = i18Translate('i18PubliceTable.Quantity', 'Quantity');

	// const { allCartItems } = ecomerce;
	// const amount = toFixedFun(calculateTotalAmount(allCartItems), 2);

	// const getItemTotal = (record) => {
	// 	//getThousandsData-千分位， floatMutilply-两数相乘
	// 	const itemTotal = getThousandsData(
	// 		floatMutilply(
	// 			calculateTargetPriceTotal(
	// 				{
	// 					...record,
	// 					quantity: record?.quantity,
	// 				},
	// 				record?.quantity
	// 			) || 0,
	// 			record?.quantity
	// 		)
	// 	);
	// 	return itemTotal;
	// };

	return (
		<Modal
			open={isShowModal}
			width={600}
			title={iMergeCarts}
			onCancel={() => onCancel()}
			className="add-to-cart "
			centered
			footer={null}
			closeIcon={<i className="icon icon-cross2"></i>}
		>
			<div>{iMergDes1}</div>
			<div>{iMergDes2}</div>

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
										<a>
											<img src={curImg} alt={curName} title={curName} />
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
										<div className="w280">
											<span className="add-to-cart-manufacturer">{curManufactureName}</span>
										</div>
									</div>
									<div className="pub-custom-input-suffix">
										<Form.Item className={'pub-custom-select select-have-val'}>
											<Form.Item
												name="quantity"
												rules={[
													{
														required: true,
														message: 'Required',
													},
												]}
												noStyle // 为 true 时不带样式，作为纯字段控件使用
											>
												{/* <InputNumber
													className="form-control w140"
													type="number"
													autoComplete="new-password"
													defaultValue={Number(i?.cartQuantity || i?.quantity)}
													min={1}
													onKeyPress={onlyNumber}
													// onDoubleClick={handleDoubleClick}
													// onChange={handleInputChange}
												/> */}
												<CustomInputNumber
													className="form-control w140"
													type="number"
													autoComplete="new-password"
													defaultValue={Number(i?.cartQuantity || i?.quantity)}
													min={1}
													onKeyPress={onlyNumber}
												/>
											</Form.Item>
											<div className="pub-custom-holder pub-input-required">{iQuantity}</div>
										</Form.Item>
										{/* <div className='add-to-cart-quantity'>Quantity: {i?.cartQuantity || i?.customQuantity || quantity}</div>
                                        <div className='add-to-cart-total'>${getItemTotal(i) || 0}</div> */}
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
						{i18Translate('i18FunBtnText.Confirm', 'Merge')}
					</Button>
				)}
			</div>
		</Modal>
	);
};

export default connect((state) => state)(MergeCartCom);