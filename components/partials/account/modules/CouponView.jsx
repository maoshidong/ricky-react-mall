import React, { useState, useEffect } from 'react';
import { Row, Col, Spin, Button } from 'antd';
import Link from 'next/link';
// import Router from 'next/router';
import { connect } from 'react-redux';
// import { Pagination } from 'antd';
import AccountRepository from '~/repositories/zqx/AccountRepository';
import { getProductUrl } from '~/utilities/common-helpers';
import SearchNoData from '~/components/ecomerce/minCom/SearchNoData';
import CouponListItem from '~/components/ecomerce/cartCom/CouponListItem';
import useLanguage from '~/hooks/useLanguage';

const CouponView = ({ currentKey, reload }) => {
	const { i18Translate } = useLanguage();

	const [isLoading, setIsLoading] = useState(false) // 
	const [couponData, setCouponData] = useState({})
	const [init, setInit] = useState(false)

	let params = {
		type: 1,
		pageNum: 1,
		pageSize: 99,
	}

	const getCoupon = async (p) => {
		Object.keys(params).forEach((key) => {
			if (p[key]) {
				params[key] = p[key]
			}
		})
		setIsLoading(true)
		///type 1:有效 2：已使用 3：过期   （pageSize，pageNum-从1开始）
		const responseData = await AccountRepository.getCoupon(params);
		setIsLoading(false)
		if (responseData && responseData.code === 0) {
			setCouponData(responseData.data);
			setInit(true)
		}
	}


	useEffect(() => {
		setTimeout(async () => {
			getCoupon({ type: currentKey });
		}, 50)
	}, [currentKey, reload])

	return (
		<div className='pl-20 pr-20'>
			<div className='mt5 ps-my-account-copon custom-antd-btn-more'>
				<Spin spinning={isLoading} size='large'>
					<div style={{ minHeight: '150px' }}>
						<Row gutter={20}>
							{
								// couponData && couponData.list && couponData.list.length ?
								couponData?.list?.map((item, index) => (
									<Col xs={24} sm={24} md={24} xl={8} lg={8} key={index}>
										<div className=' box-shadow'>
											<CouponListItem couponItem={item} type={currentKey}>
												<Link href={getProductUrl()}>
													<a>
														<Button
															type="primary" ghost
															className='mt15 custom-antd-primary w100'
														// onClick={() => handleChange(item?.id + '-' + item?.price)}
														>{i18Translate('i18MyAccount.Get Now', 'Get Now')}</Button>
													</a>
												</Link>
											</CouponListItem>
										</div>
										{/* <div className='pub-coupon-item pub-flex-align-center'>
                                            <div className=''>
                                                <div className='pub-color-link pub-lh28 pub-font30 pub-fontw'>${item.price} OFF</div>
                                                <div className='pub-color-link pub-font30 pub-fontw'>For orders over ${item.price}</div>
                                                <div className='pub-flex-align-center pub-before-point pub--before-point-mt5'>
                                                    <div className='pub-color555 pub-font13'>Applies to All Products</div>
                                                </div>
                                                <div className='pub-flex-align-center pub-before-point pub--before-point-mt5'>
                                                    <div className='pub-color555 pub-font13'>Registration Benefits</div>
                                                </div>
                                            </div>
                                            <div className='pub-coupon-right pub-color555'>
                                                <div className="pub-coupon-line"></div>
                                                <div>
                                                    <div>Validity period:</div>
                                                    <div className='pub-center'>
                                                        <span className='pub-fontw'>{getValidityDay((item?.expire_date * 1000))}</span>
                                                        <span className='ml5'>days</span>
                                                    </div>
                                                    <Link href={getProductUrl()}>
                                                        <a>
                                                            <Button
                                                                type="primary" ghost
                                                                className='mt15 custom-antd-primary w100'
                                                            >Get Now</Button>
                                                        </a>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div> */}

									</Col>
								))
								// : 
								// <div className='mb50'>
								//     <SearchNoData type={2} />
								// </div>
								// (currentKey === '1' ? 'No coupons available at the moment' :
								//         (currentKey === '2' ?
								//             <Empty description="No used coupons" /> :
								//             <Empty description="No expired coupon" />
								//         )
								//     )
							}
						</Row>
						{
							((couponData?.list?.length === 0 || !init) && !isLoading) && (
								<div className='mb50'>
									<SearchNoData type={2} />
								</div>
							)
						}
					</div>
				</Spin>
				{/* {
                    couponData && couponData.list && couponData.list.length ?

                        couponData.list.map((item) => {
                            const date1 = new Date(parseInt(item.receive_date) * 1000);
                            const date2 = new Date(parseInt(item.expire_date) * 1000);
                            return (
                                <div key={item.id} className={item.status === 1 ? 'ps-my-account-copon-item unUse' : 'ps-my-account-copon-item Used'}>
                                    <div className='ps-my-account-copon-item-top '>
                                        <p>${item.price}</p>
                                    </div>
                                    <div className='ps-my-account-copon-item-content'>
                                        <h3>{item.name}</h3>
                                        <p className='p1'>Derind of validity</p>
                                        <p className='pTime'>{dateTime(date1)} - {dateTime(date2)}</p>
                                    </div>
                                </div>
                            )
                        }) : (currentKey === '1' ? 'No coupons available at the moment' :
                            (currentKey === '2' ?
                                <Empty description="No used coupons" /> :
                                <Empty description="No expired coupon" />
                            )
                        )
                } */}

			</div>
			{/* <div className='ps-my-account-copon-Pagi' style={{ marginTop: '20px' }}>
                <Pagination current={currentPage} pageSize={9} total={couponData.count} onChange={onChange} showSizeChange={false} />
            </div> */}
		</div>
	)

};

export default connect((state) => state)(CouponView);
