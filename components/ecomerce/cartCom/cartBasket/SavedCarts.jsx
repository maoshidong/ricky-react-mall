import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Row, Col, Select, Button } from 'antd'; // Input
import { CustomInput } from '~/components/common';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import Link from 'next/link';
// import { onlyNumber } from '~/utilities/common-helpers';
import MinTopTitle from '~/components/ecomerce/minCom/MinTopTitle';
import MinModalTip from '~/components/ecomerce/minCom/MinModalTip';

import ZqxCartRepository from '~/repositories/zqx/CartRepository';

import useCart from '~/hooks/useCart';
import useEcomerce from '~/hooks/useEcomerce';
import useLanguage from '~/hooks/useLanguage';

import { ACCOUNT_ORDERS_CART } from '~/utilities/sites-url'

// 保存购物篮子
const SavedCartsCom = ({ ecomerce }) => {
	const { i18Translate } = useLanguage();
	const iCartName = i18Translate('i18MyAccount.Cart Name', 'Cart Name')

	const [form] = Form.useForm();
	const Router = useRouter();
	const [cookies] = useCookies(['cart']);
	const { account } = cookies;
	const { allCartItems, curCartData } = ecomerce

	const { addToLoadCarts, setCurCartDataHok } = useEcomerce();
	const { cartListBasket, getUserCartListBasket } = useCart();
	const [isShowTipModal, setIsShowTipModal] = useState(false) // 提示modal

	const [curProjectId, setCurProjectId] = useState('');
	const [curFieldsValue, setCurFieldsValue] = useState({});

	// 成功添加购物车
	const handleSuc = (res) => {
		if (res?.code === 0) {
			addToLoadCarts()
			setCurProjectId('')
			form.resetFields()
			// Router.push(ACCOUNT_PROJECT_DETAIL + `/${res?.data}`)
		}
	}

	const handleOk = async () => {
		setIsShowTipModal(false)
		const infoList = allCartItems?.map(item => {
			return {
				productId: item?.productId,
				quantity: item?.cartQuantity,
			}
		})

		if (curFieldsValue?.id) {
			const param = {
				id: curFieldsValue?.id,
				infoList,
				quantity: cartListBasket?.find(item => item?.id === curFieldsValue?.id)?.quantity,
				deleteFlag: 1, // 删除主购物车标识
				deleteId: curCartData?.id,
			}
			const res = await ZqxCartRepository.updateUserCartBasket(account?.token, param);
			handleSuc(res)
			setCurCartDataHok({})
			return
		}

		const params = {
			cartName: curFieldsValue?.cartName,
			infoList,
			deleteId: curCartData?.id,
		}
		const res = await ZqxCartRepository.addUserCartBasket(account?.token, params);
		handleSuc(res)
		setCurCartDataHok({})
	}

	const handleSubmit = async (fieldsValue) => {
		setIsShowTipModal(true)
		setCurFieldsValue(fieldsValue)
	}

	useEffect(async () => {
		getUserCartListBasket()
	}, [])

	const iAddCartsTip = i18Translate('i18MyCart.AddCartsTip', "Add to a new or saved cart lists.")
	const iSaveNewCarts = i18Translate('i18MyCart.Save New Carts', "Save New Carts")
	const iSaveNewCartsTip1 = i18Translate('i18MyCart.SaveNewCartsTip1', "Are you sure you want to create a new empty basket?")
	const iSaveNewCartsTip2 = i18Translate('i18MyCart.SaveNewCartsTip2', "Your current items in the basket will be saved automatically.")

	return (
		<div style={{ flex: 1, minWidth: '300px', marginTop: '-15px' }}>
			<MinTopTitle className='sprite-icon4-cart sprite-icon4-cart-3-3'>
				{i18Translate('i18MyCart.Saved Carts', "Add to Cart Lists")}
			</MinTopTitle>

			<div className="custom-antd pub-border15 pr-5 mt3 box-shadow">
				<div>{iAddCartsTip}</div>
				<Form
					form={form}
					className="ps-form-modal__account pub-custom-input-suffix mt15 mb-5"
					onFinish={handleSubmit}
					layout="vertical"
					autoComplete="off" // 设置为 "off" 禁用浏览器输入记录
				>
					<Row gutter={20}>
						<Col>
							{/* 嵌套结构与校验信息 */}
							<Form.Item className={'pub-custom-select ' + ((curProjectId === 0 || curProjectId) ? 'select-have-val' : '')}>
								<Form.Item
									name="id"
									rules={[
										{
											required: true,
											message: i18Translate('i18Form.Required', 'Required'),
										},
									]}
									noStyle // 为 true 时不带样式，作为纯字段控件使用
								>
									<Select
										allowClear
										showSearch={false} // true时会弹出输入记录
										filterOption={(input, option) =>
											(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
										}
										className='w180'
										autoComplete="new-password"
										onChange={(e) => setCurProjectId(e)}
										options={[
											{ label: i18Translate('i18MyCart.New Cart', 'New Cart'), value: 0 },
											...cartListBasket?.filter(item => item?.id !== curCartData?.id),
											// ...cartListBasket,
										]}
										dropdownMatchSelectWidth={300}
										dropdownStyle={{
											borderTopRightRadius:'6px'
										}}
										getPopupContainer={(trigger) => trigger.parentNode}
									// style={{ width: '500px', display: 'flex', width: 'max-content' }}
									// dropdownMenuStyle={dropdownMenuStyle}
									// dropdownRender={(menu) => (
									//     <div>
									//       {menu}
									//     </div>
									//   )}
									>
									</Select>
								</Form.Item>
								<div className='pub-custom-holder pub-input-required'>
									{i18Translate('i18MyCart.Cart', 'Cart')}</div>
							</Form.Item>
						</Col>
						{
							curProjectId === 0 && (
								<Col>
									<div className="form-group pub-custom-input-box">
										<Form.Item
											name="cartName"
											rules={[
												{
													required: true,
													message: i18Translate('i18Form.Required', 'Required'),
												},
											]}>
											<div>
												<CustomInput
													className="form-control form-input pub-border w160"
													type="text"
												/>
												<div className='pub-custom-input-holder pub-input-required'>{iCartName}</div>
											</div>
										</Form.Item>
									</div>
								</Col>
							)
						}
						<Col>
							<div className="form-group form-forgot pub-custom-input-nolable">
								<Form.Item>
									<Button
										type="submit" ghost
								    htmlType='submit'
										className='w70'
										disabled={allCartItems?.length === 0}
									>
										{i18Translate('i18FunBtnText.Save', "Save")}
									</Button>
								</Form.Item>
							</div>
						</Col>
					</Row>
				</Form>

				<Link href={ACCOUNT_ORDERS_CART}>
					<a className='view-more mb-5'>
						<span className='sub-title pub-color-link'>{i18Translate('i18MenuText.View more', 'View All')}</span>
					</a>
				</Link>

				{
					isShowTipModal && <MinModalTip
						isShowTipModal={isShowTipModal}
						width={430}
						tipTitle={i18Translate('i18MyCart.Saved Carts', "Cart Lists")}
						submitText={iSaveNewCarts}
						isChildrenTip={true}
						onCancel={() => setIsShowTipModal(false)}
						handleOk={() => handleOk(false)}
					>
						<div className='pub-lh18'>
							<div>{iSaveNewCartsTip1}</div>
							<div>{iSaveNewCartsTip2}</div>
						</div>
					</MinModalTip>
				}
			</div>
		</div>
	)
}

export default connect(state => state)(SavedCartsCom)