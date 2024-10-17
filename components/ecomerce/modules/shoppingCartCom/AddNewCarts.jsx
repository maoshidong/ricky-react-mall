import { useState } from 'react';
import { useCookies } from 'react-cookie';
import Link from 'next/link';
import MinModalTip from '~/components/ecomerce/minCom/MinModalTip'; // 提示框
import useLanguage from '~/hooks/useLanguage';
import useEcomerce from '~/hooks/useEcomerce';
import { LOGIN } from '~/utilities/sites-url';
import { Flex } from '~/components/common';

const ShareCartCom = () => {
	const { i18Translate } = useLanguage();
	const { addToLoadCarts } = useEcomerce();
	const [isShowTipModal, setIsShowTipModal] = useState(false); // 提示modal 新建购物车

	const [cookies, setCookie] = useCookies(['account', 'cart', 'cur_cart_data']);

	// 确认新建购物车
	const saveCreateNewCart = () => {
		setIsShowTipModal(false);
		setCookie('cur_cart_data', {}, { path: '/' });
		addToLoadCarts('', -1);
	};

	return (
		<Flex alignCenter>
			<div className="ps-common-btn-padding pub-color-hover-link" onClick={() => setIsShowTipModal(true)}>
				<div className="sprite-icon4-cart sprite-icon4-cart-3-2" style={{ marginBottom: '3px' }} />
				<div className="ml10">{i18Translate('i18MyCart.Save New Carts', 'New Carts')}</div>
			</div>
			{/* 新建购物车提示 */}
			{isShowTipModal && (
				<MinModalTip
					isShowTipModal={isShowTipModal}
					width={430}
					tipTitle={i18Translate('i18MyCart.Create New Cart', 'Create New Cart')}
					isChildrenTip={true}
					onCancel={() => setIsShowTipModal(false)}
					handleOk={() => saveCreateNewCart()}
				>
					<div>
						{i18Translate('i18MyCart.NewCartTip1', 'Are you sure you want to create a new cart? All items currently in your cart will be deleted. By')}
						<Link href={LOGIN}>
							<a className="pub-color-link"> {i18Translate('i18MenuText.Login', 'Log in')} </a>
						</Link>
						{i18Translate('i18MyCart.NewCartTip1', 'you can save your cart to your account.')}
					</div>
				</MinModalTip>
			)}
		</Flex>
	);
};

export default ShareCartCom