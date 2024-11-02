import React, { useState } from 'react';
import { Button, Space } from 'antd';
import { useRouter } from 'next/router'
import ExternalShare from '~/components/shared/public/ExternalShare'; // 对外分享
import CustomInput from '~/components/common/input';
import useLanguage from '~/hooks/useLanguage'
import { copy } from '~/utilities/common-helpers';
import { CommonRepository } from '~/repositories';

const ShortShareCom = () => {
	const { i18Translate, getLanguageHost } = useLanguage();
	const Router = useRouter();
	const [isShowShare, setIsShowShare] = useState(false)
	const [defaultValue, setDefaultValue] = useState(getLanguageHost() + Router.asPath)
	const [successCopy, setSuccessCopy] = useState(false) // 成功复制

	const iShare = i18Translate('i18AboutProduct.Share', 'Share')
	// const iShareThis = i18Translate('i18AboutProduct.Share This', 'Share This')
	// const iSharThisOn = i18Translate('i18AboutProduct.Share this on', 'Share this on:')
	const iCopy = i18Translate('i18SmallText.Copy', 'Copy')

	const handleClick = async () => {
		const res = await CommonRepository.apiGetShareUrlLink({
			realUrl: getLanguageHost() + Router.asPath
		})
		if (res?.code === 0) {
			setDefaultValue(`${getLanguageHost()}/short/${res?.data}`)
		}
		setIsShowShare(true)
	}
	const handleCopy = () => {
		//后端返回分享链接参数
		copy(defaultValue);
		setSuccessCopy(true)
	}

	return <div
		className='pub-flex-align-center custom-antd-btn-more'
		style={{ position: 'relative' }}
	>
		<div onClick={handleClick} className='pub-cursor-pointer'>
			<i className="fa fa-share-alt pub-color-link"></i>
			<span className='ml10 pub-font14 pub-color-hover-link'>{iShare}</span>
		</div>
		{/* 分享  */}
		{
			isShowShare && (
				<>
					<div className='pub-modal-box-bgc pub-show-modal-box-bgc'></div>
					<div className="share-content" id="pub-modal-box" style={{ top: "35px", right: '0' }}>
						<div className="pub-modal-content">
							<div className='pub-modal-arrow'></div>
							<div className='pub-modal-title' style={{ justifyContent: 'space-between', paddingRight: '30px' }}>
								<div className='pub-flex-align-center'>
									<div className='mr10 sprite-icon4-cart sprite-icon4-cart-3-10'></div>
									{iShare}</div>
								<i className="icon icon-cross2 pub-cursor-pointer" onClick={() => { setIsShowShare(false), setSuccessCopy(false) }}></i>
							</div>
							<div className='share-text'>
								{/* <div className='pub-font13 pub-color555 mb5'>{iSharThisOn}</div> */}
								<div className='mb20 pub-flex-align-center'>
									<ExternalShare />

								</div>
								<Space.Compact
									style={{ minWidth: '330px' }}
								>
									<CustomInput defaultValue={defaultValue} height="32px" style={{ height: '32px' }} />
									<Button
										type="primary" ghost
										className='ps-add-cart-footer-btn custom-antd-primary'
										onClick={handleCopy}
									>{iCopy}</Button>

								</Space.Compact>
								{
									successCopy && <span className='pub-flex-align-center pub-success mt10'>{i18Translate('i18SmallText.Success Copy', 'Success Copy.')}</span>
								}
							</div>
						</div>
					</div>

				</>
			)
		}
	</div>
}

export default ShortShareCom