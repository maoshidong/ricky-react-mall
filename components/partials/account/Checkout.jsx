import React, { useContext } from 'react';
import { connect } from 'react-redux';
import FormCheckoutInformation from './modules/FormCheckoutInformation';
import ShopCartContext from '~/utilities/shopCartContext';
// import AdvancePdfFontCom from '~/components/PDF/AdvancePdfFont'
import { DownloadPDFPreLoad} from '~/components/PDF/PreloadPdf'; // 预加载pdf字体

const Checkout = ({ auth, cartList, voucheourList, refInstance }) => {
	const { voucheour, shippingInfo = {}, billingInfo = {} } = useContext(ShopCartContext);

	return (
		<div className="ps-checkout ps-section--shopping">
			<div className="">
				<div className="ps-section__content">
					<div className="ps-form--checkout">
						<div className="ps-form__content">
							<div className="">
								<FormCheckoutInformation
									ref={refInstance}
									address={shippingInfo}
									billingAddress={billingInfo}
									products={cartList}
									auth={auth}
									voucheourList={voucheourList}
									voucheour={voucheour}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<DownloadPDFPreLoad />
		</div>
	);
};

const CheckoutCom = connect((state) => state)(Checkout)

export default React.forwardRef((props, ref) => <CheckoutCom {...props} refInstance={ref} />);
