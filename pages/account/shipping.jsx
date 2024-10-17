import React, { useContext, useEffect } from 'react';
import { connect } from 'react-redux';
import useEcomerce from '~/hooks/useEcomerce';
import { withCookies } from 'react-cookie';
import Shipping from '~/components/partials/account/Shipping';
import ShopCartContext from '~/utilities/shopCartContext';
import { changeServerSideLanguage } from '~/utilities/easy-helpers';

const ShippingPage = ({ auth, ecomerce, refInstance }) => {
	// console.log(rest, 'rest----del')
	const { cartList, setCartList } = useEcomerce();
	const { voucheour, shippingPrice, updateShippingPrice, shippingInfo, address } = useContext(ShopCartContext);
	const { token } = auth;

	useEffect(() => {
		if (ecomerce.cartItems) {
			setCartList(ecomerce.cartItems, 'cart');
		}
	}, []);

	return (
		<div className="ps-checkout pub-font13 pub-color18">
			<div>
				{/* <div className="ps-section__header" style={{ textAlign: 'left', paddingBottom: '50px' }}>
                    <h1>Checkout Information</h1>
                </div> */}
				<div className="ps-section__content">
					<div className="ps-form--checkout">
						<div className="ps-form__content">
							<div className="">
								<div>
									<Shipping
										ref={refInstance}
										products={cartList}
										shippingInfo={shippingInfo}
										shippingPrice={shippingPrice}
										editAddress={address}
										updateShippingPrice={updateShippingPrice}
										token={token}
										voucheour={voucheour}
									/>
								</div>
								{/* <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12  ps-block--checkout-order">
                                    <div className="ps-form__orders" style={{marginTop: '20px'}}>
                                        <h4>Order Summary （{allCartItems.length} items）</h4>
                                        <ModulePaymentOrderSummary
                                            type="shipping"
                                            products={allCartItems}
                                            shippingPrice={shippingPrice}
                                            voucheour={voucheour}
                                        />
                                    </div>
                                </div> */}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const ShippingPageCom = connect((state) => state)(withCookies(ShippingPage))

export default React.forwardRef((props, ref) => <ShippingPageCom {...props} refInstance={ref} />);

export async function getServerSideProps({ req }) {
	const translations = await changeServerSideLanguage(req)

	return {
		props: {
			...translations,
			a: 1111,
		}
	}
}
