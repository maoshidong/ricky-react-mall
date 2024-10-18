import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { connect } from 'react-redux';
import { Row, Col, Modal, Button, Spin } from 'antd';
import AccountRepository from '~/repositories/zqx/AccountRepository';
import CouponListItem from '~/components/ecomerce/cartCom/CouponListItem';
import SearchNoData from '~/components/ecomerce/minCom/SearchNoData';
import { getAllCartPrices } from '~/utilities/common-helpers';
import { COUPON_TAB } from '~/utilities/constant';
import useLanguage from '~/hooks/useLanguage';

const VoucherModal = ({ isShowModal, handleCancel, hideVoucherModal, auth, ecomerce }) => {
	const { i18Translate, i18MapTranslate } = useLanguage();
	const iVoucher = i18Translate('i18MyCart.Voucher', "VOUCHER")

	const { allCartItems } = ecomerce
	const { token } = auth

	const [isLoading, setIsLoading] = useState(false) // 
	const [tabActive, seTabActive] = useState(1) // 头部导航状态
	const [couponData, setCouponData] = useState({})
	const [cartTotalPrices, setCartTotalPrices] = useState(0)


	let params = {
		type: 1,
		pageNum: 1,
		pageSize: 20,
	}
	const getCoupon = async (p) => {
		setCouponData({}) // 先清空，不然接口慢还是先展示之前的
		Object.keys(params).forEach((key) => {
			if (p[key]) {
				params[key] = p[key]
			}
		})
		setIsLoading(true)
		///type 1:有效 2：已使用 3：过期   （pageSize，pageNum-从1开始）
		const res = await AccountRepository.getCoupon(params);
		setIsLoading(false)
		if (res && res.code === 0) {
			setCouponData(res.data);
		}
	}
	useEffect(() => {
		if (!token) return
		getCoupon({ type: tabActive });
	}, [tabActive, token])
	useEffect(() => {
		const cartTotalPrices = getAllCartPrices(allCartItems)
		setCartTotalPrices(cartTotalPrices)
	}, [allCartItems])

	return (
		<Modal
			centered
			title={iVoucher}
			footer={null}
			maskClosable={false} // 点击蒙层是否允许关闭
			width={800}
			onCancel={(e) => handleCancel(false)}
			open={isShowModal}
			closeIcon={<i className="icon icon-cross2"></i>}
			className='custom-antd-btn-more'
		>
			<div className='mb20 cart-tabs'>
				{
					COUPON_TAB.map((item, index) => {
						return <div
							key={nanoid()}
							className={'cart-tabs-item pub-color888 ' + (tabActive == item?.value ? 'cart-tabs-active' : '')}
							onClick={(e) => seTabActive(item?.value)}
						>
							{i18MapTranslate(`i18MyAccount.${item?.name}`, item?.name)}
						</div>
					})
				}
			</div>
			<Spin spinning={isLoading} size='large'>
				<div style={{ minHeight: '150px' }}>
					<Row gutter={20} className='heightOverflowY500'>

						{
							couponData?.list?.map((item, index) => (
								<Col xs={24} sm={24} md={24} xl={12} lg={12} key={index}>
									<CouponListItem couponItem={item} type={tabActive}>
										<Button
											type="primary" ghost
											disabled={Number(cartTotalPrices) < Number(item?.price)}
											className='mt15 custom-antd-primary w100'
											onClick={() => handleCancel(item?.id + '-' + item?.price)}
										>{i18Translate('i18MyAccount.Get Now', 'Get Now')}</Button>
									</CouponListItem>

								</Col>
							))
						}

					</Row>

					{
						couponData?.list?.length === 0 && (
							<div className='mb50'>
								<SearchNoData type={2} />
							</div>
						)
					}
				</div>
			</Spin>

			<div className='mt20 custom-antd pub-center'>
				<Button
					type="primary" ghost='true'
					className='mr30 ps-add-cart-footer-btn'
					onClick={() => handleCancel()}
					style={{ width: '150px' }}
				>{i18Translate('i18MyAccount.Not use coupon', 'Not use Voucher')}</Button>
				<Button
					type="primary" ghost='true'
					className='ps-add-cart-footer-btn custom-antd-primary'
					onClick={(e) => hideVoucherModal()}
					style={{ width: '150px' }}
				>{i18Translate('i18FunBtnText.Cancel', 'Cancel')}</Button>
			</div>
		</Modal>
	)
}


export default connect((state) => state)(VoucherModal);