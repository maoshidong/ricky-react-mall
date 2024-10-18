import React from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
// import LanguageSwitch from '~/components/shared/headers/modules/LanguageSwitch';
import MiniCart from '~/components/shared/headers/modules/MiniCart';
import AccountQuickLinks from '~/components/shared/headers/modules/AccountQuickLinks';
// const MemoMiniCart = React.memo(MiniCart);
import UnpaidOrderBtn from '~/components/ecomerce/orderCom/UnpaidOrderBtn';
// import Currency from '~/components/shared/headers/modules/Currency';
import useLanguage from '~/hooks/useLanguage';

const HeaderActions = ({ auth }) => {
	const { temporaryClosureZh } = useLanguage();
	const Router = useRouter();
	const { route } = Router;
	const MemoMiniCart = React.memo(MiniCart);

	return (
		<div className="header__actions">
			{/* <LanguageSwitch /> */}
			{/* 未支付订单 */}
			{/* <Currency/> */}
			{route !== '/account/shopping-cart' && (
				<div className="mr20 ml2">
					<UnpaidOrderBtn isShowUnpaid={true} />
				</div>
			)}
			{
				!temporaryClosureZh() && <MemoMiniCart />
			}
			
			<AccountQuickLinks profileInfo={auth.profileInfo ?? {}} isLoggedIn={auth.isLoggedIn && Boolean(auth.isLoggedIn) === true} />
		</div>
	);
};

export default connect((state) => state)(HeaderActions);
