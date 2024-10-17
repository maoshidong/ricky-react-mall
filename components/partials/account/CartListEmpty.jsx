import Link from 'next/link';
import { getProductUrl } from '~/utilities/common-helpers';
import useLanguage from '~/hooks/useLanguage';

const CartListEmpty = ({ text }) => {
	const { i18Translate } = useLanguage();
	return (
		<div className="cart-list-empty pub-border20 box-shadow">
			<div className="cart-empty-svg"></div>
			<div className="cart-list-empty-sorry">{text || i18Translate('i18Head.CartEmpty', 'Your shopping cart is empty')}</div>

			<div className="cart-list-empty-tip custom-antd-btn-more mt15">
				<Link href={getProductUrl()}>
					<a>
						<button type="submit" ghost="true" className="login-page-login-btn custom-antd-primary w180">
							{i18Translate('i18MyCart.VisitProductIndex', 'Visit Product Index')}
						</button>
					</a>
				</Link>
			</div>
		</div>
	);
};

export default CartListEmpty