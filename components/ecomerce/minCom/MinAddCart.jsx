import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import useEcomerce from '~/hooks/useEcomerce';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';

import { onlyNumber } from '~/utilities/common-helpers';
import { Modal, Form, Button } from 'antd'; // Input,
import { CustomInput } from '~/components/common';
import AddCartPreview from '~/components/shared/blocks/add-cart-preview';
import CartDuplicatePar from '~/components/ecomerce/minCom/CartDuplicatePart';
import classNames from 'classnames';

const usePersistentState = (initialValue) => {
	const [value, setValue] = useState(initialValue);

	useEffect(() => {
		setValue(initialValue);
	}, []);

	return [value, setValue];
};

const MinAddCart = ({ record, ecomerce, quantityChange, layout, isSuffix = true }) => {
	const { i18Translate, temporaryClosureZh } = useLanguage();
	const { iInvalidQuantity, iQuantity } = useI18();
	const [form] = Form.useForm();
	const Router = useRouter();
	const { useAddMoreCart } = useEcomerce();
	const { allCartItems } = ecomerce

	// const [isCartView, setIsCartView] = useState(false);
	const [isCartView, setIsCartView] = usePersistentState(false);
	const [isShowDuplicatePart, setIsShowDuplicatePart] = useState(false);
	const [curRecord, setCurRecord] = usePersistentState({}); // 当前操作的

	const [quantity, setQuantity] = useState(-1)
	// 中文关闭
	if (temporaryClosureZh()) return null
	const handleAddItemToCart = (e, product, type) => {
		e?.preventDefault();
		useAddMoreCart(
			[{ id: product.productId, quantity: Number(quantity) }],
		);
		// addItem({
		// 	id: product.productId,
		// 	quantity: Number(quantity),
		// 	pricesList: product?.pricesList || [],
		// 	stock: product.quantity, // 用不到了？
		// },
		// 	type === 'cart' ? ecomerce.cartItems : ecomerce.wishlistItems, type
		// );
	}

	const handleShowCartView = (e, record) => {
		e?.preventDefault();

		setIsCartView(true);
		handleAddItemToCart(e, record, 'cart')
	};
	const handleHideCartView = (e) => {
		e && e.preventDefault();
		setIsCartView(false);
	};

	// 数量改变时,改变输入框的报错状态
	const quantityChangeSetFields = (val) => {
		if (val && Number(val) > 0) {
			form.setFields([
				{
					name: 'quantity',
					errors: []
				},
			]);
		} else {
			form.setFields([
				{
					name: 'quantity',
					errors: [iInvalidQuantity]
				},
			]);
		}
	}

	// 设置当前型号的数量
	const setProductQuantity = (value) => {
		setQuantity(value)
		if (quantityChange) {
			if (!checkMinQuantity(value, false) || value === '') {
				quantityChange(record, value)
			}
		}
		quantityChangeSetFields(value)
	}

	// 检查是否大于最小购买数量
	const checkMinQuantity = (value, mark = true) => {
		let flag = false
		const pricesList = record?.pricesList || record?.voList || record?.product_prices || record?.prices || []
		const minQuantity = Number(pricesList?.[0]?.quantity)
		const errText = `MOQ：${minQuantity}`

		if (Number(value) < minQuantity) {
			if (!!mark) {
				form.setFields([
					{
						name: 'quantity',
						value: minQuantity,
						errors: [errText]
					}
				]);
				setQuantity(minQuantity)
			}
			// setProductQuantity(minQuantity)
			flag = true
		}

		return flag
	}

	// 失去焦点检查
	const checkQuantity = e => {
		// const { value } = e.target
		// if (checkMinQuantity(value)) {
		// 	return
		// }
	}

	const handleQuantity = e => {
		const { value } = e.target
		setProductQuantity(value)
		quantityChangeSetFields(value)
	}

	const handleAddCart = (e, record) => {

		if (quantity) {
			if (checkMinQuantity(quantity)) {
				return
			}
		}
		// const pricesList = record?.pricesList || record?.voList || record?.product_prices || record?.prices || [] 
		// const minQuantity = Number(pricesList?.[0]?.quantity)
		// const errText = `MOQ：${minQuantity}`
		// if(Number(quantity) < minQuantity) {
		//     form.setFields([
		//         {
		//             name: 'quantity',
		//             // value: form.getFieldValue('quantity'),
		//             errors: [errText]
		//         }
		//     ]);
		//     return
		// }

		if (quantity && Number(quantity) > 0) {
			// 添加前先判断购物车有没有相同的型号
			const isSameProductId = allCartItems?.find(item => item?.productId === record?.productId)
			if (isSameProductId) {
				setCurRecord(record)
				setIsShowDuplicatePart(true)
				return
			}
			handleShowCartView(e, record)
		} else {
			form.setFields([
				{
					name: 'quantity',
					errors: [iInvalidQuantity]
				},
			]);
		}
	}

	// useEffect(() => {
	//     if(quantity === -1) return
	//     if(quantity && Number(quantity) > 0)  {
	//         form.setFields([
	//             {
	//                 name: 'quantity',
	//                 errors: []
	//             },
	//         ]);
	//     } else {
	//         form.setFields([
	//             {
	//                 name: 'quantity',
	//                 errors: ['invalid quantity']
	//             },
	//         ]);
	//     }
	// }, [quantity])

	// 双击选中输入框内容
	const handleDoubleClick = e => {
		e.target.select();
	}
	const handleWheel = (e) => {
		// 暂时屏蔽掉，有warning 
		// e?.preventDefault();
	}
	const onFinish = (values) => {
		console.log(values);
	};

	return (
		<div className="custom-antd-btn-more input-err-no-pad">
			<Form
				form={form}
				layout={layout || "vertical"}
				className="pub-custom-input-suffix"
			// onFinish={(e) => console.log(11111, '---del')}
			>
				<Form.Item
					name="quantity"
					className={classNames("mb0", layout ? '' : 'mt5')}
				>
					<CustomInput
						type='number'
						controls={false}
						addonAfter={null}
						min={1}
						maxLength={9}
						onKeyPress={onlyNumber}
						onDoubleClick={handleDoubleClick}
						className="form-control pub-border w120"
						style={{ height: '35px', paddingTop: 0 }}
						onChange={e => handleQuantity(e)}
						onBlur={e => checkQuantity(e)}
						onWheel={handleWheel}
						placeholder={isSuffix ? '' : iQuantity}
						step={0}
						suffix={isSuffix ? <div className='pub-custom-input-holder pub-input-required'>{iQuantity}</div> : ''}
						autoComplete="off" // 设置为 "off" 禁用浏览器输入记录
					/>

					{/* <div>
                        <Input
                            type='number'
                            controls={false}
                            addonAfter={null}
                            min={1}
                            maxLength={9}
                            // onKeyDown  onKeyUp  onKeyPress
                            onKeyPress={onlyNumber}
                            onDoubleClick={handleDoubleClick}
                            className="pub-border w120"
                            onChange={e => handleQuantity(e)}
                            onWheel={handleWheel}
                            step={0}
                        />
                        <div className='pub-custom-input-holder pub-input-required'>Quantity</div>
                    </div> */}
				</Form.Item>
				<Form.Item>
					{/* type="submit"  */}
					<Button
						type="primary"
						htmlType="submit"
						ghost='true'
						className={classNames('login-page-login-btn custom-antd-primary w120', layout ? 'mt2' : 'mt10')}
						onClick={(e) => handleAddCart(e, record)}
					// disabled={!(quantity > 0)}
					>{i18Translate('i18FunBtnText.AddToCart', 'ADD TO CART')}</Button>
				</Form.Item>
			</Form>


			{
				isShowDuplicatePart && <CartDuplicatePar
					isShow={isShowDuplicatePart}
					handleCancel={() => setIsShowDuplicatePart(false)}
					handleConfirm={(e) => (setIsShowDuplicatePart(false), handleShowCartView(e, curRecord))}
				/>
			}

			{isCartView && <Modal
				centered
				title={i18Translate('i18MyCart.Cart', 'CART')}
				footer={null}
				width={550}
				onCancel={(e) => handleHideCartView(e)}
				open={isCartView}
				closeIcon={<i className="icon icon-cross2"></i>}
			>
				<AddCartPreview
					submitFn={() => { handleHideCartView(); Router.push(`/account/shopping-cart`) }}
					continueFn={handleHideCartView}
					product={record}
					quantity={quantity}
				/>
			</Modal>
			}
		</div>
	)
}

export default connect((state) => state)(MinAddCart);