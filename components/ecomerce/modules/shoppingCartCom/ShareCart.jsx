import { useState } from 'react';
import { Button } from 'antd'; //, Input
import { CustomInput } from '~/components/common';
import { useCookies } from 'react-cookie';
import useLanguage from '~/hooks/useLanguage';
import CartRepository from '~/repositories/zqx/CartRepository';
import { copy } from '~/utilities/common-helpers';

const ShareCartCom = () => {
	const { i18Translate, getDomainsData } = useLanguage();
	const [isShowShare, setIsShowShare] = useState(false); // 弹出分享
	const [shareCartLink, setShareCartLink] = useState(''); // 购物车分享链接
	const [successCopy, setSuccessCopy] = useState(false); // 成功复制

	const [cookies, setCookie] = useCookies(['account', 'cart', 'cur_cart_data']);

	const handleClick = async () => {
		const { token } = cookies?.account;
		const res = await CartRepository.shareCartsUrl(token, {
			cartNo: cookies?.cur_cart_data?.id, languageType: getDomainsData()?.defaultLocale,
		});
		setShareCartLink(res?.data);
		setIsShowShare(true);
	};
	const handleCopy = () => {
		//后端返回分享链接参数
		const flag = copy(shareCartLink);
		// setIsShowShare(false)
		setSuccessCopy(true);
	};

	const iShareCartTip = i18Translate(
		'i18MyCart.ShareCartTip',
		'This link will create a new cart containing the same products, quantities and customer references for anyone who opens it. No other attributes of this cart will be shared. Copy the link and paste it anywhere you would like it shared.'
	);
	return (
		<div className="ps-common-btn-padding pub-relative">
			<div className="pub-flex-align-center pub-color-hover-link" onClick={() => handleClick()}>
				<div className="sprite-icon4-cart sprite-icon4-cart-3-10" />
				<div className="ml10">{i18Translate('i18AboutProduct.Share', 'Share')}</div>
			</div>
			{/* 分享-s  */}
			{isShowShare && (
				<>
					<div className="pub-modal-box-bgc pub-show-modal-box-bgc"></div>
					<div className="share-content" id="pub-modal-box">
						<div className="pub-modal-content">
							<div className="pub-modal-arrow"></div>

							<div className="pub-modal-title" style={{ justifyContent: 'space-between', paddingRight: '30px' }}>
								<div className="pub-flex-align-center pub-fontw">{i18Translate('i18MyCart.SHARE YOUR CART', 'SHARE YOUR CART')}</div>
								<i className="icon icon-cross2" onClick={() => setIsShowShare(false)}></i>
							</div>
							<div className="share-text">
								<div className="mb15 pub-color555">{iShareCartTip}</div>
								<CustomInput defaultValue={shareCartLink} className="share-input" style={{ width: '560px' }} />

								<div className="ps-add-cart-footer">
									<Button type="primary" ghost="true" className="login-page-login-btn ps-add-cart-footer-btn w120" onClick={() => setIsShowShare(false)}>
										{i18Translate('i18FunBtnText.Cancel', 'Cancel')}
									</Button>
									<button type="submit" ghost="true" className="login-page-login-btn ps-add-cart-footer-btn custom-antd-primary w120" onClick={handleCopy}>
										{i18Translate('i18MyCart.Share Cart', 'Share Cart')}
									</button>
									{successCopy && <span className="pub-flex-align-center pub-success">{i18Translate('i18SmallText.Success Copy', 'Success Copy.')}</span>}
								</div>
							</div>
						</div>
					</div>
				</>
			)}
			{/* 分享-e */}
		</div>
	);
};

export default ShareCartCom